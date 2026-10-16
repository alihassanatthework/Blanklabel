"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ProductVisual, visualProps } from "@/components/product/ProductVisual";
import { COMPARE_MAX, useCompare } from "@/lib/store/compare";
import { useHydrated } from "@/lib/store/ui";
import { buttonClass } from "@/components/ui/Button";
import { useCatalog } from "./CatalogProvider";

/** Floating compare tray - appears when 1+ products are selected anywhere on the site. */
export function CompareTray() {
  const { ids, remove, clear } = useCompare();
  const { byId } = useCatalog();
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const show = hydrated && ids.length > 0 && pathname !== "/compare" && !pathname.startsWith("/checkout");
  const items = ids.map(byId).filter(Boolean);

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          aria-label="Compare products"
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 24 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-3xl rounded-[16px] border border-line bg-white p-3 shadow-lg sm:inset-x-6 [[data-stickybar]_&]:bottom-[84px] lg:[[data-stickybar]_&]:bottom-3"
          data-compare-tray
        >
          <div className="flex items-center gap-3">
            <ul className="flex min-w-0 flex-1 gap-2">
              {items.map((p) => (
                <li key={p!.id} className="relative w-14 shrink-0 rounded-[10px] border border-line bg-bg p-1 sm:w-16">
                  <ProductVisual {...visualProps(p!)} size="sm" title={p!.shortName} />
                  <button
                    type="button"
                    onClick={() => remove(p!.id)}
                    aria-label={`Remove ${p!.shortName} from compare`}
                    className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-navy-900 text-white"
                  >
                    <X aria-hidden className="size-3" />
                  </button>
                </li>
              ))}
              {Array.from({ length: COMPARE_MAX - items.length }, (_, i) => (
                <li key={i} aria-hidden className="hidden w-16 shrink-0 rounded-[10px] border border-dashed border-line sm:block" />
              ))}
            </ul>
            <button type="button" onClick={clear} className="hidden text-sm font-medium text-ink-600 hover:text-navy-700 sm:block">
              Clear
            </button>
            <Link href="/compare" className={buttonClass("navy", "sm")}>
              Compare ({items.length})
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
