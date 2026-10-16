import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/** Per-label prices: 3-4 decimals, e.g. $0.0359 */
export const perLabelMoney = (n: number) => {
  const digits = n >= 0.1 ? 3 : 4;
  return `$${n.toFixed(digits)}`;
};

export const formatInt = (n: number) => Math.round(n).toLocaleString("en-US");

export const formatSize = (w: number, l: number) => `${trimNum(w)} x ${trimNum(l)}`;

export const trimNum = (n: number) => String(Number(n.toFixed(3)));

export function randomRef(prefix: string, digits: number) {
  let s = "";
  for (let i = 0; i < digits; i++) s += Math.floor(Math.random() * 10);
  return `${prefix}-${s}`;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
