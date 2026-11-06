"use client";

import { useEffect } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/lib/cart/CartContext";

// Deliberately doesn't call back into the app to fetch order details —
// keeps this stateless like the rest of the site; the confirmation email
// (lib/shopEmails.ts, sent by the webhook) is the real receipt.
export default function ShopSuccessPage() {
  const { clear } = useCart();

  useEffect(() => { clear(); }, [clear]);

  return (
    <div className="min-h-screen bg-[#14120F] text-[#F2EDE4]">
      <SiteNav />
      <main className="mx-auto max-w-[600px] px-4 pb-24 pt-32 text-center sm:px-6 xl:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">Order confirmed</p>
        <h1 className="mt-3 text-3xl font-black">Thanks for your order</h1>
        <p className="mt-4 text-[#9a958c]">We've emailed you a confirmation. We'll email again once it's shipped with a tracking number.</p>
        <Link href="/shop" className="mt-8 inline-block rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-[#cfc9bd] hover:border-lime-400 hover:text-lime-400">
          Back to shop
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
