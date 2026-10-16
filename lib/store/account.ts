"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Demo account extras (SIMULATED): printers saved from the finder and the auto-replenish preview.
interface AccountState {
  savedPrinters: string[];
  replenishWeeks: 4 | 6 | 8 | null;
  savePrinter: (name: string) => void;
  removePrinter: (name: string) => void;
  setReplenish: (w: 4 | 6 | 8 | null) => void;
}

export const useAccountExtras = create<AccountState>()(
  persist(
    (set) => ({
      savedPrinters: [],
      replenishWeeks: null,
      savePrinter: (name) =>
        set((s) => ({ savedPrinters: s.savedPrinters.includes(name) ? s.savedPrinters : [...s.savedPrinters, name] })),
      removePrinter: (name) => set((s) => ({ savedPrinters: s.savedPrinters.filter((p) => p !== name) })),
      setReplenish: (replenishWeeks) => set({ replenishWeeks }),
    }),
    { name: "bl-account" },
  ),
);
