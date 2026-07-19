/* ============================================================
   Poster configurations.
   One animated pixel poster per publication (keyed by pub id in
   lib/publications.tsx), plus the teaching card and the idle
   research card. Most papers now carry a narrative STORY
   (lib/pixelStories) that depicts the paper; Space Commons and
   Disease Cues keep their approved noise engines (orbit,
   contagion). Titles are short paper handles; captions facts.
   ============================================================ */

import type { MotifSpec } from "./pixelEngine";

export type PosterConfig = {
  title: string;
  caption: string;
  story?: string;
  spec?: MotifSpec;
  cols?: number;
  rows?: number;
};

const CORAL = "#DA7756";
const CREAM = "#f4e9d6";

export const pubPosters: Record<string, PosterConfig> = {
  "strategic-personalities": {
    story: "strategic-personalities",
    title: "Strategic Personalities",
    caption: "Three providers, one competition, a 48-fold split on cooperation",
  },
  "data-quality": {
    story: "data-quality",
    title: "Data Quality",
    caption: "5,200 respondents, ten platforms, the bots cluster in one place",
  },
  "vertical-tacit-collusion": {
    story: "vertical-tacit-collusion",
    title: "Vertical Collusion",
    caption: "Platform above, sellers below, the consumer squeezed without a word",
  },
  "point-vs-range": {
    story: "point-vs-range",
    title: "Point vs. Range",
    caption: "Certainty wins, until persuasion knowledge flips the preference",
  },
  "precise-predictions": {
    story: "precise-predictions",
    title: "Precise Predictions",
    caption: "Knowable worlds reward precision; random worlds reward honesty",
  },
  "cognitive-traps": {
    story: "cognitive-traps",
    title: "Cognitive Traps",
    caption: "The robot falls in the trap; the human walks through",
  },
  "concealing-prices": {
    story: "concealing-prices",
    title: "Concealing Prices",
    caption: "The same reveal delights at the boutique and deflates at the outlet",
  },
  "space-commons": {
    title: "The Space Commons",
    caption: "Research Policy, 2026",
    cols: 19, rows: 17,
    spec: {
      engine: "orbit",
      seed: 23,
      params: { sats: 5, radius: 0.44, squish: 1.3 },
      colors: ["#41597a", "#d9a441", CORAL, CREAM],
    },
  },
  "simple-eco-friendly": {
    story: "simple-eco-friendly",
    title: "Simple is Eco-Friendly",
    caption: "The plain pack reads green; the busy pack reads powerful",
  },
  "disease-cues": {
    title: "Disease Cues",
    caption: "European Journal of Marketing, 2025",
    cols: 20, rows: 16,
    spec: {
      engine: "contagion",
      seed: 19,
      params: { speed: 0.04 },
      colors: ["#a8474d", "#d9a441", CORAL, CREAM],
    },
  },
  "marketing-by-design": {
    story: "marketing-by-design",
    title: "Marketing by Design",
    caption: "Order sells the useful; looseness sells the delightful",
  },
  serendipity: {
    story: "serendipity",
    title: "Serendipity",
    caption: "The chance encounter sparks; the planned one passes by",
  },
  "constructive-choice": {
    story: "constructive-choice",
    title: "Constructive Choice",
    caption: "Difficulty grows the search or kills it, goal by goal",
  },
  "ad-skepticism": {
    story: "ad-skepticism",
    title: "Advertising Skepticism",
    caption: "The close extension absorbs the ad; the far one meets the shield",
  },
};

export const teachingPoster: PosterConfig = {
  title: "The Classroom",
  caption: "Marketing Research, the Marketing Science Laboratory, and Managerial Strategies in Marketing",
  cols: 23, rows: 13,
  spec: {
    engine: "tide",
    seed: 53,
    params: { cycle: 0.09 },
    colors: ["#8a4f38", "#d9a441", CORAL, CREAM],
  },
};

/* the quiet idle card (the rail placeholder and the list header) */
export const idlePoster: PosterConfig = {
  title: "Research",
  caption: "Open any paper to see its story",
  cols: 15, rows: 19,
  spec: {
    engine: "spark",
    seed: 91,
    params: { rate: 0.1, thresh: 0.982 },
    colors: ["#8b9099", "#d9a441", CORAL, CREAM],
  },
};
