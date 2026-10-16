"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";

interface UiState {
  cartOpen: boolean;
  searchOpen: boolean;
  navOpen: boolean;
  setCartOpen: (o: boolean) => void;
  setSearchOpen: (o: boolean) => void;
  setNavOpen: (o: boolean) => void;
}

export const useUi = create<UiState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  navOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setNavOpen: (navOpen) => set({ navOpen }),
}));

/** True after mount - render persisted (localStorage) values only then, to avoid hydration mismatches. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

/** Fly a dot from an element to the header cart icon (600 ms). Skipped under reduced motion. */
export function flyToCart(from: HTMLElement | null) {
  if (!from || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = document.getElementById("cart-button");
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const dot = document.createElement("div");
  dot.setAttribute("aria-hidden", "true");
  Object.assign(dot.style, {
    position: "fixed",
    left: `${a.left + a.width / 2 - 10}px`,
    top: `${a.top + a.height / 2 - 10}px`,
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    background: "var(--color-action-500)",
    boxShadow: "0 6px 20px rgba(11,31,58,.25)",
    zIndex: "80",
    pointerEvents: "none",
  });
  document.body.appendChild(dot);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = dot.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy - 80}px) scale(0.9)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.4)`, opacity: 0.6 },
    ],
    { duration: 600, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
  );
  anim.onfinish = () => dot.remove();
}
