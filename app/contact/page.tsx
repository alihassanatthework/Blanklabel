import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/misc";
import { getSiteConfig } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact us",
  description: "Call 1-800-246-8805 or email info@blanklabels.com. BlankLabels, 3700 Rose Lake Drive, Charlotte, NC 28217. Our label experts answer.",
  path: "/contact",
});

export default async function ContactPage() {
  const site = await getSiteConfig();
  return (
    <div className="container-x py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="text-h1 mt-4">Contact us</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-600">Questions about an order, a printer or a custom run? Our label experts are a call or email away.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        <Card className="p-5 sm:p-8">
          <h2 className="text-h3 mb-6">Send a message</h2>
          <ContactForm />
        </Card>

        <Card className="overflow-hidden">
          {/* Static map placeholder (no Maps API in the demo) */}
          <svg viewBox="0 0 400 200" className="block h-auto w-full bg-navy-50" role="img" aria-label="Map placeholder showing our Charlotte, NC location">
            <g stroke="#DCE3EC" strokeWidth="10" fill="none">
              <path d="M-10 60 H410" />
              <path d="M-10 150 C120 140 220 170 410 130" />
              <path d="M90 -10 V210" />
              <path d="M290 -10 C280 80 310 140 300 210" />
            </g>
            <g stroke="#FFFFFF" strokeWidth="3" fill="none">
              <path d="M-10 60 H410" />
              <path d="M90 -10 V210" />
            </g>
            <rect x="120" y="80" width="60" height="40" rx="4" fill="#E2E8F0" />
            <rect x="200" y="20" width="70" height="28" rx="4" fill="#E2E8F0" />
            <circle cx="200" cy="100" r="34" fill="#F26B1D" opacity="0.15" />
            <path d="M200 70c-12 0-21 9-21 21 0 16 21 35 21 35s21-19 21-35c0-12-9-21-21-21z" fill="#F26B1D" />
            <circle cx="200" cy="91" r="7" fill="#fff" />
          </svg>
          <div className="space-y-4 p-6">
            <h2 className="text-h4">BlankLabels</h2>
            <p className="flex gap-3">
              <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-navy-700" />
              <span>
                {site.address.line1}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip} {site.address.country}
              </span>
            </p>
            <p>
              <a href={site.phoneHref} className="flex items-center gap-3 font-semibold text-navy-700 hover:underline">
                <Phone aria-hidden className="size-5" />
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 font-semibold text-navy-700 hover:underline">
                <Mail aria-hidden className="size-5" />
                {site.email}
              </a>
            </p>
            <p className="flex items-center gap-3 text-ink-600">
              <Clock aria-hidden className="size-5 text-navy-700" />
              {site.hours}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
