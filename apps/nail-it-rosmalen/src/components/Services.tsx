import { useState } from 'react';
import {
  Phone,
  Stamp,
  Sparkles,
  Heart,
  Palette,
  Scissors,
  Droplet,
  ChevronDown,
} from 'lucide-react';
import { serviceCategories, formatPrice } from '../data/services';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const iconMap = {
  sparkles: Sparkles,
  heart: Heart,
  stamp: Stamp,
  palette: Palette,
  scissors: Scissors,
  droplet: Droplet,
};

export default function Services({ lang, t }: Props) {
  const [open, setOpen] = useState<string | null>('nieuw-verlenging');

  return (
    <section id="behandelingen" className="py-20 md:py-28 bg-blush-soft/60">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="rule kicker">{t('services.kicker')}</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-espresso/65 text-sm max-w-xl mx-auto leading-relaxed">
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
                    <div className="shrink-0 w-11 h-11 rounded-full bg-blush flex items-center justify-center text-gold">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg md:text-xl leading-tight">
                        {lang === 'nl' ? cat.titleNl : cat.titleEn}
                      </h3>
                      {(cat.blurbNl || cat.blurbEn) && (
                        <p className="text-xs text-espresso/55 mt-0.5 italic">
                          {lang === 'nl' ? cat.blurbNl : cat.blurbEn}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-espresso/60 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <ul className="divide-y divide-espresso/5 border-t border-espresso/5">
                    {cat.services.map(s => {
                      const priceText =
                        (lang === 'nl' ? s.priceLabelNl : s.priceLabelEn) ?? formatPrice(s.price);
                      return (
                        <li
                          key={s.id}
                          className="px-5 md:px-7 py-4 grid grid-cols-[1fr_auto] gap-4 items-baseline"
                        >
                          <div className="min-w-0">
                            <p className="text-sm md:text-base text-espresso">
                              {lang === 'nl' ? s.nameNl : s.nameEn}
                            </p>
                            {(s.descNl || s.descEn) && (
                              <p className="text-xs text-espresso/55 mt-0.5">
                                {lang === 'nl' ? s.descNl : s.descEn}
                              </p>
                            )}
                          </div>
                          <span className="font-serif text-base md:text-lg text-espresso tabular-nums whitespace-nowrap">
                            {priceText}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-gold/20 bg-white/50 p-6 md:p-7 flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
            <Stamp size={18} />
          </div>
          <p className="text-sm text-espresso/80 leading-relaxed">{t('services.loyalty')}</p>
        </div>

        <div className="mt-10 text-center">
          <a href="tel:+31639211983" className="btn-primary inline-flex">
            <Phone size={16} />
            {t('hero.ctaCall')}
          </a>
          <p className="mt-3 text-xs text-espresso/50">{t('services.callLine')}</p>
        </div>
      </div>
    </section>
  );
}
