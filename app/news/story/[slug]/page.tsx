import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getNewsStory } from "@/lib/newsFeed";

type Props = { params: Promise<{ slug: string }> };

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsStory(slug);
  if (!item) return {};

  const url = `https://nextsole.co.uk/news/story/${slug}`;
  return {
    title: `${item.title} — Nextsole`,
    description: item.excerpt || item.title,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Nextsole",
      title: item.title,
      description: item.excerpt || item.title,
      images: item.image ? [{ url: item.image, width: 1200, height: 630, alt: item.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.excerpt || item.title,
      images: item.image ? [item.image] : undefined,
    },
  };
}

export default async function NewsStoryPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsStory(slug);
  if (!item) notFound();

  return (
    <>
      <SiteNav />
      <main className="mx-auto min-h-screen max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <Link href="/news" className="text-sm font-semibold text-neutral-500 hover:text-lime-400">← News</Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">
          {item.source} · {timeAgo(item.pubDate)}
        </p>
        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{item.title}</h1>

        {item.image && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          </div>
        )}

        {item.excerpt && (
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-300">{item.excerpt}…</p>
        )}

        {/* Our own CTA comes first, the external link is secondary — the
            whole point of this page existing is that it's not the only
            interaction available right after the click. */}
        <div className="mt-12 rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center">
          <p className="text-lg font-bold">Track releases like this one</p>
          <p className="mt-2 text-sm text-neutral-400">
            Nextsole tracks your collection&apos;s value, logs wears, and tells you what&apos;s coming next.
          </p>
          <a
            href="https://app.nextsole.co.uk"
            className="mt-5 inline-block rounded-full bg-lime-400 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-lime-300"
          >
            Get started free
          </a>
        </div>

        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-lime-400"
        >
          Read the full story on {item.source} →
        </a>
      </main>
      <SiteFooter />
    </>
  );
}
