"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductVisual, visualProps } from "@/components/product/ProductVisual";
import { CategoryIcon } from "@/components/ui/icons";
import { Sheet } from "@/components/ui/Sheet";
import { searchCatalog } from "@/lib/data";
import { fromPerLabel } from "@/lib/pricing";
import { useUi } from "@/lib/store/ui";
import { perLabelMoney } from "@/lib/utils";
import type { SearchResult } from "@/types";

const SUGGESTIONS = ["4x6 fanfold", "Rollo", "2x1 rolls", "FBA labels", "Integrated"];

/** Full-width search overlay: live, typo-tolerant results after 2 chars, grouped Products / Categories. */
export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUi();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    let alive = true;
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    searchCatalog(q).then((r) => alive && setResults(r));
    return () => {
      alive = false;
    };
  }, [q]);

  const products = results.filter((r) => r.type === "product").slice(0, 6);
  const cats = results.filter((r) => r.type === "category").slice(0, 4);
  const close = () => setSearchOpen(false);

  return (
    <Sheet open={searchOpen} onOpenChange={setSearchOpen} side="top" title="Search" hideTitle className="max-h-[90dvh]">
      <div className="container-x max-w-3xl pb-6">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (!q.trim()) return;
            close();
            router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <label htmlFor="site-search" className="sr-only">
            Search labels
          </label>
          <div className="relative">
            <Search aria-hidden className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-600" />
            <input
              id="site-search"
              autoFocus
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by size, printer or product - try '4x6 rollo'"
              autoComplete="off"
              aria-describedby="search-status"
              className="h-14 w-full rounded-[12px] border border-line bg-bg pr-4 pl-12 text-base focus:border-navy-700 focus:bg-white focus:outline-none focus-visible:ring-[3px] focus-visible:ring-navy-700/25"
            />
          </div>
        </form>

        <p id="search-status" className="sr-only" aria-live="polite">
          {q.trim().length >= 2 ? `${results.length} results` : ""}
        </p>

        {q.trim().length < 2 ? (
          <div className="mt-5">
            <p className="text-xs font-semibold tracking-[0.12em] text-ink-600 uppercase">Popular searches</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQ(s)}
                  className="h-9 rounded-full border border-line px-4 text-sm font-medium text-navy-700 hover:bg-navy-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="mt-6 text-ink-600">
            No results for &ldquo;{q}&rdquo;. Try a size like 4x6 or{" "}
            <Link href="/printer-finder" onClick={close} className="font-semibold text-navy-700 underline">
              use the printer finder
            </Link>
            .
          </p>
        ) : (
          <div className="mt-5 grid gap-6 md:grid-cols-[1fr_220px]">
            {products.length > 0 && (
              <section aria-labelledby="sr-products">
                <h2 id="sr-products" className="mb-2 text-xs font-semibold tracking-[0.12em] text-ink-600 uppercase" style={{ fontFamily: "inherit" }}>
                  Products
                </h2>
                <ul className="space-y-1">
                  {products.map((r) => (
                    <li key={r.id}>
                      <Link href={r.href} onClick={close} className="flex items-center gap-3 rounded-[10px] p-2 hover:bg-navy-50 focus-visible:bg-navy-50">
                        <span className="w-14 shrink-0 rounded-[8px] bg-bg p-1">
                          <ProductVisual {...visualProps(r.product!)} size="sm" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-semibold text-navy-900">{r.title}</span>
                          <span className="block text-[13px] text-ink-600">{r.subtitle}</span>
                        </span>
                        <span className="hidden text-sm font-semibold text-action-600 tabular-nums sm:block">
                          From {perLabelMoney(fromPerLabel(r.product!))}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {cats.length > 0 && (
              <section aria-labelledby="sr-cats">
                <h2 id="sr-cats" className="mb-2 text-xs font-semibold tracking-[0.12em] text-ink-600 uppercase" style={{ fontFamily: "inherit" }}>
                  Categories
                </h2>
                <ul className="space-y-1">
                  {cats.map((r) => (
                    <li key={r.id}>
                      <Link href={r.href} onClick={close} className="flex items-center gap-2 rounded-[10px] p-2 text-[15px] font-medium text-navy-900 hover:bg-navy-50">
                        <CategoryIcon name="Tag" className="size-4 text-navy-700" />
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <Link
              href={`/search?q=${encodeURIComponent(q.trim())}`}
              onClick={close}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 md:col-span-2"
            >
              <span className="link-underline">See all {results.length} results</span>
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </Sheet>
  );
}
