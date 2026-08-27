import { SPONSORKLIKS } from '../ui';
import type { Actie, Blok, Pagina } from './index';

/**
 * De knoppen die in de mock-up nergens heen gingen.
 *
 * Het voorstel van het bestuur is een klikbaar model: op een paar plekken staat
 * een knop met `#` erachter, met de bedoeling dat de bouwer hem koppelt. Dat
 * gebeurt hier. Een knop waarvan de bestemming al in het blok eronder staat,
 * valt weg in plaats van dat hij naar dezelfde lijst wijst waar hij boven hangt.
 */

type Herstel = { href: string } | 'weg';

/** Per pagina en blok: wat er met een knop zonder bestemming moet gebeuren. */
const HERSTEL: Record<string, Record<string, Herstel>> = {
  '/over-ons/organisatie-en-verantwoording': {
    // De stukken staan als lijst in het blok zelf, dus een losse knop naar één
    // ervan zet de bezoeker op het verkeerde been.
    'beleidsplan-en-jaarstukken': 'weg',
    vrijwilligersbeleid: 'weg',
  },
  '/over-ons/steun-ons': {
    // De knop staat al in het blok zelf, naast de QR-code.
    'eenmalig-geven': 'weg',
    'steunen-via-je-aankopen': { href: SPONSORKLIKS },
    // De knop wees naar de pagina waar hij zelf op staat.
    'vriend-worden': { href: '/praktisch/contact' },
  },
};

const dood = (actie: Actie): boolean => !actie.href || actie.href === '#';

/* ------------------------------------------------------------------ */
/*  Knoppen die er nog niet waren                                      */
/* ------------------------------------------------------------------ */

/**
 * De acht antwoordpagina's onder /praktisch/vragen stonden in de mock-up wel
 * in de structuur, maar geen enkele pagina wees ernaar. Wie ze niet kan vinden,
 * heeft er niets aan, en de overdracht van de opdrachtgever vraagt letterlijk
 * dat elke bestemming een werkende vervolgstap heeft. Dus krijgt elk antwoord
 * op de vragenpagina een link naar zijn eigen pagina, en de twee die daar niet
 * op staan komen op de pagina waar ze thuishoren.
 */
const ERBIJ: Record<string, Record<string, Actie[]>> = {
  '/praktisch/vragen-over-een-bezoek': {
    'kan-ik-gewoon-binnenlopen': [
      { label: 'Lees het hele antwoord', href: '/praktisch/vragen/kan-ik-zonder-afspraak-binnenlopen', soort: 'tekst' },
    ],
    'heb-ik-een-verwijzing-nodig': [
      { label: 'Lees het hele antwoord', href: '/praktisch/vragen/heb-ik-een-verwijzing-nodig', soort: 'tekst' },
    ],
    'mag-ik-iemand-meenemen': [
      { label: 'Lees het hele antwoord', href: '/praktisch/vragen/mag-ik-iemand-meenemen', soort: 'tekst' },
    ],
    'moet-ik-over-kanker-praten': [
      { label: 'Lees het hele antwoord', href: '/praktisch/vragen/moet-ik-over-kanker-praten', soort: 'tekst' },
    ],
    'wat-kost-een-bezoek-of-activiteit': [
      { label: 'Lees het hele antwoord', href: '/praktisch/vragen/wat-kost-een-bezoek-of-activiteit', soort: 'tekst' },
    ],
    'is-toon-over-leven-medische-zorg': [
      { label: 'Lees het hele antwoord', href: '/praktisch/vragen/is-toon-over-leven-medische-zorg', soort: 'tekst' },
    ],
  },
  '/praktisch/eerste-keer': {
    'als-je-binnenkomt': [
      { label: 'Wat gebeurt er tijdens een eerste bezoek?', href: '/praktisch/vragen/wat-gebeurt-er-tijdens-een-eerste-bezoek', soort: 'tekst' },
    ],
  },
  '/kennis-en-wegwijzer/praten-lotgenotencontact-of-professionele-hulp': {
    'professionele-psychosociale-hulp': [
      { label: 'Wanneer zoek ik professionele hulp?', href: '/praktisch/vragen/wanneer-zoek-ik-professionele-hulp', soort: 'tekst' },
    ],
  },
};

export function metEchteLinks(pagina: Pagina): Pagina {
  const perBlok = HERSTEL[pagina.pad];
  const erbij = ERBIJ[pagina.pad];
  if (!perBlok && !erbij) return pagina;

  let veranderd = false;
  const blokken = pagina.blokken.map((blok): Blok => {
    // Alleen blokken die een knop kúnnen dragen. Een blok zonder knoppen heeft
    // het veld niet eens, dus er wordt op het soort gekeken en niet op de sleutel.
    if (blok.soort !== 'tekst' && blok.soort !== 'kaarten' && blok.soort !== 'kaart-plek') {
      return blok;
    }
    const id = 'id' in blok && blok.id ? blok.id : blok.soort;
    const acties = blok.acties ?? [];

    const wat = perBlok?.[id];
    const hersteld = wat
      ? acties
          .map((actie) => (dood(actie) && wat !== 'weg' ? { ...actie, href: wat.href } : actie))
          .filter((actie) => !dood(actie))
      : acties;

    const toe = erbij?.[id] ?? [];
    const nieuw = [...hersteld, ...toe.filter((a) => !hersteld.some((b) => b.href === a.href))];

    if (nieuw.length === acties.length && nieuw.every((a, i) => a.href === acties[i].href)) {
      return blok;
    }
    veranderd = true;
    return { ...blok, acties: nieuw } as Blok;
  });

  return veranderd ? { ...pagina, blokken } : pagina;
}
