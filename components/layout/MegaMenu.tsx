"use client";

import Link from "next/link";
import { ArrowRight, Printer } from "lucide-react";
import { categoryHref } from "@/lib/data/categories";
import { MENU_TAGLINES, PRINTER_MENU } from "@/lib/nav";
import { CategoryIcon } from "@/components/ui/icons";
import { useCatalog } from "./CatalogProvider";

export function ShopMenuPanel() {
  const { categories } = useCatalog();
  const columns = [
    { title: "Fanfold", href: "/shop/fanfold", items: categories.filter((c) => c.parentId === "fanfold") },
    { title: "Rolls", href: "/shop/rolls", items: categories.filter((c) => c.parentId === "rolls") },
    {
      title: "Integrated",
      href: "/shop/integrated-shipping-labels",
      items: categories.filter((c) => c.id === "integrated-shipping-labels"),
    },
    { title: "Sheets", href: "/shop/sheet-labels", items: categories.filter((c) => c.id === "sheet-labels") },
  ];
  return (
    <div className="grid grid-cols-[repeat(4,minmax(0,1fr))_280px] gap-6">
      {columns.map((col) => (
        <div key={col.title}>
          <Link href={col.href} className="mb-3 block text-xs font-semibold tracking-[0.12em] text-ink-600 uppercase hover:text-navy-700">
            {col.title}
          </Link>
          <ul className="space-y-1">
            {col.items.map((c) => (
              <li key={c.id}>
                <Link href={categoryHref(c)} className="group flex gap-3 rounded-[10px] p-2.5 hover:bg-navy-50 focus-visible:bg-navy-50">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-navy-50 text-navy-700 group-hover:bg-white">
                    <CategoryIcon name={c.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-navy-900">{c.name}</span>
                    <span className="block text-[13px] leading-snug text-ink-600">{MENU_TAGLINES[c.id]}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link
        href="/printer-finder"
        className="group flex flex-col justify-between rounded-[16px] bg-navy-900 p-5 text-white"
      >
        <Printer aria-hidden className="size-8 text-action-bright" strokeWidth={1.75} />
        <span>
          <span className="mt-6 block text-xs font-semibold tracking-[0.12em] text-white/60 uppercase">Not sure?</span>
          <span className="mt-1 block font-[family-name:var(--font-jakarta)] text-lg font-bold">Find labels for your printer</span>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-action-bright">
            Open printer finder
            <ArrowRight aria-hidden className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
          </span>
        </span>
      </Link>
      <Link href="/shop" className="col-span-4 -mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-navy-700">
        <span className="link-underline">View all products</span>
        <ArrowRight aria-hidden className="size-4" />
      </Link>
    </div>
  );
}

export function PrinterMenuPanel() {
  return (
    <div>
      <p className="mb-4 text-sm text-ink-600">Pick your printer to see labels guaranteed to fit.</p>
      <ul className="grid grid-cols-7 gap-3">
        {PRINTER_MENU.map((p) => (
          <li key={p.id}>
            <Link
              href={`/shop?printer=${p.id}`}
              className="flex h-24 flex-col items-center justify-center gap-2 rounded-[12px] border border-line text-[15px] font-semibold text-navy-900 transition-colors hover:border-navy-700/30 hover:bg-navy-50 focus-visible:bg-navy-50"
            >
              <Printer aria-hidden className="size-5 text-navy-700" strokeWidth={1.75} />
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/printer-finder" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700">
        <span className="link-underline">Not sure which labels fit? Use the printer finder</span>
        <ArrowRight aria-hidden className="size-4" />
      </Link>
    </div>
  );
}
