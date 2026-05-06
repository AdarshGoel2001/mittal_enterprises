#!/usr/bin/env bash
# Download every Unpaywall best_oa_location PDF in parallel.
# Idempotent: skips files already downloaded with size > 5 KB.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HERE/pdfs"
MAX_CONCURRENT=15

python3 - <<'PY' > "$HERE/_downloads.tsv"
import json, glob
for f in glob.glob("scripts/citations/unpaywall/*.json"):
    try:
        d = json.loads(open(f).read())
    except: continue
    if d.get("error") or not d.get("is_oa"): continue
    best = d.get("best_oa_location") or {}
    url = best.get("url_for_pdf") or best.get("url")
    doi = d.get("doi")
    if not url or not doi: continue
    safe = doi.replace("/", "_").replace(":", "_")
    print(f"{safe}\t{url}")
PY

count=0
total=$(wc -l < "$HERE/_downloads.tsv" | tr -d ' ')
echo "queued: $total"
while IFS=$'\t' read -r safe url; do
  out="$HERE/pdfs/${safe}.pdf"
  if [ -s "$out" ] && [ $(stat -f%z "$out" 2>/dev/null || stat -c%s "$out") -gt 5000 ]; then
    continue
  fi
  curl -sL -A "Mozilla/5.0 (research-bot)" --max-time 30 "$url" -o "$out" &
  count=$((count + 1))
  if (( count % MAX_CONCURRENT == 0 )); then
    wait
  fi
done < "$HERE/_downloads.tsv"
wait

# Tally
ok=0; small=0
for f in "$HERE"/pdfs/*.pdf; do
  [ -e "$f" ] || continue
  sz=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  if [ "$sz" -gt 5000 ]; then ok=$((ok+1)); else small=$((small+1)); fi
done
echo "ok: $ok    too-small (likely error): $small"
