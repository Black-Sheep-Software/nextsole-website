import { MetadataRoute } from "next";
import { listBlogPosts } from "@/lib/blogApi";
import { listCatalogue } from "@/lib/catalogueApi";

const SITE_URL = "https://nextsole.co.uk";

// Pages through the full catalogue rather than a single capped request —
// there are over a thousand rows, well past the public API's per-request cap.
async function listAllCatalogueSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let offset = 0;
  const limit = 100;
  for (;;) {
    const { items, total } = await listCatalogue({ limit, offset });
    slugs.push(...items.map((item) => item.slug));
    offset += limit;
    if (offset >= total || items.length === 0) break;
  }
  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, catalogueSlugs] = await Promise.all([listBlogPosts(), listAllCatalogueSlugs()]);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/sneakers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/releases`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...catalogueSlugs.map((slug) => ({
      url: `${SITE_URL}/sneakers/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
