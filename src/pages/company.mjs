import { html, localImage } from '../lib/html.mjs';
import { url } from '../lib/config.mjs';
import { enquiryForm } from '../components/enquiry-form.mjs';
import { site, capabilities, awards, process, reasons } from '../data/site.mjs';

const HALF_SIZES = '(max-width: 760px) calc(100vw - 68px), min(660px, 48vw)';
const PORTRAIT_SIZES = '(max-width: 700px) calc(100vw - 68px), (max-width: 1100px) 45vw, 330px';

export const companyPage = {
  page: 'company',
  path: '/company/',
  outFile: 'company/index.html',
  title: 'Company — The Construction Project',
  description:
    'Qualified civil engineers, not contractors: proper site safety, a dedicated supervisor, daily WhatsApp updates with photographs and no compromise on quality. Jagadhri and Chandigarh.',
  scripts: ['/assets/contact.js'],
  render: () => html`
    <section class="company-board" aria-labelledby="company-heading">
      <div class="shell">
        <div class="page-head-row">
          <h1 class="h1-page" id="company-heading">Company</h1>
          <span class="eyebrow"
            >Jagadhri &amp; Chandigarh · ${site.yearsOnSite}+ years on site · five trades</span
          >
        </div>
        <span class="rule" aria-hidden="true" style="animation-delay:200ms"></span>

        <div class="section-head" data-reveal>
          <h2 class="h2-section" id="why-heading">Why choose us</h2>
          <span class="section-head-note">${reasons.length} reasons</span>
        </div>

        <div class="company-split">
          <div class="company-media">
            <div class="frame frame--4x3 frame--bordered">
              ${localImage({
                file: 'project-director.jpeg',
                alt: 'Project director reviewing drawings at the office',
                sizes: HALF_SIZES,
                loading: 'eager',
                fetchPriority: 'high',
              })}
            </div>
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

    <section class="enquiry-band" aria-labelledby="enquire-heading">
      <div class="shell">
        <div class="section-head" data-reveal>
          <h2 class="h2-section" id="enquire-heading">Build with us</h2>
          <span class="section-head-note">${site.hours}</span>
        </div>
        <div class="enquiry-split">
          <div class="enquiry-aside" data-reveal>
            <p class="lead-text">
              Tell us the site and the scope. We will come and look before we price anything.
            </p>
            <div class="contact-details">
              <div class="contact-detail">
                <h3 class="contact-detail-label">Direct</h3>
                <p>
                  <a href="${site.phone.tel}">${site.phone.display}</a><br />
                  <a href="${site.phone.whatsapp}" rel="noopener" target="_blank">WhatsApp</a><br />
                  <a href="mailto:${site.email}">${site.email}</a>
                </p>
              </div>
              <div class="contact-detail">
                <h3 class="contact-detail-label">Office</h3>
                <p>${site.address.line1}<br />${site.address.line2}<br />${site.address.line3}</p>
              </div>
            </div>
          </div>
          <div class="enquiry-form-wrap" data-reveal>
            ${enquiryForm({ fallbackAction: url('/company/'), headingLevel: 3 })}
          </div>
        </div>
      </div>
    </section>
  `,
};
