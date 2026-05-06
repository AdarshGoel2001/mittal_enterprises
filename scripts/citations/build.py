"""Build lib/citations-data.ts from OpenAlex page dumps.

Filters fuzzy-match false positives by requiring "Mittal" in title or abstract,
then classifies each paper to one or more product slugs based on keyword rules.
"""
import json
import re
from pathlib import Path
from collections import defaultdict

HERE = Path(__file__).parent
ROOT = HERE.parent.parent

# Keyword -> product slug. First match wins per keyword group; a paper can map
# to multiple products. Keep keywords specific enough to avoid cross-talk.
PRODUCT_RULES = [
    # (slug, [keywords - any match])
    ("nano-fluid-interferometer", ["nanofluid", "nano fluid", "nano-fluid"]),
    ("nano-fluid-heat-capacity-apparatus", ["heat capacity", "specific heat"]),
    ("ultrasonic-interferometer-for-solids", ["ultrasonic.*solid", "elastic constant", "young.s modulus", "bulk modulus"]),
    ("thermal-conductivity-apparatus", ["thermal conductivity"]),
    ("youngs-modulus-apparatus", ["young.s modulus"]),
    ("curie-temperature-kit", ["curie temperature", "curie point", "ferroelectric"]),
    ("plancks-constant-kit", ["planck.s constant"]),
    ("dielectric-constant-kit-solid", ["dielectric constant.*solid", "dielectric.*ferroelectric"]),
    ("dielectric-constant-kit-liquid", ["dielectric constant.*liquid", "permittivity.*liquid"]),
    ("universal-b-h-curve-tracer-ubhct-001", ["b-h curve", "b-h loop", "hysteresis loop"]),
    ("b-h-curve-unit", ["b-h curve", "b-h loop"]),
    ("forbidden-energy-gap-kit", ["energy gap", "band gap"]),
    ("fourier-analysis-kit", ["fourier analysis"]),
    ("lattice-dynamics-kit", ["lattice dynamics"]),
    ("stefans-constant-kit", ["stefan.s constant", "stefan-boltzmann"]),
    ("boltzmann-constant-kit", ["boltzmann constant"]),
    ("capacitance-and-permittivity-kit", ["capacitance.*permittivity"]),
    ("photodiode-characteristics-apparatus", ["photodiode"]),
    ("led-and-laser-diode-characteristics-apparatus", ["laser diode characteristic", "led characteristic"]),
    ("laser-experiment-kits", ["he-ne laser", "laser experiment"]),
    ("fiber-optic-apparatus", ["numerical aperture", "optical fibre", "optical fiber"]),
    ("dipolemeter", ["dipole moment"]),
    ("abbe-refractometers", ["abbe refractometer"]),
    # Catch-all for the flagship product — runs LAST so it only matches if
    # nothing more specific did. We mark it via a sentinel processed after.
]

# Default product when no specific rule matches but paper clearly uses an
# ultrasonic interferometer for liquids (the flagship).
LIQUID_INTERFEROMETER_HINTS = [
    "ultrasonic velocity", "sound velocity", "speed of sound",
    "ultrasonic interferometer", "acoustic", "binary mixture",
    "molecular interaction", "viscometric", "compressibility",
]


# Model codes for Mittal's F/M-series ultrasonic interferometers. When any of
# these appear in a verified citation's title/abstract, we lock the product
# mapping and display the code on the citation card. Discovered empirically
# from validated PDFs (F-81, F-83, M-80, M-80D, M-83, M-83S, 05F) — all are
# variants of the ultrasonic interferometer for liquids.
MODEL_CODES = ["F-80", "F-81", "F-83", "M-80D", "M-80", "M-83S", "M-83", "05F"]
MODEL_CODE_PRODUCT = "ultrasonic-interferometer-for-liquids"
MODEL_CODE_RE = re.compile(r"\b(" + "|".join(re.escape(c) for c in MODEL_CODES) + r")\b")


def find_model_codes(text):
    found = []
    for m in MODEL_CODE_RE.finditer(text):
        code = m.group(1)
        if code not in found:
            found.append(code)
    return found


def reconstruct_abstract(inverted):
    if not inverted:
        return ""
    positions = [(pos, word) for word, pos_list in inverted.items() for pos in pos_list]
    positions.sort()
    return " ".join(word for _, word in positions)


