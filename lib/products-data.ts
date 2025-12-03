export interface Product {
  id: string;
  name: string;
  slug: string;
  itemCode: string;
  image: string;
  description: string;
  fullDescription?: string;
  categoryId: string;
}

// Mapping products to categories
export const products: Product[] = [
  // Nano Science Instruments (Category 3226)
  {
    id: '7104',
    name: 'Nano Fluid Interferometer',
    slug: 'nano-fluid',
    itemCode: 'NFI01',
    image: '7104.jpg',
    categoryId: '3226',
    description: 'Nano Fluid Interferometer for measuring compressibility and thermal conductivity of nanofluids.',
    fullDescription: `<strong>Working Principle</strong><br/>
In this instrument, Ultrasound waves of known frequency are produced by a Piezo-Electric transducer and its wavelength is measured with digital micrometer with high accuracy within ±0.001mm.<br/><br/>
From the knowledge of frequency (f) and wave length(λ); the compressibility of nanofluid is determined. Sound Velocity in nanofluid and Adiabatic compressibility can be calculated.<br/><br/>
<strong>Description</strong><br/>
The Nanofluid Interferometer consists of the following parts:<br/>
1. Wave Generator<br/>
2. Nanofluid Cells<br/>
3. Temperature Controller Unit (RT to 70°C)<br/>
4. Nanofluids – Chemicals to make Ag nanofluid in various concentrations<br/><br/>
<strong>Models</strong><br/>
Model NF-10(2MHz)<br/>
Model NF-10X (1,2,3,5,7&10MHz)<br/>
Model NF-12X (1,2,3,4,5,6,7,8,9,10& 12 MHz)`
  },
  {
    id: '7105',
    name: 'Nano Fluid Heat Capacity Apparatus',
    slug: 'nano-fluid-heat-capacity-apparatus',
    itemCode: 'NFHCA-01',
    image: '7105.png',
    categoryId: '3226',
    description: 'The Specific Heat of nanofluids decreases as nanoparticle concentration increases.',
    fullDescription: `This apparatus is designed to measure Heat Capacity of nanofluids from RT+5°C to 70°C.<br/><br/>
The apparatus consists of:<br/>
1. Cooling system with thermally insulated chamber<br/>
2. Data logger unit for measurement of Time, voltage, current and temperatures<br/><br/>
Fluid required: 250 ml. A software automatically logs all parameters - Power, Temperature vs. time at set interval. System has USB interface for data recording.`
  },
  {
    id: '7106',
    name: 'Thermal Conductivity Apparatus',
    slug: 'thermal-conductivity-apparatus',
    itemCode: 'TCA-01',
    image: '7106.jpg',
    categoryId: '3236',
    description: 'Apparatus follows widely accepted theory of heat conduction in liquids based on Debye\'s concept.',
    fullDescription: `<strong>Theory</strong><br/>
The Apparatus follows widely accepted theory of heat conduction in liquids based on Debye's concept in which the hydroacoustic vibrations (phonons) of a continuous medium(base fluid) are responsible for the heat transfer in liquids.<br/><br/>
<strong>Working Principle</strong><br/>
Ultrasound waves of known frequency are produced and its wavelength is measured. Then sound velocity in Liquid is calculated. After calculating velocity of sound in Liquid, one can calculate the thermal conductivity by the formula given by P W Bridgman.<br/><br/>
<strong>Description</strong><br/>
Thermal Conductivity Apparatus consists of:<br/>
- Electronic Unit<br/>
- Conductivity Cell-2MHz<br/>
- Stability Cell 4MHz<br/>
- Temperature Controller Unit (RT to 70°C)`
  },
  {
    id: '7107',
    name: 'Low Power High Frequency Sonicator',
    slug: 'low-power-high-frequency-sonicator',
    itemCode: 'LPHFS-02',
    image: '7107.jpg',
    categoryId: '3226',
    description: 'Coming Soon.......',
    fullDescription: 'This product is under development. Contact us for more information.'
  },

  // Ultrasonics Laboratory Instruments (Category 3227)
  {
    id: '7126',
    name: 'Ultrasonic Interferometer for Liquids',
    slug: 'ultrasonic-interferometer-for-liquids',
    itemCode: 'UIFL-01',
    image: '7126.jpg',
    categoryId: '3227',
    description: 'Used for Ph.D. research and published in numerous National & International Journals.',
    fullDescription: `Using this instrument several Ph.D. Thesis are awarded and innumerable Research papers are published in National & International Journals. Velocity measurement combining with other physical quantities provides information of more than 30 Parameters.<br/><br/>
<strong>Working Principle</strong><br/>
The principle used in the measurement of velocity (ν) is based on the accurate determination of the wavelength (λ) in the medium. Ultrasonic waves of known frequency (f) are produced by a quartz crystal fixed at the bottom of the cell.<br/><br/>
v = λ x f<br/><br/>
The Ultrasonic Interferometer consists of:<br/>
- HIGH FREQUENCY GENERATOR: Single and Multi-frequency<br/>
- MEASURING CELL: Max. displacement 20mm, Required liquid: 10 c.c., Least Count: 0.01mm/0.001mm<br/>
- SHIELDED CABLE: Impedance 50 Ω<br/><br/>
<strong>Parameters measured:</strong> Compressibility, Effective Debye Temperature, Excess Enthalpy, Hydrogen Bonding, Intermolecular Free Length, Solvation Number, Vander Wall's Constant, Rao's Constant, Wada Constant, Molecular Interaction, and many more.`
  },
  {
    id: '7127',
    name: 'Ultrasonic Interferometer for Solids',
    slug: 'ultrasonic-interferometer-for-solids',
    itemCode: 'UIFS-001',
    image: '7127.jpg',
    categoryId: '3227',
    description: 'Non-Destructive Testing of Material for Engineering Physics, Material Science and Polymer Science.',
    fullDescription: `Non-Destructive Testing of Material is an important part of Engineering Education. Piezoelectric Technique is widely used for measurement of composition dependent properties such as ultrasonic velocity, compressibility, elastic constant, Young's modulus and Bulk modulus.<br/><br/>
<strong>Theory</strong><br/>
In this technique the specimen is cemented to a quartz rod of identical cross section and resonant frequency of the composite system is determined. From the knowledge of frequencies and masses, ultrasonic properties can be calculated.<br/><br/>
<strong>Instrument:</strong> Piezoelectric Oscillator, power supply, quartz rod, holder, quartz rod with sample, connecting cables and R.F. meter.<br/>
<strong>Accessory:</strong> General purpose C.R.O. (not supplied)`
  },

  // Physics Laboratory Instruments (Category 3228) & Material Science (Category 3230)
  {
    id: '7128',
    name: 'Young\'s Modulus Apparatus',
    slug: 'youngs-modulus-apparatus',
    itemCode: 'YMA-01',
    image: '7128.jpg',
    categoryId: '3230',
    description: 'NDT apparatus for accurate elasticity testing, perfect for labs, research and educational use.',
    fullDescription: `Non-Destructive Testing of Material using Piezoelectric Technique for measurement of Young's modulus. Suitable for metals, plastics, polymers and crystals. Being used in several I.I.T.s/Universities/Engineering Colleges.<br/><br/>
In this technique the specimen is cemented to a quartz rod of identical cross section and resonant frequency of the composite system is determined. The resonant frequency of the quartz rod is also determined.<br/><br/>
Young's Modulus of specimen is calculated using ultrasonic velocity and density measurements.<br/><br/>
<strong>INSTRUMENT:</strong> Piezoelectric Oscillator, power supply, quartz rod, holder, quartz rod with sample, connecting cables and R.F. meter.`
  },
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
