import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

// Brand-wide chronological release timeline — a single axis spanning every
// model, not siloed per-model sections. Follows a horizontal-timeline
// reference (alternating cards off an axis), adapted to a vertical axis
// for real mobile-friendliness.

const TIMELINE_API = "https://app.nextsole.co.uk/api/public/timeline";
const REVALIDATE_SECONDS = 3600;

type Release = {
  sku: string;
  title: string | null;
  model: string | null;
  colourway: string | null;
  release_date: string;
  release_date_precision: string | null;
  image: string | null;
};

async function getBrandReleases(brand: string): Promise<Release[] | null> {
  const res = await fetch(`${TIMELINE_API}?brand=${encodeURIComponent(brand)}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.releases ?? [];
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand } = await params;
  const name = decodeURIComponent(brand);
  return {
    title: `${name} Release Timeline — Nextsole`,
    description: `Every ${name} release Nextsole has a date for, oldest to newest.`,
    alternates: { canonical: `/news/${brand}` },
  };
}

function formatDate(date: string, precision: string | null) {
  const d = new Date(date);
  if (precision === "year") return d.getFullYear().toString();
  if (precision === "month") return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function ReleaseCard({ r, align }: { r: Release; align: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 ${align === "right" ? "sm:flex-row-reverse sm:text-right" : ""}`}>
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
        {r.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.image} alt={r.title ?? r.sku} className="h-full w-full object-contain" />
        ) : (
          <span className="text-2xl">👟</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-white">{r.colourway || r.title}</p>
        <p className="text-xs text-neutral-500">{r.model ?? "—"} · {r.sku}</p>
      </div>
      <p className="shrink-0 text-xs font-semibold text-lime-400">
        {r.release_date_precision === "year" && "~"}
        {formatDate(r.release_date, r.release_date_precision)}
      </p>
    </div>
  );
}

export default async function BrandTimelinePage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandParam } = await params;
  const brand = decodeURIComponent(brandParam);
  const releases = await getBrandReleases(brand);

  if (!releases || releases.length === 0) notFound();

  // Sort the whole brand chronologically, oldest first — a "history" that
  // isn't chronological defeats the point.
  const sorted = [...releases].sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
  const modelCount = new Set(sorted.map((r) => r.model)).size;

  let lastYear: number | null = null;

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/news" className="text-sm font-semibold text-lime-400 hover:text-lime-300">
            ← News
          </Link>
          <h1 className="mt-4 text-5xl font-black tracking-tight">{brand}</h1>
          <p className="mt-3 text-neutral-400">
            {sorted.length} dated releases across {modelCount} models
          </p>

          <div className="relative mt-16">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-800 sm:left-1/2" />

            <div className="flex flex-col gap-10">
              {sorted.map((r, i) => {
                const year = new Date(r.release_date).getFullYear();
                const showYear = year !== lastYear;
                lastYear = year;
                const align = i % 2 === 0 ? "left" : "right";

                return (
                  <div key={r.sku}>
                    {showYear && (
                      <div className="relative mb-6 flex items-center gap-3 sm:justify-center">
                        <span className="relative z-10 ml-0 rounded-full bg-lime-400 px-4 py-1 text-sm font-black text-black sm:ml-0">
                          {year}
                        </span>
                      </div>
                    )}
                    <div className="relative pl-10 sm:pl-0">
                      <div className="absolute left-2.5 top-6 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-lime-400 bg-neutral-950 sm:left-1/2" />
                      <div className={`sm:w-[calc(50%-2rem)] ${align === "right" ? "sm:ml-auto" : ""}`}>
                        <ReleaseCard r={r} align={align} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
