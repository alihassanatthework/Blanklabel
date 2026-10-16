"use client";

import { useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { SuccessCheck } from "@/components/forms/FormSuccess";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DemoNote } from "@/components/ui/misc";
import { money } from "@/lib/utils";
import type { Order } from "@/types";

export function OrderSuccess() {
  const number = useSearchParams().get("order");
  const { byId, site } = useCatalog();
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    try {
      const all: Order[] = JSON.parse(localStorage.getItem("demo_orders") ?? "[]");
      setOrder(all.find((o) => o.orderNumber === number) ?? null);
    } catch {
      setOrder(null);
    }
  }, [number]);

  return (
    <Card className="mx-auto max-w-xl p-6 text-center sm:p-10">
      <div className="flex justify-center">
        <SuccessCheck className="size-16" />
      </div>
      <h1 className="text-h2 mt-5">Thank you - your order is confirmed</h1>
      {number && (
        <p className="mt-3 text-lg text-ink-600">
          Order number <strong className="text-navy-900 tabular-nums">{number}</strong>
        </p>
      )}
      <p className="mt-2 text-ink-600">{site.shippingLabel} from Charlotte, NC. A confirmation email would be sent in the live store.</p>

      {order && (
        <ul className="mt-6 space-y-2 rounded-[12px] bg-bg p-4 text-left text-sm">
          {order.lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-3">
              <span>
                {l.qty} × {byId(l.productId)?.shortName}
              </span>
            </li>
          ))}
          <li className="flex justify-between border-t border-line pt-2 font-semibold text-navy-900">
            <span>Total</span>
            <span className="tabular-nums">{money(order.total)}</span>
          </li>
        </ul>
      )}

      <div className="mt-8 rounded-[16px] border border-navy-700/20 bg-navy-50 p-5 text-left">
        <p className="flex items-center gap-2 font-semibold text-navy-900">
          <RefreshCw aria-hidden className="size-4 text-navy-700" />
          Create an account to reorder in one click
        </p>
        <p className="mt-1 text-sm text-ink-600">Save your printer and reorder this exact order next time with a single button.</p>
        <ButtonLink href="/account" className="mt-4" size="sm">
          Create account
        </ButtonLink>
      </div>
      <div className="mt-6 flex flex-col items-center gap-3">
        <ButtonLink href="/shop" variant="secondary">
          Continue shopping
        </ButtonLink>
        <DemoNote>Demo order - no payment was taken.</DemoNote>
      </div>
    </Card>
  );
}
