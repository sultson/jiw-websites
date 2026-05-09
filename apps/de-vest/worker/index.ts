import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const formWorker = createFormWorker({
  formPath: '/api/forms/intake',
  siteName: 'De Vest Schilderwerken',
  senderName: 'De Vest Schilderwerken',
  subjectPrefix: 'Nieuwe aanvraag De Vest Schilderwerken',
  confirmationFollowUpSentence:
    'Wij nemen binnen één werkdag contact op om uw aanvraag door te nemen en, als het past, een vrijblijvend bezoek in te plannen.',
  messageField: 'message',
  serviceOtherField: 'serviceOther',
  subjectFields: ['service', 'postalCode', 'city'],
  requiredFields: [
    { name: 'name',       label: 'naam',           message: 'Vul uw naam in.' },
    { name: 'phone',      label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
    { name: 'email',      label: 'e-mailadres',    message: 'Vul uw e-mailadres in.' },
    { name: 'postalCode', label: 'postcode',       message: 'Vul uw postcode in.' },
    { name: 'city',       label: 'plaatsnaam',     message: 'Vul uw plaatsnaam in.' },
    { name: 'service',    label: 'dienst',         message: 'Kies een dienst.' },
    {
      name: 'serviceOther',
      label: 'toelichting dienst',
      message: 'Beschrijf kort waar het om gaat.',
      when: { field: 'service', equals: 'other' },
    },
    { name: 'message',    label: 'projectomschrijving', message: 'Beschrijf kort wat er moet gebeuren.' },
  ],
  emailFields: [
    { name: 'name',          label: 'Naam' },
    { name: 'phone',         label: 'Telefoon' },
    { name: 'email',         label: 'E-mailadres' },
    { name: 'postalCode',    label: 'Postcode' },
    { name: 'city',          label: 'Plaatsnaam' },
    { name: 'service',       label: 'Dienst' },
    { name: 'serviceOther',  label: 'Toelichting dienst', when: { field: 'service', equals: 'other' } },
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
