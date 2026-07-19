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
  /* the hover text on the story cover: it literally tells the story */
  tells?: string;
  story?: string;
  spec?: MotifSpec;
  cols?: number;
  rows?: number;
};

const CORAL = "#DA7756";
const CREAM = "#f4e9d6";

export const pubPosters: Record<string, PosterConfig> = {
  "strategic-personalities": {
    tells: "The story: the Claude, OpenAI, and Gemini marks light up, trade cooperation volleys, then their cooperation bars split 48-fold.",
    story: "strategic-personalities",
    title: "Strategic Personalities",
    caption: "Three providers, one competition, a 48-fold split on cooperation",
  },
  "data-quality": {
    tells: "The story: respondents fill ten platform columns; one column turns bot-red under the detector sweep; quality settles into three tiers.",
    story: "data-quality",
    title: "Data Quality",
    caption: "5,200 respondents, ten platforms, the bots cluster in one place",
  },
  "vertical-tacit-collusion": {
    tells: "The story: the platform above and sellers below drip price pressure until the consumer row in the middle turns red, with no agreement ever made.",
    story: "vertical-tacit-collusion",
    title: "Vertical Collusion",
    caption: "Platform above, sellers below, the consumer squeezed without a word",
  },
  "point-vs-range": {
    tells: "The story: the preference marker sits under the certain point estimate until the persuasion-knowledge eye opens, then it slides to the honest range.",
    story: "point-vs-range",
    title: "Point vs. Range",
    caption: "Certainty wins, until persuasion knowledge flips the preference",
  },
  "precise-predictions": {
    tells: "The story: under the brain (knowable uncertainty) the narrow interval glows credible; under the die (random uncertainty) the wide interval wins.",
    story: "precise-predictions",
    title: "Precise Predictions",
    caption: "Knowable worlds reward precision; random worlds reward honesty",
  },
  "cognitive-traps": {
    tells: "The story: a robot answers the survey until the trap row flags it red; the human walks through with clean green checks.",
    story: "cognitive-traps",
    title: "Cognitive Traps",
    caption: "The robot falls in the trap; the human walks through",
  },
  "concealing-prices": {
    tells: "The story: the price hides in a box; at the premium store the reveal bursts gold and the sale lands; at the discount store the same reveal deflates.",
    story: "concealing-prices",
    title: "Concealing Prices",
    caption: "The same reveal delights at the boutique and deflates at the outlet",
  },
  "space-commons": {
    tells: "The story: satellites circle the breathing commons; the orbits hold only as long as the behavioral incentives do.",
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
    tells: "The story: the leaf lights the plain package green (eco); the bolt lights the busy package amber (effective).",
    story: "simple-eco-friendly",
    title: "Simple is Eco-Friendly",
    caption: "The plain pack reads green; the busy pack reads powerful",
  },
  "disease-cues": {
    tells: "The story: a disease cue spreads from one point through the field and recedes, reshaping everything it touches.",
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
    tells: "The story: the tidy ad layout glows utilitarian; the same cells scatter loose and glow hedonic.",
    story: "marketing-by-design",
    title: "Marketing by Design",
    caption: "Order sells the useful; looseness sells the delightful",
  },
  serendipity: {
    tells: "The story: a wandering path stumbles onto the gift and bursts gold; the planned straight line passes the same gift without a spark.",
    story: "serendipity",
    title: "Serendipity",
    caption: "The chance encounter sparks; the planned one passes by",
  },
  "constructive-choice": {
    tells: "The story: when the accuracy target leads, difficulty grows the search; when the effort battery leads, the same difficulty empties it.",
    story: "constructive-choice",
    title: "Constructive Choice",
    caption: "Difficulty grows the search or kills it, goal by goal",
  },
  "ad-skepticism": {
    tells: "The story: the ad reaches the close extension untouched; at the moderate one, the skepticism shield blocks the waves.",
    story: "ad-skepticism",
    title: "Advertising Skepticism",
    caption: "The close extension absorbs the ad; the far one meets the shield",
  },
};

