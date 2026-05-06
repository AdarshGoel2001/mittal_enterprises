#!/usr/bin/env bash
# For every verified IA Scholar entry, fetch CSL-JSON from fatcat to get
# author + journal info that the search results don't include.
# Runs only after evidence_ia.json exists. Idempotent.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HERE/ia_csl"

# Build list of verified fatcat IDs that need CSL fetched.
python3 - <<'PY' > "$HERE/_ia_csl.tsv"
import json, os
ev_path = "scripts/citations/evidence_ia.json"
if not os.path.exists(ev_path):
    raise SystemExit("evidence_ia.json missing — run extract_evidence first")
ev = json.load(open(ev_path))
for fid, info in ev.items():
    if info.get("verified"):
        print(fid)
PY

total=$(wc -l < "$HERE/_ia_csl.tsv" | tr -d ' ')
echo "queued: $total CSL fetches"
i=0
ok=0
fail=0
while read -r fid; do
  i=$((i + 1))
  out="$HERE/ia_csl/${fid}.json"
  if [ -s "$out" ] && [ $(stat -f%z "$out" 2>/dev/null || stat -c%s "$out") -gt 50 ]; then
    ok=$((ok + 1)); continue
  fi
  curl -sS --max-time 15 "https://scholar.archive.org/fatcat/release/${fid}/citeproc?style=csl-json" -o "$out"
  sz=$(stat -f%z "$out" 2>/dev/null || echo 0)
  if [ "$sz" -gt 50 ]; then ok=$((ok + 1)); else fail=$((fail + 1)); rm -f "$out"; fi
  if (( i % 25 == 0 )); then echo "  $i / $total  (ok=$ok fail=$fail)"; fi
  sleep 0.15
done < "$HERE/_ia_csl.tsv"
echo "FINAL: ok=$ok fail=$fail"
