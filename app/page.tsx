import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { listCatalogue } from "@/lib/catalogueApi";
import { getNewsFeed } from "@/lib/newsFeed";

const SHOP = "https://nextsole.teemill.com/";
const SIGNIN = "https://app.nextsole.co.uk/login";
const LEADERBOARD = "https://app.nextsole.co.uk/leaderboard";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.blacksheepsoftware.nextsole";

// Same reasoning as app/sneakers/page.tsx — the underlying fetches are
// no-store by design, so this page-level revalidate is the one cache
// that's actually in effect for the homepage's new live data.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nextsole — The Home For Sneaker Collectors",
  description: "Nextsole is where sneaker collectors track their collection's market value, follow release news, and shop real branded merch.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://nextsole.co.uk",
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
        "@id": "https://nextsole.co.uk/#org",
        name: "Nextsole",
        url: "https://nextsole.co.uk",
        logo: "https://nextsole.co.uk/nextsole-logo.png",
        brand: { "@type": "Brand", name: "Black Sheep Software" },
        sameAs: ["https://www.instagram.com/nextsoleuk"],
      },
      {
        "@type": "WebSite",
        "@id": "https://nextsole.co.uk/#website",
        url: "https://nextsole.co.uk",
        name: "Nextsole",
        publisher: { "@id": "https://nextsole.co.uk/#org" },
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

// ── Page ───────────────────────────────────────────────────────────────────

export default async function Home() {
  // Real data, not placeholders — a card that only ever shows invented
  // copy reads as a mockup, not a product. All three of these already
  // have a public, unauthenticated fetch path used elsewhere in this repo.
  const [{ total: catalogueTotal }, { news, comingSoon }] = await Promise.all([
    listCatalogue({ limit: 1 }),
    getNewsFeed(),
  ]);
  const latestNews = news[0] ?? null;
  const nextRelease = comingSoon[0] ?? null;

  return (
    <>
      <JsonLd />
      <div className="min-h-screen bg-[#14120F] text-[#F2EDE4]">
        {/* Fixed backdrop — pinned while the page scrolls over it, same
            effect as the live site's root-level backdrop layer. */}
        <div className="fixed inset-0 -z-10">
          <Image src="/Backdrop.png" alt="" fill className="object-cover object-center opacity-60" priority />
        </div>

        <SiteNav />

        <main>
          {/* ── Hero ───────────────────────────────────────────────────── */}
          <section className="relative flex min-h-[620px] items-center overflow-hidden pt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-[#14120F] via-[#14120F]/80 to-[#14120F]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14120F] via-transparent to-[#14120F]/30" />
            <div className="relative mx-auto grid w-full max-w-[1500px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center xl:px-12">
              <div className="max-w-xl">
                <p className="m-0 text-[13px] font-bold uppercase tracking-[0.3em] text-lime-400">Nextsole</p>
                <h1 className="mt-4 text-5xl font-black leading-[1.03] tracking-tight sm:text-6xl">
                  The home for sneaker<br />
                  <span className="inline-block -skew-x-[10deg] text-lime-400">collectors.</span>
                </h1>
                <p className="mt-4 text-base font-bold text-[#cfc9bd]">Track it. Follow it. Wear it — three ways in.</p>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-[#9a958c]">
                  Nextsole is where sneaker collectors track their collection&apos;s market value, follow release news, and shop real branded merch.
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
              </div>

              {/* Real app screenshot — the switchboard was previously all
                  copy, no proof this is a real, shipped product. */}
              <div className="hidden lg:block">
                <div className="relative w-[280px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                  <Image
                    src="/app-screenshot.png"
                    alt="Nextsole — collection overview with market value and rotation engine"
                    width={560}
                    height={1040}
                    className="h-auto w-full"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Switchboard ───────────────────────────────────────────── */}
          <section className="relative mx-auto grid max-w-[1312px] gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-3 xl:px-12">

            <Link
              href="/app"
              className="group flex flex-col gap-4 rounded-[20px] border border-white/[0.08] bg-[#1B1815] p-7 transition hover:-translate-y-0.5 hover:border-lime-400"
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
              className="group flex flex-col gap-4 rounded-[20px] border border-white/[0.08] bg-[#1B1815] p-7 transition hover:-translate-y-0.5 hover:border-lime-400"
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
                    <p className="m-0 text-[10.5px] font-bold uppercase tracking-widest text-[#6b665f]">Latest News</p>
                    <p className="mt-1 line-clamp-2 text-[13px] font-semibold text-[#F2EDE4]">{latestNews.title}</p>
                  </div>
                )}
                {nextRelease && (
                  <div className="rounded-[10px] border border-white/[0.06] bg-[#14120F] px-3 py-2.5">
                    <p className="m-0 text-[10.5px] font-bold uppercase tracking-widest text-[#6b665f]">Coming Soon</p>
                    <p className="mt-1 line-clamp-1 text-[13px] font-semibold text-[#F2EDE4]">{nextRelease.title ?? nextRelease.sku}</p>
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
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 rounded-[20px] border border-white/[0.08] bg-[#1B1815] p-7 transition hover:-translate-y-0.5 hover:border-lime-400"
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
              <div className="mt-auto flex flex-col gap-1.5">
                <div className="flex items-center justify-between rounded-[10px] border border-white/[0.06] bg-[#14120F] px-3 py-2.5">
                  <span className="text-[13px] font-semibold text-[#F2EDE4]">The Original Tee</span>
                  <span className="text-[13px] font-bold text-lime-400">£24</span>
                </div>
                <div className="flex items-center justify-between rounded-[10px] border border-white/[0.06] bg-[#14120F] px-3 py-2.5">
                  <span className="text-[13px] font-semibold text-[#F2EDE4]">Original Hoodie</span>
                  <span className="text-[13px] font-bold text-lime-400">£45</span>
                </div>
              </div>
              <span className="text-sm font-bold text-lime-400">Shop now →</span>
            </a>

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
