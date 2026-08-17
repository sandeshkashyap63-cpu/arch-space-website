/**
 * Business details. Verbatim from the handoff — verify before launch.
 */
export const site = {
  name: 'Arch Space',
  principal: 'Abhishek Mangla, B.Arch',
  tagline: 'Concept to Completion',
  eyebrow: 'Architects · Interiors · Valuers · Landscape',
  // Change this to the production origin before launch — it is used for
  // canonical URLs, the sitemap and Open Graph tags.
  origin: 'https://www.archspace.example',
  phone: {
    display: '+91 94676 29425',
    tel: 'tel:+919467629425',
    whatsapp: 'https://wa.me/919467629425',
  },
  email: 'arspace1@gmail.com',
  hours: 'Mon—Sat · 10:00—19:00',
  established: 2011,
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
  disciplines: ['Architecture', 'Interiors', '3D Visualisation', 'Valuation', 'Landscape'],
  copyright: '© 2026 · Abhishek Mangla, B.Arch · Jagadhri & Chandigarh',
};

export const nav = [
  { label: 'Projects', href: '/projects/', key: 'projects' },
  { label: 'Studio', href: '/studio/', key: 'studio' },
  { label: 'Contact', href: '/contact/', key: 'contact' },
];

export const stats = [
  { value: 140, suffix: '+', pad: false, label: 'Projects delivered' },
  { value: 15, suffix: '', pad: false, label: 'Years in practice' },
  { value: 5, suffix: '', pad: true, label: 'Disciplines in-house' },
];

export const services = ['Architecture', 'Interiors', '3D Visualisation', 'Valuation', 'Landscape'];

export const awards = [
  { title: 'Panel member, Real Wood Collection launch', year: '2023' },
  { title: 'Speaker, Architects & Interior Designers Meet', year: '2022' },
  { title: 'Council of Architecture, India — registered', year: 'Member' },
];

export const capabilities = [
  {
    numeral: 'i',
    name: 'Architecture',
    detail: 'Feasibility, sanction drawings, structural coordination, construction documents.',
  },
  {
    numeral: 'ii',
    name: 'Interiors',
    detail: 'Joinery detail, material boards, lighting layouts, vendor supervision to fit-out.',
  },
  {
    numeral: 'iii',
    name: '3D Visualisation',
    detail: 'Walkthroughs and stills that settle decisions before anything is cast.',
  },
  {
    numeral: 'iv',
    name: 'Valuation',
    detail: 'Valuation reports for property, bank and legal purposes.',
  },
  {
    numeral: 'v',
    name: 'Landscape Design',
    detail: 'Ground planning, planting palettes and water detail for the local season.',
  },
];

/** Scope options on the enquiry form. Shared by the client form and the server handler. */
export const scopeOptions = [
  'Architecture',
  'Interiors',
  '3D / Walkthrough',
  'Valuation',
  'Landscape',
];
