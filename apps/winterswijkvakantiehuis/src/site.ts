/* Everything that changes when winterswijkvakantiehuis.nl goes live lives here.
   Imported by the app, by the prerender step (through the SSR bundle) and by the
   Worker, so the cutover is this file plus the routes in wrangler.jsonc — no
   hunting for hardcoded hostnames in canonicals, sitemaps or e-mail templates. */
/* The apex is canonical. www and the jouwidealewebsite subdomain both 301 here,
   so every canonical, hreflang, sitemap entry and e-mail link points at one
   host and the indexing signals are not split across three. */
export const SITE_URL = 'https://winterswijkvakantiehuis.nl';
export const SITE_NAME = 'Winterswijk Vakantiehuis';
/** The address the site shows guests, and the reply-to hint in the confirmation. */
export const CONTACT_EMAIL = 'achterhoekbooking@gmail.com';

/**
 * The logo in the confirmation e-mail. Deliberately a PNG outside public/img:
 * the site's own images are WebP, which Outlook on Windows still does not
 * render, and scripts/optimize-images.ts only ever touches public/img — so this
 * file cannot be converted out from under the mail template. 240px wide for a
 * 120px render. scripts/prerender.mjs asserts it is in the build.
 */
export const EMAIL_LOGO_PATH = '/logo-email.png';
export const EMAIL_LOGO_WIDTH = 120;

/** The site's palette, as the confirmation e-mail needs it (see index.css). */
export const BRAND_COLORS = {
  pageBackground: '#f7f4ec',
  surface: '#ffffff',
  surfaceAlt: '#fbf8f1',
  border: '#efe7d8',
  ink: '#1f4a37',
  onInk: '#f7f4ec',
  inkSoft: '#44403c',
  muted: '#78716c',
  mutedSoft: '#57534e',
  accent: '#d98b4a',
  /* Green button with white text rather than the orange accent: white on
     #d98b4a is about 2.7:1, which is not enough for 14px bold. */
  button: '#2f6b4f',
  onButton: '#ffffff',
};
