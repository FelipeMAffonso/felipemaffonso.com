/* ============================================================
   Filter options review: the filter state and how the three
   filters (type, journal or venue, year) depend on one another.
   Every count is faceted: a count shows how many entries would be
   listed if that option were picked, given the other filters.
   ============================================================ */

import { ITEMS, JOURNAL_ORDER, KINDS, VENUE_GROUPS, type Item, type Kind } from "./data";

export type Place = "left" | "right" | "below";
/** journals: the list holds journals only; venues: every venue, grouped by type */
export type Layer = "journals" | "venues";
/** stop: Forthcoming is the slider's last stop; year: counted in its expected year; toggle: a checkbox */
export type Forth = "stop" | "year" | "toggle";
/** all: every journal at once; more: six, then "Show 4 more journals"; scroll: six rows, the rest scroll */
export type ListLen = "all" | "more" | "scroll";
/** the icon pair on the Journal and Year buttons */
export type Icons = "none" | "book" | "library" | "news";
/** row: today's type buttons; icons: Fluid Tabs with an icon on each type; active: Fluid Tabs where
 *  only the chosen type shows its name; menu: a third button, Type, beside Journal and Year */
export type Types = "row" | "icons" | "active" | "menu";
export type Settings = { place: Place; layer: Layer; forth: Forth; list: ListLen; icons: Icons; types: Types };
/** how many journals a short list shows (Felipe 2026-11-14: "keep it at 5-6 journals") */
export const SHORT = 6;

export type TypeKey = "all" | Kind;
export type FilterState = { kind: TypeKey; venues: string[]; lo: number; hi: number; incF: boolean };

const FIRST = 2019;
const LAST_YEAR = 2026;

/** the slider's stops for a forthcoming rule */
export function stops(forth: Forth): (number | "F")[] {
  const years: (number | "F")[] = [];
  const last = forth === "year" ? Math.max(LAST_YEAR, ...ITEMS.map((i) => i.expected)) : LAST_YEAR;
  for (let y = FIRST; y <= last; y++) years.push(y);
  if (forth === "stop") years.push("F");
  return years;
}

export const stopLabel = (s: number | "F") => (s === "F" ? "Forthcoming" : String(s));

/* Where each stop sits on the slider. Forthcoming is not a year, so it sits three
   units past the last year: the wider gap and a dashed stretch of track set it apart,
   and its label has room beside the last year's. */
export function stopPositions(forth: Forth): number[] {
  const S = stops(forth);
  const lastYear = S.filter((x): x is number => x !== "F").pop() ?? LAST_YEAR;
  return S.map((x) => (x === "F" ? lastYear + 3 : x));
}

/** A click on a year (its label, or the track) moves the closer handle there. Outside the range
 *  that is the handle on that side; inside it, the nearer one, and the left one on a tie. With both
 *  handles on one stop, the click's side decides. Returns the new [lo, hi]. */
export function moveCloser(pos: number[], lo: number, hi: number, i: number): [number, number] {
  if (i < lo) return [i, hi];
  if (i > hi) return [lo, i];
  if (lo === hi) return [lo, hi];
  return Math.abs(pos[i] - pos[lo]) <= Math.abs(pos[hi] - pos[i]) ? [i, hi] : [lo, i];
}

/** The Year button's label once a year range is chosen: the range as the slider shows it, trimmed to
 *  the years that match the type and journals, in plain words ("2021 to 2023", or "2023"). No "Since"
 *  or "Until" (Felipe 2026-11-14: a journal choice reading "Until 2023" "reads very weird"). */
export function yearButtonText(st: FilterState, forth: Forth): string {
  const S = stops(forth);
  const [d0, d1] = yearDomain(st, forth);
  const lo = Math.min(Math.max(st.lo, d0), d1), hi = Math.min(Math.max(st.hi, d0), d1);
  return lo === hi ? stopLabel(S[lo]) : `${stopLabel(S[lo])} to ${stopLabel(S[hi])}`;
}
/** The stop nearest a slider value. A pure function of the value: during a drag the slider reports
 *  the values inside the gap before Forthcoming (2027, 2028), and each must always land on the same
 *  stop, or the handle flips between 2026 and Forthcoming on every move (Felipe 2026-11-14:
 *  "it stutters and gets bugged"). A tie goes to the earlier stop. */
export function nearestStop(pos: number[], v: number): number {
  let best = 0;
  for (let i = 1; i < pos.length; i++) if (Math.abs(pos[i] - v) < Math.abs(pos[best] - v)) best = i;
  return best;
}

export function initialState(forth: Forth): FilterState {
  return { kind: "all", venues: [], lo: 0, hi: stops(forth).length - 1, incF: true };
}

function yearOk(i: Item, st: FilterState, forth: Forth): boolean {
  const S = stops(forth);
  if (forth === "toggle" && i.year === "F") return st.incF;
  const at = forth === "year" ? S.indexOf(i.expected) : S.indexOf(i.year);
  return at >= st.lo && at <= st.hi;
}
const kindOk = (i: Item, st: FilterState) => st.kind === "all" || i.kind === st.kind;
const venueOk = (i: Item, st: FilterState) => st.venues.length === 0 || st.venues.includes(i.venue);

