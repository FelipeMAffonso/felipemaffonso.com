import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageBanner } from "@/components/PageBanner";
import { PageStrip } from "@/components/PageStrip";
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
        <PageStrip page="contact" />
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

          <div className="contact-block enter" style={{ ...d(2), gridColumn: "1 / -1" }}>
            <h3>Note to undergraduate and prospective PhD students</h3>
            <p>
              Unfortunately, I am not able to supervise undergraduate research projects or new PhD students at this time.
            </p>
            <p>
              If you are interested in the Marketing PhD program at Oklahoma State, the program&apos;s page explains the
              program and how to apply:{" "}
              <a href="https://go.okstate.edu/graduate-academics/programs/doctoral/business-administration-phd-marketing-option">
                Business Administration PhD, Marketing option
              </a>
              . The program handles all questions about admissions and applications, and I am not involved in that process.
            </p>
          </div>
        </div>

        <SpearsCard />
      </main>
    </>
  );
}
