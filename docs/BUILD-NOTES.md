# The Construction Project — build notes

Implementation record for the site built from `README.md` (the design handoff).
Covers the stack choice, every deliberate deviation from the prototype, how to
run and deploy it, and what is still outstanding.

---

## Contact details and coverage

Phone **+91 70155 35542**, email **Support@theconstructionproject.in**, both set
once in `src/data/site.mjs` and used everywhere — header, contact rail,
footer, forms, structured data, and the fallback strings in `contact.js` and
`enquiry.mjs` that run when the markup cannot be read.

**There is no address anywhere on the site.** The company has no premises yet,
so nothing claims one: the `address` object is gone from the data, the Contact
and Company pages show "Where we work · Projects across India" in its place,
and the JSON-LD carries `areaServed: India` with no `PostalAddress`. Add an
`address` object back to `site.mjs` and restore the PostalAddress when there is
a real office to publish.

"Jagadhri & Chandigarh" is replaced throughout by `site.coverage` /
`site.coverageLong` — the company works pan-India. Two places still name those
towns, both deliberately: the client testimonials, which describe where those
customers' jobs actually were. Changing them would misreport what the customers
said.

The default `SITE_ORIGIN` is now `https://www.theconstructionproject.in`,
inferred from the email domain. The GitHub Pages build still overrides it.

## Brand name

The practice is **The Construction Project**. It was originally handed over as
"Arch Space" — the handoff document in `README.md` and the prototypes in
`design/` still use the old name, deliberately, because they are the historical
brief rather than live content. Everything the site renders, and every file the
build touches, carries the new name.

The name is set once, in `src/data/site.mjs`:

```js
name: 'The Construction Project',
nameLines: ['The Construction', 'Project'],
```

`nameLines` is the wordmark lockup. Renaming again means editing those two
fields (plus the page titles and meta descriptions, which are written per page
for SEO rather than generated).

The old name also survives in `README.md` and `design/` — see "Brand name"
above — and in the repository/URL slug `arch-space-website`.

### What the longer name changed

Twenty-four tracked characters do not behave like ten, so three pieces of
typography were re-cut. None of the tokens — colours, tracking ratios, motion
timings — changed.

- **Hero h1** is now a two-line lockup ("The Construction" / "Project") at
  `clamp(26px, 5vw, 78px)` instead of one line at `clamp(34px, 6.4vw, 104px)`.
  One line would have needed roughly 2000px at the old size. The signature
  letter-spacing entrance survives, driven by `--track-from` / `--track-to`
  custom properties so each breakpoint can set its own range; each line is
  `white-space: nowrap`, so the wide opening frame is clipped by the hero
  rather than re-wrapping mid-animation.
- **Below 520px** the h1 tightens to `0.2em` tracking at `clamp(18px, 5.6vw, 30px)`.
  Measured: at 320px the longest line renders 239px inside a 252px gutter;
  at 390px, 291px inside 322px. Wide tracking at small sizes is poor practice
  anyway, so this reads better as well as fitting.
- **Wordmark** is a flex lockup that sits on one line on wide screens and
  stacks to two below 620px, shrinking to 10px/0.24em below 430px. The mobile
  nav breakpoint moved from 760px to 900px, because the longer wordmark plus
  four nav items crowds earlier than the old name did.

Verified with no horizontal overflow at 1920, 1440, 1200, 1024, 900, 760, 620,
430, 390, 360 and 320px.

---

## Repositioning: architecture practice → construction company

The handoff described an architecture, interiors, 3D visualisation, valuation
and landscape practice fronted by a named principal. The business is now a
construction company, so the copy was rewritten rather than relabelled.

