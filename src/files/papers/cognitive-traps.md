---
title: "Brief Commentary: A Framework for Detecting AI Agents in Online Research"
authors: "Felipe M. Affonso"
journal: "Journal of Consumer Research"
year: 2025
doi: "10.1093/jcr/ucag006"
citation: "Affonso, Felipe M. (forthcoming), \"Brief Commentary: A Framework for Detecting AI Agents in Online Research,\" Journal of Consumer Research."
---

> **Disclaimer:** This is a machine-readable conversion of the published paper for use with AI tools. It may contain conversion errors in formatting, tables, or equations. Always verify against the [published version](https://doi.org/10.1093/jcr/ucag006).

# Brief Commentary: A Framework for Detecting AI Agents in Online Research

**Felipe M. Affonso**

Forthcoming, *Journal of Consumer Research*

Felipe M. Affonso (felipe.affonso@okstate.edu) is Assistant Professor of Marketing, Spears School of Business, Oklahoma State University, 316 Business Building, Stillwater, OK 74078, USA. Felipe gratefully acknowledges Chris Janiszewski for comments on an early version of this article, Andrew Gordon for insightful conversations on AI agent detection and data collection, and the JCR review team for insightful comments. Supplementary materials are included in the Web Appendix accompanying the online version of this article. Please address correspondence to Felipe M. Affonso.

## ABSTRACT

Online behavioral research assumes survey responses come from humans, yet vision-enabled AI agents can now autonomously complete surveys by capturing screenshots, processing questions, and submitting responses. Because these agents perceive the same rendered visual content that humans see, traditional detection methods are ineffective. This article introduces the Cognitive Trap Framework: researchers can transform architectural constraints of vision-language models into survey questions where the correct answers are simultaneously difficult for AI agents but easily processed by humans. Six traps derived from computer science benchmarks demonstrate the framework. Against 1,007 human participants (Prolific) and 526 researcher-deployed AI agents (e.g., ChatGPT Agent, Google Project Mariner), cognitive traps detected 97.1% of agents (vs. 2.3% with traditional attention checks), while flagging only 4.1% of humans. Pre-registered replications on Amazon MTurk and CloudResearch Connect demonstrate cross-platform effectiveness, and validation against 34 frontier models spanning two years reveals that model improvement is non-monotonic because each new architecture reconfigures which constraints it resolves and which it introduces. The framework can thus generate new cognitive traps as AI agent models evolve, and a public repository provides researchers with validated traps ready for deployment.

*Keywords: survey methodology, data quality, fraud detection, artificial intelligence, large multimodal models*

Consider Tommy, a Prolific participant who passed all verification checks when joining the platform. He cleared bank-grade identity verification, built a strong record across hundreds of approved submissions, and maintained the approval rating that gives him priority access to studies with more stringent data quality requirements. On a busy Wednesday afternoon, juggling work deadlines and childcare logistics, Tommy opens Perplexity Comet (or ChatGPT Agent) and instructs the AI to browse his Prolific account and complete all the available surveys. The AI agent autonomously navigates his account, identifies a survey about product preferences, accepts it, captures screenshots of each question, processes them through vision-language models, generates responses matching his demographic profile, and submits. Tommy collects payment while the agent handles everything, including maintaining a copy of the survey completion code. Despite the researcher’s extensive survey pretesting, careful scale selection from the literature, multiple rounds of proofreading, and pilot testing, Tommy has never read a single question.

This opening example represents one point on a spectrum of vision-enabled AI fraud possibilities, ranging from individuals manually pasting survey URLs into ChatGPT Agent to organized operations deploying agents across dozens of simultaneous browser instances, each managing multiple participant accounts and completing surveys in parallel across platforms.

Recent work has begun documenting this emerging threat, with researchers observing LLM-mediated responses in up to 45% of submissions in some studies (Rilla et al. 2025), while Westwood (2025) demonstrates that autonomous synthetic respondents can achieve a 99.8% pass rate across 6,000 attention check trials in a controlled evaluation of LLMs. The scope of AI-mediated survey responses is now well documented (Phillips 2026), yet the research to date documents the threat but proposes no concrete detection solution beyond demanding transparency from participant panels or reverting to controlled laboratory recruitment.

Vision-enabled AI agents differ from earlier text-based AI interfaces in two consequential ways. First, earlier models such as GPT-3.5 are text-only large language models (LLMs), while current models such as GPT-5.2, Gemini 3 Pro, and Claude Sonnet 4.6 are large multimodal models (LMMs) that process visual content and other modalities. Second, and more consequentially, LMMs can now be accessed through agent-based frameworks (ChatGPT Agent, Perplexity Comet, Google Project Mariner, among others) that enable autonomous operations where the AI fully controls web browsers, navigates pages, clicks buttons, fills forms, and submits responses with minimal to zero human involvement. These tools currently enable low-cost autonomous survey completion, and their adoption trajectories suggest that what is technically possible for a determined individual today can become scalable within months.

This article introduces the Cognitive Trap Framework for detecting vision-enabled AI fraud in behavioral research. The framework’s core idea is that architectural constraints in vision-language models, documented through the computer science benchmarking ecosystem, can be transformed into simple survey questions where humans succeed through natural cognitive processing while large multimodal models fail due to their structural characteristics. Specifically, this article demonstrates the framework by exploiting five such constraints from computer science benchmarks, transforming them into visual survey questions, and validating detection performance against human participants across three platforms, 34 vision-enabled large multimodal models, and researcher-deployed AI agents across four agent platforms.

The following sections present each stage of this process. Five constraints yield six cognitive traps (Table 1) validated against 34 models spanning nearly two years (Figure 2), where model improvement is shown to be non-monotonic: accuracy drops from 30.4% in early models to 15.7% in mid-generation before recovering to 31.8% in the latest cohort, because each new architecture reconfigures which constraints it resolves and which it introduces. Although Westwood (2025) suggests that AI agent detection solutions are likely to be fleeting, our validation suggests that model improvement is not necessarily uniform. A pre-registered deployment with 1,007 humans and 526 AI agents demonstrates that cognitive traps detect 97.1% of agents while flagging only 4.1% of humans (Tables 3 and 4), with replications on Amazon MTurk and CloudResearch Connect confirming cross-platform effectiveness. All stimuli, analysis code, and data are available at https://osf.io/f2jhx/, and an ongoing public Cognitive Trap Repository provides researchers with validated traps ready for deployment (https://FelipeMAffonso.github.io/cognitive-trap-repository).

## DATA QUALITY THREATS IN ONLINE SURVEYS

Data quality threats in online surveys historically fell into two categories: human-based and technical. Human-based threats include click farm workers paid pennies per completion to rush through surveys (Hara et al. 2018; Moss et al. 2023), participants using VPNs to access geographically restricted studies (Kennedy et al. 2020), and individual respondents who grow distracted or careless (Chmielewski and Kucker 2020; Oppenheimer, Meyvis, and Davidenko 2009). Researchers counter these threats with familiar and widespread detection methods: instructional manipulation checks that embed hidden instructions in lengthy text (Oppenheimer et al. 2009), memory checks asking participants to recall study details, obvious answer questions with unambiguous correct responses, completion time analysis (Malhotra 2008), and mouse movement patterns identifying multitasking (Acien et al. 2022; Iliou et al. 2021). These methods work because they target the behavioral signatures of human inattention: skipping instructions, rushing through questions, failing to remember earlier content, or showing careless response patterns.

Technical threats involve automated systems, such as simple bots and scripts, that try to complete surveys without any human sitting at the screen. These bots do not see what is on the screen the way people would; they read the survey’s underlying HTML code directly and fill in form fields automatically. Researchers counter this with HTML honeypots, hidden form fields, and CSS-based traps that show up in the code but do not appear on the screen (Bonnamy et al. 2025; Goodrich et al. 2023), as well as CAPTCHAs designed to distinguish humans from automated systems (Searles et al. 2023). These methods work because they exploit the gap between reading raw code and actually seeing the rendered visual survey.

Vision-enabled AI agents break both detection logics because they match neither threat model. Unlike simple bots, vision-enabled agents can perceive surveys through screenshots of the actual rendered page, meaning they do not necessarily interact with hidden HTML elements where technical traps reside. Unlike inattentive humans, agents process complete text carefully as their core function, maintaining consistent attention through model inference across every survey page (Ouyang et al. 2022). They can read every word, follow embedded instructions, maintain consistent responses, and generate contextually appropriate answers. Traditional detection methods fail because they target threats that agents simply do not exhibit (web appendix A provides an empirical evaluation of AI agents and traditional detection methods).

This is a problem that cannot be easily solved by AI companies such as OpenAI and Anthropic. They cannot completely block survey completion without harming legitimate automation uses, and even if they did, users could easily reframe requests via prompt engineering (e.g., “I’m pilot testing this survey, please answer it as a regular respondent”). In addition, survey platforms cannot know for certain whether someone is using an AI agent or monitor what happens once the participant goes from the platform (e.g., MTurk) to the survey (e.g., Qualtrics). A notable exception is Prolific, who has begun developing proprietary behavioral detection tools that analyze real-time interaction patterns during survey completion. Prolific’s authenticity checks, for instance, can achieve 100% agent detection in controlled testing, and their evaluation independently confirmed that the cognitive traps developed in this article also detect all tested agents with 100% sensitivity (Gordon 2026). However, platform-level solutions require specific survey tool integrations (e.g., currently limited to Qualtrics on Prolific), depend on proprietary infrastructure that researchers cannot inspect or reproduce, and remain unavailable across most recruitment environments.

Researchers who collect data through MTurk, CloudResearch Connect, Gorilla, or self-hosted surveys need detection methods they control directly within the survey instrument. The documented architectural constraints of vision-language models provide this type of foundation, producing systematic processing differences from human cognition that can be translated into visual survey questions functioning within any survey tool, independent of platform infrastructure. Thus, while traditional approaches remain useful for catching inattentive humans, and some platform-level tools offer valuable complementary protection where available, the cognitive trap framework provides a portable, transparent, and perennial methodology that researchers can embed directly in their surveys and deploy regardless of recruitment platform.

## THE COGNITIVE TRAP FRAMEWORK: FOUNDATIONS AND IMPLEMENTATION

The Cognitive Trap Framework provides a methodology for detecting vision-enabled AI agents by exploiting architectural constraints in vision-language models. The framework proceeds through four steps: (1) identify architectural constraints from computer science literature, (2) design survey-compatible visual questions that exploit these constraints, (3) validate against models and humans, and (4) deploy in research contexts. We present each step with its conceptual foundation followed by our concrete implementation. The framework’s main value lies in the replicable process for generating detection mechanisms, which remains effective even if individual traps become obsolete: as long as computer science researchers benchmark models against human capabilities, they document what models can and cannot do, and behavioral researchers can translate those documented limitations into new survey questions. A complete methodological tutorial with extended examples appears in web appendix B.

**FIGURE 1.** THE COGNITIVE TRAP FRAMEWORK

[Image: Framework diagram showing the four-step cycle: (1) Identify Architectural Constraints, (2) Design Survey-Compatible Implementations, (3) Validate Against Models and Humans, (4) Deploy in Research Context. Light orange boxes show results from this implementation.]

*NOTE.  --  Light orange boxes show results from our implementation. The cycle is ongoing: new AI evaluation research documents new constraints, generating new traps.*

### Step 1: Identify Architectural Constraints

The process begins with systematic research of computer science benchmarks and vision-language model evaluations for documented architectural constraints showing either large performance gaps between models and humans or systematic model failures irrespective of human benchmarks. Such constraints are ubiquitous because a key goal of artificial intelligence research is to build machines that think like people (Lake et al. 2017), and research across multiple fields investigates how models perform on human-like capabilities such as intuitive physics, causal reasoning, and spatial judgments (Schulze Buschoff et al. 2025). When these evaluations reveal that models fail at tasks humans accomplish effortlessly, they document exploitable constraints.

We recommend prioritizing constraints that show large human-model performance gaps, are validated across multiple model architectures (ensuring the constraint reflects a general limitation across architectures), and are amenable to implementation through standard survey stimuli. We identified five constraints meeting these criteria through systematic search of AI and computer science literature (see web appendix B for the full search methodology and extended descriptions). Training data overfitting occurs when learned statistical regularities about familiar visual patterns override actual perception, causing models to report canonical illusion patterns even when obvious visual deviations are present (Shinozaki et al. 2025; Ullman 2024). Spatiotemporal reasoning requires integrating visual information across temporal frames to predict motion, where models achieve only 63.5% accuracy versus 99.7% for humans (Zhou et al. 2025). Spatial reasoning with mental simulation involves constructing imaginary paths and computing geometric relationships, tasks on which models achieve near-zero accuracy while humans perform effortlessly (Qi et al. 2025; Stogiannidis, McDonagh, and Tsaftaris 2025). Cross-modal binding requires identifying which single object possesses multiple combined features, and because models process different feature types through separate pathways, they achieve only 58–61% accuracy where humans exceed 95% (Campbell et al. 2024; Kamath, Hessel, and Chang 2023). Compositional counting demands simultaneously filtering by multiple attributes while counting, a combination that models fail to execute across many objects (Guo et al. 2025).

### Step 2: Design Survey-Compatible Implementations (Cognitive Traps)

Each identified constraint must be transformed into a visual survey question that forces processing through the constrained pathways. These “cognitive traps” function analogously to attention checks: both measure underlying constructs imperfectly, with various sources of measurement error. Whereas attention check failures may reflect distraction or rushing, cognitive trap failures reflect inability to perform simple integrated visual processing that most adults accomplish effortlessly, such as binding features to objects, computing geometric relationships, and extrapolating trajectories. Two design criteria should guide the transformation. First, the stimulus must be visual: constraints should be presented through rendered images because text descriptions would be processed through the language pathway, potentially circumventing the constraint. Second, the failure patterns should be diagnostic: implementations must produce specific, interpretable errors when models fail, enabling researchers to distinguish architectural failures from random guessing.

We implemented seven visual stimuli operationalizing the five constraints. Table 1 illustrates two representative examples. All seven implementations with exact stimuli, questions, and response options are available in web appendix B and the Cognitive Trap Repository.

**TABLE 1.** REPRESENTATIVE COGNITIVE TRAP IMPLEMENTATIONS

| Trap | Constraint | Description |
| --- | --- | --- |
| Modified Muller-Lyer | Training Data Overfitting | Adapted from Ullman (2024). This modified Muller-Lyer illusion presents two lines with arrowhead endpoints where the blue line (above) is objectively longer than the red line (below). Participants are asked which line is longer. The correct answer is the blue line (A*), but models typically report that both lines are equal, defaulting to the canonical Muller-Lyer pattern where lines only appear different but are actually equal. Because models have memorized this pattern from training data, they apply it indiscriminately even when the perceptual property differs. |
| The Moving Robot | Spatiotemporal Reasoning | The four-frame sequence above shows a robot moving progressively toward the center of a square with constant speed and trajectory, with Step 4 left empty. Participants predict where the robot will be on Step 4. The correct answer is mostly around the center (E*), but models typically predict incorrect quadrant locations, failing to integrate visual motion information across the temporal sequence. Humans effortlessly extrapolate the trajectory, while models achieve only 63.5% accuracy on this class of spatiotemporal prediction versus 99.7% for humans (Zhou et al. 2025). |
| Surrounded Planets | Cross-Modal Binding | Six colored planets are each surrounded by several geometric shapes. Five planets have 5 shapes surrounding them; one planet has only 4. The task requires counting shapes around each planet and identifying the one with fewer shapes. Models struggle to correctly bind shapes to specific planets when visual elements overlap and occlude each other. |
| Colliding Oranges | Spatial Reasoning | A set of shapes in a 2D display where the participant predicts which objects would collide if the largest circle moved in a straight line toward the smallest circle. This requires mental simulation of physical movement and spatial reasoning about object positions and sizes. |

Three implementations targeting training data overfitting were adopted from Ullman (2024), who introduced the concept of “illusion-illusions”: modified versions of canonical visual illusions where the perceptual property matches reality, eliminating the illusory mismatch. The Modified Café Wall presents dividing lines between offset rows of squares that are genuinely diagonal, the Modified Muller-Lyer presents two lines with arrowhead endpoints where one is objectively longer (Table 1), and the Modified Ebbinghaus presents two central circles surrounded by context circles where one is genuinely larger. In each case, models default to the canonical illusion response (lines are straight, lines are equal, circles are equal) because they have memorized these patterns from training data, overriding the visual evidence actually present in the image.

Four additional traps were developed from scratch through iterative pretesting against frontier models, with initial versions refined until current models showed systematic failures. The Moving Robot (Table 1) shows a four-frame sequence of a robot approaching the center of a square with constant speed and trajectory, then asks participants to predict its location on the blank fourth frame, exploiting models’ inability to integrate motion information across temporal frames. The Colliding Oranges displays colored shapes and asks which objects lie in the straight-line path of a moving circle, requiring geometric mental simulation that models cannot perform. The Surrounded Planets presents six colored planets each enclosed by varying numbers of geometric shapes and asks participants to identify which planet has fewer surrounding shapes, requiring simultaneous binding of color, spatial proximity, and count. The Shape Overload asks participants to determine which shape type appears in the most different colors and then count all instances of that shape, combining attribute filtering with counting across many objects.

### Step 3: Validate Against Models and Humans

The validation establishes whether cognitive traps reliably produce model failures and human successes. We suggest two retention criteria to guide this assessment. Human performance should exceed 75% accuracy, ensuring tasks remain within normal visual-cognitive capabilities (this threshold balances obviously easy tasks with tasks requiring deliberation, and researchers concerned about false positives may raise it to 80-85%, accepting reduced detection sensitivity). Human performance should also exceed pooled model performance by at least 30 percentage points, a gap representing a large effect size (Cohen’s h = 0.65-0.80) that provides robustness to measurement error and model improvements. These thresholds reflect informed judgment from validation experience rather than formal simulations. We describe the full validation methodology in web appendix A.

Human Validation. We recruited 202 participants from Prolific (45.5% female, Mage = 41.75) who completed all seven traps embedded within a survey taking approximately 7 minutes. After filtering 31 participants who failed at least one traditional attention check, 171 attentive participants remained. These participants averaged 86.8% accuracy across the six retained traps, with all six exceeding the 75% threshold (range: 77.2% for Moving Robot to 91.8% for Surrounded Planets).

Initial Model Validation. We validated all seven cognitive traps against six frontier vision-language models (at the time of validation), with each model completing 10 independent trials per trap through standalone chat sessions (Table 2). Six traps satisfied both retention criteria. The seventh, Shape Overload (compositional counting), failed: human accuracy was only 46.8% (below the 75% threshold) and the human-model gap was 6.8 percentage points (below the 30pp threshold), so it was excluded from deployment (see web appendix B, Section B.4).

**TABLE 2.** COGNITIVE TRAP VALIDATION RESULTS

| Cognitive Trap | Human | GPT-5.1 | GPT-5.1 (extended thinking) | Gemini 2.5 Pro | Gemini 2.5 Flash | Claude Sonnet 4.5 | Claude Haiku 4.5 | Pooled |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Modified Cafe Wall | 84.8% | 0% | 20% | 0% | 0% | 40% | 30% | 15.0% |
| Modified Muller-Lyer | 90.1% | 0% | 30% | 0% | 0% | 0% | 0% | 5.0% |
| Modified Ebbinghaus | 90.1% | 10% | 60% | 30% | 0% | 60% | 80% | 40.0% |
| The Moving Robot | 77.2% | 0% | 40% | 0% | 0% | 0% | 0% | 6.7% |
| Colliding Oranges | 86.5% | 40% | 80% | 30% | 0% | 30% | 10% | 31.7% |
| Surrounded Planets | 91.8% | 70% | 80% | 20% | 0% | 30% | 20% | 36.7% |
| *Shape Overload* | *46.8%* | *20%* | *70%* | *50%* | *10%* | *50%* | *40%* | *40.0%* |
| **Average** | **86.8%** | **20.0%** | **51.7%** | **13.3%** | **0.0%** | **26.7%** | **23.3%** | **22.5%** |

*NOTE. -- Human sample: 171 Prolific participants who passed all attention checks. Ten independent trials per trap per model (420 total). † = extended thinking variant. Pooled = average across all six models. Average = mean accuracy across the six retained traps (excludes Shape Overload). All six retained traps exceed both retention criteria (human >75%, human-model gap >30pp). Shape Overload (italicized) failed both criteria and was excluded; see web appendix B.4.*

Expanded Model Validation. To assess whether model improvements erode trap effectiveness over time, we expanded testing of the six retained traps to 34 vision-language models spanning March 2024 through February 2026 (2,040 trials total). Researchers applying the framework only need to validate against models available at deployment, but this nearly two-year span provides a longitudinal view of trap durability as architectures improve. All six retained traps continued to satisfy both retention criteria, with human-model gaps ranging from 41.9 to 76.0 percentage points. Full results for all 34 models appear in web appendix C.

Two patterns in the expanded validation provide insight on whether models are improving over time in such a way that cognitive traps will become obsolete (Figure 2). First, model performance is non-monotonic within product lines. GPT-4o-mini (July 2024, 36.7%) substantially outperforms GPT-4.1 (April 2025, 5.0%), released ten months later, and Gemini 2.0 Flash (31.7%) outperforms its direct successor Gemini 2.5 Flash (1.7%) by a factor of nearly 19. Second, models show extreme heterogeneity across traps, with no model passing all six. This heterogeneity persists even within a single constraint category: among the three training data overfitting traps, Claude Opus 4.6 achieves 100% on Muller-Lyer but 0% on Cafe Wall and Ebbinghaus, while GPT-5.2 with extended thinking shows the opposite pattern (100% on Cafe Wall and Ebbinghaus but 0% on Muller-Lyer). These irregular capability profiles mean that a diversified battery provides robust detection even within a constraint category, because models that overcome one implementation typically fail on others.

**FIGURE 2.** COGNITIVE TRAP PASS RATES ACROSS 34 VISION-LANGUAGE MODELS

[Image: Scatter plot showing average cognitive trap pass rate (%) for 34 vision-language models plotted against release date. Dots colored by provider (Anthropic, OpenAI, Google). OLS trend line shows no significant overall improvement. Dashed line marks 86.8% human baseline.]

*NOTE.  --  Average cognitive trap pass rate (%) for 34 vision-language models plotted against release date. Each dot represents one model colored by provider (Anthropic, OpenAI, Google), with frontier models labeled. The OLS trend line shows no significant overall improvement (+0.51 pp/month, p = .282). The dashed line marks the 86.8% average human baseline on the six retained traps. The best-performing model (Gemini 3 Flash with extended thinking, 65.0%) remains 21.8 percentage points below human performance. Full model-level results appear in web appendix C.*

### Step 4: Deploy in Research Context

Having identified constraints, designed implementations, and validated performance, researchers embed cognitive traps within their actual surveys, establish classification thresholds based on research priorities, and apply the classification rule to flag suspected agents. The goal of our main study is to validate this method.

## DETECTING AI AGENTS IN ONLINE RESEARCH: VALIDATION ON PROLIFIC

This study provides a demonstration of the framework’s Step 4 while validating its method. Its primary outcomes are detection rates, false positive rates, and the optimal classification threshold for balancing sensitivity against specificity. While Steps 1-3 provide everything researchers need to develop cognitive traps for their own deployment, we extended beyond typical implementation by deploying 526 autonomous AI agents across four distinct AI agent platforms to directly test whether cognitive traps detect actual agents completing surveys autonomously through browsers. This study was preregistered (https://aspredicted.org/s4nh6y.pdf).

### Method

Participants (Humans). We recruited 1,007 participants from Prolific (52.7% female, Mage = 44.79) who completed a consumer decision-making survey taking approximately 7 minutes in exchange for $1.40 compensation. Vision screening revealed 1.2% reporting uncorrected vision impairments and 1.4% reporting color blindness or color vision deficiency. These participants were included in primary analyses but examined separately in robustness checks.

Participants (Machines). We deployed 526 vision-enabled AI agents individually across Google Project Mariner (n = 134), Perplexity Comet (n = 131), ChatGPT Agent (n = 129), and the Claude Sonnet 4.5 model via Cursor Agent (n = 132). These represent mainstream vision-enabled agents currently being adopted by consumers. Each agent operated through separate browser instances that autonomously navigated to the survey, captured screenshots, processed visual content, generated responses, and submitted without human intervention beyond initial deployment or occasional adjustments (e.g., resolving CAPTCHA on platforms where the agent could not do so autonomously). The agent deployment represents methodological validation: we deployed agents to complete our own research survey designed specifically to test detection methods, analogous to pilot testing using available tools. Detailed deployment methodology, including exact prompts and agent-specific behaviors, appears in web appendix B.

Procedure. The survey was conducted using Qualtrics and included a conceptual replication of the choice deferral effect (Dhar 1997) using laptops. Participants (or agents) were randomly assigned to two conditions: choice set with equally attractive options (high trade-off conflict) versus choice set with a clearly dominant option (low trade-off conflict). Dhar (1997) demonstrates that preference uncertainty, which occurs when options are equally attractive, increases the propensity to defer choice. We expected to replicate this effect in humans but made no predictions for agents. After making their choice, participants completed the PANAS scale (with a straight-lining check), the six retained cognitive traps in randomized order, three traditional attention checks (IMC, obvious answer, memory), and demographics. The survey had Qualtrics’s reCAPTCHA v3 activated.

### Results

Cognitive Trap Detection Performance. Cognitive traps substantially outperformed traditional attention checks in detecting researcher-deployed AI agents. Among the 526 deployed agents where ground truth is certain, we evaluated classification performance across all possible failure thresholds (1+ through 6/6; web appendix A). The three-failure threshold emerged as the optimal balance, detecting 511 agents (97.1% sensitivity) while flagging 41 of 1,007 presumed humans (4.1% false positive rate, assuming conservatively that no AI agents exist in the Prolific sample). When filtering to humans who passed all four traditional attention checks and reported no color blindness or visual impairment, 3.3% of humans were flagged (29/877), demonstrating that cognitive traps discriminate between humans and machines even among attentive, fully able participants. Traditional methods combined detected only 12 agents (2.3% sensitivity). Table 3 presents the full comparison, revealing a 95-percentage-point gap between methods that exploit architectural constraints and those that detect behavioral patterns.

**TABLE 3.** DETECTION METHOD PERFORMANCE AGAINST DEPLOYED AI AGENTS

| Detection Method | Agents Detected | Detection Rate |
| --- | --- | --- |
| **Cognitive Traps (3+ failures)** | **511** | **97.1%** |
| Traditional Methods (Any) | 12 | 2.3% |
| - Instructional Manipulation Check | 1 | 0.2% |
| - Obvious Answer Check | 1 | 0.2% |
| - Memory Check | 4 | 0.8% |
| - Straight-lining Check | 7 | 1.3% |
| CAPTCHA (score < 0.5) | 24 | 4.6% |
| Fast Completion (< 40% median) | 1 | 0.2% |

*NOTE.  --  Cognitive trap threshold: failing 3 or more of 6 visual perception tasks. Traditional Methods (Any) = agents failing at least one traditional check.*

The three-failure threshold was selected by evaluating all possible cut-points against the deployment data. Requiring only two failures achieves near-perfect agent detection (99.4%) but flags 13.3% of humans, a rate likely including many false positives. Requiring four failures reduces false positives to 1.9% but drops sensitivity to 89.2%, missing 57 agents. The sharp decline between 3+ and 4+ occurs because many agents pass exactly three traps while failing three, placing the three-failure threshold at a natural break in the score distribution where sensitivity exceeds 95% and the false positive rate remains below 5%. Researchers with different priorities can adjust this threshold: exploratory studies with large samples may tolerate the 2+ threshold’s higher false positive rate to maximize agent removal, while theory-testing studies with smaller samples might prefer the 4+ threshold’s lower false positive rate despite reduced sensitivity.

Individual Cognitive Traps. Individual cognitive traps showed substantial variation in both agent failure rates and human-agent discrimination (Table 4). The Modified Muller-Lyer and Cafe Wall produced agent failure rates above 94%, consistent with training data overfitting being a deeply embedded architectural constraint. Colliding Oranges and Surrounded Planets produced moderate failure rates (50-56%), suggesting that spatial reasoning and cross-modal binding constraints manifest less uniformly across model architectures. This heterogeneity validates the multi-trap battery approach: agents passing specific traps due to architectural advantages in particular model implementations typically failed others, ensuring high overall sensitivity despite variation in individual trap performance.

**TABLE 4.** INDIVIDUAL COGNITIVE TRAP PERFORMANCE: HUMAN VS. AGENT DISCRIMINATION

| Trap | Agent Failure Rate | Human Pass Rate | Discrimination | chi-squared | p |
| --- | --- | --- | --- | --- | --- |
| Modified Muller-Lyer | 94.1% (495/526) | 92.8% (934/1007) | 86.9 pp | 1113.9 | <.001 |
| Modified Cafe Wall | 94.9% (499/526) | 88.4% (890/1007) | 83.2 pp | 992.8 | <.001 |
| Moving Robot | 99.6% (524/526) | 77.9% (784/1007) | 77.5 pp | 827.0 | <.001 |
| Modified Ebbinghaus | 77.6% (408/526) | 95.6% (963/1007) | 73.2 pp | 886.9 | <.001 |
| Surrounded Planets | 55.5% (292/526) | 96.5% (972/1007) | 52.0 pp | 554.5 | <.001 |
| Colliding Oranges | 50.6% (266/526) | 88.7% (893/1007) | 39.2 pp | 283.4 | <.001 |

*NOTE . -- Discrimination = Human Pass Rate minus Agent Pass Rate. All chi-square tests significant at p < .001.*

CAPTCHA Comparison. To benchmark cognitive traps against the most commonly available automated detection tool, we conducted an ROC-style analysis of reCAPTCHA v3 scores collected during our study. At the standard 0.5 threshold recommended by Google, CAPTCHA detected only 4.6% of agents (24/526), a rate comparable to traditional attention checks and far below cognitive traps. Lowering the threshold improves detection but at substantial cost: the optimal threshold maximizing Youden’s J was 0.90, which detected 93.9% of agents (494/526) but simultaneously flagged 12.4% of humans (125/1,007), a false positive rate three times higher than cognitive traps (12.4% vs. 4.1%) while detecting fewer agents (93.9% vs. 97.1%). The AUC was 0.898, indicating useful but imperfect discrimination. The underperformance reflects massive overlap in the score distributions: 75.5% of agents (397/526) clustered between 0.80-0.89, a range that also contained 8.4% of human participants. Full ROC analysis appears in web appendix D.

Diagnosticity Simulations. Using the deployment data, we simulated the sensitivity-specificity trade-off across all possible trap combinations to address a practical question: how many traps do researchers need? The answer depends on research priorities. For researchers concerned about survey length, as few as two traps (Modified Muller-Lyer and Moving Robot) with a both-must-fail threshold achieve 93.7% agent detection with only 2.6% false positives. Three traps (adding Surrounded Planets) with a two-failure threshold raise detection to 96.8% with 4.0% false positives. The optimal configuration by Youden’s J uses five traps (dropping Colliding Oranges), achieving 96.2% detection with only 2.6% false positives. Table WA-E1 in web appendix E presents the complete simulation results across all configurations.

Choice Deferral Results. Throughout this article, we have emphasized the cognitive trap as a detection method, but our design also enables a substantive research question: do AI agents exhibit choice effects similar to humans? The choice deferral effect (Dhar 1997) replicated cleanly, and the choice deferral study further demonstrates that cognitive traps maintain effectiveness even when participants receive flat compensation with no per-item rewards for trap performance, addressing concerns that detection accuracy depends on differential incentives. We analyzed results across three groups: humans who passed cognitive traps (n = 966), “humans” who failed cognitive traps (n = 41), and AI agents (n = 526). Among passed-trap humans, deferral rates differed substantially by condition: 5.2% deferred in the dominated condition compared to 24.0% in the conflict condition (χ²(1) = 66.83, p < .001), a 4.6-fold increase when facing interattribute tradeoffs versus a clearly dominated option that aligns with theoretical predictions. Among agents, deferral was near zero regardless of condition: 0.0% in dominated and 0.7% in conflict (χ²(1) = 0.46, p = .495). Agents do not experience the subjective uncertainty or discomfort with commitment that leads humans to defer under difficult conditions.

The 41 participants who failed cognitive traps showed an intermediate pattern: 5.3% deferral in dominated and 13.6% in conflict (χ²(1) = 0.14, p = .709), although the non-significant condition effect likely reflects low statistical power (n = 41). Their decision times were informative: in the conflict condition, failed-trap “humans” averaged 97.0 seconds (SD = 147.6), compared to 64.6 seconds for passed-trap humans (t = 1.26, p = .210) and 36.3 seconds for agents (t = 6.35, p < .001). These participants took substantially longer than agents while remaining statistically indistinguishable from passed-trap humans in decision time, CAPTCHA scores (0.971 vs. 0.972), and traditional attention check pass rates (97.6% vs. 99.6% on IMC). Their score distribution is also informative: 22 of 41 flagged participants (53.7%) scored exactly 3 out of 6, meaning they just barely crossed the failure threshold, while only 6 (14.6%) scored 0 or 1. Taken together, this pattern suggests that the 41 flagged individuals are genuine humans with lower visual-cognitive performance, providing evidence that the 4.1% flagging rate represents mostly false positives under current contamination conditions.

When examining choice preferences among participants who committed to a decision (excluding deferrals), agents and humans showed similar aggregate patterns in the conflict condition: humans selected Laptop A in 58.1% of committed choices versus agents at 60.5% (χ²(1) = 0.28, p = .597). This aggregate similarity, however, masks substantial platform-specific heterogeneity (χ²(3) = 75.69, p < .001): ChatGPT selected the first-presented option in 95.7% of trials while Claude selected the second option in 68.8%, indicating that different model architectures employ systematically different heuristics for resolving equipoise between comparably valued alternatives. Researchers should exercise caution when generalizing findings about “AI decision-making” from single-platform studies, as the behavioral signatures of autonomous agents vary substantially across platforms even while their uniform avoidance of deferral remains consistent. Complete choice deferral tables including the three-group breakdown and platform-specific results appear in web appendix F.

## REPLICATION ON AMAZON MTURK AND CLOUDRESEARCH CONNECT

The Prolific study validated the cognitive trap method, establishing detection rates, false positive rates, and optimal threshold configurations as its primary outcomes (because the Prolific study's purpose was to validate the method, a classification threshold could not be pre-registered before validation was complete). With that validation complete, a natural next step is to apply the method prospectively on different platforms with pre-registered classification criteria. We conducted two pre-registered replications: one on Amazon Mechanical Turk (MTurk; preregistration: https://aspredicted.org/sz87tb.pdf) and one on CloudResearch Connect (preregistration: https://aspredicted.org/ib99fx.pdf). Both pre-registrations specified the three-failure threshold (failing 3 or more of 6 traps) and a two-proportion z-test comparing flagging rates against the Prolific baseline, with exact decision rules justified by the Prolific validation results and the diagnosticity simulations. Although CloudResearch Connect evolved from the former TurkPrime service, the two platforms now maintain fully independent participant pools. Including both platforms provides a cleaner test of whether cognitive trap flagging rates reflect genuine platform differences in data quality rather than artifacts of the traps themselves.

### MTurk Results

We pre-registered a target of 500 respondents. Although 500 workers accepted the HIT on MTurk, only 263 completed the Qualtrics survey. Many of the remaining workers submitted completion codes without actually opening the survey link, and others submitted random or shared codes, a pattern consistent with documented code-sharing practices on MTurk forums where workers circulate completion codes to collect payment without performing the task. Cognitive traps flagged 76.0% of the MTurk sample (200/263) using the pre-registered threshold, compared to 4.1% on Prolific (z = 26.51, p < .001). Only 1.9% of MTurk respondents scored 6/6 on the traps, versus 59.9% on Prolific.

The behavioral profile of the MTurk sample was consistent with widespread contamination: the instructional manipulation check showed an 84.4% pass rate (compared to 99.5% on Prolific), the obvious attention check showed only 55.9% (compared to 99.0% on Prolific and 99.8% among our deployed agents in the main study), reCAPTCHA scores averaged 0.635 (compared to 0.972 on Prolific), and choice deferral was near zero in both conditions (1.6% in conflict, 0.0% in dominated), mirroring the agent deferral pattern from the main study. The MTurk behavioral profile, however, does not match a purely agent-driven sample. Our deployed agents passed traditional attention checks at near-perfect rates (IMC 99.8%, obvious 99.8%), while MTurk respondents performed substantially worse on these same checks (84.4% and 55.9%), failing at tasks that both attentive humans and sophisticated LMM agents handle easily. At the same time, 44.5% of MTurk respondents flagged by cognitive traps passed all traditional attention checks, a profile consistent with vision-enabled agents that ace text-based screening while failing visual-cognitive tasks. These patterns suggest a heterogeneous mix of data quality threats on MTurk: some respondents whose profiles resemble sophisticated AI agents (passing traditional checks but failing cognitive traps), alongside others exhibiting the careless and invalid responding patterns documented by Kay (2025), who found that 96% of semantic antonym pairs were positively correlated on MTurk even after screening with standard attention checks. The mean cognitive trap score on MTurk (2.65) falls between our deployed agents (1.28) and Prolific humans (5.40), consistent with a platform where multiple types of problematic respondents coexist with a diminishing pool of genuine participants.

### CloudResearch Connect Results

Cognitive traps flagged 1.8% of the CloudResearch Connect sample (9/506), significantly lower than Prolific (z = -2.35, p = .019). The 76.5% of respondents who scored 6/6, the 100% obvious attention check pass rate, and the reCAPTCHA mean of 0.984 indicate an attentive, high-quality sample. The choice deferral effect was replicated: 26.6% deferred in the conflict condition versus 6.7% in the dominated condition (χ²(1) = 34.74, p < .001), a 4.0-fold increase closely matching Prolific’s 4.6-fold increase. After removing the 9 flagged respondents, deferral rates were virtually unchanged (26.8% vs. 6.5%, p < .001), confirming that the flagged individuals had negligible impact on substantive findings.

### Cross-Platform Comparison

The 42-fold gap in flagging rates between MTurk (76.0%) and CloudResearch Connect (1.8%) demonstrates that platform choice is a first-order determinant of data quality in online behavioral research, consistent with Kay (2025)’s conclusion that “the average dataset collected on MTurk simply cannot be trusted.” CloudResearch Connect produces flagging rates significantly lower than Prolific, while MTurk produces rates that approach but do not match our deliberately deployed agents (76.0% vs. 97.1%), consistent with cognitive traps discriminating between contaminated and clean platforms rather than producing false positives. The gap between MTurk and our deployed agents is itself informative: a purely agent-driven sample would produce near-universal cognitive trap failure with near-perfect traditional check performance, whereas the MTurk sample combines high trap failure with poor traditional check performance, suggesting contamination from multiple source types rather than a single class of sophisticated AI agents. The convergence of multiple independent indicators (trap performance, deferral patterns, attention checks, CAPTCHA scores) across four datasets strengthens this interpretation. Detailed results for both platforms, including individual trap rates, score distributions, behavioral profiles, and method independence analyses, appear in web appendix G.

## GENERAL DISCUSSION

The Cognitive Trap Framework exploits architectural constraints in how vision-language models process integrated visual information, achieving 97.1% agent detection compared to 2.3% for traditional methods. These results demonstrate effectiveness under current conditions, but several questions bear on the framework’s practical deployment: its longevity as models improve, the current economics of AI survey fraud, implementation guidance, and directions for future development.

### The Arms Race

Social science often lags behind practice, studying phenomena after they have already reshaped the world. Here, there is an opportunity to document and understand change as it unfolds, because the threat to survey-based research is still nascent enough that preventive measures can be established before contamination becomes widespread. The cycle of developing traps, observing improvements that defeat them, and generating new traps from newly documented constraints will itself track the co-evolution of human ingenuity and machine capability. Researchers must be synchronized with the phenomenon, producing methods that are dynamic and adaptive even if they are not definitive.

Publishing detection methods does create strategic dynamics, because adversaries who know about cognitive traps could attempt to train models to defeat them. There are three factors that favor the dissemination of cognitive traps as an AI agent detection method. First, passing cognitive traps requires solving fundamental architectural limitations in how models process integrated visual information, which cannot be accomplished through prompt engineering or simple fine-tuning. Second, the framework enables continuous development of new traps from the same ongoing AI evaluation ecosystem, meaning defense can evolve as quickly as offense. Third, undetected contamination accumulating in published research poses a greater threat to scientific validity than the risk of disclosing detection methods, because studies currently analyze samples containing unknown agent proportions where effect sizes reflect mixtures of human psychology and model artifacts.

One important consideration is that any method that exploits current AI limitations faces the question of longevity. Across our 34 models spanning March 2024 through February 2026, an OLS regression of model-level accuracy on release date yields a slope of +0.51 percentage points per month (p = .282), indicating no statistically significant overall improvement (Figure 2). The best-performing model, Gemini 3 Flash with extended thinking, achieves 65% average accuracy, well below the 87% human baseline. Per-trap analysis reveals heterogeneous evolution consistent with the framework’s design logic: two traps show significant accuracy declines over time (Modified Cafe Wall, β = −3.14, p = .003; Moving Robot, β = −1.51, p = .001), two show significant improvement (Colliding Oranges, β = +2.92, p = .006; Surrounded Planets, β = +2.71, p = .022), and two remain stable. This pattern of uneven, trap-specific evolution supports maintaining a diversified battery rather than relying on any single detection item.

Furthermore, computational expenditure does not predict accuracy: neither cost per trial nor inference time correlates significantly with trap performance across models (web appendix H). In addition, the generational trajectory is non-monotonic. The average cognitive trap accuracy drops from 30.4% in early models to 15.7% in mid-generation models before recovering to 31.8% in the latest cohort. One possible explanation is that each new architecture reconfigures which constraints it resolves and which it introduces (web appendix H). Yet, cognitive traps may have a shelf life, and researchers who adopt them should expect to periodically update their detection batteries, just as antivirus software requires regular signature updates as threats evolve.

This article’s core position is that the framework’s durability rests on something more fundamental than any individual trap: the systematic connection to ongoing AI evaluation research. As long as computer science researchers benchmark models against human capabilities, they document what models can and cannot do. When specific constraints are resolved through architectural advances, new evaluations document new limitations. The four-step methodology applies to these newly documented constraints without methodological innovation, because the process of translating a benchmark finding into a survey question follows the same logic regardless of which particular constraint is being exploited.

### Current Prevalence and the Economics of AI Survey Fraud

This research suggests that the actual AI contamination rate on Prolific may currently be near zero, likely because Prolific's identity verification creates barriers to operating fraudulent accounts at scale. The economics of AI survey fraud, however, already favor the attacker: completing one survey through a vision-enabled agent costs approximately $0.05-0.10 in API fees while earning $1.40 in participant compensation, yielding a 14-to-28-fold return per completion. As model costs continue declining (API prices have fallen roughly 10-fold over the past two years) and platform verification is circumvented, detection tools will become essential before contamination becomes widespread.

### Practical Recommendations

Cognitive trap performance shows separation from traditional attention check performance (χ²(1) = 9.27, p = .002): 73.2% of participants failing cognitive traps passed all traditional checks, and 90.1% of participants failing traditional checks passed cognitive traps. Researchers concerned about both contamination sources should implement both method classes, using traditional checks to identify inattentive humans and cognitive traps to identify agents.

The diagnosticity simulations show that as few as two traps achieve over 93% detection with under 3% false positives, adding approximately one minute of survey time. Researchers can select a trap configuration and classification threshold from the complete simulation results (Table WA-E1 in web appendix E) based on their sensitivity-specificity priorities. Whichever configuration researchers choose, the threshold should be pre-registered before data collection.

Our Prolific study did not pre-register a threshold because that study validated the method itself. With validation complete, the MTurk and CloudResearch Connect replications demonstrated the prospective workflow: we pre-registered the three-failure threshold established by the Prolific validation before collecting any data. Researchers should establish validated human baselines while contamination remains measurable, positioning their research programs ahead of what will likely be an accelerating threat.

Decision times may provide additional detection signals that complement cognitive trap performance. Agent decision times on the choice page showed no condition sensitivity (M = 36.3 seconds in both dominated and conflict conditions; t = -0.02, p = .984), while humans took longer under conflict (M = 64.6 seconds vs. 53.3 seconds). This behavioral signature (identical processing time regardless of decision difficulty) is consistent with model inference that does not experience subjective conflict. Combining cognitive trap scores with response time patterns, along with metadata-based detection and behavioral biometrics where platform infrastructure permits, could further strengthen detection (Acien et al. 2022; Iliou et al. 2021; Panizza, Kyrychenko, and Roozenbeek 2026).

### Reverse Traps

Our cognitive traps exploit tasks where AI fails while humans succeed, but the reverse direction also deserves attention. Panizza et al. (2026) propose incorporating tasks that are easy for AI but difficult for humans, such as rapid estimation problems or logical puzzles like the Monty Hall problem, and then evaluating whether respondents fail in characteristically human ways. Their argument is that this inverts the adversarial dynamic: instead of improving AI to pass human-easy tasks, attackers would need to deliberately constrain AI performance to mimic human limitations, which proves difficult even when agents are explicitly instructed to conceal their capabilities. A related possibility is pairing standard visual illusions (where humans tend to err) with their modified counterparts (where AI fails due to training data overfitting) within the same survey, creating diagnostic error signatures across item pairs. Several open questions remain before either approach can be deployed in practice. Human susceptibility to illusions and estimation errors varies across individuals, meaning that reverse items would need careful calibration to avoid misclassifying attentive humans. Paired designs also double the number of stimuli required. Future research should empirically validate whether these complementary detection axes provide sufficient additional discrimination to justify their costs.

### Demographic Considerations

Cognitive trap failure rates show minimal demographic variation. Age, gender, and color blindness produced no significant associations with trap performance, alleviating concerns that cognitive traps would systematically exclude specific demographic groups. The only strong association was uncorrected vision impairment: 25.0% of participants reporting uncorrected impairments (n = 12) failed the threshold, compared to 3.8% for others, although 75% of vision-impaired participants still passed. We recommend that researchers include vision screening questions and adjust thresholds for participants reporting impairments. Full demographic analyses appear in web appendix I.

### Limitations

Our validation faces several limitations that future research should address. First, we recruited human participants through Prolific’s standard verification without additional biometric confirmation, potentially introducing limited contamination into our ground truth sample. If agents exist in our “human” sample, this would strengthen our evidence, because the true detection performance would exceed what we report since agents would inflate our false positive estimate. Second, our cognitive traps target visual and cognitive processing, which may disadvantage participants with undiagnosed visual processing differences not captured by demographic screening. While our validation showed minimal demographic differences across age, gender, and color blindness, with only vision impairment showing a strong association, complex visual-cognitive tasks may affect populations differently. We recommend demographic-stratified validation before deploying traps in specific populations.

Third, platform heterogeneity in agent performance means that no single trap achieves uniformly high detection across all implementations: ChatGPT Agent and Perplexity Comet each produced small numbers of agents passing the three-failure threshold (8/129 and 7/131 respectively), while Google Mariner and Claude showed perfect detection. This variation underscores the importance of deploying multiple traps spanning different constraint categories. Fourth, we benchmark cognitive traps against CAPTCHA (the most widely available automated detection tool) but do not directly compare against metadata-based detection (IP analysis, device fingerprinting), behavioral biometrics (mouse trajectories, keystroke dynamics), or text-based AI classifiers. Cognitive traps are best viewed as complementary to these approaches. Fifth, the MTurk sample (N = 263) was substantially smaller than Prolific (N = 1,007) because many of the 500 workers who accepted the HIT submitted completion codes without actually completing the survey, and the 76.0% flagging rate precludes meaningful analysis of the clean subsample (n = 63). The CloudResearch Connect replication (N = 506) provides a cleaner platform comparison, but future research should assess cognitive trap performance across additional recruitment platforms and geographic populations.

## CONCLUSION

The entire behavioral research literature depends on measuring genuine human behavior, and when autonomous agents can complete studies while passing all conventional quality checks, the validity of the scientific ecosystem is at stake. The Cognitive Trap Framework provides a methodology for continuous adaptation: as models improve and specific traps lose effectiveness, researchers apply the same four-step process to newly documented constraints from the ongoing AI evaluation ecosystem. The tools for autonomous survey completion are commercially available today and the economic incentives for fraud are present, but the architectural constraints that cognitive traps exploit are equally present, giving researchers a foundation for detection that evolves alongside the threat. As detection methods improve and are defeated, and new methods emerge in response, the resulting cycle will itself document the co-evolution of human ingenuity and machine capability. This framework provides a foundation for that ongoing process, and we hope it will also inspire the development of new methods.

## DATA COLLECTION STATEMENT

The human validation study (202 Prolific participants completing all seven cognitive traps) was conducted in November 2025. The initial model validation, in which all seven cognitive traps were tested against six frontier vision-language models through standalone chat interface sessions (420 trials), was also conducted in November 2025. Data for the Prolific main study (1,007 human participants) were collected in November 2025 using Qualtrics. The 526 AI agent deployments (Google Project Mariner, Perplexity Comet, ChatGPT Agent, and Claude Sonnet 4.5 via Cursor Agent) were conducted on the author’s own Qualtrics survey instance in November 2025; no agents were deployed on live recruitment platforms. The expanded model validation, in which the six retained cognitive traps were tested against 34 vision-language models via programmatic API calls (2,040 trials), was conducted in February 2026. The MTurk replication (263 participants) and the CloudResearch Connect replication (506 participants) were both conducted in February 2026. All data were collected and analyzed by the author. Raw data, analysis code, agent deployment scripts, the Qualtrics survey file (.qsf), data dictionaries, and pre-registration documents are available on the Open Science Framework (https://osf.io/f2jhx/).

## REFERENCES

Acien, Alejandro, Aythami Morales, Julian Fierrez, and Ruben Vera-Rodriguez (2022), “BeCAPTCHA-Mouse: Synthetic Mouse Trajectories and Improved Bot Detection,” Pattern Recognition, 127, 108643.

Bonnamy, James, Bethany Carr, Michelle D. Lazarus, and Clifford Connell (2025), “Survey Sabotage: Insights into Reducing the Risk of Fraudulent Responses in Online Surveys,” Anatomical Sciences Education, 18(8), 767–73.

Campbell, Declan, Sunayana Rane, Tyler Giallanza, Nicolò De Sabbata, Kia Ghods, Amogh Joshi, Alexander Ku, Steven M. Frankland, Thomas L. Griffiths, Jonathan D. Cohen, and Taylor Webb (2024), “Understanding the Limits of Vision Language Models Through the Lens of the Binding Problem,” in Proceedings of the 38th International Conference on Neural Information Processing Systems, Red Hook, NY, USA.

Chmielewski, Michael and Sarah C. Kucker (2020), “An MTurk Crisis? Shifts in Data Quality and the Impact on Study Results,” Social Psychological and Personality Science, 11(4), 464–73.

Dhar, Ravi (1997), “Consumer Preference for a No-Choice Option,” Journal of Consumer Research, 24(2), 215–31.

Goodrich, Brittney, Marieke Fenton, Jerrod Penn, John Bovay, and Travis Mountain (2023), “Battling Bots: Experiences and Strategies to Mitigate Fraudulent Responses in Online Surveys,” Applied Economic Perspectives and Policy, 45(2), 762–84.

Gordon, Andrew (2026), Authenticity Checks: How We Tested the Most Accurate Method for Identifying Agentic AI, Prolific.

Guo, Xuyang, Zekai Huang, Zhenmei Shi, Zhao Song, and Jiahao Zhang (2025), “Your Vision-Language Model Can’t Even Count to 20: Exposing the Failures of VLMs in Compositional Counting,” https://arxiv.org/abs/2510.04401.

Hara, Kotaro, Abigail Adams, Kristy Milland, Saiph Savage, Chris Callison-Burch, and Jeffrey P. Bigham (2018), “A Data-Driven Analysis of Workers’ Earnings on Amazon Mechanical Turk,” in Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems, Montreal, QC, Canada: ACM, 1–14.

Iliou, Christos, Theodoros Kostoulas, Theodora Tsikrika, Vasilis Katos, Stefanos Vrochidis, and Ioannis Kompatsiaris (2021), “Detection of Advanced Web Bots by Combining Web Logs with Mouse Behavioural Biometrics,” Digital Threats: Research and Practice, 2(3), 1–26.

Kamath, Amita, Jack Hessel, and Kai-Wei Chang (2023), “What’s ‘up’ with Vision-Language Models? Investigating Their Struggle with Spatial Reasoning,” http://arxiv.org/abs/2310.19785.

Kay, Cameron S. (2025), “Why You Shouldn’t Trust Data Collected on MTurk,” Behavior Research Methods, 57, 340.

Kennedy, Ryan, Scott Clifford, Tyler Burleigh, Philip D. Waggoner, Ryan Jewell, and Nicholas J. G. Winter (2020), “The Shape of and Solutions to the MTurk Quality Crisis,” Political Science Research and Methods, 8(4), 614–29.

Lake, Brenden M., Tomer D. Ullman, Joshua B. Tenenbaum, and Samuel J. Gershman (2017), “Building Machines That Learn and Think Like People,” Behavioral and Brain Sciences, 40, e253.

Malhotra, N. (2008), “Completion Time and Response Order Effects in Web Surveys,” Public Opinion Quarterly, 72(5), 914–34.

Moss, Aaron J., Cheskie Rosenzweig, Jonathan Robinson, Shalom N. Jaffe, and Leib Litman (2023), “Is It Ethical to Use Mechanical Turk for Behavioral Research? Relevant Data from a Representative Survey of MTurk Participants and Wages,” Behavior Research Methods, 55(8), 4048–67.

Oppenheimer, Daniel M., Tom Meyvis, and Nicolas Davidenko (2009), “Instructional Manipulation Checks: Detecting Satisficing to Increase Statistical Power,” Journal of Experimental Social Psychology, 45(4), 867–72.

Ouyang, Long, Jeff Wu, Xu Jiang, Diogo Almeida, Carroll L. Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, et al. (2022), “Training Language Models to Follow Instructions with Human Feedback,” http://arxiv.org/abs/2203.02155.

Panizza, Folco, Yara Kyrychenko, and Jon Roozenbeek (2026), “Survey-Taking AI Tools Surpass Human Abilities. Here’s What We Can Do about It,” Nature, 650, 293–95.

Phillips, Sara (2026), “AI Chatbots Are Infiltrating Social-Science Surveys,” Nature, 650, 17.

Qi, Jianing, Jiawei Liu, Hao Tang, and Zhigang Zhu (2025), “Beyond Semantics: Rediscovering Spatial Awareness in Vision-Language Models,” http://arxiv.org/abs/2503.17349.

Rilla, Raluca, Tobias Werner, Hiromu Yakura, Iyad Rahwan, and Anne-Marie Nussberger (2025), “Recognising, Anticipating, and Mitigating LLM Pollution of Online Behavioural Research,” http://arxiv.org/abs/2508.01390.

Schulze Buschoff, Luca M., Elif Akata, Matthias Bethge, and Eric Schulz (2025), “Visual Cognition in Multimodal Large Language Models,” Nature Machine Intelligence, 7(1), 96–106.

Searles, Andrew, Yoshimichi Nakatsuka, Ercan Ozturk, Andrew Paverd, Gene Tsudik, and Ai Enkoji (2023), “An Empirical Study & Evaluation of Modern CAPTCHAs,” http://arxiv.org/abs/2307.12108.

Shinozaki, Taiga, Tomoki Doi, Amane Watahiki, Satoshi Nishida, and Hitomi Yanaka (2025), “Do Large Vision-Language Models Distinguish Between the Actual and Apparent Features of Illusions?” in Proceedings of the 47th Annual Meeting of the Cognitive Science Society

Stogiannidis, Ilias, Steven McDonagh, and Sotirios A. Tsaftaris (2025), “Mind the Gap: Benchmarking Spatial Reasoning in Vision-Language Models,” http://arxiv.org/abs/2503.19707.

Ullman, Tomer (2024), “The Illusion-Illusion: Vision Language Models See Illusions Where There Are None,” http://arxiv.org/abs/2412.18613.

Wen, Ximing, Mallika Mainali, and Anik Sen (2025), “How Well Can Vision-Language Models Understand Humans’ Intention? An Open-Ended Theory of Mind Question Evaluation Benchmark,” https://arxiv.org/abs/2503.22093.

Westwood, Sean J. (2025), “The Potential Existential Threat of Large Language Models to Online Survey Research,” Proceedings of the National Academy of Sciences, 122(47), e2518075122.

Zhou, Shijie, Alexander Vilesov, Xuehai He, Ziyu Wan, Shuwang Zhang, Aditya Nagachandra, Di Chang, Dongdong Chen, Xin Eric Wang, and Achuta Kadambi (2025), “VLM4D: Towards Spatiotemporal Awareness in Vision Language Models,” https://arxiv.org/abs/2508.02095.


---

# WEB APPENDIX

Brief Commentary: A Framework for Detecting AI Agents in Online Research

Felipe M. Affonso

**TABLE OF CONTENTS**

- Web Appendix A: Complete Detection Performance
- Web Appendix B: Framework Methodology and Agent Deployment
- Web Appendix C: Full 34-Model Validation Results
- Web Appendix D: CAPTCHA ROC Analysis
- Web Appendix E: Diagnosticity Simulations
- Web Appendix F: Choice Deferral Extended Results
- Web Appendix G: Platform Replication Studies
- Web Appendix H: Computational Cost and Efficiency Analysis
- Web Appendix I: Demographic and Robustness Analyses


## WEB APPENDIX A: COMPLETE DETECTION PERFORMANCE


### A.1 Threshold Sensitivity Analysis

The choice of failure threshold involves a trade-off between sensitivity (detecting true agents) and specificity (avoiding false positives among humans). Table WA-A1 presents detection performance across all possible thresholds.


**TABLE WA-A1: DETECTION PERFORMANCE ACROSS ALL THRESHOLDS**


| Threshold | Agent Detection | Human Flagging | Interpretation |
| --- | --- | --- | --- |
| 1+ failures | 100.0% (526/526) | 40.1% (404/1007) | Perfect sensitivity but flags too many humans |
| 2+ failures | 99.4% (523/526) | 13.3% (134/1007) | Near-perfect detection; likely many false positives |
| 3+ failures | 97.1% (511/526) | 4.1% (41/1007) | Balanced threshold (selected) |
| 4+ failures | 89.2% (469/526) | 1.9% (19/1007) | Conservative; misses 57 agents |
| 5+ failures | 60.5% (318/526) | 0.6% (6/1007) | Very conservative; misses 208 agents |
| All 6 failures | 26.0% (137/526) | 0.2% (2/1007) | Extreme; detects only complete failures |

The sharp drop between 3+ and 4+ thresholds (97.1% to 89.2%) indicates many agents pass exactly three traps. The 3+ threshold maintains greater than 95% sensitivity while flagging only 4.1% of humans. We selected this threshold because it achieves a positive predictive value of 92.6% (meaning flagged cases are likely genuine agents) while maintaining high sensitivity.

Researchers with different priorities might adjust the threshold. Exploratory studies with large samples can tolerate the 2+ threshold’s higher false positive rate (13.3%) to maximize agent removal. Theory-testing studies with smaller samples might prefer the 4+ threshold’s lower false positive rate (1.9%) despite reduced sensitivity (89.2%).


### A.2 Traditional Method Performance


**Table WA-A2 presents complete performance data for all traditional detection methods tested against the 526 known agents, confirming that methods designed for human inattention fail against vision-enabled agents.**


**TABLE WA-A2: COMPLETE DETECTION METHOD PERFORMANCE**


| Method | Detection Rate | Why It Failed |
| --- | --- | --- |
| Cognitive Traps (3+) | 97.1% (511/526) | Exploits architectural constraints |
| Instructional Manipulation Check | 0.2% (1/526) | Agents read all text carefully |
| Obvious Answer Check | 0.2% (1/526) | Trivial comprehension for LMMs |
| Memory Check | 0.8% (4/526) | Re-process full context; no working memory |
| Straight-lining (PANAS) | 1.3% (7/526) | Generate contextually appropriate responses |
| Any Traditional Check | 2.3% (12/526) | Combined across all four checks |
| CAPTCHA (score < 0.5) | 4.6% (24/526) | Execute through real browsers with genuine interaction signals |
| Fast Completion (< 40% median) | 0.2% (1/526) | Model inference is genuinely slow |

All 12 agents flagged by traditional checks also failed cognitive traps, meaning traditional methods added zero incremental detection beyond what cognitive traps already captured. The 42-fold performance gap (97.1% vs. 2.3%) demonstrates the fundamental difference between exploiting architectural constraints versus detecting behavioral patterns.


**FIGURE WA-A1. DETECTION RATES ACROSS ALL METHODS TESTED AGAINST 526 DEPLOYED AI AGENTS**


[Image: media/image1.png]


*NOTE. -- Cognitive traps (green, 97.1%) and CAPTCHA at the optimal 0.90 threshold (93.9%) are the only methods exceeding 5% detection. All traditional attention checks (IMC, obvious answer, memory, straight-lining) and timing analysis detect fewer than 2% of agents. CAPTCHA at the standard 0.5 threshold detects only 4.6%.*

Importantly, although the ROC curve suggests that CAPTCHA at its optimal threshold (0.90, identified by Youden's J) achieves a detection rate comparable to cognitive traps, this comparison omits a critical difference in specificity: at that threshold, CAPTCHA produces a 12.4% false positive rate, three times the 4.1% rate of cognitive traps. The apparent parity in sensitivity thus comes at a substantially higher cost to legitimate respondents.


### A.3 Why Traditional Methods Fail: Architectural Analysis

Traditional methods were designed for two threat models that do not match vision-enabled agent characteristics. The first targets simple automated bots that access HTML directly without rendering visual content and can be defeated by invisible elements, hidden form fields, and CSS-based traps. Vision-enabled agents can perceive rendered visual content through screenshots, and they do not need to access underlying code where hidden elements reside.

The second targets inattentive humans who skip instructions, rush through questions, or fail to recall earlier content. Vision-enabled agents process complete text carefully as their core function, maintaining consistent attention through model inference. They read every word, follow embedded instructions precisely, and generate contextually appropriate answers. Table WA-A3 contrasts human cognitive processes that traditional checks exploit against agent analogs that render those checks ineffective.


**TABLE WA-A3: ARCHITECTURAL DIFFERENCES ENABLING EVASION**


| Human Process | Traditional Check Exploit |
| --- | --- |
| Agent Analog | Why Check Fails |
| Attention allocation | Detect when attention lapses |
| No attention; all text processed uniformly | Models don’t “attend” selectively |
| Working memory | Test recall of earlier content |
| No working memory; each inference processes full context | Models re-process the full context each time |
| Effort management | Detect effort-minimizing behaviors |
| No subjective effort; generation cost uniform | Models don’t experience effort |
| Motivation | Assume low motivation produces carelessness |
| No motivational states; response follows training | Models don’t have motivation |
| Reading strategy | Assume humans skim or skip |
| Complete text processing as architectural requirement | Models must process full input |


#### Why Each Method Fails in Detail

Instructional manipulation checks embed hidden instructions in lengthy text to catch humans who skim without reading carefully (e.g., “To show you are paying attention, please select ‘Other’ and type ‘banana’”). Vision-language models process complete text before generating responses as their core function. Following embedded instructions represents trivial comprehension for language models, explaining the 99.8% agent pass rate.

Obvious answer checks ask questions with unambiguous correct responses (e.g., “How frequently do you have a fatal heart attack?” with “Never” as the correct answer). Language models trained on vast text corpora possess factual knowledge making these questions trivial. The 99.8% agent pass rate reflects that comprehending simple factual questions poses no challenge for systems designed specifically for language understanding.

Memory checks ask participants to recall earlier survey content, designed to catch distracted humans who fail to encode information. Agents treat recall questions as logical inference tasks, applying comprehension to the full context available in their processing window. The 99.2% pass rate reflects that agents encounter no difficulty with comprehension-based reasoning about stated content.

Straight-lining detection identifies participants who select identical responses to all items in a scale, designed to catch effort-minimizing humans. Agents generate contextually appropriate responses through natural language understanding, producing varied responses based on item content. The 98.7% pass rate reflects normal response variance without the uniform responding characteristic of disengaged participants.

CAPTCHA systems assign risk scores based on behavioral patterns accumulated across Google services. Agents operated through legitimate browsers (both local and on OpenAI and Google platforms), producing normal reCAPTCHA v3 scores. When encountering explicit challenges, agents could request brief human assistance then resume autonomous operation. The 95.4% pass rate using the standard 0.5 threshold reflects accumulated behavioral signals from legitimate browsing histories.

Timing analysis flags suspiciously fast completion. Vision-language model processing requires substantial time for screenshot capture (1-2s), API transmission (1-2s), model inference (2-10s), response parsing (1-2s), and form entry (1-2s). This produces realistic timing. Agents showed a median completion time of 597.5 seconds (10.0 minutes) compared to 371 seconds (6.2 minutes) for humans. Only 0.2% of agents were flagged for fast completion.


### A.4 Individual Cognitive Trap Performance


**Table WA-A4 provides detailed performance data for each trap showing how each constraint exploits different architectural limitations.**


**TABLE WA-A4: INDIVIDUAL COGNITIVE TRAP PERFORMANCE (MAIN STUDY)**


| Trap | Agent Failure | Human Pass | Discrimination | Constraint Exploited |
| --- | --- | --- | --- | --- |
| Muller-Lyer | 94.1% (495/526) | 92.8% (934/1007) | 86.9 pp | Training data overfitting on canonical illusions |
| Cafe Wall | 94.9% (499/526) | 88.4% (890/1007) | 83.2 pp | Training data overfitting on canonical illusions |
| The Moving Robot | 99.6% (524/526) | 77.9% (784/1007) | 77.5 pp | Spatiotemporal reasoning (trajectory extrapolation) |
| Ebbinghaus | 77.6% (408/526) | 95.6% (963/1007) | 73.2 pp | Training data overfitting on canonical illusions |
| Surrounded Planets | 55.5% (292/526) | 96.5% (972/1007) | 52.0 pp | Cross-modal feature binding with occlusion |
| Colliding Oranges | 50.6% (266/526) | 88.7% (893/1007) | 39.2 pp | Spatial reasoning (geometric path computation) |


*NOTE. All differences significant at p < .001. Discrimination = Human Pass Rate minus (100% - Agent Failure Rate).*


**FIGURE WA-A2. HUMAN PASS RATES VERSUS AGENT PASS RATES FOR EACH COGNITIVE TRAP**


[Image: media/image2.png]


*NOTE. -- Traps ordered by discrimination (human-agent gap). The Moving Robot shows the highest agent failure (99.6%) with 77.5 pp discrimination, while Colliding Oranges shows the lowest discrimination (39.2 pp) because some agent platforms partially resolve its spatial reasoning constraint.*

The illusion-based traps (Muller-Lyer, Cafe Wall, Ebbinghaus) showed highest agent failure rates (77.6-94.9%) because these canonical patterns appear extensively in training data from psychology textbooks and vision research. Models learn these patterns so thoroughly during pre-training that they report the illusion even when visual modifications remove it. The Moving Robot showed near-perfect agent failure (99.6%) because spatiotemporal reasoning requires constructing dynamic mental models of motion trajectories, a capability not achieved by feedforward architectures processing static images independently. The spatial reasoning traps (Surrounded Planets, Colliding Oranges) showed more moderate but substantial discrimination (39.2-52.0pp), with some platforms demonstrating better performance on these tasks, reflecting recent architectural improvements in spatial processing.


### A.5 Platform-Specific Performance


**Table WA-A5 shows detection rates for each agent platform using the 3+ threshold.**


**TABLE WA-A5: DETECTION RATES BY PLATFORM**


| Platform | N | Detected (3+) | Detection Rate | 95% CI | Google Project Mariner |
| --- | --- | --- | --- | --- | --- |
| 134 | 134 | 100.0% | [97.3, 100.0] | Claude Sonnet 4.5 | 132 |
| 132 | 100.0% | [97.2, 100.0] | Perplexity Comet | 131 | 124 |
| 94.7% | [89.3, 97.9] | ChatGPT Agent | 129 | 121 | 93.8% |
| [88.1, 97.3] | All Platforms | 526 | 511 | 97.1% | [95.4, 98.4] |


*NOTE. Chi-square test: χ²(3) = 16.0, p = .001.*

Mariner and Claude showed perfect detection (100%), while Perplexity and ChatGPT allowed small numbers of agents to pass (7 and 8 respectively). This heterogeneity validates the multi-trap battery approach: agents passing specific traps due to platform-specific architectural advantages in particular implementations typically failed others.


**FIGURE WA-A3. COGNITIVE TRAP SCORE DISTRIBUTIONS ACROSS FOUR AGENT PLATFORMS**


[Image: media/image3.png]


*NOTE. -- Each bar shows the percentage of agents from that platform achieving a given score (0-6 correct). The dashed line marks the 3-failure threshold (score of 3+). Mariner and Claude cluster near zero, while ChatGPT and Perplexity show higher but still predominantly sub-threshold scores. No agent from any platform scored 6/6.*


### A.6 Individual Trap Performance by Platform


**Table WA-A6 presents individual trap failure rates across platforms, revealing which constraints are robust versus variable.**


**TABLE WA-A6: INDIVIDUAL TRAP FAILURE RATES BY PLATFORM**


| Trap | Mariner | Perplexity | ChatGPT | Claude | Chi-sq | p | Robust Constraints: |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  | Moving Robot | 99.3% | 99.2% | 100.0% |
| 100.0% | 2.0 | .577 | Muller-Lyer | 100.0% | 93.9% | 91.5% | 90.9% | 12.4 |
| .006 | Cafe Wall | 95.5% | 87.0% | 97.7% | 99.2% | 23.9 | <.001 | Variable Constraints: |
|  |  |  |  |  |  | Ebbinghaus | 98.5% | 50.4% |
| 82.9% | 78.0% | 91.6 | <.001 | Colliding Oranges | 75.4% | 29.8% | 34.9% | 61.4% |
| 74.5 | <.001 | Surrounded Planets | 81.3% | 51.1% | 17.1% | 71.2% | 127.6 | <.001 |

Robust constraints produce near-uniform failure across platforms. The Moving Robot (99.2-100.0% failure) represents a fundamental limitation in current architectures regardless of implementation. The illusion-based traps (87.0-100.0% failure) reflect pervasive training data overfitting across all model families.

Variable constraints show substantial platform variation, indicating that some models have developed partial capabilities through architectural innovations. The Surrounded Planets trap ranged from 17.1% failure (ChatGPT) to 81.3% (Mariner), suggesting ChatGPT has developed stronger cross-modal binding capabilities. The Ebbinghaus ranged from 50.4% failure (Perplexity) to 98.5% (Mariner). The Colliding Oranges ranged from 29.8% (Perplexity) to 75.4% (Mariner). This variation has important implications for framework durability. As models improve on variable constraints, robust constraints continue providing detection. When robust constraints eventually resolve, the four-step methodology applies to newly documented constraints from updated AI evaluation literature.


### A.7 Total Score Distributions by Platform


**Table WA-A7 shows the distribution of cognitive trap scores (0-6 correct) for each platform and humans.**


**TABLE WA-A7: TOTAL COGNITIVE TRAP SCORE DISTRIBUTION**


| Score | Mariner | Perplexity | ChatGPT | Claude | All Agents | Humans |
| --- | --- | --- | --- | --- | --- | --- |
| 6 (all correct) | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 59.9% |
| 5 | 0.0% | 0.8% | 1.6% | 0.0% | 0.6% | 26.8% |
| 4 | 0.0% | 4.6% | 4.7% | 0.0% | 2.3% | 9.2% |
| 3 | 0.0% | 17.6% | 7.8% | 6.8% | 8.0% | 2.2% |
| 2 | 6.7% | 43.5% | 45.0% | 20.5% | 28.7% | 1.3% |
| 1 | 36.6% | 26.7% | 36.4% | 37.9% | 34.4% | 0.4% |
| 0 (all failed) | 56.7% | 6.9% | 4.7% | 34.8% | 26.0% | 0.2% |
| Mean (SD) | 0.50 | 1.89 | 1.76 | 0.99 | 1.28 | 5.40 |

The distributions show clear separation between agents and humans. Among humans, 86.7% scored 5-6 (passing at least 5 of 6 traps), while no platform’s mean score exceeded 1.89/6. Even the best-performing platforms (Perplexity at M = 1.89, ChatGPT at M = 1.76) averaged fewer than 2 correct responses, compared to 5.40 for humans. This separation explains the high sensitivity (97.1%) and low false positive rate (4.1%) at the 3+ failure threshold.


### A.8 Extended Thinking Models

Among the 34 models tested, 12 are extended-thinking variants that engage in deliberative reasoning before responding. Extended thinking improves average accuracy by 8.8 percentage points across 12 paired comparisons (standard vs. thinking variants of the same base model), though the effect is inconsistent: 8 of 12 pairs show improvement while 4 show declines. The best-performing model overall, Gemini 3 Flash with extended thinking, achieves 65% average accuracy, the highest among all 34 models tested but still 21.8 percentage points below the human baseline. Detailed results for all thinking-variant comparisons appear in web appendix C (Table WA-C3).


### A.9 Method Independence

Among 1,007 human participants, 73.2% of cognitive trap failures (30 out of 41 participants) passed all traditional checks, while 90.1% of traditional check failures (100 out of 111 participants) passed cognitive traps. The phi coefficient of .096 (explaining only 0.9% of shared variance) demonstrates that the two method types capture distinct data quality threats. This limited overlap has practical implications. Cognitive traps alone would miss inattentive humans who bias results through careless responding. Traditional checks alone would miss AI contamination that systematically distorts findings through architectural processing patterns. Researchers concerned about both contamination types should implement both method classes. The chi-square test (χ²(1) = 9.27, p = .002) indicates a statistically significant but small association between the two method types, demonstrating that the overlap is minimal.


### A.10 Timing Analysis Details

Survey completion times revealed that agents took longer than humans on average. Humans showed a median completion time of 371 seconds (6.2 minutes), while agents showed a median of 597.5 seconds (10.0 minutes). This pattern occurs because vision-language processing requires substantial time for each step: screenshot capture (1-2s), API call transmission (1-2s), model inference (2-10s per page, depending on complexity), response parsing (1-2s), and form field entry (1-2s). Summed across all survey pages, these processing steps produce completion times comparable to or exceeding careful human responding.

The 40% of median threshold (184 seconds) commonly used to flag rushed completion captured only 0.2% of agents (1/526). This single flagged agent likely experienced a server-side error that produced an anomalously short recorded completion time.


## WEB APPENDIX B: FRAMEWORK METHODOLOGY AND AGENT DEPLOYMENT


### B.1 Identifying Architectural Constraints: Extended Search Methodology

The Cognitive Trap Framework begins with systematic research of computer science benchmarks for documented architectural constraints in vision-language models. We conducted our search through three channels. First, we reviewed recent benchmark papers from major AI conferences (NeurIPS, ICML, CVPR, ICLR) that evaluate vision-language model performance on tasks requiring spatial reasoning, intuitive physics, temporal inference, and compositional understanding. Second, we surveyed published model evaluation reports from major model providers (OpenAI, Google, Anthropic, Meta) that document known limitations. Third, we examined the growing literature on multimodal model failures in cognitive psychology tasks, particularly work comparing model and human performance on standardized visual-cognitive assessments.

The search yielded dozens of documented constraints, from which we selected candidates meeting three criteria: (1) large human-model performance gaps (typically exceeding 30 percentage points), (2) validation across multiple model architectures, ensuring the constraint reflects a general limitation, and (3) amenability to implementation through standard survey stimuli (static images with multiple-choice or short open-ended responses). Five constraints met all three criteria and were carried forward to Step 2.


### B.2 Constraint Descriptions: Extended Details


#### Training Data Overfitting

Vision-language models are trained on massive corpora that include psychology textbooks, vision research papers, and educational materials describing canonical visual illusions. When presented with these well-known illusions, models learn the expected illusory pattern as a strong prior. This creates the following vulnerability: if researchers modify the illusion so that the physical property now matches the expected percept (e.g., making one line in the Muller-Lyer figure genuinely longer), models still report the canonical illusory pattern even when the visual difference is obvious. Humans, by contrast, immediately perceive the genuine physical difference because their visual system measures the stimulus directly from the rendered image.

Ullman (2024) systematically documented this phenomenon, generating modified versions of several canonical visual illusions and finding that state-of-the-art vision-language models incorrectly reported the standard illusory pattern even when the physical property had been altered to remove or reverse the illusion. For instance, when the Muller-Lyer figure was modified so that one line was clearly longer than the other, models still reported the lines as equal (the canonical illusion response) while humans immediately identified the longer line.

Shinozaki et al. (2025) independently replicated these findings across 14 validated illusion types, showing that large language models report canonical illusory patterns even on modified stimuli where the physical property matches the expected percept, while human participants achieved 100% accuracy on the same modified images. The convergence of findings across research groups and model generations strengthens the case that training data overfitting on visual illusions is a stable, exploitable constraint.

This constraint is particularly robust for detection purposes because (a) the training data overfitting mechanism operates across model architectures since all major LMMs are trained on overlapping corpora containing psychology and vision science content, (b) the failure mode is deterministic and predictable, and (c) the modifications that expose the overfitting are trivially easy for humans to perceive, creating large performance gaps.


#### Spatiotemporal Reasoning

Current vision-language models process images through feedforward architectures that analyze each input frame independently. When presented with a sequence of images showing an object in motion (e.g., a robot moving across frames with consistent velocity and trajectory), models struggle to construct a dynamic mental model that integrates position information across time steps to predict future locations. Zhou et al. (2025) demonstrated this limitation using trajectory prediction benchmarks, reporting 62.0% accuracy for the best-performing model compared to 98.8% for human participants. The gap persists because trajectory extrapolation requires maintaining temporal relationships between frames and performing geometric projection, capabilities not naturally supported by current transformer-based architectures that process each image as a standalone input without explicit temporal context.


#### Spatial Reasoning with Mental Simulation

This constraint involves constructing imaginary paths and computing geometric relationships between objects in a scene. When asked to predict which objects a moving object would collide with along a specified trajectory, models must simultaneously track object positions, compute path geometry, determine intersection points, and handle occlusion relationships. Qi et al. (2025) and Stogiannidis, McDonagh, and Tsaftaris (2025) documented that models achieve near-chance accuracy on spatial reasoning tasks requiring this type of geometric inference, while humans perform effortlessly by constructing mental models of the physical scenario.


#### Cross-Modal Binding

Vision-language models process different visual feature types (color, shape, size, spatial position) through separate processing pathways. While these pathways independently extract feature values with reasonable accuracy, they fail to maintain consistent bindings between features and objects, particularly under conditions of occlusion or visual complexity. Campbell et al. (2024) and Kamath, Hessel, and Chang (2023) documented that models exhibit surprising failures on tasks requiring identification of which object possesses a specific combination of features, even when humans perform with near-perfect accuracy. The failure mode is particularly pronounced when objects partially occlude one another, disrupting the spatial correspondence cues that models rely on to maintain feature-object bindings.


#### Compositional Counting

When asked to simultaneously filter objects by multiple attributes and count the results, models struggle with the compositional nature of the task. Guo et al. (2025) showed that while models can count objects of a single type or filter by a single attribute with reasonable accuracy, combining these operations (e.g., “count the number of circles that appear in more colors than any other shape type”) produces substantial performance degradation. The constraint reflects limitations in how current architectures handle compositional queries that require maintaining multiple filter criteria simultaneously while performing quantitative operations on the filtered set.


### B.3 Trap Development Process: Design Guidelines

Each identified constraint must be transformed into a visual survey question meeting two design criteria. First, the stimulus must be visual: constraints should be presented through rendered images, because text descriptions would be processed through the language pathway, potentially circumventing the visual constraint entirely. Second, the failure patterns should be diagnostic: implementations must produce specific, predictable errors when models fail, enabling researchers to distinguish architectural failures from random guessing.

We developed stimuli through iterative pretesting using very simple tools such as Microsoft PowerPoint. For each candidate implementation, we tested it against available frontier models. We retained implementations where models produced consistent, predictable error patterns across trials. For example, our initial version of the Moving Robot trap used a more complex trajectory; models failed, but inconsistently across trials. The simplified four-frame linear trajectory produced highly consistent failures (99.6% across all platforms in deployment).

The three implementations targeting training data overfitting were adopted from Ullman (2024), who had already established that these modified illusions produce reliable model failures. We adapted their materials for survey format by converting the stimuli to Qualtrics-compatible images with standardized response options. The four remaining cognitive traps (Moving Robot, Colliding Oranges, Surrounded Planets, Shape Overload) were developed from scratch through multiple rounds of pilot testing against frontier models.


**Table WA-B1 presents the complete set of implementations with exact stimuli, questions, response options, and correct answers. All stimulus images are also available in the OSF materials (https://osf.io/f2jhx/overview?view_only=ab7ece0d719642fe9e62b00afade9b11) and the Cognitive Trap Repository (https://FelipeMAffonso.github.io/cognitive-trap-repository).**


**TABLE WA-B1. COMPLETE COGNITIVE TRAP IMPLEMENTATIONS**

Cognitive Trap Description

Cognitive Trap Stimulus

Question and Response Options

(* = correct answer)

Modified Café Wall Illusion with genuinely slanted lines (Data Overfitting) – from Ullman (2024)


[Image: media/image4.png]

Are all the gray lines PERFECTLY STRAIGHT / HORIZONTAL or SLANTED / DIAGONAL?

A) Straight / Horizontal

B*) Slanted / Diagonal

Modified Muller-Lyer illusion with a blue line objectively longer than a red line (Data Overfitting) – adapted from Ullman (2024)


[Image: media/image5.png]

Which is longer, the blue line or the red line?

A*) Blue Line

B) Red Line

C) NONE (they are the same size)

Modified Ebbinghaus illusion with a red circle objectively bigger than a blue circle (Data Overfitting) – from Ullman (2024)


[Image: media/image6.jpeg]

Which is bigger, the blue circle or the red circle?

A) Blue Circle

