import { html, raw, localImage } from '../lib/html.mjs';
import { site } from '../data/site.mjs';
import { url } from '../lib/config.mjs';
import { enquiryForm } from '../components/enquiry-form.mjs';

const IMG_SIZES = '(max-width: 760px) calc(100vw - 68px), min(660px, 48vw)';

export const contactPage = {
  page: 'contact',
  path: '/contact/',
  outFile: 'contact/index.html',
  title: 'Contact — The Construction Project',
  description:
    'Tell us what you are building. The Construction Project, #510 Sector 17 HUDA Jagadhri — call +91 94676 29425, WhatsApp or send an enquiry. Mon—Sat, 10:00—19:00.',
  scripts: ['/assets/contact.js'],
  bodyClass: '',
  render: () => html`
    <section class="contact-board" aria-labelledby="contact-heading">
      <div class="shell">
        <div class="page-head-row">
          <h1 class="h1-page" id="contact-heading">Contact</h1>
          <span class="eyebrow">${site.hours}</span>
        </div>
        <span class="rule" aria-hidden="true" style="animation-delay:200ms"></span>

        <div class="contact-split">
          <div class="contact-aside">
            <div class="frame frame--4x3 frame--bordered">
              ${localImage({
                file: 'office-site.jpeg',
                alt: 'The Construction Project office',
                sizes: IMG_SIZES,
                loading: 'eager',
                fetchPriority: 'high',
              })}
            </div>
            <div class="contact-details">
              <div class="contact-detail">
                <h2 class="contact-detail-label">Office</h2>
                <p>
                  ${site.address.line1}<br />${site.address.line2}<br />${site.address
                    .line3}<br />${site.address.line4}
                </p>
              </div>
              <div class="contact-detail">
                <h2 class="contact-detail-label">Direct</h2>
                <p>
                  <a href="${site.phone.tel}">${site.phone.display}</a><br />
                  <a href="mailto:${site.email}">${site.email}</a><br />
                  <a href="${site.phone.whatsapp}" rel="noopener" target="_blank">WhatsApp</a>
                </p>
              </div>
            </div>
          </div>

          <div class="contact-form-wrap">
            ${enquiryForm({ fallbackAction: url('/contact/') })}
          </div>
        </div>
      </div>
    </section>
  `,
};

/**
 * Static confirmation page — the no-JavaScript success target. The server
 * 303-redirects here once an enquiry is accepted.
 */
export const enquiryReceivedPage = {
  page: 'contact',
  path: '/enquiry-received/',
  outFile: 'enquiry-received/index.html',
  title: 'Enquiry received — The Construction Project',
  description: 'Thank you — your enquiry has reached The Construction Project.',
  // site.js is what makes the mobile nav work — every page needs it.
  scripts: ['/assets/site.js'],
  noindex: true,
  render: () => html`
    <section class="contact-board" aria-labelledby="received-heading">
      <div class="shell">
        <div class="page-head-row">
          <h1 class="h1-page" id="received-heading">Thank you</h1>
          <span class="eyebrow">${site.hours}</span>
        </div>
        <span class="rule" aria-hidden="true" style="animation-delay:200ms"></span>
        <div class="contact-split">
          <div class="contact-aside">
            <p class="lead-text">
              Your enquiry has reached the office. We will call you back within a working day.
            </p>
            <div class="contact-details">
              <div class="contact-detail">
                <h2 class="contact-detail-label">Sooner</h2>
                <p>
                  <a href="${site.phone.tel}">${site.phone.display}</a><br />
                  <a href="${site.phone.whatsapp}" rel="noopener" target="_blank">WhatsApp</a><br />
                  <a href="mailto:${site.email}">${site.email}</a>
                </p>
              </div>
              <div class="contact-detail">
                <h2 class="contact-detail-label">Meanwhile</h2>
                <p><a href="${url('/projects/')}">See the project index</a><br /><a href="${url('/company/')}">About the company</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
};
