import Link from "next/link";
import { ChevronRight, FlaskConical, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "./icons";

export function PerforationDivider({ className }: { className?: string }) {
  return <div aria-hidden className={cn("perforation w-full", className)} />;
}

export function DemoBanner({ message, className }: { message: string; className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-2.5 rounded-[10px] border border-warning/50 bg-warning/10 px-4 py-3 text-sm text-ink-900",
        className,
      )}
    >
      <FlaskConical aria-hidden className="mt-0.5 size-4 shrink-0 text-[#8a5a00]" />
      <span>
        <strong className="font-semibold">Demo · </strong>
        {message}
      </span>
    </div>
  );
}

export function DemoNote({ children = "This is a demo - no data was sent.", className }: { children?: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-1.5 text-xs text-ink-600", className)}>
      <Info aria-hidden className="size-3.5" />
      {children}
    </p>
  );
}

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-ink-600", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden className="size-3.5 text-ink-400" />}
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="link-underline hover:text-navy-700">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined} className="text-ink-900">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Missing image fallback: navy-50 box with the category icon - never a broken image. */
export function ImageFallback({ icon = "Tag", className }: { icon?: string; className?: string }) {
  return (
    <div className={cn("flex aspect-[6/5] items-center justify-center rounded-[12px] bg-navy-50", className)}>
      <CategoryIcon name={icon} className="size-10 text-navy-700" />
    </div>
  );
}

export function Stars({ rating, className, size = 16 }: { rating: number; className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
            <defs>
              <linearGradient id={`s${i}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="#F59E0B" />
                <stop offset={`${fill * 100}%`} stopColor="#DCE3EC" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"
              fill={`url(#s${i}-${Math.round(fill * 100)})`}
            />
          </svg>
        );
      })}
    </span>
  );
}
