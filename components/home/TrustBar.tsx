import Link from "next/link";
import { BadgeDollarSign, Factory, Phone, RotateCcw, Truck } from "lucide-react";
import { PerforationDivider } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteConfig } from "@/types";

export function TrustBar({ site }: { site: SiteConfig }) {
  const items = [
    { icon: Factory, label: "Made in USA", line: "Manufactured in Charlotte, NC" },
    { icon: Truck, label: site.shippingLabel, line: "On every order, no minimum" },
    { icon: RotateCcw, label: site.returnsLabel, line: "Guaranteed to fit your printer" },
    { icon: BadgeDollarSign, label: "Price Beat Promise", line: "Seen it cheaper? We'll beat it", href: "/about#price-beat" },
    { icon: Phone, label: site.phone, line: "Talk to a label expert", href: site.phoneHref },
  ];
  return (
    <section aria-label="Why buy from BlankLabels" className="bg-navy-50">
      <PerforationDivider />
      <ul className="container-x no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto py-6 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible">
        {items.map(({ icon: Icon, label, line, href }, i) => {
          const inner = (
            <>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-navy-700 shadow-sm">
                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <span>
                <span className="block text-[15px] font-bold text-navy-900">{label}</span>
                <span className="block text-[13px] text-ink-600">{line}</span>
              </span>
            </>
          );
          return (
            <Reveal as="li" key={label} index={i} y={16} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-auto">
              {href ? (
                <Link href={href} className="flex items-center gap-3 rounded-[12px] p-1 hover:bg-white/60">
                  {inner}
                </Link>
              ) : (
                <div className="flex items-center gap-3 p-1">{inner}</div>
              )}
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
