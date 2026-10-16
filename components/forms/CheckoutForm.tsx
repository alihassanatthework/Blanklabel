"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Loader2, Lock, Pencil, ShoppingCart, Smartphone, Wallet } from "lucide-react";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { z } from "zod";
import { FreeShippingNote, OrderSummaryRows, useCartTotals } from "@/components/cart/CartParts";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { ProductVisual, visualProps } from "@/components/product/ProductVisual";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { DemoBanner } from "@/components/ui/misc";
import { placeOrder } from "@/lib/data/actions";
import { lineTotal } from "@/lib/pricing";
import { checkoutSchema } from "@/lib/schemas";
import { useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/ui";
import { cn, money } from "@/lib/utils";

// Card fields are required only when paying by card (no real payment is taken).
const schema = checkoutSchema.superRefine((v, ctx) => {
  if (v.payment !== "card") return;
  if (!v.cardName?.trim()) ctx.addIssue({ code: "custom", path: ["cardName"], message: "Name on card is required" });
  if (!/^\d{12,19}$/.test((v.cardNumber ?? "").replace(/\s/g, "")))
    ctx.addIssue({ code: "custom", path: ["cardNumber"], message: "Enter a valid card number" });
  if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(v.cardExpiry ?? "")) ctx.addIssue({ code: "custom", path: ["cardExpiry"], message: "Use MM/YY" });
  if (!/^\d{3,4}$/.test(v.cardCvc ?? "")) ctx.addIssue({ code: "custom", path: ["cardCvc"], message: "3 or 4 digits" });
});
type Values = z.infer<typeof schema>;

