"""Dump every DOI from the OpenAlex page dumps to scripts/citations/dois.txt."""
import json
from pathlib import Path

HERE = Path(__file__).parent
out = HERE / "dois.txt"
seen = set()
with out.open("w") as f:
    for p in sorted(HERE.glob("openalex_p*.json")):
        for w in json.loads(p.read_text()).get("results", []):
            doi = (w.get("doi") or "").replace("https://doi.org/", "")
            if doi and doi not in seen:
                seen.add(doi)
                f.write(doi + "\n")
print(f"wrote {len(seen)} DOIs to {out}")
