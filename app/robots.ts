import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // /shop is live for direct-link testing only — not ready to announce.
    // Also marked noindex/nofollow on the pages themselves (belt and
    // suspenders): this stops crawling, that stops indexing even if a URL
    // leaks out before crawlers respect this.
    rules: { userAgent: "*", allow: "/", disallow: "/shop" },
    sitemap: "https://nextsole.co.uk/sitemap.xml",
  };
}
