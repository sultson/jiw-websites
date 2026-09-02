import type { ReactNode } from 'react';
import { AanbodVerkenner, Aanbod, AgendaVerkenner, KomendeMomenten } from './agenda';
import { BerichtenStrook, Verhalen } from './verhalen';
import {
  BestuurBlok,
  ContactFormulier,
  DocumentenBlok,
  DoneerBlok,
  RouteBlok,
  SponsorBlok,
  SponsorVerwijzing,
  VrijwilligerBlok,
} from './organisatie';
import type { Pagina, Tekst } from '../inhoud';
import { VRIJWILLIGERSBELEID } from '../documenten';
import type { Sleuven } from './Redactie';
import type { Doelgroep, Thema } from '../content/types';
import type { Activiteit, Bericht, Sponsor, Teksten } from '../content/types';
import type { Verhaal, VerhaalRubriek } from '../content/verhalen';

/**
 * Waar de vastgestelde pagina's hun echte inhoud krijgen.
 *
 * De mock-up van het bestuur zette op deze plekken verzonnen activiteiten,
 * verhalen en logo's neer om de vorm te laten zien. Op de gebouwde site komt
 * daar het beheer: dezelfde kop en dezelfde uitleg eromheen, maar de lijst
 * eronder is wat er werkelijk in de agenda staat.
 *
 * De sleutels zijn de blok-id's die de mock-up zelf al gebruikte, dus als het
 * bestuur een pagina herschrijft blijft de koppeling kloppen zolang het id
 * hetzelfde blijft.
 */

export type Bronnen = {
  agenda: Activiteit[];
  /** Het moment waarop deze pagina getekend wordt, zodat de server en de
   *  browser dezelfde weken en dezelfde 'vandaag' uitrekenen. */
  nu: Date;
  berichten: Bericht[];
  verhalen: Verhaal[];
  sponsoren: Sponsor[];
  teksten: Teksten;
};

/** Welk thema of welke doelgroep bij welk blok op welke pagina hoort. */
const AANBODBLOK: Record<string, { blok: string; thema?: Thema; doelgroep?: Doelgroep }> = {
  '/activiteiten/per-thema/ontmoeten': { blok: 'bekijk-actuele-momenten', thema: 'ontmoeten' },
  '/activiteiten/per-thema/bewegen-en-ontspannen': { blok: 'bekijk-actuele-momenten', thema: 'bewegen-en-ontspannen' },
  '/activiteiten/per-thema/werk-en-studie': { blok: 'bekijk-het-actuele-aanbod', thema: 'werk-en-studie' },
  '/activiteiten/per-thema/herstel-en-energie': { blok: 'bekijk-het-actuele-aanbod', thema: 'herstel-en-energie' },
  '/activiteiten/per-thema/relaties-en-gezin': { blok: 'bekijk-het-actuele-aanbod', thema: 'relaties-en-gezin' },
  '/activiteiten/per-thema/informatie-en-inspiratie': { blok: 'bekijk-actuele-bijeenkomsten', thema: 'informatie-en-inspiratie' },
  '/activiteiten/voor-jongeren-15-35': { blok: 'bekijk-het-bevestigde-aanbod', doelgroep: 'jongeren-15-35' },
  '/activiteiten/voor-35-50': { blok: 'bekijk-de-actuele-selectie', doelgroep: '35-50' },
  '/activiteiten/voor-naasten': { blok: 'bekijk-de-actuele-selectie', doelgroep: 'naasten' },
  '/jong-en-kanker/activiteiten-voor-jongeren': { blok: 'actuele-activiteiten', doelgroep: 'jongeren-15-35' },
  '/voor-naasten/activiteiten-voor-naasten': { blok: 'actuele-activiteiten', doelgroep: 'naasten' },
};

/** De vier pagina's met ervaringen, en het soort verhaal dat erop hoort. */
const VERHAALPAGINA: Record<string, VerhaalRubriek> = {
  '/ervaringen/verhalen-van-bezoekers': 'bezoekers',
  '/ervaringen/jong-en-kanker': 'jong',
  '/ervaringen/naasten': 'naasten',
  '/ervaringen/leven-na-behandeling': 'na-behandeling',
};

/**
 * De kop en de uitleg boven de lijst horen binnen hetzelfde vlak als de lijst
 * zelf, dus die geeft de pagina door aan het onderdeel dat dat vlak tekent.
 * Ze komen uit de herschreven pagina, want in de mock-up stond hier een zin
 * voor het bestuur in plaats van voor een bezoeker.
 */
function verkennerKop(pagina: Pagina): { kop?: string; intro?: string } {
  const blok = pagina.blokken.find((b) => b.soort === 'verkenner');
  if (blok?.soort !== 'verkenner') return {};
  return { kop: blok.kop, intro: blok.intro ? plat(blok.intro) : undefined };
}

