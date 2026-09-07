# somi

Website for Somi, Barcelona. A single page in three languages: Catalan (default), Spanish, English.

## Requirements

Node 24 and pnpm 11. `nvm use` reads `.nvmrc`. pnpm is installed standalone, not through Corepack.

## Local development

```sh
pnpm install
pnpm dev
```

| Command        | Action                             |
| :------------- | :--------------------------------- |
| `pnpm dev`     | Dev server on `localhost:4321`     |
| `pnpm build`   | Production build to `dist/`        |
| `pnpm preview` | Serve the production build         |
| `pnpm check`   | Type-check `.astro` and `.ts`      |
| `pnpm lint`    | ESLint                             |
| `pnpm format`  | Prettier, rewriting files in place |

## Environment

`.env` lives in the project root, is gitignored, and holds two tokens from
sanity.io/manage to somi to API to Tokens:

- `SANITY_API_READ_TOKEN` — Viewer. Used by builds and by draft-mode preview.
- `SANITY_API_WRITE_TOKEN` — Editor. Local only, used by the seed script. Never add it to Netlify.

## Sanity

Project `somi` (`7baiygyd`), dataset `production`, public. All copy lives in Sanity rather than
the repo, so the owner edits the site without touching code. The Studio is embedded in this app
at `/admin`. Local development needs `http://localhost:4321` in the project's CORS origins.

## Netlify

Deploys `main`. Build settings live in `netlify.toml`, not the dashboard, so change them there.
`SANITY_API_READ_TOKEN` must be set in the site environment.

## Astro

Server output through the Netlify adapter, required for draft-mode preview cookies.
Routes are `/` for Catalan, `/es`, and `/en`. The three locale pages share
`src/components/HomePage.astro`, which reads the `homePage` singleton from Sanity.

Run `pnpm seed:sanity` once after cloning (or after a dataset reset) to populate the
starting copy; the pages render empty sections until the document exists.
