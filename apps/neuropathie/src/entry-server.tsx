import { StrictMode, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import NietGevonden from './pages/NietGevonden';

/**
 * De pagina's zoals ze bij het bouwen worden uitgetekend.
 *
 * scripts/prerender.mjs haalt hier per pagina de kant-en-klare HTML op en zet die in het
 * gebouwde bestand. Zonder die stap staat er in dist/ een lege `<div id="root">`: een
 * browser vult die in, maar een zoekmachine of taalmodel dat geen JavaScript uitvoert
 * leest niets. Op een site die juist gevonden moet worden op "voetreflexologie
 * neuropathie" is dat het hele punt.
 */
const PAGINAS: Record<string, () => ReactElement> = {
  '/': () => <App />,
  '/404.html': () => <NietGevonden />,
};

export function render(pad: string): string {
  const maak = PAGINAS[pad];
  /* Werpen en niet stilletjes overslaan: een pagina die hier niet bekend is hoort de
     build te laten omvallen, niet een lege pagina op te leveren die er in dist net zo
     uitziet als een goede. */
  if (!maak) throw new Error(`prerender: geen component voor ${pad} in entry-server.tsx`);

  return renderToString(<StrictMode>{maak()}</StrictMode>);
}
