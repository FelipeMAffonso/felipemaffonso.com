"use client";

/* ============================================================
   PubCover — the cover as a two-face artifact (Felipe's design,
   2026-07-19). Inside an open publication panel the cover slot
   (about 170px, between the old 92px cover and the rail card)
   shows the paper's PIXEL STORY by default; clicking it flips
   to the real journal cover, and again back to the story. Two
   pager dots under it. Plays the "toggle" cue. The covers=
   static variant keeps the plain locked cover as the fallback.
   The story face adapts to light/dark like every poster card.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import type { Cover } from "@/lib/publications";
import { ENGINES, type Grid } from "@/lib/pixelEngine";
import { STORIES, renderStory } from "@/lib/pixelStories";
import { pubPosters } from "@/lib/posterConfigs";
import { adaptPalette, useIsLight, CELL_TINTS } from "@/lib/pixelTheme";
import { usePixelVariants } from "@/lib/pixelVariants";
import { useSound } from "@/lib/sound";

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function StoryCanvas({ pubId }: { pubId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLight = useIsLight();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = pubPosters[pubId];
    if (!cfg) return;
    const storyDef = cfg.story ? STORIES[cfg.story] : undefined;
    const cols = storyDef ? storyDef.cols : (cfg.cols ?? 20);
    const rows = storyDef ? storyDef.rows : (cfg.rows ?? 14);
    const colors = adaptPalette(storyDef ? storyDef.colors : (cfg.spec?.colors ?? []), isLight);
    const rgb = colors.map(hexToRgb);
    const tints = isLight ? CELL_TINTS.light : CELL_TINTS.dark;
    const grid: Grid | null = cfg.spec
      ? { cols, rows, seed: cfg.spec.seed ?? 1, colorsN: cfg.spec.colors.length, p: cfg.spec.params ?? {}, map: cfg.spec.map }
      : null;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduced ? 0.4 : 1;
    let raf = 0, last = 0, t = 2.3, cell = 0;

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

    const draw = (tt: number) => {
      ctx.clearRect(0, 0, canvas.clientWidth, cell * rows);
      const buf = storyDef ? renderStory(storyDef, tt) : null;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const pad = cell * 0.11;
          const s = cell - pad * 2;
          const r = Math.max(0.8, s * 0.18);
          const c = buf
            ? buf[y * cols + x]
            : cfg.spec && grid
              ? ENGINES[cfg.spec.engine](x, y, tt, grid)
              : null;
          ctx.beginPath();
          ctx.roundRect(x * cell + pad, y * cell + pad, s, s, r);
          if (!c || c.v <= 0.02) {
            ctx.fillStyle = tints.fill;
          } else {
            const [rr, gg, bb] = rgb[Math.max(0, Math.min(rgb.length - 1, c.c))];
            ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${0.16 + 0.84 * Math.min(1, c.v)})`;
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
    draw(t);
    const ro = new ResizeObserver(() => { resize(); draw(t); });
    ro.observe(canvas);
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [pubId, isLight]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}

export function PubCover({ cover, pubId }: { cover: Cover; pubId: string }) {
  const { covers } = usePixelVariants();
  const { play } = useSound();
  const [face, setFace] = useState<0 | 1>(0); // 0 = story, 1 = real cover

  const canCycle = covers === "cycle" && pubPosters[pubId];

  if (!canCycle) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="pub-cover"
        src={cover.src}
        alt={cover.alt}
        width={cover.w}
        height={cover.h}
        style={cover.style}
        loading="lazy"
      />
    );
  }

  const flip = () => {
    play("toggle");
    setFace((f) => (f === 0 ? 1 : 0));
  };

  return (
    <span
      className="pub-cover-wrap"
      role="button"
      tabIndex={0}
      title="Click to flip: story / journal cover"
      aria-label={`Cover art, showing ${face === 0 ? "the paper's pixel story" : "the journal cover"}. Click to flip.`}
      onClick={(e) => { e.stopPropagation(); flip(); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); flip(); }
      }}
    >
      {face === 0 ? (
        <span key="story" className="pub-cover pub-cover-face pub-cover-cells">
          <StoryCanvas pubId={pubId} />
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key="real"
          className="pub-cover pub-cover-face"
          src={cover.src}
          alt={cover.alt}
          width={cover.w}
          height={cover.h}
          style={cover.style}
          loading="lazy"
        />
      )}
      <span className="pub-cover-dots" aria-hidden="true">
        {[0, 1].map((i) => (
          <span key={i} className={i === face ? "is-on" : undefined} />
        ))}
      </span>
    </span>
  );
}
