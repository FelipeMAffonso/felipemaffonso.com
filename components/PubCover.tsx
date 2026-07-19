"use client";

/* ============================================================
   PubCover — the journal cover as a click-to-cycle artifact
   (Felipe's design, 2026-07-19). Inside an open publication
   panel the cover sits slightly larger than before and clicking
   it cycles three faces:
     1. the real journal cover (the photograph of record)
     2. the pixelized cover: the same cover rebuilt as living
        cells, palette sampled from the cover itself
        (lib/pixel-covers.json, built offline)
     3. the paper's motif: its poster engine running in the
        cover's portrait frame (no card chrome)
   Plays the "toggle" cue on each cycle. The covers=static
   variant keeps the plain locked cover (the fallback for the
   clean-navigation law).
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import type { Cover } from "@/lib/publications";
import { ENGINES, type Grid } from "@/lib/pixelEngine";
import { pubPosters } from "@/lib/posterConfigs";
import { usePixelVariants } from "@/lib/pixelVariants";
import { useSound } from "@/lib/sound";
import pixelCovers from "@/lib/pixel-covers.json";

type CoverMap = { cols: number; rows: number; palette: (string | null)[]; cells: number[] };
const MAPS = pixelCovers as Record<string, CoverMap>;

const CARD_BG = "#16171b";

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function CellCanvas({ map, pubId, face }: { map: CoverMap; pubId: string; face: 1 | 2 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceRef = useRef(face);
  faceRef.current = face;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cols, rows } = map;
    const mapRgb = map.palette.map((h) => (h ? hexToRgb(h) : null));
    const motif = pubPosters[pubId];
    const motifRgb = motif ? motif.spec.colors.map(hexToRgb) : [];
    const motifGrid: Grid | null = motif
      ? { cols, rows, seed: motif.spec.seed ?? 1, colorsN: motif.spec.colors.length, p: motif.spec.params ?? {} }
      : null;
    /* index 1 is the "paper" slot: dim so colored elements carry */
    const glimGrid: Grid = { cols, rows, seed: 5, colorsN: map.palette.length, p: { brightFrom: 99, base: 0.92, dimUpTo: 1 }, map: map.cells };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduced ? 0.4 : 1;

    let raf = 0, last = 0, t = 3.7, cell = 0;

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
      const w = canvas.clientWidth;
      ctx.clearRect(0, 0, w, cell * rows);
      ctx.fillStyle = CARD_BG;
      ctx.fillRect(0, 0, w, cell * rows);
      const isMotif = faceRef.current === 2 && motifGrid;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const pad = cell * 0.11;
          const s = cell - pad * 2;
          const r = Math.max(0.8, s * 0.18);
          let fill: string | null = null;
          if (isMotif && motifGrid) {
            const c = ENGINES[motif!.spec.engine](x, y, tt, motifGrid);
            if (c && c.v > 0.02) {
              const [rr, gg, bb] = motifRgb[Math.max(0, Math.min(motifRgb.length - 1, c.c))];
              fill = `rgba(${rr}, ${gg}, ${bb}, ${0.16 + 0.84 * Math.min(1, c.v)})`;
            } else {
              fill = "rgba(232, 232, 234, 0.035)";
            }
          } else {
            const c = ENGINES.glimmer(x, y, tt, glimGrid);
            if (c && c.v > 0.02) {
              const [rr, gg, bb] = mapRgb[Math.max(0, Math.min(mapRgb.length - 1, c.c))] ?? [22, 23, 27];
              fill = `rgba(${rr}, ${gg}, ${bb}, ${0.16 + 0.84 * Math.min(1, c.v)})`;
            } else {
              fill = "rgba(232, 232, 234, 0.035)";
            }
          }
          ctx.beginPath();
          ctx.roundRect(x * cell + pad, y * cell + pad, s, s, r);
          ctx.fillStyle = fill;
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
  }, [map, pubId]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}

export function PubCover({ cover, pubId }: { cover: Cover; pubId: string }) {
  const { covers } = usePixelVariants();
  const { play } = useSound();
  const [face, setFace] = useState<0 | 1 | 2>(0);

  const base = cover.src.split("/").pop() ?? "";
  const map = MAPS[base];
  const canCycle = covers === "cycle" && map && pubPosters[pubId];

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

  const cycle = () => {
    play("toggle");
    setFace((f) => ((f + 1) % 3) as 0 | 1 | 2);
  };

  const names = ["the journal cover", "the pixel cover", "the paper's motif"];
  return (
    <span
      className="pub-cover-wrap"
      role="button"
      tabIndex={0}
      title="Click to cycle: cover, pixels, motif"
      aria-label={`Cover art, showing ${names[face]}. Click to cycle.`}
      onClick={(e) => { e.stopPropagation(); cycle(); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); cycle(); }
      }}
    >
      {face === 0 ? (
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
      ) : (
        <span key={face} className="pub-cover pub-cover-face pub-cover-cells">
          <CellCanvas map={map} pubId={pubId} face={face as 1 | 2} />
        </span>
      )}
      <span className="pub-cover-dots" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i === face ? "is-on" : undefined} />
        ))}
      </span>
    </span>
  );
}
