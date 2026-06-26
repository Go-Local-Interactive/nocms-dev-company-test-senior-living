import { Menu, Phone } from "lucide-react";
import { skinConfig } from "@/lib/skin";

const NAV_LINKS = [
  { href: "/living-options", label: "Living Options" },
  { href: "/floor-plans", label: "Floor Plans" },
  { href: "/amenities", label: "Amenities" },
  { href: "/our-team", label: "Our Team" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact" },
];

function telHref(phone: string | undefined): string {
  return `tel:${(phone ?? "").replace(/[^0-9+]/g, "")}`;
}

export function Header() {
  const { brandName, contactPhone } = skinConfig;

  return (
    <header
      data-nocms-component="site-header"
      className="sticky top-0 z-50 border-b border-text/10 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="font-heading text-xl font-bold text-primary tracking-tight whitespace-nowrap hover:text-primary-dark transition-colors"
          data-role="brand"
        >
          {brandName}
        </a>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text/80 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {contactPhone && (
            <a
              href={telHref(contactPhone)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-text hover:text-primary transition-colors"
              aria-label={`Call ${contactPhone}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">{contactPhone}</span>
            </a>
          )}
          <a
            href="/schedule-tour"
            className="inline-flex items-center rounded-md bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-secondary/30 hover:bg-secondary-dark hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            Schedule a Tour
          </a>
        </div>

        <details className="lg:hidden relative group">
          <summary
            className="list-none flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-text hover:bg-surface transition-colors [&::-webkit-details-marker]:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-text/10 bg-background shadow-xl p-2 z-50">
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-text hover:bg-surface hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 border-t border-text/10 pt-2 flex flex-col gap-2">
                {contactPhone && (
                  <a
                    href={telHref(contactPhone)}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-text hover:bg-surface transition-colors"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {contactPhone}
                  </a>
                )}
                <a
                  href="/schedule-tour"
                  className="rounded-md bg-secondary px-3 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-secondary-dark transition-colors"
                >
                  Schedule a Tour
                </a>
              </div>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
