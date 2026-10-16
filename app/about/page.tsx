import type { Metadata } from "next";
import { BadgeDollarSign, Factory, Headset, Mail, Phone } from "lucide-react";
import { CountUp } from "@/components/ui/AnimatedNumber";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteConfig } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About us",
  description: "BlankLabels is a USA label manufacturer in Charlotte, NC with 20+ years of experience, quantity discounts and a Price Beat Promise.",
  path: "/about",
});

export default async function AboutPage() {
  const site = await getSiteConfig();
  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="container-x grid gap-8 py-8 lg:grid-cols-2 lg:items-end lg:py-14">
          <div>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
            <h1 className="text-h1 mt-4">Quality blank and printed labels, made in the USA to help your business grow</h1>
          </div>
          <p className="text-lg text-ink-600">
            We are a label manufacturer in Charlotte, North Carolina. Our team brings more than 20 years of label manufacturing experience to every
            roll, stack and sheet - and we sell factory-direct so you pay less.
          </p>
        </div>
      </div>

      <section aria-label="BlankLabels in numbers" className="bg-navy-900 text-white">
        <dl className="container-x grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          <div>
            <dt className="text-sm text-white/70">Years in labels</dt>
            <dd className="mt-1 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold">
              <CountUp value={20} />+
            </dd>
          </div>
          <div>
            <dt className="text-sm text-white/70">eBay ratings</dt>
            <dd className="mt-1 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold">
              <CountUp value={60000} />+
            </dd>
          </div>
          <div>
            <dt className="text-sm text-white/70">Positive feedback</dt>
            <dd className="mt-1 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold">
              <CountUp value={99.7} decimals={1} suffix="%" />
            </dd>
          </div>
          <div>
            <dt className="text-sm text-white/70">Manufactured in</dt>
            <dd className="mt-1 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold">USA</dd>
          </div>
        </dl>
      </section>

      <div className="container-x section-y space-y-16">
        <Reveal id="made-in-usa" className="grid scroll-mt-24 gap-6 lg:grid-cols-[80px_1fr]">
          <span className="flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700">
            <Factory aria-hidden className="size-8" strokeWidth={1.5} />
          </span>
          <div className="max-w-3xl">
            <h2 className="text-h2">Made in Charlotte, NC</h2>
            <p className="mt-3 text-lg text-ink-600">
              Every blank label we sell is manufactured in our Charlotte, North Carolina facility: bright white direct thermal face paper, high-tack
              permanent adhesive and an easy-release liner, converted into fanfold stacks, rolls and sheets. Because we make the labels ourselves,
              we control quality from start to finish and pass factory-direct pricing - with quantity discounts - straight to you.
            </p>
          </div>
        </Reveal>

        <Reveal id="price-beat" className="scroll-mt-24">
          <Card className="grid gap-6 border-action-500/30 bg-action-500/5 p-6 sm:p-10 lg:grid-cols-[80px_1fr]">
            <span className="flex size-16 items-center justify-center rounded-full bg-action-500 text-white">
              <BadgeDollarSign aria-hidden className="size-8" strokeWidth={1.5} />
            </span>
            <div className="max-w-3xl">
              <h2 className="text-h2">Our Price Beat Promise</h2>
              <p className="mt-3 text-lg text-ink-600">
                Competitive pricing is part of how we work. Seen a lower advertised price or received a quote for comparable labels? Send it to
                us - we review every price you share and do everything we can to beat it.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${site.email}?subject=Price%20Beat%20Promise`} className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-action-500 px-6 font-semibold text-white hover:bg-action-600">
                  <Mail aria-hidden className="size-4" />
                  Send us a price
                </a>
                <a href={site.phoneHref} className="inline-flex h-12 items-center gap-2 rounded-[10px] border-[1.5px] border-navy-700 bg-white px-6 font-semibold text-navy-700 hover:bg-navy-50">
                  <Phone aria-hidden className="size-4" />
                  {site.phone}
                </a>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal id="support" className="grid scroll-mt-24 gap-6 lg:grid-cols-[80px_1fr]">
          <span className="flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700">
            <Headset aria-hidden className="size-8" strokeWidth={1.5} />
          </span>
          <div className="max-w-3xl">
            <h2 className="text-h2">Real people, guaranteed fit</h2>
            <p className="mt-3 text-lg text-ink-600">
              Customer satisfaction is our priority. Our label experts are a call or email away to help you choose the right size and material for
              your Zebra, Rollo, Eltron or other printer - and if a label doesn&apos;t fit, we make it right.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Contact us</ButtonLink>
              <ButtonLink href="/printer-finder" variant="secondary">
                Find labels for your printer
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
