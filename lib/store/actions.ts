"use client";

import { toast } from "sonner";
import { useCompare, COMPARE_MAX } from "./compare";
import { useWishlist } from "./wishlist";

/** Shared toggles with toast feedback - used by product cards and the product page. */
export function toggleWishlist(id: string, name: string) {
  const saved = useWishlist.getState().toggle(id);
  toast(saved ? "Saved to wishlist" : "Removed from wishlist", { description: name });
}

export function toggleCompare(id: string, name: string) {
  const r = useCompare.getState().toggle(id);
  if (r === "full") toast.error(`You can compare up to ${COMPARE_MAX} products`);
  else toast(r === "added" ? "Added to compare" : "Removed from compare", { description: name });
}
