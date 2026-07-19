"use client";

/* ============================================================
   SocialLinks — the Contact profiles list, variant-aware.
   icons=brand renders the established brand marks; icons=pixel
   renders the cell-grid glyphs from pixelIcons (adjudication).
   Links and labels are identical in both; only the glyph swaps.
   ============================================================ */

import { usePixelVariants } from "@/lib/pixelVariants";
import { ScholarIcon, GitHubSocialIcon, OsfSocialIcon, LinkedInIcon, XIcon, ExpertsIcon } from "./icons";
import {
  PixelScholarIcon, PixelGitHubIcon, PixelOsfIcon, PixelLinkedInIcon, PixelXIcon, PixelExpertsIcon,
} from "./pixelIcons";

const LINKS = [
  { href: "https://scholar.google.com/citations?user=AcRvZ2AAAAAJ&hl=en", label: "Google Scholar", brand: ScholarIcon, pixel: PixelScholarIcon },
  { href: "https://github.com/FelipeMAffonso", label: "GitHub", brand: GitHubSocialIcon, pixel: PixelGitHubIcon },
  { href: "https://osf.io/4stqk/", label: "Open Science Framework", brand: OsfSocialIcon, pixel: PixelOsfIcon },
  { href: "https://www.linkedin.com/in/felipemaffonso/", label: "LinkedIn", brand: LinkedInIcon, pixel: PixelLinkedInIcon },
  { href: "https://twitter.com/felipe_maffonso", label: "X (Twitter)", brand: XIcon, pixel: PixelXIcon },
  { href: "https://experts.okstate.edu/felipe.affonso", label: "OSU Experts Profile", brand: ExpertsIcon, pixel: PixelExpertsIcon },
];

export function SocialLinks() {
  const { icons } = usePixelVariants();
  return (
    <ul className="social-links">
      {LINKS.map((l) => {
        const Icon = icons === "pixel" ? l.pixel : l.brand;
        return (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noopener">
              <Icon />
              {l.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
