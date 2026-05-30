import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

const ITEMS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];

export default function Faq({ t, onBook }: Props) {
  const [open, setOpen] = useState<string | null>('q1');

  return (
    <section id="faq" className="py-20 md:py-28 bg-cream-soft">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('faq.kicker')}</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">{t('faq.title')}</h2>
        </div>

        <div className="space-y-3">
          {ITEMS.map(id => {
            const isOpen = open === id;
            return (
              <div key={id} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : id)}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-7 py-5 text-left hover:bg-cream"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-ink text-sm md:text-base">{t(`faq.${id}`)}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-ink-mute transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 md:px-7 pb-5 -mt-1 text-sm text-ink-soft leading-relaxed">
                    {id === 'q1' ? (
                      <p>
                        {t('faq.a1.p1')}
                        <button onClick={onBook} className="text-rose-deep font-medium hover:underline">
                          {t('faq.a1.book')}
                        </button>
                        {t('faq.a1.p2')}
                      </p>
                    ) : (
                      <p>{t(`faq.a${id.slice(1)}`)}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button onClick={onBook} className="btn-rose">{t('nav.book')}</button>
        </div>
      </div>
    </section>
  );
}
