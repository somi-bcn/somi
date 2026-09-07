// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

import { projectId, dataset } from './sanity.constants';

// rolldown-vite drops the named exports when it converts `react-compiler-runtime`
// (CJS) to ESM, so `@sanity/ui`'s `import { c } from 'react-compiler-runtime'` in
// the embedded Studio's Visual Editing resolves to nothing and the island fails
// to hydrate. Redirect the bare specifier to a shim that re-exports the members
// explicitly; the regex keeps the shim's own subpath import unaliased.
const reactCompilerRuntimeShim = fileURLToPath(
  new URL('./src/shims/react-compiler-runtime.mjs', import.meta.url),
);

// The config file runs before Astro loads `.env`, so read it ourselves. The
// read token is required at build and at runtime: builds fetch published
// content with it, and draft-mode preview validates its secret against the
// dataset. Fail loudly rather than shipping a site that renders nothing.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
if (!env.SANITY_API_READ_TOKEN) {
  throw new Error(
    'SANITY_API_READ_TOKEN is not set. Add it to .env locally and to the Netlify site environment.',
  );
}

// https://astro.build/config
export default defineConfig({
  site: 'https://somibcn.org',
  output: 'server',
  adapter: netlify(),
  i18n: {
    defaultLocale: 'ca',
    locales: ['ca', 'es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sanity({
      projectId,
      dataset,
      apiVersion: '2024-11-01',
      useCdn: true,
      studioBasePath: '/admin',
      studioRouterHistory: 'hash',
      stega: { studioUrl: '/admin' },
    }),
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Keep the embedded Studio from loading duplicate React / styled-components.
      dedupe: ['react', 'react-dom', 'react-is', 'styled-components'],
      alias: [{ find: /^react-compiler-runtime$/, replacement: reactCompilerRuntimeShim }],
    },
    // Pre-bundle the Visual Editing subtree so the shim is inlined into it
    // rather than discovered lazily from an already-optimized chunk.
    optimizeDeps: {
      include: ['@sanity/visual-editing', '@sanity/visual-editing/react'],
    },
  },
});
