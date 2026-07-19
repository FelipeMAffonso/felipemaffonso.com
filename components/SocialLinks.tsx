/* ============================================================
   SocialLinks — the Contact profiles list, brand icons
   (adjudicated 2026-07-19: the brand set shipped).
   ============================================================ */

import { ScholarIcon, GitHubSocialIcon, OsfSocialIcon, LinkedInIcon, XIcon, ExpertsIcon } from "./icons";

const LINKS = [
  { href: "https://scholar.google.com/citations?user=AcRvZ2AAAAAJ&hl=en", label: "Google Scholar", Icon: ScholarIcon },
  { href: "https://github.com/FelipeMAffonso", label: "GitHub", Icon: GitHubSocialIcon },
  { href: "https://osf.io/4stqk/", label: "Open Science Framework", Icon: OsfSocialIcon },
  { href: "https://www.linkedin.com/in/felipemaffonso/", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "https://twitter.com/felipe_maffonso", label: "X (Twitter)", Icon: XIcon },
  { href: "https://experts.okstate.edu/felipe.affonso", label: "OSU Experts Profile", Icon: ExpertsIcon },
];

export function SocialLinks() {
  return (
    <ul className="social-links">
      {LINKS.map(({ href, label, Icon }) => (
        <li key={href}>
          <a href={href} target="_blank" rel="noopener">
            <Icon />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
