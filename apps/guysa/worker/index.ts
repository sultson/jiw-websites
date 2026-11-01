import {createFormWorker, type CloudflareFormsEnv} from '@jiw/cloudflare-forms';
import {guysaConfirmationEmail} from './confirmation-email';
import {SITE_URL} from '../site.config.mjs';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* ------------------------------------------------------------------ */
/*  Het aanvraagformulier                                              */
/* ------------------------------------------------------------------ */

/**
 * Geen Turnstile: er staat geen widget op de pagina, en een opruimbedrijf is
 * voor een spammer geen doelwit dat de moeite loont. Het verborgen veld
 * `bedrijf` doet het werk: een bot vult alles in, een bezoeker ziet het niet,
 * en wat er mét dat veld binnenkomt wordt zonder spoor weggegooid.
 */
const formulier = createFormWorker({
  formPath: '/api/forms/aanvraag',
  siteName: 'GuySa Inboedels & Opruimingen',
  senderName: 'GuySa Inboedels',
  subjectPrefix: 'Nieuwe aanvraag GuySa',
  turnstile: false,
  honeypotField: 'bedrijf',
  confirmationEmail: guysaConfirmationEmail,

  /* De standaardtekst van het pakket heet overal "offerteaanvraag" en
     "Projectomschrijving". Dat klopt hier half: het ís een offerteaanvraag,
     maar wat de klant invult is geen project maar een toelichting. */
  leadEmail: {
    heading: 'Nieuwe offerteaanvraag via de website',
    messageHeading: 'Toelichting van de klant',
    nameLabels: {firstName: 'Voornaam', lastName: 'Achternaam', email: 'E-mailadres'},
  },

  messageField: 'toelichting',
  /* Wie de mail in zijn inbox ziet staan weet meteen waar het over gaat en
     waar het pand ligt, zonder hem te openen. */
  subjectFields: ['opdracht', 'gemeente'],

  requiredFields: [
    {
      name: 'telefoon',
      label: 'telefoonnummer',
      message: 'Vul uw telefoonnummer in, dan kunnen we u bellen over uw aanvraag.',
    },
    {name: 'opdracht', label: 'soort opdracht'},
    {name: 'gemeente', label: 'gemeente'},
    {
      name: 'postcode',
      label: 'postcode',
      message: 'Vul de postcode in van het pand waar het om gaat.',
    },
  ],

  /* De volgorde van de regels in de mail aan GuySa. Eerst hoe de klant te
     bereiken is, dan wat er moet gebeuren, dan waar en wanneer. */
  emailFields: [
    {name: 'telefoon', label: 'Telefoon'},
    {name: 'opdracht', label: 'Waarvoor'},
    {name: 'details', label: 'Waar het over gaat'},
    {name: 'postcode', label: 'Postcode'},
    {name: 'gemeente', label: 'Gemeente'},
    {name: 'termijn', label: 'Wanneer'},
  ],

  /* Zes foto's van de ruimtes, zoals het formulier er maximaal toelaat. De
     browser brengt ze voor het versturen terug tot 1600 pixels (zie `lichter`
     in src/Aanvraag.tsx), dus de grens per bestand wordt in de praktijk niet
     geraakt; hij staat er voor wie het formulier omzeilt. */
  attachmentMaxFiles: 6,
});

/* ------------------------------------------------------------------ */
/*  Eén adres voor de site                                             */
/* ------------------------------------------------------------------ */

/**
 * Wijzen er meerdere adressen naar deze Worker, dan staat de site op evenveel
 * adressen tegelijk in de index en verdeelt hij zijn eigen positie over de
 * kopieën. Daarom: één host wint, de rest stuurt zijn bezoekers en zijn links
 * daarheen door met één 301.
 *
 * Welke host wint komt uit SITE_URL, zodat een verhuizing naar het eigen
 * domein één regel in site.config.mjs is en niet ook nog een lijst hier. Een
 * host die niet in de routes van wrangler.jsonc staat komt hier nooit langs,
 * dus wat er te veel in staat kost niets.
 */
const CANONIEKE_HOST = new URL(SITE_URL).hostname;

/* Nog leeg: er hangt één adres aan deze Worker. Zodra het eigen domein
   gekoppeld wordt, komt `guysa.jouwidealewebsite.nl` hier te staan en wordt
   SITE_URL dat domein — dan stuurt dit adres door in plaats van een tweede
   kopie van de site te zijn. */
const ANDERE_HOSTS: string[] = [];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return formulier.fetch!(request, env, ctx);
    }

    /**
     * `wrangler dev` geeft de Worker niet het adres uit de adresbalk mee, maar
     * de host uit `routes` in wrangler.jsonc, over gewoon http. Lokaal komt
     * hier dus letterlijk `http://guysa.jouwidealewebsite.nl/` binnen. Wie dat
     * niet weet bouwt hier een omleiding die op zijn eigen machine elk verzoek
     * naar de live site stuurt.
     *
     * Vandaar de grendel op https: op een custom domain serveert Cloudflare
     * alleen https (http wordt aan de rand al omgezet), dus in productie is
     * deze voorwaarde altijd waar en lokaal altijd onwaar.
     *
     * En alleen leesverzoeken: een 301 gooit de body van een POST weg.
     */
    const leesverzoek = request.method === 'GET' || request.method === 'HEAD';
    if (leesverzoek && url.protocol === 'https:' && ANDERE_HOSTS.includes(url.hostname)) {
      url.hostname = CANONIEKE_HOST;
      return Response.redirect(url.toString(), 301);
    }

    /**
     * De pagina's zijn bij het bouwen als complete HTML weggeschreven, dus de
     * bestanden gaan eruit zoals ze zijn. Alleen de HTML zelf moet elke keer
     * opnieuw gecontroleerd worden; de bestanden met een hash in hun naam
     * houden de lange cache uit public/_headers.
     *
     * `no-cache` en niet `no-store`. Ze klinken hetzelfde en zijn het niet:
     * no-cache betekent "bewaren mag, maar vraag eerst of het nog klopt", en
     * dat is wat we willen. no-store betekent "bewaar niets", en dat zet ook
     * de bfcache uit, het geheugen waarmee de browser een pagina terugtovert
     * als iemand op de terugknop drukt.
     */
    const antwoord = await env.ASSETS.fetch(request);
    const type = antwoord.headers.get('content-type') ?? '';
    if (!type.includes('text/html')) return antwoord;

    const headers = new Headers(antwoord.headers);
    headers.set('Cache-Control', 'no-cache');
    return new Response(antwoord.body, {
      status: antwoord.status,
      statusText: antwoord.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
