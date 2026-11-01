export type InstagramPost = {
  kind: string;
  caption: string;
  image_url: string | null;
  ig_permalink: string | null;
  published_at: string;
};

// Same reasoning as lib/blogApi.ts and lib/newsFeed.ts — this repo has no
// Supabase access of its own, so it reads the main app's public,
// unauthenticated /api/public/instagram instead.
const API_BASE = "https://app.nextsole.co.uk";

export async function getInstagramFeed(limit = 5): Promise<InstagramPost[]> {
  try {
    const res = await fetch(`${API_BASE}/api/public/instagram`, { cache: "no-store" });
    if (!res.ok) return [];
    const posts: InstagramPost[] = await res.json();
    return posts.slice(0, limit);
  } catch {
    // An Instagram API outage shouldn't take the homepage down with it.
    return [];
  }
}

const KIND_LABELS: Record<string, string> = {
  archive_spotlight: "From the Vaults",
  collab_spotlight: "Collab Spotlight",
  new_releases: "New Releases",
  shoe_of_the_week: "Shoe of the Week",
  forgotten_shoes: "Slept On",
  blog_promo: "From the Blog",
  post: "Nextsole",
};

export function instagramKindLabel(kind: string): string {
  return KIND_LABELS[kind] ?? "Nextsole";
}
