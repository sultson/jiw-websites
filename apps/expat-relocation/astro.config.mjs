// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Static multi-page output. English lives at the root; de/nl/fr/es/ru are 1:1
// mirrors under their own prefix. Flat HTML output lets Cloudflare Pages serve
// the canonical no-trailing-slash URLs without an extra normalization redirect.
export default defineConfig({
  site: 'https://www.expat-relocation.nl',
  trailingSlash: 'never',
  build: {
    format: 'file',
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
