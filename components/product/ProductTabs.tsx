"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { Stars } from "@/components/ui/misc";
import { Tabs } from "@/components/ui/Tabs";
import { PRINTER_LABEL, PRINTER_ORDER } from "@/lib/filters";
import type { Product, Review, SiteConfig } from "@/types";
import { SpecsTable } from "./SpecsTable";

export function ProductTabs({ product: p, site, reviews }: { product: Product; site: SiteConfig; reviews: Review[] }) {
  return (
    <Tabs
      label="Product details"
      tabs={[
        {
          id: "description",
          label: "Description",
          content: (
            <div className="grid gap-8 lg:grid-cols-2">
              <p className="text-ink-600">{p.description}</p>
              <ul className="space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-teal-600" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
        { id: "specs", label: "Specifications", content: <SpecsTable product={p} /> },
        {
          id: "compat",
          label: "Compatibility",
          content: (
            <div>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {PRINTER_ORDER.map((id) => {
                  const ok = p.printers.includes(id);
                  return (
                    <li key={id} className={`flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5 ${ok ? "border-teal-600/30 bg-teal-600/5" : "border-line text-ink-400"}`}>
                      {ok ? (
                        <Check aria-hidden className="size-4 text-teal-600" strokeWidth={2.5} />
                      ) : (
                        <X aria-hidden className="size-4" />
                      )}
                      <span className="font-medium">{PRINTER_LABEL[id]}</span>
                      <span className="sr-only">{ok ? "compatible" : "not compatible"}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-sm text-ink-600">
                {p.coreIn === 3 && "3-inch cores fit Zebra industrial printers only. "}
                {p.material === "thermal-transfer" && "Thermal transfer labels need a printer with a ribbon. "}
                Not sure?{" "}
                <Link href="/printer-finder" className="font-semibold text-navy-700 underline">
                  Use the printer finder
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: "shipping",
          label: "Shipping & Returns",
          content: (
            <div className="space-y-3 text-ink-600">
              <p>
                <strong className="text-navy-900">{site.shippingLabel}.</strong> Orders ship from our factory in Charlotte, NC, usually the
                same business day.{" "}
                <Link href="/shipping" className="font-semibold text-navy-700 underline">
                  Shipping and Deliveries
                </Link>
              </p>
              <p>
                <strong className="text-navy-900">{site.returnsLabel}.</strong> Return unused labels within {site.returnsDays} days.{" "}
                <Link href="/returns" className="font-semibold text-navy-700 underline">
                  Returns and Refunds
                </Link>
              </p>
            </div>
          ),
        },
        {
          id: "reviews",
          label: "Reviews",
          content: (
            <div>
              <div className="flex items-center gap-3">
                <Stars rating={p.rating} size={20} />
                <span className="text-lg font-bold text-navy-900">{p.rating} out of 5</span>
                <span className="text-ink-600">({p.reviewCount} reviews)</span>
              </div>
              <p className="mt-1 text-sm text-ink-600">Demo ratings and sample reviews - real reviews connect after approval.</p>
              <ul className="mt-5 grid gap-4 md:grid-cols-3">
                {reviews.slice(0, 3).map((r) => (
                  <li key={r.id} className="rounded-[12px] border border-line p-4">
                    <Stars rating={r.rating} size={14} />
                    <p className="mt-2 text-[15px]">{r.text}</p>
                    <p className="mt-2 text-sm text-ink-600">
                      {r.name} · {r.business}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
      ]}
    />
  );
}
