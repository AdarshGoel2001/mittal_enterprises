"""For every downloaded PDF, extract:
  - Whether 'Mittal' appears at all (verification)
  - The first sentence containing 'Mittal' (evidence snippet)
  - Model codes mentioned in that sentence (F-81 etc.)
  - Product keywords mentioned in that sentence (refractometer, B-H curve, etc.)

Writes scripts/citations/evidence.json keyed by safe-DOI.
Pure regex + pdftotext — no LLM calls.
"""
import json
import re
import subprocess
from pathlib import Path

import sys

HERE = Path(__file__).parent
# CLI: `python extract_evidence.py [pdf_dir] [out.json]`
PDF_DIR = Path(sys.argv[1]) if len(sys.argv) > 1 else (HERE / "pdfs")
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else (HERE / "evidence.json")

# Mittal model codes seen in verified PDF snippets, mapped to the product
# they identify. Detection within a verified snippet is safe because the
# brand string is in the same sentence — no risk of catching unrelated codes.
# Order matters: list LONGER codes first so e.g. "F-80X" matches before "F-80".
MODEL_CODE_TO_PRODUCT = {
    # NF-series — nano-fluid interferometer
    "NF-10X": "nano-fluid-interferometer",
    "NF-10":  "nano-fluid-interferometer",
    # R-series — Abbe refractometer
    "R-8":    "abbe-refractometers",
    # F-series — ultrasonic interferometer for liquids (fixed-frequency)
    "F-80X": "ultrasonic-interferometer-for-liquids",
    "F-80D": "ultrasonic-interferometer-for-liquids",
    "F-81S": "ultrasonic-interferometer-for-liquids",
    "F-05":  "ultrasonic-interferometer-for-liquids",
    "F-18":  "ultrasonic-interferometer-for-liquids",
    "F-80":  "ultrasonic-interferometer-for-liquids",
    "F-81":  "ultrasonic-interferometer-for-liquids",
    "F-82":  "ultrasonic-interferometer-for-liquids",
    "F-83":  "ultrasonic-interferometer-for-liquids",
    "F-84":  "ultrasonic-interferometer-for-liquids",
    "F-85":  "ultrasonic-interferometer-for-liquids",
    # M-series — ultrasonic interferometer for liquids (multi-frequency)
    "M-80D": "ultrasonic-interferometer-for-liquids",
    "M-81S": "ultrasonic-interferometer-for-liquids",
    "M-83S": "ultrasonic-interferometer-for-liquids",
    "M-80":  "ultrasonic-interferometer-for-liquids",
    "M-81":  "ultrasonic-interferometer-for-liquids",
    "M-82":  "ultrasonic-interferometer-for-liquids",
    "M-83":  "ultrasonic-interferometer-for-liquids",
    "M-84":  "ultrasonic-interferometer-for-liquids",
    "M-85":  "ultrasonic-interferometer-for-liquids",
    # MX-series — variable-path multi-frequency interferometer
    "MX-3":  "ultrasonic-interferometer-for-liquids",
    # Older / non-standard variants
    "05F":   "ultrasonic-interferometer-for-liquids",
    "84S":   "ultrasonic-interferometer-for-liquids",
}
# Sort by length descending so the regex alternation prefers longer matches
# (e.g. "F-80X" wins over "F-80" on input "F-80X").
MODEL_CODES = sorted(MODEL_CODE_TO_PRODUCT.keys(), key=len, reverse=True)


def _flex_pattern(code: str) -> str:
    """Build a regex that matches the code with hyphen/space/period optional.
    "F-80X" → r"F[-\s.]?80X"; "M-81S" → r"M[-\s.]?81S".
    """
    parts = code.split("-")
    return r"[-\s.]?".join(re.escape(p) for p in parts)


MODEL_RE = re.compile(
    r"\b(" + "|".join(_flex_pattern(c) for c in MODEL_CODES) + r")\b",
    re.IGNORECASE,
)

# Map a raw matched string (e.g. "F81", "f 80x", "M-83") back to the
# canonical hyphenated form so we always store one normalized code per model.
_CANONICAL_BY_STRIP = {
    re.sub(r"[-\s.]", "", code).upper(): code
    for code in MODEL_CODE_TO_PRODUCT
}


