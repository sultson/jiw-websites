import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * De Worker stuurt de pagina al getekend mee, dus hangt de app zich daaraan
 * vast in plaats van hem opnieuw te tekenen: geen leeg vlak dat halverwege
 * ingevuld wordt en geen sprong in de tekst.
 *
 * Staat er niets (de ontwikkelserver, of een Worker die zijn inhoud niet kon
 * ophalen), dan tekent de browser hem alsnog zelf.
 */
const wortel = document.getElementById('root')!;
const pagina = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (wortel.firstChild) {
  hydrateRoot(wortel, pagina);
} else {
  createRoot(wortel).render(pagina);
}
