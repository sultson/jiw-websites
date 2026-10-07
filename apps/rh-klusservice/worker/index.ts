import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { rhBevestigingsmail } from './bevestigingsmail';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* Eén formulier, elf pagina's. Het staat twee keer op de homepagina (#offerte-boven
   en #offerte), één keer op projecten en één keer in de hero van elke plaatspagina.
   Welke pagina de aanvraag opleverde gaat mee als verborgen veld `herkomst`.

   De slotpagina heeft bewust geen formulier: die is voor spoed, wie buiten staat belt. */
const offerte = createFormWorker({
  formPath: '/api/forms/offerte',
  locale: 'nl',
  siteName: 'RH Klusservice',
  ownerName: 'Robbin',
  senderName: 'RH Klusservice',
  subjectPrefix: 'Nieuwe offerteaanvraag RH Klusservice',
  // Dan staat in de onderwerpregel al welke pagina hem opleverde.
  subjectFields: ['herkomst'],

  // Het formulier vraagt om naam, telefoon, omschrijving, eventueel een e-mailadres
  // en eventueel foto's. De achternaam staat er niet op; Armando heeft die er op
  // 06-10-2026 uit gehaald ("form needs to be more simple"). Het e-mailadres ging
  // toen mee de deur uit en is op 07-10-2026 teruggezet door Alfred, maar als
  // optioneel veld: wie het invult krijgt een bevestiging, wie het overslaat kan
  // nog steeds versturen. Het pakket laat een ingebouwde regel die niet verplicht
  // is en leeg blijft zelf uit de mail, dus er komt geen "Achternaam: -" of
  // "E-mail: -" in de melding aan ons.
  requireFirstName: true,
  requireLastName: false,
  requireEmail: false,
  messageField: 'bericht',

  // De bevestiging aan de aanvrager in zijn eigen merk: logo, zwart-wit en eigen
  // woorden, in plaats van de standaardopmaak van het pakket (marineblauw met
  // goud). Zie worker/bevestigingsmail.ts. Zonder e-mailadres stuurt het pakket
  // er geen, dus voor wie het veld overslaat verandert er niets.
  confirmationEmail: rhBevestigingsmail,

  // Geen Turnstile, wel een lokveld buiten beeld. Vult een bot dat in, dan
  // antwoordt de worker {"ok":true} en bewaart en mailt niets.
  turnstile: false,
  honeypotField: 'bedrijf',

  requiredFields: [
    { name: 'telefoon', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in, dan kunnen wij u bereiken.' },
  ],
  emailFields: [
    { name: 'telefoon', label: 'Telefoon' },
  ],
  // Alleen in de melding aan ons, niet in een bevestiging aan de aanvrager.
  leadOnlyEmailFields: [
    { name: 'herkomst', label: 'Aangevraagd via' },
  ],
  leadEmail: {
    // Het formulier heeft één naamveld met het opschrift "Naam"; `firstName` is de
    // naam die het pakket eraan geeft, niet wat de bezoeker leest.
    nameLabels: { firstName: 'Naam' },
    messageHeading: 'Omschrijving van de klus',
  },

  // Wie geen e-mailadres achterlaat krijgt geen bevestiging. Daarom zegt de pagina
  // na het versturen zelf wat er gebeurt, en noemt hij de bevestigingsmail alleen
  // als er een adres is ingevuld; zie het offerteformulier in bron/site.js.
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // De worker staat alleen voor /api/* vooraan (run_worker_first in wrangler.jsonc);
    // de pagina's komen rechtstreeks van de static assets aan de rand.
    if (url.pathname.startsWith('/api/forms/')) return offerte.fetch!(request, env, ctx);

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
