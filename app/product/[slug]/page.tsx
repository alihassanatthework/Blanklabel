import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BoughtTogether } from "@/components/product/BoughtTogether";
import { BuyBox } from "@/components/product/BuyBox";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductTabs } from "@/components/product/ProductTabs";
import { Breadcrumbs } from "@/components/ui/misc";
import { getAllProducts, getCategories, getProductBySlug, getRelatedProducts, getReviews, getSiteConfig } from "@/lib/data";
import { categoryHref } from "@/lib/data/categories";
import { breadcrumbJsonLd, JsonLd, pageMetadata, productJsonLd } from "@/lib/seo";
import { fromPerLabel } from "@/lib/pricing";
import { perLabelMoney } from "@/lib/utils";

type Params = { slug: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  if (!p) return {};
  return pageMetadata({
    title: p.name,
    description: `${p.name}. From ${perLabelMoney(fromPerLabel(p))} per label. Made in the USA with free US shipping. SKU ${p.sku}.`,
    path: `/product/${p.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const p = await getProductBySlug((await params).slug);
  if (!p) notFound();
  const [categories, related, site, reviews] = await Promise.all([getCategories(), getRelatedProducts(p.id, 8), getSiteConfig(), getReviews()]);
  const cat = categories.find((c) => c.id === p.categoryId)!;
  const parent = categories.find((c) => c.id === cat.parentId);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...(parent ? [{ label: parent.name, href: categoryHref(parent) }] : []),
    { label: cat.name, href: categoryHref(cat) },
    { label: p.shortName },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <JsonLd data={productJsonLd(p)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="container-x pt-6 pb-12 lg:pt-8">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
          <ProductGallery product={p} />
          <BuyBox product={p} site={site} />
        </div>

        <div id="details" className="mt-14 scroll-mt-24">
          <ProductTabs product={p} site={site} reviews={reviews} />
        </div>

        <div className="mt-14">
          <BoughtTogether product={p} companions={related.slice(0, 2)} />
        </div>

        <section aria-labelledby="related-title" className="mt-14">
          <h2 id="related-title" className="text-h2 mb-6">
            Related products
          </h2>
          <ProductCarousel products={related} label="Related products" />
        </section>
      </div>
    </div>
  );
}
