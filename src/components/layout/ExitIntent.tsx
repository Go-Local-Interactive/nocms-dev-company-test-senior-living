"use client";

import { useEffect, useRef, useState } from "react";
import { X, Phone } from "lucide-react";
import { skinConfig } from "@/lib/skin";

const ARM_DELAY_MS = 15_000;
const MOBILE_FALLBACK_MS = 40_000;

function telHref(phone: string | undefined): string {
  return `tel:${(phone ?? "").replace(/[^0-9+]/g, "")}`;
}

export function ExitIntent() {
  const [open, setOpen] = useState(false);
  const hasShownRef = useRef(false);
  const armedRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const armTimer = window.setTimeout(() => {
      armedRef.current = true;
    }, ARM_DELAY_MS);

    const show = () => {
      if (hasShownRef.current || !armedRef.current) return;
      hasShownRef.current = true;
      setOpen(true);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("keydown", handleKey);

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    let mobileTimer: number | undefined;
    if (isTouch) {
      mobileTimer = window.setTimeout(show, MOBILE_FALLBACK_MS);
    }

    return () => {
      window.clearTimeout(armTimer);
      if (mobileTimer !== undefined) window.clearTimeout(mobileTimer);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (!open) return null;

  const { contactPhone } = skinConfig;

  return (
    <div data-nocms-component="exit-intent" className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-text/60 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-heading"
        className="relative w-full max-w-md rounded-xl bg-background p-8 shadow-2xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-text hover:bg-text/10 transition-colors"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <h2
          id="exit-intent-heading"
          className="font-heading text-2xl font-bold text-text text-center"
        >
          Wait! Schedule a tour?
        </h2>
        <p className="mt-2 text-center text-sm text-muted leading-relaxed">
          Take a look at our community before you go. We&apos;ll show you what makes life here special.
        </p>

        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = "/schedule-tour";
          }}
        >
          <label className="sr-only" htmlFor="exit-intent-name">Name</label>
          <input
            id="exit-intent-name"
            type="text"
            placeholder="Your name"
            className="rounded-md border-2 border-text/15 bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
          />
          <label className="sr-only" htmlFor="exit-intent-email">Email</label>
          <input
            id="exit-intent-email"
            type="email"
            required
            placeholder="Your email address"
            className="rounded-md border-2 border-text/15 bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="rounded-md bg-secondary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary-dark transition-colors"
          >
            Schedule My Tour
          </button>
        </form>

        {contactPhone && (
          <a
            href={telHref(contactPhone)}
            className="mt-5 flex items-center justify-center gap-2 border-t border-text/10 pt-4 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Or call us: {contactPhone}
          </a>
        )}
      </div>
    </div>
  );
}
