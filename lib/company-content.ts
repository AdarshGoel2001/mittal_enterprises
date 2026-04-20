export const companyCredentials = [
  {
    title: 'Trademark & Design Registered',
    body: 'Every instrument we manufacture is covered by Trademark, Design Registration and Copyright.',
  },
  {
    title: 'Research-grade precision',
    body: 'Digital micrometer accuracy to plus or minus 0.001 mm. Cited in peer-reviewed journals.',
  },
  {
    title: 'ISO 9001:2008 certified',
    body: 'Quality systems aligned to international standards. Documentation included with every unit.',
  },
  {
    title: 'Global delivery',
    body: 'Supplying universities, post-graduate colleges and research labs across India and worldwide.',
  },
] as const;

export const companyAudiences = [
  'Engineering Colleges',
  'Post-Graduate Colleges',
  'Universities',
  'Physics Departments',
  'Chemistry Departments',
  'Polymer Science Labs',
  'Material Science Labs',
  'R&D Centres',
] as const;

export const profilePillars = [
  {
    title: 'Quality products',
    body: 'All instruments manufactured to the highest standards and covered by Trademark, Design Registration and Copyright.',
  },
  {
    title: 'Expert support',
    body: 'Comprehensive support for installation, training and maintenance across every instrument we ship.',
  },
  {
    title: 'Research & development',
    body: 'Continuous R&D brings the latest innovations in laboratory instrumentation to our customers.',
  },
  {
    title: 'Global delivery',
    body: 'Serving educational institutions and research laboratories worldwide with timely delivery.',
  },
] as const;

export const globalSupplyServices = [
  { title: 'International shipping', body: 'Reliable shipping to destinations worldwide with documented tracking.' },
  { title: 'Secure packaging', body: 'Professional, lab-rated packaging ensuring instruments arrive calibrated and intact.' },
  { title: 'Custom requirements', body: 'Frequency ranges, cell volumes and voltage variants tailored to your setup.' },
  { title: 'Technical documentation', body: 'User manuals, calibration certificates and application notes included.' },
  { title: 'Installation support', body: 'Remote installation guidance and operational training for international customers.' },
  { title: 'Competitive pricing', body: 'Institutional pricing for bulk orders and multi-site procurement.' },
] as const;

export const companyKnowledgeSections = [
  {
    id: 'home-overview',
    title: 'Company overview',
    url: '/',
    body: 'Mittal Enterprises manufactures ultrasonic interferometers, nanofluid apparatus and specialised laboratory instruments for universities, research labs and educational institutions across India and globally. The company was established in 1976.',
  },
  {
    id: 'profile-distinction',
    title: 'Company distinction',
    url: '/profile',
    body: 'Mittal Enterprises states that it is the only manufacturer of Nanofluid Interferometers in India. The company highlights its distinction in manufacturing and exporting laboratory instruments, ultrasonic instruments like Ultrasonic Interferometers, and scientific instruments covered with Trademark, Design Registration and Copyright.',
  },
  {
    id: 'profile-commitment',
    title: 'Company commitment',
    url: '/profile',
    body: 'The company says it is committed to providing quality products for educational institutions and research laboratories, with a focus on customer satisfaction, competitive pricing and timely delivery.',
  },
  {
    id: 'global-supplies',
    title: 'Global supplies',
    url: '/global-supplies',
    body: 'Mittal Enterprises offers international shipping, secure packaging, custom requirements support, technical documentation, installation support and institutional pricing for bulk orders and multi-site procurement.',
  },
  {
    id: 'contact',
    title: 'Contact and response',
    url: '/contact',
    body: 'Website contact guidance says the team can help with specs, pricing and lead time and will get back within one business day. The enquiry page asks for experiment details, quantity, frequency range, application and delivery timeline.',
  },
  {
    id: 'audiences',
    title: 'Customer segments',
    url: '/',
    body: `Built for ${companyAudiences.join(', ')}.`,
  },
  {
    id: 'credentials',
    title: 'Credentials and trust signals',
    url: '/',
    body: companyCredentials.map((item) => `${item.title}: ${item.body}`).join(' '),
  },
] as const;

