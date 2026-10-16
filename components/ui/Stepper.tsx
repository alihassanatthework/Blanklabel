"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { cn } from "@/lib/utils";

/** Quantity stepper: - / value / +, 44 px targets, arrow keys supported, value rolls. */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 999,
  label = "Quantity",
  size = "md",
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "md" | "sm";
  className?: string;
}) {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, v)));
  const h = size === "sm" ? "h-10" : "h-12";
  return (
    <div className={cn("inline-flex items-center rounded-[10px] border border-line bg-white", h, className)}>
      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        onClick={() => set(value - 1)}
        disabled={value <= min}
        className="flex h-full w-11 items-center justify-center rounded-l-[10px] text-navy-700 hover:bg-navy-50 disabled:text-ink-400"
      >
        <Minus aria-hidden className="size-4" />
      </button>
      <span
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowRight") {
            e.preventDefault();
            set(value + 1);
          } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
            e.preventDefault();
            set(value - 1);
          } else if (e.key === "Home") set(min);
          else if (e.key === "End") set(max);
        }}
        className="flex h-full min-w-10 items-center justify-center border-x border-line px-1 text-[15px] font-semibold"
      >
        <AnimatedNumber value={value} />
      </span>
      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        onClick={() => set(value + 1)}
        disabled={value >= max}
        className="flex h-full w-11 items-center justify-center rounded-r-[10px] text-navy-700 hover:bg-navy-50 disabled:text-ink-400"
      >
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  );
}
