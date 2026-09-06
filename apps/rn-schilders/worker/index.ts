import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
  // Set to '1' in wrangler.jsonc to take the whole site offline. Every route,
  // including /api/*, then answers with the maintenance page below. Remove the
  // var (or set it to anything else) and redeploy to bring the site back.
  OFFLINE?: string;
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
  '/vloeren-woerden': '/vloeren',
};

// Served on every host and path while OFFLINE is set. Deliberately
// self-contained: no assets, no fonts, no scripts, so it renders even when
// dist/ is stale. The 503 plus Retry-After tells crawlers this is temporary and
// keeps the pages indexed, so no X-Robots-Tag here.
const maintenancePage = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RN Schilders &amp; Renovatie</title>
<style>
  :root { color-scheme: dark; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem 1.5rem;
    background: #0D1E3D;
    color: #F6F4EF;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height: 1.6;
  }
  main { max-width: 32rem; text-align: center; }
  h1 {
    margin: 0;
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  hr {
    width: 3rem;
    margin: 1.75rem auto;
    border: 0;
    border-top: 2px solid #FF6A00;
  }
  p { margin: 0; color: #D9D2C7; }
</style>
</head>
<body>
  <main>
    <h1>RN Schilders &amp; Renovatie</h1>
    <hr>
    <p>Deze website is tijdelijk offline.</p>
  </main>
</body>
</html>
`;

function maintenanceResponse(request: Request): Response {
  return new Response(request.method === 'HEAD' ? null : maintenancePage, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Retry-After': '3600',
    },
  });
}

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
    { name: 'preferredExecutionDate', label: 'Wanneer gewenst' },
    { name: 'preferredExecutionDate', label: 'Gewenste uitvoeringsdatum' },
    { name: 'urgent', label: 'Spoed' },
    { name: 'gclid', label: 'GCLID' },
    { name: 'pageUrl', label: 'Pagina URL' },
    { name: 'submittedAt', label: 'Verzonden op' },
  ],
});

export default {
  async fetch(request, env, ctx) {
    if (env.OFFLINE === '1') return maintenanceResponse(request);

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
