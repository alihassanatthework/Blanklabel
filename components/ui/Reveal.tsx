"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { durations, ease, reveal, staggerDelay } from "@/lib/motion";

type Tag = "div" | "section" | "li" | "article" | "ul";

/** Section reveal: fade + y 20 -> 0, 500 ms, once at ~25% in view. Opacity only under reduced motion. */
export function Reveal({
  children,
  delay = 0,
  y = reveal.y,
  as = "div",
  className,
  index,
  id,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  as?: Tag;
  className?: string;
  /** Position in a staggered grid (70 ms per item, max 8). */
  index?: number;
  id?: string;
}) {
  const reduce = useReducedMotion();
  const M = m[as];
  const d = delay + (index != null && !reduce ? staggerDelay(index) : 0);
  return (
    <M
      id={id}
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: durations.reveal, ease: ease.out, delay: d }}
    >
      {children}
    </M>
  );
}
