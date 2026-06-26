import * as React from "react";
import type { BlockProps } from "./types";
import { mediaUrl, mediaAlt } from "@/lib/payload";
import { lexicalToText, lexicalQAPairs } from "./Lexical";

/** CareLevelGridBlock — the visual centerpiece of every senior-living home
 *  page. Four cards (Independent / Assisted / Memory / Respite) with photo,
 *  title, short description, and an accent bar that grows from center on
 *  hover (the `careCardAccent` pattern from the golden-oaks library).
 *
 *  Data-flow convention (v1):
 *    - Per-card titles + descriptions default to the four standard care
 *      levels below. The block's lexical body can override them by emitting
 *      heading/paragraph pairs (h3 → card title, paragraph → description) —
 *      same shape `FaqBlock` consumes. First pair maps to card 0, etc.
 *    - The block's `title` is the section heading; if the body contains no
 *      h3 pairs it renders as a normal intro paragraph below the heading.
 *    - `mediaArray[i]` binds the photo for card i. Photos are optional;
 *      cards without a photo still render (icon-only fallback handled by
 *      a neutral gradient background).
 *
 *  The seeder (D2) and the agent's content tools should follow this same
 *  convention. */

interface CareLevel {
  title: string;
  description: string;
  href: string;
}

const DEFAULT_CARE_LEVELS: CareLevel[] = [
  {
    title: "Independent Living",
    description: "Maintenance-free residences with concierge amenities, social calendars, and the freedom to spend your days as you choose.",
    href: "/independent-living",
  },
  {
    title: "Assisted Living",
    description: "Personalized daily-living support — medication management, grooming, dining — delivered with dignity by familiar faces.",
    href: "/assisted-living",
  },
  {
    title: "Memory Care",
    description: "A secure, calm neighborhood with specialized programming for residents living with Alzheimer's and other dementias.",
    href: "/memory-care",
  },
  {
    title: "Respite Care",
    description: "Short-term stays for recovery, travel, or a caregiver break — full access to community life, no long-term commitment.",
    href: "/respite-care",
  },
];

export function CareLevelGridBlock({ title, body, mediaArray }: BlockProps) {
  const overrides = lexicalQAPairs(body);
  const hasOverrides = overrides.length > 0;
  const intro = hasOverrides ? undefined : lexicalToText(body) || undefined;
  const photos = mediaArray ?? [];

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const cards = hasOverrides
    ? overrides.map((o, i) => {
        const title = o.q || DEFAULT_CARE_LEVELS[i]?.title || "Care Level";
        const description = o.a || DEFAULT_CARE_LEVELS[i]?.description || "";
        return {
          title,
          description,
          href: DEFAULT_CARE_LEVELS[i]?.href || `/${slugify(title)}`,
        };
      })
    : DEFAULT_CARE_LEVELS.map((care, i) => {
        const o = overrides[i];
        return {
          title: o?.q || care.title,
          description: o?.a || care.description,
          href: care.href,
        };
      });

  return (
    <section
      data-nocms-component="care-level-grid"
      className="py-20 px-6 sm:px-10 lg:px-16 bg-surface"
    >
      <div className="max-w-7xl mx-auto">
        {(title || intro) && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {title && (
              <h2
                data-role="heading"
                data-payload-subfield="title"
                className="font-heading text-4xl sm:text-5xl font-bold text-text tracking-tight"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                {title}
              </h2>
            )}
            {intro && (
              <p
                data-role="subheading"
                data-payload-subfield="body"
                className="mt-4 font-body text-lg text-muted leading-relaxed"
              >
                {intro}
              </p>
            )}
          </div>
        )}
        <div
          data-array-prop="mediaArray"
          data-payload-subfield="mediaArray"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cards.map((care, i) => {
            const photo = photos[i];
            const photoSrc = mediaUrl(photo);
            return (
              <a
                key={care.title}
                href={care.href}
                data-array-index={i}
                className="group relative block bg-background rounded-2xl overflow-hidden border border-text/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-0 bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full z-10"
                />
                {photoSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    data-payload-subfield={`mediaArray.${i}`}
                    src={photoSrc}
                    alt={mediaAlt(photo) || care.title}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    data-payload-subfield={`mediaArray.${i}`}
                    aria-hidden="true"
                    className="w-full aspect-[4/3] bg-gradient-to-br from-primary/15 via-surface to-accent/20"
                  />
                )}
                <div className="p-6">
                  <h3 className="font-heading text-2xl font-semibold text-text mb-2 group-hover:text-primary transition-colors">
                    {care.title}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed">
                    {care.description}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Learn more
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
