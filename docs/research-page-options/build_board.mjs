// Build the Research page options board from its manifests.
//
//   python -X utf8 docs/research-page-options/extract_pubs.py   (refreshes manifest.json from lib/publications.tsx + the cv repo)
//   node docs/research-page-options/build_board.mjs              (writes RESEARCH-PAGE-OPTIONS.html beside this file)
//
// manifest.json holds the publication entries; board.json holds the options, decisions and open items.
// board.css and board.client.js are inlined, so the output is one self-contained file. Nothing here touches the
// site build (app/, components/, lib/, public/) and nothing here deploys.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(join(HERE, f), 'utf8');
const M = JSON.parse(read('manifest.json'));
const B = JSON.parse(read('board.json'));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const n = (k) => M.pubs.filter((p) => p.section === k).length;
const counts = { journal: n('journal'), chapter: n('chapter'), preprint: n('preprint') };
const totalN = M.pubs.length;
const screens = (px, vh) => (px / vh).toFixed(1);
const fmt = (x) => x.toLocaleString('en-US');
const m = B.measured;

// refuse what the house rules forbid in anything Felipe reads
const prose = JSON.stringify(B);
if (/—/.test(prose)) throw new Error('board.json carries an em dash');
if (totalN !== counts.journal + counts.chapter + counts.preprint) throw new Error('an entry has an unknown section');
if (counts.chapter !== 2) throw new Error(`expected the two book chapters, found ${counts.chapter}`);

const tabs = B.options.map((o) =>
  `<button class="otab" data-opt="${o.key}" aria-selected="false">${esc(o.tab)}${o.key === B.pick.option ? '<span class="star">my pick</span>' : ''}</button>`).join('');

const descs = B.options.map((o) => `
  <div class="odesc" data-opt="${o.key}" hidden>
    <div class="card"><h3>What changes</h3><p data-ed>${esc(o.what)}</p></div>
    <div class="card"><h3>What it does well</h3><ul>${o.good.map((g) => `<li data-ed>${esc(g)}</li>`).join('')}</ul></div>
    <div class="card"><h3>What it costs</h3><ul>${o.cost.map((g) => `<li data-ed>${esc(g)}</li>`).join('')}</ul></div>
  </div>`).join('');

const phones = B.options.map((o) => `
  <div class="pcell" data-opt="${o.key}">
    <div class="ph-h"><b>${esc(o.tab)}</b><button class="btn play" data-pplay>Play</button></div>
    <div class="devwrap"></div>
  </div>`).join('');

