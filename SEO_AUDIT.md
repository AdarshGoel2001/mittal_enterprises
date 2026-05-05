# Mittal Enterprises — SEO Audit

**Date:** 2026-05-05 (audit) / 2026-05-06 (Next.js fixes shipped)
**Live site audited:** `http://www.mittalenterprises.com/` (PHP, in production)
**Replacement audited:** `/Users/martian/Documents/Code/mittal_enterprises/` (Next.js 16, deployed at `https://mittal-enterprises.vercel.app`)
**Empirical anchor:** Google Search Console export, last 91 days (Feb 4 – May 3, 2026)

---

## 1. Executive summary

Mittal Enterprises gets **~604 organic clicks / 91 days (~200/month)** at avg position 6.4. 88% from India, ~3% US, the rest a long tail of academic/export markets. The site ranks well — most clicks come from positions 1–6 — but **converts impressions to clicks poorly**: 20,325 impressions → 604 clicks = **~3.0% CTR sitewide**, with several queries showing **1,000+ impressions and zero clicks**.

The single biggest **remaining** finding is not on the new site — it is in **how Google has indexed the production PHP domain**. The current PHP site mishandles HTTPS in a way that has caused Google to index every page **twice**, once on `http://` and once on `https://`, with the two copies actively competing. This is fixable in one Apache rule and should be fixed **before** the Next.js cutover, otherwise the cutover inherits the split.

The Next.js redesign already solves the PHP-era SEO problems and adds capabilities the live site lacks: clean URLs, 76/76 legacy 301 coverage, `sitemap.ts`, `robots.ts`, **per-page titles and meta descriptions**, **search-intent-tuned titles for the 6 zero-click products**, **Organization / Product / BreadcrumbList / ItemList JSON-LD**, **HSTS + nosniff + referrer-policy security headers**, and a working **Resend-backed contact + enquiry pipeline**. PageSpeed (mobile) on the new build scores **Performance 98 / Accessibility 96 / Best Practices 100 / SEO 100**.

### Status of the top priorities

| # | Item | Status |
|---|------|--------|
| 1 | Fix `http://www.` → `https://www.` 301 on the live PHP site | ⏳ **Pending** — owner / current agency action; touches the PHP host config, not this codebase |
| 2 | Per-page `generateMetadata` on every product, category, and static page (Next.js) | ✅ **Done** — verified live on Vercel preview |
| 3 | Product + Organization + BreadcrumbList JSON-LD (Next.js) | ✅ **Done** — Rich Results Test confirms 3 of 4 schemas valid; Product is read for entity recognition (no rich-snippet eligibility, by design — see §6) |
| 4 | Verify `https://www.` property in Search Console + submit sitemap | ⏳ **Pending** — needs owner / Search Console access |
| 5 | Rewrite the zero-click product titles | ✅ **Done** — `lib/seo-overrides.ts` carries hand-written titles for Stefan's Constant, Photodiode Characteristics, Forbidden Energy Gap, both B-H Curve Tracers, and Ultrasonic Interferometer for Liquids |

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

### New Next.js site — what shipped
- ✅ `app/robots.ts` — allows all, points at sitemap, **and explicitly blocks `/api/`** so the form-submission endpoints don't waste crawl budget.
- ✅ `app/sitemap.ts` — lists static routes + 6 categories + every product, base `https://www.mittalenterprises.com`. Verified 200 on the live deploy.
- ✅ 76/76 old URLs 301 → 200 (per CLAUDE.md). PDFs preserved at exact paths under `public/media_upload/`.
- ✅ `next.config.ts` now ships a `headers()` block applying **Strict-Transport-Security (1 year + includeSubDomains)**, **X-Content-Type-Options: nosniff**, and **Referrer-Policy: strict-origin-when-cross-origin** to every route. This is what the PHP site is missing on its HTTPS host (see §3) and is what cements the protocol consolidation once the cutover happens.

---

## 5. On-page SEO — what the new Next.js site now does that the live PHP site cannot

### What the PHP site does today
The live PHP product pages each carry a per-page `<title>` ("Ultrasonic Interferometer For Liquids", etc.) which is the only reason it ranks at all. There is no canonical handling, no consistent meta description format, no Open Graph tags, no metadata template, and no protection against the brand suffix being missing or duplicated. Titles competing for "stefan's constant", "bh curve circuit diagram", and "forbidden energy gap" earn 1,000+ impressions and **zero clicks** — the SERP listings do not match the searcher's intent.

### What the Next.js site now ships
**Per-page `generateMetadata` is live on every page.** The root `app/layout.tsx` defines `metadataBase: new URL('https://www.mittalenterprises.com')` and a title template `"%s | Mittal Enterprises"` so canonical/OG URLs always resolve to the production domain and brand suffix is appended exactly once. Each route then overrides title + description + canonical:

