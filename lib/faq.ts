/** FAQ entry keys — shared by the accordion UI and the FAQPage JSON-LD. */
export const faqKeys = [
  "what",
  "which",
  "natural",
  "howTake",
  "howOrder",
] as const;

export type FaqKey = (typeof faqKeys)[number];
