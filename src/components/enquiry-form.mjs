/**
 * The enquiry form, shared by the Contact page and the Company page.
 *
 * One source so the two can never drift. Each page renders exactly one form,
 * so the field ids stay unique within a document.
 *
 * `fallbackAction` is only reached in handoff mode without JavaScript, which
 * the <noscript> block hides anyway — it points at the page's own URL so a
 * stray submit reloads rather than 405s on a static host.
 */
import { html, raw, attr } from '../lib/html.mjs';
import { site, scopeOptions } from '../data/site.mjs';
import { enquiryMode, enquiryEndpoint } from '../lib/config.mjs';

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

export function enquiryForm({ heading, fallbackAction, headingId, headingLevel = 2 } = {}) {
  // On Contact the form title is the section's own heading; on Company it sits
  // inside a section already headed "Build with us", so it drops a level.
  const H = `h${headingLevel}`;
  return html`
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
        <${raw(H)} class="form-title"${attr('id', headingId)}>${heading ?? 'Tell us about the site'}</${raw(H)}>
        <p class="form-note">
          The enquiry form needs JavaScript. Reach the office directly:
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
  action="${enquiryMode === 'handoff' ? fallbackAction : enquiryEndpoint}"
  novalidate
  data-enquiry-form
  data-enquiry-mode="${enquiryMode}"
  data-brand="${site.name}"
  data-whatsapp="${site.phone.whatsapp}"
  data-email="${site.email}"
>
  <${raw(H)} class="form-title"${attr('id', headingId)}>${heading ?? 'Tell us about the site'}</${raw(H)}>

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
  `;
}
