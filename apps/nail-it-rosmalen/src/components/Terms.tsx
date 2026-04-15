import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

type Props = { t: (k: string) => string };

const items = [1, 2, 3, 4, 5] as const;

export default function Terms({ t }: Props) {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <section id="voorwaarden" className="py-20 md:py-28 bg-cream">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('terms.kicker')}</span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">{t('terms.title')}</h2>
          <p className="mt-3 text-sm text-espresso/60">{t('terms.sub')}</p>
        </div>

        <div className="divide-y divide-espresso/10 border-y border-espresso/10">
          {items.map(i => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-serif text-base text-gold tabular-nums">0{i}</span>
                    <span className="font-serif text-lg md:text-xl text-espresso">{t(`terms.h${i}`)}</span>
                  </span>
                  {isOpen ? (
                    <Minus size={18} className="shrink-0 text-espresso/50" />
                  ) : (
                    <Plus size={18} className="shrink-0 text-espresso/50" />
                  )}
                </button>
                {isOpen && (
                  <p className="pb-6 pl-9 pr-2 text-espresso/75 leading-relaxed text-sm max-w-2xl">
                    {t(`terms.a${i}`)}
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
