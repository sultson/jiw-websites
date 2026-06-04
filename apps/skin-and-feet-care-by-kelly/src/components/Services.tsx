import { useState } from 'react';
import { Sparkles, Footprints, Flower2, Leaf, Hand, ChevronDown, ArrowRight } from 'lucide-react';
import { serviceCategories } from '../data/services';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string; onBook: () => void };

const iconMap = {
  sparkles:   Sparkles,
  footprints: Footprints,
  flower:     Flower2,
  leaf:       Leaf,
  hand:       Hand,
};

export default function Services({ lang, t, onBook }: Props) {
  const [open, setOpen] = useState<string | null>('gezicht');

  const catName = (c: { titleNl: string; titleEn: string }) => (lang === 'en' ? c.titleEn : c.titleNl);
  const svcName = (s: { nameNl: string; nameEn: string }) => (lang === 'en' ? s.nameEn : s.nameNl);
  const svcDesc = (s: { descNl?: string; descEn?: string }) => (lang === 'en' ? s.descEn : s.descNl);

  return (
    <section id="behandelingen" className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('services.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-ink/60 text-sm max-w-xl mx-auto">{t('services.sub')}</p>
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
                    <div className="shrink-0 w-11 h-11 rounded-full bg-blush flex items-center justify-center text-plum">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl">{catName(cat)}</h3>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-ink/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <ul className="divide-y divide-ink/5 border-t border-ink/5">
                    {cat.services.map(s => {
                      const desc = svcDesc(s);
                      return (
                        <li key={s.id} className="px-5 md:px-7 py-4">
                          <p className="text-sm md:text-base font-medium text-ink">{svcName(s)}</p>
                          {desc && <p className="text-xs md:text-sm text-ink/55 mt-1 leading-relaxed">{desc}</p>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-sm text-ink/55 max-w-sm">{t('services.note')}</p>
          <button onClick={onBook} className="btn-plum shrink-0">
            {t('services.cta')}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
