// Mirrors the main app's lib/emailBlocks.ts EmailBlock shape — this repo
// has no direct code-sharing with the main app (separate deploy, no shared
// package), so the block type is duplicated here as the data contract for
// whatever app/api/public/blog returns. Keep in sync if the main app adds
// a new block type.
export type TextAlign = "left" | "center";

export type BlogBlock =
  | { id: string; type: "eyebrow"; text: string; align?: TextAlign }
  | { id: string; type: "heading"; text: string; align?: TextAlign }
  | { id: string; type: "text"; text: string; align?: TextAlign }
  | { id: string; type: "image"; url: string; alt: string }
  | { id: string; type: "button"; text: string; url: string }
  | { id: string; type: "divider" }
  | { id: string; type: "spacer" }
  | { id: string; type: "author"; name: string; role: string; avatarUrl: string; align?: TextAlign };

export type BlogCategory = "guides" | "product_updates" | "behind_the_scenes";

export const CATEGORY_LABEL: Record<BlogCategory, string> = {
  guides: "Guides",
  product_updates: "Product Updates",
  behind_the_scenes: "Behind the Scenes",
};

export type BlogPostSummary = {
  slug: string;
  title: string;
  category: BlogCategory;
  cover_image_url: string | null;
  excerpt: string;
  published_at: string;
};

export type BlogPost = BlogPostSummary & {
  blocks: BlogBlock[];
};
