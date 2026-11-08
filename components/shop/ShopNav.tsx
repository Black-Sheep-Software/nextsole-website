"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
export default function ShopNav() {
  const { items, openBag } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#14120f]/95 backdrop-blur-xl">
      <div className="border-b border-white/5 py-2 text-center text-[10px] font-medium uppercase tracking-[.2em] text-[#bbb5ac]">
        Individual pairs. Actual photos. UK delivery.
      </div>
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-5 px-5 md:px-10">
        <Link
          href="/shop"
          aria-label="Nextsole shop home"
          className="flex items-center gap-3"
        >
          <Image
            src="/nextsole-logo.png"
            alt="Nextsole"
            width={120}
            height={34}
            className="h-7 w-auto"
            priority
          />
          <span className="hidden border-l border-white/20 pl-3 text-[10px] uppercase tracking-[.24em] text-[#aaa49a] sm:block">
            The shop
          </span>
        </Link>
        <nav
          aria-label="Shop"
          className="hidden items-center gap-7 text-sm font-medium text-[#cfc9bd] md:flex"
        >
          <Link href="/shop" className="hover:text-lime-400">
            All pairs
          </Link>
          <Link href="/shop?condition=new" className="hover:text-lime-400">
            New
          </Link>
          <Link href="/shop?preowned=true" className="hover:text-lime-400">
            Pre-owned
          </Link>
          <Link href="/shop#buying-guide" className="hover:text-lime-400">
            Buying guide
          </Link>
        </nav>
        <div className="flex items-center gap-6">
          <Link
            href="/sneakers"
            className="hidden text-xs text-[#aaa49a] hover:text-white lg:block"
          >
            Explore Nextsole ↗
          </Link>
          <button
            onClick={openBag}
            aria-label={`Open shopping bag, ${items.length} items`}
            className="flex min-h-11 items-center gap-2 text-sm font-semibold"
          >
            <svg
              width="19"
              height="21"
              viewBox="0 0 24 26"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h18l1 16H2L3 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 9V6a4 4 0 0 1 8 0v3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span>Bag</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-lime-400 px-1 text-xs text-black">
              {items.length}
            </span>
          </button>
        </div>
      </div>
      <nav
        aria-label="Shop categories"
        className="flex gap-6 overflow-x-auto border-t border-white/5 px-5 py-3 text-xs text-[#cfc9bd] md:hidden"
      >
        <Link href="/shop" className="shrink-0">
          All pairs
        </Link>
        <Link href="/shop?condition=new" className="shrink-0">
          New
        </Link>
        <Link href="/shop?preowned=true" className="shrink-0">
          Pre-owned
        </Link>
        <Link href="/shop#buying-guide" className="shrink-0">
          Buying guide
        </Link>
      </nav>
    </header>
  );
}
