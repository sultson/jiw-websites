import { useState } from 'react';
import { Footprints, Stethoscope, Sparkles, HandHeart, ChevronDown } from 'lucide-react';
import { serviceCategories, type ServiceCategoryIcon } from '../data/services';

type Props = { t: (k: string) => string };

const iconMap: Record<ServiceCategoryIcon, typeof Footprints> = {
  foot:        Footprints,
  stethoscope: Stethoscope,
  nail:        Sparkles,
  hand:        HandHeart,
};

export default function Services({ t }: Props) {
  const [open, setOpen] = useState<string | null>('medisch');

  return (
    <section id="behandelingen" className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('services.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-ink/65 text-sm max-w-xl mx-auto leading-relaxed">
            {t('services.sub')}
          </p>
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
                    <div className="shrink-0 w-11 h-11 rounded-full bg-sand flex items-center justify-center text-teal">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl text-ink">
                      {cat.titleNl}
                    </h3>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-ink/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-ink/5">
                    {cat.intro && (
                      <p className="px-5 md:px-7 pt-5 text-sm text-ink/70 leading-relaxed max-w-prose">
                        {cat.intro}
                      </p>
                    )}
                    <ul className="divide-y divide-ink/5">
                      {cat.services.map(s => (
                        <li key={s.id} className="px-5 md:px-7 py-4">
                          <p className="text-sm md:text-base font-medium text-ink">
                            {s.nameNl}
                          </p>
                          {s.descNl && (
                            <p className="text-sm text-ink/60 mt-1 leading-relaxed">
                              {s.descNl}
                            </p>
                          )}
                          {s.durationMin && s.durationMin > 0 && (
                            <p className="text-xs text-ink/50 mt-1">
                              {s.durationMin} {t('services.min')}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
