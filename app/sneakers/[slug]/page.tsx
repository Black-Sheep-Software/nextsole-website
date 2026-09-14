import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getCatalogueItem } from "@/lib/catalogueApi";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCatalogueItem(slug);
  if (!item) return {};

  const url = `https://nextsole.co.uk/sneakers/${item.slug}`;
  const description = item.description ? item.description.slice(0, 160) : `${item.title} — release date, retail price and details.`;

  return {
    title: `${item.title} — Nextsole`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "Nextsole",
      title: item.title,
      description,
      images: item.image ? [{ url: item.image, width: 1200, height: 1200, alt: item.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: item.image ? [item.image] : undefined,
    },
  };
}

export default async function SneakerDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getCatalogueItem(slug);
  if (!item) notFound();

  const url = `https://nextsole.co.uk/sneakers/${item.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    brand: item.brand ? { "@type": "Brand", name: item.brand } : undefined,
    sku: item.sku,
    image: item.image || undefined,
    description: item.description || undefined,
    releaseDate: item.release_date || undefined,
    ...(item.retail_price
      ? {
          offers: {
            "@type": "Offer",
            price: item.retail_price,
            priceCurrency: item.retail_currency || "GBP",
            availability: "https://schema.org/InStoreOnly",
          },
        }
      : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <main className="mx-auto min-h-screen max-w-4xl px-4 pb-24 pt-32 sm:px-6">
        <Link href="/sneakers" className="text-sm font-semibold text-neutral-500 hover:text-lime-400">← Sneaker Database</Link>

        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-800 bg-white">
            {item.image && <Image src={item.image} alt={item.title} fill className="object-contain p-6" sizes="(max-width: 640px) 100vw, 50vw" priority />}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">{item.brand}</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">{item.title}</h1>
            {item.colourway && <p className="mt-2 text-neutral-400">{item.colourway}</p>}

            <dl className="mt-8 space-y-4 border-t border-neutral-800 pt-6">
              {item.release_date && (
                <div className="flex justify-between text-sm">
                  <dt className="text-neutral-500">Release date</dt>
                  <dd className="font-semibold">{new Date(item.release_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</dd>
                </div>
              )}
              {item.retail_price && (
                <div className="flex justify-between text-sm">
                  <dt className="text-neutral-500">Retail price</dt>
                  <dd className="font-semibold">{item.retail_currency === "USD" ? "$" : "£"}{item.retail_price}</dd>
                </div>
              )}
              {item.material && (
                <div className="flex justify-between text-sm">
                  <dt className="text-neutral-500">Material</dt>
                  <dd className="font-semibold">{item.material}</dd>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <dt className="text-neutral-500">SKU</dt>
                <dd className="font-semibold">{item.sku}</dd>
              </div>
            </dl>
          </div>
        </div>

        {item.description && (
          <div className="mt-12 max-w-prose border-t border-neutral-800 pt-8 text-neutral-300">
            <p>{item.description}</p>
          </div>
        )}

        <div className="mt-16 rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center">
          <p className="text-lg font-bold">Own this pair?</p>
          <p className="mt-2 text-sm text-neutral-400">Track it, log wears, and see what it's worth on Nextsole.</p>
          <a
            href="https://app.nextsole.co.uk"
            className="mt-5 inline-block rounded-full bg-lime-400 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-lime-300"
          >
            Get started
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
