"use client";

/* ============================================================
   PixelPoster — the animated LED-grid poster card.
   A fixed grid of flat rounded cells on a dark card; unlit cells
   stay faintly visible; the four corner cells are permanently
   dim gray anchors; a slow motif (lib/pixelEngine) moves through
   the lit cells. Below the grid: a slab-serif title and a quiet
   caption, the reference poster anatomy.

   Runs its loop only while on screen (IntersectionObserver) and
   while `active` is true; reduced motion runs the same loop at
   0.4x speed (site policy: calmer, never frozen).
   ============================================================ */

import { useEffect, useRef } from "react";
import { ENGINES, type Grid, type MotifSpec } from "@/lib/pixelEngine";

type Props = {
  spec: MotifSpec;
  cols: number;
  rows: number;
  title: string;
  caption: string;
  active?: boolean;
  className?: string;
};

const CARD_CELL = "rgba(244, 233, 216, 0.055)"; // unlit cell outline
const CARD_CELL_FILL = "rgba(244, 233, 216, 0.022)"; // unlit cell fill
const ANCHOR = "rgba(160, 155, 148, 0.55)"; // corner anchor cells

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function PixelPoster({ spec, cols, rows, title, caption, active = true, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grid: Grid = {
      cols,
      rows,
      seed: spec.seed ?? 1,
      colorsN: spec.colors.length,
      p: spec.params ?? {},
      map: spec.map,
    };
    const engine = ENGINES[spec.engine];
    const rgb = spec.colors.map(hexToRgb);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduced ? 0.4 : 1;

    let raf = 0;
    let last = 0;
    let t = (spec.seed ?? 1) * 7.31; // desync sibling posters
    let visible = true;
    let cell = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      if (w === 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cell = w / cols;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(cell * rows * dpr);
      canvas.style.height = `${Math.round(cell * rows)}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawCell = (x: number, y: number, fill: string) => {
      const pad = cell * 0.13;
      const s = cell - pad * 2;
      const r = Math.max(1.5, s * 0.18);
      ctx.beginPath();
      ctx.roundRect(x * cell + pad, y * cell + pad, s, s, r);
      ctx.fillStyle = fill;
      ctx.fill();
    };

    const draw = (tt: number) => {
      ctx.clearRect(0, 0, canvas.clientWidth, cell * rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const corner = (x === 0 || x === cols - 1) && (y === 0 || y === rows - 1);
          if (corner) {
            drawCell(x, y, ANCHOR);
            continue;
          }
          const c = engine(x, y, tt, grid);
          if (!c || c.v <= 0.02) {
            /* unlit: faint outline square */
            const pad = cell * 0.13;
            const s = cell - pad * 2;
            const r = Math.max(1.5, s * 0.18);
            ctx.beginPath();
            ctx.roundRect(x * cell + pad, y * cell + pad, s, s, r);
            ctx.fillStyle = CARD_CELL_FILL;
            ctx.fill();
            ctx.strokeStyle = CARD_CELL;
            ctx.lineWidth = 1;
            ctx.stroke();
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
  }, [spec, cols, rows, active]);

  return (
    <figure ref={hostRef} className={`pixel-poster ${className}`.trim()}>
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
