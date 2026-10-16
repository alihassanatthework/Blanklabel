"use client";

import { ShoppingCart } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useHydrated } from "@/lib/store/ui";
import { CartLine, FreeShippingNote, OrderSummaryRows, PromoCode, useCartTotals } from "./CartParts";

export function CartPageView() {
  const hydrated = useHydrated();
  const { lines, promo, subtotal, discount, shipping, total } = useCartTotals();

  if (!hydrated) return <div className="mt-8 h-64 animate-pulse rounded-[16px] bg-white" aria-hidden />;

  if (lines.length === 0)
    return (
      <Card className="mt-8 flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700">
          <ShoppingCart aria-hidden className="size-7" strokeWidth={1.75} />
        </span>
        <p className="text-h3">Your cart is empty</p>
        <ButtonLink href="/shop?sort=best">Shop best sellers</ButtonLink>
      </Card>
    );

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Card className="px-5 sm:px-6">
        <FreeShippingNote className="mt-5" />
        <ul className="divide-y divide-line">
          {lines.map((l) => (
            <CartLine key={l.productId} line={l} />
          ))}
        </ul>
      </Card>
      <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
        <Card className="space-y-5 p-6">
          <h2 className="text-h4">Order summary</h2>
          <PromoCode />
          <OrderSummaryRows subtotal={subtotal} discount={discount} shipping={shipping} total={total} promo={promo} />
          <ButtonLink href="/checkout" className="w-full">
            Checkout
          </ButtonLink>
          <ButtonLink href="/shop" variant="secondary" className="w-full">
            Continue shopping
          </ButtonLink>
        </Card>
      </aside>
    </div>
  );
}
