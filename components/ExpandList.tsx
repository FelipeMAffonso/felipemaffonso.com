"use client";

// A numbered list whose entries open in place, built exactly like a Publications entry
// (components/PublicationsSections.tsx, PublicationEntry): the same markup and classes
// (.pub-list, .pub-entry, .pub-citation, .pub-detail), the same open and close sounds,
// and the same scroll assist after the panel opens. One entry is open at a time.
import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { useSound } from "@/lib/sound";

export interface ExpandItem { id: string; citation: ReactNode; detail: ReactNode; aside?: ReactNode }

export function ExpandList({ items, idPrefix }: { items: ExpandItem[]; idPrefix: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { play } = useSound();

  const toggle = (id: string) => {
    setOpenId((prev) => {
      if (prev === id) { play("whisper"); return null; }
      play("bloom");
      window.setTimeout(() => {
        const el = document.getElementById(`${idPrefix}-${id}`);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const bar = document.querySelector<HTMLElement>(".pub-filter:not(.pub-filter-static)");
        const navLine = 72 + (bar ? bar.offsetHeight : 0);
        if (r.top < navLine || r.bottom > window.innerHeight) {
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        }
      }, 300);
      return id;
    });
  };

  return (
    <ol className="pub-list expand-list">
      {items.map((it, index) => {
        const open = openId === it.id;
        const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(it.id); }
        };
        return (
          <li key={it.id} id={`${idPrefix}-${it.id}`} className={`pub-entry enter${open ? " open" : ""}`}
            style={{ "--enter-i": index } as CSSProperties}>
            <div className="pub-citation" role="button" tabIndex={0} aria-expanded={open}
              onClick={() => toggle(it.id)} onKeyDown={onKey}>
              <span className="pub-text">{it.citation}</span>
              <svg className="pub-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
            </div>
            <div className="pub-detail">
              <div className="pub-detail-inner">
                <div className="pub-detail-pad">
                  <div className="pub-abstract">
                    {it.aside}
                    {it.detail}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
