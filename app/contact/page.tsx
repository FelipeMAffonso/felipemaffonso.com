import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageBanner } from "@/components/PageBanner";
import { SpearsCard } from "@/components/SpearsCard";
import { SocialLinks } from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Felipe M. Affonso, Assistant Professor of Marketing at Oklahoma State University.",
  alternates: { canonical: "/contact/" },
};

const d = (i: number) => ({ "--enter-i": i } as CSSProperties);

export default function ContactPage() {
  return (
    <>
      <PageBanner title="Contact" />
      <main className="page">
        <div className="contact-grid">
          <div className="contact-block enter" style={d(0)}>
            <h3>Office</h3>
            <p>
              Oklahoma State University<br />
              Spears School of Business<br />
              School of Marketing and International Business<br />
              316 Business Building, Stillwater, OK 74078
            </p>
            <p style={{ marginTop: 16 }}>
              <a href="mailto:felipe.affonso@okstate.edu">felipe.affonso@okstate.edu</a><br />
              (405) 744-1311
            </p>
          </div>

          <div className="contact-block enter" style={d(1)}>
            <h3>Profiles</h3>
            <SocialLinks />
          </div>
        </div>

        <SpearsCard />
      </main>
    </>
  );
}