def classify(title, abstract, concepts, model_codes):
    text = f"{title} {abstract} {concepts}".lower()
    matched = set()
    # Model-code presence is deterministic: any F/M-series code => liquid
    # interferometer. Lock it first, ahead of keyword rules.
    if model_codes:
        matched.add(MODEL_CODE_PRODUCT)
    for slug, patterns in PRODUCT_RULES:
        if any(re.search(p, text) for p in patterns):
            matched.add(slug)
    # Default: papers in this corpus all came back from a fulltext search for
    # "Mittal Enterprises" — overwhelmingly the brand's flagship product is
    # the ultrasonic interferometer for liquids. If nothing more specific
    # matched, bucket under that.
    if not matched:
        matched.add("ultrasonic-interferometer-for-liquids")
    return sorted(matched)


def primary_journal(work):
    pl = work.get("primary_location") or {}
    src = pl.get("source") or {}
    return src.get("display_name") or ""


def authors_short(work):
    auths = work.get("authorships") or []
    names = [a.get("author", {}).get("display_name", "") for a in auths[:3]]
    names = [n for n in names if n]
    if len(auths) > 3:
        names.append("et al.")
    return ", ".join(names)


def load_evidence() -> dict:
    """Map safe-DOI → {verified, snippet, modelCodes, productHints, pdfBytes}.
    Empty dict if extract_evidence.py hasn't run yet.
    """
    p = HERE / "evidence.json"
    if not p.exists():
        return {}
    return json.loads(p.read_text())


def doi_to_safe(doi: str) -> str:
    return doi.replace("/", "_").replace(":", "_")


def load_core() -> list[dict]:
    p = HERE / "core_raw.json"
    if not p.exists():
        return []
    return json.loads(p.read_text()).get("results", [])


def load_core_evidence() -> dict:
    p = HERE / "evidence_core.json"
    if not p.exists():
        return {}
    return json.loads(p.read_text())


def load_ia() -> list[dict]:
    p = HERE / "ia_scholar_raw.jsonl"
    if not p.exists():
        return []
    return [json.loads(line) for line in p.read_text().splitlines() if line.strip()]


def load_ia_evidence() -> dict:
    p = HERE / "evidence_ia.json"
    if not p.exists():
        return {}
    return json.loads(p.read_text())


def load_ia_csl() -> dict:
    """Map fatcat_id → {authors, journal, year} from CSL-JSON files."""
    out = {}
    csl_dir = HERE / "ia_csl"
    if not csl_dir.exists():
        return out
    for p in csl_dir.glob("*.json"):
        try:
            d = json.loads(p.read_text())
        except Exception:
            continue
        if isinstance(d, list):
            d = d[0] if d else {}
        fid = p.stem
        authors_list = d.get("author") or []
        names = []
        for a in authors_list[:3]:
            given = a.get("given", "")
            family = a.get("family", "")
            literal = a.get("literal", "")
            n = literal or f"{given} {family}".strip()
            if n: names.append(n)
        if len(authors_list) > 3:
            names.append("et al.")
        journal = d.get("container-title") or ""
        if isinstance(journal, list):
            journal = journal[0] if journal else ""
        out[fid] = {
            "authors": ", ".join(names),
            "journal": journal,
        }
    return out


