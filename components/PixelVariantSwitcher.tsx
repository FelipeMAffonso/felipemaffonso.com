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
    label: "Home: click the photo, the back of the flip",
    options: [
      { value: "constellation", label: "constellation" },
      { value: "mosaic", label: "mosaic" },
    ],
  },
  {
    key: "posterfont",
    label: "Every poster card: the title typeface",
    options: [
      { value: "ultra", label: "Ultra" },
      { value: "alfa", label: "Alfa Slab" },
    ],
  },
  {
    key: "reslayout",
    label: "Research: the page layout itself",
    options: [
      { value: "list", label: "list" },
      { value: "rail", label: "art rail" },
      { value: "gallery", label: "gallery" },
    ],
  },
  {
    key: "covers",
    label: "Research: the cover inside an open panel",
    options: [
      { value: "static", label: "static" },
      { value: "cycle", label: "click-to-cycle" },
    ],
  },
  {
    key: "pubposters",
    label: "Research: poster inside each open panel",
    options: [
      { value: "on", label: "on" },
      { value: "off", label: "off" },
    ],
  },
  {
    key: "teachingposter",
    label: "Teaching: poster after the student quotes",
    options: [
      { value: "on", label: "on" },
      { value: "off", label: "off" },
    ],
  },
  {
    key: "spears",
    label: "Contact: the Spears building card",
    options: [
      { value: "scan", label: "scanline" },
      { value: "still", label: "still" },
      { value: "led", label: "LED" },
      { value: "pixelart", label: "pixel art" },
    ],
  },
  {
    key: "icons",
    label: "Icons everywhere (Contact, Research buttons, CV, nav toggles)",
    options: [
      { value: "brand", label: "brand" },
      { value: "pixel", label: "pixel" },
    ],
  },
  {
    key: "navicons",
    label: "Nav tabs: icons next to Home, Research, ...",
    options: [
      { value: "off", label: "none" },
      { value: "line", label: "line" },
      { value: "pixel", label: "pixel" },
    ],
  },
  {
    key: "navhover",
    label: "Nav: hover a tab, the underline",
    options: [
      { value: "gradient", label: "gradient" },
      { value: "cells", label: "cells" },
    ],
  },
  {
    key: "footer",
    label: "Every page bottom: the footer mark",
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
