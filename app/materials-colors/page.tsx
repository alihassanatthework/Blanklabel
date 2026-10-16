import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getMaterials } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Materials & Colors",
  description: "Compare direct thermal, thermal transfer and laser/inkjet label materials - ribbon, durability, best uses and printers - plus label colours.",
  path: "/materials-colors",
});

export default async function MaterialsPage() {
  const { materials, swatches } = await getMaterials();
  const rows: { key: "ribbon" | "durability" | "bestFor" | "printers"; label: string }[] = [
    { key: "ribbon", label: "Ribbon needed" },
    { key: "durability", label: "Durability" },
    { key: "bestFor", label: "Best for" },
    { key: "printers", label: "Printers" },
  ];
  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="container-x py-8 lg:py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Materials & Colors" }]} />
          <h1 className="text-h1 mt-4">Materials &amp; Colors</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-600">Pick the right face stock for how your labels are printed and how long they need to last.</p>
        </div>
      </div>

      <section aria-labelledby="compare-title" className="section-y">
        <div className="container-x">
          <SectionHeading id="compare-title" title="Material comparison" />
          <div className="scroll-fade overflow-x-auto rounded-[16px] border border-line bg-white shadow-sm lg:[mask-image:none]">
            <table className="w-full min-w-[720px] text-left">
              <caption className="sr-only">Comparison of label materials</caption>
              <thead>
                <tr className="bg-navy-50">
                  <td className="px-5 py-4" />
                  {materials.map((m) => (
                    <th key={m.id} scope="col" className="px-5 py-4 font-[family-name:var(--font-jakarta)] text-lg font-bold text-navy-900">
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-t border-line">
                    <th scope="row" className="w-44 px-5 py-4 text-sm font-semibold text-ink-600">
                      {r.label}
                    </th>
                    {materials.map((m) => (
                      <td key={m.id} className="px-5 py-4 text-[15px] text-ink-900">
                        {m[r.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="colors-title" className="section-y bg-white">
        <div className="container-x">
          <SectionHeading
            id="colors-title"
            title="Label colours"
            subtitle="White is standard across all materials. Coloured sheet and thermal transfer labels are available on request."
          />
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {swatches.map((s, i) => (
              <Reveal as="li" key={s.id} index={i} y={12}>
                <div className="overflow-hidden rounded-[16px] border border-line bg-white shadow-sm">
                  <div className="h-24 border-b border-line" style={{ background: s.hex }} aria-hidden />
                  <div className="p-3">
                    <p className="font-semibold text-navy-900">{s.name}</p>
                    <p className="text-xs text-ink-600">{s.availability}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop">Shop labels</ButtonLink>
            <ButtonLink href="/custom-labels" variant="secondary">
              Ask about colours
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
