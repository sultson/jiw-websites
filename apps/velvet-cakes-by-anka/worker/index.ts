import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { aanvraagConfirmationEmail } from './confirmation';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* Een formulier, en dat is het hele verhaal: haar site verkoopt een taart en
   elke pagina vraagt dezelfde vier dingen (datum, aantal personen, gelegenheid,
   smaak). De pagina waar iemand stond gaat als `herkomst` mee, zodat we weten
   of de aanvraag van de cozonac-pagina of van de startpagina komt zonder dat
   dat vier losse adressen hoeft te worden.

   `locale: 'nl'` bepaalt de taal van de foutmeldingen die een bezoeker alleen
   ziet als de controle in de browser is overgeslagen (gecachte pagina, een bot,
   JavaScript uit). De site is Nederlands geschreven en Engels en Roemeens zijn
   vertalingen daarvan, dus Nederlands is hier de juiste val. De bevestiging die
   de bezoeker krijgt volgt wel de taal van de pagina waar hij stond; die staat
   als `__jiw_confirmation_locale` in de html van de pagina zelf en wordt niet
   uit de browser gelezen - wie de Roemeense pagina invult hoort Roemeens terug
   te krijgen, ook met een Nederlandse browser.

   Geen Turnstile maar een lokvink (`website`, buiten beeld, gezet door
   bouw.mjs). Dat is geen extra resource, geen secret en geen verzoek naar een
   derde voor iemand die alleen een taart wil aanvragen. Een bot die dat veld
   vult krijgt {"ok":true} en er wordt niets opgeslagen en niets gemaild.

   Achternaam staat uit. Dit is een taart voor een feest en niet een contract:
   "Hallo Sanne" is genoeg om op terug te mailen, en het pakket laat een regel
   die niet verplicht is en leeg terugkwam weg - dus staat er in geen van de
   twee mails "Achternaam: -". */
const aanvraag = createFormWorker({
  locale: 'nl',
  siteName: 'Velvet Cakes by Anka',
  senderName: 'Velvet Cakes by Anka',
  formPath: '/api/forms/aanvraag',
  subjectPrefix: 'Nieuwe aanvraag velvetcakesbyanka.nl',
  // Zo staat in de onderwerpregel al waarvoor en wanneer. Die twee bepalen of
  // het nu wordt opengeklikt of vanavond.
  subjectFields: ['soort', 'datum'],
  messageField: 'smaak',
  requireFirstName: true,
  requireLastName: false,
  requireEmail: true,
  turnstile: false,
  honeypotField: 'website',
  /* Datum en gelegenheid hebben een sterretje op de pagina, dus de server houdt
     ze ook tegen. Zonder deze regels kan een bot of een gecachte pagina er
     langs en komt er een aanvraag binnen waar niet op te antwoorden valt - een
     taart zonder datum is geen aanvraag maar een vraag. */
  requiredFields: [
    { name: 'datum', label: 'datum', message: 'Vul de datum van het feest in.' },
    { name: 'soort', label: 'gelegenheid', message: 'Kies de gelegenheid.' },
  ],
  // Dezelfde volgorde als het formulier zelf: wie je bent, dan wat je nodig hebt.
  emailFields: [
    { name: 'tel', label: 'Telefoonnummer' },
    { name: 'datum', label: 'Datum van het feest' },
    { name: 'personen', label: 'Aantal personen' },
    { name: 'soort', label: 'Gelegenheid' },
  ],
  /* `herkomst` en `lang` staan hier en niet in emailFields: wij moeten weten van
     welke pagina de aanvraag komt en in welke taal we terugschrijven. De
     bezoeker hoeft niet te lezen op welke pagina hij stond - dat is een systeem
     dat zijn eigen leidingwerk laat zien. */
  leadOnlyEmailFields: [
    { name: 'herkomst', label: 'Pagina' },
    { name: 'lang', label: 'Taal van de pagina' },
  ],
  leadEmail: {
    heading: 'Nieuwe taartaanvraag via velvetcakesbyanka.nl',
    messageHeading: 'Smaak en idee',
    nameLabels: { firstName: 'Naam', email: 'E-mail' },
  },
  confirmationEmail: aanvraagConfirmationEmail,
});

/* De adressen van deze site zijn zonder .html. Die mét .html zijn in september
   en oktober in de WhatsApp-groep rondgestuurd toen de site nog op
   velvet-cakes-2-concept.klantenkraan.nl stond, en drie ervan bestaan niet meer
   als pagina:

     eclairs   -> vruchtengebak   Anka maakt geen eclairs meer en wilde
                                  vruchtengebak op die plek (18-10-2026).
     choux     -> choux-cupcakes  Choux en cupcakes staan sinds 18-10-2026 onder
     cupcakes  -> choux-cupcakes  een item, haar eigen indeling.

   Alles wat op .html eindigt gaat met een 301 naar het schone adres. Dat is een
   regel en geen lijst van tien, dus er kan geen adres buiten vallen; de drie
   hierboven krijgen hun eigen bestemming omdat die niet uit de naam volgt.
   Zonder dit landt elk gedeeld adres op de 404. */
const VERHUISD: Record<string, string> = {
  eclairs: 'vruchtengebak',
  choux: 'choux-cupcakes',
  cupcakes: 'choux-cupcakes',
};

function schoonAdres(pad: string): string | null {
  if (!pad.endsWith('.html')) return null;
  const zonder = pad.slice(0, -'.html'.length);
  // /index.html en /en/index.html horen op de startpagina van hun taal
  if (zonder === '/index') return '/';
  const m = zonder.match(/^(\/(?:en|ro))\/index$/);
  if (m) return `${m[1]}/`;
  // /en/eclairs.html hoort bij het Engelse vruchtengebak, niet bij het Nederlandse
  const d = zonder.match(/^(\/(?:en|ro))?\/([^/]+)$/);
  if (d && VERHUISD[d[2]]) return `${d[1] ?? ''}/${VERHUISD[d[2]]}`;
  return zonder;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // De worker loopt alleen voor /api/* en /*.html (run_worker_first in
    // wrangler.jsonc). Alle 31 pagina's komen rechtstreeks van de edge, zonder
    // worker ertussen.
    if (url.pathname === '/api/forms/aanvraag') return aanvraag.fetch!(request, env, ctx);

    // Een onbekend /api/-pad is geen pagina en hoort geen html terug te krijgen:
    // anders levert een typefout in het formulieradres de 404-pagina uit en
    // leest dat in de console als "het werkt, maar leeg".
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ ok: false, error: 'unknown_form' }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    const schoon = schoonAdres(url.pathname);
    if (schoon) {
      url.pathname = schoon;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
