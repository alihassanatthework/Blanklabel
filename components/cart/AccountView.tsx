"use client";

import Link from "next/link";
import { CalendarClock, MapPin, Package, Printer as PrinterIcon, RefreshCw, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { ProductVisual, visualProps } from "@/components/product/ProductVisual";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DemoBanner } from "@/components/ui/misc";
import { Tabs } from "@/components/ui/Tabs";
import { getDemoAccount } from "@/lib/data/actions";
import { useAccountExtras } from "@/lib/store/account";
import { useCart } from "@/lib/store/cart";
import { useUi } from "@/lib/store/ui";
import { cn, money } from "@/lib/utils";
import type { Account, Order } from "@/types";

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function AccountView() {
  const [account, setAccount] = useState<Account | null>(null);
  const { byId } = useCatalog();
  const addMany = useCart((s) => s.addMany);
  const add = useCart((s) => s.add);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const { savedPrinters, removePrinter, replenishWeeks, setReplenish } = useAccountExtras();

  useEffect(() => {
    getDemoAccount().then(setAccount);
  }, []);

  if (!account) return <div className="mt-8 h-96 animate-pulse rounded-[16px] bg-white" aria-hidden />;

  const reorder = (o: Order) => {
    addMany(o.lines);
    setCartOpen(true);
    toast.success(`Order ${o.orderNumber} added to cart`);
  };
  const last = account.orders[0];
  const printers = [...new Set([...account.savedPrinters, ...savedPrinters])];
  const everOrdered = [...new Set(account.orders.flatMap((o) => o.lines.map((l) => l.productId)))]
    .map((id) => byId(id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const OrderLines = ({ o }: { o: Order }) => (
    <ul className="flex flex-wrap gap-2">
      {o.lines.map((l) => {
        const p = byId(l.productId);
        return (
          p && (
            <li key={l.productId} className="flex items-center gap-2 rounded-[10px] bg-bg py-1 pr-3 pl-1 text-sm">
              <span className="w-10 rounded-[6px] bg-white p-0.5">
                <ProductVisual {...visualProps(p)} size="sm" />
              </span>
              {l.qty} × {p.shortName}
            </li>
          )
        );
      })}
    </ul>
  );

  return (
    <div className="mt-6">
      <DemoBanner message={`Demo account - Welcome back, ${account.firstName} (${account.persona}).`} />
      <Tabs
        className="mt-6"
        label="Account sections"
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_1fr]">
                {last && (
                  <Card className="border-navy-700/20 p-6">
                    <p className="flex items-center gap-2 text-sm font-semibold text-action-600">
                      <RefreshCw aria-hidden className="size-4" /> Reorder your last order
                    </p>
                    <h2 className="text-h3 mt-2">
                      {last.orderNumber} · {fmt(last.date)}
                    </h2>
                    <div className="mt-4">
                      <OrderLines o={last} />
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <Button onClick={() => reorder(last)}>
                        <ShoppingCart aria-hidden className="size-4" />
                        Reorder in one click
                      </Button>
                      <span className="text-sm text-ink-600">Total last time: {money(last.total)}</span>
                    </div>
                  </Card>
                )}
                <Card className="p-6">
                  <h2 className="text-h4">Your account</h2>
                  <dl className="mt-4 space-y-3 text-[15px]">
                    <div>
                      <dt className="text-sm text-ink-600">Name</dt>
                      <dd className="font-medium">{account.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-ink-600">Company</dt>
                      <dd className="font-medium">{account.company}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-ink-600">Saved printer</dt>
                      <dd className="font-medium">{printers.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-ink-600">Orders</dt>
                      <dd className="font-medium">{account.orders.length}</dd>
                    </div>
                  </dl>
                </Card>
              </div>
            ),
          },
          {
            id: "orders",
            label: "Orders",
            content: (
              <ul className="space-y-4">
                {account.orders.map((o) => (
                  <li key={o.orderNumber}>
                    <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                      <div className="md:w-48">
                        <p className="font-semibold text-navy-900">{o.orderNumber}</p>
                        <p className="text-sm text-ink-600">{fmt(o.date)}</p>
                        <span
                          className={cn(
                            "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
                            o.status === "Delivered" ? "bg-teal-600/10 text-teal-600" : "bg-navy-50 text-navy-700",
                          )}
                        >
                          {o.status}
                        </span>
                      </div>
                      <div className="flex-1">
                        <OrderLines o={o} />
                      </div>
                      <div className="flex items-center gap-4 md:flex-col md:items-end">
                        <p className="font-bold text-navy-900 tabular-nums">{money(o.total)}</p>
                        <Button size="sm" variant="secondary" onClick={() => reorder(o)}>
                          <RefreshCw aria-hidden className="size-4" />
                          Reorder
                        </Button>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: "reorder",
            label: "Reorder list",
            content: (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {everOrdered.map((p) => (
                  <li key={p.id}>
                    <Card className="flex h-full items-center gap-4 p-4">
                      <span className="w-20 shrink-0 rounded-[10px] bg-bg p-1.5">
                        <ProductVisual {...visualProps(p)} size="sm" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <Link href={`/product/${p.slug}`} className="block font-semibold text-navy-900 hover:underline">
                          {p.shortName}
                        </Link>
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            add(p.id, p.tiers[0].minQty);
                            setCartOpen(true);
                          }}
                        >
                          Add again
                        </Button>
                      </span>
                    </Card>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: "printers",
            label: "Saved printers",
            content: (
              <div>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {printers.map((name) => (
                    <li key={name}>
                      <Card className="flex items-center gap-3 p-4">
                        <span className="flex size-10 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                          <PrinterIcon aria-hidden className="size-5" />
                        </span>
                        <span className="flex-1 font-semibold text-navy-900">{name}</span>
                        {savedPrinters.includes(name) && !account.savedPrinters.includes(name) && (
                          <button
                            type="button"
                            aria-label={`Remove ${name}`}
                            onClick={() => removePrinter(name)}
                            className="flex size-9 items-center justify-center rounded-full text-ink-600 hover:bg-navy-50 hover:text-danger"
                          >
                            <Trash2 aria-hidden className="size-4" />
                          </button>
                        )}
                      </Card>
                    </li>
                  ))}
                </ul>
                <ButtonLink href="/printer-finder" variant="secondary" className="mt-5">
                  Add a printer
                </ButtonLink>
              </div>
            ),
          },
          {
            id: "addresses",
            label: "Addresses",
            content: (
              <ul className="grid gap-4 sm:grid-cols-2">
                {account.addresses.map((a) => (
                  <li key={a.id}>
                    <Card className="flex gap-3 p-5">
                      <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-navy-700" />
                      <div>
                        <p className="text-sm font-semibold text-ink-600">{a.label}</p>
                        <p className="mt-1 font-medium">{a.name}</p>
                        <p className="text-ink-600">
                          {a.line1}
                          <br />
                          {a.city}, {a.state} {a.zip}
                        </p>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: "replenish",
            label: "Auto-replenish",
            content: (
              <Card className="max-w-2xl p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <CalendarClock aria-hidden className="size-6 text-navy-700" />
                  <h2 className="text-h4">Auto-replenish</h2>
                  <Badge variant="demo">Coming after approval</Badge>
                </div>
                <p className="mt-3 text-ink-600">
                  Never run out of labels. Choose how often to resend your usual order - you can pause or skip any delivery.
                </p>
                <fieldset className="mt-5">
                  <legend className="mb-2 text-sm font-medium">Resend {last?.orderNumber} every</legend>
                  <div className="flex flex-wrap gap-2">
                    {([4, 6, 8] as const).map((w) => (
                      <button
                        key={w}
                        type="button"
                        aria-pressed={replenishWeeks === w}
                        onClick={() => setReplenish(replenishWeeks === w ? null : w)}
                        className={cn(
                          "h-11 rounded-[10px] border-[1.5px] px-5 font-semibold",
                          replenishWeeks === w ? "border-navy-700 bg-navy-50 text-navy-900" : "border-line text-ink-600 hover:border-navy-700/40",
                        )}
                      >
                        {w} weeks
                      </button>
                    ))}
                  </div>
                </fieldset>
                <p className="mt-4 flex items-center gap-2 text-sm text-ink-600">
                  <Package aria-hidden className="size-4" />
                  {replenishWeeks ? `Preview: next delivery in ${replenishWeeks} weeks. No order will be placed in this demo.` : "No schedule set."}
                </p>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
