"""Extract behavioral-governance paper from DOCX to machine-readable markdown."""
import sys
sys.path.insert(0, 'C:/Users/natal/AppData/Local/Programs/Python/Python311/Lib/site-packages')
import zipfile
from xml.etree import ElementTree as ET

NS = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'm': 'http://schemas.openxmlformats.org/officeDocument/2006/math',
}

def get_para_text(para):
    """Extract plain text from a paragraph."""
    texts = []
    for elem in para.iter():
        if elem.tag == f'{{{NS["w"]}}}t':
            texts.append(elem.text or '')
        elif elem.tag == f'{{{NS["m"]}}}t':
            texts.append(elem.text or '')
    return ''.join(texts)

def get_para_style(para):
    ppr = para.find('w:pPr', NS)
    if ppr is not None:
        style = ppr.find('w:pStyle', NS)
        if style is not None:
            return style.get(f'{{{NS["w"]}}}val', '')
    return ''

def is_bold_para(para):
    """Check if the paragraph has all runs bold."""
    runs = para.findall('.//w:r', NS)
    if not runs:
        return False
    for run in runs:
        rpr = run.find('w:rPr', NS)
        if rpr is None:
            return False
        bold = rpr.find('w:b', NS)
        if bold is None:
            return False
    return True

def get_rich_text(para):
    """Get paragraph text with italic/bold formatting from runs.
    Also handles math (m:oMath) elements that exist as siblings of w:r."""
    parts = []
    # Iterate direct children to handle both w:r and m:oMath in order
    m_ns = NS['m']
    w_ns = NS['w']
    for child in para:
        tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
        ns_uri = child.tag.split('}')[0][1:] if '}' in child.tag else ''

        if ns_uri == w_ns and tag == 'r':
            # Regular word run
            rpr = child.find('w:rPr', NS)
            text = ''.join((t.text or '') for t in child.findall('w:t', NS))
            if not text:
                for mt in child.findall(f'.//{{{m_ns}}}t'):
                    text += (mt.text or '')
            if not text:
                continue

            is_b = False
            is_i = False
            is_sup = False
            if rpr is not None:
                if rpr.find('w:b', NS) is not None:
                    is_b = True
                if rpr.find('w:i', NS) is not None:
                    is_i = True
                va = rpr.find('w:vertAlign', NS)
                if va is not None and va.get(f'{{{w_ns}}}val') == 'superscript':
                    is_sup = True

            if is_sup:
                text = f'<sup>{text}</sup>'
            if is_b and is_i:
                text = f'***{text}***'
            elif is_b:
                text = f'**{text}**'
            elif is_i:
                text = f'*{text}*'
            parts.append(text)

        elif ns_uri == m_ns and tag in ('oMathPara', 'oMath'):
            # Math element - extract all m:t text
            math_text = ''.join((t.text or '') for t in child.iter() if t.tag == f'{{{m_ns}}}t')
            if math_text:
                parts.append(math_text)

    return ''.join(parts)

def has_drawing(para):
    """Check if paragraph contains an image/drawing."""
    for ns_uri in ['http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing']:
        if para.find(f'.//{{{ns_uri}}}inline') is not None:
            return True
        if para.find(f'.//{{{ns_uri}}}anchor') is not None:
            return True
    return False

def extract_table(tbl):
    """Extract a table as list of rows, each row is list of cell strings."""
    rows = tbl.findall('w:tr', NS)
    table_data = []
    for row in rows:
        cells = row.findall('w:tc', NS)
        row_data = []
        for cell in cells:
            paras = cell.findall('w:p', NS)
            # Get rich text for each para in cell, join with space
            cell_parts = []
            for p in paras:
                t = get_rich_text(p).strip()
                if t:
                    cell_parts.append(t)
            row_data.append(' '.join(cell_parts))
        table_data.append(row_data)
    return table_data

def table_to_markdown(table_data, caption=None):
    """Convert table data to markdown table string."""
    if not table_data or not table_data[0]:
        return ''

    lines = []
    if caption:
        lines.append(f'\n{caption}\n')

    # Determine column count
    ncols = max(len(row) for row in table_data)

    # Header row
    header = table_data[0]
    while len(header) < ncols:
        header.append('')
    lines.append('| ' + ' | '.join(header) + ' |')
    lines.append('| ' + ' | '.join(['---'] * ncols) + ' |')

    # Data rows
    for row in table_data[1:]:
        while len(row) < ncols:
            row.append('')
        lines.append('| ' + ' | '.join(row) + ' |')

    return '\n'.join(lines)


def process_docx(filename):
    """Extract structured content from a DOCX file."""
    with zipfile.ZipFile(filename, 'r') as z:
        xml_bytes = z.read('word/document.xml')

    tree = ET.fromstring(xml_bytes)
    body = tree.find('w:body', NS)

    # Get all body-level elements (paragraphs and tables)
    elements = []
    for child in body:
        tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
        if tag == 'p':
            elements.append(('para', child))
        elif tag == 'tbl':
            elements.append(('table', child))
        elif tag == 'sectPr':
            pass  # ignore section properties
        else:
            elements.append(('other', child))

    return elements


