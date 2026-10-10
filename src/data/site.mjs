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
  tagline: 'The Art of Building',
  eyebrow: 'Construction · Interiors · Turnkey · Landscape',
  // Change this to the production origin before launch — it is used for
  // canonical URLs, the sitemap and Open Graph tags.
  origin: 'https://www.theconstructionproject.in',
  phone: {
    display: '+91 70155 35542',
    tel: 'tel:+917015535542',
    whatsapp: 'https://wa.me/917015535542',
  },
  email: 'Support@theconstructionproject.in',
  hours: 'Mon—Sat · 10:00—19:00',
  // Years on site, not a founding year: the client has not supplied one, and
  // "30+ years" and the old "est. 2011" cannot both be true.
  yearsOnSite: 30,
  /* No street address: the company has no office yet, so nothing on the site
     claims one — the phone, WhatsApp and email are the whole contact set.
     Add an `address` object back here when there is a premises to publish, and
     restore the PostalAddress in the JSON-LD with it. */
  country: 'India',
  /* Where the company works, which is no longer a pair of towns. Used wherever
     the site used to say "Jagadhri & Chandigarh". */
  coverage: 'Across India',
  coverageLong: 'Projects across India',
  disciplines: ['Construction', 'Interiors', 'Turnkey Projects', 'Renovation', 'Landscape'],
  copyright: '© 2026 · The Construction Project · Projects across India',
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

/* The Awards & press block was replaced by the site-photo gallery on both
   pages, so the credentials list has no consumer. The entries were "Panel
   member, Real Wood Collection launch" (2023) and "Speaker, Architects &
   Interior Designers Meet" (2022); git history has them if they are wanted
   back, and the contractor registration details still need to be supplied. */

/**
 * Why choose us — the company's own differentiators, in the client's words.
 * Rendered as the opening section of the Company page.
 */
export const reasons = [
  {
    label: 'Civil engineers',
    detail:
      'Qualified civil engineers plan and run every job — not a thekedar working without technical training.',
  },
  {
    label: 'Safety on site',
    detail:
      'Proper safety measures on every site: equipment, scaffolding and method, never shortcuts.',
  },
  {
    label: 'Quality, no compromise',
    detail:
      'Quality is held through the whole job, checked as it is built rather than argued about after.',
  },
  {
    label: 'Daily site updates',
    detail:
      'A WhatsApp report every day with photographs, so you see the work without standing on site.',
  },
  {
    label: 'Dedicated supervisor',
    detail: 'One supervisor assigned to your site and answerable for it, from start to handover.',
  },
  {
    label: 'Conduct on site',
    detail: 'Our labour and staff behave themselves. Any misconduct is acted on at once.',
  },
  {
    label: 'Value for money',
    detail: 'Itemised, honest pricing — affordable without cutting what should not be cut.',
  },
  {
    label: 'Best material',
    detail: 'The material specified is the material that goes in, with nothing substituted quietly.',
  },
  {
    label: 'Technical, not jugaad',
    detail:
      'The work follows drawings and technical method. No desi jugaad holding the job together.',
  },
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
