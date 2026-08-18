import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, type Plugin} from 'vite';
import {PAGINAS, SITE_URL} from './site.config.mjs';

/**
 * Elke pagina noemt zijn eigen adres in de canonical, in og:url en in de
 * schema.org blokken. Die staan in de HTML als %SITE_URL% en worden hier
 * ingevuld, zodat het echte adres maar op één plek staat (site.config.mjs) en
 * het koppelen van een eigen domein één regel is in plaats van een zoekactie
 * door zeven bestanden.
 */
function siteUrl(): Plugin {
  return {
    name: 'fleurig-site-url',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
    },
  };
}

/**
 * Het stijlblad in de pagina zelf.
 *
 * De pagina's dragen na scripts/prerender.mjs hun hele inhoud al als HTML met
 * zich mee. Wat er dan nog tussen de HTML en het eerste beeld staat, is precies
 * één ding: de browser leest de pagina, ziet onderweg een verwijzing naar een
 * stijlblad, en moet dat eerst ophalen voordat hij iets durft te tekenen. Zetten
 * we het stijlblad in de pagina, dan is die stap weg.
 *
 * Het kost wat: wie doorklikt naar een tweede pagina krijgt dezelfde stijl nog
 * een keer mee, ongeveer 9 kB ingepakt, in plaats van hem uit de cache te halen.
 * Op een site van vijf pagina's waar de meeste bezoekers er één bekijken, is dat
 * de goede kant van de ruil.
 *
 * Alleen het stijlblad dat in de HTML staat aangekondigd. De stijl van de kaart
 * (mapbox, 40 kB) hangt aan een import die pas afgaat als de kaart in beeld
 * komt, en die hoort daar te blijven.
 */
function stijlInDePagina(): Plugin {
  return {
    name: 'fleurig-inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_opties, bundel) {
      const paginas = Object.values(bundel).filter(
        (item) => item.type === 'asset' && item.fileName.endsWith('.html'),
      );
      const opgenomen = new Set<string>();

      for (const pagina of paginas) {
        if (pagina.type !== 'asset') continue;
        let html = String(pagina.source);

        html = html.replace(
          /<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/g,
          (heleTag, bestand: string) => {
            const css = bundel[bestand];
            if (!css || css.type !== 'asset') return heleTag;
            opgenomen.add(bestand);
            return `<style>${String(css.source)}</style>`;
          },
        );

        pagina.source = html;
      }

      /* Pas weggooien als hij echt in elke pagina staat: een stijlblad dat we
         verwijderen terwijl één pagina er nog naar wijst, is een pagina zonder
         opmaak. */
      for (const bestand of opgenomen) {
        const nogGenoemd = paginas.some(
          (p) => p.type === 'asset' && String(p.source).includes(bestand),
        );
        if (!nogGenoemd) delete bundel[bestand];
      }
    },
  };
}

/* Vier echte pagina's in plaats van client-side routes: elk onderwerp krijgt zo
   zijn eigen title, description en canonical in de HTML, en de bezoeker landt
   meteen op de goede inhoud zonder dat er eerst een router hoeft te draaien.
   De lijst komt uit site.config.mjs, zodat een nieuwe pagina zich op één plek
   aanmeldt en dan meteen ook in de sitemap en in de prerender meeloopt. */
const input = Object.fromEntries(
  PAGINAS.map((p) => [
    p.bestand.replace(/\/?index\.html$/, '').replace(/\.html$/, '') || 'home',
    path.resolve(__dirname, p.bestand),
  ]),
);

export default defineConfig(({isSsrBuild}) => ({
  plugins: [siteUrl(), react(), tailwindcss(), stijlInDePagina()],
  build: {
    /* Mapbox is ~1,5 MB en wordt pas opgehaald als de kaart in de buurt van het
       scherm komt (zie src/KaartLazy.tsx). Vite waarschuwt over die brok, maar
       hij zit met opzet in een eigen bestand. */
    chunkSizeWarningLimit: 1800,
    /* De tweede build (--ssr src/entry-server.tsx) heeft zijn eigen ingang: zou
       de paginalijst daar ook gelden, dan probeert rollup zeven HTML-bestanden
       door de serverbundel te halen. */
    ...(isSsrBuild ? {} : {rollupOptions: {input}}),
  },
  resolve: {
    alias: {'@': path.resolve(__dirname, '.')},
  },
  server: {
    port: 3064,
    host: true,
  },
  preview: {
    port: 4364,
  },
}));
