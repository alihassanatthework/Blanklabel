import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Breadcrumbs } from "@/components/ui/misc";
import { pageMetadata } from "@/lib/seo";

// Checkout is heavy and client-only - code-split it.
const CheckoutForm = dynamic(() => import("@/components/forms/CheckoutForm").then((m) => m.CheckoutForm), {
  loading: () => <div className="mt-8 h-96 animate-pulse rounded-[16px] bg-white" aria-hidden />,
});

export const metadata: Metadata = {
  ...pageMetadata({ title: "Checkout", description: "Secure checkout - free US shipping on every order.", path: "/checkout" }),
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="text-h1 mt-4">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
