import { Quote } from "lucide-react";
import { Stars } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/Reveal";
import type { Review, SiteConfig } from "@/types";

function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="flex h-full w-[300px] shrink-0 flex-col gap-3 rounded-[16px] border border-line bg-white p-5 shadow-sm sm:w-[340px]">
      <div className="flex items-center justify-between">
        <Stars rating={r.rating} size={15} />
        <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-ink-600">Demo review</span>
      </div>
      <blockquote className="flex-1 text-[15px] text-ink-900">
        <Quote aria-hidden className="mb-1 size-4 text-line" />
        {r.text}
      </blockquote>
      <figcaption className="text-sm">
        <span className="font-semibold text-navy-900">{r.name}</span>
        <span className="text-ink-600"> · {r.business}</span>
        <span className="mt-0.5 block text-xs text-ink-600">{r.product}</span>
      </figcaption>
    </figure>
  );
}

/** Stat + two marquee rows in opposite directions (CSS, pauses on hover/focus); static grid of 4 under reduced motion. */
export function Reviews({ reviews, site }: { reviews: Review[]; site: SiteConfig }) {
  const rows = [reviews.slice(0, 4), reviews.slice(4, 8)];
  return (
    <section aria-labelledby="reviews-title" className="section-y overflow-hidden">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[minmax(0,360px)_1fr]">
        <Reveal>
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-action-600 uppercase">Trusted by sellers</p>
          <h2 id="reviews-title" className="text-h2">
            {site.ebay.ratings} verified eBay ratings - {site.ebay.positive} positive
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <Stars rating={5} size={22} />
            <span className="font-semibold text-navy-900">{site.ebay.positive} positive</span>
          </div>
          <p className="mt-4 text-sm text-ink-600">Ratings based on our eBay store. Review cards below are demo samples.</p>
        </Reveal>

        <div className="relative min-w-0">
          {/* Marquee (motion allowed) */}
          <div className="marquee hidden space-y-4 motion-safe:block" tabIndex={0} aria-label="Customer reviews, scrolling. Hover or focus to pause.">
            {rows.map((row, ri) => (
              <div key={ri} className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <div className={`marquee-track flex w-max gap-4 ${ri === 1 ? "reverse" : ""}`}>
                  {[...row, ...row].map((r, i) => (
                    <div key={`${r.id}-${i}`} aria-hidden={i >= row.length}>
                      <ReviewCard r={r} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Static grid under reduced motion */}
          <div className="hidden gap-4 motion-reduce:grid sm:grid-cols-2">
            {reviews.slice(0, 4).map((r) => (
              <div key={r.id} className="[&>figure]:w-full">
                <ReviewCard r={r} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
