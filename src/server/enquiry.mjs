/**
 * Enquiry handling: validation, spam checks and delivery.
 *
 * Deliberately host-agnostic — `handleEnquiry()` takes a plain object and
 * returns a plain result, so the same module backs the local dev server, a
 * Netlify/Vercel function, or any Node server. See docs/BUILD-NOTES.md for
 * deployment.
 *
 * Delivery: if RESEND_API_KEY is set, the enquiry is emailed to
 * ENQUIRY_TO (default arspace1@gmail.com). Otherwise it is appended to
 * enquiries.log so nothing is ever silently dropped in development.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const TO = process.env.ENQUIRY_TO || 'arspace1@gmail.com';
const FROM = process.env.ENQUIRY_FROM || 'The Construction Project <enquiries@theconstructionproject.example>';
const LOG_FILE = path.join(root, 'enquiries.log');

/** Minimum seconds between the form rendering and it being submitted. */
const MIN_FILL_SECONDS = 3;
/** Max submissions accepted from one IP per window. */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

const seen = new Map();

function rateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const hits = (seen.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  hits.push(now);
  seen.set(ip, hits);
  return hits.length > RATE_LIMIT.max;
}

function str(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Server-side validation. Mirrors src/scripts/contact.js — never trust the
 * client copy.
 */
export function validateEnquiry(input) {
  const data = {
    name: str(input.name),
    phone: str(input.phone),
    email: str(input.email),
    location: str(input.location),
    message: str(input.message),
    scope: Array.isArray(input.scope) ? input.scope.map(str).filter(Boolean) : [str(input.scope)].filter(Boolean),
  };

  const errors = {};

  if (data.name.length < 2) errors.name = 'Please tell us your name.';
  if (data.name.length > 120) errors.name = 'That name is too long.';

  const hasPhone = data.phone.replace(/[^0-9]/g, '').length >= 7;
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email);

  if (data.email && !hasEmail) errors.email = 'That email address does not look right.';
  if (!hasPhone && !hasEmail) {
    errors.contact = 'Add a phone number or an email address so we can reply.';
  }
  if (data.message.length > 4000) errors.message = 'Please keep the message under 4000 characters.';

  return { ok: Object.keys(errors).length === 0, errors, data };
}

function looksLikeSpam(input) {
  // Honeypot: real people never see this field.
  if (str(input.company)) return true;

  // Submitted implausibly fast after render.
  const renderedAt = Number(input.rendered_at);
  if (renderedAt && Date.now() - renderedAt < MIN_FILL_SECONDS * 1000) return true;

  // Link-stuffed message bodies.
  const links = (str(input.message).match(/https?:\/\//g) || []).length;
  if (links >= 3) return true;

  return false;
}

function formatEnquiry(data, meta) {
  return [
    `Name:     ${data.name}`,
    `Phone:    ${data.phone || '—'}`,
    `Email:    ${data.email || '—'}`,
    `Location: ${data.location || '—'}`,
    `Scope:    ${data.scope.length ? data.scope.join(', ') : '—'}`,
    '',
    data.message || '(no message)',
    '',
    `Received: ${meta.receivedAt}`,
    `Source:   ${meta.ip || 'unknown'}`,
  ].join('\n');
}

async function deliver(data, meta) {
  const body = formatEnquiry(data, meta);

  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: data.email || undefined,
        subject: `Website enquiry — ${data.name}`,
        text: body,
      }),
    });
    if (!response.ok) {
      throw new Error(`Email delivery failed: ${response.status} ${await response.text()}`);
    }
    return 'email';
  }

  await fs.appendFile(LOG_FILE, `\n=== enquiry ===\n${body}\n`, 'utf8');
  return 'log';
}

/**
 * @returns {{status:number, ok:boolean, errors?:object, message?:string}}
 */
export async function handleEnquiry(input, meta = {}) {
  if (rateLimited(meta.ip)) {
    return {
      status: 429,
      ok: false,
      message: 'Too many enquiries from this connection. Please call the studio instead.',
    };
  }

  // Silently accept spam — telling a bot it failed only teaches it.
  if (looksLikeSpam(input)) {
    return { status: 200, ok: true, message: 'Thank you — we will call you back within a working day.' };
  }

  const { ok, errors, data } = validateEnquiry(input);
  if (!ok) return { status: 422, ok: false, errors };

  try {
    const via = await deliver(data, { ...meta, receivedAt: new Date().toISOString() });
    return {
      status: 200,
      ok: true,
      via,
      message: 'Thank you — we will call you back within a working day.',
    };
  } catch (error) {
    console.error('[enquiry] delivery failed:', error);
    return {
      status: 502,
      ok: false,
      message: 'That did not send. Please call +91 94676 29425 or email arspace1@gmail.com.',
    };
  }
}
