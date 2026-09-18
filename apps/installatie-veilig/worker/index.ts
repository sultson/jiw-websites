import {createFormWorker, type CloudflareFormsEnv} from '@jiw/cloudflare-forms';
import {installatieVeiligConfirmationEmail} from './confirmation-email';
import {ANDERE_HOSTS, CANONIEKE_HOST} from './site';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* ------------------------------------------------------------------ */
/*  Het aanvraagformulier                                              */
/* ------------------------------------------------------------------ */

/**
 * Geen Turnstile: er staat geen widget op de pagina en een eenmanszaak in
 * Breda is voor een spammer geen doelwit dat de moeite loont. Het verborgen
 * veld `bedrijf` doet het werk: een bot vult alles in, een bezoeker ziet het
 * niet, en wat er mét dat veld binnenkomt wordt zonder spoor weggegooid.
 */
const formulier = createFormWorker({
  formPath: '/api/forms/aanvraag',
  siteName: 'Installatie Veilig',
  ownerName: 'Jasper',
  senderName: 'Installatie Veilig',
  subjectPrefix: 'Nieuwe aanvraag Installatie Veilig',
  confirmationFollowUpSentence:
    'Jasper laat u binnen een werkdag weten wat het kost en wanneer het kan.',
  turnstile: false,
  honeypotField: 'bedrijf',
  confirmationEmail: installatieVeiligConfirmationEmail,

  /* Wie de mail in zijn inbox ziet staan weet meteen waar het over gaat en
     waar het is: dat is bij een aanvraag het enige dat telt om te bepalen of
     hij er meteen achteraan gaat. */
  subjectFields: ['klus', 'plaats'],

  /* De standaardtekst van het pakket ("Nieuwe offerteaanvraag",
     "Projectomschrijving") is geschreven voor een offertetraject. Hier komt een
     aanvraag binnen met een adres en meestal een foto erbij. */
  leadEmail: {
    heading: 'Nieuwe aanvraag via installatieveilig.nl',
    messageHeading: 'Toelichting van de klant',
    nameLabels: {firstName: 'Voornaam', lastName: 'Achternaam', email: 'E-mailadres'},
  },

  messageField: 'toelichting',

  /* Het telefoonnummer is verplicht. Het formulier vraagt er ook om, maar dat
     is een knop die uitstaat: wie rechtstreeks op dit adres post heeft dat
     scherm nooit gezien. Wat nodig is om een aanvraag af te maken, hoort hier
     te staan en niet alleen daar. */
  requiredFields: [
    {
      name: 'telefoon',
      label: 'telefoonnummer',
      message: 'Vul uw telefoonnummer in, dan kan Jasper u bellen over uw aanvraag.',
    },
    {name: 'adres', label: 'adres', message: 'Vul uw postcode en huisnummer in.'},
  ],

  /* De volgorde van de regels in de mail. Eerst hoe hij u bereikt, dan wat er
     moet gebeuren, dan waar. */
  emailFields: [
    {name: 'telefoon', label: 'Telefoon'},
    {name: 'klus', label: 'Waarvoor'},
    {name: 'keuze', label: 'Wat precies'},
    {name: 'adres', label: 'Adres'},
  ],

  /* Het formulier laat er zes toe; het pakket stond op vijf, en dan verdwijnt
     de zesde foto met een foutmelding die de bezoeker niet zag aankomen. */
  attachmentMaxFiles: 6,
});

/* ------------------------------------------------------------------ */
/*  Eén adres voor de site                                             */
/* ------------------------------------------------------------------ */

/**
 * Adressen van de vorige site op dit domein. Google kende ze nog en meldde ze
 * in Search Console als 404. Die inhoud staat nu op de ene pagina, dus elk oud
 * adres gaat met één 301 naar de plek waar hij nu staat. Sleutels in kleine
 * letters en zonder schuine streep aan het eind: de oude site schreef
 * `/Diensten/`.
 */
const OUDE_PADEN: Record<string, string> = {
  '/home': '/',
  '/diensten': '/#diensten',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return formulier.fetch!(request, env, ctx);
    }

    /**
     * `wrangler dev` geeft de Worker niet het adres uit de adresbalk mee, maar
     * de eerste host uit `routes` in wrangler.jsonc, over gewoon http. Zonder
     * de grendel op https stuurt deze omleiding lokaal elk verzoek naar de
     * live site. Op een custom domain serveert Cloudflare alleen https (http
     * wordt aan de rand al omgezet), dus in productie is die voorwaarde altijd
     * waar en lokaal altijd onwaar.
     *
     * En alleen leesverzoeken: een 301 gooit de body van een POST weg. Het
     * formulier valt hierboven al af, maar zo blijft de volgorde ook kloppen
     * als er ooit een tweede POST bij komt.
     *
     * Een oud pad op een andere host (`www.…/Diensten/`) krijgt beide in één
     * sprong, geen 301 naar de host en dan nog een naar het pad.
     */
    const leesverzoek = request.method === 'GET' || request.method === 'HEAD';
    if (leesverzoek) {
      const oudPad = OUDE_PADEN[url.pathname.toLowerCase().replace(/\/+$/, '')];
      const andereHost = url.protocol === 'https:' && ANDERE_HOSTS.includes(url.hostname);
      if (oudPad || andereHost) {
        const doel = oudPad ? new URL(oudPad, url) : url;
        if (andereHost) doel.hostname = CANONIEKE_HOST;
        return Response.redirect(doel.toString(), 301);
      }
    }

    /**
     * De pagina is bij het bouwen als complete HTML weggeschreven, dus de
     * bestanden gaan eruit zoals ze zijn. Alleen de HTML zelf moet elke keer
     * opnieuw gecontroleerd worden; de bestanden met een hash in hun naam
     * houden de lange cache uit public/_headers.
     *
     * `no-cache` en niet `no-store`. Ze klinken hetzelfde en zijn het niet:
     * no-cache betekent "bewaren mag, maar vraag eerst of het nog klopt", en
     * dat is precies wat we willen. no-store betekent "bewaar niets", en dat
     * zet ook de bfcache uit, het geheugen waarmee de browser een pagina
     * terugtovert als iemand op de terugknop drukt.
     *
     * public/404.html is voor Cloudflare ook gewoon een bestand, dus `/404`
     * antwoordde 200 met "Deze pagina bestaat niet": voor Google een zachte
     * 404. Wie die pagina rechtstreeks opvraagt krijgt hem daarom met de
     * status die erbij hoort, en `/404.html` zonder eerst een 307 naar `/404`.
     */
    const foutpagina = /^\/404(\.html)?\/?$/i.test(url.pathname);
    const antwoord = await env.ASSETS.fetch(
      foutpagina ? new Request(new URL('/404', url), request) : request,
    );
    const type = antwoord.headers.get('content-type') ?? '';
    if (!type.includes('text/html')) return antwoord;

    const headers = new Headers(antwoord.headers);
    headers.set('Cache-Control', 'no-cache');
    return new Response(antwoord.body, {
      status: foutpagina ? 404 : antwoord.status,
      statusText: foutpagina ? 'Not Found' : antwoord.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
