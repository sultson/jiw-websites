/**
 * Een plek waar staat op welk adres deze site woont, en wat de zaak is.
 *
 * Elke pagina noemt zichzelf in de canonical, in og:url en in de schema.org
 * blokken, en de sitemap somt ze op. Stond dat adres in de HTML zelf, dan is
 * een verhuizing naar het eigen domein een zoekactie door een handvol
 * bestanden waarbij er altijd een blijft staan. Nu is het deze ene regel.
 */

/**
 * LET OP bij de verhuizing naar het eigen domein.
 *
 * GuySa heeft al een eigen site op `guysa-inboedels.be`, en die staat op dit
 * moment live. In het concept wees de canonical daar naartoe. Dat is netjes
 * bedoeld, maar het betekent letterlijk: "wat hier staat telt niet mee, kijk
 * daar maar". Een pagina met zo'n canonical wordt niet geindexeerd, hoe goed
 * hij ook is, dus er viel aan de vindbaarheid van deze site niets te meten.
 *
 * Sinds 01-11-2026 wijst de canonical naar deze site zelf. Daarmee kan hij
 * geindexeerd worden en is er iets te volgen in Search Console. De keerzijde
 * hoort erbij: er staan nu twee vindbare sites over hetzelfde bedrijf, en voor
 * dezelfde zoekwoorden. Zolang dit een voorstel is dat nog niet gewonnen is, is
 * dat een afweging en geen vergissing — maar ze mogen niet allebei blijven
 * staan.
 *
 * ---
 *
 * DE VERHUIZING NAAR www.guysa-inboedels.be, stap voor stap.
 *
 * Nomeo zet het DNS om en laat het blote domein met een 301 naar www wijzen;
 * de Worker hangt sinds 01-11-2026 aan `www.guysa-inboedels.be/*` via het
 * custom hostname (zie de routes in wrangler.jsonc). Zodra dat DNS leeft
 * serveert dit adres dus dezelfde site.
 *
 * In die tussentijd staat SITE_URL met opzet nog op het bureau-adres. De
 * bezoeker blijft dan op het eigen domein van de klant — geen 301 die hem naar
 * `guysa.jouwidealewebsite.nl` gooit, want dat is precies het adres dat een
 * klant niet in zijn adresbalk hoort te zien — en de canonical zorgt dat er
 * ondertussen maar één van de twee in de index komt. Dat is een nette, korte
 * tussenstand, geen eindstand.
 *
 * Omzetten is dit, in deze volgorde, en alleen als www.guysa-inboedels.be al
 * een 200 geeft:
 *
 *   1. SITE_URL hieronder → 'https://www.guysa-inboedels.be'
 *   2. ANDERE_HOSTS in worker/index.ts → ['guysa.jouwidealewebsite.nl']
 *      (vanaf dan 301't het bureau-adres naar het eigen domein in plaats van
 *      een tweede kopie van de site te zijn)
 *   3. `pnpm --filter @jiw/guysa ship` — de audit vergelijkt SITE_URL met de
 *      routes in wrangler.jsonc en valt om als stap 1 zonder route gedaan is
 *   4. `pnpm --filter @jiw/guysa indexnow`
 *   5. Search Console: nieuwe property voor het eigen domein, sitemap erin, en
 *      op de oude property de adreswijziging melden
 *   6. Afzender verhuizen: LEAD_SENDER en allowed_sender_addresses naar
 *      `no-reply@notify.guysa-inboedels.be`, met DKIM/SPF/DMARC in Cloudflare
 *      Email Service. Dit is het enige stuk dat echt DNS-werk kost, en het kan
 *      later — tot die tijd komt de bevestiging aan vanaf ons afzenderdomein.
 *
 * Gaat de deal niet door, dan hoort hier `noindex` op in plaats van dit lijstje.
 */
export const SITE_URL = 'https://guysa.jouwidealewebsite.nl';

export const SITE_NAAM = 'GuySa Inboedels & Opruimingen';

/** Het domein van de zaak zelf. Staat in de footer en in schema.org als `sameAs`. */
export const EIGEN_SITE = 'https://guysa-inboedels.be';

/* ------------------------------------------------------------------ */
/*  De zaak                                                            */
/* ------------------------------------------------------------------ */

/**
 * Telefoon, mail en de voorwaarden komen van hun eigen site; die zijn van hen
 * en openbaar. Er staat met opzet geen vestigingsadres bij: GuySa werkt vanuit
 * de bestelwagen en heeft geen balie, en een adres dat wij erbij verzinnen komt
 * in schema.org terecht en daarmee in Google.
 */
export const ZAAK = {
  telefoon: '+32472688835',
  /* Zoals een Vlaamse lezer hem schrijft. +32472688835 klopt voor een telefoon
     en voor schema.org, maar in een zin leest het als een foutcode. */
  telefoonWeergave: '0472 68 88 35',
  mail: 'info@guysa-inboedels.be',
  plaats: 'Antwerpen',
  regio: 'Antwerpen',
  land: 'BE',
  /* Het midden van het werkgebied, niet een vestiging. Gebruikt voor de
     straal in schema.org. */
  lat: 51.17,
  lon: 4.47,
  /* De straal waarbinnen ze dagelijks rijden, in meters. De gemeentes staan in
     PLAATSEN in src/ui.tsx; dit is dezelfde regio als cirkel, voor een
     zoekmachine die geen lijst met gemeentes leest. */
  straalMeter: 25_000,
  voorwaarden: 'https://guysa-inboedels.be/products/pages/terms',
  privacy: 'https://guysa-inboedels.be/products/pages/privacy-policy',
  googleReviews: 'https://www.google.com/search?q=GuySa+Inboedels+en+Opruimingen+Reviews&hl=nl',
};

/* ------------------------------------------------------------------ */
/*  De pagina's                                                        */
/* ------------------------------------------------------------------ */

/**
 * `bestand` wijst naar het HTML-bestand in de bron, `pad` is het adres waarop
 * de bezoeker hem vindt. Beide worden gebruikt door scripts/prerender.mjs,
 * scripts/seo.mjs en scripts/audit-seo.mjs, zodat een nieuwe pagina zich op een
 * plek aanmeldt en dan meteen ook in de sitemap en in de controle meeloopt.
 *
 * Het zijn er nu twee: de site is een lange pagina met ankers, en de 404. Dat
 * is bewust zo gebleven bij het overzetten — losse dienstpagina's maken
 * ("inboedel opruimen", "inboedel opkopen", "ontruiming na overlijden") is de
 * grootste winst die er voor de vindbaarheid nog te halen valt, maar daar is
 * tekst voor nodig die GuySa zelf moet aanleveren. Zie SEO.md.
 */
export const PAGINAS = [
  {pad: '/', bestand: 'index.html', component: 'src/App.tsx', inSitemap: true},
  {pad: '/404.html', bestand: '404.html', component: 'src/pages/NietGevonden.tsx', inSitemap: false},
];
