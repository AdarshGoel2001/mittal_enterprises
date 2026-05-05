# Mittal Enterprises — SEO Status Report

**Prepared by:** Adarsh Goel
**Date:** May 2026
**Data source:** Google Search Console, 4 Feb – 3 May 2026 (91 days)

---

## Snapshot

| Metric | Current state | What it should be |
|---|---|---|
| Google visits / month | **~200** | 1,500–3,000 |
| Brand-name search dependence | **~25%** of clicks | <10% |
| International share of clicks | **12%** | 30–40% (FIEO exporter) |
| Mobile click-through rate | **2.09%** | 4–5% (= desktop) |
| HTTPS / secure version | **Partial — every page indexed twice** | Universal |
| Sitemap | **Does not exist (404)** | Required basic |
| Robots.txt | **Does not exist (404)** | Required basic |
| Schema markup | **None** | Required basic |
| Canonical tags | **None — products published under up to 4 URLs each** | Required basic |
| Position for buyer-intent searches ("lab equipment supplier" etc.) | **Rank 84–111 (pages 8–11)** | Page 1–2 |

**Net contribution of the website:** ~200 Google visits/month, of which ~130 are people who typed "Mittal Enterprises" into Google — i.e. people who would have found the site anyway. **True new traffic from search: ~70 visitors per month.** For a 50-year-old, FIEO-registered B2B exporter with 27 catalogued products, this is roughly **one-tenth** of where it should be.

---

## Failures, ranked by impact

### 1. Google has every page on the site indexed twice. Has been for ~8 years.

The site serves on both `http://www....` (insecure) and `https://www....` (secure). Modern websites force every visitor to the secure version. This one does not — only the bare domain redirects, the `www` host (the one most people actually use) does not.

Every product page therefore exists **twice** in Google's index. The two copies compete with each other, and the page reputation Google has been building over years is split across both.

**Evidence:** Verified by direct request to the live server.
```
http://www.mittalenterprises.com/   → 200 OK (no redirect, no security upgrade)
http://mittalenterprises.com/       → 301 redirect to https://www. (working correctly)
```
The agency clearly knew this redirect was needed, because they wrote it for the bare domain. They never finished the job.

**Fix:** one line of server configuration. **5 minutes of agency time.**
**Standard since:** 2018, when Google started ranking HTTPS over HTTP.
**Effect of fixing:** every page on the site lifts in rankings, sitewide. This is the single most consequential fix on the list.

### 2. No sitemap. No robots.txt.

```
mittalenterprises.com/sitemap.xml   → 404 Not Found
mittalenterprises.com/robots.txt    → 404 Not Found
```

A sitemap tells Google what pages exist. A robots.txt tells crawlers how to behave. Both are foundational requirements. Both are missing.

**Fix:** generate and upload two files. **30 minutes of agency time.**
**Effect:** Google has been guessing at the site structure for years. It is the reason behind failure #3.

### 3. Most products are published under multiple URLs, splitting their search reputation.

| Product | URL 1 (clicks) | URL 2 (clicks) |
|---|---|---|
| Universal B-H Curve Tracer | `_3269.html` (26) | `_3290.html` (10) |
| Dielectric Constant Kit | `_3268.html` (18) | `_3289.html` (6) |
| Ultrasonic Interferometer for Solids | `_3239.html` (2) | `_3265.html` (8) |
| Dielectric Constant Kit for Liquid | `_6472.html` (3) | `_6476.html` (1) |
| Ultrasonic Interferometer for Liquids | 4 separate URLs |  |

Same product, multiple URLs. Google splits authority across them. None ranks as well as a single page would.

**Fix:** canonical tags on the current site (1 hour), OR the new website (already solves this by structure).

### 4. Mobile users see the site, then leave without clicking.

| Device | Avg. position | Click-through rate |
|---|---|---|
| Desktop | 9.24 | 4.38% |
| Mobile | **5.34 (better!)** | **2.09% (half)** |

