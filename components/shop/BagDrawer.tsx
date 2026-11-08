"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart/CartContext";
import { shopMoney } from "@/lib/shopPresentation";
export default function BagDrawer() {
  const { items, subtotal, removeItem, bagOpen, closeBag } = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (bagOpen) dialog.current?.showModal();
    else dialog.current?.close();
    if (!bagOpen) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [bagOpen]);
  return (
    <dialog
      ref={dialog}
      onCancel={closeBag}
      onClose={closeBag}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBag();
      }}
      aria-labelledby="bag-heading"
      className="fixed inset-y-0 left-auto right-0 m-0 ml-auto h-dvh max-h-none w-full max-w-md border-l border-white/10 bg-[#1b1815] p-0 text-[#f2ede4] backdrop:bg-black/70"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 id="bag-heading" className="text-xl font-bold">
            Your bag{" "}
            <span className="ml-1 text-sm font-normal text-[#aaa49a]">
              ({items.length})
            </span>
          </h2>
          <button
            autoFocus
            onClick={closeBag}
            aria-label="Close bag"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {items.length ? (
            <div className="space-y-5">
              {items.map((i) => (
                <div
                  key={i.listingId}
                  className="flex gap-4 border-b border-white/10 pb-5"
                >
                  <Link
                    href={`/shop/${i.listingId}`}
                    onClick={closeBag}
                    className="relative h-24 w-24 shrink-0 rounded-xl bg-[#e9e6e0]"
                  >
                    {i.image && (
                      <Image
                        src={i.image}
                        alt={i.title}
                        fill
                        unoptimized
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/shop/${i.listingId}`}
                      onClick={closeBag}
                      className="text-sm font-semibold"
                    >
                      {i.title}
                    </Link>
                    <p className="mt-1 text-xs text-[#aaa49a]">
                      {i.sizeUk ? `UK ${i.sizeUk}` : "See pair sizing"} · One
                      pair
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold">
                        {shopMoney(i.price, i.currency)}
                      </span>
                      <button
                        onClick={() => removeItem(i.listingId)}
                        aria-label={`Remove ${i.title} from bag`}
                        className="min-h-10 text-xs text-[#aaa49a] underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="text-4xl" aria-hidden="true">
                ↗
              </span>
              <h3 className="text-xl font-bold">
                Your next pair is out there.
              </h3>
              <p className="max-w-60 text-sm leading-6 text-[#aaa49a]">
                Your bag is empty. Find a pair that deserves a place in your
                rotation.
              </p>
              <Link
                href="/shop"
                onClick={closeBag}
                className="mt-2 rounded-full bg-lime-400 px-6 py-3 text-sm font-bold text-black"
              >
                Explore the pairs
              </Link>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="space-y-4 border-t border-white/10 bg-[#14120f] p-6">
            <div className="flex justify-between font-bold">
              <span>Subtotal</span>
              <span>{shopMoney(subtotal)}</span>
            </div>
            <p className="text-xs leading-5 text-[#aaa49a]">
              Delivery is shown in your order summary. Pairs are reserved when
              checkout starts.
            </p>
            <Link
              href="/shop/cart"
              onClick={closeBag}
              className="flex items-center justify-between rounded-full bg-lime-400 px-6 py-4 text-sm font-bold text-black"
            >
              <span>View bag & checkout</span>
              <span aria-hidden="true">→</span>
            </Link>
            <button
              onClick={closeBag}
              className="w-full py-1 text-center text-xs text-[#aaa49a] underline underline-offset-4"
            >
              Continue exploring
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
