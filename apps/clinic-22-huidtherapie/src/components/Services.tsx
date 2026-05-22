import { useState } from 'react';
import { Sparkles, Flower2, Droplet, Sun, Zap, Leaf, Gift, Tag, ChevronDown, ArrowRight } from 'lucide-react';
import { serviceCategories, formatPrice } from '../data/services';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string; onBook: () => void };

const iconMap = {
  sparkles: Sparkles,
  flower: Flower2,
  droplet: Droplet,
  sun: Sun,
  zap: Zap,
  leaf: Leaf,
  gift: Gift,
  tag: Tag,
};

export default function Services({ lang, t, onBook }: Props) {
  const [open, setOpen] = useState<string | null>('huidbehandelingen');

  function catName(cat: { titleNl: string; titleEn: string }) {
    return lang === 'en' ? cat.titleEn : cat.titleNl;
  }

  function svcName(s: { nameNl: string; nameEn: string }) {
    return lang === 'en' ? s.nameEn : s.nameNl;
  }

  function svcDesc(s: { descNl?: string; descEn?: string }) {
    return lang === 'en' ? s.descEn : s.descNl;
  }

  function intakeNote(cat: { intakeNote?: { nl: string; en: string } }) {
    if (!cat.intakeNote) return null;
    return lang === 'en' ? cat.intakeNote.en : cat.intakeNote.nl;
  }

  return (
    <section id="behandelingen" className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('services.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-ink/65 text-sm max-w-lg mx-auto">{t('services.sub')}</p>
        </div>

        <div className="space-y-3">
          {serviceCategories.map(cat => {
            const Icon = iconMap[cat.icon];
            const isOpen = open === cat.id;
            const note = intakeNote(cat);
            return (
              <div key={cat.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : cat.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-7 py-5 text-left hover:bg-white transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-bone flex items-center justify-center text-ink">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl">{catName(cat)}</h3>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-ink/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-ink/5">
                    {note && (
                      <p className="px-5 md:px-7 py-3 bg-bone/40 text-xs text-ink/70 italic leading-relaxed">
                        {note}
                      </p>
                    )}
                    <ul className="divide-y divide-ink/5">
                      {cat.services.map(s => {
                        const desc = svcDesc(s);
                        return (
                          <li key={s.id} className="flex items-center gap-4 px-5 md:px-7 py-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm md:text-base font-medium text-ink">
                                {svcName(s)}
                              </p>
                              {desc && <p className="text-xs text-ink/55 mt-0.5">{desc}</p>}
                              {s.durationMin > 0 && (
                                <p className="text-xs text-ink/50 mt-1">
                                  {s.durationMin} {t('services.min')}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0 text-right">
                              {s.strikePrice && (
                                <span className="block text-xs text-ink/40 line-through tabular-nums">
                                  {formatPrice(s.strikePrice)}
                                </span>
                              )}
                              <span className="font-serif text-lg text-ink tabular-nums">
                                {s.free ? t('services.free') : formatPrice(s.price)}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-ink/55 max-w-md mx-auto leading-relaxed">
          {t('services.note')}
        </p>

        <div className="mt-8 text-center">
          <button onClick={onBook} className="btn-primary">
            {t('nav.book')}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
