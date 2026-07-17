import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://resqprotec.jouwidealewebsite.nl',
  integrations: [sitemap()],
  build: { format: 'file' },
  compressHTML: true,
});
