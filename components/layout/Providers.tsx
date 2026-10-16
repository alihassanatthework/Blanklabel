"use client";

import dynamic from "next/dynamic";
import { LazyMotion, MotionConfig } from "motion/react";

// Animation features (incl. layout animations) load after first paint, keeping them out of the initial bundle.
const loadFeatures = () => import("./motion-features").then((m) => m.default);

// The toast container is code-split too; lib/toast loads the library on first use.
const Toaster = dynamic(() => import("sonner").then((m) => m.Toaster), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster
          position="bottom-center"
          duration={4000}
          toastOptions={{
            classNames: {
              toast: "!rounded-[12px] !border-line !shadow-lg !font-sans",
              actionButton: "!bg-navy-700 !text-white !font-semibold",
            },
          }}
        />
      </MotionConfig>
    </LazyMotion>
  );
}
