#!/usr/bin/env bash
# Retry the OpenAlex PDFs that failed first download (mostly transient
# parallel-download issues). Serial, with longer timeout and 2 retries.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

python3 - <<'PY' > "$HERE/_oa_retry.tsv"
import json, glob, os
ok_files = {p.split('/')[-1].replace('.pdf','') for p in glob.glob('scripts/citations/pdfs/*.pdf') if os.path.getsize(p) > 5000}
for f in glob.glob("scripts/citations/unpaywall/*.json"):
    try: d = json.loads(open(f).read())
    except: continue
    if d.get("error") or not d.get("is_oa"): continue
    best = d.get("best_oa_location") or {}
    url = best.get("url_for_pdf") or best.get("url")
    doi = d.get("doi")
    if not url or not doi: continue
    safe = doi.replace("/", "_").replace(":", "_")
    if safe not in ok_files:
        print(f"{safe}\t{url}")
PY

total=$(wc -l < "$HERE/_oa_retry.tsv" | tr -d ' ')
echo "queued retry: $total"
i=0; new=0; fail=0
while IFS=$'\t' read -r safe url; do
  i=$((i + 1))
  out="$HERE/pdfs/${safe}.pdf"
  curl -sL -A "Mozilla/5.0 (research-bot)" --max-time 45 --retry 2 --retry-delay 3 "$url" -o "$out"
  sz=$(stat -f%z "$out" 2>/dev/null || echo 0)
  if [ "$sz" -gt 5000 ]; then new=$((new + 1)); else fail=$((fail + 1)); rm -f "$out"; fi
  if (( i % 15 == 0 )); then echo "  $i / $total  (new=$new fail=$fail)"; fi
  sleep 0.4
done < "$HERE/_oa_retry.tsv"
echo "OA-RETRY FINAL: i=$i new=$new fail=$fail"
