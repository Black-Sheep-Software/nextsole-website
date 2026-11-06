export type ShopListing = {
  id: string;
  sku: string;
  title: string;
  brand: string | null;
  model: string | null;
  colourway: string | null;
  size_uk: string | null;
  size_us: string | null;
  size_eu: string | null;
  condition: string;
  condition_notes: string | null;
  price: number;
  currency: string;
  images: string[];
  status: string;
  retail_price: number | null;
  retail_currency: string | null;
};
