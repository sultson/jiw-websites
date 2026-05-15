import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const formWorker = createFormWorker({
  formPath: '/api/forms/intake',
  siteName: 'Thijs Timmerwerk',
  senderName: 'Thijs Timmerwerk',
  subjectPrefix: 'Nieuwe aanvraag Thijs Timmerwerk',
  confirmationFollowUpSentence:
    'Wij nemen snel contact met u op om uw verbouwing door te nemen en een opname op locatie in te plannen.',
  messageField: 'message',
  subjectFields: ['service', 'address'],
  requiredFields: [
    { name: 'name', label: 'naam', message: 'Vul uw naam in.' },
    { name: 'phone', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
    { name: 'email', label: 'e-mailadres', message: 'Vul uw e-mailadres in.' },
    { name: 'service', label: 'type klus', message: 'Kies een type klus.' },
    { name: 'message', label: 'projectomschrijving', message: 'Beschrijf kort wat er moet gebeuren.' },
  ],
  emailFields: [
    { name: 'name', label: 'Naam' },
    { name: 'phone', label: 'Telefoon' },
    { name: 'email', label: 'E-mailadres' },
    { name: 'address', label: 'Adres of plaats' },
    { name: 'service', label: 'Type klus' },
  ],
  attachmentMaxFiles: 8,
  attachmentMaxFileBytes: 12 * 1024 * 1024,
  attachmentMaxTotalBytes: 60 * 1024 * 1024,
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

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
