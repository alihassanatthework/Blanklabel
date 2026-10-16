import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SampleForm } from "@/components/forms/SampleForm";
import { BULK_BENEFITS } from "@/components/home/BulkSample";
import { ProductVisual, visualProps } from "@/components/product/ProductVisual";
import { buttonClass } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProductBySlug, getSiteConfig } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { money, perLabelMoney } from "@/lib/utils";
import type { Product } from "@/types";

export const metadata: Metadata = pageMetadata({
  title: "Bulk & Business",
  description: "Case pricing for warehouses, 3PLs and high-volume sellers. Tiered savings on 4x6 fanfold and thermal rolls, plus a free sample pack.",
  path: "/bulk",
});

const CASE_SLUGS = [
  "4x6-direct-thermal-fanfold-labels-500",
  "4x6-direct-thermal-labels-3-inch-cores-1000",
  "2x1-direct-thermal-labels-1-inch-cores-32-rolls",
];

export default async function BulkPage() {
  const [site, ...items] = await Promise.all([getSiteConfig(), ...CASE_SLUGS.map(getProductBySlug)]);
  const products = items.filter((p): p is Product => !!p);
  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="container-x py-8 lg:py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Bulk & Business" }]} />
          <h1 className="text-h1 mt-4 max-w-3xl">Case pricing for warehouses and high-volume sellers</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-600">
            The more you stock, the less you pay. Tier pricing applies automatically in the cart - no codes, no account needed.
          </p>
        </div>
      </div>

      <section aria-labelledby="case-title" className="section-y">
        <div className="container-x">
          <SectionHeading id="case-title" title="Case pricing" subtitle="Demo prices - final pricing is confirmed after approval." />
          <div className="relative">
            <div className="scroll-fade overflow-x-auto rounded-[16px] border border-line bg-white shadow-sm lg:[mask-image:none]">
              <table className="w-full min-w-[760px] text-left">
                <caption className="sr-only">Case pricing by quantity tier</caption>
                <thead>
                  <tr className="border-b border-line bg-navy-50 text-sm">
                    <th scope="col" className="px-5 py-4 font-semibold text-navy-900">
                      Product
                    </th>
                    {["Tier 1", "Tier 2", "Tier 3", "Tier 4 (case)"].map((t) => (
                      <th key={t} scope="col" className="px-5 py-4 font-semibold text-navy-900">
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-line last:border-0">
                      <th scope="row" className="px-5 py-4">
                        <Link href={`/product/${p.slug}`} className="flex items-center gap-3 hover:underline">
                          <span className="w-14 shrink-0 rounded-[8px] bg-bg p-1">
                            <ProductVisual {...visualProps(p)} size="sm" />
                          </span>
                          <span className="font-semibold text-navy-900">{p.shortName}</span>
                        </Link>
                      </th>
                      {p.tiers.map((t, i) => (
                        <td key={t.minQty} className="px-5 py-4 align-middle tabular-nums">
                          <span className="block text-sm text-ink-600">{t.label}</span>
                          <span className="block font-bold text-navy-900">{money(t.unitPrice)} each</span>
                          <span className={`block text-sm ${i === p.tiers.length - 1 ? "font-semibold text-teal-600" : "text-ink-600"}`}>
                            {perLabelMoney(t.unitPrice / p.labelsPerUnit)} / label
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="benefits-title" className="section-y bg-white">
        <div className="container-x">
          <SectionHeading id="benefits-title" title="Built for business buyers" />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BULK_BENEFITS.map(({ icon: Icon, title, text, future }, i) => (
              <Reveal as="li" key={title} index={i}>
                <Card className="h-full p-6">
                  <span className="flex size-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                    <Icon aria-hidden className="size-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-h4 mt-4 flex items-center gap-2">
                    {title}
                    {future && <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-navy-700">After approval</span>}
                  </h3>
                  <p className="mt-2 text-ink-600">{text}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="sample-title" className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          <div>
            <h2 id="sample-title" className="text-h2">
              Get a free sample pack
            </h2>
            <p className="mt-3 text-ink-600">Test our labels in your printers before you commit to a case.</p>
          </div>
          <Card className="p-5 sm:p-8">
            <SampleForm idPrefix="bulk-sample" />
          </Card>
        </div>
      </section>

      <section aria-label="Talk to us" className="bg-navy-900 text-white">
        <div className="container-x flex flex-col items-start gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-h3 text-white">Need a custom volume price? Talk to a label expert.</p>
          <a href={site.phoneHref} className={buttonClass("primary")}>
            <Phone aria-hidden className="size-4" />
            {site.phone}
          </a>
        </div>
      </section>
    </>
  );
}
