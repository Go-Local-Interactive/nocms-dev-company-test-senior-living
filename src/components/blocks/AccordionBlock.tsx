import * as React from "react";
import type { BlockProps } from "./types";
import { lexicalToText, lexicalQAPairs } from "./Lexical";

/** AccordionBlock — vertical stack of native `<details>` disclosure widgets
 *  for FAQ-style content. JS-free: the browser handles open/close, the
 *  chevron rotates via the `group-open:` Tailwind state. Modeled on
 *  amber-hollow's `tabbed-accordion` component but stripped to a single
 *  flat list (no tabs, no search, no sticky sidebar) — Payload writes
 *  one block per category, so the per-category UX is unnecessary at this
 *  layer.
 *
 *  Data-flow convention (mirrors FaqBlock / CareLevelGridBlock):
 *    - Body lexical heading/paragraph pairs (h3 → question, paragraph →
 *      answer) become accordion items. First pair maps to item 0.
 *    - If the body has no h3 pairs, body text renders as an intro
 *      paragraph and the 5 default FAQ items below are used.
 *    - The block's `title` is the section heading. */

interface FaqItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: "How much does it cost to live here?",
    answer:
      "Monthly fees vary by residence size and level of care. We share a full written breakdown after your tour — no obligation, no fine print.",
  },
  {
    question: "What levels of care do you offer?",
    answer:
      "Independent living, assisted living, memory care, and short-term respite stays. Residents can transition between care levels without leaving the community.",
  },
  {
    question: "What's included in dining?",
    answer:
      "Three chef-prepared meals daily in our restaurant-style dining room, plus all-day cafe service, snacks, and beverages — accommodations for most dietary needs included.",
  },
  {
    question: "Can family and friends visit anytime?",
    answer:
      "Yes. Loved ones are welcome 24/7. We have private dining rooms, family lounges, and overnight guest suites available for extended visits.",
  },
  {
    question: "How quickly can I move in?",
    answer:
      "Most move-ins happen within 2–4 weeks of your tour, depending on availability. For urgent situations, we offer expedited admissions when residences are open.",
  },
];

export function AccordionBlock({ title, body }: BlockProps) {
  const overrides = lexicalQAPairs(body);
  const hasOverrides = overrides.length > 0;
  const intro = hasOverrides ? undefined : lexicalToText(body) || undefined;

  const items: FaqItem[] = hasOverrides
    ? overrides.map((o, i) => ({
        question: o.q || DEFAULT_FAQS[i]?.question || `Question ${i + 1}`,
        answer: o.a || DEFAULT_FAQS[i]?.answer || "",
      }))
    : DEFAULT_FAQS;

  return (
    <section
      data-nocms-component="accordion"
      className="py-20 px-6 sm:px-10 lg:px-16 bg-surface"
    >
      <div className="max-w-3xl mx-auto">
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
          className="flex flex-col gap-3"
        >
          {items.map((item, i) => (
            <details
              key={i}
              data-array-index={i}
              className="group bg-background rounded-2xl border border-text/5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-heading text-lg font-semibold text-text hover:text-primary transition-colors">
                <span>{item.question}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 flex-shrink-0 text-muted group-open:text-primary group-open:rotate-180 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p className="px-6 pb-5 font-body text-base text-muted leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
