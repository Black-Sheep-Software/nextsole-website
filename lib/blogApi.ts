import type { BlogPost, BlogPostSummary } from "@/lib/blogTypes";

// Reads from the main app's public, read-only, unauthenticated blog API —
// this site has no Supabase access of its own by design (see
// nextsole/app/api/public/blog's own comment). ISR via `next.revalidate`
// keeps pages reasonably fresh without hitting the main app on every request.
const API_BASE = "https://app.nextsole.co.uk";
const REVALIDATE_SECONDS = 300;

export async function listBlogPosts(): Promise<BlogPostSummary[]> {
  const res = await fetch(`${API_BASE}/api/public/blog`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) return [];
  return res.json();
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE}/api/public/blog/${encodeURIComponent(slug)}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) return null;
  return res.json();
}
