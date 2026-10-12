import {createFormWorker, type CloudflareFormsEnv} from '@jiw/cloudflare-forms';
import {marjonConfirmationEmail} from './confirmation-email';
import {SITE_URL, VORIG_ADRES} from '../site.config.mjs';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* ------------------------------------------------------------------ */
/*  Het contactformulier                                               */
/* ------------------------------------------------------------------ */

/**
 * Geen Turnstile: er staat geen widget op de pagina, en een site van één
 * mondhygiënist is voor een spammer geen doelwit dat de moeite loont. Het
 * verborgen veld `bedrijf` doet het werk. Een bot vult alles in wat hij in de
 * HTML ziet staan, een bezoeker komt er nooit, en wat er mét dat veld
 * binnenkomt wordt zonder spoor weggegooid.
 *
 * Dat is hier geen kleine keuze: Turnstile is een script van Cloudflare op elke
 * pagina, en dat zou langs de cookiemelding heen laden. Precies het probleem
 * dat we met de ruttl-widget net hadden opgelost.
 */
const formulier = createFormWorker({
  formPath: '/api/forms/contact',
  siteName: 'Bewust Gezond in je Mond',
  senderName: 'Marjon Ooteman',
  subjectPrefix: 'Nieuw bericht via de website',
  turnstile: false,
  honeypotField: 'bedrijf',
  confirmationEmail: marjonConfirmationEmail,

  /* Het formulier vraagt om één naam en niet om een voor- en achternaam, dus
     die komt als firstName binnen en achternaam blijft leeg. Zonder deze regel
     weigert het pakket elk bericht met "Vul uw achternaam in", en met de regel
     valt de lege regel in beide mails weg in plaats van er als "-" in te staan. */
  requireLastName: false,

  messageField: 'bericht',

  /* De standaardtekst van het pakket is geschreven voor offertes voor een klus.
     Hier wordt niets geoffreerd: iemand stelt een vraag. */
  leadEmail: {
    heading: 'Nieuw bericht via de website',
    messageHeading: 'Het bericht',
    nameLabels: {firstName: 'Naam', email: 'E-mailadres'},
    includeAttachments: false,
  },

  /* Wie de mail in zijn inbox ziet staan, ziet meteen van wie hij is. */
  subjectFields: ['firstName'],

  emailFields: [{name: 'telefoon', label: 'Telefoon'}],

  /* Geen bijlagen: het formulier vraagt er niet om, en een formulier dat om
     bestanden vraagt is een formulier dat groter lijkt dan het is. */
  attachmentMaxFiles: 0,
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
 * Welke host wint komt uit SITE_URL, zodat een verhuizing één regel in
 * site.config.mjs is en niet ook nog een lijst hier. De andere twee zijn de
 * www-variant en het conceptadres waarop de site is opgeleverd; dat laatste
 * staat bij Google en in berichten die Marjon al verstuurd heeft, dus het
 * blijft gekoppeld en stuurt door. Een host die niet in de routes van
 * wrangler.jsonc staat komt hier nooit langs, dus wat er te veel in staat kost
 * niets.
 */
const CANONIEKE_HOST = new URL(SITE_URL).hostname;

const ANDERE_HOSTS = [
  new URL(VORIG_ADRES).hostname,
  'bewustgezondinjemond.nl',
  'www.bewustgezondinjemond.nl',
].filter((host) => host !== CANONIEKE_HOST);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return formulier.fetch!(request, env, ctx);
    }

    /**
     * `wrangler dev` geeft de Worker niet het adres uit de adresbalk mee, maar
     * de host uit `routes` in wrangler.jsonc, over gewoon http. Lokaal komt
     * hier dus letterlijk `http://bewustgezondinjemond.nl/` binnen. Wie dat
     * niet weet bouwt hier een omleiding die op zijn eigen machine elk verzoek
     * naar de live site stuurt.
     *
     * Vandaar de grendel op https: op een custom domain serveert Cloudflare
     * alleen https (http wordt aan de rand al omgezet), dus in productie is
     * deze voorwaarde altijd waar en lokaal altijd onwaar.
     *
     * En alleen leesverzoeken: een 301 gooit de body van een POST weg. Het
     * formulier valt hier al buiten, maar de volgorde blijft zo ook kloppen als
     * er ooit een tweede POST bij komt.
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
     * dat is precies wat we willen. no-store betekent "bewaar niets", en dat
     * zet ook de bfcache uit, het geheugen waarmee de browser een pagina
     * terugtovert als iemand op de terugknop drukt.
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
