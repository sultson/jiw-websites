import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const canonicalHost = 'rnschilders.nl';
const siteUrl = `https://${canonicalHost}`;

// Alternate domain (the hyphenated, legacy one). Both the apex and www variant
// 301 to the canonical host so all SEO value consolidates on rnschilders.nl.
// Note: e-mail (sender/recipient) still lives on the rn-schilders.nl domain.
const alternateHosts = ['rn-schilders.nl', 'www.rn-schilders.nl'];

// Pages that were consolidated away. Each 301s to a still-relevant target so any
// existing links or index entries keep their value:
//  - thin location doorway pages -> /werkgebied
//  - legacy hyphenated service paths -> the new clean service detail pages
const removedPathRedirects: Record<string, string> = {
  // Renamed so the URL reflects the stuc- én schilderwerk content in Almere.
  '/schilder-almere': '/stukadoor-schilder-almere',
  '/schilder-maarssen-stichtse-vecht': '/werkgebied',
  '/schilder-mijdrecht-de-ronde-venen': '/werkgebied',
  '/schilder-bodegraven-reeuwijk': '/werkgebied',
  '/schilder-ijsselstein': '/werkgebied',
  '/schilder-houten': '/werkgebied',
  '/schilder-de-bilt-bilthoven': '/werkgebied',
  '/schilder-zeist': '/werkgebied',
  '/schilderwerk-woerden': '/schilderwerk',
  '/kozijnen-woerden': '/kozijnen',
  '/spuitwerk-woerden': '/spuitwerk',
  '/stucwerk-woerden': '/stucwerk',
  '/houtrotherstel-woerden': '/houtrotherstel',
  '/sloopwerk-woerden': '/sloopwerk',
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
  optionalEmailWhen: [{ field: 'leadSource', equals: 'Google Ads landingspagina buitenschilderwerk' }],
  skipTurnstileWhen: [{ field: 'leadSource', equals: 'Google Ads landingspagina buitenschilderwerk' }],
  // Keep the barrier to contact low on the campaign lander: naam en telefoon
  // zijn daar genoeg. The regular modal still requires email.
  requireLastName: false,
  requiredFields: [
    { name: 'phone', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
    {
      name: 'serviceOther',
      label: 'dienst toelichting',
      message: 'Vul de gewenste dienst in.',
      when: { field: 'service', equals: 'other' },
    },
  ],
  emailFields: [
    { name: 'phone', label: 'Telefoon' },
    { name: 'email', label: 'E-mail' },
    { name: 'postalCode', label: 'Postcode' },
    { name: 'streetName', label: 'Straatnaam' },
    { name: 'houseNumber', label: 'Huisnummer' },
    { name: 'city', label: 'Plaatsnaam' },
    { name: 'service', label: 'Dienst' },
    { name: 'leadSource', label: 'Leadbron' },
    { name: 'contactPreference', label: 'Aanvraagroute' },
    { name: 'preferredExecutionDate', label: 'Gewenste uitvoeringsdatum' },
    { name: 'urgent', label: 'Spoed' },
    { name: 'gclid', label: 'GCLID' },
    { name: 'pageUrl', label: 'Pagina URL' },
    { name: 'submittedAt', label: 'Verzonden op' },
  ],
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    let shouldRedirect = false;

    if (url.hostname === `www.${canonicalHost}` || alternateHosts.includes(url.hostname)) {
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
    // so assets are served as-is. HTML should revalidate on every request; hashed
    // assets keep their long-lived cache headers from public/_headers.
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
