import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "navy";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 " +
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-navy-700 focus-visible:ring-offset-2 " +
  "disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-action-500 text-white hover:bg-action-600 hover:shadow-md motion-safe:hover:-translate-y-px motion-safe:active:scale-[0.98] motion-safe:active:translate-y-0",
  secondary: "bg-white text-navy-700 border-[1.5px] border-navy-700 hover:bg-navy-50 motion-safe:active:scale-[0.98]",
  navy: "bg-navy-700 text-white hover:bg-navy-900 motion-safe:active:scale-[0.98]",
  ghost: "text-navy-700 link-underline px-0 rounded-none h-auto",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[15px]",
  sm: "h-10 px-4 text-sm",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const buttonClass = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(base, variants[variant], variant !== "ghost" && sizes[size], className);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />;
});

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: React.ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
