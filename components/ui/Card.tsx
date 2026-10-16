import { cn } from "@/lib/utils";

/** White, radius 16, 1px border, shadow sm. `interactive` adds the hover lift (pointer devices). */
export function Card({
  className,
  interactive,
  as: Tag = "div",
  ...props
}: React.HTMLAttributes<HTMLElement> & { interactive?: boolean; as?: "div" | "article" | "section" | "li" }) {
  return (
    <Tag
      className={cn(
        "rounded-[16px] border border-line bg-white shadow-sm",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-[220ms] [@media(hover:hover)]:hover:border-navy-700/30 [@media(hover:hover)]:hover:shadow-lg motion-safe:[@media(hover:hover)]:hover:-translate-y-1",
        className,
      )}
      {...props}
    />
  );
}
