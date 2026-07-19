"use client";

/* ============================================================
   PixelLab (ADJUDICATION ONLY) — the showroom at /pixel-lab/.
   Every candidate of the pixel-poster system on one page, all
   running at once, plus the reference stills and the research
   layout candidates. Deleted at bake with the switcher.
   ============================================================ */

import { PortraitCanvas } from "./PixelPortrait";
import { PixelPoster } from "./PixelPoster";
import { LedStrip } from "./FooterLine";
import { pubPosters, teachingPoster } from "@/lib/posterConfigs";
import type { MotifSpec } from "@/lib/pixelEngine";
import spearsLed from "@/lib/spears-led.json";
import coverDemo from "@/lib/cover-pixel-demo.json";
import {
  ScholarIcon, GitHubSocialIcon, OsfSocialIcon, LinkedInIcon, XIcon, ExpertsIcon,
  JournalIcon, DownloadIcon, OsfIcon, GitHubGlyph, ArxivIcon, PsyArxivIcon, SsrnIcon,
} from "./icons";
import {
  PixelScholarIcon, PixelGitHubIcon, PixelOsfIcon, PixelLinkedInIcon, PixelXIcon, PixelExpertsIcon,
  PixelJournalPixIcon, PixelDownloadPixIcon, PixelOsfPixIcon, PixelGitHubPixIcon,
  PixelArxivPixIcon, PixelPsyArxivPixIcon, PixelSsrnPixIcon,
  PixelSunIcon, PixelMoonIcon, PixelSpeakerOnIcon, PixelSpeakerOffIcon,
} from "./pixelIcons";
import { NAV_ICON_SETS } from "./navIcons";

const led = spearsLed as { cols: number; rows: number; palette: (string | null)[]; cells: number[] };
const LED_COLORS = led.palette.map((h) => h ?? "#16171b");
const cover = coverDemo as { cols: number; rows: number; palette: (string | null)[]; cells: number[] };
const COVER_COLORS = cover.palette.map((h) => h ?? "#16171b");

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

const PROFILE_ICONS = [
  { label: "Google Scholar", brand: ScholarIcon, pixel: PixelScholarIcon },
  { label: "GitHub", brand: GitHubSocialIcon, pixel: PixelGitHubIcon },
  { label: "Open Science Framework", brand: OsfSocialIcon, pixel: PixelOsfIcon },
  { label: "LinkedIn", brand: LinkedInIcon, pixel: PixelLinkedInIcon },
  { label: "X (Twitter)", brand: XIcon, pixel: PixelXIcon },
  { label: "OSU Experts Profile", brand: ExpertsIcon, pixel: PixelExpertsIcon },
];

const PANEL_ICONS = [
  { label: "Journal website", brand: JournalIcon, pixel: PixelJournalPixIcon },
  { label: "Machine-readable download", brand: DownloadIcon, pixel: PixelDownloadPixIcon },
  { label: "Data and code (OSF)", brand: OsfIcon, pixel: PixelOsfPixIcon },
  { label: "GitHub / explorer", brand: GitHubGlyph, pixel: PixelGitHubPixIcon },
  { label: "arXiv", brand: ArxivIcon, pixel: PixelArxivPixIcon },
  { label: "PsyArXiv", brand: PsyArxivIcon, pixel: PixelPsyArxivPixIcon },
  { label: "SSRN", brand: SsrnIcon, pixel: PixelSsrnPixIcon },
];

const JUDGE_MAP: { axis: string; where: string }[] = [
  { axis: "portrait", where: "Home page: click the headshot photo; the back of the flip is this choice. Both candidates also run side by side below." },
  { axis: "posterfont", where: "The title under EVERY dark poster card, on any page. Compare in the serif section below, then flip the axis and reread a real poster title." },
  { axis: "reslayout", where: "Research page, the whole layout: list (current), art rail (a sticky left card that follows whichever paper you open; desktop only), or gallery (a List | Posters toggle appears; clicking a poster jumps back to its entry in the list)." },
  { axis: "covers", where: "Research page: open any paper. With click-to-cycle, the cover is larger and CLICKING IT cycles real cover, pixel cover, motif (three dots under it show which face you are on). Static keeps the plain cover." },
  { axis: "pubposters", where: "Research page: click any publication title; the poster sits at the bottom of the opened panel, after the abstract. The off option removes all of them. (In the art rail layout the rail replaces these automatically.)" },
  { axis: "teachingposter", where: "Teaching page: scroll to the very bottom, after the student comments." },
  { axis: "spears", where: "Contact page: the wide building card under the two contact columns. Four candidates, all also stacked below." },
  { axis: "icons", where: "Four places at once: Contact profile list, the four buttons inside an open Research panel, the Download PDF button on the CV page, and the two round toggles at the top right of the nav." },
  { axis: "navicons", where: "The top navbar itself: an icon appears next to Home, Research, Teaching, CV, and Contact. Three choices: none (current), line, pixel. Flip it and look up." },
  { axis: "navhover", where: "Any page: hover a nav tab you are NOT on and watch the underline (moving gradient vs marching cells)." },
  { axis: "footer", where: "The very bottom of any page: the small centered mark under the content." },
];

