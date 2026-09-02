# Somi — Stack Bootstrap Plan

This file is the canonical plan. The build plan, version pins, and content model live here.

## Current state

Phases 0 through 5 are done. The repository is `somi-bcn/somi`, private, one commit on `main`, and `pnpm lint`, `pnpm check`, and `pnpm build` all pass. Sanity project `7baiygyd` exists with a public `production` dataset and working tokens in `.env`, but nothing in the codebase talks to it yet — `astro.config.mjs` is still the bare scaffold default.

**Next: Phase 6.** It also carries one item deferred from Phase 5, a README setup section documenting `SANITY_API_READ_TOKEN` and `SANITY_API_WRITE_TOKEN`, which replaces the `.env.example` that was deliberately not created.

Read `AGENTS.md` at the repo root first; it holds the toolchain rules and conventions.

## Decisions locked

- Single scrolling page. `Home / Ethos / Activities / Join / Artistic Residency / About` are anchor sections, not routes.
- A repeatable `event` collection alongside the page content, driven by the brand manual's "Cartelera semanal". This is the owner's actual recurring task.
- Trilingual: `ca` default (unprefixed at `/`), `es` at `/es`, `en` at `/en`. Astro i18n with `prefixDefaultLocale: false`.
- Netlify, `output: 'server'` with `@astrojs/netlify`, required for draft-mode preview cookies.
- Sanity Studio embedded at `/admin`. Content lives in Sanity, never in git.
- Node 24 LTS, pnpm 11.25.0, no corepack.
- Naming: organizations are `somi-bcn` (GitHub and Sanity), projects and repos are `somi`. Production domain is `somibcn.org`.

## Version pins (verified against npm)

Runtime:

- `astro@^7.2.10`, `@astrojs/netlify@^8.2.5`, `@astrojs/react@^6.0.5`, `@astrojs/sitemap@^3.7.4`
- `sanity@^6.12.0`, `@sanity/astro@^3.5.1`, `@sanity/client@^8.4.0`, `@sanity/icons@^5.2.1`, `@sanity/visual-editing@^6.1.2`, `@sanity/preview-url-secret@^4.1.5`, `groq@^6.12.0`
- `@sanity/language-filter@^5.0.18`, `sanity-plugin-internationalized-array@^5.2.3` (skip its optional `@sanity/assist` peer)
- `react@^19.2.8`, `react-dom@^19.2.8`, `react-is@^19.2.8`, `styled-components@^6.5.3` — hard peers of `@sanity/astro`, not app code
- `tailwindcss@^4.3.3`, `@tailwindcss/vite@^4.3.3`

Dev:

- `typescript@6.0.3` — exact pin, no caret
- `@astrojs/check@^0.9.10`
- `vite@^8.2.2` — only because `astro.config.mjs` imports `loadEnv` from it; keep the major aligned with Astro's bundled `^8.0.13`
- `eslint@^10.9.1`, `@eslint/js@^10.0.1`, `typescript-eslint@^8.69.0`, `eslint-plugin-astro@^3.1.0`, `eslint-plugin-jsx-a11y@^6.10.2`, `eslint-config-prettier@^10.1.8`
- `prettier@^3.9.6`, `prettier-plugin-astro@^0.14.1`

## Content model

- `homePage` singleton — one field group per scroll section, all copy as `internationalizedArrayString` / `internationalizedArrayText`
- `event` document, repeatable — mixed translation: title and description internationalized, date/time/price/facilitator plain
- `siteSettings` singleton — address, social links, per-section SEO metadata

`structure/index.ts` needs a real `StructureResolver` that surfaces event creation as a top-level action rather than burying it under a page tree.

## Starting copy

Seed from `resources/Website.pdf`. All three locales get the same English text initially; translation happens later in the Studio.

- Hero, Radical tenderness, Join, Activities, Artistic Residency — only one draft exists, use it
- Ethos — the first, unlabelled draft
- About — the main-flow version

Other variants exist in `resources/Website.pdf` and can be swapped in Studio after owner review.

