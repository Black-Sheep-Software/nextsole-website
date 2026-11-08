import type { Metadata } from "next";
import BagDrawer from "@/components/shop/BagDrawer";
import { CartProvider } from "@/lib/cart/CartContext";

// Hidden for now — direct-link testing only, see app/robots.ts's disallow.
// noindex/nofollow here covers every page under /shop since metadata
// merges down through nested layouts.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Scoped to just the /shop subtree rather than the root layout — the rest
// of the site has no cart state and doesn't need this provider mounted.
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="shop-surface">
        {children}
        <BagDrawer />
      </div>
    </CartProvider>
  );
}
