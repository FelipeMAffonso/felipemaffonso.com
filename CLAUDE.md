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

**Cover images** go in `src/images/covers/` with short names: `jcr.jpg`, `jm.jpg`, `jcp.jpg`, `ejm.jpg`, `jadv.jpg`, `rp.jpg`, `pm.jpg`. Multiple papers in the same journal reuse the same cover.

**Action button SVG icons:**
- Journal/DOI (external link): `<svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
- PDF (download): `<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
- Preprint (document): `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
- Data/Replication (database): `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`

**Accordion behavior:** One paper open at a time. JS is in `main.js` using event delegation (SPA-safe). CSS animation uses `grid-template-rows: 0fr → 1fr`. No page-specific JS init needed.

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
git add -A && git commit -m "description" && git push
```
Deploy happens automatically.
