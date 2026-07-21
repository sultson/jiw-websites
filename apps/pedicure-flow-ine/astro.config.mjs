import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pedicureflowine.jouwidealewebsite.nl',
  trailingSlash: 'never',
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'nl',
        locales: { nl: 'nl-NL', en: 'en-GB' },
      },
    }),
  ],
});
