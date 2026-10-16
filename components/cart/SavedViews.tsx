"use client";

import Link from "next/link";
import { GitCompareArrows, Heart, ShoppingCart, X } from "lucide-react";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductVisual, visualProps } from "@/components/product/ProductVisual";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MATERIAL_LABEL, PRINTER_LABEL } from "@/lib/filters";
import { fromPerLabel } from "@/lib/pricing";
import { COMPARE_MAX, useCompare } from "@/lib/store/compare";
import { useCart } from "@/lib/store/cart";
import { useHydrated, useUi } from "@/lib/store/ui";
import { useWishlist } from "@/lib/store/wishlist";
import { formatInt, formatSize, perLabelMoney } from "@/lib/utils";
import type { Product } from "@/types";

function Empty({ icon: Icon, title, text }: { icon: typeof Heart; title: string; text: string }) {
  return (
    <Card className="mt-8 flex flex-col items-center gap-4 px-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700">
        <Icon aria-hidden className="size-7" strokeWidth={1.75} />
      </span>
      <p className="text-h3">{title}</p>
      <p className="max-w-md text-ink-600">{text}</p>
      <ButtonLink href="/shop">Shop labels</ButtonLink>
    </Card>
  );
}

export function WishlistView() {
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const { byId } = useCatalog();
  if (!hydrated) return <div className="mt-8 h-64 animate-pulse rounded-[16px] bg-white" aria-hidden />;
  const items = ids.map(byId).filter((p): p is Product => !!p);
  if (!items.length) return <Empty icon={Heart} title="Your wishlist is empty" text="Tap the heart on any product to save it here for later." />;
  return (
    <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}

export function CompareView() {
  const hydrated = useHydrated();
  const { ids, remove, clear } = useCompare();
  const { byId } = useCatalog();
  const add = useCart((s) => s.add);
  const setCartOpen = useUi((s) => s.setCartOpen);
  if (!hydrated) return <div className="mt-8 h-64 animate-pulse rounded-[16px] bg-white" aria-hidden />;
  const items = ids.map(byId).filter((p): p is Product => !!p);
  if (!items.length)
    return <Empty icon={GitCompareArrows} title="Nothing to compare yet" text={`Use the compare icon on up to ${COMPARE_MAX} products to see them side by side.`} />;

  const rows: { label: string; get: (p: Product) => React.ReactNode }[] = [
    { label: "Price per label", get: (p) => <span className="font-bold text-action-600">From {perLabelMoney(fromPerLabel(p))}</span> },
    { label: "Material", get: (p) => MATERIAL_LABEL[p.material] },
    { label: "Size", get: (p) => `${formatSize(p.widthIn, p.lengthIn)} in` },
    { label: "Core", get: (p) => (p.coreIn ? `${p.coreIn} in` : "N/A") },
    { label: "Labels per pack", get: (p) => `${formatInt(p.labelsPerUnit)} per ${p.unitName}` },
    { label: "Printers", get: (p) => p.printers.map((x) => PRINTER_LABEL[x]).join(", ") },
  ];

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-ink-600">
          Comparing {items.length} of {COMPARE_MAX}
        </p>
        <Button variant="ghost" onClick={clear}>
          Clear all
        </Button>
      </div>
      <div className="scroll-fade overflow-x-auto rounded-[16px] border border-line bg-white shadow-sm md:[mask-image:none]">
        <table className="w-full min-w-[640px] table-fixed text-left">
          <caption className="sr-only">Product comparison</caption>
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-line">
              <td className="w-40 p-4" />
              {items.map((p) => (
                <th key={p.id} scope="col" className="p-4 align-top">
                  <div className="relative">
                    <button
                      type="button"
                      aria-label={`Remove ${p.shortName}`}
                      onClick={() => remove(p.id)}
                      className="absolute -top-1 -right-1 flex size-8 items-center justify-center rounded-full bg-white text-ink-600 shadow-sm ring-1 ring-line hover:text-danger"
                    >
                      <X aria-hidden className="size-4" />
                    </button>
                    <div className="mx-auto w-28 rounded-[10px] bg-bg p-2">
                      <ProductVisual {...visualProps(p)} size="sm" />
                    </div>
                    <Link href={`/product/${p.slug}`} className="mt-3 block text-[15px] leading-snug font-semibold text-navy-900 hover:underline">
                      {p.name}
                    </Link>
                    <Button
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => {
                        add(p.id, p.tiers[0].minQty);
                        setCartOpen(true);
                      }}
                    >
                      <ShoppingCart aria-hidden className="size-4" /> Add
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label} className={i % 2 ? "" : "bg-navy-50/60"}>
                <th scope="row" className="p-4 text-sm font-semibold text-ink-600">
                  {r.label}
                </th>
                {items.map((p) => (
                  <td key={p.id} className="p-4 text-[15px]">
                    {r.get(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
