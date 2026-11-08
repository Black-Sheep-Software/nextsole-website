import Link from "next/link";
import { notFound } from "next/navigation";
import ShopNav from "@/components/shop/ShopNav";
import SiteFooter from "@/components/SiteFooter";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductCard from "@/components/shop/ProductCard";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { getShopListing, getShopConfig, listShop } from "@/lib/shopApi";
import { conditionLabel, shopMoney } from "@/lib/shopPresentation";
export const revalidate = 60;
export default async function ShopListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [listing, config] = await Promise.all([
    getShopListing(id),
    getShopConfig(),
  ]);
  if (!listing) notFound();
  const related = listing.brand
    ? (
        await listShop({ brand: listing.brand, includeSold: false, limit: 5 })
      ).items
        .filter((i) => i.id !== listing.id)
        .slice(0, 4)
    : [];
  const sizes = [
    ["UK", listing.size_uk],
    ["US", listing.size_us],
    ["EU", listing.size_eu],
  ].filter(([, value]) => value);
  return (
    <div className="min-h-screen bg-[#14120f] text-[#f2ede4]">
      <ShopNav />
      <main className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10 md:pb-16">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 py-6 text-[11px] text-[#aaa49a]"
        >
          <Link href="/shop" className="hover:text-white">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          {listing.brand && (
            <>
              <Link
                href={`/shop?brand=${encodeURIComponent(listing.brand)}`}
                className="hover:text-white"
              >
                {listing.brand}
              </Link>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span
            aria-current="page"
            className="max-w-64 truncate text-[#cfc9bd]"
          >
            {listing.title}
          </span>
        </nav>
        <div className="grid items-start gap-8 pb-16 md:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ProductGallery images={listing.images} title={listing.title} />
          <div className="space-y-6 md:sticky md:top-36">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-lime-400">
                  {listing.brand ?? "The Nextsole selection"}
                </p>
                <span className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] text-[#b9b2a8]">
                  {listing.status === "available"
                    ? "One individual pair"
                    : listing.status === "sold"
                      ? "Sold"
                      : "Currently reserved"}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
                {listing.title}
              </h1>
              {listing.colourway && (
                <p className="mt-2 text-sm text-[#aaa49a]">
                  {listing.colourway}
                </p>
              )}
              <p className="mt-5 text-3xl font-bold">
                {shopMoney(listing.price, listing.currency)}
              </p>
              {listing.retail_price && (
                <p className="mt-1 text-xs text-[#aaa49a]">
                  Original retail:{" "}
                  {shopMoney(
                    listing.retail_price,
                    listing.retail_currency ?? "GBP",
                  )}
                </p>
              )}
            </div>
            <div className="border-y border-white/10 py-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold">Size of this pair</h2>
                <a
                  href="#pair-details"
                  className="text-[11px] text-[#aaa49a] underline underline-offset-4"
                >
                  Check the details
                </a>
              </div>
              <div className="mt-3 flex gap-2">
                {sizes.length ? (
                  sizes.map(([label, value]) => (
                    <span
                      key={label}
                      className="min-w-20 rounded-lg border border-lime-400/50 bg-lime-400/5 px-4 py-3 text-center text-sm font-semibold"
                    >
                      <span className="mr-1 text-[10px] font-normal text-[#aaa49a]">
                        {label}
                      </span>
                      {value}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[#aaa49a]">
                    Sizing to be confirmed
                  </p>
                )}
              </div>
              <p className="mt-3 text-[11px] text-[#aaa49a]">
                This listing is for the size shown, rather than a choice of
                sizes.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#1b1815] p-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                <h2 className="text-sm font-semibold">
                  {conditionLabel(listing.condition)}
                </h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#aaa49a]">
                {listing.condition_notes ||
                  "Inspect the actual pair photos for the details of this listing."}
              </p>
            </div>
            <div>
              <AddToCartButton listing={listing} />
              {!config.checkoutEnabled && (
                <p className="mt-3 text-center text-[11px] text-[#aaa49a]">
                  Shop preview. Checkout is not open yet.
                </p>
              )}
              <p className="mt-3 text-center text-[11px] text-[#aaa49a]">
                Adding to your bag does not reserve this pair.
              </p>
            </div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              <details open className="py-4">
                <summary className="cursor-pointer text-xs font-semibold">
                  Delivery & returns
                </summary>
                <p className="mt-3 text-xs leading-6 text-[#aaa49a]">
                  {config.shippingPence === null
                    ? "UK delivery. Delivery charges will be confirmed before orders open."
                    : `UK tracked delivery: ${shopMoney(config.shippingPence / 100)}. Your final total is shown at checkout.`}
                </p>
                {config.termsUrl ? (
                  <a
                    href={config.termsUrl}
                    className="mt-2 inline-block text-xs text-lime-400 underline underline-offset-4"
                  >
                    Read delivery and return terms
                  </a>
                ) : (
                  <p className="mt-2 text-xs leading-6 text-[#aaa49a]">
                    Full delivery and return terms will be available before
                    checkout opens.
                  </p>
                )}
              </details>
              <details id="pair-details" className="scroll-mt-44 py-4">
                <summary className="cursor-pointer text-xs font-semibold">
                  Pair details
                </summary>
                <dl className="mt-4 grid grid-cols-2 gap-y-3 text-xs">
                  <dt className="text-[#aaa49a]">Style code</dt>
                  <dd>{listing.sku}</dd>
                  <dt className="text-[#aaa49a]">Condition</dt>
                  <dd>{conditionLabel(listing.condition)}</dd>
                  {listing.model && (
                    <>
                      <dt className="text-[#aaa49a]">Model</dt>
                      <dd>{listing.model}</dd>
                    </>
                  )}
                  <dt className="text-[#aaa49a]">Photos</dt>
                  <dd>Individual pair</dd>
                </dl>
              </details>
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <section className="border-t border-white/10 py-12">
            <div className="mb-7 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight">
                More from {listing.brand}
              </h2>
              <Link
                href={`/shop?brand=${encodeURIComponent(listing.brand!)}`}
                className="text-xs text-lime-400"
              >
                Explore brand →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-5 border-t border-white/15 bg-[#14120f]/95 px-5 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
          <div className="shrink-0">
            <p className="text-[9px] uppercase tracking-wider text-[#aaa49a]">
              This pair
            </p>
            <p className="mt-1 text-lg font-bold">
              {shopMoney(listing.price, listing.currency)}
            </p>
          </div>
          <div className="min-w-0 flex-1">
            <AddToCartButton listing={listing} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
