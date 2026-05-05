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

**Net contribution of the website:** ~200 Google visits/month, of which ~45 are people who typed "Mittal Enterprises" into Google — i.e. people who would have found the site anyway. **True new traffic from search: ~155 visitors per month.** For a 50-year-old, FIEO-registered B2B exporter with 27 catalogued products, this is roughly **one-tenth** of where it should be.

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

### 2. The site ranks for the wrong audience — students, not buyers.

The product descriptions on the site read like textbook lab manuals (*"Objective: DETERMINATION of Boltzmann's Constant using semiconductor Diode"*). That phrasing ranks for "what is" searches, not "where to buy" searches. Result: Google sends thousands of physics students to the site, who click off as soon as they realise it's a sales catalogue.

| Student-intent query | Times shown | Clicks |
|---|---|---|
| stefan's constant | 1,089 | 0 |
| ultrasonic interferometer experiment | 222 | 2 |
| iv characteristics of photodiode | 185 | 0 |
| photodiode characteristics | 143 | 0 |
| forbidden energy gap of silicon | 132 | 0 |

Meanwhile, the buyer-intent queries — the searches that turn into orders — are effectively invisible:

| Buyer-intent query | Rank |
|---|---|
| material science laboratory instruments | 19 |
| ultrasonic testing equipment suppliers | 47 |
| laboratory equipment distributor | 83 |
| lab equipment distributor | 84 |
| laboratory instruments supplier | 101 |
| lab equipment distributors | 111 |

A B2B exporter ranking at position 100+ for "laboratory instruments supplier" is not visible to the audience that places orders. The site has been pulling in students for years because no one set it up to pull in buyers.

**Fix:** rewrite product page copy to lead with manufacturer / supplier / exporter language, without losing the technical context the existing rankings depend on. Done correctly on the new website.

### 3. The site has no structured data — Google does not know it is a manufacturer.

No `Organization` markup. No `Product` markup. No breadcrumb markup. No business-information schema.

For a B2B manufacturer, this is the difference between appearing as a plain blue link versus a rich card showing company name, ISO 9001:2008, FIEO Member, Delhi address, founded 1976, product photo. Modern Google search results are dominated by sites with this. Mittal Enterprises has none of it.

**Fix:** half a day on the new website. Not practical to retrofit on the current PHP site.

### 4. Most products are published under multiple URLs, splitting their search reputation.

| Product | URL 1 (clicks) | URL 2 (clicks) |
|---|---|---|
| Universal B-H Curve Tracer | `_3269.html` (26) | `_3290.html` (10) |
| Dielectric Constant Kit | `_3268.html` (18) | `_3289.html` (6) |
| Ultrasonic Interferometer for Solids | `_3239.html` (2) | `_3265.html` (8) |
| Dielectric Constant Kit for Liquid | `_6472.html` (3) | `_6476.html` (1) |
| Ultrasonic Interferometer for Liquids | 4 separate URLs | |

Same product, multiple URLs. Google splits authority across them. None ranks as well as a single page would.

**Fix:** canonical tags on the current site (1 hour), OR the new website (already solves this by structure).

### 5. No sitemap. No robots.txt.

```
mittalenterprises.com/sitemap.xml   → 404 Not Found
mittalenterprises.com/robots.txt    → 404 Not Found
```

A sitemap tells Google what pages exist. A robots.txt tells crawlers how to behave. Both are foundational requirements. Both are missing.

**Fix:** generate and upload two files. **30 minutes of agency time.**
**Effect:** Google has been guessing at the site structure for years. It is the reason behind failure #4.

### 6. Mobile users see the site, then leave without clicking.

| Device | Avg. position | Click-through rate |
|---|---|---|
| Desktop | 9.24 | 4.38% |
| Mobile | **5.34 (better!)** | **2.09% (half)** |

Mobile users find the site at a *better* position than desktop users, but click at *half* the rate. This pattern only appears when the mobile experience itself is broken — slow load, layout failures, or the "Not Secure" warning (because of failure #1).

The current site is not mobile-first. It is a 2010-era desktop layout with a responsive patch.

**Fix:** the new website is mobile-first. This issue resolves automatically on launch.
