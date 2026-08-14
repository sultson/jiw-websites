// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // The brand domain is the canonical one. www and the jouwidealewebsite
  // subdomain 301 here from the Worker so the three hostnames stop competing
  // as duplicates of each other.
  site: 'https://netherlandsunveiled.com',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
    // Emit /blog.html rather than /blog/index.html so the sitemap lists the
    // same extensionless URLs the pages declare as canonical.
    format: 'file',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
