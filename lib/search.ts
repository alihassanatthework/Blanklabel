import Fuse from "fuse.js";
import type { Category, PrinterId, Product, SearchResult } from "@/types";
import { MATERIAL_LABEL, PRINTER_LABEL, USE_LABEL, sizeKey } from "./filters";
import { categoryHref } from "./data/categories";

interface Doc {
  result: SearchResult;
  text: string; // whole searchable text
  terms: string[]; // individual words, for per-token fuzzy matching
}

function productDoc(p: Product, categories: Category[]): Doc {
  const cat = categories.find((c) => c.id === p.categoryId);
  const text = [
    p.name,
    p.shortName,
    p.sku,
    sizeKey(p),
    `${p.widthIn} x ${p.lengthIn}`,
    MATERIAL_LABEL[p.material],
    cat?.name ?? "",
    ...p.printers.map((x) => PRINTER_LABEL[x]),
    ...p.uses.map((u) => USE_LABEL[u]),
    p.unitName,
  ].join(" ");
  return {
    result: {
      type: "product",
      id: p.id,
      title: p.name,
      subtitle: `${p.sku} · ${cat?.name ?? ""}`,
      href: `/product/${p.slug}`,
      product: p,
    },
    text,
    terms: tokenize(text),
  };
}

function categoryDoc(c: Category): Doc {
  const text = `${c.name} ${c.description}`;
  return {
    result: { type: "category", id: c.id, title: c.name, subtitle: c.description, href: categoryHref(c) },
    text,
    terms: tokenize(text),
  };
}

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9.x/ ]+/g, " ")
    .split(/[\s/]+/)
    .filter((t) => t.length > 0);

/**
 * Typo-tolerant search: every query token must fuzzily match some word of a document
 * (so '4x6 rolo' finds Rollo-compatible 4x6 labels). Scores are summed per document.
 */
export function createSearch(products: Product[], categories: Category[]) {
  const docs = [...products.map((p) => productDoc(p, categories)), ...categories.map(categoryDoc)];
  const vocabulary = [...new Set(docs.flatMap((d) => d.terms))];
  const fuse = new Fuse(vocabulary, { includeScore: true, threshold: 0.34, ignoreLocation: true });

  const printerFuse = new Fuse(
    Object.entries(PRINTER_LABEL).flatMap(([id, label]) =>
      label
        .toLowerCase()
        .split(/[\s/]+/)
        .filter((w) => w.length > 2)
        .map((w) => ({ id: id as PrinterId, w })),
    ),
    { keys: ["w"], includeScore: true, threshold: 0.3 },
  );

  return function search(q: string): SearchResult[] {
    let tokens = tokenize(q);
    if (!tokens.length) return [];

    // Size tokens ('4x6') match exactly; printer names ('rolo' -> Rollo) become a compatibility constraint.
    const sizes = tokens.filter((t) => /^\d+(\.\d+)?x\d+(\.\d+)?$/.test(t));
    const printerIds = new Set<PrinterId>();
    tokens = tokens.filter((t) => {
      if (sizes.includes(t)) return false;
      const hit = t.length > 2 ? printerFuse.search(t)[0] : undefined;
      if (hit && (hit.score ?? 1) < 0.3) {
        printerIds.add(hit.item.id);
        return false;
      }
      return true;
    });
    const constrained = sizes.length > 0 || printerIds.size > 0;
    const pool = docs.filter((d) => {
      const p = d.result.product;
      if (!constrained) return true;
      if (!p) return false;
      if (sizes.length && !sizes.includes(sizeKey(p))) return false;
      if (printerIds.size && !p.printers.some((x) => printerIds.has(x))) return false;
      return true;
    });

    const scores = new Map<Doc, number>(pool.map((d) => [d, 0]));
    for (const token of tokens) {
      const hits = new Map<string, number>();
      for (const h of fuse.search(token)) hits.set(h.item, h.score ?? 0);
      for (const v of vocabulary) if (v.startsWith(token)) hits.set(v, Math.min(hits.get(v) ?? 1, 0));
      for (const d of [...scores.keys()]) {
        let best = Infinity;
        for (const t of d.terms) {
          const s = hits.get(t);
          if (s != null && s < best) best = s;
        }
        if (best === Infinity) scores.delete(d);
        else scores.set(d, scores.get(d)! + best);
      }
    }
    return [...scores.entries()]
      .sort((a, b) => a[1] - b[1] || (a[0].result.product?.sortRank ?? 99) - (b[0].result.product?.sortRank ?? 99))
      .map(([d]) => d.result);
  };
}
