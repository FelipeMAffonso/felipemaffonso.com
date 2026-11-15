"use client";

/* ============================================================
   Filter options review: the year slider over thirty made-up
   years (1996 to 2026 and Forthcoming), to show how it behaves
   when the papers span decades (Felipe 2026-11-14: "what will
   happen when we have, say, 30 years of research papers ...
   once we move the handles or click around it zooms in and out?").
   Two modes: "thin" labels every fifth year and puts each handle's
   year above it; "zoom" also zooms the axis to the chosen years
   after each drag or click. Same parts and rules as the real
   slider (Controls.tsx, YearRange): Radix Slider, the nearest
   stop, the closer handle, the dashed stretch to Forthcoming.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { Slider } from "radix-ui";
import { Button } from "@/components/ui/button";
import { moveCloser, nearestStop } from "./model";

const FIRST = 1996, LAST = 2026;
const S: (number | "F")[] = [...Array.from({ length: LAST - FIRST + 1 }, (_, i) => FIRST + i), "F"];
const POS = S.map((x) => (x === "F" ? LAST + 3 : x)); // Forthcoming sits three units past the last year
const FULL: [number, number] = [POS[0], POS[POS.length - 1]];
const THUMB = 24;
const label = (x: number | "F") => (x === "F" ? "Forthcoming" : String(x));
const easeOut = (k: number) => 1 - Math.pow(1 - k, 5); // the site's ease-out-quint, as a function

export function LongRange({ mode }: { mode: "thin" | "zoom" }) {
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(POS.length - 1);
  const [win, setWin] = useState<[number, number]>(FULL);
  const [hov, setHov] = useState<number | null>(null);
  const winRef = useRef(win);
  winRef.current = win;
  const raf = useRef<number | null>(null);
  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  /* the visible window glides to its target over 320ms */
  const animateTo = (target: [number, number]) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const from = winRef.current, t0 = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 160 : 320; // the site's reduced motion: calmer, never frozen
    const step = (t: number) => {
      const k = easeOut(Math.min(1, (t - t0) / dur));
      setWin([from[0] + (target[0] - from[0]) * k, from[1] + (target[1] - from[1]) * k]);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  /* the zoom for a range: the chosen years plus a quarter of their span (at least two years) on each side */
  const zoomFor = (l: number, h: number): [number, number] => {
    const a = POS[l], b = POS[h], pad = Math.max(2, (b - a) * 0.25);
    const w: [number, number] = [Math.max(FULL[0], a - pad), Math.min(FULL[1], b + pad)];
    return w[1] - w[0] >= (FULL[1] - FULL[0]) * 0.8 ? FULL : w;
  };
  const set = (l: number, h: number, commit: boolean) => {
    setLo(l); setHi(h);
    if (commit && mode === "zoom") animateTo(zoomFor(l, h));
  };

  const [w0, w1] = win;
  const zoomed = w0 > FULL[0] + 0.01 || w1 < FULL[1] - 0.01;
  const frac = (v: number) => (v - w0) / (w1 - w0);
  const at = (v: number) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${frac(v)})`;
  /* labels are chosen by measured pixels: the step (every 1, 2, 5 or 10 years) is the smallest that
     keeps 40px between labels, and a year closer than 80px to Forthcoming leaves its label out,
     because the long Forthcoming label would cover it */
  const axis = useRef<HTMLDivElement>(null);
  const [axisW, setAxisW] = useState(500);
  useEffect(() => {
    const el = axis.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAxisW(el.clientWidth));
    ro.observe(el);
    setAxisW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const ppu = (axisW - THUMB) / (w1 - w0); // pixels per year
  const every = [1, 2, 5, 10].find((e) => e * ppu >= 40) ?? 10;
  const shows = (i: number) => {
    const x = S[i], p = POS[i];
    if (p < w0 - 0.01 || p > w1 + 0.01) return false;
    if (x === "F") return true;
    return x % every === 0 && (POS[POS.length - 1] - p) * ppu >= 80;
  };
  const onHover = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || e.buttons) { setHov(null); return; }
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left - THUMB / 2) / (r.width - THUMB)));
    setHov(nearestStop(POS, w0 + f * (w1 - w0)));
  };

  return (
    <div className="fo-year fo-long-year">
      <div className="fo-long-head">
        <span className="fo-year-range">{label(S[lo])}{lo !== hi && <> to {label(S[hi])}</>}</span>
        {mode === "zoom" && zoomed && (
          <Button variant="ghost" size="compact" onClick={() => animateTo(FULL)}>Show all years</Button>
        )}
      </div>
      <div className="fo-axis" ref={axis}>
        <Slider.Root
          className="fo-rs fo-rs-tags"
          min={w0}
          max={w1}
          step={0.01}
          minStepsBetweenThumbs={0}
          value={[POS[lo], POS[hi]]}
          onPointerMove={onHover}
          onPointerLeave={() => setHov(null)}
          onValueChange={([a, b]) => {
            const l = nearestStop(POS, a), h = nearestStop(POS, b);
            if (l !== lo || h !== hi) set(Math.min(l, h), Math.max(l, h), false);
          }}
          onValueCommit={([a, b]) => {
            const l = nearestStop(POS, a), h = nearestStop(POS, b);
            set(Math.min(l, h), Math.max(l, h), true);
          }}
          onKeyDown={(e) => {
            const dir = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
            const which = (e.target as HTMLElement).getAttribute("aria-label");
            if (!dir || (which !== "From" && which !== "To")) return;
            e.preventDefault();
            if (which === "From") set(Math.max(0, Math.min(lo + dir, hi)), hi, true);
            else set(lo, Math.min(POS.length - 1, Math.max(hi + dir, lo)), true);
          }}
          aria-label="Years"
        >
          <Slider.Track className="fo-rs-track dashed" style={{ ["--gap" as string]: `${Math.min(1, frac(LAST)) * 100}%` }}>
            <Slider.Range className="fo-rs-range" />
          </Slider.Track>
          {hov !== null && (
            <span className="fo-ghost on fo-ghost-tag" style={{ left: at(POS[hov]) }} aria-hidden="true">
              {hov !== lo && hov !== hi && <span className="fo-tag dim">{label(S[hov])}</span>}
            </span>
          )}
          <Slider.Thumb className="fo-rs-thumb" aria-label="From" aria-valuetext={label(S[lo])}>
            <span className="fo-tag">{label(S[lo])}</span>
          </Slider.Thumb>
          <Slider.Thumb className="fo-rs-thumb" aria-label="To" aria-valuetext={label(S[hi])}>
            {hi !== lo && <span className="fo-tag">{label(S[hi])}</span>}
          </Slider.Thumb>
        </Slider.Root>
        <div className="fo-labels" role="group" aria-label="Years">
          {S.map((x, i) => shows(i) && (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-label={`Move the closer handle to ${label(x)}`}
              className={`fo-label fo-label-free${x === "F" ? " f" : ""}${i >= lo && i <= hi ? " in" : ""}${hov === i ? " hover" : ""}`}
              style={{ left: at(POS[i]) }}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") setHov(i); }}
              onPointerLeave={() => setHov(null)}
              onClick={() => { const [l, h] = moveCloser(POS, lo, hi, i); set(l, h, true); }}
            >
              {label(x)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
