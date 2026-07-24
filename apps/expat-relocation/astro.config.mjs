// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Static multi-page output. English lives at the root; de/nl/fr/es/ru are 1:1
// mirrors under their own prefix. The Cloudflare Worker (worker/index.ts)
// wraps the static `dist/` assets and owns the /api/forms/* routes.
export default defineConfig({
  site: 'https://expat-relocation.jouwidealewebsite.nl',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          de: 'de-DE',
          nl: 'nl-NL',
          fr: 'fr-FR',
          es: 'es-ES',
          ru: 'ru-RU',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
