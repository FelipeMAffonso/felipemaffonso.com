# Extracted Tables: cognitive-traps


## Source: JCR_Manuscript_aCCEPTED.docx

**Tables found: 4**


### Table 1
**Context:** TABLE 1. REPRESENTATIVE COGNITIVE TRAP IMPLEMENTATIONS

| Modified Muller-Lyer Training Data Overfitting Adapted from Ullman (2024). This modified Muller-Lyer illusion presents two lines with arrowhead endpoints where the blue line (above) is objectively longer than the red line (below). Participants are asked which line is longer. The correct answer is the blue line (A*), but models typically report that both lines are equal, defaulting to the canonical Muller-Lyer pattern where lines only appear different but are actually equal. Because models have memorized this pattern from training data, they apply it indiscriminately even when the perceptual property differs. | The Moving Robot Spatiotemporal Reasoning The four-frame sequence above shows a robot moving progressively toward the center of a square with constant speed and trajectory, with Step 4 left empty. Participants predict where the robot will be on Step 4. The correct answer is mostly around the center (E*), but models typically predict incorrect quadrant locations, failing to integrate visual motion information across the temporal sequence. Humans effortlessly extrapolate the trajectory, while models achieve only 63.5% accuracy on this class of spatiotemporal prediction versus 99.7% for humans (Zhou et al. 2025). |
|---|---|
| Surrounded Planets Cross-Modal Binding Six colored planets are each surrounded by several geometric shapes. Five planets have 5 shapes surrounding them; one planet has only 4. The task requires counting shapes around each planet and identifying the one with fewer shapes. Models struggle to correctly bind shapes to specific planets when visual elements overlap and occlude each other. | Colliding Oranges Spatial Reasoning A set of shapes in a 2D display where the participant predicts which objects would collide if the largest circle moved in a straight line toward the smallest circle. This requires mental simulation of physical movement and spatial reasoning about object positions and sizes. |


### Table 2
**Context:** TABLE 2. COGNITIVE TRAP VALIDATION RESULTS

| Cognitive Trap | Human | GPT-5.1 | GPT-5.1† | Gemini 2.5 Pro | Gemini 2.5 Flash | Claude Sonnet 4.5 | Claude Haiku 4.5 | Pooled |
|---|---|---|---|---|---|---|---|---|
| Modified Cafe Wall | 84.8% | 0% | 20% | 0% | 0% | 40% | 30% | 15.0% |
| Modified Muller-Lyer | 90.1% | 0% | 30% | 0% | 0% | 0% | 0% | 5.0% |
| Modified Ebbinghaus | 90.1% | 10% | 60% | 30% | 0% | 60% | 80% | 40.0% |
| The Moving Robot | 77.2% | 0% | 40% | 0% | 0% | 0% | 0% | 6.7% |
| Colliding Oranges | 86.5% | 40% | 80% | 30% | 0% | 30% | 10% | 31.7% |
| Surrounded Planets | 91.8% | 70% | 80% | 20% | 0% | 30% | 20% | 36.7% |
| Shape Overload | 46.8% | 20% | 70% | 50% | 10% | 50% | 40% | 40.0% |
| Average | 86.8% | 20.0% | 51.7% | 13.3% | 0.0% | 26.7% | 23.3% | 22.5% |


### Table 3
**Context:** TABLE 3. DETECTION METHOD PERFORMANCE AGAINST DEPLOYED AI AGENTS

| Detection Method | Agents Detected | Detection Rate |
|---|---|---|
| Cognitive Traps (3+ failures) | 511 | 97.1% |
| Traditional Methods (Any) | 12 | 2.3% |
| - Instructional Manipulation Check | 1 | 0.2% |
| - Obvious Answer Check | 1 | 0.2% |
| - Memory Check | 4 | 0.8% |
| - Straight-lining Check | 7 | 1.3% |
| CAPTCHA (score < 0.5) | 24 | 4.6% |
| Fast Completion (< 40% median) | 1 | 0.2% |


### Table 4
**Context:** TABLE 4. INDIVIDUAL COGNITIVE TRAP PERFORMANCE: HUMAN VS. AGENT DISCRIMINATION

| Trap | Agent Failure Rate | Human Pass Rate | Discrimination | χ² | p |
|---|---|---|---|---|---|
| Modified Muller-Lyer | 94.1% (495/526) | 92.8% (934/1007) | 86.9 pp | 1113.9 | <.001 |
| Modified Cafe Wall | 94.9% (499/526) | 88.4% (890/1007) | 83.2 pp | 992.8 | <.001 |
| Moving Robot | 99.6% (524/526) | 77.9% (784/1007) | 77.5 pp | 827.0 | <.001 |
| Modified Ebbinghaus | 77.6% (408/526) | 95.6% (963/1007) | 73.2 pp | 886.9 | <.001 |
| Surrounded Planets | 55.5% (292/526) | 96.5% (972/1007) | 52.0 pp | 554.5 | <.001 |
| Colliding Oranges | 50.6% (266/526) | 88.7% (893/1007) | 39.2 pp | 283.4 | <.001 |


## Source: JCR_Web_Appendix_Accepted.docx

**Tables found: 41**


### Table 1
**Context:** TABLE WA-A1: DETECTION PERFORMANCE ACROSS ALL THRESHOLDS

| Threshold | Agent Detection | Human Flagging | Interpretation |
|---|---|---|---|
| 1+ failures | 100.0% (526/526) | 40.1% (404/1007) | Perfect sensitivity but flags too many humans |
| 2+ failures | 99.4% (523/526) | 13.3% (134/1007) | Near-perfect detection; likely many false positives |
| 3+ failures | 97.1% (511/526) | 4.1% (41/1007) | Balanced threshold (selected) |
| 4+ failures | 89.2% (469/526) | 1.9% (19/1007) | Conservative; misses 57 agents |
| 5+ failures | 60.5% (318/526) | 0.6% (6/1007) | Very conservative; misses 208 agents |
| All 6 failures | 26.0% (137/526) | 0.2% (2/1007) | Extreme; detects only complete failures |


