import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';

/**
 * Zet een pagina aan in de browser.
 *
 * De gebouwde pagina's dragen hun hele inhoud al als HTML met zich mee (zie
 * scripts/prerender.mjs), dus daar neemt React over wat er staat in plaats van het
 * opnieuw te tekenen. Tijdens `pnpm dev` is die HTML er niet en wordt de pagina gewoon
 * opgebouwd.
 */
export function start(pagina: ReactNode) {
  const houder = document.getElementById('root');
  if (!houder) throw new Error('start: geen #root in de pagina');

  const boom = <StrictMode>{pagina}</StrictMode>;

  if (houder.firstElementChild) hydrateRoot(houder, boom);
  else createRoot(houder).render(boom);
}
