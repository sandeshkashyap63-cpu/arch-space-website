#!/usr/bin/env node
/**
 * Derives responsive JPEG variants from the client's photography in
 * design/uploads/ and writes them to public/images/, alongside a manifest
 * (public/images/manifest.json) carrying intrinsic dimensions so the build can
 * emit width/height attributes and avoid layout shift.
 *
 * Uses macOS `sips`, which ships with the OS — no npm dependencies.
 *
 * NOTE — why no AVIF/WebP yet:
 *   `sips -s format avif` produces files that Chromium decodes to a *blank*
 *   bitmap above ~1024px wide (verified: 480/768/1024 fine, 1440/2000 render
 *   nothing, while the same source as JPEG is fine). Apple's encoder appears
 *   to emit a tiled/grid AVIF that Chromium will not paint. Shipping those
 *   would mean invisible photography in Chrome, so this step emits JPEG only.
 *   To add modern formats, install a real encoder in CI — `sharp`,
 *   `avifenc` (libavif) or `cwebp` — emit `<basename>-<width>.avif`, add
 *   "avif" to the manifest's `formats`, and restore the <source> element in
 *   src/lib/html.mjs. Nothing else needs to change.
 *
 * Run: npm run images
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { clientImages } from '../src/data/images.mjs';

const exec = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(root, 'design', 'uploads');
const OUT_DIR = path.join(root, 'public', 'images');
/* Drop-folder for the client's own site photographs — everything in here is
   picked up automatically, no code change needed. See photos/work/README.md. */
const GALLERY_DIR = path.join(root, 'photos', 'work');
/* HEIC/HEIF included because that is what iPhones produce, and no browser
   except Safari can display it — sips decodes it and we ship JPEG. */
const GALLERY_EXT = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif']);
/* The gallery frame is capped at ~864 CSS px, so 1440 already covers it at 2x;
   a 2000px variant per photograph is dead weight across two dozen of them. */
const GALLERY_MAX_WIDTH = 1440;

/** Widths to emit. A source narrower than a width is skipped, never upscaled. */
const WIDTHS = [480, 768, 1024, 1440, 2000];
const JPEG_QUALITY = 72;
/** Formats written for every width. See the AVIF note above. */
const FORMATS = ['jpeg'];

async function dimensions(file) {
  const { stdout } = await exec('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file]);
  const width = Number(/pixelWidth:\s*(\d+)/.exec(stdout)?.[1]);
  const height = Number(/pixelHeight:\s*(\d+)/.exec(stdout)?.[1]);
  if (!width || !height) throw new Error(`Could not read dimensions of ${file}`);
  return { width, height };
}

async function derive(src, out, width, format, quality) {
  await exec('sips', [
    '-s', 'format', format,
    '-s', 'formatOptions', String(quality),
    '--resampleWidth', String(width),
    src,
    '--out', out,
  ]);
}

/** Processes one source file into every width, returning its manifest entry. */
async function processImage(src, base, alt, maxWidth = Infinity) {
  const { width, height } = await dimensions(src);
  // Never upscale, and never ship more than the largest useful width — the
  // widest slot on the page is ~700 CSS px, so 2000 covers it beyond 2×.
  const widths = WIDTHS.filter((w) => w <= width && w <= maxWidth);
  if (widths.length === 0) widths.push(width);

  for (const w of widths) {
    for (const format of FORMATS) {
      await derive(src, path.join(OUT_DIR, `${base}-${w}.${format}`), w, format, JPEG_QUALITY);
    }
  }

  console.log(
    `  ✓ ${base}  ${width}×${height}  →  ${widths.length} widths × ${FORMATS.length} format(s)`
  );
  return {
    base,
    alt,
    width,
    height,
    widths,
    formats: FORMATS,
    // Height/width of the source, so <img> can carry a correct intrinsic ratio.
    aspect: Number((height / width).toFixed(4)),
  };
}

/**
 * "03-sector-17-slab-pour.jpeg" -> "Sector 17 slab pour".
 *
 * Camera filenames (IMG_4900, DSC_012) and export UUIDs carry no meaning, so
 * they fall back to a plain description rather than reading a serial number
 * out to someone on a screen reader. Renaming the file in photos/work/ is what
 * turns that into a real caption.
 */
function altFromFileName(fileName, index) {
  const raw = path.basename(fileName, path.extname(fileName));
  const compact = raw.replace(/[-_\s]/g, '');
  const meaningless =
    /^(img|dsc|dscn|photo|image|pxl|screenshot)[-_\s]*[\d\s]*$/i.test(raw) ||
    (/^[0-9a-f]+$/i.test(compact) && compact.length >= 12);

  if (meaningless) return `Construction site photograph ${index}`;

  const words = raw.replace(/^\d+[-_\s]*/, '').replace(/[-_]+/g, ' ').trim();
  if (!words) return `Construction site photograph ${index}`;
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Every image in the drop-folder, in filename order (numeric-aware). */
async function galleryFiles() {
  let entries;
  try {
    entries = await fs.readdir(GALLERY_DIR);
  } catch {
    return [];
  }
  return entries
    .filter((name) => GALLERY_EXT.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const images = {};

  for (const image of clientImages) {
    const src = path.join(SRC_DIR, image.source);
    try {
      await fs.access(src);
    } catch {
      console.warn(`  ! missing source, skipped: ${image.source}`);
      continue;
    }
    images[image.file] = await processImage(src, image.file.replace(/\.jpe?g$/i, ''), image.alt);
  }

  const gallery = [];
  const files = await galleryFiles();
  console.log(`\n  photos/work/ — ${files.length} photograph(s)`);
  for (const [i, fileName] of files.entries()) {
    const key = `gallery-${String(i + 1).padStart(2, '0')}.jpeg`;
    images[key] = await processImage(
      path.join(GALLERY_DIR, fileName),
      key.replace(/\.jpe?g$/i, ''),
      altFromFileName(fileName, i + 1),
      GALLERY_MAX_WIDTH
    );
    gallery.push(key);
  }

  await fs.writeFile(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify({ images, gallery }, null, 2) + '\n'
  );
  console.log(
    `\nWrote ${Object.keys(images).length} entries (${gallery.length} in the gallery) to public/images/manifest.json`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
