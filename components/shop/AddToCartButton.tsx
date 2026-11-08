"use client";
import { useCart } from "@/lib/cart/CartContext";
import type { ShopListing } from "@/lib/shopTypes";
export default function AddToCartButton({ listing }: { listing: ShopListing }) {
  const { items, addItem, openBag } = useCart();
  const inCart = items.some((i) => i.listingId === listing.id);
  const available = listing.status === "available" && listing.images.length > 0;
  function add() {
    if (inCart) {
      openBag();
      return;
    }
    addItem({
      listingId: listing.id,
      title: listing.title,
      price: listing.price,
      currency: listing.currency,
      image: listing.images[0] ?? null,
      sizeUk: listing.size_uk,
    });
  }
  return (
    <button
      onClick={add}
      disabled={!available}
      className="flex min-h-14 w-full items-center justify-between rounded-full bg-lime-400 px-6 py-4 text-sm font-bold text-black transition-colors hover:bg-lime-300 disabled:bg-white/10 disabled:text-[#aaa49a]"
    >
      <span>
        {!available
          ? listing.status === "sold"
            ? "This pair has sold"
            : listing.status === "reserved"
              ? "Currently reserved"
              : "Pair photos coming soon"
          : inCart
            ? "In your bag — view bag"
            : "Add to bag"}
      </span>
      <span aria-hidden="true">{available ? "↗" : "—"}</span>
    </button>
  );
}
