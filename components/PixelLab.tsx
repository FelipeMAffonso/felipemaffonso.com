"use client";

/* ============================================================
   PixelLab (ADJUDICATION ONLY) — the showroom at /pixel-lab/.
   Every candidate of the pixel-poster system on one page, all
   running at once, so Felipe can compare without toggling:
   portrait modes side by side, every paper poster, the raw
   motif library (including engines no paper uses yet), the
   three Spears treatments, both title serifs, both icon sets,
   both footers. Deleted at bake along with the switcher.
   ============================================================ */

import { PortraitCanvas } from "./PixelPortrait";
import { PixelPoster } from "./PixelPoster";
import { LedStrip } from "./FooterLine";
import { pubPosters, teachingPoster } from "@/lib/posterConfigs";
import type { MotifSpec } from "@/lib/pixelEngine";
import spearsLed from "@/lib/spears-led.json";
import { ScholarIcon, GitHubSocialIcon, OsfSocialIcon, LinkedInIcon, XIcon, ExpertsIcon } from "./icons";
import {
  PixelScholarIcon, PixelGitHubIcon, PixelOsfIcon, PixelLinkedInIcon, PixelXIcon, PixelExpertsIcon,
} from "./pixelIcons";

const led = spearsLed as { cols: number; rows: number; palette: (string | null)[]; cells: number[] };
const LED_COLORS = led.palette.map((h) => h ?? "#17120e");

const DEMO_COLORS = ["#3fa7a0", "#d9a441", "#DA7756", "#f4e9d6"];

/* the full engine vocabulary on a neutral palette; glimmer is
   map-driven and shows through the Spears LED card below */
const LIBRARY: { title: string; caption: string; spec: MotifSpec }[] = [
  { title: "Drift", caption: "Creatures of light wander; overlap flashes white", spec: { engine: "drift", seed: 101, params: { blobs: 2, radius: 0.19 }, colors: DEMO_COLORS } },
  { title: "Tide", caption: "A wave builds, breaks, and recedes", spec: { engine: "tide", seed: 102, params: { cycle: 0.11 }, colors: DEMO_COLORS } },
  { title: "Blaze", caption: "Fire climbs the color ramp", spec: { engine: "blaze", seed: 103, params: { rise: 0.85 }, colors: DEMO_COLORS } },
  { title: "Converge", caption: "Scattered points travel to a destination", spec: { engine: "converge", seed: 104, params: { count: 26, speed: 0.045, tx: 0.78 }, colors: DEMO_COLORS } },
  { title: "Reveal", caption: "A curtain sweeps over a hidden block", spec: { engine: "reveal", seed: 105, params: { speed: 0.04 }, colors: DEMO_COLORS } },
  { title: "Spark", caption: "A calm field with blooming sparks", spec: { engine: "spark", seed: 106, params: { rate: 0.13, thresh: 0.975 }, colors: DEMO_COLORS } },
  { title: "Structure", caption: "Order pulses against noise", spec: { engine: "structure", seed: 107, params: { splitAt: 0.5, col: 0.78 }, colors: DEMO_COLORS } },
  { title: "Orbit", caption: "A breathing core with satellites", spec: { engine: "orbit", seed: 108, params: { sats: 5, radius: 0.46, squish: 1.35 }, colors: DEMO_COLORS } },
  { title: "Contagion", caption: "A front spreads from a seed and recedes", spec: { engine: "contagion", seed: 109, params: { speed: 0.045 }, colors: DEMO_COLORS } },
  { title: "Band", caption: "A point cluster against a breathing band", spec: { engine: "band", seed: 110, params: { cycle: 0.16 }, colors: DEMO_COLORS } },
];

const ICON_ROWS = [
  { label: "Google Scholar", brand: ScholarIcon, pixel: PixelScholarIcon },
  { label: "GitHub", brand: GitHubSocialIcon, pixel: PixelGitHubIcon },
  { label: "Open Science Framework", brand: OsfSocialIcon, pixel: PixelOsfIcon },
  { label: "LinkedIn", brand: LinkedInIcon, pixel: PixelLinkedInIcon },
  { label: "X (Twitter)", brand: XIcon, pixel: PixelXIcon },
  { label: "OSU Experts Profile", brand: ExpertsIcon, pixel: PixelExpertsIcon },
];

function LabNote({ children }: { children: React.ReactNode }) {
  return <p className="lab-note">{children}</p>;
}