def build_main_paper(elements):
    """Build markdown from the main paper elements."""
    lines = []
    pending_table_caption = None
    in_bibliography = False
    in_glossary = False
    glossary_table_done = False
    table_counter = 0

    for etype, elem in elements:
        if etype == 'table':
            table_counter += 1
            tdata = extract_table(elem)
            caption = pending_table_caption
            pending_table_caption = None

            md_table = table_to_markdown(tdata, caption)
            lines.append('')
            lines.append(md_table)
            lines.append('')
            continue

        if etype != 'para':
            continue

        style = get_para_style(elem)
        text = get_para_text(elem).strip()
        rich = get_rich_text(elem).strip()
        bold = is_bold_para(elem)
        drawing = has_drawing(elem)

        if not text and not drawing:
            continue

        # Handle drawings/figures
        if drawing:
            # The next paragraph should be the caption
            continue

        # Figure caption
        if style == 'ImageCaption':
            lines.append('')
            lines.append(f'**{text}**')
            lines.append('')
            continue

        # Headings
        if style == 'Heading2':
            in_bibliography = ('References' in text)
            in_glossary = ('Glossary' in text)
            lines.append('')
            lines.append(f'## {text}')
            lines.append('')
            continue

        if style == 'Heading3':
            lines.append('')
            lines.append(f'### {text}')
            lines.append('')
            continue

        if style == 'Title':
            # Skip, we handle in YAML
            continue

        # Bibliography entries
        if style == 'Bibliography' or in_bibliography:
            lines.append(text)
            lines.append('')
            continue

        # Check for table captions (bold paragraphs starting with "Table")
        if bold and text.startswith('Table'):
            pending_table_caption = f'**{text}**'
            continue

        # Bold standalone lines (like "Funding Statement", "Competing Interests")
        if bold and not text.startswith('Table'):
            lines.append('')
            lines.append(f'**{text}**')
            lines.append('')
            continue

        # Note lines after tables
        if text.startswith('Note') and (text.startswith('Note.') or text.startswith('Note:')):
            lines.append(f'*{text}*')
            lines.append('')
            continue

        # Regular body text
        lines.append(rich)
        lines.append('')

    return '\n'.join(lines)


def build_appendix(elements):
    """Build markdown from the appendix elements."""
    lines = []
    pending_table_caption = None
    in_bibliography = False

    for etype, elem in elements:
        if etype == 'table':
            tdata = extract_table(elem)
            caption = pending_table_caption
            pending_table_caption = None

            md_table = table_to_markdown(tdata, caption)
            lines.append('')
            lines.append(md_table)
            lines.append('')
            continue

        if etype != 'para':
            continue

        style = get_para_style(elem)
        text = get_para_text(elem).strip()
        rich = get_rich_text(elem).strip()
        bold = is_bold_para(elem)

        if not text:
            continue

        if style == 'Title':
            # Skip appendix title, we add our own
            continue

        if style == 'Author':
            continue

        # Headings
        if style == 'Heading1':
            # Top level heading in appendix
            continue  # We add our own "Online Appendix" header

        if style == 'Heading2':
            in_bibliography = (text.strip() == 'References')
            if in_bibliography:
                # Skip appendix references (they duplicate the main)
                continue
            lines.append('')
            lines.append(f'## {text}')
            lines.append('')
            continue

        if style == 'Heading3':
            lines.append('')
            lines.append(f'### {text}')
            lines.append('')
            continue

        if in_bibliography:
            # Skip appendix bibliography entries
            continue

        # Table of contents entries
        if style == 'Compact':
            lines.append(f'- {text}')
            continue

        # Check for table captions (text starting with "Table OA")
        if text.startswith('Table OA') and len(text) < 120:
            pending_table_caption = f'**{text}**'
            continue

        # Regular body text
        lines.append(rich)
        lines.append('')

    return '\n'.join(lines)


# ---- Main assembly ----

# 1. Extract main paper
print("Extracting main paper...")
paper_elements = process_docx('paper_FINAL_.docx')
paper_md = build_main_paper(paper_elements)

# 2. Extract appendix
print("Extracting appendix...")
appendix_elements = process_docx('OnlineAppendix_FINAL.docx')
appendix_md = build_appendix(appendix_elements)

# 3. Assemble
yaml_header = """---
title: "Behavioral Micro-Foundations for the Space Commons: A Policy Toolkit"
authors: "Felipe M. Affonso"
journal: "Research Policy"
year: 2025
doi: "10.2139/ssrn.6575099"
citation: "Affonso, Felipe M. (forthcoming), \\"Behavioral Micro-Foundations for the Space Commons: A Policy Toolkit,\\" Research Policy."
---

> **Disclaimer:** This is a machine-readable conversion of the published paper for use with AI tools. It may contain conversion errors in formatting, tables, or equations. Always verify against the [published version](https://papers.ssrn.com/abstract=6575099).

"""

author_block = """FELIPE M. AFFONSO

*Forthcoming, Research Policy*

Felipe M. Affonso (felipe.affonso@okstate.edu) is an Assistant Professor of Marketing, Spears School of Business, Oklahoma State University, Stillwater, OK 74078. Correspondence concerning this article should be addressed to Felipe M. Affonso. www.felipemaffonso.com.

---

"""

appendix_header = """

---

# Online Appendix

"""

output = yaml_header + author_block + paper_md + appendix_header + appendix_md

# Write output
outpath = 'C:/Users/natal/Dropbox/Felipe/CLAUDE CODE/personal-site/src/files/papers/behavioral-governance.md'
with open(outpath, 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Written to {outpath}")
print(f"Total length: {len(output)} chars")
