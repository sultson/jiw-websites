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
  siteName: 'InstallatieVeilig',
  ownerName: 'Jasper',
  senderName: 'InstallatieVeilig',
  subjectPrefix: 'Nieuwe aanvraag InstallatieVeilig',
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
     */
    const leesverzoek = request.method === 'GET' || request.method === 'HEAD';
    if (leesverzoek && url.protocol === 'https:' && ANDERE_HOSTS.includes(url.hostname)) {
      url.hostname = CANONIEKE_HOST;
      return Response.redirect(url.toString(), 301);
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
