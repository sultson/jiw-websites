import type { SiteContent } from '../content/types';
import type { Lang } from './i18n';
import { en } from '../content/en';
import { de } from '../content/de';
import { nl } from '../content/nl';
import { fr } from '../content/fr';
import { es } from '../content/es';
import { it } from '../content/it';
import { ru } from '../content/ru';

const contents: Record<Lang, SiteContent> = { en, de, nl, fr, es, it, ru };

export function getContent(lang: Lang): SiteContent {
  return contents[lang];
}
