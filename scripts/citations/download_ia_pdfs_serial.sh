#!/usr/bin/env bash
# Wayback Machine throttles parallel requests aggressively. Serial with a
# small inter-request delay is the only reliable approach. Idempotent: skips
# files >= 5 KB.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HERE/ia_pdfs"

total=$(wc -l < "$HERE/_ia_dl.tsv" | tr -d ' ')
done_count=0
new_count=0
fail_count=0
i=0

while IFS=$'\t' read -r fid url; do
  i=$((i + 1))
  out="$HERE/ia_pdfs/${fid}.pdf"
  if [ -s "$out" ] && [ $(stat -f%z "$out" 2>/dev/null || stat -c%s "$out") -gt 5000 ]; then
    done_count=$((done_count + 1)); continue
  fi
  curl -sL -A "Mozilla/5.0 (research-bot)" --max-time 45 --retry 2 --retry-delay 3 "$url" -o "$out"
  sz=$(stat -f%z "$out" 2>/dev/null || echo 0)
  if [ "$sz" -gt 5000 ]; then
    new_count=$((new_count + 1))
  else
    fail_count=$((fail_count + 1))
    rm -f "$out"
  fi
  if (( i % 20 == 0 )); then
    echo "progress: $i / $total  (existing=$done_count new=$new_count fail=$fail_count)"
  fi
  sleep 0.3
done < "$HERE/_ia_dl.tsv"

echo "FINAL: i=$i  existing=$done_count  new=$new_count  fail=$fail_count"
ok=$(find "$HERE/ia_pdfs" -name '*.pdf' -size +5k | wc -l | tr -d ' ')
echo "ok PDFs in dir: $ok"