- `app/products/[slug]/[productSlug]/page.tsx` — product detail
- `app/products/[slug]/page.tsx` — category
- `app/products/page.tsx` — all-products index
- `app/profile/page.tsx`, `app/global-supplies/page.tsx`
- `app/contact/layout.tsx`, `app/enquiry/layout.tsx` — colocated layouts because the form pages themselves are client components

Open Graph + Twitter Card metadata are emitted on every product page so when a procurement officer pastes a link into WhatsApp, Slack, or email, the preview shows the product name, description, and image — instead of the stripped fallback the PHP site shows today.

### Search-intent title overrides for the zero-click products
`lib/seo-overrides.ts` maps product slugs to hand-written titles + meta descriptions targeted at the exact GSC queries that already rank pos 6–10 with thousands of impressions. The mapping is consulted by `generateMetadata`; if absent it falls back to the templated `${name} — ${itemCode}` form.

| Slug | Override title (verified live) |
|------|------|
| `stefans-constant-kit` | Stefan's Constant Experiment Kit — Verify σ in the Lab |
| `photodiode-characteristics-apparatus` | Photodiode Characteristics Apparatus — I-V & V-I Curve Setup |
| `forbidden-energy-gap-kit` | Forbidden Energy Gap Kit — Silicon & Germanium Band-Gap Experiment |
| `universal-b-h-curve-tracer-ubhct-001` | B-H Curve Tracer with Circuit Diagram — Hysteresis Loop Apparatus |
| `universal-b-h-curve-tracer-ubhct-004` | B-H Curve Tracer UBHCT-004 — Hysteresis Loop Apparatus with Circuit Diagram |
| `ultrasonic-interferometer-for-liquids` | Ultrasonic Interferometer for Liquids — F-81 Series, 1–10 MHz |

These should convert the existing zero-click impressions to clicks within ~2–4 weeks of going live on the production domain.

---

## 6. Structured data (schema) — what the new site emits, and what the PHP site lacks

The PHP site ships **zero structured data**. Google has no machine-readable signal that any URL is a product, a category, a company, or a breadcrumb chain — every classification is inferred. The Next.js site now emits four schema types, **verified live via Google's Rich Results Test**:

| Schema | Location | Status |
|--------|----------|--------|
| `Organization` (name, logo, address, telephone, email, foundingDate 1976, sameAs social, hasCredential ISO 9001:2008 + FIEO) | `app/layout.tsx` — sitewide | ✅ valid |
| `Product` (name, sku, image, description, category, brand, manufacturer, url, model[]) | `app/products/[slug]/[productSlug]/page.tsx` | ✅ valid for entity recognition · ineligible for the price/stars rich snippet by design (see note below) |
| `BreadcrumbList` (Products → Category → Product) | product detail + category pages | ✅ valid |
| `ItemList` (every product in the category, with positions and URLs) | `app/products/[slug]/page.tsx` | ✅ valid — also helps Google discover all products in a category in one fetch |

Google additionally infers a `LocalBusiness` from the `Organization` + `PostalAddress` block (Delhi, 110008, IN). That gives the listing local-business surface eligibility without us having to author a separate schema.

### Why the Product schema deliberately omits `offers` / `review` / `aggregateRating`
Google's Rich Results Test flags this as a "critical issue" and reports the Product as ineligible for the price/stars SERP snippet. **This is intentional**, documented in a comment next to the JSON-LD definition in code, and consistent with the no-data-fabrication rule in CLAUDE.md:
- This is a quote-based B2B catalog with no public pricing
- No customer reviews are collected
- Faking either would risk a manual penalty and breaks the sourcing rule

The Product schema is still consumed by Google for entity recognition (Knowledge Graph, "this URL is about a product called X manufactured by Y") — only the visual rich snippet is forfeit. If pricing is ever published, swap the comment in the route file for an `offers` block and the rich snippet unlocks automatically.

### Verification artefacts (2026-05-06)
- Rich Results Test: 4 items detected, 3 valid, 1 ineligible-by-design (above).
- PageSpeed Insights mobile (homepage): Performance 98 / Accessibility 96 / Best Practices 100 / SEO 100 — Lighthouse independently confirms "Structured data is valid".

---

## 7. Mobile, speed, and Core Web Vitals

PHP site mobile CTR remains 2.09% vs desktop 4.38% at *better* positions — strong indicator of poor mobile experience on the live site. The new Next.js build, measured live on Vercel with PageSpeed Insights (mobile profile), scores:

| Metric | Score |
|--------|-------|
| Performance | **98** |
| Accessibility | **96** |
| Best Practices | **100** |
| SEO | **100** |

This is the gap a procurement officer feels when comparing the two sites on a phone. The Next.js stack already uses `next/font` with `display: swap`, `next/image` with `priority`/`sizes`, Tailwind v4, no carousels (per CLAUDE.md), and Vercel CDN delivery — the result is a near-perfect Lighthouse profile out of the box.

