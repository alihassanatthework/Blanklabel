import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/misc";
import { getPolicy, POLICIES } from "@/lib/data/policies";
import { pageMetadata } from "@/lib/seo";

type Params = { policy: string };
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return Object.keys(POLICIES).map((policy) => ({ policy }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { policy } = await params;
  const p = await getPolicy(policy);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: `${p.title} for BlankLabels.com - made in USA labels with free US shipping and 60-day returns.`, path: `/${policy}` });
}

export default async function PolicyPage({ params }: { params: Promise<Params> }) {
  const { policy } = await params;
  const p = await getPolicy(policy);
  if (!p) notFound();
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: p.title }]} />
      <h1 className="text-h1 mt-4">{p.title}</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-ink-600 uppercase">On this page</p>
          <ol className="space-y-1 border-l border-line">
            {p.toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[15px] text-ink-600 hover:border-navy-700 hover:text-navy-900">
                  {t.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="prose-bl max-w-3xl rounded-[16px] border border-line bg-white p-6 text-[17px] shadow-sm sm:p-10 [&>h2:first-child]:mt-0" dangerouslySetInnerHTML={{ __html: p.html }} />
      </div>
    </div>
  );
}