### Table 2
**Context:** TABLE WA-A2: COMPLETE DETECTION METHOD PERFORMANCE

| Method | Detection Rate | Why It Failed |
|---|---|---|
| Cognitive Traps (3+) | 97.1% (511/526) | Exploits architectural constraints |
| Instructional Manipulation Check | 0.2% (1/526) | Agents read all text carefully |
| Obvious Answer Check | 0.2% (1/526) | Trivial comprehension for LMMs |
| Memory Check | 0.8% (4/526) | Re-process full context; no working memory |
| Straight-lining (PANAS) | 1.3% (7/526) | Generate contextually appropriate responses |
| Any Traditional Check | 2.3% (12/526) | Combined across all four checks |
| CAPTCHA (score < 0.5) | 4.6% (24/526) | Execute through real browsers with genuine interaction signals |
| Fast Completion (< 40% median) | 0.2% (1/526) | Model inference is genuinely slow |


### Table 3
**Context:** TABLE WA-A3: ARCHITECTURAL DIFFERENCES ENABLING EVASION

| Human Process | Traditional Check Exploit | Agent Analog | Why Check Fails |
|---|---|---|---|
| Attention allocation | Detect when attention lapses | No attention; all text processed uniformly | Models don’t “attend” selectively |
| Working memory | Test recall of earlier content | No working memory; each inference processes full context | Models re-process the full context each time |
| Effort management | Detect effort-minimizing behaviors | No subjective effort; generation cost uniform | Models don’t experience effort |
| Motivation | Assume low motivation produces carelessness | No motivational states; response follows training | Models don’t have motivation |
| Reading strategy | Assume humans skim or skip | Complete text processing as architectural requirement | Models must process full input |


### Table 4
**Context:** TABLE WA-A4: INDIVIDUAL COGNITIVE TRAP PERFORMANCE (MAIN STUDY)

| Trap | Agent Failure | Human Pass | Discrimination | Constraint Exploited |
|---|---|---|---|---|
| Muller-Lyer | 94.1% (495/526) | 92.8% (934/1007) | 86.9 pp | Training data overfitting on canonical illusions |
| Cafe Wall | 94.9% (499/526) | 88.4% (890/1007) | 83.2 pp | Training data overfitting on canonical illusions |
| The Moving Robot | 99.6% (524/526) | 77.9% (784/1007) | 77.5 pp | Spatiotemporal reasoning (trajectory extrapolation) |
| Ebbinghaus | 77.6% (408/526) | 95.6% (963/1007) | 73.2 pp | Training data overfitting on canonical illusions |
| Surrounded Planets | 55.5% (292/526) | 96.5% (972/1007) | 52.0 pp | Cross-modal feature binding with occlusion |
| Colliding Oranges | 50.6% (266/526) | 88.7% (893/1007) | 39.2 pp | Spatial reasoning (geometric path computation) |


### Table 5
**Context:** TABLE WA-A5: DETECTION RATES BY PLATFORM

| Platform | N | Detected (3+) | Detection Rate | 95% CI |
|---|---|---|---|---|
| Google Project Mariner | 134 | 134 | 100.0% | [97.3, 100.0] |
| Claude Sonnet 4.5 | 132 | 132 | 100.0% | [97.2, 100.0] |
| Perplexity Comet | 131 | 124 | 94.7% | [89.3, 97.9] |
| ChatGPT Agent | 129 | 121 | 93.8% | [88.1, 97.3] |
| All Platforms | 526 | 511 | 97.1% | [95.4, 98.4] |


### Table 6
**Context:** TABLE WA-A6: INDIVIDUAL TRAP FAILURE RATES BY PLATFORM

| Trap | Mariner | Perplexity | ChatGPT | Claude | Chi-sq | p |
|---|---|---|---|---|---|---|
| Robust Constraints: |  |  |  |  |  |  |
| Moving Robot | 99.3% | 99.2% | 100.0% | 100.0% | 2.0 | .577 |
| Muller-Lyer | 100.0% | 93.9% | 91.5% | 90.9% | 12.4 | .006 |
| Cafe Wall | 95.5% | 87.0% | 97.7% | 99.2% | 23.9 | <.001 |
| Variable Constraints: |  |  |  |  |  |  |
| Ebbinghaus | 98.5% | 50.4% | 82.9% | 78.0% | 91.6 | <.001 |
| Colliding Oranges | 75.4% | 29.8% | 34.9% | 61.4% | 74.5 | <.001 |
| Surrounded Planets | 81.3% | 51.1% | 17.1% | 71.2% | 127.6 | <.001 |


### Table 7
**Context:** TABLE WA-A7: TOTAL COGNITIVE TRAP SCORE DISTRIBUTION

| Score | Mariner | Perplexity | ChatGPT | Claude | All Agents | Humans |
|---|---|---|---|---|---|---|
| 6 (all correct) | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 59.9% |
| 5 | 0.0% | 0.8% | 1.6% | 0.0% | 0.6% | 26.8% |
| 4 | 0.0% | 4.6% | 4.7% | 0.0% | 2.3% | 9.2% |
| 3 | 0.0% | 17.6% | 7.8% | 6.8% | 8.0% | 2.2% |
| 2 | 6.7% | 43.5% | 45.0% | 20.5% | 28.7% | 1.3% |
| 1 | 36.6% | 26.7% | 36.4% | 37.9% | 34.4% | 0.4% |
| 0 (all failed) | 56.7% | 6.9% | 4.7% | 34.8% | 26.0% | 0.2% |
| Mean (SD) | 0.50 | 1.89 | 1.76 | 0.99 | 1.28 | 5.40 |


### Table 8
**Context:** TABLE WA-B1. COMPLETE COGNITIVE TRAP IMPLEMENTATIONS

