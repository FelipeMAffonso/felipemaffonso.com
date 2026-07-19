/* ============================================================
   Poster configurations.
   One animated pixel poster per publication (keyed by pub id in
   lib/publications.tsx), plus the teaching card. Each poster
   varies the grid proportions, engine, and palette; every
   palette carries one coral note so the family reads as one
   system. Titles are short paper handles; captions are facts.
   ============================================================ */

import type { MotifSpec } from "./pixelEngine";

export type PosterConfig = {
  spec: MotifSpec;
  cols: number;
  rows: number;
  title: string;
  caption: string;
};

const CORAL = "#DA7756";
const CREAM = "#f4e9d6";

export const pubPosters: Record<string, PosterConfig> = {
  "strategic-personalities": {
    cols: 21, rows: 15,
    title: "Strategic Personalities",
    caption: "arXiv preprint",
    spec: {
      engine: "drift",
      seed: 3,
      params: { blobs: 3, radius: 0.17 },
      colors: ["#3fa7a0", "#d9a441", CORAL, CREAM],
    },
  },
  "data-quality": {
    cols: 20, rows: 16,
    title: "Data Quality",
    caption: "PsyArXiv preprint",
    spec: {
      engine: "structure",
      seed: 11,
      params: { splitAt: 0.55, col: 0.78 },
      colors: ["#5c6b7a", CORAL, CREAM],
    },
  },
  "vertical-tacit-collusion": {
    cols: 21, rows: 14,
    title: "Vertical Collusion",
    caption: "arXiv preprint",
    spec: {
      engine: "band",
      seed: 7,
      params: { cycle: 0.14 },
      colors: ["#4a6a8a", CORAL, CREAM],
    },
  },
  "point-vs-range": {
    cols: 22, rows: 14,
    title: "Point vs. Range",
    caption: "Journal of Marketing Research",
    spec: {
      engine: "band",
      seed: 13,
      params: { cycle: 0.18, breathe: 0.12 },
      colors: ["#3fa7a0", CORAL, CREAM],
    },
  },
  "precise-predictions": {
    cols: 20, rows: 15,
    title: "Precise Predictions",
    caption: "Journal of Experimental Psychology: General",
    spec: {
      engine: "band",
      seed: 29,
      params: { cycle: 0.11, breathe: 0.17 },
      colors: ["#d9a441", CORAL, CREAM],
    },
  },
  "cognitive-traps": {
    cols: 19, rows: 17,
    title: "Cognitive Traps",
    caption: "Journal of Consumer Research, 2026",
    spec: {
      engine: "spark",
      seed: 17,
      params: { rate: 0.16, thresh: 0.972 },
      colors: ["#3f6b68", CORAL, CREAM],
    },
  },
  "concealing-prices": {
    cols: 21, rows: 15,
    title: "Concealing Prices",
    caption: "Journal of Consumer Research",
    spec: {
      engine: "reveal",
      seed: 5,
      params: { speed: 0.035 },
      colors: ["#5c6b7a", CORAL, CREAM],
    },
  },
  "space-commons": {
    cols: 19, rows: 17,
    title: "The Space Commons",
    caption: "Research Policy, 2026",
    spec: {
      engine: "orbit",
      seed: 23,
      params: { sats: 5, radius: 0.44, squish: 1.3 },
      colors: ["#41597a", "#d9a441", CORAL, CREAM],
    },
  },
  "simple-eco-friendly": {
    cols: 21, rows: 14,
    title: "Simple is Eco-Friendly",
    caption: "Journal of Advertising, 2026",
    spec: {
      engine: "structure",
      seed: 31,
      params: { splitAt: 0.5, reverse: 1 },
      colors: ["#7da07d", CORAL, CREAM],
    },
  },
  "disease-cues": {
    cols: 20, rows: 16,
    title: "Disease Cues",
    caption: "European Journal of Marketing, 2025",
    spec: {
      engine: "contagion",
      seed: 19,
      params: { speed: 0.04 },
      colors: ["#a8474d", "#d9a441", CORAL, CREAM],
    },
  },
  "marketing-by-design": {
    cols: 22, rows: 14,
    title: "Marketing by Design",
    caption: "Journal of Marketing, 2023",
    spec: {
      engine: "structure",
      seed: 37,
      params: { splitAt: 0.5 },
      colors: ["#3fa7a0", CORAL, CREAM],
    },
  },
  serendipity: {
    cols: 20, rows: 16,
    title: "Serendipity",
    caption: "Journal of Marketing, 2021",
    spec: {
      engine: "spark",
      seed: 41,
      params: { rate: 0.11, thresh: 0.978 },
      colors: ["#41597a", "#d9a441", CORAL, CREAM],
    },
  },
  "constructive-choice": {
    cols: 21, rows: 15,
    title: "Constructive Choice",
    caption: "Journal of Consumer Psychology, 2021",
    spec: {
      engine: "drift",
      seed: 43,
      params: { blobs: 2, radius: 0.2 },
      colors: ["#3fa7a0", CORAL, CREAM],
    },
  },
  "ad-skepticism": {
    cols: 20, rows: 15,
    title: "Advertising Skepticism",
    caption: "Psychology & Marketing, 2019",
    spec: {
      engine: "blaze",
      seed: 47,
      params: { rise: 0.8 },
      colors: ["#a8474d", "#d9a441", CORAL, CREAM],
    },
  },
};

export const teachingPoster: PosterConfig = {
  cols: 23, rows: 13,
  title: "The Classroom",
  caption: "Marketing Research, the Marketing Science Laboratory, and Managerial Strategies in Marketing",
  spec: {
    engine: "tide",
    seed: 53,
    params: { cycle: 0.09 },
    colors: ["#8a4f38", "#d9a441", CORAL, CREAM],
  },
};