B*) Red Circle

C) NONE (they are the same size)

The Moving Robot, a four-frame sequence showing a robot moving progressively toward center with constant speed and trajectory; frame 4 empty (Spatiotemporal Reasoning)


[Image: media/image7.png]


*NOTE: The four steps were displayed side-by-side*

Across each step, the robot moves with the same speed and trajectory. Where is it most likely that the robot will be located on Step 4? A) Mostly on the bottom right of the square; B) Mostly on the bottom left of the square; C) Mostly on the upper right of the square; D) Mostly on the upper left of the square; *E) Mostly around the center of the square

F) Off-screen (outside the square)

The Colliding Oranges, which involves a set of shapes in a 2D display where the user predicts which shape(s) will be in the way (Spatial Reasoning with Mental Simulation)


[Image: media/image8.png]

The largest circle will move straight to the left towards the smallest circle. What are the objects in the way, if any? That is, which objects, if any, would the largest circle collide with?

A*) Green Triangle

B, C, D, …) Other object combinations

The Surrounded Planets, which involves six colored planets surrounded by occluding geometric shapes which need to be counted (Cross-Modal Binding with Occluded Stimulus)


[Image: media/image9.png]


*NOTE: The six planets were displayed in 3 columns*

Look at the 6 planets in this image. Each planet is surrounded by several shapes. Don't worry about the color, size, or type of shape - just count how many shapes surround each planet. Five planets have 5 shapes surrounding them. One planet has 4 shapes surrounding it. What color is the planet that has only 4 shapes surrounding it?

