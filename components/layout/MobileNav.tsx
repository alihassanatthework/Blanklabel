"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Phone, Printer, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { CategoryIcon } from "@/components/ui/icons";
import { Sheet } from "@/components/ui/Sheet";
import { categoryHref } from "@/lib/data/categories";
import { NAV_LINKS, PRINTER_MENU } from "@/lib/nav";
import { useUi } from "@/lib/store/ui";
import { useCatalog } from "./CatalogProvider";

/** < lg: right slide-in drawer (85% width): category accordion, links, phone and account. */
export function MobileNav() {
  const { navOpen, setNavOpen } = useUi();
  const { categories, site } = useCatalog();
  const pathname = usePathname();
  const first = useRef(pathname);
  useEffect(() => {
    if (pathname !== first.current) setNavOpen(false);
  }, [pathname, setNavOpen]);

  const linkCls = "flex min-h-11 items-center gap-3 rounded-[10px] px-2 text-[15px] font-medium text-ink-900 hover:bg-navy-50";

  return (
    <Sheet open={navOpen} onOpenChange={setNavOpen} title="Menu" className="!w-[85%] max-w-sm">
      <div className="px-5 pb-8">
        <Accordion
          dense
          headingLevel={2}
          items={[
            {
              id: "shop",
              title: "Shop",
              content: (
                <ul className="space-y-0.5">
                  <li>
                    <Link href="/shop" className={linkCls}>
                      All products
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link href={categoryHref(c)} className={linkCls} style={{ paddingLeft: c.parentId ? 28 : 8 }}>
                        <CategoryIcon name={c.icon} className="size-4 text-navy-700" />
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              id: "printer",
              title: "Shop by Printer",
              content: (
                <ul className="grid grid-cols-2 gap-1">
                  {PRINTER_MENU.map((p) => (
                    <li key={p.id}>
                      <Link href={`/shop?printer=${p.id}`} className={linkCls}>
                        <Printer aria-hidden className="size-4 text-navy-700" />
                        {p.label}
                      </Link>
                    </li>
                  ))}
                  <li className="col-span-2">
                    <Link href="/printer-finder" className={`${linkCls} font-semibold text-navy-700`}>
                      Open the printer finder
                    </Link>
                  </li>
                </ul>
              ),
            },
          ]}
        />
        <ul className="mt-2 border-t border-line pt-2">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkCls}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/news" className={linkCls}>
              News
            </Link>
          </li>
        </ul>
        <div className="mt-4 space-y-1 border-t border-line pt-4">
          <a href={site.phoneHref} className={linkCls}>
            <Phone aria-hidden className="size-4 text-navy-700" />
            {site.phone}
          </a>
          <Link href="/account" className={linkCls}>
            <User aria-hidden className="size-4 text-navy-700" />
            My account
          </Link>
          <Link href="/wishlist" className={linkCls}>
            <Heart aria-hidden className="size-4 text-navy-700" />
            Wishlist
          </Link>
        </div>
      </div>
    </Sheet>
  );
}
