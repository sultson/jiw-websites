import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const canonicalHost = 'lydiavanderbie.jouwidealewebsite.nl';
const siteUrl = `https://${canonicalHost}`;

type PageMeta = {
  title: string;
  description: string;
};

const pageMeta: Record<string, PageMeta> = {
  '/': {
    title: 'Lydia van der Bie | Opleidingen & behandelingen energetisch werk',
    description:
      'Lydia van der Bie biedt CRKBO-geregistreerde opleidingen en behandelingen in energetisch en holistisch werk. Reiki, healing en persoonlijke ontwikkeling met aandacht en ervaring.',
  },
  '/privacy-policy': {
    title: 'Privacyverklaring | Lydia van der Bie',
    description: 'Lees hoe Lydia van der Bie omgaat met uw persoonsgegevens.',
  },
  '/algemene-voorwaarden': {
    title: 'Algemene voorwaarden | Lydia van der Bie',
    description: 'De algemene voorwaarden van Lydia van der Bie voor opleidingen en behandelingen.',
  },
};

const formWorker = createFormWorker({
  formPath: '/api/forms/contact',
  siteName: 'Lydia van der Bie',
  ownerName: 'Lydia',
  senderName: 'Lydia van der Bie',
  subjectPrefix: 'Nieuw bericht via lydiavanderbie.nl',
  confirmationFollowUpSentence: 'Lydia leest uw bericht persoonlijk en neemt zo snel mogelijk contact met u op.',
  messageField: 'message',
  subjectFields: ['subject'],
  requiredFields: [
    { name: 'subject', label: 'onderwerp', message: 'Kies een onderwerp.' },
    { name: 'message', label: 'bericht', message: 'Schrijf kort uw vraag of bericht.' },
  ],
  emailFields: [
    { name: 'phone', label: 'Telefoon' },
    { name: 'subject', label: 'Onderwerp' },
  ],
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith('/api/')) {
      return formWorker.fetch!(request, env, ctx);
    }

    const response = await env.ASSETS.fetch(request);
    const meta = pageMeta[url.pathname];
    const contentType = response.headers.get('content-type') ?? '';

    if (request.method !== 'GET' || !meta || !contentType.includes('text/html')) {
      return response;
    }

    const canonicalUrl = `${siteUrl}${url.pathname === '/' ? '/' : url.pathname}`;
    return new HTMLRewriter()
      .on('title', {
        element(element) {
          element.setInnerContent(meta.title);
        },
      })
      .on('meta[name="description"]', {
        element(element) {
          element.setAttribute('content', meta.description);
        },
      })
      .on('link[rel="canonical"]', {
        element(element) {
          element.setAttribute('href', canonicalUrl);
        },
      })
      .on('meta[property="og:title"]', {
        element(element) {
          element.setAttribute('content', meta.title);
        },
      })
      .on('meta[property="og:description"]', {
        element(element) {
          element.setAttribute('content', meta.description);
        },
      })
      .on('meta[property="og:url"]', {
        element(element) {
          element.setAttribute('content', canonicalUrl);
        },
      })
      .transform(response);
  },
} satisfies ExportedHandler<Env>;
