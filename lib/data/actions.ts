import type { Account, Order } from "@/types";
import type { CheckoutInput, ContactInput, QuoteInput, SampleInput } from "@/lib/schemas";
import { lineTotal } from "@/lib/pricing";
import { randomRef, sleep } from "@/lib/utils";
import accountJson from "@/data/account.json";
import { productById } from "./products";

const accountSource = accountJson;

/* ---------- Simulated actions (same shape a real API will accept/return) ---------- */

function remember(key: string, value: unknown) {
  console.log(`[demo] ${key}`, value);
  try {
    const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
    localStorage.setItem(key, JSON.stringify([...prev, value]));
  } catch {
    /* storage unavailable - demo still succeeds */
  }
}

export async function submitQuote(input: QuoteInput): Promise<{ reference: string }> {
  await sleep(900);
  const reference = randomRef("QTE", 6);
  remember("demo_quotes", { reference, ...input, at: new Date().toISOString() });
  return { reference };
}

export async function submitSample(input: SampleInput): Promise<{ reference: string }> {
  await sleep(800);
  const reference = randomRef("SMP", 5);
  remember("demo_samples", { reference, ...input, at: new Date().toISOString() });
  return { reference };
}

export async function submitContact(input: ContactInput): Promise<{ ok: true }> {
  await sleep(800);
  remember("demo_contacts", { ...input, at: new Date().toISOString() });
  return { ok: true };
}

export async function subscribeNewsletter(email: string): Promise<{ code: "WELCOME10" }> {
  await sleep(600);
  remember("demo_newsletter", { email, at: new Date().toISOString() });
  return { code: "WELCOME10" };
}

export async function placeOrder(input: CheckoutInput): Promise<{ orderNumber: string }> {
  await sleep(1200);
  const orderNumber = `BL-1${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;
  const { cardNumber, cardCvc, cardExpiry, ...safe } = input;
  void cardNumber;
  void cardCvc;
  void cardExpiry;
  const order: Order = {
    orderNumber,
    date: new Date().toISOString(),
    status: "Processing",
    lines: input.lines,
    total: input.total,
  };
  console.log("[demo] order", { ...safe, orderNumber });
  try {
    const prev = JSON.parse(localStorage.getItem("demo_orders") ?? "[]");
    localStorage.setItem("demo_orders", JSON.stringify([order, ...prev]));
  } catch {
    /* ignore */
  }
  return { orderNumber };
}

/** Demo customer from account.json with dates relative to today, plus orders placed in the demo checkout. */
export async function getDemoAccount(): Promise<Account> {
  const day = 86_400_000;
  const base: Order[] = accountSource.orders.map((o) => ({
    orderNumber: o.orderNumber,
    date: new Date(Date.now() - o.daysAgo * day).toISOString(),
    status: o.status as Order["status"],
    lines: o.lines,
    total: Math.round(o.lines.reduce((s, l) => s + lineTotal(productById(l.productId)!, l.qty), 0) * 100) / 100,
  }));
  let demo: Order[] = [];
  if (typeof window !== "undefined") {
    try {
      demo = JSON.parse(localStorage.getItem("demo_orders") ?? "[]");
    } catch {
      demo = [];
    }
  }
  const { orders: _orders, ...rest } = accountSource;
  void _orders;
  return { ...rest, orders: [...demo, ...base] };
}
