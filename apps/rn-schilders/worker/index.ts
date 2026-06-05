import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const canonicalHost = 'rn-schilders.nl';
const siteUrl = `https://${canonicalHost}`;

// Pages that were consolidated away. Each 301s to a still-relevant target so any
// existing links or index entries keep their value:
//  - thin location doorway pages -> /werkgebied
//  - per-service detail pages (now covered by the homepage Diensten section) -> /#diensten
const removedPathRedirects: Record<string, string> = {
  '/schilder-maarssen-stichtse-vecht': '/werkgebied',
  '/schilder-mijdrecht-de-ronde-venen': '/werkgebied',
  '/schilder-bodegraven-reeuwijk': '/werkgebied',
  '/schilder-ijsselstein': '/werkgebied',
  '/schilder-houten': '/werkgebied',
  '/schilder-de-bilt-bilthoven': '/werkgebied',
  '/schilder-zeist': '/werkgebied',
  '/schilderwerk-woerden': '/#diensten',
  '/kozijnen-woerden': '/#diensten',
  '/spuitwerk-woerden': '/#diensten',
  '/stucwerk-woerden': '/#diensten',
  '/houtrotherstel-woerden': '/#diensten',
  '/sloopwerk-woerden': '/#diensten',
};

const formWorker = createFormWorker({
  formPath: '/api/forms/offerte',
  siteName: 'RN Schilders & Renovatie',
  ownerName: 'Richard',
  senderName: 'RN Schilders',
  subjectPrefix: 'Nieuwe offerteaanvraag RN Schilders',
  confirmationFollowUpSentence: 'Richard neemt binnen 24 tot 48 uur contact met u op om uw project en de volgende stap door te spreken.',
  messageField: 'message',
  serviceOtherField: 'serviceOther',
  subjectFields: ['service', 'postalCode', 'city'],
  requiredFields: [
    { name: 'phone', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
    { name: 'postalCode', label: 'postcode', message: 'Vul uw postcode in.' },
    { name: 'streetName', label: 'straatnaam', message: 'Vul uw straatnaam in.' },
    { name: 'houseNumber', label: 'huisnummer', message: 'Vul uw huisnummer in.' },
    { name: 'city', label: 'plaatsnaam', message: 'Vul uw plaatsnaam in.' },
    { name: 'service', label: 'dienst', message: 'Kies een dienst.' },
    {
      name: 'serviceOther',
      label: 'dienst toelichting',
      message: 'Vul de gewenste dienst in.',
      when: { field: 'service', equals: 'other' },
    },
    { name: 'preferredExecutionDate', label: 'gewenste uitvoeringsdatum', message: 'Kies een gewenste uitvoeringsdatum.' },
    { name: 'message', label: 'projectomschrijving', message: 'Beschrijf kort wat er moet gebeuren.' },
  ],
  emailFields: [
    { name: 'phone', label: 'Telefoon' },
    { name: 'postalCode', label: 'Postcode' },
    { name: 'streetName', label: 'Straatnaam' },
    { name: 'houseNumber', label: 'Huisnummer' },
    { name: 'city', label: 'Plaatsnaam' },
    { name: 'service', label: 'Dienst' },
    { name: 'preferredExecutionDate', label: 'Gewenste uitvoeringsdatum' },
    { name: 'urgent', label: 'Spoed' },
  ],
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    let shouldRedirect = false;

    if (url.hostname === `www.${canonicalHost}`) {
      url.hostname = canonicalHost;
      shouldRedirect = true;
    }

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      shouldRedirect = true;
    }

    const removedTarget = removedPathRedirects[url.pathname];
    if (removedTarget) {
      return Response.redirect(`${siteUrl}${removedTarget}`, 301);
    }

    if (shouldRedirect) {
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith('/api/')) {
      return formWorker.fetch!(request, env, ctx);
    }

    // Pages are prerendered to static HTML at build time (real <head> + <body>),
    // so assets are served as-is. No edge HTML rewriting needed.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
