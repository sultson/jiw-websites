import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, type Plugin} from 'vite';
import {PAGINAS} from './site.config.mjs';
// @ts-expect-error - zelfde reden: een build-script in gewoon javascript
import {zetKop} from './scripts/kop.mjs';

/**
 * De kop van de voorpagina in index.html zetten.
 *
 * index.html draagt alleen het gedeelte dat op elke pagina hetzelfde is; alles
 * wat per pagina verschilt staat tussen <!--kop:start--> en <!--kop:end--> en
 * komt uit site.config.mjs (zie scripts/kop.mjs). Dat vullen moet ook tijdens
 * `pnpm dev` gebeuren, anders heeft de pagina lokaal geen titel en geen
 * omschrijving en kan niemand zien dat daar iets mis is.
 *
 * scripts/prerender.mjs vervangt daarna hetzelfde blok per pagina in de
 * gebouwde bestanden. De markeringen blijven dus staan.
 */
function kop(): Plugin {
  const home = PAGINAS.find((p: {pad: string}) => p.pad === '/');
  return {
    name: 'marjon-kop',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => zetKop(html, home),
    },
  };
}

export default defineConfig({
  plugins: [kop(), react(), tailwindcss()],
  resolve: {
    alias: {'@': path.resolve(__dirname, '.')},
  },
  server: {
    port: 3072,
    host: true,
  },
  preview: {
    port: 4372,
  },
});