export function shown(st: FilterState, forth: Forth): Item[] {
  return ITEMS.filter((i) => kindOk(i, st) && venueOk(i, st) && yearOk(i, st, forth));
}

/** the type buttons' counts: venue and year applied, type left out */
export function typeCounts(st: FilterState, forth: Forth): Record<TypeKey, number> {
  const base = ITEMS.filter((i) => venueOk(i, st) && yearOk(i, st, forth));
  const out = { all: base.length } as Record<TypeKey, number>;
  for (const k of KINDS) out[k.key] = base.filter((i) => i.kind === k.key).length;
  return out;
}

/** the venue groups the list shows, with each venue's count */
export function venueRows(st: FilterState, s: Settings) {
  const groups = s.layer === "journals"
    ? VENUE_GROUPS.filter((g) => g.kind === "journal")
    : VENUE_GROUPS.filter((g) => ITEMS.some((i) => i.kind === g.kind) && (st.kind === "all" || g.kind === st.kind));
  return groups.map((g) => ({
    kind: g.kind,
    title: g.title,
    rows: g.venues
      .filter((v) => ITEMS.some((i) => i.venue === v))
      .map((v) => ({
        venue: v,
        // under "journals only", checking a journal switches the type to journals, so the type is left out of its count
        n: ITEMS.filter((i) => i.venue === v && (s.layer === "journals" || kindOk(i, st)) && yearOk(i, st, s.forth)).length,
      })),
  }));
}

/** entries per slider stop, with type and venue applied (drawn as the small bars over the slider) */
export function yearCounts(st: FilterState, forth: Forth): number[] {
  const S = stops(forth);
  const base = ITEMS.filter((i) => kindOk(i, st) && venueOk(i, st));
  return S.map((s) => base.filter((i) => (forth === "year" ? i.expected === s : i.year === s)).length);
}
/** The first and last stops that hold an entry under the chosen type and journals (the year filter
 *  left out): the slider's axis runs between them (Felipe 2026-11-14: "the slider always goes along
 *  with the oldest + most recent or forthcoming paper"). With nothing chosen it is the whole axis. */
export function yearDomain(st: FilterState, forth: Forth): [number, number] {
  const c = yearCounts(st, forth);
  const end = c.length - 1;
  const first = c.findIndex((n) => n > 0);
  if (first < 0) return [0, end];
  let last = end;
  while (c[last] === 0) last--;
  /* the axis also holds any year limit the visitor set, so the handles always show the real choice,
     even when no entry of the chosen type and journals falls in those years (the list then says so) */
  return [st.lo > 0 ? Math.min(first, st.lo) : first, st.hi < end ? Math.max(last, st.hi) : last];
}
export function forthcomingCount(st: FilterState): number {
  return ITEMS.filter((i) => kindOk(i, st) && venueOk(i, st) && i.year === "F").length;
}

/* ---- the moves, and the rules that connect the filters ---- */

/** A type button is a filter like the other two: it never clears the journals or the years. All keeps
 *  them (with JCP chosen, All lists its two papers), and Preprints with a journal chosen lists nothing,
 *  which the page says in words (Felipe 2026-11-14: "ALL is different from CLEAR ... if I click
 *  preprints it should show that there are no publications that fit this criteria"). Only Clear
 *  resets everything. */
export function pickType(st: FilterState, k: TypeKey, _s: Settings): FilterState {
  return { ...st, kind: k };
}

export function toggleVenue(st: FilterState, v: string, s: Settings): FilterState {
  const on = st.venues.includes(v);
  const venues = on ? st.venues.filter((x) => x !== v) : [...st.venues, v];
  // under "journals only", checking a journal moves the type to Journal publications
  const kind: TypeKey = s.layer === "journals" && !on ? "journal" : st.kind;
  // keep the list in the panel's order
  const order = [...JOURNAL_ORDER, ...VENUE_GROUPS.flatMap((g) => g.venues)];
  return { ...st, kind, venues: venues.sort((a, b) => order.indexOf(a) - order.indexOf(b)) };
}

export const yearActive = (st: FilterState, forth: Forth) =>
  st.lo > 0 || st.hi < stops(forth).length - 1 || (forth === "toggle" && !st.incF);

export function yearText(st: FilterState, forth: Forth): string {
  const S = stops(forth);
  const a = stopLabel(S[st.lo]), b = stopLabel(S[st.hi]);
  const range = st.lo === st.hi ? a : `${a} to ${b}`;
  return forth === "toggle" && !st.incF ? `${range}, no forthcoming` : range;
}

export const anyActive = (st: FilterState, forth: Forth) => st.venues.length > 0 || yearActive(st, forth);

/** what a venue is called in a short label */
export function venueShort(v: string): string {
  const ABBR: Record<string, string> = {
    "Trends in Cognitive Sciences": "TiCS",
    "Journal of Consumer Research": "JCR",
    "Journal of Marketing": "JM",
    "Journal of Marketing Research": "JMR",
    "Journal of Consumer Psychology": "JCP",
    "Research Policy": "Research Policy",
    "Journal of Experimental Psychology: General": "JEP: General",
    "Journal of Advertising": "Journal of Advertising",
    "European Journal of Marketing": "EJM",
    "Psychology & Marketing": "Psychology & Marketing",
  };
  return ABBR[v] ?? v;
}
