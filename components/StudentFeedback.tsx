"use client";

// The "Selected Comments on Teaching" section of the Teaching page (students and business
// partners; colleague quotes were taken off, Felipe 2026-10-25): comment cards under a bar with
// Filter, Shuffle and Search. Type and theme began as a "By type / By theme" switch (Felipe
// 2026-10-25, merging layout A with G, without the number tiles) and are now two rows of the Filter
// (see below). Also Felipe 2026-10-25: "I don't like popups"; "make the cards clickable [...] but
// not the 'read all of it'. it's just clickable"; "when I click any part of the card it should
// open. and when I open one, the other closes"; the handwritten card "should have the same size as
// the other cards, always"; and, of five card styles, "I like quote mark best". So the cards sit in
// an even grid, each opens with a large coral quotation mark, every closed card in a row is the
// same size, a click anywhere on a card opens it in place and closes the one that was open, and
// after 24 cards one "Show more" adds the next 24. The earlier layouts and the five card styles are
// kept in the private cv repo (teaching-feedback/site-design-archive/), beside the generator of
// lib/student-feedback-data.ts. Every control is the site's FilterRow or a Fluid or shadcn part.
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { FluidProvider } from "@/lib/fluid-provider";
import { spring } from "@/lib/springs";
import { FilterButton, FilterRow } from "@/components/FilterRow";
import { FilterSearch } from "@/components/FilterSearch";
import { CardGroup, Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenLine, Shuffle, SlidersHorizontal, X } from "lucide-react";
import { Badge, type BadgeColor } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { feedback, KIND_LABEL, THEME_LABEL, THEME_SHORT, type FeedbackItem, type FeedbackKind, type Theme } from "@/lib/student-feedback";

const TYPES: { key: string; label: string; short: string; kinds: FeedbackKind[] }[] = [
  { key: "evaluation", label: "Official course evaluations", short: "Evaluations", kinds: ["evaluation"] },
  { key: "surveys", label: "Course surveys", short: "Surveys", kinds: ["survey", "midsurvey"] },
  { key: "email", label: "Emails", short: "Emails", kinds: ["email"] },
  { key: "notes", label: "Cards and notes", short: "Notes", kinds: ["card", "note"] },
  { key: "partners", label: "Business partners", short: "Partners", kinds: ["partner"] },
];

const THEMES = Object.keys(THEME_LABEL) as Theme[];

const THEME_COLOR: Record<Theme, BadgeColor> = {
  care: "orange",
  projects: "emerald",
  communication: "blue",
  clear: "teal",
  career: "violet",
  ai: "amber",
  fair: "rose",
  feedback: "indigo",
  general: "gray",
};

/** cards shown first, and how many each "Show more" adds */
const PAGE = 24;

// An opened card grows across the whole grid in a row of its own and the cards around it slide to
// their new places (Felipe 2026-10-25: opening a long comment stretched every card in its row; "it
// should MOTION/MORPH"). The morph is motion's layout animation on the house spring; the card body
// animates position only, which keeps the text from stretching while the card changes size.
const MotionCard = motion.create(Card);
const MotionContent = motion.create(CardContent);
const MORPH = { layout: { type: spring.slow.type, duration: spring.slow.duration, bounce: spring.slow.bounce } };

// The shuffle (Felipe 2026-10-25: "the shuffling motion could be better ... just do it", then
// "seeing the card content moving from one to another is weird. the semi dim/blur is good"): no
// card slides anywhere. Every card dims ("out"), the cards are swapped while dimmed, and the new
// cards brighten one after another, 8 ms apart ("in"); then "it should be faster", so the whole
// shuffle takes about half a second. The grid is remounted
// for the swap so motion has nothing to slide; the dim is CSS (fb-out, fb-in), which keeps
// motion off opacity and leaves the lift-and-dim of an open card working.
const OUT_MS = 120;
const IN_MS = 420;
type Phase = "out" | "in" | null;

/** The course by its name, never its code (Felipe 2026-10-25: "instead of MKTG4333, maybe
 *  'Marketing Research'. put the course name"), without the "(online)" note. */
const courseName = (it: FeedbackItem) => it.course?.replace(/\s*\(online\)$/, "") ?? it.courseCode;

