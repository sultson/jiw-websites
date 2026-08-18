/**
 * Taal en route: Engels, Nederlands en Papiamentu.
 *
 * Engels is de hoofdtaal en staat daarom op het kale adres. Nederlands en
 * Papiamentu krijgen een voorvoegsel in het pad zelf (/nl/bonaire,
 * /pap/bonaire), zodat een gedeelde link ook echt in die taal opent bij degene
 * die hem krijgt.
 *
 * Het pad staat in de adresbalk en niet achter een hekje. Een zoekmachine gooit
 * alles na # weg voordat hij een adres opvraagt, dus met #/nl/bonaire heeft de
 * hele site precies één adres en drieëntwintig kopieën daarvan. Met een echt pad
 * is elke pagina in elke taal een eigen adres, en dat is wat de sitemap en de
 * hreflang-regels opsommen. Oude links met een hekje blijven werken: die worden
 * hieronder eenmalig omgezet naar hun nieuwe adres.
 *
 * Wie hier voor het eerst komt krijgt de taal van zijn eigen plek: op Curacao,
 * Bonaire en Aruba Papiamentu, in Nederland Nederlands, elders Engels. Dat
 * bepalen we uit de tijdzone van het apparaat plus de taal van de browser, dus
 * zonder navraag ergens en zonder dat de pagina eerst in de verkeerde taal
 * verschijnt. Een eigen keuze wint altijd van die gok.
 */

import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {trace} from './trace';

export type Taal = 'en' | 'nl' | 'pap';

export const TALEN: Taal[] = ['en', 'nl', 'pap'];

/** Een stukje tekst in alle drie de talen. */
export type Tekst = {en: string; nl: string; pap: string};

type Route = {taal: Taal; pad: string};

/** De taalcode voor het lang-attribuut en voor Intl. */
export const LOCALE: Record<Taal, string> = {en: 'en-GB', nl: 'nl-NL', pap: 'pap'};

const VOORVOEGSEL: Record<Taal, string> = {en: '', nl: '/nl', pap: '/pap'};

/** Zet een intern pad om naar de href voor de huidige taal. */
export function href(taal: Taal, pad: string) {
  return `${VOORVOEGSEL[taal]}${pad === '/' && taal !== 'en' ? '' : pad}`;
}

/** Splitst een adres in de taal die erin staat en het pad daaronder. */
function splits(ruw: string): Route {
  const kaal = ruw.replace(/\/+$/, '') || '/';
  for (const taal of ['nl', 'pap'] as const) {
    const v = `/${taal}`;
    if (kaal === v || kaal.startsWith(`${v}/`)) return {taal, pad: kaal.slice(v.length) || '/'};
  }
  /* Oude links naar /en blijven werken, Engels staat op het kale adres. */
  if (kaal === '/en' || kaal.startsWith('/en/')) return {taal: 'en', pad: kaal.slice(3) || '/'};
  return {taal: 'en', pad: kaal};
}

function leesRoute(): Route {
  if (typeof window === 'undefined') return {taal: 'en', pad: '/'};
  return splits(window.location.pathname);
}

/**
 * De site draaide eerder op adressen met een hekje (#/nl/bonaire). Die links
 * staan in gedeelde berichten en in de index van zoekmachines, en ze horen
 * gewoon te blijven werken. Eén keer bij het openen omzetten naar het echte
 * pad is genoeg: replaceState, zodat de terugknop niet in het oude adres blijft
 * hangen.
 *
 * Een kale ankerlink (#ergens) is geen route en blijft met rust.
 */
