import { useState } from 'react';
import { ChevronDown, Sparkles, Eye, Droplets } from 'lucide-react';
import { serviceCategories } from '../data/services';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string; onBook: () => void };

const iconMap = {
  nails: Sparkles,
  brows: Eye,
  care:  Droplets,
};

export default function Services({ t, onBook }: Props) {
  const [open, setOpen] = useState<string | null>('nails');

  return (
    <section id="behandelingen" className="py-24 md:py-28 bg-paper-soft/60">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('services.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-mute text-sm max-w-xl mx-auto">{t('services.sub')}</p>
        </div>

        <div className="space-y-3">
          {serviceCategories.map(cat => {
            const Icon = iconMap[cat.id];
            const isOpen = open === cat.id;
            return (
              <div key={cat.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : cat.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-7 py-5 text-left hover:bg-white"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-paper-soft flex items-center justify-center text-champagne ring-1 ring-ink/5">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl">{t(cat.titleKey)}</h3>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-ink/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <ul className="divide-y divide-ink/6 border-t border-ink/6">
                    {cat.services.map(s => (
                      <li key={s.id} className="flex items-start gap-4 px-5 md:px-7 py-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm md:text-base font-medium text-ink">
                            {t(s.nameKey)}
                          </p>
                          <p className="text-xs md:text-sm text-mute mt-1 leading-relaxed">
                            {t(s.descKey)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-sm text-mute text-center max-w-md">{t('services.priceLine')}</p>
          <button onClick={onBook} className="btn-primary">
            {t('nav.book')}
          </button>
        </div>
      </div>
    </section>
  );
}
