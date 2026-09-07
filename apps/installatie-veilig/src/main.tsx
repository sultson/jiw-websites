import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root')!;
const boom = (
  <StrictMode>
    <App />
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
