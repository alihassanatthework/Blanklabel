import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  as: H = "h2",
  className,
  invert,
  id,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  as?: "h1" | "h2";
  className?: string;
  invert?: boolean;
  id?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p
            className={cn(
              "mb-2 text-xs font-semibold tracking-[0.14em] uppercase",
              invert ? "text-action-500" : "text-action-600",
            )}
          >
            {eyebrow}
          </p>
        )}
        <H id={id} className={cn(H === "h1" ? "text-h1" : "text-h2", invert && "text-white")}>
          {title}
        </H>
        {subtitle && <p className={cn("mt-3 text-base", invert ? "text-white/75" : "text-ink-600")}>{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex items-center gap-1.5 text-[15px] font-semibold",
            invert ? "text-white" : "text-navy-700",
          )}
        >
          <span className="link-underline">{action.label}</span>
          <ArrowRight aria-hidden className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
