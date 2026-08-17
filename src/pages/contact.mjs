import { html, raw, localImage } from '../lib/html.mjs';
import { site, scopeOptions } from '../data/site.mjs';
import { url, enquiryMode, enquiryEndpoint } from '../lib/config.mjs';

const IMG_SIZES = '(max-width: 760px) calc(100vw - 68px), min(660px, 48vw)';

const field = ({ id, name, label, type = 'text', placeholder, required, optional, autocomplete, inputmode }) => html`
  <div class="field">
    <label for="${id}"
      >${label}${optional ? html` <span class="optional">(optional)</span>` : ''}</label
    >
    <input
      id="${id}"
      name="${name}"
      type="${type}"
      placeholder="${placeholder}"
      ${raw(required ? 'required' : '')}
      ${raw(autocomplete ? `autocomplete="${autocomplete}"` : '')}
      ${raw(inputmode ? `inputmode="${inputmode}"` : '')}
      aria-describedby="${id}-error"
    />
    <p class="field-error" id="${id}-error" data-error-for="${name}"></p>
  </div>
`;

export const contactPage = {
  page: 'contact',
  path: '/contact/',
  outFile: 'contact/index.html',
  title: 'Contact — Arch Space',
  description:
    'Tell us about the site. Arch Space, #510 Sector 17 HUDA Jagadhri — call +91 94676 29425, WhatsApp or send an enquiry. Mon—Sat, 10:00—19:00.',
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
                file: 'studio-site.jpeg',
                alt: 'The Arch Space studio',
                sizes: IMG_SIZES,
                loading: 'eager',
                fetchPriority: 'high',
              })}
            </div>
            <div class="contact-details">
              <div class="contact-detail">
                <h2 class="contact-detail-label">Studio</h2>
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
            ${enquiryMode === 'handoff'
              ? html`<noscript>
                  <style>
                    /* No backend and no JavaScript: a form that cannot submit
                       would be a dead end, so show the direct routes instead. */
                    .enquiry-form {
                      display: none;
                    }
                  </style>
                  <div class="enquiry-noscript">
                    <h2 class="form-title">Tell us about the site</h2>
                    <p class="form-note">
                      The enquiry form needs JavaScript. Reach the studio directly:
                    </p>
                    <p class="contact-detail-direct">
                      <a href="${site.phone.tel}">${site.phone.display}</a><br />
                      <a href="${site.phone.whatsapp}" rel="noopener">WhatsApp</a><br />
                      <a href="mailto:${site.email}">${site.email}</a>
                    </p>
                  </div>
                </noscript>`
              : ''}
            <form
              class="enquiry-form"
              ${raw(enquiryMode === 'handoff' ? 'method="get"' : 'method="post"')}
              action="${enquiryMode === 'handoff' ? url('/contact/') : enquiryEndpoint}"
              novalidate
              data-enquiry-form
              data-enquiry-mode="${enquiryMode}"
              data-whatsapp="${site.phone.whatsapp}"
              data-email="${site.email}"
            >
              <h2 class="form-title">Tell us about the site</h2>

              <div class="field-row">
                ${field({
                  id: 'enquiry-name',
                  name: 'name',
                  label: 'Name',
                  placeholder: 'Name',
                  required: true,
                  autocomplete: 'name',
                })}
                ${field({
                  id: 'enquiry-phone',
                  name: 'phone',
                  label: 'Phone',
                  type: 'tel',
                  placeholder: 'Phone',
                  autocomplete: 'tel',
                  inputmode: 'tel',
                })}
              </div>

              ${field({
                id: 'enquiry-email',
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'Email',
                autocomplete: 'email',
                inputmode: 'email',
              })}
              ${field({
                id: 'enquiry-location',
                name: 'location',
                label: 'Location and plot size',
                placeholder: 'Location and plot size',
                optional: true,
              })}

              <fieldset class="scope">
                <legend>Scope</legend>
                ${scopeOptions.map(
                  (option, i) => html`
                    <label class="chip" for="scope-${i}">
                      <input type="checkbox" id="scope-${i}" name="scope" value="${option}" />
                      ${option}
                    </label>
                  `
                )}
              </fieldset>

              <div class="field">
                <label for="enquiry-message"
                  >Message <span class="optional">(optional)</span></label
                >
                <textarea
                  id="enquiry-message"
                  name="message"
                  rows="3"
                  placeholder="What are you planning to build?"
                ></textarea>
                <p class="field-error" data-error-for="message"></p>
              </div>

              <p class="field-error" data-error-for="contact"></p>

              <!-- Spam traps: a honeypot field and a render timestamp. -->
              <div class="hp-field" aria-hidden="true">
                <label for="enquiry-company">Company (leave blank)</label>
                <input id="enquiry-company" name="company" type="text" tabindex="-1" autocomplete="off" />
              </div>
              <input type="hidden" name="rendered_at" value="" data-rendered-at />

              <div class="form-footer">
                <button class="btn btn--bronze" type="submit" data-submit>
                  ${enquiryMode === 'handoff' ? 'Send on WhatsApp' : 'Send enquiry'}
                </button>
                <p class="form-status" role="status" data-form-status></p>
              </div>
              <p class="form-note">
                ${enquiryMode === 'handoff'
                  ? html`Name is required, plus at least one of phone or email so we can reply.
                      Sending opens WhatsApp with your enquiry ready to send — or
                      <a href="mailto:${site.email}">email us</a> instead.`
                  : html`Name is required, plus at least one of phone or email so we can reply. We
                      answer within one working day.`}
              </p>
            </form>
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
  title: 'Enquiry received — Arch Space',
  description: 'Thank you — your enquiry has reached the Arch Space studio.',
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
            <p class="studio-lead">
              Your enquiry has reached the studio. We will call you back within a working day.
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
                <p><a href="${url('/projects/')}">See the project index</a><br /><a href="${url('/studio/')}">About the studio</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
};
