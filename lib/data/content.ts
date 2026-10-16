import faqsJson from "@/data/faqs.json";
import materialsJson from "@/data/materials.json";
import newsJson from "@/data/news.json";
import printersJson from "@/data/printers.json";
import reviewsJson from "@/data/reviews.json";
import siteJson from "@/data/site.json";
import type { Faq, MaterialRow, NewsArticle, Printer, Review, SiteConfig, Swatch } from "@/types";

export const site = siteJson as unknown as SiteConfig;
export const faqs = faqsJson as Faq[];
export const reviews = reviewsJson as Review[];
export const news = (newsJson as NewsArticle[]).slice().sort((a, b) => b.date.localeCompare(a.date));
export const printers = printersJson as Printer[];
export const materials = materialsJson.materials as MaterialRow[];
export const swatches = materialsJson.swatches as Swatch[];
