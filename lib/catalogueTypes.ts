// Mirrors the main app's lib/publicCatalogue.ts response shape — this repo
// has no direct code-sharing with the main app (separate deploy, no shared
// package), so the type is duplicated here as the data contract.

export type CatalogueSummary = {
  slug: string;
  sku: string;
  title: string;
  brand: string | null;
  model: string | null;
  colourway: string | null;
  image: string | null;
  release_date: string | null;
  retail_price: number | null;
  retail_currency: string | null;
};

export type CatalogueDetail = CatalogueSummary & {
  description: string | null;
  material: string | null;
};