const STEP_FIELDS: FieldPath<Values>[][] = [
  ["email", "phone", "firstName", "lastName", "address", "city", "state", "zip"],
  ["delivery"],
  ["payment", "cardName", "cardNumber", "cardExpiry", "cardCvc"],
];

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { site } = useCatalog();
  const clear = useCart((s) => s.clear);
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { delivery: "ground", payment: "card", company: "" } });
  const delivery = watch("delivery");
  const payment = watch("payment");
  const shippingCost = delivery === "expedited" ? site.expeditedShipping : 0;
  const { lines, promo, subtotal, discount, shipping, total } = useCartTotals(shippingCost);

  if (!hydrated) return <div className="mt-8 h-96 animate-pulse rounded-[16px] bg-white" aria-hidden />;
  if (lines.length === 0)
    return (
      <Card className="mt-8 flex flex-col items-center gap-4 px-6 py-16 text-center">
        <ShoppingCart aria-hidden className="size-10 text-navy-700" />
        <p className="text-h3">Your cart is empty</p>
        <ButtonLink href="/shop?sort=best">Shop best sellers</ButtonLink>
      </Card>
    );

  const next = async (i: number) => {
    if (await trigger(STEP_FIELDS[i])) setStep(i + 1);
  };

  const fillDemo = () => {
    const demo: Partial<Values> = {
      email: "sarah@example.com",
      phone: "919-555-0142",
      firstName: "Sarah",
      lastName: "Mitchell",
      company: "Sarah's Closet Resale",
      address: "1420 Elm Street",
      city: "Raleigh",
      state: "NC",
      zip: "27601",
    };
    Object.entries(demo).forEach(([k, v]) => setValue(k as keyof Values, v as never, { shouldValidate: false }));
  };

  const onSubmit = handleSubmit(async (v) => {
    setProcessing(true);
    const { orderNumber } = await placeOrder({ ...v, lines: lines.map(({ productId, qty }) => ({ productId, qty })), total });
    clear();
    router.push(`/checkout/success?order=${orderNumber}`);
  });

  const header = (i: number, title: string, summary?: string) => (
    <div className="flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-3 text-h4">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full text-sm font-bold",
            step > i ? "bg-teal-600 text-white" : step === i ? "bg-navy-700 text-white" : "bg-navy-50 text-ink-600",
          )}
        >
          {step > i ? <Check aria-hidden className="size-4" strokeWidth={3} /> : i + 1}
        </span>
        {title}
      </h2>
      {step > i && (
        <button type="button" onClick={() => setStep(i)} className="flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:underline">
          <Pencil aria-hidden className="size-3.5" /> Edit
          <span className="sr-only">{title}</span>
        </button>
      )}
      {summary && step > i && <p className="sr-only">{summary}</p>}
    </div>
  );

  const v = getValues();

  return (
    <div className="mt-6">
      <DemoBanner message="Demo checkout - no payment will be taken." className="mb-8" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <form noValidate onSubmit={onSubmit} className="space-y-4" aria-label="Checkout">
          {/* Step 1 */}
          <Card className="p-5 sm:p-6">
            {header(0, "Contact & shipping address")}
            {step > 0 && (
              <p className="mt-3 pl-11 text-sm text-ink-600">
                {v.firstName} {v.lastName} · {v.email} · {v.address}, {v.city}, {v.state} {v.zip}
              </p>
            )}
            <Collapse open={step === 0}>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <button type="button" onClick={fillDemo} className="text-sm font-semibold text-navy-700 underline">
                    Fill demo customer details
                  </button>
                </div>
                <Input label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
                <Input label="Phone" type="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
                <Input label="First name" required autoComplete="given-name" error={errors.firstName?.message} {...register("firstName")} />
                <Input label="Last name" required autoComplete="family-name" error={errors.lastName?.message} {...register("lastName")} />
                <Input label="Company" autoComplete="organization" className="sm:col-span-2" {...register("company")} />
                <Input label="Street address" required autoComplete="street-address" className="sm:col-span-2" error={errors.address?.message} {...register("address")} />
                <Input label="City" required autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="State" required autoComplete="address-level1" maxLength={2} error={errors.state?.message} {...register("state")} />
                  <Input label="ZIP" required autoComplete="postal-code" inputMode="numeric" error={errors.zip?.message} {...register("zip")} />
                </div>
                <div className="sm:col-span-2">
                  <Button onClick={() => next(0)}>Continue to delivery</Button>
                </div>
              </div>
            </Collapse>
          </Card>

          {/* Step 2 */}
          <Card className="p-5 sm:p-6">
            {header(1, "Delivery")}
            {step > 1 && (
              <p className="mt-3 pl-11 text-sm text-ink-600">{delivery === "expedited" ? `Expedited - ${money(site.expeditedShipping)}` : "Free ground"}</p>
            )}
            <Collapse open={step === 1}>
              <fieldset className="mt-5 space-y-3">
                <legend className="sr-only">Delivery method</legend>
                {[
                  { id: "ground", title: "Free ground", note: "2-5 business days", price: "Free" },
                  { id: "expedited", title: "Expedited", note: "1-2 business days", price: money(site.expeditedShipping) },
                ].map((o) => (
                  <label
                    key={o.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-[12px] border-[1.5px] p-4",
                      delivery === o.id ? "border-navy-700 bg-navy-50" : "border-line hover:border-navy-700/40",
                    )}
                  >
                    <input type="radio" value={o.id} {...register("delivery")} className="size-5 accent-[var(--color-navy-700)]" />
                    <span className="flex-1">
                      <span className="block font-semibold text-navy-900">{o.title}</span>
                      <span className="text-sm text-ink-600">{o.note}</span>
                    </span>
                    <span className={cn("font-semibold", o.price === "Free" ? "text-teal-600" : "text-navy-900")}>{o.price}</span>
                  </label>
                ))}
                <Button onClick={() => next(1)}>Continue to payment</Button>
              </fieldset>
            </Collapse>
          </Card>

          {/* Step 3 */}
          <Card className="p-5 sm:p-6">
            {header(2, "Payment")}
            <Collapse open={step === 2}>
              <div className="mt-5">
                <fieldset>
                  <legend className="mb-3 text-sm font-medium">Payment method</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { id: "card", label: "Card", icon: CreditCard },
                      { id: "paypal", label: "PayPal", icon: Wallet },
                      { id: "apple", label: "Apple Pay", icon: Smartphone },
                      { id: "google", label: "Google Pay", icon: Smartphone },
                    ].map(({ id, label, icon: Icon }) => (
                      <label
                        key={id}
                        className={cn(
                          "flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] border-[1.5px] text-sm font-semibold has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-navy-700/30",
                          payment === id ? "border-navy-700 bg-navy-50 text-navy-900" : "border-line text-ink-600 hover:border-navy-700/40",
                        )}
                      >
                        <input type="radio" value={id} {...register("payment")} className="sr-only" />
                        <Icon aria-hidden className="size-4" />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                {payment === "card" ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Input label="Name on card" autoComplete="off" className="sm:col-span-2" error={errors.cardName?.message} {...register("cardName")} />
                    <Input
                      label="Card number"
                      inputMode="numeric"
                      autoComplete="off"
                      hint="Demo - use a test number such as 4242 4242 4242 4242"
                      className="sm:col-span-2"
                      error={errors.cardNumber?.message}
                      {...register("cardNumber")}
                    />
                    <Input label="Expiry (MM/YY)" autoComplete="off" error={errors.cardExpiry?.message} {...register("cardExpiry")} />
                    <Input label="CVC" inputMode="numeric" autoComplete="off" error={errors.cardCvc?.message} {...register("cardCvc")} />
                  </div>
                ) : (
                  <p className="mt-5 rounded-[10px] bg-bg p-4 text-sm text-ink-600">
                    In the live store you would continue to {payment === "paypal" ? "PayPal" : payment === "apple" ? "Apple Pay" : "Google Pay"} here. In this demo,
                    placing the order completes immediately.
                  </p>
                )}
                <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={processing}>
                  {processing ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Lock aria-hidden className="size-4" />}
                  {processing ? "Processing order..." : `Place order - ${money(total)}`}
                </Button>
              </div>
            </Collapse>
          </Card>
        </form>

        <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
          <Card className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-h4">Order summary</h2>
              <Link href="/cart" className="text-sm font-semibold text-navy-700 hover:underline">
                Edit cart
              </Link>
            </div>
            <ul className="space-y-3">
              {lines.map((l) => (
                <li key={l.productId} className="flex items-center gap-3">
                  <span className="relative w-14 shrink-0 rounded-[8px] border border-line bg-bg p-1">
                    <ProductVisual {...visualProps(l.product)} size="sm" />
                    <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-navy-700 text-[11px] font-bold text-white">
                      {l.qty}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{l.product.shortName}</span>
                  <span className="text-sm font-semibold tabular-nums">{money(lineTotal(l.product, l.qty))}</span>
                </li>
              ))}
            </ul>
            {shipping === 0 && <FreeShippingNote />}
            <OrderSummaryRows subtotal={subtotal} discount={discount} shipping={shipping} total={total} promo={promo} taxNote="$0.00 (demo)" />
          </Card>
        </aside>
      </div>

      <AnimatePresence>
        {processing && (
          <m.div
            role="status"
            aria-live="assertive"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-white/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 aria-hidden className="size-10 animate-spin text-navy-700" />
              <p className="font-semibold text-navy-900">Processing your demo order...</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden"
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}