| Cognitive Trap Description | Cognitive Trap Stimulus | Question and Response Options (* = correct answer) |
|---|---|---|
| Modified Café Wall Illusion with genuinely slanted lines (Data Overfitting) – from Ullman (2024) |  | Are all the gray lines PERFECTLY STRAIGHT / HORIZONTAL or SLANTED / DIAGONAL? A) Straight / Horizontal B*) Slanted / Diagonal |
| Modified Muller-Lyer illusion with a blue line objectively longer than a red line (Data Overfitting) – adapted from Ullman (2024) |  | Which is longer, the blue line or the red line? A*) Blue Line B) Red Line C) NONE (they are the same size) |
| Modified Ebbinghaus illusion with a red circle objectively bigger than a blue circle (Data Overfitting) – from Ullman (2024) |  | Which is bigger, the blue circle or the red circle? A) Blue Circle B*) Red Circle C) NONE (they are the same size) |
| The Moving Robot, a four-frame sequence showing a robot moving progressively toward center with constant speed and trajectory; frame 4 empty (Spatiotemporal Reasoning) | NOTE: The four steps were displayed side-by-side | Across each step, the robot moves with the same speed and trajectory. Where is it most likely that the robot will be located on Step 4? A) Mostly on the bottom right of the square; B) Mostly on the bottom left of the square; C) Mostly on the upper right of the square; D) Mostly on the upper left of the square; *E) Mostly around the center of the square F) Off-screen (outside the square) |
| The Colliding Oranges, which involves a set of shapes in a 2D display where the user predicts which shape(s) will be in the way (Spatial Reasoning with Mental Simulation) |  | The largest circle will move straight to the left towards the smallest circle. What are the objects in the way, if any? That is, which objects, if any, would the largest circle collide with? A*) Green Triangle B, C, D, …) Other object combinations |
| The Surrounded Planets, which involves six colored planets surrounded by occluding geometric shapes which need to be counted (Cross-Modal Binding with Occluded Stimulus) | NOTE: The six planets were displayed in 3 columns | Look at the 6 planets in this image. Each planet is surrounded by several shapes. Don't worry about the color, size, or type of shape - just count how many shapes surround each planet. Five planets have 5 shapes surrounding them. One planet has 4 shapes surrounding it. What color is the planet that has only 4 shapes surrounding it? A*) Orange, B-F) Purple, Blue, Red, Green, Gray |
| The Shape Overload, which involves identifying the shape with the most colors and counting how many of these shapes are displayed (Compositional Counting) |  | This image contains circles, rectangles, triangles, and hexagons in various colors. One of these shape types appears in more different colors than the other three. Identify which shape appears with most colors. Then, count how many of those shapes are in the image. What is the count? (Open-ended; A: 14) |


### Table 9
**Context:** TABLE WA-C1: COMPLETE COGNITIVE TRAP PASS RATES ACROSS 34 MODELS

| Model | Provider | Release | Cafe Wall | Muller-Lyer | Ebbinghaus | Robot | Oranges | Planets | Avg |
|---|---|---|---|---|---|---|---|---|---|
| claude-haiku-3.0 | Anthropic | Mar 2024 | 100% | 0% | 50% | 90% | 0% | 0% | 40.0% |
| gpt-4o | OpenAI | May 2024 | 0% | 0% | 0% | 0% | 0% | 0% | 0.0% |
| gpt-4o-mini | OpenAI | Jul 2024 | 100% | 0% | 100% | 20% | 0% | 0% | 36.7% |
| claude-haiku-3.5 | Anthropic | Oct 2024 | 90% | 10% | 100% | 10% | 30% | 30% | 45.0% |
| gemini-2.0-flash | Google | Feb 2025 | 10% | 100% | 40% | 0% | 40% | 0% | 31.7% |
| gemini-2.5-pro | Google | Mar 2025 | 50% | 0% | 0% | 0% | 0% | 40% | 15.0% |
| gemini-2.5-pro† | Google | Mar 2025 | 0% | 0% | 0% | 0% | 0% | 10% | 1.7% |
| gpt-4.1 | OpenAI | Apr 2025 | 0% | 0% | 0% | 30% | 0% | 0% | 5.0% |
| gpt-4.1-mini | OpenAI | Apr 2025 | 0% | 0% | 0% | 0% | 0% | 0% | 0.0% |
| gemini-2.5-flash | Google | Jun 2025 | 0% | 0% | 10% | 0% | 0% | 0% | 1.7% |
| gemini-2.5-flash† | Google | Jun 2025 | 0% | 0% | 20% | 0% | 10% | 10% | 6.7% |
| gemini-2.5-flash-lite | Google | Jun 2025 | 100% | 0% | 0% | 0% | 0% | 10% | 18.3% |
| gemini-2.5-flash-lite† | Google | Jun 2025 | 100% | 40% | 90% | 0% | 0% | 50% | 46.7% |
| gpt-5-instant | OpenAI | Aug 2025 | 0% | 0% | 0% | 0% | 0% | 100% | 16.7% |
| gpt-5-mini | OpenAI | Aug 2025 | 0% | 0% | 0% | 0% | 10% | 90% | 16.7% |
| gpt-5† | OpenAI | Aug 2025 | 0% | 0% | 10% | 0% | 60% | 100% | 28.3% |
| claude-sonnet-4.5 | Anthropic | Sep 2025 | 0% | 0% | 100% | 0% | 0% | 0% | 16.7% |
| claude-sonnet-4.5† | Anthropic | Sep 2025 | 0% | 80% | 100% | 0% | 100% | 0% | 46.7% |
| claude-haiku-4.5 | Anthropic | Oct 2025 | 20% | 0% | 100% | 0% | 80% | 0% | 33.3% |
| claude-haiku-4.5† | Anthropic | Oct 2025 | 10% | 0% | 100% | 0% | 20% | 60% | 31.7% |
| claude-opus-4.5 | Anthropic | Nov 2025 | 0% | 0% | 100% | 0% | 0% | 0% | 16.7% |
| claude-opus-4.5† | Anthropic | Nov 2025 | 0% | 0% | 40% | 0% | 80% | 100% | 36.7% |
| gemini-3-pro | Google | Nov 2025 | 0% | 0% | 90% | 10% | 0% | 40% | 23.3% |
| gpt-5.1-instant | OpenAI | Nov 2025 | 0% | 0% | 0% | 0% | 80% | 90% | 28.3% |
| gpt-5.1† | OpenAI | Nov 2025 | 0% | 0% | 0% | 0% | 0% | 50% | 8.3% |
| gemini-3-flash | Google | Dec 2025 | 0% | 20% | 100% | 0% | 0% | 100% | 36.7% |
| gemini-3-flash† | Google | Dec 2025 | 0% | 100% | 100% | 20% | 70% | 100% | 65.0% |
| gpt-5.2-instant | OpenAI | Dec 2025 | 0% | 0% | 0% | 0% | 90% | 100% | 31.7% |
| gpt-5.2-pro | OpenAI | Dec 2025 | 0% | 0% | 30% | 0% | 80% | 100% | 35.0% |
| gpt-5.2† | OpenAI | Dec 2025 | 100% | 0% | 100% | 0% | 40% | 50% | 48.3% |
| claude-opus-4.6 | Anthropic | Feb 2026 | 0% | 100% | 0% | 0% | 100% | 0% | 33.3% |
| claude-opus-4.6† | Anthropic | Feb 2026 | 0% | 30% | 60% | 0% | 100% | 50% | 40.0% |
| claude-sonnet-4.6 | Anthropic | Feb 2026 | 0% | 0% | 100% | 0% | 40% | 0% | 23.3% |
| claude-sonnet-4.6† | Anthropic | Feb 2026 | 0% | 0% | 100% | 0% | 0% | 0% | 16.7% |
| Human (N = 171) |  |  | 84.8% | 90.1% | 90.1% | 77.2% | 86.5% | 91.8% | 86.8% |
| Pooled (34 models) |  |  | 20.0% | 14.1% | 48.2% | 5.3% | 30.3% | 37.6% | 25.9% |


