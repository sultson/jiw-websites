import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { offerteConfirmationEmail } from './confirmation';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/*
 * Een formulier, en dat is het hele verhaal: de site vraagt op beide pagina's hetzelfde
 * (naam, mail, telefoon, plaats, hoeveel m2, wat er nodig is, en een vrij veld). De
 * pagina waar iemand stond gaat als `herkomst` mee, zodat we weten of de aanvraag van
 * de startpagina of van /werkwijze/ komt zonder dat dat twee losse adressen hoeft te
 * worden.
 *
 * Geen Turnstile maar een lokvink (`website`, op display:none, gezet door build.mjs).
 * Dat is geen extra resource, geen secret en geen verzoek naar een derde voor iemand
 * die alleen een prijs wil. Een bot die dat veld vult krijgt {"ok":true} en er wordt
 * niets opgeslagen en niets gemaild.
 *
 * Achternaam staat uit. Dit is een offerteaanvraag voor een wand en geen contract:
 * "Beste Pascal" is genoeg om op terug te mailen, en het pakket laat een ingebouwde
 * regel die niet verplicht is en leeg terugkwam weg - dus staat er in geen van de twee
 * mails "Achternaam: -".
 */
const offerte = createFormWorker({
  // Bepaalt de taal van de foutmeldingen die een bezoeker alleen ziet als de controle
  // in de browser is overgeslagen (gecachte pagina, een bot, javascript uit). De site
  // is eentalig Nederlands.
  locale: 'nl',
  siteName: 'Hulskers Schilderwerken',
  senderName: 'Hulskers Schilderwerken',
  formPath: '/api/forms/offerte',
  subjectPrefix: 'Nieuwe offerteaanvraag hulskersschilderwerken.nl',
  // Zo staat in de onderwerpregel al waarvoor en waar. Die twee bepalen of het nu
  // wordt opengeklikt of vanavond - een renovliesklus in Coevorden is een ander
  // bericht dan schilderwerk aan de andere kant van het land.
  subjectFields: ['soort', 'plaats'],
  messageField: 'bericht',
  requireFirstName: true,
  requireLastName: false,
  requireEmail: true,
  turnstile: false,
  honeypotField: 'website',
  /*
   * Naam en e-mail staan als `required` op de pagina, dus de server houdt ze ook tegen
   * (dat doet het pakket zelf via requireFirstName/requireEmail). De rest is bewust
   * NIET verplicht: zijn eigen advertentie nodigt uit om "vrijblijvend naar informatie
   * of prijzen te vragen", en iemand die niet weet hoeveel m2 hij heeft moet dat
   * kunnen versturen. Een verplicht veld dat de bezoeker niet kan invullen is een
   * aanvraag die niet binnenkomt.
   */
  // Dezelfde volgorde als het formulier zelf: wie u bent, dan wat u nodig heeft.
  emailFields: [
    { name: 'tel', label: 'Telefoon' },
    { name: 'plaats', label: 'Plaats' },
    { name: 'm2', label: 'Ongeveer aantal m2' },
    { name: 'soort', label: 'Wat heeft u nodig?' },
  ],
  /*
   * `herkomst` staat hier en niet in emailFields: wij moeten weten van welke pagina de
   * aanvraag komt, de bezoeker hoeft niet te lezen op welke pagina hij stond. Dat is
   * een systeem dat zijn eigen leidingwerk laat zien.
   */
  leadOnlyEmailFields: [{ name: 'herkomst', label: 'Pagina' }],
  leadEmail: {
    heading: 'Nieuwe offerteaanvraag via hulskersschilderwerken.nl',
    messageHeading: 'Waar het om gaat',
    nameLabels: { firstName: 'Naam', email: 'E-mail' },
    // Het formulier neemt geen bestanden aan, dus zonder dit staat er in elke mail aan
    // Pascal "Geen bijlagen meegestuurd" onder een kopje - elke keer, voor altijd.
    includeAttachments: false,
  },
  confirmationEmail: offerteConfirmationEmail,
});

/*
 * De oude conceptadressen.
 *
 * De site stond van 19-10-2026 tot 26-10-2026 op hulskers-renovlies-concept.jouwconcept.app
 * met `Allow: /` in robots.txt, dus dat adres is in die week gedeeld EN indexeerbaar
 * geweest. Die host blijft als custom domain aan deze Worker hangen en wordt hier met
 * een 301 naar het eigen domein gestuurd, met pad en query intact.
 *
 * Twee redenen om dat niet aan een Redirect Rule op de zone over te laten, zoals bij
 * velvet-cakes: jouwconcept.app is een zone die we voor tientallen concepten gebruiken,
 * en een regel daar raakt per ongeluk een buur. In de worker staat hij naast het adres
 * dat hij bedient.
 *
 * `www` gaat ook hierlangs, als tweede slot naast de Redirect Rule op de eigen zone.
 * Dat is bewust dubbel: wordt die rule ooit weggehaald, dan blijft www omleiden in
 * plaats van een complete tweede kopie van de site uit te leveren.
 */
const CANONIEK = 'hulskersschilderwerken.nl';
const ANDERE_HOSTS = new Set([
  'www.hulskersschilderwerken.nl',
  'hulskers-renovlies-concept.jouwconcept.app',
]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/forms/offerte') return offerte.fetch!(request, env, ctx);

    // Een onbekend /api/-pad is geen pagina en hoort geen html terug te krijgen:
    // anders levert een typefout in het formulieradres de 404-pagina uit, en dat leest
    // in de console als "het werkt, maar leeg".
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ ok: false, error: 'unknown_form' }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    /*
     * Alles naar het canonieke adres over https.
     *
     * Always Use HTTPS staat niet vanzelf aan op een nieuwe zone en het wrangler-token
     * mag zone-instellingen alleen lezen, dus die omleiding staat hier (zie cdlf,
     * 10-10-2026: http gaf daar een 200 in plaats van een omleiding).
     *
     * Let op: dit werkt alleen doordat `run_worker_first` in wrangler.jsonc aan staat.
     * Workers Assets levert een bestand dat in dist/ ligt zelf uit en draait de worker
     * dan NIET - die is standaard alleen de terugval voor wat er niet ligt. Zonder die
     * regel geeft www een gewone 200 met de hele site erop: precies de twee kopieen die
     * deze omleiding moet voorkomen, en van buiten ziet dat eruit alsof het werkte.
     */
    if (ANDERE_HOSTS.has(url.hostname) || url.protocol !== 'https:') {
      url.hostname = CANONIEK;
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
