import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import { fullAddress } from "@/lib/config";
import { money } from "@/lib/utils";
import { site } from "./content";

// Policy pages render content/*.md; shipping/returns values come from site config (ASSUMPTION A3).
export const POLICIES = {
  shipping: "Shipping and Deliveries",
  returns: "Returns and Refunds",
  "privacy-policy": "Privacy Policy",
  "terms-and-conditions": "Terms & Conditions",
} as const;

export type PolicySlug = keyof typeof POLICIES;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function getPolicy(slug: string) {
  if (!(slug in POLICIES)) return null;
  const raw = await readFile(path.join(process.cwd(), "content", `${slug}.md`), "utf8");
  const tokens: Record<string, string> = {
    shippingLabel: site.shippingLabel,
    returnsLabel: site.returnsLabel,
    returnsDays: String(site.returnsDays),
    expedited: money(site.expeditedShipping),
    phone: site.phone,
    email: site.email,
    address: fullAddress,
  };
  const md = raw.replace(/\{\{(\w+)\}\}/g, (_, k) => tokens[k] ?? "");
  const toc: { id: string; title: string }[] = [];
  let html = await marked.parse(md);
  html = html.replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
    const id = slugify(inner);
    toc.push({ id, title: inner.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&") });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { title: POLICIES[slug as PolicySlug], html, toc };
}
