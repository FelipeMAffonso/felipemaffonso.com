"use client";

/* ============================================================
   Filter options review: the parts of the two-button filter, all
   from the site's installed libraries.
   - the type buttons: the site's shared FilterRow (Publications and Teaching)
   - Journal and Year: the same shell and classes as the Teaching page's Filter button
   - each button's list: Radix Popover around Fluid's Elevated surface; on a phone, Fluid Dialog
   - the journal rows: Fluid CheckboxGroup (a checkbox square on each row)
   - the years: Radix Slider (the primitive under shadcn's slider; Fluid's thick pill track was
     rejected on 2026-11-14), a label under every year, the range in the site's coral
   - Clear and Show: Fluid Button, as on the Teaching page
   A row's count is passed as data-n and printed at the row's right edge by filter-options.css,
   because Fluid's rows take a text label only.
   ============================================================ */

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Popover, Slider } from "radix-ui";
import {
  Book, BookMarked, BookOpen, BookOpenText, CalendarDays, CalendarRange, ChevronDown, FileText, History,
  Layers, LibraryBig, Newspaper,
} from "lucide-react";
import { FilterRow } from "@/components/FilterRow";
import { Elevated } from "@/lib/elevated";
import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox-group";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsItem } from "@/components/ui/tabs";
import { DropdownContent, DropdownMenu, DropdownTrigger } from "@/components/ui/dropdown";
import { MenuItem } from "@/components/ui/menu-item";
import { KINDS } from "./data";
import {
  SHORT, forthcomingCount, moveCloser, nearestStop, stopLabel, stopPositions, stops, venueRows, yearCounts, yearDomain,
  type FilterState, type Icons, type Settings, type TypeKey,
} from "./model";

type Icon = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>;
/* the icon pairs on the Journal and Year buttons (lucide, the site's icon set) */
export const ICON_PAIRS: Record<Icons, { journal?: Icon; year?: Icon }> = {
  none: {},
  book: { journal: BookOpenText, year: CalendarRange },
  library: { journal: LibraryBig, year: CalendarDays },
  news: { journal: Newspaper, year: History },
};
/* an icon for each type, for the type row's icon versions */
const TYPE_ICON: Record<TypeKey, Icon> = { all: Layers, journal: BookOpen, preprint: FileText, book: Book, chapter: BookMarked };
const typeItems = (counts: Record<TypeKey, number>) => [
  { key: "all" as TypeKey, label: "All", menu: "All types", n: counts.all },
  ...KINDS.map((k) => ({ key: k.key as TypeKey, label: k.label, menu: k.label, n: counts[k.key] })),
];

/* ---- the type buttons as Fluid Tabs: an icon on each type, and with activeLabel only the
   chosen type shows its name (the "Active Label" example Felipe sent on 2026-11-14) ---- */
export function TypeTabs({ kind, counts, onPick, activeLabel }: {
  kind: TypeKey; counts: Record<TypeKey, number>; onPick: (k: TypeKey) => void; activeLabel: boolean;
}) {
  const items = typeItems(counts);
  const at = Math.max(0, items.findIndex((i) => i.key === kind));
  return (
    <div className="pub-filter pub-filter-static">
      <div className="pub-filter-seg fo-tabs">
        <Tabs selectedIndex={at} onSelect={(i) => onPick(items[i].key)} activeLabel={activeLabel} aria-label="Show publications">
          {items.map((it, i) => (
            <TabsItem
              key={it.key}
              index={i}
              icon={TYPE_ICON[it.key]}
              label={it.label}
              // with activeLabel the count shows on the chosen type only, beside its name
              data-n={!activeLabel || i === at ? it.n : undefined}
              title={activeLabel ? `${it.label} (${it.n})` : undefined}
            />
          ))}
        </Tabs>
      </div>
    </div>
  );
}

/* ---- the type as a third button, beside Journal and Year: a Fluid menu with one choice ---- */
export function TypeMenu({ kind, counts, onPick, align = "start" }: {
  kind: TypeKey; counts: Record<TypeKey, number>; onPick: (k: TypeKey) => void; align?: "start" | "end";
}) {
  const items = typeItems(counts);
  const at = Math.max(0, items.findIndex((i) => i.key === kind));
  return (
    <DropdownMenu>
      <div className="pub-filter pub-filter-static">
        <div className="pub-filter-seg">
          <DropdownTrigger className={`pub-filter-btn pub-filter-action${kind !== "all" ? " on" : ""}`} aria-label="Show a type of publication">
            <span className="fb-bar-label">{items[at].menu}</span>
            <ChevronDown className="size-3.5 fo-chev" aria-hidden="true" />
          </DropdownTrigger>
        </div>
      </div>
      <DropdownContent checkedIndex={at} align={align} sideOffset={8} collisionPadding={16} className="fo-menu">
        {items.map((it, i) => (
          <MenuItem key={it.key} index={i} label={it.menu} checked={i === at} onSelect={() => onPick(it.key)} data-n={it.n} />
        ))}
      </DropdownContent>
    </DropdownMenu>
  );
}

