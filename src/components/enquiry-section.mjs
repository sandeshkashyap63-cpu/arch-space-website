/**
 * The enquiry section — heading, direct-contact aside, and the form.
 * Shared by Home, Projects and Company so they cannot drift.
 *
 * `id="enquire"` is the anchor the pages' closing bands link to.
 */
import { html } from '../lib/html.mjs';
import { site } from '../data/site.mjs';
import { enquiryForm } from './enquiry-form.mjs';

export function enquirySection({ heading = 'Build with us', headingId = 'enquire-heading', fallbackAction }) {
  return html`
<section class="enquiry-band" id="enquire" aria-labelledby="${headingId}">
  <div class="shell">
    <div class="section-head" data-reveal>
      <h2 class="h2-section" id="${headingId}">${heading}</h2>
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
              <a href="${site.phone.whatsappGreeting}" rel="noopener" target="_blank">WhatsApp</a><br />
              <a href="mailto:${site.email}">${site.email}</a>
            </p>
          </div>
          <div class="contact-detail">
            <h3 class="contact-detail-label">Where we work</h3>
            <p>${site.coverageLong}.<br />${site.hours}</p>
          </div>
        </div>
      </div>
      <div class="enquiry-form-wrap" data-reveal>
        ${enquiryForm({ fallbackAction, headingLevel: 3 })}
      </div>
    </div>
  </div>
</section>
  `;
}
