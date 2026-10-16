"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BadgeDollarSign, Check, GitCompareArrows, Heart, ShoppingCart, Truck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/misc";
import { Stepper } from "@/components/ui/Stepper";
import { lineTotal } from "@/lib/pricing";
import { toggleCompare, toggleWishlist } from "@/lib/store/actions";
import { useCart } from "@/lib/store/cart";
import { useCompare } from "@/lib/store/compare";
import { flyToCart, useHydrated, useUi } from "@/lib/store/ui";
import { useWishlist } from "@/lib/store/wishlist";
import { cn, formatInt, money } from "@/lib/utils";
import type { Product, SiteConfig } from "@/types";
import { CompatibilityChips } from "./CompatibilityChips";
import { PriceBlock } from "./PriceBlock";
import { QuantityTierSelector } from "./QuantityTierSelector";

export function BuyBox(props: { product: Product; site: SiteConfig }) {
  return (
    <Suspense fallback={<BuyBoxInner {...props} initialQty={props.product.tiers[0].minQty} />}>
      <QtyFromUrl {...props} />
    </Suspense>
  );
}

/** ?qty= preselects a tier. */
function QtyFromUrl(props: { product: Product; site: SiteConfig }) {
  const sp = useSearchParams();
  const q = Number(sp.get("qty"));
  const initial = Number.isFinite(q) && q >= 1 ? Math.min(999, Math.floor(q)) : props.product.tiers[0].minQty;
  return <BuyBoxInner key={initial} {...props} initialQty={initial} />;
}

function BuyBoxInner({ product: p, site, initialQty }: { product: Product; site: SiteConfig; initialQty: number }) {
  const [qty, setQty] = useState(initialQty);
  const [added, setAdded] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const add = useCart((s) => s.add);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const hydrated = useHydrated();
  const saved = useWishlist((s) => s.ids.includes(p.id));
  const comparing = useCompare((s) => s.ids.includes(p.id));

  const addToCart = (from: HTMLElement | null) => {
    add(p.id, qty);
    setAdded(true);
    flyToCart(from);
    setTimeout(() => setCartOpen(true), 450);
    setTimeout(() => setAdded(false), 1600);
  };

  // Sticky bar: always below lg; on desktop once the buy button scrolls out of view.
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBarVisible(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    document.body.dataset.stickybar = "1";
    return () => {
      delete document.body.dataset.stickybar;
    };
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {p.badges.map((b) => (
          <Badge key={b} variant={b} />
        ))}
      </div>
      <h1 className="text-h2 mt-3 lg:text-[34px]">{p.name}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
        <span>
          SKU <span className="font-medium text-ink-900">{p.sku}</span>
        </span>
        <a href="#details" className="flex items-center gap-1.5 hover:text-navy-700">
          <Stars rating={p.rating} size={15} />
          {p.rating} ({formatInt(p.reviewCount)} reviews · demo)
        </a>
      </div>
      <p className="mt-4 text-ink-600">{p.description}</p>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-navy-900">Fits these printers</p>
        <CompatibilityChips printers={p.printers} size="md" />
      </div>

      <div className="mt-6 border-t border-dashed border-line pt-6">
        <p className="mb-3 text-sm font-semibold text-navy-900">
          Choose a quantity <span className="font-normal text-ink-600">({formatInt(p.labelsPerUnit)} labels per {p.unitName})</span>
        </p>
        <QuantityTierSelector tiers={p.tiers} value={qty} onChange={setQty} labelsPerUnit={p.labelsPerUnit} />
      </div>

      <div className="mt-6">
        <PriceBlock product={p} qty={qty} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Stepper value={qty} onChange={setQty} label={`Number of ${p.unitName}s`} />
        <Button ref={btnRef} onClick={(e) => addToCart(e.currentTarget)} className="min-w-[180px] flex-1 overflow-hidden" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="ok" className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Check aria-hidden className="size-5" strokeWidth={3} /> Added
              </motion.span>
            ) : (
              <motion.span key="add" className="flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                <ShoppingCart aria-hidden className="size-5" /> Add to cart
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
        <button
          type="button"
          aria-pressed={hydrated && saved}
          aria-label={hydrated && saved ? "Remove from wishlist" : "Save to wishlist"}
          onClick={() => toggleWishlist(p.id, p.shortName)}
          className="flex size-12 items-center justify-center rounded-[10px] border border-line bg-white text-ink-600 hover:bg-navy-50 hover:text-navy-900"
        >
          <Heart aria-hidden className={cn("size-5", hydrated && saved && "fill-action-500 text-action-500")} />
        </button>
        <button
          type="button"
          aria-pressed={hydrated && comparing}
          aria-label={hydrated && comparing ? "Remove from compare" : "Add to compare"}
          onClick={() => toggleCompare(p.id, p.shortName)}
          className={cn(
            "flex size-12 items-center justify-center rounded-[10px] border bg-white hover:bg-navy-50",
            hydrated && comparing ? "border-navy-700 text-navy-700" : "border-line text-ink-600",
          )}
        >
          <GitCompareArrows aria-hidden className="size-5" />
        </button>
      </div>

      <ul className="mt-6 space-y-2.5 rounded-[12px] bg-bg p-4 text-sm">
        <li className="flex items-center gap-2.5 font-medium text-navy-900">
          <Truck aria-hidden className="size-4 text-teal-600" />
          {site.shippingLabel} - ships from Charlotte, NC
        </li>
        <li className="flex items-center gap-2.5">
          <BadgeDollarSign aria-hidden className="size-4 text-teal-600" />
          <span>
            Seen it cheaper?{" "}
            <Link href="/about#price-beat" className="font-semibold text-navy-700 underline-offset-2 hover:underline">
              Our Price Beat Promise
            </Link>
          </span>
        </li>
      </ul>

      {/* Sticky buy bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 shadow-[0_-8px_24px_rgba(11,31,58,0.08)] backdrop-blur transition-[transform,visibility] duration-200",
          barVisible ? "translate-y-0" : "lg:invisible lg:translate-y-full",
        )}
      >
        <div className="container-x flex h-[72px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-navy-900">{p.shortName}</p>
            <p className="text-sm text-ink-600 tabular-nums">
              {qty} × {p.unitName} · <span className="font-bold text-navy-900">{money(lineTotal(p, qty))}</span>
            </p>
          </div>
          <Button size="sm" onClick={(e) => addToCart(e.currentTarget)}>
            {added ? <Check aria-hidden className="size-4" strokeWidth={3} /> : <ShoppingCart aria-hidden className="size-4" />}
            {added ? "Added" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
