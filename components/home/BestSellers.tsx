"use client";

import * as m from "motion/react-m";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tabs } from "@/components/ui/Tabs";
import type { Product } from "@/types";

const TABS = [
  { id: "all", label: "All" },
  { id: "shipping", label: "Shipping labels" },
  { id: "barcode", label: "Barcode & product" },
  { id: "sheets", label: "Sheets" },
];

/** Tab change cross-fades the carousel track (150 ms). */
export function BestSellers({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="bs-title" className="section-y bg-white">
      <div className="container-x">
        <SectionHeading id="bs-title" title="Best sellers" action={{ label: "Shop all labels", href: "/shop" }} className="mb-4 lg:mb-6" />
        <Tabs
          label="Best seller categories"
          tabs={TABS.map((t) => ({
            ...t,
            content: (
              <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                <ProductCarousel
                  products={products.filter((p) => t.id === "all" || p.bestSellerGroup === t.id)}
                  label={`Best sellers: ${t.label}`}
                />
              </m.div>
            ),
          }))}
        />
      </div>
    </section>
  );
}
