import {createContext, useContext} from 'react';

/**
 * Op welke pagina staan we?
 *
 * De balk bovenaan springt naar plekken op de homepage (#winkel, #abonnement).
 * Staat de bezoeker op een onderwerppagina, dan moet daar /#winkel staan, want
 * dat anker bestaat daar niet. Eerder werd dat na het laden bepaald met
 * window.location.pathname in een effect, en dat kan sinds de pagina's als
 * kant-en-klare HTML de deur uit gaan niet meer: in die HTML zou dan bij elke
 * onderwerppagina het verkeerde anker staan, en dat is precies wat een crawler
 * leest.
 *
 * Nu geeft de pagina zijn eigen pad mee, zowel bij het bakken (entry-server) als
 * in de browser (de entry van de pagina). Beide komen op dezelfde waarde uit,
 * dus de HTML die React aantreft klopt met wat hij zelf zou maken.
 */
export const PadContext = createContext('/');

export function usePad() {
  return useContext(PadContext);
}

/**
 * Cloudflare serveert deze site met een schuine streep aan het eind
 * (html_handling: force-trailing-slash), maar een bezoeker die /boeketten
 * intypt komt daar via een omleiding. Beide vormen op dezelfde waarde brengen,
 * anders verschilt het pad in de browser van het pad waarmee gebakken is.
 */
export function normaliseerPad(pad: string) {
  if (!pad || pad === '/') return '/';
  return pad.endsWith('/') ? pad : `${pad}/`;
}
