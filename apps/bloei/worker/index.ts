import {createFormWorker, type CloudflareFormsEnv} from '@jiw/cloudflare-forms';
import {bloeiConfirmationEmail} from './confirmation-email';
import {GESLOTEN, SITE_URL, TIJDELIJK_GESLOTEN} from '../site.config.mjs';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* ------------------------------------------------------------------ */
/*  Het aanvraagformulier                                              */
/* ------------------------------------------------------------------ */

/**
 * Geen Turnstile: er staat geen widget op de pagina en een bloemenwinkel is voor
 * een spammer geen doelwit dat de moeite loont. Het verborgen veld `bedrijf`
 * doet het werk: een bot vult alles in, een bezoeker ziet het niet, en wat er
 * mét dat veld binnenkomt wordt zonder spoor weggegooid.
 */
const formulier = createFormWorker({
  formPath: '/api/forms/aanvraag',
  siteName: 'Bloei!',
  senderName: 'Bloei! Ouddorp',
  subjectPrefix: 'Nieuwe aanvraag Bloei!',
  turnstile: false,
  honeypotField: 'bedrijf',
  confirmationEmail: bloeiConfirmationEmail,

  /* De standaardtekst van het pakket is geschreven voor offertes voor een klus.
     Dit is een tuincentrum: er wordt niet geoffreerd, er wordt klaargezet. */
  leadEmail: {
    heading: 'Nieuwe aanvraag via de website',
    messageHeading: 'Wensen van de klant',
    nameLabels: {firstName: 'Voornaam', lastName: 'Achternaam', email: 'E-mailadres'},
  },

  messageField: 'wensen',
  /* Wie de mail in zijn inbox ziet staan weet meteen waar het over gaat en
     wanneer het klaar moet staan. */
  subjectFields: ['soort', 'datum'],

  requiredFields: [
    {name: 'soort', label: 'soort bloemwerk'},
    /* Het telefoonnummer is verplicht. Het formulier vraagt er ook om, maar dat
       is een knop die uitstaat: een bericht dat rechtstreeks op dit adres
       binnenkomt heeft dat scherm nooit gezien. Wat de winkel nodig heeft om
       een aanvraag af te maken, hoort hier te staan en niet alleen daar. */
    {
      name: 'telefoon',
      label: 'telefoonnummer',
      message: 'Vul uw telefoonnummer in, dan kunnen we u bellen over uw aanvraag.',
    },
    /* Alleen als er bezorgd moet worden; wie zelf langskomt hoeft geen
       huisadres af te staan. */
    {
      name: 'adres',
      label: 'bezorgadres',
      message: 'Vul het bezorgadres in.',
      when: {field: 'leveringId', equals: 'bezorgen'},
    },
  ],

  /* De volgorde van de regels in de mail aan de winkel. Eerst wat er gemaakt
     moet worden, dan wanneer en waar, dan pas het bedrag. */
  emailFields: [
    {name: 'telefoon', label: 'Telefoon'},
    {name: 'soort', label: 'Wat'},
    {name: 'gelegenheid', label: 'Toelichting'},
    {name: 'levering', label: 'Ophalen of bezorgen'},
    {name: 'adres', label: 'Bezorgadres', when: {field: 'leveringId', equals: 'bezorgen'}},
    {name: 'datum', label: 'Wanneer'},
    {name: 'budget', label: 'Budget'},
  ],

  /* Geen bijlagen: niemand stuurt een foto mee bij een boeket, en een formulier
     dat om bestanden vraagt is een formulier dat groter lijkt dan het is. */
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
 * site.config.mjs is en niet ook nog een lijst hier. De andere twee zijn het
 * opleveradres en de variant van het eigen domein die overblijft. Een host die
 * niet in de routes van wrangler.jsonc staat komt hier nooit langs, dus wat er
 * te veel in staat kost niets.
 */
const CANONIEKE_HOST = new URL(SITE_URL).hostname;

/* Nog leeg: de site staat op één conceptadres. Komt er een eigen domein, dan
   komt het oude adres hier te staan en stuurt het zijn bezoekers met één 301
   door, net als bij de zusterapp fleurig. Een host die niet in de routes van
   wrangler.jsonc staat komt hier nooit langs, dus wat er te veel in staat kost
   niets. */
const ANDERE_HOSTS: string[] = [];

/* Oude adressen binnen deze site die verhuisd zijn, en waar ze nu staan. */
const VERHUISD: Record<string, string> = {
  '/zakelijk': '/abonnement/',
  '/zakelijk/': '/abonnement/',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      /**
       * De winkel is tijdelijk gesloten en het formulier staat niet meer op de
       * pagina. Dat is genoeg voor wie de site nu opent, maar niet voor een
       * tabblad dat al openstond, een pagina uit de cache van de browser, of
       * iemand die het adres kent: die kunnen hier nog steeds op posten, en dan
       * komt er een aanvraag binnen waar niemand op zit te wachten en gaat er
       * een bevestiging uit die belooft dat we ernaar kijken.
       *
       * 503 en niet 404: het adres bestaat, het doet nu alleen even niets. Zo
       * blijft het ook voor een logregel te onderscheiden van een verdwaald
       * verzoek.
       */
      if (TIJDELIJK_GESLOTEN) {
        return Response.json(
          /* Dezelfde vorm als de fouten van @jiw/cloudflare-forms ({ok, error,
             message}), zodat een oude pagina die hier nog op post de melding
             gewoon laat zien in plaats van "er ging iets mis". */
          {ok: false, error: 'store_closed', message: `${GESLOTEN.kop}. ${GESLOTEN.kort}`},
          {status: 503},
        );
      }
      return formulier.fetch!(request, env, ctx);
    }

    /**
     * `wrangler dev` geeft de Worker niet het adres uit de adresbalk mee, maar
     * de host uit `routes` in wrangler.jsonc, over gewoon http. Lokaal komt hier
     * dus letterlijk `http://bloei-concept.jouwconcept.app/` binnen. Wie dat niet
     * weet bouwt hier een omleiding die op zijn eigen machine elk verzoek naar
     * de live site stuurt, en dat is precies wat hier eerst gebeurde.
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

    /* De abonnementspagina stond een dag op /zakelijk/. Dat adres is gedeeld
       en staat dus in iemands tabblad; wie hem opent hoort de pagina te
       krijgen en geen 404. Eén regel, hij mag weg zodra dit concept een echte
       site is. */
    if (leesverzoek && VERHUISD[url.pathname]) {
      url.pathname = VERHUISD[url.pathname];
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
     * terugtovert als iemand op de terugknop drukt. Op mobiel is één op de vijf
     * navigaties een terug- of vooruitknop, en die zouden dan allemaal opnieuw
     * over de lijn moeten.
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
