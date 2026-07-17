"use client";

/* ============================================================
   VariantSwitcher (DEV/ADJUDICATION ONLY).
   Floating bottom-right control, mounted once in Providers so it rides
   every page. Collapsed: a small "Options" pill. Expanded: a compact
   card with one row per axis, each row a segmented control. Changes
   apply live, no reload. "Copy picks" copies the current live line.

   Nav / entrance / accordion / theme animation / name weight / dark
   palette persist through lib/variants.tsx. The Sound and Theme rows
   surface the existing controls (useSound + next-themes) so
   Felipe can adjudicate the shipping default without a second widget.
   Remove this file (and its mount in Providers) to strip the surface.
   ============================================================ */

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useSound } from "@/lib/sound";
import { useVariants, useSetVariant, type Variants } from "@/lib/variants";

type Opt = { value: string; label: string };
type Row = { key: keyof Variants; label: string; options: Opt[] };

// Rows backed by lib/variants.tsx. Entrance value "none" is labelled
// "instant" in the UI but keeps the stored value "none".
const ROWS: Row[] = [
  {
    key: "nav",
    label: "Nav hover",
    options: [
      { value: "underline", label: "underline" },
      { value: "pill", label: "pill" },
      { value: "slide", label: "slide" },
    ],
  },
  {
    key: "entrance",
    label: "Entrance",
    options: [
      { value: "stagger", label: "stagger" },
      { value: "fade", label: "fade" },
      { value: "none", label: "instant" },
    ],
  },
  {
    key: "accordion",
    label: "Accordion",
    options: [
      { value: "crisp", label: "crisp" },
      { value: "soft", label: "soft" },
    ],
  },
  {
    key: "themeanim",
    label: "Theme animation",
    options: [
      { value: "morph", label: "morph" },
      { value: "swap", label: "swap" },
    ],
  },
  {
    key: "heroweight",
    label: "Name weight",
    options: [
      { value: "600", label: "600" },
      { value: "500", label: "500" },
      { value: "300", label: "300" },
    ],
  },
  {
    key: "darktheme",
    label: "Dark palette",
    options: [
      { value: "cool", label: "cool" },
      { value: "warm", label: "warm" },
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

export function VariantSwitcher() {
  const variants = useVariants();
  const setVariant = useSetVariant();
  const { enabled, toggle, play } = useSound();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tap = () => play("tick");

  const applyVariant = (key: keyof Variants, value: string) => {
    setVariant(key, value as never);
    tap();
  };

  const applySound = (want: boolean) => {
    if (want === enabled) {
      if (want) play("tick");
      return;
    }
    // toggle() flips the state and plays the turn-on cue (silent on turn-off)
    toggle();
  };

  const applyTheme = (value: string) => {
    setTheme(value);
    tap();
  };

  const soundState = enabled ? "on" : "off";
  const themeState = mounted && theme ? theme : "light";
  const picks = `nav=${variants.nav} entrance=${variants.entrance} accordion=${variants.accordion} themeanim=${variants.themeanim} sound=${soundState} heroweight=${variants.heroweight} darktheme=${variants.darktheme} theme=${themeState}`;

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
        <div className="vswitch-panel" role="group" aria-label="Design options">
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
                      onClick={() => applyVariant(row.key, o.value)}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="vswitch-row">
            <span className="vswitch-label">Sound</span>
            <div className="vswitch-seg" role="group" aria-label="Sound">
              {[
                { value: "on", on: true },
                { value: "off", on: false },
              ].map((o) => {
                const active = mounted && enabled === o.on;
                return (
                  <button
                    key={o.value}
                    type="button"
                    className={`vswitch-btn${active ? " is-active" : ""}`}
                    aria-pressed={active}
                    onClick={() => applySound(o.on)}
                  >
                    {o.value}
                  </button>
                );
              })}
            </div>
          </div>

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
                    onClick={() => applyTheme(o.value)}
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
        <span>Options</span>
        <Caret />
      </button>
    </div>
  );
}
