import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

// One lead form, shared by the /werknemer and /werkgever pages. Only the name is
// required; everything else is optional. A hidden `profiel` field tells us which
// audience the aanvraag came from.
const formWorker = createFormWorker({
  formPath: '/api/forms/aanvraag',
  siteName: 'Het Kracht Collectief',
  ownerName: 'Het Kracht Collectief',
  senderName: 'Het Kracht Collectief',
  subjectPrefix: 'Nieuwe aanvraag Het Kracht Collectief',
  confirmationFollowUpSentence:
    'We nemen persoonlijk contact met u op om uw aanvraag door te nemen.',
  messageField: 'message',
  requireLastName: false,
  requireEmail: false,
  subjectFields: ['profiel'],
  emailFields: [
    { name: 'profiel', label: 'Type aanvraag' },
    { name: 'phone', label: 'Telefoon' },
    { name: 'address', label: 'Adres / woonplaats' },
  ],
});

const SITE_URL = 'https://het-kracht-collectief.jouwidealewebsite.nl';
const ROUTES = ['/', '/werknemer', '/werkgever'];
const ROBOTS_TXT = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${ROUTES.map(
  (path) => `  <url><loc>${SITE_URL}${path === '/' ? '/' : path}</loc></url>`,
).join('\n')}\n</urlset>\n`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/robots.txt') {
      return new Response(ROBOTS_TXT, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    if (url.pathname === '/sitemap.xml') {
      return new Response(SITEMAP_XML, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    if (url.pathname.startsWith('/api/')) {
      return formWorker.fetch!(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
