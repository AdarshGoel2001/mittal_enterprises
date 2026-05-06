#!/usr/bin/env bash
# Fetch Unpaywall metadata for every DOI in dois.txt → up_<sanitized>.json
# Parallel, polite, idempotent (skips if already downloaded).
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HERE/unpaywall"

EMAIL="truthseeker04012025@gmail.com"
MAX_CONCURRENT=20

count=0
while IFS= read -r doi; do
  [ -z "$doi" ] && continue
  safe=$(echo "$doi" | tr '/' '_' | tr ':' '_')
  out="$HERE/unpaywall/${safe}.json"
  if [ -s "$out" ]; then
    continue
  fi
  enc=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$doi")
  curl -sS --max-time 20 "https://api.unpaywall.org/v2/${enc}?email=${EMAIL}" -o "$out" &
  count=$((count + 1))
  if (( count % MAX_CONCURRENT == 0 )); then
    wait
  fi
done < "$HERE/dois.txt"
wait
echo "done; files: $(ls "$HERE/unpaywall" | wc -l)"
