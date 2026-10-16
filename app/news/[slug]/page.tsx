import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsCard, formatDate } from "@/components/home/NewsTeaser";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/misc";
import { getNews, getNewsArticle } from "@/lib/data";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

type Params = { slug: string };
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getNews()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const a = await getNewsArticle((await params).slug);
  if (!a) return {};
  return { ...pageMetadata({ title: a.title, description: a.excerpt, path: `/news/${a.slug}` }), openGraph: { type: "article", title: a.title } };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const a = await getNewsArticle((await params).slug);
  if (!a) notFound();
  const others = (await getNews()).filter((n) => n.slug !== a.slug);
  const crumbs = [{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: a.title }];
  return (
    <article className="container-x py-8 lg:py-12">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <header className="mx-auto mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-action-600">{a.category}</p>
        <h1 className="text-h1 mt-2">{a.title}</h1>
        <p className="mt-4 text-ink-600">
          <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.readMinutes} min read
        </p>
      </header>
      <div className="prose-bl mx-auto mt-8 max-w-3xl text-lg">
        <p className="!text-ink-900">{a.excerpt}</p>
        {a.body.map((para, i) => (para.startsWith("## ") ? <h2 key={i}>{para.slice(3)}</h2> : <p key={i}>{para}</p>))}
      </div>
      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-3 border-t border-line pt-8">
        <ButtonLink href="/shop">Shop labels</ButtonLink>
        <Link href="/news" className="inline-flex h-12 items-center gap-2 font-semibold text-navy-700">
          <ArrowLeft aria-hidden className="size-4" />
          All articles
        </Link>
      </div>
      <section aria-labelledby="more-title" className="mt-16">
        <h2 id="more-title" className="text-h3 mb-6">
          Keep reading
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {others.map((n) => (
            <li key={n.slug}>
              <NewsCard a={n} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
