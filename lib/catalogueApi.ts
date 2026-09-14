import type { CatalogueDetail, CatalogueSummary } from "@/lib/catalogueTypes";

// Same reasoning as lib/blogApi.ts's own comment — no Supabase access in
// this repo by design, and cache: "no-store" avoids the exact dual-cache
// bug documented there (page-level ISR vs fetch-level Data Cache having
// independent clocks).
const API_BASE = "https://app.nextsole.co.uk";

export async function listCatalogue(opts: { brand?: string; limit?: number; offset?: number } = {}): Promise<{ items: CatalogueSummary[]; total: number }> {
  const params = new URLSearchParams();
  if (opts.brand) params.set("brand", opts.brand);
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.offset) params.set("offset", String(opts.offset));
  const qs = params.toString();

  const res = await fetch(`${API_BASE}/api/public/catalogue${qs ? `?${qs}` : ""}`, { cache: "no-store" });
  if (!res.ok) return { items: [], total: 0 };
  return res.json();
}

export async function getCatalogueItem(slug: string): Promise<CatalogueDetail | null> {
  const res = await fetch(`${API_BASE}/api/public/catalogue/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function listUpcomingReleases(): Promise<CatalogueSummary[]> {
  const res = await fetch(`${API_BASE}/api/public/releases`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
