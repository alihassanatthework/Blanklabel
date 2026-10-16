import type { PrinterId } from "@/types";

// Header navigation (spec 3: Header and navigation).
export const NAV_LINKS = [
  { label: "Custom Labels", href: "/custom-labels" },
  { label: "Bulk & Business", href: "/bulk" },
  { label: "Materials & Colors", href: "/materials-colors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** One-line descriptions for the Shop mega menu. */
export const MENU_TAGLINES: Record<string, string> = {
  "direct-thermal-fanfold": "No ribbon - 4x6 shipping labels",
  "thermal-transfer-fanfold": "Ribbon-printed, long-lasting",
  "direct-thermal-rolls": "Shipping & barcode, no ribbon",
  "thermal-transfer-rolls": "Durable inventory barcodes",
  "integrated-shipping-labels": "Label + paper receipt per sheet",
  "sheet-labels": "Laser & inkjet 8.5 x 11 sheets",
};

export const PRINTER_MENU: { id: PrinterId; label: string }[] = [
  { id: "rollo", label: "Rollo" },
  { id: "zebra", label: "Zebra" },
  { id: "eltron", label: "Eltron" },
  { id: "munbyn", label: "MUNBYN" },
  { id: "dymo-4xl", label: "Dymo 4XL" },
  { id: "brother", label: "Brother" },
  { id: "laser-inkjet", label: "Laser/Inkjet" },
];

export const FOOTER_COMPANY = [
  { label: "About", href: "/about" },
  { label: "Materials & Colors", href: "/materials-colors" },
  { label: "News", href: "/news" },
  { label: "Custom Labels", href: "/custom-labels" },
  { label: "Bulk & Business", href: "/bulk" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_HELP = [
  { label: "My account", href: "/account" },
  { label: "Cart", href: "/cart" },
  { label: "Shipping and Deliveries", href: "/shipping" },
  { label: "Returns and Refunds", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];
