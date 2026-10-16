import { CategoryCard } from "@/components/product/CategoryCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fromPerLabel } from "@/lib/pricing";
import type { Category, Product } from "@/types";

/** Six leaf categories; parent groups (Fanfold, Rolls) appear as chips. */
export function CategoryGrid({ categories, products }: { categories: Category[]; products: Product[] }) {
  const leaves = categories.filter((c) => !c.isGroup);
  return (
    <section aria-labelledby="cat-title" className="section-y">
      <div className="container-x">
        <SectionHeading id="cat-title" title="Shop by category" action={{ label: "View all products", href: "/shop" }} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {leaves.map((c, i) => {
            const items = products.filter((p) => p.categoryId === c.id);
            const sample = [...items].sort((a, b) => a.sortRank - b.sortRank)[0];
            const group = categories.find((g) => g.id === c.parentId);
            return (
              <Reveal as="li" key={c.id} index={i}>
                <CategoryCard
                  category={c}
                  fromPrice={Math.min(...items.map(fromPerLabel))}
                  sample={sample}
                  groupName={group?.name}
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
