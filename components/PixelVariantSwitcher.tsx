"use client";

/* ============================================================
   PixelVariantSwitcher (DEV/ADJUDICATION ONLY).
   The floating bottom-right panel for the pixel-poster
   adjudication, same anatomy as the retired July 17 switcher:
   collapsed pill, expanded card of segmented rows, live changes,
   "Copy picks" for reporting the chosen line. A Theme row rides
   along so every option can be judged in both themes.
   ============================================================ */

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useSound } from "@/lib/sound";
import { usePixelVariants, useSetPixelVariant, type PixelVariants } from "@/lib/pixelVariants";

type Opt = { value: string; label: string };
type Row = { key: keyof PixelVariants; label: string; options: Opt[]; note?: string };

const ROWS: Row[] = [
  {
    key: "portrait",
    label: "Portrait flip (Home, click the photo)",
    options: [
      { value: "constellation", label: "constellation" },
      { value: "mosaic", label: "mosaic" },
    ],
  },
  {
    key: "posterfont",
    label: "Poster title serif",
    options: [
      { value: "ultra", label: "Ultra" },
      { value: "alfa", label: "Alfa Slab" },
    ],
  },
  {
    key: "pubposters",
    label: "Paper posters (Research panels)",
    options: [
      { value: "on", label: "on" },
      { value: "off", label: "off" },
    ],
  },
  {
    key: "teachingposter",
    label: "Teaching poster",
    options: [
      { value: "on", label: "on" },
      { value: "off", label: "off" },
    ],
  },
  {
    key: "spears",
    label: "Spears card (Contact)",
    options: [
      { value: "scan", label: "scanline" },
      { value: "still", label: "still" },
      { value: "led", label: "LED grid" },
    ],
  },
  {
    key: "icons",
    label: "Profile icons (Contact)",
    options: [
      { value: "brand", label: "brand" },
      { value: "pixel", label: "pixel" },
    ],
  },
  {
    key: "navhover",
    label: "Nav hover underline",
    options: [
      { value: "gradient", label: "gradient" },
      { value: "cells", label: "cells" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    options: [
      { value: "line", label: "coral line" },
      { value: "led", label: "LED strip" },
    ],
  },
];

const THEME_OPTS: Opt[] = [
  { value: "light", label: "light" },
  { value: "dark", label: "dark" },
  { value: "system", label: "system" },
];

function Caret() {
  return (
    <svg className="vswitch-caret" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function PixelVariantSwitcher() {
  const variants = usePixelVariants();
  const setVariant = useSetPixelVariant();
  const { play } = useSound();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tap = () => play("tick");

  const picks = (Object.keys(variants) as (keyof PixelVariants)[])
    .map((k) => `${k}=${variants[k]}`)
    .join(" ");

  const copyPicks = async () => {
    try {
      await navigator.clipboard.writeText(picks);
      setCopied(true);
      play("success");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked, no confirmation */
    }
  };

  return (
    <div className="vswitch" data-open={open ? "true" : "false"}>
      {open && (
        <div className="vswitch-panel" role="group" aria-label="Pixel design options">
          {ROWS.map((row) => (
            <div className="vswitch-row" key={row.key}>
              <span className="vswitch-label">{row.label}</span>
              <div className="vswitch-seg" role="group" aria-label={row.label}>
                {row.options.map((o) => {
                  const active = variants[row.key] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      className={`vswitch-btn${active ? " is-active" : ""}`}
                      aria-pressed={active}
                      onClick={() => {
                        setVariant(row.key, o.value as never);
                        tap();
                      }}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="vswitch-row">
            <span className="vswitch-label">Theme</span>
            <div className="vswitch-seg" role="group" aria-label="Theme">
              {THEME_OPTS.map((o) => {
                const active = mounted && theme === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    className={`vswitch-btn${active ? " is-active" : ""}`}
                    aria-pressed={active}
                    onClick={() => {
                      setTheme(o.value);
                      tap();
                    }}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="button" className="vswitch-copy" onClick={copyPicks}>
            {copied ? "Copied" : "Copy picks"}
          </button>
        </div>
      )}

      <button
        type="button"
        className="vswitch-fab"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          tap();
        }}
      >
        <span>Pixel options</span>
        <Caret />
      </button>
    </div>
  );
}
