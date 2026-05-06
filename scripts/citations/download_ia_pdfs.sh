#!/usr/bin/env bash
# Download every IA Scholar fulltextUrl that isn't already in our corpus.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HERE/ia_pdfs"

# Build the to-download list: IA entries not already represented in our corpus.
python3 - <<'PY' > "$HERE/_ia_dl.tsv"
import json
existing_dois = set()
existing_titles = set()
with open("scripts/citations/dois.txt") as f:
    for line in f:
        existing_dois.add(line.strip().lower())
for cw in json.load(open("scripts/citations/core_raw.json"))["results"]:
    if cw.get("doi"): existing_dois.add(cw["doi"].lower())
    if cw.get("title"): existing_titles.add(cw["title"].strip().lower())

with open("scripts/citations/ia_scholar_raw.jsonl") as f:
    for line in f:
        r = json.loads(line)
        doi = (r.get("doi") or "").lower()
        title = (r.get("title") or "").strip().lower()
        if doi and doi in existing_dois: continue
        if not doi and title in existing_titles: continue
        if not r.get("fulltextUrl"): continue
        print(f"{r['fatcatId']}\t{r['fulltextUrl']}")
PY

total=$(wc -l < "$HERE/_ia_dl.tsv" | tr -d ' ')
echo "queued: $total"

count=0
while IFS=$'\t' read -r fid url; do
  out="$HERE/ia_pdfs/${fid}.pdf"
  if [ -s "$out" ] && [ $(stat -f%z "$out" 2>/dev/null || stat -c%s "$out") -gt 5000 ]; then
    continue
  fi
  curl -sL -A "Mozilla/5.0 (research-bot)" --max-time 40 "$url" -o "$out" &
  count=$((count + 1))
  if (( count % 12 == 0 )); then wait; fi
done < "$HERE/_ia_dl.tsv"
wait

ok=0; small=0
for f in "$HERE"/ia_pdfs/*.pdf; do
  [ -e "$f" ] || continue
  sz=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  if [ "$sz" -gt 5000 ]; then ok=$((ok+1)); else small=$((small+1)); fi
done
echo "ok: $ok    too-small: $small"
