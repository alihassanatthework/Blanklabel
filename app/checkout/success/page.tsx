import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccess } from "@/components/cart/OrderSuccess";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false, follow: false } };

export default function SuccessPage() {
  return (
    <div className="container-x py-12 lg:py-20">
      <Suspense fallback={<div className="mx-auto h-80 max-w-xl animate-pulse rounded-[20px] bg-white" aria-hidden />}>
        <OrderSuccess />
      </Suspense>
    </div>
  );
}
