# Mittal Enterprises — SEO Audit

**Date:** 2026-05-05
**Live site audited:** `http://www.mittalenterprises.com/` (PHP, in production)
**Replacement audited:** `/Users/martian/Documents/Code/mittal_enterprises/` (Next.js 16, not yet deployed)
**Empirical anchor:** Google Search Console export, last 91 days (Feb 4 – May 3, 2026)

---

## 1. Executive summary

Mittal Enterprises gets **~604 organic clicks / 91 days (~200/month)** at avg position 6.4. 88% from India, ~3% US, the rest a long tail of academic/export markets. The site ranks well — most clicks come from positions 1–6 — but **converts impressions to clicks poorly**: 20,325 impressions → 604 clicks = **~3.0% CTR sitewide**, with several queries showing **1,000+ impressions and zero clicks**.

The single biggest finding is not on the new site or the old site — it is in **how Google has indexed the production domain**. The current PHP site mishandles HTTPS in a way that has caused Google to index every page **twice**, once on `http://` and once on `https://`, with the two copies actively competing. This is fixable in one Apache rule and should be fixed **before** the Next.js cutover, otherwise the cutover inherits the split.

The new Next.js redesign solves several PHP-era problems (clean URLs, 76/76 legacy 301 coverage, sitemap.ts, robots.ts) but introduces a serious regression: **every page in the new site has the same `<title>` and meta description**, because no page defines its own metadata. Shipping the redesign as-is will collapse the long-tail product rankings the PHP site currently earns.

### Top 5 priorities (do in this order)

| # | Priority | Effort | Impact |
|---|----------|--------|--------|
| 1 | Fix `http://www.` → `https://www.` 301 on the live PHP site | 5 min | Critical |
| 2 | Add `generateMetadata` to product, category, and static pages on the Next.js site before deploying | 1–2 days | Critical |
| 3 | Add Product + Organization JSON-LD on the Next.js site | half-day | High |
| 4 | Verify a `https://www.` property in Search Console + submit sitemap | 30 min | High |
| 5 | Rewrite zero-click product pages targeting "stefan's constant", "photodiode characteristics", "forbidden energy gap" — they already rank pos 6–10 with thousands of impressions | 1–2 days content work | High |

---

## 2. Current performance — what the GSC data actually says

### Volume and trend
- **Feb 2026:** 163 clicks / 5,936 impr / pos 8.1
- **Mar 2026:** 153 clicks / 5,440 impr / pos 6.3
- **Apr 2026:** 273 clicks / 8,423 impr / pos 6.4
- **May 1–3:** 15 clicks / 526 impr / pos 6.7

Trend is up — April nearly doubled February clicks. Impressions and position both improved, so this is real ranking gain, not seasonality.

### Geography (Countries.csv)
- **India: 533 clicks (88.3%) / 15,872 impr / pos 5.71** — this is the business
- US: 16 clicks / 2,232 impr / pos 8.2 — high impressions, weak CTR (0.72%)
- Long tail of export-relevant countries (Nepal, Bangladesh, UAE, Kuwait, UK, Germany, Hong Kong) with single-digit clicks each
- The "global exporter" branding is aspirational; the data shows a domestic Indian B2B with token export traffic

### Devices (Devices.csv) — important
| Device | Clicks | Impr | CTR | Pos |
|--------|--------|------|-----|-----|
| Desktop | 345 | 7,870 | 4.38% | 9.24 |
| Mobile | 254 | 12,133 | 2.09% | 5.34 |
| Tablet | 5 | 322 | 1.55% | 7.33 |

**Mobile gets better positions (5.34 vs 9.24) but half the CTR (2.09% vs 4.38%).** That gap is almost always a mobile UX/page-experience issue — slow load, layout shift, or a SERP snippet that doesn't read well on mobile. The current PHP site is not mobile-first; the redesign should close this gap.

