"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (id: string) => boolean; // returns new 'saved' state
  remove: (id: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const saved = !get().ids.includes(id);
        set((s) => ({ ids: saved ? [...s.ids, id] : s.ids.filter((x) => x !== id) }));
        return saved;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
    }),
    { name: "bl-wishlist" },
  ),
);
