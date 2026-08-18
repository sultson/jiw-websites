import {createFormWorker, type CloudflareFormsEnv} from '@jiw/cloudflare-forms';
import {diasporaConfirmationEmail} from './confirmation-email';
import {SITE_URL, VORIG_ADRES} from '../site.config.mjs';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* ------------------------------------------------------------------ */
/*  Het contactformulier                                               */
/* ------------------------------------------------------------------ */

/**
 * Geen Turnstile: er staat geen widget op de pagina, en die er alsnog neerzetten
 * zou het formulier veranderen dat de klant heeft goedgekeurd. Het verborgen
 * veld `organisatie` doet het werk: het staat wel in de HTML, dus een bot die
 * alles invult trapt erin, een bezoeker ziet het nooit, en wat er mét dat veld
 * binnenkomt wordt zonder spoor weggegooid.
 *
 * De mail aan de stichting is Engels. De site heeft drie talen en de bestuurders
 * zitten op Boneiru, Kòrsou en in Nederland; Engels is de taal van het kale
 * adres en de enige die alle drie de besturen deelt. De bevestiging aan de
 * afzender gaat wel in zijn eigen taal, zie confirmation-email.ts.
 */
const formulier = createFormWorker({
  formPath: '/api/forms/contact',
  locale: 'en',
  siteName: '3 Diaspora',
  senderName: '3 Diaspora',
  subjectPrefix: 'New message via 3diaspora.org',
  turnstile: false,
  honeypotField: 'organisatie',
  confirmationEmail: diasporaConfirmationEmail,

  /* Het formulier noemt het veld `bericht`, niet `message`. */
  messageField: 'bericht',

  /* Wie de mail in zijn inbox ziet staan, weet aan de onderwerpregel al of het
     een vraag aan Boneiru is of iemand die wil meehelpen. */
  subjectFields: ['onderwerp'],

  /* De drie namen die het pakket zelf kent (firstName, lastName, email) staan
     er altijd boven. Dit is wat daar onder komt, in deze volgorde. */
  emailFields: [
    {name: 'onderwerp', label: 'Subject'},
    {name: 'telefoon', label: 'Phone number'},
  ],

  /* De standaardteksten van het pakket zijn geschreven voor offerteaanvragen.
     Dit is een contactformulier van een stichting: er wordt niets geoffreerd. */
  leadEmail: {
    heading: 'New message via 3diaspora.org',
    messageHeading: 'Message',
    nameLabels: {firstName: 'First name', lastName: 'Last name', email: 'Email address'},
  },

  /* Het formulier laat zes bestanden toe; de Worker hoort dezelfde grens aan te
     houden, anders keurt de ene af wat de andere doorlaat. Mensen sturen hier
     een oude foto of een archiefstuk mee, en dat zijn scans die groot mogen
     zijn. */
  attachmentMaxFiles: 6,
});

/* ------------------------------------------------------------------ */
/*  Eén adres voor de site                                             */
/* ------------------------------------------------------------------ */

/**
 * Drie hosts wijzen naar deze Worker: 3diaspora.org, www.3diaspora.org en het
 * opleveradres op jouwidealewebsite.nl. Zonder omleiding staat de site op drie
 * adressen tegelijk in de index en verdeelt hij zijn eigen positie over drie
 * kopieën. Daarom: één host wint, de rest stuurt zijn bezoekers en zijn links
 * daarheen door met één 301.
 *
 * De lijst wordt afgeleid van SITE_URL, dus het omzetten van dat ene adres in
 * site.config.mjs zet ook deze omleiding goed.
 */
const CANONIEKE_HOST = new URL(SITE_URL).hostname;

const ANDERE_HOSTS = [
  new URL(VORIG_ADRES).hostname,
  '3diaspora.org',
  'www.3diaspora.org',
].filter((host) => host !== CANONIEKE_HOST);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return formulier.fetch!(request, env, ctx);
    }

    /**
     * `wrangler dev` geeft de Worker niet het adres uit de adresbalk mee, maar
     * de host uit `routes` in wrangler.jsonc, over gewoon http. Lokaal komt hier
     * dus letterlijk http://3diaspora.jouwidealewebsite.nl/ binnen. Wie dat niet
     * weet bouwt hier een omleiding die op zijn eigen machine elk verzoek naar
     * de live site stuurt.
     *
     * Vandaar de grendel op https: op een custom domain serveert Cloudflare
     * alleen https (http wordt aan de rand al omgezet), dus in productie is deze
     * voorwaarde altijd waar en lokaal altijd onwaar.
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
     * De site is één HTML-bestand met een router erin. Elk pad dat geen bestand
     * is (/nl/bonaire, /pap/agenda) krijgt daarom index.html terug; dat regelt
     * `not_found_handling` in wrangler.jsonc.
     *
     * `no-cache` op de HTML en niet `no-store`. Ze klinken hetzelfde en zijn het
     * niet: no-cache betekent "bewaren mag, maar vraag eerst of het nog klopt",
     * en dat is precies wat we willen. no-store betekent "bewaar niets", en dat
     * zet ook de bfcache uit, het geheugen waarmee de browser een pagina
     * terugtovert als iemand op de terugknop drukt. Op mobiel is één op de vijf
     * navigaties een terug- of vooruitknop, en die zouden dan allemaal opnieuw
     * over de lijn moeten. De bestanden met een hash in hun naam gaan hier
     * omheen; die houden de lange cache uit public/_headers.
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
