# Personal Website — Felipe M. Affonso

## Site Overview
- **URL:** https://felipemaffonso.com
- **Repo:** https://github.com/FelipeMAffonso/felipemaffonso.com
- **Hosting:** GitHub Pages (auto-deploys on push to `master`)
- **Stack:** 11ty (Eleventy) static site generator
- **Design:** Coral particle network (#DA7756), minimal aesthetic, system fonts

## How to Update

1. Edit the relevant file (see structure below)
2. Commit and push to `master`
3. GitHub Actions builds and deploys automatically (~15 seconds)

## File Structure

```
personal-site/
├── .eleventy.js              # 11ty config (passthrough copies)
├── package.json
├── src/
│   ├── _includes/
│   │   └── base.njk          # Base layout (nav, particles, scripts)
│   ├── _data/
│   │   ├── site.json          # Name, role, institution, email, social links
│   │   ├── publications.json  # Research publications (used by Decap CMS)
│   │   └── courses.json       # Teaching courses (used by Decap CMS)
│   ├── css/
│   │   └── style.css          # All styles (single file)
│   ├── js/
│   │   ├── particles.js       # Coral particle network animation
│   │   ├── main.js            # Nav scroll effects, hamburger menu
│   │   ├── router.js          # SPA router (no full page reloads)
│   │   └── research.js        # Publication toggle (Preprints/Journal)
│   ├── images/
│   │   └── headshot.jpg       # Profile photo
│   ├── admin/
│   │   ├── index.html         # Decap CMS (optional browser editor)
│   │   └── config.yml         # CMS field definitions
│   ├── index.njk              # HOME — hero with particles, photo, bio
│   ├── research.njk           # RESEARCH — publications list
│   ├── teaching.njk           # TEACHING — courses, awards, student quotes
│   ├── cv.njk                 # CV — Google Drive PDF embed + download
│   └── contact.njk            # CONTACT — office info, social links
└── .github/
    └── workflows/
        └── deploy.yml         # GitHub Actions: build 11ty → deploy to Pages
```

## Common Updates

### Add or update a publication

Publications live in `src/research.njk`. Each paper is a `<li class="pub-entry">` with an expandable detail panel (accordion). Structure per entry:

```
<li class="pub-entry">
  <div class="pub-citation">             ← clickable area (toggles panel)
    <span class="pub-text">...</span>    ← full citation with <a href="DOI"> on journal name
    <svg class="pub-chevron">...</svg>   ← rotation indicator
  </div>
  <div class="pub-detail">               ← animated expand panel
    <div class="pub-detail-inner">
      <div class="pub-detail-pad">
        <div class="pub-detail-content">
          <img class="pub-cover" ...>    ← journal cover (optional, auto-hides if missing)
          <div class="pub-abstract">     ← abstract text
        </div>
        <div class="pub-actions">        ← action buttons (Journal, PDF, Data, Preprint)
        </div>
      </div>
    </div>
  </div>
</li>
```

**When adding a new paper, ask the user for:**
1. Full citation (authors, year, title, journal, volume, pages)
2. DOI or preprint URL
3. Abstract text
4. Journal cover image (user provides the file or URL to download)
5. Additional links: PDF download URL, replication data (OSF), preprint link
6. Section placement: Preprints or Journal Publications
7. Equal authorship notation (asterisks on author names)

**Status conventions in the citation parenthetical:**
- `(YYYY)` — published, with volume/pages in citation
- `(forthcoming)` — accepted, awaiting publication. Use this once the paper is accepted with no further revisions and a DOI may already be assigned
- `(conditionally accepted)` — accepted pending minor revisions. No year. Goes under **Journal Publications** at the top. Typically has no buttons (no preprint, no DOI, no data link yet) — just citation + abstract panel + journal cover

**When in doubt about buttons:** if the user says "no preprint, no buttons," omit the entire `<div class="pub-links">` block. The abstract panel renders fine without it.

**Cover images** go in `src/images/covers/` named per paper (not per journal — journals change covers across issues):
- `cognitive-traps.jpg` — Brief Commentary (JCR)
- `space-commons.jpg` — Behavioral Micro-Foundations (RP)
- `simple-eco-friendly.jpg` — Simple is Eco-Friendly (JA)
- `concealing-prices.jpg` — Concealing Prices (JCR)
- `disease-cues.jpg` — Consumer Responses to Disease Cues (EJM)
- `marketing-by-design.jpg` — Marketing by Design (JM)
- `serendipity.jpg` — Serendipity (JM)
- `constructive-choice.jpg` — Boundaries of Constructive Choice (JCP)
- `ad-skepticism.jpg` — Advertising Skepticism (P&M)

When adding a new paper, name the cover after the paper slug, not the journal.

**Link labels** (standardized):
- Journal link: label "Journal website", desc "Full text" (or "Full text (open access)" for OA)
- Preprint link: label "[Platform]" (PsyArXiv/arXiv/SSRN), desc "Preprint with PDF download"
- Machine-readable: label "Machine-readable", desc "Markdown (.md)" or "LaTeX source (.tex)"
- OSF data: label "Data and code (OSF)", desc "[osf.io/xxxxx]" (the actual URL)
- OSF icon SVG: use the OSF logo from contact.njk (fill="currentColor", stroke="none")

**Action button SVG icons:**
- Journal/DOI (external link): `<svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
- PDF (download): `<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
- Preprint (document): `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
- Data/Replication (database): `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`

**Button order** (standardized for all papers):
1. Journal website (if published)
2. Preprint (arXiv/PsyArXiv/SSRN, if applicable)
3. Machine-readable (.md download)
4. Data and code (OSF, if applicable)
5. Extra (e.g., Cognitive trap repository)

**Accordion behavior:** One paper open at a time. JS is in `main.js` using event delegation (SPA-safe). CSS animation uses `grid-template-rows: 0fr → 1fr`. No page-specific JS init needed.

### Create machine-readable version of a paper

Machine-readable `.md` files live in `src/files/papers/` and are downloadable from the research page. They are for AI tools (NotebookLM, Claude, ChatGPT, etc.).

**CRITICAL: Use pandoc for deterministic conversion. NEVER use an LLM to convert paper text. LLMs subtly mutate text (abbreviations, symbols, word choices). Pandoc is byte-faithful.**

**Pandoc location:** `"/c/Program Files/Pandoc/pandoc.exe"`

**Pipeline:**

```bash
# Step 1: Convert each DOCX source with pandoc
PANDOC="/c/Program Files/Pandoc/pandoc.exe"
"$PANDOC" manuscript.docx -t markdown --wrap=none -o _pandoc_ms.md
"$PANDOC" web_appendix.docx -t markdown --wrap=none -o _pandoc_wa.md
# For EPUBs (published version — prefer over DOCX when available):
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

# Add YAML frontmatter (metadata only — NOT body text)
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
1. EPUB (published version) — best: exact published text
2. Published PDF via pandoc — good but two-column extraction can garble
3. Accepted manuscript DOCX — good but pre-copyedit (may differ from published)

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
- Never summarize — include the full verbatim text
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

### Update teaching
Edit `src/teaching.njk`. Add courses to the appropriate institution section.

### Update bio
Edit `src/index.njk` — the `hero-bio` paragraph.

### Update contact info or social links
Edit `src/_data/site.json`.

### Update CV
Upload new PDF to Google Drive, get the file ID, update the URLs in `src/cv.njk`.

### Update headshot
Replace `src/images/headshot.jpg`.

## Analytics (installed 2026-04-20)

Three trackers live on every page via `src/_includes/base.njk`:

| Tool | What it tracks | Where it lives in base.njk | Dashboard |
|---|---|---|---|
| **Microsoft Clarity** (`wexegoktgd`) | Session recordings, heatmaps, scroll depth, engagement time, dead/rage/quickback clicks | `<script>` IIFE in `<head>` after theme-init | https://clarity.microsoft.com/projects/view/wexegoktgd |
| **Cloudflare Web Analytics** (`db16777525f64d0abb899762c3c29b9c`) | Pageviews, referrers, countries, devices, browsers, load times — no cookies | `<script defer>` just before `</body>` | https://dash.cloudflare.com/27bd7115ab2090ed90f2e0c4b329e60a/web-analytics |
| **Google Search Console** | Search queries, CTR, impressions, avg position, indexing issues — 24-48h data delay | `<meta name="google-site-verification">` in `<head>` | https://search.google.com/search-console?resource_id=https%3A%2F%2Ffelipemaffonso.com%2F |

**Do not remove** any of these: Clarity script, CF beacon, or the GSC meta tag. Losing the meta tag drops GSC property ownership.

**Unified dashboard view** for all three (queries + pageviews + behavioral signals) exists inside the academic-research Dashboard at `felipemaffonso.github.io/academic-research/` — click the bar-chart icon next to the Claude mascot in the header, or `Ctrl+Shift+A`. The worker at `research-dashboard-claude.webmarinelli.workers.dev` exposes `/api/analytics/{cf,gsc,clarity,summary}` (Bearer `GIST_TOKEN` auth). See `dashboard/CLAUDE.md` "Site Analytics" section for full architecture.

**To verify live:**
```bash
curl -s https://felipemaffonso.com/ | grep -oE 'google-site-verification[^>]*'
curl -s https://felipemaffonso.com/ | grep -oE 'wexegoktgd'
curl -s https://felipemaffonso.com/ | grep -oE 'db16777525f64d0abb899762c3c29b9c'
```

## Design Rules
- Coral accent: #DA7756 (used sparingly)
- No emojis
- System font stack: Segoe UI, -apple-system, BlinkMacSystemFont, Roboto
- Background: #f8f9fa
- Text: #1a1a1a (primary), #333333 (secondary), #666666 (dim)
- Signature element: coral particle network animation in nav bar and home hero
- Author name always bolded in publication entries

## After Making Changes
```bash
cd "c:/Users/fmarine/Dropbox/Felipe/CLAUDE CODE/personal-site"
git add -A && git commit -m "description" && GIT_TERMINAL_PROMPT=0 git push
```
Deploy happens automatically.

**Important:** Always use `GIT_TERMINAL_PROMPT=0` before `git push`. Without it, the push hangs waiting for an interactive credential prompt that can't appear in this terminal. The credentials are cached in Windows Credential Manager, so this flag just tells git to use them silently.
