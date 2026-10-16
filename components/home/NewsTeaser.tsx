import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { NewsArticle } from "@/types";

export const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

/** News card with a code-drawn header (no photography in the demo). */
export function NewsCard({ a, headingLevel = "h3" }: { a: NewsArticle; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Card as="article" interactive className="group relative flex h-full flex-col overflow-hidden">
      <div aria-hidden className="relative h-36 overflow-hidden bg-navy-700">
        <div className="barcode-stripe absolute inset-0 text-white/[0.07]" />
        <div className="absolute -right-6 -bottom-8 h-28 w-40 rotate-[-8deg] rounded-[10px] bg-white/95 p-3 shadow-lg transition-transform duration-300 motion-safe:group-hover:rotate-[-4deg]">
          <div className="h-2 w-16 rounded bg-navy-900" />
          <div className="mt-2 h-1.5 w-24 rounded bg-ink-400/60" />
          <div className="mt-1.5 h-1.5 w-20 rounded bg-ink-400/60" />
        </div>
        <span className="absolute top-4 left-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">{a.category}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs text-ink-600">
          <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.readMinutes} min read
        </p>
        <H className="text-h4">
          <Link href={`/news/${a.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-navy-700">
            {a.title}
          </Link>
        </H>
        <p className="text-sm text-ink-600">{a.excerpt}</p>
      </div>
    </Card>
  );
}

export function NewsTeaser({ news }: { news: NewsArticle[] }) {
  return (
    <section aria-labelledby="news-title" className="section-y bg-white">
      <div className="container-x">
        <SectionHeading id="news-title" title="Latest news" action={{ label: "All articles", href: "/news" }} />
        <ul className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {news.slice(0, 3).map((a, i) => (
            <Reveal as="li" key={a.slug} index={i}>
              <NewsCard a={a} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
