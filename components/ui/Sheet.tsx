"use client";

import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as m from "motion/react-m";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Slide-in panel (right drawer or bottom sheet) and centred dialog, built on Radix Dialog
 * (focus trap, Esc to close, focus return). x 100% -> 0 with spring; instant + fade under reduced motion.
 */
export function Sheet({
  open,
  onOpenChange,
  side = "right",
  title,
  description,
  hideTitle,
  className,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  side?: "right" | "bottom" | "center" | "top";
  title: string;
  description?: string;
  hideTitle?: boolean;
  className?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const offscreen =
    side === "right"
      ? { x: "100%" }
      : side === "bottom"
        ? { y: "100%" }
        : side === "top"
          ? { y: -24, opacity: 0 }
          : { scale: 0.96, opacity: 0 };
  const onscreen = side === "right" ? { x: 0 } : side === "bottom" ? { y: 0 } : { y: 0, scale: 1, opacity: 1 };
  const pos =
    side === "right"
      ? "inset-y-0 right-0 h-dvh w-full sm:w-[420px]"
      : side === "bottom"
        ? "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[20px]"
        : side === "top"
          ? "inset-x-0 top-0 rounded-b-[20px]"
          : "top-1/2 left-1/2 w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[20px]";

  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <D.Portal forceMount>
            <D.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-[60] bg-navy-900/45 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </D.Overlay>
            <D.Content asChild forceMount aria-describedby={description ? undefined : undefined}>
              <m.div
                className={cn("fixed z-[61] flex flex-col bg-white shadow-lg focus:outline-none", pos, className)}
                initial={reduce ? { opacity: 0 } : offscreen}
                animate={reduce ? { opacity: 1 } : onscreen}
                exit={reduce ? { opacity: 0 } : offscreen}
                transition={reduce ? { duration: 0.15 } : side === "center" || side === "top" ? { duration: 0.2 } : spring}
              >
                <div
                  className={cn(
                    "flex items-center justify-between gap-4 px-5 pt-4 pb-3",
                    !hideTitle && "border-b border-line",
                  )}
                >
                  <D.Title className={cn("text-h4", hideTitle && "sr-only")}>{title}</D.Title>
                  {description ? (
                    <D.Description className="sr-only">{description}</D.Description>
                  ) : (
                    <D.Description className="sr-only">{title}</D.Description>
                  )}
                  <D.Close
                    aria-label="Close"
                    className="-mr-2 ml-auto flex size-11 items-center justify-center rounded-full text-ink-600 hover:bg-navy-50 hover:text-navy-900"
                  >
                    <X aria-hidden className="size-5" />
                  </D.Close>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
                {footer && <div className="border-t border-line p-5">{footer}</div>}
              </m.div>
            </D.Content>
          </D.Portal>
        )}
      </AnimatePresence>
    </D.Root>
  );
}
