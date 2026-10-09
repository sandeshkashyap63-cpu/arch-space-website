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

export function siteGallery({ headingId = 'gallery-heading' } = {}) {
  const photos = galleryImages();
  if (!photos.length) return html``;

  return html`
    <section class="gallery-band" aria-labelledby="${headingId}">
      <div class="shell">
        <div class="section-head" data-reveal>
          <h2 class="h2-section" id="${headingId}">On site</h2>
          <span class="section-head-note">Past &amp; current projects</span>
        </div>
        <div
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
                  ${raw(i === 0 ? '' : 'aria-hidden="true"')}
                >
                  ${localImage({
                    file: photo.file,
                    alt: photo.alt,
                    sizes: SIZES,
                    loading: i === 0 ? 'eager' : 'lazy',
                  })}
                </div>
              `
            )}
          </div>
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
      </div>
    </section>
  `;
}
