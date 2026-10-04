/**
 * Business details.
 *
 * The practice was handed over as an architecture studio ("Arch Space") and is
 * now a construction company. Copy below is written for a builder: the service
 * list, stat labels and credentials changed with it. Verify against the
 * client's own records before launch — see docs/BUILD-NOTES.md.
 */
export const site = {
  name: 'The Construction Project',
  // The wordmark lockup stacks to two lines on narrow screens.
  nameLines: ['The Construction', 'Project'],
  tagline: 'Concept to Completion',
  eyebrow: 'Construction · Interiors · Turnkey · Landscape',
  // Change this to the production origin before launch — it is used for
  // canonical URLs, the sitemap and Open Graph tags.
  origin: 'https://www.theconstructionproject.example',
  phone: {
    display: '+91 94676 29425',
    tel: 'tel:+919467629425',
    whatsapp: 'https://wa.me/919467629425',
  },
  email: 'arspace1@gmail.com',
  hours: 'Mon—Sat · 10:00—19:00',
  // Years on site, not a founding year: the client has not supplied one, and
  // "30+ years" and the old "est. 2011" cannot both be true.
  yearsOnSite: 30,
  address: {
    line1: '#510, Sector 17',
    line2: 'Opp. Civil Dispensary, HUDA',
    line3: 'Jagadhri, Distt. Yamunanagar',
    line4: 'Haryana, India',
    short: '#510, Sector 17, HUDA, Jagadhri',
    locality: 'Jagadhri',
    region: 'Haryana',
    country: 'IN',
    // postalCode intentionally omitted — not supplied in the handoff.
  },
  cities: 'Jagadhri & Chandigarh',
  disciplines: ['Construction', 'Interiors', 'Turnkey Projects', 'Renovation', 'Landscape'],
  copyright: '© 2026 · The Construction Project · Jagadhri & Chandigarh',
};

export const nav = [
  { label: 'Projects', href: '/projects/', key: 'projects' },
  { label: 'Company', href: '/company/', key: 'company' },
  { label: 'Contact', href: '/contact/', key: 'contact' },
];

export const stats = [
  { value: 140, suffix: '+', pad: false, label: 'Projects delivered' },
  { value: 30, suffix: '+', pad: false, label: 'Years on site' },
  { value: 5, suffix: '', pad: true, label: 'Trades in-house' },
];

export const services = [
  'Construction',
  'Interiors',
  'Turnkey Projects',
  'Renovation',
  'Landscape',
];

/**
 * Credentials. The handoff's third entry was the principal's Council of
 * Architecture registration — an individual architect's credential, which does
 * not transfer to the company. The client needs to supply the contractor
 * registration / licence details that replace it.
 */
export const awards = [
  { title: 'Panel member, Real Wood Collection launch', year: '2023' },
  { title: 'Speaker, Architects & Interior Designers Meet', year: '2022' },
];

/**
 * How a job runs, enquiry to handover. Shown on the Company page.
 * Numbers are rendered zero-padded from the array order.
 */
export const process = [
  {
    label: 'Enquiry',
    detail: 'You call, WhatsApp or send the form. We note the site, the scope and your budget.',
  },
  {
    label: 'Site visit',
    detail: 'We come to the plot and check measurements, access, soil and services before anything is priced.',
  },
  {
    label: 'Drawings',
    detail: 'We go through your plan and drawings together, mark the changes, and fix the scope.',
  },
  {
    label: 'Quotation',
    detail: 'An itemised quote built around your drawings — materials, labour and programme, in writing.',
  },
  {
    label: 'Agreement',
    detail: 'A signed contract covering scope, payment stages, timeline and site safety.',
  },
  {
    label: 'We build',
    detail: 'Structure to finishes, supervised daily, handed over on the date we agreed.',
  },
];

export const capabilities = [
  {
    numeral: 'i',
    name: 'Construction',
    detail: 'Foundations, RCC frame, masonry and finishes, built to drawing and checked on site.',
  },
  {
    numeral: 'ii',
    name: 'Interiors',
    detail: 'Joinery, false ceilings, lighting and services, run to a fit-out programme.',
  },
  {
    numeral: 'iii',
    name: 'Turnkey Projects',
    detail: 'One contract from drawing to handover — structure, services, finishes, snagging.',
  },
  {
    numeral: 'iv',
    name: 'Renovation',
    detail: 'Retrofits, additions and repairs, sequenced so an occupied building keeps working.',
  },
  {
    numeral: 'v',
    name: 'Landscape',
    detail: 'Ground works, paving, drainage and planting detailed for the local season.',
  },
];

/** Scope options on the enquiry form. Shared by the client form and the server handler. */
export const scopeOptions = [
  'Construction',
  'Interiors',
  'Turnkey',
  'Renovation',
  'Landscape',
];
