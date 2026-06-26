import { Phone } from "lucide-react";
import { skinConfig } from "@/lib/skin";

function telHref(phone: string | undefined): string {
  return `tel:${(phone ?? "").replace(/[^0-9+]/g, "")}`;
}

export function HelpBadge() {
  const { contactPhone } = skinConfig;
  if (!contactPhone) return null;

  return (
    <a
      href={telHref(contactPhone)}
      data-nocms-component="help-badge"
      aria-label={`Need help? Call ${contactPhone}`}
      className="group fixed bottom-6 right-6 z-[9999] inline-flex items-center gap-2.5 rounded-full bg-secondary px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-secondary/40 hover:bg-secondary-dark hover:-translate-y-0.5 hover:shadow-2xl transition-all sm:bottom-8 sm:right-8"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inset-[-4px] rounded-full border-2 border-white/40 animate-ping" aria-hidden="true" />
        <Phone className="relative h-5 w-5" aria-hidden="true" />
      </span>
      <span className="hidden sm:inline">Need Help?</span>
    </a>
  );
}
