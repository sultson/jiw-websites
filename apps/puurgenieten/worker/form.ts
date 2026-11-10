import type { LeadFormConfig } from '@jiw/cloudflare-forms';
import { puurGenietenConfirmationEmail } from './confirmation.ts';

/**
 * Het aanmeldformulier, de enige vorm op de site (in /, /en/ en /de/ dezelfde).
 * Staat los van index.ts zodat tools/preview-mail.mjs precies deze config door
 * de echte renderer kan halen zonder de worker zelf te importeren.
 *
 * Overgenomen van het Puur Genieten-formulier op framemedia.tv, met dezelfde
 * verplichte velden: bedrijfsnaam, contactpersoon, telefoon, e-mail en branche
 * hebben op de pagina een sterretje, dus de server houdt ze ook tegen. Zonder
 * die regel kan een bot of een gecachte pagina erlangs en komt er een aanmelding
 * binnen die niet te plaatsen is.
 *
 * Turnstile staat aan, net als op framemedia.tv sinds 02-11-2026: het lokvink
 * alleen hield daar de Russische en Griekse spam niet tegen. Widget "Puur
 * Genieten formulieren", secret TURNSTILE_SECRET_KEY op de worker.
 *
 * `herkomst` en `lang` gaan alleen in onze eigen melding: wij moeten weten in
 * welke taal we terugbellen, de bezoeker hoeft dat niet teruggemaild te krijgen.
 */
export const PG_FORM: LeadFormConfig = {
  formPath: '/api/forms/puurgenieten',
  locale: 'nl',
  siteName: 'Puur Genieten',
  senderName: 'Puur Genieten',
  subjectPrefix: 'Aanmelding Puur Genieten',
  subjectFields: ['bedrijf', 'branche'],
  subjectSeparator: ' | ',
  requireFirstName: true,
  requireLastName: false,
  requireEmail: true,
  turnstile: true,
  honeypotField: 'website',
  requiredFields: [
    { name: 'bedrijf', label: 'bedrijfsnaam', message: 'Vul uw bedrijfsnaam in.' },
    { name: 'tel', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
    { name: 'branche', label: 'branche', message: 'Kies uw branche.' },
  ],
  emailFields: [
    { name: 'bedrijf', label: 'Bedrijfsnaam' },
    { name: 'tel', label: 'Telefoonnummer' },
    { name: 'branche', label: 'Branche' },
  ],
  leadOnlyEmailFields: [
    { name: 'herkomst', label: 'Formulier' },
    { name: 'lang', label: 'Taal van de pagina' },
  ],
  leadEmail: {
    heading: 'Nieuwe aanmelding voor Puur Genieten',
    // Een contactpersoon, geen voor- en achternaam: het is een ondernemer die
    // namens zijn bedrijf schrijft. Achternaam staat uit en het pakket laat een
    // lege, niet-verplichte regel weg.
    nameLabels: { firstName: 'Contactpersoon', email: 'E-mail' },
    includeMessage: false,
    includeAttachments: false,
  },
  confirmationEmail: puurGenietenConfirmationEmail,
};
