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

type Props = { searchParams: Promise<{ brand?: string; page?: string }> };

export default async function ShopIndexPage({ searchParams }: Props) {
  const { brand, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, total } = await listShop({ brand, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
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

        {items.length === 0 ? (
          <p className="mt-16 text-[#6b665f]">Nothing listed yet.</p>
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
