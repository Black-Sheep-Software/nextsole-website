import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { listCatalogue } from "@/lib/catalogueApi";

export const metadata: Metadata = {
  title: "Sneaker Database — Nextsole",
  description: "Browse release dates, retail prices and details for thousands of sneakers.",
  alternates: { canonical: "/sneakers" },
  openGraph: {
    type: "website",
    url: "https://nextsole.co.uk/sneakers",
    siteName: "Nextsole",
    title: "Sneaker Database — Nextsole",
    description: "Browse release dates, retail prices and details for thousands of sneakers.",
  },
};

export default async function SneakersIndexPage() {
  const { items } = await listCatalogue({ limit: 60 });

  return (
    <>
      <SiteNav />
      <main className="mx-auto min-h-screen max-w-5xl px-4 pb-24 pt-32 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">Sneaker Database</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Browse the catalogue</h1>
        <p className="mt-4 max-w-lg text-neutral-400">
          Release dates, retail prices and details — the same catalogue Nextsole members track their own collections against.
        </p>

        {items.length === 0 ? (
          <p className="mt-16 text-neutral-500">Nothing to show yet.</p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {items.map((item) => (
              <Link key={item.slug} href={`/sneakers/${item.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-800 bg-white">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-4 transition group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  )}
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-lime-400">{item.brand}</p>
                <h2 className="mt-1 text-base font-bold text-white transition group-hover:text-lime-400">{item.title}</h2>
                {item.release_date && (
                  <p className="mt-1 text-xs text-neutral-600">
                    {new Date(item.release_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