/** The university in full, after the course (Felipe 2026-10-25: "Student, Marketing Research
 *  (OkState) and Student, Marketing Management (UF)", then "the university name should be in
 *  full"); read from the course code, MKTG at Oklahoma State and MAR at Florida. */
const school = (it: FeedbackItem) =>
  it.school ?? (it.courseCode?.startsWith("MAR ") ? "University of Florida"
    : it.courseCode?.startsWith("MKTG ") ? "Oklahoma State University" : undefined);


/** A fixed shuffle for one seed, so the order holds still until the next click on Shuffle. */
function shuffled<T>(list: T[], seed: number): T[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// The inline search (Felipe 2026-10-25: "a 'search' ... so we can find stuff and search among the
// cards ... even filtering by course, university, etc."). It reads only what a closed card shows,
// the comment and its three footer lines, never the note that appears once a card is open (Felipe:
// "I searched for Felipe and some stuff showed up despite not having the keyword"). So "florida"
// finds the UF comments, "marketing research" the course, "2021" the year. Every word typed must be
// on the card; case and accents are ignored. Each word found is marked where it shows.
const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const searchWords = (q: string) => fold(q).split(/\s+/).filter(Boolean);
/** the three footer lines, exactly as the card prints them */
const footerLines = (it: FeedbackItem) => [
  [it.who, courseName(it)].filter(Boolean).join(", "),
  school(it) ?? "",
  [KIND_LABEL[it.kind], it.date ?? it.term].filter(Boolean).join(", "),
];
const haystackOf = (it: FeedbackItem) => fold([it.text, ...footerLines(it)].join(" \n "));
const HAYSTACK = new Map(feedback.map((it) => [it.id, haystackOf(it)]));

// The Filter (Felipe 2026-10-25: "dont we need a filter?", then of By type and By theme "they are
// FILTERS. right?" and "Type doesn't matter, but theme does?"): every way to narrow the cards is one
// row of one panel, opened by the Filter button. Theme comes first, then university, course and
// year, and type last. Each choice shows its count, taken with the other rows and the search
// applied, so a count is what a click on it will show, and a choice whose count is zero is hidden
// (Felipe: "filter has to hide stuff with zero ... it only appears when it's nonzero"); the chosen
// one always shows, so it can be switched off. With the panel closed, what is chosen shows as chips
// under the bar, and a click on a chip removes it.
type Facet = "theme" | "school" | "course" | "year" | "type";
const yearOf = (it: FeedbackItem) => (it.date ?? it.term ?? "").match(/\d{4}/)?.[0];
const typeOf = (it: FeedbackItem) => TYPES.find((t) => t.kinds.includes(it.kind))?.key;
const one = (v: string | undefined) => (v ? [v] : []);
/** a card's values in one row: several themes, and one value in every other row */
const VALUES_OF: Record<Facet, (it: FeedbackItem) => string[]> = {
  theme: (it) => it.themes,
  school: (it) => one(school(it)),
  course: (it) => one(courseName(it)),
  year: (it) => one(yearOf(it)),
  type: (it) => one(typeOf(it)),
};
/** the values a row offers, the most common first (years newest first) */
const byCount = (f: Facet) => {
  const seen = new Map<string, number>();
  for (const it of feedback) for (const v of VALUES_OF[f](it)) seen.set(v, (seen.get(v) ?? 0) + 1);
  return [...seen.keys()].sort(f === "year" ? (a, b) => b.localeCompare(a) : (a, b) => seen.get(b)! - seen.get(a)!);
};
type Choice = { key: string; label: string; short?: string };
const asIs = (v: string): Choice => ({ key: v, label: v });
const FACETS: { key: Facet; label: string; choices: Choice[] }[] = [
  { key: "theme", label: "Theme", choices: THEMES.map((t) => ({ key: t, label: THEME_LABEL[t], short: THEME_SHORT[t] })) },
  { key: "school", label: "University", choices: byCount("school").map(asIs) },
  { key: "course", label: "Course", choices: byCount("course").map(asIs) },
  { key: "year", label: "Year", choices: byCount("year").map(asIs) },
  { key: "type", label: "Type", choices: TYPES.map(({ key, label, short }) => ({ key, label, short })) },
];
type Picks = Record<Facet, string>;
const NO_PICKS: Picks = { theme: "all", school: "all", course: "all", year: "all", type: "all" };
const passes = (it: FeedbackItem, picks: Picks, skip?: Facet) =>
  FACETS.every(({ key }) => key === skip || picks[key] === "all" || VALUES_OF[key](it).includes(picks[key]));
const choiceLabel = (f: (typeof FACETS)[number], key: string) => f.choices.find((c) => c.key === key)?.label ?? key;

/** The quote with the searched words marked; the text itself is never changed. */
function Marked({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const folded = fold(text);
  const hits: [number, number][] = [];
  for (const w of words) {
    // marks start at a word's beginning and skip short words such as "of", so "professor" is not
    // marked for "of"; the search itself still matches any part of a word
    if (w.length < 3) continue;
    for (let i = folded.indexOf(w); i !== -1; i = folded.indexOf(w, i + w.length)) {
      if (i === 0 || !/[a-z0-9]/.test(folded[i - 1])) hits.push([i, i + w.length]);
    }
  }
  if (!hits.length) return <>{text}</>;
  hits.sort((a, b) => a[0] - b[0]);
  const out: React.ReactNode[] = [];
  let at = 0;
  for (const [a, b] of hits) {
    if (a < at) continue;
    if (a > at) out.push(text.slice(at, a));
    out.push(<mark key={a} className="fb-hit">{text.slice(a, b)}</mark>);
    at = b;
  }
  out.push(text.slice(at));
  return <>{out}</>;
}

/** Three short lines, like the signature under a letter, with no parentheses (Felipe 2026-10-25:
 *  "but it should be in parentheses, etc? there's no better alternative?"): who and the course,
 *  then the university, then where the comment came from and when, for example "Student, Marketing
 *  Research" / "Oklahoma State University" / "Official course evaluations, Spring 2025". The
 *  handwritten card shows its photo beside them, so it reads as a card even while closed. */
function Footer({ it, open, words }: { it: FeedbackItem; open: boolean; words: string[] }) {
  const [who, uni, where] = footerLines(it);
  return (
    <div className="fb-by">
      {/* once open, the full photo is in the card, so the small one would repeat it */}
      {it.image && !open && (
        <Avatar className="fb-photo-avatar">
          <AvatarImage className="fb-avatar-photo" src={it.image.src} alt="" />
          <AvatarFallback><PenLine className="size-4" aria-hidden="true" /></AvatarFallback>
        </Avatar>
      )}
      <div>
        <p className="fb-by-who"><Marked text={who} words={words} /></p>
        {uni && <p className="fb-by-meta"><Marked text={uni} words={words} /></p>}
        <p className="fb-by-meta"><Marked text={where} words={words} /></p>
      </div>
    </div>
  );
}

function FeedbackCard({ it, themes, open, onToggle, index, words }: {
  it: FeedbackItem; themes: boolean; open: boolean; onToggle: () => void; index: number; words: string[];
}) {
  // Every card opens, even a short one (Felipe 2026-10-25: "every card even if small should be
  // openable"): the open card lifts and the rest dim, so opening one is a way to single it out.

  // The footer sits in the card body, never a CardFooter: the footer rises above the card's
  // click layer (it is meant for buttons), so a click on it never reached the card.
  const quoteBlock = (
    <>
      {/* while a search is on, the whole comment shows, so the word that matched is always in sight */}
      <blockquote className={`fb-quote${open || words.length ? "" : " fb-clamp"}`}><Marked text={it.text} words={words} /></blockquote>
      {it.context && open && <p className="fb-context">{it.context}</p>}
    </>
  );
  return (
    <MotionCard
      layout
      transition={MORPH}
      style={{ "--i": Math.min(index, 30) } as React.CSSProperties}
      id={`fb-${it.id}`}
      onClick={onToggle}
      label={open ? "Close this comment" : "Open the whole comment"}
      className={open ? "fb-click fb-open" : "fb-click"}
    >
      <MotionContent layout="position" transition={MORPH} className="fb-body">
        <div className="fb-mark-row">
          <span className="fb-mark" aria-hidden="true">{"“"}</span>
          {/* while a theme is chosen, the card says which themes it belongs to */}
          {themes && (
            <div className="fb-theme-row">
              {it.themes.map((t) => <Badge key={t} variant="dot" color={THEME_COLOR[t]} size="compact">{THEME_LABEL[t]}</Badge>)}
            </div>
          )}
        </div>
        {it.image && open ? (
          // the opened handwritten card: the photo on the left, the transcription beside it
          <div className="fb-open-split">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="fb-card-photo" src={it.image.src} alt={it.image.alt} width={it.image.width} height={it.image.height} />
            <div>{quoteBlock}</div>
          </div>
        ) : quoteBlock}
        <Footer it={it} open={open} words={words} />
      </MotionContent>
    </MotionCard>
  );
}

/** three columns on a wide screen, two on a tablet, one on a phone */
function useColumnCount() {
  const [n, setN] = useState(3);
  useEffect(() => {
    const two = window.matchMedia("(max-width: 1023px)");
    const one = window.matchMedia("(max-width: 720px)");
    const set = () => setN(one.matches ? 1 : two.matches ? 2 : 3);
    set();
    two.addEventListener("change", set);
    one.addEventListener("change", set);
    return () => { two.removeEventListener("change", set); one.removeEventListener("change", set); };
  }, []);
  return n;
}

export function StudentFeedback() {
  const [shown, setShown] = useState(PAGE);
  // one card open at a time (Felipe: "when I open one, the other closes")
  const [openId, setOpenId] = useState<string | null>(null);
  // 0 = the curated order (the best first); any other value is a shuffle (Felipe 2026-10-25: a
  // "Shuffle" button in the bar)
  const [seed, setSeed] = useState(0);
  const [phase, setPhase] = useState<Phase>(null);
  const [query, setQuery] = useState("");
  const words = useMemo(() => searchWords(query), [query]);
  // the comments the search leaves; the Filter's counts are counted over these
  const [picks, setPicks] = useState<Picks>(NO_PICKS);
  const [filterOpen, setFilterOpen] = useState(false);
  const searched = useMemo(
    () => (words.length ? feedback.filter((it) => words.every((w) => HAYSTACK.get(it.id)!.includes(w))) : feedback),
    [words],
  );
  const base = useMemo(() => searched.filter((it) => passes(it, picks)), [searched, picks]);
  const picked = FACETS.filter(({ key }) => picks[key] !== "all").length;
  const pickFacet = (f: Facet) => (v: string) => { setPicks((p) => ({ ...p, [f]: v })); setShown(PAGE); setOpenId(null); };
  const clearPicks = () => { setPicks(NO_PICKS); setShown(PAGE); setOpenId(null); };
  const search = (q: string) => { setQuery(q); setShown(PAGE); setOpenId(null); };
  const n = useColumnCount();

  // A click anywhere outside the open card, or the Escape key, closes it and the cards return to
  // their places (Felipe 2026-10-25). A click on another card closes this one and opens that one.
  // Only a click that lands on no card at all closes the open one. A click on another card is that
  // card's own click, which switches straight to it; closing on the press instead let the grid
  // reflow under the pointer, so the release landed elsewhere and the switch was lost (Felipe
  // 2026-10-25: "if I click another card, it should open this other card").
  useEffect(() => {
    if (!openId) return;
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.(".fb-grid > *")) setOpenId(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenId(null); };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); };
  }, [openId]);

  const items = base;
  const shown_items = useMemo(() => (seed ? shuffled(items, seed) : items), [items, seed]);
  const timers = useRef<number[]>([]);
  const shuffle = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setOpenId(null);
    setPhase("out");
    timers.current = [
      window.setTimeout(() => { setSeed(Math.floor(Math.random() * 2 ** 31) + 1); setPhase("in"); }, OUT_MS),
      window.setTimeout(() => setPhase(null), OUT_MS + IN_MS),
    ];
  };

  // The card that just opened, so the effect below can bring it to the main part of the screen.
  const landing = useRef<string | null>(null);
  const toggle = (id: string) => {
    // a click on the open card closes it; a click on any other card opens that one in its place
    const opening = openId !== id;
    setOpenId(opening ? id : null);
    landing.current = opening ? id : null;
  };

  // Felipe 2026-10-25: "whatever I click, it should be at the 'main' part of the screen", then "when
  // you click some stuff it might go to almost the top". Right after the click the grid already
  // holds its new layout (the morph only plays it with transforms), so the card's offsetTop is
  // where it will land. The page glides there while the card grows, and the card's top comes to
  // rest just under the sticky filter row, where a Publications entry lands.
  useEffect(() => {
    const id = landing.current;
    landing.current = null;
    if (!id) return;
    const el = document.getElementById(`fb-${id}`);
    const grid = el?.offsetParent as HTMLElement | null;
    if (!el || !grid) return;
    const top = grid.getBoundingClientRect().top + window.scrollY + el.offsetTop;
    const bar = document.querySelector<HTMLElement>(".pub-filter:not(.pub-filter-static)");
    const head = 64 + (bar ? bar.offsetHeight : 0) + 12;
    const y = top - head;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, y), behavior: reduced ? "auto" : "smooth" });
  }, [openId]);

  return (
    <FluidProvider>
      <div className="student-feedback">
        <div className="fb-controls">
          <div className="fb-sort-row">
            <FilterButton onClick={() => setFilterOpen((o) => !o)} pressed={filterOpen} ariaLabel="Filter the comments by theme, university, course, year or type">
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              Filter{picked ? <span className="pub-filter-n">{picked}</span> : null}
            </FilterButton>
            <FilterButton onClick={shuffle} ariaLabel="Shuffle the comments">
              <Shuffle className="size-3.5" aria-hidden="true" />
              Shuffle
            </FilterButton>
            <FilterSearch value={query} onChange={search} placeholder="A word, a course, a university, a year" />
          </div>
          {filterOpen && (
            <div className="fb-filters">
              {FACETS.map(({ key, label, choices }) => {
                const pool = searched.filter((it) => passes(it, picks, key));
                return (
                  <div key={key} className="fb-filter-group">
                    <span className="fb-filter-label">{label}</span>
                    <FilterRow<string> wrap ariaLabel={`Filter by ${label.toLowerCase()}`} value={picks[key]} onPick={pickFacet(key)}
                      items={[{ key: "all", label: "All", n: pool.length },
                        ...choices.map((c) => ({ ...c, n: pool.filter((it) => VALUES_OF[key](it).includes(c.key)).length }))
                          .filter((c) => c.n > 0 || c.key === picks[key])]} />
                  </div>
                );
              })}
              {picked > 0 && (
                <div className="fb-filter-clear">
                  <Button variant="ghost" size="compact" onClick={clearPicks}>Clear the filters</Button>
                </div>
              )}
            </div>
          )}
          {/* the chosen filters, while the panel is closed: a click on one removes it */}
          {!filterOpen && picked > 0 && (
            <div className="fb-chips" role="group" aria-label="Chosen filters">
              {FACETS.filter(({ key }) => picks[key] !== "all").map((f) => {
                const label = choiceLabel(f, picks[f.key]);
                return (
                  <Button key={f.key} variant="secondary" size="compact" trailingIcon={X} aria-label={`Remove the filter ${label}`}
                    onClick={() => pickFacet(f.key)("all")}>{label}</Button>
                );
              })}
              {picked > 1 && <Button variant="ghost" size="compact" onClick={clearPicks}>Clear all</Button>}
              <span className="fb-chips-n">{items.length} of {feedback.length} comments</span>
            </div>
          )}
        </div>
        {/* the handwritten card is ranked first, so it opens the grid at the normal size */}
        <CardGroup key={`${FACETS.map(({ key }) => picks[key]).join("|")}-${n}-${seed}`} columns={n} separated border="outlined" fluidHover={false}
          className={phase ? `fb-grid fb-${phase}` : "fb-grid"}
          data-open={openId ? "" : undefined}>
          {shown_items.slice(0, shown).map((it, i) => (
            <FeedbackCard key={it.id} it={it} themes={picks.theme !== "all"} open={openId === it.id} onToggle={() => toggle(it.id)} index={i} words={words} />
          ))}
        </CardGroup>
        {items.length === 0 && (
          <p className="fb-empty">
            {query ? <>No comment matches &ldquo;{query}&rdquo;{picked ? " with these filters" : ""}.</> : "No comment matches these filters."}
          </p>
        )}
        {shown < items.length && (
          <div className="fb-more">
            <Button variant="tertiary" size="compact" onClick={() => setShown((s) => s + PAGE)}>Show more</Button>
          </div>
        )}
      </div>
    </FluidProvider>
  );
}
