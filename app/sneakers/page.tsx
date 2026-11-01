import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { listCatalogue, listUpcomingReleases } from "@/lib/catalogueApi";

// lib/catalogueApi.ts fetches with cache: "no-store" deliberately (see its
// own comment — stacking that with page-level ISR caused a real dual-cache
// bug on the blog). This revalidate is the one cache that's actually in
// effect; catalogue data changes slowly (nightly AI enrichment, weekly
// Kicks backfill at most), so an hour is plenty fresh.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The Sneaker Hub — Nextsole",
  description: "Live sneaker news, upcoming releases, and a full searchable archive of thousands of sneakers.",
  alternates: { canonical: "/sneakers" },
  openGraph: {
    type: "website",
    url: "https://nextsole.co.uk/sneakers",
    siteName: "Nextsole",
    title: "The Sneaker Hub — Nextsole",
    description: "Live sneaker news, upcoming releases, and a full searchable archive of thousands of sneakers.",
  },
};

const PAGE_SIZE = 60;
const BRANDS = ["Jordan", "Nike", "adidas", "New Balance"];

function formatPrice(price: number | null, currency: string | null): string | null {
  if (price == null) return null;
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "";
  return `${symbol}${price}`;
}

type Props = {
  searchParams: Promise<{ q?: string; brand?: string; page?: string }>;
};

export default async function SneakersIndexPage({ searchParams }: Props) {
  const { q, brand, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [{ items, total }, featured] = await Promise.all([
    listCatalogue({ q, brand, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
    // Featured shelf isn't a "trending" claim we can back yet (real
    // ownership counts are too small to mean anything) — upcoming
    // releases are a real, honest signal instead: genuinely exciting,
    // not fabricated.
    listUpcomingReleases(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const featuredShoes = featured.slice(0, 5);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (brand) params.set("brand", brand);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/sneakers${qs ? `?${qs}` : ""}`;
  };

  const brandHref = (b: string | null) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (b) params.set("brand", b);
    const qs = params.toString();
    return `/sneakers${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-[#14120F] text-[#F2EDE4]">
      <SiteNav />
      <main className="mx-auto max-w-[1344px] px-4 pb-24 pt-32 sm:px-6 xl:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">The Sneaker Hub</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">News. Releases. The full archive.</h1>
        <p className="mt-4 max-w-lg text-[#9a958c]">
          {total.toLocaleString()} sneakers and counting — searchable, filterable, and growing every week.
        </p>

        <nav aria-label="Sneakers sections" className="mt-7 flex flex-wrap gap-3">
          <Link href="/news" className="rounded-xl border border-white/[0.08] bg-[#1B1815] px-4 py-2 text-sm font-semibold text-[#cfc9bd] transition hover:border-lime-400 hover:text-lime-400">
            Latest News
          </Link>
          <Link href="/releases" className="rounded-xl border border-white/[0.08] bg-[#1B1815] px-4 py-2 text-sm font-semibold text-[#cfc9bd] transition hover:border-lime-400 hover:text-lime-400">
            Coming Soon
          </Link>
          <Link href="/blog" className="rounded-xl border border-white/[0.08] bg-[#1B1815] px-4 py-2 text-sm font-semibold text-[#cfc9bd] transition hover:border-lime-400 hover:text-lime-400">
            Blog
          </Link>
        </nav>

        <form action="/sneakers" method="GET" className="mt-8 max-w-md">
          {brand && <input type="hidden" name="brand" value={brand} />}
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#1B1815] px-4 py-3.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b665f" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search by model, brand or colourway…"
              className="w-full bg-transparent text-sm text-white placeholder:text-[#6b665f] focus:outline-none"
            />
          </div>
        </form>

        {/* ── Featured shelf ────────────────────────────────────────── */}
        {featuredShoes.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="text-[15px] font-bold uppercase tracking-[0.2em] text-lime-400">Featured This Week</h2>
              <span className="text-xs text-[#6b665f]">Upcoming releases, hand-picked</span>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {featuredShoes.map((s) => {
                const price = formatPrice(s.retail_price, s.retail_currency);
                return (
                  <Link key={s.sku} href={`/sneakers/${s.slug}`} className="group flex flex-col overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#1B1815]">
                    <div className="relative aspect-[4/3] bg-black/40">
                      {s.image && <Image src={s.image} alt={s.title} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />}
                    </div>
                    <div className="flex flex-col gap-1.5 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b665f]">{s.brand}</span>
                      <span className="text-sm font-bold leading-tight">{s.title}</span>
                      {price && <span className="text-[13px] font-bold text-lime-400">{price}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Full archive, with brand filters ─────────────────────── */}
        <section className="mt-16">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold">Browse the archive</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={brandHref(null)}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold ${!brand ? "border-lime-400/40 bg-lime-400/[0.15] text-lime-400" : "border-white/10 text-[#cfc9bd] hover:border-lime-400/40 hover:text-lime-400"}`}
              >
                All
              </Link>
              {BRANDS.map((b) => (
                <Link
                  key={b}
                  href={brandHref(b)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold ${brand === b ? "border-lime-400/40 bg-lime-400/[0.15] text-lime-400" : "border-white/10 text-[#cfc9bd] hover:border-lime-400/40 hover:text-lime-400"}`}
                >
                  {b}
                </Link>
              ))}
            </div>
          </div>

          <p className="mb-6 text-sm text-[#6b665f]">
            {total.toLocaleString()} {total === 1 ? "sneaker" : "sneakers"}{q ? ` matching “${q}”` : ""}{brand ? ` in ${brand}` : ""}
          </p>

          {items.length === 0 ? (
            <p className="mt-16 text-[#6b665f]">Nothing to show yet.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {items.map((item) => {
                const price = formatPrice(item.retail_price, item.retail_currency);
                return (
                  <Link key={item.slug} href={`/sneakers/${item.slug}`} className="group flex flex-col overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#1B1815]">
                    <div className="relative aspect-square bg-black/40">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 33vw, 20vw"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 p-3.5">
                      <span className="text-[13px] font-semibold leading-tight">{item.title}</span>
                      {price && <span className="text-xs font-bold text-lime-400">{price}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-16 flex items-center justify-center gap-4" aria-label="Pagination">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#cfc9bd] hover:border-lime-400 hover:text-lime-400">
                  ← Previous
                </Link>
              ) : (
                <span className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm font-semibold text-[#6b665f]">← Previous</span>
              )}
              <span className="text-sm text-[#6b665f]">Page {page} of {totalPages}</span>
              {page < totalPages ? (
                <Link href={pageHref(page + 1)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#cfc9bd] hover:border-lime-400 hover:text-lime-400">
                  Next →
                </Link>
              ) : (
                <span className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm font-semibold text-[#6b665f]">Next →</span>
              )}
            </nav>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
