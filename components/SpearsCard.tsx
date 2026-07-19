"use client";

/* ============================================================
   SpearsCard — the Contact page poster, variant-aware.
   spears=scan     the fine-dither image with a slow CRT scanline
                   shimmer (CSS; the data-spears attribute drives it)
   spears=still    the same image, no moving shimmer
   spears=led      the coarse LED-grid rebuild (lib/spears-led.json)
                   running the glimmer engine: lamps and lit windows
                   flicker like dusk
   The title/caption anatomy is shared with the pixel posters.
   ============================================================ */

import type { CSSProperties } from "react";
import { usePixelVariants } from "@/lib/pixelVariants";
import { PixelPoster } from "./PixelPoster";
import spearsLed from "@/lib/spears-led.json";

const led = spearsLed as { cols: number; rows: number; palette: (string | null)[]; cells: number[] };
const LED_COLORS = led.palette.map((h) => h ?? "#17120e");

export function SpearsCard() {
  const { spears } = usePixelVariants();

  if (spears === "led") {
    return (
      <div className="spears-led enter" style={{ "--enter-i": 2 } as CSSProperties}>
        <PixelPoster
          spec={{
            engine: "glimmer",
            seed: 71,
            colors: LED_COLORS,
            params: { brightFrom: 7, dimUpTo: 2 },
            map: led.cells,
          }}
          cols={led.cols}
          rows={led.rows}
          title="Spears School of Business"
          caption="316 Business Building, Stillwater, Oklahoma"
        />
      </div>
    );
  }

  return (
    <figure className="dither-card enter" style={{ "--enter-i": 2 } as CSSProperties}>
      <div className="dither-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/spears-dither.png"
          alt="The Spears School of Business building, rendered in dithered pixels"
          width={1337}
          height={337}
          loading="lazy"
        />
      </div>
      <figcaption>
        <div className="pixel-poster-title">Spears School of Business</div>
        <p className="pixel-poster-caption">316 Business Building, Stillwater, Oklahoma</p>
      </figcaption>
    </figure>
  );
}
