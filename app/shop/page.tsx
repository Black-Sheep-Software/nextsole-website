import Link from "next/link";
import ShopNav from "@/components/shop/ShopNav";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/shop/ProductCard";
import FilterPanel from "@/components/shop/FilterPanel";
import BuyingGuide from "@/components/shop/BuyingGuide";
import { listShop } from "@/lib/shopApi";
export const revalidate = 60;
const PAGE_SIZE = 24;
type Params = {
  brand?: string;
  page?: string;
  condition?: string;
  sizeUk?: string;
  available?: string;
  preowned?: string;
  q?: string;
  sort?: string;
};
export default async function ShopIndexPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const p = await searchParams;
  const page = Math.max(1, Math.min(1000, Math.floor(Number(p.page) || 1)));
  const sort = ["newest", "price-low", "price-high"].includes(p.sort ?? "")
    ? p.sort!
    : "newest";
  const { items, total } = await listShop({
    brand: p.brand,
    condition: p.condition,
    sizeUk: p.sizeUk,
    includeSold: p.available !== "true",
    preowned: p.preowned === "true",
    search: p.q,
    sort,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const active = [
    p.q && ["Search", p.q, "q"],
    p.brand && ["Brand", p.brand, "brand"],
    p.sizeUk && ["UK size", p.sizeUk, "sizeUk"],
    p.condition && ["Condition", p.condition.replace(/_/g, " "), "condition"],
    p.preowned === "true" && ["Category", "Pre-owned", "preowned"],
    p.available === "true" && ["Availability", "Hide sold", "available"],
  ].filter(Boolean) as string[][];
  function href(change: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    Object.entries({ ...p, ...change }).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `/shop${params.size ? "?" + params.toString() : ""}`;
  }
  return (
    <div className="min-h-screen bg-[#14120f] text-[#f2ede4]">
      <ShopNav />
      <main className="mx-auto max-w-[1440px] px-5 md:px-10">
        <section className="relative overflow-hidden border-b border-white/10 py-8 md:py-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-lime-400/[.035] blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.25em] text-lime-400">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                The Nextsole selection
              </p>
              <h1 className="mt-5 text-[clamp(2.6rem,6.5vw,6rem)] font-black uppercase leading-[.93] tracking-[-.065em]">
                Good pairs.
                <br />
                <span className="text-lime-400">Next chapter.</span>
              </h1>
            </div>
            <div className="hidden max-w-[340px] pb-1 sm:block">
              <p className="hidden text-sm leading-7 text-[#b9b2a8] sm:block">
                New finds. Pre-owned favourites. Individual pairs with the
                photos and details to help you find your next sole.
              </p>
              <a
                href="#pairs"
                className="mt-5 inline-flex min-h-11 items-center gap-7 text-xs font-semibold uppercase tracking-wider"
              >
                Explore the selection{" "}
                <span className="text-xl text-lime-400" aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 py-5 text-center text-[10px] text-[#b9b2a8] sm:text-xs">
          <span>One pair per listing</span>
          <span>Actual pair photos</span>
          <span>UK delivery</span>
        </div>
        <section id="pairs" className="scroll-mt-44 pb-14 pt-10 md:pt-14">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div className="flex gap-6 text-sm font-semibold">
              <Link
                href={href({
                  condition: undefined,
                  preowned: undefined,
                  page: undefined,
                })}
                className={`pb-2 ${!p.condition && p.preowned !== "true" ? "border-b-2 border-lime-400 text-white" : "text-[#aaa49a]"}`}
              >
                All pairs
              </Link>
              <Link
                href={href({
                  condition: "new",
                  preowned: undefined,
                  page: undefined,
                })}
                className={`pb-2 ${p.condition === "new" ? "border-b-2 border-lime-400 text-white" : "text-[#aaa49a]"}`}
              >
                New
              </Link>
              <Link
                href={href({
                  condition: undefined,
                  preowned: "true",
                  page: undefined,
                })}
                className={`pb-2 ${p.preowned === "true" ? "border-b-2 border-lime-400 text-white" : "text-[#aaa49a]"}`}
              >
                Pre-owned
              </Link>
            </div>
            <p className="text-xs text-[#aaa49a]">
              {total} {total === 1 ? "pair" : "pairs"}
              {active.length ? " matching your selection" : ""}
            </p>
          </div>
          <FilterPanel activeCount={active.length}>
            <form
              action="/shop"
              className="rounded-2xl border border-white/10 bg-[#1b1815] p-4 md:p-5"
            >
              {p.preowned === "true" && (
                <input type="hidden" name="preowned" value="true" />
              )}
              <div className="flex flex-wrap gap-3">
                <label className="min-w-[180px] flex-1 text-[10px] font-semibold uppercase tracking-wider text-[#aaa49a]">
                  Find your next pair
                  <input
                    type="search"
                    name="q"
                    defaultValue={p.q}
                    placeholder="Search a model or colourway…"
                    maxLength={80}
                    className="mt-2 block w-full rounded-lg border border-white/10 bg-[#14120f] px-3 py-3 text-sm font-normal normal-case tracking-normal text-white placeholder:text-[#756f66]"
                  />
                </label>
                <label className="w-[calc(50%_-_6px)] text-[10px] font-semibold uppercase tracking-wider text-[#aaa49a] sm:w-36">
                  Brand
                  <input
                    name="brand"
                    defaultValue={p.brand}
                    placeholder="Any brand"
                    maxLength={80}
                    className="mt-2 block w-full rounded-lg border border-white/10 bg-[#14120f] px-3 py-3 text-sm font-normal normal-case tracking-normal text-white"
                  />
                </label>
                <label className="w-[calc(50%_-_6px)] text-[10px] font-semibold uppercase tracking-wider text-[#aaa49a] sm:w-24">
                  UK size
                  <input
                    name="sizeUk"
                    defaultValue={p.sizeUk}
                    placeholder="Any size"
                    maxLength={12}
                    className="mt-2 block w-full rounded-lg border border-white/10 bg-[#14120f] px-3 py-3 text-sm font-normal normal-case tracking-normal text-white"
                  />
                </label>
                <label className="min-w-36 flex-1 text-[10px] font-semibold uppercase tracking-wider text-[#aaa49a] sm:max-w-44">
                  Condition
                  <select
                    name="condition"
                    defaultValue={p.condition ?? ""}
                    className="mt-2 block w-full rounded-lg border border-white/10 bg-[#14120f] px-3 py-3 text-sm font-normal normal-case tracking-normal text-white"
                  >
                    <option value="">Any condition</option>
                    <option value="new">New</option>
                    <option value="used_like_new">Pre-owned: like new</option>
                    <option value="used_good">Pre-owned: good</option>
                    <option value="used_fair">Pre-owned: fair</option>
                  </select>
                </label>
                <button className="self-end rounded-lg bg-lime-400 px-6 py-3 text-sm font-bold text-black hover:bg-lime-300">
                  Find pairs →
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                <label className="flex items-center gap-2 text-xs text-[#b9b2a8]">
                  <input
                    type="checkbox"
                    name="available"
                    value="true"
                    defaultChecked={p.available === "true"}
                    className="accent-lime-400"
                  />
                  Hide sold pairs
                </label>
                <label className="flex items-center gap-2 text-xs text-[#aaa49a]">
                  Sort by
                  <select
                    name="sort"
                    defaultValue={sort}
                    className="max-w-44 rounded-lg border border-white/10 bg-[#14120f] px-3 py-2 text-xs text-white"
                  >
                    <option value="newest">Latest additions</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                  </select>
                </label>
              </div>
            </form>
          </FilterPanel>
          {active.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {active.map(([name, value, key]) => (
                <Link
                  key={key}
                  href={href({ [key]: undefined, page: undefined })}
                  aria-label={`Remove ${name} filter: ${value}`}
                  className="rounded-full border border-white/15 px-3 py-2 text-[11px] text-[#cfc9bd]"
                >
                  {name}: {value}
                  <span className="ml-3 text-[#aaa49a]" aria-hidden="true">
                    ×
                  </span>
                </Link>
              ))}
              <Link
                href="/shop"
                className="px-2 py-2 text-xs text-[#aaa49a] underline underline-offset-4"
              >
                Clear all
              </Link>
            </div>
          )}
          {items.length ? (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="my-10 rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
              <p className="text-3xl text-lime-400" aria-hidden="true">
                ↗
              </p>
              <h2 className="mt-4 text-xl font-bold">
                {active.length
                  ? "No pairs in this selection."
                  : "The next rotation starts here."}
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#aaa49a]">
                {active.length
                  ? "Try a different size, remove a filter, or explore the whole selection."
                  : "Our selection is being prepared. New and pre-owned pairs will appear here as they are listed."}
              </p>
              {active.length > 0 && (
                <Link
                  href="/shop"
                  className="mt-6 inline-block rounded-full bg-lime-400 px-6 py-3 text-sm font-bold text-black"
                >
                  Explore all pairs
                </Link>
              )}
            </div>
          )}
          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-12 flex items-center justify-center gap-6 text-xs text-[#aaa49a]"
            >
              {page > 1 && (
                <Link
                  href={href({ page: String(page - 1) })}
                  className="rounded-full border border-white/20 px-5 py-3 text-white"
                >
                  ← Previous
                </Link>
              )}
              <span>
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={href({ page: String(page + 1) })}
                  className="rounded-full border border-white/20 px-5 py-3 text-white"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </section>
        <BuyingGuide />
      </main>
      <SiteFooter />
    </div>
  );
}
