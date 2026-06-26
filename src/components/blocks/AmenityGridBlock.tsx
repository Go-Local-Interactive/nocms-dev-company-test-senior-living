import * as React from "react";
import type { BlockProps } from "./types";
import { mediaUrl, mediaAlt } from "@/lib/payload";
import { lexicalToText, lexicalQAPairs } from "./Lexical";

/** AmenityGridBlock — 3-column grid of community amenities (dining, library,
 *  garden, fitness, etc.). Modeled on amber-hollow's `icon-card-grid` (light
 *  variant) — each card centers an icon-circle above a title + description.
 *  Per-card accent colors cycle so the grid reads as a varied set, not a
 *  uniform stack.
 *
 *  Data-flow convention:
 *    - Each heading/paragraph pair in the body is one amenity: h3 = name,
 *      paragraph = description.
 *    - `mediaArray[i]` is an optional photo for amenity i — if provided, it
 *      replaces the icon circle with a square image at the top of the card.
 *    - Empty body falls back to 6 default amenities. */

interface Amenity {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const ICONS = {
  dining: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7a3 3 0 0 0 3 3v10" /><path d="M9 2v20" /><path d="M9 9V2" /><path d="M21 2v20" /><path d="M21 9c-3 0-5-2-5-5V2" />
    </svg>
  ),
  library: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  garden: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" /><path d="M12 12c-3 0-5-2-5-5 3 0 5 2 5 5z" /><path d="M12 12c3 0 5-2 5-5-3 0-5 2-5 5z" /><path d="M5 17h14" />
    </svg>
  ),
  fitness: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v16" /><path d="M18 4v16" /><path d="M2 8v8" /><path d="M22 8v8" /><path d="M6 12h12" />
    </svg>
  ),
  theater: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="14" rx="2" /><path d="M8 22h8" /><path d="M12 18v4" />
    </svg>
  ),
  spa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4-4 4-12 0-16-4 4-4 12 0 16z" /><path d="M2 22c4 0 8-2 10-6" /><path d="M22 22c-4 0-8-2-10-6" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

const DEFAULT_AMENITIES: Amenity[] = [
  { name: "Restaurant Dining", description: "Three chef-prepared meals daily in a relaxed dining room — seasonal menus, dietary accommodations, and tables that fill with conversation.", icon: ICONS.dining },
  { name: "Library & Lounges", description: "Quiet corners with floor-to-ceiling bookshelves, reading chairs, and a curated rotation of newspapers, magazines, and large-print titles.", icon: ICONS.library },
  { name: "Gardens & Walking Paths", description: "Landscaped courtyards, raised garden beds, and shaded paths that invite a morning stroll or an afternoon with the grandchildren.", icon: ICONS.garden },
  { name: "Fitness Center", description: "Senior-friendly equipment, group classes, and chair yoga led by certified instructors who tailor every session to the room.", icon: ICONS.fitness },
  { name: "Theater & Performance Hall", description: "Tiered seating for movie nights, live music, lectures, and the occasional grandkid recital — popcorn included.", icon: ICONS.theater },
  { name: "Salon & Spa", description: "On-site hair, nail, and spa services so residents never have to leave the community to feel pampered.", icon: ICONS.spa },
];

function pickIcon(name: string): React.ReactNode {
  const n = name.toLowerCase();
  if (n.includes("dining") || n.includes("restaurant") || n.includes("cafe")) return ICONS.dining;
  if (n.includes("library") || n.includes("book") || n.includes("read")) return ICONS.library;
  if (n.includes("garden") || n.includes("courtyard") || n.includes("outdoor")) return ICONS.garden;
  if (n.includes("fitness") || n.includes("gym") || n.includes("yoga")) return ICONS.fitness;
  if (n.includes("theater") || n.includes("cinema") || n.includes("performance")) return ICONS.theater;
  if (n.includes("salon") || n.includes("spa") || n.includes("beauty")) return ICONS.spa;
  return ICONS.default;
}

const ACCENT_TINTS = [
  "bg-primary/10 text-primary",
  "bg-accent/15 text-accent",
  "bg-secondary/15 text-secondary",
  "bg-primary/10 text-primary",
  "bg-accent/15 text-accent",
  "bg-secondary/15 text-secondary",
];

export function AmenityGridBlock({ title, body, mediaArray }: BlockProps) {
  const overrides = lexicalQAPairs(body);
  const hasOverrides = overrides.length > 0;
  const intro = hasOverrides ? undefined : lexicalToText(body) || undefined;
  const photos = mediaArray ?? [];

  const amenities: Amenity[] = hasOverrides
    ? overrides.map((o, i) => {
        const fallback = DEFAULT_AMENITIES[i] ?? DEFAULT_AMENITIES[0];
        const name = o.q || fallback.name;
        return { name, description: o.a || fallback.description, icon: pickIcon(name) };
      })
    : DEFAULT_AMENITIES;

  return (
    <section
      data-nocms-component="amenity-grid"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {amenities.map((a, i) => {
            const photo = photos[i];
            const photoSrc = mediaUrl(photo);
            const tint = ACCENT_TINTS[i % ACCENT_TINTS.length];
            return (
              <article
                key={i}
                data-array-index={i}
                className="group bg-background rounded-2xl border border-text/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {photoSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    data-payload-subfield={`mediaArray.${i}`}
                    src={photoSrc}
                    alt={mediaAlt(photo) || a.name}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy" data-role="media"
                  />
                ) : null}
                <div className="p-7 text-center">
                  {!photoSrc && (
                    <div
                      data-payload-subfield={`mediaArray.${i}`}
                      className={`mx-auto mb-5 h-16 w-16 rounded-full flex items-center justify-center ${tint}`}
                    >
                      <span className="h-8 w-8 block">{a.icon}</span>
                    </div>
                  )}
                  <h3 className="font-heading text-xl font-semibold text-text mb-2" data-role="heading-2">
                    {a.name}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed" data-role="subheading-2">
                    {a.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
