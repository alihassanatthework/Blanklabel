import Link from "next/link";
import { Printer as PrinterIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Printer } from "@/types";

/** Brand names as plain text (ASSUMPTION: no third-party logo rights). */
export function PrinterStrip({ printers }: { printers: Printer[] }) {
  return (
    <section aria-labelledby="printer-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          id="printer-title"
          title="Shop by printer"
          subtitle="Pick your printer and see only the labels guaranteed to fit."
          action={{ label: "Open printer finder", href: "/printer-finder" }}
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {printers.map((p, i) => (
            <Reveal as="li" key={p.id} index={i} y={12}>
              <Link
                href={`/shop?printer=${p.id}`}
                className="group flex h-28 flex-col items-center justify-center gap-2.5 rounded-[16px] border border-line bg-white text-center shadow-sm transition-colors duration-200 hover:bg-navy-50"
              >
                <PrinterIcon
                  aria-hidden
                  className="size-6 text-navy-700 transition-transform duration-200 motion-safe:group-hover:-translate-y-1"
                  strokeWidth={1.75}
                />
                <span className="font-[family-name:var(--font-jakarta)] text-[17px] font-bold text-navy-900">{p.name}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
