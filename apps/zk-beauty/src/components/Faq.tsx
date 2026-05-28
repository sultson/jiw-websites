import { useState } from 'react';
import { Plus } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Faq({ t }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4, 5];

  return (
    <section id="faq" className="py-20 md:py-32 bg-ivory-soft/60">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <span className="gold-rule">{t('faq.kicker')}</span>
          <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            {t('faq.title')}
          </h2>
        </div>

        <div className="space-y-2">
          {items.map(i => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-ink/12">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-xl md:text-2xl text-ink">{t(`faq.q${i}`)}</span>
                  <Plus
                    size={22}
                    className={`shrink-0 text-ink/55 transition-transform ${isOpen ? 'rotate-45 text-gold-deep' : ''}`}
                  />
                </button>
                {isOpen && (
                  <p className="pb-6 text-ink-soft leading-relaxed font-serif text-lg max-w-prose">
                    {t(`faq.a${i}`)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
