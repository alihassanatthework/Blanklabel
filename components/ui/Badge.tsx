import { Flag } from "lucide-react";
import type { BadgeId } from "@/types";
import { cn } from "@/lib/utils";

const styles: Record<BadgeId | "demo", string> = {
  "made-in-usa": "bg-teal-600 text-white",
  "best-seller": "bg-action-500 text-white",
  "bulk-save": "bg-navy-700 text-white",
  new: "bg-ink-900 text-white",
  demo: "bg-warning/15 text-[#8a5a00] ring-1 ring-warning/40",
};

const labels: Record<BadgeId | "demo", string> = {
  "made-in-usa": "Made in USA",
  "best-seller": "Best seller",
  "bulk-save": "Bulk save",
  new: "New",
  demo: "Demo",
};

export function Badge({
  variant,
  children,
  className,
}: {
  variant: BadgeId | "demo";
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs leading-5 font-semibold",
        styles[variant],
        className,
      )}
    >
      {variant === "made-in-usa" && <Flag aria-hidden className="size-3" strokeWidth={2} />}
      {children ?? labels[variant]}
    </span>
  );
}
