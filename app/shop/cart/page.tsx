"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/lib/cart/CartContext";

function formatPrice(price: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "";
  return `${symbol}${price}`;
}

export default function ShopCartPage() {
  const { items, removeItem, removeItems, subtotal } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setError(null);
    setCheckingOut(true);
    const res = await fetch("/api/shop/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingIds: items.map((i) => i.listingId) }),
    });
    const json = await res.json().catch(() => ({}));
    setCheckingOut(false);

    if (res.status === 409 && Array.isArray(json.unavailable)) {
      removeItems(json.unavailable);
      setError("Sorry — one or more items just sold out and were removed from your cart. Please check and try again.");
      return;
    }
    if (!res.ok || !json.url) {
      setError("Something went wrong — please try again.");
      return;
    }
    window.location.href = json.url;
  }

  return (
    <div className="min-h-screen bg-[#14120F] text-[#F2EDE4]">
      <SiteNav />
      <main className="mx-auto max-w-[800px] px-4 pb-24 pt-32 sm:px-6 xl:px-12">
        <h1 className="text-3xl font-black">Your cart</h1>

        {items.length === 0 ? (
          <p className="mt-8 text-[#6b665f]">
            Your cart is empty. <Link href="/shop" className="text-lime-400 hover:underline">Browse the shop →</Link>
          </p>
        ) : (
          <>
            <div className="mt-8 space-y-3">
              {items.map((item) => (
                <div key={item.listingId} className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#1B1815] p-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/40">
                    {item.image && <Image src={item.image} alt={item.title} fill unoptimized className="object-contain" sizes="64px" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-[#6b665f]">{item.sizeUk ? `UK ${item.sizeUk}` : null}</p>
                  </div>
                  <p className="text-sm font-bold text-lime-400">{formatPrice(item.price, item.currency)}</p>
                  <button onClick={() => removeItem(item.listingId)} className="text-xs text-[#6b665f] hover:text-red-400">Remove</button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-6">
              <span className="text-lg font-bold">Subtotal</span>
              <span className="text-lg font-bold text-lime-400">{formatPrice(subtotal, items[0]?.currency ?? "GBP")}</span>
            </div>

            {error && <p className="mt-4 rounded-xl border border-red-900 bg-red-950/50 px-4 py-2 text-sm text-red-400">{error}</p>}

            <button
              onClick={checkout}
              disabled={checkingOut}
              className="mt-6 w-full rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-lime-300 disabled:opacity-40"
            >
              {checkingOut ? "Redirecting to checkout…" : "Checkout"}
            </button>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