/* phones get the dialog; the site's own phone break for the filter row is 768, the dialog starts at 640 */
export function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return phone;
}

/* ---- the type buttons: the site's FilterRow, with live counts ---- */
export function TypeRow({ kind, counts, onPick }: { kind: TypeKey; counts: Record<TypeKey, number>; onPick: (k: TypeKey) => void }) {
  return (
    <FilterRow<TypeKey>
      ariaLabel="Show publications"
      value={kind}
      onPick={onPick}
      items={[
        { key: "all", label: "All", n: counts.all },
        ...KINDS.map((k) => ({ key: k.key as TypeKey, label: k.label, short: k.short, n: counts[k.key] })),
      ]}
    />
  );
}

/* ---- a button and the list it opens: a floating panel on a desktop, the Fluid dialog on a phone ---- */
export function FilterMenu({ label, icon: IconC, on, ariaLabel, title, footer, children, align = "start", width }: {
  label: ReactNode; icon?: Icon; on: boolean; ariaLabel: string; title: string;
  footer: (close: () => void) => ReactNode; children: ReactNode;
  align?: "start" | "end"; width?: number;
}) {
  // 420 holds the longest journal name, Journal of Experimental Psychology: General, on one line at 15px
  width = width ?? 420;
  const phone = useIsPhone();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const cls = `pub-filter-btn pub-filter-action${on || open ? " on" : ""}`;
  const inner = (
    <>
      {IconC && <IconC className="size-3.5" aria-hidden="true" />}
      <span className="fb-bar-label">{label}</span>
      <ChevronDown className="size-3.5 fo-chev" aria-hidden="true" />
    </>
  );
  // the same shell as the Teaching page's Filter button (components/FilterRow.tsx, FilterButton)
  const shell = (trigger: ReactNode) => (
    <div className="pub-filter pub-filter-static">
      <div className="pub-filter-seg">{trigger}</div>
    </div>
  );
  if (phone) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {shell(<DialogTrigger className={cls} aria-label={ariaLabel}>{inner}</DialogTrigger>)}
        <DialogContent size="sm" className="fo-dialog">
          <DialogTitle className="fo-dialog-title">{title}</DialogTitle>
          <div className="fo-dialog-body">{children}</div>
          <div className="fo-foot">{footer(close)}</div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      {shell(<Popover.Trigger className={cls} aria-label={ariaLabel}>{inner}</Popover.Trigger>)}
      <Popover.Portal>
        <Popover.Content side="bottom" align={align} sideOffset={8} collisionPadding={16} className="fo-pop-anchor">
          <Elevated offset={2} shadowLevel={3} className="fo-pop" style={{ width }}>
            <div className="fo-pop-body">{children}</div>
            <div className="fo-foot">{footer(close)}</div>
          </Elevated>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/* ---- the journal (or venue) rows: a checkbox, the name, the count ----
   s.list sets how a long journal list shows: all ten, six with "Show 4 more journals",
   or six rows with the rest scrolling under the site's scroll fade (globals.css, .scroll-fade) */
export function VenueChecks({ st, s, onToggle }: { st: FilterState; s: Settings; onToggle: (v: string) => void }) {
  const [more, setMore] = useState(false);
  const groups = venueRows(st, s);
  const many = groups.length > 1;
  const list = (
    <div className="fo-venues">
      {groups.map((g) => {
        // "more": the first SHORT rows, plus any checked row below them, until "Show more" is pressed
        const cut = s.list === "more" && !more && g.rows.length > SHORT;
        const rows = cut ? g.rows.filter((r, i) => i < SHORT || st.venues.includes(r.venue)) : g.rows;
        const hidden = g.rows.length - rows.length;
        const checked = new Set(rows.map((r, i) => (st.venues.includes(r.venue) ? i : -1)).filter((i) => i >= 0));
        return (
          <div key={g.kind} className="fo-vgroup">
            {many && <div className="fo-vgroup-title">{g.title}</div>}
            {/* w-full replaces Fluid's fixed 288px width, so a journal name fits on one line */}
            <CheckboxGroup checkedIndices={checked} className="fo-cg w-full">
              {rows.map((r, i) => (
                <CheckboxItem
                  key={r.venue}
                  index={i}
                  label={r.venue}
                  checked={checked.has(i)}
                  onToggle={() => onToggle(r.venue)}
                  data-n={r.n}
                  className={r.n === 0 && !checked.has(i) ? "fo-zero" : undefined}
                />
              ))}
            </CheckboxGroup>
            {s.list === "more" && g.rows.length > SHORT && (
              <div className="fo-more">
                <Button variant="ghost" size="compact" onClick={() => setMore((m) => !m)}>
                  {cut ? `Show ${hidden} more ${s.layer === "journals" || g.kind === "journal" ? "journals" : "venues"}` : "Show fewer"}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
  return s.list === "scroll" ? <div className="fo-scroll scroll-fade">{list}</div> : list;
}

/* ---- the years: Radix Slider (shadcn's slider primitive) with two handles, a label under
   every stop, the range between the handles in coral and the rest of the track dark gray.
   The look copies the example Felipe sent on 2026-11-14 ("circles should be larger than the
   slider itself"): a 6px track and a 24px white handle with a gray ring and a solid dot. ---- */
const THUMB = 24; // px; the handles' width, which Radix keeps inside the track
export function YearRange({ st, s, onRange, onIncF }: {
  st: FilterState; s: Settings; onRange: (lo: number, hi: number) => void; onIncF: (on: boolean) => void;
}) {
  /* The axis runs from the oldest to the newest stop that holds an entry under the chosen type and
     journals (yearDomain). Everything below works on that slice; a change maps back to the full
     list of stops by adding its first index, d0. */
  const [d0, d1] = yearDomain(st, s.forth);
  const S = stops(s.forth).slice(d0, d1 + 1);
  const pos = stopPositions(s.forth).slice(d0, d1 + 1);
  const counts = yearCounts(st, s.forth).slice(d0, d1 + 1);
  const fN = forthcomingCount(st);
  // the handles: the chosen range trimmed to the axis (with no range chosen, the axis's two ends)
  const lo = Math.min(Math.max(st.lo, d0), d1) - d0;
  const hi = Math.min(Math.max(st.hi, d0), d1) - d0;
  /* a handle at an end of the axis means "no limit on that side", so it is stored as the end of the
     whole list: choosing another journal later leaves no stale limit behind, and the Year button
     says Year until a handle sits inside the axis */
  const fullLast = stops(s.forth).length - 1, sliceLast = S.length - 1;
  const setRange = (l: number, h: number) =>
    onRange(l === 0 ? 0 : l + d0, h === sliceLast ? fullLast : h + d0);
  const rangeText = lo === hi ? stopLabel(S[lo]) : `${stopLabel(S[lo])} to ${stopLabel(S[hi])}`;
  const [hov, setHov] = useState<number | null>(null);
  // one stop only (TiCS today holds one forthcoming paper): there is nothing to slide
  if (S.length === 1) {
    return (
      <div className="fo-year">
        <div className="fo-year-range">{stopLabel(S[0])}</div>
        <p className="fo-year-one">
          {S[0] === "F" ? "Forthcoming is the only year" : `${stopLabel(S[0])} is the only year`} with a matching entry.
        </p>
      </div>
    );
  }
  const min = pos[0], max = pos[pos.length - 1];
  const frac = (v: number) => (v - min) / (max - min);
  // Radix centres a handle at THUMB/2 + f * (width - THUMB); the ticks and labels use the same rule
  const at = (v: number) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${frac(v)})`;
  const hasF = S[S.length - 1] === "F";
  const lastYearPos = hasF ? pos[pos.length - 2] : max;
  /* the stop a click would pick, while the pointer is over the track: a faint dot marks it and its
     label lights up, so the slider shows it can be clicked before anyone clicks */
  const onHover = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || e.buttons) { setHov(null); return; }
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left - THUMB / 2) / (r.width - THUMB)));
    setHov(nearestStop(pos, min + f * (max - min)));
  };
  return (
    <div className="fo-year">
      <div className="fo-year-range" aria-live="polite">{rangeText}</div>
      <div className="fo-axis">
        <Slider.Root
          // narrowed: a year limit is set, so the band sweeps through the coral without a hover
          // (Felipe 2026-11-14: "it should be in the slider anytime the slider is not at the default/cleared state")
          className={`fo-rs${st.lo > 0 || st.hi < fullLast ? " narrowed" : ""}`}
          onPointerMove={onHover}
          onPointerLeave={() => setHov(null)}
          min={min}
          max={max}
          step={1}
          minStepsBetweenThumbs={0}
          value={[pos[lo], pos[hi]]}
          onValueChange={([a, b]) => {
            // each value goes to its nearest stop, the same stop every time (see nearestStop)
            const l = nearestStop(pos, a), h = nearestStop(pos, b);
            if (l !== lo || h !== hi) setRange(Math.min(l, h), Math.max(l, h));
          }}
          // the arrow keys move a handle one stop, so one press crosses the gap to Forthcoming;
          // preventDefault keeps Radix's own one-unit step, which would land inside the gap
          onKeyDown={(e) => {
            const dir = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
            if (!dir) return;
            const which = (e.target as HTMLElement).getAttribute("aria-label");
            if (which !== "From" && which !== "To") return;
            e.preventDefault();
            const last = pos.length - 1;
            if (which === "From") setRange(Math.max(0, Math.min(lo + dir, hi)), hi);
            else setRange(lo, Math.min(last, Math.max(hi + dir, lo)));
          }}
          aria-label="Years"
        >
          {/* the stretch to Forthcoming is dashed (a mask on the track, so the coral range is dashed
              there too): Forthcoming is not a year */}
          <Slider.Track className={`fo-rs-track${hasF ? " dashed" : ""}`} style={{ ["--gap" as string]: `${frac(lastYearPos) * 100}%` }}>
            <Slider.Range className="fo-rs-range" />
          </Slider.Track>
          {/* one dot per year, fading in and out where it stands, with the same timing as the year
              labels' highlight; nothing slides (Felipe 2026-11-14: "the dot doesnt need to slide it
              needs only to appear and stays put. it stays and disappears exactly like the motion that
              happens in the year") */}
          {pos.map((p, i) => (
            <span
              key={i}
              className={`fo-dot${hov === i && i !== lo && i !== hi ? " on" : ""}`}
              style={{ left: at(p) }}
              aria-hidden="true"
            />
          ))}
          <Slider.Thumb className="fo-rs-thumb" aria-label="From" aria-valuetext={stopLabel(S[lo])} />
          <Slider.Thumb className="fo-rs-thumb" aria-label="To" aria-valuetext={stopLabel(S[hi])} />
        </Slider.Root>
        {/* every year label is a button: a click moves the closer handle to that year (Felipe
            2026-11-14: "I need to be able to hover over the year ... it has to move the closer handler") */}
        <div className="fo-labels" role="group" aria-label="Years">
          {S.map((x, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-label={`Move the closer handle to ${stopLabel(x)}`}
              className={`fo-label${x === "F" ? " f" : ""}${i % 2 === 1 && x !== "F" ? " alt" : ""}${counts[i] === 0 ? " empty" : ""}${i >= lo && i <= hi ? " in" : ""}${hov === i ? " hover" : ""}`}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") setHov(i); }}
              onPointerLeave={() => setHov(null)}
              style={{ left: at(pos[i]) }}
              onClick={() => { const [l, h] = moveCloser(pos, lo, hi, i); setRange(l, h); }}
            >
              {stopLabel(x)}
            </button>
          ))}
        </div>
      </div>
      {s.forth === "toggle" && (
        <CheckboxGroup checkedIndices={new Set(st.incF ? [0] : [])} className="fo-cg fo-incf">
          <CheckboxItem index={0} label="Include forthcoming" checked={st.incF} onToggle={() => onIncF(!st.incF)} data-n={fN} />
        </CheckboxGroup>
      )}
    </div>
  );
}

/* ---- "Showing 6 of 18" with Clear, under the row while a filter is on ---- */
export function ResultLine({ n, total, active, onClear }: { n: number; total: number; active: boolean; onClear: () => void }) {
  if (!active) return null;
  return (
    <div className="fo-result">
      <span>Showing {n} of {total}</span>
      <Button variant="ghost" size="compact" onClick={onClear}>Clear filters</Button>
    </div>
  );
}

/* ---- the footer of each list: Clear and Show ---- */
export function MenuFooter({ close, n, canClear, onClear }: { close: () => void; n: number; canClear: boolean; onClear: () => void }) {
  return (
    <>
      <Button variant="ghost" size="compact" onClick={onClear} disabled={!canClear}>Clear</Button>
      <Button variant="primary" size="compact" onClick={close}>Show {n} {n === 1 ? "entry" : "entries"}</Button>
    </>
  );
}
