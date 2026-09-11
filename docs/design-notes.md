# Somi — Design Notes (D1 Reference Inventory)

Six reference sites measured at a ~711px browser window (desktop browser capped for this session).
All measurements are JS-extracted from live DOM; see per-site notes for caveats.

---

## Per-site inventory

### 1 · Social Service Club — socialserviceclub.io

| Attribute | Value |
|---|---|
| Platform | Readymag (magazine viewer — no semantic HTML headings or sections) |
| Content max-width | ~769px (fills viewport, no CSS max-width cap) |
| Column count | 1 column; full-bleed layout with left-side vertical ticker |
| Body font | Roboto, 18 px, 400 |
| Heading type | Display/layered (not in HTML heading elements — text inside Readymag layers) |
| Section bg treatment | Strong alternation: black / orange `#FF5500` / yellow `#FFE291` / near-white `#FFF1F1` / white |
| Nav | Horizontal text links at top, not sticky |

**Visual pacing.** Sections feel heavy — full-bleed photographs alternating with saturated solid-color fills leave very little whitespace. The vertical ticker ("SOCIAL SERVICE CLUB" rotated 90°) on the left edge adds constant visual noise. The site is editorial and dense by design, reading like a printed zine.

**Long-text handling.** The text column measures roughly 21 ch (very narrow). Spanish and Catalan text running 15–30% longer would overflow or reflow into more lines without a proportional width increase. Worth noting as a what-not-to-do: don't key column width to English line length.

**A11y concerns to avoid.**
- No HTML heading hierarchy (Readymag generates layers, not `<h1>`–`<h6>`).
- Orange `#FF5500` on white is ~3.5:1 — fails AA for normal text.
- Animated marquee ticker has no `prefers-reduced-motion` accommodation.
- No visible focus styles; keyboard navigation appears entirely absent.

---

### 2 · Post Office — p-o.space

| Attribute | Value |
|---|---|
| Platform | Custom (windowing desktop metaphor — draggable panels) |
| Content max-width | Fills viewport; panels sized individually (~200–400 px wide each) |
| Column count | N/A — floating overlapping windows, not a columnar layout |
| Body font | Monospace/typewriter (appears to be Courier or similar), ~14–15 px |
| Heading type | Window title bars — not HTML headings |
| Section bg treatment | Binary: white panels on white background; black for active/hover states |
| Nav | None — content is distributed across floating panels |

**Visual pacing.** Extremely light and airy — mostly empty whitespace with small floating content panels. The pacing isn't driven by scrolling vertical rhythm but by spatial proximity. Sections don't feel heavy or light in the conventional sense because there are no sections.

