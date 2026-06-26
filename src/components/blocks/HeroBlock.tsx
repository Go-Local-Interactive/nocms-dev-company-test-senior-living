import * as React from "react";
import type { BlockProps } from "./types";
import { mediaUrl, mediaAlt } from "@/lib/payload";
import { lexicalToText } from "./Lexical";
import skinConfig from "@/skin.config";

/** Hero — senior-living variants. heroVariant in skin.config picks the layout:
 *  - image: full-bleed bg image + overlay + CTAs (default for most communities)
 *  - video: bg video element + static image fallback; otherwise like image
 *  - search: image variant + inline community-search form below CTAs
 *  - simple: text-only on surface background (no bg image)
 *  Shared across all: title → h1, body → tagline, Schedule-a-Tour + tel CTAs. */
export function HeroBlock({ title, body, media }: BlockProps) {
  const subheading = lexicalToText(body) || undefined;
  const variant = skinConfig.heroVariant;
  const bg = mediaUrl(media);
  const phoneDisplay = skinConfig.contactPhone;
  const phoneTel = phoneDisplay?.replace(/[^\d+]/g, "") ?? "";
  const isSimple = variant === "simple";
  const showMedia = !isSimple && bg;
  const isVideo = (u?: string | null) => /\.(mp4|webm|ogg|mov)$/i.test(u || "");

  return (
    <section
      data-nocms-component="hero"
      className={`relative w-full overflow-hidden ${
        isSimple ? "min-h-[420px]" : "min-h-[600px]"
      }`}
    >
      {showMedia && variant === "video" && isVideo(bg) ? (
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src={bg} />
        </video>
      ) : showMedia ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          data-payload-subfield="media"
          src={bg}
          alt={mediaAlt(media)}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          loading="eager" data-role="media"
        />
      ) : null}
      {showMedia && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(135deg, rgba(84, 44, 27, 0.65) 0%, rgba(36, 28, 25, 0.7) 100%)",
          }}
        />
      )}
      <div
        className={`relative z-[2] flex h-full items-center justify-center text-center px-6 py-24 sm:px-10 lg:px-16 ${
          isSimple ? "bg-surface min-h-[420px]" : "min-h-[600px]"
        }`}
      >
        <div className="max-w-3xl w-full">
          {title && (
            <h1
              data-role="heading"
              data-payload-subfield="title"
              className={`font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 ${
                isSimple ? "text-text" : "text-white"
              }`}
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {title}
            </h1>
          )}
          {subheading && (
            <p
              data-role="subheading"
              data-payload-subfield="body"
              className={`font-body text-lg sm:text-xl font-light leading-relaxed mb-10 max-w-2xl mx-auto ${
                isSimple ? "text-muted" : "text-white/95"
              }`}
            >
              {subheading}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <a
              href="/schedule-tour"
              className="inline-flex items-center justify-center bg-accent text-text font-semibold px-8 py-4 rounded-xl text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all min-w-[240px]" data-role="cta"
            >
              Schedule a Tour
            </a>
            {phoneTel && (
              <a
                href={`tel:${phoneTel}`}
                className={`inline-flex items-center justify-center border-2 font-medium px-8 py-4 rounded-xl text-base transition-all min-w-[240px] ${
                  isSimple
                    ? "border-text/20 text-text hover:bg-white"
                    : "border-white/40 text-white hover:bg-white/10"
                }`}
              >
                {phoneDisplay}
              </a>
            )}
          </div>
          {variant === "search" && (
            <form
              action="/communities"
              method="get"
              className="mt-10 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto bg-white/95 rounded-lg p-2 shadow-2xl"
            >
              <label htmlFor="hero-search" className="sr-only" data-role="text">
                City or ZIP code
              </label>
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="City or ZIP code"
                className="flex-1 bg-transparent border-0 rounded-md px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-primary text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition" data-role="cta-2"
              >
                Find Community
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
