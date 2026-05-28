import { useState } from 'react';
import { Sparkles, Flower2, Wand2, Scissors, ChevronDown, ExternalLink, MessageCircle } from 'lucide-react';
import {
  serviceCategories,
  formatPrice,
  svcName,
  svcNote,
  catTitle,
  catDescription,
  type ServiceCategory,
} from '../data/services';
import type { Lang } from '../translations';
import { contact } from '../data/contact';

type Props = { lang: Lang; t: (k: string) => string };

const iconMap: Record<ServiceCategory['icon'], typeof Sparkles> = {
  sparkles: Sparkles,
  flower:   Flower2,
  wand:     Wand2,
  scissors: Scissors,
  sun:      Sparkles,
  droplet:  Sparkles,
};

export default function Services({ lang, t }: Props) {
  const [open, setOpen] = useState<string | null>('nagels');

  return (
    <section id="behandelingen" className="py-20 md:py-28 bg-blush-soft/40">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('services.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-ink/60 text-sm max-w-lg mx-auto">{t('services.sub')}</p>
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
                    <div className="shrink-0 w-11 h-11 rounded-full bg-blush flex items-center justify-center text-rose">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif text-xl md:text-2xl">{catTitle(cat, lang)}</h3>
                      <p className="text-xs text-ink/55 mt-0.5 line-clamp-1">{catDescription(cat, lang)}</p>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-ink/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  cat.hideList ? (
                    <div className="px-5 md:px-7 pb-6 pt-2 border-t border-ink/5">
                      <p className="text-sm text-ink/70 max-w-prose">{cat.noteKey ? t(cat.noteKey) : catDescription(cat, lang)}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href={contact.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/20 text-sm text-ink/80 hover:bg-ink hover:text-pearl transition-colors"
                        >
                          <MessageCircle size={14} />
                          WhatsApp
                        </a>
                        <a
                          href="https://www.instagram.com/lyubanovosad/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/20 text-sm text-ink/80 hover:bg-ink hover:text-pearl transition-colors"
                        >
                          @lyubanovosad
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <ul className="divide-y divide-ink/5 border-t border-ink/5">
                      {cat.services.map(s => {
                        const note = svcNote(s, lang);
                        return (
                          <li key={s.id} className="flex items-center gap-4 px-5 md:px-7 py-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm md:text-base font-medium text-ink">
                                {svcName(s, lang)}
                              </p>
                              {note && <p className="text-xs text-ink/55 mt-0.5">{note}</p>}
                              {s.durationMin > 0 && (
                                <p className="text-xs text-ink/45 mt-1">
                                  {s.durationMin} {t('services.min')}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0">
                              <span className="font-serif text-lg text-ink tabular-nums">
                                {formatPrice(s.price, s.priceLabel, lang)}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href={contact.freshaVenue}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            {t('services.viewAll')}
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
