#!/usr/bin/env bash
set -euo pipefail

# Resolve project root directory and dictionary.html path
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DICT_FILE="${SCRIPT_DIR}/dictionary.html"

if [[ ! -f "${DICT_FILE}" ]]; then
  echo "Error: Could not find dictionary.html at ${DICT_FILE}" >&2
  exit 1
fi

echo "========================================================"
echo "  Den of the Draftsman — Add New Lexicon Definition"
echo "========================================================"
echo ""

# 1. Prompt for Term Name
TERM_NAME=""
while [[ -z "${TERM_NAME// /}" ]]; do
  read -r -p "1. Enter Term Name: " TERM_NAME
  if [[ -z "${TERM_NAME// /}" ]]; then
    echo "   Term name cannot be empty. Please try again."
  fi
done

# 2. Prompt for Category
echo ""
echo "2. Choose a Category:"
echo "   1) Perspective & Space   (perspective)"
echo "   2) Light & Value         (light-value)"
echo "   3) Composition & Notan   (composition)"
echo "   4) Anatomy & Form        (anatomy)"
echo "   5) Pen & Ink             (inking)"
echo "   6) Markers & ID          (markers)"
echo "   7) Precision Drafting    (drafting)"
echo ""

CAT_KEY=""
CAT_LABEL=""
while [[ -z "${CAT_KEY}" ]]; do
  read -r -p "   Select category [1-7]: " CAT_CHOICE
  case "${CAT_CHOICE}" in
    1)
      CAT_KEY="perspective"
      CAT_LABEL="Perspective &amp; Space"
      ;;
    2)
      CAT_KEY="light-value"
      CAT_LABEL="Light &amp; Value"
      ;;
    3)
      CAT_KEY="composition"
      CAT_LABEL="Composition &amp; Notan"
      ;;
    4)
      CAT_KEY="anatomy"
      CAT_LABEL="Anatomy &amp; Form"
      ;;
    5)
      CAT_KEY="inking"
      CAT_LABEL="Pen &amp; Ink"
      ;;
    6)
      CAT_KEY="markers"
      CAT_LABEL="Markers &amp; ID"
      ;;
    7)
      CAT_KEY="drafting"
      CAT_LABEL="Precision Drafting"
      ;;
    *)
      echo "   Invalid selection. Please enter a number from 1 to 7."
      ;;
  esac
done

# 3. Prompt for Term Definition
echo ""
TERM_DEF=""
while [[ -z "${TERM_DEF// /}" ]]; do
  read -r -p "3. Enter Term Definition: " TERM_DEF
  if [[ -z "${TERM_DEF// /}" ]]; then
    echo "   Definition cannot be empty. Please try again."
  fi
done

# 4. Insert the new term into dictionary.html in alphabetical order & update counter
TERM_NAME="${TERM_NAME}" \
CAT_KEY="${CAT_KEY}" \
CAT_LABEL="${CAT_LABEL}" \
TERM_DEF="${TERM_DEF}" \
DICT_FILE="${DICT_FILE}" \
python3 - <<'PYEOF'
import html
import os
import re
import sys

dict_file = os.environ["DICT_FILE"]
term_name = os.environ["TERM_NAME"].strip()
cat_key = os.environ["CAT_KEY"].strip()
cat_label = os.environ["CAT_LABEL"].strip()
term_def = os.environ["TERM_DEF"].strip()

escaped_attr_term = html.escape(term_name, quote=True)
escaped_heading_term = html.escape(term_name, quote=False)
escaped_def = html.escape(term_def, quote=False)

new_block = (
    f"          <!-- {escaped_heading_term} -->\n"
    f"          <article class=\"term-card\" data-term=\"{escaped_attr_term}\" data-category=\"{cat_key}\">\n"
    f"            <div>\n"
    f"              <div class=\"term-header\">\n"
    f"                <h3 class=\"term-name\">{escaped_heading_term}</h3>\n"
    f"                <span class=\"term-category-badge\">{cat_label}</span>\n"
    f"              </div>\n"
    f"              <p class=\"term-definition\">\n"
    f"                {escaped_def}\n"
    f"              </p>\n"
    f"            </div>\n"
    f"          </article>"
)

with open(dict_file, "r", encoding="utf-8") as f:
    content = f.read()

grid_marker = '<div class="lexicon-grid" id="lexicon-grid">'
grid_start = content.find(grid_marker)
if grid_start == -1:
    print("Error: Could not find #lexicon-grid in dictionary.html", file=sys.stderr)
    sys.exit(1)

before_grid = content[: grid_start + len(grid_marker)]
grid_and_after = content[grid_start + len(grid_marker) :]

# Match each existing term card inside #lexicon-grid (with optional preceding HTML comment)
card_pattern = re.compile(
    r"(?:^[ \t]*<!--[^\n]*-->\n)?^[ \t]*<article class=\"term-card\" data-term=\"([^\"]+)\"[\s\S]*?</article>",
    re.MULTILINE,
)

matches = list(card_pattern.finditer(grid_and_after))
inserted = False

for m in matches:
    existing_term = html.unescape(m.group(1)).strip()
    if term_name.lower() < existing_term.lower():
        insert_pos = m.start()
        grid_and_after = grid_and_after[:insert_pos] + new_block + "\n\n" + grid_and_after[insert_pos:]
        inserted = True
        break

if not inserted:
    if matches:
        last_match = matches[-1]
        insert_pos = last_match.end()
        grid_and_after = grid_and_after[:insert_pos] + "\n\n" + new_block + grid_and_after[insert_pos:]
    else:
        empty_marker = '<div id="lexicon-empty-state"'
        idx = grid_and_after.find(empty_marker)
        if idx == -1:
            print("Error: Could not locate insertion point in dictionary.html", file=sys.stderr)
            sys.exit(1)
        grid_and_after = grid_and_after[:idx] + new_block + "\n\n          " + grid_and_after[idx:]

content = before_grid + grid_and_after

# Ensure empty state is hidden
content = content.replace(
    'id="lexicon-empty-state" class="gallery-empty-state"',
    'id="lexicon-empty-state" class="gallery-empty-state is-hidden"',
)

# Update static term count in dictionary.html
total_terms = len(card_pattern.findall(grid_and_after))
content = re.sub(
    r'(<div class="lexicon-counter" id="lexicon-count">\s*)Showing \d+ of \d+ terms(\s*</div>)',
    rf'\g<1>Showing {total_terms} of {total_terms} terms\g<2>',
    content,
)

with open(dict_file, "w", encoding="utf-8") as f:
    f.write(content)

print(f"\nAdded '{term_name}' under [{cat_key}] (Total terms: {total_terms}).")
PYEOF