function ruimHekjeOp(): boolean {
  const hekje = window.location.hash.replace(/^#/, '');
  if (!hekje.startsWith('/')) return false;
  const [pad, anker] = hekje.split('#');
  const {taal, pad: schoon} = splits(pad);
  window.history.replaceState(null, '', `${href(taal, schoon)}${anker ? `#${anker}` : ''}`);
  return true;
}

/* Één abonnement op adreswijzigingen. De terugknop stuurt popstate; een klik op
   een interne link roept `ga` aan, en die meldt het zelf. */
const LUISTERAARS = new Set<() => void>();

function meld() {
  LUISTERAARS.forEach((f) => f());
}

/** Navigeert naar een adres binnen de site zonder de pagina opnieuw te laden. */
export function ga(url: string, vervang = false) {
  const huidig = `${window.location.pathname}${window.location.hash}`;
  if (url === huidig) return;
  window.history[vervang ? 'replaceState' : 'pushState'](null, '', url);
  meld();
}

/** De landen waar Papiamentu de omgangstaal is, als landcode. */
const PAP_LAND = new Set(['CW', 'BQ', 'AW', 'SX']);

/**
 * Een eerste gok uit de tijdzone van het apparaat. Die is er meteen, dus de
 * pagina hoeft niet eerst in de verkeerde taal te verschijnen. Betrouwbaar is
 * hij niet: sinds de tijdzonedatabase alle Caribische eilanden onder een noemer
 * heeft geschoven meldt een telefoon op Bonaire zich vaak als America/Curacao
 * of zelfs America/Puerto_Rico. Het echte antwoord komt daarom van `landVanIp`.
 */
function taalVanZone(): Taal {
  let zone = '';
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    /* oude browser, dan alleen de browsertaal */
  }
  if (/^America\/(Curacao|Curaçao|Kralendijk|Aruba|Lower_Princes)$/.test(zone)) return 'pap';
  if (zone === 'Europe/Amsterdam') return 'nl';

  const browser = (navigator.language || '').toLowerCase();
  if (browser.startsWith('pap')) return 'pap';
  if (browser.startsWith('nl')) return 'nl';
  return 'en';
}

/**
 * Waar de bezoeker echt vandaan komt. Cloudflare zet dat op elk verzoek zelf op
 * onze eigen host neer, dus dit is geen dienst van derden en er gaat niets naar
 * buiten. Duurt een fractie van een seconde en corrigeert de gok hierboven.
 */
async function landVanIp(): Promise<string | null> {
  const loc = (await trace()).loc;
  return /^[A-Z]{2}$/.test(loc ?? '') ? loc : null;
}

function taalVanLand(land: string): Taal {
  if (PAP_LAND.has(land)) return 'pap';
  if (land === 'NL') return 'nl';
  return 'en';
}

/* Alleen een eigen keuze wordt onthouden, een automatische gok niet: anders
   blijft een verkeerde gok voor altijd aan iemand plakken. */
const SLEUTEL = 'taalkeuze';

const Ctx = createContext<{taal: Taal; pad: string; zetTaal: (t: Taal) => void}>({
  taal: 'en',
  pad: '/',
  zetTaal: () => {},
});

export function TaalProvider({children}: {children: React.ReactNode}) {
  const [route, setRoute] = useState<Route>(leesRoute);
  /* Heeft de bezoeker zelf een taal aangeklikt? Dan wint die van elke gok. */
  const gezelf = useRef(false);

  useEffect(() => {
    const zet = () => {
      setRoute(leesRoute());
      /* Bij een echte paginawissel bovenaan beginnen, niet halverwege. Wie naar
         een blok op dezelfde pagina springt heeft een anker in het adres staan
         en wil juist niet naar boven. */
      if (!window.location.hash) window.scrollTo({top: 0, behavior: 'instant' as ScrollBehavior});
    };
    LUISTERAARS.add(zet);
    window.addEventListener('popstate', zet);
    return () => {
      LUISTERAARS.delete(zet);
      window.removeEventListener('popstate', zet);
    };
  }, []);

  const zetTaal = useCallback((t: Taal) => {
    try {
      localStorage.setItem(SLEUTEL, t);
    } catch {
      /* privacymodus, dan onthouden we het gewoon niet */
    }
    gezelf.current = true;
    const {taal, pad} = leesRoute();
    if (taal === t) return;
    ga(href(t, pad));
  }, []);

  /* Eerste bezoek: een taal in de link wint, dan een eigen eerdere keuze, dan
     de plek van de bezoeker. Die laatste in twee stappen: meteen een gok uit de
     tijdzone, en zodra Cloudflare het land teruggeeft het echte antwoord. */
  useEffect(() => {
    /* Alleen naar een taal toe, zonder hem te onthouden. Voor de automatische
       gok, en zonder een stap in de geschiedenis: anders komt wie op de
       terugknop drukt weer bij zijn eigen beginpunt uit. */
    const gaNaar = (t: Taal) => {
      const {taal, pad} = leesRoute();
      if (taal === t) return;
      ga(`${href(t, pad)}${window.location.hash}`, true);
    };

    /* Een oude link met een hekje wordt eerst omgezet; daarna staat de taal in
       het pad en is er niets meer te gokken. */
    if (ruimHekjeOp()) {
      setRoute(leesRoute());
      return;
    }

    /* Wie zelf een taal in de link heeft staan, krijgt die en verder niets. */
    if (/^\/(nl|pap|en)(\/|$)/.test(window.location.pathname.replace(/\/+$/, '') || '/')) return;

    let opgeslagen: string | null = null;
    try {
      opgeslagen = localStorage.getItem(SLEUTEL);
    } catch {
      /* niets */
    }
    if (TALEN.includes(opgeslagen as Taal)) {
      gaNaar(opgeslagen as Taal);
      return;
    }

    gaNaar(taalVanZone());
    landVanIp().then((land) => {
      /* Wie ondertussen zelf op een taal heeft geklikt, laten we met rust. */
      if (land && !gezelf.current) gaNaar(taalVanLand(land));
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = route.taal;
  }, [route.taal]);

  return <Ctx.Provider value={{...route, zetTaal}}>{children}</Ctx.Provider>;
}

export function useTaal() {
  return useContext(Ctx);
}

/** Kiest de juiste taal uit een drietalig stukje tekst. */
export function useT() {
  const {taal} = useTaal();
  return useCallback((x: Tekst) => x[taal], [taal]);
}