function LabNote({ children }: { children: React.ReactNode }) {
  return <p className="lab-note">{children}</p>;
}

export function PixelLab() {
  return (
    <main className="page page-wide pixel-lab">
      <section className="section">
        <h2 className="section-title">Where to judge each option</h2>
        <LabNote>
          Everything below also runs here side by side, but each choice ships on a real
          page. The switcher (bottom right) changes the real pages live and persists, so
          you can walk the site with any combination.
        </LabNote>
        <table className="lab-map">
          <tbody>
            {JUDGE_MAP.map((r) => (
              <tr key={r.axis}>
                <td className="lab-map-axis">{r.axis}</td>
                <td>{r.where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2 className="section-title">The reference (its_sslvr on X)</h2>
        <LabNote>
          Frames from the two source videos: the double poster study (&quot;lost in
          mosaic&quot;) and the wave study (&quot;Pixel+wave&quot;), plus a close crop
          showing the cell anatomy: dark card, faint unlit cells, gray corner anchors,
          saturated body, white-hot core. Kept here for comparison only; these frames
          leave the repo when the lab is deleted.
        </LabNote>
        <div className="lab-refs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/pixel-ref/ref-mosaic.jpg" alt="Reference: two dark posters with sparse lit cell motifs" width={880} height={495} loading="lazy" />
          <div className="lab-refs-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/pixel-ref/ref-wave.jpg" alt="Reference: the wave poster mid-swell" width={620} height={620} loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/pixel-ref/ref-zoom.jpg" alt="Reference: close crop of the cell grid" width={620} height={595} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Portrait flip (Home) — the two candidates</h2>
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
          Where these LIVE is an open question; the candidates are in the layout section
          below. Today they sit inside the opened Research panels.
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
        <h2 className="section-title">Research layout candidates — where the posters could live</h2>
        <LabNote>
          THREE OF THESE ARE NOW LIVE ON THE REAL RESEARCH PAGE via the switcher: the
          reslayout axis gives list, art rail (a live version of C), and gallery (a live
          version of D), and the covers axis gives the click-to-cycle cover, which is B
          plus E combined without losing the real cover. The mockups below stay for
          comparison. The clean citation list is the backbone in every candidate.
        </LabNote>

        <div className="lab-stack">
          <div>
            <div className="lab-tag">A. Panel bottom (what is built now): poster at the end of the opened panel</div>
            <LabNote>
              Zero risk, zero clutter, but the poster is buried: only visitors who open a
              panel and read past the abstract meet it.
            </LabNote>
          </div>

          <div>
            <div className="lab-tag">B. Cover swap: the poster REPLACES the journal cover inside the panel</div>
            <LabNote>
              The poster takes the cover&apos;s float-left slot next to the abstract, so it
              is seen immediately on open and adds no length. The real journal cover
              moves to the poster&apos;s spot or goes. Mock below with real data.
            </LabNote>
            <div className="lab-mock">
              <div className="lab-mock-panel">
                <div className="lab-mock-poster">
                  <PixelPoster
                    spec={pubPosters["cognitive-traps"].spec}
                    cols={pubPosters["cognitive-traps"].cols}
                    rows={pubPosters["cognitive-traps"].rows}
                    title="Cognitive Traps"
                    caption="JCR, 2026"
                  />
                </div>
                <p className="lab-mock-abstract">
                  <strong>Abstract:</strong> Online behavioral research assumes survey responses come
                  from humans, yet vision-enabled AI agents can now autonomously complete surveys by
                  capturing screenshots, processing questions, and submitting responses. Because these
                  agents perceive the same rendered visual content that humans see, traditional
                  detection methods are ineffective. This article introduces the Cognitive Trap
                  Framework...
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="lab-tag">C. Margin poster (desktop only): the open panel grows a right rail</div>
            <LabNote>
              The poster rides beside the abstract in a right-hand rail, visible without
              scrolling, and simply stacks below on mobile. The list column itself never
              changes.
            </LabNote>
            <div className="lab-mock">
              <div className="lab-mock-margin">
                <p className="lab-mock-abstract">
                  <strong>Abstract:</strong> Product performance claims play an important role in
                  shaping consumers&apos; purchase decisions. Through six preregistered studies,
                  including one field study, we demonstrate that consumers&apos; preferences for point
                  versus range performance estimates in common comparative purchase settings depend on
                  whether their attention is directed toward the content of the claim or the manner of
                  its presentation...
                </p>
                <div className="lab-mock-rail">
                  <PixelPoster
                    spec={pubPosters["point-vs-range"].spec}
                    cols={pubPosters["point-vs-range"].cols}
                    rows={pubPosters["point-vs-range"].rows}
                    title="Point vs. Range"
                    caption="JMR"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="lab-tag">D. Gallery view: a quiet List | Posters toggle at the top of Research</div>
            <LabNote>
              The list stays the DEFAULT; a small control switches to a poster wall
              grouped by year for whoever wants to browse visually. Nothing changes for a
              visitor who never touches it. Sample wall below.
            </LabNote>
            <div className="lab-mock">
              <div className="lab-seg" aria-hidden="true">
                <span>List</span>
                <span className="is-on">Posters</span>
              </div>
              <div className="lab-year">2026</div>
              <div className="lab-strip">
                {["cognitive-traps", "space-commons", "simple-eco-friendly"].map((id) => (
                  <div className="lab-strip-item" key={id}>
                    <PixelPoster
                      spec={pubPosters[id].spec}
                      cols={pubPosters[id].cols}
                      rows={pubPosters[id].rows}
                      title={pubPosters[id].title}
                      caption={pubPosters[id].caption}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="lab-tag">E. Pixelized journal covers: the covers themselves become living grids</div>
            <LabNote>
              Instead of a separate poster, the familiar cover keeps its slot but is
              rebuilt as breathing cells (the Spears LED treatment applied to covers).
              Strong identity, but it trades away the real, recognizable cover. Real JCR
              cover next to its grid rebuild:
            </LabNote>
            <div className="lab-cover-pair">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/covers/cognitive-traps.jpg" alt="JCR cover, original" width={520} height={688} loading="lazy" />
              <div className="lab-cover-pixel">
                <PixelPoster
                  spec={{ engine: "glimmer", seed: 83, colors: COVER_COLORS, params: { brightFrom: 7, dimUpTo: 1 }, map: cover.cells }}
                  cols={cover.cols}
                  rows={cover.rows}
                  title="JCR"
                  caption="the cover as cells"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="lab-tag">F. Poster strip: a horizontal, scrollable band of posters above the list</div>
            <LabNote>
              One row, newest first, scrolls sideways; clicking a poster opens that
              paper&apos;s panel in the list below. The list is untouched underneath. The
              wall sample above doubles as the visual for this.
            </LabNote>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Motif library — the full vocabulary</h2>
        <LabNote>
          The raw engines on a neutral palette, including ones no surface uses yet
          (Converge is unassigned). Any paper can switch motifs by editing
          lib/posterConfigs.ts.
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
        <h2 className="section-title">Spears card (Contact) — the four treatments</h2>
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
          <div>
            <div className="lab-tag">pixel art (chunky quantized still, retro-game register)</div>
            <figure className="dither-card is-still">
              <div className="dither-card-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/spears-pixel.png"
                  alt="Spears building as chunky pixel art"
                  width={1344}
                  height={336}
                  loading="lazy"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <figcaption>
                <div className="pixel-poster-title">Spears School of Business</div>
                <p className="pixel-poster-caption">316 Business Building, Stillwater, Oklahoma</p>
              </figcaption>
            </figure>
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
        <h2 className="section-title">Icons — brand vs pixel, every surface</h2>
        <LabNote>
          One axis drives all four surfaces at once. Left column brand (current), right
          column pixel. Teaching has no icons anywhere, so nothing changes there.
        </LabNote>
        <div className="lab-tag">Contact profiles</div>
        <div className="lab-icons">
          {PROFILE_ICONS.map((r) => (
            <div className="lab-icon-row" key={r.label}>
              <span className="lab-icon-cell"><r.brand /></span>
              <span className="lab-icon-cell"><r.pixel /></span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
        <div className="lab-tag" style={{ marginTop: 22 }}>Research panel buttons</div>
        <div className="lab-icons">
          {PANEL_ICONS.map((r) => (
            <div className="lab-icon-row" key={r.label}>
              <span className="lab-icon-cell"><r.brand /></span>
              <span className="lab-icon-cell"><r.pixel /></span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
        <div className="lab-tag" style={{ marginTop: 22 }}>Nav toggles (theme, sound) and the CV download arrow</div>
        <div className="lab-icons">
          <div className="lab-icon-row">
            <span className="lab-icon-cell lab-icon-plain"><PixelSunIcon /></span>
            <span className="lab-icon-cell lab-icon-plain"><PixelMoonIcon /></span>
            <span className="lab-icon-cell lab-icon-plain"><PixelSpeakerOnIcon /></span>
            <span className="lab-icon-cell lab-icon-plain"><PixelSpeakerOffIcon /></span>
            <span>pixel sun, moon, speaker on, speaker off (brand versions are the current nav icons)</span>
          </div>
        </div>
        <div className="lab-tag" style={{ marginTop: 22 }}>Nav tab icons (the navicons axis; also try it live in the navbar above)</div>
        <div className="lab-icons">
          {(["/", "/research/", "/teaching/", "/cv/", "/contact/"] as const).map((href) => {
            const Line = NAV_ICON_SETS.line[href];
            const Pix = NAV_ICON_SETS.pixel[href];
            const label = href === "/" ? "Home" : href.slice(1, -1).replace(/^./, (c) => c.toUpperCase());
            return (
              <div className="lab-icon-row" key={href}>
                <span className="lab-icon-cell lab-icon-plain lab-nav-glyph"><Line /></span>
                <span className="lab-icon-cell lab-icon-plain lab-nav-glyph"><Pix /></span>
                <span>{label === "Cv" ? "CV" : label}</span>
              </div>
            );
          })}
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
