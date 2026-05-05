// Search-intent-tuned title/description overrides for product pages that
// already rank but earn zero clicks. Source: SEO_AUDIT.md §5 (GSC export
// Feb–May 2026). Each entry below targets a query Google already surfaces
// the page for; the title/description rewrite the SERP listing to match
// that intent so the existing impressions convert.
//
// Keys are product slugs from lib/products-data.ts.

export interface ProductSeoOverride {
  title?: string;
  description?: string;
}

export const productSeoOverrides: Record<string, ProductSeoOverride> = {
  'stefans-constant-kit': {
    title: "Stefan's Constant Experiment Kit — Verify σ in the Lab | Mittal Enterprises",
    description:
      "Stefan's constant experiment apparatus for university physics labs. Determine σ by heating a tungsten filament and measuring radiated power vs. T⁴. Made in India.",
  },
  'photodiode-characteristics-apparatus': {
    title: 'Photodiode Characteristics Apparatus — I-V & V-I Curve Setup | Mittal Enterprises',
    description:
      'Photodiode characteristics experiment kit for plotting I-V and V-I curves under varying illumination. Built for undergraduate and post-graduate physics labs.',
  },
  'forbidden-energy-gap-kit': {
    title: 'Forbidden Energy Gap Kit — Silicon & Germanium Band-Gap Experiment | Mittal Enterprises',
    description:
      'Determine the forbidden energy gap of silicon and germanium semiconductors by measuring reverse-saturation current vs. temperature. Includes formula and procedure.',
  },
  'universal-b-h-curve-tracer-ubhct-001': {
    title: 'B-H Curve Tracer with Circuit Diagram — Hysteresis Loop Apparatus | Mittal Enterprises',
    description:
      'Universal B-H curve tracer for ferromagnetic hysteresis loop experiments. Includes circuit diagram, CRO output and ring/rod sample holders. UBHCT-001.',
  },
  'universal-b-h-curve-tracer-ubhct-004': {
    title: 'B-H Curve Tracer UBHCT-004 — Hysteresis Loop Apparatus with Circuit Diagram',
    description:
      'B-H curve tracer for plotting hysteresis loops on a CRO. Universal model UBHCT-004 with built-in circuit diagram for advanced ferromagnetic studies.',
  },
  'ultrasonic-interferometer-for-liquids': {
    title: 'Ultrasonic Interferometer for Liquids — F-81 Series, 1–10 MHz | Mittal Enterprises',
    description:
      'Velocity-by-wavelength ultrasonic interferometer for liquids. Quartz-crystal cell with 0.001 mm digital micrometer; used in 30+ research parameters.',
  },
};
