#!/usr/bin/env node
/**
 * Builds the static site into dist/.
 *
 * Every page is plain HTML with all content in the markup — no client-side
 * rendering, nothing that depends on JavaScript to be readable or crawlable.
 *
 * Run: npm run build
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { layout } from '../src/layouts/base.mjs';
import { url, absolute, base, origin, enquiryMode } from '../src/lib/config.mjs';
import { registerAsset } from '../src/lib/assets.mjs';
import { site } from '../src/data/site.mjs';
import { home } from '../src/pages/home.mjs';
import { projectsPage } from '../src/pages/projects.mjs';
import { companyPage } from '../src/pages/company.mjs';
import { contactPage, enquiryReceivedPage } from '../src/pages/contact.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(root, 'dist');

const pages = [home, projectsPage, companyPage, contactPage, enquiryReceivedPage];

/** Bundles: shared script first, then the page script. */
const bundles = {
  'site.js': ['site.js'],
  'home.js': ['site.js', 'slideshow.js', 'home.js'],
  'projects.js': ['site.js', 'projects.js'],
  'contact.js': ['site.js', 'contact.js'],
  // Company carries both the gallery slideshow and the enquiry form.
  'company.js': ['site.js', 'slideshow.js', 'contact.js'],
};

async function rimraf(dir) {
  await fs.rm(dir, { recursive: true, force: true });
}

async function copyDir(from, to) {
  await fs.cp(from, to, { recursive: true });
}

async function writeFile(relative, contents) {
  const target = path.join(DIST, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, contents, 'utf8');
}

/** Short content hash, so a changed file always gets a new URL. */
function contentHash(contents) {
  return crypto.createHash('sha256').update(contents).digest('hex').slice(0, 8);
}

/** Writes `assets/<name>.<hash>.<ext>` and maps the logical name to it. */
async function writeHashedAsset(name, ext, contents) {
  const actual = `assets/${name}.${contentHash(contents)}.${ext}`;
  await writeFile(actual, contents);
  registerAsset(`/assets/${name}.${ext}`, `/${actual}`);
}

async function buildStyles() {
  const styleDir = path.join(root, 'src', 'styles');
  const fontCss = await fs
    .readFile(path.join(styleDir, 'fonts.css'), 'utf8')
    .catch(() => {
      console.warn('  ! src/styles/fonts.css missing — run npm run fonts');
      return '';
    });
  const siteCss = await fs.readFile(path.join(styleDir, 'site.css'), 'utf8');
  await writeHashedAsset('site', 'css', `${fontCss}\n${siteCss}`);
}

async function buildScripts() {
  const scriptDir = path.join(root, 'src', 'scripts');
  for (const [outName, parts] of Object.entries(bundles)) {
    const sources = await Promise.all(
      parts.map((file) => fs.readFile(path.join(scriptDir, file), 'utf8'))
    );
    await writeHashedAsset(outName.replace(/\.js$/, ''), 'js', sources.join('\n'));
  }
}

function sitemap() {
  const urls = pages
    .filter((page) => !page.noindex)
    .map(
      (page) => `  <url>
    <loc>${absolute(page.path)}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function robots() {
  return `User-agent: *
Allow: /
Disallow: ${url('/enquiry-received/')}

Sitemap: ${absolute('/sitemap.xml')}
`;
}

/** A 404 built from the same shell, so a wrong URL still looks like the site. */
const notFoundPage = {
  // No nav key, so no nav item is marked current.
  page: '404',
  bodyClass: 'page--short',
  path: '/404.html',
  outFile: '404.html',
  title: 'Page not found — The Construction Project',
  description: 'That page does not exist.',
  scripts: ['/assets/site.js'],
  noindex: true,
  render: () => `
    <section class="page-head">
      <div class="shell">
        <div class="page-head-row">
          <h1 class="h1-page">404</h1>
          <span class="eyebrow">Page not found</span>
        </div>
        <span class="rule" aria-hidden="true"></span>
        <p class="lead-text" style="max-width:26ch">
          That drawing isn't in the set. Try the
          <a href="${url('/projects/')}">project index</a> or
          <a href="${url('/contact/')}">get in touch</a>.
        </p>
      </div>
    </section>
  `,
};

/**
 * The Studio page became Company when the practice repositioned. Static hosts
 * cannot issue a 301, so this stub keeps any shared /studio/ link working.
 */
async function writeRedirect(from, to) {
  const target = url(to);
  await writeFile(`${from.replace(/^\/|\/$/g, '')}/index.html`, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Moved — ${site.name}</title>
<meta name="robots" content="noindex" />
<link rel="canonical" href="${absolute(to)}" />
<meta http-equiv="refresh" content="0; url=${target}" />
</head>
<body style="background:#23211D;color:#EDE6D9;font-family:system-ui,sans-serif;padding:40px">
<p>This page moved to <a href="${target}" style="color:#C9A24A">${target}</a>.</p>
<script>location.replace(${JSON.stringify(target)});</script>
</body>
</html>
`);
  console.log(`  ✓ ${from} → ${to}`);
}

async function main() {
  const started = Date.now();
  await rimraf(DIST);
  await fs.mkdir(DIST, { recursive: true });

  await buildStyles();
  await buildScripts();

  for (const page of [...pages, notFoundPage]) {
    const markup = layout({
      page: page.page,
      title: page.title,
      description: page.description,
      path: page.path,
      body: page.render(),
      scripts: page.scripts,
      bodyClass: page.bodyClass,
    });
    const withRobots = page.noindex
      ? markup.replace('</title>', '</title>\n<meta name="robots" content="noindex" />')
      : markup;
    await writeFile(page.outFile, withRobots);
    console.log(`  ✓ ${page.outFile}`);
  }

  // Static assets: images, fonts, favicons, anything else in public/.
  await copyDir(path.join(root, 'public'), DIST);
  await fs.rm(path.join(DIST, 'images', 'manifest.json'), { force: true });

  await writeRedirect('/studio/', '/company/');

  await writeFile('sitemap.xml', sitemap());
  await writeFile('robots.txt', robots());

  console.log(
    `\nBuilt ${pages.length + 1} pages into dist/ in ${Date.now() - started}ms` +
      `\n  base path: ${base || '/'}` +
      `\n  origin:    ${origin}` +
      `\n  enquiry:   ${enquiryMode}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
