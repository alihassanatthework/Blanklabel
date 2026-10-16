"use client";

import * as Slider from "@radix-ui/react-slider";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { cn, perLabelMoney } from "@/lib/utils";
import type { Facet, ProductFilter } from "@/types";

type MultiKey = "material" | "printer" | "core" | "width" | "length" | "perSheet";

/** Shared facet UI for the desktop sidebar and the mobile bottom sheet. */
export function FilterPanel({
  facets,
  value,
  onChange,
  idPrefix,
}: {
  facets: Facet[];
  value: ProductFilter;
  onChange: (f: ProductFilter) => void;
  idPrefix: string;
}) {
  const items = facets.map((f) => ({
    id: f.id,
    title: (
      <span className="flex items-center gap-2">
        {f.label}
        {selectedCount(f, value) > 0 && (
          <span className="rounded-full bg-navy-700 px-1.5 text-[11px] leading-[18px] font-bold text-white">
            {selectedCount(f, value)}
          </span>
        )}
      </span>
    ),
    content:
      f.type === "range" ? (
        <PriceRange facet={f} value={value} onChange={onChange} />
      ) : (
        <fieldset>
          <legend className="sr-only">{f.label}</legend>
          <ul className="space-y-0.5">
            {f.options.map((o) => {
              const key = f.id as MultiKey;
              const selected = ((value[key] as string[] | undefined) ?? []).includes(o.value);
              const id = `${idPrefix}-${f.id}-${o.value}`;
              return (
                <li key={o.value}>
                  <label
                    htmlFor={id}
                    className={cn(
                      "flex min-h-10 cursor-pointer items-center gap-3 rounded-[8px] px-1.5 text-[15px] hover:bg-navy-50",
                      o.count === 0 && !selected && "text-ink-400",
                    )}
                  >
                    <input
                      id={id}
                      type="checkbox"
                      className="peer sr-only"
                      checked={selected}
                      onChange={() => {
                        const cur = ((value[key] as string[] | undefined) ?? []).filter((x) => x !== o.value);
                        const next = selected ? cur : [...cur, o.value];
                        onChange({ ...value, [key]: next.length ? next : undefined });
                      }}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors peer-focus-visible:ring-[3px] peer-focus-visible:ring-navy-700/30",
                        selected ? "border-navy-700 bg-navy-700 text-white" : "border-ink-400 bg-white",
                      )}
                    >
                      {selected && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span className="flex-1">{o.label}</span>
                    <span className="text-xs text-ink-600 tabular-nums">{o.count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ),
  }));
  return <Accordion type="multiple" dense headingLevel={3} defaultValue={facets.map((f) => f.id)} items={items} />;
}

function selectedCount(f: Facet, v: ProductFilter) {
  if (f.type === "range") return v.priceMin != null || v.priceMax != null ? 1 : 0;
  return ((v[f.id as MultiKey] as string[] | undefined) ?? []).length;
}

function PriceRange({ facet, value, onChange }: { facet: Facet; value: ProductFilter; onChange: (f: ProductFilter) => void }) {
  const min = facet.min ?? 0;
  const max = facet.max ?? 1;
  const [local, setLocal] = useState<[number, number]>([value.priceMin ?? min, value.priceMax ?? max]);
  useEffect(() => setLocal([value.priceMin ?? min, value.priceMax ?? max]), [value.priceMin, value.priceMax, min, max]);
  if (max <= min) return <p className="text-sm text-ink-600">{perLabelMoney(min)} / label</p>;
  const step = Math.max(0.0001, Math.round(((max - min) / 100) * 10000) / 10000);
  return (
    <div className="px-1 pb-2">
      <Slider.Root
        className="relative mt-2 flex h-6 touch-none items-center select-none"
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
        value={local}
        onValueChange={(v) => setLocal([v[0], v[1]])}
        onValueCommit={([a, b]) =>
          onChange({
            ...value,
            priceMin: a <= min + step / 2 ? undefined : Number(a.toFixed(4)),
            priceMax: b >= max - step / 2 ? undefined : Number(b.toFixed(4)),
          })
        }
      >
        <Slider.Track className="relative h-1.5 grow rounded-full bg-navy-50">
          <Slider.Range className="absolute h-full rounded-full bg-navy-700" />
        </Slider.Track>
        {(["Minimum", "Maximum"] as const).map((l, i) => (
          <Slider.Thumb
            key={l}
            aria-label={`${l} price per label`}
            aria-valuetext={perLabelMoney(local[i])}
            className="block size-5 rounded-full border-2 border-navy-700 bg-white shadow-sm focus-visible:ring-[3px] focus-visible:ring-navy-700/30 focus-visible:outline-none"
          />
        ))}
      </Slider.Root>
      <div className="mt-2 flex justify-between text-sm text-ink-600 tabular-nums">
        <span>{perLabelMoney(local[0])}</span>
        <span>{perLabelMoney(local[1])}</span>
      </div>
    </div>
  );
}
