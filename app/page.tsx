import type { Metadata } from "next";
import { BestSellers } from "@/components/home/BestSellers";
import { BulkSample } from "@/components/home/BulkSample";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CustomBand } from "@/components/home/CustomBand";
import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { MaterialsTeaser } from "@/components/home/MaterialsTeaser";
import { NewsTeaser } from "@/components/home/NewsTeaser";
import { PricingExplainer } from "@/components/home/PricingExplainer";
import { PrinterStrip } from "@/components/home/PrinterStrip";
import { Reviews } from "@/components/home/Reviews";
import { TrustBar } from "@/components/home/TrustBar";
import { WhyUs } from "@/components/home/WhyUs";
import {
  getAllProducts,
  getCategories,
  getFaqs,
  getNews,
  getPrinters,
  getProductBySlug,
  getReviews,
  getSiteConfig,
} from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Made in USA Shipping & Thermal Labels | BlankLabels.com",
  absoluteTitle: true,
  description:
    "Factory-direct 4x6 shipping labels, thermal rolls, fanfold, integrated and sheet labels. Made in Charlotte, NC. Free US shipping and our Price Beat Promise.",
  path: "/",
});

// Homepage: 16 blocks in spec order (announcement bar, header and footer come from the layout).
export default async function Home() {
  const [products, categories, printers, site, faqs, reviews, news, featured] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getPrinters(),
    getSiteConfig(),
    getFaqs("home"),
    getReviews(),
    getNews(),
    getProductBySlug("4x6-direct-thermal-fanfold-labels-500"),
  ]);
  const bestSellers = products.filter((p) => p.bestSeller).sort((a, b) => a.sortRank - b.sortRank);

  return (
    <>
      <Hero printers={printers} site={site} />
      <TrustBar site={site} />
      <CategoryGrid categories={categories} products={products} />
      <BestSellers products={bestSellers} />
      {featured && <PricingExplainer product={featured} />}
      <WhyUs />
      <PrinterStrip printers={printers} />
      <CustomBand />
      <BulkSample />
      <Reviews reviews={reviews} site={site} />
      <MaterialsTeaser />
      <FaqSection faqs={faqs} />
      <NewsTeaser news={news} />
    </>
  );
}
