/**
 * De stukken staan op onze eigen server en niet als link naar hun oude
 * WordPress. Een ANBI moet deze stukken zelf publiceren, en zodra die oude site
 * eraf gaat zou zo'n link dood zijn. Ze zijn ongewijzigd overgenomen.
 */

/**
 * Eén stuk zoals het op de site staat. De grootte hoort erbij: wie dit op een
 * telefoon buiten de deur opent, mag van tevoren weten of hij een halve
 * megabyte binnenhaalt.
 */
export type Stuk = {
  naam: string;
  /** Waar het over gaat. Alleen waar de titel het niet zelf al zegt. */
  over?: string;
  bestand: string;
  grootte: string;
};

export const VERANTWOORDING: Stuk[] = [
  {
    naam: 'Beleidsplan 2026 tot 2030',
    over: 'Waar de stichting de komende jaren heen wil en hoe dat betaald wordt',
    bestand: '/docs/beleidsplan-2026-2030.pdf',
    grootte: '721 kB',
  },
  {
    naam: 'Sociaal jaarverslag 2025',
    over: 'Wat er in 2025 is gedaan, in woorden en in aantallen',
    bestand: '/docs/sociaal-jaarverslag-2025.pdf',
    grootte: '793 kB',
  },
  {
    naam: 'ANBI-verslag 2025',
    over: 'De financiële verantwoording over 2025, op het formulier van de Belastingdienst',
    bestand: '/docs/anbi-verslag-2025.pdf',
    grootte: '300 kB',
  },
  {
    naam: 'ANBI-verslag 2024',
    over: 'De financiële verantwoording over 2024',
    bestand: '/docs/anbi-verslag-2024.pdf',
    grootte: '294 kB',
  },
  {
    naam: 'ANBI-verslag 2023',
    over: 'De financiële verantwoording over 2023',
    bestand: '/docs/anbi-verslag-2023.pdf',
    grootte: '1,3 MB',
  },
];

export const VRIJWILLIGERSBELEID: Stuk[] = [
  { naam: 'Gedragscode en houding', bestand: '/documents/gedragscode-en-houding-202610.pdf', grootte: '406 kB' },
  { naam: 'IPSO privacy-spelregels', bestand: '/documents/ipso-privacy-spelregels-202610.pdf', grootte: '180 kB' },
  { naam: 'Klachtenformulier', bestand: '/documents/klachtenformulier-202610.pdf', grootte: '364 kB' },
  { naam: 'Klachtenprocedure', bestand: '/documents/klachtenprocedure-202610.pdf', grootte: '586 kB' },
  { naam: 'Vertrouwenscontactpersoon', bestand: '/documents/vertrouwenscontactpersoon-202610.pdf', grootte: '301 kB' },
  { naam: 'Vrijwilligersovereenkomst', bestand: '/documents/vrijwilligersovereenkomst-202610.pdf', grootte: '745 kB' },
  { naam: 'Vrijwilligersreglement', bestand: '/documents/vrijwilligersreglement-202610.pdf', grootte: '549 kB' },
  { naam: 'Wet- en regelgeving', bestand: '/documents/wet-en-regelgeving-202610.pdf', grootte: '835 kB' },
];
