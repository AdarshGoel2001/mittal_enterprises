#!/usr/bin/env bash
# IA Scholar's /search endpoint accepts only POST. Pagination is `offset=N`.
# Total = 501 hits at 15/page = 34 pages, offsets 0..495 step 15.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HERE/ia_pages"

QUERY='"Mittal Enterprises"'
TOTAL=510  # safety margin past 501
STEP=15

count=0
for offset in $(seq 0 $STEP $TOTAL); do
  out="$HERE/ia_pages/p_${offset}.html"
  if [ -s "$out" ] && [ $(stat -f%z "$out" 2>/dev/null || stat -c%s "$out") -gt 10000 ]; then
    continue
  fi
  curl -sS -X POST "https://scholar.archive.org/search" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -A "Mozilla/5.0 (research-bot)" \
    --data-urlencode "q=${QUERY}" \
    --data "offset=${offset}" \
    -o "$out" &
  count=$((count + 1))
  if (( count % 8 == 0 )); then wait; fi
done
wait

echo "downloaded $(ls "$HERE/ia_pages" | wc -l | tr -d ' ') pages"
ls -la "$HERE/ia_pages" | awk '{print $9, $5}' | head -10
