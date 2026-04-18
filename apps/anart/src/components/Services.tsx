import { useState } from 'react';
import { Sparkles, Heart, Scissors, Leaf, ChevronDown, Eye, Flower2, Hand, Gift, ArrowRight } from 'lucide-react';
import { serviceCategories, formatPrice } from '../data/services';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const iconMap = {
  sparkles: Sparkles,
  heart:    Heart,
  scissors: Scissors,
  leaf:     Leaf,
  eye:      Eye,
  flower:   Flower2,
  hands:    Hand,
  gift:     Gift,
};

export default function Services({ lang, t }: Props) {
  const [open, setOpen] = useState<string | null>('manicure');

  function name(cat: { titleNl: string; titleEn: string; titlePl: string }) {
    if (lang === 'en') return cat.titleEn;
    if (lang === 'pl') return cat.titlePl;
    return cat.titleNl;
  }

  function serviceName(s: { nameNl: string; nameEn: string; namePl: string }) {
    if (lang === 'en') return s.nameEn;
    if (lang === 'pl') return s.namePl;
    return s.nameNl;
  }

  function serviceDesc(s: { descNl?: string; descEn?: string; descPl?: string }) {
    if (lang === 'en') return s.descEn;
    if (lang === 'pl') return s.descPl;
    return s.descNl;
  }

  return (
    <section id="behandelingen" className="py-20 md:py-28 bg-blush-soft/50">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('services.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-espresso/60 text-sm max-w-lg mx-auto">{t('services.sub')}</p>
        </div>

        <div className="space-y-3">
          {serviceCategories.map(cat => {
            const Icon = iconMap[cat.icon];
            const isOpen = open === cat.id;
            return (
              <div key={cat.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : cat.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-7 py-5 text-left hover:bg-white"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-blush flex items-center justify-center text-gold">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl">{name(cat)}</h3>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-espresso/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <ul className="divide-y divide-espresso/5 border-t border-espresso/5">
                    {cat.services.map(s => {
                      const desc = serviceDesc(s);
                      return (
                        <li key={s.id} className="flex items-center gap-4 px-5 md:px-7 py-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-base font-medium text-espresso">
                              {serviceName(s)}
                            </p>
                            {desc && <p className="text-xs text-espresso/55 mt-0.5">{desc}</p>}
                            {s.durationMin > 0 && (
                              <p className="text-xs text-espresso/50 mt-1">
                                {s.durationMin} {t('services.min')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-serif text-lg text-espresso tabular-nums">
                              {formatPrice(s.price)}
                            </span>
                            <a
                              href="https://anart-studio.salonized.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-espresso bg-white border border-espresso/15 rounded-full px-3 py-1.5 hover:border-gold hover:text-gold"
                            >
                              {t('services.book')}
                              <ArrowRight size={12} />
                            </a>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
