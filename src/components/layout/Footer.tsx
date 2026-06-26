import { Phone, MapPin, Facebook, Instagram, Youtube, Award, ShieldCheck } from "lucide-react";
import { skinConfig } from "@/lib/skin";

const CARE_LINKS = [
  { href: "/independent-living", label: "Independent Living" },
  { href: "/assisted-living", label: "Assisted Living" },
  { href: "/memory-care", label: "Memory Care" },
  { href: "/respite-care", label: "Respite Care" },
];

const VISIT_LINKS = [
  { href: "/schedule-tour", label: "Schedule a Tour" },
  { href: "/communities", label: "Communities" },
  { href: "/floor-plans", label: "Floor Plans" },
];

const COMPANY_LINKS = [
  { href: "/about-us", label: "About Us" },
  { href: "/our-team", label: "Our Team" },
  { href: "/careers", label: "Careers" },
  { href: "/contact-us", label: "Contact" },
];

function telHref(phone: string | undefined): string {
  return `tel:${(phone ?? "").replace(/[^0-9+]/g, "")}`;
}

export function Footer() {
  const { brandName, tagline, contactPhone, primaryAddress } = skinConfig;
  const year = new Date().getFullYear();

  return (
    <footer
      data-nocms-component="site-footer"
      className="bg-rich-brown text-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-heading text-2xl font-bold text-white">
              {brandName}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-background/70 max-w-md">
              {tagline} We&apos;re here to support you and your family through every step of the senior living journey.
            </p>
            <div className="mt-6 space-y-3 text-sm text-background/80">
              {contactPhone && (
                <a
                  href={telHref(contactPhone)}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors underline underline-offset-4 decoration-background/30 hover:decoration-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {contactPhone}
                </a>
              )}
              {primaryAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <address className="not-italic">
                    {primaryAddress.line1}
                    <br />
                    {primaryAddress.city}, {primaryAddress.state} {primaryAddress.zip}
                  </address>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
                Care
              </h3>
              <ul className="space-y-2.5">
                {CARE_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-background/70 hover:text-white transition-colors underline underline-offset-4 decoration-background/20 hover:decoration-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
                Visit
              </h3>
              <ul className="space-y-2.5">
                {VISIT_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-background/70 hover:text-white transition-colors underline underline-offset-4 decoration-background/20 hover:decoration-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
                Company
              </h3>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-background/70 hover:text-white transition-colors underline underline-offset-4 decoration-background/20 hover:decoration-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
              Accreditation
            </h3>
            <div className="flex flex-wrap gap-3">
              <div
                className="flex items-center gap-2 rounded-md border border-background/15 bg-white/5 px-3 py-2 text-xs text-background/80"
                aria-label="Licensed senior living provider"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Licensed
              </div>
              <div
                className="flex items-center gap-2 rounded-md border border-background/15 bg-white/5 px-3 py-2 text-xs text-background/80"
                aria-label="Accredited senior care community"
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                Accredited
              </div>
            </div>
            <h3 className="mt-6 font-heading text-sm font-bold uppercase tracking-wider text-white mb-3">
              Follow
            </h3>
            <div className="flex gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors"
              >
                <Facebook className="h-4 w-4 text-white" aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors"
              >
                <Instagram className="h-4 w-4 text-white" aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors"
              >
                <Youtube className="h-4 w-4 text-white" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-background/10 pt-6 text-xs text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {brandName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/privacy-policy" className="hover:text-white transition-colors underline underline-offset-4 decoration-background/20">
              Privacy Policy
            </a>
            <a href="/terms-of-use" className="hover:text-white transition-colors underline underline-offset-4 decoration-background/20">
              Terms of Use
            </a>
            <a href="/accessibility" className="hover:text-white transition-colors underline underline-offset-4 decoration-background/20">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
