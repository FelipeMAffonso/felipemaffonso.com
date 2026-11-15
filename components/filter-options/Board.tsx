"use client";

/* ============================================================
   The filter options review page (/filter-options/, branch
   pub-filter-options). Generated from copy.ts. With ?frame=1 it
   renders the Publications page alone, for the phone view's frame.
   ============================================================ */

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageBanner } from "@/components/PageBanner";
import { PageStrip } from "@/components/PageStrip";
import { FluidProvider } from "@/lib/fluid-provider";
import { Elevated } from "@/lib/elevated";
import { BOARD } from "./copy";
import { Prototype } from "./Prototype";
import { LongRange } from "./LongRange";
import { ReviewKit } from "./ReviewKit";
import type { Settings } from "./model";
import "./filter-options.css";

/* Felipe decided every setting on 2026-11-14 (copy.ts, decided), so the page shows the one design */
const S: Settings = BOARD.decided.settings;
const CTX = "the decided design";

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
          <Prototype s={S} />
        </main>
      </>
    );
  }
  return <BoardPage />;
}

function BoardPage() {
  const src = "/filter-options/?frame=1";

  return (
    <FluidProvider>
      <PageBanner title={BOARD.title} />
      <main className="fo-board">
        <p className="fo-lead" data-ed>{BOARD.lead}</p>
        {/* the example sits below the full publication list, so the top of the page links to it
            (Felipe 2026-11-14: "where is the lots of made up years example? I couldnt see it") */}
        <p className="fo-jump">
          <a href="#thirty-years">{BOARD.long.title}</a>, further down this page.
        </p>

        <div className="fo-stage">
          <section className="fo-desk" aria-label="Desktop view">
            <div className="fo-cap">Desktop, the page column at its real width</div>
            <div className="fo-desk-frame">
              <div className="page research-page fo-page">
                <Prototype s={S} />
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
        <section className="fo-long" id="thirty-years" aria-label={BOARD.long.title}>
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
        </div>
      </main>
      <ReviewKit ctx={() => CTX} />
    </FluidProvider>
  );
}