| Was | Now |
|---|---|
| Services: Architecture · Interiors · 3D Visualisation · Valuation · Landscape | Construction · Interiors · Turnkey Projects · Renovation · Landscape |
| Hero eyebrow "Architects · Interiors · Valuers · Landscape" | "Construction · Interiors · Turnkey · Landscape" |
| Hero callouts "Concept" / "Section a—a" | "Structure" / "Programme" |
| Lead: "Drawings, renders, valuation and site work…" | "Foundations, structure, finishes and handover — built…" |
| Stats: 140+ delivered · 15 years in practice · 05 disciplines | 140+ delivered · **30+ years on site** · 05 trades |
| Project filters: Architecture / Interiors / Visualisation / Landscape | Residential / Commercial / Interiors / Landscape |
| "Studio" page at `/studio/` | "Company" page at `/company/` |
| "Five desks, one studio" | "Five trades, one contract" |
| Form scope: Architecture / 3D / Valuation … | Construction / Interiors / Turnkey / Renovation / Landscape |
| JSON-LD `ArchitecturalService` | `GeneralContractor` |
| "Index · 09 works" | "Index · 09 projects" |
| "Call the studio" / "reached the studio" | "Call the office" / "reached the office" |
| Carousel label "Studio work" | "Project work" |
| `studio-site.jpeg`, `.studio-board`, `.studio-lead` … | `office-site.jpeg`, `.company-board`, `.lead-text` … |

The word "studio" no longer appears anywhere in the build — markup, class
names, filenames or comments.

`/studio/` still resolves: the build writes a redirect stub there, since a
static host cannot issue a 301 and the old URL may already be shared.

### The home page's "On site" slider

The Awards & press block on the home page — a photograph beside two
architecture-era credentials — is replaced by an auto-advancing slider of the
company's own site photographs. The same block still exists on the Company
page, where the credentials are in their proper context.

`src/scripts/slideshow.js` now drives every `[data-slideshow]` on a page rather
than the single hero instance it started as, so the hero board and the gallery
share one implementation: cross-fade, progress buttons, pause on hover, on
keyboard focus and while the tab is hidden, and no auto-advance at all under
`prefers-reduced-motion` (the manual controls still work there). Per-instance
timing comes from `data-interval`; the gallery runs at 4200ms against the
hero's 5200ms.

The frame is height-capped and centred rather than full-bleed. At 1400px a
full-width 16:10 frame is 850px tall — it swallowed the viewport and cropped a
portrait photograph into a close-up. Capping the width to height × 1.6 keeps it
a showcase. On phones it switches to 4:3, since a 16:10 letterbox is barely
200px tall there.

### The Company page

Sections, in order: **Why choose us**, **How we work**, Capabilities, Awards &
press, and an **enquiry form** that closes the page.

The page opens on the nine differentiators the client dictated (`reasons` in
`src/data/site.mjs`) in place of the old hero lead. They are set as a ruled
spec list beside the director photograph — deliberately *not* a numbered grid,
because "How we work" directly below already uses one and two numbered grids
back to back would read as the same section twice. The photograph stays because
it backs the first claim: a qualified engineer at a drawing board is the
argument against "a thekedar working without technical training".

Two phrases are the client's own and were kept rather than smoothed into
neutral English — "thekedar" and "desi jugaad". They speak directly to the
local market and lose their force in translation.

The Team section was removed at the client's request — it carried two "Portrait
to follow" placeholders. `src/data/team.mjs` went with it rather than sitting
unused — `git log --diff-filter=D -- src/data/team.mjs` finds the commit that
removed it if the roles are wanted back once portraits arrive. The site-supervisor photograph only
appeared there, so it is no longer put through the image pipeline — the source
file stays in `design/uploads/` and `src/data/images.mjs` records how to
restore it.

### The enquiry form appears twice

The form is one component, `src/components/enquiry-form.mjs`, rendered by both
Contact and Company, so the two cannot drift. Each page renders exactly one
form, so field ids stay unique within a document.

Two options matter:

- `fallbackAction` — only reached in handoff mode without JavaScript, which the
  `<noscript>` block hides anyway. It points at the page's own URL so a stray
  submit reloads rather than 405s on a static host.
- `headingLevel` — 2 on Contact, where the form title is the section's own
  heading; 3 on Company, where it sits inside a section already headed "Build
  with us". Keeps the document outline correct.

The Company page loads `/assets/contact.js` rather than `/assets/site.js`,
since that bundle carries the form behaviour on top of the shared script.
Verified end to end from `/company/`: empty submit blocks with inline errors,
a valid submit reaches the server and clears the form without navigating.

### The process section

The Company page leads with **How we work** — the six stages the client
described, from enquiry to handover:

