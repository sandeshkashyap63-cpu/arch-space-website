/**
 * "On site" — an auto-advancing slider of the company's own site photographs.
 * Rendered on both Home and Company from this one source.
 *
 * Content comes from photos/work/ via the image manifest: drop files in that
 * folder and they appear here in filename order. See photos/work/README.md.
 *
 * Returns nothing at all when the folder is empty, so the section simply does
 * not render rather than leaving an empty frame on the page.
 */
import { html, raw, localImage, galleryImages } from '../lib/html.mjs';

/* Matches the CSS: the frame is capped at 720px and fills the gutters on a
   phone. Overstating this makes browsers fetch a larger file than they can
   ever show. */
const SIZES = '(max-width: 620px) calc(100vw - 68px), min(720px, 100vw - 68px)';

/**
 * Just the slider — for dropping into a column beside other content.
 * Returns nothing when photos/work/ is empty.
 *
 * `sizes` must match the width the frame actually gets on that page, or
 * browsers fetch a larger file than they can show.
 */
export function gallerySlider({ sizes = SIZES } = {}) {
  const photos = galleryImages();
  if (!photos.length) return html``;

  return html`
  <figure
    class="gallery"
    data-slideshow
    data-interval="4200"
    role="group"
    aria-roledescription="carousel"
    aria-label="Photographs from our sites"
    data-reveal
  >
    <div class="gallery-stage">
      ${photos.map(
        (photo, i) => html`
          <div
            class="gallery-slide${raw(i === 0 ? ' is-active' : '')}"
            data-slide="${i}"
            data-caption="${photo.alt}"
            ${raw(i === 0 ? '' : 'aria-hidden="true"')}
          >
            ${localImage({
              file: photo.file,
              alt: photo.alt,
              sizes,
              loading: i === 0 ? 'eager' : 'lazy',
            })}
          </div>
        `
      )}
      <div class="gallery-dots" data-dots role="group" aria-label="Choose photograph">
      ${photos.map(
        (photo, i) => html`
          <button
            class="hero-dot gallery-dot"
            type="button"
            data-dot="${i}"
            aria-label="Show photograph ${i + 1} of ${photos.length}"
            aria-current="${i === 0 ? 'true' : 'false'}"
          ></button>
        `
      )}
      </div>
    </div>
    <figcaption class="gallery-caption" aria-hidden="true">
      <span class="gallery-caption-text" data-caption-target>${photos[0].alt}</span>
      <span class="gallery-caption-rule"></span>
      <span class="gallery-count"
        ><span data-caption-index>01</span> / ${String(photos.length).padStart(2, '0')}</span
      >
    </figcaption>
  </figure>
  `;
}

/** The slider as a section of its own, with a heading. */
export function siteGallery({ headingId = 'gallery-heading' } = {}) {
  const slider = gallerySlider();
  if (!String(slider)) return html``;

  return html`
    <section class="gallery-band" aria-labelledby="${headingId}">
      <div class="shell">
        <div class="section-head" data-reveal>
          <h2 class="h2-section" id="${headingId}">On site</h2>
          <span class="section-head-note">Past &amp; current projects</span>
        </div>
        ${slider}
      </div>
    </section>
  `;
}
