import { html, raw, localImage, remoteImage } from '../lib/html.mjs';
import { siteGallery } from '../components/site-gallery.mjs';
import { url } from '../lib/config.mjs';
import { site, stats, services } from '../data/site.mjs';
import { featuredProjects } from '../data/projects.mjs';
import { testimonials } from '../data/testimonials.mjs';
import { heroSlides } from '../data/images.mjs';

const HERO_SIZES = '(max-width: 720px) calc(100vw - 68px), min(604px, 52vw)';
const TILE_SIZES = '(max-width: 700px) calc(100vw - 68px), (max-width: 1100px) 45vw, 450px';
const PRESS_SIZES = '(max-width: 760px) calc(100vw - 68px), min(660px, 48vw)';

const callouts = [
  { label: 'Structure', text: 'RCC frame cast to drawing, checked on site', side: 'left', n: 1 },
  { label: 'Material', text: 'exposed concrete · local brick · warm tone', side: 'left', n: 2 },
  { label: 'Programme', text: 'slab to handover on a dated schedule', side: 'right', n: 3 },
  { label: 'Site', text: 'projects across India', side: 'right', n: 4 },
];

const callout = (c) => html`
  <div class="callout callout--c${c.n}">
    <span class="callout-label">${c.label}</span>
    <span class="callout-text">${c.text}</span>
    <span class="callout-rule" aria-hidden="true"></span>
  </div>
`;

const heroSection = () => html`
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-hairline hero-hairline--left" aria-hidden="true"></div>
    <div class="hero-hairline hero-hairline--right" aria-hidden="true"></div>

    <div class="hero-title">
      <span class="hero-eyebrow">${site.eyebrow}</span>
      <h1 class="hero-h1" id="hero-title">
        ${site.nameLines.map((line) => html`<span>${line}</span>`)}
      </h1>
      <span class="hero-tagline">${site.tagline}</span>
    </div>

    <div class="hero-board">
      <div class="hero-callouts hero-callouts--left">
        ${callouts.filter((c) => c.side === 'left').map(callout)}
      </div>

      <figure class="hero-figure">
        <div
          class="hero-stage"
          data-slideshow
          role="group"
          aria-roledescription="carousel"
          aria-label="Project work"
        >
          <div class="hero-parallax" data-parallax>
            ${heroSlides.map(
              (slide, i) => html`
                <div
                  class="hero-slide${raw(i === 0 ? ' is-active' : '')}"
                  data-slide="${i}"
                  ${raw(i === 0 ? '' : 'aria-hidden="true"')}
                >
                  ${localImage({
                    file: slide.file,
                    alt: slide.alt,
                    sizes: HERO_SIZES,
                    loading: i === 0 ? 'eager' : 'lazy',
                    fetchPriority: i === 0 ? 'high' : undefined,
                    decoding: i === 0 ? 'sync' : 'async',
                  })}
                </div>
              `
            )}
          </div>
          <div class="hero-dots" data-dots role="group" aria-label="Choose slide">
            ${heroSlides.map(
              (slide, i) => html`
                <button
                  class="hero-dot"
                  type="button"
                  data-dot="${i}"
                  aria-label="Show slide ${i + 1} of ${heroSlides.length}"
                  aria-current="${i === 0 ? 'true' : 'false'}"
                ></button>
              `
            )}
          </div>
        </div>
        <figcaption class="hero-dimension">
          <span>Elevation · as built</span>
          <span class="hero-dimension-rule" aria-hidden="true"></span>
          <span>10.80 m</span>
        </figcaption>
      </figure>

      <div class="hero-callouts hero-callouts--right">
        ${callouts.filter((c) => c.side === 'right').map(callout)}
      </div>
    </div>

    <div class="hero-cue" aria-hidden="true">
      <span class="hero-cue-label">Scroll</span>
      <span class="hero-cue-bar"></span>
    </div>
  </section>
`;

