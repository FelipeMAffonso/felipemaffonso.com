"use client";

/* ============================================================
   The annotation kit (pins, freehand ink, copy edits, Copy my
   notes), ported from the October 2026 Research page board
   (docs/research-page-options/board.client.js). Everything is kept
   in this browser's storage under one key.
   ============================================================ */

import { useEffect, useRef } from "react";

export const KIT_KEY = "fma-filter-options-v1";
export type KitState = {
  pins: { x: number; y: number; note: string; ctx: string; near: string }[];
  edits: Record<string, { orig: string; now: string }>;
  strokes: { ctx: string; pts: [number, number][] }[];
  choice?: { combo: string; at: string };
  view?: Record<string, string>;
};
export function loadKit(): KitState {
  let S: Partial<KitState> = {};
  try { S = JSON.parse(localStorage.getItem(KIT_KEY) || "{}"); } catch { S = {}; }
  return { pins: S.pins || [], edits: S.edits || {}, strokes: S.strokes || [], choice: S.choice, view: S.view };
}
export function saveKit(S: KitState) {
  try { localStorage.setItem(KIT_KEY, JSON.stringify(S)); } catch { /* private window: notes stay on screen only */ }
}
export function toast(m: string) {
  const t = document.getElementById("fo-toast");
  if (!t) return;
  t.textContent = m;
  t.classList.add("on");
  window.clearTimeout((t as HTMLElement & { _t?: number })._t);
  (t as HTMLElement & { _t?: number })._t = window.setTimeout(() => t.classList.remove("on"), 2200);
}

