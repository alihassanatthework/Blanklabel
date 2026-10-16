"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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

export function BestSellers({ products }: { products: Product[] }) {
  const [tab, setTab] = useState("all");
  const items = products.filter((p) => tab === "all" || p.bestSellerGroup === tab);
  return (
    <section aria-labelledby="bs-title" className="section-y bg-white">
      <div className="container-x">
        <SectionHeading id="bs-title" title="Best sellers" action={{ label: "Shop all labels", href: "/shop" }} className="mb-4 lg:mb-6" />
        <Tabs tabs={TABS} value={tab} onValueChange={setTab} label="Best seller categories" className="mb-6" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <ProductCarousel products={items} label={`Best sellers: ${TABS.find((t) => t.id === tab)?.label}`} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
