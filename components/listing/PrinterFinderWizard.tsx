"use client";

import { ArrowLeft, BookmarkPlus, Check, Info, Printer as PrinterIcon, RotateCcw } from "lucide-react";
import * as m from "motion/react-m";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getProducts } from "@/lib/data";
import { MATERIAL_LABEL, USE_LABEL, sizeKey } from "@/lib/filters";
import { useAccountExtras } from "@/lib/store/account";
import { cn } from "@/lib/utils";
import type { Printer, PrinterId, Product, Use } from "@/types";

const USES: { id: Use | "unsure"; label: string; hint: string }[] = [
  { id: "shipping", label: USE_LABEL.shipping, hint: "4x6, half-sheet and integrated" },
  { id: "barcode", label: USE_LABEL.barcode, hint: "2x1, 2.25x1.25, 4x3 and FBA" },
  { id: "address", label: USE_LABEL.address, hint: "Address and full-sheet labels" },
  { id: "unsure", label: "Not sure", hint: "Show everything that fits" },
];

/** Guided 3-step wizard: brand -> model (optional) -> what are you printing? -> matching products. */
export function PrinterFinderWizard({ printers }: { printers: Printer[] }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState<Printer | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [use, setUse] = useState<Use | "unsure" | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const savePrinter = useAccountExtras((s) => s.savePrinter);

  useEffect(() => {
    if (step !== 3 || !brand) return;
    getProducts({
      printer: [brand.id as PrinterId],
      model: model ?? undefined,
      use: use && use !== "unsure" ? use : undefined,
    }).then((r) => setResults(r.items));
  }, [step, brand, model, use]);

  const printerName = brand ? `${brand.name}${model && model !== "Any model" ? ` ${model}` : ""}` : "";
  const progress = ((step + (step === 3 ? 0 : 0)) / 3) * 100;

  const explanation = () => {
    if (!results.length) return null;
    const mats = [...new Set(results.map((p) => MATERIAL_LABEL[p.material].toLowerCase()))];
    const sizes = [...new Set(results.map(sizeKey))].slice(0, 4);
    return `These labels are ${mats.join(" or ")} ${sizes.join(", ")}, compatible with ${printerName}.`;
  };

  const restart = () => {
    setStep(0);
    setBrand(null);
    setModel(null);
    setUse(null);
  };

  const tile = (active: boolean) =>
    cn(
      "flex min-h-[72px] w-full flex-col items-start justify-center gap-0.5 rounded-[12px] border-[1.5px] px-4 py-3 text-left transition-colors",
      active ? "border-navy-700 bg-navy-50" : "border-line bg-white hover:border-navy-700/40 hover:bg-navy-50/50",
    );

  return (
    <div>
      <div className="mx-auto max-w-3xl rounded-[20px] border border-line bg-white p-5 shadow-md sm:p-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-navy-900">{step < 3 ? `Step ${step + 1} of 3` : "Your matches"}</span>
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => (s === 3 ? 2 : s - 1))} className="flex items-center gap-1 font-medium text-navy-700 hover:underline">
              <ArrowLeft aria-hidden className="size-4" /> Back
            </button>
          )}
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-navy-50"
          role="progressbar"
          aria-label="Printer finder progress"
          aria-valuemin={0}
          aria-valuemax={3}
          aria-valuenow={step}
        >
          <m.div className="h-full rounded-full bg-action-500" animate={{ width: `${step === 3 ? 100 : progress}%` }} transition={{ duration: 0.25 }} />
        </div>

        <div className="relative mt-6 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={step}
              initial={{ opacity: 0, x: reduce ? 0 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduce ? 0 : -40 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <fieldset>
                  <legend className="text-h3">Which printer do you use?</legend>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {printers.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={brand?.id === p.id}
                        onClick={() => {
                          setBrand(p);
                          setModel(null);
                          setStep(1);
                        }}
                        className={cn(tile(brand?.id === p.id), "items-center text-center")}
                      >
                        <PrinterIcon aria-hidden className="size-5 text-navy-700" strokeWidth={1.75} />
                        <span className="font-semibold text-navy-900">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 1 && brand && (
                <fieldset>
                  <legend className="text-h3">Which {brand.name} model?</legend>
                  <p className="mt-1 text-ink-600">Optional - it helps us rule out labels that won&apos;t fit.</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {brand.models.map((m) => (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={model === m}
                        onClick={() => {
                          setModel(m);
                          setStep(2);
                        }}
                        className={tile(model === m)}
                      >
                        <span className="font-semibold text-navy-900">{brand.name === "Laser/Inkjet" ? "Any laser or inkjet printer" : `${brand.name} ${m}`}</span>
                      </button>
                    ))}
                  </div>
                  {brand.models.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setModel(null);
                        setStep(2);
                      }}
                      className="mt-4 text-sm font-semibold text-navy-700 hover:underline"
                    >
                      Skip - I&apos;m not sure of the model
                    </button>
                  )}
                </fieldset>
              )}

              {step === 2 && (
                <fieldset>
                  <legend className="text-h3">What are you printing?</legend>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {USES.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        aria-pressed={use === u.id}
                        onClick={() => {
                          setUse(u.id);
                          setStep(3);
                        }}
                        className={tile(use === u.id)}
                      >
                        <span className="font-semibold text-navy-900">{u.label}</span>
                        <span className="text-sm text-ink-600">{u.hint}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-h3">
                    {results.length} label{results.length === 1 ? "" : "s"} fit your {printerName}
                  </h2>
                  {results.length > 0 ? (
                    <p className="mt-3 flex gap-2.5 rounded-[12px] bg-navy-50 p-4 text-[15px] text-navy-900">
                      <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-navy-700" />
                      {explanation()}
                    </p>
                  ) : (
                    <p className="mt-3 rounded-[12px] bg-warning/10 p-4 text-[15px]">
                      We don&apos;t make {use && use !== "unsure" ? USE_LABEL[use].toLowerCase() : "labels"} for the {printerName}. Try &ldquo;Not sure&rdquo;
                      or call us - we may be able to make a custom size.
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      variant="navy"
                      size="sm"
                      onClick={() => {
                        savePrinter(printerName);
                        toast.success(`${printerName} saved to your account`, { description: "Demo - stored on this device only." });
                      }}
                    >
                      <BookmarkPlus aria-hidden className="size-4" />
                      Save printer to my account
                    </Button>
                    <Button variant="secondary" size="sm" onClick={restart}>
                      <RotateCcw aria-hidden className="size-4" />
                      Start over
                    </Button>
                    <Badge variant="demo" className="self-center">
                      Saved on this device
                    </Badge>
                  </div>
                </div>
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      {step === 3 && results.length > 0 && (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}

      {step < 3 && (
        <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-600">
          {["Guaranteed to fit", "Free US shipping", "60-day returns"].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <Check aria-hidden className="size-4 text-teal-600" /> {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
