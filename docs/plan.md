# Somi — Stack Bootstrap Plan

This file is the canonical plan. The build plan, version pins, and content model live here.

## Current state

Phases 0 through 8 are done. The repository is `somi-bcn/somi`, public, on `main`, and `pnpm lint`, `pnpm check`, and `pnpm build` all pass. Sanity project `7baiygyd` exists with a public `production` dataset and working tokens in `.env`. The Sanity schema, Studio config, and structure resolver are in place. `astro.config.mjs` is wired to Sanity: server output with the Netlify adapter, i18n routing, embedded Studio at `/admin`, Tailwind 4, sitemap, and draft-mode preview. The three locale pages render the `homePage` singleton through a shared component. Run `pnpm seed:sanity` once to populate the starting copy. The site is live at `https://somi-bcn.netlify.app`, deploying from `main`.

**Next: point the custom domain at Netlify, then Phase 9 (owner access and handoff).**


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
- `sanity@^6.12.0`, `@sanity/astro@^3.5.1`, `@sanity/client@^8.4.0`, `@sanity/icons@^5.2.1`, `@sanity/preview-url-secret@^4.1.5`, `@sanity/visual-editing@^5.7.3`, `groq@^6.12.0`
- `@sanity/visual-editing` must track `@sanity/astro@3.5.1`'s own range (`^5.5.0`), **not** `^6.x` — a v6 direct pin installs a second major version alongside `@sanity/astro`'s v5 and breaks dep pre-bundling. It is a direct dep only so `optimizeDeps.include` can name it.
- `react-compiler-runtime@1.0.0` (exact) — direct dep only to make the shim's subpath import resolvable. rolldown-vite (Vite 8) converts this CJS package to ESM without its named exports, so `@sanity/ui`'s `import { c } from 'react-compiler-runtime'` (embedded Studio Visual Editing) fails; `src/shims/react-compiler-runtime.mjs` re-exports the members and is aliased in for the bare specifier. Remove the shim + pin if `@sanity/ui` ships an ESM-clean build or rolldown-vite fixes the interop.
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

- `homePage` singleton — one `object` field per scroll section (`hero`, `ethos`, `activities`, `join`, `residency`, `about`), each rendered as a collapsible card, expanded by default. Section fields are `heading` / `body` (`join` also has `cta`), all copy as `internationalizedArrayString` / `internationalizedArrayText`. GROQ shape: `homePage{ hero{heading,subheading}, ethos{heading,body}, … }`.
- `event` document, repeatable — mixed translation: title and description internationalized, date/time/price/facilitator plain. Not queried or rendered yet; editable in Studio.
- `siteSettings` singleton — address, social links, per-section SEO metadata

`structure/index.ts` has a `StructureResolver` that surfaces event creation as a top-level action rather than burying it under a page tree.

## Starting copy

Seeded from `resources/Website.pdf` by `scripts/seed-content.mjs` (`pnpm seed:sanity`). All three locales get the same English text initially; translation happens later in the Studio. Re-running overwrites the document, so it is a one-time bootstrap, not a sync.

- Hero, Join, Activities, Artistic Residency — only one draft exists, use it
- Ethos — the first, unlabelled draft
- About — the main-flow version
- "Radical tenderness" has no field in the current schema and is not seeded; fold it into Ethos or add a field if the owner wants it standalone

Other variants exist in `resources/Website.pdf` and can be swapped in Studio after owner review.

All of this is placeholder pending their sign-off; none of it is final copy.

## Brand tokens

Six colours into Tailwind `@theme` in `src/styles/global.css`:
`#EFE3DE` ground, `#F0CE31` yellow, `#B8322F` red, `#63A4AF` teal, `#CA5D08` orange, `#4D5233` olive.

Typeface: **Lexend** (SIL OFL 1.1), variable weight axis, standing in for Galvji. Measured against Galvji: x-height 0.525 vs 0.526, cap-height 0.700 vs 0.705, ratio 0.750 vs 0.747. Full Spanish and Catalan coverage including U+00B7. Self-hosted (Phase 7 decision): the variable woff2 (latin + latin-ext) from `@fontsource-variable/lexend` is committed under `public/fonts/`, `@font-face` with `font-display: swap` in `global.css`, no third-party request (GDPR-clean for an EU site).

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
  @sanity/preview-url-secret@^4.1.5 @sanity/visual-editing@^5.7.3 \
  sanity@^6.12.0 groq@^6.12.0 \
  @sanity/language-filter@^5.0.18 sanity-plugin-internationalized-array@^5.2.3 \
  react@^19.2.8 react-dom@^19.2.8 react-is@^19.2.8 react-compiler-runtime@1.0.0 styled-components@^6.5.3 \
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

### Phase 6 — Sanity schema and Studio — DONE

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

### Phase 7 — Astro wiring — DONE

Scope was semantic wiring only: real Sanity content in semantic HTML through the i18n routes and the preview pipeline, with brand tokens available. Visual design is deferred (blocked on font and copy sign-off). Events are editable in Studio but not queried or rendered.

