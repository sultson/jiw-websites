import type { SiteContent } from '../content/types';
import type { Lang } from './i18n';
import { en } from '../content/en';
import { de } from '../content/de';
import { nl } from '../content/nl';
import { fr } from '../content/fr';
import { es } from '../content/es';
import { it } from '../content/it';
import { pt } from '../content/pt';
import { zh } from '../content/zh';
import { ru } from '../content/ru';
import { specialistVisaServices } from '../data/specialist-visa-services';

const sourceContents: Record<Lang, SiteContent> = { en, de, nl, fr, es, it, pt, zh, ru };

// Artist and athlete routes were added as part of the legacy Webflow migration.
// Keep them in one language-aware module so all language trees receive the same
// route surface without hand-editing generated translation files.
const contents = Object.fromEntries(
  Object.entries(sourceContents).map(([lang, content]) => {
    const specialistServices = lang === 'en' || lang === 'nl' ? specialistVisaServices(lang) : [];
    return [
      lang,
      {
        ...content,
        immigration: {
          ...content.immigration,
          services: [...content.immigration.services, ...specialistServices],
        },
      },
    ];
  }),
) as Record<Lang, SiteContent>;

export function getContent(lang: Lang): SiteContent {
  return contents[lang];
}
