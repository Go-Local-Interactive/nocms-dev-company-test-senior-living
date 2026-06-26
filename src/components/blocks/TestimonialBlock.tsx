import * as React from "react";
import type { BlockProps } from "./types";
import { lexicalToText, lexicalQAPairs } from "./Lexical";

/** TestimonialBlock — a grid of pull-quote cards (resident / family
 *  voice). Modeled on amber-hollow's `reviews-grid` but pared to the
 *  atomic `title + body` schema (no media subfield in atomic.ts).
 *
 *  Data-flow convention (mirrors CareLevelGridBlock / FloorPlanGridBlock):
 *    - Per-card overrides via lexical body heading/paragraph pairs:
 *      h3 → attribution line ("Margaret R. — Resident"), paragraph →
 *      quote text. First pair maps to card 0. The attribution is split
 *      on em-dash / hyphen ("Name — Role"); if no separator, the whole
 *      string is treated as the name and the role falls back to the
 *      default for that slot.
 *    - If the body has no h3 pairs, body text renders as an intro
 *      paragraph and the 3 default testimonials below are used.
 *    - Each card cycles bg tint across `bg-surface`, `bg-primary/5`,
 *      `bg-accent/5` — the golden-oaks `testimonialCard` pattern. */

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Moving here was the best decision Mom ever made. The staff know her by name, and the activities calendar keeps her busier than we ever could. She's thriving — and that means we can finally exhale.",
    name: "Sarah M.",
    role: "Daughter of resident",
  },
  {
    quote:
      "I came for the cottage, but I've stayed for the community. There's always a book club, a walking group, or a porch conversation waiting. I haven't felt this independent in years.",
    name: "Robert P.",
    role: "Resident",
  },
  {
    quote:
      "Dad's care team in the memory neighborhood is extraordinary. They treat him with such dignity — and they keep me looped in on everything. We finally feel like we have partners in this.",
    name: "Linda K.",
    role: "Family member",
  },
];

const CARD_TINTS = ["bg-surface", "bg-primary/5", "bg-accent/5"] as const;

function splitAttribution(line: string, fallback: { name: string; role: string }): { name: string; role: string } {
  // "Margaret R. — Resident" / "Margaret R. - Resident" / "Margaret R., Resident"
  const m = line.split(/\s*[—–\-,]\s*/);
  if (m.length >= 2) {
    return { name: m[0].trim() || fallback.name, role: m.slice(1).join(" — ").trim() || fallback.role };
  }
  return { name: line.trim() || fallback.name, role: fallback.role };
}

export function TestimonialBlock({ title, body }: BlockProps) {
  const overrides = lexicalQAPairs(body);
  const hasOverrides = overrides.length > 0;
  const intro = hasOverrides ? undefined : lexicalToText(body) || undefined;

  const cards: Testimonial[] = hasOverrides
    ? overrides.map((o, i) => {
        const fallback = DEFAULT_TESTIMONIALS[i] ?? DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length];
        const attrib = splitAttribution(o.q, { name: fallback.name, role: fallback.role });
        return { quote: o.a || fallback.quote, name: attrib.name, role: attrib.role };
      })
    : DEFAULT_TESTIMONIALS;

  return (
    <section
      data-nocms-component="testimonial"
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
          data-payload-subfield="body"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cards.map((t, i) => {
            const tint = CARD_TINTS[i % CARD_TINTS.length];
            return (
              <figure
                key={`${t.name}-${i}`}
                data-array-index={i}
                className={`${tint} relative rounded-2xl p-8 border border-text/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}
              >
                <span
                  aria-hidden="true"
                  className="font-heading absolute top-4 left-6 text-7xl leading-none text-primary/20 select-none"
                >
                  &ldquo;
                </span>
                <blockquote className="relative font-heading italic text-xl sm:text-2xl text-text leading-relaxed mb-6 flex-1">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-auto">
                  <div className="h-px w-12 bg-primary/30 mb-4" aria-hidden="true" />
                  <div className="font-heading font-semibold text-text text-base">{t.name}</div>
                  <div className="font-body text-sm text-muted mt-0.5">{t.role}</div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
