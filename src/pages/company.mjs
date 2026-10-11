import { html } from '../lib/html.mjs';
import { url } from '../lib/config.mjs';
import { enquirySection } from '../components/enquiry-section.mjs';
import { gallerySlider } from '../components/site-gallery.mjs';
import { site, capabilities, process, reasons } from '../data/site.mjs';


export const companyPage = {
  page: 'company',
  path: '/company/',
  outFile: 'company/index.html',
  title: 'Company — The Construction Project',
  description:
    'Qualified civil engineers, not contractors: proper site safety, a dedicated supervisor, daily WhatsApp updates with photographs and no compromise on quality. Projects across India.',
  scripts: ['/assets/contact.js'],
  render: () => html`
    <section class="company-board" aria-labelledby="company-heading">
      <div class="shell">
        <div class="page-head-row">
          <h1 class="h1-page" id="company-heading">Company</h1>
          <span class="eyebrow"
            >${site.coverage} · ${site.yearsOnSite}+ years on site · five trades</span
          >
        </div>
        <span class="rule" aria-hidden="true" style="animation-delay:200ms"></span>

        <div class="section-head" data-reveal>
          <h2 class="h2-section" id="why-heading">Why choose us</h2>
          <span class="section-head-note">${reasons.length} reasons</span>
        </div>

        <div class="company-split">
          <div class="company-media">
            ${gallerySlider({ sizes: '(max-width: 900px) calc(100vw - 68px), min(640px, 46vw)' })}
            <p class="lead-text">
              We build it once and stay with it — structure, services, finishes, site rounds,
              handover.
            </p>
          </div>

          <ul class="reasons" aria-labelledby="why-heading">
            ${reasons.map(
              (reason) => html`
                <li class="reason" data-reveal>
                  <h3 class="reason-label">${reason.label}</h3>
                  <p class="reason-detail">${reason.detail}</p>
                </li>
              `
            )}
          </ul>
        </div>
      </div>
    </section>

    <section class="process" aria-labelledby="process-heading">
      <div class="shell">
        <div class="section-head" data-reveal>
          <h2 class="h2-section" id="process-heading">How we work</h2>
          <span class="section-head-note">Enquiry to handover</span>
        </div>
        <ol class="process-steps">
          ${process.map(
            (step, i) => html`
              <li class="process-step" data-reveal>
                <span class="process-number">${String(i + 1).padStart(2, '0')}</span>
                <h3 class="process-label">${step.label}</h3>
                <p class="process-detail">${step.detail}</p>
              </li>
            `
          )}
        </ol>
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

    ${enquirySection({ fallbackAction: url('/company/') })}
  `,
};
