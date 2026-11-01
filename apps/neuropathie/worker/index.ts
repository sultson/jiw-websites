import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const canonicalHost = 'neuropathie.jouwidealewebsite.nl';

const formWorker = createFormWorker({
  formPath: '/api/forms/contact',
  siteName: 'Voetreflexologie bij neuropathie',
  ownerName: 'Lydia',
  senderName: 'Voetreflexologie bij neuropathie',
  subjectPrefix: 'Nieuw bericht via neuropathie.jouwidealewebsite.nl',
  confirmationFollowUpSentence:
    'Lydia leest uw bericht persoonlijk en neemt zo snel mogelijk contact met u op.',
  messageField: 'message',
  subjectFields: ['subject'],
  requiredFields: [
    { name: 'subject', label: 'onderwerp', message: 'Kies een onderwerp.' },
    { name: 'message', label: 'bericht', message: 'Schrijf kort uw vraag of bericht.' },
  ],
  emailFields: [
    { name: 'phone', label: 'Telefoon' },
    { name: 'city', label: 'Woonplaats' },
    { name: 'subject', label: 'Onderwerp' },
  ],
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    /* Elke andere host 301 naar het canonieke adres, zodat er nooit twee adressen
       dezelfde pagina met een 200 uitleveren. /api/ blijft ongemoeid: een formulier dat
       nog op een oud adres open staat mag zijn body niet kwijtraken aan een redirect. */
    if (url.hostname !== canonicalHost && !url.pathname.startsWith('/api/')) {
      url.hostname = canonicalHost;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith('/api/')) {
      return formWorker.fetch!(request, env, ctx);
    }

    /* De slash achteraan en de foutpagina laten we aan Workers Assets
       (`html_handling` + `not_found_handling` in wrangler.jsonc). Dat hier nog eens
       overdoen levert twee mechanismen op die elkaars redirect kunnen terugdraaien. */
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
