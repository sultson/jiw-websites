// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * One app, one landing page per domain. `SITE` picks which site in
 * src/sites/ is built; the output of each build is deployed to its own Worker
 * (see wrangler.<site>.jsonc), so every domain keeps its own canonical URLs,
 * sitemap and robots.txt.
 *
 * Keep this map in sync with the `previewDomain` in each src/sites/<id>/site.ts.
 */
/** @type {Record<string, string>} */
const SITE_URLS = {
  inburgeringsplichtig: 'https://inburgeringsplichtig.jouwidealewebsite.nl',
  partnerhereniging: 'https://partnerhereniging.jouwidealewebsite.nl',
};

const site = process.env.SITE ?? 'partnerhereniging';
const siteUrl = process.env.SITE_URL ?? SITE_URLS[site];

if (!siteUrl) throw new Error(`Unknown SITE "${site}". Add it to SITE_URLS in astro.config.mjs.`);

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'never',
  build: {
    // One request less on a page whose whole job is to load fast on mobile.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      // The thank-you and privacy pages are meta noindex. Listing a noindex URL
      // in the sitemap spends crawl budget on a page Google is then told to
      // drop, and it lands in "Discovered - currently not indexed".
      filter: (page) => !/\/(bedankt|thank-you|privacy)$/.test(page.replace(/\/$/, '')),
      i18n: {
        defaultLocale: 'nl',
        locales: { nl: 'nl-NL', en: 'en' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      // Vite only exposes PUBLIC_/VITE_ prefixed vars, and this one has to be
      // readable from module scope during the build.
      'import.meta.env.LANDER_SITE': JSON.stringify(site),
    },
  },
});
