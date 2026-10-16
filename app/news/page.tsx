import type { Metadata } from "next";
import { NewsCard } from "@/components/home/NewsTeaser";
import { Breadcrumbs } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/Reveal";
import { getNews } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "News",
  description: "Label guides, shipping tips and news from BlankLabels - made in Charlotte, NC.",
  path: "/news",
});

export default async function NewsPage() {
  const news = await getNews();
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News" }]} />
      <h1 className="text-h1 mt-4">News &amp; guides</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-600">Practical tips for printing, storing and shipping with thermal and sheet labels.</p>
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {news.map((a, i) => (
          <Reveal as="li" key={a.slug} index={i}>
            <NewsCard a={a} headingLevel="h2" />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
