// Data access API - the seam for the future backend (spec 8.5).
// Components never import JSON directly. Today these read local JSON; after approval
// each function becomes a fetch() to the commerce API with the same signature.
import type {
  Account,
  Category,
  Facet,
  Faq,
  NewsArticle,
  Order,
  Printer,
  Product,
  ProductFilter,
  Review,
  SearchResult,
  SiteConfig,
} from "@/types";
import type { CheckoutInput, ContactInput, QuoteInput, SampleInput } from "@/lib/schemas";
import { buildFacets, filterProducts } from "@/lib/filters";
import { lineTotal } from "@/lib/pricing";
import { createSearch } from "@/lib/search";
import { randomRef, sleep } from "@/lib/utils";
import { categories, findByPath, leafIdsOf } from "./categories";
import { accountSource, faqs, materials, news, printers, reviews, site, swatches } from "./content";
import { productById, productBySlug, products } from "./products";

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlugPath(path: string[]): Promise<Category | null> {
  return findByPath(path);
}

export async function getProducts(
  filter: ProductFilter = {},
): Promise<{ items: Product[]; total: number; facets: Facet[] }> {
  const scope = filter.category
    ? products.filter((p) => leafIdsOf(filter.category!).includes(p.categoryId))
    : products;
  const items = filterProducts(scope, filter);
  return { items, total: items.length, facets: buildFacets(scope, filter) };
}

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return productBySlug(slug);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return ids.map(productById).filter((p): p is Product => !!p);
}

export async function getRelatedProducts(id: string, limit = 6): Promise<Product[]> {
  const p = productById(id);
  if (!p) return [];
  const related = p.relatedIds.map(productById).filter((x): x is Product => !!x);
  const sameCat = products.filter((x) => x.categoryId === p.categoryId && x.id !== id && !p.relatedIds.includes(x.id));
  const sameMat = products.filter(
    (x) => x.material === p.material && x.id !== id && !related.includes(x) && !sameCat.includes(x),
  );
  return [...related, ...sameCat, ...sameMat].slice(0, limit);
}

export async function getPrinters(): Promise<Printer[]> {
  return printers;
}

let searcher: ReturnType<typeof createSearch> | null = null;
export async function searchCatalog(q: string): Promise<SearchResult[]> {
  searcher ??= createSearch(products, categories);
  return searcher(q);
}

export async function getFaqs(scope: Faq["scope"] = "home"): Promise<Faq[]> {
  return faqs.filter((f) => f.scope === scope);
}

export async function getReviews(): Promise<Review[]> {
  return reviews;
}

export async function getNews(): Promise<NewsArticle[]> {
  return news;
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  return news.find((n) => n.slug === slug) ?? null;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return site;
}

export async function getMaterials() {
  return { materials, swatches };
}

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
