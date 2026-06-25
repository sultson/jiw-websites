import type { Treatment, TreatmentCategory, Loc } from '../types';
import type { Lang } from '../../lib/i18n';
import { setA } from './set-a';
import { setB } from './set-b';

export const treatments: Treatment[] = [...setA, ...setB].sort((a, b) => a.order - b.order);

export function treatmentBySlug(slug: string, lang: Lang): Treatment | undefined {
  return treatments.find((t) => t.slug[lang] === slug);
}

export function treatmentByKey(key: string): Treatment | undefined {
  return treatments.find((t) => t.key === key);
}

export const categoryMeta: Record<
  TreatmentCategory,
  { label: Loc; icon: string }
> = {
  preventief: {
    label: { nl: 'Preventief', en: 'Prevention' },
    icon: 'shield',
  },
  esthetisch: {
    label: { nl: 'Esthetisch', en: 'Cosmetic' },
    icon: 'sparkle',
  },
  herstel: {
    label: { nl: 'Herstel', en: 'Restoration' },
    icon: 'tooth',
  },
  vervanging: {
    label: { nl: 'Vervanging', en: 'Replacement' },
    icon: 'anchor',
  },
  kinderen: {
    label: { nl: 'Kinderen', en: 'Children' },
    icon: 'baby',
  },
  comfort: {
    label: { nl: 'Comfort & zorg', en: 'Comfort & care' },
    icon: 'heart',
  },
};

export const categoryOrder: TreatmentCategory[] = [
  'preventief',
  'esthetisch',
  'herstel',
  'vervanging',
  'comfort',
  'kinderen',
];

export function treatmentsByCategory(): { category: TreatmentCategory; items: Treatment[] }[] {
  return categoryOrder
    .map((category) => ({
      category,
      items: treatments.filter((t) => t.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

/** Per-treatment accent icon for cards (falls back to its category icon). */
export const treatmentIcon: Record<string, string> = {
  'periodieke-controle': 'check',
  mondhygienist: 'sparkle',
  'tanden-bleken': 'smile',
  facings: 'layers',
  'kronen-en-bruggen': 'crown',
  kindertandheelkunde: 'baby',
  implantaten: 'anchor',
  cerec: 'scan',
  wortelkanaalbehandeling: 'tooth',
  'verstandskies-trekken': 'syringe',
  kunstgebit: 'smile',
  'angst-voor-de-tandarts': 'heart',
};
