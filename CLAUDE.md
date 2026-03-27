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

### Add a new publication
Edit `src/research.njk`. Add a new `<p class="pub-entry">` in the appropriate section (Preprints, Forthcoming, or Published). Bold the author's name with `<strong>`. Link the journal name to the DOI.

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