def normalize_model(raw: str) -> str | None:
    return _CANONICAL_BY_STRIP.get(re.sub(r"[-\s.]", "", raw).upper())

# Product keywords in the brand-mention sentence → product slug.
# Order matters (most specific first).
PRODUCT_HINTS = [
    ("nano-fluid-interferometer",   r"\bnano[\s-]?fluid\b.*\binterferometer\b|\binterferometer\b.*\bnano[\s-]?fluid\b"),
    ("nano-fluid-heat-capacity-apparatus", r"\bnano[\s-]?fluid\b.*\bheat capacity\b|heat capacity.*nano[\s-]?fluid"),
    ("thermal-conductivity-apparatus", r"\bthermal conductivity\b"),
    ("youngs-modulus-apparatus",   r"\byoung'?s modulus\b"),
    ("curie-temperature-kit",      r"\bcurie (temperature|point)\b|\bferroelectric\b"),
    ("plancks-constant-kit",       r"\bplanck'?s constant\b"),
    ("dielectric-constant-kit-liquid", r"\bdielectric (constant|cell)\b.*\bliquid\b|\bliquid\b.*\bdielectric (constant|cell)\b"),
    ("dielectric-constant-kit-solid",  r"\bdielectric (constant|cell)\b.*\bsolid\b|\bsolid\b.*\bdielectric (constant|cell)\b"),
    ("universal-b-h-curve-tracer-ubhct-001", r"\bb[- ]?h (curve|loop)\b|\bhysteresis loop\b"),
    ("forbidden-energy-gap-kit",   r"\b(forbidden )?energy gap\b|\bband gap\b"),
    ("fourier-analysis-kit",       r"\bfourier (analysis|theorem)\b"),
    ("lattice-dynamics-kit",       r"\blattice dynamics\b"),
    ("stefans-constant-kit",       r"\bstefan'?s constant\b"),
    ("boltzmann-constant-kit",     r"\bboltzmann constant\b"),
    ("photodiode-characteristics-apparatus", r"\bphotodiode\b"),
    ("led-and-laser-diode-characteristics-apparatus", r"\b(led|laser diode)\b.*\bcharacteristic"),
    ("laser-experiment-kits",      r"\bhe[- ]?ne\b.*\blaser\b|\blaser experiment"),
    ("fiber-optic-apparatus",      r"\bnumerical aperture\b|\boptical fib(re|er)\b"),
    ("dipolemeter",                r"\bdipole moment\b|\bdipole[- ]?meter\b"),
    ("abbe-refractometers",        r"\babbe refractometer\b|\brefractometer\b"),
    ("ultrasonic-interferometer-for-solids", r"\bultrasonic\b.*\bsolid\b|\belastic constant\b|\bbulk modulus\b"),
    # Catch-all interferometer keyword → liquid (the flagship).
    ("ultrasonic-interferometer-for-liquids", r"\binterferometer\b|\bultrasonic velocity\b|\bspeed of sound\b"),
]
PRODUCT_HINT_RE = [(slug, re.compile(p, re.I)) for slug, p in PRODUCT_HINTS]

# Match brand variants (case-insensitive). 'Mittal' alone is too noisy
# (common surname), so we anchor on 'enterprise' or 'M/s Mittal'.
BRAND_RE = re.compile(
    r"(M\s*/\s*s\s+Mittal|Mittal\s+Enterprise[ds]?)",
    re.I,
)