### Table 10
**Context:** TABLE WA-C2: PER-TRAP TEMPORAL SLOPES (OLS REGRESSION ON RELEASE DATE)

| Trap | Slope (pp/month) | SE | p | Direction | Interpretation |
|---|---|---|---|---|---|
| Modified Cafe Wall | −3.14 | 0.99 | .003** | Declining | Models getting worse over time |
| Moving Robot | −1.51 | 0.40 | .001** | Declining | Models getting worse over time |
| Modified Muller-Lyer | +0.74 | 0.93 | .429 | Stable | No significant change |
| Modified Ebbinghaus | +1.35 | 1.31 | .312 | Stable | No significant change |
| Colliding Oranges | +2.92 | 1.00 | .006** | Improving | Models getting better over time |
| Surrounded Planets | +2.71 | 1.15 | .022* | Improving | Models getting better over time |


### Table 11
**Context:** TABLE WA-C3: EFFECT OF EXTENDED THINKING ON COGNITIVE TRAP PERFORMANCE

| Base Model | Provider | Standard | Thinking | Difference |
|---|---|---|---|---|
| gemini-2.5-pro | Google | 15.0% | 1.7% | −13.3 pp |
| gemini-2.5-flash | Google | 1.7% | 6.7% | +5.0 pp |
| gemini-2.5-flash-lite | Google | 18.3% | 46.7% | +28.4 pp |
| gpt-5 | OpenAI | 16.7% | 28.3% | +11.6 pp |
| claude-sonnet-4.5 | Anthropic | 16.7% | 46.7% | +30.0 pp |
| claude-haiku-4.5 | Anthropic | 33.3% | 31.7% | −1.6 pp |
| claude-opus-4.5 | Anthropic | 16.7% | 36.7% | +20.0 pp |
| gpt-5.1 | OpenAI | 28.3% | 8.3% | −20.0 pp |
| gemini-3-flash | Google | 36.7% | 65.0% | +28.3 pp |
| gpt-5.2 | OpenAI | 31.7% | 48.3% | +16.6 pp |
| claude-opus-4.6 | Anthropic | 33.3% | 40.0% | +6.7 pp |
| claude-sonnet-4.6 | Anthropic | 23.3% | 16.7% | −6.6 pp |
| Mean |  | 22.6% | 31.4% | +8.8 pp |


### Table 12
**Context:** TABLE WA-C4: AVERAGE PASS RATES BY PROVIDER

| Trap | Anthropic (n = 12) | OpenAI (n = 12) | Google (n = 10) | Pooled (N = 34) |
|---|---|---|---|---|
| Modified Cafe Wall | 18.3% | 16.7% | 26.0% | 20.0% |
| Modified Muller-Lyer | 18.3% | 0.0% | 26.0% | 14.1% |
| Modified Ebbinghaus | 79.2% | 20.0% | 45.0% | 48.2% |
| Moving Robot | 8.3% | 4.2% | 3.0% | 5.3% |
| Colliding Oranges | 45.8% | 30.0% | 12.0% | 30.3% |
| Surrounded Planets | 20.0% | 56.7% | 36.0% | 37.6% |
| Overall | 31.7% | 21.2% | 24.7% | 25.9% |


### Table 13
**Context:** TABLE WA-D1: COMPARISON OF DETECTION METHODS AT OPTIMAL OPERATING POINTS

| Method | Sensitivity | FPR | Specificity |
|---|---|---|---|
| Cognitive Traps (3+ failures) | 97.1% (511/526) | 4.1% | 95.9% |
| CAPTCHA (optimal threshold 0.90) | 93.9% (494/526) | 12.4% | 87.6% |
| CAPTCHA (standard threshold 0.5) | 4.6% (24/526) | 1.0% | 99.0% |
| Traditional methods (any) | 2.3% (12/526) | N/A | N/A |


### Table 14
**Context:** TABLE WA-D2: CAPTCHA DETECTION PERFORMANCE BY THRESHOLD

