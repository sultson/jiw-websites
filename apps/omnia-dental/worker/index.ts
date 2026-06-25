import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

// General contact / appointment request form.
const contactWorker = createFormWorker({
  formPath: '/api/forms/contact',
  siteName: 'Omnia Dental',
  ownerName: 'Naresh',
  senderName: 'Omnia Dental',
  subjectPrefix: 'Nieuwe afspraakaanvraag Omnia Dental',
  confirmationFollowUpSentence:
    'We nemen zo snel mogelijk contact met u op, meestal binnen één werkdag, om uw afspraak te plannen.',
  messageField: 'message',
  requireLastName: false,
  subjectFields: ['reason'],
  requiredFields: [
    { name: 'phone', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
    { name: 'message', label: 'bericht', message: 'Schrijf kort waarmee we u kunnen helpen.' },
  ],
  emailFields: [
    { name: 'phone', label: 'Telefoon' },
    { name: 'reason', label: 'Onderwerp' },
    { name: 'newPatient', label: 'Al patiënt' },
    { name: 'preferredContact', label: 'Voorkeur contact' },
  ],
});

// Dedicated emergency (spoed) form: lower barrier, e-mail optional.
const spoedWorker = createFormWorker({
  formPath: '/api/forms/spoed',
  siteName: 'Omnia Dental',
  ownerName: 'Naresh',
  senderName: 'Omnia Dental Spoed',
  subjectPrefix: 'SPOED Omnia Dental',
  confirmationFollowUpSentence:
    'We bellen u zo snel mogelijk terug. Heeft u acute pijn, bel dan ook telefonisch zodat we u sneller kunnen helpen.',
  messageField: 'message',
  requireLastName: false,
  requireEmail: false,
  requiredFields: [
    { name: 'phone', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in zodat we u kunnen terugbellen.' },
    { name: 'message', label: 'klacht', message: 'Omschrijf kort uw spoedklacht.' },
  ],
  emailFields: [{ name: 'phone', label: 'Telefoon' }],
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/forms/spoed')) {
      return spoedWorker.fetch!(request, env, ctx);
    }
    if (url.pathname.startsWith('/api/forms/contact')) {
      return contactWorker.fetch!(request, env, ctx);
    }

    // Static assets are served directly (run_worker_first scopes the Worker to
    // /api/*), but keep a fallthrough so the Worker stays correct if invoked.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
