"use client";

import { useRouter } from "next/navigation";
import { Printer as PrinterIcon, Search } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { SelectControl } from "@/components/ui/Input";
import { getProducts } from "@/lib/data";
import { SIZE_OPTIONS } from "@/lib/filters";
import { cn } from "@/lib/utils";
import type { Printer, PrinterId } from "@/types";

/** Hero card: brand + optional size -> /shop?printer=&size=, with a live matching-product count. */
export function PrinterFinderCard({ printers, className }: { printers: Printer[]; className?: string }) {
  const router = useRouter();
  const [brand, setBrand] = useState<PrinterId | "">("");
  const [size, setSize] = useState("");
  const [count, setCount] = useState(16);
  const uid = useId();

  useEffect(() => {
    let alive = true;
    getProducts({
      printer: brand ? [brand] : undefined,
      size: size && size !== "Other" ? size : undefined,
    }).then((r) => alive && setCount(r.total));
    return () => {
      alive = false;
    };
  }, [brand, size]);

  const go = () => {
    const sp = new URLSearchParams();
    if (brand) sp.set("printer", brand);
    if (size && size !== "Other") sp.set("size", size);
    router.push(`/shop${sp.size ? `?${sp}` : ""}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      aria-labelledby={`${uid}-title`}
      className={cn("rounded-[20px] border border-line bg-white p-5 shadow-lg sm:p-6", className)}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-navy-50 text-navy-700">
          <PrinterIcon aria-hidden className="size-5" strokeWidth={1.75} />
        </span>
        <h2 id={`${uid}-title`} className="text-h4">
          Find labels for your printer
        </h2>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-brand`} className="mb-1.5 block text-sm font-medium">
            <span className="text-ink-600">1.</span> Printer brand
          </label>
          <SelectControl
            id={`${uid}-brand`}
            value={brand}
            onChange={(e) => setBrand(e.target.value as PrinterId)}
            placeholder="Choose brand"
            options={printers.map((p) => ({ value: p.id, label: p.name === "Dymo 4XL" ? "Dymo" : p.name }))}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-size`} className="mb-1.5 block text-sm font-medium">
            <span className="text-ink-600">2.</span> Label size <span className="font-normal text-ink-600">(optional)</span>
          </label>
          <SelectControl
            id={`${uid}-size`}
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Any size"
            options={SIZE_OPTIONS}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-600" aria-live="polite">
          <AnimatedNumber value={count} className="text-base font-bold text-navy-900" /> matching product{count === 1 ? "" : "s"}
        </p>
        <Button type="submit" disabled={count === 0}>
          <Search aria-hidden className="size-4" />
          Show matching labels
        </Button>
      </div>
    </form>
  );
}
