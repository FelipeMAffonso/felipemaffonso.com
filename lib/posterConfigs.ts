/* ============================================================
   Poster configurations.
   One animated pixel poster per publication (keyed by pub id in
   lib/publications.tsx), plus the teaching card and the idle
   research card. Every paper carries a narrative STORY (one file
   per paper in lib/stories/) that depicts the paper, except Space
   Commons and Disease Cues, which keep their noise engines (orbit,
   contagion) until their stories land (2026-10-20); to switch one
   over, add story: "<id>" to its entry.
   Titles are short paper handles; captions facts; tells is the
   hover line, one short plain sentence (Felipe 2026-10-20: the
   visuals carry the story).
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
    tells: "Language models play competitive games the same way, but how much they cooperate depends on who made them.",
    story: "strategic-personalities",
    title: "Strategic Personalities",
    caption: "Cooperation varies 48-fold across 25 language models",
  },
  "data-quality": {
    tells: "Bots turned up almost only on MTurk. The larger problem was the quality of human answers, which differed by kind of platform.",
    story: "data-quality",
    title: "Data Quality",
    caption: "Bots clustered on MTurk; human quality varied by platform",
  },
  "vertical-tacit-collusion": {
    tells: "A platform and a seller act without any agreement, yet together they harm AI-assisted shoppers more than their separate harms added up.",
    story: "vertical-tacit-collusion",
    title: "Vertical Collusion",
    caption: "Joint harm exceeds the two separate harms combined",
  },
  "human-ai-delegation": {
    tells: "Four conditions, four gears: when one jams the rest stop, and only repairing all four restarts them.",
    story: "human-ai-delegation",
    title: "Human-AI Delegation",
    caption: "Four conditions that succeed or fail together",
  },
  "point-vs-range": {
    tells: "Shoppers prefer an exact performance claim until something reminds them they are being sold to, such as a Sponsored label. Then a realistic range looks more honest and wins.",
    story: "point-vs-range",
    title: "Point vs. Range",
    caption: "Persuasion cues make shoppers prefer range claims",
  },
  "precise-predictions": {
    tells: "People find exact predictions more credible when the answer is knowable, and a moderate range more credible when the outcome depends on chance.",
    story: "precise-predictions",
    title: "Precise Predictions",
    caption: "Moderate ranges are more credible when outcomes involve chance",
  },
  "cognitive-traps": {
    tells: "AI agents pass ordinary attention checks. Visual puzzles that people solve easily catch almost all of them.",
    story: "cognitive-traps",
    title: "Cognitive Traps",
    caption: "Traps flagged 97.1% of agents and 4.1% of humans",
  },
  "concealing-prices": {
    tells: "Hiding a price until later raises sales in upscale stores and lowers them at sale events. Shoppers guess the price from the store, so the real price looks low or high.",
    story: "concealing-prices",
    title: "Concealing Prices",
    caption: "Hidden prices raise upscale sales and lower discount sales",
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
    tells: "The plain poster wins at a glance and for sustainability; the busy one wins when the product has to work.",
    story: "simple-eco-friendly",
    title: "Simple is Eco-Friendly",
    caption: "The plain design reads green; the busy design reads powerful",
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
    tells: "Orderly designs sell practical brands and loose designs sell fun brands. When people already have exact facts, the design stops mattering.",
    story: "marketing-by-design",
    title: "Marketing by Design",
    caption: "Structure helps practical brands and hurts fun brands",
  },
  serendipity: {
    tells: "People enjoy a good thing more when they find it by chance than when they choose it. The gain disappears when the thing is bad or clearly planned for them.",
    story: "serendipity",
    title: "Serendipity",
    caption: "Chance finds beat choices when good and unplanned",
  },
  "constructive-choice": {
    tells: "A hard choice makes people trying to be accurate look at fewer options, and people trying to save effort look at more. With both goals in mind, a hard choice shortens everyone's search.",
    story: "constructive-choice",
    title: "Constructive Choice",
    caption: "People saving effort search more when choices get hard",
  },
  "complexity-visual-design": {
    tells: "In a hurry, people like a plain design. With a goal in mind, the goal decides: busy designs win for efficacy and enjoyment, plain ones for health and sustainability.",
    story: "complexity-visual-design",
    title: "Visual Complexity",
    caption: "The viewer's goal decides what visual complexity signals",
  },
  "ai-assisted-shopping": {
    tells: "A vague request lets the assistant pick the familiar brand; a detailed one gets the shopper what they wanted.",
    story: "ai-assisted-shopping",
    title: "AI-Assisted Shopping",
    caption: "Whose preferences decide the purchase",
  },
  "ad-skepticism": {
    tells: "Ad skeptics like a new product less only when it is somewhat like the brand's usual products, because they doubt the brand can make it. Showing the features it shares with the brand's products wins them back.",
    story: "ad-skepticism",
    title: "Advertising Skepticism",
    caption: "Ad skeptics like moderately similar brand extensions less",
  },
};

