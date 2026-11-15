"use client";

/* ============================================================
   Publications — the crown jewel.
   List (not cards) + the LOCKED expandable panel. One open at a
   time, page-wide. The win lives in the DYNAMICS: grid-rows
   expansion, synced chevron, subtle in-panel stagger, coral
   button hover, press feedback, and cuelume on open/close +
   button press/release. Static design is unchanged.

   The pixel layer (adjudicated and baked 2026-07-19): the bare
   spark strip above the list (PageStrip). The cover slot inside
   each open panel is the plain journal or book cover (PubCover);
   the pixel stories that filled it were removed on 2026-10-20.
   No poster cards, no writing on panel art.
   ============================================================ */

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { type Pub, type PubLink } from "@/lib/publications";
import { FluidProvider } from "@/lib/fluid-provider";
import { Button } from "@/components/ui/button";
import { ITEMS, KINDS } from "./pub-filter/data";
import {
  anyActive, initialState, pickType, shown, toggleVenue, typeCounts, venueShort, yearActive, yearButtonText,
  type FilterState, type Settings,
} from "./pub-filter/model";
import { FilterMenu, ICON_PAIRS, MenuFooter, ResultLine, TypeTabs, VenueChecks, YearRange } from "./pub-filter/Controls";
import "./pub-filter/pub-filter.css";
import { useSound } from "@/lib/sound";
import { PageStrip } from "./PageStrip";
import { PubCover } from "./PubCover";
import {
  JournalIcon, DownloadIcon, PdfIcon, OsfIcon, ResearchBoxIcon, GitHubGlyph, ArxivIcon, PsyArxivIcon, SsrnIcon,
} from "./icons";

function LinkIcon({ kind }: { kind: PubLink["kind"] }) {
  switch (kind) {
    case "journal": return <JournalIcon />;
    case "download": return <DownloadIcon />;
    case "pdf": return <PdfIcon />;
    case "osf": return <OsfIcon />;
    case "researchbox": return <ResearchBoxIcon />;
    case "github": return <GitHubGlyph />;
    case "arxiv": return <ArxivIcon />;
    case "psyarxiv": return <PsyArxivIcon />;
    case "ssrn": return <SsrnIcon />;
  }
}

/* A link with a `temporary` stand-in (lib/publications.tsx) shows the stand-in until its `until` moment.
   The first render uses the build's moment (SITE_BUILT_AT, set in next.config.mjs), so the static HTML and
   the browser's first render agree; after mount the browser's own clock decides. */
function useCurrentLink(link: PubLink): PubLink {
  const t = link.temporary;
  const [useTemp, setUseTemp] = useState(() => !!t && Number(process.env.SITE_BUILT_AT) < Date.parse(t.until));
  useEffect(() => {
    if (t) setUseTemp(Date.now() < Date.parse(t.until));
  }, [t]);
  return t && useTemp ? { ...link, href: t.href, desc: t.desc } : link;
}

function ActionButton({ link: given, pressSounds }: { link: PubLink; pressSounds: boolean }) {
  const link = useCurrentLink(given);
  const isDownload = link.kind === "download" || link.download;
  const soundAttrs: Record<string, string> = pressSounds
    ? { "data-cuelume-press": "", "data-cuelume-release": "" }
    : {};
  const linkAttrs: React.AnchorHTMLAttributes<HTMLAnchorElement> = isDownload
    ? { download: true }
    : { target: "_blank", rel: "noopener" };
  return (
    <a href={link.href} className="pub-link" {...linkAttrs} {...soundAttrs}>
      <LinkIcon kind={link.kind} />
      <div>
        <div className="pub-link-label">{link.label}</div>
        <div className="pub-link-desc">{link.desc}</div>
      </div>
    </a>
  );
}