A*) Orange, B-F) Purple, Blue, Red, Green, Gray

The Shape Overload, which involves identifying the shape with the most colors and counting how many of these shapes are displayed (Compositional Counting)


[Image: media/image10.png]

This image contains circles, rectangles, triangles, and hexagons in various colors.

One of these shape types appears in more different colors than the other three. Identify which shape appears with most colors. Then, count how many of those shapes are in the image. What is the count? (Open-ended; A: 14)

B.4 Shape Overload: Exclusion Rationale

The Shape Overload trap (compositional counting) was designed to exploit limitations in simultaneous attribute filtering and counting. The stimulus presented circles, rectangles, triangles, and hexagons in various colors, requiring participants to identify which shape type appeared in the most different colors and then count the total number of that shape type in the image.

In validation testing (202 Prolific participants, 171 attentive after filtering), human accuracy was only 46.8%, failing the first retention criterion of 75% minimum human performance. The human-model gap was only 6.8 percentage points (46.8% human vs. 40.0% pooled model), failing the second retention criterion of at least 30 percentage points. The task proved genuinely difficult for humans because it required (a) scanning a visually complex display, (b) categorizing each object by both shape and color, (c) constructing color-count distributions for each shape type, (d) comparing those distributions, and (e) then counting one category while filtering out the others. While the task exploits a real model constraint, the implementation was too complex for the survey context.


