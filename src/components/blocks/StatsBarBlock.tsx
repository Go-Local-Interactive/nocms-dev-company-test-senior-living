import * as React from "react";
import type { BlockProps } from "./types";
import { lexicalParagraphs, lexicalQAPairs } from "./Lexical";

/** StatsBarBlock — horizontal row of headline metrics (years caring, families
 *  served, satisfaction rate, etc.). Modeled on amber-hollow's
 *  `accreditation-bar` component but adapted to numbers-forward stats with
 *  large tabular-num display values stacked above muted labels. Renders on
 *  a primary-tinted band so it reads as a trust-signal strip between hero
 *  sections.
 *
 *  Data-flow convention:
 *    - Each top-level paragraph in the body encodes one stat shaped like
 *      "20+ Years Caring" or "98% Family Satisfaction" — a leading
 *      number/percent token is split off as the display value, the rest is
 *      the label. (Heading/paragraph QA pairs are also accepted: heading
 *      becomes the value, paragraph the label.)
 *    - If the body is empty, the 4 default stats below render.
 *    - The block's `title` is an optional section heading above the row. */

interface Stat {
  value: string;
  label: string;
}

const DEFAULT_STATS: Stat[] = [
  { value: "20+", label: "Years Caring" },
  { value: "500+", label: "Residents Served" },
  { value: "98%", label: "Family Satisfaction" },
  { value: "24/7", label: "On-Site Care" },
];

const STAT_RE = /^(\d+(?:\.\d+)?[+%]?|\d+\/\d+)\s+(.+)$/;

function parseStat(line: string, fallback: Stat): Stat {
  const m = line.match(STAT_RE);
  if (m) return { value: m[1], label: m[2] };
  return fallback;
}

export function StatsBarBlock({ title, body }: BlockProps) {
  const qaPairs = lexicalQAPairs(body);
  const paragraphs = lexicalParagraphs(body);

  const statParas = paragraphs.filter((p) => STAT_RE.test(p));
  const introParas = paragraphs.filter((p) => !STAT_RE.test(p));

  let stats: Stat[];
  let intro: string | undefined;
  if (qaPairs.length > 0) {
    stats = qaPairs.map((p, i) => ({
      value: p.q || DEFAULT_STATS[i]?.value || "",
      label: p.a || DEFAULT_STATS[i]?.label || "",
    }));
    intro = undefined;
  } else {
    // Only paragraphs matching STAT_RE are stats; everything else is intro copy.
    // Each statPara is guaranteed to match, so the DEFAULT_STATS[i] fallback is
    // never actually hit — it is kept only as a benign safety net.
    stats =
      statParas.length > 0
        ? statParas.map((line, i) => parseStat(line, DEFAULT_STATS[i] ?? { value: line, label: "" }))
        : DEFAULT_STATS;
    intro = introParas.length > 0 ? introParas.join(" ") || undefined : undefined;
  }

  return (
    <section
      data-nocms-component="stats-bar"
      className="py-16 px-6 sm:px-10 lg:px-16 bg-primary text-background"
    >
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2
            data-role="heading"
            data-payload-subfield="title"
            className="text-center font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-10"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {title}
          </h2>
        )}
        {intro && (
          <p
            data-role="subheading"
            data-payload-subfield="body"
            className="text-center font-body text-base opacity-80 -mt-6 mb-10 max-w-2xl mx-auto"
          >
            {intro}
          </p>
        )}
        <dl
          data-payload-subfield="body"
          className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-center"
        >
          {stats.map((stat, i) => (
            <div key={i} data-array-index={i} className="flex flex-col items-center">
              <dt
                className="font-heading text-5xl sm:text-6xl font-bold tracking-tight"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {stat.value}
              </dt>
              <dd className="mt-2 font-body text-sm sm:text-base uppercase tracking-wide opacity-85">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
