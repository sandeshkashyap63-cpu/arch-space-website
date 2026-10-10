/* Contact: client-side validation, submit, success and error states.

   Two modes, chosen at build time (see src/lib/config.mjs):
   - "api"     posts JSON to the enquiry endpoint. Without JS the same form
               posts normally and the server redirects to /enquiry-received/;
               this layer only removes the page reload.
   - "handoff" no backend exists (static hosting), so a validated enquiry is
               handed to WhatsApp pre-filled, with email as the backup. */
(function () {
  'use strict';

  var form = document.querySelector('[data-enquiry-form]');
  if (!form) return;

  var statusEl = form.querySelector('[data-form-status]');
  var submitBtn = form.querySelector('[data-submit]');
  var renderedAt = form.querySelector('[data-rendered-at]');
  var mode = form.getAttribute('data-enquiry-mode') || 'api';

  // Timestamp the render so the server can reject instant bot submissions.
  if (renderedAt) renderedAt.value = String(Date.now());

  function errorSlot(name) {
    return form.querySelector('[data-error-for="' + name + '"]');
  }

  function clearErrors() {
    Array.prototype.forEach.call(form.querySelectorAll('.field-error'), function (el) {
      el.textContent = '';
    });
    Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid]'), function (el) {
      el.removeAttribute('aria-invalid');
    });
  }

  function showErrors(errors) {
    var firstField = null;
    Object.keys(errors).forEach(function (name) {
      var slot = errorSlot(name);
      if (slot) slot.textContent = errors[name];
      var input = form.querySelector('[name="' + name + '"]');
      if (input) {
        input.setAttribute('aria-invalid', 'true');
        if (!firstField) firstField = input;
      }
    });
    if (firstField) firstField.focus();
  }

  function setStatus(message, kind) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.toggle('form-status--error', kind === 'error');
  }

  /** Mirrors the server rules in src/server/enquiry.mjs — both must pass. */
  function validate(data) {
    var errors = {};
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Please tell us your name.';
    }
    var hasPhone = data.phone && data.phone.replace(/[^0-9]/g, '').length >= 7;
    var hasEmail = data.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim());
    if (data.email && !hasEmail) {
      errors.email = 'That email address does not look right.';
    }
    if (!hasPhone && !hasEmail) {
      errors.contact = 'Add a phone number or an email address so we can reply.';
    }
    return errors;
  }

  /** Human-readable enquiry, used for both the WhatsApp and email handoff. */
  function composeMessage(data) {
    // Phrased so it reads correctly whatever the brand name starts with.
    var brand = form.getAttribute('data-brand') || 'Website';
    var lines = [brand + ' — website enquiry', '', 'Name: ' + data.name];
    if (data.phone) lines.push('Phone: ' + data.phone);
    if (data.email) lines.push('Email: ' + data.email);
    if (data.location) lines.push('Location and plot size: ' + data.location);
    if (data.scope.length) lines.push('Scope: ' + data.scope.join(', '));
    if (data.message) lines.push('', data.message);
    return lines.join('\n');
  }

  function handOff(data) {
    var text = composeMessage(data);
    var whatsapp = form.getAttribute('data-whatsapp') || 'https://wa.me/917015535542';
    var email = form.getAttribute('data-email') || 'Support@theconstructionproject.in';

    // Opened from inside the submit handler, so it counts as a user gesture
    // and is not treated as a pop-up.
    var opened = window.open(whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');

    if (statusEl) {
      statusEl.classList.remove('form-status--error');
      statusEl.innerHTML =
        (opened
          ? 'WhatsApp is opening with your enquiry ready to send. '
          : 'Your browser blocked the WhatsApp window. ') +
        'Prefer email? <a href="mailto:' +
        email +
        '?subject=' +
        encodeURIComponent('Website enquiry — ' + data.name) +
        '&body=' +
        encodeURIComponent(text) +
        '">Send it by email instead</a>.';
    }
  }

  form.addEventListener('submit', function (event) {
    var formData = new FormData(form);
    var data = {
      name: formData.get('name') || '',
      phone: formData.get('phone') || '',
      email: formData.get('email') || '',
      location: formData.get('location') || '',
      message: formData.get('message') || '',
      company: formData.get('company') || '',
      rendered_at: formData.get('rendered_at') || '',
      scope: formData.getAll('scope'),
    };

    clearErrors();
    var errors = validate(data);
    if (Object.keys(errors).length) {
      event.preventDefault();
      showErrors(errors);
      setStatus('Please check the highlighted fields.', 'error');
      return;
    }

    // No backend on this host — hand the validated enquiry to WhatsApp.
    if (mode === 'handoff') {
      event.preventDefault();
      handOff(data);
      return;
    }

    // Only take over the submission if fetch is available.
    if (typeof window.fetch !== 'function') return;
    event.preventDefault();

    submitBtn.setAttribute('aria-disabled', 'true');
    submitBtn.disabled = true;
    setStatus('Sending…');

    window
      .fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      .then(function (response) {
        return response.json().then(function (body) {
          return { ok: response.ok, body: body };
        });
      })
      .then(function (result) {
        if (result.ok && result.body.ok) {
          form.reset();
          if (renderedAt) renderedAt.value = String(Date.now());
          setStatus('Thank you — we will call you back within a working day.');
          return;
        }
        if (result.body && result.body.errors) {
          showErrors(result.body.errors);
          setStatus('Please check the highlighted fields.', 'error');
          return;
        }
        throw new Error('unexpected response');
      })
      .catch(function () {
        setStatus(
          'That did not send. Please call +91 70155 35542 or email Support@theconstructionproject.in.',
          'error'
        );
      })
      .then(function () {
        submitBtn.removeAttribute('aria-disabled');
        submitBtn.disabled = false;
      });
  });

  // Clear a field's error as soon as the visitor edits it.
  form.addEventListener('input', function (event) {
    var name = event.target.name;
    if (!name) return;
    var slot = errorSlot(name);
    if (slot) slot.textContent = '';
    event.target.removeAttribute('aria-invalid');
    var contactSlot = errorSlot('contact');
    if (contactSlot && (name === 'phone' || name === 'email')) contactSlot.textContent = '';
  });
})();
