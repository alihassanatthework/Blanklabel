"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/icons";
import { searchCatalog } from "@/lib/data";
import type { SearchResult } from "@/types";
import { EmptyState } from "./EmptyState";

export function SearchResults() {
  return (
    <Suspense fallback={<p className="text-ink-600">Loading results...</p>}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [results, setResults] = useState<SearchResult[] | null>(null);

  useEffect(() => {
    setInput(q);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    searchCatalog(q).then(setResults);
  }, [q]);

  const products = results?.filter((r) => r.type === "product") ?? [];
  const cats = results?.filter((r) => r.type === "category") ?? [];

  return (
    <div>
      <form
        role="search"
        className="flex max-w-2xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/search?q=${encodeURIComponent(input.trim())}`, { scroll: false });
        }}
      >
        <label htmlFor="search-page-input" className="sr-only">
          Search labels
        </label>
        <div className="relative flex-1">
          <Search aria-hidden className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-600" />
          <input
            id="search-page-input"
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-12 w-full rounded-[10px] border border-line bg-white pr-4 pl-12 focus:border-navy-700 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-navy-700/25"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <p className="mt-6 text-ink-600" aria-live="polite">
        {q ? (
          <>
            <strong className="text-navy-900">{products.length}</strong> product{products.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </>
        ) : (
          "Type at least 2 characters to search."
        )}
      </p>

      {cats.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Matching categories">
          {cats.map((c) => (
            <li key={c.id}>
              <Link href={c.href} className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium text-navy-700 hover:bg-navy-50">
                <CategoryIcon name="Tag" className="size-4" />
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {results && q.trim().length >= 2 && products.length === 0 ? (
        <div className="mt-8">
          <EmptyState />
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((r) => (
            <li key={r.id}>
              <ProductCard product={r.product!} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
