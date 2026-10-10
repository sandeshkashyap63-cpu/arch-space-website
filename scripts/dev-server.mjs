#!/usr/bin/env node
/**
 * Local server for dist/ — serves the static build, handles POST /api/enquiry,
 * and rebuilds on demand.
 *
 * Run: npm run dev   (http://localhost:4321)
 *
 * In production the static files go to any host; only /api/enquiry needs a
 * runtime. See docs/BUILD-NOTES.md.
 */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleEnquiry } from '../src/server/enquiry.mjs';
import { base } from '../src/lib/config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(root, 'dist');
const PORT = Number(process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function readBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > limit) {
        reject(new Error('body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function parseBody(raw, contentType = '') {
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  const params = new URLSearchParams(raw);
  const out = {};
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    out[key] = key === 'scope' ? values : values[0];
  }
  return out;
}

/** The stylesheet is content-hashed, so find it rather than guessing a name. */
async function stylesheetHref() {
  try {
    const files = await fs.readdir(path.join(DIST, 'assets'));
    const css = files.find((f) => /^site\..+\.css$/.test(f));
    if (css) return `${base}/assets/${css}`;
  } catch {
    // fall through
  }
  return `${base}/assets/site.css`;
}

/** No-JS error response, styled with the site's own stylesheet. */
function errorPage(result, cssHref) {
  const items = result.errors
    ? Object.values(result.errors)
        .map((message) => `<li>${message}</li>`)
        .join('')
    : `<li>${result.message || 'Something went wrong.'}</li>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Check your enquiry — The Construction Project</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<link rel="stylesheet" href="${cssHref}"></head>
<body><div class="page page--contact"><main id="main">
<section class="contact-board"><div class="shell">
<div class="page-head-row"><h1 class="h1-page">Almost</h1><span class="eyebrow">Enquiry not sent</span></div>
<span class="rule"></span>
<ul class="form-note" style="display:flex;flex-direction:column;gap:8px">${items}</ul>
<p><a class="btn btn--bronze" href="${base}/contact/">Back to the form</a></p>
</div></section></main></div></body></html>
`;
}

/** Strips the configured base path so a sub-path build serves locally too. */
function withoutBase(pathname) {
  if (!base) return pathname;
  if (pathname === base) return '/';
  return pathname.startsWith(base + '/') ? pathname.slice(base.length) : pathname;
}

async function serveStatic(req, res, url) {
  const pathname = withoutBase(url.pathname);
  let filePath = path.join(DIST, decodeURIComponent(pathname));
  if (pathname.endsWith('/')) filePath = path.join(filePath, 'index.html');

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch {
    // fall through to the 404 below
  }

  // Keep everything inside dist/.
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    const type = TYPES[path.extname(filePath)] || 'application/octet-stream';
    // Dev server: never cache, so a rebuild is always what you see. Production
    // caching headers are the host's job (see docs/BUILD-NOTES.md).
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    const notFound = await fs.readFile(path.join(DIST, '404.html')).catch(() => 'Not found');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(notFound);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'POST' && withoutBase(url.pathname) === '/api/enquiry') {
    let raw;
    try {
      raw = await readBody(req);
    } catch {
      res.writeHead(413).end('Payload too large');
      return;
    }

    const input = parseBody(raw, req.headers['content-type'] || '');
    const wantsJson = (req.headers.accept || '').includes('application/json');
    const result = await handleEnquiry(input, {
      ip: req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    if (wantsJson) {
      res.writeHead(result.status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
      return;
    }

    if (result.ok) {
      res.writeHead(303, { Location: `${base}/enquiry-received/` }).end();
      return;
    }

    res.writeHead(result.status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(errorPage(result, await stylesheetHref()));
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end('Method not allowed');
    return;
  }

  await serveStatic(req, res, url);
});

server.listen(PORT, () => {
  console.log(`The Construction Project → http://localhost:${PORT}${base}/`);
  console.log(
    process.env.RESEND_API_KEY
      ? '  Enquiries will be emailed via Resend.'
      : '  No RESEND_API_KEY set — enquiries are appended to enquiries.log.'
  );
});