### B.5 Agent Deployment Methodology


#### Deployment Overview

The agent deployment did not require substantial methodological infrastructure or technical expertise. A regular person can easily do this by downloading Perplexity Comet, clicking “Assistant,” and prompting the agent to finish the survey. Alternatively, one could easily log into ChatGPT (with a 20USD/month subscription as of February 2026), turn Agent Mode on, and ask the agent to finish the survey. We deployed 526 vision-enabled AI agents individually across Google Project Mariner (n = 134), Perplexity Comet (n = 131), ChatGPT Agent (n = 129), and the Claude Sonnet 4.5 model using the Cursor IDE (n = 132). These represent some of the mainstream vision-enabled agents that are currently being adopted by consumers. We note that many other such agents exist, some of which require more expertise (e.g., Browser Use, which is open source), some of which require specific hardware (e.g., ChatGPT Atlas, which was only available for MacOS by the time we deployed the AI agents), and some which are still in early phases (e.g., Claude Chrome Extension and Opera Neon). The data collection on Prolific occurred during November 14, 2025. The AI agents were deployed on November 15 and 16, 2025.


#### Deployment Prompt

For each agent deployment, we used the following prompt: “Hello. I am testing the usability of a survey and I am interested in seeing you going through it exactly as an attentive participant: giving thoughtful answers, reading the questions, paying attention, and answering the questions to the best of your ability. Please complete the survey: [survey link].” This prompt is conservative. Further instructions (personas, timing delays, human-like behaviors) could increase humanness. Research already explores infusing agents with human-like typing (e.g., Zhou and Hu 2025).


#### Agent-Specific Deployment Details

Each deployed agent operated through separate browser instances that autonomously navigated to the survey URL, processed visual content through vision-language models, generated responses, and submitted the survey without human intervention beyond initial deployment or very occasional adjustments.

Google Project Mariner. Agents were deployed through the Mariner browser extension within Google Chrome. Project Mariner would sometimes click the wrong coordinates on the screen, and a simple prompt such as “change your approach and try clicking on the text labels instead of relying on screen coordinates” would fix the issue. Project Mariner also refused to complete CAPTCHA puzzles, but a three-second human intervention (taking control and clicking the “I am not a robot” checkbox) was enough to trigger the agent to complete the entire survey.

