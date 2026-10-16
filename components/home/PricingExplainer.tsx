"use client";

import * as Slider from "@radix-ui/react-slider";
import { motion } from "motion/react";
import { useState } from "react";
import { ProductVisual, visualProps } from "@/components/product/ProductVisual";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { lineTotal, perLabel, savingsPct } from "@/lib/pricing";
import { durations, ease } from "@/lib/motion";
import { money, perLabelMoney } from "@/lib/utils";
import type { Product } from "@/types";

const STEPS = [
  { title: "Pick your label", text: "Choose the size and format that fits your printer." },
  { title: "Choose a quantity", text: "Every product has clear quantity tiers - no hidden price ranges." },
  { title: "Save automatically", text: "The per-label price drops as soon as you reach the next tier." },
];

/** Interactive savings widget for the featured 4x6 Direct Thermal Fanfold. */
export function PricingExplainer({ product: p }: { product: Product }) {
  const [i, setI] = useState(1);
  const tier = p.tiers[i];
  const qty = tier.minQty;
  const saved = savingsPct(p, qty);
  const maxSaved = savingsPct(p, p.tiers[p.tiers.length - 1].minQty);
  return (
    <section aria-labelledby="pricing-title" className="section-y">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-action-600 uppercase">Buy more. Spend less.</p>
          <h2 id="pricing-title" className="text-h2">
            The more you stock, the less you pay
          </h2>
          <ol className="mt-8 space-y-6">
            {STEPS.map((s, n) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-700 font-[family-name:var(--font-jakarta)] font-bold text-white">
                  {n + 1}
                </span>
                <span>
                  <span className="block text-h4">{s.title}</span>
                  <span className="mt-1 block text-ink-600">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="rounded-[20px] border border-line bg-white p-5 shadow-md sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-24 shrink-0 rounded-[12px] bg-bg p-2">
              <ProductVisual {...visualProps(p)} size="sm" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-ink-600 uppercase">Featured</p>
              <p className="font-semibold text-navy-900">{p.name}</p>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-baseline justify-between">
              <label id="tier-label" className="text-sm font-medium">
                Quantity
              </label>
              <span className="text-sm font-semibold text-navy-900">{tier.label}</span>
            </div>
            <Slider.Root
              className="relative mt-4 flex h-6 touch-none items-center select-none"
              min={0}
              max={p.tiers.length - 1}
              step={1}
              value={[i]}
              onValueChange={([v]) => setI(v)}
              aria-labelledby="tier-label"
            >
              <Slider.Track className="relative h-2 grow rounded-full bg-navy-50">
                <Slider.Range className="absolute h-full rounded-full bg-navy-700" />
              </Slider.Track>
              <Slider.Thumb
                aria-label="Quantity tier"
                aria-valuetext={tier.label}
                className="block size-6 rounded-full border-2 border-navy-700 bg-white shadow-md focus-visible:ring-[3px] focus-visible:ring-navy-700/30 focus-visible:outline-none"
              />
            </Slider.Root>
            <div className="mt-2 flex justify-between text-xs text-ink-600">
              {p.tiers.map((t) => (
                <span key={t.minQty}>{t.minQty}</span>
              ))}
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-4">
            <div className="rounded-[12px] bg-bg p-4">
              <dt className="text-sm text-ink-600">Per label</dt>
              <dd className="mt-1 text-2xl font-bold text-action-600">
                <AnimatedNumber value={perLabel(p, qty)} format={perLabelMoney} />
              </dd>
            </div>
            <div className="rounded-[12px] bg-bg p-4">
              <dt className="text-sm text-ink-600">Total</dt>
              <dd className="mt-1 text-2xl font-bold text-navy-900">
                <AnimatedNumber value={lineTotal(p, qty)} format={money} />
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Saved vs 1 stack</span>
              <span className="font-semibold text-teal-600">
                <AnimatedNumber value={saved * 100} format={(n) => `${Math.round(n)}%`} />
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-navy-50" aria-hidden>
              <motion.div
                className="h-full origin-left rounded-full bg-teal-600"
                style={{ width: "100%" }}
                initial={false}
                animate={{ scaleX: maxSaved ? saved / maxSaved : 0 }}
                transition={{ duration: durations.slow, ease: ease.out }}
              />
            </div>
          </div>

          <ButtonLink href={`/product/${p.slug}?qty=${qty}`} className="mt-7 w-full">
            Shop 4x6 labels
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
