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

  // Physics Laboratory Instruments (Category 3228)
  {
    id: '7129',
    name: 'B-H Curve Unit',
    slug: 'b-h-curve-unit',
    itemCode: 'BHC-01',
    image: '7129.jpg',
    categoryId: '3228',
    description: 'Determination of Energy Band Gap of Silicon, Germanium etc using diodes and light emitting diodes.',
    fullDescription: `<strong>Objective:</strong> Determination of Energy Band Gap of Silicon, Germanium etc using diodes and light emitting diodes.<br/><br/>
This apparatus provides comprehensive study of magnetic properties of ferromagnetic materials through B-H curve analysis.`
  },
  {
    id: '7130',
    name: 'Forbidden Energy Gap Kit',
    slug: 'forbidden-energy-gap-kit',
    itemCode: 'FEGK-01',
    image: '7130.jpg',
    categoryId: '3228',
    description: 'MEASUREMENT of Energy Band Gap of Semiconductors like Si, Ge etc using p-n junction diodes and LEDs.',
    fullDescription: `<strong>Objective:</strong> MEASUREMENT of Energy Band Gap of Semiconductors like Si, Ge etc using p-n junction diodes and LEDs<br/><br/>
This kit enables students to determine the energy band gap of semiconductor materials through practical measurements.`
  },
  {
    id: '7131',
    name: 'Fourier Analysis Kit',
    slug: 'fourier-analysis-kit',
    itemCode: 'FAK-01',
    image: '7131.jpg',
    categoryId: '3228',
    description: 'Analyze complex waves and verify the existence of different harmonics and measure their relative amplitudes.',
    fullDescription: `<strong>Objective:</strong> TO Analyze complex wave (square, clipped sine wave triangular wave etc.)<br/>
TO verify the existence of different harmonics and measure their relative amplitudes.<br/><br/>
This kit provides hands-on experience with Fourier series analysis and harmonic composition of complex waveforms.`
  },
  {
    id: '7132',
    name: 'Lattice Dynamics Kit',
    slug: 'lattice-dynamics-kit',
    itemCode: 'LDK-01',
    image: '7132.jpg',
    categoryId: '3228',
    description: 'Study of the Dispersion relation for Mono-atomic and Di-atomic Lattice structures.',
    fullDescription: `<strong>Objective:</strong> 1. Study of the Dispersion relation for "Mono-atomic Lattice". Determination of the Cut-off frequency and Comparison with theory.<br/>
2. Study of the Dispersion relation for the Di-atomic Lattice, Acoustical mode and Energy Gap. Comparison with theory.<br/><br/>
This kit provides comprehensive understanding of lattice vibrations and phonon dispersion in crystalline materials.`
  },
  {
    id: '7133',
    name: 'Stefan\'s Constant Kit',
    slug: 'stefans-constant-kit',
    itemCode: 'SCK-01',
    image: '7133.jpg',
    categoryId: '3228',
    description: 'Determination of Stefan\'s constant by the black copper radiation plates using Electrical Method.',
    fullDescription: `<strong>OBJECTIVE:</strong> Stefan's constant by the black copper radiation plates (Electrical Method).<br/><br/>
This kit allows students to verify Stefan-Boltzmann law and determine Stefan's constant experimentally.`
  },
  {
    id: '7134',
    name: 'Boltzman Constant Kit',
    slug: 'boltzman-constant-kit',
    itemCode: 'BCK-01',
    image: '7134.jpg',
    categoryId: '3228',
    description: 'MEASUREMENT of Boltzman\'s Constant using semiconductor Diode.',
    fullDescription: `<strong>Objective:</strong> MEASUREMENT of Boltzman's Constant using semiconductor Diode.<br/><br/>
This apparatus enables precise determination of Boltzmann's constant through semiconductor diode characteristics.`
  },
  {
    id: '7135',
    name: 'Capacitance and Permittivity Kit',
    slug: 'capacitance-and-permittivity-kit',
    itemCode: 'CPK-01',
    image: '7135.jpg',
    categoryId: '3228',
    description: 'Study of Series and Parallel combination of capacitances and factors determining capacitance.',
    fullDescription: `<strong>Objective:</strong> To Study - (1) Series and Parallel combination of capacitances.<br/>
(2) Factors that determine the capacitance of a parallel plate Capacitor ( area of overlap, distance between the plates and the medium )<br/><br/>
This kit provides comprehensive understanding of capacitance and dielectric properties.`
  },
  {
    id: '7136',
    name: 'Photodiode Characteristics Apparatus',
    slug: 'photodiode-characteristics-apparatus',
    itemCode: 'PCA-01',
    image: '7136.jpg',
    categoryId: '3228',
    description: 'Study I-V characteristics in reverse bias and measure variation of photocurrent.',
    fullDescription: `<strong>Objective:</strong> To Study I-V characteristics in reverse bias and to measure variation of photocurrent as a function of reverse voltage and intensity.<br/><br/>
This apparatus enables detailed study of photodiode behavior and photoelectric effect applications.`
  },
  {
    id: '7137',
    name: 'LED and Laser Diode Characteristics Apparatus',
    slug: 'led-and-laser-diode-characteristics-apparatus',
    itemCode: 'LLDCA-01',
    image: '7137.jpg',
    categoryId: '3228',
    description: 'Study I-V and P-I characteristics of LED and Diode Laser.',
    fullDescription: `<strong>Objective:</strong> To Study I-V characteristics of LED and Diode Laser. To Study P-I characteristics of LED and Diode Laser.<br/><br/>
This apparatus provides comprehensive analysis of LED and laser diode performance characteristics.`
  },
  {
    id: '7138',
    name: 'Laser Experiment Kits',
    slug: 'laser-experiment-kits',
    itemCode: 'LEK-01',
    image: '7138.jpg',
    categoryId: '3228',
    description: 'Comprehensive laser experiments including power distribution, beam spot size, and wavelength measurement.',
    fullDescription: `<strong>OBJECTIVE:</strong><br/>
• Determination of Power distribution within beam.<br/>
• Measurement of beam spot size.<br/>
• Measurement of divergence of LASER beam.<br/>
• Determination of wavelength of LASER.<br/>
• Determination of grating element of reflection type grating.<br/><br/>
This comprehensive kit enables various laser optics experiments and measurements.`
  },
  {
    id: '7139',
    name: 'Fiber Optic Apparatus',
    slug: 'fiber-optic-apparatus',
    itemCode: 'FOA-01',
    image: '7139.jpg',
    categoryId: '3228',
    description: 'Measure Numerical Aperture, Acceptance angle and attenuation in Optical Fiber.',
    fullDescription: `<strong>Objective:</strong> To MEASURE Numerical Aperture and Acceptance angle of Optical Fiber.<br/>
To MEASURE attenuation in Optical Fiber.<br/><br/>
This apparatus provides hands-on experience with fiber optic communication principles and measurements.`
  },

  // Chemistry Laboratory Instruments (Category 3229)
  {
    id: '7140',
    name: 'Dipolemeter',
    slug: 'dipolemeter',
    itemCode: 'DPM-01',
    image: '7140.jpg',
    categoryId: '3229',
    description: 'Determination of dielectric constant of non aqueous liquid and Dipole Moment.',
    fullDescription: `<strong>Objective:</strong> Determination of dielectric constant of non aqueous liquid at different concentration and hence determination of Dipole Moment (e.g. of Nitrobenzene etc.)<br/><br/>
This instrument enables precise measurement of dielectric properties and dipole moments of various liquids.`
  },
  {
    id: '7141',
    name: 'Abbe Refractometers',
    slug: 'abbe-refractometers',
    itemCode: 'ARF-01',
    image: '7141.jpg',
    categoryId: '3229',
    description: 'Accurate measurement of refractive indices of liquids and transparent solids.',
    fullDescription: `Get accuracy Abbe Refractometers at Mittal Enterprises for measuring refractive indices of liquids and transparent solids.<br/><br/>
Abbe refractometers are essential instruments for determining the refractive index and quality of various substances in research and quality control laboratories.`
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
