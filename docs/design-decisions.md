# Somi Design Decisions

Compact reference for colours, type, layout, and component tokens.
Source of truth for Claude sessions — read this instead of re-reading the full Design Reference artifact.

Artifact: https://claude.ai/code/artifact/f4318f6d-29eb-4b88-a47d-ff7913735fdf

---

## Colours

### Brand tokens (CSS custom properties)
```css
--color-red:    #B1302D
--color-ink:    #110E0C
--color-chalk:  #F7F4F0
--color-ground: #EFE3DE
--color-yellow: #F0CE31
--color-teal:   #63A4AF
--color-olive:  #4D5233
--color-orange: #CA5D08
```

### Section rhythm
| Section    | Background | Foreground | Contrast |
|------------|-----------|------------|----------|
| Hero       | #B1302D   | #EFE3DE    | 5.75 : 1 |
| Ethos      | #EFE3DE   | #110E0C    | 15.31 : 1 |
| Activities | #EFE3DE   | #110E0C    | 15.31 : 1 |
| Join       | #F0CE31   | #110E0C    | 12.43 : 1 |
| Residency  | #63A4AF (heading band) → #EFE3DE (body) | #110E0C | 6.83 : 1 heading |
| About      | #EFE3DE   | #110E0C    | 15.31 : 1 |
| Footer     | #4D5233   | #F7F4F0    | 7.45 : 1 |

### Decorative pairings (no text contrast rules)
- Orange on ground — botanical ornament, section dividers
- Yellow on red — hero ornament (4.08 : 1, decorative only)
- Red on yellow — Join section ornament (4.08 : 1, decorative only)
- Ground on olive — footer (6.50 : 1, AAA large display text)
- Yellow sun on ground — needs orange stroke border to separate; on red/olive reads freely

---

## Typography

**Font:** Lexend (Google Fonts) — weights 300, 400, 500, 600, 700

### Type scale
| Role         | Size (clamp)                              | Weight | lh   | ls        | Other           |
|-------------|-------------------------------------------|--------|------|-----------|-----------------|
| H1 / Hero   | `clamp(3rem, 2.25rem + 3.9vw, 4.5rem)` (48–72 px) | 700 | 1.05 | −0.02em | `text-wrap: balance` |
| H2 / Section | `clamp(1.75rem, 1.5rem + 1.3vw, 2.125rem)` (28–34 px) | 500 | 1.2 | −0.015em | |
| H3 / Subsection | `clamp(1.25rem, 1.15rem + 0.52vw, 1.44rem)` (20–23 px) | 500 | 1.35 | — | |
| Body        | `clamp(1rem, 0.95rem + 0.26vw, 1.125rem)` (16–18 px) | 400 | 1.65 | — | max-width 58ch |
| Label       | 0.6875rem (11 px)                         | 700    | —    | 0.12em    | uppercase |

### Spacing scale
`1 / 1.25 / 1.75 / 3 / 6 rem`

| Context               | Value                 |
|----------------------|-----------------------|
| After H1             | `margin-bottom: 3rem` |
| After H2             | `margin-bottom: 1.75rem` |
| After H3             | `margin-bottom: 1rem` |
| Between paragraphs   | `margin-bottom: 1.25rem` |
| Section vertical pad | `padding-block: 6rem` |
| Layout item gap      | `gap: 1.75–3rem`      |

---

## Hero section

```css
.hero__tagline {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-block-end: 1.25rem;
}
```

Tagline renders as a small uppercase label above the H1. Colour inherits from the hero section (chalk on red).


## Layout

### Containers
| Container     | CSS                                                         | Notes |
|--------------|-------------------------------------------------------------|-------|
| Hero         | `width: 100%; overflow: hidden`                             | Full-bleed, outside page wrapper |
| Page wrapper | `max-width: 1280px; margin-inline: auto; padding-inline: clamp(1rem, 5vw, 2.5rem)` | All non-hero sections |
| Prose column | `width: min(70ch, 100%)`                                    | Text-only content — WCAG 1.4.10 reflow safe |

### Breakpoints
- `@media (max-width: 600px)` — single-column reflow for teal grid, specimen rows, a11y rows
- `@media (max-width: 620px)` — deco grid collapses to 2 col
- `@media (max-width: 400px)` — deco grid single col, body padding 40px 18px

---

## Site Header (Nav)

```css
/* Actual implementation in src/styles/global.css */
.site-nav__wordmark {
  color: var(--color-red);
  white-space: nowrap;
  flex-shrink: 0;
  text-decoration: none;
}
.site-nav__wordmark svg {
  display: block;
  width: 2.75rem;
  height: auto;
  transform: translateY(-3px);
}
```

| Token              | Value                                        | Notes |
|--------------------|----------------------------------------------|-------|
| Height             | 56px                                         | Starting value; adjust once real content in place |
| Position           | `sticky; top: 0; z-index: 50`               | |
| Background         | `var(--color-ground)` / #EFE3DE             | Subtle bottom border separates from content |
| Wordmark (SVG)     | `width: 2.75rem; height: auto`              | No width/height on SVG element itself |
| Wordmark colour    | `fill="currentColor"` → parent `color: var(--color-red)` | |
| Wordmark lift      | `transform: translateY(-3px)`               | Optical alignment with anchor link caps |
| Anchor links       | 11.5px · weight 500 · ls 0.04em · opacity 0.75 | |
| Hamburger bp       | TBD                                          | Decide once real link text is in place |
| Locale switcher    | `ca` `/` · `cast` `/es` · `en` `/en`        | Right-aligned, always visible |

### SVG wordmark markup
```html
<a class="site-nav__wordmark" href="/">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2165 982"
       fill="currentColor" aria-label="Somi">
    <use href="#sp"/>
  </svg>
</a>
```
Favicon: `public/favicon.svg` (512×512, stroke-width 16, `fill="currentColor"`)

---

## Tech Stack

- **Framework:** Astro 7
- **CMS:** Sanity 6
- **CSS:** Tailwind 4 + custom properties in `src/styles/global.css`
- **Hosting:** Netlify
- **Locales:** Catalan `/` (default) · Spanish `/es` · English `/en`

---

## Content model (Sanity)

_Expand as schema evolves._

---

## Pending / TBD

- Nav hamburger breakpoint — TBD once real link text is in place
