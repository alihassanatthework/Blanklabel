import type { Metadata } from "next";
import { SearchResults } from "@/components/listing/SearchResults";
import { Breadcrumbs } from "@/components/ui/misc";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Search", description: "Search BlankLabels.com by size, printer or product name.", path: "/search" }),
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <h1 className="text-h1 mt-4 mb-6">Search results</h1>
      <SearchResults />
    </div>
  );
}
