// Maps product slug → public path of the PDF brochure preserved from the
// legacy PHP catalog. Files live under public/media_upload/ at the same
// paths Google has indexed for years (see SEO_AUDIT.md §2 — PDFs earn
// ~18% of all organic clicks). Add new mappings as more brochures land.

export const productBrochures: Record<string, string> = {
  'nano-fluid-heat-capacity-apparatus':
    '/media_upload/files/file/Nanofulid-Heat-Capacity-Apparatus.pdf',
  'thermal-conductivity-apparatus':
    '/media_upload/files/file/Thermal-Conductivity-Apparatus.pdf',
  'curie-temperature-kit':
    '/media_upload/files/file/Curie-Temperaturs-Kit_For-Ferroelectric-Material.pdf',
  'plancks-constant-kit':
    '/media_upload/files/image/PLANCK-S-CONSTANT-KIT.pdf',
  'youngs-modulus-apparatus':
    '/media_upload/files/image/YOUNG-Modulus-Apparatus.pdf',
  'universal-b-h-curve-tracer-ubhct-001':
    '/media_upload/files/image/Universal-B-H-curve-Tracer.pdf',
  'universal-b-h-curve-tracer-ubhct-004':
    '/media_upload/files/image/Universal-B-H-curve-Tracer.pdf',
  'b-h-curve-unit':
    '/media_upload/files/image/B-H-Cuve-Unit.pdf',
  'forbidden-energy-gap-kit':
    '/media_upload/files/image/FOR-BIDDEN-ENERGY-GAP-KIT.pdf',
  'fourier-analysis-kit':
    '/media_upload/files/image/FOURIER-ANA-LSIS-KIT.pdf',
  'lattice-dynamics-kit':
    '/media_upload/files/image/LATTICE-DYNA-MICS-KIT.pdf',
  'stefans-constant-kit':
    '/media_upload/files/image/STEFANS-CONSTANT-KIT.pdf',
  'boltzmann-constant-kit':
    '/media_upload/files/image/BOLTZMAN-CONSTANT-KIT.pdf',
  'capacitance-and-permittivity-kit':
    '/media_upload/files/image/CAPACITANCE-AND-PERMITT-IVITY-KIT.pdf',
  'led-and-laser-diode-characteristics-apparatus':
    '/media_upload/files/image/LED-AND-LASER-DIODE-CHARACTERISTIC-APPARATUS.pdf',
  'laser-experiment-kits':
    '/media_upload/files/image/LASER-EXPERIMENT-KIT-oth.pdf',
  'dielectric-constant-kit-liquid':
    '/media_upload/files/image/DIELECTRIC-CONSTANT-KIT-For-LIQUIDS_.pdf',
};

export function getProductBrochure(slug: string): string | undefined {
  return productBrochures[slug];
}
