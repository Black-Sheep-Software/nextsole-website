import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { listShop } from "@/lib/shopApi";

// Listings sell out faster than catalogue data changes, so this stays much
// shorter than /sneakers' 1-hour window — see lib/shopApi.ts for why the
// fetch itself is still cache: "no-store" regardless (dual-cache bug).
export const revalidate = 60;

const PAGE_SIZE = 24;

function formatPrice(price: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "";
  return `${symbol}${price}`;
}

type Props = { searchParams: Promise<{ brand?: string; page?: string; condition?: string; sizeUk?: string; available?: string }> };

export default async function ShopIndexPage({ searchParams }: Props) {
  const { brand, page: pageParam, condition, sizeUk, available } = await searchParams;
  const page = Math.max(1, Math.min(1000, Math.floor(Number(pageParam) || 1)));
  const { items, total } = await listShop({ brand, condition, sizeUk, includeSold: available !== "true", limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (condition) params.set("condition", condition);
    if (sizeUk) params.set("sizeUk", sizeUk);
    if (available) params.set("available", available);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-[#14120F] text-[#F2EDE4]">
      <SiteNav />
      <main className="mx-auto max-w-[1344px] px-4 pb-24 pt-32 sm:px-6 xl:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">Nextsole Shop</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Real pairs, hand-checked.</h1>
        <p className="mt-4 max-w-lg text-[#9a958c]">
          {total.toLocaleString()} {total === 1 ? "pair" : "pairs"} currently listed — everything here is a real, physical pair we own and ship ourselves.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <form action="/shop" className="flex flex-wrap items-end gap-3">
            <label className="text-xs text-[#9a958c]">Brand<input name="brand" defaultValue={brand} maxLength={80} placeholder="e.g. Nike" className="mt-1 block w-36 rounded-lg border border-white/15 bg-[#1B1815] p-2 text-sm text-white" /></label>
            <label className="text-xs text-[#9a958c]">UK size<input name="sizeUk" defaultValue={sizeUk} maxLength={12} placeholder="e.g. 9" className="mt-1 block w-24 rounded-lg border border-white/15 bg-[#1B1815] p-2 text-sm text-white" /></label>
            <label className="text-xs text-[#9a958c]">Condition<select name="condition" defaultValue={condition ?? ''} className="mt-1 block rounded-lg border border-white/15 bg-[#1B1815] p-2 text-sm text-white"><option value="">Any condition</option><option value="new">New</option><option value="used_like_new">Like new</option><option value="used_good">Good</option><option value="used_fair">Fair</option></select></label>
            <label className="flex items-center gap-2 py-2 text-sm"><input type="checkbox" name="available" value="true" defaultChecked={available === 'true'} />Hide sold pairs</label>
            <button className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-bold text-black">Filter</button>
            <Link href="/shop" className="py-2 text-sm text-[#9a958c]">Reset</Link>
          </form>
          <Link href="/shop/cart" className="rounded-xl border border-white/20 px-4 py-2 text-sm text-lime-400">View cart →</Link>
        </div>
        {items.length === 0 ? (
          <p className="mt-16 text-[#6b665f]">No pairs match these filters yet.</p>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/shop/${item.id}`}
                className={`group flex flex-col overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#1B1815] ${item.status === "sold" ? "opacity-50" : ""}`}
              >
                <div className="relative aspect-square bg-black/40">
                  {item.images[0] && (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  )}
                  {item.status !== "available" && (
                    <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      {item.status === "sold" ? "Sold" : "Reserved"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 p-3.5">
                  <span className="text-[13px] font-semibold leading-tight">{item.title}</span>
                  <span className="text-xs text-[#6b665f]">UK {item.size_uk ?? "?"} · {item.condition.replace(/_/g, " ")}</span>
                  <span className="text-xs font-bold text-lime-400">{formatPrice(item.price, item.currency)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-16 flex items-center justify-center gap-4" aria-label="Pagination">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#cfc9bd] hover:border-lime-400 hover:text-lime-400">← Previous</Link>
            ) : (
              <span className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm font-semibold text-[#6b665f]">← Previous</span>
            )}
            <span className="text-sm text-[#6b665f]">Page {page} of {totalPages}</span>
            {page < totalPages ? (
              <Link href={pageHref(page + 1)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#cfc9bd] hover:border-lime-400 hover:text-lime-400">Next →</Link>
            ) : (
              <span className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm font-semibold text-[#6b665f]">Next →</span>
            )}
          </nav>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
