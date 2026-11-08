import Image from "next/image";
import Link from "next/link";
import type { ShopListing } from "@/lib/shopTypes";
import { conditionLabel, shopMoney } from "@/lib/shopPresentation";
export default function ProductCard({ item }: { item: ShopListing }) {
  const size = item.size_uk
    ? `UK ${item.size_uk}`
    : item.size_us
      ? `US ${item.size_us}`
      : item.size_eu
        ? `EU ${item.size_eu}`
        : "See sizing";
  return (
    <Link
      href={`/shop/${item.id}`}
      className="group block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-400"
    >
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-2xl bg-[#e9e6e0]">
        {item.images[0] ? (
          <>
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              unoptimized
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
              className="object-contain p-4 transition-transform duration-500 motion-safe:group-hover:scale-105"
            />
            {item.images[1] && (
              <Image
                src={item.images[1]}
                alt=""
                fill
                unoptimized
                sizes="(max-width:640px) 50vw,25vw"
                className="object-contain p-4 opacity-0 transition-opacity duration-300 motion-safe:group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-neutral-600">
            Pair photos coming soon
          </span>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider ${item.status === "available" ? "bg-white/90 text-black" : "bg-[#14120f] text-white"}`}
        >
          {item.status === "available"
            ? item.condition === "new"
              ? "New pair"
              : "Pre-owned"
            : item.status === "sold"
              ? "Sold"
              : "Reserved"}
        </span>
        <span
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-colors group-hover:bg-lime-400"
          aria-hidden="true"
        >
          ↗
        </span>
      </div>
      <div className="space-y-1.5 px-0.5 pb-2 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[.17em] text-[#aaa49a]">
          {item.brand ?? "Nextsole selection"}
        </p>
        <h2 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#f2ede4] group-hover:text-lime-400">
          {item.title}
        </h2>
        <p className="text-xs text-[#aaa49a]">
          {size} <span className="px-1 text-[#514b43]">/</span>{" "}
          {conditionLabel(item.condition).replace("Pre-owned · ", "")}
        </p>
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-base font-bold">
            {shopMoney(item.price, item.currency)}
          </span>
          <span className="text-[10px] text-[#aaa49a]">One pair</span>
        </div>
      </div>
    </Link>
  );
}
