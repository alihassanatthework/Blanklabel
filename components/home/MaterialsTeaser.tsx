"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    id: "dt" as const,
    title: "Direct Thermal",
    lead: "No ribbon - ideal for shipping labels.",
    points: ["Prints with heat only, no ink or ribbon", "Lowest cost per label", "Best for labels that ship within months"],
  },
  {
    id: "tt" as const,
    title: "Thermal Transfer",
    lead: "Uses a ribbon - long-lasting barcodes and inventory labels.",
    points: ["Ribbon-printed, resists heat and abrasion", "Readable for years", "Best for inventory, assets and products"],
  },
];

export function MaterialsTeaser() {
  const [active, setActive] = useState<"dt" | "tt">("dt");
  return (
    <section aria-labelledby="materials-title" className="section-y bg-white">
      <div className="container-x">
        <SectionHeading
          id="materials-title"
          eyebrow="Materials & Colors"
          title="Direct thermal or thermal transfer?"
          subtitle="Two ways to print with heat. Pick the one that matches how long your label needs to last."
        />
        <div role="radiogroup" aria-label="Highlight material" className="mb-6 inline-flex rounded-full border border-line bg-bg p-1">
          {CARDS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={active === c.id}
              onClick={() => setActive(c.id)}
              className={cn(
                "h-10 rounded-full px-4 text-sm font-semibold transition-colors duration-200 sm:px-5",
                active === c.id ? "bg-navy-700 text-white shadow-sm" : "text-ink-600 hover:text-navy-900",
              )}
            >
              {c.title}
            </button>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {CARDS.map((c) => (
            <Card
              key={c.id}
              className={cn(
                "p-6 transition-[border-color,box-shadow,opacity] duration-200 sm:p-8",
                active === c.id ? "border-navy-700 shadow-lg ring-1 ring-navy-700" : "bg-bg shadow-none",
              )}
            >
              <h3 className="text-h3">{c.title}</h3>
              <p className="mt-2 text-ink-600">{c.lead}</p>
              <ul className="mt-5 space-y-2.5">
                {c.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-[15px]">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-teal-600" strokeWidth={2.5} />
                    {pt}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <ButtonLink href="/materials-colors" variant="secondary" className="mt-8">
          Compare materials
        </ButtonLink>
      </div>
    </section>
  );
}
