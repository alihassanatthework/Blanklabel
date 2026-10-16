import { Check } from "lucide-react";
import { PRINTER_LABEL, PRINTER_ORDER } from "@/lib/filters";
import { cn } from "@/lib/utils";
import type { PrinterId } from "@/types";

/** Printer compatibility chips (data-driven from product.printers). */
export function CompatibilityChips({
  printers,
  max,
  className,
  size = "sm",
}: {
  printers: PrinterId[];
  max?: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const sorted = [...printers].sort((a, b) => PRINTER_ORDER.indexOf(a) - PRINTER_ORDER.indexOf(b));
  const shown = max ? sorted.slice(0, max) : sorted;
  const rest = sorted.length - shown.length;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Compatible printers">
      {shown.map((p) => (
        <li
          key={p}
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-navy-50 font-medium text-navy-700",
            size === "md" ? "h-8 px-3 text-sm" : "h-6 px-2 text-xs",
          )}
        >
          <Check aria-hidden className={size === "md" ? "size-3.5 text-teal-600" : "size-3 text-teal-600"} strokeWidth={2.5} />
          {PRINTER_LABEL[p]}
        </li>
      ))}
      {rest > 0 && (
        <li className="inline-flex h-6 items-center rounded-full px-1.5 text-xs font-medium text-ink-600">+{rest} more</li>
      )}
    </ul>
  );
}
