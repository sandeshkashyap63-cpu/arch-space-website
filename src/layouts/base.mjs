/**
 * Page shell: <head>, header, footer, fixed contact rail.
 * Every page is rendered through this.
 */
import { html, raw, attr } from '../lib/html.mjs';
import { site, nav } from '../data/site.mjs';
import { url, absolute, origin } from '../lib/config.mjs';
import { asset } from '../lib/assets.mjs';

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
    <link rel="stylesheet" href="${url(asset('/assets/site.css'))}" />
    <script>
      document.documentElement.classList.add('js');
    </script>
    ${scripts.map((src) => html`<script src="${url(asset(src))}" defer></script>`)}
  `;
}

function header({ page }) {
  const isHome = page === 'home';
  return html`
    <header
      class="site-header${raw(isHome ? ' site-header--home' : '')}"
      data-header${attr('data-home', isHome || null)}
    >
      <a class="wordmark" href="${url('/')}" aria-label="${site.name} — home">
        ${site.nameLines.map((line) => html`<span class="wordmark-line">${line}</span>`)}
      </a>
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
            : raw(`${site.coverageLong} · <a href="mailto:${site.email}">${site.email}</a>`)}
        </span>
      </div>
    </footer>
  `;
}

/**
 * The WhatsApp mark, inline so it costs no request and inherits the button's
 * colour. The handoff specified a text "WA" label and no icon library; this is
 * the one exception, because the brand mark is what people actually look for
 * on a click-to-chat button.
 */
function whatsappMark() {
  return html`<svg
    class="rail-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    role="presentation"
  >
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
    />
  </svg>`;
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
      >
        ${whatsappMark()}
      </a>
      <a class="rail-btn rail-btn--call" href="${site.phone.tel}" aria-label="Call the office"
        >Call</a
      >
    </div>
  `;
}

/** Organisation schema — one block, emitted on every page. */
function structuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: site.name,
    description:
      'Construction, interiors, turnkey projects, renovation and landscape, on sites across India.',
    url: absolute('/'),
    telephone: site.phone.display,
    email: site.email,
    areaServed: { '@type': 'Country', name: site.country },
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