Perplexity Comet. Agents were deployed through the Perplexity Comet browser agent. Perplexity Comet completed CAPTCHAs without offering resistance. Perplexity Comet could type word-by-word via simulated keyboard input rather than copy-pasting text into form fields, making its interaction patterns more human-like.

ChatGPT Agent. Agents were deployed through OpenAI’s ChatGPT Agent mode. ChatGPT Agent displayed a mouse pointer going through the survey screen, whereas other agents programmed clicks into specific coordinates within the browser. The mouse pointer capability may trivialize mouse movement tracking as a potential detection tool (either with prompts asking the agent to behave like a human or with more advanced models).

Claude Sonnet 4.5 via Cursor Agent. Unlike the three browser-based platforms, Claude agents were deployed through the Cursor IDE’s agent functionality, which provides browser automation capabilities. Claude Sonnet 4.5 via Cursor could type word-by-word via simulated keyboard input, similar to Perplexity Comet. This raises the possibility that blocking copy/paste alone would not stop all agents.


**FIGURE WA-B1. MULTIPLE AGENT BEHAVIORS, INCLUDING PRESENCE OF MOUSE CURSOR AND KEYSTROKE TYPING SPECIFIC BEHAVIORS**


[Image: media/image11.png]


[Image: media/image12.png]


[Image: media/image13.png]


#### Ethical Justification

We emphasize that this agent deployment represents methodological validation rather than survey fraud or platform policy violations. We deployed agents to complete our own research survey designed specifically to test detection methods, which is analogous to pilot testing or survey pretesting using available tools. No participant accounts were compromised, no external surveys were fraudulently completed, and no platforms’ terms of service were violated. The agents simply opened the survey link, completed the survey, and were done. Agent deployment was conducted exclusively on a researcher-controlled Qualtrics survey instance. No agents were deployed on live participant recruitment platforms, and no agent responses were included in any participant pool that could affect other researchers’ data. All agent responses were clearly labeled in the dataset and never mixed with human participant data during analysis.


### B.6 Main Study: Detailed Procedure

The study was conducted using Qualtrics. The structure was very similar to typical studies investigating behavioral research effects. Specifically, we conducted a conceptual replication of the choice deferral effect (Dhar 1997) using laptops. In addition, there were cognitive traps (framed as “visual perception tasks”) and regular attention checks. The survey structure was as follows.

First, participants (or agents) provided informed consent. The informed consent page had a CAPTCHA verification asking: “Are you a human or a bot?” As documented above, this was easily circumvented by agents, requiring minimal to no human intervention. Then, we randomly assigned participants to two conditions: (1) choice set with equally attractive options (high trade-off conflict) versus (2) choice set with dominant and dominated options (low trade-off conflict). Dhar (1997) demonstrates that preference uncertainty, which occurs when options are equally attractive, increases the propensity to defer choice. We expected to replicate this effect in humans but made no predictions for agents, as any pattern of results in machine behavior could be potentially interesting and informative (Brinkmann et al. 2023; Rahwan et al. 2019).

In the high trade-off conflict condition, participants saw two equally attractive laptops: Laptop A (Intel Core i7 processor, high performance; 8GB RAM; 15.6” Full HD Display; 14 hours Battery Life; 512GB SSD Storage; and $1,099 price) versus Laptop B (Intel Core i5 processor, moderate performance; 16GB RAM; 13.3” 4K Display; 8 hours Battery Life; 1TB SSD Storage; and $1,099 price). Choosing among these options involved trade-offs between important attributes. In the low trade-off conflict condition, participants saw two laptops where one was clearly superior to the other: Laptop A (Intel Core i7 processor, high performance; 16GB RAM; 15.6” 4K Display; 14 hours Battery Life; 1TB SSD Storage; and $1,099 price) versus Laptop B (Intel Core i5 processor, moderate performance; 8GB RAM; 13.3” Full HD Display; 8 hours Battery Life; 512GB SSD Storage; and $1,099 price). Choosing among these options involved no trade-offs.

After making their choice, participants answered the PANAS scale for the straight-lining check: the scale had 20 regular PANAS items (Watson, Clark, and Tellegen 1988) plus an item labeled “For this item, select ‘Not at all’.” Then, participants completed the six retained cognitive traps (all from Table 2 except Shape Overload) in randomized order. Next, they completed an IMC, an obvious answer check, and a memory check. Finally, they provided demographics. The survey had Qualtrics’s bot detection tool activated (reCAPTCHA score).


### B.7 Validation Study: Full Methodology

We conducted a validation study to establish baseline performance for both models and humans on all seven cognitive traps prior to main study deployment.


#### Model Validation Protocol

Model validation proceeded in two phases. The initial validation tested all seven cognitive traps against six frontier vision-language models (GPT-5.1 Instant, GPT-5.1 with extended thinking, Google Gemini 2.5 Pro, Google Gemini 2.5 Flash, Anthropic Claude Sonnet 4.5, and Anthropic Claude Haiku 4.5), with 10 independent trials per trap per model (420 trials total). Each trial was conducted through standard chat interfaces using a standalone temporary or incognito chat session with no conversation history, ensuring independence across trials. This validation requires no technical expertise beyond chatbot access and represents the recommended approach for researchers applying the framework to validate new traps.

To assess the durability of trap effectiveness as model architectures improve, we then conducted an expanded validation of the six retained traps against 34 vision-language models spanning release dates from March 2024 through February 2026, with 10 independent trials per trap per model (2,040 trials total). The expanded assessment used programmatic API calls, with each stimulus image sent as a base64-encoded attachment alongside the question text and the model’s response parsed for the selected option. Complete per-model results for the expanded validation appear in web appendix C.


#### Human Validation Protocol

We recruited 202 participants from Prolific for the validation study. Participants completed all seven cognitive traps along with two traditional attention checks (an instructional manipulation check and an obvious answer question). After filtering 31 participants who failed at least one attention check, 171 attentive participants remained for the validation analysis.

Participant demographics: 45.5% female, mean age 41.75 years. The sample was recruited from Prolific’s standard participant pool with no additional screening beyond Prolific’s default verification requirements.


#### Retention Criteria

Two criteria guided trap retention for main study deployment:

Human performance must exceed 75% accuracy. This ensures the task falls within normal visual-cognitive capabilities and does not create excessive false positive rates among genuine human participants.

Human performance must exceed pooled model performance by at least 30 percentage points. This provides a substantial margin of robustness against model improvements, ensuring the trap retains discriminative power even if models improve moderately.

Six of seven traps met both criteria. The Shape Overload failed both (46.8% human accuracy, 6.8pp gap) and was excluded from deployment (see Section B.4 for details).


## WEB APPENDIX C: FULL 34-MODEL VALIDATION RESULTS


### C.1 Overview and Testing Methodology

To assess whether cognitive traps maintain effectiveness as vision-language models improve, we tested all six retained traps against 34 models spanning three providers (Anthropic, OpenAI, Google) and release dates from March 2024 through February 2026. This nearly two-year range extends well beyond the frontier models available at the time of initial validation, enabling a longitudinal assessment of trap durability across architectural generations.

All model testing used direct API calls with each trap stimulus sent as a base64-encoded image alongside the question text. Each of the 2,040 trials (34 models x 6 traps x 10 trials) used a standalone session with no conversation history, ensuring independence across trials. Models received the identical visual stimulus and question text that human participants saw in the Qualtrics survey, with no additional instructions, chain-of-thought prompts, or persona framing. For models offering extended thinking, we tested both the standard and extended-thinking variants as separate entries. The agent deployment scripts and all trial-level data are available at https://osf.io/f2jhx/overview?view_only=ab7ece0d719642fe9e62b00afade9b11.

This API-based testing protocol differs from the agent deployment in the main study, where 526 agents completed the survey autonomously through browser interfaces (Google Project Mariner, Perplexity Comet, ChatGPT Agent, and Claude via Cursor). The API testing isolates model-level visual processing capabilities, while the agent deployment captures the full autonomous workflow including screenshot capture, page navigation, and form submission. Both approaches are necessary because API testing establishes which architectural constraints each model exhibits, and agent deployment shows that these constraints persist when models operate through autonomous agent frameworks. The API testing also offers more control and flexibility than the chatbot interface testing used in the initial model validation.


### C.2 Complete Model Results


**Table WA-C1 presents pass rates for all 34 models ordered chronologically by release date. The dagger symbol (†) denotes extended thinking variants. Ten independent trials per trap per model.**


**TABLE WA-C1: COMPLETE COGNITIVE TRAP PASS RATES ACROSS 34 MODELS**


| Model | Provider | Release | Cafe Wall | Muller-Lyer | Ebbinghaus | Robot | Oranges | Planets | Avg |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
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


*NOTE. † = extended thinking variant. Ten independent trials per trap per model. Human sample: 171 attentive Prolific participants (validation study). Pooled = unweighted average across all 34 models.*

The first observation from the complete results is extreme model heterogeneity. In addition, models do not improve monotonically: GPT-4o-mini (July 2024, 36.7%) substantially outperforms GPT-4.1 (April 2025, 5.0%), a model released ten months later in the same product line. Claude Haiku 3.5 (October 2024, 45.0%) outperforms multiple models released over a year later, including Claude Sonnet 4.5 (September 2025, 16.7%) and Claude Opus 4.5 (November 2025, 16.7%). Gemini 2.0 Flash (February 2025, 31.7%) outperforms its successor Gemini 2.5 Flash (June 2025, 1.7%) by a factor of nearly 19. These reversals indicate that architectural improvements optimized for general language and reasoning capabilities do not translate predictably into improved visual-cognitive performance on the specific tasks that cognitive traps exploit.

The best-performing model overall is Gemini 3 Flash with extended thinking (65.0% average), yet even this model falls 21.8 percentage points below the human baseline. Only three models exceed 45% average accuracy (Gemini 3 Flash†, GPT-5.2†, and Gemini 2.5 Flash-Lite†), and all three use extended thinking, suggesting that deliberative reasoning partially compensates for architectural constraints without fully resolving them. At the other extreme, two models scored 0% across all six traps (GPT-4o, GPT-4.1-mini), indicating complete failure of visual-cognitive integration on every constraint category. No model passes all six traps, and every model fails at least two traps completely (0% across all 10 trials), demonstrating that the multi-trap battery provides redundant detection coverage even against the strongest available models.


### C.3 Temporal Evolution Analysis

An OLS regression of model-level average accuracy on release date (measured in months since January 2024) yields a slope of +0.51 percentage points per month (SE = 0.47, p = .282, R² = .036), indicating no statistically significant overall improvement across the nearly two-year testing period. Table WA-C2 presents the per-trap temporal slopes, revealing that aggregate stability masks heterogeneous trajectories across individual traps.


**TABLE WA-C2: PER-TRAP TEMPORAL SLOPES (OLS REGRESSION ON RELEASE DATE)**


| Trap | Slope (pp/month) | SE | p | Direction | Interpretation |
| --- | --- | --- | --- | --- | --- |
| Modified Cafe Wall | −3.14 | 0.99 | .003** | Declining | Models getting worse over time |
| Moving Robot | −1.51 | 0.40 | .001** | Declining | Models getting worse over time |
| Modified Muller-Lyer | +0.74 | 0.93 | .429 | Stable | No significant change |
| Modified Ebbinghaus | +1.35 | 1.31 | .312 | Stable | No significant change |
| Colliding Oranges | +2.92 | 1.00 | .006** | Improving | Models getting better over time |
| Surrounded Planets | +2.71 | 1.15 | .022* | Improving | Models getting better over time |


*NOTE. Dependent variable: model pass rate (%) for each trap. Independent variable: release date in months since January 2024. N = 34 models. * p < .05, ** p < .01.*

The heterogeneous pattern is consistent with the framework’s design logic. The two traps exploiting training data overfitting on canonical illusions (Cafe Wall and Muller-Lyer) show declining or stable accuracy, suggesting that overfitting on well-known visual illusions persists or even intensifies as models train on larger corpora containing more psychology and vision science content. The Moving Robot (spatiotemporal reasoning) also shows declining accuracy, consistent with the possibility that newer architectures optimized for language tasks may allocate fewer resources to temporal-spatial integration. Conversely, the two traps requiring spatial reasoning (Colliding Oranges) and cross-modal binding (Surrounded Planets) show significant improvement, suggesting these capabilities are active targets for architectural enhancement.

For detection purposes, the heterogeneous evolution supports the multi-trap battery approach. As some traps lose discriminative power, others maintain or even gain effectiveness. The framework’s four-step methodology provides a systematic procedure for replacing weakening traps with new implementations targeting newly documented constraints.


### C.4 Extended Thinking Analysis

Twelve of the 34 models are extended-thinking variants that engage in deliberative reasoning Twelve responding. Table WA-C3 compares standard and extended-thinking versions of the same base models.


**TABLE WA-C3: EFFECT OF EXTENDED THINKING ON COGNITIVE TRAP PERFORMANCE**


| Base Model | Provider | Standard | Thinking | Difference | gemini-2.5-pro | Google |
| --- | --- | --- | --- | --- | --- | --- |
| 15.0% | 1.7% | −13.3 pp | gemini-2.5-flash | Google | 1.7% | 6.7% |
| +5.0 pp | gemini-2.5-flash-lite | Google | 18.3% | 46.7% | +28.4 pp | gpt-5 |
| OpenAI | 16.7% | 28.3% | +11.6 pp | claude-sonnet-4.5 | Anthropic | 16.7% |
| 46.7% | +30.0 pp | claude-haiku-4.5 | Anthropic | 33.3% | 31.7% | −1.6 pp |
| claude-opus-4.5 | Anthropic | 16.7% | 36.7% | +20.0 pp | gpt-5.1 | OpenAI |
| 28.3% | 8.3% | −20.0 pp | gemini-3-flash | Google | 36.7% | 65.0% |
| +28.3 pp | gpt-5.2 | OpenAI | 31.7% | 48.3% | +16.6 pp | claude-opus-4.6 |
| Anthropic | 33.3% | 40.0% | +6.7 pp | claude-sonnet-4.6 | Anthropic | 23.3% |
| 16.7% | −6.6 pp | Mean |  | 22.6% | 31.4% | +8.8 pp |


*NOTE. Difference = Thinking accuracy minus Standard accuracy. Positive values indicate thinking improves performance.*

Extended thinking improves average accuracy by 8.8 percentage points across the 12 paired comparisons, though the effect is inconsistent: 8 of 12 pairs show improvement while 4 show declines. The largest gains occur for Claude Sonnet 4.5 (+30.0 pp) and Gemini 2.5 Flash-Lite (+28.4 pp), where deliberative reasoning appears to override initial pattern-matching responses on traps exploiting training data overfitting. The largest decline occurs for GPT-5.1 (−20.0 pp), where extended thinking may introduce overthinking that degrades initially adequate responses. Even among thinking models, the best achiever (Gemini 3 Flash† at 65.0%) remains 21.8 percentage points below the human baseline, demonstrating that extended reasoning partially compensates for but does not resolve the architectural constraints that cognitive traps exploit. See Figure WA-C1.


**FIGURE WA-C1. EFFECT OF EXTENDED THINKING ON COGNITIVE TRAP PERFORMANCE**


[Image: media/image14.png]


*NOTE. -- Each row represents one of 12 base models with paired standard (circle) and extended-thinking (diamond) variants. Green lines indicate improvement, red lines indicate decline. Models sorted by magnitude of thinking effect. Eight of 12 pairs show improvement (mean +8.8 pp), while four show declines. The largest gain is Claude Sonnet 4.5 (+30.0 pp); the largest decline is GPT-5.1 (−20.0 pp). The dashed line marks the 86.8% human baseline, which no thinking model reaches.*


### C.5 Provider Comparison


**Table WA-C4 presents average performance by provider, revealing distinct capability profiles across the three major model families.**


**TABLE WA-C4: AVERAGE PASS RATES BY PROVIDER**


| Trap | Anthropic (n = 12) | OpenAI (n = 12) | Google (n = 10) | Pooled (N = 34) |
| --- | --- | --- | --- | --- |
| Modified Cafe Wall | 18.3% | 16.7% | 26.0% | 20.0% |
| Modified Muller-Lyer | 18.3% | 0.0% | 26.0% | 14.1% |
| Modified Ebbinghaus | 79.2% | 20.0% | 45.0% | 48.2% |
| Moving Robot | 8.3% | 4.2% | 3.0% | 5.3% |
| Colliding Oranges | 45.8% | 30.0% | 12.0% | 30.3% |
| Surrounded Planets | 20.0% | 56.7% | 36.0% | 37.6% |
| Overall | 31.7% | 21.2% | 24.7% | 25.9% |

The most striking provider-specific pattern involves the Modified Ebbinghaus trap: Anthropic models achieve 79.2% accuracy (near human levels of 90.1%), while OpenAI models achieve only 20.0% and Google models 45.0%. This suggests that Anthropic’s architecture has partially resolved the training data overfitting constraint for the Ebbinghaus illusion specifically, while the constraint persists in other model families. Conversely, OpenAI models show zero accuracy on the Modified Muller-Lyer across all 12 models tested (120 trials), indicating complete and persistent failure to overcome training data overfitting for this particular illusion despite substantial architectural differences across the GPT-4o through GPT-5.2 range. See Figure WA-C2.


**FIGURE WA-C2. AVERAGE COGNITIVE TRAP PASS RATES BY PROVIDER**


[Image: media/image15.png]


*NOTE. -- Heatmap compares performance across Anthropic (n = 12 models), OpenAI (n = 12), and Google (n = 10) for each trap and overall. Human baseline shown for reference. Provider-specific patterns reveal distinct capability profiles across model families.*

The Moving Robot trap shows the most uniform cross-provider failure, with all three providers averaging below 9% accuracy. Spatiotemporal reasoning remains the most robust constraint category for detection purposes, producing near-universal failure regardless of provider, model generation, or thinking variant.


### C.6 Summary and Implications for Detection

The 34-model validation reveals three findings that directly bear on the framework’s viability. First, model improvement on cognitive traps is neither monotonic nor predictable. Newer models frequently perform worse than their predecessors on the same traps, architectural optimizations aimed at general capabilities do not transfer to the specific visual-cognitive tasks that traps exploit, and the overall trend across nearly two years of model development is statistically indistinguishable from zero. Second, performance is extremely heterogeneous across models, providers, and traps: no single model excels on all traps, no single trap defeats all models, and no single provider consistently outperforms the others. This heterogeneity validates the multi-trap battery approach, because the probability that an agent passes enough traps to evade detection depends on the specific model encountering the specific battery, and the data show that every model fails on a distinct subset. Third, extended thinking provides inconsistent and insufficient improvement, with the best thinking model still 21.8 percentage points below human performance. Cognitive traps exploit constraints that cannot be fully resolved through additional reasoning time because the failures reflect how models process and integrate visual information at an architectural level rather than how much time they spend reasoning about it.

Researchers applying the framework should monitor trap effectiveness against current models and replace weakening traps using the four-step methodology. The data presented here provide the empirical foundation for this monitoring, and updated testing results will be maintained in the Cognitive Trap Repository.


## WEB APPENDIX D: CAPTCHA ROC ANALYSIS


### D.1 Overview

reCAPTCHA v3 assigns continuous risk scores from 0.0 (likely bot) to 1.0 (likely human) based on behavioral patterns accumulated across Google services. To evaluate CAPTCHA’s detection potential, we conducted a ROC-style analysis sweeping across all possible score thresholds to identify the operating point that maximizes the trade-off between sensitivity and false positive rate.


### D.2 Optimal Threshold Analysis

The optimal CAPTCHA threshold maximizing Youden’s J (sensitivity + specificity - 1) is 0.90, which detects 93.9% of agents (494/526) but flags 12.4% of humans (125/1,007). Even at this optimized operating point, CAPTCHA’s false positive rate is three times higher than cognitive traps (12.4% vs. 4.1%) while detecting fewer agents (93.9% vs. 97.1%). The AUC (area under the ROC curve) is 0.898.


**TABLE WA-D1: COMPARISON OF DETECTION METHODS AT OPTIMAL OPERATING POINTS**


| Method | Sensitivity | FPR | Specificity | Cognitive Traps (3+ failures) |
| --- | --- | --- | --- | --- |
| 97.1% (511/526) | 4.1% | 95.9% | CAPTCHA (optimal threshold 0.90) | 93.9% (494/526) |
| 12.4% | 87.6% | CAPTCHA (standard threshold 0.5) | 4.6% (24/526) | 1.0% |
| 99.0% | Traditional methods (any) | 2.3% (12/526) | N/A | N/A |

The standard 0.5 threshold used by most researchers detects only 4.6% of agents, rendering CAPTCHA ineffective as a detection tool against vision-enabled agents at conventional settings.


**FIGURE WA-D1. DETECTION SENSITIVITY AND FALSE POSITIVE RATES ACROSS FOUR METHODS**


[Image: media/image16.png]


*NOTE. -- Cognitive traps achieve the best combination: highest sensitivity (97.1%) with low false positives (4.1%). CAPTCHA at the optimal 0.90 threshold approaches cognitive trap sensitivity (93.9%) but at three times the false positive rate (12.4%). CAPTCHA at the standard 0.5 threshold and traditional methods both detect fewer than 5% of agents.*


### D.3 Threshold Sweep


**Table WA-D2 presents detection performance across a range of CAPTCHA thresholds, revealing the sharp transition in sensitivity between 0.80 and 0.90.**


**TABLE WA-D2: CAPTCHA DETECTION PERFORMANCE BY THRESHOLD**


| Threshold | Agents Detected | Humans Flagged | Sensitivity | FPR |
| --- | --- | --- | --- | --- |
| < 0.50 | 24/526 | 10/1007 | 4.6% | 1.0% |
| < 0.60 | 64/526 | 17/1007 | 12.2% | 1.7% |
| < 0.70 | 97/526 | 40/1007 | 18.4% | 4.0% |
| < 0.80 | 97/526 | 40/1007 | 18.4% | 4.0% |
| < 0.90 | 494/526 | 125/1007 | 93.9% | 12.4% |
| < 0.95 | 494/526 | 125/1007 | 93.9% | 12.4% |

