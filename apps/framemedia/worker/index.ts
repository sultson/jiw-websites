import { createFormWorker, type CloudflareFormsEnv, type LeadFormConfig } from '@jiw/cloudflare-forms';
import {
  contactConfirmationEmail,
  programmaIdeeConfirmationEmail,
  puurGenietenConfirmationEmail,
} from './confirmation';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* Vier formulieren, vier adressen. Een pagina heeft er maximaal een, dus bouw.mjs
   kan ze uit de paginasleutel aan hun action hangen (zie FORMULIEREN daar). Het
   zijn er vier en niet een, omdat de regelafstand tussen de vier vragen groot is:
   "ik wil mijn bedrijf op televisie", "meld mij aan voor Puur Genieten", "ik heb
   een programma-idee" en het snelformulier dat alleen een bedrijfsnaam en een
   adres opvraagt. Die horen in de mailbox met hun eigen onderwerpregel aan te
   komen, anders is het drie keer dezelfde vraag stellen aan de telefoon.

   Alle vier gedeeld:

   `locale: 'nl'` bepaalt de taal van de foutmeldingen die een bezoeker alleen
   ziet als de controle in de browser is overgeslagen (gecachte pagina, een bot,
   JavaScript uit). De site is Nederlands geschreven en de Engelse en Duitse
   pagina's zijn vertalingen daarvan, dus Nederlands is hier de juiste val. De
   bevestiging die de bezoeker krijgt volgt wel de taal van de pagina waar hij
   stond; zie confirmation.ts en `__jiw_confirmation_locale`.

   Geen Turnstile maar een lokvink (`website`, buiten beeld, gezet door bouw.mjs).
   Dat is geen extra resource, geen secret en geen verzoek naar een derde voor
   iemand die alleen een vraag wil stellen. Een bot die dat veld vult krijgt
   {"ok":true} en er wordt niets opgeslagen en niets gemaild.

   `herkomst` en `lang` staan in leadOnlyEmailFields: wij moeten weten welk
   formulier het was en in welke taal we terugbellen. De bezoeker hoeft niet te
   lezen op welke pagina hij stond - dat is een systeem dat zijn eigen leidingwerk
   laat zien. */
const GEDEELD = {
  locale: 'nl',
  siteName: 'FRAME MEDIA',
  senderName: 'FRAME MEDIA',
  subjectSeparator: ' | ',
  requireFirstName: true,
  requireLastName: false,
  requireEmail: true,
  turnstile: false,
  honeypotField: 'website',
  leadOnlyEmailFields: [
    { name: 'herkomst', label: 'Formulier' },
    { name: 'lang', label: 'Taal van de pagina' },
  ],
} satisfies Partial<LeadFormConfig>;

/* De drie ingebouwde regels van het pakket heten standaard Voornaam, Achternaam
   en E-mail. Deze formulieren vragen een contactpersoon en niet een voor- en
   achternaam: het is een ondernemer die namens zijn bedrijf schrijft, en "van der
   Meer" in het goede vakje laten zetten levert niemand iets op. Achternaam staat
   dus uit, en het pakket laat een regel die niet verplicht is en leeg terugkwam
   weg - dus staat er in geen van de twee mails "Achternaam: -". */
const NAAM_REGELS = { firstName: 'Contactpersoon', email: 'E-mail' };

/* Het contactformulier onderaan /contact (en /en/contact en /de/kontakt - dezelfde
   pagina in drie talen, dus een adres voor alle drie). */
const contact = createFormWorker({
  ...GEDEELD,
  formPath: '/api/forms/contact',
  subjectPrefix: 'Contactformulier framemedia.tv',
  // Zo staat in de onderwerpregel al welk bedrijf en waar het over gaat. Die twee
  // bepalen of het nu wordt opengeklikt of na de lunch.
  subjectFields: ['bedrijf', 'onderwerp'],
  messageField: 'bericht',
  // Bedrijfsnaam heeft een sterretje op de pagina, dus de server houdt hem ook
  // tegen. Zonder deze regel kan een bot of een gecachte pagina er langs en komt
  // er een aanvraag binnen die niet te plaatsen is.
  requiredFields: [
    { name: 'bedrijf', label: 'bedrijfsnaam', message: 'Vul uw bedrijfsnaam in.' },
  ],
  // Dezelfde volgorde als het formulier zelf: wie u bent, dan waar het over gaat.
  emailFields: [
    { name: 'bedrijf', label: 'Bedrijfsnaam' },
    { name: 'tel', label: 'Telefoonnummer' },
    { name: 'onderwerp', label: 'Waar het over gaat' },
  ],
  leadEmail: {
    heading: 'Nieuw bericht via framemedia.tv',
    messageHeading: 'Bericht',
    nameLabels: NAAM_REGELS,
    // Deze formulieren nemen geen bestanden aan, dus zonder dit draagt elke
    // melding voor altijd een blok met "Geen bijlagen meegestuurd."
    includeAttachments: false,
  },
  confirmationEmail: contactConfirmationEmail,
});

