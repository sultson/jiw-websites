import type { Kaart, Pagina } from './index';

/**
 * De pagina waar de sponsoren staan, en de kaart die ernaar wijst.
 *
 * Deze pagina stond niet in de mock-up van het bestuur, dus hij staat ook niet
 * in paginas.json: dat bestand is de uitgelezen mock-up en wordt opnieuw
 * geschreven zodra er een nieuwe versie van komt. Een pagina die daar met de
 * hand bij gezet wordt, is de eerstvolgende keer weg. Daarom staat hij hier,
 * in dezelfde vorm als elke andere pagina, en schuift `metSponsorpagina` hem
 * erbij op het moment dat de lijst gelezen wordt. Alles wat de site uit die
 * lijst haalt (de adressen, de titels, de sitemap, de gestructureerde gegevens)
 * krijgt hem daardoor vanzelf mee.
 *
 * Waarom hij er is: de logo's stonden alleen onderaan Steun ons, dus alleen
 * iemand die al besloten had te gaan geven kwam ze tegen. Ze horen zichtbaar te
 * zijn voor wie dat nog niet besloten heeft, want dat is precies wat een
 * sponsor ervoor terugkrijgt. In de voet staan ze nu op elke pagina, en hier
 * staan ze met hun naam en hun eigen adres erbij.
 */

const SPONSORPAGINA: Pagina = {
  pad: '/over-ons/onze-sponsors',
  titel: 'Onze sponsors',
  omschrijving:
    'Bedrijven, fondsen en ondernemers uit Zeewolde en daarbuiten houden Toon over Leven overeind met geld, materialen of hun vak. Hier staan ze bij elkaar, met een link naar hun eigen site.',
  soort: 'regular',
  sectie: 'about',
  kruimels: [
    { label: 'Home', href: '/' },
    { label: 'Over ons', href: '/over-ons' },
    { label: 'Onze sponsors' },
  ],
  hero: {
    kicker: 'Over ons',
    titel: 'Onze sponsors',
    lead: [
      'Toon over Leven krijgt geen vaste financiering. Dat het huis open is, dat er koffie staat en dat de workshops doorgaan, komt door de bedrijven, fondsen en ondernemers op deze pagina. Klik op een logo om naar hun eigen site te gaan.',
    ],
    onder: [],
    acties: [],
    beeld: 'hero-home',
    alt: 'Een cheque voor Toon over Leven wordt overhandigd voor een wand met logo’s van sponsoren.',
    route: false,
  },
  blokken: [
    {
      soort: 'tekst',
      // Het id waarop sleuven.tsx de echte logo's uit het beheer inschuift.
      id: 'onze-sponsors',
      kop: 'Wie dit huis mede mogelijk maken',
      tekst: [
        [
          'De logo’s hieronder komen uit het beheer, dus de lijst is altijd de lijst van nu.',
        ],
      ],
    },
    {
      soort: 'tekst',
      id: 'ook-sponsor-worden',
      kop: 'Ook sponsor worden?',
      tekst: [
        [
          'Een jaarlijkse bijdrage, materialen, of een dienst uit je eigen vak: alle drie helpen ze even hard. Je logo komt op deze pagina en in de voet van elke pagina van de site te staan.',
        ],
        [
          'Op Steun ons staat wat de mogelijkheden zijn en wat er met een bijdrage gebeurt. Weet je nog niet wat past, bel of mail dan gerust eerst.',
        ],
      ],
      acties: [
        { label: 'Bekijk hoe je kunt steunen', href: '/over-ons/steun-ons', soort: 'hoofd' },
        { label: 'Neem contact op', href: '/praktisch/contact', soort: 'tekst' },
      ],
    },
  ],
  zijkaart: {
    kicker: 'Iets bespreken?',
    kop: 'Je hoeft nog niet te weten wat je wilt bijdragen.',
    tekst: [['Stel je vraag, dan kijken we samen welke vorm bij je bedrijf past.']],
    acties: [
      { label: 'Neem contact op', href: '/praktisch/contact', soort: 'hoofd' },
      { label: 'Bekijk Steun ons', href: '/over-ons/steun-ons', soort: 'tekst' },
    ],
  },
};

/** De kaart die de sponsoren op de hubpagina Over ons vindbaar maakt. */
const HUBKAART: Kaart = {
  icoon: 'i4',
  kop: 'Onze sponsors',
  tekst: [
    [
      'Bekijk welke bedrijven, fondsen en ondernemers Toon over Leven mogelijk maken, en hoe je zelf sponsor wordt.',
    ],
  ],
  acties: [{ label: 'Bekijk onze sponsors', href: SPONSORPAGINA.pad, soort: 'hoofd' }],
};

/**
 * De sponsorpagina tussen de vastgestelde pagina's, op de plek waar hij
 * hoort: naast Steun ons, met de verantwoording erachter. Diezelfde volgorde
 * staat in het menu onderaan de site.
 *
 * De kaart op Over ons komt er in één moeite bij. Die hubpagina somt de
 * pagina's over de organisatie op, en een rubriek die één van zijn eigen
 * pagina's niet noemt, is een rubriek waarin je hem niet kunt vinden.
 */
export function metSponsorpagina(paginas: Pagina[]): Pagina[] {
  const uit: Pagina[] = [];

  for (const pagina of paginas) {
    if (pagina.pad === '/over-ons') {
      uit.push(metHubkaart(pagina));
      continue;
    }
    uit.push(pagina);
    if (pagina.pad === '/over-ons/steun-ons') uit.push(SPONSORPAGINA);
  }

  // Staat Steun ons er niet (een uitgeklede mock-up), dan hoort de pagina er
  // nog steeds te zijn: hij heeft een adres dat werken moet.
  if (!uit.some((pagina) => pagina.pad === SPONSORPAGINA.pad)) uit.push(SPONSORPAGINA);

  return uit;
}

/** De kaart erbij, achter Steun ons, zonder de andere kaarten aan te raken. */
function metHubkaart(hub: Pagina): Pagina {
  const blokken = hub.blokken.map((blok) => {
    if (blok.soort !== 'kaarten' || !blok.kaarten?.length) return blok;
    if (blok.kaarten.some((kaart) => kaart.kop === HUBKAART.kop)) return blok;

    const kaarten = [...blok.kaarten];
    const na = kaarten.findIndex((kaart) =>
      kaart.acties?.some((actie) => actie.href === '/over-ons/steun-ons'),
    );
    kaarten.splice(na === -1 ? kaarten.length : na + 1, 0, HUBKAART);
    return { ...blok, kaarten };
  });

  return { ...hub, blokken };
}
