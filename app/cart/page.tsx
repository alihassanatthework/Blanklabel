import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";
import { Breadcrumbs } from "@/components/ui/misc";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Cart", description: "Review your BlankLabels cart - free US shipping on every order.", path: "/cart" }),
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="text-h1 mt-4">Your cart</h1>
      <CartPageView />
    </div>
  );
}
