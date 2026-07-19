"use client";

/* ============================================================
   PixelPoster — the animated LED-grid poster card.
   A fixed grid of flat rounded cells on a card; unlit cells
   stay faintly visible; the four corner cells are permanently
   dim anchors; the artwork is either a noise ENGINE motif or a
   narrative STORY (lib/pixelStories). Below the grid: a slab
   serif title and a quiet caption.

   Theme-adaptive (Felipe 2026-07-19): dark theme keeps the
   night card; light theme lightens the card chrome (CSS) and
   adapts the cell colors (lib/pixelTheme), so the cards live in
   both modes. alwaysDark opts out (the Spears dusk scene).

   Runs its loop only while on screen (IntersectionObserver) and
   while `active` is true; reduced motion runs the same loop at
   0.4x speed (site policy: calmer, never frozen).
   ============================================================ */

import { useEffect, useRef } from "react";
import { ENGINES, type Grid, type MotifSpec } from "@/lib/pixelEngine";
import { STORIES, renderStory } from "@/lib/pixelStories";
import { adaptPalette, useIsLight, CELL_TINTS } from "@/lib/pixelTheme";

type Props = {
  spec?: MotifSpec;
  story?: string;
  cols?: number;
  rows?: number;
  title: string;
  caption: string;
  active?: boolean;
  alwaysDark?: boolean;
  className?: string;
};

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function PixelPoster({
  spec, story, cols, rows, title, caption, active = true, alwaysDark = false, className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLElement>(null);
  const isLight = useIsLight() && !alwaysDark;

  const storyDef = story ? STORIES[story] : undefined;
  const nCols = storyDef ? storyDef.cols : (cols ?? 20);
  const nRows = storyDef ? storyDef.rows : (rows ?? 14);
  const baseColors = storyDef ? storyDef.colors : (spec?.colors ?? []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colorsAdapted = adaptPalette(baseColors, isLight);
    const rgb = colorsAdapted.map(hexToRgb);
    const tints = isLight ? CELL_TINTS.light : CELL_TINTS.dark;

    const grid: Grid | null = spec
      ? {
          cols: nCols,
          rows: nRows,
          seed: spec.seed ?? 1,
          colorsN: spec.colors.length,
          p: spec.params ?? {},
          map: spec.map,
        }
      : null;
    const engine = spec ? ENGINES[spec.engine] : null;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduced ? 0.4 : 1;

    let raf = 0;
    let last = 0;
    let t = ((spec?.seed ?? 1) * 7.31) % 20; // desync sibling posters
    let visible = true;
    let cell = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      if (w === 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cell = w / nCols;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(cell * nRows * dpr);
      canvas.style.height = `${Math.round(cell * nRows)}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawCell = (x: number, y: number, fill: string, stroke?: string) => {
      const pad = cell * 0.13;
      const s = cell - pad * 2;
      const r = Math.max(1.5, s * 0.18);
      ctx.beginPath();
      ctx.roundRect(x * cell + pad, y * cell + pad, s, s, r);
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const draw = (tt: number) => {
      ctx.clearRect(0, 0, canvas.clientWidth, cell * nRows);
      const buf = storyDef ? renderStory(storyDef, tt) : null;
      for (let y = 0; y < nRows; y++) {
        for (let x = 0; x < nCols; x++) {
          const corner = (x === 0 || x === nCols - 1) && (y === 0 || y === nRows - 1);
          if (corner) {
            drawCell(x, y, tints.anchor);
            continue;
          }
          const c = buf ? buf[y * nCols + x] : engine && grid ? engine(x, y, tt, grid) : null;
          if (!c || c.v <= 0.02) {
            drawCell(x, y, tints.fill, tints.stroke);
            continue;
          }
          const [rr, gg, bb] = rgb[Math.max(0, Math.min(rgb.length - 1, c.c))];
          const a = 0.16 + 0.84 * Math.min(1, c.v);
          drawCell(x, y, `rgba(${rr}, ${gg}, ${bb}, ${a})`);
        }
      }
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < 100) return; // ~10fps: the reference moves in slow beats
      const dt = last === 0 ? 0.1 : Math.min(0.35, (now - last) / 1000);
      last = now;
      t += dt * speed;
      draw(t);
    };

    const start = () => {
      if (!raf && visible && active) raf = requestAnimationFrame(step);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };

    resize();
    draw(t); // static first frame even when inactive

    const ro = new ResizeObserver(() => {
      resize();
      draw(t);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(host);

    start();
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, story, nCols, nRows, active, isLight]);

  return (
    <figure
      ref={hostRef}
      className={`pixel-poster ${alwaysDark ? "poster-always-dark " : ""}${className}`.trim()}
    >
      <div className="pixel-poster-grid">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <figcaption>
        <div className="pixel-poster-title">{title}</div>
        <p className="pixel-poster-caption">{caption}</p>
      </figcaption>
    </figure>
  );
}