export function PixelLab() {
  return (
    <main className="page page-wide pixel-lab">
      <section className="section">
        <h2 className="section-title">What this page is</h2>
        <LabNote>
          Every candidate of the pixel-poster system, all running at once, for adjudication.
          The inspiration is the animated LED-grid poster language from its_sslvr on X
          (the &quot;lost in mosaic&quot; and &quot;Pixel+wave&quot; studies). This page and the
          floating switcher are dev-only and get deleted once the picks are baked. The
          switcher (bottom right) still works here: it drives the live pages; this page
          shows everything side by side regardless of the picks.
        </LabNote>
      </section>

      <section className="section">
        <h2 className="section-title">Portrait flip (Home) — the two candidates</h2>
        <LabNote>
          On the Home page this is the back of the photo card: click the headshot to flip.
          Constellation is the reference register (mostly dark, a breathing subset lit,
          white-hot cores). Mosaic keeps the full likeness gently alive.
        </LabNote>
        <div className="lab-portraits">
          <figure className="lab-portrait">
            <div className="lab-portrait-box"><PortraitCanvas mode="constellation" /></div>
            <figcaption>constellation</figcaption>
          </figure>
          <figure className="lab-portrait">
            <div className="lab-portrait-box"><PortraitCanvas mode="mosaic" /></div>
            <figcaption>mosaic</figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Paper posters — one per publication</h2>
        <LabNote>
          Each shows inside its publication panel on Research, under the abstract. The
          motif is chosen to echo the paper; every palette carries one coral note.
        </LabNote>
        <div className="lab-grid">
          {Object.entries(pubPosters).map(([id, cfg]) => (
            <div className="lab-cell" key={id}>
              <PixelPoster spec={cfg.spec} cols={cfg.cols} rows={cfg.rows} title={cfg.title} caption={cfg.caption} />
              <div className="lab-tag">{id}</div>
            </div>
          ))}
          <div className="lab-cell">
            <PixelPoster
              spec={teachingPoster.spec}
              cols={teachingPoster.cols}
              rows={teachingPoster.rows}
              title={teachingPoster.title}
              caption={teachingPoster.caption}
            />
            <div className="lab-tag">teaching page</div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Motif library — the full vocabulary</h2>
        <LabNote>
          The raw engines on a neutral palette, including ones no surface uses yet
          (Converge is unassigned; it would suit a data-collection or pipeline story).
          Any paper can switch motifs by editing lib/posterConfigs.ts.
        </LabNote>
        <div className="lab-grid">
          {LIBRARY.map((m) => (
            <div className="lab-cell" key={m.title}>
              <PixelPoster spec={m.spec} cols={19} rows={13} title={m.title} caption={m.caption} />
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Spears card (Contact) — the three treatments</h2>
        <div className="lab-stack">
          <div>
            <div className="lab-tag">scanline (a slow CRT band drifts over the dither)</div>
            <figure className="dither-card">
              <div className="dither-card-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/spears-dither.png" alt="Spears building, dithered" width={1337} height={337} loading="lazy" />
              </div>
              <figcaption>
                <div className="pixel-poster-title">Spears School of Business</div>
                <p className="pixel-poster-caption">316 Business Building, Stillwater, Oklahoma</p>
              </figcaption>
            </figure>
          </div>
          <div>
            <div className="lab-tag">still (texture only, no motion)</div>
            <figure className="dither-card is-still">
              <div className="dither-card-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/spears-dither.png" alt="Spears building, dithered, still" width={1337} height={337} loading="lazy" />
              </div>
              <figcaption>
                <div className="pixel-poster-title">Spears School of Business</div>
                <p className="pixel-poster-caption">316 Business Building, Stillwater, Oklahoma</p>
              </figcaption>
            </figure>
          </div>
          <div>
            <div className="lab-tag">LED grid (rebuilt as cells; the lamps and windows flicker)</div>
            <PixelPoster
              spec={{ engine: "glimmer", seed: 71, colors: LED_COLORS, params: { brightFrom: 7, dimUpTo: 2 }, map: led.cells }}
              cols={led.cols}
              rows={led.rows}
              title="Spears School of Business"
              caption="316 Business Building, Stillwater, Oklahoma"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Poster title serif — the two candidates</h2>
        <div className="lab-fonts">
          <div className="lab-font-sample">
            <div className="pixel-poster-title">A Wandering Mind</div>
            <div className="lab-tag">Ultra (current default)</div>
          </div>
          <div className="lab-font-sample posterfont-alfa">
            <div className="pixel-poster-title">A Wandering Mind</div>
            <div className="lab-tag">Alfa Slab One</div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Profile icons (Contact) — brand vs pixel</h2>
        <div className="lab-icons">
          {ICON_ROWS.map((r) => (
            <div className="lab-icon-row" key={r.label}>
              <span className="lab-icon-cell"><r.brand /></span>
              <span className="lab-icon-cell"><r.pixel /></span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Footer — the two candidates</h2>
        <div className="lab-stack">
          <div>
            <div className="lab-tag">coral line (current)</div>
            <div className="lab-footer-box"><div className="footer-line-inner" /></div>
          </div>
          <div>
            <div className="lab-tag">LED strip</div>
            <div className="lab-footer-box"><LedStrip /></div>
          </div>
        </div>
      </section>
    </main>
  );
}
