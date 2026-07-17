import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "Options",
  description: "Interaction/motion variant switcher (adjudication only).",
  robots: { index: false, follow: false },
};

/* DEV / ADJUDICATION ONLY — not linked from the nav. Delete this file
   plus lib/variants.tsx and the useVariants() reads once winners are chosen. */

export default function OptionsPage() {
  return (
    <>
      <PageBanner title="Options" />
      <main className="page options-page">
        <p className="body-text" style={{ marginBottom: 32 }}>
          Adjudication surface (not in the nav, not indexed). Each row opens the site with a
          variant applied via a query parameter. Shipping defaults are marked. Once you pick
          winners, the whole variant system is deleted and the defaults stay.
        </p>

        <div className="opt-block">
          <h2>a. Nav tab hover + active</h2>
          <p>How the top-nav tabs feel on hover and when active.</p>
          <div className="opt-links">
            <a href="/?nav=underline">underline (default)</a>
            <a href="/?nav=pill">pill / ghost</a>
            <a href="/?nav=slide">underline-slide</a>
          </div>
        </div>

        <div className="opt-block">
          <h2>b. Page / list entrance</h2>
          <p>How content appears when a page loads. Open Research to see the staggered list.</p>
          <div className="opt-links">
            <a href="/research/?entrance=stagger">staggered rise + fade (default)</a>
            <a href="/research/?entrance=fade">simple fade</a>
            <a href="/research/?entrance=none">none (instant)</a>
          </div>
        </div>

        <div className="opt-block">
          <h2>c. Accordion motion character</h2>
          <p>The feel of the publication panel opening. Open any entry on Research.</p>
          <div className="opt-links">
            <a href="/research/?accordion=crisp">crisp 240ms (default)</a>
            <a href="/research/?accordion=soft">softer 260ms settle</a>
          </div>
        </div>

        <div className="opt-block">
          <h2>d. Theme toggle</h2>
          <p>Click the sun/moon in the nav after loading each.</p>
          <div className="opt-links">
            <a href="/?themeanim=morph">cross-fade + rotate morph (default)</a>
            <a href="/?themeanim=swap">simple swap</a>
          </div>
        </div>

        <div className="opt-block">
          <h2>e. Sound map</h2>
          <p>Turn sound on (nav speaker), then interact. Open Research to hear the panel.</p>
          <div className="opt-links">
            <a href="/research/?soundmap=A">A — minimal (toggle + accordion)</a>
            <a href="/research/?soundmap=B">B — fuller (+ nav tick, button press/release) (default)</a>
          </div>
        </div>
      </main>
    </>
  );
}
