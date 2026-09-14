import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BlogBlockRenderer from "@/components/BlogBlockRenderer";
import { getBlogPost, listBlogPosts } from "@/lib/blogApi";
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
  const [post, allPosts] = await Promise.all([getBlogPost(slug), listBlogPosts()]);
  if (!post) notFound();

  // The page shell above already renders its own eyebrow (category), title,
  // and cover image. Post blocks always start with the same trio (the
  // email-block template's standard shape), so drop those to avoid showing
  // the heading/image twice.
  const bodyBlocks = post.blocks.filter(
    (b) => b.type !== "eyebrow" && b.type !== "heading" && !(b.type === "image" && b.url === post.cover_image_url)
  );

  const url = `https://nextsole.co.uk/blog/${post.slug}`;
  const otherPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

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
      {/* Two columns from lg up so a post doesn't read as a narrow strip of
          text floating in a mostly-empty wide viewport — the sidebar (share,
          category, other posts) fills the rest of the width with content
          that also surfaces more of the blog, which otherwise has no other
          entry point from a post page besides the small "← Blog" link. */}
      <main className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-32 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-16">
          <article>
            <Link href="/blog" className="text-sm font-semibold text-neutral-500 hover:text-lime-400">← Blog</Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">{CATEGORY_LABEL[post.category]}</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">{post.title}</h1>
            <p className="mt-3 text-sm text-neutral-500">
              {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>

            {post.cover_image_url && (
              <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl">
                <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 700px" priority />
              </div>
            )}

            {/* Body text stays at a narrower reading width than the header/
                hero image above, so long paragraphs don't stretch past a
                comfortable line length even inside the wider main column. */}
            <div className="mx-auto mt-8 max-w-2xl">
              <BlogBlockRenderer blocks={bodyBlocks} />
            </div>
          </article>

          <aside className="mt-16 space-y-8 border-t border-neutral-800 pt-8 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Share this post</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-lime-400 hover:text-lime-400"
                >
                  X / Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-lime-400 hover:text-lime-400"
                >
                  Facebook
                </a>
              </div>
            </div>

            {otherPosts.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">More from the blog</p>
                <div className="mt-3 space-y-5">
                  {otherPosts.map((p) => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                      {p.cover_image_url && (
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                          <Image src={p.cover_image_url} alt={p.title} fill className="object-cover transition group-hover:scale-105" sizes="280px" />
                        </div>
                      )}
                      <p className="mt-2 text-sm font-semibold text-white transition group-hover:text-lime-400">{p.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                <p className="text-sm font-semibold text-white">Track every pair you own</p>
                <p className="mt-1.5 text-sm text-neutral-400">
                  Nextsole helps you manage your collection, catch fakes, and know exactly what to wear.
                </p>
                <Link href="https://app.nextsole.co.uk/login" className="mt-3 inline-block text-sm font-semibold text-lime-400 hover:underline">
                  Get started free →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
