import type { Facet, FacetOption, Material, PrinterId, Product, ProductFilter, SortKey, Use } from "@/types";
import { fromPerLabel } from "./pricing";
import { trimNum } from "./utils";

export const MATERIAL_LABEL: Record<Material, string> = {
  "direct-thermal": "Direct Thermal",
  "thermal-transfer": "Thermal Transfer",
  "laser-inkjet": "Laser/Inkjet Paper",
};

export const PRINTER_LABEL: Record<PrinterId, string> = {
  rollo: "Rollo",
  zebra: "Zebra",
  eltron: "Eltron",
  munbyn: "MUNBYN",
  "dymo-4xl": "Dymo 4XL",
  brother: "Brother",
  "laser-inkjet": "Laser/Inkjet",
};

export const PRINTER_ORDER: PrinterId[] = ["rollo", "zebra", "eltron", "munbyn", "dymo-4xl", "brother", "laser-inkjet"];

export const USE_LABEL: Record<Use, string> = {
  shipping: "Shipping labels",
  barcode: "Barcode & product labels",
  address: "Address labels",
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "best", label: "Best selling" },
  { value: "price-asc", label: "Price per label: low to high" },
  { value: "price-desc", label: "Price per label: high to low" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A-Z" },
];

/** Finder size options (hero card + wizard). */
export const SIZE_OPTIONS = ["4x6", "4x3", "2.25x1.25", "2x1", "8.5x11", "8.5x5.5", "Other"];

export const sizeKey = (p: Pick<Product, "widthIn" | "lengthIn">) => `${trimNum(p.widthIn)}x${trimNum(p.lengthIn)}`;
export const coreKey = (p: Product) => (p.coreIn ? String(p.coreIn) : "na");

/**
 * ASSUMPTION A5: 3-inch cores are for Zebra industrial printers only, so a specific
 * desktop Zebra model excludes 3-inch core rolls.
 */
export function fitsModel(p: Product, model?: string) {
  if (!model || model === "Any model" || /industrial/i.test(model)) return true;
  return p.coreIn !== 3;
}

/** Filters except price; used for facet counts and price range. */
function matchesBase(p: Product, f: ProductFilter, skip?: Facet["id"]) {
  if (f.ids && !f.ids.includes(p.id)) return false;
  if (f.size && f.size !== "Other" && sizeKey(p) !== f.size) return false;
  if (f.use && !p.uses.includes(f.use)) return false;
  if (skip !== "material" && f.material?.length && !f.material.includes(p.material)) return false;
  if (skip !== "printer" && f.printer?.length && !f.printer.some((x) => p.printers.includes(x))) return false;
  if (f.model && !fitsModel(p, f.model)) return false;
  if (skip !== "core" && f.core?.length && !f.core.includes(coreKey(p))) return false;
  if (skip !== "width" && f.width?.length && !f.width.includes(trimNum(p.widthIn))) return false;
  if (skip !== "length" && f.length?.length && !f.length.includes(trimNum(p.lengthIn))) return false;
  if (skip !== "perSheet" && f.perSheet?.length && !f.perSheet.includes(String(p.labelsPerSheet ?? ""))) return false;
  return true;
}

export function matches(p: Product, f: ProductFilter) {
  if (!matchesBase(p, f)) return false;
  const ppl = fromPerLabel(p);
  if (f.priceMin != null && ppl < f.priceMin - 1e-9) return false;
  if (f.priceMax != null && ppl > f.priceMax + 1e-9) return false;
  return true;
}

export function sortProducts(items: Product[], sort: SortKey = "best") {
  const arr = [...items];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => fromPerLabel(a) - fromPerLabel(b));
    case "price-desc":
      return arr.sort((a, b) => fromPerLabel(b) - fromPerLabel(a));
    case "newest":
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "name":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return arr.sort((a, b) => a.sortRank - b.sortRank);
  }
}

export function filterProducts(all: Product[], f: ProductFilter) {
  return sortProducts(
    all.filter((p) => matches(p, f)),
    f.sort,
  );
}

function options(
  products: Product[],
  f: ProductFilter,
  id: Facet["id"],
  values: (p: Product) => string[],
  label: (v: string) => string,
  order?: (a: string, b: string) => number,
): FacetOption[] {
  const all = new Set<string>();
  products.forEach((p) => values(p).forEach((v) => all.add(v)));
  const narrowed = products.filter((p) => matchesBase(p, f, id));
  const list = [...all].map((v) => ({
    value: v,
    label: label(v),
    count: narrowed.filter((p) => values(p).includes(v)).length,
  }));
  return order ? list.sort((a, b) => order(a.value, b.value)) : list;
}

