import * as React from "react";
import type { BlockProps } from "./types";
import { mediaArrayUrls } from "@/lib/payload";

/** GalleryBlock — senior-living gallery layout. The first image is a featured
 *  tile (spans 2 cols × 2 rows on lg+) so the section reads as a curated
 *  scene rather than a uniform contact-sheet. Remaining images fill single
 *  cells in the same 4-col grid. Mobile collapses to a simple 2-col stack so
 *  the featured emphasis is desktop/tablet-only.
 *
 *  Mirrors the `.gallery-masonry` pattern from
 *  amber-hollow/pages/photo-video-gallery.html — without the lightbox /
 *  category-filter UI that block authoring doesn't need yet. */
export function GalleryBlock({ title, mediaArray }: BlockProps) {
  const images = mediaArrayUrls(mediaArray);
  if (images.length === 0) return null;

  return (
    <section data-nocms-component="gallery" className="bg-background py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2
            data-payload-subfield="title"
            className="font-heading text-3xl sm:text-4xl font-semibold text-text text-center mb-10" data-role="heading"
          >
            {title}
          </h2>
        )}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px] gap-4"
          data-payload-subfield="mediaArray"
          data-array-prop="mediaArray"
        >
          {images.map((m, i) => (
            <div
              key={i}
              data-array-index={i}
              className={
                "relative overflow-hidden rounded-2xl shadow-sm " +
                (i === 0 ? "col-span-2 row-span-2" : "")
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.url}
                alt={m.alt}
                loading={i === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
                data-payload-subfield={`mediaArray.${i}`} data-role="media"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