| Threshold | Agents Detected | Humans Flagged | Sensitivity | FPR |
|---|---|---|---|---|
| < 0.50 | 24/526 | 10/1007 | 4.6% | 1.0% |
| < 0.60 | 64/526 | 17/1007 | 12.2% | 1.7% |
| < 0.70 | 97/526 | 40/1007 | 18.4% | 4.0% |
| < 0.80 | 97/526 | 40/1007 | 18.4% | 4.0% |
| < 0.90 | 494/526 | 125/1007 | 93.9% | 12.4% |
| < 0.95 | 494/526 | 125/1007 | 93.9% | 12.4% |


### Table 15
**Context:** TABLE WA-D3: CAPTCHA SCORES BY AGENT PLATFORM

| Platform | Mean | SD | Below 0.5 | Below 0.9 |
|---|---|---|---|---|
| Google Mariner | 0.9000 | 0.0000 | 0 (0.0%) | 134 (100.0%) |
| Perplexity Comet | 0.6901 | 0.2115 | 20 (15.3%) | 125 (95.4%) |
| ChatGPT Agent | 0.8698 | 0.0835 | 0 (0.0%) | 126 (97.7%) |
| Claude/Cursor | 0.8689 | 0.1285 | 4 (3.0%) | 109 (82.6%) |


### Table 16
**Context:** TABLE WA-E1: OPTIMAL CONFIGURATION BY BATTERY SIZE

| # Traps | Best Configuration | Threshold | Sensitivity | FPR | Youden’s J |
|---|---|---|---|---|---|
| 2 | Muller-Lyer + Moving Robot | 2+/2 | 93.7% | 2.6% | 0.911 |
| 3 | Muller-Lyer + Moving Robot + Planets | 2+/3 | 96.8% | 4.0% | 0.928 |
| 4 | Muller-Lyer + Ebb + Moving Robot + Planets | 2+/4 | 97.7% | 5.0% | 0.928 |
| 5 | CW + ML + Ebb + Robot + Planets | 3+/5 | 96.2% | 2.6% | 0.936 |
| 6 | All six traps | 3+/6 | 97.1% | 4.1% | 0.931 |


### Table 17
**Context:** TABLE WA-E2: RECOMMENDED CONFIGURATIONS BY RESEARCH CONTEXT

| Research Priority | Configuration | Sensitivity | FPR |
|---|---|---|---|
| Maximum detection, FPR <= 5% | 4 traps (ML+Ebb+Robot+Planets), thresh 2+ | 97.7% | 5.0% |
| Maximum detection, FPR <= 2% | 4 traps (CW+ML+Robot+Planets), thresh 3+ | 94.5% | 2.0% |
| Minimum survey burden, detection >= 90% | 2 traps (ML+Robot), thresh 2+ | 93.7% | 2.6% |
| Balanced (as deployed in this study) | 6 traps (all), thresh 3+ | 97.1% | 4.1% |
| Optimal by Youden’s J | 5 traps (drop Oranges), thresh 3+ | 96.2% | 2.6% |


### Table 18
**Context:** TABLE WA-E3: CONSTRAINT DIVERSITY WITHIN 3-TRAP BATTERIES

| Constraint Diversity | Best Configuration | J | Sensitivity | FPR |
|---|---|---|---|---|
| 1 category | CW + ML + Ebb (all overfitting) | 0.912 | 94.5% | 3.3% |
| 2 categories | ML + Ebb + Robot (2 types) | 0.920 | 97.3% | 5.3% |
| 3 categories | ML + Robot + Planets (3 types) | 0.928 | 96.8% | 4.0% |


### Table 19
**Context:** TABLE WA-F1: CHOICE DEFERRAL BY GROUP AND CONDITION

| Outcome | Passed Humans |  | Failed Humans |  | AI Agents |  |
|---|---|---|---|---|---|---|
|  | Dominated | Conflict | Dominated | Conflict | Dominated | Conflict |
| Chose Laptop A | 94.0% | 44.0% | 89.5% | 54.5% | 100.0% | 60.1% |
| Chose Laptop B | 0.8% | 32.0% | 5.3% | 31.8% | 0.0% | 39.2% |
| Deferred | 5.2% | 24.0% | 5.3% | 13.6% | 0.0% | 0.7% |
| N | 482 | 484 | 19 | 22 | 258 | 268 |
| Chi-sq | 66.83 |  | 0.139 |  | 0.465 |  |
| p | < .0001 |  | .709 |  | .496 |  |


### Table 20
**Context:** TABLE WA-F2: DECISION TIMES (SECONDS) BY GROUP AND CONDITION

| Statistic | Passed Humans |  | Failed Humans |  | AI Agents |  |
|---|---|---|---|---|---|---|
|  | Dominated | Conflict | Dominated | Conflict | Dominated | Conflict |
| Mean | 53.3 | 64.6 | 72.4 | 97.0 | 36.3 | 36.3 |
| SD | 69.9 | 116.8 | 48.4 | 147.6 | 16.7 | 17.0 |
| Median | 34.2 | 41.6 | 65.9 | 43.3 | 35.7 | 34.7 |
| Condition effect | t = 1.83, p = .067 |  | t = 0.69, p = .492 |  | t = -0.02, p = .984 |  |


### Table 21
**Context:** TABLE WA-F3: TRADITIONAL CHECK PERFORMANCE BY GROUP

| Check | Passed Humans | Failed “Humans” | Agents |
|---|---|---|---|
| IMC Pass Rate | 99.6% | 97.6% | 99.8% |
| Obvious Answer Pass Rate | 99.3% | 92.7% | 99.8% |
| Memory Check Pass Rate | 90.7% | 82.9% | 99.2% |
| Straight-lining Pass Rate | 99.9% | 100.0% | 98.7% |
| CAPTCHA Mean Score | 0.972 | 0.971 | 0.833 |
| CAPTCHA SD | 0.098 | 0.129 | 0.154 |


