import { defineConfig } from 'astro/config';
import { defaultLang } from './tools/default-lang.mjs';

// Which language sits on `/` (DEFAULT_LANG in wrangler.jsonc); src/data/content.ts builds
// every route on it.
const DEFAULT_LANG = defaultLang();
globalThis.__DEFAULT_LANG__ = DEFAULT_LANG;

// The pages: one entrypoint per page type in src/routes, mounted at its URL in every
// language. Not one file per language, so the URLs follow DEFAULT_LANG; and not a single
// catch-all route either, because Astro bundles CSS per route and that handed every
// page the styles of every component.
const pages = {
  name: 'resq-pages',
  hooks: {
    'astro:config:setup': async ({ injectRoute }) => {
      const { routes, langs } = await import('./src/data/content.ts');
      for (const lang of langs) {
        for (const [key, pattern] of Object.entries(routes[lang])) injectRoute({ pattern, entrypoint: `./src/routes/${key}.astro` });
        injectRoute({ pattern: `${routes[lang].equipment}/[product]`, entrypoint: './src/routes/product.astro' });
      }
    },
  },
};

// sitemap.xml, robots.txt and llms.txt are endpoints in src/pages, built on SITE in
// src/data/content.ts; the sitemap integration could not pair pages whose slugs differ
// per language.
export default defineConfig({
  site: 'https://rescuewatercraft.eu',
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
  vite: { define: { __DEFAULT_LANG__: JSON.stringify(DEFAULT_LANG) } },
  integrations: [pages],
});
