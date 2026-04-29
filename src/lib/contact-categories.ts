export const CONTACT_CATEGORIES = [
  "Entertainment",
  "Corporate",
  "FMCG",
  "Startup/Unicorn",
  "Healthcare",
  "Others",
] as const;

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];
