import categoriesJson from "@/data/categories.json";
import type { Category } from "@/types";

export const categories = (categoriesJson as Category[]).slice().sort((a, b) => a.order - b.order);

export const categoryHref = (c: Pick<Category, "path">) => `/shop/${c.path.join("/")}`;

export const leafCategories = () => categories.filter((c) => !c.isGroup);
export const groupCategories = () => categories.filter((c) => c.isGroup);
export const childrenOf = (id: string) => categories.filter((c) => c.parentId === id);

/** All leaf category ids under a category (itself if it's a leaf). */
export function leafIdsOf(id: string): string[] {
  const kids = childrenOf(id);
  return kids.length ? kids.map((k) => k.id) : [id];
}

export function findByPath(path: string[]): Category | null {
  const key = path.join("/");
  return categories.find((c) => c.path.join("/") === key) ?? null;
}

export const categoryById = (id: string) => categories.find((c) => c.id === id) ?? null;
