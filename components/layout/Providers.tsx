"use client";

import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
