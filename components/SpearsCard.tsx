"use client";

/* ============================================================
   SpearsCard — the Contact poster, a click-to-cycle artifact
   (Felipe's design, 2026-07-19). Three faces, the CRT scanline
   riding on ALL of them:
     1. the fine dither still
     2. the LED grid rebuild (lamps and windows flicker)
     3. the chunky pixel art
   Three pager dots; the "toggle" cue on each cycle. The scene
   is dusk, so the card stays dark in both themes (alwaysDark).
   ============================================================ */

import { useState, type CSSProperties } from "react";
import { PixelPoster } from "./PixelPoster";
import { useSound } from "@/lib/sound";
import spearsLed from "@/lib/spears-led.json";

const led = spearsLed as { cols: number; rows: number; palette: (string | null)[]; cells: number[] };
const LED_COLORS = led.palette.map((h) => h ?? "#16171b");

export function SpearsCard() {
  const { play } = useSound();
  const [face, setFace] = useState<0 | 1 | 2>(0);

  const cycle = () => {
    play("toggle");
    setFace((f) => ((f + 1) % 3) as 0 | 1 | 2);
  };

  const names = ["the dithered photograph", "the LED grid", "the pixel art"];
  return (
    <figure
      className="dither-card spears-cycle enter"
      style={{ "--enter-i": 2 } as CSSProperties}
      role="button"
      tabIndex={0}
      title="Click to cycle: dither, LED, pixel art"
      aria-label={`The Spears building, showing ${names[face]}. Click to cycle.`}
      onClick={cycle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cycle(); }
      }}
    >
      <div className="dither-card-media" key={face}>
        {face === 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/images/spears-dither.png" alt="" width={1337} height={337} loading="lazy" />
        )}
        {face === 1 && (
          <div className="spears-led-face">
            <PixelPoster
              spec={{ engine: "glimmer", seed: 71, colors: LED_COLORS, params: { brightFrom: 7, dimUpTo: 2 }, map: led.cells }}
              cols={led.cols}
              rows={led.rows}
              title=""
              caption=""
              alwaysDark
            />
          </div>
        )}
        {face === 2 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/spears-pixel.png"
            alt=""
            width={1344}
            height={336}
            loading="lazy"
            style={{ imageRendering: "pixelated" }}
          />
        )}
      </div>
      <figcaption>
        <div className="pixel-poster-title">Spears School of Business</div>
        <p className="pixel-poster-caption">316 Business Building, Stillwater, Oklahoma</p>
        <span className="pub-cover-dots spears-dots" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i === face ? "is-on" : undefined} />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
