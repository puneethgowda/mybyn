import { Constants } from "@/supabase/database.types";

// Application status enum
export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

// Collab status enum
export const COLLAB_STATUS = {
  ACTIVE: "ACTIVE",
  CLOSED: "CLOSED",
  DRAFT: "DRAFT",
} as const;

// Collab type enum with display names
export const COLLAB_TYPE: Record<
  (typeof Constants.public.Enums.collab_type)[number],
  string
> = {
  PAID: "Paid",
  BARTER: "Barter",
  PRODUCT_CASH: "Product + Cash",
};

// Platform type enum
export const PLATFORM_TYPE = {
  INSTAGRAM: "INSTAGRAM",
  FACEBOOK: "FACEBOOK",
  YOUTUBE: "YOUTUBE",
  TIKTOK: "TIKTOK",
} as const;

// Platform action enum
export const PLATFORM_ACTION = {
  STORY: "STORY",
  POST: "POST",
  REEL: "REEL",
  VIDEO: "VIDEO",
} as const;

// Business type enum with display names
export const BUSINESS_TYPE: Record<
  (typeof Constants.public.Enums.business_type)[number],
  string
> = {
  Retail: "Retail",
  "E-commerce": "E-commerce",
  Service: "Service",
  "Food & Beverage": "Food & Beverage",
  Technology: "Technology",
  Fashion: "Fashion",
  Beauty: "Beauty",
  "Health & Wellness": "Health & Wellness",
  Travel: "Travel",
  Entertainment: "Entertainment",
  Education: "Education",
};

// Languages enum with display names
export const LANGUAGES: Record<
  (typeof Constants.public.Enums.languages)[number],
  string
> = {
  Kannada: "Kannada",
  English: "English",
  Hindi: "Hindi",
  Telugu: "Telugu",
  Tamil: "Tamil",
  Malayalam: "Malayalam",
  Bengali: "Bengali",
  Marathi: "Marathi",
  Gujarati: "Gujarati",
  Punjabi: "Punjabi",
};
