"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { CustomLabelArt, type CustomArtId } from "./CustomLabelArt";

const COLLAGE: { id: CustomArtId; rotate: number; className: string; depth: number }[] = [
  { id: "pine", rotate: -6, className: "left-[2%] top-[8%] w-[46%]", depth: 20 },
  { id: "coastal", rotate: 7, className: "right-[4%] top-[0%] w-[36%]", depth: -14 },
  { id: "harbor", rotate: -3, className: "left-[42%] top-[38%] w-[28%]", depth: 10 },
];

/** Navy band promoting custom printed labels; collage parallaxes (max 20 px) and straightens on hover. */
export function CustomBand({
  eyebrow = "Not just blank labels",
  title = "Your brand, printed on our labels.",
  headingLevel = "h2",
  cta = true,
  ctaHref = "/custom-labels",
}: {
  eyebrow?: string;
  title?: string;
  headingLevel?: "h1" | "h2";
  cta?: boolean;
  ctaHref?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = useReducedMotion();
  const H = headingLevel;

  // Parallax: progress -1..1 as the band crosses the viewport; transform-only, rAF-throttled, off under reduced motion.
  useEffect(() => {
    if (reduce) {
      layers.current.forEach((el) => el && (el.style.transform = ""));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(-1, Math.min(1, 1 - (2 * (r.top + r.height)) / (vh + r.height)));
      layers.current.forEach((l, i) => l && (l.style.transform = `translate3d(0, ${(-p * COLLAGE[i].depth).toFixed(1)}px, 0)`));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  return (
    <section ref={ref} aria-labelledby="custom-title" className="overflow-hidden bg-navy-900 text-white">
      <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-action-bright uppercase">{eyebrow}</p>
          <H id="custom-title" className={H === "h1" ? "text-h1 text-white" : "text-h2 text-white"}>
            {title}
          </H>
          <p className="mt-4 max-w-lg text-lg text-white/75">
            Custom labels printed with your graphics - to brand your own products or fulfil branding for your customers. Send your
            artwork, approve a proof and we print and ship from Charlotte, NC.
          </p>
          {cta && (
            <ButtonLink href={ctaHref} className="mt-7">
              Get a quote
            </ButtonLink>
          )}
        </div>
        <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px]">
          {COLLAGE.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                layers.current[i] = el;
              }}
              className={`absolute will-change-transform ${c.className}`}
            >
              <m.div
                initial={{ rotate: c.rotate }}
                animate={{ rotate: c.rotate }}
                whileHover={{ rotate: 0, scale: 1.03 }}
                transition={{ duration: 0.22 }}
              >
                <CustomLabelArt id={c.id} />
              </m.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
