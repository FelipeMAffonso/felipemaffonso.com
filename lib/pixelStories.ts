/* ============================================================
   Pixel stories: narrative motifs that depict each paper.
   Each story lives in its own file in lib/stories/ (one paper,
   one file) and draws with the shared kit in lib/stories/kit.ts.
   This module only registers them and renders frames.
   ============================================================ */

import type { Cell } from "./pixelEngine";
import { type StoryDef, type Put, h, clamp01 } from "./stories/kit";
import { story as strategicPersonalities } from "./stories/strategic-personalities";
import { story as dataQuality } from "./stories/data-quality";
import { story as verticalTacitCollusion } from "./stories/vertical-tacit-collusion";
import { story as pointVsRange } from "./stories/point-vs-range";
import { story as precisePredictions } from "./stories/precise-predictions";
import { story as cognitiveTraps } from "./stories/cognitive-traps";
import { story as concealingPrices } from "./stories/concealing-prices";
import { story as simpleEcoFriendly } from "./stories/simple-eco-friendly";
import { story as marketingByDesign } from "./stories/marketing-by-design";
import { story as serendipity } from "./stories/serendipity";
import { story as constructiveChoice } from "./stories/constructive-choice";
import { story as adSkepticism } from "./stories/ad-skepticism";
import { story as humanAiDelegation } from "./stories/human-ai-delegation";
import { story as complexityVisualDesign } from "./stories/complexity-visual-design";
import { story as aiAssistedShopping } from "./stories/ai-assisted-shopping";
import { story as spaceCommons } from "./stories/space-commons";
import { story as diseaseCues } from "./stories/disease-cues";

export type { StoryDef };

export const STORIES: Record<string, StoryDef> = {
  "strategic-personalities": strategicPersonalities,
  "data-quality": dataQuality,
  "vertical-tacit-collusion": verticalTacitCollusion,
  "point-vs-range": pointVsRange,
  "precise-predictions": precisePredictions,
  "cognitive-traps": cognitiveTraps,
  "concealing-prices": concealingPrices,
  "simple-eco-friendly": simpleEcoFriendly,
  "marketing-by-design": marketingByDesign,
  serendipity: serendipity,
  "constructive-choice": constructiveChoice,
  "ad-skepticism": adSkepticism,
  "human-ai-delegation": humanAiDelegation,
  "complexity-visual-design": complexityVisualDesign,
  "ai-assisted-shopping": aiAssistedShopping,
  "space-commons": spaceCommons,
  "disease-cues": diseaseCues,
};

/* render one frame of a story into a cell buffer */
export function renderStory(def: StoryDef, t: number): (Cell | null)[] {
  const buf: (Cell | null)[] = new Array(def.cols * def.rows).fill(null);
  const total = def.phases.reduce((s, p) => s + p.dur, 0);
  let tt = t % total;
  let phase = def.phases[0];
  for (const p of def.phases) {
    if (tt < p.dur) { phase = p; break; }
    tt -= p.dur;
  }
  const u = tt / phase.dur;
  const put: Put = (x, y, c, v = 1) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= def.cols || y >= def.rows) return;
    const prev = buf[y * def.cols + x];
    if (prev && prev.v > v) return;
    buf[y * def.cols + x] = { v: clamp01(v), c };
  };
  phase.render(u, put, t);
  /* the living shimmer: every lit cell breathes a little, out of
     phase with its neighbours, so sprites read as light not paint */
  const beat = t * 1.6;
  const b0 = Math.floor(beat);
  const bf = beat - b0;
  const mix = bf * bf * (3 - 2 * bf);
  for (let i = 0; i < buf.length; i++) {
    const cell = buf[i];
    if (!cell) continue;
    const x = i % def.cols, y = (i - x) / def.cols;
    const w = h(x, y, b0) * (1 - mix) + h(x, y, b0 + 1) * mix;
    cell.v = clamp01(cell.v * (0.84 + 0.2 * w));
  }
  return buf;
}
