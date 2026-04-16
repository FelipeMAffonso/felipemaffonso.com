import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

def load_paras(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def detect_table_block(paras, start_idx):
    """Collect consecutive Compact paragraphs forming a table."""
    cells = []
    i = start_idx
    while i < len(paras) and paras[i]['style'] == 'Compact':
        cells.append(paras[i]['text'].strip())
        i += 1
    return cells, i

def format_table_from_cells(cells, num_cols):
    """Format cells into a markdown table with num_cols columns."""
    if not cells or num_cols == 0:
        return ""
    # Escape pipe characters in cell text
    escaped = [c.replace('|', '\\|') for c in cells]
    rows = []
    for j in range(0, len(escaped), num_cols):
        row = escaped[j:j+num_cols]
        while len(row) < num_cols:
            row.append("")
        rows.append(row)
    if not rows:
        return ""
    lines = []
    lines.append("| " + " | ".join(rows[0]) + " |")
    lines.append("| " + " | ".join(["---"] * num_cols) + " |")
    for row in rows[1:]:
        lines.append("| " + " | ".join(row) + " |")
    return "\n".join(lines)

def looks_like_data(cell):
    """Check if a cell looks like data (numbers, percentages) rather than a header."""
    import re
    cell = cell.strip()
    # Percentage pattern
    if re.match(r'^\d+\.?\d*%', cell):
        return True
    # Pure number
    if re.match(r'^\d+\.?\d*$', cell):
        return True
    # Fraction pattern like "495/526"
    if re.match(r'^\d+/\d+', cell):
        return True
    # Starts with a number and parenthesis like "94.1% (495/526)"
    if re.match(r'^\d+\.?\d*%?\s*\(', cell):
        return True
    return False

def infer_table_cols(cells, title_text=""):
    """Try to infer the number of columns from cell content."""
    if not cells:
        return 0
    n = len(cells)

    # Strategy: find column counts where:
    # 1. n is evenly divisible
    # 2. First row cells are all distinct and look like headers (not data)
    # 3. Second row has at least some data-like cells
    # 4. Number of rows > 1 (at least header + 1 data row)
    # 5. Prefer columns in 3-10 range, penalize extremes

    best = 0
    best_score = -1

    for ncols in range(2, min(15, n+1)):
        if n % ncols != 0:
            continue
        nrows = n // ncols
        if nrows < 2:
            continue  # Need at least header + 1 data row

        header = cells[:ncols]
        # All headers must be distinct
        if len(set(header)) != ncols:
            continue

        # How many header cells are NOT data-like (good headers)
        header_non_data = sum(1 for c in header if not looks_like_data(c))
        header_frac = header_non_data / ncols  # 1.0 = all headers are text

        # How many second-row cells ARE data-like
        row2 = cells[ncols:2*ncols]
        row2_data = sum(1 for c in row2 if looks_like_data(c))
        row2_frac = row2_data / ncols  # 1.0 = all data

        # Combined: we want header_frac high and row2_frac > 0
        # Also prefer ncols in 3-10 range
        if ncols <= 12:
            size_bonus = 1.0
        else:
            size_bonus = 0.5

        # Strong requirement: header should be mostly non-data
        if header_frac < 0.5:
            continue

        score = header_frac * 10 + row2_frac * 5 + size_bonus

        if score > best_score:
            best_score = score
            best = ncols

    if best > 0:
        return best

    # Relaxed fallback: just find smallest divisor with distinct headers
    for ncols in range(2, min(15, n+1)):
        if n % ncols == 0 and n // ncols >= 2:
            header = cells[:ncols]
            if len(set(header)) == ncols:
                return ncols

    # Final fallback: any valid divisor
    for ncols in range(2, min(15, n+1)):
        if n % ncols == 0:
            return ncols

    return 0

def build_wa_markdown(paras):
    """Convert web appendix paragraph list to markdown text."""
    lines = []
    i = 0
    n = len(paras)

    while i < n:
        p = paras[i]
        style = p['style']
        text = p['text'].strip()
        images = p['images']

        if not text and not images:
            i += 1
            continue

        # Headings
        if style == 'Heading1':
            lines.append("\n## " + text + "\n")
            i += 1
            continue
        if style == 'Heading2':
            lines.append("\n### " + text + "\n")
            i += 1
            continue
        if style == 'Heading3':
            lines.append("\n#### " + text + "\n")
            i += 1
            continue

        # Table/Figure titles: must START with TABLE/FIGURE (not just mention one)
        is_table_title = text.upper().startswith('TABLE WA-') and style != 'Compact'
        is_figure_title = text.upper().startswith('FIGURE WA-') and style != 'Compact'

        if is_table_title or is_figure_title:
            lines.append("\n**" + text + "**\n")
            i += 1
            continue

        # Compact style = table cells
        if style == 'Compact':
            cells, end_idx = detect_table_block(paras, i)
            if cells:
                ncols = infer_table_cols(cells)
                if ncols > 0:
                    table_md = format_table_from_cells(cells, ncols)
                    lines.append("\n" + table_md + "\n")
                else:
                    # Try fallback: if not divisible evenly, just dump as list
                    for c in cells:
                        lines.append("- " + c)
                    lines.append("")
            i = end_idx
            continue

        # Images
        if images and not text:
            for img in images:
                lines.append("\n[Image: " + img + "]\n")
            i += 1
            continue

        # NOTE paragraphs
        if text.startswith('NOTE'):
            clean = text.replace('\u2014\u2014', ' -- ').replace('\u2014', ' -- ')
            lines.append("\n*" + clean + "*\n")
            i += 1
            continue

        # Bibliography
        if style == 'Bibliography':
            lines.append(text)
            lines.append("")
            i += 1
            continue

        # Regular body text
        lines.append(text)
        lines.append("")
        i += 1

    return "\n".join(lines)


# ============ MAIN ASSEMBLY ============
ms_paras = load_paras('manuscript_paras.json')
wa_paras = load_paras('wa_paras.json')

output = []

# YAML frontmatter
output.append('---')
output.append('title: "Brief Commentary: A Framework for Detecting AI Agents in Online Research"')
output.append('authors: "Felipe M. Affonso"')
output.append('journal: "Journal of Consumer Research"')
output.append('year: 2025')
output.append('doi: "10.1093/jcr/ucag006"')
output.append('citation: "Affonso, Felipe M. (forthcoming), \\"Brief Commentary: A Framework for Detecting AI Agents in Online Research,\\" Journal of Consumer Research."')
output.append('---')
output.append('')
output.append('> **Disclaimer:** This is a machine-readable conversion of the published paper for use with AI tools. It may contain conversion errors in formatting, tables, or equations. Always verify against the [published version](https://doi.org/10.1093/jcr/ucag006).')
output.append('')
output.append('# Brief Commentary: A Framework for Detecting AI Agents in Online Research')
output.append('')
output.append('**Felipe M. Affonso**')
output.append('')
output.append('Forthcoming, *Journal of Consumer Research*')
output.append('')

# Author info
output.append(ms_paras[13]['text'].strip())
output.append('')

# Abstract
output.append('## ABSTRACT')
output.append('')
output.append(ms_paras[17]['text'].strip())
output.append('')
output.append('*' + ms_paras[18]['text'].strip() + '*')
output.append('')

# Introduction (paragraphs 20-25)
for idx in range(20, 26):
    text = ms_paras[idx]['text'].strip()
    if text:
        output.append(text)
        output.append('')

# DATA QUALITY THREATS IN ONLINE SURVEYS
output.append('## DATA QUALITY THREATS IN ONLINE SURVEYS')
output.append('')
for idx in [28, 29, 30, 31, 32]:
    text = ms_paras[idx]['text'].strip()
    if text:
        output.append(text)
        output.append('')

# THE COGNITIVE TRAP FRAMEWORK
output.append('## THE COGNITIVE TRAP FRAMEWORK: FOUNDATIONS AND IMPLEMENTATION')
output.append('')
output.append(ms_paras[35]['text'].strip())
output.append('')

# Figure 1
output.append('**FIGURE 1.** THE COGNITIVE TRAP FRAMEWORK')
output.append('')
output.append('[Image: Framework diagram showing the four-step cycle: (1) Identify Architectural Constraints, (2) Design Survey-Compatible Implementations, (3) Validate Against Models and Humans, (4) Deploy in Research Context. Light orange boxes show results from this implementation.]')
output.append('')
output.append('*' + ms_paras[39]['text'].strip() + '*')
output.append('')

# Step 1
output.append('### Step 1: Identify Architectural Constraints')
output.append('')
output.append(ms_paras[44]['text'].strip())
output.append('')
output.append(ms_paras[45]['text'].strip())
output.append('')

# Step 2
output.append('### Step 2: Design Survey-Compatible Implementations (Cognitive Traps)')
output.append('')
output.append(ms_paras[49]['text'].strip())
output.append('')
output.append(ms_paras[50]['text'].strip())
output.append('')

# Table 1
output.append('**TABLE 1.** REPRESENTATIVE COGNITIVE TRAP IMPLEMENTATIONS')
output.append('')
output.append('| Trap | Constraint | Description |')
output.append('| --- | --- | --- |')
output.append('| Modified Muller-Lyer | Training Data Overfitting | ' + ms_paras[57]['text'].strip() + ' |')
output.append('| The Moving Robot | Spatiotemporal Reasoning | ' + ms_paras[62]['text'].strip() + ' |')
output.append('| Surrounded Planets | Cross-Modal Binding | ' + ms_paras[66]['text'].strip() + ' |')
output.append('| Colliding Oranges | Spatial Reasoning | ' + ms_paras[70]['text'].strip() + ' |')
output.append('')

output.append(ms_paras[71]['text'].strip())
output.append('')
output.append(ms_paras[72]['text'].strip())
output.append('')

# Step 3
output.append('### Step 3: Validate Against Models and Humans')
output.append('')
output.append(ms_paras[76]['text'].strip())
output.append('')
output.append(ms_paras[77]['text'].strip())
output.append('')
output.append(ms_paras[78]['text'].strip())
output.append('')

# Table 2
output.append('**TABLE 2.** COGNITIVE TRAP VALIDATION RESULTS')
output.append('')
output.append('| Cognitive Trap | Human | GPT-5.1 | GPT-5.1 (extended thinking) | Gemini 2.5 Pro | Gemini 2.5 Flash | Claude Sonnet 4.5 | Claude Haiku 4.5 | Pooled |')
output.append('| --- | --- | --- | --- | --- | --- | --- | --- | --- |')
output.append('| Modified Cafe Wall | 84.8% | 0% | 20% | 0% | 0% | 40% | 30% | 15.0% |')
output.append('| Modified Muller-Lyer | 90.1% | 0% | 30% | 0% | 0% | 0% | 0% | 5.0% |')
output.append('| Modified Ebbinghaus | 90.1% | 10% | 60% | 30% | 0% | 60% | 80% | 40.0% |')
output.append('| The Moving Robot | 77.2% | 0% | 40% | 0% | 0% | 0% | 0% | 6.7% |')
output.append('| Colliding Oranges | 86.5% | 40% | 80% | 30% | 0% | 30% | 10% | 31.7% |')
output.append('| Surrounded Planets | 91.8% | 70% | 80% | 20% | 0% | 30% | 20% | 36.7% |')
output.append('| *Shape Overload* | *46.8%* | *20%* | *70%* | *50%* | *10%* | *50%* | *40%* | *40.0%* |')
output.append('| **Average** | **86.8%** | **20.0%** | **51.7%** | **13.3%** | **0.0%** | **26.7%** | **23.3%** | **22.5%** |')
output.append('')
note = ms_paras[161]['text'].strip().replace('\u2014\u2014', ' -- ').replace('\u2014', ' -- ')
output.append('*' + note + '*')
output.append('')

# Expanded Model Validation
output.append(ms_paras[163]['text'].strip())
output.append('')
output.append(ms_paras[164]['text'].strip())
output.append('')

# Figure 2
output.append('**FIGURE 2.** COGNITIVE TRAP PASS RATES ACROSS 34 VISION-LANGUAGE MODELS')
output.append('')
output.append('[Image: Scatter plot showing average cognitive trap pass rate (%) for 34 vision-language models plotted against release date. Dots colored by provider (Anthropic, OpenAI, Google). OLS trend line shows no significant overall improvement. Dashed line marks 86.8% human baseline.]')
output.append('')
fig2_note = ms_paras[169]['text'].strip().replace('\u2014', ' -- ')
output.append('*' + fig2_note + '*')
output.append('')

# Step 4
output.append('### Step 4: Deploy in Research Context')
output.append('')
output.append(ms_paras[174]['text'].strip())
output.append('')

# DETECTING AI AGENTS
output.append('## DETECTING AI AGENTS IN ONLINE RESEARCH: VALIDATION ON PROLIFIC')
output.append('')
output.append(ms_paras[178]['text'].strip())
output.append('')

# Method
output.append('### Method')
output.append('')
output.append(ms_paras[182]['text'].strip())
output.append('')
output.append(ms_paras[184]['text'].strip())
output.append('')
output.append(ms_paras[186]['text'].strip())
output.append('')

# Results
output.append('### Results')
output.append('')
output.append(ms_paras[190]['text'].strip())
output.append('')

# Table 3
output.append('**TABLE 3.** DETECTION METHOD PERFORMANCE AGAINST DEPLOYED AI AGENTS')
output.append('')
output.append('| Detection Method | Agents Detected | Detection Rate |')
output.append('| --- | --- | --- |')
output.append('| **Cognitive Traps (3+ failures)** | **511** | **97.1%** |')
output.append('| Traditional Methods (Any) | 12 | 2.3% |')
output.append('| - Instructional Manipulation Check | 1 | 0.2% |')
output.append('| - Obvious Answer Check | 1 | 0.2% |')
output.append('| - Memory Check | 4 | 0.8% |')
output.append('| - Straight-lining Check | 7 | 1.3% |')
output.append('| CAPTCHA (score < 0.5) | 24 | 4.6% |')
output.append('| Fast Completion (< 40% median) | 1 | 0.2% |')
output.append('')
t3_note = ms_paras[220]['text'].strip().replace('\u2014', ' -- ')
output.append('*' + t3_note + '*')
output.append('')

output.append(ms_paras[222]['text'].strip())
output.append('')

# Individual Cognitive Traps
output.append(ms_paras[224]['text'].strip())
output.append('')

# Table 4
output.append('**TABLE 4.** INDIVIDUAL COGNITIVE TRAP PERFORMANCE: HUMAN VS. AGENT DISCRIMINATION')
output.append('')
output.append('| Trap | Agent Failure Rate | Human Pass Rate | Discrimination | chi-squared | p |')
output.append('| --- | --- | --- | --- | --- | --- |')
output.append('| Modified Muller-Lyer | 94.1% (495/526) | 92.8% (934/1007) | 86.9 pp | 1113.9 | <.001 |')
output.append('| Modified Cafe Wall | 94.9% (499/526) | 88.4% (890/1007) | 83.2 pp | 992.8 | <.001 |')
output.append('| Moving Robot | 99.6% (524/526) | 77.9% (784/1007) | 77.5 pp | 827.0 | <.001 |')
output.append('| Modified Ebbinghaus | 77.6% (408/526) | 95.6% (963/1007) | 73.2 pp | 886.9 | <.001 |')
output.append('| Surrounded Planets | 55.5% (292/526) | 96.5% (972/1007) | 52.0 pp | 554.5 | <.001 |')
output.append('| Colliding Oranges | 50.6% (266/526) | 88.7% (893/1007) | 39.2 pp | 283.4 | <.001 |')
output.append('')
t4_note = ms_paras[269]['text'].strip().replace('.\u2014', '. --')
output.append('*' + t4_note + '*')
output.append('')

# Remaining results sections
for idx in [271, 273, 275, 276, 277]:
    output.append(ms_paras[idx]['text'].strip())
    output.append('')

# REPLICATION
output.append('## REPLICATION ON AMAZON MTURK AND CLOUDRESEARCH CONNECT')
output.append('')
output.append(ms_paras[280]['text'].strip())
output.append('')

output.append('### MTurk Results')
output.append('')
output.append(ms_paras[284]['text'].strip())
output.append('')
output.append(ms_paras[285]['text'].strip())
output.append('')

output.append('### CloudResearch Connect Results')
output.append('')
output.append(ms_paras[289]['text'].strip())
output.append('')

output.append('### Cross-Platform Comparison')
output.append('')
output.append(ms_paras[293]['text'].strip())
output.append('')

# GENERAL DISCUSSION
output.append('## GENERAL DISCUSSION')
output.append('')
output.append(ms_paras[296]['text'].strip())
output.append('')

output.append('### The Arms Race')
output.append('')
for idx in [300, 301, 302, 303, 304]:
    output.append(ms_paras[idx]['text'].strip())
    output.append('')

output.append('### Current Prevalence and the Economics of AI Survey Fraud')
output.append('')
output.append(ms_paras[308]['text'].strip())
output.append('')

output.append('### Practical Recommendations')
output.append('')
for idx in [312, 313, 314, 315]:
    output.append(ms_paras[idx]['text'].strip())
    output.append('')

output.append('### Reverse Traps')
output.append('')
output.append(ms_paras[319]['text'].strip())
output.append('')

output.append('### Demographic Considerations')
output.append('')
output.append(ms_paras[323]['text'].strip())
output.append('')

output.append('### Limitations')
output.append('')
output.append(ms_paras[327]['text'].strip())
output.append('')
output.append(ms_paras[328]['text'].strip())
output.append('')

# CONCLUSION
output.append('## CONCLUSION')
output.append('')
output.append(ms_paras[332]['text'].strip())
output.append('')

# DATA COLLECTION STATEMENT
output.append('## DATA COLLECTION STATEMENT')
output.append('')
output.append(ms_paras[336]['text'].strip())
output.append('')

# REFERENCES
output.append('## REFERENCES')
output.append('')
for idx in range(341, 371):
    text = ms_paras[idx]['text'].strip()
    if text and ms_paras[idx]['style'] == 'Bibliography':
        output.append(text)
        output.append('')

# ============ WEB APPENDIX ============
output.append('')
output.append('---')
output.append('')
output.append('# WEB APPENDIX')
output.append('')
output.append('Brief Commentary: A Framework for Detecting AI Agents in Online Research')
output.append('')
output.append('Felipe M. Affonso')
output.append('')

# Table of contents
output.append('**TABLE OF CONTENTS**')
output.append('')
for idx in range(9, 18):
    text = wa_paras[idx]['text'].strip()
    if text and text.startswith('Web Appendix'):
        output.append('- ' + text)
output.append('')

# Find the end of meaningful WA content (before any trailing headings list)
wa_end = len(wa_paras)
for idx in range(len(wa_paras)-1, max(0, len(wa_paras)-50), -1):
    if wa_paras[idx]['text'].strip() == 'HEADINGS LIST':
        wa_end = idx
        break

# Process WA body (paragraphs 18 onward)
wa_body = wa_paras[18:wa_end]
wa_md = build_wa_markdown(wa_body)
output.append(wa_md)

# Write the final output
final = "\n".join(output)

# Clean up excessive blank lines
while "\n\n\n\n" in final:
    final = final.replace("\n\n\n\n", "\n\n\n")

# Clean up em dashes in the whole doc
final = final.replace('\u2014\u2014', ' -- ')
final = final.replace('\u2014', ' -- ')

outpath = "C:/Users/natal/Dropbox/Felipe/CLAUDE CODE/personal-site/src/files/papers/cognitive-traps.md"
with open(outpath, 'w', encoding='utf-8') as f:
    f.write(final)

print(f"Written to {outpath}")
print(f"Total length: {len(final)} chars, {final.count(chr(10))} lines")
