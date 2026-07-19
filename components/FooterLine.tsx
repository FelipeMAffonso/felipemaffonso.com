"use client";

/* ============================================================
   FooterLine — variant-aware footer.
   footer=line keeps the established coral gradient hairline;
   footer=led replaces it with a small LED strip: a 40x3 cell
   grid running the spark engine, dim and calm, a signature of
   the poster language at the bottom of every page.
   ============================================================ */

import { useEffect, useRef } from "react";
import { ENGINES, type Grid } from "@/lib/pixelEngine";
import { usePixelVariants } from "@/lib/pixelVariants";

const COLS = 40;
const ROWS = 3;
const COLORS = ["#8a7f72", "#d9a441", "#DA7756", "#f4e9d6"];

function LedStrip() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grid: Grid = { cols: COLS, rows: ROWS, seed: 61, colorsN: COLORS.length, p: { rate: 0.1, thresh: 0.985 } };
    const rgb = COLORS.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduced ? 0.4 : 1;

    let raf = 0;
    let last = 0;
    let t = 0;
    let cell = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      if (w === 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cell = w / COLS;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(cell * ROWS * dpr);
      canvas.style.height = `${Math.round(cell * ROWS)}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (tt: number) => {
      ctx.clearRect(0, 0, canvas.clientWidth, cell * ROWS);
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const pad = cell * 0.16;
          const s = cell - pad * 2;
          const r = Math.max(0.8, s * 0.2);
          const c = ENGINES.spark(x, y, tt, grid);
          ctx.beginPath();
          ctx.roundRect(x * cell + pad, y * cell + pad, s, s, r);
          if (!c || c.v <= 0.02) {
            ctx.fillStyle = "rgba(128, 120, 110, 0.10)";
          } else {
            const [rr, gg, bb] = rgb[Math.max(0, Math.min(rgb.length - 1, c.c))];
            ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${0.15 + 0.6 * Math.min(1, c.v)})`;
          }
          ctx.fill();
        }
      }
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < 100) return;
      const dt = last === 0 ? 0.1 : Math.min(0.35, (now - last) / 1000);
      last = now;
      t += dt * speed;
      draw(t);
    };

    resize();
    draw(0);
    const ro = new ResizeObserver(() => {
      resize();
      draw(t);
    });
    ro.observe(canvas);
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="footer-led">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

export function FooterLine() {
  const { footer } = usePixelVariants();
  if (footer === "led") return <LedStrip />;
  return <div className="footer-line-inner" />;
}
