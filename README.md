# BlankLabels.com — website demo

A clickable, responsive, animated frontend demo of the proposed custom store for BlankLabels.com (Charlotte, NC).
It runs entirely on mock data — no production backend, no payments, no third-party calls (fonts are self-hosted by `next/font`).

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Motion · Radix UI · lucide-react · zustand · react-hook-form + zod · Fuse.js · Embla · sonner

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build (all catalogue pages are statically generated)
npm start
```

Checks: `npx tsc --noEmit` and `npm run lint`.

### Search-engine indexing

The demo is a preview, so by default every page is `noindex` (robots meta, `X-Robots-Tag` header and a `Disallow: /` robots.txt).
Set `DEMO_NOINDEX=false` at build and start time to turn indexing on (for SEO audits or launch).

## Where things live

| Path | What |
| --- | --- |
| `data/*.json` | Mock catalogue and content: `products.json` (16), `categories.json` (8), `printers.json`, `materials.json`, `faqs.json`, `reviews.json`, `news.json`, `account.json`, `site.json` |
| `scripts/build-products.mjs` | Source table that generates `data/products.json` (`node scripts/build-products.mjs`) |
| `content/*.md` | Policy pages; `{{tokens}}` are filled from `site.json` (shipping/returns values) |
| `lib/data/` | **Data access layer** — the only way components read data |
| `lib/pricing.ts` | Tier pricing: `tierFor`, `unitPrice`, `lineTotal`, `perLabel`, `savingsPct`, `nextTierNudge`, `fromPerLabel`, `cartTotals` |
| `lib/filters.ts` | Facets, filtering, sorting, URL ⇄ filter state, printer-model rule (A5) |
| `lib/search.ts` | Typo-tolerant search (Fuse.js), loaded on first use |
| `lib/schemas.ts` | zod schemas for every form (reusable by the future API) |
| `lib/store/` | zustand stores persisted to localStorage: cart (`bl-cart`), wishlist, compare, account extras |
| `lib/motion.ts` | All animation timings and easings |
| `app/globals.css` | Design tokens (CSS variables) mapped into the Tailwind theme |
| `components/product/ProductVisual.tsx` | Code-drawn SVG for every product (fanfold, roll, sheet, integrated) — no image files |

### Assumptions kept in data (change them there)

- **A1 colours** — tokens in `app/globals.css`. The spec's action orange `#F26B1D` gives 3.0:1 contrast with white text, which fails WCAG AA. CTA and price tokens are darkened to `#B94D0E` (hover `#9E410B`); the original orange stays available as `action-bright` for accents on navy and decorative fills.
- **A2 prices** — every product has `isDemoPrice: true`; products not seen on the live site have `assumed: true`.
- **A3 shipping/returns** — `site.json` (`shippingLabel`, `returnsDays`, `expeditedShipping`).
- **A5 printer compatibility** — `product.printers[]`; 3-inch cores fit Zebra industrial printers only (`fitsModel` in `lib/filters.ts`).
- **A6 colours** — `materials.json` swatches.

## Simulated features

Every simulated result shows a "Demo" indicator.

| Feature | Behaviour | Stored in |
| --- | --- | --- |
| Cart + promo code | Fully working; `WELCOME10` = 10% off | localStorage `bl-cart` |
| Wishlist / compare (up to 4) | Fully working | localStorage `bl-wishlist`, `bl-compare` |
| Checkout | Validation, 1.2 s processing, order number `BL-1xxxxx`, cart cleared | localStorage `demo_orders` |
| Account | Demo customer "Sarah" + 4 past orders (dates relative to today) + demo checkout orders; one-click reorder | `data/account.json` + localStorage |
| Quote / sample / contact / newsletter | Validation, fake delay, reference number (`QTE-`, `SMP-`), payload logged to the console | localStorage `demo_quotes`, `demo_samples`, `demo_contacts`, `demo_newsletter` |
| Artwork upload | File is listed, never uploaded | memory |
| Save printer / auto-replenish | UI only; replenish shows "Coming after approval" | localStorage `bl-account` |
| Reviews | Static demo reviews (`source: "demo"`) | `data/reviews.json` |
| Search | Fuse.js over local data | — |

## Swapping in the real backend

Components never import JSON. They call the async functions in `lib/data/index.ts` (catalogue, content, search) and `lib/data/actions.ts` (simulated submits, re-exported from the index). Each function already returns a Promise, so replacing its body with a `fetch()` to the commerce API needs no component changes:

| Function | Today | After approval |
| --- | --- | --- |
| `getCategories`, `getCategoryBySlugPath`, `getProducts`, `getProductBySlug`, `getRelatedProducts`, `getAllProducts` | `data/*.json` | Commerce API (Medusa or custom Node + PostgreSQL), ISR revalidation |
| `searchCatalog` | Fuse.js | Algolia / Meilisearch |
| `getFaqs`, `getNews`, `getNewsArticle`, `getMaterials`, `getSiteConfig`, `lib/data/policies.ts` | JSON / Markdown | Headless CMS |
| `getReviews` | JSON | Judge.me / Trustpilot |
| `placeOrder` | localStorage | Server action → Stripe / PayPal, shipping rates, tax |
| `submitQuote`, `submitSample`, `submitContact` | localStorage + console | API route → CRM / helpdesk + email; artwork to S3/R2 |
| `subscribeNewsletter` | Returns `WELCOME10` | Klaviyo |
| `getDemoAccount` | `account.json` + localStorage | Auth + orders API |

## Quality notes (last run)

- `npm run build` and type-check pass with zero errors; 53 routes prerendered.
- Homepage first-load JS: 194 KB gzip (forms, search engine, animation features and toasts are loaded on demand).
- Lighthouse mobile (`DEMO_NOINDEX=false`, local production server):

  | Page | Performance | Accessibility | Best Practices | SEO | CLS |
  | --- | --- | --- | --- | --- | --- |
  | Home | 94 | 100 | 100 | 100 | 0 |
  | Category (Direct Thermal Fanfold) | 94 | 100 | 100 | 100 | 0 |
  | Product (4x6 DT Fanfold 500) | 94 | 100 | 100 | 100 | 0 |

  Simulated LCP is 3.0 s. The observed first paint and LCP happen together at ~0.15 s. The simulated figure is higher because it counts the JS chunks a localhost server delivers before first paint. With DevTools throttling, LCP is 1.7–2.2 s. Re-check on the deployed preview.
- No horizontal scroll at 390 px on any route; journeys J1–J7 were exercised in the browser.
