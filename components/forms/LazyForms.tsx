"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * Below-the-fold forms (react-hook-form + zod) mount when they approach the viewport,
 * keeping form libraries out of the initial page JS. A same-height placeholder avoids layout shift.
 */
function useNearViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, near };
}

const NewsletterFormImpl = dynamic(() => import("./NewsletterForm").then((m) => m.NewsletterForm), { ssr: false });
const SampleFormImpl = dynamic(() => import("./SampleForm").then((m) => m.SampleForm), { ssr: false });

export function LazyNewsletterForm() {
  const { ref, near } = useNearViewport<HTMLDivElement>();
  return (
    <div ref={ref} className="min-h-[76px] w-full max-w-md">
      {near && <NewsletterFormImpl />}
    </div>
  );
}

export function LazySampleForm({ idPrefix }: { idPrefix?: string }) {
  const { ref, near } = useNearViewport<HTMLDivElement>();
  return (
    <div ref={ref} className="min-h-[300px]">
      {near && <SampleFormImpl idPrefix={idPrefix} />}
    </div>
  );
}
