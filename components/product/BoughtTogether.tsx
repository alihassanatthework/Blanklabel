"use client";

import Link from "next/link";
import { Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { lineTotal } from "@/lib/pricing";
import { useCart } from "@/lib/store/cart";
import { useUi } from "@/lib/store/ui";
import { cn, money } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductVisual, visualProps } from "./ProductVisual";

/** This product + 2 companions, with a one-click bundle add (first tier of each). */
export function BoughtTogether({ product, companions }: { product: Product; companions: Product[] }) {
  const items = [product, ...companions.slice(0, 2)];
  const [on, setOn] = useState<string[]>(items.map((i) => i.id));
  const addMany = useCart((s) => s.addMany);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const picked = items.filter((i) => on.includes(i.id));
  const total = picked.reduce((s, p) => s + lineTotal(p, p.tiers[0].minQty), 0);
  if (items.length < 2) return null;
  return (
    <section aria-labelledby="fbt-title" className="rounded-[20px] border border-line bg-white p-5 sm:p-8">
      <h2 id="fbt-title" className="text-h3">
        Frequently bought together
      </h2>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
        <ul className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {items.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 sm:flex-1">
              {i > 0 && <Plus aria-hidden className="hidden size-5 shrink-0 text-ink-400 sm:block" />}
              <label className={cn("flex flex-1 cursor-pointer items-center gap-3 rounded-[12px] border p-3", on.includes(p.id) ? "border-navy-700/40 bg-navy-50/50" : "border-line")}>
                <input
                  type="checkbox"
                  checked={on.includes(p.id)}
                  onChange={() => setOn((s) => (s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id]))}
                  className="size-5 accent-[var(--color-navy-700)]"
                />
                <span className="w-16 shrink-0">
                  <ProductVisual {...visualProps(p)} size="sm" />
                </span>
                <span className="min-w-0 text-sm">
                  {i === 0 ? (
                    <span className="block font-semibold text-navy-900">This item: {p.shortName}</span>
                  ) : (
                    <Link href={`/product/${p.slug}`} className="block font-semibold text-navy-900 hover:underline">
                      {p.shortName}
                    </Link>
                  )}
                  <span className="text-ink-600 tabular-nums">{money(lineTotal(p, p.tiers[0].minQty))}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 lg:flex-col lg:items-end">
          <p className="text-sm text-ink-600">
            Bundle total <span className="block text-2xl font-bold text-navy-900 tabular-nums">{money(total)}</span>
          </p>
          <Button
            disabled={picked.length === 0}
            onClick={() => {
              addMany(picked.map((p) => ({ productId: p.id, qty: p.tiers[0].minQty })));
              setCartOpen(true);
            }}
          >
            <ShoppingCart aria-hidden className="size-4" />
            Add {picked.length} to cart
          </Button>
        </div>
      </div>
    </section>
  );
}
