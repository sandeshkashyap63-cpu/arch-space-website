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
  {
    file: 'project-director.jpeg',
    source: 'photos-1786856795790-y6tc.jpeg',
    alt: 'Project director reviewing drawings at the office',
  },
  // The site-supervisor photograph (design/uploads/photos-1786856519692-jqr6.jpeg)
  // is not currently placed — it only appeared on the Team section, which the
  // client removed. The source is kept; re-add this entry to bring it back.
  {
    file: 'award-panel.jpeg',
    source: 'photos-1786856519759-p198.jpeg',
    alt: 'The Construction Project on an industry panel',
  },
  {
    file: 'office-site.jpeg',
    source: 'photos-1786856519741-vsjh.jpeg',
    alt: 'The Construction Project office',
  },
];

/** The four frames of the Home hero slideshow, in order. */
export const heroSlides = [
  { file: 'hero-01.jpeg', alt: 'Sketch design board for a residence' },
  { file: 'hero-02.jpeg', alt: 'Wireframe interior render of a living space' },
  { file: 'hero-03.jpeg', alt: 'Annotated sketch design board' },
  { file: 'hero-04.jpeg', alt: 'Completed modern residence photographed at blue hour' },
];