**Long-text handling.** Text wraps within each window's fixed boundary. A panel set to hold an English paragraph would scroll or overflow in Catalan — this layout strategy doesn't degrade gracefully for longer copy. Avoidable for Somi (a single-scroll page doesn't need draggable panels).

**A11y concerns to avoid.**
- Floating/overlapping windows produce broken tab order — keyboard users would tab through hidden or off-screen elements.
- No landmark regions (`<main>`, `<nav>`, `<header>`).
- Mouse-dependent drag UI has no keyboard equivalent.

---

### 3 · KW Institute for Contemporary Art — kw-berlin.de

| Attribute | Value |
|---|---|
| Platform | WordPress (custom theme) |
| Content max-width | ~711 px at this viewport; no explicit max-width on main; event cards 3 × ~210 px grid |
| Column count | 3-column grid for event/exhibition cards; single column for prose |
| Body font | KWGrotesk (custom sans-serif), 15 px, 400 |
| Heading type | Sans-serif (KWGrotesk): H1 20 px/400, H2 20–30 px/400. Very low weight distinction between heading and body — size alone separates them |
| Section bg treatment | Predominantly white; individual panels in yellow `#FFB700`, lime `#E0FF2E`, warm cream `#FEF7DB`, dark warm-brown `#433D3D` |
| Nav | Relative (not sticky); inline comma-separated links — "Programm, Besuch, Über uns, Archiv, Shop, Engagement" |

**Visual pacing.** Medium density. Exhibition sections are image-heavy and feel substantial; text-only sections between them are light. The vivid accent-colored panels (lime, yellow) act as visual punctuation between content clusters — they signal "new topic" without needing a rule or a header. The low heading weight (400 even at large sizes) gives the whole page a deliberately flat, editorial feel that lets the photography do the work.

**Long-text handling.** KWGrotesk handles German compound words well (the real long-text stress test for a language-aware typeface). The single-column prose sections would accommodate longer Catalan text gracefully — no fixed-width columns to burst. The 3-column event grid is the risk area: card headings in a longer locale could push column heights out of sync.

**A11y concerns to avoid.**
- Lime `#E0FF2E` is ~1.6:1 on white — unusable for text; only safe as a background with dark text on it. Their usage appears to be as a panel background with dark text on top, which should be checked.
- The custom typeface (KWGrotesk) is unlicensed for external use, but the approach — using a house sans at flat weight with accent color panels — is transferable.

---

### 4 · One Manor Place — omp.dentist

| Attribute | Value |
|---|---|
| Platform | Custom (Barba.js page transitions visible) |
| Content max-width | ~711 px at this viewport; single-column, generous side margins |
| Column count | 1 column; no grid layout found |
| Body font | "Mono" (custom monospace), 14 px, 400 |
| Heading type | Dual typeface: H2 uses "Hue" (transitional/humanist serif), 32 px, 400. H3 uses "Mono" (label style), 14 px, 400 |
| Section bg treatment | Warm cream `#FFF8C1`, near-white `#FFFEF3`, white, dark forest green `#2E513E` (one CTA-ish section) |
| Nav | Sticky |

**Visual pacing.** Very light and graceful. The design earns its whitespace — generous vertical padding between sections, sparing use of images. The large serif "One Manor Place" display text (fills ~400 px width) is used as a typographic landmark at a scroll point, not as a heading in the traditional sense. The dark forest-green section creates a strong visual stop, signaling the CTA.

**Long-text handling.** Monospace is physically wider per character than proportional typefaces — at 14 px, a longer Catalan sentence will take significantly more horizontal space. In a single-column layout this means more line wraps rather than overflow, which is acceptable, but worth monitoring. The display heading (brand name) is in a proportional serif and won't be affected by locale text length.

**A11y concerns to avoid.**
- Body text at 14 px (monospace) is tight — not technically a WCAG failure, but small for body copy. Plan for ≥ 16 px for Somi's body text.
- Sticky nav needs a visible focus indicator — verify this works in keyboard-only navigation.
- Forest-green `#2E513E` used as a background: white text on it needs verification (it should pass, but confirm: white on `#2E513E` is ~6.5:1 — fine).

---

### 5 · Works in Progress — worksinprogress.co

| Attribute | Value |
|---|---|
| Platform | Custom (WordPress-like CMS) |
| Content max-width | max-width 1472 px; at ~711 px viewport, full-width single column |
| Column count | 1 at mobile; multi-column at desktop (not captured at this viewport) |
| Body font | GT America Mono Light, 12 px, line-height 19.2 px, 400 |
| Heading type | Dual: H1 in GT America Mono Light 48 px/400; article titles in "Editor-Bold" (serif), 28 px/400 |
| Section bg treatment | Warm cream `#FFF7F4` page ground; individual article cards in vivid accent colors: indigo `#363B8F`, yellow `#F4D06F`, sage `#CEE0DC`, red `#E20A39`, black, pink `#F8E6EA`, periwinkle `#D8D9F1` |
| Nav | Static (not sticky) |

**Visual pacing.** The warm cream ground unifies everything; the colorful article cards create rhythm as you scroll — each card's accent color signals its topic cluster. The full-bleed hero image at the top is the only heavy element; the rest of the page alternates between image-topped cards and smaller text cards, producing a medium-weight, varied pacing. The page breathes without feeling empty.

**Long-text handling.** GT America Mono is wide per character — at 12 px it's unusually compact in size but generous in horizontal footprint. The card grid (multi-column at desktop) means longer article titles in Catalan would push card heights out of sync. Their approach at this viewport (single column) is more forgiving. The technique of giving each card a distinct background color means you can vary card height freely — they don't need to align.

**A11y concerns to avoid.**
- Body text at 12 px is below the comfortable reading threshold and arguably fails spirit-of-WCAG even if not technically — WCAG 1.4.4 (resize) is met, but the starting size is too small for Somi.
- Some article card accent colors (red `#E20A39`, indigo) need contrast checks against any text placed on them.
- Cookie consent banner present — required by EU law; their honest self-deprecating copy ("Cookie banners are ugly…") is a nice approach.

---

### 6 · Bodeyco — bodeyco.com

| Attribute | Value |
|---|---|
| Platform | Custom (Webflow-like; animated page transitions) |
| Content max-width | ~711 px at this viewport; full-bleed imagery |
| Column count | 1 column; portfolio-style with full-viewport image |
| Body font | Abc Diatype (geometric sans-serif), 12 px, **700** (bold body text — unusual) |
| Heading type | No HTML headings found; brand name and project titles are typeset as body text |
| Section bg treatment | White `#FFF` dominant; near-white `#F9F9F9` subtle; pink `#FFDEDE` accent (likely for one state/panel) |
| Nav | Horizontal text at top-left (brand) and top-right (links) — not sticky |

**Visual pacing.** Extremely light. A single large photograph occupies most of the viewport; small metadata text sits at the bottom. The whitespace above the image (before scrolling) is deliberate — slow, contemplative pacing. Zero section alternation; the entire page reads as a single surface. A project counter (`013 | 001`) at bottom-right is the only navigational affordance.

**Long-text handling.** Almost no running text — the site avoids the problem entirely. Any metadata labels are very short (project name, series title). Not a useful model for a text-heavy page like Somi, but the principle of committing to a very small text footprint to preserve visual weight is transferable.

**A11y concerns to avoid.**
- No semantic heading structure (no `<h1>` through `<h6>`).
- Body text at 12 px bold is technically readable but below comfortable size.
- Full-bleed photography requires descriptive alt text — portfolio sites frequently omit this.
- Animated page transitions need `prefers-reduced-motion` gating.

---

## Cross-site patterns: what to carry into D2

**On type scales.** Three of the six sites use a dual-typeface system (display/serif for headings, mono for body). Two use a single custom sans throughout. Somi currently has Lexend only — a single-family system is simpler to maintain and more i18n-friendly (monospace takes ~30% more horizontal space per character, amplifying the longer-locale problem). Decision: keep single-family Lexend unless the brand conversation changes.

**On section rhythm.** The strongest pages (KW, Works in Progress) use a consistent ground color for the whole page and introduce accent colors as local signals within sections or cards — not as alternating section backgrounds. Alternating background colors every section (a common pattern) creates visual fatigue and makes translation-length differences more obvious. Consider: one ground, occasional accent panels for the CTA and any section that needs visual stop.

**On body text size.** Four sites use 12–15 px body text. For Somi, target 16–17 px — above average in this set, but appropriate for a text-heavy trilingual page where copy needs to be readable in Catalan, Spanish, and English without feeling cramped.

**On nav.** Three sites have no sticky nav at all; one is sticky. A single-scroll page with six anchor sections benefits from a sticky or scroll-triggered nav — it lets the visitor jump between sections without returning to the top. Worth deciding in D2 before coding.

**On visual pacing and images.** The lightest-feeling sites (p-o.space, omp.dentist, bodeyco) use very few images. The heaviest-feeling ones (socialserviceclub.io) use full-bleed photographs in every section. Somi's content doesn't yet include images — the design should work as a text-only layout and treat any future images as an enhancement, not a requirement.

**On font-weight for headings.** KW Berlin uses 400 weight even at large heading sizes (flat, editorial feel). Works in Progress uses a bold-named serif ("Editor-Bold") at 400 weight. omp.dentist uses serif at 400. The Lexend variable axis goes 100–900 — a section heading at weight 600 with body at 300 gives a readable hierarchy without needing a second typeface.

---

## D1 decisions locked (confirmed after review)

| Topic | Decision |
|---|---|
| Body text size | **16 px** |
| Nav | **Sticky/static header.** May shrink slightly past a scroll threshold if it feels right, but no mega-menu, no hide-on-scroll, no complexity |
| Section rhythm | **One ground color, local accent panels** for CTAs and visual stops — no full alternating-section pattern |
| Type system | **Single family: Lexend.** Bold-weight phrases (e.g. "Connection · Community · Creativity" at weight 700–900) and dramatic display uses (hero text at 900) are in-family flair to explore in D4, not a second typeface |
| Images & illustrations | **Text-only layout first.** Brand-color illustrations and photography arrive later as an enhancement layer — the design must work without them |
