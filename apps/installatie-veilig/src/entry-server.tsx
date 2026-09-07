import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import App from './App';

/**
 * De pagina zoals hij bij het bouwen wordt uitgetekend.
 *
 * scripts/prerender.mjs haalt hier de kant-en-klare HTML op en zet die in
 * dist/index.html, zodat een bezoeker en een crawler de hele pagina zien
 * voordat er ook maar een regel JavaScript heeft gedraaid. Zonder deze stap
 * staat er in dist/ alleen `<div id="root"></div>`: een browser vult dat in,
 * maar een zoekmachine of taalmodel dat geen JavaScript uitvoert leest een
 * lege pagina.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
