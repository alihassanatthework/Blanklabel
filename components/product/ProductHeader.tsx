import { Badge } from "@/components/ui/Badge";
import { Stars } from "@/components/ui/misc";
import { formatInt } from "@/lib/utils";
import type { Product } from "@/types";
import { CompatibilityChips } from "./CompatibilityChips";

/** Static product summary (server-rendered so the title paints with the first HTML). */
export function ProductHeader({ product: p }: { product: Product }) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-1.5">
        {p.badges.map((b) => (
          <Badge key={b} variant={b} />
        ))}
      </div>
      <h1 className="text-h2 mt-3 lg:text-[34px]">{p.name}</h1>
      <div className="text-ink-600 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span>
          SKU <span className="text-ink-900 font-medium">{p.sku}</span>
        </span>
        <a href="#details" className="hover:text-navy-700 flex items-center gap-1.5">
          <Stars rating={p.rating} size={15} />
          {p.rating} ({formatInt(p.reviewCount)} reviews · demo)
        </a>
      </div>
      <p className="text-ink-600 mt-4">{p.description}</p>

      <div className="mt-5">
        <p className="text-navy-900 mb-2 text-sm font-semibold">Fits these printers</p>
        <CompatibilityChips printers={p.printers} size="md" />
      </div>
    </div>
  );
}
