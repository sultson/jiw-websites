import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { winterswijkConfirmationEmail } from './confirmation-email';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* The contact form used to open WhatsApp with a prefilled message. It now posts
   here instead: the lead lands as e-mail at LEAD_RECIPIENT and the guest gets a
   confirmation in the language the site was in. The WhatsApp and call buttons
   elsewhere on the site are untouched — only the form changed.

   No Turnstile: this is a short, low-value-to-spammers holiday enquiry form and
   there is no widget on the page. The hidden `company` honeypot silently
   swallows bot submissions instead. */
const formWorker = createFormWorker({
  formPath: '/api/forms/contact',
  siteName: 'Winterswijk Vakantiehuis',
  senderName: 'Winterswijk Vakantiehuis',
  subjectPrefix: 'Nieuwe aanvraag Winterswijk Vakantiehuis',
  // The package's default notification wording is written for quote requests
  // ("Nieuwe offerteaanvraag", "Projectomschrijving"); this is a booking enquiry.
  leadEmail: {
    heading: 'Nieuwe aanvraag voor Winterswijk Vakantiehuis',
    messageHeading: 'Bericht van de gast',
    nameLabels: {firstName: 'Voornaam', lastName: 'Achternaam', email: 'E-mailadres'},
  },
  turnstile: false,
  honeypotField: 'company',
  confirmationEmail: winterswijkConfirmationEmail,
  messageField: 'message',
  // The site asks for one "Naam" field; the client splits it, so a single-word
  // name leaves the surname empty.
  requireLastName: false,
  // Whoever picks the lead up sees the reply language and the requested period
  // straight from the inbox list.
  subjectFields: ['lang', 'dates'],
  requiredFields: [
    { name: 'message', label: 'bericht', message: 'Vertel ons kort iets over uw verblijf.' },
  ],
  emailFields: [
    { name: 'dates', label: 'Gewenste periode' },
    { name: 'guests', label: 'Aantal personen' },
    { name: 'pets', label: 'Huisdieren mee' },
    { name: 'kids', label: 'Kinderen mee' },
    { name: 'wheelchair', label: 'Rolstoel of hulpmiddel' },
  ],
});

/*
 * The site briefly ran with English at the root (/things-to-do, /homes/x) and
 * Dutch under /nl. Dutch owns the root now, so anything linked or bookmarked
 * under the old layout is sent to its new address instead of 404ing. Safe to
 * delete once nothing points at those URLs any more.
 *
 * /curacao is deliberately absent: the path still exists, it just serves Dutch.
 */
function legacyPath(pathname: string): string | null {
  if (pathname === '/nl') return '/';
  if (pathname.startsWith('/nl/')) return pathname.slice(3);
  if (pathname === '/things-to-do' || pathname === '/horses') return `/en${pathname}`;
  if (pathname.startsWith('/homes/')) return `/en${pathname}`;
  return null;
}

/* One host owns the site. www and the launch subdomain both send their traffic
   and their links to the apex, so nothing is indexed twice. Listed explicitly
   rather than "anything that is not the apex" so `wrangler dev` on localhost
   does not redirect to production. */
const CANONICAL_HOST = 'winterswijkvakantiehuis.nl';
const ALTERNATE_HOSTS = [
  'www.winterswijkvakantiehuis.nl',
  'winterswijkvakantiehuis.jouwidealewebsite.nl',
];

const PUBLIC_HOSTS = [CANONICAL_HOST, ...ALTERNATE_HOSTS];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let shouldRedirect = false;

    // Plain http answers on the apex, which would leave an indexable copy of
    // every page on a second protocol. Only the real hosts are upgraded, so
    // `wrangler dev` over http on localhost still works.
    if (url.protocol === 'http:' && PUBLIC_HOSTS.includes(url.hostname)) {
      url.protocol = 'https:';
      shouldRedirect = true;
    }

    if (ALTERNATE_HOSTS.includes(url.hostname)) {
      url.hostname = CANONICAL_HOST;
      shouldRedirect = true;
    }

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      shouldRedirect = true;
    }

    const moved = legacyPath(url.pathname);
    if (moved) {
      url.pathname = moved;
      shouldRedirect = true;
    }

    // One hop, even when the host, the trailing slash and the path all change.
    if (shouldRedirect) return Response.redirect(url.toString(), 301);

    if (url.pathname.startsWith('/api/')) {
      return formWorker.fetch!(request, env, ctx);
    }

    // Every route is prerendered to static HTML at build time (real <head> and
    // <body>), so assets go out as they are. HTML revalidates on every request;
    // hashed assets keep the long-lived cache headers from public/_headers.
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) return response;

    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-store');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
