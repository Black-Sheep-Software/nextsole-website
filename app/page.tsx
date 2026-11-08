import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { listCatalogue, listUpcomingReleases } from "@/lib/catalogueApi";
import { getNewsFeed } from "@/lib/newsFeed";
import { listBlogPosts } from "@/lib/blogApi";
import { getInstagramFeed, instagramKindLabel } from "@/lib/instagramFeed";

const SHOP = "https://nextsole.teemill.com/";
const SIGNIN = "https://app.nextsole.co.uk/login";
const LEADERBOARD = "https://app.nextsole.co.uk/leaderboard";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.blacksheepsoftware.nextsole";

// Same reasoning as app/sneakers/page.tsx — the underlying fetches are
// no-store by design, so this page-level revalidate is the one cache
// that's actually in effect for the homepage's live data.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nextsole — The Home For Sneaker Collectors",
  description: "Nextsole is where sneaker collectors track their collection's market value, follow release news, and shop real branded merch.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.nextsole.co.uk",
    siteName: "Nextsole",
    title: "Nextsole — The Home For Sneaker Collectors",
    description: "Nextsole is where sneaker collectors track their collection's market value, follow release news, and shop real branded merch.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Nextsole" }],
  },
};

// ── Structured data ────────────────────────────────────────────────────────
// Describes the site itself, not the app product — that schema lives on
// /app now, which is what the SoftwareApplication entity actually is.

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.nextsole.co.uk/#org",
        name: "Nextsole",
        url: "https://www.nextsole.co.uk",
        logo: "https://www.nextsole.co.uk/nextsole-logo.png",
        brand: { "@type": "Brand", name: "Black Sheep Software" },
        sameAs: ["https://www.instagram.com/nextsoleuk"],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.nextsole.co.uk/#website",
        url: "https://www.nextsole.co.uk",
        name: "Nextsole",
        publisher: { "@id": "https://www.nextsole.co.uk/#org" },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://app.nextsole.co.uk/collection?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function IconApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4.5L6 21l1.5-7.5L2 9h7z" />
    </svg>
  );
}

function IconSneakers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 4v5" />
    </svg>
  );
}

function IconShop() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2l1.5 4h9L18 2M3.5 6h17l-1.2 13.2a2 2 0 0 1-2 1.8H6.7a2 2 0 0 1-2-1.8L3.5 6z" />
    </svg>
  );
}

