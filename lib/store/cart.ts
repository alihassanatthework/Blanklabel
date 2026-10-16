"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OrderLine } from "@/types";

interface CartState {
  lines: OrderLine[];
  promo: string | null;
  /** Bumped whenever items change - drives the header badge pop. */
  version: number;
  add: (productId: string, qty: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => { line: OrderLine; index: number } | null;
  restore: (line: OrderLine, index: number) => void;
  addMany: (lines: OrderLine[]) => void;
  clear: () => void;
  setPromo: (code: string | null) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      promo: null,
      version: 0,
      add: (productId, qty) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === productId);
          const lines = existing
            ? s.lines.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l))
            : [...s.lines, { productId, qty }];
          return { lines, version: s.version + 1 };
        }),
      setQty: (productId, qty) =>
        set((s) => ({
          lines: s.lines.map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, qty) } : l)),
          version: s.version + 1,
        })),
      remove: (productId) => {
        const index = get().lines.findIndex((l) => l.productId === productId);
        if (index < 0) return null;
        const line = get().lines[index];
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId), version: s.version + 1 }));
        return { line, index };
      },
      restore: (line, index) =>
        set((s) => {
          if (s.lines.some((l) => l.productId === line.productId)) return s;
          const lines = [...s.lines];
          lines.splice(index, 0, line);
          return { lines, version: s.version + 1 };
        }),
      addMany: (incoming) =>
        set((s) => {
          const lines = [...s.lines];
          for (const l of incoming) {
            const i = lines.findIndex((x) => x.productId === l.productId);
            if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + l.qty };
            else lines.push({ ...l });
          }
          return { lines, version: s.version + 1 };
        }),
      clear: () => set((s) => ({ lines: [], promo: null, version: s.version + 1 })),
      setPromo: (promo) => set({ promo }),
    }),
    {
      name: "bl-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, promo: s.promo }),
    },
  ),
);
