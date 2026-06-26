import * as React from "react";
import type { BlockProps } from "./types";
import { lexicalToText } from "./Lexical";

/** CalloutBandBlock — full-width attention band for crisis / urgency CTAs.
 *  Modeled on amber-hollow's `crisis-band` (dark, pulsing icon, immediate-help
 *  framing) and `urgency-strip` (warm accent, "limited availability"). Pared to
 *  the atomic `title + body` schema — no media subfield.
 *
 *  Variant logic: a keyword sniff on the title decides which palette + CTA
 *  to render. Words like "now", "urgent", "crisis", "help" flip to the
 *  crisis variant (red, pulsing dot, → /need-help-now). Anything else
 *  renders the urgency variant (accent palette, → /schedule-tour).
 *
 *  Body lexical → short supporting paragraph beneath the heading. */

const CRISIS_KEYWORDS = ["now", "urgent", "crisis", "help", "immediate", "emergency"];

const DEFAULTS = {
  crisis: {
    title: "Need help now?",
    body: "Our admissions team understands urgency. We'll walk through your options with care and clarity — same-day callbacks when you need them.",
    cta: "Get immediate help",
    href: "/need-help-now",
  },
  urgency: {
    title: "Limited availability",
    body: "A few residences are opening this season. Schedule a tour to see what's available and reserve your spot before they're gone.",
    cta: "Schedule a tour",
    href: "/schedule-tour",
  },
} as const;

function isCrisis(title: string | null | undefined): boolean {
  if (!title) return false;
  const lower = title.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

export function CalloutBandBlock({ title, body }: BlockProps) {
  const crisis = isCrisis(title);
  const defaults = crisis ? DEFAULTS.crisis : DEFAULTS.urgency;
  const heading = title || defaults.title;
  const copy = lexicalToText(body) || defaults.body;

  // Crisis: red/warning palette; Urgency: accent/warm palette.
  const palette = crisis
    ? {
        section: "bg-red-50 border-y border-red-200",
        iconWrap: "bg-red-100 text-red-600",
        dot: "bg-red-500",
        ring: "ring-red-300/60",
        heading: "text-red-900",
        body: "text-red-800/80",
        cta: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",
      }
    : {
        section: "bg-accent/10 border-y border-accent/30",
        iconWrap: "bg-accent/20 text-accent",
        dot: "bg-accent",
        ring: "ring-accent/40",
        heading: "text-text",
        body: "text-muted",
        cta: "bg-accent hover:bg-accent/90 text-background shadow-md hover:shadow-lg",
      };

  return (
    <section
      data-nocms-component="crisis-callout"
      className={`${palette.section} py-8 px-6 sm:px-10 lg:px-16`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
        {/* Icon circle with pulse */}
        <div className="flex-shrink-0">
          <div
            className={`relative h-16 w-16 rounded-full ${palette.iconWrap} flex items-center justify-center`}
          >
            {crisis ? (
              <>
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-full ${palette.dot} opacity-30 animate-ping`}
                />
                <span
                  aria-hidden="true"
                  className={`relative h-4 w-4 rounded-full ${palette.dot} ring-4 ${palette.ring}`}
                />
              </>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 14" />
              </svg>
            )}
          </div>
        </div>

        {/* Heading + body */}
        <div className="flex-1 min-w-0">
          <h3
            data-role="heading"
            data-payload-subfield="title"
            className={`font-heading text-2xl sm:text-3xl font-bold ${palette.heading} tracking-tight`}
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {heading}
          </h3>
          <p
            data-role="subheading"
            data-payload-subfield="body"
            className={`mt-2 font-body text-base sm:text-lg ${palette.body} leading-relaxed`}
          >
            {copy}
          </p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0">
          <a
            href={defaults.href}
            className={`inline-flex items-center gap-2 rounded-lg ${palette.cta} px-6 py-3 font-heading text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current/40`}
          >
            <span>{defaults.cta}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
