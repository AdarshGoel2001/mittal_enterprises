export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  fullDescription?: string;
}

export const productCategories: ProductCategory[] = [
  {
    id: '3226',
    name: 'Nano Science Instruments',
    slug: 'nano-science-instruments',
    image: '/images/generated/Nano-Science-Instruments.png',
    description: 'Today nano technology has spread all over the world and this branch of science flourish will more in coming time.',
    fullDescription: 'Nanoscience laboratory equipments used for various purposes, thus it is necessary that the instruments have Trademark, Design Registration and Copy right for quality assurance.'
  },
  {
    id: '3227',
    name: 'Ultrasonics Laboratory Instruments',
    slug: 'ultrasonics-laboratory-instruments',
    image: '/images/generated/Ultrasonics-Laboratory-Instruments.png',
    description: 'These days ultrasonic instrument has become an evident part of every laboratory. There not only used for medical imaging, detection, measurement and cleaning.',
    fullDescription: 'But today it is also used for changing the chemical properties of substances.'
  },
  {
    id: '3228',
    name: 'Physics Laboratory Instruments',
    slug: 'physics-laboratory-instruments',
    image: '/images/generated/Physics-Laboratory-Instruments.png',
    description: 'Objective: Determination of dielectric constant of solidsTheory: A dielectric is a material having low electrical conductivity in comparison to that of a metal.',
    fullDescription: 'It is characterized by its dielectric constant. Dielectric constant is measured as the ratio of the capacitance C of an electrical condenser filled'
  },
  {
    id: '3229',
    name: 'Chemistry Laboratory Instruments',
    slug: 'chemistry-laboratory-instruments',
    image: '/images/generated/Chemistry-Laboratory-Instruments.png',
    description: 'Our chemistry laboratory instruments match up to the intentional quality of standards, thus have a great demand in the market.',
    fullDescription: "It's basically consists of:-Ultrasonic Interoferometer for liquids"
  },
  {
    id: '3230',
    name: 'Material Science Laboratory Instruments',
    slug: 'material-science-laboratory-instruments',
    image: '/images/generated/Material-Sc.-Laboratory-Instruments.png',
    description: 'Our material science laboratory instruments basically consists of four instruments first, young modulus apparatus which is used for determining the young modulus elasticity of a wire by stretching it.',
    fullDescription: 'Then second is curie temperature kit which is used for determining the Curie Temperature.'
  },
  {
    id: '3236',
    name: 'Thermal Conductivity Apparatus',
    slug: 'thermal-conductivity-apparatus',
    image: '/images/generated/Thermal-Conductivity-Apparatus.png',
    description: 'The Apparatus follows widely accepted theory of heat conduction in liquids based on Debyes concept in which the hydroacoustic vibrations (phonons) of a continuous medium(base fluid) are responsible for the heat transfer in liquids.',
    fullDescription: ''
  }
];

export const companyInfo = {
  name: 'Mittal Enterprises',
  phone: ['+91-11-9810681132', '9868532156'],
  phoneOffice: '011-25702784',
  email: 'info@mittalenterprises.com',
  address: '2151/T-7C, New Patel Nagar, Delhi, 110008 India',
  social: {
    facebook: 'https://www.facebook.com/mittal.enter',
    twitter: 'https://twitter.com/mittalenterpris',
    linkedin: 'http://www.linkedin.com/pub/mittal-enterprises/22/41/239'
  },
  about: {
    short: 'Mittal Enterprises was established in 1976 with motto of providing quality products for Educational Institutions & Research Laboratories. The company has successfully achieved a distinct position owing to its quality products, competent management facilities and total customer satisfaction.',
    distinction: 'Mittal Enterprises has distinction in manufacturing and exporting Lab Instruments, Ultrasonic Instruments like Ultrasonic Interferometer and other Laboratory equipments and Scientific Instruments covered with Trademark, Design Registration and Copy right.'
  }
};
