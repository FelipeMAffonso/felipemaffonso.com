// Comments on Felipe's teaching shown on the Teaching page: students and the business partners his
// student teams worked for (colleague quotes were taken off, Felipe 2026-10-25). Quotes are verbatim
// (cuts marked [...]).
// Everything goes online anonymous, Felipe's own survey included (Felipe 2026-10-25: "the
// thing that matters is that it goes anonymous online. that's it. even for my own survey"):
// no names anywhere, no detail that identifies a student (health, family, employer), and a
// photo of a note has the name blurred (scripts/blur-card-name.py). The comments themselves
// are in student-feedback-data.ts, GENERATED from the private harvest in the cv repo
// (teaching-feedback/build_site_feedback.py), which refuses to write a name or a cut that is
// not word for word. Facts still to check with Felipe are listed by that script, never here.
import { feedbackData } from "./student-feedback-data";

export type FeedbackKind = "evaluation" | "survey" | "midsurvey" | "note" | "card" | "email" | "partner";

export type Theme = "care" | "projects" | "communication" | "clear" | "career" | "ai" | "fair" | "feedback" | "general";

export const THEME_LABEL: Record<Theme, string> = {
  care: "Cares about students",
  projects: "Real client projects",
  communication: "Always reachable",
  clear: "Clear teaching",
  career: "Useful for a career",
  ai: "AI in the classroom",
  fair: "Challenging and fair",
  feedback: "Listens to feedback",
  general: "General praise",
};

/** the theme labels for phone widths */
export const THEME_SHORT: Record<Theme, string> = {
  care: "Care",
  projects: "Projects",
  communication: "Reachable",
  clear: "Clear",
  career: "Career",
  ai: "AI",
  fair: "Fair",
  feedback: "Listens",
  general: "General",
};

export interface FeedbackItem {
  id: string;
  /** position among the first cards of the "All" view; unranked items follow by strength */
  rank?: number;
  kind: FeedbackKind;
  /** 1 the very best, 2 other strong and good comments, 3 short general praise; the page shows
   *  tier 1 first */
  tier: 1 | 2 | 3;
  /** what the comment is about, from the harvest's theme tags */
  themes: Theme[];
  /** the student's own words */
  text: string;
  who: string;
  course?: string;
  courseCode?: string;
  /** the university, in full, for a comment with no course (the footer reads it from the course
   *  code otherwise) */
  school?: string;
  term?: string;
  /** when the note or email was written */
  date?: string;
  image?: { src: string; alt: string; width: number; height: number };
  /** one line a reader needs, written by Felipe, not the student */
  context?: string;
}

export const KIND_LABEL: Record<FeedbackKind, string> = {
  // short enough for "Course evaluation, Spring 2025" to fit one footer line
  evaluation: "Course evaluation",
  survey: "Course survey",
  midsurvey: "Mid-semester survey",
  note: "Student comment",
  card: "Handwritten card",
  email: "Email",
  partner: "Business partner survey",
};

const GROUP: Record<FeedbackKind, number> = { evaluation: 0, survey: 1, midsurvey: 1, email: 2, note: 3, card: 3, partner: 4 };

/** The ranked cards first; then tier 1 before 2 before 3, taking the sources in turn so a long
 *  run of one kind never fills the screen. Every filter keeps this order. */
function ordered(items: FeedbackItem[]): FeedbackItem[] {
  const ranked = items.filter((it) => it.rank).sort((a, b) => a.rank! - b.rank!);
  const rest: FeedbackItem[] = [];
  for (const t of [1, 2, 3] as const) {
    const lanes = [0, 1, 2, 3, 4].map((g) => items.filter((it) => !it.rank && it.tier === t && GROUP[it.kind] === g));
    for (let i = 0; lanes.some((l) => i < l.length); i++) {
      for (const l of lanes) if (i < l.length) rest.push(l[i]);
    }
  }
  return [...ranked, ...rest];
}

export const feedback: FeedbackItem[] = ordered(feedbackData);
