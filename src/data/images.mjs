/**
 * Client-supplied photography.
 *
 * `source` names are the raw files as delivered in design/uploads/; the build
 * copies and derives responsive AVIF/JPEG variants into public/images/ under
 * the readable `file` name. Run `npm run images` after adding or replacing a
 * source file.
 */
export const clientImages = [
  {
    file: 'hero-01.jpeg',
    source: 'Enhance_quality_and_change_size_202608161056.jpeg',
    alt: 'Sketch design board for a residence',
  },
  {
    file: 'hero-02.jpeg',
    source: 'Enhance_quality_and_change_size_202608161057.jpeg',
    alt: 'Wireframe interior render of a living space',
  },
  {
    file: 'hero-03.jpeg',
    source: 'Enhance_image_quality_and_size_202608161128.jpeg',
    alt: 'Annotated sketch design board',
  },
  {
    file: 'hero-04.jpeg',
    source: 'Enhance_quality_and_change_size_202608171156.jpeg',
    alt: 'Completed modern residence photographed at blue hour',
  },
  // The director and office photographs are no longer placed — both columns
  // that held them now carry the site-photo slider. Sources kept in
  // design/uploads/; re-add an entry here to bring one back.
  // The site-supervisor photograph (design/uploads/photos-1786856519692-jqr6.jpeg)
  // is not currently placed — it only appeared on the Team section, which the
  // client removed. The source is kept; re-add this entry to bring it back.
  // The award/panel photograph is no longer placed — the Awards & press block
  // it belonged to is now the site-photo gallery. Source kept in design/uploads/.

  /* Project photographs — the client's own completed work. One per project on
     the Projects page; see photos/projects/README.md. */
  {
    file: 'project-classical-villa.jpeg',
    source: 'photos/projects/classical-villa.jpg',
    alt: 'Classical villa with columned portico and ornamental gate',
  },
  {
    file: 'project-arched-residence.jpeg',
    source: 'photos/projects/arched-residence.jpg',
    alt: 'Residence with a tall arched entrance and carved jaali screens',
  },
  {
    file: 'project-330-gaj-duplex.jpeg',
    // Its own copy rather than a reference into photos/work/, so removing the
    // photograph from the gallery cannot break the Projects page.
    source: 'photos/projects/330-gaj-duplex.heic',
    alt: 'Duplex residence under construction, mouldings cast and scaffolding still up',
  },
  {
    file: 'project-commercial-complex.jpeg',
    source: 'photos/projects/commercial-complex.heic',
    alt: 'Two-storey commercial block under construction, frame and blockwork with scaffolding',
  },
  {
    file: 'project-neoclassical-residence.jpeg',
    source: 'photos/projects/neoclassical-residence.jpg',
    alt: 'Neoclassical residence in cream stone with ornamental iron balconies',
  },
  {
    file: 'project-brick-and-stone-residence.jpeg',
    source: 'photos/projects/brick-and-stone-residence.jpg',
    alt: 'Contemporary residence in red brick and stone',
  },
];

/** The four frames of the Home hero slideshow, in order. */
export const heroSlides = [
  { file: 'hero-01.jpeg', alt: 'Sketch design board for a residence' },
  { file: 'hero-02.jpeg', alt: 'Wireframe interior render of a living space' },
  { file: 'hero-03.jpeg', alt: 'Annotated sketch design board' },
  { file: 'hero-04.jpeg', alt: 'Completed modern residence photographed at blue hour' },
];
