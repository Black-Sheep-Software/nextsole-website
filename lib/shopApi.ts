import type { ShopListing } from "@/lib/shopTypes";

// Same reasoning as lib/catalogueApi.ts — no Supabase access in this repo
// by design, cache: "no-store" avoids the documented dual-cache bug.
const API_BASE = "https://app.nextsole.co.uk";

export async function listShop(opts: { brand?: string; condition?: string; sizeUk?: string; includeSold?: boolean; limit?: number; offset?: number } = {}): Promise<{ items: ShopListing[]; total: number }> {
  const params = new URLSearchParams();
  if (opts.brand) params.set("brand", opts.brand);
  if (opts.condition) params.set("condition", opts.condition);
  if (opts.sizeUk) params.set("sizeUk", opts.sizeUk);
  if (opts.includeSold === false) params.set("includeSold", "false");
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.offset) params.set("offset", String(opts.offset));
  const qs = params.toString();

  const res = await fetch(`${API_BASE}/api/public/shop${qs ? `?${qs}` : ""}`, { cache: "no-store" });
  if (!res.ok) return { items: [], total: 0 };
  return res.json();
}

export async function getShopListing(id: string): Promise<ShopListing | null> {
  const res = await fetch(`${API_BASE}/api/public/shop/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}
