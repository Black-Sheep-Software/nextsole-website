"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import type { ShopListing } from "@/lib/shopTypes";

export default function AddToCartButton({ listing }: { listing: ShopListing }) {
  const { items, addItem } = useCart();
  const router = useRouter();
  const inCart = items.some((i) => i.listingId === listing.id);
  const available = listing.status === "available";

  function handleClick() {
    addItem({
      listingId: listing.id,
      title: listing.title,
      price: listing.price,
      currency: listing.currency,
      image: listing.images[0] ?? null,
      sizeUk: listing.size_uk,
    });
    router.push("/shop/cart");
  }

  if (!available) {
    return (
      <button disabled className="w-full rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold text-[#6b665f]">
        {listing.status === "sold" ? "Sold" : "Reserved"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-lime-300"
    >
      {inCart ? "In your cart — view cart" : "Add to cart"}
    </button>
  );
}
