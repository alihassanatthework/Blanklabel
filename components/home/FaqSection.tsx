import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqJsonLd, JsonLd } from "@/lib/seo";
import type { Faq } from "@/types";

export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  id = "faq-title",
  className = "section-y",
}: {
  faqs: Faq[];
  title?: string;
  id?: string;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={className}>
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
        <SectionHeading id={id} title={title} subtitle="Still stuck? Call or email our label experts - we answer." />
        <div className="rounded-[16px] border border-line bg-white px-5 shadow-sm sm:px-7">
          <Accordion items={faqs.map((f) => ({ id: f.id, title: f.q, content: <p>{f.a}</p> }))} />
        </div>
      </div>
    </section>
  );
}