const pickCol = B.options.findIndex((o) => o.key === B.pick.option) + 1;
const ttable = `<table class="tt"><thead><tr><th></th>${B.options.map((o, i) =>
  `<th class="${i + 1 === pickCol ? 'hl' : ''}">${esc(o.tab)}</th>`).join('')}</tr></thead><tbody>${B.tradeoffs.rows.map((r) =>
  `<tr>${r.map((c, i) => `<td class="${i === pickCol ? 'hl' : ''}" data-ed>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

const decisions = B.decisions.map((d) => `
  <div class="dcard" data-decision="${d.id}">
    <h3>${esc(d.q)}</h3>
    ${d.options.map(([k, l]) => `<button class="dopt" data-key="${k}" aria-pressed="false"><span class="dot"></span><span class="dlabel">${esc(l)}</span></button>`).join('')}
    <button class="dopt" data-key="__skip" aria-pressed="false"><span class="dot"></span><span class="dlabel">Leave open for now</span></button>
    <div class="dpicked" hidden></div>
  </div>`).join('');

const gaps = `<table class="tt"><thead><tr><th>Item</th><th>Where it stands</th><th>What it means</th><th>Who</th></tr></thead><tbody>${B.gaps.map((g) =>
  `<tr>${g.map((c) => `<td data-ed>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

const data = JSON.stringify({ pubs: M.pubs, board: B }).replace(/</g, '\\u003c');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Research page options</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
<style>${read('board.css')}</style></head>
<body>
<canvas id="ink"></canvas>
<div class="wrap">
  <div class="kicker">${esc(B.kicker)}</div>
  <h1 class="ht" data-ed>${esc(B.title)}</h1>
  <p class="thesis" data-ed>${esc(B.thesis)}</p>
  <div class="stats">
    <div class="stat"><div class="statn">${totalN}</div><div class="statl">entries with the chapters: ${counts.journal} journal publications, ${counts.chapter} book chapters, ${counts.preprint} preprints</div></div>
    <div class="stat"><div class="statn">${screens(m.laptopPx, m.laptopViewport)} <small>screens</small></div><div class="statl">tall on a laptop today, every entry closed (${fmt(m.laptopPx)} px)</div></div>
    <div class="stat"><div class="statn">${screens(m.phonePx, m.phoneViewport)} <small>screens</small></div><div class="statl">tall on a phone today (${fmt(m.phonePx)} px)</div></div>
    <div class="stat"><div class="statn">${counts.preprint}</div><div class="statl">preprints a visitor reads past before the first published paper, today</div></div>
  </div>
  <div class="pick">
    <h2 data-ed>${esc(B.pick.headline)}</h2>
    <ol>${B.pick.reasons.map((r) => `<li data-ed>${esc(r)}</li>`).join('')}</ol>
    <div class="measured">Heights measured ${esc(m.date)} on ${esc(m.how)}. The citations in the mockups are the live site's, word for word; the two chapters are from your CV.</div>
  </div>

  <div class="bar">
    <div class="seg-b" role="group" aria-label="View">
      <button data-view="options" aria-pressed="true">The options</button>
      <button data-view="phones" aria-pressed="false">Phones side by side</button>
      <button data-view="tradeoffs" aria-pressed="false">Trade-offs</button>
      <button data-view="decide" aria-pressed="false">Decide</button>
    </div>
    <span class="spacer"></span>
    <span class="ctl">Menu name <span class="seg-b"><button data-g="label" data-v="Research">Research</button><button data-g="label" data-v="Publications">Publications</button></span></span>
    <span class="ctl">Theme <span class="seg-b"><button data-g="theme" data-v="light">Light</button><button data-g="theme" data-v="dark">Dark</button></span></span>
    <span class="ctl">A future book <span class="seg-b"><button data-g="book" data-v="false">Hide</button><button data-g="book" data-v="true">Preview</button></span></span>
  </div>

  <section class="view on" id="v-options">
    <div class="otabs">${tabs}</div>
    <div class="stagehead"><h2 id="oname"></h2>
      <button class="btn play" id="oplay"><svg viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>Play</button>
      <button class="btn" id="ofs">Full screen</button>
      <span class="ctl">Every mockup is live: tap an entry, a button, or scroll inside the screen.</span>
    </div>
    <div class="stage">
      <div><p class="devlabel">Laptop</p><div class="devwrap" id="sd"></div></div>
      <div><p class="devlabel">Phone</p><div class="devwrap" id="sp"></div></div>
    </div>
    ${descs}
  </section>

  <section class="view" id="v-phones">
    <div class="stagehead"><h2>All five on a phone</h2><button class="btn play" id="playall">Play all</button></div>
    <div class="phones">${phones}</div>
  </section>

  <section class="view" id="v-tradeoffs">
    <div class="stagehead"><h2>How the options compare</h2></div>
    ${ttable}
  </section>

  <section class="view" id="v-decide">
    <div class="stagehead"><h2>Your calls</h2></div>
    <div class="dgridb">${decisions}</div>
    <div class="decide-foot"><button class="btn play" id="copydec">Copy my answers</button><span class="ctl">Your taps are saved in this browser.</span></div>
  </section>

  <h2 class="sec-h">What is still open</h2>
  ${gaps}

  <footer class="ft">Generated ${esc(m.date)} from <code>manifest.json</code> (lib/publications.tsx and the cv repo) and <code>board.json</code> by
    <code>docs/research-page-options/build_board.mjs</code> in the felipemaffonso.com repo. Mockups only: nothing on the live site changed.</footer>
</div>

<div id="fs"><div class="fsbar"><button class="btn" id="fsclose">Close (Esc)</button></div><div class="devwrap" id="fsd" style="margin-top:34px"></div></div>
<div id="kit"><button data-kit="pin">Pin</button><button data-kit="draw">Draw</button><button data-kit="copyedit">Copy</button><button data-kit="export">Copy my notes</button><button data-kit="clear">Clear</button></div>
<div id="toast"></div>
<script>window.DATA = ${data};</script>
<script>${read('board.client.js')}</script>
</body></html>
`;

const out = join(HERE, 'RESEARCH-PAGE-OPTIONS.html');
writeFileSync(out, html, 'utf8');
console.log(`wrote ${out} (${(html.length / 1024).toFixed(1)} KB): ${totalN} entries, ${B.options.length} options, ${B.decisions.length} decisions, ${B.gaps.length} open items`);
