import Link from "next/link";
import { Search } from "lucide-react";
import { CategoryIcon } from "@/components/ui/icons";
import { getCategories } from "@/lib/data";
import { categoryHref } from "@/lib/data/categories";

export default async function NotFound() {
  const cats = (await getCategories()).filter((c) => !c.isGroup);
  return (
    <div className="container-x py-12 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="relative mx-auto w-full max-w-sm rounded-[24px] border-2 border-line bg-white px-8 py-10 shadow-md">
          <span aria-hidden className="absolute top-5 left-5 size-4 rounded-full bg-action-500" />
          <div aria-hidden className="perforation absolute inset-x-6 bottom-16" />
          <p className="font-[family-name:var(--font-jakarta)] text-[96px] leading-none font-extrabold tracking-tight text-navy-900">404</p>
          <div aria-hidden className="barcode-stripe mx-auto mt-10 h-8 w-40 text-navy-900" />
        </div>
        <h1 className="text-h2 mt-10">This label fell off the roll</h1>
        <p className="mt-3 text-lg text-ink-600">The page you&apos;re looking for doesn&apos;t exist. Search for a product or pick a category.</p>
        <form action="/search" method="get" role="search" className="mx-auto mt-6 flex max-w-md gap-2">
          <label htmlFor="nf-search" className="sr-only">
            Search labels
          </label>
          <input
            id="nf-search"
            name="q"
            type="search"
            placeholder="Try 4x6 fanfold"
            className="h-12 min-w-0 flex-1 rounded-[10px] border border-line bg-white px-4 focus:border-navy-700 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-navy-700/25"
          />
          <button type="submit" className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-action-500 px-5 font-semibold text-white hover:bg-action-600">
            <Search aria-hidden className="size-4" />
            Search
          </button>
        </form>
      </div>
      <ul className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((c) => (
          <li key={c.id}>
            <Link href={categoryHref(c)} className="flex items-center gap-3 rounded-[12px] border border-line bg-white p-4 font-semibold text-navy-900 shadow-sm hover:bg-navy-50">
              <CategoryIcon name={c.icon} className="size-5 text-navy-700" />
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
