import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const formWorker = createFormWorker({
  formPath: '/api/forms/offerte',
  siteName: 'MHA Installaties',
  ownerName: 'Youssef',
  senderName: 'MHA Installaties',
  subjectPrefix: 'Nieuwe aanvraag MHA Installaties',
  confirmationFollowUpSentence:
    'Youssef neemt zo snel mogelijk contact met u op om uw aanvraag door te nemen en een afspraak in te plannen.',
  messageField: 'message',
  serviceOtherField: 'serviceOther',
  subjectFields: ['service', 'postalCode', 'city'],
  requiredFields: [
    { name: 'phone', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
    { name: 'streetName', label: 'straatnaam', message: 'Vul uw straatnaam in.' },
    { name: 'houseNumber', label: 'huisnummer', message: 'Vul uw huisnummer in.' },
    { name: 'postalCode', label: 'postcode', message: 'Vul uw postcode in.' },
    { name: 'city', label: 'plaatsnaam', message: 'Vul uw plaatsnaam in.' },
    { name: 'service', label: 'dienst', message: 'Kies een dienst.' },
    {
      name: 'serviceOther',
      label: 'toelichting dienst',
      message: 'Beschrijf kort waar het om gaat.',
      when: { field: 'service', equals: 'other' },
    },
    { name: 'message', label: 'omschrijving', message: 'Beschrijf kort wat er moet gebeuren.' },
  ],
  emailFields: [
    { name: 'phone', label: 'Telefoon' },
    { name: 'streetName', label: 'Straatnaam' },
    { name: 'houseNumber', label: 'Huisnummer' },
    { name: 'postalCode', label: 'Postcode' },
    { name: 'city', label: 'Plaatsnaam' },
    { name: 'service', label: 'Dienst' },
    { name: 'serviceOther', label: 'Toelichting dienst', when: { field: 'service', equals: 'other' } },
    { name: 'propertyType', label: 'Type woning' },
    { name: 'urgency', label: 'Urgentie' },
  ],
  attachmentMaxFiles: 8,
  attachmentMaxFileBytes: 12 * 1024 * 1024,
  attachmentMaxTotalBytes: 60 * 1024 * 1024,
});

const ROBOTS_TXT = `User-agent: *\nAllow: /\n\nSitemap: https://mhainstallaties.nl/sitemap.xml\n`;

const LEGACY_PAGE_REDIRECTS: Record<string, string> = {
  '/contact': '/#contact',
  '/diensten': '/#diensten',
  '/galerij': '/#werk',
  '/hello-world': '/',
};

function canonicalRedirect(destination: string, status = 301) {
  const target = new URL(destination, 'https://mhainstallaties.nl');
  return Response.redirect(target.toString(), status);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const canonicalPathname =
      url.pathname.length > 1 && url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;

    const legacyRedirect = LEGACY_PAGE_REDIRECTS[canonicalPathname];
    if (legacyRedirect) {
      return canonicalRedirect(legacyRedirect);
    }

    if (url.hostname === 'www.mhainstallaties.nl' && !canonicalPathname.startsWith('/api/')) {
      return canonicalRedirect(canonicalPathname);
    }

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      return canonicalRedirect(canonicalPathname);
    }

    // Serve robots.txt from the worker so Cloudflare's managed AI-audit
    // robots transform (which injects non-standard `Content-Signal:` lines
    // Lighthouse rejects) doesn't overwrite our clean version.
    if (url.pathname === '/robots.txt') {
      return new Response(ROBOTS_TXT, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
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
