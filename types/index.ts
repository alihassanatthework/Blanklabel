export type Material = "direct-thermal" | "thermal-transfer" | "laser-inkjet";
export type Format = "fanfold" | "roll" | "sheet" | "integrated";
export type PrinterId = "rollo" | "zebra" | "eltron" | "munbyn" | "dymo-4xl" | "brother" | "laser-inkjet";
export type Use = "shipping" | "barcode" | "address";
export type BadgeId ="made-in-usa" | "best-seller" | "bulk-save" | "new";

export interface Category {
  id: string;
  slug: string;
  name: string;
  parentId: string | null; // 'fanfold' | 'rolls' | null
  path: string[]; // e.g. ['fanfold','direct-thermal-fanfold']
  description: string;
  icon: string; // lucide icon name
  format: Format;
  material?: Material;
  order: number;
  isGroup?: boolean;
}

export interface PriceTier {
  minQty: number;
  unitPrice: number;
  label: string;
} // unit = 1 pack

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortName: string;
  categoryId: string;
  format: Format;
  material: Material;
  widthIn: number;
  lengthIn: number;
  coreIn?: 1 | 3 | null;
  labelsPerUnit: number;
  unitName: string; // 'stack' | 'roll' | 'case' | 'pack'
  labelsPerSheet?: number;
  rollsPerCase?: number;
  printers: PrinterId[];
  tiers: PriceTier[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  badges: BadgeId[];
  bestSeller: boolean;
  rating: number;
  reviewCount: number;
  isDemoPrice: boolean;
  assumed: boolean;
  relatedIds: string[];
  bestSellerGroup?: "shipping" | "barcode" | "sheets";
  uses: Use[]; // printer finder step 3 mapping
  sortRank: number; // lower = better selling
  createdAt: string; // ISO date, used for 'Newest'
}

export interface Printer {
  id: PrinterId;
  name: string;
  models: string[];
}

export type SortKey = "best" | "price-asc" | "price-desc" | "newest" | "name";

export interface ProductFilter {
  category?: string; // category id (group or leaf)
  material?: Material[];
  printer?: PrinterId[];
  core?: string[]; // '1' | '3' | 'na'
  width?: string[];
  length?: string[];
  size?: string; // e.g. '4x6'
  model?: string; // printer model from the finder
  use?: Use; // printer finder step 3
  q?: string;
  perSheet?: string[]; // labels per sheet
  priceMin?: number;
  priceMax?: number;
  sort?: SortKey;
  ids?: string[];
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface Facet {
  id: "material" | "printer" | "core" | "width" | "length" | "perSheet" | "price";
  label: string;
  type: "multi" | "range";
  options: FacetOption[];
  min?: number;
  max?: number;
}

export interface SearchResult {
  type: "product" | "category";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  product?: Product;
}

export interface Faq {
  id: string;
  scope: "home" | "custom";
  q: string;
  a: string;
}

export interface Review {
  id: string;
  name: string;
  business: string;
  rating: number;
  text: string;
  product: string;
  source: "demo";
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  category: string;
  body: string[]; // paragraphs; lines starting with '## ' are headings
}

export interface MaterialRow {
  id: Material;
  name: string;
  ribbon: string;
  durability: string;
  bestFor: string;
  printers: string;
}

export interface Swatch {
  id: string;
  name: string;
  hex: string;
  availability: string;
}

export interface OrderLine {
  productId: string;
  qty: number;
}

export interface Order {
  orderNumber: string;
  date: string; // ISO
  status: "Delivered" | "Shipped" | "Processing";
  lines: OrderLine[];
  total: number;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
}

export interface Account {
  name: string;
  firstName: string;
  email: string;
  company: string;
  persona: string;
  savedPrinters: string[];
  addresses: Address[];
  orders: Order[];
}

export interface SiteConfig {
  name: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: { line1: string; city: string; state: string; zip: string; country: string };
  hours: string;
  announcements: { text: string; href?: string }[];
  freeShipping: boolean;
  shippingLabel: string;
  returnsDays: number;
  returnsLabel: string;
  expeditedShipping: number;
  promoCodes: Record<string, number>;
  social: { label: string; href: string }[];
  ebay: { ratings: string; positive: string };
}
