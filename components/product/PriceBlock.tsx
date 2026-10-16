"use client";

import { TrendingDown } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { lineTotal, nextTierNudge, perLabel, savingsPct, unitPrice } from "@/lib/pricing";
import { money, perLabelMoney } from "@/lib/utils";
import type { Product } from "@/types";

/** Live per-label price, line total and savings (number roll on change). */
export function PriceBlock({ product: p, qty, showPerLabel = true }: { product: Product; qty: number; showPerLabel?: boolean }) {
  const save = savingsPct(p, qty);
  const nudge = nextTierNudge(p, qty);
  return (
    <div aria-live="polite">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        {showPerLabel && (
          <div>
            <p className="text-sm text-ink-600">Per label</p>
            <p className="text-3xl font-extrabold text-action-600">
              <AnimatedNumber value={perLabel(p, qty)} format={perLabelMoney} />
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-ink-600">
            Total for {qty} {qty === 1 ? p.unitName : `${p.unitName}s`}
          </p>
          <p className="text-3xl font-extrabold text-navy-900">
            <AnimatedNumber value={lineTotal(p, qty)} format={money} />
          </p>
        </div>
        <div className="pb-1 text-sm text-ink-600">
          {money(unitPrice(p, qty))} per {p.unitName}
          {save > 0.005 && (
            <span className="ml-2 font-semibold text-teal-600">
              You save <AnimatedNumber value={save * 100} format={(n) => `${Math.round(n)}%`} />
            </span>
          )}
        </div>
      </div>
      {nudge && (
        <p className="mt-3 flex items-center gap-2 rounded-[10px] bg-action-500/10 px-3 py-2 text-sm font-medium text-action-600">
          <TrendingDown aria-hidden className="size-4" />
          Add {nudge.addQty} more to unlock {Math.round(nudge.pct * 100)}% off
        </p>
      )}
    </div>
  );
}
