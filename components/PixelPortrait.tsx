"use client";

/* ============================================================
   PixelPortrait — the Home easter egg.
   The headshot sits in its normal .hero-photo box; clicking it
   flips the card to a living LED-grid portrait and clicking
   again flips back. The back is NOT a pixelated photo: in the
   reference language the grid stays mostly dark and a breathing
   constellation of lit cells traces the features. The spatial
   map (which cell belongs to the face, how bright it can get)
   comes from lib/pixel-portrait.json, generated offline by
   scripts/build-pixel-portrait.mjs; each frame the animation
   decides which few cells are actually lit:
   - bright feature cells (glasses band, beard, hair edge) are
     mostly stable, the brightest get white-hot cores;
   - mid cells flicker in and out on noise;
   - the whole density swells toward a fuller likeness and
     recedes on a slow cycle, like the reference wave;
   - corner anchors stay dimly lit; rare coral glints pass by.
   The "mosaic" variant keeps the full map lit, gently alive.
   Plays the "toggle" cue on flip (a deliberate action; hover
   stays silent per the sound law).

   PortraitCanvas is exported separately so the /pixel-lab/
   adjudication page can mount both modes side by side.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { useSound } from "@/lib/sound";
import { usePixelVariants } from "@/lib/pixelVariants";
import portrait from "@/lib/pixel-portrait.json";

function fract(n: number) {
  return n - Math.floor(n);
}
function hash3(x: number, y: number, z: number) {
  return fract(Math.sin(x * 127.1 + y * 269.5 + z * 419.2) * 43758.5453);
}
function smooth(u: number) {
  return u * u * (3 - 2 * u);
}
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi);
  const l = (a: number, b: number, u: number) => a + (b - a) * u;
  const x00 = l(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), xf);
  const x10 = l(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), xf);
  const x01 = l(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), xf);
  const x11 = l(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), xf);
  return l(l(x00, x10, yf), l(x01, x11, yf), zf);
}

const ANCHOR = "rgba(160, 155, 148, 0.5)";
const UNLIT_FILL = "rgba(244, 233, 216, 0.022)";
const UNLIT_STROKE = "rgba(244, 233, 216, 0.05)";

export type PortraitMode = "constellation" | "mosaic";

export function PortraitCanvas({ mode, active = true }: { mode: PortraitMode; active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cols, rows, palette, cells } = portrait as {
      cols: number;
      rows: number;
      palette: (string | null)[];
      cells: number[];
    };
    const rgb = palette.map((hex) =>
      hex
        ? ([parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)] as const)
        : null,
    );

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduced ? 0.4 : 1;

    let raf = 0;
    let last = 0;
    let t = 0;
    let cell = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cell = Math.min(w / cols, h / rows);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (tt: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const ox = (w - cell * cols) / 2;
      const oy = (h - cell * rows) / 2;
      /* the breath: density swells toward a fuller likeness and recedes */
      const breath = 0.34 + 0.42 * (0.5 + 0.5 * Math.sin(tt * 0.55));
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = ox + x * cell;
          const py = oy + y * cell;
          const pad = cell * 0.13;
          const s = cell - pad * 2;
          const r = Math.max(1, s * 0.18);
          const paint = (fill: string, stroke?: string) => {
            ctx.beginPath();
            ctx.roundRect(px + pad, py + pad, s, s, r);
            ctx.fillStyle = fill;
            ctx.fill();
            if (stroke) {
              ctx.strokeStyle = stroke;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          };
          const corner = (x === 0 || x === cols - 1) && (y === 0 || y === rows - 1);
          if (corner) {
            paint(ANCHOR);
            continue;
          }
          const idx = cells[y * cols + x];
          const base = rgb[idx];
          const strength = idx === 0 ? 0 : idx === 9 ? 0.72 : idx / 8; // coral sits mid-bright
          let lit = false;
          let vv = 0;
          let cc: readonly [number, number, number] | null = base;
          if (base && strength > 0 && modeRef.current === "mosaic") {
            /* mosaic variant: the full map stays lit, gently alive */
            lit = true;
            const wob = 0.85 + 0.15 * noise3(x * 0.9, y * 0.9, tt * 0.6);
            vv = Math.min(1, (0.3 + 0.7 * strength) * wob);
          } else if (base && strength > 0) {
            /* constellation variant: stable features, flickering
               mids, breathing density */
            const gate = noise3(x * 0.55, y * 0.55, tt * 0.5);
            lit = gate < breath + (strength - 0.45) * 0.9;
            if (lit) {
              const wob = 0.72 + 0.28 * noise3(x * 0.9, y * 0.9, tt * 0.8);
              vv = Math.min(1, (0.25 + strength) * wob);
              /* white-hot core on the brightest feature cells */
              if (strength > 0.82 && hash3(x, y, Math.floor(tt * 1.5)) > 0.35) {
                cc = [246, 240, 228];
                vv = Math.min(1, vv + 0.25);
              }
            }
          } else if (hash3(x, y, 7.7) > 0.988 && noise3(x * 0.3, y * 0.3, tt * 0.3) > 0.6) {
            /* rare coral glints drifting through the dark field */
            cc = [218, 119, 86];
            vv = 0.18;
            lit = true;
          }
          if (!lit || !cc) {
            paint(UNLIT_FILL, UNLIT_STROKE);
            continue;
          }
          const a = 0.14 + 0.86 * vv;
          paint(`rgba(${cc[0]}, ${cc[1]}, ${cc[2]}, ${a})`);
        }
      }
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (!activeRef.current) return; // parked; face side showing
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

  return <canvas ref={canvasRef} aria-hidden="true" />;
}

export function PixelPortrait() {
  const [flipped, setFlipped] = useState(false);
  const { play } = useSound();
  const { portrait: mode } = usePixelVariants();

  const flip = () => {
    play("toggle");
    setFlipped((f) => !f);
  };

  return (
    <div
      className={`hero-photo pixel-portrait${flipped ? " flipped" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label="Flip the photo to a pixel portrait"
      onClick={flip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flip();
        }
      }}
    >
      <div className="pixel-portrait-inner">
        <div className="pixel-portrait-face pixel-portrait-front">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/headshot.jpg" alt="Felipe M. Affonso" width={591} height={775} />
        </div>
        <div className="pixel-portrait-face pixel-portrait-back">
          <PortraitCanvas mode={mode} active={flipped} />
        </div>
      </div>
    </div>
  );
}
