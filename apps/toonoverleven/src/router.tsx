import { useEffect, useRef, useSyncExternalStore } from 'react';
import { schoonPad } from './meta';

/**
 * De site was één lange pagina met ankers. Nu is elke pagina een eigen adres,
 * want een agenda, een bericht en de verantwoording zijn dingen die je apart
 * moet kunnen delen, openen in een nieuw tabblad en bewaren.
 *
 * Het schakelen gebeurt in de browser: de inhoud van alle pagina's staat al in
 * het document dat de Worker stuurde, dus wisselen kost geen enkel verzoek.
 */

const luisteraars = new Set<() => void>();

const huidigPad = () => schoonPad(window.location.pathname);

/**
 * Het adres waarop de Worker deze pagina tekende.
 *
 * Op de server bestaat `window` niet, dus daar moet het adres van buiten komen.
 * In de browser leest dezelfde functie gewoon de balk: React roept hem bij het
 * hydrateren namelijk óók aan, en dan moet er hetzelfde uitkomen als wat de
 * server rendeerde. Dat is precies het pad van de pagina waar je op staat.
 */
let startPad = '/';

export function zetStartPad(pad: string) {
  startPad = pad;
}

const beginSnapshot = () => (typeof window === 'undefined' ? startPad : huidigPad());

/**
 * Of de volgende weergave komt doordat iemand op een link klikte, of doordat
 * hij terugging. Een klik begint bovenaan zijn nieuwe pagina; terug heeft een
 * plek in de oude om naar terug te keren, en die kent de browser.
 */
let aankomst: 'klik' | 'geschiedenis' = 'geschiedenis';

function meld() {
  for (const luisteraar of luisteraars) luisteraar();
}

function bijPopState() {
  aankomst = 'geschiedenis';
  meld();
}

function abonneer(bijWijziging: () => void) {
  luisteraars.add(bijWijziging);
  window.addEventListener('popstate', bijPopState);
  return () => {
    luisteraars.delete(bijWijziging);
    window.removeEventListener('popstate', bijPopState);
  };
}

/** Het huidige adres, en alles wat het leest tekent opnieuw als het verandert. */
export function usePad(): string {
  return useSyncExternalStore(abonneer, huidigPad, beginSnapshot);
}

export function ganaar(doel: string) {
  const url = new URL(doel, window.location.href);

  // Een voorbeeldsessie moet een klik overleven. Zonder de sleutel antwoordt de
  // Worker met gepubliceerde tekst, en dan verdwijnt het concept waar de klant
  // net naar zat te kijken halverwege het controleren.
  const sleutel = new URLSearchParams(window.location.search).get('preview');
  if (sleutel && !url.searchParams.has('preview')) url.searchParams.set('preview', sleutel);

  if (url.href === window.location.href) return;
  aankomst = 'klik';
  window.history.pushState({}, '', url);
  meld();
}

/**
 * Maakt elke link binnen de site tot een link die niet herlaadt, zodat geen
 * enkel onderdeel iets hoeft te importeren om ergens heen te wijzen. Links die
 * de site verlaten, in een nieuw tabblad openen of naar het beheer gaan, laten
 * we aan de browser, en een anker op de pagina waar je al bent ook: dat is
 * scrollen en geen navigatie.
 */
export function useInterneLinks() {
  useEffect(() => {
    const bijKlik = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anker = (event.target as Element | null)?.closest?.('a');
      const href = anker?.getAttribute('href');
      if (!anker || !href) return;
      if (anker.hasAttribute('download') || (anker.target && anker.target !== '_self')) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Het beheer is een eigen toepassing op hetzelfde adres.
      if (url.pathname === '/beheer' || url.pathname.startsWith('/beheer/')) return;
      if (schoonPad(url.pathname) === huidigPad() && !url.hash) return;

      event.preventDefault();
      ganaar(url.pathname + url.search + url.hash);
    };

    document.addEventListener('click', bijKlik);
    return () => document.removeEventListener('click', bijKlik);
  }, []);
}

/**
 * Waar een nieuwe pagina begint. Een klik komt bovenaan uit, of bij het stuk
 * waar zijn link naar wees. Terug en vooruit laten we met rust: de browser zet
 * de bezoeker waar hij was, en dat is precies waarom je op terug drukt.
 */
export function useScrollBijNavigatie(pad: string) {
  const eerste = useRef(true);

  useEffect(() => {
    if (eerste.current) {
      eerste.current = false;
      return;
    }
    if (aankomst !== 'klik') return;

    const doel = window.location.hash ? document.querySelector(window.location.hash) : null;
    if (doel) {
      doel.scrollIntoView();
    } else {
      // Meteen, niet zacht: dit is een nieuwe pagina en geen verplaatsing
      // binnen één, en het hele document langs de bezoeker racen is geen
      // animatie.
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pad]);
}
