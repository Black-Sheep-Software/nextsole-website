import type { BlogPost, BlogPostSummary } from "@/lib/blogTypes";

// Reads from the main app's public, read-only, unauthenticated blog API —
// this site has no Supabase access of its own by design (see
// nextsole/app/api/public/blog's own comment).
//
// cache: "no-store" deliberately -- Next.js's own fetch-level Data Cache
// (the `next: { revalidate }` option) keys and expires independently of
// the page-level ISR cache, and on-demand revalidatePath() only clears the
// latter. Stacking both caused a real bug: publishing/deleting a post
// looked instant in testing (the very first visit to a URL always
// renders fresh, cache or not), but a *second* visit after a delete kept
// serving the old page indefinitely -- the page-level cache was
// correctly busted and re-rendered, but that re-render's own fetch() call
// still hit its untouched Data Cache entry. The one remaining cache is
// the page-level `export const revalidate` in each page file, which
// revalidatePath() does control correctly.
const API_BASE = "https://app.nextsole.co.uk";

export async function listBlogPosts(): Promise<BlogPostSummary[]> {
  const res = await fetch(`${API_BASE}/api/public/blog`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE}/api/public/blog/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}
