// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Static, multi-page output (best for SEO / per-treatment ranking surface).
// The Cloudflare Worker (worker/index.ts) wraps the static `dist/` assets and
// owns the /api/* form routes. NL lives at the root, EN under /en/.
export default defineConfig({
  site: 'https://omniadental.jouwidealewebsite.nl',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'nl',
        locales: { nl: 'nl-NL', en: 'en-US' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
