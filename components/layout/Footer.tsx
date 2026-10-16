import Link from "next/link";
import { CreditCard, Flag, Mail, MapPin, Phone, Smartphone, Wallet } from "lucide-react";
import { LazyNewsletterForm } from "@/components/forms/LazyForms";
import { getCategories, getSiteConfig } from "@/lib/data";
import { categoryHref } from "@/lib/data/categories";
import { FOOTER_COMPANY, FOOTER_HELP } from "@/lib/nav";
import { Logo } from "./Logo";

export async function Footer() {
  const [site, categories] = await Promise.all([getSiteConfig(), getCategories()]);
  const leaves = categories.filter((c) => !c.isGroup);
  const col = (title: string, links: { label: string; href: string }[]) => (
    <div>
      <h2 className="text-sm font-semibold tracking-[0.12em] text-white/60 uppercase" style={{ color: "rgb(255 255 255 / .6)" }}>
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-underline text-[15px] text-white/85 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-navy-900 text-white">
      {/* Newsletter band */}
      <section aria-labelledby="newsletter-title" className="border-b border-white/10">
        <div className="container-x flex flex-col gap-6 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 id="newsletter-title" className="text-h2 text-white">
              Get 10% off your first order
            </h2>
            <p className="mt-2 text-white/70">Label tips, restock reminders and member-only pricing. No spam.</p>
          </div>
          <LazyNewsletterForm />
        </div>
      </section>

      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_auto_1fr_auto_1fr_auto_1fr] lg:gap-8">
        <div>
          <Logo invert />
          <p className="mt-4 max-w-xs text-[15px] text-white/75">
            Blank and custom labels, manufactured in Charlotte, NC and shipped free across the US.
          </p>
          <address className="mt-5 space-y-2.5 text-[15px] text-white/85 not-italic">
            <p className="flex gap-2.5">
              <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-white/60" />
              <span>
                {site.address.line1}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </span>
            </p>
            <p>
              <a href={site.phoneHref} className="flex items-center gap-2.5 hover:text-white">
                <Phone aria-hidden className="size-4 text-white/60" />
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-white">
                <Mail aria-hidden className="size-4 text-white/60" />
                {site.email}
              </a>
            </p>
          </address>
        </div>
        <div aria-hidden className="perforation-v hidden lg:block" />
        {col(
          "Shop",
          leaves.map((c) => ({ label: c.name, href: categoryHref(c) })),
        )}
        <div aria-hidden className="perforation-v hidden lg:block" />
        {col("Company", FOOTER_COMPANY)}
        <div aria-hidden className="perforation-v hidden lg:block" />
        {col("Help", FOOTER_HELP)}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved. · Website demo
          </p>
          <div className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
            {[
              { icon: CreditCard, label: "Cards" },
              { icon: Wallet, label: "PayPal" },
              { icon: Smartphone, label: "Apple Pay" },
              { icon: Smartphone, label: "Google Pay" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex h-7 items-center gap-1.5 rounded-[6px] bg-white/10 px-2 text-xs font-medium text-white/85">
                <Icon aria-hidden className="size-3.5" />
                {label}
              </span>
            ))}
            <span className="ml-1 inline-flex h-7 items-center gap-1.5 rounded-full bg-teal-600 px-3 text-xs font-semibold text-white">
              <Flag aria-hidden className="size-3.5" />
              Made in USA
            </span>
          </div>
        </div>
        <div aria-hidden className="barcode-stripe h-3 text-white/[0.07]" />
      </div>
    </footer>
  );
}
