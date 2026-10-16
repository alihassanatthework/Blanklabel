"use client";

import Link from "next/link";
import { Check, Tag, Trash2, Truck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { ProductVisual, visualProps } from "@/components/product/ProductVisual";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { cartTotals, lineTotal, perLabel, tierFor } from "@/lib/pricing";
import { useCart } from "@/lib/store/cart";
import { cn, money, perLabelMoney } from "@/lib/utils";
import type { OrderLine, Product } from "@/types";

export function useCartLines() {
  const { byId } = useCatalog();
  const lines = useCart((s) => s.lines);
  return lines
    .map((l) => ({ ...l, product: byId(l.productId) }))
    .filter((l): l is OrderLine & { product: Product } => !!l.product);
}

export function useCartTotals(shipping = 0) {
  const { site } = useCatalog();
  const lines = useCartLines();
  const promo = useCart((s) => s.promo);
  const rate = promo ? (site.promoCodes[promo] ?? 0) : 0;
  return { lines, promo, ...cartTotals(lines, rate, shipping) };
}

export function CartLine({ line, compact }: { line: OrderLine & { product: Product }; compact?: boolean }) {
  const { setQty, remove, restore } = useCart();
  const p = line.product;
  const tier = tierFor(p, line.qty);
  return (
    <li className="flex gap-3 py-4">
      <Link href={`/product/${p.slug}`} className="w-20 shrink-0 self-start rounded-[10px] border border-line bg-bg p-1.5">
        <ProductVisual {...visualProps(p)} size="sm" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${p.slug}`} className="text-[15px] leading-snug font-semibold text-navy-900 hover:text-navy-700">
            {compact ? p.shortName : p.name}
          </Link>
          <button
            type="button"
            aria-label={`Remove ${p.shortName}`}
            onClick={() => {
              const removed = remove(p.id);
              if (removed)
                toast("Removed from cart", {
                  description: p.shortName,
                  duration: 5000,
                  action: { label: "Undo", onClick: () => restore(removed.line, removed.index) },
                });
            }}
            className="-mt-1 -mr-2 flex size-9 shrink-0 items-center justify-center rounded-full text-ink-600 hover:bg-navy-50 hover:text-danger"
          >
            <Trash2 aria-hidden className="size-4" />
          </button>
        </div>
        <p className="mt-0.5 text-[13px] text-ink-600">
          {tier.label} pricing · <span className="tabular-nums">{perLabelMoney(perLabel(p, line.qty))}</span> / label
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <Stepper size="sm" value={line.qty} onChange={(v) => setQty(p.id, v)} label={`Quantity of ${p.shortName}`} />
          <AnimatedNumber value={lineTotal(p, line.qty)} format={money} className="text-[15px] font-semibold text-navy-900" />
        </div>
      </div>
    </li>
  );
}

export function FreeShippingNote({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 rounded-[10px] bg-teal-600/10 px-3 py-2.5 text-sm font-medium text-teal-600", className)}>
      <Truck aria-hidden className="size-4 shrink-0" />
      You&apos;ve unlocked free US shipping.
    </p>
  );
}

export function PromoCode() {
  const { site } = useCatalog();
  const { promo, setPromo } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (promo)
    return (
      <div className="flex items-center justify-between rounded-[10px] border border-teal-600/30 bg-teal-600/5 px-3 py-2 text-sm">
        <span className="flex items-center gap-2 font-semibold text-teal-600">
          <Check aria-hidden className="size-4" />
          {promo} applied - {Math.round((site.promoCodes[promo] ?? 0) * 100)}% off
        </span>
        <button type="button" onClick={() => setPromo(null)} aria-label="Remove promo code" className="flex size-8 items-center justify-center rounded-full text-ink-600 hover:bg-white">
          <X aria-hidden className="size-4" />
        </button>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const c = code.trim().toUpperCase();
        if (!c) return;
        if (site.promoCodes[c] != null) {
          setPromo(c);
          setError(null);
          setCode("");
          toast.success(`${c} applied`);
        } else setError("That code isn't valid. Try WELCOME10.");
      }}
    >
      <label htmlFor="promo" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
        <Tag aria-hidden className="size-3.5" /> Promo code
      </label>
      <div className="flex gap-2">
        <input
          id="promo"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "promo-error" : undefined}
          className="h-10 min-w-0 flex-1 rounded-[10px] border border-line px-3 text-sm uppercase focus:border-navy-700 focus:outline-none aria-[invalid=true]:border-danger"
        />
        <Button type="submit" variant="secondary" size="sm">
          Apply
        </Button>
      </div>
      {error && (
        <p id="promo-error" role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}

export function OrderSummaryRows({
  subtotal,
  discount,
  shipping,
  total,
  promo,
  taxNote = "Calculated at checkout",
}: {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promo: string | null;
  taxNote?: string;
}) {
  return (
    <dl className="space-y-2 text-[15px]">
      <div className="flex justify-between">
        <dt className="text-ink-600">Subtotal</dt>
        <dd className="tabular-nums">
          <AnimatedNumber value={subtotal} format={money} />
        </dd>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-teal-600">
          <dt>Discount ({promo})</dt>
          <dd className="tabular-nums">
            -<AnimatedNumber value={discount} format={money} />
          </dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-ink-600">Shipping</dt>
        <dd className="font-medium text-teal-600">{shipping === 0 ? "Free" : money(shipping)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-600">Estimated tax</dt>
        <dd className="text-ink-600">{taxNote}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-lg font-bold text-navy-900">
        <dt>Total</dt>
        <dd className="tabular-nums">
          <AnimatedNumber value={total} format={money} />
        </dd>
      </div>
    </dl>
  );
}
