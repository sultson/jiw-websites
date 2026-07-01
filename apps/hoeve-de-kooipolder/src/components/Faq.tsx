import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Props = { t: (k: string) => string };

const ITEMS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Faq({ t }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('faq.kicker')}</span>
          <h2 className="mt-3 text-4xl md:text-5xl">{t('faq.title')}</h2>
        </div>

        <div>
          {ITEMS.map(i => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-ink/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-serif text-lg md:text-xl text-ink">{t(`faq.q${i}`)}</span>
                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className={`shrink-0 text-lilac-deep transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div id={`faq-answer-${i}`} hidden={!isOpen}>
                  <p className="pb-6 text-ink-soft/90 leading-loose">{t(`faq.a${i}`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
