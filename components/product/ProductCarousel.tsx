"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

/** Embla carousel: 4 cards desktop, 2.2 tablet, 1.3 mobile; arrows, dots, drag/swipe. */
export function ProductCarousel({ products, label }: { products: Product[]; label: string }) {
  const [ref, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    if (!api) return;
    setSnaps(api.scrollSnapList());
    setSelected(api.selectedScrollSnap());
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api, sync]);

  useEffect(() => {
    api?.reInit();
    api?.scrollTo(0, true);
  }, [api, products]);

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={ref} className="-mx-2 overflow-hidden px-2 py-2">
        <ul className="-ml-4 flex touch-pan-y lg:-ml-6">
          {products.map((p, i) => (
            <li
              key={p.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${products.length}`}
              className="min-w-0 shrink-0 grow-0 basis-[77%] pl-4 sm:basis-[45%] lg:basis-1/4 lg:pl-6"
            >
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-1">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === selected}
              onClick={() => api?.scrollTo(i)}
              className="flex size-6 items-center justify-center"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-all duration-200",
                  i === selected ? "w-6 bg-navy-700" : "w-2 bg-line",
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <ArrowBtn label="Previous products" disabled={!canPrev} onClick={() => api?.scrollPrev()}>
            <ChevronLeft aria-hidden className="size-5" />
          </ArrowBtn>
          <ArrowBtn label="Next products" disabled={!canNext} onClick={() => api?.scrollNext()}>
            <ChevronRight aria-hidden className="size-5" />
          </ArrowBtn>
        </div>
      </div>
    </div>
  );
}

function ArrowBtn({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full border border-line bg-white text-navy-700 transition-colors hover:bg-navy-50 disabled:text-ink-400 disabled:hover:bg-white"
    >
      {children}
    </button>
  );
}