export function ReviewKit({ ctx }: { ctx: () => string }) {
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  useEffect(() => {
    const S = loadKit();
    let mode: string | null = null;
    const kit = document.getElementById("fo-kit")!;
    const cv = document.getElementById("fo-ink") as HTMLCanvasElement;
    const cx = cv.getContext("2d")!;

    const near = (x: number, y: number) => {
      const el = document.elementFromPoint(x - window.scrollX, y - window.scrollY);
      const t = el && (el.closest(".pub-entry,.fo-trigger,.fo-vrow,.fo-chip,h2,h3,.fo-card,.fo-set,p,label,button") || el);
      return t ? (t.textContent || "").trim().replace(/\s+/g, " ").slice(0, 70) : "";
    };
    const paintPins = () => {
      document.querySelectorAll(".fo-pinmark").forEach((m) => m.remove());
      S.pins.forEach((p, i) => {
        const m = document.createElement("div");
        m.className = "fo-pinmark";
        m.textContent = String(i + 1);
        m.style.left = p.x + "px";
        m.style.top = p.y + "px";
        m.addEventListener("click", (ev) => { ev.stopPropagation(); openPin(p); });
        document.body.appendChild(m);
      });
    };
    const openPin = (p: KitState["pins"][number]) => {
      document.querySelectorAll(".fo-pinpop").forEach((x) => x.remove());
      const pop = document.createElement("div");
      pop.className = "fo-pinpop";
      pop.style.left = p.x + "px";
      pop.style.top = p.y + "px";
      pop.innerHTML = '<textarea placeholder="What about this spot?"></textarea><div class="prow"><button data-a="save">Save</button><button data-a="del">Delete</button></div>';
      const ta = pop.querySelector("textarea")!;
      ta.value = p.note || "";
      pop.querySelector('[data-a="save"]')!.addEventListener("click", () => { p.note = ta.value; saveKit(S); pop.remove(); toast("Saved"); });
      pop.querySelector('[data-a="del"]')!.addEventListener("click", () => { S.pins = S.pins.filter((x) => x !== p); saveKit(S); pop.remove(); paintPins(); });
      pop.addEventListener("click", (ev) => ev.stopPropagation());
      document.body.appendChild(pop);
      ta.focus();
    };
    const onDocClick = (ev: MouseEvent) => {
      const tgt = ev.target as HTMLElement;
      if (mode !== "pin") { if (!tgt.closest(".fo-pinpop")) document.querySelectorAll(".fo-pinpop").forEach((x) => x.remove()); return; }
      if (tgt.closest("#fo-kit") || tgt.closest(".fo-pinmark") || tgt.closest(".fo-pinpop")) return;
      ev.preventDefault();
      ev.stopPropagation();
      const p = { x: ev.pageX, y: ev.pageY, note: "", ctx: ctxRef.current(), near: near(ev.pageX, ev.pageY) };
      S.pins.push(p);
      saveKit(S);
      paintPins();
      openPin(p);
    };
    document.addEventListener("click", onDocClick, true);

    const sizeCanvas = () => {
      const H = document.documentElement.scrollHeight;
      cv.width = document.documentElement.scrollWidth;
      cv.height = H;
      cv.style.height = H + "px";
      cx.strokeStyle = "#da7756"; cx.lineWidth = 2.5; cx.lineCap = "round"; cx.lineJoin = "round";
      S.strokes.forEach((s) => { cx.beginPath(); s.pts.forEach((pt, i) => (i ? cx.lineTo(pt[0], pt[1]) : cx.moveTo(pt[0], pt[1]))); cx.stroke(); });
    };
    let cur: [number, number][] | null = null;
    const down = (e: PointerEvent) => { if (mode !== "draw") return; cur = [[e.pageX, e.pageY]]; cx.beginPath(); cx.moveTo(e.pageX, e.pageY); };
    const move = (e: PointerEvent) => { if (!cur) return; cur.push([e.pageX, e.pageY]); cx.lineTo(e.pageX, e.pageY); cx.stroke(); };
    const up = () => { if (cur && cur.length > 1) { S.strokes.push({ ctx: ctxRef.current(), pts: cur }); saveKit(S); } cur = null; };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    /* copy edits are keyed by the original sentence, because the notes change with the design on screen */
    const edEls = () => Array.from(document.querySelectorAll<HTMLElement>("[data-ed]"));
    const applyEdits = () => edEls().forEach((el) => {
      const txt = (el.textContent || "").trim();
      const prev = el.dataset.orig;
      const prevEdit = prev ? S.edits[prev] : undefined;
      const typing = document.activeElement === el;
      // the page put a new sentence in this element (another design is on screen)
      if (!prev || (!typing && txt !== prev && !(prevEdit && txt === prevEdit.now))) {
        el.dataset.orig = txt;
        el.classList.remove("edited");
      }
      const e = S.edits[el.dataset.orig as string];
      if (e && !typing && txt !== e.now) { el.textContent = e.now; el.classList.add("edited"); }
      el.contentEditable = mode === "copyedit" ? "true" : "false";
    });
    const onFocusOut = (ev: FocusEvent) => {
      const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-ed]");
      if (!el || !el.dataset.orig) return;
      const now = (el.textContent || "").trim();
      if (now === el.dataset.orig) { delete S.edits[el.dataset.orig]; el.classList.remove("edited"); }
      else { S.edits[el.dataset.orig] = { orig: el.dataset.orig, now }; el.classList.add("edited"); }
      saveKit(S);
    };
    document.addEventListener("focusout", onFocusOut);
    const obs = new MutationObserver(() => applyEdits());
    obs.observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
    applyEdits();

    const exportNotes = () => {
      const fresh = loadKit();
      S.choice = fresh.choice;
      const L = ["MY NOTES ON THE PUBLICATION FILTER OPTIONS", ""];
      if (S.choice) { L.push("MY CHOICE", "  " + S.choice.combo, ""); }
      if (S.pins.length) {
        L.push("PINS");
        S.pins.forEach((p, i) => L.push(`  ${i + 1}. [${p.ctx}${p.near ? ', near "' + p.near + '"' : ""}] ${p.note || "(no text)"}`));
        L.push("");
      }
      const ed = Object.values(S.edits);
      if (ed.length) { L.push("COPY EDITS"); ed.forEach((e) => L.push(`  '${e.orig}' -> '${e.now}'`)); L.push(""); }
      if (S.strokes.length) L.push(`(${S.strokes.length} freehand marks on the page)`);
      L.push(`(last combination on screen: ${ctxRef.current()})`);
      if (!S.choice && !S.pins.length && !ed.length && !S.strokes.length) { toast("Nothing marked yet"); return; }
      navigator.clipboard.writeText(L.join("\n")).then(() => toast("Notes copied. Paste them back in the chat."));
    };

    const onKit = (ev: MouseEvent) => {
      const b = (ev.target as HTMLElement).closest<HTMLButtonElement>("button[data-kit]");
      if (!b) return;
      const k = b.dataset.kit!;
      if (k === "export") return exportNotes();
      if (k === "clear") {
        if (!window.confirm("Clear every pin, drawing and copy edit on this page?")) return;
        S.pins = []; S.edits = {}; S.strokes = []; S.choice = undefined; saveKit(S); window.location.reload(); return;
      }
      mode = mode === k ? null : k;
      kit.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x.dataset.kit === mode));
      document.body.classList.toggle("fo-pinning", mode === "pin");
      document.body.classList.toggle("fo-drawing", mode === "draw");
      applyEdits();
      if (mode) toast(mode === "pin" ? "Click anywhere to drop a note" : mode === "draw" ? "Drag to draw" : "Click any text to rewrite it");
    };
    kit.addEventListener("click", onKit);

    paintPins();
    const t = window.setTimeout(sizeCanvas, 400);
    window.addEventListener("resize", sizeCanvas);
    return () => {
      document.removeEventListener("click", onDocClick, true);
      document.removeEventListener("focusout", onFocusOut);
      obs.disconnect();
      kit.removeEventListener("click", onKit);
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("resize", sizeCanvas);
      window.clearTimeout(t);
      document.querySelectorAll(".fo-pinmark,.fo-pinpop").forEach((m) => m.remove());
    };
  }, []);

  return (
    <>
      <canvas id="fo-ink" aria-hidden="true" />
      <div id="fo-kit" role="toolbar" aria-label="Notes">
        <button type="button" data-kit="pin">Pin</button>
        <button type="button" data-kit="draw">Draw</button>
        <button type="button" data-kit="copyedit">Edit text</button>
        <button type="button" data-kit="export">Copy my notes</button>
        <button type="button" data-kit="clear">Clear</button>
      </div>
      <div id="fo-toast" role="status" />
    </>
  );
}
