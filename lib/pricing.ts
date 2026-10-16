import type { PriceTier, Product } from "@/types";

type Priced = Pick<Product, "tiers" | "labelsPerUnit">;

const round2 = (n: number) => Math.round(n * 100) / 100;

/** The highest tier with minQty <= qty. */
export function tierFor(product: Priced, qty: number): PriceTier {
  let tier = product.tiers[0];
  for (const t of product.tiers) if (t.minQty <= qty) tier = t;
  return tier;
}

export const unitPrice = (product: Priced, qty: number) => tierFor(product, qty).unitPrice;

export const lineTotal = (product: Priced, qty: number) => round2(unitPrice(product, qty) * qty);

export const perLabel = (product: Priced, qty: number) => unitPrice(product, qty) / product.labelsPerUnit;

export const savingsPct = (product: Priced, qty: number) => 1 - unitPrice(product, qty) / product.tiers[0].unitPrice;

/** When within 2 units of the next tier, how many more to add and the % off that unlocks. */
export function nextTierNudge(product: Priced, qty: number): { addQty: number; pct: number } | null {
  const next = product.tiers.find((t) => t.minQty > qty);
  if (!next) return null;
  const addQty = next.minQty - qty;
  if (addQty > 2) return null;
  return { addQty, pct: 1 - next.unitPrice / product.tiers[0].unitPrice };
}

/** Lowest per-label price across tiers (cards: 'From $0.030 / label'). */
export const fromPerLabel = (product: Priced) =>
  Math.min(...product.tiers.map((t) => t.unitPrice / product.labelsPerUnit));

export const lowestUnitPrice = (product: Priced) => Math.min(...product.tiers.map((t) => t.unitPrice));

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export function cartTotals(
  lines: { product: Priced; qty: number }[],
  promoRate: number,
  shipping: number,
): CartTotals {
  const subtotal = round2(lines.reduce((s, l) => s + lineTotal(l.product, l.qty), 0));
  const discount = round2(subtotal * promoRate);
  return { subtotal, discount, shipping, total: round2(subtotal - discount + shipping) };
}
