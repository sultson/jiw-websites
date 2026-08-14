// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { lastmodFor } from './scripts/content-lastmod.mjs';

// Static multi-page output. English lives at the root; nl/de/fr/es/it/pt/zh/ru
// are 1:1 mirrors under their own prefix. Flat HTML output lets Cloudflare Pages
// serve the canonical no-trailing-slash URLs without an extra normalization
// redirect. Keep the locale list here in sync with LANGS in src/lib/i18n.ts.
export default defineConfig({
  site: 'https://www.expat-relocation.nl',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      // The privacy policy is meta noindex in every language. Submitting a
      // noindex URL asks Google to spend crawl budget on a page it is then told
      // to drop, and it lands in the "Discovered - currently not indexed" report.
      filter: (page) => !page.replace(/\/$/, '').endsWith('/privacy-policy'),
      // Must list every locale and use the same language codes as the in-page
      // <link rel="alternate"> tags. A partial list leaves the missing locales
      // with no alternates at all, and region codes here against bare language
      // codes in the markup gives Google two disagreeing annotation sets.
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          nl: 'nl',
          de: 'de',
          fr: 'fr',
          es: 'es',
          it: 'it',
          pt: 'pt',
          zh: 'zh',
          ru: 'ru',
        },
      },
      serialize(item) {
        const lastmod = lastmodFor(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
