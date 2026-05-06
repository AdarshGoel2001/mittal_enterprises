"""Parse IA Scholar HTML pages → ia_scholar_raw.jsonl.

Each result block is anchored by the fatcat release link. We extract title,
DOI, fulltext URL, fatcat release id, and year (from the citation string).
Pure regex — IA Scholar's HTML is consistent enough.
"""
import json
import re
from pathlib import Path
from html import unescape

HERE = Path(__file__).parent
PAGES = HERE / "ia_pages"
OUT = HERE / "ia_scholar_raw.jsonl"

# Each result begins with a section anchored by /fatcat/release/<id>.
# Use that as the splitter, then parse fields out of each chunk.

RELEASE_RE = re.compile(r'/fatcat/release/([a-z0-9]{20,})')
TITLE_RE = re.compile(
    r'<h3 class="biblio-title">.*?<span class="link">\s*(.*?)\s*</span>',
    re.DOTALL,
)
DOI_RE = re.compile(r'href="(https?://(?:dx\.)?doi\.org/[^"]+)"')
FULLTEXT_RE = re.compile(
    r'href="(https?://web\.archive\.org/web/[^"]+)"'
    r'\s+data-goatcounter-click="serp-fulltext"'
)
ORIG_FULLTEXT_RE = re.compile(
    r'<a rel="external noopener" href="(https?://[^"]+)">the original URL</a>'
)
CITATION_RE = re.compile(
    r'<b>Citation</b>\s*<p>&#34;(.*?)&#34;\s*(.*?)<div class="ui divider"',
    re.DOTALL,
)
YEAR_RE = re.compile(r'\((\d{4})\)')

# Strip any HTML tags from a field value.
TAG_STRIP = re.compile(r'<[^>]+>')

def clean(s: str) -> str:
    if s is None:
        return ""
    s = TAG_STRIP.sub("", s)
    s = unescape(s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def parse_page(html: str):
    """Yield one record per result on the page."""
    # Split on each occurrence of the fatcat release href.
    # Each result has this pattern in its action-bar; use as anchor and look
    # backwards & forwards for fields.
    # Strategy: find fatcat IDs in order, dedupe per-page (each appears
    # ~3 times — citation menu, code link, etc — first one is the start).
    matches = list(RELEASE_RE.finditer(html))
    seen_ids = []
    chunks = []
    last_pos = 0
    for m in matches:
        rid = m.group(1)
        if rid in seen_ids:
            continue
        seen_ids.append(rid)
        chunks.append((rid, last_pos, m.end()))
        last_pos = m.end()
    # Final chunk extends to end of page
    bounded = []
    for i, (rid, _start, end) in enumerate(chunks):
        next_start = chunks[i + 1][1] if i + 1 < len(chunks) else len(html)
        # Use a wide window: from previous record's end to the next record's start
        prev_end = chunks[i - 1][2] if i > 0 else 0
        bounded.append((rid, html[prev_end:next_start]))

    for rid, chunk in bounded:
        title_m = TITLE_RE.search(chunk)
        title = clean(title_m.group(1)) if title_m else ""
        if not title:
            continue
        doi_m = DOI_RE.search(chunk)
        doi = ""
        if doi_m:
            doi = doi_m.group(1).replace("https://doi.org/", "").replace("http://dx.doi.org/", "").replace("https://dx.doi.org/", "")
        ft_m = FULLTEXT_RE.search(chunk)
        fulltext = ft_m.group(1) if ft_m else ""
        if not fulltext:
            ft_m = ORIG_FULLTEXT_RE.search(chunk)
            fulltext = ft_m.group(1) if ft_m else ""
        # Year from citation string
        cite_m = CITATION_RE.search(chunk)
        year = None
        cite_extra = ""
        if cite_m:
            cite_extra = clean(cite_m.group(2))
            ym = YEAR_RE.search(cite_extra)
            if ym:
                year = int(ym.group(1))
        yield {
            "title": title,
            "year": year,
            "doi": doi,
            "fulltextUrl": fulltext,
            "fatcatId": rid,
            "iaUrl": f"https://scholar.archive.org/fatcat/release/{rid}",
            "citationFragment": cite_extra,
        }


def main():
    seen = set()  # dedupe by fatcat id across pages
    rows = []
    pages = sorted(PAGES.glob("p_*.html"), key=lambda p: int(p.stem.split("_")[1]))
    for page in pages:
        html = page.read_text(errors="replace")
        page_recs = 0
        for rec in parse_page(html):
            if rec["fatcatId"] in seen:
                continue
            seen.add(rec["fatcatId"])
            rows.append(rec)
            page_recs += 1
        print(f"  {page.name}: +{page_recs} ({len(rows)} total)")

    with OUT.open("w") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    with_doi = sum(1 for r in rows if r["doi"])
    with_ft = sum(1 for r in rows if r["fulltextUrl"])
    print(f"\nWrote {OUT}")
    print(f"  total: {len(rows)}")
    print(f"  with DOI: {with_doi}")
    print(f"  with fulltext URL: {with_ft}")


if __name__ == "__main__":
    main()
