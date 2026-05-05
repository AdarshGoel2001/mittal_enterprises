# Mittal Enterprises — Live PHP site vs new Next.js site

**Date measured:** 2026-05-06
**Production PHP URL:** `https://www.mittalenterprises.com/`
**New Next.js URL:** `https://mittal-enterprises.vercel.app/` (Vercel preview, awaiting cutover)

---

## TL;DR — what changes when the new site replaces the old one

| Lever | PHP today | Next.js |
|---|---|---|
| PageSpeed mobile Performance | 79 | **98** |
| PageSpeed desktop Performance | 83 | **100** |
| PageSpeed mobile Accessibility | 58 | **96** |
| PageSpeed mobile SEO | 82 | **100** |
| `robots.txt` | **404** (missing) | present, blocks `/api/`, points at sitemap |
| `sitemap.xml` | **404** | 200 — every page listed |
| Per-page titles | only on a few PHP product pages, generic when present | every page, keyword-targeted, brand-suffixed via template |
| Per-page meta descriptions | empty on top product page | unique per page |
| Open Graph + Twitter Cards | ❌ | ✅ every page |
| Canonical URLs | ❌ | ✅ every page → production domain |
| Structured data (JSON-LD) | ❌ | Organization + Product + BreadcrumbList + ItemList + inferred LocalBusiness |
| Security headers (HSTS, nosniff, Referrer-Policy) | ❌ | ✅ |
| HTTP→HTTPS 301 on `www` host | ❌ — split index | ✅ HTTPS-only |
| Legacy 76 product URLs | live, several with duplicate `_NNNN.html` IDs ranking in parallel | all 301 → single canonical URLs |
| Form submission | (not in scope) | Resend pipeline live, env-var driven recipient |
| Server tech leaked | `X-Powered-By: PHP/7.4.33` (end-of-life) | not exposed |

---

## 1. PageSpeed Insights — head-to-head

### Mobile

| Metric | PHP (live) | Next.js (new) | Δ |
|---|---|---|---|
| **Performance** | 79 | **98** | **+19** |
| **Accessibility** | 58 | **96** | **+38** |
| **Best Practices** | 96 | **100** | +4 |
| **SEO** | 82 | **100** | **+18** |

### Desktop

| Metric | PHP (live) | Next.js (new) | Δ |
|---|---|---|---|
| **Performance** | 83 | **100** | **+17** |
| **Accessibility** | 53 | **96** | **+43** |
| **Best Practices** | 96 | **100** | +4 |
| **SEO** | 82 | **100** | **+18** |

Lighthouse explicit findings on the live PHP site (both mobile and desktop):
- "Links do not have descriptive text" (2 links)
- "Image elements do not have `[alt]` attributes" — accessibility miss + image-search SEO miss
- The 53–58 Accessibility score reflects these and other issues; this is the score keyboard / screen-reader users effectively get

The mobile Performance gap (79 → 98) is what closes the **mobile-CTR gap** flagged in the SEO audit (mobile CTR 2.09% vs desktop 4.38% at *better* positions on the live site).

---

## 2. Page-level signals

### Homepage

| | PHP | Next.js |
|---|---|---|
| `<title>` | `Ultrasonic Research Instrument, equipment \| Physics Lab Instruments Suppliers, Exporters Delhi` (89 chars, keyword-stuffed, brand absent) | `Ultrasonic Interferometers & Nanofluid Lab Instruments — Mittal Enterprises` (75 chars, leads with the unique-distinction keyword) |
| `<meta name="description">` | `Mittal Enterprises is a leading Ultrasonic Research Instrument, equipment, Physics Lab Instruments Suppliers and Exporters in Delhi, India.` | `India's only manufacturer of Nanofluid Interferometers. Ultrasonic interferometers and physics, chemistry and material science lab instruments for universities and research labs since 1976. ISO 9001:2008 · FIEO Registered.` |
| `<link rel="canonical">` | none | `https://www.mittalenterprises.com/` |
| Charset | `ISO-8859-1` (mojibake risk on σ, ⁴, °) | `UTF-8` |
| Cache-Control | `no-store, no-cache, must-revalidate` (defeats CDN) | Vercel-managed |
| Sets `PHPSESSID` cookie | yes (defeats edge caching) | no |

### A top product page — Ultrasonic Interferometer for Liquids

| | PHP | Next.js |
|---|---|---|
| `<title>` | `Ultrasonic Interferometer For Liquids` (37 chars, no item code, no value prop) | `Ultrasonic Interferometer for Liquids — F-81 Series, 1–10 MHz \| Mittal Enterprises` (search-intent rewrite from `lib/seo-overrides.ts`) |
| `<meta name="description">` | **empty** (`content=""`) | `Velocity-by-wavelength ultrasonic interferometer for liquids. Quartz-crystal cell with 0.001 mm digital micrometer; used in 30+ research parameters.` |
| Canonical | none | yes |
| OG image | none | product image |
| JSON-LD `Product` | none | full schema (sku, image, manufacturer, brand, category, model[]) |
| Breadcrumbs | visible only as text | visible **and** as `BreadcrumbList` JSON-LD |

---

## 3. Structured data (JSON-LD) — what each site exposes to Google