All of this is placeholder pending their sign-off; none of it is final copy.

## Brand tokens

Six colours into Tailwind `@theme` in `src/styles/global.css`:
`#EFE3DE` ground, `#F0CE31` yellow, `#B8322F` red, `#63A4AF` teal, `#CA5D08` orange, `#4D5233` olive.

Typeface: **Lexend** (SIL OFL 1.1), variable weight axis, standing in for Galvji. Measured against Galvji: x-height 0.525 vs 0.526, cap-height 0.700 vs 0.705, ratio 0.750 vs 0.747. Full Spanish and Catalan coverage including U+00B7. Loading strategy (self-hosted vs CDN) is a Phase 7 decision.

## Phases

### Phase 0 — Local prerequisites — DONE

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm config set manage-package-manager-versions true
nvm use 24 && node -v          # expect v24.16.0
gh auth login -h github.com    # current keyring token is invalid
gh auth status
```

pnpm installs standalone rather than through npm so it is not bound to a Node version. Node 24 must match `NODE_VERSION` in `netlify.toml` to avoid local/CI drift.

### Phase 1 — GitHub org — DONE

Browser only; `gh` cannot create organizations.

1. `github.com/organizations/plan`, Free plan. Unlimited private repos and collaborators.
2. Name it for the business, not for you — this gets handed over.
3. You are sole owner for now. The owner is invited in Phase 9.

Do not create the repository yet; Phase 5 creates and pushes it in one step.

### Phase 2 — Sanity project — DONE

Created: organization `o0kbzk1yj`, project `somi` = **`7baiygyd`**, dataset `production` with `aclMode: public`, CORS origin `http://localhost:4321` with credentials allowed. Production origins come in Phase 8.

Both tokens are in `.env`, which is gitignored. Their scopes were verified rather than assumed: the read token is refused `create` with a 403, the write token succeeds against a dry-run mutation.

Still owed to this phase: the project ID needs to reach `sanity.constants.ts` in Phase 6, as the single shared source imported by both `sanity.config.ts` and `astro.config.mjs`.

There is no `.env.example`; the README documents the two variables instead.

### Phase 3 — Scaffold — DONE

```bash
pnpm create astro@latest . --template minimal --no-install --no-git --no-ai --skip-houston --yes
```

create-astro v5 has no `--typescript` flag; strict is the default. Because `resources/` makes the directory non-empty, Astro scaffolds into a randomly-named subdirectory rather than in place — move its contents (including dotfiles) up to the project root and remove the empty folder.

No git work here. The repository is created at the end of Phase 5, so the first commit captures a complete, buildable scaffold.

### Phase 4 — Dependencies — DONE

```bash
pnpm add astro@^7.2.10 @astrojs/netlify@^8.2.5 @astrojs/react@^6.0.5 @astrojs/sitemap@^3.7.4 \
  @sanity/astro@^3.5.1 @sanity/client@^8.4.0 @sanity/icons@^5.2.1 \
  @sanity/visual-editing@^6.1.2 @sanity/preview-url-secret@^4.1.5 \
  sanity@^6.12.0 groq@^6.12.0 \
  @sanity/language-filter@^5.0.18 sanity-plugin-internationalized-array@^5.2.3 \
  react@^19.2.8 react-dom@^19.2.8 react-is@^19.2.8 styled-components@^6.5.3 \
  tailwindcss@^4.3.3 @tailwindcss/vite@^4.3.3
```

```bash
pnpm add -D typescript@6.0.3 @astrojs/check@^0.9.10 vite@^8.2.2 \
  eslint@^10.9.1 @eslint/js@^10.0.1 typescript-eslint@^8.69.0 \
  eslint-plugin-astro@^3.1.0 eslint-plugin-jsx-a11y@^6.10.2 eslint-config-prettier@^10.1.8 \
  prettier@^3.9.6 prettier-plugin-astro@^0.14.1 \
  @types/react@^19 @types/react-dom@^19 @types/react-is@^19
```

Then pin the toolchain: `echo "24" > .nvmrc` and set `"packageManager": "pnpm@11.25.0"` in `package.json`.