The jump at the 0.90 threshold (from 18.4% to 93.9% sensitivity) occurs because 397 agents (75.5%) cluster in the 0.80-0.89 score range. Below 0.80, only a trickle of agents are captured (mostly Perplexity agents with lower scores). Above 0.90, nearly all agents fall below the threshold, but so do 12.4% of humans.


### D.4 Score Distributions

The main problem with CAPTCHA as a detection tool is the overlap in score distributions between agents and humans in the 0.80-0.90 range. See below:

Agent score distribution: - Below 0.50: 4.6% (24/526) - 0.50-0.79: 13.9% (73/526) - 0.80-0.89: 75.5% (397/526) - 0.90-1.00: 6.1% (32/526)

Human score distribution: - Below 0.50: 1.0% (10/1007) - 0.50-0.79: 3.0% (30/1007) - 0.80-0.89: 8.4% (85/1007) - 0.90-1.00: 87.6% (882/1007)

The distributions separate cleanly below 0.80 and above 0.90, but the 0.80-0.89 zone contains 75.5% of agents and 8.4% of humans. Thus, any threshold set in this zone captures most agents but also flags a substantial proportion of humans.


### D.5 Platform Heterogeneity in CAPTCHA Scores


**TABLE WA-D3: CAPTCHA SCORES BY AGENT PLATFORM**


| Platform | Mean | SD | Below 0.5 | Below 0.9 |
| --- | --- | --- | --- | --- |
| Google Mariner | 0.9000 | 0.0000 | 0 (0.0%) | 134 (100.0%) |
| Perplexity Comet | 0.6901 | 0.2115 | 20 (15.3%) | 125 (95.4%) |
| ChatGPT Agent | 0.8698 | 0.0835 | 0 (0.0%) | 126 (97.7%) |
| Claude/Cursor | 0.8689 | 0.1285 | 4 (3.0%) | 109 (82.6%) |

Google Mariner scored exactly 0.90 on every single trial (N = 134), suggesting the Mariner framework produces a deterministic CAPTCHA interaction pattern. Perplexity showed the most variance (SD = 0.2115) and the highest proportion below the standard threshold (15.3%). ChatGPT and Claude produced similar mean scores (approximately 0.87) with moderate variance.


### D.6 Interpretation and Caveats

CAPTCHA’s moderate AUC (0.898) indicates it carries some signal about agent status, but its operating characteristics are poorly suited for practical detection. At the standard 0.5 threshold, it catches almost no agents. At the optimal 0.90 threshold, it catches most agents but flags three times more humans than cognitive traps.

We note that several caveats apply to this analysis. First, the ROC analysis uses the same deployment data to both select the threshold and estimate performance, which may overestimate generalization performance. Second, reCAPTCHA v3 scores depend on the respondent’s accumulated Google service history, which varies across populations and may produce different distributions in other samples. Third, Google periodically updates the reCAPTCHA algorithm, meaning the specific score distributions observed here may not replicate in future studies.


## WEB APPENDIX E: DIAGNOSTICITY SIMULATIONS


### E.1 Overview and Motivation

Researchers implementing cognitive traps face a practical question: how many traps are needed, and which ones? Adding more traps increases detection sensitivity but also increases survey length and participant burden. This appendix presents exhaustive simulations across all possible trap combinations and failure thresholds, using the deployment data (526 agents, 1,007 humans) to characterize the sensitivity-specificity trade-off surface.

These simulations also address an interesting question that was raised by the review team, which we truly appreciate: whether researchers would be better served by deploying fewer traps from the same constraint category with multiple trials (e.g., three illusion-based traps) versus deploying traps from diverse constraint categories (e.g., one illusion, one spatiotemporal, one binding trap).


### E.2 Simulation Methodology

We computed sensitivity (agent detection rate), false positive rate (human flagging rate), and Youden’s J index (sensitivity + specificity - 1) for every possible configuration: all combinations of 2, 3, 4, 5, and 6 traps (from the pool of 6 validated traps) crossed with all possible failure thresholds (from 1+ to n/n, where n is the number of traps in the configuration). This produced 57 unique configurations (C(6,2) x 2 + C(6,3) x 3 + C(6,4) x 4 + C(6,5) x 5 + C(6,6) x 6 threshold levels). For each configuration, we applied the threshold to both the agent and human score vectors to compute the performance metrics.


### E.3 Key Findings


#### Finding 1: Researchers Do Not Need All 6 Traps

The best overall configuration by Youden’s J (0.936) uses five traps (dropping Colliding Oranges) with a 3+ failure threshold: 96.2% sensitivity, 2.6% false positive rate. Our deployed 6-trap battery at the 3+ threshold (J=0.931) performs only marginally lower. Dropping Colliding Oranges improves Youden’s J because this trap has the lowest agent failure rate (50.6%) while producing a meaningful human failure rate (11.3%), so removing it slightly improves the specificity-sensitivity balance.


#### Finding 2: As Few As 2-3 Traps Achieve Strong Detection

Two traps (Muller-Lyer and Moving Robot) with a both-must-fail threshold achieve 93.7% sensitivity with only 2.6% false positive rate (J=0.911). Three traps (Muller-Lyer, Moving Robot, and Surrounded Planets) with a two-failure threshold achieve 96.8% sensitivity with 4.0% false positives (J=0.928). Both configurations substantially outperform traditional methods (2.3%) and CAPTCHA at any threshold.


#### Finding 3: The Moving Robot Is the Most Valuable Single Trap

With 99.6% agent failure rate, the Moving Robot appears in virtually every optimal combination. It exploits spatiotemporal reasoning, the constraint showing the most uniform failure across all platforms (99.2-100.0%). Muller-Lyer (94.1% agent failure, 92.8% human pass rate) is the second most valuable due to its combination of high agent failure with high human pass.


#### Finding 4: Constraint Diversity Helps Modestly

Within 3-trap batteries, Youden’s J improves from 0.912 (all traps from one constraint category) to 0.928 (traps from three constraint categories). The improvement is real but modest (1.6 percentage points in J). The primary driver of detection performance is choosing traps with high individual discrimination regardless of constraint category. This finding suggests researchers can prioritize their highest-performing available traps without strict adherence to constraint diversity requirements.


#### Finding 5: Same-Constraint Traps Work as Multiple Trials

This addresses the question about whether fewer constraints with multiple trials could substitute for diverse constraints. Three illusion-based traps (Cafe Wall, Muller-Lyer, Ebbinghaus) at a 2+/3 threshold achieve 94.5% sensitivity with 3.3% false positive rate (J=0.912). Three diverse traps (Muller-Lyer, Moving Robot, Surrounded Planets) at 2+/3 achieve 96.8% sensitivity with 4.0% false positives (J=0.928). Both configurations are strong, and the diverse configuration’s advantage (1.6 J points) is modest. Researchers who prefer shorter batteries from a single constraint category can do so with only moderate loss in detection performance.


### E.4 Minimum Viable Battery Configurations


**Table WA-E1 presents the optimal configuration for each battery size (number of traps).**


**TABLE WA-E1: OPTIMAL CONFIGURATION BY BATTERY SIZE**


| # Traps | Best Configuration | Threshold | Sensitivity | FPR | Youden’s J |
| --- | --- | --- | --- | --- | --- |
| 2 | Muller-Lyer + Moving Robot | 2+/2 | 93.7% | 2.6% | 0.911 |
| 3 | Muller-Lyer + Moving Robot + Planets | 2+/3 | 96.8% | 4.0% | 0.928 |
| 4 | Muller-Lyer + Ebb + Moving Robot + Planets | 2+/4 | 97.7% | 5.0% | 0.928 |
| 5 | CW + ML + Ebb + Robot + Planets | 3+/5 | 96.2% | 2.6% | 0.936 |
| 6 | All six traps | 3+/6 | 97.1% | 4.1% | 0.931 |

The optimal 5-trap configuration (J=0.936) slightly outperforms the full 6-trap deployment (J=0.931), demonstrating that adding the weakest-performing trap (Colliding Oranges) marginally reduces overall performance by introducing false positives without proportional sensitivity gains.


### E.5 Practical Recommendations by Research Priority


**TABLE WA-E2: RECOMMENDED CONFIGURATIONS BY RESEARCH CONTEXT**


| Research Priority | Configuration | Sensitivity | FPR | Maximum detection, FPR <= 5% | 4 traps (ML+Ebb+Robot+Planets), thresh 2+ |
| --- | --- | --- | --- | --- | --- |
| 97.7% | 5.0% | Maximum detection, FPR <= 2% | 4 traps (CW+ML+Robot+Planets), thresh 3+ | 94.5% | 2.0% |
| Minimum survey burden, detection >= 90% | 2 traps (ML+Robot), thresh 2+ | 93.7% | 2.6% | Balanced (as deployed in this study) | 6 traps (all), thresh 3+ |
| 97.1% | 4.1% | Optimal by Youden’s J | 5 traps (drop Oranges), thresh 3+ | 96.2% | 2.6% |

For most research contexts, we recommend three to four traps from different constraint categories with a majority-failure threshold. This achieves detection rates above 95% with false positive rates below 5%, representing a substantial improvement over both traditional methods and CAPTCHA. Researchers with severe survey length constraints can use the two-trap minimum viable battery (Muller-Lyer and Moving Robot, both must fail) and still achieve 93.7% detection.


### E.6 Constraint Diversity Analysis


**TABLE WA-E3: CONSTRAINT DIVERSITY WITHIN 3-TRAP BATTERIES**


| Constraint Diversity | Best Configuration | J | Sensitivity | FPR |
| --- | --- | --- | --- | --- |
| 1 category | CW + ML + Ebb (all overfitting) | 0.912 | 94.5% | 3.3% |
| 2 categories | ML + Ebb + Robot (2 types) | 0.920 | 97.3% | 5.3% |
| 3 categories | ML + Robot + Planets (3 types) | 0.928 | 96.8% | 4.0% |

Diversity helps, but choosing high-discrimination traps matters more than constraint diversity per se. The improvement from one to three constraint categories (J = 0.912 to 0.928) is real but modest. Researchers should prioritize individual trap quality over adherence to diversity requirements.


## WEB APPENDIX F: CHOICE DEFERRAL EXTENDED RESULTS


### F.1 Three-Group Analysis

The main text reports choice deferral results for three groups: humans who passed cognitive traps (n = 966), “humans” who failed cognitive traps (n = 41), and AI agents (n = 526). This appendix provides complete breakdowns.


#### F.1.1 Deferral Rates by Group and Condition


**TABLE WA-F1: CHOICE DEFERRAL BY GROUP AND CONDITION**


| Outcome | Passed Humans | Failed Humans | AI Agents |  | Dominated | Conflict |
| --- | --- | --- | --- | --- | --- | --- |
| Dominated | Conflict | Dominated | Conflict | Chose Laptop A | 94.0% | 44.0% |
| 89.5% | 54.5% | 100.0% | 60.1% | Chose Laptop B | 0.8% | 32.0% |
| 5.3% | 31.8% | 0.0% | 39.2% | Deferred | 5.2% | 24.0% |
| 5.3% | 13.6% | 0.0% | 0.7% | N | 482 | 484 |
| 19 | 22 | 258 | 268 | Chi-sq | 66.83 |  |
| 0.139 |  | 0.465 |  | p | < .0001 |  |
| .709 |  | .496 |  |  |  |  |

The choice deferral effect replicates cleanly among passed-trap humans: 5.2% deferral under domination versus 24.0% under conflict (χ²(1) = 66.83, p < .001), consistent with Dhar’s (1997) theoretical prediction. Among agents, deferral is near zero regardless of condition (0.0% vs. 0.7%, p = .496), showing that machines do not experience the subjective uncertainty that drives deferral.

The 41 failed-trap “humans” show an intermediate pattern (5.3% vs. 13.6%, p = .709). The non-significant condition effect likely reflects low statistical power (n = 41). The 13.6% conflict deferral rate falls between passed humans (24.0%) and agents (0.7%), though the comparison to passed humans is not significant (χ²(1) = 0.74, p = .390).


#### F.1.2 Decision Times by Group and Condition


**TABLE WA-F2: DECISION TIMES (SECONDS) BY GROUP AND CONDITION**


| Statistic | Passed Humans |
| --- | --- |
| Failed Humans | AI Agents |
|  | Dominated |
| Conflict | Dominated |
| Conflict | Dominated |
| Conflict | Mean |
| 53.3 | 64.6 |
| 72.4 | 97.0 |
| 36.3 | 36.3 |
| SD | 69.9 |
| 116.8 | 48.4 |
| 147.6 | 16.7 |
| 17.0 | Median |
| 34.2 | 41.6 |
| 65.9 | 43.3 |
| 35.7 | 34.7 |
| Condition effect | t = 1.83, p = .067 |
| t = 0.69, p = .492 | t = -0.02, p = .984 |

Decision times provide evidence that failed-trap “humans” are genuine humans. In the conflict condition, failed-trap participants averaged 97.0 seconds, compared to 64.6 seconds for passed-trap humans (t = 1.26, p = .210, not significantly different) and 36.3 seconds for agents (t = 6.35, p < .001, clearly different). Their timing profile is human-like: substantial variability (SD = 147.6), sensitivity to conflict (higher mean in conflict vs. dominated, though not significant), and clearly slower than agents.

Agents showed no condition sensitivity in decision times (M = 36.3 seconds in both conditions, t = -0.02, p = .984), consistent with the interpretation that models resolve choice tasks through deterministic processing that does not vary with decision difficulty.


#### F.1.3 Traditional Check and CAPTCHA Performance Across Groups


**TABLE WA-F3: TRADITIONAL CHECK PERFORMANCE BY GROUP**


| Check | Passed Humans | Failed “Humans” | Agents |
| --- | --- | --- | --- |
| IMC Pass Rate | 99.6% | 97.6% | 99.8% |
| Obvious Answer Pass Rate | 99.3% | 92.7% | 99.8% |
| Memory Check Pass Rate | 90.7% | 82.9% | 99.2% |
| Straight-lining Pass Rate | 99.9% | 100.0% | 98.7% |
| CAPTCHA Mean Score | 0.972 | 0.971 | 0.833 |
| CAPTCHA SD | 0.098 | 0.129 | 0.154 |

Failed-trap “humans” show traditional check performance that is statistically indistinguishable from passed-trap humans. Their CAPTCHA scores (M = 0.971) are virtually identical to passed humans (M = 0.972, t = 0.10, p = .923). Their IMC pass rates are lower (97.6% vs. 99.6%) but well within the range of normal human performance. In contrast, agents show a distinctive CAPTCHA profile (M = 0.833) and perfect or near-perfect traditional check performance (reflecting that traditional checks exploit human attention limitations, which agents do not share).

This convergence of evidence (human-like decision times, human-like CAPTCHA scores, human-like traditional check performance) provides the strongest available evidence that the 41 flagged participants are genuine humans with lower visual-cognitive performance.


### F.2 Total Score Distribution Among Failed-Trap “Humans”


| Score | N | % of Failed Group |
| --- | --- | --- |
| 0 | 2 | 4.9% |
| 1 | 4 | 9.8% |
| 2 | 13 | 31.7% |
| 3 | 22 | 53.7% |

Most flagged participants (22/41, 53.7%) scored exactly 3/6, meaning they just barely failed the 3+ threshold. Only 6/41 (14.6%) scored 0 or 1, which would be more concerning from a contamination perspective. The concentration at the threshold boundary is consistent with natural variation in visual-cognitive performance, as agents would be expected to show a more distributed score pattern.


### F.3 Total Survey Completion Times


| Group | Mean |
| --- | --- |
| Median | SD |
| Passed Humans | 538.6s |
| 367.0s | – |
| Failed “Humans” | 693.7s |
| 631.0s | – |
| Agents | 635.3s |
| 597.5s | – |

Failed-trap “humans” took the longest overall (M = 693.7 seconds), exceeding both passed humans (538.6s) and agents (635.3s). This pattern is consistent with slower or more careful processing by participants who find the visual tasks genuinely challenging.


### F.4 Platform Heterogeneity in Choice Patterns

Among agents who committed to a choice (excluding the 2 who deferred), platforms showed dramatically different choice patterns in the conflict condition.


**TABLE WA-F4: AGENT CHOICE PATTERNS BY PLATFORM (CONFLICT CONDITION)**


| Platform | N | Chose A | Chose B | Defer | A:B Ratio |
| --- | --- | --- | --- | --- | --- |
| Decision Time | Mariner | 68 | 70.6% | 26.5% | 2.9% |
| 2.7:1 | 30.8s | Perplexity | 66 | 39.4% | 60.6% |
| 0.0% | 1:1.5 | 47.1s | ChatGPT | 70 | 95.7% |
| 4.3% | 0.0% | 22:1 | 20.7s | Claude | 64 |
| 31.2% | 68.8% | 0.0% | 1:2.2 | 48.3s | Overall agents |
| 268 | 60.1% | 39.2% | 0.7% | 1.5:1 | 36.3s |

Overall chi-square for platform differences: χ²(3) = 75.69, p < .001.

ChatGPT exhibited extreme primacy bias, selecting the first-presented option (Laptop A) in 95.7% of conflict trials. Claude showed the opposite pattern (recency bias), selecting Laptop B in 68.8% of conflict trials. Perplexity and Mariner produced intermediate distributions with opposing tendencies.

These platform-specific heuristics have implications for consumer choice research. If AI agents contaminate survey samples, they would introduce systematic but heterogeneous biases: ChatGPT contamination would inflate first-option selection, Claude contamination would inflate last-option selection, and samples contaminated by a mix of agents would show patterns that wash out to resemble human behavior in aggregate while masking systematic distortions at the platform level.

Decision times also varied across platforms, with ChatGPT being the fastest (20.7s) and Claude/Perplexity being the slowest (47.1-48.3s). All platforms showed no condition sensitivity in decision times, showing that timing invariance to experimental manipulation is a general agent characteristic shared across all platforms tested.


### F.5 Choice Patterns Among Passed-Trap Humans

Among passed-trap humans who committed to a choice in the conflict condition, 58.1% selected Laptop A and 41.9% selected Laptop B. This moderate preference may reflect the specific attribute values used in the stimuli or a mild primacy effect in the choice set presentation.

In the dominated condition, the dominant option was chosen by 98.9% of committed participants (Laptop A) versus 1.1% for the dominated option (Laptop B). This near-unanimous preference demonstrates that the domination manipulation was clearly effective, as expected when one option is strictly superior on the relevant attributes.


## WEB APPENDIX G: PLATFORM REPLICATION STUDIES


### G.1 Overview

To assess the generalizability of the Cognitive Trap Framework beyond Prolific, we conducted pre-registered replication studies on two additional platforms: Amazon Mechanical Turk and CloudResearch Connect. Both studies deployed the identical Qualtrics survey used in the Prolific main study, including all six cognitive traps, the choice deferral manipulation, traditional attention checks, and reCAPTCHA v3. The pre-registered primary analysis for both platforms specified the three-failure threshold (failing 3 or more of 6 traps) and a two-proportion z-test comparing flagging rates against the Prolific baseline of 4.1%.

CloudResearch Connect evolved from the former TurkPrime service that originally operated as a layer on top of MTurk. Although MTurk workers could historically access CloudResearch studies, the two platforms now maintain fully independent participant pools with distinct verification procedures, demographic compositions, and pricing structures. Including both platforms in the replication therefore provides genuinely independent tests of cognitive trap performance across different online research populations.


### G.2 MTurk Replication


#### G.2.1 Method

