import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & { ASSETS: Fetcher };

const formWorker = createFormWorker({
  formPath: '/api/forms/contact',
  siteName: 'D.E Zorg',
  ownerName: 'Lenie',
  senderName: 'D.E Zorg',
  subjectPrefix: 'Nieuw bericht voor D.E Zorg',
  confirmationFollowUpSentence: 'Lenie neemt zo spoedig mogelijk per e-mail contact met u op.',
  messageField: 'message',
  subjectFields: ['subject'],
  requiredFields: [
    { name: 'subject', label: 'onderwerp', message: 'Kies waar uw bericht over gaat.' },
    { name: 'message', label: 'bericht', message: 'Omschrijf kort de organisatie, werkomgeving en gewenste inzet.' }
  ],
  emailFields: [
    { name: 'subject', label: 'Onderwerp' },
    { name: 'organisation', label: 'Organisatie' }
  ]
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return formWorker.fetch!(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
