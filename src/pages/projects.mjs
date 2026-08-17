import { html, remoteImage } from '../lib/html.mjs';
import { url } from '../lib/config.mjs';
import { projects, categories, projectIndexMeta } from '../data/projects.mjs';

const TILE_SIZES = '(max-width: 700px) calc(100vw - 68px), (max-width: 1100px) 45vw, 440px';

export const projectsPage = {
  page: 'projects',
  path: '/projects/',
  outFile: 'projects/index.html',
  title: 'Projects — Arch Space',
  description:
    'Nine selected works by Arch Space: residences, institutional blocks, interiors, visualisation and landscape across Jagadhri, Yamunanagar, Ambala and Chandigarh.',
  scripts: ['/assets/projects.js'],
  render: () => html`
    <section class="page-head" aria-labelledby="projects-heading">
      <div class="shell">
        <div class="page-head-row">
          <h1 class="h1-page" id="projects-heading">Projects</h1>
          <span class="eyebrow">${projectIndexMeta.eyebrow}</span>
        </div>
        <span class="rule" aria-hidden="true"></span>
        <div class="filters" role="tablist" aria-label="Filter projects by discipline" data-filters>
          ${categories.map(
            (category, i) => html`
              <button
                class="filter"
                type="button"
                role="tab"
                id="filter-${category.key}"
                aria-controls="project-index"
                aria-selected="${i === 0 ? 'true' : 'false'}"
                data-filter="${category.key}"
              >
                ${category.label}
              </button>
            `
          )}
        </div>
        <p class="filter-status visually-hidden" role="status" data-filter-status></p>
      </div>
    </section>

    <section class="project-index" aria-label="Project index">
      <div
        class="shell tiles"
        id="project-index"
        role="tabpanel"
        aria-labelledby="filter-all"
        data-grid
      >
        ${projects.map(
          (project) => html`
            <article class="tile tile--static" data-category="${project.category}" data-reveal>
              <div class="frame frame--4x3 frame--bordered">
                ${remoteImage({
                  src: project.image.remote,
                  alt: project.image.alt,
                  sizes: TILE_SIZES,
                })}
              </div>
              <div class="tile-caption">
                <h2 class="tile-name">${project.name}</h2>
                <span class="tile-meta">${project.meta}</span>
              </div>
            </article>
          `
        )}
      </div>
    </section>

    <section class="band-light band-close" aria-label="Start a project">
      <div class="shell">
        <span class="h2-band">Planning something similar?</span>
        <a class="btn btn--dark" href="${url('/contact/')}">Enquire →</a>
      </div>
    </section>
  `,
};