| | | |
|---|---|---|
| 01 Enquiry | 02 Site visit | 03 Drawings |
| 04 Quotation | 05 Agreement | 06 We build |

Content lives in `process` in `src/data/site.mjs`; add or remove a step and the
numbering and layout follow. It reuses the Statement section's stat-block motif
— hairline above, display numeral, letterspaced label — so a brand-new section
still reads as part of the same drawing, with a 22px bronze tick on each rule
echoing the hero's slide indicator.

The grid is explicit (3 / 2 / 1 columns) rather than `auto-fit` like the rest of
the site: six steps auto-fitting to four columns leaves an orphan row of two,
and a numbered sequence should break evenly.

### The named principal

Every reference to the principal architect was removed at the client's request
— the Studio credit, the footer copyright, the JSON-LD `founder`, image alt
text and the image filenames (`principal-architect.jpeg` →
`project-director.jpeg`). Team cards now carry **roles rather than names**,
which is also the safer pattern while two portraits are outstanding. The
client's own photographs stay in place.

"Mangla Flagship" remains in the project list — that is the name of a project,
not a person.

### Judgement calls that need the client's confirmation

1. **Testimonials — four of six are not rendered.** They sold 3D renders, a
   valuation report and a walkthrough video, or praised whoever supervised
   "the contractor" (incoherent now that the company *is* the contractor). I
   did not reword them: putting new words into a named client's mouth would be
   fabricating a testimonial. They are parked in `pendingTestimonials` in
   `src/data/testimonials.mjs`. The two live quotes each had one word changed,
   "he" → "they", because the referent is now a company. **Ask the client for
   three or four construction testimonials.**
2. **"30+ years" contradicts the handoff's "est. 2011"** (15 years as of 2026).
   Rather than invent a founding year, `established` was replaced with
   `yearsOnSite: 30`, and the Company page now reads "30+ years on site"
   instead of "est. 2011". JSON-LD no longer claims a `foundingDate`. Supply
   the real founding year if you want one shown.
3. **Credentials are down to two entries.** The third was "Council of
   Architecture, India — registered", an individual architect's credential
   that does not transfer to a construction company. Replace it with the
   contractor registration / licence / GST details.
4. **The service list is a proposal.** Construction, Interiors, Turnkey
   Projects, Renovation and Landscape are a coherent five for a builder and
   keep the five-item layout, but they should be checked against what the
   company actually tenders for.
5. **Project categories were inferred** from project names (Courtyard House →
   residential, Vidya Bhawan Block → commercial, and so on). Confirm.

### Reveal fix that came with it

Testing the new section exposed a flaw in the scroll reveal: elements the
viewport *jumps past* — restored scroll position on reload, an anchor, a fast
fling — never intersect, so they stayed invisible until the visitor scrolled
back up through them. The observer now flushes any un-revealed element earlier
in the document as soon as a later one appears, so there is never a blank gap
above content that has shown up. Verified: nothing left hidden at 1920, 1440,
1100, 900, 620, 390 or 320px after jumping to the foot of the page.

### Marquee fix that came with it

Dropping to two testimonials exposed a latent bug: a marquee loops by
translating its track -50%, which is only seamless while half the track covers
its container. Two cards did not, and neither did the original six on a 2560px
display — a blank gap would swing past. The track now starts with two sets in
the markup and the script repeats them (always an even count) until half the
track covers the container, re-measuring after webfonts load and on resize.
Verified seamless at 2560, 1920, 1440, 1024, 768 and 390px.

---

## Stack

**Plain static HTML/CSS/JS, generated by a small zero-dependency Node build
script.** No framework, no npm dependencies, no lockfile.

The handoff called for "a static generator or a framework with static export …
for a four-page brochure site". There was no existing codebase to match, so the
lightest thing that satisfies the brief won: every page ships as complete HTML
with all content in the markup, so it is fast, crawlable and fully readable
without JavaScript. Content lives in data modules (`src/data/`), the shell is a
single layout function, and the build stamps out four pages plus a 404 and a
confirmation page.

