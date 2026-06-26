import * as React from "react";
import type { BlockProps } from "./types";
import { lexicalToText, lexicalListItems } from "./Lexical";
import skinConfig from "@/skin.config";

/** TourFormBlock — two-column "Schedule a Tour" inquiry section. Modeled on
 *  amber-hollow's split-form + tour-widget components, pared to the atomic
 *  `title + body` schema. No JS — form posts to `/api/tour-inquiry` (a
 *  placeholder route consumers wire to their backend). HTML5 required + type
 *  validation is the only client-side check.
 *
 *  Data-flow:
 *    - Lexical body paragraph → intro copy under the heading.
 *    - Lexical body list items → selling-point bullets in the left column.
 *      Falls back to DEFAULT_SELLING_POINTS when none authored.
 *    - The "Community of Interest" select seeds its first option with
 *      `skinConfig.brandName` so single-property skins read naturally;
 *      multi-property tenants can override the option list in a later pass. */

const DEFAULT_INTRO =
  "Take a walk through our community, meet the team, and see for yourself what makes this feel like home. Tell us a bit about your visit and we'll be in touch within one business day.";

const DEFAULT_SELLING_POINTS = [
  "Private, unhurried walk-throughs led by our admissions team",
  "Meet staff and residents — ask anything, no pressure",
  "Sample the dining room and tour available residences",
  "Confirmation within one business day",
];

export function TourFormBlock({ title, body }: BlockProps) {
  const intro = lexicalToText(body) || DEFAULT_INTRO;
  const items = lexicalListItems(body);
  const sellingPoints = items.length > 0 ? items : DEFAULT_SELLING_POINTS;
  const heading = title || `See ${skinConfig.brandName} for Yourself`;
  const brandName = skinConfig.brandName;

  return (
    <section
      data-nocms-component="tour-form"
      className="py-20 px-6 sm:px-10 lg:px-16 bg-surface"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: heading + intro + selling points */}
        <div>
          <h2
            data-role="heading"
            data-payload-subfield="title"
            className="font-heading text-4xl sm:text-5xl font-bold text-text tracking-tight"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {heading}
          </h2>
          <p
            data-role="subheading"
            data-payload-subfield="body"
            className="mt-5 font-body text-lg text-muted leading-relaxed"
          >
            {intro}
          </p>
          <ul className="mt-8 space-y-4">
            {sellingPoints.map((pt, i) => (
              <li
                key={`${i}-${pt.slice(0, 24)}`}
                data-array-index={i}
                className="flex items-start gap-3 font-body text-base text-text"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: form card */}
        <div className="rounded-2xl bg-background shadow-xl border border-text/5 p-8 sm:p-12">
          <form
            action="/api/tour-inquiry"
            method="post"
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="tour-name"
                className="block font-body text-sm font-semibold text-text mb-1.5" data-role="text"
              >
                Your Name
              </label>
              <input
                type="text"
                id="tour-name"
                name="name"
                required
                placeholder="First and last name"
                className="w-full rounded-lg border-2 border-text/10 bg-background px-4 py-3 font-body text-base text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="tour-email"
                  className="block font-body text-sm font-semibold text-text mb-1.5" data-role="text-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="tour-email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border-2 border-text/10 bg-background px-4 py-3 font-body text-base text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="tour-phone"
                  className="block font-body text-sm font-semibold text-text mb-1.5" data-role="text-3"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="tour-phone"
                  name="phone"
                  placeholder="(555) 000-0000"
                  className="w-full rounded-lg border-2 border-text/10 bg-background px-4 py-3 font-body text-base text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="tour-date"
                  className="block font-body text-sm font-semibold text-text mb-1.5" data-role="text-4"
                >
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="tour-date"
                  name="preferredDate"
                  className="w-full rounded-lg border-2 border-text/10 bg-background px-4 py-3 font-body text-base text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="tour-community"
                  className="block font-body text-sm font-semibold text-text mb-1.5" data-role="text-5"
                >
                  Community of Interest
                </label>
                <select
                  id="tour-community"
                  name="community"
                  defaultValue={brandName}
                  className="w-full rounded-lg border-2 border-text/10 bg-background px-4 py-3 font-body text-base text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition appearance-none"
                >
                  <option value={brandName}>{brandName}</option>
                  <option value="not-sure">Not sure yet</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="tour-message"
                className="block font-body text-sm font-semibold text-text mb-1.5" data-role="text-6"
              >
                Anything we should know?{" "}
                <span className="font-normal text-muted" data-role="text-7">(optional)</span>
              </label>
              <textarea
                id="tour-message"
                name="message"
                rows={4}
                placeholder="Questions, accessibility needs, who's visiting..."
                className="w-full rounded-lg border-2 border-text/10 bg-background px-4 py-3 font-body text-base text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition resize-y"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-4 font-heading text-base font-semibold text-background shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2" data-role="cta"
            >
              Schedule a Tour
            </button>

            <p className="text-center font-body text-sm text-muted leading-relaxed" data-role="subheading-2">
              No commitment — just a friendly visit. We'll confirm your time
              within one business day.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