React and styled-components are Studio dependencies, not app code. No React is written for the site itself.

### Phase 5 — Config files — DONE

- `.nvmrc` — `24`
- `.prettierrc` — printWidth 120, single quotes, semicolons, `trailingComma: es5`, `prettier-plugin-astro` with an `*.astro` parser override
- `.prettierignore` — `node_modules/`, `dist/`, `.astro/`, `.netlify/`, `pnpm-lock.yaml`
- `.gitignore` — `node_modules/`, `dist/`, `.astro/`, `.netlify/`, `.env`, `.env.*`, `/resources`, debug logs, `.DS_Store`. Ignores `.vscode/*` while keeping `extensions.json` and `launch.json` tracked. Groups separated by blank lines, no section comments.
- `eslint.config.js` — ESLint 10 flat config assembled with `defineConfig` and `globalIgnores` from `eslint/config`. Do not use `tseslint.config`; `astro check` reports it as deprecated. Chains `@eslint/js` recommended, `typescript-eslint` recommended, `astro.configs['flat/recommended']`, `astro.configs['flat/jsx-a11y-recommended']`, and `eslint-config-prettier` last. The a11y rules arrive namespaced as `astro/jsx-a11y/*` because `eslint-plugin-astro` wraps `eslint-plugin-jsx-a11y` itself, so that plugin is never registered directly. `no-undef` is off for `.ts`, `.tsx`, and `.astro`, since TypeScript resolves identifiers and the rule cannot see ambient declarations. Ignores `.astro/**`, `dist/**`, `.netlify/**`, `src/env.d.ts`. Declares `console`/`process`/`URL` globals for `astro.config.mjs` and `scripts/**/*.mjs`.
- `tsconfig.json` — extends `astro/tsconfigs/strict`, `strictNullChecks: true`, `types: ["@sanity/astro/module"]`
- `netlify.toml` — `command = "pnpm build"`, `publish = "dist"`, `NODE_VERSION = "24"`
- `pnpm-workspace.yaml` — `allowBuilds` for `@parcel/watcher`, `esbuild`, `sharp`. pnpm 11 blocks build scripts by default; without this, sharp will not compile.
- `src/env.d.ts` — triple-slash references for `astro/client` and `@sanity/astro/module`
- `package.json` scripts — `dev`, `build`, `preview`, `check`, `lint`, `format`, `format:check`, `seed:sanity`. No bare `astro` passthrough.
- `README.md` — replaces the Astro boilerplate. Documents the two environment variables in place of a `.env.example`, which is deliberately not created. Its Status section must be deleted once Phase 7 lands.
- `AGENTS.md` — toolchain rules, identifiers, and conventions, so a new session needs no re-briefing.

Verified before committing: `pnpm lint`, `pnpm check`, and `pnpm build` all pass against the default `astro.config.mjs`, since Sanity is not wired in yet.

The repository was then created, so the first commit holds the scaffold, `package.json`, `pnpm-lock.yaml`, and every config file — a complete working baseline rather than an empty shell:

```bash
git init
git add -A
git status          # confirm node_modules/ and resources/ are excluded
git commit          # "Init commit"
gh repo create somi-bcn/somi --private --source . --remote origin --push
```

`pnpm-lock.yaml` is `lockfileVersion: '9.0'`, which is current. The field describes the entry schema, not the pnpm release, and pnpm 9 through 12 all write it. Not something to "upgrade".

### Phase 6 — Sanity schema and Studio

- `sanity.constants.ts` — exports `projectId` and `dataset`
- `sanity.cli.ts` — `defineCliConfig` reading those constants
- `sanity.config.ts` — `structureTool`, `presentationTool` with `previewUrl.previewMode` pointing at `/api/draft-mode/enable` and `/disable`, `internationalizedArray` and `languageFilter` both configured with:

```ts
export const locales = [
  { id: 'ca', title: 'Català' },
  { id: 'es', title: 'Español' },
  { id: 'en', title: 'English' },
] as const;
```

