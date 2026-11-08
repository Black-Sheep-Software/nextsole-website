"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type CartItem = {
  listingId: string;
  title: string;
  price: number;
  currency: string;
  image: string | null;
  sizeUk: string | null;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (listingId: string) => void;
  removeItems: (listingIds: string[]) => void;
  clear: () => void;
  subtotal: number;
  bagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "nextsole_shop_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const openBag = useCallback(() => setBagOpen(true), []);
  const closeBag = useCallback(() => setBagOpen(false), []);
  const [hydrated, setHydrated] = useState(false);

  // Read empty on the server, hydrate from localStorage on mount only —
  // avoids an SSR/client hydration mismatch (the server never has a cart).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed))
          setItems(
            parsed
              .filter(
                (i): i is CartItem =>
                  i &&
                  typeof i.listingId === "string" &&
                  typeof i.title === "string" &&
                  typeof i.price === "number" &&
                  Number.isFinite(i.price) &&
                  i.price > 0 &&
                  i.currency === "GBP" &&
                  (i.image === null || typeof i.image === "string") &&
                  (i.sizeUk === null || typeof i.sizeUk === "string"),
              )
              .slice(0, 10),
          );
      }
    } catch {
      // Private window / blocked storage — just start empty.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Best-effort — losing the cart to a storage write failure isn't fatal.
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) =>
      prev.some((i) => i.listingId === item.listingId) ? prev : [...prev, item],
    );
    setBagOpen(true);
  }, []);

  const removeItem = useCallback((listingId: string) => {
    setItems((prev) => prev.filter((i) => i.listingId !== listingId));
  }, []);

  const removeItems = useCallback((listingIds: string[]) => {
    const toRemove = new Set(listingIds);
    setItems((prev) => prev.filter((i) => !toRemove.has(i.listingId)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        removeItems,
        clear,
        subtotal,
        bagOpen,
        openBag,
        closeBag,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