// Short, human "2h ago" / "3d ago" form — enough to read as live without
// the clutter of a full timestamp.
function timeAgo(iso: string): string | null {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return null;
  const minutes = Math.floor((Date.now() - then) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatPrice(price: number | null, currency: string | null): string | null {
  if (price == null) return null;
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "";
  return `${symbol}${price}`;
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function Home() {
  // Real data everywhere — a section that only ever shows invented copy
  // reads as a mockup, not a product. All of these already have a
  // public, unauthenticated fetch path.
  const [{ total: catalogueTotal }, { news }, upcomingReleases, blogPosts, igPosts] = await Promise.all([
    listCatalogue({ limit: 1 }),
    getNewsFeed(),
    listUpcomingReleases(),
    listBlogPosts(),
    getInstagramFeed(5),
  ]);
  const latestNews = news[0] ?? null;
  const newsAge = latestNews?.pubDate ? timeAgo(latestNews.pubDate) : null;
  const releases = upcomingReleases.slice(0, 5);
  const posts = blogPosts.slice(0, 2);

  return (
    <>
      <JsonLd />
      {/* `relative` is required, not decorative — without it this div
          doesn't establish its own stacking context, so a negative
          z-index on the fixed backdrop below would escape to the PAGE
          ROOT's stacking context instead of staying scoped here (see
          memory: website_hero_backdrop_stacking_bug_2026_11_01). */}
      <div className="relative min-h-screen bg-[#14120F] text-[#F2EDE4]">
        {/* Full-page FIXED backdrop — pinned while the page scrolls over
            it, but kept very faint outside the hero. This image does two
            different jobs (bold hero statement vs. sitewide ambient
            texture) and one opacity can't serve both — at hero-strength,
            the fixed, never-moving crop overlaps card content lower on
            the page. The hero gets its own separate, much stronger copy
            of the same image, scoped to just that section. */}
        {/* A wrapping div carries `fixed` — next/image's `fill` prop sets
            `position: absolute` as an inline style, which would silently
            override a `fixed` class on the <img> itself (inline always
            beats a class), breaking the pin-while-scrolling behaviour. */}
        {/* Negative z-index is the actual fix, not just the `relative`
            parent above — without it this positioned (fixed), z-index:auto
            element paints ABOVE any ordinary non-positioned sibling
            regardless of DOM order (CSS stacking rule), silently eating
            clicks on every section below that doesn't itself happen to be
            `relative`/`absolute` (confirmed: Instagram "Follow along"
            links, the Shop section, and SiteFooter's logo/Instagram icon
            were all click-dead because of this; Hero/Switchboard were only
            saved by accidentally already being `relative` for other
            reasons). */}
        <div className="fixed inset-0 -z-10">
          <Image src="/Backdrop.png" alt="" fill priority className="object-cover object-center opacity-[0.07]" />
        </div>

        <SiteNav />

        <main>
          {/* ── Hero ───────────────────────────────────────────────────── */}
          <section className="relative flex min-h-[680px] items-center overflow-hidden pt-16">
            <Image src="/Backdrop.png" alt="" fill className="absolute inset-0 object-cover object-[65%_center] opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#14120F] via-[#14120F]/85 to-transparent" style={{ backgroundImage: "linear-gradient(90deg, #14120F 0%, rgba(20,18,15,0.85) 30%, rgba(20,18,15,0.15) 62%, transparent 78%)" }} />
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(0deg, #14120F 0%, transparent 22%, transparent 85%, #14120F 100%)" }} />

            <div className="relative mx-auto w-full max-w-[1500px] px-4 py-16 sm:px-6 xl:px-12">
              <div className="max-w-xl">
                <p className="m-0 text-[13px] font-bold uppercase tracking-[0.3em] text-lime-400">Nextsole</p>
                <h1 className="mt-4 text-5xl font-black leading-[1.03] tracking-tight sm:text-6xl">
                  The home for sneaker<br />
                  <span className="inline-block -skew-x-[10deg] text-lime-400">collectors.</span>
                </h1>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-[#9a958c]">
                  Nextsole is where sneaker collectors track their collection&apos;s market value, follow release news, and shop real branded merch — three ways in, one home for all of it.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={SIGNIN} className="rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-lime-300">
                    Get started free
                  </Link>
                  <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" aria-label="Get Nextsole on Google Play">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                      alt="Get it on Google Play"
                      className="h-12 w-auto opacity-90 transition hover:opacity-100"
                    />
                  </a>
                </div>

                {/* Density/proof strip — surfaces the real scale instead of
                    burying it, the way GOAT leads with its item count. */}
                <div className="mt-12 flex flex-wrap items-center gap-3">
                  <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#F2EDE4]">{catalogueTotal.toLocaleString()} sneakers tracked</span>
                  <span className="h-1 w-1 rounded-full bg-lime-400" />
                  <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#8f897c]">Live market pricing</span>
                  <span className="h-1 w-1 rounded-full bg-lime-400" />
                  <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#8f897c]">Daily rotation picks</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Switchboard ───────────────────────────────────────────── */}
          <section className="relative mx-auto grid max-w-[1312px] gap-8 px-4 pb-20 pt-4 sm:px-6 lg:grid-cols-3 xl:px-12">

            <Link
              href="/app"
              className="group flex flex-col gap-5 rounded-[20px] border border-white/[0.08] bg-[#1B1815] p-8 transition hover:-translate-y-0.5 hover:border-lime-400"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/[0.12]"><IconApp /></div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6b665f]">01 · App</span>
              </div>
              <div>
                <h2 className="m-0 text-[23px] font-extrabold">Track your collection</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#9a958c]">
                  Nextsole tracks your collection&apos;s market value and wear history, and gives you a daily pick that actually knows your shoes.
                </p>
              </div>
              <div className="mt-auto overflow-hidden rounded-[14px] border border-white/[0.08]">
                <Image
                  src="/app-screenshot-2.png"
                  alt="Nextsole — collection grid view"
                  width={640}
                  height={420}
                  className="h-auto w-full transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <span className="text-sm font-bold text-lime-400">Open the app →</span>
            </Link>

            <Link
              href="/sneakers"
              className="group flex flex-col gap-5 rounded-[20px] border border-white/[0.08] bg-[#1B1815] p-8 transition hover:-translate-y-0.5 hover:border-lime-400"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/[0.12]"><IconSneakers /></div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6b665f]">02 · Sneakers</span>
              </div>
              <div>
                <h2 className="m-0 text-[23px] font-extrabold">News, releases &amp; the archive</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#9a958c]">
                  Nextsole covers live sneaker news, what&apos;s releasing next, and a full release-history database going back years.
                </p>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                {latestNews && (
                  <div className="rounded-[10px] border border-white/[0.06] bg-[#14120F] px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="m-0 text-[10.5px] font-bold uppercase tracking-widest text-[#6b665f]">Latest News</p>
                      {newsAge && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-lime-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                          {newsAge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] font-semibold text-[#F2EDE4]">{latestNews.title}</p>
                  </div>
                )}
                <span className="inline-flex w-fit items-center rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-[#cfc9bd]">
                  {catalogueTotal.toLocaleString()} sneakers tracked
                </span>
              </div>
              <span className="text-sm font-bold text-lime-400">Explore →</span>
            </Link>

            <a
              href={SHOP}
              className="group flex flex-col gap-5 rounded-[20px] border border-white/[0.08] bg-[#1B1815] p-8 transition hover:-translate-y-0.5 hover:border-lime-400"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/[0.12]"><IconShop /></div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6b665f]">03 · Shop</span>
              </div>
              <div>
                <h2 className="m-0 text-[23px] font-extrabold">Nextsole merch</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#9a958c]">
                  Nextsole sells real tees and hoodies, made for people who live and breathe sneaker culture.
                </p>
              </div>
              <div className="mt-auto overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#F2EDE4]">
                <Image src="/shop-tee.jpg" alt="The Original Tee" width={640} height={420} className="h-auto w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]" />
              </div>
              <span className="text-sm font-bold text-lime-400">Shop now →</span>
            </a>

          </section>

          {/* ── Coming Soon strip — real density/freshness, SneakerNews/GOAT-style ── */}
          {releases.length > 0 && (
            <section className="mx-auto max-w-[1312px] px-4 pb-24 sm:px-6 xl:px-12">
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="text-[15px] font-bold uppercase tracking-[0.2em] text-lime-400">Coming Soon</h2>
                <Link href="/releases" className="text-sm font-semibold text-[#8f897c] hover:text-lime-400">Full release calendar →</Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {releases.map((rel) => {
                  const price = formatPrice(rel.retail_price, rel.retail_currency);
                  return (
                    <Link key={rel.sku} href={`/sneakers/${rel.slug}`} className="group flex flex-col overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#1B1815]">
                      <div className="relative aspect-square bg-black/40">
                        {rel.image && (
                          <Image src={rel.image} alt={rel.title ?? rel.sku} fill unoptimized className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 20vw" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2 p-3.5">
                        {rel.release_date && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-lime-400">
                            {new Date(rel.release_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                        )}
                        <span className="line-clamp-2 text-[13px] font-semibold leading-tight">{rel.title ?? rel.sku}</span>
                        {price && <span className="text-xs font-bold text-[#8f897c]">{price}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Blog ──────────────────────────────────────────────────── */}
          {posts.length > 0 && (
            <section className="border-t border-white/[0.08]">
              <div className="mx-auto max-w-[1312px] px-4 py-24 sm:px-6 xl:px-12">
                <div className="mb-7 flex items-baseline justify-between">
                  <div>
                    <p className="m-0 text-[13px] font-bold uppercase tracking-[0.3em] text-lime-400">From the Blog</p>
                    <h2 className="mt-2.5 text-[32px] font-extrabold">Stories, not just stock</h2>
                  </div>
                  <Link href="/blog" className="text-sm font-semibold text-[#8f897c] hover:text-lime-400">All posts →</Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#1B1815]">
                      {post.cover_image_url && (
                        <div className="relative aspect-[16/8] bg-black/40">
                          <Image src={post.cover_image_url} alt={post.title} fill unoptimized className="object-cover transition duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, 50vw" />
                        </div>
                      )}
                      <div className="flex flex-col gap-2.5 p-6">
                        {post.published_at && (
                          <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-lime-400">
                            {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                        )}
                        <h3 className="m-0 text-[19px] font-bold leading-tight">{post.title}</h3>
                        <span className="mt-1 text-[13px] font-bold text-[#F2EDE4]">Read the story →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Instagram ─────────────────────────────────────────────── */}
          {igPosts.length > 0 && (
            <section className="border-t border-white/[0.08]">
              <div className="mx-auto max-w-[1312px] px-4 py-24 sm:px-6 xl:px-12">
                <div className="mb-7 flex items-baseline justify-between">
                  <div>
                    <p className="m-0 text-[13px] font-bold uppercase tracking-[0.3em] text-lime-400">@nextsoleuk</p>
                    <h2 className="mt-2.5 text-[32px] font-extrabold">Follow along</h2>
                  </div>
                  <a href="https://www.instagram.com/nextsoleuk" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#8f897c] hover:text-lime-400">Follow on Instagram →</a>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {igPosts.map((ig, i) => (
                    <a
                      key={i}
                      href={ig.ig_permalink ?? "https://www.instagram.com/nextsoleuk"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-xl bg-black/40"
                    >
                      {ig.image_url && (
                        <Image src={ig.image_url} alt={ig.caption} fill unoptimized className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 640px) 33vw, 20vw" />
                      )}
                      <div className="absolute inset-0 flex flex-col justify-end p-3" style={{ backgroundImage: "linear-gradient(0deg, rgba(20,18,15,0.9) 0%, transparent 55%)" }}>
                        <span className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-lime-400">{instagramKindLabel(ig.kind)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Shop, properly featured ───────────────────────────────── */}
          <section className="border-t border-white/[0.08]">
            <div className="mx-auto max-w-[1312px] px-4 py-24 sm:px-6 xl:px-12">
              <div className="mb-7 flex items-baseline justify-between">
                <div>
                  <p className="m-0 text-[13px] font-bold uppercase tracking-[0.3em] text-lime-400">Shop</p>
                  <h2 className="mt-2.5 text-[32px] font-extrabold">Nextsole merch</h2>
                  <p className="mt-2.5 max-w-md text-[15px] text-[#9a958c]">Real tees and hoodies, made for people who live and breathe sneaker culture.</p>
                </div>
                <a href={SHOP} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#8f897c] hover:text-lime-400">Shop all →</a>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <a href={SHOP} target="_blank" rel="noopener noreferrer" className="group flex flex-col overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#1B1815]">
                  <div className="relative aspect-[4/3] bg-[#F2EDE4]">
                    <Image src="/shop-tee.jpg" alt="The Original Tee" fill className="object-contain p-6 transition duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                  <div className="flex items-center justify-between p-6">
                    <span className="text-[15px] font-bold">The Original Tee</span>
                    <span className="text-base font-extrabold text-lime-400">£24</span>
                  </div>
                </a>
                <a href={SHOP} target="_blank" rel="noopener noreferrer" className="group flex flex-col overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#1B1815]">
                  <div className="relative aspect-[4/3] bg-[#F2EDE4]">
                    <Image src="/shop-hoodie.jpg" alt="Original Hoodie" fill className="object-contain p-6 transition duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                  <div className="flex items-center justify-between p-6">
                    <span className="text-[15px] font-bold">Original Hoodie</span>
                    <span className="text-base font-extrabold text-lime-400">£45</span>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* ── Community proof ──────────────────────────────────────────
              Previously the switchboard had zero evidence of real usage —
              no counts, no community, nothing beyond static copy. This is
              the same leaderboard screenshot the old homepage used. */}
          <section className="border-t border-white/[0.08] bg-[#14120F] py-20">
            <div className="mx-auto grid max-w-[1312px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center xl:px-12">
              <div>
                <p className="m-0 text-[13px] font-bold uppercase tracking-[0.3em] text-lime-400">Community</p>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">Collectors are already ranking up</h2>
                <p className="mt-3 max-w-md text-[#9a958c]">
                  See who&apos;s got the deepest rotation and the most-loved pairs — all live, all public.
                </p>
                <a
                  href={LEADERBOARD}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-[#F2EDE4] transition hover:border-lime-400 hover:text-lime-400"
                >
                  View the leaderboard →
                </a>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <Image
                  src="/app-screenshot-leaderboard.png"
                  alt="Nextsole leaderboard — top collectors ranked by collection size"
                  width={1705}
                  height={580}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
