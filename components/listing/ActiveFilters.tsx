"use client";

import { X } from "lucide-react";
import { MATERIAL_LABEL, PRINTER_LABEL, USE_LABEL, activeFilterCount } from "@/lib/filters";
import { perLabelMoney } from "@/lib/utils";
import type { Material, PrinterId, ProductFilter } from "@/types";

type Chip = { key: string; label: string; next: ProductFilter };

export function ActiveFilters({ value, onChange }: { value: ProductFilter; onChange: (f: ProductFilter) => void }) {
  if (activeFilterCount(value) === 0) return null;
  const chips: Chip[] = [];
  const without = <K extends keyof ProductFilter>(k: K, v?: string): ProductFilter => {
    const cur = value[k];
    if (Array.isArray(cur) && v != null) {
      const left = (cur as string[]).filter((x) => x !== v);
      return { ...value, [k]: left.length ? left : undefined };
    }
    return { ...value, [k]: undefined };
  };
  value.printer?.forEach((v) => chips.push({ key: `p-${v}`, label: `Printer: ${PRINTER_LABEL[v as PrinterId]}`, next: without("printer", v) }));
  if (value.model) chips.push({ key: "model", label: `Model: ${value.model}`, next: without("model") });
  if (value.size) chips.push({ key: "size", label: `Size: ${value.size.replace("x", " x ")}`, next: without("size") });
  if (value.use) chips.push({ key: "use", label: USE_LABEL[value.use], next: without("use") });
  value.material?.forEach((v) => chips.push({ key: `m-${v}`, label: MATERIAL_LABEL[v as Material], next: without("material", v) }));
  value.core?.forEach((v) => chips.push({ key: `c-${v}`, label: v === "na" ? "No core" : `${v} in core`, next: without("core", v) }));
  value.width?.forEach((v) => chips.push({ key: `w-${v}`, label: `Width ${v} in`, next: without("width", v) }));
  value.length?.forEach((v) => chips.push({ key: `l-${v}`, label: `Length ${v} in`, next: without("length", v) }));
  value.perSheet?.forEach((v) => chips.push({ key: `s-${v}`, label: `${v} per sheet`, next: without("perSheet", v) }));
  if (value.priceMin != null || value.priceMax != null)
    chips.push({
      key: "price",
      label: `${value.priceMin != null ? perLabelMoney(value.priceMin) : "Any"} - ${value.priceMax != null ? perLabelMoney(value.priceMax) : "Any"} / label`,
      next: { ...value, priceMin: undefined, priceMax: undefined },
    });

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onChange(c.next)}
          aria-label={`Remove filter ${c.label}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-navy-700 pr-2 pl-3 text-[13px] font-medium text-white hover:bg-navy-900"
        >
          {c.label}
          <X aria-hidden className="size-3.5" />
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange({ sort: value.sort })}
        className="h-8 px-2 text-[13px] font-semibold text-navy-700 underline-offset-2 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