Mobile users find the site at a *better* position than desktop users, but click at *half* the rate. This pattern only appears when the mobile experience itself is broken — slow load, layout failures, or the "Not Secure" warning (because of failure #1).

The current site is not mobile-first. It is a 2010-era desktop layout with a responsive patch.

**Fix:** the new website is mobile-first. This issue resolves automatically on launch.

### 5. ~3,500 high-quality search appearances every quarter — earning zero clicks.

The largest content opportunity in the data:

| Search query | Times shown in 3 months | Clicks |
|---|---|---|
| Stefan's constant | 1,089 | 0 |
| BH curve circuit diagram (the site ranks **#1**) | 86 | 0 |
| Photodiode characteristics (all variants) | ~700 | 0 |
| Forbidden energy gap of silicon / germanium (all variants) | ~500 | 0 |
| What is ultrasonic interferometer | 73 | 0 |
| Photodiode characteristics experiment | 102 | 0 |

These are physics students and lab researchers. They want to understand the experiment — formula, procedure, expected readings. The current pages show a marketing description and a "buy this kit" pitch. The searcher reads the small Google preview, decides it is a sales page, clicks something else.

**Even a 10% conversion of these missed views = ~350 additional visitors per quarter** — from rankings the site already earns.

**Fix:** add a "How the experiment works" section to each kit page. Standard textbook physics, sourced from published lab manuals — not invented data. ~2 days of writing for the top 10 pages.

### 6. The site has no structured data — Google does not know it is a manufacturer.

No `Organization` markup. No `Product` markup. No breadcrumb markup. No business-information schema.

For a B2B manufacturer, this is the difference between appearing as a plain blue link versus a rich card showing company name, ISO 9001:2008, FIEO Member, Delhi address, founded 1976, product photo. Modern Google search results are dominated by sites with this. Mittal Enterprises has none of it.

**Fix:** half a day on the new website. Not practical to retrofit on the current PHP site.

### 7. No content strategy. Same 27 product pages for ~10 years.

No application notes. No case studies. No technical articles. No customer-reference content. No translated pages despite the FIEO export branding.

Long-form, application-specific content is how B2B technical equipment ranks for buyer-intent searches like "physics laboratory equipment manufacturer India" (current rank: page 11). Without it, the site cannot compete for the queries that actually drive enquiries.

---

## What can be fixed when

### Items the current agency should fix this week — collectively under 2 hours of work

- HTTP → HTTPS redirect (Failure #1)
- robots.txt and sitemap.xml (Failure #2)
- Canonical tags for duplicate product URLs (Failure #3)

If they cannot deliver these three items inside 7 days, that itself answers the question of competence.

### Solved by switching to the new website (already built, ready to deploy)

- Mobile UX problem (#4) — fixed by design
- Duplicate URLs (#3) — collapsed to a single canonical page per product, all old URLs 301-redirected to preserve existing rankings (verified end-to-end: 76/76 redirects pass)
- HTTPS enforcement (#1) — secure by default
- All 17 product brochure PDFs preserved at their original web addresses — no broken links, no lost search rankings
- Foundation in place for structured data (#6) and content (#7)

### Requires sustained ongoing work

- Content for zero-click queries (#5) — biggest single growth lever
- Schema markup deployment (#6)
- Application notes, case studies, technical articles (#7)
- International SEO push (currently 12% — should be 30–40%)

---

## Bottom line

This is not "SEO is hard." This is foundational technical work that has been silently penalising the website for years. The single largest failure — the HTTPS redirect — is **a 5-minute fix that has been outstanding since 2018**. The sitemap and robots.txt are 30-minute fixes that have been outstanding indefinitely. These are not judgement calls; they are checklist items every agency knows on day one.

The new website I have built resolves roughly half of these failures by design. Old URLs are mapped to new ones with no SEO loss. The remaining half — content, structured data, international reach — are sustained work that I can take on directly.

The current monthly traffic of 200 is structural, not accidental. It traces to specific, documented errors. With the failures above corrected, **~600–1,200 monthly visitors is achievable in 6 months, and 1,500–3,000 in 12 months** — a 7–15× gain, against a baseline a competent setup should already have delivered years ago.

I am happy to walk through this in person whenever convenient.
