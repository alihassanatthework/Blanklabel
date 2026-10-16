import { BadgeDollarSign, RotateCcw, Truck } from "lucide-react";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import type { Printer, SiteConfig } from "@/types";
import { PrinterFinderCard } from "./PrinterFinderCard";

const H1 = "Shipping & thermal labels, made in the USA.";

/**
 * Entrance is CSS-driven (rise-in with 60 ms word stagger) so the LCP heading paints without
 * waiting for hydration; float/feed loops are CSS too and switch off under reduced motion.
 */
export function Hero({ printers, site }: { printers: Printer[]; site: SiteConfig }) {
  const words = H1.split(" ");
  const d = (i: number) => ({ animationDelay: `${i * 60}ms` });
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 size-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(31,58,95,0.14),transparent)]" />
        <div className="barcode-stripe absolute inset-x-0 bottom-0 h-24 text-navy-700/[0.035]" />
      </div>
      <div className="container-x relative grid items-center gap-10 py-10 md:py-14 lg:min-h-[640px] lg:grid-cols-12 lg:gap-6 lg:py-16">
        <div className="lg:col-span-6">
          <div className="rise-in" style={d(0)}>
            <Badge variant="made-in-usa">Made in USA - Charlotte, NC</Badge>
          </div>
          <h1 id="hero-title" className="text-display mt-5 max-w-[14ch]">
            {words.map((w, i) => (
              <span key={i} className="rise-in inline-block" style={d(i + 1)}>
                {w}
                {i < words.length - 1 && " "}
              </span>
            ))}
          </h1>
          <p className="rise-in mt-5 max-w-xl text-lg text-ink-600" style={d(words.length + 1)}>
            Factory-direct prices on fanfold, rolls, integrated and sheet labels - guaranteed to fit your printer, shipped free.
          </p>
          <div className="rise-in mt-7 flex flex-col gap-3 sm:flex-row" style={d(words.length + 2)}>
            <ButtonLink href="/shop">Shop labels</ButtonLink>
            <ButtonLink href="/custom-labels" variant="secondary">
              Get a custom quote
            </ButtonLink>
          </div>
          <ul className="rise-in mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-navy-900" style={d(words.length + 3)}>
            {[
              { icon: Truck, label: site.shippingLabel },
              { icon: RotateCcw, label: site.returnsLabel },
              { icon: BadgeDollarSign, label: "Price Beat Promise" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon aria-hidden className="size-[18px] text-teal-600" strokeWidth={1.75} />
                {label}
              </li>
            ))}
          </ul>
          <PrinterFinderCard printers={printers} className="rise-in mt-8 lg:hidden" />
        </div>

        <div className="relative hidden sm:block lg:col-span-6">
          <div className="relative mx-auto aspect-[6/5] max-w-[560px] lg:-mr-4">
            <div className="hero-float absolute top-[2%] left-[4%] w-[62%] drop-shadow-[0_24px_30px_rgba(11,31,58,0.14)]">
              <ProductVisual format="fanfold" widthIn={4} lengthIn={6} size="lg" accent="var(--color-action-500)" />
              <div aria-hidden className="hero-feed absolute top-[38%] left-[52%] w-[26%]">
                <svg viewBox="0 0 40 60" className="w-full drop-shadow-md">
                  <rect x="0.5" y="0.5" width="39" height="59" rx="3" fill="#fff" stroke="#DCE3EC" />
                  <rect x="5" y="6" width="16" height="3" rx="1" fill="#0B1F3A" />
                  <rect x="5" y="12" width="26" height="2" rx="1" fill="#9CA3AF" />
                  <rect x="5" y="16" width="22" height="2" rx="1" fill="#9CA3AF" />
                  <g fill="#0B1F3A">
                    <rect x="5" y="40" width="2" height="13" />
                    <rect x="9" y="40" width="1" height="13" />
                    <rect x="12" y="40" width="3" height="13" />
                    <rect x="17" y="40" width="1" height="13" />
                    <rect x="20" y="40" width="2" height="13" />
                    <rect x="24" y="40" width="1" height="13" />
                    <rect x="27" y="40" width="3" height="13" />
                    <rect x="32" y="40" width="2" height="13" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="hero-float hero-float-delay absolute top-[18%] right-[0%] w-[46%] drop-shadow-[0_24px_30px_rgba(11,31,58,0.14)]">
              <ProductVisual format="roll" widthIn={4} lengthIn={6} core={1} size="lg" />
            </div>
          </div>
          <PrinterFinderCard
            printers={printers}
            className="rise-in relative z-10 -mt-24 hidden max-w-[460px] lg:-ml-10 lg:block"
          />
        </div>
      </div>
    </section>
  );
}
