# Mittal Enterprises — project notes

Next.js 16 + React 19 + Tailwind v4 static site for a Delhi-based B2B manufacturer of laboratory scientific instruments (ultrasonic interferometers, nanofluid instruments, physics/chemistry lab apparatus). Est. 1976. Audience: university procurement, research labs, R&D depts. Trust signals: ISO 9001:2008, FIEO Registered Member.

The original PHP source lives at `../mittalenterprises-files-DB`. The current Next.js code was a 1:1 port of that dated layout done with weaker models ~4 months ago.

## Redesign direction (started 2026-04-20)

Full structural redesign, not a reskin. Direction: **"Precision Industrial"** — Thorlabs/Bruker/Leica aesthetic. Off-black on warm white, Inter + Geist Mono, specs-forward, single restrained accent color. Carousel killed, reused inner banner killed, sidebar scoped to product pages only, homepage structure rebuilt.

Favor specs/typography/whitespace over marketing gloss. No carousels. No decorative animation. Product item codes should be visible and styled in mono. Trust signals belong in a small credentials strip, not giant sidebar badges.

## Image workflow

Adarsh (the owner) can regenerate any image in `public/images/` using AI tools — background swaps, watermark removal, full re-renders. When UI needs better imagery, give him:

- Exact file path(s)
- Explicit, ready-to-paste prompt
- Output format (PNG vs JPG), background color/transparency, aspect ratio, framing

Batch image requests into one message rather than compromising the design around bad source assets.

## Small fixed points

- Footer credit is `Made with ♥ by Adarsh Goel` — not the old DIGIHIVESOL/TRADEBRIO line.
- `public/images/bottom-banner.jpg` is missing in the current code; the new design drops that section.
- Top-strip "No part of this website may be reproduced…" disclaimer moves to footer fine print.

## Hard rule: NO DATA FABRICATION

Never invent product attributes, specs, numbers, testimonials, customer names, certifications, or any other factual content. **Source of truth:** `../mittalenterprises-files-DB` (the old PHP + DB dump) and the current `lib/data.ts` + `lib/products-data.ts`. If a field (weight, dimensions, price, frequency range, clientele) is not present there, do not display it — even if it would make a section look better. When a UI pattern requires data we don't have, either pull it from the source-of-truth dump, ask Adarsh, or drop the pattern. This rule overrides design polish.