### Table 22
**Context:** F.2 Total Score Distribution Among Failed-Trap “Humans”

| Score | N | % of Failed Group |
|---|---|---|
| 0 | 2 | 4.9% |
| 1 | 4 | 9.8% |
| 2 | 13 | 31.7% |
| 3 | 22 | 53.7% |


### Table 23
**Context:** F.3 Total Survey Completion Times

| Group | Mean | Median | SD |
|---|---|---|---|
| Passed Humans | 538.6s | 367.0s | – |
| Failed “Humans” | 693.7s | 631.0s | – |
| Agents | 635.3s | 597.5s | – |


### Table 24
**Context:** TABLE WA-F4: AGENT CHOICE PATTERNS BY PLATFORM (CONFLICT CONDITION)

| Platform | N | Chose A | Chose B | Defer | A:B Ratio | Decision Time |
|---|---|---|---|---|---|---|
| Mariner | 68 | 70.6% | 26.5% | 2.9% | 2.7:1 | 30.8s |
| Perplexity | 66 | 39.4% | 60.6% | 0.0% | 1:1.5 | 47.1s |
| ChatGPT | 70 | 95.7% | 4.3% | 0.0% | 22:1 | 20.7s |
| Claude | 64 | 31.2% | 68.8% | 0.0% | 1:2.2 | 48.3s |
| Overall agents | 268 | 60.1% | 39.2% | 0.7% | 1.5:1 | 36.3s |


### Table 25
**Context:** TABLE WA-G1: TOTAL SCORE DISTRIBUTION ON MTURK

| Score | N | % | Cumulative % |
|---|---|---|---|
| 6 | 5 | 1.9% | 100.0% |
| 5 | 14 | 5.3% | 98.1% |
| 4 | 44 | 16.7% | 92.8% |
| 3 | 70 | 26.6% | 76.0% (threshold) |
| 2 | 85 | 32.3% | 49.4% |
| 1 | 42 | 16.0% | 17.1% |
| 0 | 3 | 1.1% | 1.1% |


### Table 26
**Context:** TABLE WA-G2: INDIVIDUAL TRAP PASS RATES: MTURK VS. PROLIFIC VS. AGENTS

| Trap | MTurk | Prolific | Agents | MTurk-Prolific | MTurk-Agents |
|---|---|---|---|---|---|
| Modified Cafe Wall | 31.2% (82) | 88.4% (890) | 5.1% (27) - | 57.2 pp + | 26.0 pp |
| Modified Muller-Lyer | 71.1% (187) | 92.8% (934) | 5.9% (31) - | 21.7 pp + | 65.2 pp |
| Modified Ebbinghaus | 78.7% (207) | 95.6% (963) | 22.4% (118) - | 16.9 pp + | 56.3 pp |
| Moving Robot | 20.9% (55) | 77.9% (784) | 0.4% (2) - | 57.0 pp + | 20.5 pp |
| Colliding Oranges | 20.2% (53) | 88.7% (893) | 49.4% (260) - | 68.5 pp - | 29.3 pp |
| Surrounded Planets | 43.3% (114) | 96.5% (972) | 44.5% (234) - | 53.2 pp - | 1.1 pp |
| Average | 44.2% | 90.0% | 21.3% * | *-45.8 pp** * | *+22.9 pp** |


### Table 27
**Context:** TABLE WA-G3: THRESHOLD SENSITIVITY ON MTURK (N = 263)

| Threshold | Flagged | Rate |
|---|---|---|
| 1+ failures | 258 | 98.1% |
| 2+ failures | 244 | 92.8% |
| 3+ failures | 200 | 76.0% (pre-registered) |
| 4+ failures | 130 | 49.4% |
| 5+ failures | 45 | 17.1% |
| 6 failures | 3 | 1.1% |


### Table 28
**Context:** TABLE WA-G4: TOTAL SCORE DISTRIBUTION ON CLOUDRESEARCH CONNECT

| Score | N | % | Cumulative % |
|---|---|---|---|
| 6 | 387 | 76.5% | 100.0% |
| 5 | 90 | 17.8% | 23.5% |
| 4 | 20 | 4.0% | 5.7% |
| 3 | 5 | 1.0% | 1.8% (threshold) |
| 2 | 4 | 0.8% | 0.8% |
| 1 | 0 | 0.0% | 0.0% |
| 0 | 0 | 0.0% | 0.0% |


### Table 29
**Context:** TABLE WA-G5: INDIVIDUAL TRAP PASS RATES: CLOUDRESEARCH CONNECT VS. PROLIFIC VS. AGENTS

| Trap | Connect | Prolific | Agents | Connect-Prolific | Connect-Agents |
|---|---|---|---|---|---|
| Modified Cafe Wall | 96.0% (486) | 88.4% (890) | 5.1% (27) + | 7.6 pp + | 90.9 pp |
| Modified Muller-Lyer | 97.4% (493) | 92.8% (934) | 5.9% (31) + | 4.6 pp + | 91.5 pp |
| Modified Ebbinghaus | 97.8% (495) | 95.6% (963) | 22.4% (118) + | 2.2 pp + | 75.4 pp |
| Moving Robot | 85.0% (430) | 77.9% (784) | 0.4% (2) + | 7.1 pp + | 84.6 pp |
| Colliding Oranges | 93.7% (474) | 88.7% (893) | 49.4% (260) + | 5.0 pp + | 44.2 pp |
| Surrounded Planets | 98.2% (497) | 96.5% (972) | 44.5% (234) + | 1.7 pp + | 53.7 pp |
| Average | 94.7% | 90.0% | 21.3% * | *+4.7 pp** * | *+73.4 pp** |


### Table 30
**Context:** TABLE WA-G6: THRESHOLD SENSITIVITY ON CLOUDRESEARCH CONNECT (N = 506)

