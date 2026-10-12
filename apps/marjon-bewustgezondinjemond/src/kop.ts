import {useEffect} from 'react';
import {SITE_URL} from '../site.config.mjs';

/**
 * De kop van de pagina bijwerken als iemand binnen de site doorklikt.
 *
 * Elk adres staat als eigen bestand in dist/ met zijn eigen title, description
 * en canonical al in de HTML (scripts/prerender.mjs). Dat is wat een crawler
 * leest en wat iemand ziet die rechtstreeks binnenkomt. Maar een klik binnen de
 * site wisselt de pagina zonder herladen, en dan blijft de kop van de vorige
 * pagina staan: dezelfde titel in het tabblad, dezelfde canonical, en bij
 * delen de verkeerde omschrijving.
 *
 * Vandaar deze hook. Hij zet bij het openen wat deze pagina hoort te zeggen en
 * bij het verlaten precies terug wat er stond, zodat twee pagina's elkaars kop
 * niet overschrijven.
 *
 * De drie pagina's deden dit alle drie zelf, met het adres van de site er met
 * de hand in. Bij de verhuizing naar een eigen domein is dat drie keer een
 * regel om te vergeten; nu komt het uit site.config.mjs.
 */
export function useKop({
  titel,
  kort,
  canoniek,
  noindex,
}: {
  titel: string;
  kort?: string;
  /** Pad, niet de hele url: `/privacy`. */
  canoniek?: string;
  noindex?: boolean;
}) {
  useEffect(() => {
    const vorigeTitel = document.title;
    document.title = titel;

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const vorigeCanonical = canonical?.href;
    if (canonical && canoniek) canonical.href = `${SITE_URL}${canoniek}`;

    const omschrijving = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const vorigeOmschrijving = omschrijving?.content;
    if (omschrijving && kort) omschrijving.content = kort;

    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const vorigeRobots = robots?.content;
    if (robots && noindex) robots.content = 'noindex, nofollow';

    return () => {
      document.title = vorigeTitel;
      if (canonical && vorigeCanonical) canonical.href = vorigeCanonical;
      if (omschrijving && vorigeOmschrijving) omschrijving.content = vorigeOmschrijving;
      if (robots && vorigeRobots) robots.content = vorigeRobots;
    };
  }, [titel, kort, canoniek, noindex]);
}
