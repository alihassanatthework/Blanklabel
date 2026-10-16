import productsJson from "@/data/products.json";
import type { Product } from "@/types";

export const products = productsJson as unknown as Product[];

export const productById = (id: string) => products.find((p) => p.id === id) ?? null;
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug) ?? null;
