# Handoff: Arch Space — architecture studio website

> **Built.** This handoff has been implemented as a static site in `src/`,
> output to `dist/`. Run `npm run setup` once, then `npm run dev`
> (http://localhost:4321). Implementation decisions, deviations and the
> remaining launch tasks are recorded in [docs/BUILD-NOTES.md](docs/BUILD-NOTES.md).
> The rest of this document is the original handoff, unchanged.

## Overview
A four-page marketing website for **Arch Space** — an architecture, interiors, 3D visualisation, valuation and landscape practice based in **Jagadhri (Haryana)** and **Chandigarh**, run by Abhishek Mangla, B.Arch. The site's job is credibility plus one action: get a prospective client to call, WhatsApp, or submit the enquiry form.

Aesthetic: a **dark architectural presentation board** — letterspaced serif titles, hairline rules and annotation callouts around a contained image, warm bronze accents on a warm near-black ground, alternating with a light bone section for contrast. Derived from the client's own presentation-board references.

## About the Design Files
The files in `design/` are **design references created in HTML** — prototypes showing intended look and behaviour, **not production code to copy directly**. They are authored in a proprietary streaming-component format (`.dc.html`, requiring the bundled `support.js` runtime) which is **not suitable for a production site**.

Your task is to **recreate these designs in the target codebase's own environment** using its established patterns and libraries. If there is no existing codebase, choose the appropriate framework yourself. For a four-page brochure site of this kind, a static generator or a framework with static export (Astro, Next.js static export, SvelteKit, or plain semantic HTML + CSS) is a better fit than a heavy SPA — the site has no application state and must be fast and crawlable.

Read `design/*.dc.html` for exact markup values. Ignore these mechanics of the prototype format:
- `<x-dc>`, `<helmet>`, `support.js`, `data-props`, `renderVals()`, `{{ }}` holes, `class Component extends DCLogic`
- `<image-slot>` — a drag-and-drop placeholder element. Replace with `<img>` (or the framework's image component) using its `src` value.
- `style-hover="…"` — represents a `:hover` rule; implement as real CSS.
- `ref="{{ xRef }}"` — a DOM handle for the imperative animation code; reimplement idiomatically.

`design/standalone-projects-page.html` is a self-contained flattened export of the Projects page — useful for viewing the intended result in a browser with no setup.

## Fidelity
**High-fidelity.** Colours, typography, spacing, animation timings and copy are final. Recreate pixel-accurately using the values in the Design Tokens section. All body copy, project names, testimonials and contact details in these files are the real intended content.

Two exceptions:
- **Photography is stock placeholder.** See Assets.
- **Project detail pages do not exist.** Project tiles link to `#`.

---

## Screens / Views

Global constants across all four pages:
- Page background `#23211D`; content max-width **1400px**, centred; horizontal page padding **34px**.
- Body font `Jost` (300/400/500); display font `Cormorant Garamond` (300/400, plus italic 300).
- Section vertical rhythm: `clamp(56px, 9vh, 110px)` for major sections, `clamp(44px, 7vh, 86px)` for minor ones.
- Header, footer and the fixed contact rail repeat on every page.

### Global — Header
- **Layout**: flex row, `space-between`, `gap: 28px`, padding `20px 34px` (Home) / `18px 34px` (other pages).
- **Position**: `fixed` and initially transparent on Home (it overlays the hero); `sticky top:0` with a solid background on Projects / Studio / Contact.
- **Wordmark**: "Arch Space", 12px, `letter-spacing: 0.46em`, uppercase, links to Home.
- **Nav**: Projects · Studio · Contact · phone. Each 10px, `letter-spacing: 0.26em`, uppercase, `opacity: 0.7`; the current page's link is full-opacity `#C9A24A`. The phone link `tel:+919467629425` is `#C9A24A` on Home and must carry `white-space: nowrap`.
- **Scroll behaviour (Home only)**: past 30px scrolled the bar gains `background: rgba(27,26,22,0.86)` + `backdrop-filter: blur(12px)` + `border-bottom: 1px solid rgba(237,230,217,0.12)`. Past `86vh` — where the light Statement section begins — it inverts to `background: rgba(237,230,217,0.94)`, text `#221F1A`, border `rgba(34,31,26,0.14)`. Transition 600ms ease on background, colour and border-colour.

### Global — Footer
- Background `#1B1A16`, padding `24–26px 34px`, flex row `space-between`, wraps.
- Left: "Arch Space", 11px, `letter-spacing: 0.44em`, uppercase, `rgba(237,230,217,0.8)`.
- Right: 10px, `letter-spacing: 0.16em`, `rgba(237,230,217,0.4)` — on Home `© 2026 · Abhishek Mangla, B.Arch · Jagadhri & Chandigarh`; elsewhere `Jagadhri & Chandigarh · arspace1@gmail.com`.

### Global — Fixed contact rail
Bottom-right, `position: fixed; right: 20px; bottom: 20px; z-index: 80`, column, `gap: 10px`. Two 52×52px circles, 9px uppercase labels:
- **WA** → `https://wa.me/919467629425`; background `#A6803F`, text `#23211D`, `box-shadow: 0 10px 30px rgba(0,0,0,0.35)`.
- **Call** → `tel:+919467629425`; transparent `rgba(35,33,29,0.9)`, `1px solid rgba(237,230,217,0.35)`, text `#EDE6D9`.
- Hover: `transform: translateY(-3px)` (350ms ease); Call also shifts its border to `#A6803F`.
- **Note**: 52px is below the 44px minimum only in label size, not target size — keep the 52px targets. Give both links `aria-label`s ("Chat on WhatsApp", "Call the studio").

---

### 1. Home (`Home.dc.html`)
**Purpose**: establish the practice, prove volume and trust, drive to enquiry.

Seven sections top to bottom:

**1a. Hero board** — `min-height: 100svh`, background `#23211D`, padding `104px 34px 56px`, centred column, `gap: 34px`, `overflow: hidden`.
- Two 1px vertical hairlines at `left: 34px` and `right: 34px`, spanning `top: 96px` to `bottom: 56px`, colour `rgba(237,230,217,0.14)`. They animate in by scaling on Y (left one from the top, right one from the bottom) — 1600ms `cubic-bezier(.2,.7,.2,1)`, 200ms delay.
- Centred title stack: eyebrow "Architects · Interiors · Valuers · Landscape" (9px, `letter-spacing: 0.34em`, uppercase, `rgba(237,230,217,0.55)`); `h1` "Arch Space" (Cormorant 300, `clamp(34px, 6.4vw, 104px)`, `line-height: 1`, uppercase, `letter-spacing: 0.34em`, matching `text-indent: 0.34em` so it stays optically centred); tagline "Concept to Completion" (Cormorant italic, `clamp(15px, 1.5vw, 22px)`, `#C9A24A`).
- **h1 entrance**: letter-spacing animates `0.9em → 0.34em` with opacity `0 → 1`, 2000ms `cubic-bezier(.2,.7,.2,1)`, 260ms delay. This is the signature move of the design — keep it.
- **Board row**: 3-column grid `minmax(0,1fr) minmax(240px,2.1fr) minmax(0,1fr)`, `gap: clamp(14px,2vw,34px)`, `align-items: center`, `max-width: 1180px`.
  - Left column (right-aligned) callouts: **Concept** — "daylight placed where people actually sit"; **Material** — "exposed concrete · local brick · warm tone".
  - Right column callouts: **Section a—a** — "double-height void, cross ventilation"; **Site** — "Jagadhri, Haryana & Chandigarh".
  - Each callout: label 9px `letter-spacing: 0.28em` uppercase `#C9A24A`; text 11px `line-height: 1.7` `rgba(237,230,217,0.6)` `max-width: 20ch`; then a 1px rule in `rgba(237,230,217,0.3)` that draws outward (scaleX from the side facing the image), 1000ms ease, staggered 1500–1800ms.
  - Centre: `aspect-ratio: 4/3`, `overflow: hidden`, **auto-advancing slideshow of 4 images** (see Interactions). Progress indicator bottom-left (`left/bottom: 12px`): four 22×2px bars, active `#C9A24A`, inactive `rgba(237,230,217,0.35)`, 600ms transition.
  - Below the image, a dimension line: "Elevation · scale 1:100" — 1px rule filling the space — "10.80 m". Both labels 9px `letter-spacing: 0.28em` uppercase `rgba(237,230,217,0.5)`; rule draws left-to-right, 1400ms.
- Scroll cue: "Scroll" label + a 1px × 46px `#A6803F` bar pulsing on `scaleY` 0.2 ↔ 1 with opacity 0.3 ↔ 1, 2400ms `ease-in-out`, infinite.

**1b. Statement** — background `#EDE6D9`, text `#221F1A`, padding `clamp(56px,9vh,110px) 34px`.
- Grid `repeat(auto-fit, minmax(min(280px,100%),1fr))`, `gap: clamp(28px,4vw,72px)`, `align-items: end`.
- Lead line spans all columns: Cormorant 300, `clamp(23px,2.9vw,46px)`, `line-height: 1.24`, `letter-spacing: -0.01em`, `max-width: 26ch`, `text-wrap: pretty` — "Drawings, renders, valuation and site work — under one roof in Jagadhri and Chandigarh."
- Three stat blocks, each `border-top: 1px solid rgba(34,31,26,0.18)`, `padding-top: 14px`: number in Cormorant 38px `#A6803F`, label 10px `letter-spacing: 0.24em` uppercase `rgba(34,31,26,0.55)`.
  - **140+** Projects delivered · **15** Years in practice · **05** Disciplines in-house
- Numbers **count up** when scrolled into view (see Interactions).

**1c. Selected projects** — same `#EDE6D9` ground, continues without a gap (`padding: 0 34px clamp(56px,9vh,110px)`).
- Header row: `h2` "Selected Projects" (Cormorant 300, `clamp(26px,3.4vw,58px)`, `letter-spacing: -0.02em`) and a "View all →" link (10px, `letter-spacing: 0.26em`, uppercase, `rgba(34,31,26,0.6)`, `border-bottom: 1px solid rgba(34,31,26,0.3)`, `padding-bottom: 4px`, `nowrap`). Row has `border-bottom: 1px solid rgba(34,31,26,0.18)`, `padding-bottom: 16px`.
- Grid of three tiles: `repeat(auto-fit, minmax(min(300px,100%),1fr))`, `gap: clamp(18px,2vw,30px)`. Each tile is a link to Projects: `4/3` image, then a baseline-aligned row with the name (Cormorant 21px) and the meta (9px, `letter-spacing: 0.26em`, uppercase, `rgba(34,31,26,0.5)`, `nowrap`).
  - Courtyard House · Sector 17 · 2024 — Vidya Bhawan Block · Institutional · 2023 — Mangla Flagship · Interiors · 2025
- Every tile needs `min-width: 0` so long meta text can't blow out the grid track.

**1d. Services marquee** — background `#1B1A16`, hairline borders top and bottom `rgba(237,230,217,0.12)`, `padding: 26px 0`, `overflow: hidden`.
- A `width: max-content` flex row containing the same five-item group **twice**, translating `0 → -50%` over **34s linear infinite** — the duplicate is what makes the loop seamless.
- Items: Architecture ✦ Interiors ✦ 3D Visualisation ✦ Valuation ✦ Landscape. Words Cormorant 300 `clamp(20px,2.2vw,34px)` `#EDE6D9`; separators `#A6803F`. `gap: 44px` plus `padding-right: 44px` per group.

**1e. Testimonials** — background `#23211D`, padding `clamp(56px,9vh,110px) 34px`.
- Header row: `h2` "Clients" + "In their words" (10px, `letter-spacing: 0.26em`, uppercase, `rgba(237,230,217,0.45)`), `border-bottom: 1px solid rgba(237,230,217,0.16)`, `padding-bottom: 16px`.
- **Auto-scrolling rail**: an `overflow: hidden` viewport wrapping a `width: max-content` flex track, `gap: 22px`, six cards listed **twice**, translating `0 → -50%` over **46s linear infinite**. Pauses on hover.
- Card: `width: min(380px, 80vw)`, `1px solid rgba(237,230,217,0.14)`, `padding: 26px`, column, `gap: 14px`. Contents in order: `★★★★★` (13px, `letter-spacing: 0.24em`, `#C9A24A`) followed by a `5/5` (10px, `rgba(237,230,217,0.5)`); quote (Cormorant italic 300, 19px, `line-height: 1.5`, `rgba(237,230,217,0.9)`); client name (11px, `letter-spacing: 0.1em`, `#EDE6D9`); project/location (9px, `letter-spacing: 0.24em`, uppercase, `rgba(237,230,217,0.45)`).
- The six clients: Rajesh Bansal (Residence · Sector 17, Jagadhri), Simran Kaur (Retail interior · Ambala), Vikram Sethi (Valuation · Yamunanagar), Naveen Gupta (Office fit-out · Chandigarh), Meenakshi Rana (Residence · Radaur), Harpreet Singh (Institutional · Yamunanagar). Quotes verbatim in `Home.dc.html`.
- **Implementation note**: render the six from a data array and duplicate programmatically — don't hand-write twelve cards as the prototype does. Mark the duplicate set `aria-hidden="true"`.
- Star ratings should be exposed to assistive tech as text (e.g. `aria-label="Rated 5 out of 5"`), not twelve glyphs.

**1f. Press wall** — background `#23211D`, `border-top: 1px solid rgba(237,230,217,0.12)`, padding `clamp(48px,7vh,90px) 34px`.
- Two-column `auto-fit` grid, `gap: clamp(28px,4vw,64px)`, `align-items: center`: a `16/10` photograph, and a list.
- List: eyebrow "Awards & press" (10px, `letter-spacing: 0.3em`, uppercase, `#C9A24A`), then three rows each `border-top: 1px solid rgba(237,230,217,0.16)` (last row also `border-bottom`), `padding: 15px 0`, `space-between`: title 13px `rgba(237,230,217,0.85)`, year 11px `rgba(237,230,217,0.45)`.
  - Panel member, Real Wood Collection launch — 2023 · Speaker, Architects & Interior Designers Meet — 2022 · Council of Architecture, India — registered — Member

**1g. CTA** — background `#EDE6D9`, text `#221F1A`, padding `clamp(56px,9vh,120px) 34px`.
- Flex row, `align-items: flex-end`, `space-between`, `gap: 28px`, wraps.
- `h2` "Bring us / the *site*." — Cormorant 300, `clamp(30px,5vw,86px)`, `line-height: 0.96`, `letter-spacing: -0.03em`, explicit line break before "the", "site" in italic.
- Right: primary button "Enquire →" → Contact — background `#23211D`, text `#EDE6D9`, `padding: 15px 28px`, 10px `letter-spacing: 0.26em` uppercase, hover background `#A6803F` (400ms ease). Below it, 11px `letter-spacing: 0.14em` `rgba(34,31,26,0.55)`: `#510, Sector 17, HUDA, Jagadhri · arspace1@gmail.com` (email is a `mailto:` link in `#221F1A`).

### 2. Projects (`Projects.dc.html`)
**Purpose**: browse the body of work, filterable by discipline.

- **Header block** (`padding: clamp(44px,7vh,84px) 34px clamp(20px,3vh,32px)`): `h1` "Projects" (Cormorant 300, `clamp(34px,5.6vw,96px)`, `line-height: 0.95`, uppercase, `letter-spacing: 0.14em`) with "Index · 09 works · 2018—2026" (9px, `letter-spacing: 0.3em`, uppercase, `rgba(237,230,217,0.45)`) baseline-aligned to its right; then a full-width 1px `rgba(237,230,217,0.2)` rule that draws left-to-right over 1400ms.
- **Filter bar**: five text buttons — All / Architecture / Interiors / Visualisation / Landscape — 10px, `letter-spacing: 0.26em`, uppercase; active `#C9A24A`, inactive `rgba(237,230,217,0.45)`; `gap: 24px`, wraps. No borders or pills. **Rebuild as real tabs**: `role="tablist"`, `aria-selected`, and reflect the active filter in the URL (`?category=interiors`) so a filtered view is linkable.
- **Grid**: `repeat(auto-fit, minmax(min(300px,100%),1fr))`, `gap: clamp(18px,2vw,32px)`. Nine tiles, each: `4/3` image inside `1px solid rgba(237,230,217,0.12)`, then a baseline row — name (Cormorant 21px) and meta (9px, `letter-spacing: 0.24em`, uppercase, `rgba(237,230,217,0.45)`, `nowrap`). `min-width: 0` on each tile.
- Tiles and their categories:

| # | Name | Meta | Category |
|---|---|---|---|
| 1 | Courtyard House | Sector 17 · 2024 | architecture |
| 2 | Vidya Bhawan Block | Institutional · 2023 | architecture |
| 3 | Mangla Flagship | Ambala · 2025 | interiors |
| 4 | Radaur Road Complex | In progress | visualisation |
| 5 | Kansapur Farmhouse | Landscape · 2022 | landscape |
| 6 | Corporate Cabin | Fit-out · 2024 | interiors |
| 7 | Sector 18 Apartments | HUDA · 2021 | architecture |
| 8 | Laminate Showroom | Walkthrough · 2023 | visualisation |
| 9 | Community Court | Radaur · 2020 | landscape |

- **Tiles currently link to `#`** — project detail pages are undesigned. Either make tiles non-links until detail pages exist, or scope a detail template as follow-up work.
- **Closing band**: `#EDE6D9` / `#221F1A`, padding `clamp(44px,7vh,86px) 34px` — "Planning something similar?" (Cormorant 300, `clamp(24px,3.4vw,52px)`) with the same "Enquire →" button.

### 3. Studio (`Studio.dc.html`)
**Purpose**: the people, the disciplines, the credentials.

- **Studio board**: `h1` "Studio" (same treatment as Projects' h1) with "Jagadhri & Chandigarh · est. 2011 · five desks" beside it; below, a two-column `auto-fit` grid (`gap: clamp(24px,3vw,56px)`, `align-items: center`) pairing a `4/3` photograph with the studio narrative.
- **Capabilities** (`#EDE6D9` / `#221F1A`, padding `clamp(48px,8vh,100px) 34px`): grid `repeat(auto-fit, minmax(min(260px,100%),1fr))`, `gap: clamp(28px,4vw,64px)`, `align-items: start`. Left cell holds the eyebrow "Capabilities" (9px, `letter-spacing: 0.3em`, uppercase, `#A6803F`) and `h2` "Five desks, / one studio"; the right cell spans **2 columns** and holds a hairline-ruled list of the five disciplines.
- **Team** (dark): header row `h2` "The Team" + "Five people", `border-bottom: 1px solid rgba(237,230,217,0.18)`. Four portrait cards, `aspect-ratio: 3/4`, `1px solid rgba(237,230,217,0.12)`, name and role beneath.
- **Awards** (dark, `border-top` hairline): `16/10` photograph paired with the credentials list — same row pattern as Home's press wall.

### 4. Contact (`Contact.dc.html`)
**Purpose**: capture an enquiry with enough detail to quote.

- **Contact board**: `h1` "Contact" with "Mon—Sat · 10:00—19:00" beside it. Two-column layout: left is a `4/3` photograph plus a grid of contact details (`repeat(auto-fit, minmax(min(180px,100%),1fr))`, `gap: 24px`); right is the enquiry form.
- **Form** — "Tell us about the site" (Cormorant 300, `clamp(21px,2.4vw,36px)`, `line-height: 1.15`). Fields, in order:
  1. **Name** and **Phone** side by side (`auto-fit minmax(min(180px,100%),1fr)`, `gap: 20px`)
  2. **Email** (`type="email"`)
  3. **Location and plot size** (text)
  4. **Scope** — checkbox chips under a 9px uppercase "Scope" label: Architecture, Interiors, 3D Visualisation, Valuation, Landscape. Chip = `inline-flex`, `gap: 8px`, 12px text `rgba(237,230,217,0.8)`, `1px solid rgba(237,230,217,0.22)`, `padding: 8px 14px`, `cursor: pointer`, `gap: 10px` between chips, wraps.
  5. **Message** — `textarea rows="3"`, placeholder "What are you planning to build?"
- Input styling throughout: no box — `background: none`, `border: 0`, `border-bottom: 1px solid rgba(237,230,217,0.28)`, `padding: 10px 0`, `font-size: 14px`, `color: #EDE6D9`, `outline: none`, `font-family: Jost`. Placeholder `rgba(237,230,217,0.4)`.
- **Submit**: background `#A6803F`, text `#23211D`, no border, `padding: 15px 30px`, 10px `letter-spacing: 0.26em` uppercase.
- **The form is non-functional in the prototype.** Production work required:
  - Real `<label>`s for every field — the prototype relies on placeholders alone, which fails accessibility.
  - A visible focus style (the prototype sets `outline: none` with no replacement) — suggest shifting the underline to `#C9A24A` and thickening to 2px on `:focus-visible`.
  - Client + server validation: name required, and at least one of phone/email required; scope optional.
  - Submission handling, success and error states, spam protection, and delivery to `arspace1@gmail.com` (or a CRM). No success/error state is designed — use the site's existing type scale for it.

---

## Interactions & Behavior

**Scroll reveal (all pages).** Elements marked `data-reveal` start at `opacity: 0` and animate in when they enter the viewport: `translateY(22px) → 0` with `opacity 0 → 1`, **1000ms** `cubic-bezier(.2,.7,.2,1)` on Home / **900ms** on Projects, staggered by **80–90ms** per element in the same intersection batch. Fires once per element (unobserve after firing). IntersectionObserver: `rootMargin: '0px 0px -8% 0px'`, `threshold: 0.05`.
- **Must-fix in production:** the prototype hides these elements with inline JS, so they stay invisible if the observer never fires. Prefer a CSS-only approach (`@starting-style`, or a class applied by the observer with the un-revealed state defined in CSS) and always render visible content when JS is unavailable.
- Wrap all reveal, count-up, marquee and slideshow motion in `@media (prefers-reduced-motion: reduce)` guards — the prototype has none. Static end-state, no movement.

**Hero slideshow (Home).** Four stacked absolutely-positioned layers; a `setInterval` advances every **5200ms**, cross-fading via `opacity` with a **1500ms ease** transition. Progress bars update in step. Loops indefinitely. Add pause-on-hover and manual controls in production, and preload only the first frame (lazy-load the rest).

**Hero parallax (Home).** While `scrollY < innerHeight`, the hero image translates down by `scrollY * 0.07` px. Scroll listener is `{ passive: true }`. Prefer a transform driven by `requestAnimationFrame` or a scroll-timeline; skip entirely under reduced-motion.

**Stat count-up (Home).** When the Statement section reaches `threshold: 0.4`, each number animates from 0 to its target over **1600ms** with cubic ease-out (`1 - (1-t)³`). "140" gains its `+` suffix only on the final frame; "05" is zero-padded below 10. Runs once. Render the final values in the markup so they're correct without JS.

**Marquees (Home).** Services 34s, testimonials 46s, both `linear infinite`, translating `0 → -50%` across a doubled track. Testimonial rail pauses on `mouseenter` (`animation-play-state: paused`) and resumes on `mouseleave`. Add keyboard-focus pause too.

**Header inversion (Home).** See Global — Header.

**Project filtering (Projects).** Clicking a filter shows tiles whose category matches (or all), sets `display: none` on the rest, replays the reveal animation on the shown tiles (700ms), and recolours the active button. Production: filter the data, add URL state, and announce the result count in a live region.

**Hover states.** Links `#EDE6D9 → #C9A24A`. Buttons `#23211D → #A6803F` (400ms ease). Contact-rail circles lift 3px (350ms ease). Project tiles have **no hover state** in the prototype — worth adding a restrained one (a subtle image scale, ~1.02 over 600ms, or the meta text shifting to `#C9A24A`).

**Responsive behavior.** Fluid throughout — every type size uses `clamp()`, and every multi-column grid is `auto-fit` with `minmax(min(Npx,100%),1fr)`, so columns collapse to one without media queries. The `min(Npx,100%)` form is deliberate: it prevents horizontal overflow at narrow widths. `overflow-x: hidden` on the page wrapper. **The nav has no mobile treatment** — four items plus a phone number will crowd below ~420px; design/implement a small-screen nav (the phone number is the most important item to keep visible).

## State Management
Minimal — no global store needed.
- `activeCategory: 'all' | 'architecture' | 'interiors' | 'visualisation' | 'landscape'` (Projects; mirror to the URL query).
- `activeSlide: 0–3` plus an interval handle (Home hero).
- `statsAnimated: boolean` one-shot latch (Home).
- Form field values + `submitting | success | error` (Contact).
- Content that should become data rather than markup: projects (9), testimonials (6), team (4), capabilities (5), awards (3). No data fetching; the enquiry POST is the only network call.

## Design Tokens

**Colors**
| Token | Value | Use |
|---|---|---|
| Ground | `#23211D` | primary dark page background |
| Ground deep | `#1B1A16` | footer, marquee band, scrolled header base |
| Bone | `#EDE6D9` | light-section background; text on dark |
| Ink | `#221F1A` | text on bone |
| Bronze | `#A6803F` | buttons, stat numbers, accent rules, selection |
| Gold | `#C9A24A` | link hover, active nav, callout labels, stars, tagline |
| Hairline (on dark) | `rgba(237,230,217,0.12–0.20)` | borders, rules |
| Hairline (on bone) | `rgba(34,31,26,0.18)` | borders, rules |
| Muted text (on dark) | `rgba(237,230,217,0.45)` / `0.5` / `0.6` / `0.85` | meta, body, emphasis |
| Muted text (on bone) | `rgba(34,31,26,0.5)` / `0.55` | meta |

**Typography** — `Cormorant Garamond` 300/400 + italic 300 (display); `Jost` 300/400/500 (UI/body).
| Role | Value |
|---|---|
| Hero h1 | Cormorant 300, `clamp(34px,6.4vw,104px)`, `lh 1`, uppercase, `ls 0.34em` |
| Page h1 | Cormorant 300, `clamp(34px,5.6vw,96px)`, `lh 0.95`, uppercase, `ls 0.14em` |
| Section h2 | Cormorant 300, `clamp(26px,3.4vw,58px)`, `lh 1`, `ls -0.02em` |
| CTA h2 | Cormorant 300, `clamp(30px,5vw,86px)`, `lh 0.96`, `ls -0.03em` |
| Lead paragraph | Cormorant 300, `clamp(23px,2.9vw,46px)`, `lh 1.24`, `ls -0.01em`, `max-width 26ch` |
| Quote | Cormorant italic 300, 19px, `lh 1.5` |
| Project name | Cormorant 400, 21px |
| Stat number | Cormorant 400, 38px |
| Wordmark | Jost 400, 12px, `ls 0.46em`, uppercase |
| Nav / button | Jost 400, 10px, `ls 0.26em`, uppercase |
| Meta / eyebrow | Jost 400, 9px, `ls 0.24–0.34em`, uppercase |
| Body small | Jost 300/400, 11–13px, `lh 1.7` |
| Form input | Jost 400, 14px |

**Spacing** — 4 / 6 / 8 / 10 / 12 / 14 / 18 / 20 / 22 / 24 / 26 / 28 / 30 / 34 / 44px. Page gutter 34px; content max-width 1400px (hero board 1180px).

**Radius** — `0` everywhere. The only exception is the 50% circle on the two contact-rail buttons. This is deliberate; do not soften corners.

**Shadows** — one only: `0 10px 30px rgba(0,0,0,0.35)` on the WhatsApp button. No card shadows.

**Motion** — easing `cubic-bezier(.2,.7,.2,1)` for entrances, `ease` for fades, `linear` for marquees. Durations: 350ms (hover lift), 400ms (button), 600ms (header, indicator), 900–1000ms (reveal), 1400–1600ms (rules, count-up), 1500ms (slide cross-fade), 2000ms (h1 tracking), 2400ms (scroll cue loop), 34s / 46s (marquees).

## Assets

**Photography — placeholder, must be replaced.** Nine project images and three Home tiles use free-license stock from Pexels (no attribution required), referenced by absolute URL in the markup. They are stand-ins chosen to match each project's type — they are **not** the studio's work and must not ship. Replace with the client's own photography, then self-host, resize responsively (`srcset`), and convert to AVIF/WebP.

Stock URLs are inline in `Projects.dc.html` / `Home.dc.html` in the form `https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=1600`, ids: 323780, 269077, 260922, 323705, 338504, 260689, 439391, 2724749, 1974596.

**Client-supplied images** in `design/uploads/` — these ARE the client's own material and should carry through:
- `Enhance_quality_and_change_size_202608161056.jpeg`, `…161057.jpeg`, `Enhance_image_quality_and_size_202608161128.jpeg`, `Enhance_quality_and_change_size_202608171156.jpeg` — the four hero slideshow frames (sketch/design boards).
- `photos-1786856795790-y6tc.jpeg` — principal architect at the drawing table (Studio hero + first team portrait).
- `photos-1786856519692-jqr6.jpeg` — site engineer (fourth team portrait).
- `photos-1786856519759-p198.jpeg` — award / panel photograph (Home press wall + Studio awards).
- `photos-1786856519741-vsjh.jpeg` — studio / site photograph (Contact).
- Two Studio team portraits (`sb-t2`, `sb-t3`) have **no image at all** — the client still owes those.

**Icons** — none. No icon library is needed: the WhatsApp and Call buttons use the text labels "WA" and "Call", and `→` / `✦` / `★` are literal characters. If you swap in real icons, keep them hairline-weight to match.

**Fonts** — Google Fonts, loaded with `preconnect` to `fonts.gstatic.com`:
`https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap`
Self-host with `font-display: swap` in production. Note the hero h1 animates `letter-spacing` — verify no layout jank once the real font swaps in.

## Files
In `design/`:
| File | Contents |
|---|---|
| `Home.dc.html` | Home — all seven sections + all animation logic |
| `Projects.dc.html` | Projects index + filter logic |
| `Studio.dc.html` | Studio, capabilities, team, awards |
| `Contact.dc.html` | Contact board + enquiry form |
| `standalone-projects-page.html` | flattened self-contained Projects page — open in a browser to see the intended rendering with no setup |
| `support.js`, `image-slot.js` | prototype runtime — **do not port**, reference only |
| `uploads/` | client-supplied photography (see Assets) |

## Business details (verbatim — verify before launch)
- **Arch Space** — Abhishek Mangla, B.Arch; Council of Architecture, India registered.
- Offices: **#510, Sector 17, HUDA, Jagadhri** (Haryana) and **Chandigarh**.
- Phone / WhatsApp: **+91 94676 29425** · Email: **arspace1@gmail.com**
- Hours: Mon—Sat, 10:00—19:00. Established 2011 · 140+ projects · five disciplines.
- Disciplines: Architecture, Interiors, 3D Visualisation, Valuation, Landscape.

## Recommended first tasks
1. Scaffold the static site; port the tokens above into CSS custom properties (or the framework's theme layer).
2. Build the global header / footer / contact rail, including the mobile nav that the prototype lacks.
3. Build Home section by section; extract projects and testimonials to data files.
4. Build Projects with URL-backed filtering, then Studio, then Contact.
5. Make the enquiry form work end to end — labels, validation, focus styles, submission, success/error states.
6. Accessibility and motion pass: reduced-motion guards, no-JS fallbacks, focus-visible, star ratings as text, `aria-label`s on the icon buttons.
7. Swap stock photography for the client's own; self-host fonts and images.
8. Decide on project detail pages — the tiles link nowhere today.
