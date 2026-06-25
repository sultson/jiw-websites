// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://netherlandsunveiledtours.jouwidealewebsite.nl',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [sitemap()],
});