```
src/
  data/        projects, testimonials, team, capabilities, awards, business details
  layouts/     base.mjs — <head>, header, footer, contact rail, JSON-LD
  lib/         html.mjs — escaping template tag + responsive image helpers
  pages/       home, projects, studio, contact (one module per page)
  scripts/     site.js (shared) + home.js / projects.js / contact.js
  server/      enquiry.mjs — validation, spam checks, delivery
  styles/      site.css (hand-written, token-first) + fonts.css (generated)
scripts/       build, dev-server, optimize-images, fetch-fonts
public/        images, fonts, favicon — copied verbatim into dist/
dist/          the deployable output
```

### Commands

```bash
npm run setup    # fonts + images + build (first run)
```

```bash
npm run dev      # build output served at http://localhost:4321, with the enquiry API
```

```bash
npm run build    # regenerate dist/
```

```bash
npm run deploy   # build for GitHub Pages and publish to the gh-pages branch
```

`npm run fonts` and `npm run images` are one-off asset steps; re-run `images`
after replacing any photograph, `fonts` only if the typeface selection changes.

### Build configuration

The same source builds for a root domain or a sub-path, driven by environment
variables read in `src/lib/config.mjs`:

| Variable | Default | Purpose |
|---|---|---|
| `BASE_PATH` | `""` | URL prefix. `""` for a root domain, `/arch-space-website` for GitHub Pages. Every internal link, asset and image URL is prefixed with it. |
| `SITE_ORIGIN` | `https://www.theconstructionproject.example` | Absolute origin for canonical URLs, Open Graph and the sitemap. |
| `ENQUIRY_MODE` | `api` | `api` posts to a real endpoint; `handoff` is the static-host mode (see below). |
| `ENQUIRY_ENDPOINT` | `/api/enquiry` | Where `api` mode posts. |

`npm run build:pages` is the GitHub Pages combination; `npm run dev:pages`
serves that build locally at the same sub-path.

---

## Fidelity

Colours, type scale, spacing, motion timings and copy are taken verbatim from
the handoff's Design Tokens section and the `.dc.html` files. The signature
moves are all intact: the h1 letter-spacing entrance (0.9em → 0.34em over
2000ms), the hairlines that scale in from opposite ends, the callout rules that
draw outward, the 5200ms hero cross-fade, the 34s/46s marquees, the count-up,
the header inversion at 86vh, and the `scrollY * 0.07` hero parallax.

Radius is `0` everywhere except the two contact-rail circles. There is exactly
one shadow, on the WhatsApp button.

---

## Deliberate deviations

Each of these is a change from the prototype, made for a reason the handoff
either asked for or that would otherwise ship a defect.

### Asked for by the handoff

| Area | What was built |
|---|---|
| Mobile nav | Below 760px the three page links collapse into a toggle panel; **the phone number stays visible in the bar** at every width, as the handoff requested. Rows are 52px tall. Without JS the toggle is hidden and all links stay in the bar. |
| Scroll reveal | The un-revealed state is CSS gated on a `.js` class set by an inline script, not inline JS on the elements. If JS is off or the observer never fires, everything is visible. A 1.2s timeout also force-reveals anything already on screen. |
| Reduced motion | Every animation, the parallax, the count-up, the slideshow auto-advance and both marquees are disabled under `prefers-reduced-motion: reduce`. The marquees become static, horizontally scrollable rows and their duplicated sets are removed from the DOM flow. |
| Testimonials | Rendered from a six-item data array and duplicated programmatically; the duplicate set is `aria-hidden`. Ratings are exposed as `role="img"` + `aria-label="Rated 5 out of 5"` rather than twelve star glyphs. |
| Hero slideshow | Auto-advance pauses on hover, on keyboard focus, and when the tab is hidden. The four progress bars are real `<button>`s with `aria-current`; clicking one restarts the timer. Only the first frame is eager + `fetchpriority="high"`; the rest lazy-load. |
| Project filter | Real `role="tablist"` with `aria-selected`, arrow-key/Home/End navigation, `?category=…` mirrored to the URL (and honoured on load, so a filtered view is linkable), and a visually-hidden live region announcing the result count. |
| Stat count-up | Final values (`140+`, `15`, `05`) are in the markup; JS only animates up to them. |
| Enquiry form | Real `<label>` for every control, a visible focus style (underline shifts to gold and thickens to 2px), client **and** server validation, honeypot + timing + link-count spam checks, rate limiting, success/error states, and delivery. See "The enquiry form" below. |
| Project tiles | Rendered as `<article>`, not links — project detail pages do not exist, so a link to `#` would be a dead end. Home's "Selected Projects" tiles still link to `/projects/`, as in the design. |
| Tile hover | Added the restrained hover the handoff suggested: image scales to 1.02 over 600ms and the meta text shifts to the accent colour. |
| Photography | Client images are self-hosted and served as responsive `srcset` JPEGs with intrinsic `width`/`height`. Fonts are self-hosted (see below). |

