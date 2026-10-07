import { createFormWorker, type CloudflareFormsEnv, type LeadFormConfig } from '@jiw/cloudflare-forms';
import { noveraConfirmationEmail, noveraConfirmationEmailEn } from './confirmation-email';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* Airco was tot 30-09-2026 een van de tien diensten en had een eigen pagina in beide
   talen. Ekrem heeft hem laten vervallen. De twee adressen hebben opengestaan en
   kunnen gedeeld zijn, dus ze leiden door naar het overzicht in plaats van dood te
   lopen op een 404. In wrangler.jsonc staan ze in run_worker_first, anders komt de
   worker er niet aan te pas. */
const OMLEIDING: Record<string, string> = {
  '/airco': '/werkzaamheden',
  '/en/air-conditioning': '/en/services',
};

// Wat in beide talen hetzelfde is. Het formulier neemt geen bestanden aan, dus de
// bijlagenregel blijft uit de mail aan ons: anders staat er bij elke aanvraag
// "Geen bijlagen meegestuurd."
const gedeeld = {
  siteName: 'Novera Bouw',
  ownerName: 'Ekrem',
  senderName: 'Novera Bouw',
  messageField: 'toelichting',
  // De achternaam is optioneel op het formulier; het pakket laat een lege ingebouwde
  // regel dan uit de mail. Het e-mailadres is wel verplicht: zonder dat kan de
  // aanvrager geen bevestiging krijgen, en dan is de hele mail hierboven voor niets.
  requireLastName: false,
  // Geen Turnstile. Het lokveld 'bedrijf' staat buiten beeld in het formulier: vult
  // iets dat in, dan neemt de worker de aanvraag stil aan en doet er niets mee. Dat
  // scheelt de bezoeker een extra verzoek naar Cloudflare voor een offerteaanvraag.
  turnstile: false,
  honeypotField: 'bedrijf',
  leadEmail: { includeAttachments: false },
} satisfies Partial<LeadFormConfig>;

/* De rijen in de mail, in de volgorde waarin je ze wilt lezen: eerst hoe je hem
   bereikt, dan waar hij zit, dan wat hij wil. */
const RIJEN = [
  { name: 'telefoon', label: 'Telefoon' },
  { name: 'postcode', label: 'Postcode' },
  { name: 'plaats', label: 'Plaats' },
  { name: 'werk', label: 'Waar het over gaat' },
  { name: 'materiaal', label: 'Materiaal via onze inkoop' },
  { name: 'materiaal_item', label: 'Uit onze lijst' },
];

const nl = createFormWorker({
  ...gedeeld,
  formPath: '/api/forms/offerte',
  locale: 'nl',
  subjectPrefix: 'Nieuwe offerteaanvraag Novera Bouw',
  // De plaats in de onderwerpregel: kort, en voor een bouwbedrijf het eerste dat
  // telt. De werkzaamheden passen er niet in, dat worden er soms tien.
  subjectFields: ['plaats'],
  confirmationEmail: noveraConfirmationEmail,
  requiredFields: [
    { name: 'telefoon', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in, dan kunnen wij u bellen.' },
  ],
  emailFields: RIJEN,
});

const en = createFormWorker({
  ...gedeeld,
  formPath: '/api/forms/en/quote',
  locale: 'en',
  subjectPrefix: 'New request Novera Bouw',
  subjectFields: ['plaats'],
  confirmationEmail: noveraConfirmationEmailEn,
  requiredFields: [
    { name: 'telefoon', label: 'phone number', message: 'Please add your phone number, so we can call you.' },
  ],
  emailFields: RIJEN,
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const naar = OMLEIDING[url.pathname.replace(/\/$/, '')];
    if (naar) return Response.redirect(new URL(naar + url.search, url.origin).toString(), 301);

    // De worker staat alleen voor /api/* en de twee airco-adressen vooraan
    // (run_worker_first in wrangler.jsonc); de pagina's zelf komen rechtstreeks van
    // de static assets aan de rand.
    if (url.pathname.startsWith('/api/forms/en/')) return en.fetch!(request, env, ctx);
    if (url.pathname.startsWith('/api/forms/')) return nl.fetch!(request, env, ctx);

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