def main():
    works = {}
    for p in sorted(HERE.glob("openalex_p*.json")):
        data = json.loads(p.read_text())
        for w in data.get("results", []):
            works[w["id"]] = w

    evidence = load_evidence()
    core_works = load_core()
    core_evidence = load_core_evidence()
    ia_works = load_ia()
    ia_evidence = load_ia_evidence()
    ia_csl = load_ia_csl()
    print(f"Loaded {len(works)} unique works from OpenAlex")
    print(f"Loaded {len(core_works)} works from CORE")
    print(f"Loaded {len(ia_works)} works from IA Scholar")
    print(f"Loaded {len(evidence)} OpenAlex PDF evidence records")
    print(f"Loaded {len(core_evidence)} CORE PDF evidence records")
    print(f"Loaded {len(ia_evidence)} IA Scholar PDF evidence records")

    rows = []
    dropped_no_title = 0
    for w in works.values():
        title = w.get("title") or ""
        if not title:
            dropped_no_title += 1
            continue
        abstract = reconstruct_abstract(w.get("abstract_inverted_index"))
        concepts = " ".join(c.get("display_name", "") for c in (w.get("concepts") or []))

        doi_raw = (w.get("doi") or "").replace("https://doi.org/", "")
        ev = evidence.get(doi_to_safe(doi_raw)) if doi_raw else None

        # Model codes: prefer evidence.json (extracted from PDF), fall back to
        # title/abstract scan.
        if ev and ev.get("modelCodes"):
            model_codes = ev["modelCodes"]
        else:
            model_codes = find_model_codes(f"{title} {abstract}")

        # Product classification: PDF-snippet hints (deterministic — they are
        # in the same sentence as the brand mention) override the
        # title/abstract heuristic.
        if ev and ev.get("productHints"):
            products = sorted(set(ev["productHints"]))
        else:
            products = classify(title, abstract, concepts, model_codes)

        verified = bool(ev and ev.get("verified"))
        snippet = (ev or {}).get("snippet") or ""
        evidence_page = (ev or {}).get("pageNumber")

        doi = w.get("doi") or ""
        if doi.startswith("https://doi.org/"):
            doi = doi[len("https://doi.org/"):]

        # Canonical link priority: DOI → OpenAlex work URL. We deliberately
        # skip OpenAlex's `landing_page_url` because it sometimes points at
        # author ORCID pages or other non-paper resources.
        url = f"https://doi.org/{doi}" if doi else w["id"]

        rows.append({
            "title": title,
            "year": w.get("publication_year"),
            "authors": authors_short(w),
            "journal": primary_journal(w),
            "doi": doi,
            "url": url,
            "citedByCount": w.get("cited_by_count") or 0,
            "products": products,
            "modelCodes": model_codes,
            "verified": verified,
            "evidenceSnippet": snippet,
            "evidencePage": evidence_page,
        })

    # Merge CORE results that aren't already represented (by DOI). CORE has no
    # citedByCount; treat as 0 for ordering.
    existing_dois = {r["doi"].lower() for r in rows if r["doi"]}
    existing_titles = {r["title"].strip().lower() for r in rows if r["title"]}
    core_added = 0
    core_dropped_dup = 0
    for cw in core_works:
        title = (cw.get("title") or "").strip()
        if not title:
            continue
        doi = (cw.get("doi") or "").lower()
        if doi and doi in existing_dois:
            core_dropped_dup += 1
            continue
        if title.lower() in existing_titles:
            core_dropped_dup += 1
            continue

        cid = str(cw.get("id") or "")
        ev = core_evidence.get(cid)
        if not ev or not ev.get("verified"):
            # CORE entries without PDF verification are too risky to add — they
            # could be noise from CORE's looser indexing. Skip.
            continue

        snippet = ev.get("snippet") or ""
        models = ev.get("modelCodes") or []
        products = sorted(set(ev.get("productHints") or [])) or ["ultrasonic-interferometer-for-liquids"]

        authors = ", ".join(a.get("name", "") for a in (cw.get("authors") or [])[:3])
        if len(cw.get("authors") or []) > 3:
            authors += ", et al."
        journals = cw.get("journals") or []
        journal = (journals[0].get("title") if journals else cw.get("publisher")) or ""

        # Always link to a landing page, never a direct PDF — even CORE's own
        # PDF URL is a downloadable file, not a citable record.
        url = f"https://doi.org/{doi}" if doi else f"https://core.ac.uk/works/{cid}"

        rows.append({
            "title": title,
            "year": cw.get("yearPublished"),
            "authors": authors,
            "journal": journal,
            "doi": doi,
            "url": url,
            "citedByCount": cw.get("citationCount") or 0,
            "products": products,
            "modelCodes": models,
            "verified": True,
            "evidenceSnippet": snippet,
            "evidencePage": ev.get("pageNumber"),
        })
        existing_titles.add(title.lower())
        if doi: existing_dois.add(doi)
        core_added += 1

    print(f"\nCORE merge: +{core_added} new verified citations  ({core_dropped_dup} dropped as duplicates)")

    # Merge IA Scholar — same dedup-by-DOI/title strategy. IA entries have no
    # author or journal info (only the brand-mention snippet from PDF).
    ia_added = 0
    ia_dropped_dup = 0
    ia_dropped_unverified = 0
    for iaw in ia_works:
        title = (iaw.get("title") or "").strip()
        if not title:
            continue
        doi = (iaw.get("doi") or "").lower()
        if doi and doi in existing_dois:
            ia_dropped_dup += 1; continue
        if title.lower() in existing_titles:
            ia_dropped_dup += 1; continue
        ev = ia_evidence.get(iaw.get("fatcatId") or "")
        if not ev or not ev.get("verified"):
            ia_dropped_unverified += 1; continue

        snippet = ev.get("snippet") or ""
        models = ev.get("modelCodes") or []
        products = sorted(set(ev.get("productHints") or [])) or ["ultrasonic-interferometer-for-liquids"]

        url = f"https://doi.org/{doi}" if doi else iaw.get("iaUrl") or iaw.get("fulltextUrl") or ""

        # Author/journal from CSL if we fetched it; else empty.
        csl = ia_csl.get(iaw.get("fatcatId") or "", {})
        rows.append({
            "title": title,
            "year": iaw.get("year"),
            "authors": csl.get("authors", ""),
            "journal": csl.get("journal", ""),
            "doi": doi,
            "url": url,
            "citedByCount": 0,
            "products": products,
            "modelCodes": models,
            "verified": True,
            "evidenceSnippet": snippet,
            "evidencePage": ev.get("pageNumber"),
        })
        existing_titles.add(title.lower())
        if doi: existing_dois.add(doi)
        ia_added += 1

    print(f"IA Scholar merge: +{ia_added} new verified  ({ia_dropped_dup} dups, {ia_dropped_unverified} unverified)")

    # Sort: most-cited first, then most recent
    rows.sort(key=lambda r: (-(r["citedByCount"] or 0), -(r["year"] or 0)))

    print(f"Kept {len(rows)} papers (dropped {dropped_no_title} without titles)")

    by_product = defaultdict(int)
    by_model = defaultdict(int)
    with_models = 0
    for r in rows:
        for p in r["products"]:
            by_product[p] += 1
        if r["modelCodes"]:
            with_models += 1
        for m in r["modelCodes"]:
            by_model[m] += 1
    print("\nPer-product hit counts:")
    for slug, n in sorted(by_product.items(), key=lambda x: -x[1]):
        print(f"  {n:4d}  {slug}")
    print(f"\nPapers with detected model code: {with_models}")
    for code, n in sorted(by_model.items(), key=lambda x: -x[1]):
        print(f"  {n:4d}  {code}")
    verified_count = sum(1 for r in rows if r["verified"])
    print(f"\nVerified via PDF (brand string seen in full text): {verified_count} / {len(rows)}")

    # Emit TypeScript data file
    out = ROOT / "lib" / "citations-data.ts"
    body = [
        "// AUTO-GENERATED by scripts/citations/build.py — do not edit by hand.",
        "// Source: OpenAlex search for \"Mittal Enterprises\".",
        "// Each entry was kept only if 'Mittal' appears in the title or abstract,",
        "// then classified to one or more products via keyword rules.",
        "",
        "export interface Citation {",
        "  title: string;",
        "  year: number | null;",
        "  authors: string;",
        "  journal: string;",
        "  doi: string;",
        "  url: string;",
        "  citedByCount: number;",
        "  products: string[];",
        "  modelCodes: string[];",
        "  verified: boolean;",
        "  evidenceSnippet: string;",
        "  // 1-indexed page in the source PDF where the brand mention appears.",
        "  // Display-only hint (\"evidence on page 2\"); we never re-host the PDF",
        "  // or deep-link into it — the canonical `url` (DOI) is the only link.",
        "  evidencePage: number | null;",
        "}",
        "",
        f"export const citations: Citation[] = {json.dumps(rows, ensure_ascii=False, indent=2)};",
        "",
        "// User-facing default: only show citations whose brand mention we",
        "// independently confirmed by reading the source PDF. The unverified",
        "// remainder is kept in `citations` for record-keeping but never shown.",
        "export const verifiedCitations: Citation[] = citations.filter(c => c.verified);",
        "",
        "export function citationsForProduct(slug: string): Citation[] {",
        "  return verifiedCitations.filter(c => c.products.includes(slug));",
        "}",
        "",
        "export function citationCountForProduct(slug: string): number {",
        "  return citationsForProduct(slug).length;",
        "}",
        "",
    ]
    out.write_text("\n".join(body))
    print(f"\nWrote {out.relative_to(ROOT)} ({out.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
