"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { DemoNote } from "@/components/ui/misc";
import { submitSample } from "@/lib/data/actions";
import { PRINTER_MENU } from "@/lib/nav";
import { SIZE_OPTIONS } from "@/lib/filters";
import { sampleSchema, type SampleInput } from "@/lib/schemas";
import { FormSuccess } from "./FormSuccess";

/** Free sample request - SIMULATED: validate, 800 ms loading, success with SMP-XXXXX reference. */
export function SampleForm({ idPrefix = "sample" }: { idPrefix?: string }) {
  const [ref, setRef] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SampleInput>({ resolver: zodResolver(sampleSchema) });

  if (ref)
    return (
      <FormSuccess
        title="Your free sample pack is on its way"
        reference={ref}
        nextSteps={["We pack samples for your printer and size.", "They ship free within 1-2 business days.", "A label expert follows up to help you choose."]}
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setRef(null);
            reset();
          }}
        >
          Request another
        </Button>
      </FormSuccess>
    );

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (v) => setRef((await submitSample(v)).reference))}
      className="grid gap-4 sm:grid-cols-2"
      aria-label="Free sample request"
    >
      <Input id={`${idPrefix}-name`} label="Name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input id={`${idPrefix}-company`} label="Company" autoComplete="organization" {...register("company")} />
      <Input
        id={`${idPrefix}-email`}
        label="Email"
        type="email"
        required
        autoComplete="email"
        className="sm:col-span-2"
        error={errors.email?.message}
        {...register("email")}
      />
      <Select
        id={`${idPrefix}-printer`}
        label="Printer"
        required
        placeholder="Choose printer"
        options={PRINTER_MENU.map((p) => p.label)}
        error={errors.printer?.message}
        {...register("printer")}
      />
      <Select
        id={`${idPrefix}-size`}
        label="Label size"
        required
        placeholder="Choose size"
        options={SIZE_OPTIONS}
        error={errors.size?.message}
        {...register("size")}
      />
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {isSubmitting ? "Sending..." : "Request free samples"}
        </Button>
        <DemoNote>Demo form - nothing is sent.</DemoNote>
      </div>
    </form>
  );
}