We pre-registered the MTurk replication on AsPredicted (https://aspredicted.org/sz87tb.pdf) before collecting any data, specifying the three-failure threshold and two-proportion z-test against Prolific. We recruited participants from MTurk using standard HIT qualification requirements. Data were collected in February 2026.


#### G.2.2 Sample

The MTurk sample comprised 263 completed responses (58.6% male, 41.4% female; Mage = 35.3, SD = 8.7, range 23-70). The pre-registered target was 500 respondents. Although 500 workers accepted the HIT on MTurk, only 263 completed the Qualtrics survey. Many of the remaining workers submitted completion codes without actually opening the survey link, and others submitted random or shared codes. This pattern is consistent with documented code-sharing practices on MTurk forums where workers circulate completion codes to collect payment without performing the task, and itself constitutes evidence of the platform’s data quality problems. The gap between HIT acceptances and survey completions is not attributable to respondent unavailability but rather to fraudulent submissions. Despite this deviation from the pre-registered sample size, the observed effect (76.0% vs. 4.1%) far exceeds the detectable difference at any conventional power level for the primary analysis (two-proportion z-test comparing flagging rates against Prolific). Condition assignment was approximately balanced: 135 (51.3%) in the dominated condition and 128 (48.7%) in the conflict condition. No duplicate respondents were detected.


#### G.2.3 Primary Analysis: Cognitive Trap Flagging Rate

Cognitive traps flagged 200 of 263 MTurk respondents (76.0%) at the pre-registered three-failure threshold. This rate is dramatically higher than Prolific’s 4.1% (two-proportion z = 26.51, p < .001) and represents a near-inversion of the Prolific distribution, where 86.7% of participants scored 5 or 6. On MTurk, only 7.2% scored 5 or 6, and only 1.9% achieved a perfect score of 6/6 (compared to 59.9% on Prolific).


**TABLE WA-G1: TOTAL SCORE DISTRIBUTION ON MTURK**


| Score | N | % | Cumulative % |
| --- | --- | --- | --- |
| 6 | 5 | 1.9% | 100.0% |
| 5 | 14 | 5.3% | 98.1% |
| 4 | 44 | 16.7% | 92.8% |
| 3 | 70 | 26.6% | 76.0% (threshold) |
| 2 | 85 | 32.3% | 49.4% |
| 1 | 42 | 16.0% | 17.1% |
| 0 | 3 | 1.1% | 1.1% |

The score distribution is left-shifted relative to Prolific, with the modal score at 2 (32.3% of respondents). Among the 200 flagged respondents, 65.0% scored below the threshold (0, 1, or 2), indicating that the majority did not narrowly miss passing but rather showed pervasive failure across multiple traps.


#### G.2.4 Individual Trap Pass Rates

All six traps showed substantially lower pass rates on MTurk compared to Prolific.


**TABLE WA-G2: INDIVIDUAL TRAP PASS RATES: MTURK VS. PROLIFIC VS. AGENTS**


| Trap | MTurk | Prolific | Agents | MTurk-Prolific | MTurk-Agents |
| --- | --- | --- | --- | --- | --- |
| Modified Cafe Wall | 31.2% (82) | 88.4% (890) | 5.1% (27) - | 57.2 pp + | 26.0 pp |
| Modified Muller-Lyer | 71.1% (187) | 92.8% (934) | 5.9% (31) - | 21.7 pp + | 65.2 pp |
| Modified Ebbinghaus | 78.7% (207) | 95.6% (963) | 22.4% (118) - | 16.9 pp + | 56.3 pp |
| Moving Robot | 20.9% (55) | 77.9% (784) | 0.4% (2) - | 57.0 pp + | 20.5 pp |
| Colliding Oranges | 20.2% (53) | 88.7% (893) | 49.4% (260) - | 68.5 pp - | 29.3 pp |
| Surrounded Planets | 43.3% (114) | 96.5% (972) | 44.5% (234) - | 53.2 pp - | 1.1 pp |
| Average | 44.2% | 90.0% | 21.3% * | *-45.8 pp** * | *+22.9 pp** |


*NOTE. Agent N = 526. Agent pass rates represent pooled performance across four deployed agents (Google Mariner, Perplexity, ChatGPT, Claude).*

The MTurk-Agent comparison in the final column provides a direct test of whether MTurk respondents behave like deployed agents. On four of six traps, MTurk respondents outperform agents, with the largest positive gap on Muller-Lyer (+65.2 pp). On two traps, however, MTurk respondents perform worse than agents: Colliding Oranges (-29.3 pp) and Surrounded Planets (-1.1 pp). This mixed pattern suggests that the MTurk sample is not composed exclusively of agent-mediated responses but rather reflects a heterogeneous mix of data quality threats, because purely agent-driven responses would produce a profile closer to the agent column. The MTurk average pass rate (44.2%) falls between the agent average (21.3%) and Prolific (90.0%), consistent with a mixture of respondent types whose behavioral profiles span the range from careless human responding (Kay 2025) to what may be sophisticated AI agent contamination.


#### G.2.5 Behavioral Profile

The behavioral indicators on MTurk tell a consistent story of widespread contamination.

Traditional attention checks. The IMC (“puppy name”) showed 84.4% pass rate on MTurk, compared to 99.5% on Prolific and 99.8% for agents. The obvious answer check (“How frequently do you have a fatal heart attack?”) showed only 55.9% pass rate on MTurk, compared to 99.0% on Prolific and 99.8% for agents, suggesting a substantial proportion of respondents who behave as neither careful humans nor competent AI agents would. The memory check showed 60.5% pass rate (vs. 90.4% on Prolific, 99.2% for agents), while straight-lining was comparable across platforms (96.2% vs. 99.9%).

reCAPTCHA v3 scores. MTurk respondents showed substantially lower CAPTCHA scores (M = 0.635, SD = 0.320) compared to both Prolific (M = 0.972, SD = 0.099) and CloudResearch Connect (M = 0.984, SD = 0.049). 34.9% of MTurk respondents (91/261) scored below the standard 0.5 threshold, compared to 1.0% on Prolific. CAPTCHA scores did not significantly differ between flagged and clean respondents on MTurk (0.618 vs. 0.687, t = -1.47, p = .146), suggesting that whatever is producing the poor trap performance on MTurk also produces low CAPTCHA scores but through different mechanisms than the cognitive traps measure.

Completion times. Flagged respondents showed significantly longer median completion times than clean respondents (493.5 seconds vs. 300.0 seconds, t = 4.34, p < .001), though the flagged group also showed extreme variance (SD = 7,820.8 seconds), with some respondents taking hours to complete a survey that typically takes 7 minutes.


#### G.2.6 Choice Deferral

The choice deferral effect did not replicate on MTurk. In the conflict condition, only 1.6% of respondents deferred (2/128), compared to 23.5% on Prolific (119/506). Deferral rates did not differ significantly by condition (χ²(1) = 0.56, p = .455). After removing flagged respondents, zero of the 63 remaining clean respondents deferred in either condition, although the small sample (n = 63) limits the statistical power of this comparison. The near-zero deferral rate across the full MTurk sample mirrors the agent deferral pattern observed in the main study (0.0% dominated, 0.7% conflict), consistent with AI-mediated responses that do not experience the subjective uncertainty driving human choice deferral.


#### G.2.7 Threshold Sensitivity


**Table WA-G3 presents flagging rates under alternative thresholds for the MTurk sample.**


**TABLE WA-G3: THRESHOLD SENSITIVITY ON MTURK (N = 263)**


| Threshold | Flagged | Rate |
| --- | --- | --- |
| 1+ failures | 258 | 98.1% |
| 2+ failures | 244 | 92.8% |
| 3+ failures | 200 | 76.0% (pre-registered) |
| 4+ failures | 130 | 49.4% |
| 5+ failures | 45 | 17.1% |
| 6 failures | 3 | 1.1% |

Even the most lenient threshold (1+ failures) flags 98.1% of MTurk respondents, and the most stringent threshold (6 failures, meaning zero correct) captures 1.1% of the sample (3 respondents). The near-universal failure at the 2+ threshold (92.8%) suggests that the contamination on MTurk is not limited to marginal cases near the three-failure boundary, with most respondents fail multiple traps.


### G.3 CloudResearch Connect Replication


#### G.3.1 Method

We pre-registered the CloudResearch Connect replication on AsPredicted (https://aspredicted.org/ib99fx.pdf) before collecting any data, specifying the same three-failure threshold and two-proportion z-test against Prolific. Participants were recruited from CloudResearch Connect. Data were collected in February 2026.


#### G.3.2 Sample

The CloudResearch Connect sample comprised 506 completed responses (49.6% male, 48.2% female, 1.0% non-binary, 1.2% prefer not to say; Mage = 41.2, SD = 13.6, range 18-95). This demographic composition closely mirrors the Prolific sample (52.7% female, Mage = 44.79). Condition assignment was balanced: 254 (50.2%) in the dominated condition and 252 (49.8%) in the conflict condition. No duplicate respondents were detected.


#### G.3.3 Primary Analysis: Cognitive Trap Flagging Rate

Cognitive traps flagged 9 of 506 CloudResearch Connect respondents (1.8%) at the pre-registered three-failure threshold. This rate is significantly lower than Prolific’s 4.1% (two-proportion z = -2.35, p = .019). The vast majority of respondents scored 6/6 (76.5%) or 5/6 (17.8%), with only 4 respondents scoring below 3 and 5 scoring exactly 3. The mean total score was 5.68 (SD = 0.67), compared to 5.40 on Prolific and 2.65 on MTurk.


**TABLE WA-G4: TOTAL SCORE DISTRIBUTION ON CLOUDRESEARCH CONNECT**


| Score | N | % | Cumulative % |
| --- | --- | --- | --- |
| 6 | 387 | 76.5% | 100.0% |
| 5 | 90 | 17.8% | 23.5% |
| 4 | 20 | 4.0% | 5.7% |
| 3 | 5 | 1.0% | 1.8% (threshold) |
| 2 | 4 | 0.8% | 0.8% |
| 1 | 0 | 0.0% | 0.0% |
| 0 | 0 | 0.0% | 0.0% |


#### G.3.4 Individual Trap Pass Rates

All six traps showed pass rates at or above Prolific levels.


**TABLE WA-G5: INDIVIDUAL TRAP PASS RATES: CLOUDRESEARCH CONNECT VS. PROLIFIC VS. AGENTS**


| Trap | Connect | Prolific | Agents | Connect-Prolific | Connect-Agents |
| --- | --- | --- | --- | --- | --- |
| Modified Cafe Wall | 96.0% (486) | 88.4% (890) | 5.1% (27) + | 7.6 pp + | 90.9 pp |
| Modified Muller-Lyer | 97.4% (493) | 92.8% (934) | 5.9% (31) + | 4.6 pp + | 91.5 pp |
| Modified Ebbinghaus | 97.8% (495) | 95.6% (963) | 22.4% (118) + | 2.2 pp + | 75.4 pp |
| Moving Robot | 85.0% (430) | 77.9% (784) | 0.4% (2) + | 7.1 pp + | 84.6 pp |
| Colliding Oranges | 93.7% (474) | 88.7% (893) | 49.4% (260) + | 5.0 pp + | 44.2 pp |
| Surrounded Planets | 98.2% (497) | 96.5% (972) | 44.5% (234) + | 1.7 pp + | 53.7 pp |
| Average | 94.7% | 90.0% | 21.3% * | *+4.7 pp** * | *+73.4 pp** |


*NOTE. Agent N = 526. Agent pass rates represent pooled performance across four deployed agents.*

CloudResearch Connect respondents performed slightly better than Prolific respondents on every trap, averaging 94.7% versus 90.0%. The Connect-Agents discrimination column shows that all six traps maintain large positive gaps (ranging from +44.2 pp on Colliding Oranges to +91.5 pp on Muller-Lyer), confirming that the traps would effectively separate genuine human respondents from agents on this platform. The average discrimination of +73.4 pp exceeds even Prolific’s +68.7 pp, because CloudResearch respondents outperform Prolific on every trap while agents perform identically across platforms.


#### G.3.5 Behavioral Profile

The 9 flagged CloudResearch respondents showed a profile consistent with genuine humans experiencing difficulty rather than AI contamination. Their CAPTCHA scores (M = 0.978) were virtually identical to clean respondents (M = 0.984, t = -0.39, p = .703), with zero respondents scoring below 0.5 in either group. All 9 flagged respondents passed the obvious attention check, though they showed lower memory check pass rates (66.7% vs. 91.8%) and slightly elevated straight-lining (88.9% vs. 99.4%). Their completion times were marginally longer (M = 506.9 seconds vs. 386.5 seconds, t = 2.09, p = .069), consistent with participants who found the visual tasks genuinely difficult. Five of 9 (55.6%) scored exactly 3, narrowly crossing the failure threshold, while 4 scored 2.


#### G.3.6 Choice Deferral

The choice deferral effect replicated on CloudResearch Connect. In the full sample, 26.6% deferred in the conflict condition compared to 6.7% in the dominated condition (χ²(1) = 34.74, p < .001), a 4.0-fold increase closely matching Prolific’s 4.6-fold increase (24.0% vs. 5.2%). After removing the 9 flagged respondents, deferral rates were virtually unchanged (26.8% vs. 6.5%, χ²(1) = 35.44, p < .001), confirming that the flagged respondents had negligible impact on the substantive findings. This replication provides independent evidence that (a) cognitive traps do not disrupt normal survey responding, because the well-established choice deferral effect emerges with expected effect sizes, and (b) the CloudResearch Connect sample consists overwhelmingly of genuine human respondents.


#### G.3.7 Threshold Sensitivity


**Table WA-G6 presents flagging rates under alternative thresholds for the CloudResearch Connect sample.**


**TABLE WA-G6: THRESHOLD SENSITIVITY ON CLOUDRESEARCH CONNECT (N = 506)**


| Threshold | Flagged | Rate |
| --- | --- | --- |
| 1+ failures | 119 | 23.5% |
| 2+ failures | 29 | 5.7% |
| 3+ failures | 9 | 1.8% (pre-registered) |
| 4+ failures | 4 | 0.8% |
| 5+ failures | 0 | 0.0% |
| 6 failures | 0 | 0.0% |

The CloudResearch distribution mirrors Prolific’s high-quality profile. At the pre-registered three-failure threshold, only 1.8% of respondents are flagged. Even at the more lenient 2+ threshold, the flagging rate remains low at 5.7%, and the 1+ threshold (flagging anyone who failed at least one trap) captures 23.5% of the sample, primarily reflecting the 90 respondents who scored 5/6 (failing only one trap), consistent with normal variation in visual-cognitive ability rather than AI contamination. At the more stringent end, only 4 respondents (0.8%) failed 4 or more traps and none failed 5 or more.


### G.4 Cross-Platform Comparison


#### G.4.1 Flagging Rates


**TABLE WA-G7: COGNITIVE TRAP FLAGGING RATES ACROSS ALL FOUR DATASETS**


| Dataset | N | Flagged | Rate | z vs. Prolific |
| --- | --- | --- | --- | --- |
| Prolific | 1,007 | 41 | 4.1% | (reference) |
| CloudResearch Connect | 506 | 9 | 1.8% | z = -2.35, p = .019 |
| Amazon MTurk | 263 | 200 | 76.0% | z = 26.51, p < .001 |
| Agents | 526 | 511 | 97.1% | z = -36.04, p < .001 |


*NOTE. All pairwise comparisons significant. MTurk vs. CloudResearch: z = 21.96, p < .001; MTurk vs. Agents: z = -9.36, p < .001; CloudResearch vs. Agents: z = -30.63, p < .001.*


**FIGURE WA-G1. CROSS-PLATFORM COMPARISON ACROSS FOUR INDICATORS**


[Image: media/image17.png]


*NOTE. -- (A) Cognitive trap flagging rates range from 1.8% (Connect) to 97.1% (Agents). (B) reCAPTCHA v3 scores: MTurk (0.635) falls well below the 0.5 standard threshold, while other samples score above 0.83. (C) Choice deferral in the conflict condition replicates on Prolific (24.0%) and Connect (26.6%) but is near zero on MTurk (1.6%) and among Agents (0.7%). (D) Traditional attention checks show near-ceiling pass rates on all platforms except MTurk.*

The three-platform comparison reveals extreme variation in suspected AI contamination across recruitment platforms. CloudResearch Connect produced the lowest flagging rate (1.8%), significantly lower than Prolific, suggesting that its participant verification procedures effectively screen out AI-mediated responses. MTurk showed catastrophic contamination: more than three-quarters of respondents failed the pre-registered cognitive trap threshold. This 42-fold gap between MTurk and CloudResearch Connect (76.0% vs. 1.8%) demonstrates that platform choice is a first-order determinant of data quality in online behavioral research.


#### G.4.2 Traditional Attention Check Comparison


**TABLE WA-G8: TRADITIONAL ATTENTION CHECK PASS RATES BY DATASET**


| Check | Prolific | MTurk | Connect | Agents |
| --- | --- | --- | --- | --- |
| IMC (puppy name) | 99.5% | 84.4% | 99.4% | 99.8% |
| Obvious (heart attack) | 99.0% | 55.9% | 100.0% | 99.8% |
| Memory (planet color) | 90.4% | 60.5% | 91.3% | 99.2% |
| Straight-lining (PANAS) | 99.9% | 96.2% | 99.2% | 98.7% |


*NOTE. Agent N = 526.*

The Agent column reveals a paradox: agents outperform MTurk respondents on every traditional attention check. The IMC gap is particularly large, with agents at 99.8% versus MTurk at 84.4%. The obvious check shows the starkest contrast: agents pass at 99.8% while MTurk achieves only 55.9%, meaning MTurk respondents perform worse than AI agents on a question designed to catch inattentive humans. This pattern is consistent with a heterogeneous mix of data quality threats on MTurk, because a purely agent-driven sample would show near-perfect traditional check performance alongside near-universal cognitive trap failure.

The method independence analysis (Section G.4.5) sharpens this picture: 44.5% of the 200 MTurk respondents flagged by cognitive traps passed all traditional attention checks, a behavioral profile consistent with vision-enabled agents that handle text-based screening effortlessly while failing visual-cognitive tasks. The remaining 55.5% failed both cognitive traps and traditional checks, a profile more consistent with the careless and invalid responding that Kay (2025) documented on MTurk, where 96% of semantic antonym pairs were positively correlated even among “high-reputation” workers. The MTurk sample thus appears to reflect at least three distinct respondent populations: a small minority of attentive humans (approximately 24% who passed cognitive traps), respondents whose profiles resemble sophisticated AI agents (passing traditional checks but failing cognitive traps), and respondents exhibiting careless or automated responding patterns (failing both). Whether the latter group represents simple bots, click farm workers, or deeply inattentive humans cannot be determined from our data alone, but the population-level pattern is consistent with the severe data quality degradation that multiple independent studies have now documented on the platform (Douglas et al. 2023; Kay 2025; Webb and Tangney 2022).


#### G.4.3 Choice Deferral Comparison


**TABLE WA-G9: CHOICE DEFERRAL IN CONFLICT CONDITION BY DATASET**


| Dataset | N (conflict) | Deferral Rate | χ² (condition effect) |
| --- | --- | --- | --- |
| Prolific (full) | 506 | 23.5% | χ² = 67.13, p < .001 |
| Prolific (clean only) | 484 | 24.0% | χ² = 66.83, p < .001 |
| CloudResearch (full) | 252 | 26.6% | χ² = 34.74, p < .001 |
| CloudResearch (clean) | 250 | 26.8% | χ² = 35.44, p < .001 |
| MTurk (full) | 128 | 1.6% | χ² = 0.56, p = .455 |
| MTurk (clean only) | 35 | 0.0% | N/A (zero cells) |
| Agents | 268 | 0.7% | χ² = 0.46, p = .495 |

The choice deferral results provide a second independent validation signal. Prolific and CloudResearch Connect produce nearly identical deferral rates (23.5% and 26.6%) that replicate the classical finding from Dhar (1997). MTurk produces near-zero deferral, mirroring the agent pattern from the main study (0.7% in conflict condition). This convergence suggests that a substantial proportion of MTurk respondents do not experience the subjective uncertainty that drives human choice deferral, a pattern consistent with either AI-mediated responding or the extreme inattentiveness documented on the platform (Kay 2025).


#### G.4.4 reCAPTCHA Score Comparison


| Dataset | Mean | SD | Median | Below 0.5 |
| --- | --- | --- | --- | --- |
| Prolific | 0.972 | 0.099 | 1.000 | 1.0% |
| CloudResearch Connect | 0.984 | 0.049 | 1.000 | 0.0% |
| Amazon MTurk | 0.635 | 0.320 | 0.800 | 34.9% |
| Agents | 0.833 | 0.154 | 0.900 | 4.6% |

MTurk CAPTCHA scores (M = 0.635) are substantially lower than both Prolific (0.972) and CloudResearch (0.984), and lower even than the agent distribution (M = 0.833). Over a third of MTurk respondents score below the standard 0.5 threshold (34.9%), compared to near-zero on Prolific (1.0%) and CloudResearch (0.0%), and 4.6% of agents. The fact that MTurk respondents produce lower CAPTCHA scores than deployed AI agents is consistent with the heterogeneous mix interpretation: LLM-based agents generate browsing behavior that reCAPTCHA tends to score favorably (agent median 0.900), whereas simpler automated systems or highly careless respondents produce the anomalous interaction patterns that reCAPTCHA was designed to detect. The MTurk distribution, which likely blends multiple respondent types, falls below the agent average because it includes a substantial component that neither modern LLM agents nor attentive humans would produce.


#### G.4.5 Method Independence on New Platforms

On MTurk, cognitive trap flagging and traditional check failure are statistically independent (χ²(1) = 0.28, p = .598, phi = .033). Of the 200 respondents flagged by cognitive traps, 44.5% (89/200) passed all traditional attention checks. This independence on a contaminated platform strengthens the argument that traditional methods fail to detect the type of threat cognitive traps capture. On CloudResearch Connect, the two methods show a modest association (χ²(1) = 8.39, p = .004, phi = .129), with 5 of 9 flagged respondents (55.6%) passing all traditional checks. The stronger association on CloudResearch likely reflects the very low base rates, where the few flagged respondents are genuine humans whose visual-cognitive difficulties correlate with attention check difficulty.


## WEB APPENDIX H: COMPUTATIONAL COST AND EFFICIENCY ANALYSIS


### H.1 Overview

The main article reports that neither computational cost nor inference time predicts accuracy across models. This appendix provides the full empirical foundation for that claim by analyzing cost, duration, and token consumption data from all 2,040 trials (34 models x 6 traps x 10 trials). Every trial records the model’s API cost in USD, response duration in seconds, and input/output token counts. All data and analysis code are available at https://osf.io/f2jhx/overview?view_only=ab7ece0d719642fe9e62b00afade9b11.


### H.2 Model-Level Cost-Accuracy Analysis

Across 34 models, accuracy shows no significant correlation with average cost per trial (r = .23, p = .18; Spearman rho = .17, p = .33), average response duration (r = .14, p = .417), or average output token count (r = .15, p = .396). Models that cost more, take longer, or produce more tokens do not achieve higher accuracy on cognitive traps.

The most cost-efficient model is also the most accurate: Gemini 3 Flash with extended thinking achieves 65.0% accuracy at $0.0002 per trial, while the most expensive model, Claude Opus 4.6 with extended thinking, achieves 40.0% at $0.0476 per trial (264 times the cost for 25 fewer percentage points). Claude Haiku 3.0, the oldest and cheapest Anthropic model in the sample ($0.0003 per trial), outperforms Claude Opus 4.5 ($0.0199 per trial), a model released 20 months later at 66 times the cost, by a margin of 40.0% to 16.7%. These paradoxes illustrate that cognitive trap accuracy reflects architectural properties, not computational investment.

The generational trajectory reinforces this conclusion. Grouping models into three cohorts by release date (early: through month 9, 4 models; middle: months 10-19, 12 models; late: months 20+, 18 models) reveals a non-monotonic V-shaped pattern: mean accuracy falls from 30.4% in the earliest cohort to 15.7% in the middle cohort before recovering to 31.8% in the latest cohort. Model improvement is neither linear nor guaranteed, because each new architecture reconfigures which constraints it resolves and which it introduces. The middle-generation dip coincides with models that gained general reasoning capability at the expense of visual processing fidelity, while later models partially recovered through architectural innovations in multimodal integration. This non-monotonicity is precisely what the architectural constraints framework predicts: because each trap targets a specific processing limitation, progress on one dimension can coincide with regression on another, and no single release cycle is likely to resolve all constraint types simultaneously.

Providers also differ substantially in how variable their models are across traps. Averaging across each provider’s models, the mean per-model cross-trap standard deviation is 43.5 percentage points for Anthropic, 32.0 for OpenAI, and 29.1 for Google. Anthropic’s models are the most “spiky,” performing well on some traps and failing completely on others, while Google’s models show the most uniform (though generally low) performance across constraint types. This provider-specific variability means that a trap battery validated against one provider’s models may not generalize to another’s without separate testing.


**FIGURE WA-H1. AVERAGE COST PER TRIAL VERSUS ACCURACY ACROSS 34 MODELS**


[Image: media/image18.png]


*NOTE. -- Colors indicate provider (Anthropic, OpenAI, Google); diamonds indicate extended thinking variants. The dashed regression line is essentially flat (r = .23, p = .18), confirming that computational expenditure does not predict cognitive trap performance. The dotted line marks the 86.8% human baseline.*


**Table WA-H1 presents the complete model ranking by accuracy, with cost and duration data for each model. Cost per trial spans three orders of magnitude, from $0.00005 (Gemini 2.5 Flash Lite) to $0.0476 (Claude Opus 4.6 with extended thinking), yet this 950-fold range in computational expenditure produces no systematic accuracy advantage.**


**TABLE WA-H1: MODEL-LEVEL COMPUTATIONAL EFFICIENCY (RANKED BY ACCURACY)**


| Model | Provider | Accuracy | Cost/Trial | Avg Duration | Avg Output Tokens |
| --- | --- | --- | --- | --- | --- |
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


*NOTE. † = extended thinking variant. Cost/Trial = mean API cost per single-trap trial. Duration = mean response time per trial. Output Tokens = mean tokens generated per response.*


### H.3 Constraint-Specific Computational Signatures

The aggregate null result masks a constraint-specific pattern that reveals why computational investment fails to predict overall accuracy. Table WA-H2 compares correct and incorrect trials by constraint type.


**TABLE WA-H2: COMPUTATIONAL SIGNATURES BY CONSTRAINT TYPE**


| Constraint | Traps | N Correct | N Wrong | Dur (Correct) | Dur (Wrong) | Dur d | Cost (Correct) | Cost (Wrong) | Cost d |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Training Data Overfitting | 3 | 280 | 740 | 4.2s | 4.8s | −0.11 | $0.0040 | $0.0043 | −0.03 |
| Spatial Reasoning | 1 | 103 | 237 | 20.0s | 7.7s | +0.57 | $0.0310 | $0.0050 | +1.03 |
| Cross-Modal Binding | 1 | 128 | 212 | 12.8s | 5.5s | +0.77 | $0.0134 | $0.0074 | +0.35 |
| Spatiotemporal Reasoning | 1 | 18 | 322 | 3.9s | 6.0s | −0.32 | $0.0016 | $0.0056 | −0.48 |


*NOTE. Cohen’s d is positive when correct trials are longer/costlier, negative when incorrect trials are. Training Data Overfitting includes Modified Cafe Wall, Modified Muller-Lyer, and Modified Ebbinghaus. Spatial Reasoning = Colliding Oranges. Cross-Modal Binding = Surrounded Planets. Spatiotemporal Reasoning = Moving Robot.*

Training data overfitting traps show negligible computational signatures (duration d = −0.11, cost d = −0.03). Models either have the correct prior or they do not, and additional processing neither helps nor hurts. The failure mechanism is a memorized association (e.g., applying the canonical Muller-Lyer interpretation to a modified stimulus), and more computation simply reinforces the wrong answer.

Spatial reasoning and cross-modal binding traps show the opposite pattern: correct trials take 2.6 and 2.3 times longer than incorrect trials, with medium-to-large effect sizes (d = +0.57 and +0.77 for duration). These traps require genuine spatial inference (predicting trajectory intersections, integrating textual and visual information), and models that allocate more processing to these tasks perform better. The cost effect is especially pronounced for the Colliding Oranges trap (d = +1.03), where correct answers cost six times more on average ($0.031 vs. $0.005).

The spatiotemporal reasoning trap (Moving Robot) shows a near-floor pass rate of 5.3% regardless of computational investment. Only 18 of 340 trials were correct, and 9 of these came from a single model (Claude Haiku 3.0, the oldest in the sample). The constraint is architectural: models cannot infer motion from a static image, and no amount of processing resolves this limitation.

Within-model point-biserial correlations between duration and accuracy confirm that these constraint-specific patterns operate at the individual model level, not merely across models. Of 34 models, 10 show a significant positive correlation (longer responses are more often correct, p < .05), 7 show a significant negative correlation (shorter responses are more often correct), and 17 show no significant relationship. The positive correlations concentrate in models that pass reasoning traps (where deliberation helps), while the negative correlations appear in models that pass only overfitting traps (where fast, memorized responses happen to be correct). This within-model heterogeneity mirrors the between-constraint patterns in Table WA-H2.

These opposing signatures cancel in the aggregate, producing the null correlation reported in Section H.2. The null is therefore not an absence of signal but a composition of three distinct patterns that happen to average to zero across the full trap battery.


### H.4 Extended Thinking: Cost-Benefit Analysis

web appendix C.4 reports that extended thinking improves accuracy by a mean of +8.8 percentage points across 12 paired comparisons. Table WA-H3 extends that analysis with cost and duration data.


**TABLE WA-H3: EXTENDED THINKING COST-BENEFIT**


| Base Model | Provider | Std Acc | Think Acc | Diff | Cost Mult | Std Duration |
| --- | --- | --- | --- | --- | --- | --- |
| Think Duration | Gemini 2.5 Pro | Google | 15.0% | 1.7% | −13.3 pp | 1.0x |
| 4.8s | 10.5s | Gemini 2.5 Flash | Google | 1.7% | 6.7% | +5.0 pp |
| 1.1x | 3.1s | 6.8s | Gemini 2.5 Flash Lite | Google | 18.3% | 46.7% |
| +28.3 pp | 1.0x | 2.5s | 5.0s | GPT-5 | OpenAI | 16.7% |
| 28.3% | +11.7 pp | 12.2x | 2.0s | 25.9s | Claude Sonnet 4.5 | Anthropic |
| 16.7% | 46.7% | +30.0 pp | 1.9x | 4.3s | 8.8s | Claude Haiku 4.5 |
| Anthropic | 33.3% | 31.7% | −1.7 pp | 2.1x | 1.8s | 4.6s |
| Claude Opus 4.5 | Anthropic | 16.7% | 36.7% | +20.0 pp | 1.9x | 3.7s |
| 7.6s | GPT-5.1 | OpenAI | 28.3% | 8.3% | −20.0 pp | 0.8x |
| 3.8s | 2.6s | Gemini 3 Flash | Google | 36.7% | 65.0% | +28.3 pp |
| 1.0x | 4.1s | 7.5s | GPT-5.2 | OpenAI | 31.7% | 48.3% |
| +16.7 pp | 0.7x | 5.8s | 2.0s | Claude Opus 4.6 | Anthropic | 33.3% |
| 40.0% | +6.7 pp | 2.4x | 4.1s | 11.2s | Claude Sonnet 4.6 | Anthropic |
| 23.3% | 16.7% | −6.7 pp | 0.9x | 2.8s | 2.2s | Mean |
|  | 22.6% | 31.4% | +8.8 pp | 2.3x |  |  |


*NOTE. Cost Mult = ratio of thinking cost to standard cost per trial. Duration is the mean response time per trial. Positive differences indicate thinking improves performance.*

Extended thinking costs 2.3 times more on average but produces only an 8.8 percentage-point accuracy gain that is not statistically significant (paired t = 1.81, p = .098). The cost multiplier varies dramatically across providers: Google’s thinking variants cost essentially the same as their standard counterparts (1.0x), while GPT-5’s thinking variant costs 12.2 times more. Anthropic models fall between (1.9-2.4x). When thinking does improve accuracy, the gains are large (Claude Sonnet 4.5: +30.0 pp, Gemini 3 Flash: +28.3 pp), but in 4 of 12 pairs thinking actually decreases accuracy, sometimes substantially (GPT-5.1: −20.0 pp). This inconsistency means that researchers validating traps against thinking models cannot reliably predict which direction the effect will go.

Token generation patterns provide additional insight into the thinking mechanism. Across all 12 thinking model variants, correct trials produce a mean of 308 output tokens compared to 164 for incorrect trials (t = 3.87, p < .001). However, this difference is driven by a subset of models that generate substantially more reasoning traces on successful trials; the median output tokens are identical (13) for correct and incorrect trials (Mann-Whitney p = .098). The implication is that when extended thinking helps, it does so by producing genuinely longer chains of reasoning rather than by producing uniformly more output. Models that benefit from thinking mode engage in substantively different processing on the trials they get right, while models that do not benefit show no token differential. This pattern is consistent with extended thinking providing an advantage only when the model’s architecture can already partially represent the required spatial or cross-modal computation, giving the thinking chain something productive to elaborate on.


### H.5 Trial-Level Consistency

Across 204 model-trap pairs (34 models x 6 traps), each tested over 10 independent trials, 74.0% produced all-or-nothing outcomes: 59.3% scored 0/10 (complete failure across all trials) and 14.7% scored 10/10 (perfect accuracy). Only 26.0% of pairs showed intermediate scores. This strongly bimodal distribution indicates that model behavior on cognitive traps is largely deterministic rather than probabilistic. When a model encounters a trap it can pass, it passes consistently; when it encounters one it cannot, it fails consistently. Stochastic variation (e.g., 5/10 scores) is rare.

This determinism has two implications. First, it strengthens the architectural constraints interpretation: if failures were due to random processing noise, intermediate scores would be common. The all-or-nothing pattern indicates that models either possess or lack the specific capability each trap tests. Second, it means that even small test batteries (as few as 10 trials per trap) produce reliable classification, because the underlying behavior shows low variance.


### H.6 Practical Deployment Costs

The entire 34-model validation cost $13.78 across all 2,040 trials, broken down by provider as follows: Anthropic (12 models) accounted for $9.08 (65.9%), OpenAI (12 models) for $4.50 (32.6%), and Google (10 models) for $0.21 (1.5%). Google’s API pricing makes large-scale model testing essentially free, while even the full Anthropic suite costs less than a single hour of research assistant time.

For researchers applying cognitive traps as a screening tool, the cost is negligible: each trap trial costs $0.007 on average, meaning a three-trap battery validated against 10 models costs under $0.21. This compares favorably to the $1.40 per-participant compensation on Prolific. Validating trap effectiveness against newly released models requires minimal marginal investment, supporting the ongoing monitoring strategy recommended in the main article.


## WEB APPENDIX I: DEMOGRAPHIC AND ROBUSTNESS ANALYSES


### I.1 Overview

Vision-based detection tasks risk confounding AI contamination with legitimate visual processing difficulties. This appendix examines whether demographic characteristics systematically affect cognitive trap failure rates, and whether primary findings remain robust after accounting for potential confounds.


### I.2 Vision Impairment

Vision impairment showed the strongest association with cognitive trap failure among all demographic variables examined.


**TABLE WA-I1: VISION IMPAIRMENT AND COGNITIVE TRAP FAILURE**


| Vision Status | N | Failed 3+ Traps | Failure Rate | Relative Risk |
| --- | --- | --- | --- | --- |
| No impairment | 980 | 37 | 3.8% | Reference |
| Uncorrected impairment | 12 | 3 | 25.0% | 6.58x |
| Unsure | 14 | 0 | 0.0% | – |
| Prefer not to say | 1 | 1 | 100.0% | – |


*NOTE. Chi-square test: χ²(3) = 37.8, p < .001.*

Participants reporting uncorrected vision impairments showed a 6.58-fold higher failure rate (25.0% vs. 3.8%). However, 75% of vision-impaired participants (9/12) still passed the threshold, suggesting that cognitive traps produce failures only in cases of moderate-to-severe impairment.

Effect on primary findings. Excluding vision-impaired participants reduced apparent contamination from 4.1% to 3.8% (3 fewer participants flagged). The choice deferral effect size changed minimally: Phi = .261 (full sample) versus Phi = .263 (vision-excluded), a difference of +.002 representing 0.8% change. This negligible impact reflects the low base rate of vision impairment (1.2% of sample).


### I.3 Age

Age showed a non-significant overall correlation with cognitive trap performance (r = -.05, p = .131; two respondents with implausible age values were excluded from this calculation), and the relationship is U-shaped, with the lowest failure rates in middle age groups.


**TABLE WA-I2: COGNITIVE TRAP FAILURE RATES BY AGE GROUP**


| Age Group | N | Failed 3+ | Failure Rate |
| --- | --- | --- | --- |
| 18-30 | 168 | 13 | 7.7% |
| 31-40 | 271 | 4 | 1.5% |
| 41-50 | 232 | 8 | 3.4% |
| 51-60 | 178 | 8 | 4.5% |
| 61+ | 156 | 8 | 5.1% |

The youngest age group (18-30) showed the highest failure rate at 7.7%, contradicting the concern that cognitive traps would systematically exclude older adults. The pattern is U-shaped, with the lowest failure rate in the 31-40 group (1.5%) and gradual increases in both younger and older groups. The elevated rate among younger participants may reflect greater familiarity with AI tools and willingness to experiment with agent-based completion, though device differences or cohort effects cannot be ruled out.


#### Per-Trap Performance by Age Group


**Table WA-I3 shows human pass rates on individual traps across age groups, revealing which traps show the most age sensitivity.**


**TABLE WA-I3: HUMAN PASS RATE BY TRAP AND AGE GROUP**


| Age | Cafe Wall | M-L | Ebb | Robot | Oranges | Planets |
| --- | --- | --- | --- | --- | --- | --- |
| 18-30 | 86.9% | 91.7% | 95.8% | 77.4% | 83.3% | 95.8% |
| 31-40 | 95.2% | 93.7% | 97.4% | 82.3% | 88.6% | 96.7% |
| 41-50 | 86.6% | 94.4% | 97.0% | 79.7% | 89.2% | 97.0% |
| 51-60 | 86.5% | 89.3% | 95.5% | 73.0% | 92.7% | 97.2% |
| 61+ | 82.7% | 93.6% | 90.4% | 73.7% | 89.7% | 95.5% |

The Moving Robot shows the most age sensitivity, with pass rates declining from 82.3% (ages 31-40) to 73.0% (ages 51-60). The Ebbinghaus shows the clearest decline in the 61+ group (90.4% vs. approximately 97% for other groups). Overall, age effects are modest, and no single trap drives the U-shaped pattern in overall failure rates.


### I.4 Gender

Gender showed no significant association with cognitive trap failure rates (χ²(3) = 1.15, p = .766). Males showed a 4.7% failure rate compared to 3.6% for females, a nonsignificant 1.1 percentage point difference with overlapping confidence intervals. Because cognitive traps involve spatial and visual processing tasks where gender differences have been documented in other contexts, this null finding is informative: it suggests that the specific visual-cognitive operations tested by our traps (binding features to objects, extrapolating trajectories, recognizing modified illusions) do not produce systematic gender-based disadvantages at the thresholds used for classification.


### I.5 Color Blindness

Color blindness showed a small, non-significant elevation in failure rates (χ²(3) = 4.95, p = .175).


**TABLE WA-I4: COLOR BLINDNESS AND COGNITIVE TRAP FAILURE**


| Color Vision | N | Failed 3+ | Failure Rate | Not color blind |
| --- | --- | --- | --- | --- |
| 970 | 38 | 3.9% | Color blind | 14 |
| 1 | 7.1% | Unsure | 19 | 1 |
| 5.3% | Prefer not to say | 4 | 1 | 25.0% |

The small sample of color-blind participants (N = 14) limits statistical power. Only one additional person in the color-blind group failed compared to base rates. The Colliding Oranges trap is the most likely source of difficulty for color-blind participants because it requires distinguishing the “largest orange circle” from the “smallest yellow circle” among multiple colored shapes, a task that may be challenging for participants with red-green color deficiency.


### I.6 Comprehensive Sensitivity Analysis

Excluding all participants who failed at least one traditional attention check, reported color blindness, or reported uncorrected vision impairment totaled 130 participants (12.9% of sample), reducing apparent contamination from 4.1% to 3.3% (29/877). The choice deferral effect size changed to Phi = .259, a decrease of -.002 compared to the full sample.

The filtering reduced effect sizes, suggesting that demographic exclusions remove legitimate variance in human responding, consistent with the benign interpretation of flagged participants. This pattern is consistent with the three-group analysis reported in the main text (web appendix F provides full details), which demonstrates that most flagged participants show human-like decision times and traditional check performance.


### I.7 Recommendations for Demographic Considerations

We recommend that researchers: (1) include vision screening questions in surveys alongside cognitive traps, (2) conduct sensitivity analyses with and without vision-impaired participants, (3) report both analyses when results are substantively identical, and (4) retain the full sample for primary analyses while acknowledging that individual false positives may occur among participants with visual processing differences.

For studies where visual perception directly relates to the research question (e.g., package design evaluation, visual aesthetics research), exclusion of vision-impaired participants makes stronger sense for both data quality and construct validity. For studies where the research question does not involve visual processing, inclusion with sensitivity analysis is preferable to maintain sample representativeness.


## REFERENCES – WEB APPENDIX

Brinkmann, Levin, Fabian Baumann, Jean-François Bonnefon, Maxime Derex, Thomas F. Müller, Anne-Marie Nussberger, Agnieszka Czaplicka, Alberto Acerbi, Thomas L. Griffiths, Joseph Henrich, Joel Z. Leibo, Richard McElreath, Pierre-Yves Oudeyer, Jonathan Stray, and Iyad Rahwan (2023), “Machine Culture,” Nature Human Behaviour, 7(11), 1855–68.

Campbell, Declan, Sunayana Rane, Tyler Giallanza, Nicolò De Sabbata, Kia Ghods, Amogh Joshi, Alexander Ku, Steven M. Frankland, Thomas L. Griffiths, Jonathan D. Cohen, and Taylor Webb (2024), “Understanding the Limits of Vision Language Models Through the Lens of the Binding Problem,” in Proceedings of the 38th International Conference on Neural Information Processing Systems, Red Hook, NY, USA: Curran Associates Inc., https://arxiv.org/abs/2411.00238.

Dhar, Ravi (1997), “Consumer Preference for a No-Choice Option,” Journal of Consumer Research, 24(2), 215–31.

Douglas, Benjamin D., Patrick J. Ewell, and Markus Brauer (2023), “Data Quality in Online Human-Subjects Research: Comparisons Between MTurk, Prolific, CloudResearch, Qualtrics, and SONA,” PLOS ONE, 18(3), e0279720.

Guo, Xuyang, Zekai Huang, Zhenmei Shi, Zhao Song, and Jiahao Zhang (2025), “Your Vision-Language Model Can’t Even Count to 20: Exposing the Failures of VLMs in Compositional Counting,” https://arxiv.org/abs/2510.04401.

Kamath, Amita, Jack Hessel, and Kai-Wei Chang (2023), “What’s ‘up’ with Vision-Language Models? Investigating Their Struggle with Spatial Reasoning,” http://arxiv.org/abs/2310.19785.

Kay, Cameron S. (2025), “Why You Shouldn’t Trust Data Collected on MTurk,” Behavior Research Methods, 57, 340.

Qi, Jianing, Jiawei Liu, Hao Tang, and Zhigang Zhu (2025), “Beyond Semantics: Rediscovering Spatial Awareness in Vision-Language Models,” http://arxiv.org/abs/2503.17349.

Rahwan, Iyad, Manuel Cebrian, Nick Obradovich, Josh Bongard, Jean-François Bonnefon, Cynthia Breazeal, Jacob W. Crandall, Nicholas A. Christakis, Iain D. Couzin, Matthew O. Jackson, Nicholas R. Jennings, Ece Kamar, Isabel M. Kloumann, Hugo Larochelle, David Lazer, Richard McElreath, Alan Mislove, David C. Parkes, Alex Pentland, Margaret E. Roberts, Azim Shariff, Joshua B. Tenenbaum, and Michael Wellman (2019), “Machine Behaviour,” Nature, 568(7753), 477–86.

Shinozaki, Taiga, Tomoki Doi, Amane Watahiki, Satoshi Nishida, and Hitomi Yanaka (2025), “Do Large Vision-Language Models Distinguish Between the Actual and Apparent Features of Illusions?” in Proceedings of the 47th Annual Meeting of the Cognitive Science Society, https://arxiv.org/abs/2506.05765.

Stogiannidis, Ilias, Steven McDonagh, and Sotirios A. Tsaftaris (2025), “Mind the Gap: Benchmarking Spatial Reasoning in Vision-Language Models,” http://arxiv.org/abs/2503.19707.

Ullman, Tomer (2024), “The Illusion-Illusion: Vision Language Models See Illusions Where There Are None,” http://arxiv.org/abs/2412.18613.

Watson, David, Lee Anna Clark, and Auke Tellegen (1988), “Development and Validation of Brief Measures of Positive and Negative Affect: The PANAS Scales,” Journal of Personality and Social Psychology, 54(6), 1063–70.

Webb, Margaret A. and June P. Tangney (2022), “Too Good to Be True: Bots and Bad Data from Mechanical Turk,” Perspectives on Psychological Science, 19(2), 233–50.

Zhou, Jijie and Yuhan Hu (2025), “Beyond Words: Infusing Conversational Agents with Human-Like Typing Behaviors,” https://arxiv.org/abs/2510.08912.

Zhou, Shijie, Alexander Vilesov, Xuehai He, Ziyu Wan, Shuwang Zhang, Aditya Nagachandra, Di Chang, Dongdong Chen, Xin Eric Wang, and Achuta Kadambi (2025), “VLM4D: Towards Spatiotemporal Awareness in Vision Language Models,” https://arxiv.org/abs/2508.02095.