# Sentence splitter — crude but adequate for Methods text.
SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+(?=[A-Z(\[])")


def pdftotext(pdf_path: Path) -> str:
    """Extract text WITH page breaks (\\f) so we can compute page numbers."""
    try:
        out = subprocess.run(
            ["pdftotext", "-q", str(pdf_path), "-"],  # no -nopgbrk: keep \f markers
            capture_output=True, timeout=30,
        )
        return out.stdout.decode("utf-8", errors="replace")
    except Exception:
        return ""


def find_brand_page(text_with_breaks: str) -> int | None:
    """Return the 1-indexed page on which BRAND_RE first matches, or None."""
    pages = text_with_breaks.split("\f")
    for i, page_text in enumerate(pages, start=1):
        if BRAND_RE.search(page_text):
            return i
    return None


def find_brand_sentence(text: str) -> str | None:
    # Collapse whitespace for sentence splitting; preserve enough structure.
    flat = re.sub(r"[\r\n]+", " ", text)
    flat = re.sub(r"\s+", " ", flat).strip()
    if not BRAND_RE.search(flat):
        return None
    # Find the first sentence containing the brand.
    for sent in SENTENCE_SPLIT_RE.split(flat):
        if BRAND_RE.search(sent):
            return sent.strip()
    return None


def classify_from_snippet(snippet: str, model_codes: list[str]) -> list[str]:
    """Return product slugs hinted by the brand-mention sentence.

    Priority:
      1. Detected model codes (deterministic — e.g., NF-10 → nano-fluid).
      2. Keyword regexes on the snippet text.
      3. Default to liquid interferometer if nothing matched.
    """
    # 1. Model-code → product is the highest-confidence signal because the
    #    code names the actual instrument the authors used.
    code_products = sorted({
        MODEL_CODE_TO_PRODUCT[c] for c in model_codes if c in MODEL_CODE_TO_PRODUCT
    })
    if code_products:
        return code_products

    # 2. Fall back to keyword scan of the snippet.
    matched = []
    for slug, rx in PRODUCT_HINT_RE:
        if rx.search(snippet):
            matched.append(slug)
    # Dedupe while preserving order; if the catch-all is present alongside a
    # specific kit, drop the catch-all.
    if len(matched) > 1 and "ultrasonic-interferometer-for-liquids" in matched:
        matched = [m for m in matched if m != "ultrasonic-interferometer-for-liquids"] or matched
    return matched


def safe_to_doi(safe: str) -> str:
    # Reverse what download_pdfs.sh did: '/' → '_' and ':' → '_'.
    # Lossy (we can't perfectly reverse), but DOIs are unique by their full
    # safe form so keying on safe is fine.
    return safe.replace("_", "/", 1)  # only first '_' is the registrant break


def main():
    pdfs = sorted(PDF_DIR.glob("*.pdf"))
    print(f"Found {len(pdfs)} PDFs")

    out: dict = {}
    verified = 0
    too_small = 0
    no_brand = 0
    classified = 0

    for pdf in pdfs:
        safe = pdf.stem
        size = pdf.stat().st_size
        if size < 5000:
            too_small += 1
            out[safe] = {"verified": False, "reason": "pdf-too-small", "pdfBytes": size}
            continue
        text = pdftotext(pdf)
        if not text or len(text) < 200:
            too_small += 1
            out[safe] = {"verified": False, "reason": "pdftotext-empty", "pdfBytes": size}
            continue

        snippet = find_brand_sentence(text)
        if not snippet:
            no_brand += 1
            out[safe] = {"verified": False, "reason": "no-brand-mention", "pdfBytes": size}
            continue

        page_no = find_brand_page(text)
        verified += 1
        # Trim absurdly long snippets to a sane length for display.
        if len(snippet) > 400:
            # Center the snippet around the brand mention.
            m = BRAND_RE.search(snippet)
            if m:
                start = max(0, m.start() - 180)
                end = min(len(snippet), m.end() + 180)
                snippet = ("…" if start > 0 else "") + snippet[start:end] + ("…" if end < len(snippet) else "")

        models = []
        for m in MODEL_RE.finditer(snippet):
            canon = normalize_model(m.group(1))
            if canon and canon not in models:
                models.append(canon)

        product_hints = classify_from_snippet(snippet, models)
        if product_hints:
            classified += 1

        out[safe] = {
            "verified": True,
            "snippet": snippet,
            "modelCodes": models,
            "productHints": product_hints,
            "pdfBytes": size,
            "pageNumber": page_no,
        }

    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2))
    print(f"\nWrote {OUT}")
    print(f"  verified (brand string found):   {verified}")
    print(f"  classified by snippet keyword:   {classified}")
    print(f"  no brand mention in PDF:         {no_brand}")
    print(f"  PDF too small / extract failed:  {too_small}")


if __name__ == "__main__":
    main()
