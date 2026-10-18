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

// krachtcollectief.nl is the one canonical host. www and the old concept
// address 301 onto it so Google sees one site, not three copies.
const CANONICAL_HOST = 'krachtcollectief.nl';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return formWorker.fetch!(request, env, ctx);
    }

    // Gated on https: `wrangler dev` hands the Worker the custom-domain host over
    // http, and redirecting there would bounce local dev to production.
    const isRead = request.method === 'GET' || request.method === 'HEAD';
    const wrongHost = url.protocol === 'https:' && url.hostname !== CANONICAL_HOST;
    const trailingSlash = url.pathname.length > 1 && url.pathname.endsWith('/');
    if (isRead && (wrongHost || trailingSlash)) {
      if (wrongHost) url.hostname = CANONICAL_HOST;
      if (trailingSlash) url.pathname = url.pathname.replace(/\/+$/, '');
      return Response.redirect(url.toString(), 301);
    }

    // Pages, sitemap.xml and robots.txt are static files from the prerender.
    // Unknown paths get dist/404.html with a real 404 status.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
