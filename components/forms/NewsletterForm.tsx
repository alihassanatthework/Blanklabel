"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/lib/toast";
import type { z } from "zod";
import { SuccessCheck } from "./FormSuccess";
import { Button } from "@/components/ui/Button";
import { DemoNote } from "@/components/ui/misc";
import { subscribeNewsletter } from "@/lib/data/actions";
import { newsletterSchema } from "@/lib/schemas";

type Values = z.infer<typeof newsletterSchema>;

/** SIMULATED: success toast + demo code WELCOME10 (works in the cart). */
export function NewsletterForm() {
  const [code, setCode] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(newsletterSchema) });

  if (code)
    return (
      <div role="status" className="flex items-center gap-4">
        <SuccessCheck className="size-12 shrink-0" />
        <div>
          <p className="font-semibold text-white">You&apos;re subscribed. Use code</p>
          <p className="mt-1 inline-block rounded-[8px] border border-dashed border-white/50 px-3 py-1 font-mono text-lg font-bold tracking-wider text-action-bright">
            {code}
          </p>
          <DemoNote className="mt-2 text-white/70" />
        </div>
      </div>
    );

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (v) => {
        const r = await subscribeNewsletter(v.email);
        setCode(r.code);
        toast.success("Subscribed - here's 10% off", { description: `Use code ${r.code} in your cart.` });
      })}
      className="w-full max-w-md"
    >
      <label htmlFor="newsletter-email" className="mb-1.5 block text-sm font-medium text-white/85">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "newsletter-error" : undefined}
          {...register("email")}
          className="h-12 min-w-0 flex-1 rounded-[10px] border border-white/20 bg-white px-4 text-ink-900 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-action-500/60"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 aria-hidden className="size-4 animate-spin" />}
          Subscribe
        </Button>
      </div>
      {errors.email && (
        <p id="newsletter-error" role="alert" className="mt-1.5 text-sm text-[#FCA5A5]">
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
