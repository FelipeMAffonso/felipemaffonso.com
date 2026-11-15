/* ============================================================
   The Publications filter's data (2026-11-14): the journal or venue and the year of every entry
   on the Publications page, read from the citations in lib/publications.tsx, and the order of the
   journal list. When a publication is added to lib/publications.tsx, add its venue and year to META
   below (the build stops with a message naming the entry until it is there), and a new journal also
   goes into JOURNAL_ORDER at its place by prestige. When a forthcoming paper gets its year, change
   "F" to the year.
   ============================================================ */

import { books, chapters, journals, preprints, type Pub } from "@/lib/publications";

export type Kind = "journal" | "preprint" | "book" | "chapter";
/** a year, or "F" for forthcoming */
export type Year = number | "F";
export type Item = { pub: Pub; kind: Kind; venue: string; year: Year; expected: number };

/* year: the year in the citation, "F" when the citation says forthcoming.
   expected: the year a forthcoming entry is counted in when Felipe picks
   "counted in a year" (accepted journal papers 2026; the two chapters say
   "forthcoming, 2027" in their citations). */
const META: Record<string, { venue: string; year: Year; expected?: number }> = {
  "human-ai-delegation": { venue: "Trends in Cognitive Sciences", year: "F", expected: 2026 },
  "point-vs-range": { venue: "Journal of Marketing Research", year: "F", expected: 2026 },
  "consumer-sickness-behavior": { venue: "Journal of Consumer Psychology", year: "F", expected: 2026 },
  "precise-predictions": { venue: "Journal of Experimental Psychology: General", year: "F", expected: 2026 },
  "cognitive-traps": { venue: "Journal of Consumer Research", year: 2026 },
  "concealing-prices": { venue: "Journal of Consumer Research", year: "F", expected: 2026 },
  "space-commons": { venue: "Research Policy", year: 2026 },
  "simple-eco-friendly": { venue: "Journal of Advertising", year: 2026 },
  "disease-cues": { venue: "European Journal of Marketing", year: 2025 },
  "marketing-by-design": { venue: "Journal of Marketing", year: 2023 },
  serendipity: { venue: "Journal of Marketing", year: 2021 },
  "constructive-choice": { venue: "Journal of Consumer Psychology", year: 2021 },
  "ad-skepticism": { venue: "Psychology & Marketing", year: 2019 },
  // preprints: the year each was posted (arXiv 2604 and 2601; PsyArXiv posted 2026-04-01 per OSF)
  "strategic-personalities": { venue: "arXiv", year: 2026 },
  "data-quality": { venue: "PsyArXiv", year: 2026 },
  "vertical-tacit-collusion": { venue: "arXiv", year: 2026 },
  "complexity-visual-design": { venue: "Advertising Theory", year: "F", expected: 2027 },
  "ai-assisted-shopping": { venue: "Consumer Psychology and AI", year: "F", expected: 2027 },
};

const tag = (kind: Kind, list: Pub[]): Item[] =>
  list.map((pub) => {
    const m = META[pub.id];
    if (!m) throw new Error(`Publications filter: no journal and year for "${pub.id}"; add it to META`);
    return { pub, kind, venue: m.venue, year: m.year, expected: m.year === "F" ? (m.expected ?? 2026) : m.year };
  });

/* the page's own order: journal publications, preprints, books, book chapters */
export const ITEMS: Item[] = [
  ...tag("journal", journals),
  ...tag("preprint", preprints),
  ...tag("book", books),
  ...tag("chapter", chapters),
];

/* short: the name a phone shows on the chosen type tab. Journal publications are "Articles" there: "Journal"
   read like the Journal filter beside it (Felipe 2026-11-15: "maybe Papers? Articles? or even
   Publications?"; Papers would also fit preprints, and Publications is the whole page) */
export const KINDS: { key: Kind; title: string; label: string; short: string }[] = (
  [
    { key: "journal", title: "Journal Publications", label: "Journal publications", short: "Articles" },
    { key: "preprint", title: "Preprints", label: "Preprints", short: "Preprints" },
    { key: "book", title: "Books", label: "Books", short: "Books" },
    { key: "chapter", title: "Book Chapters", label: "Book chapters", short: "Chapters" },
  ] as const
).filter((k) => ITEMS.some((i) => i.kind === k.key)) as { key: Kind; title: string; label: string; short: string }[];

/* The journal list, by prestige and impact factor as proposed on 2026-11-14
   (Felipe: "the order of journals in the filter by journal is prestige/impact
   factor"). Felipe confirms or reorders it on the review page. */
export const JOURNAL_ORDER = [
  "Trends in Cognitive Sciences",
  "Journal of Consumer Research",
  "Journal of Marketing",
  "Journal of Marketing Research",
  "Journal of Consumer Psychology",
  "Research Policy",
  "Journal of Experimental Psychology: General",
  "Journal of Advertising",
  "European Journal of Marketing",
  "Psychology & Marketing",
];

/* the other venues, for the "every venue, grouped" rule */
export const VENUE_GROUPS: { kind: Kind; title: string; venues: string[] }[] = [
  { kind: "journal", title: "Journals", venues: JOURNAL_ORDER },
  { kind: "preprint", title: "Preprint servers", venues: ["arXiv", "PsyArXiv"] },
  { kind: "chapter", title: "Books", venues: ["Advertising Theory", "Consumer Psychology and AI"] },
];

for (const i of ITEMS) {
  if (i.kind === "journal" && !JOURNAL_ORDER.includes(i.venue)) {
    throw new Error(`Publications filter: "${i.venue}" is missing from JOURNAL_ORDER`);
  }
}
