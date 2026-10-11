/**
 * Build-time configuration, all overridable by environment variable so the
 * same source builds for a root domain, a GitHub Pages sub-path, or a preview.
 *
 *   BASE_PATH         URL prefix the site is served under. "" for a root
 *                     domain, "/arch-space-website" for GitHub Pages.
 *   SITE_ORIGIN       Absolute origin used for canonical URLs, Open Graph and
 *                     the sitemap.
 *   CUSTOM_DOMAIN     Apex domain to publish under, e.g.
 *                     "theconstructionproject.in". Writes dist/CNAME.
 *   ENQUIRY_MODE      "api"     — form posts to ENQUIRY_ENDPOINT (needs a
 *                                 runtime; this is the real production mode).
 *                     "handoff" — no backend available (static hosts such as
 *                                 GitHub Pages): the form validates, then hands
 *                                 the enquiry to WhatsApp with email as backup.
 *   ENQUIRY_ENDPOINT  Where "api" mode posts. Default /api/enquiry.
 */

const trimTrailing = (value) => String(value ?? '').replace(/\/+$/, '');

/** e.g. "/arch-space-website" or "" — never a trailing slash. */
export const base = trimTrailing(process.env.BASE_PATH || '');

export const origin = trimTrailing(
  process.env.SITE_ORIGIN || 'https://www.theconstructionproject.in'
);

/* Set when publishing to a custom domain. The build writes it to dist/CNAME,
   which is what keeps GitHub Pages pointed at the domain — the deploy replaces
   the whole gh-pages branch, so a CNAME added through the GitHub UI would be
   wiped by the next deploy and the domain would silently disconnect. */
export const customDomain = (process.env.CUSTOM_DOMAIN || '').trim();

export const enquiryMode = process.env.ENQUIRY_MODE === 'handoff' ? 'handoff' : 'api';

export const enquiryEndpoint = process.env.ENQUIRY_ENDPOINT || '/api/enquiry';

/** Prefixes a site-absolute path with the base path. */
export function url(path) {
  if (!path.startsWith('/')) return path;
  return `${base}${path}`;
}

/** Absolute URL, for canonical/OG/sitemap. */
export function absolute(path) {
  return `${origin}${url(path)}`;
}
