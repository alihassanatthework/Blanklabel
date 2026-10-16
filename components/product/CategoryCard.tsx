import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { categoryHref } from "@/lib/data/categories";
import { MATERIAL_LABEL } from "@/lib/filters";
import { perLabelMoney } from "@/lib/utils";
import type { Category, Product } from "@/types";
import { ProductVisual, visualProps } from "./ProductVisual";

export function CategoryCard({
  category: c,
  fromPrice,
  sample,
  groupName,
}: {
  category: Category;
  fromPrice: number;
  sample?: Product;
  groupName?: string;
}) {
  return (
    <Card as="article" interactive className="group relative flex h-full flex-col overflow-hidden">
      <div className="overflow-hidden bg-bg p-6">
        <div className="mx-auto max-w-[260px] transition-transform duration-[220ms] motion-safe:group-hover:scale-[1.04]">
          {sample ? (
            <ProductVisual {...visualProps(sample)} />
          ) : (
            <ProductVisual format={c.format} widthIn={4} lengthIn={6} />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {groupName && (
            <li className="rounded-full bg-navy-700 px-2.5 py-0.5 text-xs font-semibold text-white">{groupName}</li>
          )}
          {c.material && (
            <li className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-semibold text-navy-700">
              {MATERIAL_LABEL[c.material]}
            </li>
          )}
        </ul>
        <h3 className="text-h4">
          <Link href={categoryHref(c)} className="after:absolute after:inset-0 after:content-['']">
            {c.name}
          </Link>
        </h3>
        <p className="text-sm text-ink-600">{c.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-sm text-ink-600">
            From <span className="text-base font-bold text-action-600 tabular-nums">{perLabelMoney(fromPrice)}</span> / label
          </p>
          <ArrowRight aria-hidden className="size-5 text-navy-700 transition-transform duration-200 motion-safe:group-hover:translate-x-1" />
        </div>
      </div>
    </Card>
  );
}