| Schema | PHP | Next.js |
|---|---|---|
| `Organization` | ❌ | ✅ — name, logo, address, phone, email, founded 1976, social `sameAs`, `hasCredential: ISO 9001:2008 + FIEO` |
| `Product` (per product page) | ❌ | ✅ valid for entity recognition (the "price/stars" rich snippet is intentionally skipped because there is no public pricing — see SEO_AUDIT §6) |
| `BreadcrumbList` | ❌ | ✅ |
| `ItemList` (per category) | ❌ | ✅ — every product in the category, with positions |
| `LocalBusiness` (Google-inferred from Org + address) | ❌ (no Org to infer from) | ✅ |

**Practical consequence:** Google must currently infer everything about the PHP site from raw HTML. With the new site, Google explicitly knows: this is a *manufacturer* called *Mittal Enterprises*, founded *1976*, in *Delhi*, certified *ISO/FIEO*, selling *products* of type *X* under brand *Mittal Enterprises*. That entity-level identity is what feeds the Knowledge Graph and "manufacturer of X" SERP features.

---

## 4. Crawlability & indexation

| | PHP | Next.js |
|---|---|---|
| `robots.txt` | **404** | present; allows all, blocks `/api/`, points at sitemap |
| `sitemap.xml` | **404** | 200 — static routes + 6 categories + every product |
| HTTPS canonicalisation | broken — `http://www.` serves directly without redirecting; index is split between `http://www.` and `https://www.` (see SEO_AUDIT §3) | HTTPS-only by Vercel default + HSTS header |
| HSTS | absent | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options: nosniff` | absent | present |
| `Referrer-Policy` | absent | `strict-origin-when-cross-origin` |
| Legacy product duplicate IDs (e.g. `_3269.html` + `_3290.html` for same product, both ranking) | active | every legacy ID 301s onto a single canonical |

---

## 5. The "ultrasonic" / "nanofluid" distinction

The PHP homepage title leans on **"Ultrasonic Research Instrument, equipment"** — and that is correct: Mittal Enterprises is **the only Indian manufacturer of Nanofluid Interferometers**, and it has substantial GSC impression volume on ultrasonic-interferometer queries. Dropping "ultrasonic" from the new homepage title would have surrendered that positioning.

The new homepage now leads with both keywords:

> **Ultrasonic Interferometers & Nanofluid Lab Instruments — Mittal Enterprises**

And the meta description opens with the genuine unique claim:

> *India's only manufacturer of Nanofluid Interferometers. Ultrasonic interferometers and physics, chemistry and material science lab instruments for universities and research labs since 1976.*

This is sourced from `lib/data.ts` `companyInfo.about.distinction` — not invented, consistent with the no-data-fabrication rule in CLAUDE.md.

The Profile page already centres the same claim in its hero:

> *The only manufacturer of Nanofluid Interferometers in India.*

So the distinction shows up in:
1. Homepage `<title>` and `<meta description>` (above the fold in Google SERPs)
2. Profile page H1
3. Sitewide `Organization` JSON-LD via the `name` and (future) `description` fields

---

## 6. What this comparison does **not** prove on its own

PageSpeed and on-page checks measure capability, not eventual ranking. Final SEO impact depends on:

- Production cutover happening on `https://www.mittalenterprises.com/` (the Vercel preview URL is not indexed by Google — it is a staging environment).
- The HTTP→HTTPS 301 fix on the legacy PHP host being applied **before** cutover (otherwise the new site inherits the split index — see SEO_AUDIT §3).
- The HTTPS Search Console property being verified and the new sitemap submitted.
- A 30–60 day re-indexing window during which the old `_NNNN.html` URLs fall out of the index in favour of the new clean URLs.

When all four of those happen, the rewritten titles for the 6 zero-click product pages should convert their existing impressions into clicks within ~2–4 weeks of cutover. That is the first measurable signal to watch in Search Console.

---

## Appendix — verification commands and tools used

```sh
# Headers + missing files
curl -sI https://www.mittalenterprises.com/                  → 200, no security headers, sets PHPSESSID
curl -sI https://www.mittalenterprises.com/robots.txt        → 404
curl -sI https://www.mittalenterprises.com/sitemap.xml       → 404
curl -sI http://www.mittalenterprises.com/                   → 200 OK on insecure HTTP (split-index source)

# Page-level metadata
curl -s  https://www.mittalenterprises.com/                                            → title + meta extracted
curl -sL https://www.mittalenterprises.com/products/index/ultrasonic-interferometer-for-liquids_3238.html
                                                                                       → empty meta description, no canonical, no JSON-LD

# Equivalent on the new site
curl -sI https://mittal-enterprises.vercel.app/                                         → security headers present
curl -s  https://mittal-enterprises.vercel.app/products/ultrasonics-laboratory-instruments/ultrasonic-interferometer-for-liquids
                                                                                       → unique title + description + canonical + 3 JSON-LD blocks
```

PageSpeed Insights — fresh Lighthouse runs both sites, mobile and desktop profiles.
Rich Results Test — Stefan's Constant Kit page on Vercel; 4 schemas detected, 3 valid, Product ineligible-by-design (no pricing/reviews).
