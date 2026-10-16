import Link from "next/link";
import { CategoryIcon } from "@/components/ui/icons";
import { Breadcrumbs, type Crumb } from "@/components/ui/misc";
import { categoryHref } from "@/lib/data/categories";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import type { Category } from "@/types";

export function ListingHeader({
  crumbs,
  title,
  intro,
  subcategories,
  counts,
}: {
  crumbs: Crumb[];
  title: string;
  intro: string;
  subcategories?: Category[];
  counts?: Record<string, number>;
}) {
  return (
    <div className="border-b border-line bg-white">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="container-x py-8 lg:py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-h1 mt-4">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-600">{intro}</p>
        {subcategories && subcategories.length > 0 && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
            {subcategories.map((c) => (
              <li key={c.id}>
                <Link
                  href={categoryHref(c)}
                  className="group flex items-center gap-3 rounded-[12px] border border-line bg-bg p-3 transition-colors hover:border-navy-700/30 hover:bg-navy-50"
                >
                  <span className="flex size-10 items-center justify-center rounded-[10px] bg-white text-navy-700 shadow-sm">
                    <CategoryIcon name={c.icon} className="size-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-navy-900">{c.name}</span>
                    {counts && <span className="block text-sm text-ink-600">{counts[c.id] ?? 0} products</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
