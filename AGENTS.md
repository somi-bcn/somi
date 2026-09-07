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
