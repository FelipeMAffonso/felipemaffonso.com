# Personal Website of Felipe M. Affonso

This is the source for Felipe's personal academic site. It is a Next.js 15
static export served from GitHub Pages. This document is the full reference for
how the site is built and the rules that govern changes to it.

## What the site is

- Live URL: https://felipemaffonso.com
- Repo: https://github.com/FelipeMAffonso/felipemaffonso.com
- Hosting: GitHub Pages. A push to `master` builds and deploys automatically.
- Purpose: Felipe's academic home page. Five pages: Home (hero, photo, bio),
  Research (publications list with expandable panels), Teaching (courses, awards,
  student quotes), CV (Drive PDF viewer plus a download), and Contact (office and
  social links).
- Look: hairline borders, soft layered shadows, Geist type, a coral accent
  (#DA7756), and a coral particle constellation in the nav bar and the home hero.

## Stack

- Next.js 15, App Router. Every page is a route folder under `app/`.
- Static export: `next.config.mjs` sets `output: 'export'`, so the build writes
  plain HTML/CSS/JS to `out/` with no server runtime. `trailingSlash: true` keeps
  URLs like `/research/`. `images.unoptimized: true` because Pages has no image
  optimizer. `typescript.ignoreBuildErrors: false`, so a type error fails the build.
- Tailwind v4 plus handwritten CSS. `app/globals.css` imports Tailwind and then
  defines all the real design tokens and component styles by hand. The tokens are
  plain CSS custom properties on `:root` and `.dark`. There is no `tailwind.config`;
  the `@theme inline` block at the top of `globals.css` holds the font and motion tokens.
- next-themes for light/dark. `attribute="class"`, `storageKey="site-theme"`,
  `defaultTheme="system"`, `enableSystem`. The class toggling drives the `.dark`
  token block.
- cuelume for interaction sounds. Synthesized via the Web Audio API, no audio
  files. Wrapped in `lib/sound.tsx`.
- Geist is self-hosted through the `geist` package (`GeistSans`, `GeistMono` in
  `app/layout.tsx`). No external font request.

## Repo map

```
felipemaffonso.com/
â”œâ”€â”€ app/                      # App Router: routes, layout, global CSS
â”‚   â”œâ”€â”€ layout.tsx            # Root layout: <html>/<body>, metadata, analytics
â”‚   â”‚                         #   scripts, CV pdf prefetch, Providers, Nav, footer
â”‚   â”œâ”€â”€ globals.css           # All design tokens + every component style
â”‚   â”œâ”€â”€ page.tsx              # Home: hero, photo, bio, Person JSON-LD
â”‚   â”œâ”€â”€ research/page.tsx     # Research: renders <PublicationsSections/>
â”‚   â”œâ”€â”€ teaching/page.tsx     # Teaching
â”‚   â”œâ”€â”€ cv/page.tsx           # CV: intro, download link, the page-image viewer
â”‚   â”œâ”€â”€ contact/page.tsx      # Contact
â”‚   â”œâ”€â”€ robots.ts             # robots.txt (generated)
â”‚   â””â”€â”€ sitemap.ts            # sitemap.xml (generated)
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Providers.tsx         # ThemeProvider + SoundProvider wrapper
â”‚   â”œâ”€â”€ Nav.tsx               # Top nav, mobile menu, page-change sound
â”‚   â”œâ”€â”€ ParticleField.tsx     # Coral particle constellation (nav + hero)
â”‚   â”œâ”€â”€ PublicationsSections.tsx  # The research list + the LOCKED panel
â”‚   â”œâ”€â”€ ThemeToggle.tsx       # Sun/moon toggle, baked morph animation
â”‚   â”œâ”€â”€ SoundToggle.tsx       # Mute/unmute interaction sounds
â”‚   â”œâ”€â”€ CvPages.tsx           # The CV viewer: pre-rendered page images as paper sheets
â”‚   â”œâ”€â”€ CvDownload.tsx        # The Download PDF button
â”‚   â”œâ”€â”€ PageBanner.tsx        # Inner-page title banner
â”‚   â””â”€â”€ icons.tsx             # Publication link icons (journal, OSF, arXiv, ...)
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ publications.tsx      # Publication data (citations, abstracts, links, covers)
â”‚   â””â”€â”€ sound.tsx             # cuelume wrapper: on/off, warm-up, play()
â”œâ”€â”€ public/                   # Static assets copied verbatim into out/
â”‚   â”œâ”€â”€ CNAME                 # felipemaffonso.com (the custom domain)
â”‚   â”œâ”€â”€ favicon.svg
â”‚   â”œâ”€â”€ files/cv.pdf          # Self-hosted CV for the download button
â”‚   â”œâ”€â”€ files/papers/         # Machine-readable paper .md files
â”‚   â””â”€â”€ images/               # headshot, journal covers, link icons
â”œâ”€â”€ next.config.mjs           # Static export config
â”œâ”€â”€ package.json
â””â”€â”€ .github/workflows/deploy.yml   # Build + deploy to Pages on push to master
```

Content data lives in `lib/publications.tsx` (Research) and directly in the page
components (`app/teaching/page.tsx`, `app/contact/page.tsx`, the home bio in
`app/page.tsx`).

## Design system

### Color tokens

Light theme (`:root`):

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f8f9fa` | page background |
| `--surface` | `#ffffff` | raised cards and panels |
| `--surface-2` | `#f1f2f4` | quiet hover base |
| `--text` | `#1a1a1a` | primary text |
| `--text-secondary` | `#3a3f45` | body text |
| `--text-dim` | `#6b7078` | labels, meta |
| `--coral` | `#DA7756` | the accent: fills, icons, particles, active underline |
| `--coral-dark` | `#c86a4a` | hover/pressed accent |
| `--coral-text` | `#b3572f` | deeper coral for text on light bg (AA contrast) |
| `--border` | `#e5e7ea` | hairline borders |

Dark theme (`.dark`) is the cool palette:

| Token | Value |
|---|---|
| `--bg` | `#16171b` |
| `--surface` | `#1e2025` |
| `--surface-2` | `#262930` |
| `--text` | `#e8e8ea` |
| `--text-secondary` | `#c3c7cd` |
| `--text-dim` | `#8b9099` |
| `--coral` | `#e08866` |
| `--coral-text` | `#e08866` (already reads on dark) |
| `--border` | `#2b2e35` |

The coral hue is the signature: `#DA7756` in light, `#e08866` in dark, with
`#b3572f` as the darker text-coral used for links on light backgrounds.

### Type scale

- Home name: 40px, weight 500 (30px then 26px on smaller screens).
- Home title line: 16px, weight 400.
- Inner-page banner heading: 29px, weight 500 (25px on mobile).
- Section titles: 12px, weight 600, uppercase, wide letter-spacing.
- Body and content: 16px base, roughly 15 to 15.5px for paragraphs and list items.
- Publication entries: 15px.

### Motion vocabulary

- Motion tokens live in the `@theme inline` block: `--ease-out-quint:
  cubic-bezier(0.23, 1, 0.32, 1)` is the house curve for almost everything;
  `--ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1)` and `--ease-drawer:
  cubic-bezier(0.32, 0.72, 0, 1)` exist for heavier transitions.
- Durations: nothing in the UI runs longer than about 300ms. Entrance is 0.24s.
  The publication panel expands over 0.24s (`grid-template-rows: 0fr to 1fr`).
  The theme icon morph is 0.24 to 0.28s. The nav underline slides in over 0.22s.
- Entrance: elements with `.enter` fade in (`enterFade`, opacity only) with a
  tight, capped stagger keyed off `--enter-i`. The animation is CSS-driven so it
  plays before hydration and content is never invisible waiting on JS.
- Nav gradient hover: every nav tab has a coral underline pseudo-element that sits
  at `scaleX(0)`. The active page shows it at `scaleX(1)` as a static coral line.
  Hovering a non-active tab slides its underline in and animates a moving coral
  gradient across it (`navSlideGradient`, 1.5s linear infinite, a 200% background
  drifting), which reads as "this is where you would go". While a non-active tab
  is hovered, the active tab's static underline fades out.
- Reduced motion policy: calmer, never frozen. `prefers-reduced-motion: reduce`
  keeps animations present but gentler. The entrance becomes a quick opacity fade
  with no stagger. The nav gradient still drifts, at half speed. The CV loading
  shimmer still moves, at half speed. Nothing is switched off outright.

## Sound

Interaction sounds are cuelume cues, wired in `lib/sound.tsx`. Global on/off is
persisted in localStorage under `site-sound` and defaults ON. `bind()` wires the
declarative `data-cuelume-*` attributes once and survives route swaps.

### Sound map

| Trigger | Cue | How it is wired |
|---|---|---|
| Nav link to a different page | `release` | `Nav.tsx` plays it only when the target differs from the current page; clicking the tab you are already on stays silent |
| Publication panel open | `bloom` | `PublicationsSections.tsx` on expand |
| Publication panel close | `whisper` | `PublicationsSections.tsx` on collapse |
| Panel action buttons (Journal, PDF, Data, ...) | `press` then `release` | `data-cuelume-press` + `data-cuelume-release` on each `.pub-link` |
| Theme toggle (sun/moon) | `toggle` | `data-cuelume-toggle` on the button |
| Sound toggle | `toggle`, on turn-ON only | `lib/sound.tsx` plays the cue when enabling; turning sound off is silent |
| CV download button | `success` | `CvDownload.tsx` on click |

Hover sounds are banned. cuelume's bind is pointer-aware and hover-throttled so it
never gets noisy, but the site wires no hover cues at all; sound is for deliberate
actions only.

Audio warm-up: the first real cue would otherwise pay a cold-start cost while the
browser's audio device wakes up. On the first `pointerdown` anywhere, `lib/sound.tsx`
creates and resumes a silent parallel `AudioContext` (no nodes attached) to open the
shared audio device up front. cuelume's own context then resumes against an already
running audio thread, so the first audible cue skips the cold start. This runs once,
on a real user gesture, which is also what the Web Audio autoplay policy requires.

## CV viewer (self-hosted page images, 2026-08-14)

The viewer shows pre-rendered images of `public/files/cv.pdf`, the same file the
Download button serves. One source, so the page can never show a different CV than
the one this repo publishes. This replaced the Google Drive iframe (and the
warm-frame machinery around it) after the Drive copy silently sat nine months
stale: the Drive file was a manual side-channel, and the viewer went out of date
while the downloaded PDF was current.

- `scripts/build-cv-pages.py` (python, needs pymupdf + PIL) renders each PDF page
  to WebP at 1720px wide (2x the 860px display width, so pages stay sharp on
  retina screens and under phone zoom) into `public/images/cv-pages/`, and writes
  `lib/cv-pages.json` with the PDF's sha256 and the page list. Filenames carry a
  content hash, so a returning visitor's cache can never show a stale page.
- `components/CvPages.tsx` imports the manifest and renders each page as a
  `figure.cv-page` paper sheet: white background in both themes (paper is paper),
  hairline border, `--radius-card`, `--shadow-panel`, max-width 880px. The first
  page loads eager with high fetch priority; the rest are lazy. Width/height
  attributes reserve the exact aspect, so lazy pages never shift the layout.
- `scripts/check-cv-pages.mjs` runs as npm's `prebuild`, locally and in the deploy
  workflow: if `cv.pdf` changed without regenerating the images, or a listed image
  is missing, the build FAILS. A stale viewer cannot deploy; it can only fail
  loudly.
- `scripts/_shot-cv.py` is the verification helper: serves nothing itself; with
  the built site served locally it screenshots /cv/ at desktop and phone widths
  (light and dark) for reading the pixels after a CV update.

To change the CV: replace `public/files/cv.pdf` (the cv repo's
`check_site_drift.py --stage-pdf` stages it), run
`python scripts/build-cv-pages.py`, and commit the PDF, the images, and
`lib/cv-pages.json` together.

## Theme system

- Default is `system`: the site follows the OS light/dark preference until the user
  picks. next-themes stores the choice under `site-theme`.
- The nav toggle pins an explicit light or dark and stays pinned.
- The toggle icon uses the baked morph animation: the sun and moon cross-fade and
  rotate/scale between states (`.theme-morph`, `.theme-icon-face`). There is no
  instant-swap alternative; morph is the one behavior.

## HARD LAWS

These are not preferences. Do not violate them.

- The expanded publication panel is a LOCKED static design. Its layout, icons,
  buttons, spacing, and anatomy in `components/PublicationsSections.tsx` do not
  change. The four action buttons sit in one row with their fixed icons. The only
  changes ever permitted there are the sound cue tokens and the mechanical removal
  of dead machinery; never a visual or layout change. One approved exception
  (Felipe, 2026-07-19): the pixel poster block appended AFTER the abstract
  (`.pub-poster`) is an addition below the locked anatomy; the locked elements
  above it are unchanged.
- Site content strings are sacred. The bio paragraph, the publication citations and
  abstracts, the journals sentence, and the teaching text are not reworded, trimmed,
  or "improved" without Felipe asking. Treat them as fixed copy.
- Never remove the analytics hooks: Microsoft Clarity (`wexegoktgd`), the Cloudflare
  Web Analytics beacon (`db16777525f64d0abb899762c3c29b9c`), or the Google Search
  Console meta tag (`x66T2PCnYUqNbY4DC-jw_Y0M7glCv8RBEzie2C69vps`). Losing the GSC
  meta tag drops property ownership.
- No em dashes and no emojis anywhere: not in the site, not in code comments, not in
  commit messages, not in this document.
- Push to `master` is deploy. Branch work stays on side branches until Felipe says to
  merge. Committing is not deploying; merging to `master` is.

### Deploy workflow

`.github/workflows/deploy.yml` runs on every push to `master`:

1. `actions/checkout`.
2. `actions/setup-node` (Node 20, npm cache).
3. `npm ci`.
4. `npm run build` (the Next.js static export, which writes to `out/`).
5. `actions/upload-pages-artifact` with `path: out`.
6. `actions/deploy-pages` publishes the artifact to GitHub Pages.

`public/CNAME` carries the custom domain `felipemaffonso.com` into `out/`, so Pages
serves the site at that domain.

## Pixel posters (the LED-grid art system, branch pixel-posters, 2026-07-19)

An art layer inspired by its_sslvr's animated LED-grid posters: a dark card
holds a fixed grid of flat rounded cells (unlit cells stay faintly visible, the
four corner cells are permanently dim gray anchors) and a slow, sparse motif of
lit cells moves through it. No glow, no bloom; brightness lives in the color
values. Titles use the self-hosted slab serif Ultra (via @fontsource); captions
are plain facts. THE CARD COLOR LAW (Felipe 2026-07-19): cards are THEME
ADAPTIVE â€” light theme gets a light card (site surface tokens) with adapted
cell colors (lib/pixelTheme: near-white becomes ink, the rest darkens a step);
dark theme gets the night card (#16171b family, cool neutral tints, never warm
brown). The portrait back and the Spears dusk scene stay dark (alwaysDark).
STORIES (Felipe 2026-07-19): most papers now use narrative motifs in
lib/pixelStories.ts (ASCII-sprite phase timelines that depict the paper: the
three provider marks for Strategic Personalities, the box-and-price-tag reveal
for Concealing Prices, ...); Space Commons keeps orbit, Disease Cues keeps
contagion. The cover slot in an open panel (172px, PubCover) shows the story
by default and flips to the real journal cover on click; the pixel-quantized
journal covers were built, judged bad, and deleted. The Spears card cycles on
click (dither / LED / pixel art) with the scanline on every face.

Parts:
- `lib/pixelEngine.ts` â€” pure per-cell motif programs (drift, tide, blaze,
  converge, reveal, spark, structure, orbit, contagion, band, glimmer). Every
  engine answers (x, y, t, grid) with null or {v, c}; no per-frame state.
- `components/PixelPoster.tsx` â€” the canvas poster card: draws the grid at
  ~10fps, runs only while on screen and while `active`, reduced motion runs the
  same loop at 0.4x (calmer, never frozen).
- `lib/posterConfigs.ts` â€” one poster per publication id plus the teaching
  card: engine, palette (every palette carries one coral note), grid size,
  title, caption.
- `components/PixelPortrait.tsx` â€” the Home easter egg: clicking the headshot
  flips it (3D card flip, faces carry the frame; the outer drops overflow so
  the flip is not flattened) to a living grid portrait. Two modes:
  constellation (sparse, breathing, feature cells stable with white-hot cores)
  and mosaic (full map, gently alive). Plays the "toggle" cue on flip. The
  spatial map is `lib/pixel-portrait.json`, generated OFFLINE by
  `scripts/build-pixel-portrait.mjs` (ffmpeg downsample 30x39, oval mask so
  the face rises from a dark field, warm ramp plus sparse coral, ordered-dither
  wobble). Regenerate only when the headshot changes.
- `components/SpearsCard.tsx` â€” the Contact poster of the Spears building.
  Cycles on click: dither still, LED grid, pixel art, the scanline on every face (LED map: coarse 52x13 grid from `lib/spears-led.json`,
  built by `scripts/build-spears-led.mjs` with highlight-preserving
  downsampling; lamps and lit windows flicker via the glimmer engine).
- `components/pixelIcons.tsx` + `components/SocialLinks.tsx` â€” optional pixel
  glyph set for the Contact profiles list.
- `components/FooterLine.tsx` â€” optional LED strip replacing the footer line.

SHIPPED STATE (adjudicated and baked 2026-07-19; the variant switcher, the
/pixel-lab/ page, and lib/pixelVariants are DELETED): Alfa Slab One poster
titles (Ultra removed), bare PageStrip headers on Research, Teaching, CV, and
Contact (each its own engine pattern; clicking a strip cycles coral, teal,
slate, and dusty-rose palettes; Home has NO strip, the hero keeps the particle
constellation), the two-face story cover inside every open Research panel
(PubCover: story by default at the cover''s exact aspect, the real journal
cover on click, hover narrates the story via the tells field), the constellation
portrait flip on Home, line icons in the navbar, brand icons everywhere else,
the gradient nav hover, the LED footer strip on every page, the cycling Spears
card on Contact, and NO poster cards or writing on panel art anywhere. Cards
are theme adaptive via lib/pixelTheme.

## How to write a great pixel story (lib/pixelStories.ts)

The bar (Felipe 2026-07-19): stories must be genuinely beautiful and must
depict the paper, not decorate it. Rules learned so far:

1. One idea per phase, two to three phases, 10 to 18 seconds total. A phase is
   a sentence: "the robot falls in the trap." If you cannot say the phase in
   one sentence, split it.
2. Draw THINGS, not noise: sprites (ASCII cell art via spr()) for actors and
   objects (a price tag, a die, a graduation cap, the provider marks), simple
   fills for structures. The viewer should recognize the actor before the
   motion starts.
3. Space is part of the composition. Most of the grid stays dark; the story
   letterboxes into the journal-cover aspect inside the cover slot, so design
   for a calm dark margin above and below.
4. Motion should be slow beats, not animation-easing: things appear (env fade),
   travel on integer cells, and resolve. One burst, sweep, or flash per story
   is an effect; two is noise.
5. Color is meaning: one color per actor or faction, the coral reserved for
   the paper's key moment, red only for harm or failure, green only for
   success. Palettes are 4 to 6 colors and must survive adaptPalette in light
   mode (avoid two tones that collapse into the same ink).
6. End states must read: hold the resolution (the split bars, the flagged
   robot, the gold burst fading) for at least a second before the loop.
7. Every story carries a `tells` line in posterConfigs: the hover text that
   narrates the story in one sentence. If the tells line is hard to write,
   the story is not telling anything; redesign it.
8. Verify by WATCHING the rendered story (screenshots at two or three points
   in the cycle), never by reading the code.

## Journals sentence convention

**Journals sentence convention** (Felipe's preferences, agreed 2026-06-24):
- Umbrella is **"leading academic journals, including â€¦"** (not "marketing journals") â€” the list now spans marketing, policy, and psychology, so "academic" is the right catch-all. No "the" before the list.
- **Don't categorize** the list (no "general-science journals (â€¦), marketing journals (â€¦)" buckets). A flat `including` list reads more confidently and puts the journal *names*, not category labels, in front of the reader. `including` already implies illustrative-not-exhaustive, so "and others" never need listing.
- **Cap at ~5 marquee names.** Past five it reads like a CV dump and the impact flattens. The full publication list lives on the research page, not the bio.
- **Order = prestige-descending.** When general-science venues exist, lead with them, then the marketing journals.
- **General-science tier rule:** only list **three** general-science journals if they are exactly **Nature, Science, and PNAS** (the universally recognized apex). For anything else in that tier (*Nature Human Behaviour*, etc.), list one or two and **don't pad to three** â€” and don't stack near-synonyms (e.g. *Nature* + *Nature Human Behaviour* + PNAS). Spell out "Proceedings of the National Academy of Sciences" (acronym in parens optional).
- **Accuracy:** Felipe opted to phrase conditionally-accepted journals (JMR, JEP:G) under "has been published in." If he ever wants strict accuracy instead, use "published or is forthcoming in," or list only the truly-published journals. Do not name *Nature*/PNAS until actually accepted.
- **Current sentence (2026-06-24):** "His work has been published in leading academic journals, including *Journal of Consumer Research*, *Journal of Marketing Research*, *Journal of Marketing*, *Research Policy*, and *Journal of Experimental Psychology: General*." When Nature/PNAS land, lead with them and trim to the strongest ~5 (likely dropping *Research Policy*/JEP:G from the bio list).

The bio paragraph now lives in `app/page.tsx` (the `hero-bio` paragraph), not in the
retired `src/index.njk`.

## Create machine-readable version of a paper

Note on paths: this pipeline is preserved verbatim from the earlier build. The
machine-readable `.md` files now live in `public/files/papers/` (served at
`/files/papers/`), not `src/files/papers/`, and the research page is
`app/research/page.tsx` with its data in `lib/publications.tsx`, not `research.njk`.
The pandoc-not-LLM rule and the verification checklist are unchanged and binding.

Machine-readable `.md` files live in `src/files/papers/` and are downloadable from the research page. They are for AI tools (NotebookLM, Claude, ChatGPT, etc.).

**CRITICAL: Use pandoc for deterministic conversion. NEVER use an LLM to convert paper text. LLMs subtly mutate text (abbreviations, symbols, word choices). Pandoc is byte-faithful.**

**Pandoc location:** `"/c/Program Files/Pandoc/pandoc.exe"`

**Pipeline:**

```bash
# Step 1: Convert each DOCX source with pandoc
PANDOC="/c/Program Files/Pandoc/pandoc.exe"
"$PANDOC" manuscript.docx -t markdown --wrap=none -o _pandoc_ms.md
"$PANDOC" web_appendix.docx -t markdown --wrap=none -o _pandoc_wa.md
# For EPUBs (published version â€” prefer over DOCX when available):
"$PANDOC" paper.epub -t markdown --wrap=none -o _pandoc_epub.md
```

```python
# Step 2: Assemble programmatically (Python, NOT LLM)
import re

with open('_pandoc_ms.md') as f: ms = f.read()
with open('_pandoc_wa.md') as f: wa = f.read()

# ONLY allowed cleanup: remove pandoc {.underline} artifacts
ms = re.sub(r'\[([^\]]+)\]\{\.underline\}', r'\1', ms)
wa = re.sub(r'\[([^\]]+)\]\{\.underline\}', r'\1', wa)

# Add YAML frontmatter (metadata only â€” NOT body text)
frontmatter = """---
title: "Paper Title"
authors: "Author One, Author Two"
journal: "Journal Name"
year: 2025
doi: "10.xxxx/xxxxx"
citation: "Author One and Author Two (2025), \\"Paper Title,\\" Journal Name."
---

> **Disclaimer:** This is a machine-readable conversion of the published paper
> for use with AI tools. It may contain conversion errors in formatting, tables,
> or equations. Always verify against the [published version](https://doi.org/10.xxxx/xxxxx).

"""

output = frontmatter + ms + "\n\n---\n\n# Supplementary Materials\n\n" + wa
with open('src/files/papers/paper-slug.md', 'w') as f: f.write(output)
```

```bash
# Step 3: Verify (send Opus agent to compare against PDF/DOCX)
# Step 4: Add download button to research.njk
# Step 5: Update JSON-LD structured data
# Step 6: Build and deploy
npm run build && git add -A && git commit -m "Add paper-slug .md" && git push
```

**Source priority** (for the main paper text):
1. EPUB (published version) â€” best: exact published text
2. Published PDF via pandoc â€” good but two-column extraction can garble
3. Accepted manuscript DOCX â€” good but pre-copyedit (may differ from published)

**What to include in the .md file:**
- YAML frontmatter (title, authors, journal, year, doi, citation)
- Disclaimer with DOI link
- Author info, affiliations, correspondence, acknowledgements
- Full abstract (structured if EJM-style)
- Complete body text (all studies, all sections)
- All tables as markdown tables
- Figure descriptions (bold caption + text description)
- Full reference list
- ALL supplementary materials (web appendix, online appendix, methodological appendix)
- Data collection statements, funding, ORCID, disclosure

**What NOT to do:**
- Never let an LLM rewrite, paraphrase, or "clean up" paper text
- Never summarize â€” include the full verbatim text
- Never add content not in the source files
- Never change statistical values, even if they look wrong (the disclaimer covers this)

**Verification checklist:**
- [ ] YAML: title exact, authors with middle initials, year correct, DOI resolves
- [ ] Stats: spot-check 5 values against PDF
- [ ] Tables: check 2 tables cell-by-cell against source
- [ ] References: count matches source
- [ ] Verbatim: 3 random paragraphs word-for-word match
- [ ] Supplementary: all appendix sections present
- [ ] No pandoc artifacts: no `{.underline}`, `{.smallcaps}` remaining

**Existing machine-readable files:**
| File | Paper | Lines |
|------|-------|-------|
| `ad-skepticism.md` | Hernandez et al. (2019) P&M | 570 |
| `concealing-prices.md` | Affonso et al. (forthcoming) JCR | 1,917 |
| `serendipity.md` | Kim et al. (2021) JM | 2,700 |
| `constructive-choice.md` | Affonso et al. (2021) JCP | 2,603 |
| `marketing-by-design.md` | Affonso & Janiszewski (2023) JM | 1,813 |
| `disease-cues.md` | Affonso (2025) EJM | 586 |
| `cognitive-traps.md` | Affonso (2026) JCR | 2,014 |
| `simple-eco-friendly.md` | Ryu et al. (2025) JA | 1,012 |
| `behavioral-governance.md` | Affonso (2025) RP | 1,093 |

## Analytics (installed 2026-04-20)

Note on paths: the trackers are now injected from `app/layout.tsx` (the Clarity
IIFE and the Cloudflare beacon as `<script>` tags, the GSC token via the Next
`metadata.verification.google` field), not from the retired `src/_includes/base.njk`.
The tokens, dashboards, and the do-not-remove rule below are unchanged.

Three trackers live on every page via `src/_includes/base.njk`:

| Tool | What it tracks | Where it lives in base.njk | Dashboard |
|---|---|---|---|
| **Microsoft Clarity** (`wexegoktgd`) | Session recordings, heatmaps, scroll depth, engagement time, dead/rage/quickback clicks | `<script>` IIFE in `<head>` after theme-init | https://clarity.microsoft.com/projects/view/wexegoktgd |
| **Cloudflare Web Analytics** (`db16777525f64d0abb899762c3c29b9c`) | Pageviews, referrers, countries, devices, browsers, load times â€” no cookies | `<script defer>` just before `</body>` | https://dash.cloudflare.com/27bd7115ab2090ed90f2e0c4b329e60a/web-analytics |
| **Google Search Console** | Search queries, CTR, impressions, avg position, indexing issues â€” 24-48h data delay | `<meta name="google-site-verification">` in `<head>` | https://search.google.com/search-console?resource_id=https%3A%2F%2Ffelipemaffonso.com%2F |

**Do not remove** any of these: Clarity script, CF beacon, or the GSC meta tag. Losing the meta tag drops GSC property ownership.

**Unified dashboard view** for all three (queries + pageviews + behavioral signals) exists inside the academic-research Dashboard at `felipemaffonso.github.io/academic-research/` â€” click the bar-chart icon next to the Claude mascot in the header, or `Ctrl+Shift+A`. The worker at `research-dashboard-claude.webmarinelli.workers.dev` exposes `/api/analytics/{cf,gsc,clarity,summary}` (Bearer `GIST_TOKEN` auth). See `dashboard/CLAUDE.md` "Site Analytics" section for full architecture.

**To verify live:**
```bash
curl -s https://felipemaffonso.com/ | grep -oE 'google-site-verification[^>]*'
curl -s https://felipemaffonso.com/ | grep -oE 'wexegoktgd'
curl -s https://felipemaffonso.com/ | grep -oE 'db16777525f64d0abb899762c3c29b9c'
```

## Common changes

- Update the bio: edit the `hero-bio` paragraph in `app/page.tsx`. Follow the
  journals sentence convention above.
- Add or update a publication: edit `lib/publications.tsx` (citation, abstract,
  links, cover). The panel design is locked; only the data changes.
- Update teaching: edit `app/teaching/page.tsx`.
- Update contact or social links: edit `app/contact/page.tsx`.
- Update the CV: replace `public/files/cv.pdf`, run
  `python scripts/build-cv-pages.py`, and commit the PDF with the regenerated
  images and `lib/cv-pages.json` (the prebuild check fails the build otherwise).
- Update the headshot: replace `public/images/headshot.jpg`.

Verify any change by running `npm run build` (it must pass with no type errors) and,
for anything visual, by rendering the page and reading the result, not by guessing.
The retired 11ty implementation (`src/`, `.eleventy.js`, `convert/`) was removed from
this branch; its history is preserved in git.
