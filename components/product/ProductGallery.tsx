"use client";

import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductVisual, visualProps } from "./ProductVisual";

const VIEWS = [
  { id: "front", label: "Front" },
  { id: "side", label: "Side / core" },
  { id: "scene", label: "In use" },
] as const;

export function ProductGallery({ product: p }: { product: Product }) {
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("front");
  return (
    <div className="lg:sticky lg:top-[84px]">
      <div className="relative mx-auto max-w-md overflow-hidden rounded-[20px] border border-line bg-white p-6 sm:p-10 lg:max-w-none">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <ProductVisual {...visualProps(p)} view={view} size="lg" title={`${p.name} - ${VIEWS.find((v) => v.id === view)?.label} view`} />
          </m.div>
        </AnimatePresence>
      </div>
      <div className="mx-auto mt-3 grid max-w-md grid-cols-3 gap-3 lg:max-w-none" role="group" aria-label="Product views">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={view === v.id}
            onClick={() => setView(v.id)}
            className={cn(
              "rounded-[12px] border-[1.5px] bg-white p-2 transition-colors",
              view === v.id ? "border-navy-700" : "border-line hover:border-navy-700/40",
            )}
          >
            <ProductVisual {...visualProps(p)} view={v.id} size="sm" />
            <span className="mt-1 block text-xs font-medium text-ink-600">{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
