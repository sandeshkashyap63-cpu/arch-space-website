/**
 * Project index.
 *
 * `image.placeholder: true` marks stock photography standing in for the
 * company's own work. Those images are free-license Pexels files and MUST be
 * replaced before launch — see docs/BUILD-NOTES.md.
 */

const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb`;

export const categories = [
  { key: 'all', label: 'All' },
  { key: 'residential', label: 'Residential' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'interiors', label: 'Interiors' },
  { key: 'landscape', label: 'Landscape' },
];

export const projects = [
  /* The client's own completed projects. Location is the state only — never a
     street, sector or town. */
  {
    slug: 'classical-villa',
    name: 'Classical Villa',
    meta: 'Haryana',
    category: 'residential',
    featured: true,
    image: { local: 'project-classical-villa.jpeg', alt: 'Classical villa with columned portico and ornamental gate' },
  },
  {
    slug: 'arched-residence',
    name: 'Arched Residence',
    meta: 'Punjab',
    category: 'residential',
    featured: true,
    image: { local: 'project-arched-residence.jpeg', alt: 'Residence with a tall arched entrance and carved jaali screens' },
  },
  {
    slug: '330-gaj-duplex',
    name: '330 Gaj Duplex Residential Building',
    meta: 'In progress',
    category: 'residential',
    image: {
      local: 'project-330-gaj-duplex.jpeg',
      alt: 'Duplex residence under construction, mouldings cast and scaffolding still up',
    },
  },
  {
    slug: 'neoclassical-residence',
    name: 'Neoclassical Residence',
    // meta deliberately absent: the client has not said which state this one
    // is in, and a guess would be published as fact. Add it here when known.
    category: 'residential',
    image: {
      local: 'project-neoclassical-residence.jpeg',
      alt: 'Neoclassical residence in cream stone with ornamental iron balconies',
    },
  },
  {
    slug: 'brick-and-stone-residence',
    name: 'Brick & Stone Residence',
    meta: 'Chandigarh',
    category: 'residential',
    featured: true,
    image: { local: 'project-brick-and-stone-residence.jpeg', alt: 'Contemporary residence in red brick and stone' },
  },
  {
    slug: 'courtyard-house',
    name: 'Courtyard House',
    meta: 'Haryana · 2024',
    homeMeta: 'Haryana · 2024',
    category: 'residential',
    image: { remote: pexels(323780), alt: 'Courtyard house — contemporary residence', placeholder: true },
  },
  {
    slug: 'vidya-bhawan-block',
    name: 'Institutional Block',
    meta: 'Institutional · 2023',
    homeMeta: 'Institutional · 2023',
    category: 'commercial',
    image: { remote: pexels(269077), alt: 'Institutional block', placeholder: true },
  },
  {
    slug: 'radaur-road-complex',
    name: 'Commercial Complex',
    meta: 'In progress',
    category: 'commercial',
    image: {
      local: 'project-commercial-complex.jpeg',
      alt: 'Two-storey commercial block under construction, frame and blockwork with scaffolding',
    },
  },
  {
    slug: 'industrial-complex',
    name: 'Industrial Complex',
    meta: 'Haryana · In progress',
    category: 'commercial',
    featured: true,
    image: {
      /* The first slide doubles as the single-image fallback (no JS, slow
         connection) and as the thumbnail chosen by social share previews. */
      local: 'project-industrial-complex-01.jpeg',
      alt: 'Industrial complex — front view with office, warehouse and cement silos',
    },
    /* When `slides` is present the tile cross-fades through all of them while
       it is visible; see src/components/project-slider.mjs. */
    slides: [
      { local: 'project-industrial-complex-01.jpeg', alt: 'Industrial complex — front view with office, warehouse and cement silos' },
      { local: 'project-industrial-complex-02.jpeg', alt: 'Industrial complex — warehouse and silo cluster from the yard' },
      { local: 'project-industrial-complex-03.jpeg', alt: 'Industrial complex — office entrance and parking court' },
      { local: 'project-industrial-complex-04.jpeg', alt: 'Industrial complex — perspective from above showing the yard' },
      { local: 'project-industrial-complex-05.jpeg', alt: 'Industrial complex — rear view of the warehouse and silos' },
      { local: 'project-industrial-complex-06.jpeg', alt: 'Industrial complex — long view across the site boundary' },
      { local: 'project-industrial-complex-07.jpeg', alt: 'Industrial complex — tanker route alongside the main storage shed' },
      { local: 'project-industrial-complex-08.jpeg', alt: 'Industrial complex — site plan, aerial view' },
      { local: 'project-industrial-complex-09.jpeg', alt: 'Industrial complex — distant perspective of the office and silos' },
    ],
  },
  {
    slug: 'corporate-cabin',
    name: 'Corporate Cabin',
    meta: 'Fit-out · 2024',
    category: 'interiors',
    image: { remote: pexels(260689), alt: 'Corporate Cabin — office fit-out', placeholder: true },
  },
  {
    slug: 'laminate-showroom',
    name: 'Laminate Showroom',
    meta: 'Fit-out · 2023',
    category: 'interiors',
    image: { remote: pexels(2724749), alt: 'Laminate Showroom — interior fit-out', placeholder: true },
  },
  {
    slug: 'community-court',
    name: 'Community Court',
    meta: 'Haryana · 2020',
    category: 'landscape',
    image: { remote: pexels(1974596), alt: 'Community Court — landscape', placeholder: true },
  },
];

/** The three tiles shown under "Selected Projects" on Home. */
export const featuredProjects = projects.filter((p) => p.featured);
