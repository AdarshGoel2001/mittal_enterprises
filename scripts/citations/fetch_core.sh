#!/usr/bin/env bash
# Fetch all CORE hits for "Mittal Enterprises" and download their PDFs.
# CORE provides direct downloadUrl, so no Unpaywall round-trip needed.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HERE/core_pdfs"

# Pull all results in one go (totalHits=77 fits in one page at limit=100).
curl -sS "https://api.core.ac.uk/v3/search/works/?q=%22Mittal+Enterprises%22&limit=100" \
  -o "$HERE/core_raw.json"

# Emit a tsv: core_id<TAB>downloadUrl
python3 - <<'PY' > "$HERE/_core_dl.tsv"
import json
d = json.load(open("scripts/citations/core_raw.json"))
for r in d.get("results", []):
    cid = r.get("id")
    url = r.get("downloadUrl") or ""
    if cid and url:
        print(f"{cid}\t{url}")
PY

count=0
total=$(wc -l < "$HERE/_core_dl.tsv" | tr -d ' ')
echo "queued: $total CORE PDFs"
while IFS=$'\t' read -r cid url; do
  out="$HERE/core_pdfs/${cid}.pdf"
  if [ -s "$out" ] && [ $(stat -f%z "$out" 2>/dev/null || stat -c%s "$out") -gt 5000 ]; then
    continue
  fi
  curl -sL -A "Mozilla/5.0 (research-bot)" --max-time 30 "$url" -o "$out" &
  count=$((count + 1))
  if (( count % 15 == 0 )); then wait; fi
done < "$HERE/_core_dl.tsv"
wait

ok=0; small=0
for f in "$HERE"/core_pdfs/*.pdf; do
  [ -e "$f" ] || continue
  sz=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  if [ "$sz" -gt 5000 ]; then ok=$((ok+1)); else small=$((small+1)); fi
done
echo "core ok: $ok    too-small: $small"