/* Het snelformulier in de hero van de startpagina. Twee velden, dan de rest -
   daarom heeft het geen tekstvak, en daarom staat includeMessage uit: anders
   mailt elke inzending een leeg kopje "Bericht". */
const snel = createFormWorker({
  ...GEDEELD,
  formPath: '/api/forms/snel',
  subjectPrefix: 'Snelformulier framemedia.tv',
  subjectFields: ['bedrijf', 'onderwerp'],
  requiredFields: [
    { name: 'bedrijf', label: 'bedrijfsnaam', message: 'Vul uw bedrijfsnaam in.' },
  ],
  emailFields: [
    { name: 'bedrijf', label: 'Bedrijfsnaam' },
    { name: 'tel', label: 'Telefoonnummer' },
    { name: 'onderwerp', label: 'Waar het over gaat' },
  ],
  leadEmail: {
    heading: 'Nieuwe aanvraag via het snelformulier',
    nameLabels: NAAM_REGELS,
    includeMessage: false,
    includeAttachments: false,
  },
  confirmationEmail: contactConfirmationEmail,
});

/* Het aanmeldformulier op /puurgenieten/ (en /en/puur-genieten/ en
   /de/puur-genieten/). Dit is de pagina waar verkeer naartoe gestuurd wordt, dus
   dit formulier is het formulier dat het meest moet werken. Telefoonnummer en
   branche hebben er een sterretje, dus die staan ook op de server. */
const puurGenieten = createFormWorker({
  ...GEDEELD,
  formPath: '/api/forms/puurgenieten',
  subjectPrefix: 'Aanmelding Puur Genieten',
  subjectFields: ['bedrijf', 'branche'],
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
  leadEmail: {
    heading: 'Nieuwe aanmelding voor Puur Genieten',
    nameLabels: NAAM_REGELS,
    includeMessage: false,
    includeAttachments: false,
  },
  confirmationEmail: puurGenietenConfirmationEmail,
});

/* Het formulier op /programma-idee/. Die pagina staat bij FRAME MEDIA zelf nummer
   1 tot 2 in Google op "programma idee", dus hier komt verkeer binnen dat zij al
   hadden. Een idee dat hier in het niets valt is de duurste aanvraag die deze
   site kan laten lopen. Vier velden, en het tekstvak heet `idee`. */
const programmaIdee = createFormWorker({
  ...GEDEELD,
  formPath: '/api/forms/programma-idee',
  subjectPrefix: 'Programma-idee via framemedia.tv',
  subjectFields: ['firstName'],
  messageField: 'idee',
  requiredFields: [
    { name: 'tel', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
  ],
  emailFields: [
    { name: 'tel', label: 'Telefoonnummer' },
  ],
  leadEmail: {
    heading: 'Nieuw programma-idee via framemedia.tv',
    messageHeading: 'Het idee',
    nameLabels: { firstName: 'Naam', email: 'E-mail' },
    includeAttachments: false,
  },
  confirmationEmail: programmaIdeeConfirmationEmail,
});

const FORMULIEREN: Record<string, ExportedHandler<CloudflareFormsEnv>> = {
  '/api/forms/contact': contact,
  '/api/forms/snel': snel,
  '/api/forms/puurgenieten': puurGenieten,
  '/api/forms/programma-idee': programmaIdee,
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // De worker loopt alleen voor /api/* (run_worker_first in wrangler.jsonc). Alle
    // 23 pagina's komen rechtstreeks van de edge, zonder worker ertussen.
    const form = FORMULIEREN[url.pathname];
    if (form) return form.fetch!(request, env, ctx);

    // Een onbekend /api/-pad is geen pagina en hoort geen html terug te krijgen:
    // anders levert een typefout in een formulieradres de 404-pagina uit en leest
    // dat in de console als "het werkt, maar leeg".
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ ok: false, error: 'unknown_form' }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
