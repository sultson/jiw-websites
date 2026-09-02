/**
 * De navigatie zoals het bestuur hem heeft vastgesteld: zes rubrieken en één
 * knop die overal hetzelfde belooft.
 *
 * De rubrieken staan naast elkaar omdat een bezoeker binnenkomt met een vraag
 * en niet met een organogram: wat is er te doen, ik ben jong, ik ben naaste,
 * hoe is het voor anderen, wat betekent dit allemaal, en hoe werkt het hier.
 * Over ons staat bewust niet in de balk maar in de voet: dat is wat je opzoekt
 * als je de rest al gezien hebt.
 */

export type Menupunt = { pad: string; label: string; kinderen?: { pad: string; label: string }[] };

export const MENU: Menupunt[] = [
  {
    pad: '/activiteiten',
    label: 'Activiteiten',
    kinderen: [
      { pad: '/activiteiten/alle-activiteiten', label: 'Alle activiteiten' },
      { pad: '/activiteiten/agenda', label: 'Kalender en agenda' },
      { pad: '/activiteiten/per-thema', label: 'Per thema' },
      { pad: '/activiteiten/voor-jongeren-15-35', label: 'Voor jongeren 15–35' },
      { pad: '/activiteiten/voor-35-50', label: 'Voor 35–50' },
      { pad: '/activiteiten/voor-naasten', label: 'Voor naasten' },
    ],
  },
  {
    pad: '/jong-en-kanker',
    label: 'Jong & kanker',
    kinderen: [
      { pad: '/jong-en-kanker/jong-en-kanker', label: 'Jong en kanker' },
      { pad: '/jong-en-kanker/ik-ben-in-behandeling', label: 'Ik ben in behandeling' },
      { pad: '/jong-en-kanker/mijn-behandeling-is-klaar', label: 'Mijn behandeling is klaar' },
      { pad: '/jong-en-kanker/aya-leeftijdgenoten-ontmoeten', label: 'AYA / leeftijdgenoten' },
      { pad: '/jong-en-kanker/werk-studie-en-kanker', label: 'Werk, studie & kanker' },
      { pad: '/jong-en-kanker/relaties-intimiteit-en-gezin', label: 'Relaties, intimiteit & gezin' },
      { pad: '/jong-en-kanker/activiteiten-voor-jongeren', label: 'Activiteiten voor jongeren' },
    ],
  },
  {
    pad: '/voor-naasten',
    label: 'Voor naasten',
    kinderen: [
      { pad: '/voor-naasten/mijn-partner-heeft-kanker', label: 'Mijn partner heeft kanker' },
      { pad: '/voor-naasten/mijn-ouder-heeft-kanker', label: 'Mijn ouder heeft kanker' },
      { pad: '/voor-naasten/ik-ben-een-jonge-naaste', label: 'Ik ben een jonge naaste' },
      { pad: '/voor-naasten/zorgen-voor-iemand-en-voor-jezelf', label: 'Zorgen voor iemand én voor jezelf' },
      { pad: '/voor-naasten/rouw-en-verlies', label: 'Rouw & verlies' },
      { pad: '/voor-naasten/activiteiten-voor-naasten', label: 'Activiteiten voor naasten' },
    ],
  },
  {
    pad: '/ervaringen',
    label: 'Ervaringen',
    kinderen: [
      { pad: '/ervaringen/verhalen-van-bezoekers', label: 'Verhalen van bezoekers' },
      { pad: '/ervaringen/jong-en-kanker', label: 'Jong & kanker' },
      { pad: '/ervaringen/naasten', label: 'Naasten' },
      { pad: '/ervaringen/leven-na-behandeling', label: 'Leven na behandeling' },
      { pad: '/ervaringen/echte-vragen', label: 'Echte vragen' },
      { pad: '/nieuws', label: 'Nieuws en verhalen' },
    ],
  },
  {
    pad: '/kennis-en-wegwijzer',
    label: 'Kennis',
    kinderen: [
      { pad: '/kennis-en-wegwijzer/wat-is-psychosociale-ondersteuning', label: 'Wat is psychosociale ondersteuning' },
      { pad: '/kennis-en-wegwijzer/wat-is-een-centrum-voor-leven-met-en-na-kanker', label: 'Wat is een IPSO-centrum' },
      { pad: '/kennis-en-wegwijzer/emoties-energie-werk-en-relaties', label: 'Emoties, energie, werk en relaties' },
      { pad: '/kennis-en-wegwijzer/praten-lotgenotencontact-of-professionele-hulp', label: 'Praten of professionele hulp' },
      { pad: '/kennis-en-wegwijzer/wanneer-past-een-ipso-centrum', label: 'Wanneer past een IPSO-centrum' },
      { pad: '/kennis-en-wegwijzer/passende-ondersteuning-vinden', label: 'Passende ondersteuning vinden' },
      { pad: '/voor-verwijzers', label: 'Voor verwijzers' },
    ],
  },
  {
    pad: '/praktisch',
    label: 'Praktisch',
    kinderen: [
      { pad: '/praktisch/eerste-keer', label: 'Eerste keer?' },
      { pad: '/praktisch/zo-werkt-toon-over-leven', label: 'Zo werkt Toon over Leven' },
      { pad: '/praktisch/openingstijden', label: 'Openingstijden' },
      { pad: '/praktisch/locatie-en-bereikbaarheid', label: 'Locatie & bereikbaarheid' },
      { pad: '/praktisch/kosten', label: 'Kosten' },
      { pad: '/praktisch/vragen-over-een-bezoek', label: 'Vragen over een bezoek' },
      { pad: '/praktisch/contact', label: 'Contact' },
    ],
  },
];

