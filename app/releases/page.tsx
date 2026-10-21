import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { listUpcomingReleases } from "@/lib/catalogueApi";

// See app/sneakers/page.tsx — this revalidate window is the one cache
// actually in effect (lib/catalogueApi.ts fetches with no-store on purpose).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Release Calendar — Nextsole",
  description: "Upcoming sneaker release dates.",
  alternates: { canonical: "/releases" },
  openGraph: {
    type: "website",
    url: "https://nextsole.co.uk/releases",
    siteName: "Nextsole",
    title: "Release Calendar — Nextsole",
    description: "Upcoming sneaker release dates.",
  },
};

export default async function ReleasesPage() {
  const releases = await listUpcomingReleases();

  return (
    <>
      <SiteNav />
      {/* This is a grid/browse page, not reading prose — it should use the
          available screen width, not the same cramped container a text
          page would use. A single skinny list inside a wide container
          would just move the wasted space, not fix it, so this is a real
          multi-column card grid now, same visual language as the News
          hub's Coming Soon teaser. */}
      <main className="mx-auto min-h-screen max-w-[1500px] px-4 pb-24 pt-32 sm:px-6 xl:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">Release Calendar</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Coming up</h1>
        <p className="mt-4 max-w-lg text-neutral-400">Upcoming sneaker releases, soonest first.</p>

        {releases.length === 0 ? (
          <p className="mt-16 text-neutral-500">No upcoming releases tracked right now — check back soon.</p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {releases.map((item) => (
              <Link
                key={item.slug}
                href={`/sneakers/${item.slug}`}
                className="group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)] transition hover:border-lime-500/40"
              >
                <div className="relative aspect-square bg-white">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-4 transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-lime-400">{item.brand}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-bold text-white transition group-hover:text-lime-400">{item.title}</p>
                  <p className="mt-1.5 text-xs font-semibold text-neutral-400">
                    {new Date(item.release_date!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
