import { useState } from 'react';
import {
  Phone,
  Sparkles,
  Heart,
  Palette,
  Droplet,
  ChevronDown,
} from 'lucide-react';
import { serviceCategories } from '../data/services';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const iconMap = {
  sparkles: Sparkles,
  heart: Heart,
  palette: Palette,
  droplet: Droplet,
};

export default function Services({ lang, t }: Props) {
  const [open, setOpen] = useState<string | null>('kunstnagels');

  return (
    <section id="behandelingen" className="py-20 md:py-28 bg-blush-soft/60">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="rule kicker">{t('services.kicker')}</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-ink/65 text-sm max-w-xl mx-auto leading-relaxed">
            {t('services.sub')}
          </p>
        </div>

        <div className="space-y-3">
          {serviceCategories.map((cat) => {
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
                    <div className="shrink-0 w-11 h-11 rounded-full bg-blush flex items-center justify-center text-rose">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg md:text-xl leading-tight">
                        {lang === 'nl' ? cat.titleNl : cat.titleEn}
                      </h3>
                      {(cat.blurbNl || cat.blurbEn) && (
                        <p className="text-xs text-ink/55 mt-0.5 italic">
                          {lang === 'nl' ? cat.blurbNl : cat.blurbEn}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-ink/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <ul className="divide-y divide-ink/5 border-t border-ink/5">
                    {cat.services.map((s) => (
                      <li key={s.id} className="px-5 md:px-7 py-4">
                        <p className="text-sm md:text-base text-ink">
                          {lang === 'nl' ? s.nameNl : s.nameEn}
                        </p>
                        {(s.descNl || s.descEn) && (
                          <p className="text-xs text-ink/55 mt-0.5">
                            {lang === 'nl' ? s.descNl : s.descEn}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a href="tel:+31623800854" className="btn-primary inline-flex">
            <Phone size={16} />
            {t('hero.ctaCall')}
          </a>
          <p className="mt-3 text-xs text-ink/50">{t('services.callLine')}</p>
        </div>
      </div>
    </section>
  );
}
