import type { Metadata } from "next";
import { AccountView } from "@/components/cart/AccountView";
import { Breadcrumbs } from "@/components/ui/misc";

export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };

export default function AccountPage() {
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My account" }]} />
      <h1 className="text-h1 mt-4">My account</h1>
      <AccountView />
    </div>
  );
}
