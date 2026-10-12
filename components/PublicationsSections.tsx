"use client";

/* ============================================================
   Publications — the crown jewel.
   List (not cards) + the LOCKED expandable panel. One open at a
   time, page-wide. The win lives in the DYNAMICS: grid-rows
   expansion, synced chevron, subtle in-panel stagger, coral
   button hover, press feedback, and cuelume on open/close +
   button press/release. Static design is unchanged.

   The pixel layer (adjudicated and baked 2026-07-19): the bare
   spark strip above the list (PageStrip), and inside each open
   panel the cover slot is the two-face story artifact (PubCover:
   the paper's pixel story by default, the real journal cover on
   click). No poster cards, no writing on panel art.
   ============================================================ */

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { preprints, journals, books, chapters, type Pub, type PubLink } from "@/lib/publications";
import { useSound } from "@/lib/sound";
import { PageStrip } from "./PageStrip";
import { PubCover } from "./PubCover";
import {
  JournalIcon, DownloadIcon, OsfIcon, ResearchBoxIcon, GitHubGlyph, ArxivIcon, PsyArxivIcon, SsrnIcon,
} from "./icons";

function LinkIcon({ kind }: { kind: PubLink["kind"] }) {
  switch (kind) {
    case "journal": return <JournalIcon />;
    case "download": return <DownloadIcon />;
    case "osf": return <OsfIcon />;
    case "researchbox": return <ResearchBoxIcon />;
    case "github": return <GitHubGlyph />;
    case "arxiv": return <ArxivIcon />;
    case "psyarxiv": return <PsyArxivIcon />;
    case "ssrn": return <SsrnIcon />;
  }
}

