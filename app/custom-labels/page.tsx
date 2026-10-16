import type { Metadata } from "next";
import { CheckCircle2, PenTool, Truck } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { CustomBand } from "@/components/home/CustomBand";
import { CUSTOM_SAMPLES, CustomLabelArt } from "@/components/home/CustomLabelArt";
import { FaqSection } from "@/components/home/FaqSection";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFaqs } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Custom printed labels",
  description: "Custom labels printed with your graphics in Charlotte, NC. Send artwork, approve a proof, and we print and ship. Request a free quote.",
  path: "/custom-labels",
});

const STEPS = [
  { icon: PenTool, title: "Send artwork", text: "Upload your design or describe what you need - we can help with layout." },
  { icon: CheckCircle2, title: "Approve proof", text: "We send a digital proof with size, material and price for your approval." },
  { icon: Truck, title: "We print & ship", text: "Printed in Charlotte, NC and shipped free across the US." },
];

export default async function CustomLabelsPage() {
  const faqs = await getFaqs("custom");
  return (
    <>
      <CustomBand eyebrow="Custom Labels" title="Your brand, printed on our labels." headingLevel="h1" ctaHref="#quote" />

      <section aria-labelledby="how-title" className="section-y">
        <div className="container-x">
          <SectionHeading id="how-title" title="How it works" />
          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} index={i}>
                <Card className="h-full p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-navy-700 font-bold text-white">{i + 1}</span>
                    <Icon aria-hidden className="size-6 text-navy-700" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-h4 mt-4">{title}</h3>
                  <p className="mt-2 text-ink-600">{text}</p>
                </Card>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="gallery-title" className="section-y bg-white">
        <div className="container-x">
          <SectionHeading id="gallery-title" title="Sample custom labels" subtitle="Example designs for invented brands - your labels are printed from your own artwork." />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
            {CUSTOM_SAMPLES.map((s, i) => (
              <Reveal as="li" key={s.id} index={i}>
                <figure className="flex h-full flex-col rounded-[16px] border border-line bg-bg p-5">
                  <div className="flex flex-1 items-center justify-center p-2 sm:p-6">
                    <div className="w-full max-w-[200px]">
                      <CustomLabelArt id={s.id} />
                    </div>
                  </div>
                  <figcaption className="mt-3">
                    <span className="block font-semibold text-navy-900">{s.name}</span>
                    <span className="text-sm text-ink-600">{s.detail}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="quote" aria-labelledby="quote-title" className="section-y scroll-mt-20">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          <div>
            <h2 id="quote-title" className="text-h2">
              Request a quote
            </h2>
            <p className="mt-3 text-ink-600">Tell us about your labels and we&apos;ll send a price and proof - usually within one business day.</p>
          </div>
          <Card className="p-5 sm:p-8">
            <QuoteForm />
          </Card>
        </div>
      </section>

      <FaqSection faqs={faqs} title="Custom label FAQ" id="custom-faq-title" className="section-y bg-white" />
    </>
  );
}
