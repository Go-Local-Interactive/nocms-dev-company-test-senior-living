import * as React from "react";
import type { BlockProps } from "./types";
import { lexicalToText, lexicalQAPairs } from "./Lexical";

/** TimelineBlock — vertical "how it works" sequence with numbered circles
 *  on the left, content cards on the right, and a primary-color connector
 *  line stitching them together. Used on the Move-In Process / How It Works
 *  pages — modeled on amber-hollow's `timeline` component (sunrise-to-sunset
 *  vertical timeline) but adapted to a numbered single-column layout that
 *  reads as a process, not a daily schedule.
 *
 *  Data-flow convention (mirrors CareLevelGridBlock / FloorPlanGridBlock):
 *    - Per-step title + description default to the four standard
 *      move-in steps below. The block's lexical body overrides them via
 *      heading/paragraph pairs (h3 → step title, paragraph → description).
 *      First pair maps to step 0, etc. If more pairs are supplied than the
 *      4 defaults, the extras render too (numbered 5+).
 *    - The block's `title` is the section heading; if the body contains no
 *      h3 pairs it renders as a normal intro paragraph below the heading. */

interface Step {
  title: string;
  description: string;
}

const DEFAULT_STEPS: Step[] = [
  {
    title: "Schedule a Tour",
    description:
      "Start with a visit — in person or virtual. Walk the grounds, meet the team, and ask every question you've been carrying around.",
  },
  {
    title: "Discuss Care Needs",
    description:
      "Sit down with our care director to review medical history, daily-living preferences, and the level of support that fits today and tomorrow.",
  },
  {
    title: "Customize Your Plan",
    description:
      "Choose a residence, finalize the care plan, and review pricing in writing — no surprises, no pressure, no hidden fees.",
  },
  {
    title: "Move In",
    description:
      "Our concierge handles the logistics — moving day coordination, apartment setup, and a personalized welcome to help you settle in.",
  },
];

export function TimelineBlock({ title, body }: BlockProps) {
  const overrides = lexicalQAPairs(body);
  const hasOverrides = overrides.length > 0;
  const intro = hasOverrides ? undefined : lexicalToText(body) || undefined;

  const steps: Step[] = hasOverrides
    ? overrides.map((o, i) => ({
        title: o.q || DEFAULT_STEPS[i]?.title || `Step ${i + 1}`,
        description: o.a || DEFAULT_STEPS[i]?.description || "",
      }))
    : DEFAULT_STEPS;

  return (
    <section
      data-nocms-component="timeline"
      className="py-20 px-6 sm:px-10 lg:px-16 bg-surface"
    >
      <div className="max-w-4xl mx-auto">
        {(title || intro) && (
          <div className="text-center mb-14 max-w-3xl mx-auto">
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
        <div className="relative">
          {/* Vertical connector line — sits behind the numbered circles */}
          <span
            aria-hidden="true"
            className="absolute left-7 top-7 bottom-7 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-primary/20"
          />
          <ol
            data-payload-subfield="body"
            className="space-y-10"
          >
            {steps.map((step, i) => (
              <li
                key={i}
                data-array-index={i}
                className="relative grid grid-cols-[3.5rem_1fr] gap-5 items-start"
              >
                {/* Numbered circle */}
                <span
                  aria-hidden="true"
                  className="relative z-10 h-14 w-14 rounded-full bg-primary text-background shadow-md ring-4 ring-surface flex items-center justify-center font-heading text-xl font-bold"
                >
                  {i + 1}
                </span>
                {/* Content card */}
                <div className="bg-background rounded-2xl border border-text/5 shadow-sm hover:shadow-md transition-shadow p-6">
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold text-text mb-2" data-role="heading-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-base text-muted leading-relaxed" data-role="subheading-2">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
