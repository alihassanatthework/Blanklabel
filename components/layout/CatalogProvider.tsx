"use client";

import { createContext, useContext, useMemo } from "react";
import type { Category, Product, SiteConfig } from "@/types";

interface Catalog {
  products: Product[];
  categories: Category[];
  site: SiteConfig;
  byId: (id: string) => Product | undefined;
}

const Ctx = createContext<Catalog | null>(null);

/** Catalogue loaded once in the root layout via lib/data and shared with client components. */
export function CatalogProvider({
  products,
  categories,
  site,
  children,
}: {
  products: Product[];
  categories: Category[];
  site: SiteConfig;
  children: React.ReactNode;
}) {
  const value = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return { products, categories, site, byId: (id: string) => map.get(id) };
  }, [products, categories, site]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCatalog must be used inside CatalogProvider");
  return c;
}
