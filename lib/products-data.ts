export interface Product {
  id: string;
  name: string;
  slug: string;
  itemCode: string;
  image: string;
  description: string;
  categoryId: string;
}

// Mapping products to categories — content sourced from original PHP/SQL catalog
// (see /Users/martian/Documents/Code/mittalenterprises-files-DB/DBmittalenter.sql).
// Do not invent specs; restore from the SQL dump if a field is missing.
export const products: Product[] = [
  {
    id: '7104',
    name: 'Nano Fluid Interferometer',
    slug: 'nano-fluid-interferometer',
    itemCode: 'NFI01',
    image: '7104.jpg',
    categoryId: '3226',
    description: "Ultrasonic interferometer for measuring sound velocity, adiabatic compressibility, and thermal conductivity of nanofluids. Models from 2 MHz to 12 MHz."
  },
  {
    id: '7105',
    name: 'Nano Fluid Heat Capacity Apparatus',
    slug: 'nano-fluid-heat-capacity-apparatus',
    itemCode: 'NFHCA-01',
    image: '7105.png',
    categoryId: '3226',
    description: "Measures heat capacity of nanofluids from RT+5 °C to 70 °C with USB data logging of power, current, voltage and temperature."
  },
  {
    id: '7107',
    name: 'Low Power High Frequency Sonicator',
    slug: 'low-power-high-frequency-sonicator',
    itemCode: 'LPHFS-02',
    image: '7107.jpg',
    categoryId: '3226',
    description: "Coming Soon — under development. Contact us for availability."
  },
  {
    id: '7126',
    name: 'Ultrasonic Interferometer for Liquids',
    slug: 'ultrasonic-interferometer-for-liquids',
    itemCode: 'UIFL-01',
    image: '7126.jpg',
    categoryId: '3227',
    description: "Velocity-by-wavelength ultrasonic interferometer used in 30+ research parameters; quartz-crystal cell with 0.001 mm digital micrometer."
  },
  {
    id: '7127',
    name: 'Ultrasonic Interferometer for Solids',
    slug: 'ultrasonic-interferometer-for-solids',
    itemCode: 'UIFS-001',
    image: '7127.jpg',
    categoryId: '3227',
    description: "Non-destructive piezoelectric technique for ultrasonic velocity, compressibility, elastic constants, Young's and bulk modulus in solids."
  },
  {
    id: '7106',
    name: 'Thermal Conductivity Apparatus',
    slug: 'thermal-conductivity-apparatus',
    itemCode: 'TCA-01',
    image: '7106.jpg',
    categoryId: '3236',
    description: "Bridgman-equation thermal conductivity measurement using ultrasonic velocity in liquids and nanofluids; 2 MHz conductivity cell, 4 MHz stability cell, RT–70 °C controller."
  },
  {
    id: '7128',
    name: 'Young\'s Modulus Apparatus',
    slug: 'youngs-modulus-apparatus',
    itemCode: 'YMA-01',
    image: '7128.jpg',
    categoryId: '3230',
    description: "Low-cost NDT apparatus to determine Young's modulus, ultrasonic velocity, compressibility and bulk modulus by piezoelectric (composite-rod) technique."
  },
  {
    id: '7155',
    name: 'Curie Temperature Kit (For Solid)',
    slug: 'curie-temperature-kit',
    itemCode: 'CTK-001',
    image: '7155.jpg',
    categoryId: '3230',
    description: "Studies dielectric constant of ferroelectric materials as a function of temperature (RT–160 °C) to observe the Curie transition."
  },
  {
    id: '7131',
    name: 'Planck\'s Constant Kit',
    slug: 'plancks-constant-kit',
    itemCode: 'PCK-001',
    image: '7131.jpg',
    categoryId: '3228',
    description: "Determines Planck's constant by measuring forward voltage drop across calibrated LEDs of different wavelengths at constant current. ~90% accuracy."
  },
  {
    id: '7133',
    name: 'Dielectric Constant Kit (For Solid)',
    slug: 'dielectric-constant-kit-solid',
    itemCode: 'DCK-001',
    image: '7133.jpg',
    categoryId: '3228',
    description: "Measures dielectric constant of solids in low and high ranges using a 1 kHz audio oscillator, gold-plated brass disc cells (75 mm and 25 mm) and standard samples."
  },
  {
    id: '7134',
    name: 'Universal B-H Curve Tracer',
    slug: 'universal-b-h-curve-tracer-ubhct-001',
    itemCode: 'UBHCT-001',
    image: '7134.jpg',
    categoryId: '3228',
    description: "Self-contained tracer that displays B-H loops of any-shape ferromagnetic specimens using an IC flux-density probe — no primary/secondary winding needed. Requires only an X-Y CRO."
  },
  {
    id: '7160',
    name: 'Universal B-H Curve Tracer',
    slug: 'universal-b-h-curve-tracer-ubhct-004',
    itemCode: 'UBHCT-004',
    image: '7160.jpg',
    categoryId: '3228',
    description: "B-H loop tracer for transformer stampings, ferrites and shaped magnetic materials. Determines saturation, magnetisation, remanence and coercivity using an IC flux-density probe and X-Y CRO."
  },
  {
    id: '7135',
    name: 'B-H Curve Unit',
    slug: 'b-h-curve-unit',
    itemCode: 'BHCU-001',
    image: '7135.jpg',
    categoryId: '3228',
    description: "Traces hysteresis loop of transformer-stamping and ferrite-ring specimens on a CRO; loop area gives energy loss in the specimen."
  },
  {
    id: '7136',
    name: 'Forbidden Energy Gap Kit',
    slug: 'forbidden-energy-gap-kit',
    itemCode: 'FEGK-001',
    image: '7136.jpg',
    categoryId: '3228',
    description: "Determines forbidden energy gap of Si, Ge and LEDs by studying the temperature dependence of forward-bias voltage. Self-contained kit."
  },
  {
    id: '7137',
    name: 'Fourier Analysis Kit',
    slug: 'fourier-analysis-kit',
    itemCode: 'FAK-001',
    image: '7137.jpg',
    categoryId: '3228',
    description: "Function generator (500 Hz–15 kHz) for generating square, triangular and clipped sine waves to verify Fourier theorem on a CRO."
  },
  {
    id: '7138',
    name: 'Lattice Dynamics Kit',
    slug: 'lattice-dynamics-kit',
    itemCode: 'LDK-001',
    image: '7138.jpg',
    categoryId: '3228',
    description: "Audio oscillator (0.9–90 kHz) driving a transmission line that simulates one-dimensional mono- and di-atomic lattices; demonstrates acoustical mode, optical mode and energy gap."
  },
  {
    id: '7139',
    name: 'Stefan\'s Constant Kit',
    slug: 'stefans-constant-kit',
    itemCode: 'SCK-001',
    image: '7139.jpg',
    categoryId: '3228',
    description: "Determines Stefan's constant by the electrical method using black copper radiation plates with built-in heater, AC voltmeter, ammeter and thermocouple."
  },
  {
    id: '7140',
    name: 'Boltzmann Constant Kit',
    slug: 'boltzmann-constant-kit',
    itemCode: 'BCK-001',
    image: '7140.jpg',
    categoryId: '3228',
    description: "Determines Boltzmann's constant from the V–I characteristics of Si and Ge diodes using a 1 mV-step stabilized supply, digital millivoltmeter (0–9.99 V) and ammeter (0–500 mA)."
  },
  {
    id: '7141',
    name: 'Capacitance and Permittivity Kit',
    slug: 'capacitance-and-permittivity-kit',
    itemCode: 'CPK-001',
    image: '7141.jpg',
    categoryId: '3228',
    description: "Self-contained capacitance meter with reed-relay switch and IC current amplifier. Detects 0.1 nF changes; <1% f.s.d. linearity. Ships with 0.25 m × 0.25 m × 4 mm plates and dielectric spacers."
  },
  {
    id: '7142',
    name: 'Photoelectric Effect Apparatus',
    slug: 'photoelectric-effect-apparatus',
    itemCode: 'PEA-001',
    image: '7142.jpg',
    categoryId: '3228',
    description: "Coming soon. Contact us for availability."
  },
  {
    id: '7143',
    name: 'Photodiode Characteristics Apparatus',
    slug: 'photodiode-characteristics-apparatus',
    itemCode: 'PCA-001',
    image: '7143.jpg',
    categoryId: '3228',
    description: "Studies photodiode I–V characteristics in reverse bias and the variation of photocurrent with reverse voltage and illumination intensity."
  },
  {
    id: '7144',
    name: 'LED and Laser Diode Characteristics Apparatus',
    slug: 'led-and-laser-diode-characteristics-apparatus',
    itemCode: 'LEDLDCA-001',
    image: '7144.jpg',
    categoryId: '3228',
    description: "Studies I–V and P–I characteristics of LEDs and laser diodes. Includes 4 LEDs, diode laser with holder, photo detector and variable-intensity setup."
  },
  {
    id: '7145',
    name: 'Laser Experiment Kits',
    slug: 'laser-experiment-kits',
    itemCode: 'LEK-001',
    image: '7145.jpg',
    categoryId: '3228',
    description: "He-Ne 2 mW laser kit with optical bench, imported reflection and transmission gratings (15 000 lpi), photo detector and knife-edge for spot-size, divergence, wavelength and grating measurements."
  },
  {
    id: '7146',
    name: 'Fiber Optic Apparatus',
    slug: 'fiber-optic-apparatus',
    itemCode: 'FOA-001',
    image: '7146.jpg',
    categoryId: '3228',
    description: "Measures numerical aperture, acceptance angle and attenuation in optical fibres. Includes 1 m and 5 m fibres, 10× objective, laser diode and detector."
  },
  {
    id: '7148',
    name: 'Dipolemeter',
    slug: 'dipolemeter',
    itemCode: 'D-001',
    image: '7148.jpg',
    categoryId: '3229',
    description: "Determines dielectric constant of non-aqueous liquids and dipole moments (e.g., Nitrobenzene). SS dielectric cell with Teflon top + BNC; built-in frequency counter and audio oscillator."
  },
  {
    id: '7149',
    name: 'Abbe Refractometers',
    slug: 'abbe-refractometers',
    itemCode: 'AR-001',
    image: '7149.jpg',
    categoryId: '3229',
    description: "Bench Abbe refractometer for refractive index 1.300–1.700 (±0.0001) and sugar 0–95 % (±0.1%). Bimetal temperature sensor with digital indicator. ~4 kg."
  },
  {
    id: '15093',
    name: 'Dielectric Constant Kit (For Liquid)',
    slug: 'dielectric-constant-kit-liquid',
    itemCode: 'PDCK',
    image: '15093.jpg',
    categoryId: '3229',
    description: "Versatile kit for measuring dielectric constant of non-aqueous liquids using a 500 kHz oscillator and a special-grade SS dielectric cell."
  }
];

// Get products by category
export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.categoryId === categoryId);
}

// Get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

// Get product by ID
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
