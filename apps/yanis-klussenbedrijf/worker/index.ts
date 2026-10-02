import { createFormWorker, type CloudflareFormsEnv, type LeadFormConfig } from '@jiw/cloudflare-forms';
import { yanisConfirmationEmail, yanisConfirmationEmailEn } from './confirmation-email';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

// Wat in beide talen hetzelfde is. Het formulier neemt geen bestanden aan, dus de
// bijlagenregel blijft uit de mail: anders staat er bij elke aanvraag "geen bijlagen".
const gedeeld = {
  siteName: 'Yanis Klussenbedrijf',
  ownerName: 'Yanis',
  senderName: 'Yanis Klussenbedrijf',
  messageField: 'bericht',
  // De achternaam is optioneel op het formulier; het pakket laat een lege ingebouwde
  // regel dan uit de mail. Het e-mailadres is wel verplicht: zonder dat kan de
  // aanvrager geen bevestiging krijgen.
  requireLastName: false,
  // Geen Turnstile. Het lokveld 'bedrijf' staat buiten beeld in het formulier: vult
  // iets dat in, dan neemt de worker de aanvraag stil aan en doet er niets mee. Dat
  // scheelt de bezoeker een extra verzoek naar Cloudflare voor een offerteaanvraag.
  turnstile: false,
  honeypotField: 'bedrijf',
  leadEmail: { includeAttachments: false },
} satisfies Partial<LeadFormConfig>;

const nl = createFormWorker({
  ...gedeeld,
  formPath: '/api/forms/offerte',
  locale: 'nl',
  subjectPrefix: 'Nieuwe offerteaanvraag Yanis Klussenbedrijf',
  subjectFields: ['pand'],
  // De bevestiging aan de aanvrager draait sinds 02-10-2026 op de eigen opmaak in
  // worker/confirmation-email.ts: logo, merkkleuren en eigen woorden. Die vervangt
  // confirmationFollowUpSentence, want die zin staat daar nu zelf in.
  confirmationEmail: yanisConfirmationEmail,
  requiredFields: [
    { name: 'telefoon', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in, dan kunnen wij u bereiken.' },
  ],
  emailFields: [
    { name: 'telefoon', label: 'Telefoon' },
    { name: 'adres', label: 'Adres van het pand' },
    { name: 'pand', label: 'Soort pand' },
    { name: 'werk', label: 'Waar het over gaat' },
  ],
});

const en = createFormWorker({
  ...gedeeld,
  formPath: '/api/forms/en/quote',
  locale: 'en',
  subjectPrefix: 'New request Yanis Klussenbedrijf',
  subjectFields: ['pand'],
  confirmationEmail: yanisConfirmationEmailEn,
  requiredFields: [
    { name: 'telefoon', label: 'phone number', message: 'Please add your phone number, so we can reach you.' },
  ],
  emailFields: [
    { name: 'telefoon', label: 'Telefoon' },
    { name: 'adres', label: 'Adres van het pand' },
    { name: 'pand', label: 'Soort pand' },
    { name: 'werk', label: 'Waar het over gaat' },
  ],
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // De worker staat alleen voor /api/* vooraan (run_worker_first in wrangler.jsonc);
    // de pagina's zelf komen rechtstreeks van de static assets aan de rand.
    if (url.pathname.startsWith('/api/forms/en/')) return en.fetch!(request, env, ctx);
    if (url.pathname.startsWith('/api/forms/')) return nl.fetch!(request, env, ctx);

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
