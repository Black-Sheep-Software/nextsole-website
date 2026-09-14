import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { listUpcomingReleases } from "@/lib/catalogueApi";

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
      <main className="mx-auto min-h-screen max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">Release Calendar</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Coming up</h1>
        <p className="mt-4 max-w-lg text-neutral-400">Upcoming sneaker releases, soonest first.</p>

        {releases.length === 0 ? (
          <p className="mt-16 text-neutral-500">No upcoming releases tracked right now — check back soon.</p>
        ) : (
          <div className="mt-12 divide-y divide-neutral-800 border-t border-neutral-800">
            {releases.map((item) => (
              <Link key={item.slug} href={`/sneakers/${item.slug}`} className="group flex items-center gap-5 py-5">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-800 bg-white">
                  {item.image && <Image src={item.image} alt={item.title} fill className="object-contain p-1.5" sizes="64px" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-lime-400">{item.brand}</p>
                  <p className="truncate font-bold text-white transition group-hover:text-lime-400">{item.title}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-neutral-400">
                  {new Date(item.release_date!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
