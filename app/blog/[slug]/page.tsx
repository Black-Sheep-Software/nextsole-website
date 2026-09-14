import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BlogBlockRenderer from "@/components/BlogBlockRenderer";
import { getBlogPost } from "@/lib/blogApi";
import { CATEGORY_LABEL } from "@/lib/blogTypes";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  const url = `https://nextsole.co.uk/blog/${post.slug}`;
  return {
    title: `${post.title} — Nextsole`,
    description: post.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Nextsole",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  // The page shell above already renders its own eyebrow (category), title,
  // and cover image. Post blocks always start with the same trio (the
  // email-block template's standard shape), so drop those to avoid showing
  // the heading/image twice.
  const bodyBlocks = post.blocks.filter(
    (b) => b.type !== "eyebrow" && b.type !== "heading" && !(b.type === "image" && b.url === post.cover_image_url)
  );

  const url = `https://nextsole.co.uk/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_image_url || undefined,
    datePublished: post.published_at,
    dateModified: post.published_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "Nextsole", url: "https://nextsole.co.uk" },
    publisher: {
      "@type": "Organization",
      name: "Nextsole",
      logo: { "@type": "ImageObject", url: "https://nextsole.co.uk/icon-192.png" },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <main className="mx-auto min-h-screen max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <Link href="/blog" className="text-sm font-semibold text-neutral-500 hover:text-lime-400">← Blog</Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">{CATEGORY_LABEL[post.category]}</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-neutral-500">
          {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        {post.cover_image_url && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl">
            <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        )}

        {/* Body text stays at a narrower reading width than the wider
            header/hero image above, so long paragraphs don't stretch past a
            comfortable line length on large screens. */}
        <article className="mx-auto mt-8 max-w-2xl">
          <BlogBlockRenderer blocks={bodyBlocks} />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
