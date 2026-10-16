import type { Metadata } from "next";
import type { Faq, Product, SiteConfig } from "@/types";
import { SITE_URL } from "./config";
import { lowestUnitPrice } from "./pricing";

/** generateMetadata helper: '{Page} | BlankLabels.com - Made in USA Labels', description <= 155 chars, canonical, OG. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const desc = description.length > 155 ? `${description.slice(0, 152).trimEnd()}...` : description;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    openGraph: { title, description: desc, url: path },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be inline; content is our own static data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationJsonLd = (site: SiteConfig) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BlankLabels",
  url: SITE_URL,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "US",
  },
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BlankLabels.com",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbJsonLd = (items: { label: string; href?: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.label,
    ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
  })),
});

export const productJsonLd = (p: Product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: p.name,
  sku: p.sku,
  description: p.description,
  brand: { "@type": "Brand", name: "BlankLabels" },
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: lowestUnitPrice(p).toFixed(2),
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/product/${p.slug}`,
  },
});

export const faqJsonLd = (faqs: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
