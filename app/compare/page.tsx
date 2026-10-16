import type { Metadata } from "next";
import { CompareView } from "@/components/cart/SavedViews";
import { Breadcrumbs } from "@/components/ui/misc";

export const metadata: Metadata = { title: "Compare products", robots: { index: false, follow: false } };

export default function ComparePage() {
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
      <h1 className="text-h1 mt-4">Compare products</h1>
      <CompareView />
    </div>
  );
}
