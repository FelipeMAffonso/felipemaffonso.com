"use client";

/* ============================================================
   The filter options review page (/filter-options/, branch
   pub-filter-options). Generated from copy.ts. With ?frame=1 it
   renders the Publications page alone, for the phone view's frame.
   ============================================================ */

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageBanner } from "@/components/PageBanner";
import { PageStrip } from "@/components/PageStrip";
import { FilterRow } from "@/components/FilterRow";
import { Button } from "@/components/ui/button";
import { FluidProvider } from "@/lib/fluid-provider";
import { Elevated } from "@/lib/elevated";
import { BOARD } from "./copy";
import { Prototype } from "./Prototype";
import { LongRange } from "./LongRange";
import { ReviewKit, loadKit, saveKit, toast } from "./ReviewKit";
import type { Settings, Types } from "./model";
import "./filter-options.css";

const PICK = BOARD.pick.settings;
/* Felipe's decisions of 2026-11-14 (copy.ts, decided): fixed, no longer settings on the page */
const FIXED = BOARD.decided.settings;
const TYPESETS = BOARD.types.map((x) => x.key);

const one = <T extends string>(v: string | null | undefined, all: T[], dflt: T): T => (v && (all as string[]).includes(v) ? (v as T) : dflt);
const query = (s: Settings) => `types=${s.types}`;
const comboText = (s: Settings) =>
  `Journal and Year buttons on the left, book and calendar icons, Forthcoming its own stop; type: ${BOARD.types.find((x) => x.key === s.types)!.name.toLowerCase()}`;
const read = (get: (k: string) => string | null | undefined): Settings => ({
  ...FIXED,
  types: one<Types>(get("types"), TYPESETS, PICK.types),
});

export function FilterOptionsBoard() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const sp = useSearchParams();
  if (sp.get("frame") === "1") {
    return (
      <>
        <PageBanner title="Publications" />
        <main className="page research-page">
          <PageStrip page="research" />
          <Prototype s={read((k) => sp.get(k))} />
        </main>
      </>
    );
  }
  return <BoardPage />;
}

/* one setting: the site's own FilterRow, with my pick named under it */
function Choice<T extends string>({ label, value, options, mine, onPick }: {
  label: string; value: T; options: { key: T; name: string }[]; mine: T; onPick: (k: T) => void;
}) {
  return (
    <div className="fo-set">
      <div className="fo-set-label">{label}</div>
      <FilterRow<T> wrap ariaLabel={label} value={value} onPick={onPick} items={options.map((o) => ({ key: o.key, label: o.name }))} />
      <div className="fo-mine">My pick: {options.find((o) => o.key === mine)?.name}</div>
    </div>
  );
}

function BoardPage() {
  const [s, setS] = useState<Settings>({ ...FIXED, ...PICK });
  const [chosen, setChosen] = useState<string | null>(null);

  // reopen on the last combination viewed
  useEffect(() => {
    const k = loadKit();
    if (k.view) setS(read((key) => k.view?.[key]));
    if (k.choice) setChosen(k.choice.combo);
  }, []);
  const set = (patch: Partial<Settings>) => {
    const next = { ...s, ...patch };
    setS(next);
    const k = loadKit();
    k.view = next;
    saveKit(k);
  };
  const choose = () => {
    const k = loadKit();
    k.choice = { combo: comboText(s), at: new Date().toISOString() };
    saveKit(k);
    setChosen(k.choice.combo);
    toast("Chosen. Copy my notes sends it with your pins.");
  };

  const ty = BOARD.types.find((x) => x.key === s.types)!;
  const src = `/filter-options/?frame=1&${query(s)}`;

  return (
    <FluidProvider>
      <PageBanner title={BOARD.title} />
      <main className="fo-board">
        <p className="fo-lead" data-ed>{BOARD.lead}</p>

        <div className="fo-sets">
          <Choice label="Type buttons" value={s.types} mine={PICK.types} options={BOARD.types} onPick={(k) => set({ types: k })} />
        </div>
        <ul className="fo-now">
          <li key={`t-${ty.key}`}><b>{ty.name}.</b> <span data-ed>{ty.what}</span></li>
        </ul>

        <div className="fo-stage">
          <section className="fo-desk" aria-label="Desktop view">
            <div className="fo-cap">Desktop, the page column at its real width</div>
            <div className="fo-desk-frame">
              <div className="page research-page fo-page">
                <Prototype key={query(s)} s={s} />
              </div>
            </div>
          </section>
          <section className="fo-phone" aria-label="Phone view">
            <div className="fo-cap">Phone, 390 pixels</div>
            <iframe key={src} src={src} title="The Publications page on a phone" width={390} height={800} />
            <p className="fo-phone-note" data-ed>{BOARD.phoneNote}</p>
          </section>
        </div>

        {/* thirty made-up years, in the year panel's own surface and width */}
        <section className="fo-long" aria-label={BOARD.long.title}>
          <h2>{BOARD.long.title}</h2>
          <p data-ed>{BOARD.long.what}</p>
          <div className="fo-long-grid">
            {BOARD.long.modes.map((m) => (
              <Elevated key={m.key} offset={2} shadowLevel={3} className="fo-long-card">
                <h3>{m.name}</h3>
                <p data-ed>{m.what}</p>
                <LongRange mode={m.key as "thin" | "zoom"} />
              </Elevated>
            ))}
          </div>
        </section>

        <div className="fo-cards">
          <div className="fo-card fo-decided">
            <h3>{BOARD.decided.title}</h3>
            <ul>
              {BOARD.decided.items.map((d) => (
                <li key={d.name}><b>{d.name}.</b> <span data-ed>{d.what}</span></li>
              ))}
            </ul>
          </div>
          <div className="fo-card">
            <h3>{BOARD.order.title}</h3>
            <p data-ed>{BOARD.order.what}</p>
          </div>
          <div className="fo-card fo-pick">
            <h3>My pick</h3>
            <p data-ed>{BOARD.pick.why}</p>
            <div className="fo-pick-row">
              <Button variant="secondary" size="compact" onClick={() => set({ ...FIXED, ...PICK })}>Show my pick</Button>
              <Button variant="primary" size="compact" onClick={choose}>Choose the combination on screen</Button>
            </div>
            {chosen && <p className="fo-chosen">Your choice: {chosen}</p>}
          </div>
        </div>
      </main>
      <ReviewKit ctx={() => comboText(s)} />
    </FluidProvider>
  );
}
