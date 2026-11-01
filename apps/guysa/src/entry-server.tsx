import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import App from './App';
import NietGevonden from './pages/NietGevonden';
import {PadContext} from './pad';

/**
 * De pagina's zoals ze bij het bouwen worden uitgetekend.
 *
 * scripts/prerender.mjs haalt hier per pagina de kant-en-klare HTML op en zet
 * die in het gebouwde bestand, zodat een bezoeker en een crawler de hele pagina
 * zien voordat er een regel JavaScript heeft gedraaid. Dat is geen snelheidstruc
 * alleen: een zoekmachine of een taalmodel dat de site leest zonder JavaScript
 * uit te voeren, zag hiervoor letterlijk een lege div.
 */
const PAGINAS: Record<string, () => React.ReactElement> = {
  '/': () => <App />,
  '/404.html': () => <NietGevonden />,
};

export function render(pad: string): string {
  const maak = PAGINAS[pad];
  /* Werpen en niet stilletjes overslaan: staat er een pagina in
     site.config.mjs die hier niet bekend is, dan hoort de build te stoppen en
     niet een lege pagina op te leveren die er in dist net zo uitziet als een
     goede. */
  if (!maak) throw new Error(`prerender: geen component voor ${pad} in entry-server.tsx`);

  return renderToString(
    <StrictMode>
      <PadContext.Provider value={pad}>{maak()}</PadContext.Provider>
    </StrictMode>,
  );
}