| Threshold | Flagged | Rate |
|---|---|---|
| 1+ failures | 119 | 23.5% |
| 2+ failures | 29 | 5.7% |
| 3+ failures | 9 | 1.8% (pre-registered) |
| 4+ failures | 4 | 0.8% |
| 5+ failures | 0 | 0.0% |
| 6 failures | 0 | 0.0% |


### Table 31
**Context:** TABLE WA-G7: COGNITIVE TRAP FLAGGING RATES ACROSS ALL FOUR DATASETS

| Dataset | N | Flagged | Rate | z vs. Prolific |
|---|---|---|---|---|
| Prolific | 1,007 | 41 | 4.1% | (reference) |
| CloudResearch Connect | 506 | 9 | 1.8% | z = -2.35, p = .019 |
| Amazon MTurk | 263 | 200 | 76.0% | z = 26.51, p < .001 |
| Agents | 526 | 511 | 97.1% | z = -36.04, p < .001 |


### Table 32
**Context:** TABLE WA-G8: TRADITIONAL ATTENTION CHECK PASS RATES BY DATASET

| Check | Prolific | MTurk | Connect | Agents |
|---|---|---|---|---|
| IMC (puppy name) | 99.5% | 84.4% | 99.4% | 99.8% |
| Obvious (heart attack) | 99.0% | 55.9% | 100.0% | 99.8% |
| Memory (planet color) | 90.4% | 60.5% | 91.3% | 99.2% |
| Straight-lining (PANAS) | 99.9% | 96.2% | 99.2% | 98.7% |


### Table 33
**Context:** TABLE WA-G9: CHOICE DEFERRAL IN CONFLICT CONDITION BY DATASET

| Dataset | N (conflict) | Deferral Rate | χ² (condition effect) |
|---|---|---|---|
| Prolific (full) | 506 | 23.5% | χ² = 67.13, p < .001 |
| Prolific (clean only) | 484 | 24.0% | χ² = 66.83, p < .001 |
| CloudResearch (full) | 252 | 26.6% | χ² = 34.74, p < .001 |
| CloudResearch (clean) | 250 | 26.8% | χ² = 35.44, p < .001 |
| MTurk (full) | 128 | 1.6% | χ² = 0.56, p = .455 |
| MTurk (clean only) | 35 | 0.0% | N/A (zero cells) |
| Agents | 268 | 0.7% | χ² = 0.46, p = .495 |


### Table 34
**Context:** G.4.4 reCAPTCHA Score Comparison

| Dataset | Mean | SD | Median | Below 0.5 |
|---|---|---|---|---|
| Prolific | 0.972 | 0.099 | 1.000 | 1.0% |
| CloudResearch Connect | 0.984 | 0.049 | 1.000 | 0.0% |
| Amazon MTurk | 0.635 | 0.320 | 0.800 | 34.9% |
| Agents | 0.833 | 0.154 | 0.900 | 4.6% |


### Table 35
**Context:** TABLE WA-H1: MODEL-LEVEL COMPUTATIONAL EFFICIENCY (RANKED BY ACCURACY)

| Model | Provider | Accuracy | Cost/Trial | Avg Duration | Avg Output Tokens |
|---|---|---|---|---|---|
| Gemini 3 Flash† | Google | 65.0% | $0.0002 | 7.5s | 2 |
| GPT-5.2† | OpenAI | 48.3% | $0.0024 | 2.0s | 4 |
| Claude Sonnet 4.5† | Anthropic | 46.7% | $0.0083 | 8.8s | 316 |
| Gemini 2.5 Flash Lite† | Google | 46.7% | $0.0001 | 5.0s | 5 |
| Claude Haiku 3.5 | Anthropic | 45.0% | $0.0010 | 1.9s | 17 |
| Claude Haiku 3.0 | Anthropic | 40.0% | $0.0003 | 1.5s | 5 |
| Claude Opus 4.6† | Anthropic | 40.0% | $0.0476 | 11.2s | 400 |
| Claude Opus 4.5† | Anthropic | 36.7% | $0.0383 | 7.6s | 276 |
| Gemini 3 Flash | Google | 36.7% | $0.0002 | 4.1s | 1 |
| GPT-4o Mini | OpenAI | 36.7% | $0.0043 | 4.8s | 1 |
| GPT-5.2 Pro | OpenAI | 35.0% | $0.0424 | 43.7s | 373 |
| Claude Haiku 4.5 | Anthropic | 33.3% | $0.0013 | 1.8s | 37 |
| Claude Opus 4.6 | Anthropic | 33.3% | $0.0199 | 4.1s | 36 |
| Claude Haiku 4.5† | Anthropic | 31.7% | $0.0028 | 4.6s | 329 |
| Gemini 2.0 Flash | Google | 31.7% | $0.0003 | 3.2s | 1 |
| GPT-5.2 | OpenAI | 31.7% | $0.0036 | 5.8s | 101 |
| GPT-5† | OpenAI | 28.3% | $0.0124 | 25.9s | 1136 |
| GPT-5.1 | OpenAI | 28.3% | $0.0015 | 3.8s | 45 |
| Claude Sonnet 4.6 | Anthropic | 23.3% | $0.0040 | 2.8s | 36 |
| Gemini 3 Pro | Google | 23.3% | $0.0017 | 15.4s | 19 |
| Gemini 2.5 Flash Lite | Google | 18.3% | $0.0001 | 2.5s | 1 |
| Claude Opus 4.5 | Anthropic | 16.7% | $0.0199 | 3.7s | 36 |
| Claude Sonnet 4.5 | Anthropic | 16.7% | $0.0043 | 4.3s | 57 |
| Claude Sonnet 4.6† | Anthropic | 16.7% | $0.0037 | 2.2s | 13 |
| GPT-5 | OpenAI | 16.7% | $0.0010 | 2.0s | 1 |
| GPT-5 Mini | OpenAI | 16.7% | $0.0014 | 9.8s | 521 |
| Gemini 2.5 Pro | Google | 15.0% | $0.0005 | 4.8s | 1 |
| GPT-5.1† | OpenAI | 8.3% | $0.0011 | 2.6s | 10 |
| Gemini 2.5 Flash† | Google | 6.7% | $0.0001 | 6.8s | 17 |
| GPT-4.1 | OpenAI | 5.0% | $0.0019 | 2.1s | 1 |
| Gemini 2.5 Flash | Google | 1.7% | $0.0001 | 3.1s | 4 |
| Gemini 2.5 Pro† | Google | 1.7% | $0.0005 | 10.5s | 1 |
| GPT-4.1 Mini | OpenAI | 0.0% | $0.0007 | 1.9s | 2 |
| GPT-4o | OpenAI | 0.0% | $0.0024 | 2.3s | 1 |


