"use client";

import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { useHydrated, useUi } from "@/lib/store/ui";
import { CartLine, FreeShippingNote, OrderSummaryRows, PromoCode, useCartTotals } from "./CartParts";

/** Right slide-in cart (420 px, full width on mobile), available from any page. */
export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUi();
  const hydrated = useHydrated();
  const { lines, promo, subtotal, discount, shipping, total } = useCartTotals();
  const pathname = usePathname();
  const first = useRef(pathname);
  useEffect(() => {
    if (pathname !== first.current) {
      first.current = pathname;
      setCartOpen(false);
    }
  }, [pathname, setCartOpen]);

  const empty = !hydrated || lines.length === 0;

  return (
    <Sheet
      open={cartOpen}
      onOpenChange={setCartOpen}
      title={empty ? "Your cart" : `Your cart (${lines.reduce((n, l) => n + l.qty, 0)})`}
      footer={
        !empty && (
          <div className="space-y-4">
            <OrderSummaryRows subtotal={subtotal} discount={discount} shipping={shipping} total={total} promo={promo} />
            <div className="grid gap-2">
              <ButtonLink href="/checkout">Checkout</ButtonLink>
              <ButtonLink href="/cart" variant="secondary">
                View cart
              </ButtonLink>
            </div>
          </div>
        )
      }
    >
      {empty ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700">
            <ShoppingCart aria-hidden className="size-7" strokeWidth={1.75} />
          </span>
          <p className="text-lg font-semibold text-navy-900">Your cart is empty</p>
          <ButtonLink href="/shop?sort=best" onClick={() => setCartOpen(false)}>
            Shop best sellers
          </ButtonLink>
        </div>
      ) : (
        <div className="px-5">
          <FreeShippingNote className="mt-4" />
          <ul className="divide-y divide-line">
            {lines.map((l) => (
              <CartLine key={l.productId} line={l} compact />
            ))}
          </ul>
          <div className="border-t border-line py-4">
            <PromoCode />
          </div>
        </div>
      )}
    </Sheet>
  );
}
