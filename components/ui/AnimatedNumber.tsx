"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Minimal rAF tween (keeps the animation engine out of the initial bundle). Returns a cancel function. */
function tween(from: number, to: number, ms: number, onUpdate: (v: number) => void) {
  const start = performance.now();
  let raf = 0;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    onUpdate(from + (to - from) * easeOut(t));
    if (t < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/** Number roll on value change (300 ms). Instant swap under reduced motion. */
export function AnimatedNumber({
  value,
  format = (n) => String(Math.round(n)),
  duration = 0.3,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (reduce || from.current === value) {
      from.current = value;
      setDisplay(value);
      return;
    }
    const cancel = tween(from.current, value, duration * 1000, setDisplay);
    from.current = value;
    return cancel;
  }, [value, reduce, duration]);

  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {format(display)}
    </span>
  );
}

/** Count up from 0 once when scrolled into view (stats rows). */
export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      setShown(value);
      return;
    }
    let cancel = () => {};
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          cancel = tween(0, value, 1200, setShown);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel();
    };
  }, [value, reduce]);
  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {shown.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
