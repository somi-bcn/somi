# somi

Single-page trilingual site for Somi, Barcelona. Astro 7 and Sanity 6, deployed on Netlify.
Catalan is the default locale at `/`, with `/es` and `/en`.

The build plan, version pins, and content model live in `docs/plan.md`. Read it before starting a phase.

## Toolchain

Node 24 (`.nvmrc`) and pnpm 11.25.0, installed standalone. Corepack is deliberately disabled;
do not re-enable it or install pnpm through npm.

Verify every change with `pnpm lint`, `pnpm check`, and `pnpm build`. All three must pass.

## Identifiers

- Sanity organization `o0kbzk1yj`, project `somi` (`7baiygyd`), dataset `production`, public
- GitHub `somi-bcn/somi`, public, default branch `main`

## Working with the owner

The owner is non-technical and edits only through the Sanity Studio. Never design a workflow
that requires them to touch the repo, a terminal, or git.

## Design system

The token system lives in `src/styles/global.css` — a long comment block above `@theme` documents colour roles, verified AAA contrast ratios, section rhythm, type scale, and spacing. Read those comments before touching colours or type. Canonical decisions (rationale, open items) are in `docs/design-decisions.md`.

Key files:
- `src/styles/global.css` — `@theme` primitives + `@layer base` heading styles
- `src/components/HomePage.astro` — all six scroll sections; design work happens here
- `src/components/Logo.astro` — SVG wordmark component
- `docs/design-decisions.md` — text reference for all design decisions and open items

## Claude sessions

The **Somi Design Plan** (https://claude.ai/code/artifact/a065c03a-1227-4faf-8742-24e42582b92d) is a read-only guiding document — do not edit it under any circumstances.

The **Somi Design Reference** (https://claude.ai/code/artifact/f4318f6d-29eb-4b88-a47d-ff7913735fdf) is the visual reference artifact. Read the full current version before publishing any update to it.
