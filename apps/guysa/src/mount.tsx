import {StrictMode, type ReactNode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {PadContext, normaliseerPad} from './pad';
import './index.css';

/**
 * Zet een pagina aan in de browser.
 *
 * De gebouwde pagina's dragen hun hele inhoud al als HTML met zich mee (zie
 * scripts/prerender.mjs), dus daar neemt React over wat er staat in plaats van
 * het opnieuw te tekenen. Tijdens `pnpm dev` is die HTML er niet en wordt de
 * pagina gewoon opgebouwd. Beide gevallen in een functie, zodat de entry van
 * een pagina alleen nog hoeft te zeggen welke pagina hij is.
 */
export function start(pagina: ReactNode) {
  const houder = document.getElementById('root');
  if (!houder) throw new Error('start: geen #root in de pagina');

  const boom = (
    <StrictMode>
      <PadContext.Provider value={normaliseerPad(window.location.pathname)}>{pagina}</PadContext.Provider>
    </StrictMode>
  );

  if (houder.firstElementChild) hydrateRoot(houder, boom);
  else createRoot(houder).render(boom);
}