### Table 36
**Context:** TABLE WA-H2: COMPUTATIONAL SIGNATURES BY CONSTRAINT TYPE

| Constraint | Traps | N Correct | N Wrong | Dur (Correct) | Dur (Wrong) | Dur d | Cost (Correct) | Cost (Wrong) | Cost d |
|---|---|---|---|---|---|---|---|---|---|
| Training Data Overfitting | 3 | 280 | 740 | 4.2s | 4.8s | −0.11 | $0.0040 | $0.0043 | −0.03 |
| Spatial Reasoning | 1 | 103 | 237 | 20.0s | 7.7s | +0.57 | $0.0310 | $0.0050 | +1.03 |
| Cross-Modal Binding | 1 | 128 | 212 | 12.8s | 5.5s | +0.77 | $0.0134 | $0.0074 | +0.35 |
| Spatiotemporal Reasoning | 1 | 18 | 322 | 3.9s | 6.0s | −0.32 | $0.0016 | $0.0056 | −0.48 |


### Table 37
**Context:** TABLE WA-H3: EXTENDED THINKING COST-BENEFIT

| Base Model | Provider | Std Acc | Think Acc | Diff | Cost Mult | Std Duration | Think Duration |
|---|---|---|---|---|---|---|---|
| Gemini 2.5 Pro | Google | 15.0% | 1.7% | −13.3 pp | 1.0x | 4.8s | 10.5s |
| Gemini 2.5 Flash | Google | 1.7% | 6.7% | +5.0 pp | 1.1x | 3.1s | 6.8s |
| Gemini 2.5 Flash Lite | Google | 18.3% | 46.7% | +28.3 pp | 1.0x | 2.5s | 5.0s |
| GPT-5 | OpenAI | 16.7% | 28.3% | +11.7 pp | 12.2x | 2.0s | 25.9s |
| Claude Sonnet 4.5 | Anthropic | 16.7% | 46.7% | +30.0 pp | 1.9x | 4.3s | 8.8s |
| Claude Haiku 4.5 | Anthropic | 33.3% | 31.7% | −1.7 pp | 2.1x | 1.8s | 4.6s |
| Claude Opus 4.5 | Anthropic | 16.7% | 36.7% | +20.0 pp | 1.9x | 3.7s | 7.6s |
| GPT-5.1 | OpenAI | 28.3% | 8.3% | −20.0 pp | 0.8x | 3.8s | 2.6s |
| Gemini 3 Flash | Google | 36.7% | 65.0% | +28.3 pp | 1.0x | 4.1s | 7.5s |
| GPT-5.2 | OpenAI | 31.7% | 48.3% | +16.7 pp | 0.7x | 5.8s | 2.0s |
| Claude Opus 4.6 | Anthropic | 33.3% | 40.0% | +6.7 pp | 2.4x | 4.1s | 11.2s |
| Claude Sonnet 4.6 | Anthropic | 23.3% | 16.7% | −6.7 pp | 0.9x | 2.8s | 2.2s |
| Mean |  | 22.6% | 31.4% | +8.8 pp | 2.3x |  |  |


### Table 38
**Context:** TABLE WA-I1: VISION IMPAIRMENT AND COGNITIVE TRAP FAILURE

| Vision Status | N | Failed 3+ Traps | Failure Rate | Relative Risk |
|---|---|---|---|---|
| No impairment | 980 | 37 | 3.8% | Reference |
| Uncorrected impairment | 12 | 3 | 25.0% | 6.58x |
| Unsure | 14 | 0 | 0.0% | – |
| Prefer not to say | 1 | 1 | 100.0% | – |


### Table 39
**Context:** TABLE WA-I2: COGNITIVE TRAP FAILURE RATES BY AGE GROUP

| Age Group | N | Failed 3+ | Failure Rate |
|---|---|---|---|
| 18-30 | 168 | 13 | 7.7% |
| 31-40 | 271 | 4 | 1.5% |
| 41-50 | 232 | 8 | 3.4% |
| 51-60 | 178 | 8 | 4.5% |
| 61+ | 156 | 8 | 5.1% |


### Table 40
**Context:** TABLE WA-I3: HUMAN PASS RATE BY TRAP AND AGE GROUP

| Age | Cafe Wall | M-L | Ebb | Robot | Oranges | Planets |
|---|---|---|---|---|---|---|
| 18-30 | 86.9% | 91.7% | 95.8% | 77.4% | 83.3% | 95.8% |
| 31-40 | 95.2% | 93.7% | 97.4% | 82.3% | 88.6% | 96.7% |
| 41-50 | 86.6% | 94.4% | 97.0% | 79.7% | 89.2% | 97.0% |
| 51-60 | 86.5% | 89.3% | 95.5% | 73.0% | 92.7% | 97.2% |
| 61+ | 82.7% | 93.6% | 90.4% | 73.7% | 89.7% | 95.5% |


### Table 41
**Context:** TABLE WA-I4: COLOR BLINDNESS AND COGNITIVE TRAP FAILURE

| Color Vision | N | Failed 3+ | Failure Rate |
|---|---|---|---|
| Not color blind | 970 | 38 | 3.9% |
| Color blind | 14 | 1 | 7.1% |
| Unsure | 19 | 1 | 5.3% |
| Prefer not to say | 4 | 1 | 25.0% |