with `defaultLanguages: ['ca']` and `fieldTypes: ['string', 'text']`.

- `schemaTypes/documents/homePage.ts` — singleton with a field group per scroll section
- `schemaTypes/documents/event.ts` — repeatable, mixed translated and plain fields
- `schemaTypes/documents/siteSettings.ts` — singleton
- `structure/index.ts` — `StructureResolver` listing the homepage singleton, site settings, and an events list with creation as a prominent action

### Phase 7 — Astro wiring

- `astro.config.mjs` — `output: 'server'`, Netlify adapter, Tailwind and sitemap, the `sanity()` integration with `studioBasePath: '/admin'`, `studioRouterHistory: 'hash'`, `stega.studioUrl: '/admin'`, and a startup guard that throws when `SANITY_API_READ_TOKEN` is absent. i18n block:

```js
i18n: {
  defaultLocale: 'ca',
  locales: ['ca', 'es', 'en'],
  routing: { prefixDefaultLocale: false },
}
```

- `vite.resolve.dedupe` for `react`, `react-dom`, `react-is`, `styled-components` to keep the Studio from loading duplicate copies
- `src/lib/sanity/locale.ts` — locale union type and path helper, `ca` as default
- `src/lib/sanity/queries.ts` — GROQ queries and result types
- `src/lib/sanity/getHomeContent.ts` — fetch wrapper switching perspective and stega on preview
- `src/lib/sanity/preview.ts` — preview cookie helper
- `src/pages/api/draft-mode/enable.ts` and `disable.ts` — `validatePreviewUrl` from `@sanity/preview-url-secret`, cookie set with `sameSite`/`secure` conditional on HTTPS
- `src/pages/index.astro` (ca), `src/pages/es/index.astro`, `src/pages/en/index.astro` — thin wrappers over a shared view component
- `src/styles/global.css` — Tailwind 4 entry plus `@theme` brand tokens
- `scripts/seed-content.mjs` — writes the starting copy into Sanity, run with `node --env-file=.env scripts/seed-content.mjs` via a `seed:sanity` package script. Uses `SANITY_API_WRITE_TOKEN`.

Seeding writes the same English text into all three locale slots of every `internationalizedArray` field, so `ca`, `es`, and `en` all render immediately and no section falls back to empty. Translation then happens in the Studio, replacing one locale at a time, with no code changes.

### Phase 8 — Netlify

1. Connect the GitHub repo. Build command `pnpm build`, publish directory `dist`.
2. Add `SANITY_API_READ_TOKEN` to environment variables; the build fails without it by design.
3. Add the `*.netlify.app` URL and the custom domain to Sanity CORS origins.
4. Verify the Studio loads at `/admin` in production and that Presentation preview round-trips.

### Phase 9 — Owner access and handoff

1. Invite them to the Sanity project.
2. Invite them to the GitHub org and Netlify team.
3. Write a one-page plain-English guide: how to log in, edit, publish, and add an event. No git, no terminal, no jargon.

## Open items

Blocking design, not the stack:

- Font. Lexend is the working choice, Sen the second, both pending the owner's confirmation. Galvji is Apple-licensed and cannot be self-hosted. Three things for that conversation: both have a single-storey `a` where Galvji's is double-storey, so they read more geometric and less humanist; **neither ships an italic** in its Google Fonts release, so the design should avoid italic or accept browser-synthesised oblique; and Sen's weight axis is 400-800 against Lexend's 100-900. If they want to stay closer to Galvji's humanist character, Noto Sans is the nearest overall match and keeps the double-storey `a`, with true italics.
- Owner sign-off on the seeded draft selections, particularly Ethos and About.
- Real `ca` and `es` translations. Seeding puts English in all three locales so nothing renders empty, but Catalan is the default locale serving `/`, so it is the first that should be genuinely translated. The Spanish brand copy uses inclusive `-e` forms (`nosotres mismes`, `soles`), which machine translation will flatten — this needs a human translator who shares that editorial stance.
- Netlify free-tier member limits, to verify before promising the owner an account.
