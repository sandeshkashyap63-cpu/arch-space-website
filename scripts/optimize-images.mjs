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

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const manifest = {};

  for (const image of clientImages) {
    const src = path.join(SRC_DIR, image.source);
    try {
      await fs.access(src);
    } catch {
      console.warn(`  ! missing source, skipped: ${image.source}`);
      continue;
    }

    const { width, height } = await dimensions(src);
    const base = image.file.replace(/\.jpe?g$/i, '');
    // Never upscale, and never ship more than the largest useful width — the
    // widest slot on the page is ~700 CSS px, so 2000 covers it beyond 2×.
    const widths = WIDTHS.filter((w) => w <= width);
    if (widths.length === 0) widths.push(width);
    const ratio = height / width;

    for (const w of widths) {
      for (const format of FORMATS) {
        await derive(src, path.join(OUT_DIR, `${base}-${w}.${format}`), w, format, JPEG_QUALITY);
      }
    }

    manifest[image.file] = {
      base,
      alt: image.alt,
      width,
      height,
      widths,
      formats: FORMATS,
      // Height/width of the source, so <img> can carry a correct intrinsic ratio.
      aspect: Number(ratio.toFixed(4)),
    };
    console.log(
      `  ✓ ${image.file}  ${width}×${height}  →  ${widths.length} widths × ${FORMATS.length} format(s)`
    );
  }

  await fs.writeFile(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  console.log(`\nWrote ${Object.keys(manifest).length} entries to public/images/manifest.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
