/**
 * Page shell: <head>, header, footer, fixed contact rail.
 * Every page is rendered through this.
 */
import { html, raw, attr } from '../lib/html.mjs';
import { site, nav } from '../data/site.mjs';
import { url, absolute, origin } from '../lib/config.mjs';

function head({ title, description, canonical, page, scripts }) {
  return html`
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="theme-color" content="#23211D" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${absolute('/images/hero-04-1440.jpeg')}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="${url('/favicon.svg')}" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${url('/apple-touch-icon.png')}" />

    <!-- Self-hosted fonts: preload the two faces used above the fold. -->
    <link
      rel="preload"
      href="${url('/fonts/jost-400-latin.woff2')}"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="${url('/fonts/cormorant-garamond-300-latin.woff2')}"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link rel="stylesheet" href="${url('/assets/site.css')}" />
    <script>
      document.documentElement.classList.add('js');
    </script>
    ${scripts.map((src) => html`<script src="${url(src)}" defer></script>`)}
  `;
}

function header({ page }) {
  const isHome = page === 'home';
  return html`
    <header
      class="site-header${raw(isHome ? ' site-header--home' : '')}"
      data-header${attr('data-home', isHome || null)}
    >
      <a class="wordmark" href="${url('/')}">${site.name}</a>
      <div class="header-right">
        <nav class="site-nav" id="site-nav" aria-label="Primary">
          <ul>
            ${nav.map(
              (item) => html`<li>
                <a
                  class="nav-link${raw(page === item.key ? ' is-current' : '')}"
                  href="${url(item.href)}"${attr('aria-current', page === item.key ? 'page' : null)}
                  >${item.label}</a
                >
              </li>`
            )}
          </ul>
        </nav>
        <a class="nav-phone" href="${site.phone.tel}">${site.phone.display}</a>
        <button
          class="nav-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="site-nav"
          data-nav-toggle
        >
          <span>Menu</span>
          <span class="nav-toggle-bars" aria-hidden="true"></span>
        </button>
      </div>
    </header>
  `;
}

function footer({ page }) {
  const isHome = page === 'home';
  return html`
    <footer class="site-footer${raw(isHome ? ' site-footer--home' : '')}">
      <div class="shell">
        <span class="footer-mark">${site.name}</span>
        <span class="footer-meta">
          ${isHome
            ? site.copyright
            : raw(`${site.cities} · <a href="mailto:${site.email}">${site.email}</a>`)}
        </span>
      </div>
    </footer>
  `;
}

function contactRail() {
  return html`
    <div class="contact-rail">
      <a
        class="rail-btn rail-btn--wa"
        href="${site.phone.whatsapp}"
        aria-label="Chat on WhatsApp"
        rel="noopener"
        target="_blank"
        >WA</a
      >
      <a class="rail-btn rail-btn--call" href="${site.phone.tel}" aria-label="Call the studio"
        >Call</a
      >
    </div>
  `;
}

/** Organisation schema — one block, emitted on every page. */
function structuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ArchitecturalService',
    name: site.name,
    description:
      'Architecture, interiors, 3D visualisation, valuation and landscape practice in Jagadhri, Haryana and Chandigarh.',
    url: absolute('/'),
    telephone: site.phone.display,
    email: site.email,
    founder: { '@type': 'Person', name: site.principal },
    foundingDate: String(site.established),
    areaServed: ['Jagadhri', 'Yamunanagar', 'Chandigarh', 'Ambala', 'Haryana'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    openingHours: 'Mo-Sa 10:00-19:00',
    knowsAbout: site.disciplines,
  };
  return html`<script type="application/ld+json">
    ${raw(JSON.stringify(data))}
  </script>`;
}

export function layout({
  page,
  title,
  description,
  path: pagePath,
  body,
  scripts = [],
  bodyClass = '',
}) {
  const canonical = absolute(pagePath);
  return `<!doctype html>
<html lang="en">
<head>
${head({ title, description, canonical, page, scripts })}
${structuredData()}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="page page--${page}${bodyClass ? ` ${bodyClass}` : ''}">
${header({ page })}
<main id="main">
${body}
</main>
${footer({ page })}
${contactRail()}
</div>
</body>
</html>
`;
}