/** Een alinea uit de redactielaag als gewone tekst, zonder de links erin. */
const plat = (tekst: Tekst): string =>
  tekst.map((stuk) => (typeof stuk === 'string' ? stuk : stuk.tekst)).join('');

export function sleuvenVoor(pagina: Pagina, bronnen: Bronnen): Sleuven | undefined {
  const pad = pagina.pad;
  const { agenda, nu, sponsoren, verhalen, teksten } = bronnen;

  const aanbod = AANBODBLOK[pad];
  if (aanbod) {
    return { [aanbod.blok]: <Aanbod agenda={agenda} thema={aanbod.thema} doelgroep={aanbod.doelgroep} /> };
  }

  const rubriek = VERHAALPAGINA[pad];
  if (rubriek) {
    return { echtheid: { vervang: <Verhalen verhalen={verhalen.filter((v) => v.rubriek === rubriek)} /> } };
  }

  switch (pad) {
    case '/':
      return { 'wat-is-er-binnenkort-te-doen': <KomendeMomenten agenda={agenda} aantal={3} /> };
    case '/activiteiten/agenda':
      return {
        verkenner: {
          vervang: <AgendaVerkenner agenda={agenda} nu={nu} {...verkennerKop(pagina)} />,
        },
      };
    case '/activiteiten/alle-activiteiten':
      return {
        verkenner: {
          vervang: <AanbodVerkenner agenda={agenda} {...verkennerKop(pagina)} />,
        },
      };
    // Hieronder staat overal `vervang`: op deze blokken had de mock-up een
    // instructie aan de bouwer als tekst staan ("ieder document krijgt een
    // duidelijke titel", "de betaalwijze moet duidelijk worden uitgelegd").
    // Dat is geen tekst voor een bezoeker, dus het echte blok komt ervoor in de
    // plaats. De knop die het bestuur eronder zette blijft wel staan.
    case '/over-ons/steun-ons':
      return { 'eenmalig-geven': { vervang: <DoneerBlok teksten={teksten} /> } };
    // De pagina met de logo's. De kop en de uitleg erboven staan in het beheer,
    // dus het hele blok komt daarvandaan en niet uit de tekst eromheen.
    case '/over-ons/onze-sponsors':
      return {
        'onze-sponsors': { vervang: <SponsorBlok sponsoren={sponsoren} teksten={teksten} /> },
      };
    case '/over-ons/organisatie-en-verantwoording':
      return {
        'bestuur-en-toezicht-of-advies': { vervang: <BestuurBlok teksten={teksten} advies /> },
        'beleidsplan-en-jaarstukken': { vervang: <DocumentenBlok /> },
        vrijwilligersbeleid: {
          vervang: (
            <DocumentenBlok
              stukken={VRIJWILLIGERSBELEID}
              titel="Vrijwilligersbeleid"
              intro="De afspraken met vrijwilligers, de gedragscode, de klachtenregeling en de privacyregels. Openbaar, zodat je kunt nalezen waar je aan toe bent."
            />
          ),
        },
      };
    case '/over-ons/onze-mensen':
      return { 'het-bestuur': { vervang: <BestuurBlok teksten={teksten} /> } };
    case '/over-ons/vrijwilliger-worden':
      return { 'wat-kun-je-doen': { vervang: <VrijwilligerBlok teksten={teksten} /> } };
    default:
      return undefined;
  }
}

/** Wat er na de laatste sectie van een pagina komt. */
export function onderaanVoor(pad: string, bronnen: Bronnen): ReactNode {
  const { berichten, teksten } = bronnen;

  switch (pad) {
    case '/':
    case '/ervaringen':
      return (
        <section className="border-t border-lijn py-9 md:py-11">
          <BerichtenStrook berichten={berichten} aantal={3} />
        </section>
      );
    case '/praktisch/contact':
      return (
        <section className="border-t border-lijn py-9 md:py-11">
          <ContactFormulier teksten={teksten} />
        </section>
      );
    case '/over-ons/vrijwilliger-worden':
      return (
        <section className="border-t border-lijn py-9 md:py-11">
          <ContactFormulier teksten={teksten} onderwerp="Vrijwilliger worden" />
        </section>
      );
    case '/over-ons/steun-ons':
      return (
        <section className="border-t border-lijn py-9 md:py-11">
          <SponsorVerwijzing teksten={teksten} />
        </section>
      );
    case '/praktisch/locatie-en-bereikbaarheid':
      return (
        <section className="border-t border-lijn py-9 md:py-11">
          <RouteBlok />
        </section>
      );
    default:
      return null;
  }
}