- `astro.config.mjs` — `output: 'server'`, Netlify adapter, Tailwind (`@tailwindcss/vite`) and sitemap, the `sanity()` integration with `studioBasePath: '/admin'`, `studioRouterHistory: 'hash'`, `stega.studioUrl: '/admin'`, `useCdn: true`, `apiVersion: '2024-11-01'`. `react()` is added for the embedded Studio and Visual Editing overlays. The startup guard reads `.env` with vite's `loadEnv` (the config file runs before Astro loads `.env`) and throws when `SANITY_API_READ_TOKEN` is absent. `site: 'https://somibcn.org'` for the sitemap. i18n block:

```js
i18n: {
  defaultLocale: 'ca',
  locales: ['ca', 'es', 'en'],
  routing: { prefixDefaultLocale: false },
}
```

- `vite.resolve.dedupe` for `react`, `react-dom`, `react-is`, `styled-components` to keep the Studio from loading duplicate copies
- `vite.resolve.alias` maps the bare specifier `react-compiler-runtime` (regex `/^react-compiler-runtime$/`, so the shim's own subpath import is untouched) to `src/shims/react-compiler-runtime.mjs`, which re-exports the CJS members explicitly — works around rolldown-vite dropping the named exports. `vite.optimizeDeps.include` lists `@sanity/visual-editing` and `@sanity/visual-editing/react` so the shim is inlined into that pre-bundle rather than discovered lazily.
- `src/lib/sanity/locale.ts` — `Locale` union, `defaultLocale`, `localePath` helper, and `pickLocale` to resolve one locale's value out of an `internationalizedArray` (falls back to `ca` then the first entry)
- `src/lib/sanity/queries.ts` — `homeContentQuery` (nested section shape) and the `HomeContent` / `IntlArray` types
- `src/lib/sanity/getHomeContent.ts` — uses `sanityClient` from `sanity:client`; in preview it `withConfig`s the read token, `perspective: 'drafts'`, and stega pointed at `/admin`
- `src/lib/sanity/preview.ts` — `PREVIEW_COOKIE`, `isPreview`, `setPreviewCookie` (`sameSite`/`secure` conditional on HTTPS), `clearPreviewCookie`
- `src/pages/api/draft-mode/enable.ts` and `disable.ts` — `validatePreviewUrl` from `@sanity/preview-url-secret` against a token-scoped `sanityClient`, then set the cookie and redirect
- `src/pages/index.astro` (ca), `src/pages/es/index.astro`, `src/pages/en/index.astro` — three-line wrappers passing `locale` to `src/components/HomePage.astro`
- `src/components/HomePage.astro` — shared view: fetches content, renders the six sections as semantic HTML. Each body is one `<p class="whitespace-pre-line">` rather than split into separate `<p>` tags per blank-line paragraph — splitting fragments Sanity's stega encoding, which is appended once to the whole field string, breaking Visual Editing's overlay attribution. Mounts `<VisualEditing enabled={preview} />` and an exit-preview link.
- `src/styles/global.css` — Tailwind 4 entry, self-hosted Lexend variable `@font-face` (latin + latin-ext, `font-display: swap`), `@theme` with `--font-sans` and the six brand colours
- `public/fonts/lexend-latin.woff2`, `public/fonts/lexend-latin-ext.woff2` — from `@fontsource-variable/lexend`, committed
- `scripts/seed-content.mjs` — `createOrReplace` the `homePage` singleton with the starting copy, then delete `drafts.homePage`. Run via `pnpm seed:sanity` (`node --env-file=.env`), uses `SANITY_API_WRITE_TOKEN`. Each internationalizedArray entry is `{ _key: <uuid>, _type: 'internationalizedArray{String,Text}Value', language: '<locale>', value }` — the locale is on `language`, and `pickLocale` reads it from there.

Seeding writes the same English text into all three locale slots of every `internationalizedArray` field, so `ca`, `es`, and `en` all render immediately and no section falls back to empty. Translation then happens in the Studio, replacing one locale at a time, with no code changes.

The read token is exposed to server code as `import.meta.env.SANITY_API_READ_TOKEN` (SSR only, never shipped to the client). The `homePage` document must exist for the pages to show anything — run `pnpm seed:sanity` after a fresh dataset or a schema reset.

`pnpm check`, `pnpm lint`, and `pnpm build` pass. Not yet verified: actual hover/click behavior in the embedded Presentation tool in a real browser — open `/admin/presentation`, hover each section's heading and body, and confirm the border wraps the full field and clicking opens the right field in the edit panel.

### Phase 8 — Netlify — DONE pending custom domain and a browser check

Site `somi-bcn` at `https://somi-bcn.netlify.app`, built from `somi-bcn/somi` on `main` via `netlify.toml` (`pnpm build`, publish `dist`). `SANITY_API_READ_TOKEN` is set as a production environment variable. The Netlify URL is in Sanity's CORS origins with credentials allowed, alongside the two localhost entries. `/`, `/es`, `/en` all render real content; `/admin` redirects to `/admin/` and serves the Studio shell.

Not yet done: the custom domain `somibcn.org` (DNS not pointed at Netlify yet), and a real-browser check that Presentation preview round-trips in production the way it does locally.

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
