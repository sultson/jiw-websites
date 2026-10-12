import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import App from './App';
import {PadContext} from './pad';
import {PAD, SPECIALISATIES} from './specialisaties';
import {omschrijving, titel} from './specmeta';

/**
 * De site zoals hij bij het bouwen wordt uitgetekend.
 *
 * scripts/prerender.mjs haalt hier per pagina de kant-en-klare HTML op en zet
 * die in het gebouwde bestand, zodat een bezoeker en een crawler de hele pagina
 * zien voordat er ook maar een regel JavaScript heeft gedraaid. Dat is geen
 * snelheidstruc alleen: een zoekmachine of een taalmodel dat de site leest
 * zonder JavaScript uit te voeren, zag hier eerst een lege div en dus een site
 * zonder enige tekst.
 */
export function render(pad: string): string {
  return renderToString(
    <StrictMode>
      <PadContext.Provider value={pad}>
        <App />
      </PadContext.Provider>
    </StrictMode>,
  );
}

/**
 * De titel en de omschrijving van de vijf pijlerpagina's, voor
 * scripts/prerender.mjs. Ze staan niet in site.config.mjs maar in
 * src/specmeta.ts, omdat ze uit SPECIALISATIES komen: haar eigen naam en haar
 * eigen samenvatting per pijler. Zou de titel daar nog een keer met de hand
 * staan, dan lopen de twee uit elkaar zodra ze een zin aanpast.
 */
export const SPEC_META: Record<string, {titel: string; kort: string; kruimel: string}> =
  Object.fromEntries(
    SPECIALISATIES.map((s) => [PAD(s.slug), {titel: titel(s), kort: omschrijving(s), kruimel: s.naam}]),
  );

/**
 * De eerdere adressen van de pijlers, uit de tijd dat het acht losse
 * onderwerpen waren. Ze blijven werken en wijzen met hun canonical naar de
 * opvolger. Ze worden dus wél gebakken (anders geeft Cloudflare een 404 voordat
 * React iets kan doen), maar ze staan niet in de sitemap.
 */
export const ALIAS_PADEN = SPECIALISATIES.flatMap((s) =>
  (s.oud ?? []).map((oud) => ({
    pad: PAD(oud),
    bestand: `aanpak/${oud}/index.html`,
    canoniek: PAD(s.slug),
    titel: titel(s),
    kort: omschrijving(s),
    kruimel: s.naam,
    inSitemap: false,
  })),
);
