export type NewsItem = {
  title: string;
  link: string;
  pubDate: string | null;
  image: string | null;
  source: string;
};

export type UpcomingRelease = {
  sku: string;
  title: string | null;
  brand: string | null;
  image: string | null;
  colourway: string | null;
  release_date: string;
};

type NewsFeedResponse = {
  news: NewsItem[];
  comingSoon: UpcomingRelease[];
};

// Reads the main app's own public, unauthenticated /api/news rather than
// re-fetching a source RSS feed directly from this repo, and rather than
// also calling /api/public/releases separately — that same endpoint
// already bundles both. Two reasons for going through the app at all: (1)
// this repo has no Supabase access by design, same as blog/catalogue; (2)
// an earlier version of this file fetched sneakernews.com directly via
// rss-parser, but the main app's own research (lib/sneakerNews.ts) found
// that exact source Cloudflare-blocks server-side fetches — confirmed
// live, not assumed — which is why the app itself switched to Hypebeast +
// Nice Kicks. Reusing /api/news means this always matches whatever the
// app is actually serving, with no risk of silently fetching a dead
// source again.
const NEWS_API = "https://app.nextsole.co.uk/api/news";
const REVALIDATE_SECONDS = 1800; // 30min — matches the app's own feel of "fresh"

export async function getNewsFeed(): Promise<NewsFeedResponse> {
  try {
    const res = await fetch(NEWS_API, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return { news: [], comingSoon: [] };
    const json = await res.json();
    const news: { title: string; link: string; publishedAt: string | null; image: string | null; source: string }[] = json.news ?? [];
    return {
      news: news.map((item) => ({
        title: item.title,
        link: item.link,
        pubDate: item.publishedAt,
        image: item.image,
        source: item.source,
      })),
      comingSoon: json.comingSoon ?? [],
    };
  } catch {
    // A feed outage shouldn't take the whole News page down — the release
    // timeline section below is independent and should still render.
    return { news: [], comingSoon: [] };
  }
}
