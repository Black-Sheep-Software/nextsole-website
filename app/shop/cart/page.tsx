"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ShopNav from "@/components/shop/ShopNav";
import { shopMoney } from "@/lib/shopPresentation";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/lib/cart/CartContext";

export default function ShopCartPage() {
  const { items, removeItem, subtotal } = useCart();
  const [config, setConfig] = useState<{
    checkoutEnabled: boolean;
    shippingPence: number | null;
    termsUrl?: string | null;
  } | null>(null);
  useEffect(() => {
    fetch("/api/shop/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ checkoutEnabled: false, shippingPence: null }));
  }, []);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setError(null);
    setCheckingOut(true);
    try {
      const signature = items
        .map((i) => i.listingId)
        .sort()
        .join(",");
      const prior = JSON.parse(
        sessionStorage.getItem("nextsole_checkout_attempt") ?? "null",
      );
      const attemptId =
        prior?.signature === signature ? prior.id : crypto.randomUUID();
      sessionStorage.setItem(
        "nextsole_checkout_attempt",
        JSON.stringify({ id: attemptId, signature }),
      );
      const start = () =>
        fetch("/api/shop/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingIds: items.map((i) => i.listingId),
            attemptId,
          }),
        });
      let res = await start();
      let json = await res.json().catch(() => ({}));
      if (json.prepared) {
        res = await start();
        json = await res.json().catch(() => ({}));
      }
      if (!res.ok || !json.url) {
        if (json.expired || json.unavailable)
          sessionStorage.removeItem("nextsole_checkout_attempt");
        setError(json.error ?? "Checkout is unavailable. Please try again.");
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Could not connect to checkout. Please retry shortly.");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#14120f] text-[#f2ede4]">
      <ShopNav />
      <main className="mx-auto max-w-[1200px] px-5 pb-24 pt-10 md:px-10 md:pt-14">
        <Link href="/shop" className="text-xs text-[#aaa49a] hover:text-white">
          ← Continue exploring
        </Link>
        <div className="mb-9 mt-6 flex items-end gap-3">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Your bag.
          </h1>
          <span className="pb-1 text-sm text-[#aaa49a]">
            {items.length} {items.length === 1 ? "pair" : "pairs"}
          </span>
        </div>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
            <p className="text-4xl text-lime-400" aria-hidden="true">
              ↗
            </p>
            <h2 className="mt-4 text-2xl font-bold">
              Make room for your next favourite.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#aaa49a]">
              Your bag is empty. Explore new finds and pre-owned pairs for your
              rotation.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-block rounded-full bg-lime-400 px-7 py-4 text-sm font-bold text-black"
            >
              Explore the selection →
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
            <div>
              <div className="hidden justify-between border-b border-white/10 pb-3 text-[10px] uppercase tracking-[.18em] text-[#aaa49a] sm:flex">
                <span>Your selection</span>
                <span>Price</span>
              </div>
              {items.map((item) => (
                <article
                  key={item.listingId}
                  className="flex gap-4 border-b border-white/10 py-6 sm:gap-6"
                >
                  <Link
                    href={`/shop/${item.listingId}`}
                    className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#e9e6e0] sm:h-36 sm:w-32"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-contain p-2"
                        sizes="128px"
                      />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <Link
                        href={`/shop/${item.listingId}`}
                        className="max-w-xs text-sm font-semibold leading-6 hover:text-lime-400"
                      >
                        {item.title}
                      </Link>
                      <p className="shrink-0 text-sm font-bold">
                        {shopMoney(item.price, item.currency)}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-[#aaa49a]">
                      {item.sizeUk ? `UK ${item.sizeUk}` : "See product sizing"}{" "}
                      · One individual pair
                    </p>
                    <button
                      onClick={() => removeItem(item.listingId)}
                      aria-label={`Remove ${item.title} from bag`}
                      className="mt-auto min-h-10 self-start pt-3 text-xs text-[#aaa49a] underline underline-offset-4 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
              <p className="mt-5 text-xs leading-6 text-[#aaa49a]">
                Each listing is one pair. Items in your bag remain available to
                other shoppers until checkout starts.
              </p>
            </div>
            <aside className="rounded-2xl border border-white/10 bg-[#1b1815] p-6 lg:sticky lg:top-36">
              <h2 className="text-lg font-bold">Order summary</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#aaa49a]">Items ({items.length})</dt>
                  <dd>{shopMoney(subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#aaa49a]">UK tracked delivery</dt>
                  <dd className="text-right">
                    {config?.shippingPence == null
                      ? "Confirmed before checkout"
                      : config.shippingPence === 0
                        ? "Complimentary"
                        : shopMoney(config.shippingPence / 100)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-5 text-lg font-bold">
                  <dt>
                    {config?.shippingPence == null ? "Subtotal" : "Total"}
                  </dt>
                  <dd>
                    {shopMoney(subtotal + (config?.shippingPence ?? 0) / 100)}
                  </dd>
                </div>
              </dl>
              {!config?.checkoutEnabled && (
                <p className="mt-5 rounded-lg border border-lime-400/20 bg-lime-400/5 p-3 text-xs leading-6 text-[#cfc9bd]">
                  The shop is being prepared. Checkout is not open yet. You can
                  keep exploring and save pairs in your bag.
                </p>
              )}
              {error && (
                <p role="alert" className="mt-4 text-sm text-red-300">
                  {error}
                </p>
              )}
              <button
                onClick={checkout}
                disabled={
                  checkingOut || !config?.checkoutEnabled || items.length > 10
                }
                className="mt-5 flex min-h-14 w-full items-center justify-between rounded-full bg-lime-400 px-6 py-4 text-sm font-bold text-black hover:bg-lime-300 disabled:opacity-40"
              >
                <span>
                  {checkingOut
                    ? "Opening checkout…"
                    : items.length > 10
                      ? "Maximum 10 pairs per order"
                      : "Continue to checkout"}
                </span>
                <span aria-hidden="true">→</span>
              </button>
              <p className="mt-3 text-center text-[10px] text-[#aaa49a]">
                Guest checkout · Payments handled by Stripe
              </p>
              {config?.termsUrl && (
                <a
                  href={config.termsUrl}
                  className="mt-6 block border-t border-white/10 pt-4 text-xs text-[#aaa49a] underline underline-offset-4"
                >
                  Delivery & return terms
                </a>
              )}
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
