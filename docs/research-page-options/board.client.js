(() => {
  const { pubs: PUBS, board: B } = window.DATA;
  const KEY = 'fma-research-page-board-v1';
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
  S.pins = S.pins || []; S.edits = S.edits || {}; S.decisions = S.decisions || {}; S.strokes = S.strokes || [];
  S.g = Object.assign({ label: 'Publications', theme: 'light', book: false }, S.g || {});
  const G = S.g;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const toast = (m) => { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2200); };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------------- the site, drawn from the data ---------------- */
  const TITLE = { book: 'Books', journal: 'Journal Publications', chapter: 'Book Chapters', preprint: 'Preprints' };
  const CHIP = { book: 'Books', journal: 'Journal publications', chapter: 'Book chapters', preprint: 'Preprints' };
  const CHIP_S = { book: 'Books', journal: 'Journal', chapter: 'Chapters', preprint: 'Preprints' };
  const TAG = { book: 'Book', journal: 'Article', chapter: 'Chapter', preprint: 'Preprint' };
  const BOOK = { id: 'future-book', section: 'book', placeholder: true };
  const ICON = {
    journal: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    other: '<path d="M7 3h7l5 5v13H7zM14 3v5h5"/>',
  };
  const CHEV = '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';
  const NAVH = (device) => (device === 'phone' ? 96 : 58);

  const items = (kind) => (kind === 'book' ? (G.book ? [BOOK] : []) : PUBS.filter((p) => p.section === kind));
  const order = (layout) => {
    const base = layout === 'today' ? ['preprint', 'journal', 'chapter'] : ['journal', 'chapter', 'preprint'];
    if (!G.book) return base;
    return layout === 'today' ? base.concat('book') : ['book'].concat(base);
  };
  const count = (kind) => items(kind).length;
  const total = (layout) => order(layout).reduce((a, k) => a + count(k), 0);

  function cover(id) {
    let h = 0;
    for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    let s = '';
    for (let i = 0; i < 9 * 12; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      const r = (h >>> 16) % 100;
      s += r < 5 ? '<span class="c"></span>' : r < 16 ? '<span class="d"></span>' : '<span></span>';
    }
    return '<div class="pcover" aria-hidden="true">' + s + '</div>';
  }

  function entry(p, n, o = {}) {
    if (p.placeholder) {
      return '<li class="pentry ph" data-kind="book" data-id="future-book"><div class="pcit">A future book would sit here, as the first section of the page. Preview only, not a real entry.</div></li>';
    }
    const can = !!(p.abstract || (p.links && p.links.length));
    const tag = o.tags ? `<span class="tag ${p.section}">${TAG[p.section]}</span>` : '';
    const num = o.numbers === false ? '' : `<span class="num">${n}.</span> `;
    const links = (p.links || []).map((l) =>
      `<div class="plink"><svg viewBox="0 0 24 24">${ICON[l.kind] || ICON.other}</svg><div>${esc(l.label)}<div>${esc(l.desc)}</div></div></div>`).join('');
    const panel = can
      ? `<div class="pdet"><div class="pdin"><div class="ppad">${links ? `<div class="plinks">${links}</div>` : ''}<div class="pabs">${cover(p.id)}<p><b>Abstract:</b> ${p.abstract}</p></div></div></div></div>`
      : '';
    return `<li class="pentry" data-kind="${p.section}" data-id="${p.id}"><div class="pcit"${can ? ' role="button" tabindex="0" aria-expanded="false"' : ''}>${num}${tag}${p.citation}${can ? CHEV : ''}</div>${panel}</li>`;
  }

  function section(kind, o = {}) {
    const its = items(kind);
    if (!its.length) return '';
    const note = kind === 'journal' ? '<p class="pnote">*Denotes equal authorship</p>' : '';
    return `<section class="psec" data-kind="${kind}"><h2 class="ptitle">${TITLE[kind]}</h2>${note}<ol class="plist">${its.map((p, i) => entry(p, i + 1, o)).join('')}</ol></section>`;
  }

  const CHIP_C = { book: 'Books', journal: 'Articles', chapter: 'Chapters', preprint: 'Preprints' };
  function chipRow(layout, device, attr) {
    const L = layout === 'C' ? CHIP_C : device === 'phone' ? CHIP_S : CHIP;
    const all = attr === 'f' ? `<button class="chip" data-f="all" aria-pressed="true">All<b>${total(layout)}</b></button>` : '';
    return `<div class="fbar"><div class="segs" role="toolbar" aria-label="Show"><span class="thumb"></span>${all}` +
      order(layout).map((k, i) => `<button class="chip" data-${attr}="${k}" aria-pressed="${attr === 'spy' && i === 0}">${L[k]}<b>${count(k)}</b></button>`).join('') +
      '</div></div>';
  }

  function yearGroups() {
    const all = order('C').flatMap((k) => items(k));
    const pub = all.filter((p) => p.section !== 'preprint');
    const dated = pub.filter((p) => !p.forthcoming && !p.placeholder);
    const groups = [];
    const add = (label, list) => { if (list.length) groups.push([label, list]); };
    add('Forthcoming', pub.filter((p) => p.forthcoming || p.placeholder));
    [...new Set(dated.map((p) => p.year))].sort((a, b) => b - a).forEach((y) => add(String(y), dated.filter((p) => p.year === y)));
    add('Preprints', all.filter((p) => p.section === 'preprint'));
    return groups.map(([l, list]) =>
      `<div class="ygroup"><div class="ylabel">${l}</div><ol class="plist">${list.map((p) => entry(p, 0, { tags: true, numbers: false })).join('')}</ol></div>`).join('');
  }

  function content(layout, device) {
    const secs = order(layout).map((k) => section(k)).join('');
    if (layout === 'today') return secs;
    if (layout === 'A') {
      const L = device === 'phone' ? CHIP_S : CHIP;
      return `<p class="jump">${order('A').map((k) => `<a data-jump="${k}">${L[k]} <span>(${count(k)})</span></a>`).join('<span aria-hidden="true">&middot;</span>')}</p>${secs}`;
    }
    if (layout === 'B') return chipRow('B', device, 'f') + `<div class="flist">${secs}</div>`;
    if (layout === 'C') return chipRow('C', device, 'f') + `<div class="flist">${yearGroups()}</div>`;
    if (device === 'phone') return chipRow('D', device, 'spy') + secs;
    return `<div class="dg"><aside class="rail"><div class="railh">On this page</div>${order('D').map((k, i) =>
      `<a data-spy="${k}" class="${i ? '' : 'on'}"><span>${CHIP[k]}</span><b>${count(k)}</b></a>`).join('')}</aside><div>${secs}</div></div>`;
  }

  function strip() {
    const cols = 46, rows = 4, cell = 14, gap = 5.5;
    let s = '', h = 7;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      h = (h * 1103515245 + 12345) >>> 0;
      const v = (h >>> 16) % 100;
      const corner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
      const fill = r === 2 && c === 12 ? 'var(--s-coral)' : corner ? 'var(--s-dim)' : v < 8 ? 'var(--s-border-strong)' : 'var(--s-surface2)';
      s += `<rect x="${c * (cell + gap)}" y="${r * (cell + gap)}" width="${cell}" height="${cell}" rx="2.5" fill="${fill}"/>`;
    }
    return `<div class="strip"><svg viewBox="0 0 ${cols * (cell + gap) - gap} ${rows * (cell + gap) - gap}" aria-hidden="true">${s}</svg></div>`;
  }

  function nav(device, label) {
    if (device === 'phone') return '<div class="snav"><span class="sname">Felipe M. Affonso</span><span class="menu"></span></div>';
    return `<div class="snav"><span class="sname">Felipe M. Affonso</span><div class="slinks"><span>Home</span><span class="on">${label}</span><span>Teaching</span><span>CV</span><span>Contact</span></div><div class="stogs"><i></i><i></i></div></div>`;
  }

  function siteHTML(layout, device) {
    const label = layout === 'today' ? 'Research' : G.label;
    const wide = layout === 'D' && device === 'desktop';
    return `<div class="site ${G.theme === 'dark' ? 'dark' : ''} ${device}"><div class="screen">${nav(device, label)}<div class="sbanner"><h1>${label}</h1></div>${strip()}<main class="spage${wide ? ' wide' : ''} L${layout}">${content(layout, device)}</main></div></div>`;
  }

  /* ---------------- instances: one live mockup in one frame ---------------- */
  const NATURAL = { desktop: [1000, 658], phone: [410, 800] };
  const LIVE = new Set();

  function mount(host, layout, device, scale) {
    if (host._inst) { host._inst.dead = true; LIVE.delete(host._inst); }
    const inst = { host, layout, device, scale: scale || 1 };
    host._inst = inst; LIVE.add(inst);
    render(inst);
    return inst;
  }

  function render(inst) {
    const url = inst.layout !== 'today' && G.label === 'Publications' ? 'felipemaffonso.com/publications/' : 'felipemaffonso.com/research/';
    inst.host.innerHTML = inst.device === 'desktop'
      ? `<div class="dev desktop"><div class="chrome"><i></i><i></i><i></i><div class="url">${url}</div></div>${siteHTML(inst.layout, 'desktop')}<div class="cursor"></div></div>`
      : `<div class="dev phone"><div class="notch"></div>${siteHTML(inst.layout, 'phone')}<div class="cursor"></div></div>`;
    inst.dev = inst.host.querySelector('.dev');
    inst.root = inst.host.querySelector('.screen');
    setScale(inst, inst.scale);
    wire(inst);
  }

  function setScale(inst, s) {
    inst.scale = s;
    const [w, h] = NATURAL[inst.device];
    inst.dev.style.transform = `scale(${s})`;
    inst.host.style.width = w * s + 'px';
    inst.host.style.height = h * s + 'px';
  }

  const yOf = (inst, el) => (el.getBoundingClientRect().top - inst.root.getBoundingClientRect().top) / inst.scale + inst.root.scrollTop;

  function animScroll(inst, y, ms) {
    const r = inst.root;
    const to = Math.max(0, Math.min(y, r.scrollHeight - r.clientHeight));
    const from = r.scrollTop;
    if (Math.abs(to - from) < 2) return Promise.resolve();
    return new Promise((res) => {
      const t0 = performance.now();
      (function step(now) {
        const k = Math.min(1, (now - t0) / ms);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        r.scrollTop = from + (to - from) * e;
        if (k < 1 && !inst.dead) requestAnimationFrame(step); else res();
      })(t0);
    });
  }

  function barH(inst) {
    const bar = inst.root.querySelector('.fbar');
    return bar ? bar.offsetHeight : 0;
  }

  function moveThumb(inst) {
    inst.root.querySelectorAll('.segs').forEach((segs) => {
      const on = segs.querySelector('.chip[aria-pressed="true"]');
      const th = segs.querySelector('.thumb');
      if (!on || !th) return;
      th.style.left = on.offsetLeft + 'px';
      th.style.width = on.offsetWidth + 'px';
      const pad = 24;
      if (on.offsetLeft < segs.scrollLeft + pad) segs.scrollTo({ left: on.offsetLeft - pad, behavior: 'smooth' });
      else if (on.offsetLeft + on.offsetWidth > segs.scrollLeft + segs.clientWidth - pad) segs.scrollTo({ left: on.offsetLeft + on.offsetWidth - segs.clientWidth + pad, behavior: 'smooth' });
    });
  }

  function filter(inst, f) {
    const r = inst.root;
    r.querySelectorAll('.chip[data-f]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.f === f)));
    moveThumb(inst);
    const list = r.querySelector('.flist');
    list.classList.add('out');
    setTimeout(() => {
      if (inst.layout === 'B') r.querySelectorAll('.psec').forEach((s) => { s.hidden = !(f === 'all' || s.dataset.kind === f); });
      else {
        r.querySelectorAll('.pentry').forEach((e) => { e.hidden = !(f === 'all' || e.dataset.kind === f); });
        r.querySelectorAll('.ygroup').forEach((g) => { g.hidden = ![...g.querySelectorAll('.pentry')].some((e) => !e.hidden); });
      }
      const limit = inst.fbarY - NAVH(inst.device);
      if (r.scrollTop > limit) r.scrollTop = limit;
      list.classList.remove('out');
    }, 150);
  }

  function spy(inst) {
    const r = inst.root;
    const secs = [...r.querySelectorAll('.psec')];
    if (!secs.length) return;
    let cur = secs[0].dataset.kind;
    const line = NAVH(inst.device) + barH(inst) + r.clientHeight * 0.4;
    secs.forEach((s) => { if (yOf(inst, s) - line <= r.scrollTop) cur = s.dataset.kind; });
    if (r.scrollTop + r.clientHeight >= r.scrollHeight - 4) cur = secs[secs.length - 1].dataset.kind;
    r.querySelectorAll('[data-spy]').forEach((a) => {
      const on = a.dataset.spy === cur;
      a.classList.toggle('on', on);
      if (a.classList.contains('chip')) a.setAttribute('aria-pressed', String(on));
    });
    moveThumb(inst);
  }

  function goSection(inst, kind) {
    const s = inst.root.querySelector(`.psec[data-kind="${kind}"]`);
    if (s) return animScroll(inst, yOf(inst, s) - NAVH(inst.device) - barH(inst) - 14, 650);
    return Promise.resolve();
  }

  function toggleEntry(inst, li) {
    const was = li.classList.contains('open');
    inst.root.querySelectorAll('.pentry.open').forEach((x) => { x.classList.remove('open'); x.querySelector('.pcit').setAttribute('aria-expanded', 'false'); });
    if (was) return;
    li.classList.add('open');
    li.querySelector('.pcit').setAttribute('aria-expanded', 'true');
    setTimeout(() => {
      if (inst.dead) return;
      const r = inst.root, y = yOf(inst, li), top = NAVH(inst.device) + barH(inst);
      if (y - r.scrollTop < top || y + li.offsetHeight - r.scrollTop > r.clientHeight) animScroll(inst, y - top - 10, 420);
    }, 300);
  }

  function wire(inst) {
    const r = inst.root;
    r.querySelectorAll('.pcit[role=button]').forEach((el) => {
      el.addEventListener('click', () => toggleEntry(inst, el.parentElement));
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleEntry(inst, el.parentElement); } });
    });
    r.querySelectorAll('[data-jump]').forEach((a) => a.addEventListener('click', () => goSection(inst, a.dataset.jump)));
    r.querySelectorAll('.chip[data-f]').forEach((c) => c.addEventListener('click', () => filter(inst, c.dataset.f)));
    r.querySelectorAll('.segs').forEach((segs) => segs.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const cs = [...segs.querySelectorAll('.chip')];
      const i = cs.indexOf(document.activeElement);
      if (i < 0) return;
      const n = cs[(i + (e.key === 'ArrowRight' ? 1 : cs.length - 1)) % cs.length];
      n.focus(); n.click();
    }));
    r.querySelectorAll('[data-spy]').forEach((a) => a.addEventListener('click', () => goSection(inst, a.dataset.spy)));
    const fbar = r.querySelector('.fbar');
    inst.fbarY = fbar ? yOf(inst, fbar) : 0;
    const snav = r.querySelector('.snav');
    r.addEventListener('scroll', () => {
      snav.classList.toggle('scrolled', r.scrollTop > 4);
      if (fbar) fbar.classList.toggle('stuck', r.scrollTop > inst.fbarY - NAVH(inst.device) - 1);
      if (inst.layout === 'D') spy(inst);
    }, { passive: true });
    requestAnimationFrame(() => moveThumb(inst));
  }

  /* ---------------- Play: a scripted visit with a visible finger ---------------- */
  async function aim(inst, el) {
    const c = inst.dev.querySelector('.cursor');
    const d = inst.dev.getBoundingClientRect(), e = el.getBoundingClientRect();
    const ax = e.width > 260 ? 70 : e.width / 2;
    c.style.left = (e.left + ax - d.left) / inst.scale + 'px';
    c.style.top = (e.top + e.height / 2 - d.top) / inst.scale + 'px';
    c.classList.add('on');
    await sleep(620);
  }
  const w = (ms) => () => sleep(ms);
  const top = (ms) => (inst) => animScroll(inst, 0, ms);
  const by = (px, ms) => (inst) => animScroll(inst, inst.root.scrollTop + px, ms);
  const toSec = (kind, ms) => (inst) => {
    const s = inst.root.querySelector(`.psec[data-kind="${kind}"]`);
    return s ? animScroll(inst, yOf(inst, s) - NAVH(inst.device) - 14, ms) : null;
  };
  const tap = (sel) => async (inst) => {
    const el = inst.root.querySelector(sel);
    if (!el) return;
    if (!el.closest('.fbar,.rail,.snav')) {
      const r = inst.root, y = yOf(inst, el), topLine = NAVH(inst.device) + barH(inst) + 30;
      if (y < r.scrollTop + topLine || y + 40 > r.scrollTop + r.clientHeight) await animScroll(inst, y - topLine - 40, 650);
    }
    await aim(inst, el);
    const c = inst.dev.querySelector('.cursor');
    c.classList.add('press');
    await sleep(140);
    el.click();
    await sleep(170);
    c.classList.remove('press');
    await sleep(260);
  };
  const PLAYS = {
    today: [w(450), toSec('journal', 1000), w(900), toSec('chapter', 1500), w(1500), top(900)],
    A: [w(450), tap('[data-jump="chapter"]'), w(1300), top(700), tap('[data-jump="preprint"]'), w(1200), top(700),
      tap('.pentry[data-id="point-vs-range"] .pcit'), w(1800), tap('.pentry[data-id="point-vs-range"] .pcit'), w(400)],
    B: [w(450), tap('.chip[data-f="chapter"]'), w(1300), tap('.chip[data-f="preprint"]'), w(1200), tap('.chip[data-f="journal"]'), w(500),
      tap('.pentry[data-id="concealing-prices"] .pcit'), w(1600), by(560, 1300), w(900), tap('.chip[data-f="all"]'), w(900), top(800)],
    C: [w(450), by(1000, 2600), w(700), top(800), tap('.chip[data-f="chapter"]'), w(1400), tap('.chip[data-f="all"]'), w(600)],
    D: [w(450), by(1200, 2800), w(700), tap('[data-spy="preprint"]'), w(1300), tap('[data-spy="journal"]'), w(1000)],
  };
  async function play(inst, btn) {
    if (inst.playing) return;
    render(inst);
    inst.playing = true;
    if (btn) btn.disabled = true;
    await sleep(120);
    for (const step of PLAYS[inst.layout]) { if (inst.dead) break; await step(inst); }
    if (!inst.dead) inst.dev.querySelector('.cursor').classList.remove('on');
    inst.playing = false;
    if (btn) btn.disabled = false;
  }

  /* ---------------- the board ---------------- */
  let view = 'options', opt = B.pick.option;
  const played = new Set();
  const stageD = document.getElementById('sd'), stageP = document.getElementById('sp');

  function stageScale() {
    const st = document.querySelector('.stage');
    const avail = st.clientWidth - 34;
    return Math.min(1, avail / (NATURAL.desktop[0] + NATURAL.phone[0]));
  }
  function showOption(key, auto) {
    opt = key;
    document.querySelectorAll('.otab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.opt === key)));
    document.querySelectorAll('.odesc').forEach((d) => { d.hidden = d.dataset.opt !== key; });
    document.getElementById('oname').textContent = B.options.find((o) => o.key === key).name;
    const s = window.innerWidth < 900 ? Math.min(1, (window.innerWidth - 40) / NATURAL.desktop[0]) : stageScale();
    const d = mount(stageD, key, 'desktop', s);
    mount(stageP, key, 'phone', window.innerWidth < 900 ? Math.min(1, (window.innerWidth - 40) / NATURAL.phone[0]) : s);
    if (auto && !played.has(key)) { played.add(key); setTimeout(() => play(d), 700); }
  }
  document.querySelectorAll('.otab').forEach((t) => t.addEventListener('click', () => showOption(t.dataset.opt, true)));
  document.getElementById('oplay').addEventListener('click', (e) => { play(stageD._inst, e.currentTarget); play(stageP._inst); });

  function phonesScale() {
    const box = document.querySelector('.phones');
    return Math.min(0.7, (box.clientWidth - 4 * 22) / 5 / NATURAL.phone[0]);
  }
  function mountPhones() {
    const s = phonesScale();
    document.querySelectorAll('.pcell').forEach((c) => mount(c.querySelector('.devwrap'), c.dataset.opt, 'phone', s));
  }
  document.querySelectorAll('[data-pplay]').forEach((b) => b.addEventListener('click', () => play(b.closest('.pcell').querySelector('.devwrap')._inst, b)));
  document.getElementById('playall').addEventListener('click', () => document.querySelectorAll('.pcell .devwrap').forEach((h) => play(h._inst)));

  function showView(v) {
    view = v;
    document.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
    document.querySelectorAll('.view').forEach((x) => x.classList.toggle('on', x.id === 'v-' + v));
    if (v === 'phones') mountPhones();
    if (v === 'options') showOption(opt, false);
    paintPins(); sizeCanvas();
  }
  document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));

  function paintGlobal() {
    document.querySelectorAll('[data-g]').forEach((b) => b.setAttribute('aria-pressed', String(String(G[b.dataset.g]) === b.dataset.v)));
  }
  document.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.g;
    G[k] = k === 'book' ? b.dataset.v === 'true' : b.dataset.v;
    save(); paintGlobal();
    LIVE.forEach((inst) => { if (!inst.playing) render(inst); });
  }));
  paintGlobal();

  addEventListener('resize', () => {
    clearTimeout(window._rz);
    window._rz = setTimeout(() => { if (view === 'options') showOption(opt, false); if (view === 'phones') mountPhones(); sizeCanvas(); }, 200);
  });

  /* full screen */
  const fs = document.getElementById('fs');
  document.getElementById('ofs').addEventListener('click', () => {
    fs.classList.add('on');
    const s = Math.min(1.2, (innerWidth - 60) / NATURAL.desktop[0], (innerHeight - 70) / NATURAL.desktop[1]);
    const inst = mount(document.getElementById('fsd'), opt, 'desktop', s);
    setTimeout(() => play(inst), 500);
  });
  const closeFs = () => { const h = document.getElementById('fsd'); if (h._inst) { h._inst.dead = true; LIVE.delete(h._inst); h._inst = null; } h.innerHTML = ''; fs.classList.remove('on'); };
  document.getElementById('fsclose').addEventListener('click', closeFs);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFs(); });

  /* decisions */
  document.querySelectorAll('.dcard').forEach((card) => {
    const id = card.dataset.decision;
    const paint = () => {
      const picked = S.decisions[id];
      card.querySelectorAll('.dopt').forEach((o) => o.setAttribute('aria-pressed', String(o.dataset.key === picked)));
      const out = card.querySelector('.dpicked');
      if (picked) {
        const o = [...card.querySelectorAll('.dopt')].find((x) => x.dataset.key === picked);
        out.textContent = picked === '__skip' ? 'left open on purpose' : 'you chose: ' + o.querySelector('.dlabel').textContent;
        out.hidden = false;
      } else out.hidden = true;
    };
    card.querySelectorAll('.dopt').forEach((o) => o.addEventListener('click', () => {
      if (S.decisions[id] === o.dataset.key) delete S.decisions[id]; else S.decisions[id] = o.dataset.key;
      save(); paint();
    }));
    paint();
  });
  function answers() {
    const L = [];
    document.querySelectorAll('.dcard').forEach((c) => {
      const k = S.decisions[c.dataset.decision];
      const o = k && [...c.querySelectorAll('.dopt')].find((x) => x.dataset.key === k);
      L.push(c.querySelector('h3').textContent, '  -> ' + (!k ? '(not answered)' : k === '__skip' ? 'left open on purpose' : o.querySelector('.dlabel').textContent));
    });
    return L;
  }
  document.getElementById('copydec').addEventListener('click', () => {
    navigator.clipboard.writeText(['Research page: my answers', ''].concat(answers()).join('\n')).then(() => toast('Answers copied. Paste them back in the chat.'));
  });

  /* ---------------- the annotation kit (pins, drawing, copy edits) ---------------- */
  let mode = null;
  const ctx = () => view + (view === 'options' ? ' / ' + B.options.find((o) => o.key === opt).tab : '');
  document.querySelectorAll('#kit button').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.kit;
    if (k === 'export') return exportNotes();
    if (k === 'clear') {
      if (!confirm('Clear every pin, drawing and copy edit on this board?')) return;
      S.pins = []; S.edits = {}; S.strokes = []; save(); location.reload(); return;
    }
    mode = mode === k ? null : k;
    document.querySelectorAll('#kit button').forEach((x) => x.classList.toggle('on', x.dataset.kit === mode));
    document.body.classList.toggle('pin', mode === 'pin');
    document.body.classList.toggle('draw', mode === 'draw');
    document.body.classList.toggle('copyedit', mode === 'copyedit');
    document.querySelectorAll('[data-ed]').forEach((el) => { el.contentEditable = mode === 'copyedit' ? 'true' : 'false'; });
    if (mode) toast(mode === 'pin' ? 'Click anywhere to drop a note' : mode === 'draw' ? 'Drag to draw' : 'Click any text to rewrite it');
  }));
  function near(x, y) {
    const el = document.elementFromPoint(x - scrollX, y - scrollY);
    const t = el && (el.closest('.pentry,.chip,h2,h3,.card,.devwrap,td,p') || el);
    return t ? (t.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70) : '';
  }
  function paintPins() {
    document.querySelectorAll('.pinmark').forEach((m) => m.remove());
    S.pins.forEach((p, i) => {
      if (p.view && p.view !== view) return;
      const m = document.createElement('div');
      m.className = 'pinmark'; m.textContent = i + 1;
      m.style.left = p.x + 'px'; m.style.top = p.y + 'px';
      m.addEventListener('click', (ev) => { ev.stopPropagation(); openPin(p, m); });
      document.body.appendChild(m);
    });
  }
  function openPin(p, m) {
    document.querySelectorAll('.pinpop').forEach((x) => x.remove());
    const pop = document.createElement('div');
    pop.className = 'pinpop';
    pop.style.left = p.x + 'px'; pop.style.top = p.y + 'px';
    pop.innerHTML = '<textarea placeholder="what about this spot"></textarea><div class="prow"><button data-a="save">Save</button><button data-a="del">Delete</button></div>';
    const ta = pop.querySelector('textarea');
    ta.value = p.note || '';
    pop.querySelector('[data-a="save"]').addEventListener('click', () => { p.note = ta.value; save(); pop.remove(); toast('Saved'); });
    pop.querySelector('[data-a="del"]').addEventListener('click', () => { S.pins = S.pins.filter((x) => x !== p); save(); pop.remove(); paintPins(); });
    pop.addEventListener('click', (ev) => ev.stopPropagation());
    document.body.appendChild(pop);
    ta.focus();
  }
  document.addEventListener('click', (ev) => {
    if (mode !== 'pin') { if (!ev.target.closest('.pinpop')) document.querySelectorAll('.pinpop').forEach((x) => x.remove()); return; }
    if (ev.target.closest('#kit') || ev.target.closest('.pinmark') || ev.target.closest('.pinpop')) return;
    ev.preventDefault(); ev.stopPropagation();
    const p = { x: ev.pageX, y: ev.pageY, note: '', view, ctx: ctx(), near: near(ev.pageX, ev.pageY) };
    S.pins.push(p); save(); paintPins();
    openPin(p, null);
  }, true);

  const cv = document.getElementById('ink'), cx = cv.getContext('2d');
  function sizeCanvas() {
    const H = document.documentElement.scrollHeight;
    cv.width = document.documentElement.scrollWidth; cv.height = H; cv.style.height = H + 'px';
    cx.strokeStyle = '#da7756'; cx.lineWidth = 2.5; cx.lineCap = 'round'; cx.lineJoin = 'round';
    S.strokes.forEach((s) => {
      if (s.view && s.view !== view) return;
      const pts = s.pts || s;
      cx.beginPath(); pts.forEach((pt, i) => (i ? cx.lineTo(pt[0], pt[1]) : cx.moveTo(pt[0], pt[1]))); cx.stroke();
    });
  }
  let cur = null;
  cv.addEventListener('pointerdown', (e) => { if (mode !== 'draw') return; cur = [[e.pageX, e.pageY]]; cx.beginPath(); cx.moveTo(e.pageX, e.pageY); });
  cv.addEventListener('pointermove', (e) => { if (!cur) return; cur.push([e.pageX, e.pageY]); cx.lineTo(e.pageX, e.pageY); cx.stroke(); });
  addEventListener('pointerup', () => { if (cur && cur.length > 1) { S.strokes.push({ view, pts: cur }); save(); } cur = null; });

  document.querySelectorAll('[data-ed]').forEach((el, i) => {
    const id = 'e' + i;
    if (S.edits[id]) { el.textContent = S.edits[id].now; el.classList.add('edited'); el.dataset.orig = S.edits[id].orig; }
    else el.dataset.orig = el.textContent.trim();
    el.addEventListener('blur', () => {
      const now = el.textContent.trim();
      if (now === el.dataset.orig) { delete S.edits[id]; el.classList.remove('edited'); }
      else { S.edits[id] = { orig: el.dataset.orig, now }; el.classList.add('edited'); }
      save();
    });
  });

  function exportNotes() {
    const L = ['MY NOTES ON THE RESEARCH PAGE BOARD', ''];
    if (S.pins.length) {
      L.push('PINS');
      S.pins.forEach((p, i) => L.push(`  ${i + 1}. [${p.ctx || p.view || ''}${p.near ? ', near "' + p.near + '"' : ''}] ${p.note || '(no text)'}`));
      L.push('');
    }
    const ed = Object.values(S.edits);
    if (ed.length) { L.push('COPY EDITS'); ed.forEach((e) => L.push(`  '${e.orig}' -> '${e.now}'`)); L.push(''); }
    if (Object.keys(S.decisions).length) { L.push('DECISIONS'); answers().forEach((x) => L.push('  ' + x)); L.push(''); }
    if (S.strokes.length) L.push(`(${S.strokes.length} freehand marks on the board)`);
    L.push(`(viewed with: menu name ${G.label}, ${G.theme} theme, book preview ${G.book ? 'on' : 'off'})`);
    if (L.length <= 3) { toast('Nothing marked yet'); return; }
    navigator.clipboard.writeText(L.join('\n')).then(() => toast('Notes copied. Paste them back in the chat.'));
  }

  /* start */
  showView('options');
  showOption(opt, true);
  paintPins();
  setTimeout(sizeCanvas, 300);
})();
