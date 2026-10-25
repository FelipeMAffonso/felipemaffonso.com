"use client";

// The site's filter row, the same markup and classes as the one on Publications
// (components/PublicationsSections.tsx, FilterRow): a single-choice toggle group with a
// sliding thumb, arrow keys, Home/End and aria-pressed. Shared so the Teaching page looks
// exactly like Publications. `sticky` keeps it under the nav while the page scrolls; `wrap` lets a
// long row break onto a second line instead of scrolling sideways, with the thumb following.
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface FilterItem<K extends string> { key: K; label: string; short?: string; n?: number }

const NAV_H = 64;

export function FilterRow<K extends string>({
  items, value, onPick, ariaLabel, sticky = false, wrap = false,
}: { items: FilterItem<K>[]; value: K; onPick: (k: K) => void; ariaLabel: string; sticky?: boolean; wrap?: boolean }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const segRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const [stuck, setStuck] = useState(false);

  useLayoutEffect(() => {
    const place = () => {
      const seg = segRef.current, thumb = thumbRef.current;
      const on = seg?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
      if (!seg || !thumb || !on) return;
      thumb.style.transform = `translate(${on.offsetLeft}px, ${wrap ? on.offsetTop - 3 : 0}px)`;
      thumb.style.width = `${on.offsetWidth}px`;
      if (wrap) thumb.style.height = `${on.offsetHeight}px`;
    };
    place();
    const raf = requestAnimationFrame(() => segRef.current?.classList.add("ready"));
    document.fonts?.ready.then(place);
    window.addEventListener("resize", place);
    // a button changes width when its count changes ("All 205" becomes "All 5" during a search),
    // so the thumb is placed again whenever the row's buttons change size, not only on a new pick
    const ro = new ResizeObserver(place);
    segRef.current?.querySelectorAll(".pub-filter-btn").forEach((b) => ro.observe(b));
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", place); ro.disconnect(); };
  }, [value, items.length, wrap, items.map((b) => `${b.key}:${b.n ?? ""}`).join("|")]);

  useEffect(() => {
    if (!sticky) return;
    const onScroll = () => {
      const r = rowRef.current;
      if (r) setStuck(r.getBoundingClientRect().top <= NAV_H + 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.findIndex((b) => b.key === value);
    const to = e.key === "ArrowRight" ? (i + 1) % items.length
      : e.key === "ArrowLeft" ? (i - 1 + items.length) % items.length
      : e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    onPick(items[to].key);
    segRef.current?.querySelectorAll<HTMLButtonElement>(".pub-filter-btn")[to]?.focus();
  };

  return (
    <div ref={rowRef} className={`pub-filter${sticky ? "" : " pub-filter-static"}${stuck ? " stuck" : ""}`}>
      <div ref={segRef} className={`pub-filter-seg${wrap ? " pub-filter-wrap" : ""}`} role="toolbar" aria-label={ariaLabel} onKeyDown={onKey}>
        <span ref={thumbRef} className="pub-filter-thumb" aria-hidden="true" />
        {items.map((b) => (
          <button
            key={b.key}
            type="button"
            className="pub-filter-btn"
            aria-pressed={value === b.key}
            tabIndex={value === b.key ? 0 : -1}
            onClick={() => onPick(b.key)}
            data-cuelume-press=""
            data-cuelume-release=""
          >
            <span className="pub-filter-long">{b.label}</span>
            <span className="pub-filter-short">{b.short ?? b.label}</span>
            {b.n !== undefined && <span className="pub-filter-n">{b.n}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/** One action button drawn in the same shell as the filter row (its border, surface, type and
 *  sounds), for an action that sits beside a filter row but is not one of its choices, such as the
 *  Teaching page's Shuffle. It is never pressed or selected; it acts on each click. */
export function FilterButton({ onClick, ariaLabel, children, pressed }: {
  onClick: () => void; ariaLabel?: string; children: ReactNode;
  /** for a button that opens something (the Teaching page's Filter): shown pressed while open */
  pressed?: boolean;
}) {
  return (
    <div className="pub-filter pub-filter-static">
      <div className="pub-filter-seg">
        <button
          type="button"
          className={`pub-filter-btn pub-filter-action${pressed ? " on" : ""}`}
          aria-label={ariaLabel}
          aria-expanded={pressed}
          onClick={onClick}
          data-cuelume-press=""
          data-cuelume-release=""
        >
          {children}
        </button>
      </div>
    </div>
  );
}
