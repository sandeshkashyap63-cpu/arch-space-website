/**
 * Tiny HTML helpers for the build. No template engine, no dependencies.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { url } from './config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Escapes text for interpolation into markup. */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const RAW = Symbol('raw');

/**
 * Tagged template that escapes interpolations by default. Arrays are joined,
 * `null`/`undefined`/`false` render as nothing, and values wrapped in `raw()`
 * pass through untouched.
 *
 * Returns a raw-marked value so templates nest without double-escaping;
 * `String(...)` (or plain interpolation) turns one back into markup.
 */
export function html(strings, ...values) {
  const out = strings.reduce((acc, chunk, i) => {
    if (i === 0) return chunk;
    return acc + render(values[i - 1]) + chunk;
  }, '');
  return raw(out);
}

export function raw(value) {
  return {
    [RAW]: String(value),
    toString() {
      return this[RAW];
    },
  };
}

function render(value) {
  if (value === null || value === undefined || value === false) return '';
  if (Array.isArray(value)) return value.map(render).join('');
  if (typeof value === 'object' && RAW in value) return value[RAW];
  return esc(value);
}

/** Conditional attribute helper: attr('id', maybeUndefined). */
export function attr(name, value) {
  if (value === null || value === undefined || value === false) return raw('');
  if (value === true) return raw(` ${name}`);
  return raw(` ${name}="${esc(value)}"`);
}

/* ---- Images ------------------------------------------------------------ */

let manifest = {};
const manifestPath = path.join(root, 'public', 'images', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

/**
 * Client photography: a responsive JPEG srcset with intrinsic width/height so
 * nothing shifts while it loads.
 *
 * When a real AVIF/WebP encoder is added (see scripts/optimize-images.mjs),
 * wrap this in <picture> and emit a <source> per extra format in
 * `entry.formats`.
 */
export function localImage({
  file,
  alt,
  sizes = '100vw',
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  className,
}) {
  const entry = manifest[file];
  if (!entry) {
    // Build-time signal rather than a silent broken image.
    console.warn(`  ! no image manifest entry for "${file}" — run npm run images`);
    return html`<img src="${url(`/images/${file}`)}" alt="${alt}" loading="${loading}" />`;
  }

  const set = (ext) =>
    entry.widths.map((w) => `${url(`/images/${entry.base}-${w}.${ext}`)} ${w}w`).join(', ');
  const fallbackWidth = entry.widths.includes(1024) ? 1024 : entry.widths[entry.widths.length - 1];

  return html`<img
    src="${url(`/images/${entry.base}-${fallbackWidth}.jpeg`)}"
    srcset="${set('jpeg')}"
    sizes="${sizes}"
    width="${entry.width}"
    height="${entry.height}"
    alt="${alt ?? entry.alt}"
    loading="${loading}"
    decoding="${decoding}"${attr('fetchpriority', fetchPriority)}${attr('class', className)}
  />`;
}

/**
 * Stock placeholder photography (Pexels), referenced by absolute URL and
 * marked so it is easy to find and replace. See docs/BUILD-NOTES.md.
 */
export function remoteImage({ src, alt, sizes = '100vw', loading = 'lazy', widths = [600, 900, 1200, 1600] }) {
  const srcset = widths.map((w) => `${src}&w=${w} ${w}w`).join(', ');
  return html`<img
    src="${`${src}&w=1200`}"
    srcset="${srcset}"
    sizes="${sizes}"
    alt="${alt}"
    loading="${loading}"
    decoding="async"
    data-placeholder-photo
  />`;
}
