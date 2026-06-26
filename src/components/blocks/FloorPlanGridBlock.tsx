import * as React from "react";
import type { BlockProps } from "./types";
import { mediaUrl, mediaAlt } from "@/lib/payload";
import { lexicalToText, lexicalQAPairs } from "./Lexical";

/** FloorPlanGridBlock — the index card grid that lives inside the
 *  `floor-plans` page (B8 pages-with-prefix). Six cards (one per default
 *  plan: Azalea, Cypress, Dogwood, Heritage, Magnolia, Oakwood) each link
 *  to their `/floor-plans/[slug]` detail page.
 *
 *  Data-flow convention (mirrors CareLevelGridBlock):
 *    - Per-card name + spec-line override via lexical body h3+paragraph
 *      pairs (h3 → card name, paragraph → spec line shown under the name,
 *      e.g. "820 sq ft · 1 bed + den · 1 bath · From $3,800/mo").
 *      First pair maps to card 0.
 *    - The block's `title` is the section heading; body without h3 pairs
 *      renders as a plain intro paragraph below the heading.
 *    - `mediaArray[i]` binds the photo for card i. */

interface FloorPlan {
  slug: string;
  name: string;
  sqft: string;
  beds: string;
  baths: string;
  priceFrom: string;
}

const DEFAULT_FLOOR_PLANS: FloorPlan[] = [
  { slug: "azalea", name: "Azalea", sqft: "650 sq ft", beds: "1 bed", baths: "1 bath", priceFrom: "From $3,200/mo" },
  { slug: "cypress", name: "Cypress", sqft: "820 sq ft", beds: "1 bed + den", baths: "1 bath", priceFrom: "From $3,800/mo" },
  { slug: "dogwood", name: "Dogwood", sqft: "920 sq ft", beds: "2 beds", baths: "2 baths", priceFrom: "From $4,400/mo" },
  { slug: "heritage", name: "Heritage", sqft: "1100 sq ft", beds: "2 beds", baths: "2 baths", priceFrom: "From $4,900/mo" },
  { slug: "magnolia", name: "Magnolia", sqft: "750 sq ft", beds: "1 bed", baths: "1.5 baths", priceFrom: "From $3,600/mo" },
  { slug: "oakwood", name: "Oakwood", sqft: "1250 sq ft", beds: "2 beds", baths: "2 baths", priceFrom: "From $5,200/mo" },
];

function splitSpecLine(line: string): { specs: string; price: string } {
  // Spec lines typically look like "650 sq ft · 1 bed · 1 bath · From $3,200/mo".
  // Pull the "From $..." chunk out as the price; everything else is the specs row.
  const parts = line.split(/\s*[·•|]\s*/).filter(Boolean);
  const priceIdx = parts.findIndex((p) => /\$/.test(p) || /^from\b/i.test(p));
  if (priceIdx === -1) return { specs: line, price: "" };
  const price = parts[priceIdx];
  const specs = parts.filter((_, i) => i !== priceIdx).join(" · ");
  return { specs, price };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function FloorPlanGridBlock({ title, body, mediaArray }: BlockProps) {
  const overrides = lexicalQAPairs(body);
  const hasOverrides = overrides.length > 0;
  const intro = hasOverrides ? undefined : lexicalToText(body) || undefined;
  const photos = mediaArray ?? [];

  const cards: FloorPlan[] = hasOverrides
    ? overrides.map((o, i) => {
        const plan = DEFAULT_FLOOR_PLANS[i];
        const split = splitSpecLine(o.a);
        const name = o.q || plan?.name || `Floor Plan ${i + 1}`;
        // Derive the slug from the overridden name so the card's link matches
        // the displayed plan. When the override has no name, fall back to the
        // default plan's slug at this index if one exists, else slugify the
        // resolved name.
        const slug = o.q ? slugify(o.q) : plan?.slug || slugify(name);
        return {
          slug,
          name,
          sqft: split.specs || (plan ? `${plan.sqft} · ${plan.beds} · ${plan.baths}` : ""),
          beds: "",
          baths: "",
          priceFrom: split.price || plan?.priceFrom || "",
        };
      })
    : DEFAULT_FLOOR_PLANS;

  return (
    <section
      data-nocms-component="floor-plan-grid"
      className="py-20 px-6 sm:px-10 lg:px-16 bg-background"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cards.map((plan, i) => {
            const photo = photos[i];
            const photoSrc = mediaUrl(photo);
            const specsLine = plan.beds || plan.baths
              ? [plan.sqft, plan.beds, plan.baths].filter(Boolean).join(" · ")
              : plan.sqft;
            return (
              <a
                key={plan.slug}
                href={`/floor-plans/${plan.slug}`}
                data-array-index={i}
                className="group relative block bg-surface rounded-2xl overflow-hidden border border-text/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {photoSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    data-payload-subfield={`mediaArray.${i}`}
                    src={photoSrc}
                    alt={mediaAlt(photo) || `${plan.name} floor plan`}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy" data-role="media"
                  />
                ) : (
                  <div
                    data-payload-subfield={`mediaArray.${i}`}
                    aria-hidden="true"
                    className="w-full aspect-[4/3] bg-gradient-to-br from-primary/15 via-surface to-accent/20"
                  />
                )}
                <div className="p-6">
                  <h3 className="font-heading text-2xl font-semibold text-text mb-2 group-hover:text-primary transition-colors" data-role="heading-2">
                    {plan.name}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed mb-3" data-role="subheading-2">
                    {specsLine}
                  </p>
                  {plan.priceFrom && (
                    <p className="font-heading text-lg font-bold text-primary mb-4" data-role="subheading-3">
                      {plan.priceFrom}
                    </p>
                  )}
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all" data-role="text"
                  >
                    View details
                    <span aria-hidden="true" data-role="text-2">&rarr;</span>
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