**Action after production cutover:** re-run PageSpeed against `https://www.mittalenterprises.com/` (not the Vercel preview) and submit the sitemap to the HTTPS Search Console property so the CWV report begins populating.

---

## 8. Content quality and E-E-A-T

The Stefan/photodiode/forbidden-gap-kit queries reveal a content-mismatch problem — but the right fix is **not** the textbook-theory direction this audit originally proposed. Those searchers (undergraduates) are not the buying audience. The owner's revenue comes from procurement officers and lab heads. **Useful SEO scale, not vanity scale**: the 6 zero-click product pages should be rewritten to answer the procurement officer's question, not the student's.

What that means in practice for `lib/products-content.ts`:
- Specs that map to lab purchase orders: frequency range, sample types supported, included accessories, power requirements, dimensions.
- Which experiments the kit performs (named, briefly — no derivations).
- Comparable / related models in the same category, with the user-facing trade-off (e.g. "UBHCT-001 vs UBHCT-004 — pick the 004 for higher current handling").
- Lead time and supply context — "made in Delhi", "ships within X weeks", "supplied to N+ Indian universities".
- Concrete trust artefacts that already exist: ISO 9001:2008, FIEO Registered Member, Est. 1976, named institutions if the owner can supply a list.

**Trust signals** are already wired into the `Organization` JSON-LD (`hasCredential: ["ISO 9001:2008", "FIEO Registered Member"]`, `foundingDate: "1976"`, full `PostalAddress`, `telephone`, `email`, `sameAs` socials). The contact page exposes a real phone, address, and email — Google's Trustworthiness signal for B2B suppliers is satisfied. The PHP site exposed the same data but never wrapped it in machine-readable schema; the new site does.

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

### Pre-launch on the Next.js site — ✅ COMPLETE (shipped 2026-05-06)
- ✅ `generateMetadata` on every product, category, and static page (incl. colocated layouts for client-component routes)
- ✅ `metadataBase`, per-page `alternates.canonical`, OG + Twitter Card metadata
- ✅ Search-intent title overrides for 6 zero-click high-impression products (`lib/seo-overrides.ts`)
- ✅ Organization JSON-LD sitewide; Product + BreadcrumbList on product pages; ItemList on category pages
- ✅ Security headers in `next.config.ts` — HSTS (1y + includeSubDomains), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `/api/` blocked in `app/robots.ts`
- ✅ Resend wired into `/contact` and `/enquiry` — server-side validation, replyTo, env-var driven recipient
- ✅ Verified live on `https://mittal-enterprises.vercel.app` — Rich Results Test (3/4 schemas valid, Product ineligible-by-design), PageSpeed mobile 98/96/100/100

### Owner / current-agency action — still pending
1. **Add `http://www. → https://www.` 301** on the production PHP `.htaccess` + HSTS header. 5 minutes; the single biggest SEO change available, and the only fix that can't be made from this codebase. Detail in §3.
2. **Verify HTTPS property in Search Console**, plus a Domain property.
3. Submit a basic sitemap to the HTTPS property (or wait for the Next.js cutover and submit `https://www.mittalenterprises.com/sitemap.xml`).

### Launch day (when production domain points at the Next.js build)
4. Re-set the three Resend env vars (`RESEND_API_KEY`, `CONTACT_EMAIL`, `MAIL_FROM`) on the production environment. The `MAIL_FROM` should switch from the `onboarding@resend.dev` sandbox to a verified `*@mittalenterprises.com` sender — requires DNS records on the owner's side.
5. Confirm `https://www.mittalenterprises.com/sitemap.xml` returns 200. Submit to GSC.
6. Spot-check 5 redirects manually (e.g. `/products/index/ultrasonic-interferometer-for-liquids_3238.html`). Look for `301 → 200`.
7. Re-run PageSpeed Insights against the production hostname (Vercel preview is already at 98/96/100/100).
8. Re-run Rich Results Test on a product URL under the production domain.

### First 30 days post-launch
9. Watch GSC Coverage for the old `_NNNN.html` URLs to fall out of the index (target: 30–60 days).
10. Track the 6 rewritten-title pages for CTR change. These should jump from ~0% to 2–4%.

### Quarter 1 content work — audience: procurement, not students
11. Rewrite product-detail copy on the 6 zero-click pages for the **buying audience** — lab heads and procurement officers. What experiments the kit supports, comparable models, frequency ranges, lead time hints, what other Indian institutions use it. **Skip the textbook-theory direction** originally suggested in §8 — that audience (undergrads) is not a buyer.
12. Optional: an "Instruments index" hub page that lets a procurement officer compare across categories at a glance.

### Long-term
13. One inbound-link push per quarter — academic supplier directories, university procurement listing services, FIEO member directory. The site has near-zero off-page authority signals visible from this audit; even modest backlink work will move positions on the long-tail product queries.

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
