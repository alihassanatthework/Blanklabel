// Data access API - the seam for the future backend (spec 8.5).
// Components never import JSON directly. Today these read local JSON; after approval
// each function becomes a fetch() to the commerce API with the same signature.
import type {
  Category,
  Facet,
  Faq,
  NewsArticle,
  Printer,
  Product,
  ProductFilter,
  Review,
  SearchResult,
  SiteConfig,
} from "@/types";
import { buildFacets, filterProducts } from "@/lib/filters";
import { categories, findByPath, leafIdsOf } from "./categories";
import { faqs, materials, news, printers, reviews, site, swatches } from "./content";
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

let searcher: ((q: string) => SearchResult[]) | null = null;
export async function searchCatalog(q: string): Promise<SearchResult[]> {
  // The search engine (Fuse.js) loads on first use, keeping it out of the initial bundle.
  if (!searcher) {
    const { createSearch } = await import("@/lib/search");
    searcher = createSearch(products, categories);
  }
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

// Simulated actions live in ./actions so client forms don't bundle the whole catalogue.
export {
  submitQuote,
  submitSample,
  submitContact,
  subscribeNewsletter,
  placeOrder,
  getDemoAccount,
} from "./actions";
