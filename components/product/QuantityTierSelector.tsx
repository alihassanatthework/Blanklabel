"use client";

import { cn, money, perLabelMoney } from "@/lib/utils";
import type { PriceTier } from "@/types";

/** Tier cards (radio group): units, total and per-label price, 'Save N%' vs the first tier. */
export function QuantityTierSelector({
  tiers,
  value,
  onChange,
  labelsPerUnit,
}: {
  tiers: PriceTier[];
  value: number;
  onChange: (qty: number) => void;
  labelsPerUnit: number;
}) {
  let activeIdx = 0;
  tiers.forEach((t, i) => {
    if (t.minQty <= value) activeIdx = i;
  });
  const move = (i: number) => onChange(tiers[(i + tiers.length) % tiers.length].minQty);
  return (
    <div role="radiogroup" aria-label="Quantity tier" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {tiers.map((t, i) => {
        const active = i === activeIdx;
        const save = 1 - t.unitPrice / tiers[0].unitPrice;
        return (
          <button
            key={t.minQty}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.minQty)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                move(i + 1);
                (e.currentTarget.parentElement?.children[(i + 1) % tiers.length] as HTMLElement)?.focus();
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                move(i - 1);
                (e.currentTarget.parentElement?.children[(i - 1 + tiers.length) % tiers.length] as HTMLElement)?.focus();
              }
            }}
            className={cn(
              "relative flex flex-col items-start rounded-[12px] border-[1.5px] p-3 text-left transition-[border-color,background-color,box-shadow] duration-200",
              active ? "border-navy-700 bg-navy-50 shadow-sm" : "border-line bg-white hover:border-navy-700/40",
            )}
          >
            {save > 0.005 && (
              <span className="absolute -top-2.5 right-2 rounded-full bg-teal-600 px-2 py-0.5 text-[11px] font-bold text-white">
                Save {Math.round(save * 100)}%
              </span>
            )}
            <span className="text-sm font-semibold text-navy-900">{t.label}</span>
            <span className="mt-1 text-[15px] font-bold text-navy-900 tabular-nums">{money(t.unitPrice * t.minQty)}</span>
            <span className="text-xs text-ink-600 tabular-nums">{perLabelMoney(t.unitPrice / labelsPerUnit)} / label</span>
          </button>
        );
      })}
    </div>
  );
}
