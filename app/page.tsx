import type { CSSProperties } from "react";
import { ParticleField } from "@/components/ParticleField";
import { PixelPortrait } from "@/components/PixelPortrait";
import { PageStrip } from "@/components/PageStrip";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Felipe M. Affonso",
  givenName: "Felipe",
  familyName: "Affonso",
  jobTitle: "Assistant Professor of Marketing",
  affiliation: { "@type": "Organization", name: "Oklahoma State University" },
  alumniOf: { "@type": "Organization", name: "University of Florida" },
  url: "https://felipemaffonso.com",
  email: "mailto:felipe.affonso@okstate.edu",
  sameAs: [
    "https://scholar.google.com/citations?user=AcRvZ2AAAAAJ&hl=en",
    "https://github.com/FelipeMAffonso",
    "https://osf.io/4stqk/",
    "https://www.linkedin.com/in/felipemaffonso/",
    "https://twitter.com/felipe_maffonso",
    "https://experts.okstate.edu/felipe.affonso",
  ],
};

export default function Home() {
  return (
    <section className="hero-full">
      <ParticleField variant="hero" />
      <div className="hero-inner">
        <div className="hero-header enter" style={{ "--enter-i": 0 } as CSSProperties}>
          <h1 className="hero-name">Felipe M. Affonso</h1>
          <p className="hero-title">Assistant Professor of Marketing, Oklahoma State University</p>
        </div>
        <div className="hero-grid enter" style={{ "--enter-i": 2 } as CSSProperties}>
          <PixelPortrait />
          <div className="hero-bio">
            <p>
              Felipe M. Affonso is an Assistant Professor of Marketing at Oklahoma State University. He received his Ph.D. in Marketing from the University of Florida. His research focuses on consumer judgment and decision-making, consumer inference-making, human-AI interaction and technology, and health, environment, and policy. His work has been published in leading academic journals, including <em>Journal of Consumer Research</em>, <em>Journal of Marketing Research</em>, <em>Journal of Marketing</em>, <em>Research Policy</em>, and <em>Journal of Experimental Psychology: General</em>.
            </p>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
    </section>
  );
}
