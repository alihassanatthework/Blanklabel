"use client";

import { motion, useReducedMotion } from "motion/react";
import { DemoNote } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

/** Check mark that draws in (pathLength 0 -> 1, 500 ms); static under reduced motion. */
export function SuccessCheck({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 52 52" className={cn("size-14", className)} aria-hidden>
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="var(--color-teal-600)"
        strokeWidth="3"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M15 27l7 7 15-16"
        fill="none"
        stroke="var(--color-teal-600)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: reduce ? 0 : 0.25 }}
      />
    </svg>
  );
}

export function FormSuccess({
  title,
  reference,
  nextSteps,
  children,
  className,
}: {
  title: string;
  reference?: string;
  nextSteps?: string[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col items-start gap-4", className)}>
      <SuccessCheck />
      <div>
        <h3 className="text-h3">{title}</h3>
        {reference && (
          <p className="mt-2 text-ink-600">
            Your reference: <strong className="tabular font-semibold text-navy-900">{reference}</strong>
          </p>
        )}
      </div>
      {nextSteps && (
        <ol className="w-full space-y-3">
          {nextSteps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-50 text-sm font-semibold text-navy-700">
                {i + 1}
              </span>
              <span className="pt-0.5 text-ink-600">{s}</span>
            </li>
          ))}
        </ol>
      )}
      {children}
      <DemoNote />
    </div>
  );
}
