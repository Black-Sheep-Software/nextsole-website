import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getNewsFeed, type NewsItem } from "@/lib/newsFeed";

export const metadata: Metadata = {
  title: "News — Nextsole",
  description: "The latest sneaker news, upcoming releases, and a full release history by brand.",
  alternates: { canonical: "/news" },
  openGraph: {
    type: "website",
    url: "https://nextsole.co.uk/news",
    siteName: "Nextsole",
    title: "News — Nextsole",
    description: "The latest sneaker news, upcoming releases, and a full release history by brand.",
  },
};

const TIMELINE_API = "https://app.nextsole.co.uk/api/public/timeline";
const TIMELINE_REVALIDATE_SECONDS = 3600; // 1hr — release data barely changes hour to hour

type BrandSummary = { brand: string; totalRows: number; datedRows: number; ready: boolean };
type BrandCard = BrandSummary & { sampleImage: string | null };

async function getBrandSummary(): Promise<BrandSummary[]> {
  const res = await fetch(TIMELINE_API, { next: { revalidate: TIMELINE_REVALIDATE_SECONDS } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.brands ?? [];
}

async function getSampleImage(brand: string): Promise<string | null> {
  const res = await fetch(`${TIMELINE_API}?brand=${encodeURIComponent(brand)}`, {
    next: { revalidate: TIMELINE_REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const json = await res.json();
  const releases: { image: string | null }[] = json.releases ?? [];
  return releases.find((r) => r.image)?.image ?? null;
}

function timeAgo(pubDate: string | null): string {
  if (!pubDate) return "";
  const diffMs = Date.now() - new Date(pubDate).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(pubDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Lead story: headline overlaid directly on the image behind a gradient
// scrim (Highsnobiety's pattern) rather than a card with text underneath —
// reads as an editorial front page, not a blog grid.
function NewsHero({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/story/${item.slug}`}
      className="group relative block aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-900 sm:aspect-[21/9]"
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-5xl">👟</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-400">
          {item.source} · {timeAgo(item.pubDate)}
        </p>
        <p className="mt-2 max-w-2xl text-2xl font-black leading-tight text-white sm:text-4xl">{item.title}</p>
      </div>
    </Link>
  );
}

// Everything after the lead runs as a real card grid — big image on top,
// bold headline below, small-caps byline — the magazine-grid pattern real
// sneaker/fashion news sites use (Highsnobiety, Hypebeast), rather than a
// thin list of 64px thumbnails that reads as an afterthought next to the
// hero above it.
function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/story/${item.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-900">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">👟</div>
        )}
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-lime-400">
        {item.source} · {timeAgo(item.pubDate)}
      </p>
      <p className="mt-1.5 line-clamp-2 text-lg font-bold leading-snug text-white transition group-hover:text-lime-400">
        {item.title}
      </p>
    </Link>
  );
}

function BrandCardTile({ brand }: { brand: BrandCard }) {
  // Same image-top/text-below pattern as NewsCard, for one consistent card
  // language across the page — the previous version faded the sample image
  // to 25% opacity as a background watermark, which read as blurry/washed
  // out rather than as a real product photo, and gave no indication of
  // what clicking the tile actually does.
  return (
    <Link
      href={`/news/${encodeURIComponent(brand.brand)}`}
      className="group block overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition hover:border-lime-500/40"
    >
      <div className="relative aspect-[4/3] bg-white">
        {brand.sampleImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.sampleImage}
            alt=""
            className="h-full w-full object-contain p-6 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">👟</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-lg font-black text-white">{brand.brand}</p>
        <p className="mt-1 text-sm text-neutral-400">{brand.datedRows} releases, oldest to newest</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-lime-400 transition group-hover:text-lime-300">
          Browse the timeline →
        </p>
      </div>
    </Link>
  );
}

export default async function NewsPage() {
  const [{ news, comingSoon }, brands] = await Promise.all([getNewsFeed(), getBrandSummary()]);
  const ready = brands.filter((b) => b.ready);
  const comingSoonBrands = brands.filter((b) => !b.ready);

  const readyWithImages: BrandCard[] = await Promise.all(
    ready.map(async (b) => ({ ...b, sampleImage: await getSampleImage(b.brand) }))
  );

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white sm:px-8 xl:px-12">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">News</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-tight sm:text-6xl">What&rsquo;s dropping</h1>
          <p className="mt-4 max-w-xl text-neutral-400">The latest sneaker news, what&rsquo;s coming next, and the full release history behind it.</p>

          {/* Latest news */}
          <section className="mt-16">
            <h2 className="text-3xl font-black">Latest News</h2>
            {news.length > 0 ? (
              <div className="mt-6">
                <NewsHero item={news[0]} />
                {news.length > 1 && (
                  <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {news.slice(1).map((item) => (
                      <NewsCard key={item.link} item={item} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-6 text-neutral-500">No news right now — check back soon.</p>
            )}
          </section>

          {/* Coming soon teaser */}
          {comingSoon.length > 0 && (
            <section className="mt-20">
              <div className="flex items-baseline justify-between">
                <h2 className="text-3xl font-black">Coming Soon</h2>
                <Link href="/releases" className="text-sm font-semibold text-lime-400 hover:text-lime-300">
                  Full calendar →
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {comingSoon.slice(0, 6).map((item) => (
                  <div key={item.sku} className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                    <div className="relative h-24 bg-white">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.title ?? item.sku} className="h-full w-full object-contain p-2" />
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-lime-400">
                        {new Date(item.release_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-white">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Release timeline */}
          <section className="mt-20">
            <h2 className="text-3xl font-black">Release Timeline</h2>
            <p className="mt-2 max-w-xl text-neutral-400">
              Browse a brand&rsquo;s full release history, from the earliest colourway to the newest drop.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {readyWithImages.map((b) => (
                <BrandCardTile key={b.brand} brand={b} />
              ))}
              {readyWithImages.length === 0 && <p className="text-neutral-500">Nothing ready yet.</p>}
            </div>

            {comingSoonBrands.length > 0 && (
              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">More brands, coming as data fills in</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {comingSoonBrands.map((b) => (
                    <span key={b.brand} className="rounded-full border border-neutral-800 px-3 py-1.5 text-xs text-neutral-500">
                      {b.brand} ({b.datedRows}/{b.totalRows} dated)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
