import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getAllProducts, getCategories, getNews } from "@/lib/data";
import { categoryHref } from "@/lib/data/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, news] = await Promise.all([getAllProducts(), getCategories(), getNews()]);
  const staticPaths = [
    "/",
    "/shop",
    "/printer-finder",
    "/custom-labels",
    "/bulk",
    "/materials-colors",
    "/about",
    "/news",
    "/contact",
    "/shipping",
    "/returns",
    "/privacy-policy",
    "/terms-and-conditions",
  ];
  return [
    ...staticPaths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: `${SITE_URL}${categoryHref(c)}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...news.map((n) => ({ url: `${SITE_URL}/news/${n.slug}`, lastModified: n.date, priority: 0.5 })),
  ];
}
