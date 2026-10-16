import type { Metadata } from "next";
import { PrinterFinderWizard } from "@/components/listing/PrinterFinderWizard";
import { Breadcrumbs } from "@/components/ui/misc";
import { getPrinters } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Printer finder",
  description: "Answer three quick questions and see the labels guaranteed to fit your Rollo, Zebra, Eltron, MUNBYN, Dymo, Brother or office printer.",
  path: "/printer-finder",
});

export default async function PrinterFinderPage() {
  const printers = await getPrinters();
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Printer finder" }]} />
      <div className="mx-auto mt-6 mb-8 max-w-2xl text-center">
        <h1 className="text-h1">Find labels for your printer</h1>
        <p className="mt-3 text-lg text-ink-600">Three quick questions and we&apos;ll show only the labels guaranteed to fit.</p>
      </div>
      <PrinterFinderWizard printers={printers} />
    </div>
  );
}
