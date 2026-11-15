---
title: "Interdependent conditions for successful human-AI delegation"
authors: "Felipe M. Affonso, Mark Steyvers"
journal: "Trends in Cognitive Sciences"
year: 2026
doi: "10.1016/j.tics.2026.10.007"
citation: "Affonso, Felipe M. and Mark Steyvers (2026), \"Interdependent Conditions for Successful Human-AI Delegation,\" Trends in Cognitive Sciences. https://doi.org/10.1016/j.tics.2026.10.007"
version: "Accepted manuscript (TICS-D-26-00180R2, accepted 2026-10-20), before copyediting"
license: "CC BY-NC-ND 4.0, https://creativecommons.org/licenses/by-nc-nd/4.0/"
---

> **Disclaimer:** This is a machine-readable conversion of the accepted manuscript (after peer review, before copyediting) of the published paper, for use with AI tools. It may contain conversion errors in formatting or tables, and the published version may differ in wording after copyediting. Always verify against the [published version](https://doi.org/10.1016/j.tics.2026.10.007). Figures are replaced by written descriptions (alt text plus a long description); the images themselves are in the [PDF of the accepted manuscript](https://felipemaffonso.com/files/papers/human-ai-delegation-accepted-manuscript.pdf).
>
> © 2026. This manuscript version is made available under the CC-BY-NC-ND 4.0 license https://creativecommons.org/licenses/by-nc-nd/4.0/

```bibtex
@article{affonso2026delegation,
  author  = {Affonso, Felipe M. and Steyvers, Mark},
  title   = {Interdependent Conditions for Successful Human-{AI} Delegation},
  journal = {Trends in Cognitive Sciences},
  year    = {2026},
  doi     = {10.1016/j.tics.2026.10.007}
}
```

**Interdependent conditions for successful human-AI delegation**

Felipe M. Affonso^1,\*^, Mark Steyvers^2^

^1^Spears School of Business, Oklahoma State University, 316 Business Building, Stillwater, OK 74078, USA

^2^Department of Cognitive Sciences, University of California, Irvine, 2566 Social & Behavioral Sciences Gateway, Irvine, CA 92697, USA

\*Correspondence: <felipe.affonso@okstate.edu>

**Highlights**

- AI systems now perform consequential work across medicine, software, and science, and autonomous agents increasingly execute entire workflows without step-by-step human review.

- Experiments and meta-analyses reveal a tension: AI assistance produces real productivity gains, yet human-AI teams often perform worse than the better partner alone.

- This Review identifies four conditions for successful delegation: accurate assessment of AI capabilities, calibrated uncertainty communication, sustained monitoring capacity, and compatible task structure.

- New evidence connects them: human and AI metacognition jointly shape trust calibration, AI feedback shapes human mental models, and AI assistance can erode the skills that oversight depends on.

- The EU AI Act will require effective human oversight of high-risk AI from December 2027 without specifying what oversight demands of human cognition.

**Abstract**

People increasingly rely on AI systems for consequential tasks, from clinical diagnosis to software development. The gains are real yet difficult to realize reliably. We identify four psychological and structural conditions for successful delegation: accurate human assessment of AI capabilities, calibrated AI uncertainty communication, sustained human monitoring capacity, and compatible task structure. Each condition is well studied, yet we propose that they form an interdependent system in which each one's effectiveness depends on the state of the others. Because these dependencies are bidirectional, we suggest they can compound over time into virtuous cycles or cascading degradation, and improving any single condition can fail or shift the bottleneck. These dynamics should intensify as AI moves from advisory roles to autonomous agents.

**Keywords:** human-AI collaboration, delegation, AI metacognition, calibrated uncertainty, complementarity, deskilling

# The rise of delegation

People increasingly hand consequential work to AI systems. We call this reliance **delegation**: any workflow in which a human relies on an AI system to perform or inform a task. The gains are well documented: generative AI raises the productivity of writers \[1\] and customer-service workers \[2\], and experiments across three firms and 4,867 developers show that coding assistants increase completed tasks by roughly 26% \[3\]. This reliance is also widening, because AI is shifting from an advisory role, in which a human reviews each recommendation, toward autonomous agents that plan, act, and iterate with little human involvement \[4,5\]. Coding agents already resolve a majority of tasks on some standardized software-engineering benchmarks \[6,7\], and the length of tasks they complete autonomously has been doubling roughly every seven months \[8\].

Alongside these gains sits growing evidence that delegation often fails to deliver them. A randomized controlled trial with experienced open-source developers found that AI assistance made them 19% slower while leaving them convinced they had been 20% faster, a gap between perceived and actual performance that is central to delegation \[9\]. A meta-analysis of 106 human-AI experiments found that, in decision-making tasks, the human-AI team often performed worse than the better of the two alone \[10\]. Because these failures coexist with strong gains, the conditions under which AI capability is deployed, more than the capability itself, appear to determine whether delegation succeeds. When those conditions are right, collaboration can produce **complementarity**, with the team outperforming either agent alone \[11--13\]. When they are wrong, capable AI can make outcomes worse.

Understanding these conditions has become urgent. The EU AI Act requires "effective human oversight" of high-risk AI systems beginning in December 2027, yet specifies little about what oversight demands of human cognition \[14\]. The research base that should supply the answer rests largely on advisory paradigms in which a human evaluates one recommendation at a time \[15,16\].

Supplying that answer depends on cognitive science, because successful delegation requires people to judge the limits of their own knowledge, infer the competence boundaries of an AI system, interpret uncertainty signals, sustain attention to outputs they did not generate, and decide when a task is structured well enough to hand off. These are core problems of metacognition, confidence, attention, learning, and cognitive control \[15,17--20\]. At the same time, delegation cannot be understood from cognitive science alone: the human-factors literature shows how workload, interface design, and organizational routines shape whether oversight can be sustained in practice, while machine learning defines the capabilities and uncertainty signals to which humans must adapt. This narrative, conceptual Review synthesizes evidence from cognitive science, human factors, and machine learning to ask how human judgment, AI system behavior, and task structure jointly support reliable performance. We use this framing to identify four conditions for successful delegation. Although each condition is well studied on its own, we propose that they form an interdependent system whose dynamics can strengthen or erode delegation over time. The following sections define delegation and its two workflows, review each condition, trace the channels through which the conditions depend on one another, extend the analysis to scientific discovery and autonomous agents, and close with design principles and outstanding questions.

# What delegation means

Delegation spans settings where the human retains full control and reviews every AI output, and settings where control is largely ceded. Two distinct workflows fall under this umbrella and create different demands on human cognition. In **AI-assisted decision-making**, the AI produces a recommendation that the human inspects before acting: a radiologist reviewing an AI-flagged chest X-ray \[21,22\], or a programmer evaluating suggested code completions. The human makes the final decision and, in principle, can override the AI, so that decision authority remains with the human. In **agentic delegation**, the AI executes tasks and takes action without human inspection of each step: an autonomous vehicle navigating traffic, an AI agent booking travel, or a coding assistant generating and committing code. Here the human shifts from reviewing individual outputs to setting goals and monitoring aggregate outcomes, and cedes far more control.

Both workflows involve a human choosing to rely on AI \[23\], yet they differ in when oversight is feasible \[24\]. The person also chooses what form of support to receive, and many deployed systems, coding assistants among them, fall between the two workflows. Recent work formalizes this continuum, proposing five levels of escalating agent autonomy analogous to the SAE levels for autonomous vehicles \[25\]. When the human reviews each output, monitoring and verification do most of the work \[26\]. When oversight is infeasible, the primary safeguards are the initial delegation decision and what we call the task's structural compatibility: whether its outputs can be checked, whether it tolerates more than one acceptable answer, and whether it reveals when the AI is likely to fail. The conditions we describe below apply across both workflows, though their relative importance shifts, and because most empirical evidence comes from AI-assisted decision-making paradigms \[15\], our analysis draws most heavily on that setting, noting where agentic workflows differ.

# Four conditions for successful delegation

We organize the requirements for effective delegation into four conditions (Table 1), and define each below. We chose these four conditions because together they cover every party to a delegation: two describe the human (assessing before the handoff, monitoring after it), one describes the AI system (the uncertainty it communicates), and one describes the task itself. We acknowledge that effective delegation also depends on other factors, such as cognitive motivation, time pressure, and organizational context, but we consider them as context that changes how the four conditions unfold. Other aspects, such as explainability and the capacity to intervene, are not separate conditions here but work through the four conditions: explainability helps where it supports verification, and the capacity to intervene begins with the monitoring that detects the need for it.

## Accurate delegation assessment

Successful delegation begins with the human correctly assessing whether a specific task is suitable for AI involvement (Figure 1A). This assessment requires metacognition applied to a novel problem: evaluating one's own competence, already imperfect \[18,19\], and the AI's competence boundaries, often opaque. Humans form "theories of machine" about AI capabilities, built by metacognitive judgment together with feedback, memory, and experience with the system, and these mental models can be systematically biased. People tend to overestimate AI performance relative to their own and to expect AI abilities to be more correlated across task categories than they actually are \[27\]. LLMs compound the difficulty because their competence profiles are jagged: they match or exceed human performance on some reasoning tasks while failing on others \[28\]. One likely consequence is that tasks outside the AI's competence are delegated at similar rates to tasks within it, because the human's mental model may not differentiate between them.

AI assistance adds a complication: it can improve performance while inflating users' self-assessment of the improvement \[29\], a dissociation that can distort future delegation decisions. Individual differences in human **metacognitive sensitivity** predict the quality of trust **calibration** with AI \[30\]. The quality of delegation assessment therefore depends on how well the human can judge both their own and the AI's reliability, and on how effectively the AI communicates uncertainty, the condition we turn to next.

## Calibrated AI uncertainty communication

The next condition is whether AI systems communicate calibrated uncertainty to the humans who rely on them (Figure 1B). The machine learning community has made substantial progress, developing methods that decide when to answer and when to defer to a human \[31--34\] and techniques that produce confidence intervals with formal accuracy guarantees \[35,36\]. Providing confidence scores at the level of individual predictions can improve the accuracy of combined human-AI judgments beyond what aggregate performance statistics can achieve \[11,37\]. For large language models, emerging work examines how to elicit and communicate confidence \[38--40\] and when these models generate unreliable outputs \[41\].

Despite this technical progress, deployed systems often still present every output with the same apparent certainty regardless of reliability. The gap may persist partly because systems that refuse to answer appear less capable in competitive markets, and partly because current LLMs exhibit systematic overconfidence \[42\]. Yet an AI that says "I don't know" is performing a useful self-assessment of reliability, analogous to, though not the same as, human metacognition: its confidence tracks whether its output is likely correct \[20,43,44\]. When confidence is uncoupled from accuracy, users, particularly non-experts, struggle to distinguish reliable from unreliable outputs and tend to over-rely, a problem compounded by LLMs' tendency to avoid expressing uncertainty \[20\]. Effective communication therefore depends jointly on AI calibration and human cognition, because the signal must still be read correctly \[45\]: uniform confidence says nothing about which outputs to scrutinize, but discriminating confidence does. This discrimination, termed metacognitive sensitivity and used here for how well an AI's expressed confidence tracks correctness, can matter more than raw accuracy (Figure 2). This is because a less accurate system that signals reliably when it is right can produce better team outcomes than a more accurate but opaque one \[46\]. Of note, supervised fine-tuning can improve LLM calibration and discrimination, with improvements that generalize across knowledge domains \[47\].

## Sustained human monitoring capacity

Once delegation has occurred, successful outcomes depend on the human's capacity to scrutinize AI outputs and catch errors (Figure 1C). The literature on **automation bias** \[26,48\] and appropriate reliance \[49,50\] documents the difficulty of maintaining this capacity. Early findings on algorithm aversion \[51\] are now better understood as context-dependent and sometimes rational metacognitive strategies \[23,52\]. In many deployed settings the more prevalent concern is overreliance: users often accept AI recommendations by habit, bypassing analytical evaluation \[24,53\], and merely knowing that advice comes from an AI can increase reliance even against one's own assessment \[54\]. Self-confidence matters too: underconfident users tend to over-rely on AI while overconfident users tend to under-rely, and neither pattern produces good outcomes \[55\].

A further complication is that monitoring capacity is not static. Pilots who rely extensively on cockpit automation retain instrument scanning and manual control skills but can lose the higher-order skills needed for manual flight \[56\]. This selective erosion of cognitive skills, which automation researchers have studied extensively \[57\], suggests that the capacities most needed for oversight may be those most vulnerable to disuse.

Generative AI may accelerate this erosion. Self-reported cognitive effort in critical thinking is lower with greater generative AI use, particularly among workers with higher confidence in AI \[58\], and generative AI imposes distinct metacognitive demands, because users must evaluate outputs they did not produce in a system whose competence boundaries are opaque \[59\]. Yet erosion is not inevitable. Randomized experiments with software developers learning a new programming library found that AI use impaired conceptual understanding and debugging abilities, though developers who maintained active cognitive engagement preserved their learning outcomes \[60\], which suggests that how assistance is used matters as much as whether it is used.

Whether and how AI use degrades human skills, and how to prevent it, are central questions for oversight \[61\]. Monitoring is also how delegation can correct itself, because the errors humans catch feed back to keep it on track, as we develop below.

## Task structural compatibility

The final condition is whether a task's structure supports delegation (Figure 1D). We propose that three features are particularly important. The first structural feature is **verifiability**, which depends on what the delegator already knows, not on the task alone \[62\]; support that builds understanding in advance can make a later output verifiable. When humans can check AI outputs through mechanisms that do not require the same expertise as producing them (code compilation, proof checking, factual lookup), errors can be caught quickly and delegation can operate as a low-risk accelerator. When verification requires the same expertise as the original task (clinical diagnosis, legal interpretation, strategic judgment), the human must already possess something close to the answer to evaluate the AI's. Verification can also be limited by the work it takes regardless of expertise: for instance, confirming a chess move is best can take as much computation as finding the move itself. Evidence that verifying and generating come apart supports treating verifiability as a feature in its own right: LLMs can achieve far higher accuracy at verifying solutions than at generating them (90% versus 3.7% on prime factorization), with the verification advantage concentrated in procedural reasoning tasks \[63\].

A second structural feature is whether the task has one correct answer or many acceptable ones. Decision tasks that require selecting a single correct answer under uncertainty tend to be more sensitive to delegation errors than creative tasks that tolerate multiple valid outputs \[10,64\]. In decision tasks, the human must judge whether the AI is wrong on this specific instance when the AI is generally right, a difficult metacognitive challenge \[15\], whereas in creative tasks AI-generated alternatives widen the set of options without forcing a single answer, which can enable complementarity through diversity of approach \[64\]. How complementarity is measured and what produces it are distinct: measurement asks whether errors are independent enough that combining judgments beats either alone \[11,65\], whereas the mechanism is different knowledge, strategies, or representations \[13\]. Uncorrelated errors indicate complementarity but do not produce it.

A third structural feature is the metaknowledge the task provides: whether the task provides enough feedback signals for the delegator to judge when the AI is likely to succeed or fail. In controlled experiments, human-AI collaboration outperformed AI alone when the AI delegated tasks to humans, but not when humans delegated to the AI, likely because humans lacked the metaknowledge needed to assess their own capabilities relative to the AI's \[66\], so tasks that obscure capability boundaries can undermine delegation even when AI competence is high.

# Why the conditions are interdependent

Research on each condition is individually well developed, and important work has examined pairwise interactions (Box 1): how trust calibration and self-confidence jointly shape reliance \[50\], how automation reliability interacts with multitask load to produce complacency \[48\], how monitoring erosion and organizational complacency create coupled vicious circles \[67\], and how metacognitive sensitivity, AI confidence, and workflow design jointly shape whether complementarity is realized \[15\]. What has received less attention is how all four conditions interact simultaneously, forming a system whose aggregate behavior can differ from what any single condition would predict.

## Metacognition links assessment to monitoring

The capacity that enables accurate delegation assessment also supports monitoring, because both require evaluating the boundary between one's reliable and unreliable judgments \[19,20\]. AI metacognitive sensitivity can matter more than raw accuracy for team outcomes \[46\], so the quality of confidence signals shapes how effectively humans integrate AI recommendations. On the human side, metacognitive sensitivity predicts how well people calibrate trust in AI systems \[30\]: users who cannot judge when their own expertise suffices may also struggle to calibrate reliance on AI recommendations. A clinician unsure when their own reading of a scan is reliable is likely to be poorly placed to judge when to defer to the AI's. This shared root suggests that interface-design efforts to improve monitoring \[49\] may be limited by the metacognitive demands AI collaboration imposes \[59\]: a clearer display cannot supply the self-knowledge the user lacks.

## Calibration and monitoring depend on each other

Calibrated AI uncertainty communication can provide the corrective feedback that human mental model formation requires: without it, humans might overestimate AI abilities and form biased models that resist correction even after repeated interaction \[27\]. When systems present every output with the same apparent certainty, this feedback is absent and humans tend to trust by habit, developing automatic acceptance patterns that bypass analytical evaluation \[53,68\]. Absent calibrated signals, both immediate monitoring and future delegation assessment are likely to degrade, because the mental model on which assessment depends may never improve.

The interdependence extends to AI explanations, widely proposed as a mechanism for appropriate reliance. Explanations can increase the probability that humans accept AI recommendations regardless of correctness \[69,70\], and this effect has been found across expertise levels: in diagnostic imaging, local AI explanations led both radiologists and non-radiologists to trust incorrect diagnoses more \[71\]. Explanations may be more effective at reducing overreliance when the cognitive cost of engaging with them is lower than that of solving the task independently \[72\], which may rarely hold for the consequential decisions where reliance matters most. Even when explanations improve metacognitive accuracy, for example by revealing that the AI's logic diverges from the user's own \[73\], the benefit may require the deep engagement that overreliance patterns tend to suppress. The effectiveness of explanations may thus depend on the task's verifiability structure \[74\], illustrating how the conditions interact across the system.

This relationship also operates in reverse: active human monitoring can generate the error-detection feedback that AI calibration requires to improve. In clinical radiology, physicians' corrections of AI diagnostic outputs, fed back for periodic retraining, progressively reduced false positive rates in brain metastasis detection \[75\]. At foundation-model scale, human evaluators who rank outputs produce the training signal that steers the model, through reinforcement learning from human feedback \[76\]. When this monitoring feedback is severed, AI systems can degrade: models trained on their own synthetic outputs without human-curated data can undergo "model collapse," irreversibly losing the ability to represent the full range of real-world patterns \[77\]. An accounting firm case study illustrates the dynamic in the field \[67\]: as workers lost the proficiency to evaluate automated outputs, errors went uncorrected, the system stopped improving, and reliance on it deepened. This bidirectional relationship is what makes the conditions interdependent: designing a well-calibrated AI system may not be enough, because human monitoring supplies the error-detection feedback the system needs to stay calibrated over time.

## Task structure moderates all other conditions

We propose that the three structural features act together to amplify or dampen every other condition: verifiability sets how quickly errors surface, whether there is one right answer sets the cost of a wrong one, and metaknowledge sets how well the delegator can anticipate failure. A field experiment illustrates this claim \[78\]: management consultants who used AI on tasks within its competence frontier performed well, but on tasks outside the frontier, they relied too heavily on AI output and their performance dropped by 19 percentage points. The consultants likely could not learn the AI's "jagged" competence boundary because the task gave them little metaknowledge about where that boundary lay and no way to verify whether outputs on the harder tasks were correct. Had outputs been independently checkable, errors would likely have surfaced and could have interrupted this overgeneralization \[79\]. Without verification, mistaken confidence can propagate \[26\], degrading the consultants' assessment of when AI involvement is appropriate, leaving the AI's uncertainty signals without recalibration, and weakening the incentive to scrutinize outputs \[48\].

Tasks with high verifiability and tolerance for diverse outputs can absorb imperfections in the other conditions, while tasks with low verifiability and single correct answers tend to amplify them \[12\]. Effective human oversight can accordingly be understood through a signal detection framework \[79,80\]: error detection depends on how often errors are expected, how easily correct and incorrect outputs can be told apart, and the relative costs of misses and false alarms.

## Temporal dynamics of delegation

The conditions above operate on two timescales. Within a delegation episode, each condition shapes performance in the moment; across episodes, delegation changes the conditions themselves, as mental models update, systems retrain, and skills grow or fade \[15,81\]. We present these cycles as propositions for longitudinal research. When conditions are well-managed, repeated delegation can produce a virtuous cycle. People refine their models of the AI much as they learn any uncertain environment, by sampling outcomes \[82\], reusing past instances \[83\], and updating from reward. With calibrated feedback, this learning can counteract the systematic biases that otherwise characterize human mental models of AI \[27\]: trust can calibrate \[50\], engagement can preserve baseline competence during assisted work \[84\], and human and AI predictions can combine to exploit complementary strengths \[11\]. Whether such a cycle is sustained is an open empirical question. When the four conditions are poorly managed, the opposite trajectory is possible: in the accounting firm case described above \[67\], degraded monitoring severed the feedback that calibration needed, forcing deeper reliance and further skill loss. A controlled experiment illustrates the mechanism \[85\]: students with access to GPT-4 during practice improved practice performance by 48% but decreased exam performance by 17%, likely because AI enabled completion without the effortful processing that produces durable learning. Randomized experiments with 1,222 participants sharpen the temporal claim: after roughly ten minutes of assisted problem solving, people who lost AI access performed worse and gave up more often than people who had never used it \[86\], and assisted collaboration can reduce intrinsic motivation back in solo work \[87\]. These findings echo broader concerns about generative AI in human learning \[60,88\]: performance gains in the present can come at the cost of capability in the future, as evidence on AI-induced deskilling accumulates \[57\].

These dynamics typically emerge when delegation is poorly designed: no uncertainty signals \[20\], constant assistance with no **cognitive forcing functions** to require independent judgment \[53\], task structures that prevent verification, and no monitoring of human competence \[79\]. Importantly, the loops are not only individual. Strategies and outcomes also co-evolve across teams and organizations, past adaptation shaping future performance \[89\]. We propose that when organizations coordinate all four conditions, the loops can stay active: calibrated signals keep users engaged, monitoring produces the corrections that recalibrate the system, and verifiable tasks reinforce both. When the interdependencies are neglected, the same structure can produce cascading degradation: overconfident AI worsens assessment, weak monitoring removes the feedback calibration needs, and low verifiability lets errors spread undetected.

# Designing for success: research priorities

Three research priorities follow (see Outstanding Questions), and Box 2 synthesizes the associated design principles. The first is making AI metacognition deployable: methods that defer, abstain, and attach calibrated confidence already exist in research settings \[32,35,44\], and training can improve how well language models' confidence tracks their accuracy \[47\], yet markets still tend to reward confident-sounding outputs \[42\], so deployment will likely depend on reporting standards, accountability \[90\], and regulation \[14\]. The second is designing assistance that sustains human capacity: AI that reasons about when not to help \[91\], cognitive forcing functions \[53,92\], periods of unassisted practice, and simulation-based training \[93\] can help preserve the engagement and skills that oversight requires, while reallocating the human effort that automation frees can raise overall accuracy \[94\]. The third is extending complementarity models from static snapshots to dynamic systems: Bayesian frameworks specify when combining human and AI judgments adds value \[37,95\], but a team that outperforms either agent today may erode the human capacities on which tomorrow's complementarity depends \[81\].

# Extending the framework: scientific discovery and agentic AI

The analysis above draws predominantly on AI-assisted decision-making paradigms \[15\], where a human evaluates a single recommendation. Two domains have moved well beyond this setting. What follows extends our proposed framework as hypotheses built on still-emerging evidence; the four conditions apply with shifted emphases.

## Delegation in scientific discovery

Delegation now extends to entire research sub-problems whose solutions may require creativity, cross-domain synthesis, and long chains of reasoning \[96--99\]. Reasoning models now achieve gold-medal Olympiad performance, research agents built on them have autonomously resolved open problems from Erdős's problem database \[100\], and researchers collaborating with the same models have solved open problems and refuted conjectures across theoretical computer science, economics, and physics \[101\]. Autonomous research agents also synthesize literature, plan experiments, and draft papers \[102--104\].

Assessment becomes particularly difficult because the researcher may not yet know whether the AI's output is correct, since the answer is unknown. Calibrated uncertainty is important here because overconfident AI suggestions can steer entire research programs in unproductive directions, creating "illusions of understanding" in which AI-generated patterns are mistaken for genuine scientific insight \[105\]. Monitoring capacity requires deep domain expertise, yet the promise of AI-driven discovery is precisely to explore spaces beyond human expertise. Task structure is most favorable where results are formally verifiable (proofs, code that compiles, testable predictions) and least favorable where verification requires the same expertise as generation. Researchers are responding with workflows that alternate prompting and verification \[101\], preserving human oversight even when the AI contributes novel results.

## Delegation to autonomous AI agents

Agentic systems will likely intensify the demands on every condition. Their footprint is already large: one study documents over 900,000 agentic pull requests across 116,000 GitHub repositories \[7\], and the boundary between what requires human involvement and what can be delegated appears to shift faster than oversight practices adapt \[8\].

Delegation assessment must now encompass the agent's scope of action: when a coding agent modifies dozens of files across a repository, the developer's "theory of machine" must extend to how the agent decomposes problems, handles edge cases, and manages dependencies \[28\]. Early field evidence shows what oversight looks like in practice: developers supervising coding agents work across controls set up in advance, co-planning, real-time monitoring, and review after the fact, and they lean on test results as stand-ins for line-by-line review \[106\]. The loss aversion that shapes willingness to delegate individual decisions may intensify when actions are irreversible \[107\], and AI uncertainty communication must operate at the level of entire plans \[38,39\]. Task compatibility extends beyond verifiability to reversibility: actions that can be undone (editing a document) have different risk profiles from those that cannot (sending an email, executing a transaction) \[24\]. As agents increasingly act on behalf of users \[5\], delegating to them raises the same difficulties as delegating to another person: the delegator cannot watch everything the agent does, knows less about how the work was done, and cannot assume the agent's goals match their own. The 2026 International AI Safety Report concludes that autonomous agents pose heightened risks because humans struggle to intervene before failures cause harm, and that current oversight techniques cannot reduce failure rates to the level high-stakes settings require \[108\].

# Concluding remarks

The productivity gains from AI delegation are real, and the four conditions reviewed here shape whether they are realized. If, as we propose, the conditions form an interdependent system, optimizing any one of them on its own, whether a better rule for when the AI defers to a human \[32\], a better explanation interface \[69\], or human trust training \[53\], can fail to improve outcomes or can simply shift the bottleneck. Effective delegation requires concurrent attention to all four: AI whose confidence signals reliably track correctness \[20,46\], humans who retain the capacities needed for oversight \[30\], monitoring that detects degradation and triggers intervention \[14,79\], and workflows matched to task structures that support verification \[78\]. The human capacities generate the feedback the system depends on.

Delegation is expanding faster than our understanding of its oversight, and the gap widens as advisory AI gives way to autonomous agents. Treating the four conditions as a single design problem across that spectrum is, we suggest, a next step toward human-AI collaboration that delivers its promised gains \[109,110\].

---

**BOX 1: Connection to previous perspectives**

The questions this Review organizes have a long history. Research on trust in automation established how trust calibrates to communicated reliability and how miscalibration produces disuse and misuse \[50\]. Work on complacency and automation bias documented the monitoring failures that follow from reliably performing automation \[48\]. Uncertainty communication is not new either. Signal-detection alerting made the miss and false-alarm tradeoff an explicit design choice; likelihood alarm displays graded alerts by the system's own certainty \[111\]; staged cockpit advisories escalated by urgency; and decision aids that displayed trial-by-trial confidence improved operators' reliance well before modern AI \[112\]. Adaptive automation allocated functions dynamically \[113\], and human-autonomy teaming and joint cognitive systems treat the human and the machine together as the unit of analysis \[114,115\]. Our account is consistent with these traditions and shares their central lesson, that delegation outcomes are properties of the joint system, not of the machine alone.

What has changed is the assumption these traditions could rely on. Classic automation performed a fixed set of functions under conditions its designers knew in advance: an autopilot or an alarm system was built for a known range of situations, so its reliability could be measured before deployment and an alert threshold set once, at design time. A general-purpose AI system does many different jobs, and neither its designers nor its users can map in advance where it is competent and where it is not \[27,78\]. Judging what it can do therefore cannot be settled once and has to be redone as each new task arrives. Delegation now also covers open-ended writing, planning, and multi-step action, where checking the output is much harder than reading a gauge. The confidence signal itself has changed too: instead of a threshold a designer set, it is now an estimate the system produces about its own reliability \[20\], which training can improve but which is still often poorly calibrated. We suggest that the four conditions depend on one another more tightly in this setting because nothing settled at design time is left to fall back on.

---

**Table 1.** Four conditions for successful delegation^a^

| Condition | Underlying mechanism (construct) | Observable diagnostic indicators | Refs |
|---|---|---|---|
| Accurate delegation assessment | Human metacognition applied to AI competence boundaries | Accuracy of human predictions about AI performance on new tasks; gap between perceived and actual AI accuracy; quality of mental model updating after feedback | \[27,116\] |
| Calibrated AI uncertainty communication | AI communicates calibrated confidence alongside its outputs | Gap between stated confidence and actual accuracy; proportion of cases handled at a given accuracy level; correlation between AI confidence and correctness | \[31,47\] |
| Sustained human monitoring capacity | Humans maintain skills and vigilance needed for oversight | Human solo performance measured longitudinally; error detection rate on AI outputs; human ability to distinguish own correct from incorrect judgments | \[30,56\] |
| Task structural compatibility | Whether tasks are verifiable, have a single correct answer or tolerate multiple valid outputs, and provide enough feedback for the delegator to judge AI competence boundaries | Proportion of outputs independently verifiable; verification cost relative to generation cost; error correlation between human and AI | \[11\] |

^a^The mechanism column names the theoretical construct behind each condition; the indicators column lists observable measures for assessing whether the condition is met. The interdependencies among the conditions are developed in the text.

---

**BOX 2: Design principles for effective delegation**

The interdependence among conditions suggests a set of design principles for AI systems intended to support sustained, effective delegation.

> **1. Report calibrated uncertainty alongside predictions.** AI systems should communicate where they are reliable and where they are not, enabling humans to build accurate mental models of AI competence \[20,47\]. Evaluation cultures should reward coverage-aware accuracy alongside overall performance.

> **2. Design for sustained human engagement alongside immediate performance.** Adaptive assistance that strategically times its interventions can preserve user engagement with AI outputs, helping prevent the disengagement that can undermine future oversight \[91\]. Cognitive forcing functions, which require users to form their own judgment before seeing the AI's \[53\], and work schedules that have people perform the task without AI at regular intervals, so that their skills stay in practice, complement this approach.

> **3. Match delegation workflows to task verifiability.** High-stakes tasks with low verifiability warrant AI-assisted workflows with human review, while tasks with high verifiability and tolerance for diverse outputs can support more autonomous workflows.

> **4. Monitor delegation outcomes over the full lifecycle.** Organizations should track AI accuracy, human competence, trust calibration, and error-detection rates, intervening when longitudinal trends indicate degradation in any condition.

> **5. Treat the four conditions as a joint optimization problem.** Improving one condition (e.g., better deferral algorithms) while neglecting others (e.g., declining human monitoring capacity) can leave overall delegation quality unchanged or even degraded. Effective delegation requires coordinated attention to all four conditions simultaneously.

---

**Outstanding Questions**

- What standards and incentives would make calibrated uncertainty communication a default feature of deployed AI systems? Methods that defer, abstain, and report calibrated confidence exist in research settings, while market incentives still reward confident-sounding outputs.

- Which forms of AI assistance preserve human competence over months and years? Most evidence on AI-induced skill change comes from single sessions or short studies, and longitudinal field designs remain rare.

- Can complementarity models be extended from static snapshots to dynamic systems? A human-AI team that outperforms either agent today may erode the human capacities on which tomorrow\'s complementarity depends.

- What does effective human oversight require when agents execute long workflows whose individual steps no one reviews? Regulation will soon mandate such oversight without specifying the cognitive capacities it demands of the people providing it.

- Which tasks allow verification that is genuinely cheaper than producing the answer, and can task design expand that set? Task structure amplifies or dampens every other condition: verifiability sets how quickly errors surface, whether there is one right answer sets the cost of a wrong one, and what the task reveals about the AI\'s limits sets how well the delegator can anticipate failure.

- Which diagnostic indicators best reveal that a delegation system is degrading before failures become visible? Candidate indicators exist for each condition, but none have been validated as early-warning measures at deployment scale.

# Glossary

**Agentic delegation:** a delegation workflow in which the AI executes tasks and takes action without human inspection of each step; the human sets goals and monitors aggregate outcomes.

**AI-assisted decision-making:** a delegation workflow in which the AI produces a recommendation that the human inspects before acting; the human makes the final decision and can override the AI.

**Automation bias:** the tendency to over-rely on automated outputs, using them as a heuristic replacement for vigilant information seeking and verification.

**Calibration:** the degree to which a system's expressed confidence matches its actual accuracy; a calibrated system is correct as often as its confidence implies, though calibration helps a user only when confidence varies across outputs and the user reads it correctly.

**Cognitive forcing function:** an interface intervention that compels analytical engagement at decision time, for example by requiring users to commit to their own judgment before seeing the AI's recommendation.

**Complementarity:** a state in which the human-AI team outperforms either the human or the AI alone; sufficiently independent errors and informative confidence signals indicate it but do not by themselves produce it.

**Delegation:** any workflow in which a human relies on an AI system to perform or inform a task, ranging from advisory recommendations that the human reviews to autonomous execution in which the AI acts independently.

**Metacognitive sensitivity:** the degree to which correct and incorrect judgments can be distinguished from an agent's expressed confidence. In humans it predicts how well people calibrate their trust in AI; in AI systems, where the term describes how confidence tracks correctness without implying human-like awareness, it determines how effectively confidence signals can guide human decisions.

**Verifiability:** the degree to which a human can independently check an AI output through mechanisms that do not require the same expertise as producing it, such as code compilation or factual lookup; relative to what the delegator already knows at the moment of the decision.

# Author contributions

F.M.A. and M.S. conceived the framework. F.M.A. drafted the manuscript and synthesized the literature. M.S. contributed to the conceptual development, refined the framing, and revised the manuscript. Both authors approved the final version.

# Declaration of interests

The authors declare no competing interests.

# Figure legends

**Figure 1. Delegation succeeding and failing under each condition.** The top row shows delegation succeeding (green check) and the bottom row delegation failing (red cross). (A) Accurate delegation assessment. In the top row, the person hands the AI only the task it does well, and the line from the other task ends at a red-ringed X. In the bottom row, the person hands over both. This can happen because people tend to expect AI abilities to be more correlated across task categories than they are \[27\]. (B) Calibrated AI uncertainty communication. Each dial shows the AI's stated confidence in one answer, and Yes or No shows whether that answer is right. In the top row, the AI's confidence is lower on its wrong answer (high metacognitive sensitivity), so the person can tell which answer to check \[20,45,46\]. In the bottom row, the AI is equally confident in every answer, so the person cannot tell. (C) Sustained human monitoring capacity. In the top row, the person reads the AI's output with a magnifier and catches the error (solid red box). In the bottom row, the person holds a mug and accepts the output unread (dashed red box: the missed error). Users who habitually accept AI recommendations do this \[24,53\]. (D) Task structural compatibility. Checking the AI's code by running tests takes far less expertise than writing it (red dot: a failing test). Checking the AI's flag on an X-ray (white ring) takes much of the same expertise as reading the X-ray.

**Alt text:** Figure 1. A four-column, two-row grid of cartoon panels, one column per condition for delegation (A to D); the top row shows delegation succeeding and the bottom row shows it failing.

[A grid of eight white cards on four colored column backgrounds. On the left edge, a green check mark labels the top row "Delegation succeeds" and a red cross labels the bottom row "Delegation fails". Every card has a short caption under its drawing. Column A, on teal, is titled "(A) Accurate delegation assessment". In each card a woman with her hand on her chin looks at two documents: "A task the AI does well", a page of colored bars, and "A task the AI does badly", a page with a small node-and-link diagram. A purple square labeled "AI" sits to their right. In the top card an arrow runs from the first document to the AI, and the line from the second document ends at a red-ringed X before it reaches the AI; the caption reads "The person hands the AI only the tasks it does well". In the bottom card arrows run from both documents to the AI; the caption reads "The person also hands the AI tasks it does badly". Column B, on lavender, is titled "(B) Calibrated AI uncertainty communication". Each card has a purple "AI" badge and the heading "The AI's confidence in three answers", with two column labels, "The AI's stated confidence" and "Is the answer right?". Three dial gauges sit in the left column and the answers "Yes", "Yes" and "No" (the "No" in red) in the right. In the top card the first two dials are nearly full and the third dial, beside the "No", is nearly empty; the caption reads "The AI states low confidence on its wrong answer". In the bottom card all three dials show the same high reading; the caption reads "The AI states the same high confidence on its wrong answer". Column C, on blue, is titled "(C) Sustained human monitoring capacity". Each card shows a tall page marked "AI" with rows of colored bars. In the top card a woman holds a magnifying glass up to the page, and one row is outlined by a solid red box; the caption reads "The person reads the AI's output and catches the error". In the bottom card the woman holds a mug, the same row has a dashed red outline, and a black label at the foot of the page reads "Accepted"; the caption reads "The person accepts the AI's output without reading it". Column D, on peach, is titled "(D) Task structural compatibility". In the top card a page of code marked "AI" has an arrow to a dark terminal window that lists four test lines, three with gray dots and one with a red dot and a pink line (a failing test); the caption reads "Checking the AI's code by running tests requires far less expertise than writing it". In the bottom card a chest X-ray marked "AI" has a white ring around one spot, with an arrow to a woman who holds the X-ray up and studies it; the caption reads "Checking the AI's diagnosis requires much of the same expertise as making it".]

*Note: Figure described by AI (Claude Opus 5.5) from the figure file of the accepted manuscript (Figure_1.pdf), whose text layer supplied every word quoted above, and checked against the figure legend. The figure image is not included in this machine-readable version; it is in the PDF of the accepted manuscript on felipemaffonso.com and in the published paper.*

**Figure 2. Catching wrong flags depends on metacognitive sensitivity.** Each panel shows eight brain scans, each with one AI flag (violet ring). Two flags are wrong (red ring), so 6 of 8 (75%) are right. The radiologist checks only the two flags with the lowest stated confidence (blue frames and blue shaded region). Each band joins a flag to its stated confidence and is red for a wrong flag, blue for a checked correct flag, and gray for any other flag. The curves show how often the AI states each confidence for correct and for wrong flags, scaled to the same area. (A) High metacognitive sensitivity. The AI's confidence is lower on its wrong flags, so the radiologist checks both wrong flags and catches both errors. Metacognitive sensitivity, how well confidence separates correct from wrong outputs, can matter more than raw accuracy for team outcomes \[46\]. This AI is also calibrated: a flag given 40% confidence is right 40% of the time, and one given 94% is right 94% of the time. (B) Low metacognitive sensitivity, and overconfident. The AI states 95% confidence on every flag, but only 75% are right. (C) Low metacognitive sensitivity, but calibrated on average. The AI's confidence varies and averages 75%, the share of flags that are right, but it varies in the same way on correct and wrong flags. In (B) and (C) the two curves are the same, so confidence does not show which flags are wrong, and the radiologist misses both \[45\].

**Alt text:** Figure 2. Three stacked panels, each with a row of eight AI-flagged brain scans on a monitor and a curve of the AI's stated confidence above it; the radiologist checks the two least confident flags and catches both wrong flags only in panel A.

[Three horizontal panels, A, B and C, laid out the same way. On the left a gray silhouette of a radiologist has a speech bubble. In the middle, a monitor shows eight brain scans in a row, each with one violet ring marking the AI's flag; the third and sixth scans also have a red ring, marking the two wrong flags. Above the monitor is a horizontal axis labeled "AI's stated confidence", running from "Low" on the left to "High" on the right, with a dot on the axis for each flag and a curved band joining each dot to its scan. A shaded blue region with a dashed vertical edge covers the low end of the axis and is labeled "Flags the radiologist checks: the least confident ones"; the two scans whose flags fall inside it have blue frames. Bands are red for wrong flags, blue for checked correct flags and gray for the rest. On the right, a short text states the AI's metacognitive sensitivity and calibration, and an outcome line in green or red states the result. Panel A is titled "(A) High metacognitive sensitivity: confidence is lower on the wrong flags". The speech bubble reads "I check the flags the AI is least sure of". Above the axis a tall, narrow gray curve labeled "Correct flags" peaks at the high end, and a low, wide red curve labeled "Wrong flags" sits mostly at the low end, with a small second bump at the high end. The two wrong flags' dots fall inside the blue region, so the third and sixth scans have blue frames. The right-hand text reads "Metacognitive sensitivity: high. Confidence is lower on the wrong flags. Calibrated: yes. A flag given 40% confidence is right 40% of the time, and one given 94% is right 94% of the time." The green outcome reads "The radiologist checks both wrong flags and catches them". Panel B is titled "(B) Low metacognitive sensitivity, and overconfident: the same high confidence on every flag". The speech bubble reads "The AI is equally sure of every flag, so I cannot tell which to check". A single tall, narrow curve at the high end, drawn in gray and red dashes, is labeled "Correct and wrong flags: the same curve"; all eight flags sit at the same point at its peak, and the dashed edge of the blue region sits at that point. The first and fourth scans have blue frames, while the wrong flags on the third and sixth scans go unchecked. The right-hand text reads "Metacognitive sensitivity: low. Confidence is the same on every flag. Calibrated: no. It states 95% on every flag but only 75% of flags are right." The red outcome reads "The radiologist checks other flags and misses both wrong ones". Panel C is titled "(C) Low metacognitive sensitivity, but calibrated on average: confidence varies the same way on correct and wrong flags". The speech bubble reads "I check the flags the AI is least sure of". A single wide bell curve in the middle of the axis, drawn in gray and red dashes, is labeled "Correct and wrong flags: the same curve"; the flags are spread along it, and the two wrong flags fall near the middle of the curve, outside the blue region. The second and fifth scans have blue frames. The right-hand text reads "Metacognitive sensitivity: low. Confidence is spread the same way on correct and wrong flags. Calibrated on average: yes. The average stated confidence is 75%, and 75% of flags are right." The red outcome reads "The radiologist checks the two least confident flags and misses both wrong ones".]

*Note: Figure described by AI (Claude Opus 5.5) from the figure file of the accepted manuscript (Figure_2.pdf), whose text layer supplied every word quoted above, and checked against the figure legend. The figure image is not included in this machine-readable version; it is in the PDF of the accepted manuscript on felipemaffonso.com and in the published paper.*

# References

1\. Noy, S. and Zhang, W. (2023) [Experimental evidence on the productivity effects of generative artificial intelligence](https://doi.org/10.1126/science.adh2586). *Science* 381, 187--192

2\. Brynjolfsson, E. *et al.* (2025) [Generative AI at work](https://doi.org/10.1093/qje/qjae044). *The Quarterly Journal of Economics* 140, 889--942

3\. Cui, Z. *et al.* (2026) The effects of generative AI on high-skilled work: Evidence from three field experiments with software developers. *Management Science* DOI: [10.1287/mnsc.2025.00535](https://doi.org/10.1287/mnsc.2025.00535)

4\. Wang, L. *et al.* (2024) [A survey on large language model based autonomous agents](https://doi.org/10.1007/s11704-024-40231-1). *Frontiers of Computer Science* 18, 186345

5\. Jarrahi, M.H. and Ritala, P. (2025) Rethinking AI agents: A principal-agent perspective. *California Management Review Insights* at \<<https://cmr.berkeley.edu/2025/07/rethinking-ai-agents-a-principal-agent-perspective/>\>

6\. Jimenez, C.E. *et al.* (2024) [SWE-bench: Can language models resolve real-world GitHub issues?](https://doi.org/10.48550/arXiv.2310.06770) in *Proceedings of the international conference on learning representations*

7\. Li, H. *et al.* (2026) [AIDev: Studying AI coding agents on GitHub](https://doi.org/10.48550/arXiv.2602.09185). in *Proceedings of the 23rd international conference on mining software repositories (MSR '26)*

8\. Kwa, T. *et al.* (2025) Measuring AI ability to complete long tasks. *arXiv* DOI: [10.48550/arXiv.2503.14499](https://doi.org/10.48550/arXiv.2503.14499)

9\. Becker, J. *et al.* (2025) Measuring the impact of early-2025 AI on experienced open-source developer productivity. *arXiv* DOI: [10.48550/arXiv.2507.09089](https://doi.org/10.48550/arXiv.2507.09089)

10\. Vaccaro, M. *et al.* (2024) [When combinations of humans and AI are useful: A systematic review and meta-analysis](https://doi.org/10.1038/s41562-024-02024-1). *Nature Human Behaviour* 8, 2293--2303

11\. Steyvers, M. *et al.* (2022) [Bayesian modeling of human--AI complementarity](https://doi.org/10.1073/pnas.2111547119). *Proceedings of the National Academy of Sciences* 119, e2111547119

12\. Hemmer, P. *et al.* (2025) [Complementarity in human-AI collaboration: Concept, sources, and evidence](https://doi.org/10.1080/0960085X.2025.2475962). *European Journal of Information Systems* 34, 979--1002

13\. Gonzalez, C. *et al.* (2026) Toward a science of human--AI teaming for decision making: A complementarity framework. *PNAS Nexus* DOI: [10.1093/pnasnexus/pgag030](https://doi.org/10.1093/pnasnexus/pgag030)

14\. Fink, M. (2026) [Human oversight (Article 14)](https://doi.org/10.5040/9781509988570.ch-018). In *The EU Artificial Intelligence Act: A thematic commentary* (Malgieri, G. et al., eds), pp. 299--314, Hart Publishing

15\. Steyvers, M. and Kumar, A. (2024) [Three challenges for AI-assisted decision-making](https://doi.org/10.1177/17456916231181102). *Perspectives on Psychological Science* 19, 722--734

16\. Gomez, C. *et al.* (2025) [Human-AI collaboration is not very collaborative yet: A taxonomy of interaction patterns in AI-assisted decision making from a systematic review](https://doi.org/10.3389/fcomp.2024.1521066). *Frontiers in Computer Science* 6, 1521066

17\. Gonzalez, C. and Heidari, H. (2025) [A cognitive approach to human-AI complementarity in dynamic decision-making](https://doi.org/10.1038/s44159-025-00499-x). *Nature Reviews Psychology* 4, 808--822

18\. Yeung, N. and Summerfield, C. (2012) [Metacognition in human decision-making: Confidence and error monitoring](https://doi.org/10.1098/rstb.2011.0416). *Philosophical Transactions of the Royal Society B: Biological Sciences* 367, 1310--1321

19\. Fleming, S.M. and Lau, H.C. (2014) [How to measure metacognition](https://doi.org/10.3389/fnhum.2014.00443). *Frontiers in Human Neuroscience* 8, 443--452

20\. Steyvers, M. and Peters, M.A.K. (2025) Metacognition and uncertainty communication in humans and large language models. *Current Directions in Psychological Science* DOI: [10.1177/09637214251391158](https://doi.org/10.1177/09637214251391158)

21\. Anderson, P.G. *et al.* (2024) [Deep learning improves physician accuracy in the comprehensive detection of abnormalities on chest X-rays](https://doi.org/10.1038/s41598-024-76608-2). *Scientific Reports* 14, 25151

22\. Sridharan, S. *et al.* (2024) [Real-world evaluation of an AI triaging system for chest X-rays: A prospective clinical study](https://doi.org/10.1016/j.ejrad.2024.111783). *European Journal of Radiology* 181, 111783

23\. Jussupow, E. *et al.* (2024) [An integrative perspective on algorithm aversion and appreciation in decision-making](https://doi.org/10.25300/MISQ/2024/18512). *MIS Quarterly* 48, 1575--1590

24\. Spatola, N. (2024) [The efficiency-accountability tradeoff in AI integration: Effects on human performance and over-reliance](https://doi.org/10.1016/j.chbah.2024.100099). *Computers in Human Behavior: Artificial Humans* 2, 100099

25\. Feng, K.J.K. *et al.* (2025) Levels of autonomy for AI agents. *arXiv* DOI: [10.48550/arXiv.2506.12469](https://doi.org/10.48550/arXiv.2506.12469)

26\. Goddard, K. *et al.* (2012) [Automation bias: A systematic review of frequency, effect mediators, and mitigators](https://doi.org/10.1136/amiajnl-2011-000089). *Journal of the American Medical Informatics Association* 19, 121--127

27\. Kelly, M. *et al.* (2023) [Capturing humans' mental models of AI: An item response theory approach](https://doi.org/10.1145/3593013.3594111). in *Proceedings of the 2023 ACM conference on fairness, accountability, and transparency*

28\. Strachan, J.W.A. *et al.* (2024) [Testing theory of mind in large language models and humans](https://doi.org/10.1038/s41562-024-01882-z). *Nature Human Behaviour* 8, 1285--1295

29\. Fernandes, D. *et al.* (2026) [AI makes you smarter, but none the wiser: The disconnect between performance and metacognition](https://doi.org/10.1016/j.chb.2025.108779). *Computers in Human Behavior* 175, 108779

30\. Lee, D. *et al.* (2025) [Metacognitive sensitivity: The key to calibrating trust and optimal decision making with AI](https://doi.org/10.1093/pnasnexus/pgaf133). *PNAS Nexus* 4, pgaf133

31\. Cortes, C. *et al.* (2016) [Learning with rejection](https://doi.org/10.1007/978-3-319-46379-7_5). In *Algorithmic learning theory* (Ortner, R., ed), pp. 67--82, Springer

32\. Mozannar, H. and Sontag, D. (2020) [Consistent estimators for learning to defer to an expert](https://doi.org/10.48550/arXiv.2006.01862). in *Proceedings of the 37th international conference on machine learning*, 119, pp. 7076--7087

33\. Wen, B. *et al.* (2025) [Know your limits: A survey of abstention in large language models](https://doi.org/10.1162/tacl_a_00754). *Transactions of the Association for Computational Linguistics* 13, 529--556

34\. Alves, J.V. *et al.* (2025) A benchmarking framework and dataset for learning to defer in human-AI decision-making. *Scientific Data* DOI: [10.1038/s41597-025-04664-y](https://doi.org/10.1038/s41597-025-04664-y)

35\. Angelopoulos, A.N. and Bates, S. (2023) [Conformal prediction: A gentle introduction](https://doi.org/10.1561/2200000101). *Foundations and Trends in Machine Learning* 16, 494--591

36\. Quach, V. *et al.* (2024) [Conformal language modeling](https://doi.org/10.48550/arXiv.2306.10193). in *Proceedings of the 12th international conference on learning representations*

37\. Jitkrittum, W. *et al.* (2023) [When does confidence-based cascade deferral suffice?](https://doi.org/10.48550/arXiv.2307.02764) in *Advances in neural information processing systems*, 36, pp. 9891--9906

38\. Xiong, M. *et al.* (2024) [Can LLMs express their uncertainty? An empirical evaluation of confidence elicitation in LLMs](https://doi.org/10.48550/arXiv.2306.13063). in *Proceedings of the 12th international conference on learning representations*

39\. Geng, J. *et al.* (2024) [A survey of confidence estimation and calibration in large language models](https://doi.org/10.18653/v1/2024.naacl-long.366). in *Proceedings of the 2024 conference of the north american chapter of the association for computational linguistics*, pp. 6577--6595

40\. Shorinwa, O. *et al.* (2025) [A survey on uncertainty quantification of large language models: Taxonomy, open research challenges, and future directions](https://doi.org/10.1145/3744238). *ACM Computing Surveys* 58, 1--38

41\. Huang, L. *et al.* (2025) [A survey on hallucination in large language models: Principles, taxonomy, challenges, and open questions](https://doi.org/10.1145/3703155). *ACM Transactions on Information Systems* 43

42\. Griot, M. *et al.* (2025) [Large language models lack essential metacognition for reliable medical reasoning](https://doi.org/10.1038/s41467-024-55628-6). *Nature Communications* 16

43\. Johnson, S.G.B. *et al.* (2026) Imagining and building wise machines: The centrality of AI metacognition. *Trends in Cognitive Sciences* DOI: [10.1016/j.tics.2026.01.002](https://doi.org/10.1016/j.tics.2026.01.002)

44\. Liu, G.K.-M. *et al.* (2026) Metacognition in LLMs: Foundations, progress, and opportunities. *arXiv* DOI: [10.48550/arXiv.2607.11881](https://doi.org/10.48550/arXiv.2607.11881)

45\. Zhang, Y. *et al.* (2020) [Effect of confidence and explanation on accuracy and trust calibration in AI-assisted decision making](https://doi.org/10.1145/3351095.3372852). in *Proceedings of the 2020 conference on fairness, accountability, and transparency*, pp. 295--305

46\. Li, Z. and Steyvers, M. (2026) [Modeling the joint impact of human and AI metacognitive sensitivity on human--AI collaboration](https://doi.org/10.1016/j.jmp.2026.102988). *Journal of Mathematical Psychology* 129, 102988

47\. Steyvers, M. *et al.* (in press) Generalization of fine-tuned uncertainty communication and metacognition in large language models. *Communications AI & Computing*

48\. Parasuraman, R. and Manzey, D.H. (2010) [Complacency and bias in human use of automation: An attentional integration](https://doi.org/10.1177/0018720810376055). *Human Factors: the Journal of the Human Factors and Ergonomics Society* 52, 381--410

49\. Schemmer, M. *et al.* (2023) [Appropriate reliance on AI advice: Conceptualization and the effect of explanations](https://doi.org/10.1145/3581641.3584066). in *Proceedings of the 28th international conference on intelligent user interfaces*, pp. 410--422

50\. Lee, J.D. and See, K.A. (2004) [Trust in automation: Designing for appropriate reliance](https://doi.org/10.1518/hfes.46.1.50_30392). *Human Factors: the Journal of the Human Factors and Ergonomics Society* 46, 50--80

51\. Dietvorst, B.J. *et al.* (2015) [Algorithm aversion: People erroneously avoid algorithms after seeing them err](https://doi.org/10.1037/xge0000033). *Journal of Experimental Psychology: General* 144, 114--126

52\. Logg, J.M. *et al.* (2019) [Algorithm appreciation: People prefer algorithmic to human judgment](https://doi.org/10.1016/j.obhdp.2018.12.005). *Organizational Behavior and Human Decision Processes* 151, 90--103

53\. Buçinca, Z. *et al.* (2021) [To trust or to think: Cognitive forcing functions can reduce overreliance on AI in AI-assisted decision-making](https://doi.org/10.1145/3449287). *Proceedings of the ACM on Human-Computer Interaction* 5, 1--21

54\. Klingbeil, A. *et al.* (2024) [Trust and reliance on AI: An experimental study on the extent and costs of overreliance on AI](https://doi.org/10.1016/j.chb.2024.108352). *Computers in Human Behavior* 160, 108352

55\. Ma, S. *et al.* (2024) ["Are you really sure?" Understanding the effects of human self-confidence calibration in AI-assisted decision making](https://doi.org/10.1145/3613904.3642671). in *Proceedings of the 2024 CHI conference on human factors in computing systems*

56\. Casner, S.M. *et al.* (2014) [The retention of manual flying skills in the automated cockpit](https://doi.org/10.1177/0018720814535628). *Human Factors: the Journal of the Human Factors and Ergonomics Society* 56, 1506--1516

57\. Natali, C. *et al.* (2025) [AI-induced deskilling in medicine: A mixed-method review and research agenda for healthcare and beyond](https://doi.org/10.1007/s10462-025-11352-1). *Artificial Intelligence Review* 58, 293

58\. Lee, H.-P. *et al.* (2025) [The impact of generative AI on critical thinking: Self-reported reductions in cognitive effort and confidence effects from a survey of knowledge workers](https://doi.org/10.1145/3706598.3713778). in *Proceedings of the 2025 CHI conference on human factors in computing systems*

59\. Tankelevitch, L. *et al.* (2024) [The metacognitive demands and opportunities of generative AI](https://doi.org/10.1145/3613904.3642902). in *Proceedings of the 2024 CHI conference on human factors in computing systems*

60\. Shen, J.H. and Tamkin, A. (2026) How AI impacts skill formation. *arXiv* DOI: [10.48550/arXiv.2601.20245](https://doi.org/10.48550/arXiv.2601.20245)

61\. Macnamara, B.N. *et al.* (2024) [Does using artificial intelligence assistance accelerate skill decay and hinder skill development without performers' awareness?](https://doi.org/10.1186/s41235-024-00572-8) *Cognitive Research: Principles and Implications* 9, 46

62\. Zhang, Z.T. *et al.* (2024) [Beyond recommendations: From backward to forward AI support of pilots' decision-making process](https://doi.org/10.1145/3687024). *Proceedings of the ACM on Human-Computer Interaction* 8, 1--32

63\. Davis, J.Q. *et al.* (2024) Networks of networks: Complexity class principles applied to compound AI systems design. *arXiv* DOI: [10.48550/arXiv.2407.16831](https://doi.org/10.48550/arXiv.2407.16831)

64\. Doshi, A.R. and Hauser, O.P. (2024) [Generative AI enhances individual creativity but reduces the collective diversity of novel content](https://doi.org/10.1126/sciadv.adn5290). *Science Advances* 10, eadn5290

65\. Rastogi, C. *et al.* (2023) [A taxonomy of human and ML strengths in decision-making to investigate human-ML complementarity](https://doi.org/10.1609/hcomp.v11i1.27554). *Proceedings of the AAAI Conference on Human Computation and Crowdsourcing* 11, 127--139

66\. Fügener, A. *et al.* (2022) [Cognitive challenges in human-artificial intelligence collaboration: Investigating the path toward productive delegation](https://doi.org/10.1287/isre.2021.1079). *Information Systems Research* 33, 678--696

67\. Rinta-Kahila, T. *et al.* (2023) [The vicious circles of skill erosion: A case study of cognitive automation](https://doi.org/10.17705/1jais.00829). *Journal of the Association for Information Systems* 24, 1378--1412

68\. Evans, J.St.B.T. and Stanovich, K.E. (2013) [Dual-process theories of higher cognition: Advancing the debate](https://doi.org/10.1177/1745691612460685). *Perspectives on Psychological Science* 8, 223--241

69\. Bansal, G. *et al.* (2021) [Does the whole exceed its parts? The effect of AI explanations on complementary team performance](https://doi.org/10.1145/3411764.3445717). in *Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems*, pp. 1--16

70\. Morrison, K. *et al.* (2024) [The impact of imperfect XAI on human-AI decision-making](https://doi.org/10.1145/3641022). in *Proceedings of the ACM on Human-Computer Interaction*, 8

71\. Prinster, D. *et al.* (2024) [Care to explain? AI explanation types differentially impact chest radiograph diagnostic performance and physician trust in AI](https://doi.org/10.1148/radiol.233261). *Radiology* 313, e233261

72\. Vasconcelos, H. *et al.* (2023) [Explanations can reduce overreliance on AI systems during decision-making](https://doi.org/10.1145/3579605). *Proceedings of the ACM on Human-Computer Interaction* 7, 1--38

73\. Von Zahn, M. *et al.* (2025) Knowing (not) to know: Explainable artificial intelligence and human metacognition. *Information Systems Research* DOI: [10.1287/isre.2024.1431](https://doi.org/10.1287/isre.2024.1431)

74\. Fok, R. and Weld, D.S. (2024) [In search of verifiability: Explanations rarely enable complementary performance in AI-advised decision making](https://doi.org/10.1002/aaai.12182). *AI Magazine* 45, 317--332

75\. Dikici, E. *et al.* (2020) [Integrating AI into radiology workflow: Levels of research, production, and feedback maturity](https://doi.org/10.1117/1.JMI.7.1.016502). *Journal of Medical Imaging* 7, 1

76\. Ouyang, L. *et al.* (2022) [Training language models to follow instructions with human feedback](https://doi.org/10.48550/arXiv.2203.02155). in *Advances in neural information processing systems*, 35, pp. 27730--27744

77\. Shumailov, I. *et al.* (2024) [AI models collapse when trained on recursively generated data](https://doi.org/10.1038/s41586-024-07566-y). *Nature* 631, 755--759

78\. Dell'Acqua, F. *et al.* (2026) Navigating the jagged technological frontier: Field experimental evidence of the effects of AI on knowledge worker productivity and quality. *Organization Science* DOI: [10.1287/orsc.2025.21838](https://doi.org/10.1287/orsc.2025.21838)

79\. Langer, M. *et al.* (2024) [Effective human oversight of AI-based systems: A signal detection perspective on the detection of inaccurate and unfair outputs](https://doi.org/10.1007/s11023-024-09701-0). *Minds and Machines* 35, 1--30

80\. Sterz, S. *et al.* (2024) [On the quest for effectiveness in human oversight: Interdisciplinary perspectives](https://doi.org/10.1145/3630106.3659051). in *The 2024 ACM conference on fairness accountability and transparency*, pp. 2495--2507

81\. Lin, Z. (2026) Human-AI complementarity needs augmentation, not emulation. *Nature Reviews Psychology* DOI: [10.1038/s44159-026-00536-3](https://doi.org/10.1038/s44159-026-00536-3)

82\. Hertwig, R. and Erev, I. (2009) [The description--experience gap in risky choice](https://doi.org/10.1016/j.tics.2009.09.004). *Trends in Cognitive Sciences* 13, 517--523

83\. Gonzalez, C. *et al.* (2003) [Instance‐based learning in dynamic decision making](https://doi.org/10.1207/s15516709cog2704_2). *Cognitive Science* 27, 591--635

84\. Karny, S. *et al.* (2024) [Learning with AI assistance: A path to better task performance or dependence?](https://doi.org/10.1145/3643562.3672610) in *ACM collective intelligence conference*, pp. 10--17

85\. Bastani, H. *et al.* (2025) [Generative AI without guardrails can harm learning: Evidence from high school mathematics](https://doi.org/10.1073/pnas.2422633122). *Proceedings of the National Academy of Sciences* 122, e2422633122

86\. Liu, G. *et al.* (2026) AI assistance reduces persistence and hurts independent performance. *arXiv* DOI: [10.48550/arXiv.2604.04721](https://doi.org/10.48550/arXiv.2604.04721)

87\. Wu, S. *et al.* (2025) Human-generative AI collaboration enhances task performance but undermines human's intrinsic motivation. *Scientific Reports* DOI: [10.1038/s41598-025-98385-2](https://doi.org/10.1038/s41598-025-98385-2)

88\. Yan, L. *et al.* (2024) [Promises and challenges of generative artificial intelligence for human learning](https://doi.org/10.1038/s41562-024-02004-5). *Nature Human Behaviour* 8, 1839--1850

89\. Galesic, M. *et al.* (2023) [Beyond collective intelligence: Collective adaptation](https://doi.org/10.1098/rsif.2022.0736). *Journal of The Royal Society Interface* 20

90\. Raji, I.D. *et al.* (2020) [Closing the AI accountability gap: Defining an end-to-end framework for internal algorithmic auditing](https://doi.org/10.1145/3351095.3372873). in *Proceedings of the 2020 Conference on Fairness, Accountability, and Transparency*, pp. 33--44

91\. Steyvers, M. and Mayer, L. (2025) When not to help: Planning for lasting human-AI collaboration. *arXiv* DOI: [10.48550/arXiv.2508.01837](https://doi.org/10.48550/arXiv.2508.01837)

92\. Bo, J.Y. *et al.* (2025) To rely or not to rely? Evaluating interventions for appropriate reliance on large language models. *Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems* DOI: [10.1145/3706598.3714097](https://doi.org/10.1145/3706598.3714097)

93\. Haslbeck, A. *et al.* (2014) [A flight simulator study to evaluate manual flying skills of airline pilots](https://doi.org/10.1177/1541931214581003). *Proceedings of the Human Factors and Ergonomics Society Annual Meeting* 58, 11--15

94\. Fügener, A. *et al.* (2026) [Roles of artificial intelligence in collaboration with humans: Automation, augmentation, and the future of work](https://doi.org/10.1287/mnsc.2024.05684). *Management Science* 72, 538--557

95\. Showalter, S. *et al.* (2024) [Bayesian online learning for consensus prediction](https://doi.org/10.48550/arXiv.2312.07679). in *Proceedings of the 27th international conference on artificial intelligence and statistics*, 238, pp. 2539--2547

96\. Jumper, J. *et al.* (2021) [Highly accurate protein structure prediction with AlphaFold](https://doi.org/10.1038/s41586-021-03819-2). *Nature* 596, 583--589

97\. Abramson, J. *et al.* (2024) [Accurate structure prediction of biomolecular interactions with AlphaFold 3](https://doi.org/10.1038/s41586-024-07487-w). *Nature* 630, 493--500

98\. Merchant, A. *et al.* (2023) [Scaling deep learning for materials discovery](https://doi.org/10.1038/s41586-023-06735-9). *Nature* 624, 80--85

99\. Romera-Paredes, B. *et al.* (2024) [Mathematical discoveries from program search with large language models](https://doi.org/10.1038/s41586-023-06924-6). *Nature* 625, 468--475

100\. Feng, T. *et al.* (2026) Towards autonomous mathematics research. *arXiv* DOI: [10.48550/arXiv.2602.10177](https://doi.org/10.48550/arXiv.2602.10177)

101\. Woodruff, D.P. *et al.* (2026) Accelerating scientific research with Gemini: Case studies and common techniques. *arXiv* DOI: [10.48550/arXiv.2602.03837](https://doi.org/10.48550/arXiv.2602.03837)

102\. Asai, A. *et al.* (2026) [Synthesizing scientific literature with retrieval-augmented language models](https://doi.org/10.1038/s41586-025-10072-4). *Nature* 650, 857--863

103\. M. Bran, A. *et al.* (2024) [Augmenting large language models with chemistry tools](https://doi.org/10.1038/s42256-024-00832-8). *Nature Machine Intelligence* 6, 525--535

104\. Lu, C. *et al.* (2024) The AI Scientist: Towards fully automated open-ended scientific discovery. *arXiv* DOI: [10.48550/arXiv.2408.06292](https://doi.org/10.48550/arXiv.2408.06292)

105\. Messeri, L. and Crockett, M.J. (2024) [Artificial intelligence and illusions of understanding in scientific research](https://doi.org/10.1038/s41586-024-07146-0). *Nature* 627, 49--58

106\. Dhanorkar, S. *et al.* (2026) Human oversight of agentic systems in practice: Examining the oversight work, challenges, and heuristics of developers using software agents. *arXiv* DOI: [10.48550/arXiv.2606.05391](https://doi.org/10.48550/arXiv.2606.05391)

107\. Bockstedt, J.C. and Buckman, J.R. (2026) [Humans' use of AI assistance: The effect of loss aversion on willingness to delegate decisions](https://doi.org/10.1287/mnsc.2024.05585). *Management Science* 72, 323--342

108\. Bengio, Y. *et al.* (2026) International AI safety report 2026. at \<<https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026>\>

109\. Collins, K.M. *et al.* (2024) [Building machines that learn and think with people](https://doi.org/10.1038/s41562-024-01991-9). *Nature Human Behaviour* 8, 1851--1863

110\. Topol, E.J. (2019) [High-performance medicine: The convergence of human and artificial intelligence](https://doi.org/10.1038/s41591-018-0300-7). *Nature Medicine* 25, 44--56

111\. Sorkin, R.D. *et al.* (1988) [Likelihood alarm displays](https://doi.org/10.1177/001872088803000406). *Human Factors: The Journal of the Human Factors and Ergonomics Society* 30, 445--459

112\. McGuirl, J.M. and Sarter, N.B. (2006) [Supporting trust calibration and the effective use of decision aids by presenting dynamic system confidence information](https://doi.org/10.1518/001872006779166334). *Human Factors: The Journal of the Human Factors and Ergonomics Society* 48, 656--665

113\. Parasuraman, R. *et al.* (2000) [A model for types and levels of human interaction with automation](https://doi.org/10.1109/3468.844354). *IEEE Transactions on Systems, Man, and Cybernetics - Part A: Systems and Humans* 30, 286--297

114\. Hollnagel, E. and Woods, D.D. (2005) [*Joint cognitive systems*](https://doi.org/10.1201/9781420038194), CRC Press

115\. Gupta, P. *et al.* (2025) [Fostering collective intelligence in human--AI collaboration: Laying the groundwork for COHUMAIN](https://doi.org/10.1111/tops.12679). *Topics in Cognitive Science* 17, 189--216

116\. Steyvers, M. *et al.* (2025) [What large language models know and what people think they know](https://doi.org/10.1038/s42256-024-00976-7). *Nature Machine Intelligence* 7, 221--231