const statementSection = () => html`
  <section class="band-light statement" aria-label="What the company does" data-statement>
    <div class="shell" data-reveal>
      <p class="statement-lead">
        Qualified civil engineers building homes &amp; buildings that last generations.
      </p>
      <p class="statement-support">
        Every project is designed, supervised and delivered by professional engineers — sound
        structures, honest materials, and work that passes every test across India.
      </p>
      ${stats.map(
        (stat) => html`
          <div class="stat">
            <span
              class="stat-number"
              data-count-to="${stat.value}"
              data-count-suffix="${stat.suffix}"
              data-count-pad="${stat.pad ? 'true' : 'false'}"
              >${stat.pad && stat.value < 10 ? `0${stat.value}` : stat.value}${stat.suffix}</span
            >
            <span class="stat-label">${stat.label}</span>
          </div>
        `
      )}
    </div>
  </section>
`;

const selectedSection = () => html`
  <section class="band-light selected" aria-labelledby="selected-projects">
    <div class="shell">
      <div class="section-head section-head--ink" data-reveal>
        <h2 class="h2-section" id="selected-projects">Selected Projects</h2>
        <a class="link-underlined" href="${url('/projects/')}">View all →</a>
      </div>
      <div class="tiles">
        ${featuredProjects.map(
          (project) => html`
            <a class="tile" href="${url('/projects/')}" data-reveal>
              <div class="frame frame--4x3">
                ${remoteImage({
                  src: project.image.remote,
                  alt: project.image.alt,
                  sizes: TILE_SIZES,
                })}
              </div>
              <div class="tile-caption">
                <span class="tile-name">${project.name}</span>
                <span class="tile-meta">${project.homeMeta ?? project.meta}</span>
              </div>
            </a>
          `
        )}
      </div>
    </div>
  </section>
`;

const marqueeGroup = (duplicate) => html`
  <div class="marquee-group"${raw(duplicate ? ' aria-hidden="true"' : '')}>
    ${services.map(
      (service) => html`
        <span class="marquee-word">${service}</span>
        <span class="marquee-sep" aria-hidden="true">✦</span>
      `
    )}
  </div>
`;

const marqueeSection = () => html`
  <section class="marquee-band" aria-label="What the company does">
    <div class="marquee-track" data-marquee>${marqueeGroup(false)}${marqueeGroup(true)}</div>
  </section>
`;

const quoteCard = (t) => html`
  <figure class="quote-card">
    <span class="quote-stars" role="img" aria-label="Rated ${t.rating} out of 5">
      ${'★'.repeat(t.rating)} <span class="quote-score" aria-hidden="true">${t.rating}/5</span>
    </span>
    <blockquote class="quote-text">${t.quote}</blockquote>
    <figcaption>
      <span class="quote-name">${t.name}</span>
      <span class="quote-project">${t.project}</span>
    </figcaption>
  </figure>
`;

const testimonialsSection = () => html`
  <section class="testimonials" aria-labelledby="clients">
    <div class="shell">
      <div class="section-head" data-reveal>
        <h2 class="h2-section" id="clients">Clients</h2>
        <span class="section-head-note">In their words</span>
      </div>
      <div class="rail" data-rail>
        <!-- Two identical sets make the loop seamless; the script adds more
             when one set is narrower than the viewport. -->
        <div class="rail-track" data-rail-track data-marquee>
          <div class="rail-set">${testimonials.map(quoteCard)}</div>
          <div class="rail-set" aria-hidden="true">${testimonials.map(quoteCard)}</div>
        </div>
      </div>
    </div>
  </section>
`;

const ctaSection = () => html`
  <section class="band-light cta" aria-labelledby="cta-heading">
    <div class="shell" data-reveal>
      <h2 class="cta-h2" id="cta-heading">Bring us<br />the <em>site</em>.</h2>
      <div class="cta-aside">
        <a class="btn btn--dark" href="${url('/contact/')}">Enquire →</a>
        <span class="cta-address"
          >${site.coverageLong} ·
          <a href="mailto:${site.email}">${site.email}</a></span
        >
      </div>
    </div>
  </section>
`;

export const home = {
  page: 'home',
  path: '/',
  outFile: 'index.html',
  title: 'The Construction Project — Civil Engineers & Builders, India',
  description:
    'Qualified civil engineers building homes & buildings that last generations. Sound structures, honest materials and daily site reports — projects across India.',
  scripts: ['/assets/home.js'],
  render: () => html`
    ${heroSection()} ${statementSection()} ${selectedSection()} ${marqueeSection()}
    ${testimonialsSection()} ${siteGallery()} ${ctaSection()}
  `,
};