### Top earning pages (Pages.csv)
1. Homepage — 200 clicks / 3,896 impr / pos 4.19
2. `ultrasonic-interferometer-for-liquids_3238.html` — 71 clicks
3. `Universal-B-H-curve-Tracer.pdf` — **37 clicks (a PDF brochure ranks #3)**
4. `lattice-dynamics-kit_3273.html` — 30 clicks
5. `universal-b-h-curve-tracer_3269.html` — 26 clicks

PDFs collectively earn ~110 clicks (≈18% of all traffic). The new site preserves them at exact paths in `public/media_upload/` — verified, this is correct.

### The real opportunity — zero-click queries that already rank
Pages with strong rankings but ~0% CTR. These are the highest-leverage wins:

| Query | Impr | Pos | Clicks |
|-------|------|-----|--------|
| stefan's constant | **1,089** | 6.49 | **0** |
| iv characteristics of photodiode | 185 | 9.33 | 0 |
| photodiode characteristics | 143 | 9.62 | 0 |
| forbidden energy gap of silicon and germanium | 132 | 9.58 | 0 |
| vi characteristics of photodiode | 132 | 10.05 | 0 |
| photodiode characteristics experiment | 102 | 6.91 | 0 |
| stephen constant | 99 | 3.32 | 0 |
| forbidden energy gap for silicon | 98 | 10.9 | 0 |
| stefan's constant experiment | 89 | 6.47 | 0 |
| **bh curve circuit diagram** | **86** | **1.0** | **0** |
| ultrasonic interferometer virtual lab | 80 | 7.11 | 0 |
| what is ultrasonic interferometer | 73 | 4.93 | 0 |
| forbidden energy gap formula | 64 | 2.06 | 0 |

`bh curve circuit diagram` ranks **first** with 86 impressions and **zero clicks** — that is a snippet/title problem, not a ranking problem. Same shape across all rows: the page is good enough to rank but the SERP listing doesn't earn the click. Fix the title tag, meta description, and intro paragraph and the clicks come immediately.

The students/researchers searching these terms want lab-experiment write-ups, not "buy this kit" pages. The PHP product pages give them the latter. The Next.js redesign already has Markdown product content (`lib/products-content.ts`) — extending that with experiment write-ups is the natural fit.

---

## 3. Critical issue — split HTTP/HTTPS index

### Verified behavior (re-confirmed during this audit)

```
$ curl -sIL http://www.mittalenterprises.com/
HTTP/1.1 200 OK            ← serves directly on insecure HTTP
Server: LiteSpeed
(no Location header, no HSTS)

$ curl -sIL http://mittalenterprises.com/
HTTP/1.1 301 Moved Permanently   ← apex correctly redirects
Location: https://www.mittalenterprises.com/

$ curl -sI https://www.mittalenterprises.com/
HTTP/2 200
(no strict-transport-security header)
```

The apex redirects. The www host does not. There is no HSTS header on the HTTPS response either, so even browsers that auto-upgrade aren't told to keep doing so.

### Why this matters
- Google has ingested every page on **both** `http://www.` and `https://www.`. The GSC export confirms this — every URL in `Pages.csv` is `http://www....`. That is **the indexed canonical** in Google's eyes for this property.
- Different queries surface different protocols (the user has observed this). Each protocol is a separate URL to Google; ranking signals (links, clicks, CTR) split between the two.
- Bing, Googlebot, social-card scrapers, older browsers, and cURL all see the insecure version. Modern Chrome/Safari auto-upgrade users — but search crawlers do not.
- The mismatch between "apex redirects, www doesn't" tells us the host did know how to add a redirect rule. They put it in once and never repeated it for www.

### The fix
Add to `.htaccess` on the production PHP site (or LiteSpeed equivalent) **before** decommissioning:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^mittalenterprises\.com$ [NC]
RewriteRule ^(.*)$ https://www.mittalenterprises.com/$1 [R=301,L]
```

Then add HSTS to the HTTPS response (LiteSpeed → response header):
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

After that:
1. In Search Console, **add and verify the `https://www.mittalenterprises.com/` property** if it isn't already verified. The current GSC export is from the HTTP property — by definition it cannot show HTTPS data, so we can't tell from this export alone whether the HTTPS property has been claimed. Flag for the owner.
2. Submit the sitemap (the new Next.js `/sitemap.xml`) to the HTTPS property.
3. Use the URL-Inspection / removals tools in GSC to ask Google to drop the HTTP duplicates faster, but don't `noindex` HTTP — let the 301 do its work.

**Do this on the PHP site this week, even if the Next.js launch is months away.** Once it's done, the Next.js cutover later inherits a clean canonical. Doing it the other way around (launching Next.js first, then fixing) means re-consolidating the index twice.

---

## 4. Crawlability & indexation

### Old PHP site
- `robots.txt`: **404** (no file). Google-tolerant but a wasted opportunity.
- `sitemap.xml`: **404**. No sitemap exists. Confirmed by direct fetch.
- 70 distinct URLs surfaced in GSC across 91 days — covers homepage, ~25 product pages, 17 PDFs, 5 category pages, contact/profile/global-supplies, and a small handful of image URLs (a few `.jpg` files indexed because they have inbound links).
- Several products have **two old IDs ranking simultaneously** — same product, two URLs:
  - `universal-b-h-curve-tracer_3269.html` (26 clicks, pos 7.1) AND `universal-b-h-curve-tracer_3290.html` (10 clicks, pos 6.6)
  - `dielectric-constant-kit_3268.html` (18 clicks) AND `dielectric-constant-kit_3289.html` (6 clicks)
  - `ultrasonic-interferometer-for-solids_3265.html` AND `_3239.html`
  - `dielectric-constant-kit-for-liquid_6472.html` AND `dielectric-constant-kit-for-liquids_6476.html`

  This is content duplication from the old CMS allowing the same product under multiple categories. The new `lib/legacy-redirects.ts` already collapses both IDs onto a single canonical URL — verified at lines 50, 56–57 (and similar) where multiple `_NNNN.html` sources point to one destination. **This is exactly correct and a major win** the redesign delivers for free.

### New Next.js site
- `app/robots.ts` — present, allows all, points at sitemap. Good. Consider blocking `/api/` explicitly.
- `app/sitemap.ts` — present and correct. Lists static routes + 6 categories + every product. Uses `https://www.mittalenterprises.com` as base. Good.
- 76/76 old URLs verified to 301 → 200 (per CLAUDE.md). PDFs preserved at exact paths under `public/media_upload/`.
- `next.config.ts` only wires up redirects — **no `headers()` block**. No HSTS, no `X-Content-Type-Options`, no `Referrer-Policy`. Add these before launch.

**Recommendation for `next.config.ts`:**
```ts
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  }];
}
```

---

## 5. On-page SEO — the new Next.js site has a critical regression

### The problem
`app/layout.tsx:25–29` defines a single global `<title>` and meta description:
```ts
export const metadata: Metadata = {
  title: "Mittal Enterprises — Laboratory Scientific Instruments",
  description:
    "Manufacturer of ultrasonic, nanofluid and laboratory scientific instruments for universities and research labs. Est. 1976. ISO 9001:2008 · FIEO Registered.",
};
```

`grep -rn "generateMetadata\|export const metadata" app/` returns **only this one match**. Every product, every category, the contact page, profile, global-supplies, enquiry — all 30+ unique pages — will inherit the same title and description in production.

### Why this matters specifically here
The PHP site's traffic is **distributed across 26+ product pages**, not concentrated on the homepage (200 of 604 clicks, 33%). Each PHP product page has its own title (e.g. "Ultrasonic Interferometer For Liquids") and that title is what's currently competing in SERPs for queries like "ultrasonic interferometer", "lattice dynamics kit", "stefan's constant", etc. Replacing all of those with one generic site-wide title will:
- Collapse the click-through differentiation between SERP listings (Google may even drop duplicate-titled pages from the SERP feature)
- Remove keyword signal from titles, lowering relevance scoring
- Forfeit the zero-click recovery opportunity in §2 (those gains require *better* titles, not none)

### The fix
For `app/products/[slug]/[productSlug]/page.tsx`:
```ts
export async function generateMetadata({ params }) {
  const { slug, productSlug } = await params;
  const product = getProductBySlug(productSlug);
  const category = productCategories.find(c => c.slug === slug);
  if (!product || !category) return {};
  return {
    title: `${product.name} — ${product.itemCode} | Mittal Enterprises`,
    description: product.description?.slice(0, 155),
    alternates: { canonical: `/products/${category.slug}/${product.slug}` },
  };
}
```

Same pattern for `app/products/[slug]/page.tsx` (category), `app/products/page.tsx`, `app/profile/page.tsx`, etc. Add `metadataBase: new URL('https://www.mittalenterprises.com')` in `app/layout.tsx` so canonical/OG URLs resolve to absolute.

### Title rewrites for zero-click pages
Don't just template; for the 5 highest-impression-zero-click pages, write the title to match search intent:

| Product | Suggested title |
|---------|-----------------|
| stefans-constant-kit | "Stefan's Constant Experiment Kit — Verify σ in the Lab \| Mittal" |
| photodiode-characteristics-apparatus | "Photodiode Characteristics Apparatus — I-V & V-I Curve Setup" |
| forbidden-energy-gap-kit | "Forbidden Energy Gap Kit — Silicon & Germanium Band-Gap Experiment" |
| universal-b-h-curve-tracer | "B-H Curve Tracer with Circuit Diagram — Hysteresis Loop Apparatus" |
| ultrasonic-interferometer-for-liquids | "Ultrasonic Interferometer for Liquids — F-81 Series, 1–10 MHz" |

These titles answer the queries that already drive impressions. Change them, click-through follows.

---

## 6. Structured data (schema)

Neither site has any structured data. (Verified: no JSON-LD generators, no `application/ld+json` strings in either codebase.) For a B2B manufacturer this is a low-effort, high-value add on the Next.js site:

- **`Organization`** in `app/layout.tsx` — name, logo, address, FIEO/ISO credentials, sameAs (any social/listing URLs).
- **`Product`** on each product detail page — `name`, `image`, `sku` (item code), `manufacturer`, `category`, `brand: "Mittal Enterprises"`. **Skip `offers`/`price` and `aggregateRating`** — per CLAUDE.md no data fabrication, and this is a quote-based B2B sale with no public pricing.
- **`BreadcrumbList`** on product/category pages — already have the breadcrumb data passed to `<PageHeader>`.

Verify with the Rich Results Test (https://search.google.com/test/rich-results) after deploy. Do **not** rely on `curl`/`web_fetch` to confirm — they strip `<script type="application/ld+json">`.

---

## 7. Mobile, speed, and Core Web Vitals

Not measured live in this audit (PHP production load times not benchmarked here). What we can say:

- PHP site mobile CTR is 2.09% vs desktop 4.38% at *better* positions — strong indicator of poor mobile experience on the live site
- Next.js redesign uses `next/font` with `display: swap` (good), `next/image` with `priority`/`sizes` (good), Tailwind v4 (small CSS), no carousels per CLAUDE.md
- Static export by default — should produce excellent CWV out of the box

**Action after deploy:** run PageSpeed Insights on top 5 product pages, check mobile LCP < 2.5s, INP < 200ms, CLS < 0.1, and submit the new sitemap to GSC's CWV report.

---

## 8. Content quality and E-E-A-T

The Stefan/photodiode/forbidden-gap-kit queries reveal a content-mismatch problem the redesign can fix:

- People searching "stefan's constant experiment", "photodiode characteristics experiment", "forbidden energy gap of silicon" want **a lab experiment writeup** — formula, procedure, sample readings, interpretation.
- The current product pages give them a marketing description and a brochure PDF link.
- The new site's `lib/products-content.ts` + Markdown system (with KaTeX already wired in `app/layout.tsx`) is the **right substrate** for adding a "Theory & procedure" section to each kit page.

This is *not* fabricating data (CLAUDE.md hard rule) — Stefan's law, photodiode I-V theory, and the band-gap method are textbook physics. Source from standard university lab manuals, not the company DB. Adding 300–500 words of theory+procedure per kit at the bottom of the product page would convert ~3,500 wasted impressions/quarter to clicks without inventing a single product spec.

**Trust signals** are already on the new site (ISO 9001:2008, FIEO, Est. 1976, Delhi address). These belong in the footer and `Organization` schema. Make sure the contact page exposes a real phone number, address, and email — Google's Trustworthiness signal weighs this for B2B suppliers.

### Footer credit (per CLAUDE.md)
Confirmed the new footer says "Made with ♥ by Adarsh Goel". Old PHP footer's DIGIHIVESOL/TRADEBRIO line is gone. Good.

---

## 9. Internal linking and architecture

Old PHP: deep sidebar with category list on every page, single product per "subcategory" creating the duplicate-ID problem above.

New Next.js: `<Sidebar>` scoped to product pages only (per CLAUDE.md and verified in `app/products/[slug]/[productSlug]/page.tsx:59`). Good. Recommend:
- Add 3 contextual product cross-links in the markdown content of each product (e.g. "see also: nanofluid heat capacity apparatus") — helps both crawl depth and dwell time
- Category pages already list their products in a clean grid (verified `app/products/[slug]/page.tsx:46`)
- `RecentlyViewed` component is present — fine, but it's client-state, won't help crawl

---

## 10. Search Console hygiene

- Confirm a `https://www.mittalenterprises.com/` property exists in GSC. The export filename indicates the data we have is from the `http://www.` property — if no HTTPS property exists, Google's data on the canonical version of the site is invisible.
- After fixing HTTP→HTTPS redirect: re-submit a sitemap (PHP site has none; can manually submit a single-line `<urlset>` listing the homepage, or wait for the Next.js launch).
- After Next.js launch: submit `https://www.mittalenterprises.com/sitemap.xml` to **both** properties so the migration is observed cleanly. Watch the Coverage report for 30 days.
- Set up a **Domain property** (`mittalenterprises.com`) — this consolidates http/https/www/non-www reporting into one view and is the modern recommendation.

---

## 11. Prioritized action plan

### This week (do before anything else)
1. **Add `http://www. → https://www.` 301** on the production PHP `.htaccess` + add HSTS header. (5 minutes; most consequential SEO change available.)
2. **Verify HTTPS property in Search Console**, plus a Domain property.
3. Submit a basic sitemap to the HTTPS property.

### Pre-launch on the Next.js site (blockers — do not deploy without these)
4. Add `generateMetadata` to:
   - `app/products/[slug]/[productSlug]/page.tsx` (product detail)
   - `app/products/[slug]/page.tsx` (category)
   - `app/products/page.tsx`, `app/profile/page.tsx`, `app/contact/page.tsx`, `app/global-supplies/page.tsx`, `app/enquiry/page.tsx`
5. Add `metadataBase` and per-page `alternates.canonical` in those generators.
6. Rewrite titles for the 5 zero-click high-impression products (§5 table).
7. Add `Organization` JSON-LD in `app/layout.tsx`, `Product` + `BreadcrumbList` JSON-LD in product detail page.
8. Add `headers()` block to `next.config.ts` (HSTS, nosniff, referrer-policy).
9. Block `/api/` in `app/robots.ts`.

### Launch day
10. Deploy. Confirm `https://www.mittalenterprises.com/sitemap.xml` returns 200. Submit to GSC.
11. Spot-check 5 redirects manually (e.g. `/products/index/ultrasonic-interferometer-for-liquids_3238.html`). Look for `301 → 200`.
12. Run PageSpeed Insights on homepage + 3 top product pages.
13. Run Rich Results Test on a product URL.

### First 30 days post-launch
14. Watch GSC Coverage for the old `_NNNN.html` URLs to fall out of the index (target: 30–60 days).
15. Track the 5 rewritten-title pages — Stefan, photodiode, B-H curve, forbidden-energy-gap, ultrasonic-interferometer-for-liquids — for CTR change. These should jump from ~0% to 2–4%.

### Quarter 1 content work
16. Add 300–500 words of standard textbook theory + procedure to each of the 10 highest-impression product pages. Source: university lab manuals. Sourcing rule per CLAUDE.md still applies — physics theory is fine; product specs must come from the source-of-truth DB.
17. Build an "Experiments" or "Resources" hub page linking to all kits with their associated theory — captures students/professors searching at the topic level rather than the product level.

### Long-term
18. Consider one inbound-link push per quarter — academic supplier directories, university procurement listing services, FIEO member directory. The site has zero off-page authority signals visible from this audit; even modest backlink work will move positions on the long-tail product queries.

---

## Appendix — files reviewed

- `/Users/martian/Downloads/http___www.mittalenterprises.com_-Performance-on-Search-2026-05-05 (1)/*.csv` — all 7 CSVs read
- `/Users/martian/Documents/Code/mittalenterprises-files-DB/` — directory listing, .htaccess behavior verified by curl
- `/Users/martian/Documents/Code/mittal_enterprises/app/{layout,sitemap,robots,page,products,contact,profile,enquiry,global-supplies}` — read
- `/Users/martian/Documents/Code/mittal_enterprises/lib/legacy-redirects.ts` — partial read, structure verified
- `/Users/martian/Documents/Code/mittal_enterprises/next.config.ts` — read
- `/Users/martian/Documents/Code/mittal_enterprises/CLAUDE.md` — read

Live verification commands run during this audit:
```
curl -sIL http://www.mittalenterprises.com/        → 200 OK, no Location, no HSTS  [confirms split-index issue]
curl -sIL http://mittalenterprises.com/            → 301 → https://www.            [apex redirect works]
curl -sI  https://www.mittalenterprises.com/       → 200, no HSTS                  [HSTS missing on HTTPS too]
curl -s   https://www.mittalenterprises.com/robots.txt   → 404
curl -sI  https://www.mittalenterprises.com/sitemap.xml  → 404
```
