import {createContext, useContext} from 'react';

/**
 * Op welke pagina staan we?
 *
 * De balk bovenaan en de voet springen naar plekken op de homepage (#diensten,
 * #offerte). Staat de bezoeker op de 404, dan moet daar /#diensten staan, want
 * dat anker bestaat daar niet. Dat na het laden bepalen met
 * window.location.pathname kan niet meer sinds de pagina's als kant-en-klare
 * HTML de deur uit gaan: in die HTML zou dan bij elke pagina hetzelfde anker
 * staan, en dat is precies wat een crawler leest.
 *
 * Nu geeft de pagina zijn eigen pad mee, zowel bij het bakken (entry-server)
 * als in de browser (src/mount.tsx). Beide komen op dezelfde waarde uit, dus de
 * HTML die React aantreft klopt met wat hij zelf zou maken.
 */
export const PadContext = createContext('/');

export function usePad() {
  return useContext(PadContext);
}

/** Een anker dat op de homepage staat, vanaf welke pagina dan ook bereikbaar. */
export function useAnker() {
  const pad = usePad();
  return (anker: string) => (pad === '/' ? anker : `/${anker}`);
}

/**
 * Cloudflare serveert deze site met een schuine streep aan het eind
 * (html_handling: force-trailing-slash). Beide vormen op dezelfde waarde
 * brengen, anders verschilt het pad in de browser van het pad waarmee gebakken
 * is en gooit React de aangetroffen HTML weg.
 */
export function normaliseerPad(pad: string) {
  if (!pad || pad === '/') return '/';
  if (pad.endsWith('.html')) return pad;
  return pad.endsWith('/') ? pad : `${pad}/`;
}
