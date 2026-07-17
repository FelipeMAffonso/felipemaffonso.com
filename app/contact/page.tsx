import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageBanner } from "@/components/PageBanner";
import { ScholarIcon, GitHubSocialIcon, OsfSocialIcon, LinkedInIcon, XIcon, ExpertsIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Felipe M. Affonso — Assistant Professor of Marketing at Oklahoma State University.",
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
            <ul className="social-links">
              <li>
                <a href="https://scholar.google.com/citations?user=AcRvZ2AAAAAJ&hl=en" target="_blank" rel="noopener">
                  <ScholarIcon />
                  Google Scholar
                </a>
              </li>
              <li>
                <a href="https://github.com/FelipeMAffonso" target="_blank" rel="noopener">
                  <GitHubSocialIcon />
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://osf.io/4stqk/" target="_blank" rel="noopener">
                  <OsfSocialIcon />
                  Open Science Framework
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/felipemaffonso/" target="_blank" rel="noopener">
                  <LinkedInIcon />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://twitter.com/felipe_maffonso" target="_blank" rel="noopener">
                  <XIcon />
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href="https://experts.okstate.edu/felipe.affonso" target="_blank" rel="noopener">
                  <ExpertsIcon />
                  OSU Experts Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
