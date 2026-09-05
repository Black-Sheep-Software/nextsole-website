import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { listBlogPosts } from "@/lib/blogApi";
import { CATEGORY_LABEL } from "@/lib/blogTypes";

export const metadata: Metadata = {
  title: "Blog — Nextsole",
  description: "Sneaker care guides, product updates, and stories from behind Nextsole.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "https://nextsole.co.uk/blog",
    siteName: "Nextsole",
    title: "Blog — Nextsole",
    description: "Sneaker care guides, product updates, and stories from behind Nextsole.",
  },
};

export default async function BlogIndexPage() {
  const posts = await listBlogPosts();

  return (
    <>
      <SiteNav />
      <main className="mx-auto min-h-screen max-w-4xl px-4 pb-24 pt-32 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">Blog</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">From Nextsole</h1>
        <p className="mt-4 max-w-lg text-neutral-400">
          Sneaker care guides, what&apos;s new in the app, and stories from behind the scenes.
        </p>

        {posts.length === 0 ? (
          <p className="mt-16 text-neutral-500">Nothing published yet — check back soon.</p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                  {post.cover_image_url && (
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  )}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-lime-400">{CATEGORY_LABEL[post.category]}</p>
                <h2 className="mt-1.5 text-xl font-bold text-white transition group-hover:text-lime-400">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-neutral-400 line-clamp-2">{post.excerpt}</p>}
                <p className="mt-2 text-xs text-neutral-600">
                  {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
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
