import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { PAGINAS, SITE_URL } from './site.config.mjs';

/**
 * Het adres van de site staat in de HTML als %SITE_URL% (canonical, og:url,
 * schema.org) en wordt hier ingevuld, zodat het koppelen van een eigen domein
 * later één regel is in site.config.mjs in plaats van een zoekactie.
 */
function siteUrl(): Plugin {
  return {
    name: 'neuropathie-site-url',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
    },
  };
}

/**
 * Het stijlblad in de pagina zelf. De pagina's dragen na scripts/prerender.mjs hun hele
 * inhoud al als HTML met zich mee; wat er dan nog tussen de HTML en het eerste beeld
 * staat is precies één ding, namelijk het ophalen van een los stijlblad. Op een site van
 * één pagina plus een foutpagina is dat de goede kant van de ruil.
 */
function stijlInDePagina(): Plugin {
  return {
    name: 'neuropathie-inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_opties, bundel) {
      const paginas = Object.values(bundel).filter(
        (item) => item.type === 'asset' && item.fileName.endsWith('.html'),
      );
      const opgenomen = new Set<string>();

      for (const pagina of paginas) {
        if (pagina.type !== 'asset') continue;
        pagina.source = String(pagina.source).replace(
          /<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/g,
          (heleTag, bestand: string) => {
            const css = bundel[bestand];
            if (!css || css.type !== 'asset') return heleTag;
            opgenomen.add(bestand);
            return `<style>${String(css.source)}</style>`;
          },
        );
      }

      /* Pas weggooien als hij in geen enkele pagina meer genoemd wordt: een stijlblad
         dat we verwijderen terwijl één pagina er nog naar wijst, is een pagina zonder
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

/* Echte losse HTML-bestanden in plaats van één schil: elke pagina krijgt zo zijn eigen
   title, description en canonical in de HTML zelf. */
const input = Object.fromEntries(
  PAGINAS.map((p) => [
    p.bestand.replace(/\.html$/, '') === 'index' ? 'home' : p.bestand.replace(/\.html$/, ''),
    path.resolve(__dirname, p.bestand),
  ]),
);

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [siteUrl(), react(), tailwindcss(), stijlInDePagina()],
  build: {
    /* De tweede build (--ssr src/entry-server.tsx) heeft zijn eigen ingang: zou de
       paginalijst daar ook gelden, dan haalt rollup de HTML-bestanden door de
       serverbundel. */
    ...(isSsrBuild ? {} : { rollupOptions: { input } }),
  },
  server: { port: 3056, host: '0.0.0.0' },
  preview: { port: 4356 },
}));
