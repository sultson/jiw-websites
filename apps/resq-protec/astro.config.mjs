import { defineConfig } from 'astro/config';

// sitemap.xml, robots.txt and llms.txt are endpoints in src/pages, built on SITE in
// src/data/content.ts; the sitemap integration could not pair pages whose slugs differ
// per language.
export default defineConfig({
  site: 'https://rescuewatercraft.eu',
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
});