const num = (a: string, b: string) => Number(a) - Number(b);

/** Facet values are derived from the product data (spec 4.1). `scope` = products in the current category. */
export function buildFacets(scope: Product[], f: ProductFilter): Facet[] {
  const facets: Facet[] = [
    {
      id: "material",
      label: "Material",
      type: "multi",
      options: options(scope, f, "material", (p) => [p.material], (v) => MATERIAL_LABEL[v as Material]),
    },
    {
      id: "printer",
      label: "Printer",
      type: "multi",
      options: options(
        scope,
        f,
        "printer",
        (p) => p.printers,
        (v) => PRINTER_LABEL[v as PrinterId],
        (a, b) => PRINTER_ORDER.indexOf(a as PrinterId) - PRINTER_ORDER.indexOf(b as PrinterId),
      ),
    },
    {
      id: "core",
      label: "Core size",
      type: "multi",
      options: options(
        scope,
        f,
        "core",
        (p) => [coreKey(p)],
        (v) => (v === "na" ? "N/A (fanfold, sheets)" : `${v} inch`),
        (a, b) => (a === "na" ? 1 : b === "na" ? -1 : num(a, b)),
      ),
    },
    {
      id: "width",
      label: "Label width",
      type: "multi",
      options: options(scope, f, "width", (p) => [trimNum(p.widthIn)], (v) => `${v} in`, num),
    },
    {
      id: "length",
      label: "Label length",
      type: "multi",
      options: options(scope, f, "length", (p) => [trimNum(p.lengthIn)], (v) => `${v} in`, num),
    },
    {
      id: "perSheet",
      label: "Labels per sheet",
      type: "multi",
      options: options(
        scope.filter((p) => p.labelsPerSheet),
        f,
        "perSheet",
        (p) => [String(p.labelsPerSheet)],
        (v) => `${v} per sheet`,
        num,
      ),
    },
  ];
  const prices = scope.map(fromPerLabel);
  facets.push({
    id: "price",
    label: "Price per label",
    type: "range",
    options: [],
    min: prices.length ? Math.floor(Math.min(...prices) * 10000) / 10000 : 0,
    max: prices.length ? Math.ceil(Math.max(...prices) * 10000) / 10000 : 0,
  });
  return facets.filter((x) => x.type === "range" || x.options.length > 1 || (x.id === "perSheet" && x.options.length));
}

/* ---------- URL <-> filter state ---------- */

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : undefined);

export function filterFromParams(sp: URLSearchParams): ProductFilter {
  const n = (k: string) => {
    const v = sp.get(k);
    return v != null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined;
  };
  return {
    material: list(sp.get("material")) as Material[] | undefined,
    printer: list(sp.get("printer")) as PrinterId[] | undefined,
    core: list(sp.get("core")),
    width: list(sp.get("width")),
    length: list(sp.get("length")),
    perSheet: list(sp.get("perSheet")),
    size: sp.get("size") || undefined,
    model: sp.get("model") || undefined,
    use: (sp.get("use") as Use) || undefined,
    priceMin: n("priceMin"),
    priceMax: n("priceMax"),
    sort: (sp.get("sort") as SortKey) || undefined,
  };
}

export function filterToParams(f: ProductFilter, extra?: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  const put = (k: string, v?: string | string[] | number) => {
    if (v == null) return;
    const s = Array.isArray(v) ? v.join(",") : String(v);
    if (s) sp.set(k, s);
  };
  put("printer", f.printer);
  put("model", f.model);
  put("size", f.size);
  put("use", f.use);
  put("material", f.material);
  put("core", f.core);
  put("width", f.width);
  put("length", f.length);
  put("perSheet", f.perSheet);
  put("priceMin", f.priceMin);
  put("priceMax", f.priceMax);
  if (f.sort && f.sort !== "best") put("sort", f.sort);
  if (extra) for (const [k, v] of Object.entries(extra)) put(k, v);
  return sp;
}

export function activeFilterCount(f: ProductFilter) {
  return (
    (f.material?.length ?? 0) +
    (f.printer?.length ?? 0) +
    (f.core?.length ?? 0) +
    (f.width?.length ?? 0) +
    (f.length?.length ?? 0) +
    (f.perSheet?.length ?? 0) +
    (f.size ? 1 : 0) +
    (f.model ? 1 : 0) +
    (f.use ? 1 : 0) +
    (f.priceMin != null || f.priceMax != null ? 1 : 0)
  );
}
