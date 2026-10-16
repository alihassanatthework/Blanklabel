import type { Metadata } from "next";
import { WishlistView } from "@/components/cart/SavedViews";
import { Breadcrumbs } from "@/components/ui/misc";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: false } };

export default function WishlistPage() {
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="text-h1 mt-4">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
