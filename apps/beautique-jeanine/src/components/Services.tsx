import { useState } from 'react';
import {
  MessageCircle,
  Sparkles,
  Heart,
  Palette,
  Droplet,
  ChevronDown,
} from 'lucide-react';
import { formatPrice, serviceCategories } from '../data/services';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const iconMap = {
  sparkles: Sparkles,
  heart: Heart,
  palette: Palette,
  droplet: Droplet,
};

const focusCards = [
  {
    title: 'services.focusSkinTitle',
    body: 'services.focusSkinBody',
  },
  {
    title: 'services.focusLashesTitle',
    body: 'services.focusLashesBody',
  },
  {
    title: 'services.focusBeautyTitle',
    body: 'services.focusBeautyBody',
  },
  {
    title: 'services.focusProductsTitle',
    body: 'services.focusProductsBody',
  },
];

export default function Services({ lang, t }: Props) {
  const [open, setOpen] = useState<string | null>('facials');

  return (
    <section id="behandelingen" className="py-20 md:py-28 bg-blush-soft/60">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="rule kicker">{t('services.kicker')}</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-espresso/65 text-sm max-w-xl mx-auto leading-relaxed">
            {t('services.sub')}
          </p>
          <p className="mt-3 text-xs text-espresso/50">{t('services.priceSource')}</p>
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
                          className="px-5 md:px-7 py-4 grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-baseline"
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

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {focusCards.map(card => (
            <article key={card.title} className="rounded-lg bg-white/80 p-5 md:p-6 border border-espresso/5">
              <h3 className="font-serif text-2xl leading-tight">{t(card.title)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-espresso/65">{t(card.body)}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://wa.me/31623669653"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            <MessageCircle size={16} />
            {t('hero.ctaWa')}
          </a>
          <p className="mt-3 text-xs text-espresso/50">{t('services.callLine')}</p>
        </div>
      </div>
    </section>
  );
}