export function PublicationEntry({
  pub, index, open, onToggle, pressSounds,
}: {
  pub: Pub; index: number; open: boolean; onToggle: () => void; pressSounds: boolean;
}) {
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };
  return (
    <li
      id={`pub-${pub.id}`}
      className={`pub-entry enter${open ? " open" : ""}`}
      style={{ "--enter-i": index } as CSSProperties}
    >
      <div
        className="pub-citation"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={onToggle}
        onKeyDown={onKey}
      >
        <span className="pub-text">{pub.citation}</span>
        <svg className="pub-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
      </div>
      <div className="pub-detail">
        <div className="pub-detail-inner">
          <div className="pub-detail-pad">
            {pub.links && pub.links.length > 0 && (
              <div className="pub-links">
                {pub.links.map((l) => (
                  <ActionButton key={l.href} link={l} pressSounds={pressSounds} />
                ))}
              </div>
            )}
            <div className="pub-abstract">
              {pub.cover && <PubCover cover={pub.cover} pubId={pub.id} />}
              <p>{pub.abstract}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/* ============================================================
   The filter row, decided by Felipe on 2026-11-14 on the review page (branch pub-filter-options):
   Journal and Year buttons on the left of the type tabs, where only the chosen type shows its name and
   count. Journal opens the ten journals, ordered by prestige, each with a checkbox and a count, in a
   list that shows six rows and scrolls. Year opens the coral slider, with Forthcoming as its own last
   stop; its axis follows the chosen type and journals, and a click on a year or on the bar moves the
   closer handle. The three filters shape each other's counts, no choice clears another, and every
   Clear resets all three. The parts and rules are in components/pub-filter (Controls.tsx, model.ts,
   data.ts); the browser tests are scripts/filter-options-*.py.
   ============================================================ */
const DECIDED: Settings = { place: "left", layer: "journals", forth: "stop", list: "scroll", icons: "book", types: "active" };
const NAV_H = 64;

export function PublicationsSections() {
  const s = DECIDED;
  const [st, setStRaw] = useState<FilterState>(() => initialState(s.forth));
  const [openId, setOpenId] = useState<string | null>(null);
  const [stuck, setStuck] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  // once the row is stuck under the nav it shows its hairline, as the row before it did
  useEffect(() => {
    const onScroll = () => {
      const r = rowRef.current;
      if (r) setStuck(r.getBoundingClientRect().top <= NAV_H + 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* a new filter brings the reader back to the first entry of the new view when the row is stuck
     under the nav ("instant": the site's smooth scrolling would turn the jump into a long glide) */
  const setSt = (next: FilterState) => {
    const list = listRef.current, bar = rowRef.current;
    if (list && bar) {
      const top = list.getBoundingClientRect().top + window.scrollY - NAV_H - bar.offsetHeight - 8;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" });
    }
    setStRaw(next);
  };

  const counts = typeCounts(st, s.forth);
  const items = shown(st, s.forth);
  const active = anyActive(st, s.forth);
  const total = ITEMS.length;
  const clearAll = () => setSt(initialState(s.forth));
  const anyChosen = active || st.kind !== "all";
  const venueLabel =
    st.venues.length === 0 ? "Journal"
      : st.venues.length === 1 ? venueShort(st.venues[0])
      : `${st.venues.length} journals`;
  const pair = ICON_PAIRS[s.icons];

  const toggle = (id: string) => {
    setOpenId((prev) => {
      if (prev === id) {
        play("whisper"); // collapse / go back
        return null;
      }
      play("bloom"); // reveal / expand
      /* Scroll assist (the shadcn/WAI-ARIA disclosure convention): after the 240ms expansion
         settles, if the opened citation sits above the nav line or its panel runs past the bottom of
         the viewport, bring the entry to the top, under the fixed nav (scroll-margin-top carries the
         offset). Matters most on mobile, where a tall panel otherwise leaves the reader stranded
         mid-abstract. */
      window.setTimeout(() => {
        const el = document.getElementById(`pub-${id}`);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const bar = rowRef.current;
        const navLine = 72 + (bar ? bar.offsetHeight : 0);
        if (r.top < navLine || r.bottom > window.innerHeight) {
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        }
      }, 300);
      return id;
    });
  };

  // page-wide index so the entrance stagger flows down every section
  let n = 0;
  // keyed on the filters so a new view replays the house entrance
  const sig = `${st.kind}|${st.venues.join(",")}|${st.lo}-${st.hi}`;

  return (
    <>
      <PageStrip page="research" />
      <FluidProvider>
        <div ref={rowRef} className={`pub-filter fo-row enter${stuck ? " stuck" : ""}`}>
          <div className="fo-line">
            <FilterMenu
              label={venueLabel}
              icon={pair.journal}
              on={st.venues.length > 0}
              badge={st.venues.length > 0 ? st.venues.length : undefined}
              ariaLabel="Filter by journal"
              title="Journal"
              footer={(close) => <MenuFooter close={close} n={items.length} canClear={anyChosen} onClear={clearAll} />}
            >
              <VenueChecks st={st} s={s} onToggle={(v) => setSt(toggleVenue(st, v, s))} />
            </FilterMenu>
            <FilterMenu
              label={yearActive(st, s.forth) ? yearButtonText(st, s.forth) : "Year"}
              icon={pair.year}
              on={yearActive(st, s.forth)}
              badge={yearActive(st, s.forth) ? "dot" : undefined}
              ariaLabel="Filter by year"
              title="Year"
              // 540 spaces the years about 48px apart (Felipe 2026-11-14: "years more spaced out")
              width={540}
              footer={(close) => <MenuFooter close={close} n={items.length} canClear={anyChosen} onClear={clearAll} />}
            >
              <YearRange st={st} s={s} onRange={(lo, hi) => setSt({ ...st, lo, hi })} onIncF={(on) => setSt({ ...st, incF: on })} />
            </FilterMenu>
            <TypeTabs kind={st.kind} counts={counts} onPick={(k) => setSt(pickType(st, k, s))} activeLabel />
          </div>
        </div>

        <div ref={listRef}>
          <ResultLine n={items.length} total={total} active={active} onClear={clearAll} />
          {items.length === 0 ? (
            <div className="fo-empty">
              {/* named by the chosen type: "No preprints match these filters." */}
              <p>No {st.kind === "all" ? "publications" : KINDS.find((k) => k.key === st.kind)!.label.toLowerCase()} match these filters.</p>
              <Button variant="secondary" size="compact" onClick={clearAll}>Clear the filters</Button>
            </div>
          ) : (
            <div className="pub-sections" key={sig}>
              {KINDS.map((k) => {
                const these = items.filter((i) => i.kind === k.key);
                if (these.length === 0) return null;
                return (
                  <section className="section" key={k.key} id={`pubs-${k.key}`}>
                    {/* no "*Denotes equal authorship" line on the website (Felipe 2026-11-15; the CV keeps it) */}
                    <h2 className="section-title enter">{k.title}</h2>
                    <ol className="pub-list">
                      {these.map((i) => (
                        <PublicationEntry
                          key={i.pub.id}
                          pub={i.pub}
                          index={n++}
                          open={openId === i.pub.id}
                          onToggle={() => toggle(i.pub.id)}
                          pressSounds
                        />
                      ))}
                    </ol>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </FluidProvider>
    </>
  );
}
