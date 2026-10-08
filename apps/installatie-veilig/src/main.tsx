import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App';
import {zoekPagina} from './paginas';
import './index.css';

const container = document.getElementById('root')!;
/* Dezelfde pagina die scripts/prerender.mjs voor dit pad heeft gebakken, anders
   past de HTML niet op wat React wil overnemen. */
const boom = (
  <StrictMode>
    <App pagina={zoekPagina(window.location.pathname)} />
  </StrictMode>
);

/* De pagina wordt bij het bouwen als complete HTML weggeschreven (zie
   scripts/prerender.mjs), dus in productie staat er al markup in #root en neemt
   React die over. In `vite dev` is #root leeg en wordt hij gewoon gevuld. */
if (container.firstElementChild) {
  hydrateRoot(container, boom);
} else {
  createRoot(container).render(boom);
}
