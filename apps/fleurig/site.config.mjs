/**
 * Eén plek waar staat op welk adres deze site woont.
 *
 * Elke pagina noemt zichzelf in de canonical, in og:url en in de schema.org
 * blokken, en de sitemap somt ze allemaal op. Stond dat adres in de HTML zelf,
 * dan is een verhuizing naar een eigen domein een zoekactie door zeven
 * bestanden waarbij er altijd één blijft staan. Nu is het één regel.
 *
 * Dit is het eigen domein van de winkel. Het stond hier eerder ook al en is toen
 * teruggezet op het adres op jouwidealewebsite.nl, omdat de zone in Cloudflare
 * wel bestond maar geen enkel DNS-record had: het domein bestond voor een
 * bezoeker niet, dus wees elke canonical naar een deur die dicht zat. Nu staan
 * de twee custom_domain routes weer in wrangler.jsonc, en die koppelen het
 * domein echt aan de Worker: Cloudflare zet bij het koppelen zelf het
 * DNS-record klaar, wat een gewone route niet doet.
 *
 * Het adres waarop de site is opgeleverd blijft gekoppeld en stuurt zijn
 * bezoekers hierheen met één 301. Dat rijtje leidt worker/index.ts af van
 * precies deze regel.
 */
export const SITE_URL = 'https://bloemenwinkelfleurig.nl';

/** Het adres waarop de site is opgeleverd. Blijft doorsturen; niet weghalen. */
export const VORIG_ADRES = 'https://fleurig.jouwidealewebsite.nl';

/* ------------------------------------------------------------------ */
/*  Tijdelijk gesloten                                                 */
/* ------------------------------------------------------------------ */

/**
 * De winkel is dicht en neemt geen aanvragen aan.
 *
 * Eén schakelaar voor de hele site. Eraan hangen: de balk boven aan elke
 * pagina, de kop van de homepage, de openingstijden in de statuskaart, de
 * strip, het rooster en de aftiteling, het aanvraagformulier en elke knop die
 * daarheen wees. De Worker weigert er ook het formulieradres mee, zodat een
 * tabblad dat nog openstond geen aanvraag meer binnen kan brengen.
 *
 * Gaat de winkel weer open, dan is `false` genoeg: er is niets weggehaald, de
 * openingstijden staan er nog, en dan komt ook de meta description van de
 * homepage weer terug op wat de winkel doet in plaats van dat hij dicht is.
 */
export const TIJDELIJK_GESLOTEN = true;

/**
 * De melding staat op zeven plekken in beeld en hoort overal hetzelfde te
 * zeggen. Vandaar hier, en niet zeven keer overgeschreven.
 */
export const GESLOTEN = {
  kop: 'Tijdelijk gesloten',
  kort: 'De winkel is dicht en we nemen geen aanvragen aan.',
  lang:
    'Fleurig! aan de Molendijk is tijdelijk gesloten. De winkel is dicht en we ' +
    'nemen op dit moment geen aanvragen of bestellingen aan, ook niet voor rouw- ' +
    'en trouwbloemen. Zodra we weer opengaan, staat het hier en op Instagram en ' +
    'Facebook.',
};

export const SITE_NAAM = 'Fleurig! Bloemenwinkel';

/* ------------------------------------------------------------------ */
/*  De winkel                                                          */
/* ------------------------------------------------------------------ */

/* Dezelfde gegevens als in src/ui.tsx, hier nog een keer omdat build-scripts
   geen .tsx kunnen inlezen. Wijzigt er iets, dan op beide plekken. */
export const WINKEL = {
  telefoon: '+31630943626',
  /* Zoals een Nederlandse lezer hem schrijft. +31630943626 klopt voor een
     telefoon en voor schema.org, maar in een zin leest het als een foutcode. */
  telefoonWeergave: '06 30 94 36 26',
  email: 'fleurig26@gmail.com',
  straat: 'Molendijk 9-11',
  postcode: '3262 AH',
  plaats: 'Oud-Beijerland',
  regio: 'Zuid-Holland',
  land: 'NL',
  lat: 51.82671,
  lon: 4.41076,
};

/* ------------------------------------------------------------------ */
/*  De pagina's                                                        */
/* ------------------------------------------------------------------ */

/**
 * De volgorde is de volgorde in de sitemap. `prioriteit` is een hint en geen
 * weegschaal: Google gebruikt hem nauwelijks, maar hij kost niets en maakt de
 * onderlinge verhouding leesbaar voor wie de sitemap opent.
 *
 * `bestand` wijst naar het HTML-bestand in de bron; `pad` is het adres waarop
 * de bezoeker hem vindt. Beide worden gebruikt door scripts/prerender.mjs en
 * scripts/seo.mjs, zodat een nieuwe pagina op één plek wordt aangemeld.
 */
export const PAGINAS = [
  {pad: '/', bestand: 'index.html', component: 'src/App.tsx', prioriteit: '1.0', frequentie: 'weekly', inSitemap: true},
  {pad: '/boeketten/', bestand: 'boeketten/index.html', component: 'src/pages/Boeketten.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  {pad: '/abonnement/', bestand: 'abonnement/index.html', component: 'src/pages/Abonnement.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  {pad: '/rouwbloemen/', bestand: 'rouwbloemen/index.html', component: 'src/pages/Rouwbloemen.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  {pad: '/trouwbloemen/', bestand: 'trouwbloemen/index.html', component: 'src/pages/Trouwbloemen.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  /* De bedankpagina staat op noindex: hij bestaat alleen na het versturen van
     een aanvraag en heeft in de zoekresultaten niets te zoeken. */
  {pad: '/bedankt/', bestand: 'bedankt/index.html', component: 'src/pages/Bedankt.tsx', inSitemap: false},
  {pad: '/404.html', bestand: '404.html', component: 'src/pages/NietGevonden.tsx', inSitemap: false},
];
