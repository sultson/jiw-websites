import { useState } from 'react';
import { Sparkles, Gem, Palette, ChevronDown, Phone, MessageCircle } from 'lucide-react';
import { serviceCategories, formatPrice } from '../data/services';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const iconMap = {
  sparkles: Sparkles,
  gem:      Gem,
  palette:  Palette,
};

export default function Services({ lang, t }: Props) {
  const [open, setOpen] = useState<string | null>('manicure');

  return (
    <section id="behandelingen" className="py-20 md:py-28">
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
                    <h3 className="font-serif text-xl md:text-2xl">{cat.title[lang]}</h3>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-espresso/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <ul className="divide-y divide-espresso/5 border-t border-espresso/5">
                    {cat.services.map(s => (
                      <li key={s.id} className="flex items-center gap-4 px-5 md:px-7 py-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm md:text-base font-medium text-espresso">
                            {s.name[lang]}
                          </p>
                          {s.desc && (
                            <p className="text-xs text-espresso/55 mt-0.5">{s.desc[lang]}</p>
                          )}
                          {s.durationMin > 0 && (
                            <p className="text-xs text-espresso/50 mt-1">
                              {s.durationMin} {t('services.min')}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0">
                          <span className="font-serif text-lg text-espresso tabular-nums">
                            {formatPrice(s.price)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-center">
          <p className="text-sm text-espresso/65 w-full">{t('services.callLine')}</p>
          <a href="tel:+31616770738" className="btn-outline">
            <Phone size={14} />
            06 16770738
          </a>
          <a
            href="https://wa.me/31616770738"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
