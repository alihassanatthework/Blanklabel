"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, Loader2, Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { DemoNote } from "@/components/ui/misc";
import { submitQuote } from "@/lib/data/actions";
import { quoteSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { FormSuccess } from "./FormSuccess";
import type { z } from "zod";

type FormIn = z.input<typeof quoteSchema>;
type FormOut = z.output<typeof quoteSchema>;

/** Custom label quote - SIMULATED: 900 ms, QTE-XXXXXX reference, saved to localStorage 'demo_quotes'. */
export function QuoteForm() {
  const [ref, setRef] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { shape: "Rectangle", quantity: "1,000", material: "Not sure", finish: "Not sure" },
  });

  const pick = (f: File | null) => {
    setFile(f);
    setValue("artwork", f ? f.name : "");
  };

  if (ref)
    return (
      <FormSuccess
        title="Quote request received"
        reference={ref}
        nextSteps={[
          "A label specialist reviews your size, material and artwork - usually within one business day.",
          "You receive a price and a digital proof by email.",
          "Approve the proof and we print and ship from Charlotte, NC.",
        ]}
      />
    );

  return (
    <form noValidate onSubmit={handleSubmit(async (v) => setRef((await submitQuote(v)).reference))} className="grid gap-5 sm:grid-cols-2">
      <Input label="Name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input label="Company" autoComplete="organization" {...register("company")} />
      <Input label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
      <Input label="Phone" type="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
      <Select label="Label shape" options={["Rectangle", "Square", "Circle", "Oval"]} {...register("shape")} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Width (in)" inputMode="decimal" required error={errors.width?.message} {...register("width")} />
        <Input label="Height (in)" inputMode="decimal" required error={errors.height?.message} {...register("height")} />
      </div>
      <Select label="Quantity" options={["500", "1,000", "2,500", "5,000", "10,000+"]} {...register("quantity")} />
      <Select label="Material" options={["Paper", "Direct thermal", "Thermal transfer", "Not sure"]} {...register("material")} />
      <Select label="Finish" options={["Matte", "Gloss", "Not sure"]} {...register("finish")} className="sm:col-span-2 sm:max-w-[calc(50%-10px)]" />

      <div className="sm:col-span-2">
        <p id="artwork-label" className="mb-1.5 text-sm font-medium">
          Artwork <span className="font-normal text-ink-600">(PDF, AI, EPS, PNG or JPG)</span>
        </p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            pick(e.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "flex flex-col items-center gap-2 rounded-[12px] border-2 border-dashed px-4 py-8 text-center transition-colors",
            drag ? "border-navy-700 bg-navy-50" : "border-line bg-bg",
          )}
        >
          <FileUp aria-hidden className="size-7 text-navy-700" strokeWidth={1.5} />
          <p className="text-[15px]">
            Drag and drop your file, or{" "}
            <button type="button" onClick={() => fileInput.current?.click()} className="font-semibold text-navy-700 underline">
              browse
            </button>
          </p>
          <input
            ref={fileInput}
            type="file"
            aria-labelledby="artwork-label"
            accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.svg"
            className="sr-only"
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
          />
          {file && (
            <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-sm ring-1 ring-line">
              <Paperclip aria-hidden className="size-4 text-navy-700" />
              {file.name}
              <button type="button" aria-label="Remove file" onClick={() => pick(null)} className="flex size-6 items-center justify-center rounded-full hover:bg-navy-50">
                <X aria-hidden className="size-3.5" />
              </button>
            </p>
          )}
          <p className="text-xs text-ink-600">Demo: the file is listed but not uploaded.</p>
        </div>
      </div>

      <Textarea label="Notes" className="sm:col-span-2" error={errors.notes?.message} {...register("notes")} />

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {isSubmitting ? "Sending..." : "Get a quote"}
        </Button>
        <DemoNote>Demo form - nothing is sent.</DemoNote>
      </div>
    </form>
  );
}
