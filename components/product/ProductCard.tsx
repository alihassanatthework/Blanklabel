"use client";

import Link from "next/link";
import { GitCompareArrows, Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stars } from "@/components/ui/misc";
import { MATERIAL_LABEL } from "@/lib/filters";
import { fromPerLabel } from "@/lib/pricing";
import { toggleCompare, toggleWishlist } from "@/lib/store/actions";
import { useCart } from "@/lib/store/cart";
import { useCompare } from "@/lib/store/compare";
import { useHydrated, useUi } from "@/lib/store/ui";
import { useWishlist } from "@/lib/store/wishlist";
import { cn, formatInt, formatSize, perLabelMoney } from "@/lib/utils";
import type { Product } from "@/types";
import { CompatibilityChips } from "./CompatibilityChips";
import { ProductVisual, visualProps } from "./ProductVisual";

export function ProductCard({
  product: p,
  variant = "grid",
  className,
}: {
  product: Product;
  variant?: "grid" | "list" | "compact";
  className?: string;
}) {
  const hydrated = useHydrated();
  const saved = useWishlist((s) => s.ids.includes(p.id));
  const comparing = useCompare((s) => s.ids.includes(p.id));
  const add = useCart((s) => s.add);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const list = variant === "list";
  const compact = variant === "compact";

  const addToCart = () => {
    add(p.id, p.tiers[0].minQty);
    setCartOpen(true);
  };

  return (
    <Card
      as="article"
      interactive
      className={cn("group relative flex h-full overflow-hidden", list ? "flex-col sm:flex-row" : "flex-col", className)}
    >
      <div className={cn("relative bg-bg", list ? "sm:w-60 sm:shrink-0" : "", compact ? "p-4" : "p-5")}>
        <div className="transition-transform duration-[220ms] motion-safe:group-hover:scale-[1.04]">
          <ProductVisual {...visualProps(p)} size={compact ? "sm" : "md"} />
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {p.badges
            .filter((b) => b !== "made-in-usa")
            .slice(0, 1)
            .map((b) => (
              <Badge key={b} variant={b} />
            ))}
        </div>
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          <IconToggle
            label={saved && hydrated ? `Remove ${p.shortName} from wishlist` : `Save ${p.shortName} to wishlist`}
            pressed={hydrated && saved}
            onClick={() => toggleWishlist(p.id, p.shortName)}
          >
            <Heart aria-hidden className={cn("size-[18px]", hydrated && saved && "fill-action-500 text-action-500")} />
          </IconToggle>
          <IconToggle
            label={`Compare ${p.shortName}`}
            pressed={hydrated && comparing}
            onClick={() => toggleCompare(p.id, p.shortName)}
          >
            <GitCompareArrows aria-hidden className={cn("size-[18px]", hydrated && comparing && "text-navy-700")} />
          </IconToggle>
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "gap-2 p-4" : "gap-3 p-5")}>
        <div>
          <p className="text-xs font-medium text-ink-600">
            {formatSize(p.widthIn, p.lengthIn)} in · {MATERIAL_LABEL[p.material]}
          </p>
          <h3 className={cn("mt-1 leading-snug", compact ? "text-[15px]" : "text-base")} style={{ fontFamily: "var(--font-sans)" }}>
            <Link
              href={`/product/${p.slug}`}
              className="font-semibold text-navy-900 after:absolute after:inset-0 after:content-[''] hover:text-navy-700"
            >
              {p.name}
            </Link>
          </h3>
          {!compact && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-600">
              <Stars rating={p.rating} size={13} />
              <span>
                {p.rating} ({formatInt(p.reviewCount)})
              </span>
            </p>
          )}
        </div>
        {!compact && <CompatibilityChips printers={p.printers} max={3} />}
        {list && <p className="text-sm text-ink-600">{p.description}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="text-sm text-ink-600">
              From{" "}
              <span className="text-lg font-bold text-action-600 tabular-nums">{perLabelMoney(fromPerLabel(p))}</span> / label
            </p>
            <p className="text-xs text-ink-600">
              {formatInt(p.labelsPerUnit)} labels per {p.unitName}
            </p>
          </div>
          <Button size="sm" onClick={addToCart} className="relative z-10 shrink-0" aria-label={`Add ${p.shortName} to cart`}>
            <ShoppingCart aria-hidden className="size-4" />
            <span className={compact ? "sr-only sm:not-sr-only" : ""}>Add</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function IconToggle({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full bg-white/90 text-ink-600 shadow-sm ring-1 ring-line transition-colors hover:text-navy-900"
    >
      {children}
    </button>
  );
}
