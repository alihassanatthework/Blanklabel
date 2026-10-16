"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { SelectControl } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import { getProducts } from "@/lib/data";
import { SORT_OPTIONS, activeFilterCount, filterFromParams, filterToParams } from "@/lib/filters";
import { cn } from "@/lib/utils";
import type { Facet, Product, ProductFilter, SortKey } from "@/types";
import { ActiveFilters } from "./ActiveFilters";
import { EmptyState } from "./EmptyState";
import { FilterPanel } from "./FilterPanel";

const PAGE = 12;

interface Result {
  items: Product[];
  total: number;
  facets: Facet[];
}

/** Listing with client-side filters synced to the URL (shareable). `initial` = unfiltered result for first paint. */
export function ProductListing(props: { categoryId?: string; initial: Result }) {
  return (
    <Suspense fallback={<ListingView {...props} filter={{}} result={props.initial} page={1} />}>
      <UrlListing {...props} />
    </Suspense>
  );
}

function UrlListing({ categoryId, initial }: { categoryId?: string; initial: Result }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const key = sp.toString();
  const filter = useMemo(() => filterFromParams(new URLSearchParams(key)), [key]);
  const page = Math.max(1, Number(new URLSearchParams(key).get("page")) || 1);
  const [result, setResult] = useState<Result>(initial);

  useEffect(() => {
    let alive = true;
    getProducts({ ...filter, category: categoryId }).then((r) => alive && setResult(r));
    return () => {
      alive = false;
    };
  }, [filter, categoryId]);

  const update = (f: ProductFilter, nextPage?: number) => {
    const params = filterToParams(f, { page: nextPage && nextPage > 1 ? String(nextPage) : undefined });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return <ListingView categoryId={categoryId} initial={initial} filter={filter} result={result} page={page} onChange={update} />;
}

function ListingView({
  filter,
  result,
  page,
  onChange,
}: {
  categoryId?: string;
  initial: Result;
  filter: ProductFilter;
  result: Result;
  page: number;
  onChange?: (f: ProductFilter, page?: number) => void;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sheetOpen, setSheetOpen] = useState(false);
  const change = (f: ProductFilter) => onChange?.(f);
  const shown = result.items.slice(0, page * PAGE);
  const active = activeFilterCount(filter);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-[84px] max-h-[calc(100dvh-100px)] overflow-y-auto rounded-[16px] border border-line bg-white px-4 py-2 shadow-sm">
          <div className="flex items-center justify-between border-b border-line py-3">
            <h2 className="text-h4">Filters</h2>
            {active > 0 && (
              <button type="button" onClick={() => change({ sort: filter.sort })} className="text-sm font-semibold text-navy-700 hover:underline">
                Clear all
              </button>
            )}
          </div>
          <FilterPanel facets={result.facets} value={filter} onChange={change} idPrefix="side" />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] text-ink-600" aria-live="polite">
            <strong className="text-navy-900">{result.total}</strong> product{result.total === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setSheetOpen(true)}>
              <SlidersHorizontal aria-hidden className="size-4" />
              Filters{active > 0 && ` (${active})`}
            </Button>
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <SelectControl
              id="sort"
              value={filter.sort ?? "best"}
              onChange={(e) => change({ ...filter, sort: e.target.value as SortKey })}
              options={SORT_OPTIONS}
              className="h-10 w-[210px] text-sm"
            />
            <div className="hidden rounded-[10px] border border-line bg-white p-0.5 sm:flex" role="group" aria-label="Layout">
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-label={`${v === "grid" ? "Grid" : "List"} view`}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn("flex size-9 items-center justify-center rounded-[8px]", view === v ? "bg-navy-700 text-white" : "text-ink-600 hover:bg-navy-50")}
                >
                  {v === "grid" ? <LayoutGrid aria-hidden className="size-4" /> : <List aria-hidden className="size-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5">
          <ActiveFilters value={filter} onChange={change} />
        </div>

        <h2 className="sr-only">Products</h2>
        {result.total === 0 ? (
          <EmptyState onClear={() => change({ sort: filter.sort })} />
        ) : (
          <>
            <m.ul layout className={cn("grid gap-5", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((p) => (
                  <m.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                  >
                    <ProductCard product={p} variant={view} />
                  </m.li>
                ))}
              </AnimatePresence>
            </m.ul>
            {shown.length < result.total && (
              <div className="mt-10 flex flex-col items-center gap-2">
                <p className="text-sm text-ink-600">
                  Showing {shown.length} of {result.total}
                </p>
                <Button variant="secondary" onClick={() => onChange?.(filter, page + 1)}>
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        side="bottom"
        title="Filters"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => change({ sort: filter.sort })}>
              Clear all
            </Button>
            <Button className="flex-1" onClick={() => setSheetOpen(false)}>
              Show {result.total} result{result.total === 1 ? "" : "s"}
            </Button>
          </div>
        }
      >
        <div className="px-5">
          <FilterPanel facets={result.facets} value={filter} onChange={change} idPrefix="sheet" />
        </div>
      </Sheet>
    </div>
  );
}
