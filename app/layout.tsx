import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { BackToTop } from "@/components/layout/BackToTop";
import { CatalogProvider } from "@/components/layout/CatalogProvider";
import { CompareTray } from "@/components/layout/CompareTray";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { getAllProducts, getCategories, getSiteConfig } from "@/lib/data";
import { NOINDEX, SITE_URL } from "@/lib/config";
import { organizationJsonLd, websiteJsonLd, JsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Made in USA Shipping & Thermal Labels | BlankLabels.com",
    template: "%s | BlankLabels.com - Made in USA Labels",
  },
  description:
    "Factory-direct 4x6 shipping labels, thermal rolls, fanfold, integrated and sheet labels. Made in Charlotte, NC. Free US shipping and our Price Beat Promise.",
  // Demo deployment is a preview - keep it out of search indexes.
  robots: NOINDEX ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: { siteName: "BlankLabels.com", type: "website", locale: "en_US" },
};

// Zoom stays enabled (fixes a live-site accessibility issue).
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B1F3A" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [products, categories, site] = await Promise.all([getAllProducts(), getCategories(), getSiteConfig()]);
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-[10px] bg-navy-900 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <JsonLd data={organizationJsonLd(site)} />
        <JsonLd data={websiteJsonLd()} />
        <CatalogProvider products={products} categories={categories} site={site}>
          <Providers>
            <AnnouncementBar />
            <Header />
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <CompareTray />
            <BackToTop />
          </Providers>
        </CatalogProvider>
      </body>
    </html>
  );
}
