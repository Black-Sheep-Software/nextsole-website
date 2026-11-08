import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { getShopListing } from "@/lib/shopApi";

export const revalidate = 60;

function formatPrice(price: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "";
  return `${symbol}${price}`;
}

type Props = { params: Promise<{ id: string }> };

export default async function ShopListingPage({ params }: Props) {
  const { id } = await params;
  const listing = await getShopListing(id);
  if (!listing) notFound();

  return (
    <div className="min-h-screen bg-[#14120F] text-[#F2EDE4]">
      <SiteNav />
      <main className="mx-auto max-w-[1100px] px-4 pb-24 pt-32 sm:px-6 xl:px-12">
        <Link href="/shop" className="text-sm text-[#6b665f] hover:text-white">← Shop</Link>
        <Link href="/shop/cart" className="float-right text-sm text-lime-400">View cart →</Link>

        <div className="mt-6 grid gap-10 sm:grid-cols-2">
          <div className="grid grid-cols-3 gap-2">
            {listing.images.length > 0 ? (
              listing.images.map((url, i) => (
                <div key={url} className={`relative overflow-hidden rounded-xl bg-black/40 ${i === 0 ? "col-span-3 aspect-square" : "aspect-square"}`}>
                  <Image src={url} alt={listing.title} fill unoptimized className="object-contain" sizes="(max-width: 640px) 100vw, 50vw" />
                </div>
              ))
            ) : (
              <div className="col-span-3 flex aspect-square items-center justify-center rounded-xl bg-black/40 text-[#6b665f]">No photo yet</div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">{listing.brand}</p>
            <h1 className="text-3xl font-black">{listing.title}</h1>
            <p className="text-2xl font-bold text-lime-400">{formatPrice(listing.price, listing.currency)}</p>

            <div className="space-y-1.5 text-sm text-[#cfc9bd]">
              <p><span className="text-[#6b665f]">Size: </span>UK {listing.size_uk ?? "—"}{listing.size_us ? ` · US ${listing.size_us}` : ""}</p>
              <p><span className="text-[#6b665f]">Condition: </span>{listing.condition.replace(/_/g, " ")}</p>
              {listing.condition_notes && <p><span className="text-[#6b665f]">Notes: </span>{listing.condition_notes}</p>}
              {listing.retail_price && <p><span className="text-[#6b665f]">Retail was: </span>{formatPrice(listing.retail_price, listing.retail_currency ?? "GBP")}</p>}
            </div>

            <div className="pt-4">
              <AddToCartButton listing={listing} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
