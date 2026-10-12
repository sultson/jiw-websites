import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App';
import {PadContext, normaliseerPad} from './pad';
import './index.css';

/**
 * Zet de site aan in de browser.
 *
 * De gebouwde pagina's dragen hun hele inhoud al als HTML met zich mee (zie
 * scripts/prerender.mjs), dus daar neemt React over wat er staat in plaats van
 * het opnieuw te tekenen. Tijdens `pnpm dev` is die HTML er niet en wordt de
 * pagina gewoon opgebouwd. Vandaar beide gevallen.
 */
const houder = document.getElementById('root');
if (!houder) throw new Error('mount: geen #root in de pagina');

const boom = (
  <StrictMode>
    <PadContext.Provider value={normaliseerPad(window.location.pathname)}>
      <App />
    </PadContext.Provider>
  </StrictMode>
);

if (houder.firstElementChild) hydrateRoot(houder, boom);
else createRoot(houder).render(boom);
