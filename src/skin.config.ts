export interface SkinConfig {
  brandName: string;
  tagline: string;
  /** Hero layout variant. Senior-living variants borrow storage's vocabulary. */
  heroVariant: "video" | "search" | "image" | "simple";
  /** Default community slug — used to deep-link tour / pricing CTAs. */
  primaryCommunitySlug?: string;
  contactPhone?: string;
  contactEmail?: string;
  primaryAddress?: {
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
}

const skinConfig: SkinConfig = {
  brandName: "Senior Living Community",
  tagline: "Where every day feels like home.",
  heroVariant: "image",
  primaryCommunitySlug: "main-community",
  contactPhone: "(555) 000-0000",
  contactEmail: "info@example.com",
  primaryAddress: {
    line1: "100 Main Street",
    city: "Anytown",
    state: "TN",
    zip: "37000",
  },
};

export default skinConfig;