export const CONTACT = { pad: '/praktisch/contact', label: 'Neem contact op' };

/** De pagina met de logo's, waar de voet en Steun ons naartoe wijzen. */
export const SPONSORS = { pad: '/over-ons/onze-sponsors', label: 'Bekijk onze sponsors' };

/** De kolommen onderaan de pagina, zoals in het vastgestelde voorstel. */
export const VOETMENU: { kop: string; links: { pad: string; label: string }[] }[] = [
  {
    kop: 'Ontdek',
    links: [
      { pad: '/activiteiten', label: 'Activiteiten' },
      { pad: '/activiteiten/agenda', label: 'Agenda' },
      { pad: '/nieuws', label: 'Nieuws en verhalen' },
      { pad: '/praktisch/eerste-keer', label: 'Eerste keer?' },
      { pad: '/praktisch/contact', label: 'Contact' },
    ],
  },
  {
    kop: 'Voor jou',
    links: [
      { pad: '/voor-jou/ik-heb-kanker-of-ben-in-behandeling', label: 'Tijdens behandeling' },
      { pad: '/voor-jou/mijn-behandeling-is-voorbij', label: 'Na behandeling' },
      { pad: '/voor-jou/jong-en-kanker', label: 'Jong & kanker' },
      { pad: '/voor-jou/iemand-dichtbij-mij-heeft-kanker', label: 'Voor naasten' },
      { pad: '/voor-jou/contact-of-een-activiteit', label: 'Contact of een activiteit' },
    ],
  },
  {
    kop: 'Kennis',
    links: [
      { pad: '/kennis-en-wegwijzer', label: 'Kennis en wegwijzer' },
      { pad: '/praktisch/vragen-over-een-bezoek', label: 'Vragen over bezoek' },
      { pad: '/kennis-en-wegwijzer/passende-ondersteuning-vinden', label: 'Passende hulp vinden' },
      { pad: '/voor-verwijzers', label: 'Voor verwijzers' },
      { pad: '/ervaringen', label: 'Ervaringen' },
    ],
  },
  {
    kop: 'Over Toon',
    links: [
      { pad: '/over-ons/wie-wij-zijn', label: 'Wie wij zijn' },
      { pad: '/over-ons/onze-mensen', label: 'Onze mensen' },
      { pad: '/over-ons/vrijwilliger-worden', label: 'Vrijwilliger worden' },
      { pad: '/over-ons/steun-ons', label: 'Steun ons' },
      { pad: '/over-ons/onze-sponsors', label: 'Onze sponsors' },
      { pad: '/over-ons/organisatie-en-verantwoording', label: 'Verantwoording' },
    ],
  },
];
