import { Disc, FileText, Layers, Printer, Receipt, Tag, type LucideProps } from "lucide-react";

// Category icon names are stored in data (categories.json); map them to components here.
const map = { Layers, Disc, Receipt, FileText, Printer, Tag } as const;

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = map[name as keyof typeof map] ?? Tag;
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}
