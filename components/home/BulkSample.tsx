import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, Headset, Package } from "lucide-react";
import { SampleForm } from "@/components/forms/SampleForm";
import { Reveal } from "@/components/ui/Reveal";

export const BULK_BENEFITS = [
  { icon: Package, title: "Case pricing", text: "Tiered case discounts on every label we make." },
  { icon: BadgeCheck, title: "Consistent quality", text: "Same face stock, adhesive and die-cut, run after run." },
  { icon: Headset, title: "Dedicated support", text: "A named label expert for your account." },
  { icon: FileText, title: "Invoices & PO", text: "Net terms and purchase orders - coming after approval.", future: true },
];

export function BulkSample() {
  return (
    <section aria-labelledby="bulk-title" className="section-y bg-navy-50">
      <div className="container-x">
        <Reveal className="grid overflow-hidden rounded-[20px] border border-line bg-white shadow-md lg:grid-cols-2">
          <div className="bg-navy-700 p-6 text-white sm:p-10">
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-white/70 uppercase">Bulk &amp; business</p>
            <h2 id="bulk-title" className="text-h2 text-white">
              Running a warehouse or high-volume store?
            </h2>
            <p className="mt-3 text-white/80">Get case pricing and a free sample pack.</p>
            <ul className="mt-8 space-y-5">
              {BULK_BENEFITS.map(({ icon: Icon, title, text, future }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="flex items-center gap-2 font-semibold">
                      {title}
                      {future && (
                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold">Future</span>
                      )}
                    </span>
                    <span className="text-sm text-white/75">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/bulk" className="group mt-8 inline-flex items-center gap-1.5 font-semibold">
              <span className="link-underline">See bulk pricing</span>
              <ArrowRight aria-hidden className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="p-6 sm:p-10">
            <h3 className="text-h3">Request a free sample pack</h3>
            <p className="mt-2 mb-6 text-ink-600">Test our labels in your printer before you stock up.</p>
            <SampleForm idPrefix="home-sample" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