### Fixes to problems the prototype would have shipped

1. **Invisible "Enquire" button.** A `.band-light a` colour rule outranks the
   button's own class, so the dark button rendered with ink text on its own
   near-black background. Button colours are now excluded from the section
   link rule.
2. **Footer text under the contact rail.** The fixed WhatsApp/Call circles
   overlap the bottom-right corner, which is exactly where the footer's right
   text and the form's status message sit. The footer reserves 62px of right
   padding and the form status now occupies its own row under the button.
3. **Gold on bone.** `#C9A24A` on `#EDE6D9` is roughly 2:1 — under any
   threshold for 10px text. When the header inverts, the phone number switches
   to ink and keeps its emphasis through weight instead of colour. Light-section
   link hovers use bronze, and focus rings on light sections use ink.
4. **No-JS header on Home.** The Home header is transparent until JS inverts
   it. Without JS it can never invert, so bone text would sit over the light
   sections. It now renders solid when the `.js` class is absent.
5. **Sticky footer.** Contact, the confirmation page and the 404 pin the footer
   to the bottom of short pages.

### Content note

The Contact page's prototype footer differs from the other pages. The handoff's
Global — Footer section specifies `Jagadhri & Chandigarh · arspace1@gmail.com`
for every non-Home page, so that is what all three inner pages use.

`postalCode` is deliberately absent from the JSON-LD address — it was not in
the handoff, and inventing one would put a wrong fact in structured data.

---

## Assets

### Photography

**The nine project images are still stock placeholders** and must not go live.
They are free-license Pexels files referenced by absolute URL and marked in the
markup with `data-placeholder-photo`, so they are trivial to find:

```bash
grep -rn "data-placeholder-photo\|images.pexels.com" dist/ src/
```

Client-supplied photography *is* in use and self-hosted: the four hero
slideshow frames, the principal architect (Studio hero + first team portrait),
the site engineer (fourth portrait), the award/panel photograph (Home press
wall + Studio awards) and the studio photograph (Contact).

Two team portraits were never supplied. Rather than substituting a stock face,
those cards render a hairline frame reading "Portrait to follow" — set
`image` on the entry in `src/data/team.mjs` once the photographs arrive.

To replace a photograph: drop the new file in `design/uploads/`, point the
matching entry in `src/data/images.mjs` at it, then `npm run images && npm run build`.

The derived files in `public/images/` **are committed**, unusually for build
output: the pipeline uses macOS `sips`, so a Linux CI runner could not
regenerate them. Swapping in `sharp` would make them safe to gitignore.

### Site photographs — the drop folder

**`photos/work/`** is where the client's own site photographs go. Everything in
it appears in the "On site" slider on both the home and Company pages, in
filename order, with no code change: drop files in, run
`npm run images && npm run build`, deploy.

**HEIC is accepted**, because that is what iPhones produce and no browser but
Safari can display it — `sips` decodes it and the build ships JPEG. Gallery
photographs stop at 1440px wide rather than 2000: the frame is capped at 864
CSS px, so 1440 already covers it at 2×, and the larger variant was dead weight
across two dozen files.

`scripts/optimize-images.mjs` scans the folder, derives the responsive widths
like any other image, and records the order in the manifest's `gallery` array.
**The filename is the visible caption**, shown beneath the frame and updated as
the slider advances, as well as the image's alt text — so naming a file well is
the whole job. `03-sector-17-slab-pour.jpeg` becomes "Sector 17 slab pour" — with leading digits stripped, so numeric prefixes can
order the slider without leaking into the description. Camera filenames
(`IMG_4900`) and export UUIDs fall back to "Construction site photograph N"
rather than reading a serial number aloud to a screen reader; renaming the file
is what turns that into a real caption. `photos/work/README.md`
says all of this in the client's terms.

