"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { CustomLabelArt, type CustomArtId } from "./CustomLabelArt";

const COLLAGE: { id: CustomArtId; rotate: number; className: string; depth: number }[] = [
  { id: "pine", rotate: -6, className: "left-[2%] top-[8%] w-[46%]", depth: 20 },
  { id: "coastal", rotate: 7, className: "right-[4%] top-[0%] w-[36%]", depth: -14 },
  { id: "harbor", rotate: -3, className: "left-[42%] top-[38%] w-[28%]", depth: 10 },
];

/** Navy band promoting custom printed labels; collage parallaxes (max 20 px) and straightens on hover. */
export function CustomBand({ eyebrow = "Not just blank labels", title = "Your brand, printed on our labels.", headingLevel = "h2", cta = true }: {
  eyebrow?: string;
  title?: string;
  headingLevel?: "h1" | "h2";
  cta?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useTransform(scrollYProgress, [0, 1], [1, -1]);
  const H = headingLevel;
  return (
    <section ref={ref} aria-labelledby="custom-title" className="overflow-hidden bg-navy-900 text-white">
      <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-action-500 uppercase">{eyebrow}</p>
          <H id="custom-title" className={H === "h1" ? "text-h1 text-white" : "text-h2 text-white"}>
            {title}
          </H>
          <p className="mt-4 max-w-lg text-lg text-white/75">
            Custom labels printed with your graphics - to brand your own products or fulfil branding for your customers. Send your
            artwork, approve a proof and we print and ship from Charlotte, NC.
          </p>
          {cta && (
            <ButtonLink href="/custom-labels" className="mt-7">
              Get a quote
            </ButtonLink>
          )}
        </div>
        <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px]">
          {COLLAGE.map((c) => (
            <Parallax key={c.id} progress={p} depth={reduce ? 0 : c.depth} className={`absolute ${c.className}`}>
              <motion.div
                initial={{ rotate: c.rotate }}
                animate={{ rotate: c.rotate }}
                whileHover={{ rotate: 0, scale: 1.03 }}
                transition={{ duration: 0.22 }}
              >
                <CustomLabelArt id={c.id} />
              </motion.div>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}

function Parallax({
  progress,
  depth,
  className,
  children,
}: {
  progress: ReturnType<typeof useTransform<number, number>>;
  depth: number;
  className: string;
  children: React.ReactNode;
}) {
  const y = useTransform(progress, (v) => v * depth);
  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
