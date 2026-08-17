/**
 * Project index.
 *
 * `image.placeholder: true` marks stock photography standing in for the
 * studio's own work. Those images are free-license Pexels files and MUST be
 * replaced before launch — see docs/BUILD-NOTES.md.
 */

const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb`;

export const categories = [
  { key: 'all', label: 'All' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'interiors', label: 'Interiors' },
  { key: 'visualisation', label: 'Visualisation' },
  { key: 'landscape', label: 'Landscape' },
];

export const projects = [
  {
    slug: 'courtyard-house',
    name: 'Courtyard House',
    meta: 'Sector 17 · 2024',
    homeMeta: 'Sector 17 · 2024',
    category: 'architecture',
    featured: true,
    image: { remote: pexels(323780), alt: 'Courtyard House — contemporary residence', placeholder: true },
  },
  {
    slug: 'vidya-bhawan-block',
    name: 'Vidya Bhawan Block',
    meta: 'Institutional · 2023',
    homeMeta: 'Institutional · 2023',
    category: 'architecture',
    featured: true,
    image: { remote: pexels(269077), alt: 'Vidya Bhawan — institutional block', placeholder: true },
  },
  {
    slug: 'mangla-flagship',
    name: 'Mangla Flagship',
    meta: 'Ambala · 2025',
    homeMeta: 'Interiors · 2025',
    category: 'interiors',
    featured: true,
    image: { remote: pexels(260922), alt: 'Mangla Flagship — retail interior', placeholder: true },
  },
  {
    slug: 'radaur-road-complex',
    name: 'Radaur Road Complex',
    meta: 'In progress',
    category: 'visualisation',
    image: { remote: pexels(323705), alt: 'Radaur Road — commercial complex', placeholder: true },
  },
  {
    slug: 'kansapur-farmhouse',
    name: 'Kansapur Farmhouse',
    meta: 'Landscape · 2022',
    category: 'landscape',
    image: { remote: pexels(338504), alt: 'Kansapur Farmhouse — landscape', placeholder: true },
  },
  {
    slug: 'corporate-cabin',
    name: 'Corporate Cabin',
    meta: 'Fit-out · 2024',
    category: 'interiors',
    image: { remote: pexels(260689), alt: 'Corporate Cabin — office fit-out', placeholder: true },
  },
  {
    slug: 'sector-18-apartments',
    name: 'Sector 18 Apartments',
    meta: 'HUDA · 2021',
    category: 'architecture',
    image: { remote: pexels(439391), alt: 'Sector 18 Apartments', placeholder: true },
  },
  {
    slug: 'laminate-showroom',
    name: 'Laminate Showroom',
    meta: 'Walkthrough · 2023',
    category: 'visualisation',
    image: { remote: pexels(2724749), alt: 'Laminate Showroom — interior visualisation', placeholder: true },
  },
  {
    slug: 'community-court',
    name: 'Community Court',
    meta: 'Radaur · 2020',
    category: 'landscape',
    image: { remote: pexels(1974596), alt: 'Community Court — landscape', placeholder: true },
  },
];

/** The three tiles shown under "Selected Projects" on Home. */
export const featuredProjects = projects.filter((p) => p.featured);

export const projectIndexMeta = {
  eyebrow: 'Index · 09 works · 2018—2026',
};
