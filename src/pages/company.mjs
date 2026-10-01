import { html, localImage } from '../lib/html.mjs';
import { url } from '../lib/config.mjs';
import { site, capabilities, awards } from '../data/site.mjs';
import { team } from '../data/team.mjs';

const HALF_SIZES = '(max-width: 760px) calc(100vw - 68px), min(660px, 48vw)';
const PORTRAIT_SIZES = '(max-width: 700px) calc(100vw - 68px), (max-width: 1100px) 45vw, 330px';

export const companyPage = {
  page: 'company',
  path: '/company/',
  outFile: 'company/index.html',
  title: 'Company — The Construction Project',
  description:
    'Five trades under one contract. The Construction Project builds from Jagadhri and Chandigarh — 30+ years on site, structure to handover.',
  scripts: ['/assets/site.js'],
  render: () => html`
    <section class="studio-board" aria-labelledby="company-heading">
      <div class="shell">
        <div class="page-head-row">
          <h1 class="h1-page" id="company-heading">Company</h1>
          <span class="eyebrow"
            >Jagadhri &amp; Chandigarh · ${site.yearsOnSite}+ years on site · five trades</span
          >
        </div>
        <span class="rule" aria-hidden="true" style="animation-delay:200ms"></span>
        <div class="studio-split">
          <div class="frame frame--4x3 frame--bordered">
            ${localImage({
              file: 'project-director.jpeg',
              alt: 'Project director reviewing drawings at the office',
              sizes: HALF_SIZES,
              loading: 'eager',
              fetchPriority: 'high',
            })}
          </div>
          <div class="studio-copy">
            <p class="studio-lead">
              We build it once and stay with it — structure, services, finishes, site rounds,
              handover.
            </p>
            <div class="studio-credit">
              <span class="studio-credit-name">${site.name}</span>
              <span class="studio-credit-role">Builders · ${site.cities}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="band-light capabilities" aria-labelledby="capabilities-heading">
      <div class="shell">
        <div class="capabilities-intro" data-reveal>
          <span class="eyebrow eyebrow--bronze">Capabilities</span>
          <h2 id="capabilities-heading">Five trades,<br />one contract</h2>
        </div>
        <div class="capabilities-list" data-reveal>
          ${capabilities.map(
            (capability) => html`
              <div class="capability">
                <span class="capability-numeral" aria-hidden="true">${capability.numeral}</span>
                <h3 class="capability-name">${capability.name}</h3>
                <p class="capability-detail">${capability.detail}</p>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <section class="team" aria-labelledby="team-heading">
      <div class="shell">
        <div class="section-head" data-reveal>
          <h2 class="h2-section" id="team-heading">The Team</h2>
          <span class="eyebrow">On site every day</span>
        </div>
        <div class="team-grid">
          ${team.map(
            (member) => html`
              <div class="team-member" data-reveal>
                <div class="frame frame--3x4 frame--bordered${member.image ? '' : ' frame--empty'}">
                  ${member.image
                    ? localImage({
                        file: member.image.file,
                        alt: member.image.alt,
                        sizes: PORTRAIT_SIZES,
                      })
                    : html`<span>Portrait to follow</span>`}
                </div>
                <div class="team-member-body">
                  <span class="team-name">${member.name}</span>
                  <span class="team-role">${member.role}</span>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    </section>

    <section class="awards" aria-labelledby="awards-heading">
      <div class="shell split" data-reveal>
        <div class="frame frame--16x10 frame--bordered">
          ${localImage({
            file: 'award-panel.jpeg',
            alt: 'The Construction Project on an industry panel',
            sizes: HALF_SIZES,
          })}
        </div>
        <div class="press-list">
          <h2 class="eyebrow eyebrow--gold" id="awards-heading">Awards &amp; press</h2>
          <div class="record-list">
            ${awards.map(
              (award) => html`
                <div class="record">
                  <span class="record-title">${award.title}</span>
                  <span class="record-year">${award.year}</span>
                </div>
              `
            )}
          </div>
        </div>
      </div>
    </section>

    <section class="band-light band-close" aria-label="Start a project">
      <div class="shell">
        <span class="h2-band">Build with us</span>
        <a class="btn btn--dark" href="${url('/contact/')}">Enquire →</a>
      </div>
    </section>
  `,
};
