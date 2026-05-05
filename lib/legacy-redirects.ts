// 301 redirects from the old PHP site (mittalenterprises.com PHP build) to the
// current Next.js URLs. Sourced from the old .htaccess + DBmittalenter.sql at
// ../mittalenterprises-files-DB. Every entry below corresponds to a row that
// was status=1 (publicly visible) on the old site at the time of migration.
//
// Format: Next.js Redirect objects. statusCode: 301 emits HTTP 301 so search
// engines transfer ranking signals from the old URL to the new one.

export type LegacyRedirect = {
  source: string;
  destination: string;
  statusCode: 301;
};

const NANO = '/products/nano-science-instruments';
const ULTRA = '/products/ultrasonics-laboratory-instruments';
const PHYS = '/products/physics-laboratory-instruments';
const CHEM = '/products/chemistry-laboratory-instruments';
const MAT = '/products/material-science-laboratory-instruments';
const TCA = '/products/thermal-conductivity-apparatus';

export const legacyRedirects: LegacyRedirect[] = [
  // ── /pages/*.html → static pages ──────────────────────────────────────────
  { source: '/pages/index.html', destination: '/', statusCode: 301 },
  { source: '/pages/profile.html', destination: '/profile', statusCode: 301 },
  { source: '/pages/about-us.html', destination: '/profile', statusCode: 301 },
  { source: '/pages/contact-us.html', destination: '/contact', statusCode: 301 },
  { source: '/pages/global-Supplies.html', destination: '/global-supplies', statusCode: 301 },
  { source: '/pages/global-supplies.html', destination: '/global-supplies', statusCode: 301 },
  { source: '/pages/send-enquiry.html', destination: '/enquiry', statusCode: 301 },

  // ── /products/index/{slug}_{id}.html → category or product pages ─────────
  // Top-level categories (5) → new category landing pages.
  { source: '/products/index/nano-science-instruments_3226.html', destination: NANO, statusCode: 301 },
  { source: '/products/index/ultrasonics-laboratory-instruments_3227.html', destination: ULTRA, statusCode: 301 },
  { source: '/products/index/physics-laboratory-instruments_3228.html', destination: PHYS, statusCode: 301 },
  { source: '/products/index/chemistry-laboratory-instruments_3229.html', destination: CHEM, statusCode: 301 },
  { source: '/products/index/material-science-laboratory-instruments_3230.html', destination: MAT, statusCode: 301 },

  // Sub-categories — on the old site these were single-product landing pages.
  // On the new site they're individual product pages. Mapped 1:1 by name.
  // Under Nano Science (3226):
  { source: '/products/index/nano-fluid-interferometer_3234.html', destination: `${NANO}/nano-fluid-interferometer`, statusCode: 301 },
  { source: '/products/index/nano-fluid-heat-capacity-apparatus_3235.html', destination: `${NANO}/nano-fluid-heat-capacity-apparatus`, statusCode: 301 },
  { source: '/products/index/thermal-conductivity-apparatus_3236.html', destination: `${TCA}/thermal-conductivity-apparatus`, statusCode: 301 },

  // Under Ultrasonics (3227):
  { source: '/products/index/ultrasonic-interferometer-for-liquids_3238.html', destination: `${ULTRA}/ultrasonic-interferometer-for-liquids`, statusCode: 301 },
  { source: '/products/index/ultrasonic-interferometer-for-solids_3239.html', destination: `${ULTRA}/ultrasonic-interferometer-for-solids`, statusCode: 301 },
  { source: '/products/index/ultrasonic-interferometer-for-liquids_3282.html', destination: `${ULTRA}/ultrasonic-interferometer-for-liquids`, statusCode: 301 },

  // Under Physics (3228):
  { source: '/products/index/youngs-modulus-apparatus_3263.html', destination: `${MAT}/youngs-modulus-apparatus`, statusCode: 301 },
  { source: '/products/index/plancks-constant-kit_3266.html', destination: `${PHYS}/plancks-constant-kit`, statusCode: 301 },
  { source: '/products/index/curie-temperature-kit_3267.html', destination: `${MAT}/curie-temperature-kit`, statusCode: 301 },
  { source: '/products/index/dielectric-constant-kit_3268.html', destination: `${PHYS}/dielectric-constant-kit-solid`, statusCode: 301 },
  { source: '/products/index/universal-b-h-curve-tracer_3269.html', destination: `${PHYS}/universal-b-h-curve-tracer-ubhct-001`, statusCode: 301 },
  { source: '/products/index/b-h-curve-unit_3270.html', destination: `${PHYS}/b-h-curve-unit`, statusCode: 301 },
  { source: '/products/index/forbidden-energy-gap-kit_3271.html', destination: `${PHYS}/forbidden-energy-gap-kit`, statusCode: 301 },
  { source: '/products/index/fourier-analysis-kit_3272.html', destination: `${PHYS}/fourier-analysis-kit`, statusCode: 301 },
  { source: '/products/index/lattice-dynamics-kit_3273.html', destination: `${PHYS}/lattice-dynamics-kit`, statusCode: 301 },
  { source: '/products/index/stefans-constant-kit_3274.html', destination: `${PHYS}/stefans-constant-kit`, statusCode: 301 },
  { source: '/products/index/boltzman-constant-kit_3275.html', destination: `${PHYS}/boltzmann-constant-kit`, statusCode: 301 },
  { source: '/products/index/capacitance-and-permittivity-kit_3276.html', destination: `${PHYS}/capacitance-and-permittivity-kit`, statusCode: 301 },
  { source: '/products/index/photodiode-characteristics-apparatus_3278.html', destination: `${PHYS}/photodiode-characteristics-apparatus`, statusCode: 301 },
  { source: '/products/index/led-and-laser-diode-characteristics-apparatus_3279.html', destination: `${PHYS}/led-and-laser-diode-characteristics-apparatus`, statusCode: 301 },
  { source: '/products/index/laser-experiment-kits_3280.html', destination: `${PHYS}/laser-experiment-kits`, statusCode: 301 },
  { source: '/products/index/fiber-optic-apparatus_3281.html', destination: `${PHYS}/fiber-optic-apparatus`, statusCode: 301 },
  { source: '/products/index/dielectric-constant-kit-for-liquid_6472.html', destination: `${CHEM}/dielectric-constant-kit-liquid`, statusCode: 301 },

  // Under Chemistry (3229):
  { source: '/products/index/abbe-refrectometers_3284.html', destination: `${CHEM}/abbe-refractometers`, statusCode: 301 },
  { source: '/products/index/ultrasonic-interferometer-for-liquids_6475.html', destination: `${ULTRA}/ultrasonic-interferometer-for-liquids`, statusCode: 301 },
  { source: '/products/index/dielectric-constant-kit-for-liquids_6476.html', destination: `${CHEM}/dielectric-constant-kit-liquid`, statusCode: 301 },

  // Under Material Science (3230):
  { source: '/products/index/curie-temperature-kit-for-ferroelectric_3288.html', destination: `${MAT}/curie-temperature-kit`, statusCode: 301 },

  // Old categories with status=0 in the DB but indexed by Google (per Search
  // Console — receiving traffic in last 3 months). Status was likely flipped
  // off after Google had already indexed them; redirect anyway.
  { source: '/products/index/dipolemeter_3283.html', destination: `${CHEM}/dipolemeter`, statusCode: 301 },
  { source: '/products/index/ultrasonic-interferometer-for-solids_3265.html', destination: `${ULTRA}/ultrasonic-interferometer-for-solids`, statusCode: 301 },
  { source: '/products/index/dielectric-constant-kit_3289.html', destination: `${PHYS}/dielectric-constant-kit-solid`, statusCode: 301 },
  { source: '/products/index/universal-b-h-curve-tracer_3290.html', destination: `${PHYS}/universal-b-h-curve-tracer-ubhct-001`, statusCode: 301 },

  // ── /products/view/{slug}_{id}.html → product detail pages ────────────────
  // 16 rows from the old `products` table, status=1, company_id=313.
  { source: '/products/view/nano-fluid_7104.html', destination: `${NANO}/nano-fluid-interferometer`, statusCode: 301 },
  { source: '/products/view/nano-fluid-heat-capacity-apparatus_7105.html', destination: `${NANO}/nano-fluid-heat-capacity-apparatus`, statusCode: 301 },
  { source: '/products/view/thermal-conductivity-apparatus_7106.html', destination: `${TCA}/thermal-conductivity-apparatus`, statusCode: 301 },
  { source: '/products/view/low-power-high-frequency-sonicator_7107.html', destination: `${NANO}/low-power-high-frequency-sonicator`, statusCode: 301 },
  { source: '/products/view/ultrasonic-interferometer-for-liquids_7126.html', destination: `${ULTRA}/ultrasonic-interferometer-for-liquids`, statusCode: 301 },
  { source: '/products/view/ultrasonic-interferometer-for-solids_7127.html', destination: `${ULTRA}/ultrasonic-interferometer-for-solids`, statusCode: 301 },
  { source: '/products/view/youngs-modulus-apparatus_7128.html', destination: `${MAT}/youngs-modulus-apparatus`, statusCode: 301 },
  { source: '/products/view/ultrasonic-interferometer-for-liquids_7129.html', destination: `${ULTRA}/ultrasonic-interferometer-for-liquids`, statusCode: 301 },
  { source: '/products/view/ultrasonic-interferometer-for-solids_7130.html', destination: `${ULTRA}/ultrasonic-interferometer-for-solids`, statusCode: 301 },
  { source: '/products/view/plancks-constant-kit_7131.html', destination: `${PHYS}/plancks-constant-kit`, statusCode: 301 },
  { source: '/products/view/dielectric-constant-kit_7133.html', destination: `${PHYS}/dielectric-constant-kit-solid`, statusCode: 301 },
  { source: '/products/view/universal-b-h-curve-tracer_7134.html', destination: `${PHYS}/universal-b-h-curve-tracer-ubhct-001`, statusCode: 301 },
  { source: '/products/view/b-h-curve-unit_7135.html', destination: `${PHYS}/b-h-curve-unit`, statusCode: 301 },
  { source: '/products/view/forbidden-energy-gap-kit_7136.html', destination: `${PHYS}/forbidden-energy-gap-kit`, statusCode: 301 },
  { source: '/products/view/fourier-analysis-kit_7137.html', destination: `${PHYS}/fourier-analysis-kit`, statusCode: 301 },
  { source: '/products/view/lattice-dynamics-kit_7138.html', destination: `${PHYS}/lattice-dynamics-kit`, statusCode: 301 },
];
