import {createContext, useContext} from 'react';

/**
 * Op welk adres staan we?
 *
 * De site bestaat uit één App-component die zelf kijkt welke pagina hij moet
 * laten zien. Dat ging via window.location.pathname, en dat kan sinds de
 * pagina's als kant-en-klare HTML de deur uit gaan niet meer: bij het bakken is
 * er geen window, en zou er één zijn dan stond in elk bestand de voorpagina.
 *
 * Nu geeft de pagina zijn eigen pad mee, zowel bij het bakken
 * (src/entry-server.tsx) als in de browser (src/mount.tsx). Beide komen op
 * dezelfde waarde uit, dus de HTML die React in de browser aantreft klopt met
 * wat hij zelf zou maken en hij hoeft niets opnieuw te tekenen.
 */
export const PadContext = createContext('/');

export function usePad() {
  return useContext(PadContext);
}

/**
 * Cloudflare serveert deze site zonder schuine streep aan het eind
 * (html_handling: drop-trailing-slash), maar iemand kan /privacy/ intypen of
 * een link met streep delen. Beide vormen op dezelfde waarde brengen, anders
 * verschilt het pad in de browser van het pad waarmee gebakken is.
 */
export function normaliseerPad(pad: string) {
  if (!pad || pad === '/') return '/';
  return pad.replace(/\/+$/, '') || '/';
}
