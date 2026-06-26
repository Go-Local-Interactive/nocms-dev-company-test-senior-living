import * as React from "react";
import type { BlockProps } from "./types";
import { mediaUrl, mediaAlt } from "@/lib/payload";
import { Lexical } from "./Lexical";
import type { LexicalNode, LexicalRoot } from "./types";

/** FloorPlanCardBlock — renders a single floor-plan detail "hero card" on
 *  pages with slugs like `floor-plans/azalea`. Layout: large media on
 *  one side, name + spec list + description + CTAs on the other.
 *
 *  Data-flow convention:
 *    - `title` → h1 plan name.
 *    - `media` → main photo (left/top on mobile).
 *    - `body` (lexical) is parsed two ways:
 *      • Any top-level **list** is treated as the spec list (sqft, beds,
 *        baths, included features). Rendered as the highlighted specs
 *        card next to the description.
 *      • Everything else (paragraphs, headings) renders as the
 *        descriptive prose below the heading.
 *    - CTAs are fixed: primary "Schedule a Tour" → /schedule-tour,
 *      secondary "Request Pricing" → /request-pricing. */

function nodeToText(n: LexicalNode): string {
  const out: string[] = [];
  const walk = (x: LexicalNode) => {
    if (x.type === "text" && typeof x.text === "string") out.push(x.text);
    x.children?.forEach(walk);
  };
  walk(n);
  return out.join(" ").trim();
}

function extractSpecsAndProse(body: LexicalRoot | null | undefined): {
  specs: string[];
  prose: LexicalRoot | null;
} {
  if (!body?.root?.children) return { specs: [], prose: null };
  const specs: string[] = [];
  const proseChildren: LexicalNode[] = [];
  for (const node of body.root.children) {
    if (node.type === "list" && node.children?.length) {
      for (const li of node.children) {
        if (li.type === "listitem") specs.push(nodeToText(li));
      }
    } else {
      proseChildren.push(node);
    }
  }
  const prose: LexicalRoot | null = proseChildren.length
    ? { ...body, root: { ...body.root, children: proseChildren } }
    : null;
  return { specs, prose };
}

export function FloorPlanCardBlock({ title, body, media }: BlockProps) {
  const photo = mediaUrl(media);
  const { specs, prose } = extractSpecsAndProse(body);

  return (
    <section
      data-nocms-component="floor-plan-card"
      className="py-20 px-6 sm:px-10 lg:px-16 bg-background"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div className="relative">
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              data-payload-subfield="media"
              src={photo}
              alt={mediaAlt(media) || title || "Floor plan"}
              className="w-full aspect-[4/3] object-cover rounded-2xl shadow-lg"
              loading="eager"
            />
          ) : (
            <div
              data-payload-subfield="media"
              aria-hidden="true"
              className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/15 via-surface to-accent/20"
            />
          )}
        </div>
        <div>
          {title && (
            <h1
              data-role="heading"
              data-payload-subfield="title"
              className="font-heading text-4xl sm:text-5xl font-bold text-text tracking-tight mb-4"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {title}
            </h1>
          )}
          {specs.length > 0 && (
            <ul
              data-payload-subfield="body"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 p-5 rounded-xl bg-surface border border-text/5"
            >
              {specs.map((spec, i) => (
                <li
                  key={i}
                  data-array-index={i}
                  className="flex items-start gap-2 font-body text-sm text-text"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"
                  />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          )}
          {prose && (
            <Lexical
              value={prose}
              subfield="body"
              className="font-body text-base text-muted leading-relaxed mb-8 space-y-4 [&>h2]:font-heading [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-text [&>h2]:mt-6 [&>h2]:mb-2 [&>h3]:font-heading [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-text [&>h3]:mt-4 [&>h3]:mb-2"
            />
          )}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <a
              href="/schedule-tour"
              className="inline-flex items-center justify-center bg-accent text-text font-semibold px-8 py-4 rounded-xl text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Schedule a Tour
            </a>
            <a
              href="/request-pricing"
              className="inline-flex items-center justify-center border-2 border-text/20 text-text hover:bg-surface font-medium px-8 py-4 rounded-xl text-base transition-all"
            >
              Request Pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
