import { cn } from "@/lib/utils";

/** Text wordmark with a small die-cut label icon (until the client's logo file is provided). */
export function Logo({ className, invert }: { className?: string; invert?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <path
          d="M7 3h13l9 9v14a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"
          fill={invert ? "#FFFFFF" : "var(--color-navy-700)"}
        />
        <path d="M20 3v6a3 3 0 0 0 3 3h6" fill={invert ? "#CBD5E1" : "var(--color-navy-900)"} />
        <circle cx="10" cy="9" r="2" fill="var(--color-action-500)" />
        <g fill={invert ? "var(--color-navy-900)" : "#FFFFFF"}>
          <rect x="9" y="17" width="1.6" height="7" />
          <rect x="12" y="17" width="0.9" height="7" />
          <rect x="14.2" y="17" width="2" height="7" />
          <rect x="17.4" y="17" width="0.9" height="7" />
          <rect x="19.6" y="17" width="1.6" height="7" />
          <rect x="22.4" y="17" width="0.9" height="7" />
        </g>
      </svg>
      <span
        className={cn(
          "font-[family-name:var(--font-jakarta)] text-[21px] leading-none font-extrabold tracking-[-0.02em]",
          invert ? "text-white" : "text-navy-900",
        )}
      >
        Blank<span className={invert ? "text-white/80" : "text-navy-700"}>Labels</span>
      </span>
    </span>
  );
}
