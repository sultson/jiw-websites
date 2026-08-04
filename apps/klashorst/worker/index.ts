import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const newsletterWorker = createFormWorker({
  formPath: '/api/forms/newsletter',
  siteName: 'Klashorst Museum',
  ownerName: 'het museum',
  senderName: 'Klashorst Museum',
  subjectPrefix: 'Nieuwe aanmelding nieuwsbrief',
  confirmationFollowUpSentence:
    'U hoort van ons zodra de openingsdatum bekend is en wanneer er nieuw werk in de collectie komt.',
  // An opt-in only needs an address; a name is welcome but never demanded.
  requireFirstName: false,
  requireLastName: false,
  requireEmail: true,
  honeypotField: 'company',
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith('/api/')) {
      return newsletterWorker.fetch!(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