function ActionButton({ link, pressSounds }: { link: PubLink; pressSounds: boolean }) {
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

function PublicationEntry({
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

/* Section order (Felipe 2026-10-12): Journal Publications, Preprints, Books,
   Book Chapters. A kind with no entries renders nothing, its button included,
   so Books appears by itself the day lib/publications.tsx gets one. */
type SectionKey = "journal" | "preprint" | "book" | "chapter";
type Filter = "all" | SectionKey;
type Section = { key: SectionKey; title: string; label: string; short: string; pubs: Pub[] };
const SECTIONS: Section[] = ([
  { key: "journal", title: "Journal Publications", label: "Journal publications", short: "Journal", pubs: journals },
  { key: "preprint", title: "Preprints", label: "Preprints", short: "Preprints", pubs: preprints },
  { key: "book", title: "Books", label: "Books", short: "Books", pubs: books },
  { key: "chapter", title: "Book Chapters", label: "Book chapters", short: "Chapters", pubs: chapters },
] as Section[]).filter((s) => s.pubs.length > 0);
const TOTAL = SECTIONS.reduce((n, s) => n + s.pubs.length, 0);
const NAV_H = 64;

/* The filter row: one button per kind with its count, sticky under the fixed
   nav. Behaves like shadcn's single toggle group (arrow keys, Home/End,
   aria-pressed) in the site's own styles; the thumb slides to the pressed
   button over 0.3s on the house curve. */
function FilterRow({ filter, onPick }: { filter: Filter; onPick: (f: Filter) => void }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const segRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const [stuck, setStuck] = useState(false);

  useLayoutEffect(() => {
    const place = () => {
      const seg = segRef.current, thumb = thumbRef.current;
      const on = seg?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
      if (!seg || !thumb || !on) return;
      thumb.style.transform = `translateX(${on.offsetLeft}px)`;
      thumb.style.width = `${on.offsetWidth}px`;
      if (on.offsetLeft < seg.scrollLeft || on.offsetLeft + on.offsetWidth > seg.scrollLeft + seg.clientWidth) {
        seg.scrollTo({ left: on.offsetLeft - 12, behavior: "smooth" });
      }
    };
    place();
    // enable the slide only after the first placement, and re-place once the
    // self-hosted font has settled the button widths
    const raf = requestAnimationFrame(() => segRef.current?.classList.add("ready"));
    document.fonts?.ready.then(place);
    window.addEventListener("resize", place);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", place); };
  }, [filter]);

  useEffect(() => {
    const onScroll = () => {
      const r = rowRef.current;
      if (r) setStuck(r.getBoundingClientRect().top <= NAV_H + 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const buttons: { key: Filter; label: string; short: string; n: number }[] = [
    { key: "all", label: "All", short: "All", n: TOTAL },
    ...SECTIONS.map((s) => ({ key: s.key, label: s.label, short: s.short, n: s.pubs.length })),
  ];
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = buttons.findIndex((b) => b.key === filter);
    const to = e.key === "ArrowRight" ? (i + 1) % buttons.length
      : e.key === "ArrowLeft" ? (i - 1 + buttons.length) % buttons.length
      : e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    onPick(buttons[to].key);
    segRef.current?.querySelectorAll<HTMLButtonElement>(".pub-filter-btn")[to]?.focus();
  };

  return (
    <div ref={rowRef} className={`pub-filter enter${stuck ? " stuck" : ""}`}>
      <div ref={segRef} className="pub-filter-seg" role="toolbar" aria-label="Show publications" onKeyDown={onKey}>
        <span ref={thumbRef} className="pub-filter-thumb" aria-hidden="true" />
        {buttons.map((b) => (
          <button
            key={b.key}
            type="button"
            className="pub-filter-btn"
            aria-pressed={filter === b.key}
            tabIndex={filter === b.key ? 0 : -1}
            onClick={() => onPick(b.key)}
            data-cuelume-press=""
            data-cuelume-release=""
          >
            <span className="pub-filter-long">{b.label}</span>
            <span className="pub-filter-short">{b.short}</span>
            <span className="pub-filter-n">{b.n}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PublicationsSections() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const listRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();
  const pressSounds = true;

  const pick = (f: Filter) => {
    if (f === filter) return;
    /* if the row is stuck under the nav, bring the top of the list back up
       under it, so the reader lands on the first entry of the new view */
    const list = listRef.current;
    const bar = document.querySelector<HTMLElement>(".pub-filter");
    if (list && bar) {
      const top = list.getBoundingClientRect().top + window.scrollY - NAV_H - bar.offsetHeight - 8;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "auto" });
    }
    setFilter(f);
  };

  const toggle = (id: string) => {
    setOpenId((prev) => {
      if (prev === id) {
        play("whisper"); // collapse / go back
        return null;
      }
      play("bloom"); // reveal / expand
      /* Scroll assist (the shadcn/WAI-ARIA disclosure convention):
         after the 240ms expansion settles, if the opened citation
         sits above the nav line or its panel runs past the bottom
         of the viewport, bring the entry to the top, under the
         fixed nav (scroll-margin-top carries the offset). Matters
         most on mobile, where a tall panel otherwise leaves the
         reader stranded mid-abstract. */
      window.setTimeout(() => {
        const el = document.getElementById(`pub-${id}`);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const bar = document.querySelector<HTMLElement>(".pub-filter");
        const navLine = 72 + (bar ? bar.offsetHeight : 0);
        if (r.top < navLine || r.bottom > window.innerHeight) {
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        }
      }, 300);
      return id;
    });
  };

  // page-wide index so the entrance stagger flows down both sections
  let i = 0;
  const render = (pub: Pub) => (
    <PublicationEntry
      key={pub.id}
      pub={pub}
      index={i++}
      open={openId === pub.id}
      onToggle={() => toggle(pub.id)}
      pressSounds={pressSounds}
    />
  );

  const shown = filter === "all" ? SECTIONS : SECTIONS.filter((s) => s.key === filter);

  return (
    <>
      <PageStrip page="research" />
      <FilterRow filter={filter} onPick={pick} />

      {/* keyed on the filter so a new view replays the house entrance */}
      <div ref={listRef} key={filter} className="pub-sections">
        {shown.map((s) => (
          <section className="section" key={s.key} id={`pubs-${s.key}`}>
            <h2 className="section-title enter">{s.title}</h2>
            {s.key === "journal" && <p className="pub-note-sub enter"><em>*Denotes equal authorship</em></p>}
            <ol className="pub-list">{s.pubs.map(render)}</ol>
          </section>
        ))}
      </div>
    </>
  );
}
