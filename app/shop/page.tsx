import type { Metadata } from "next";
import { ListingHeader } from "@/components/listing/ListingHeader";
import { ProductListing } from "@/components/listing/ProductListing";
import { getProducts } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shop all labels",
  description:
    "Fanfold, rolls, integrated shipping and sheet labels made in the USA. Filter by printer, size and material and see the real per-label price.",
  path: "/shop",
});

export default async function ShopPage() {
  const initial = await getProducts();
  return (
    <>
      <ListingHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        title="Shop all labels"
        intro="Every label we make, with printer compatibility and the real per-label price. Filter by printer, size or material."
      />
      <div className="container-x py-8 lg:py-10">
        <ProductListing initial={initial} />
      </div>
    </>
  );
}