That folder currently holds two of the client's own site photographs as a
starting point; they are meant to be replaced.

The manifest is now `{ images: { … }, gallery: [ … ] }` rather than a bare map
of images, so `localImage()` reads `manifest.images[file]` and `galleryImages()`
returns the ordered gallery list.

### Image pipeline — and why there is no AVIF yet

`scripts/optimize-images.mjs` derives 480/768/1024/1440/2000px variants with
macOS `sips` (no npm dependency) and writes a manifest of intrinsic sizes that
the build turns into `srcset` + `width`/`height`.

AVIF was implemented, tested and then **removed**: `sips` produces AVIF files
that Chromium decodes to a *blank* bitmap above ~1024px wide. Verified directly
— 480/768/1024 painted correctly, while 1440 and 2000 drew nothing (a canvas
`drawImage` of those returned fully transparent pixels) even though the same
sources as JPEG were fine. Shipping them would have meant invisible photography
in Chrome. To add modern formats, install a real encoder in CI (`sharp`,
libavif's `avifenc`, or `cwebp`), emit `<basename>-<width>.avif`, add the
format to the manifest's `formats`, and restore the `<picture>`/`<source>`
wrapper in `src/lib/html.mjs` — the CSS for it is still in place.

### Fonts

Self-hosted. `scripts/fetch-fonts.mjs` pulls Cormorant Garamond (300/400 +
italics) and Jost (300/400/500), keeps only the latin and latin-ext subsets,
writes the woff2 files to `public/fonts/`, and generates `src/styles/fonts.css`
with `font-display: swap`. The two faces used above the fold are preloaded.
No third-party font requests are made at runtime.

---

## The enquiry form

The form runs in one of two modes, chosen at build time.

### `api` mode — the real production behaviour

`src/server/enquiry.mjs` is host-agnostic: it takes a plain object and returns a
plain result, so the same module backs the local dev server and any serverless
function.

- **Validation** (client *and* server): name required (2–120 chars); at least
  one of phone (≥7 digits) or email (shape-checked); scope optional; message
  capped at 4000 chars.
- **Spam**: an off-screen honeypot field, a minimum 3-second fill time via a
  render timestamp, and a link-count check. Spam gets a normal success
  response — telling a bot it failed only trains it.
- **Rate limit**: 5 submissions per IP per 10 minutes, then 429.
- **Delivery**: emails to `ENQUIRY_TO` (default `arspace1@gmail.com`) via Resend
  when `RESEND_API_KEY` is set; otherwise appends to `enquiries.log` so nothing
  is silently dropped in development.
- **Progressive enhancement**: with JS the form posts JSON via `fetch` and
  shows inline errors or a success message in place. Without JS the same form
  does a normal POST; the server 303-redirects to `/enquiry-received/` on
  success, or returns a styled error page listing what to fix.

Verified end to end: valid submission (200 + delivered), missing name and
missing contact (422 with per-field messages), malformed email, honeypot
(200, not delivered), no-JS POST (303 → `/enquiry-received/`), and rate limit
(429 on the sixth request).

**Before launch**: set `RESEND_API_KEY`, `ENQUIRY_FROM` (a verified sender on a
domain you control) and `ENQUIRY_TO`. Swap in a different provider by replacing
the one `fetch` call in `deliver()`.

### `handoff` mode — what the GitHub Pages preview uses

GitHub Pages serves static files only, so there is no `/api/enquiry` to post
to. Rather than showing the client a form that fails, `ENQUIRY_MODE=handoff`
keeps the form and its validation intact and changes only what happens on a
valid submit: the enquiry is composed into a message, WhatsApp opens pre-filled
with it, and the status line offers a `mailto:` with the same content as a
backup. The button reads "Send on WhatsApp" so nothing is misrepresented.

The window is opened from inside the submit handler, so it counts as a user
gesture rather than a pop-up; if a browser blocks it anyway, the status line
says so and the email link still works.

With JavaScript disabled in this mode the form would be a dead end, so a
`<noscript>` block hides it and shows the phone, WhatsApp and email instead.

Switching the live site to a host with a runtime is a build-flag change:
`ENQUIRY_MODE=api` plus the mail credentials. No markup or script changes.

---

## Deployment

### Current: GitHub Pages (client preview)

The repository deploys from the `gh-pages` branch. `npm run deploy` builds with
the Pages configuration (`BASE_PATH=/arch-space-website`,
`ENQUIRY_MODE=handoff`), writes a `.nojekyll` marker, and force-pushes `dist/`
to that branch. Source stays on `main`; only the built output lives on
`gh-pages`.

There is no GitHub Actions workflow because the token used to create the repo
lacks the `workflow` scope. To switch to Actions later, add a workflow that runs
`npm run build:pages` and uploads `dist/` as a Pages artifact, then set Pages'
source to "GitHub Actions".

**This is a preview, not the launch.** It carries placeholder photography and
the WhatsApp handoff form. For the real launch see below.

### Launch: any host, root domain

`dist/` is a plain static directory — Netlify, Vercel, Cloudflare Pages, S3 +
CloudFront, or any web server. Two things need attention:

1. **`POST /api/enquiry` needs a runtime.** Wrap `handleEnquiry()` in a
   serverless function at that path (Netlify/Vercel function, Cloudflare
   Worker, or a small Node process). Everything else is static. If the site is
   deployed with no runtime at all, the form will 405 — point the form's
   `action` at a form service instead, or remove it in favour of the phone and
   WhatsApp links.
2. **Set the production origin and clear the base path.** Build with
   `SITE_ORIGIN=https://the-real-domain BASE_PATH= ENQUIRY_MODE=api npm run build`.
   `SITE_ORIGIN` feeds canonical URLs, Open Graph tags and the sitemap.

Recommended headers: long-lived immutable caching for `/images/*`, `/fonts/*`
and `/assets/*` (the dev server deliberately sends `no-store` so a rebuild is
always what you see); `no-cache` for HTML.

`robots.txt` and `sitemap.xml` are generated; `/enquiry-received/` and the 404
are `noindex`.

---

## Verification performed

- Rendered and reviewed every page at 1440×900 and 390×844 (headless Chrome).
- Header inversion checked at the 86vh boundary: `rgba(237,230,217,0.94)`
  background, ink text.
- Hero parallax measured at `scrollY * 0.07` exactly (300 → 21px).
- Count-up ends on `140+ / 15 / 05`.
- Slideshow dots switch slides and update `aria-current`.
- Filter: `?category=interiors` → 2 tiles, correct tab selected, live region
  updated; deep-linked `?category=landscape` restores on load.
- Structural audit across all six pages: no duplicate ids, no missing `alt`,
  exactly one `h1` per page, landmarks present, every internal link and every
  `srcset` candidate resolves, every form control has a `<label>`, no prototype
  markup leaked through.
- JS disabled: all content visible, filter bar hidden, form still posts.
- `prefers-reduced-motion: reduce`: marquees static, duplicates dropped, no
  movement anywhere.

---

## Outstanding

Ordered by what blocks launch. Items 1–4 are the client's; 5–9 are ours.

1. **Replace the nine stock project photographs** with the company's own work.
2. **Two team portraits** are still owed by the client.
3. **Construction testimonials** — four of the six handoff quotes are held back
   (see Repositioning above). Three or four replacements are needed.
4. **Contractor registration details** to replace the architect credential in
   the Awards & press list, and the real founding year if "30+ years" should be
   stated as a date.
5. **Project detail pages** are undesigned; tiles are intentionally not links
   until they exist. Adding them means a template plus a `slug` route —
   `src/data/projects.mjs` already carries slugs.
6. **Wire the enquiry endpoint** in the chosen host, set the mail credentials
   and build with `ENQUIRY_MODE=api`. Until then the live preview hands
   enquiries to WhatsApp.
7. **Set the production origin** and clear `BASE_PATH` for the real domain.
8. Optional: add a real AVIF/WebP encoder to the image step (see above).
9. Verify the business details and the service list in `src/data/site.mjs` against the client's own
   records before launch — they are transcribed from the handoff.
