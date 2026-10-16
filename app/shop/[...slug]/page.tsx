import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingHeader } from "@/components/listing/ListingHeader";
import { ProductListing } from "@/components/listing/ProductListing";
import { getCategories, getCategoryBySlugPath, getProducts } from "@/lib/data";
import { categoryHref } from "@/lib/data/categories";
import { pageMetadata } from "@/lib/seo";

type Params = { slug: string[] };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.path }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategoryBySlugPath(slug);
  if (!c) return {};
  return pageMetadata({ title: c.name, description: c.description, path: categoryHref(c) });
}

/** One segment = group or standalone category; two segments = group/leaf. */
export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const category = await getCategoryBySlugPath(slug);
  if (!category) notFound();

  const [all, initial] = await Promise.all([getCategories(), getProducts({ category: category.id })]);
  const parent = all.find((c) => c.id === category.parentId);
  const subcategories = all.filter((c) => c.parentId === category.id);
  const counts: Record<string, number> = {};
  for (const s of subcategories) counts[s.id] = (await getProducts({ category: s.id })).total;

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...(parent ? [{ label: parent.name, href: categoryHref(parent) }] : []),
    { label: category.name },
  ];

  return (
    <>
      <ListingHeader crumbs={crumbs} title={category.name} intro={category.description} subcategories={subcategories} counts={counts} />
      <div className="container-x py-8 lg:py-10">
        <ProductListing categoryId={category.id} initial={initial} />
      </div>
    </>
  );
}
