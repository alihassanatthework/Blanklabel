"use client";

import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Factory, Headset, ShieldCheck, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const PILLARS: { icon: LucideIcon; title: string; text: string; link: { label: string; href: string } }[] = [
  {
    icon: Factory,
    title: "Made in USA, factory-direct",
    text: "Manufactured in Charlotte, NC by a team with 20+ years in labels.",
    link: { label: "Our factory", href: "/about#made-in-usa" },
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed to fit",
    text: "Built for Zebra, Rollo, Eltron and more.",
    link: { label: "How we guarantee fit", href: "/about#support" },
  },
  {
    icon: BadgeDollarSign,
    title: "Price Beat Promise",
    text: "Seen it cheaper? We review any quote and do everything we can to beat it.",
    link: { label: "How it works", href: "/about#price-beat" },
  },
  {
    icon: Headset,
    title: "Real people, real help",
    text: "Call or email our label experts - we answer.",
    link: { label: "Meet our support", href: "/about#support" },
  },
];

/** Icon strokes draw in (SVG stroke animation) when revealed. */
function DrawIcon({ icon: Icon }: { icon: LucideIcon }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll("path, line, circle, rect, polyline, polygon").forEach((n) => n.setAttribute("pathLength", "1"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className={cn("draw-icon flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700", armed && "is-armed", drawn && "is-drawn")}>
      <Icon aria-hidden className="size-8" strokeWidth={1.5} />
    </span>
  );
}

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="section-y bg-white">
      <div className="container-x">
        <SectionHeading id="why-title" eyebrow="Why BlankLabels" title="Labels from the people who make them" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PILLARS.map((p, i) => (
            <Reveal as="li" key={p.title} index={i}>
              <Card className="flex h-full flex-col gap-4 p-6">
                <DrawIcon icon={p.icon} />
                <h3 className="text-h4">{p.title}</h3>
                <p className="text-ink-600">{p.text}</p>
                <Link href={p.link.href} className="group mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700">
                  <span className="link-underline">{p.link.label}</span>
                  <ArrowRight aria-hidden className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
                </Link>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
