import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

type Props = { t: (k: string) => string };

const items = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
];

export default function Faq({ t }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section bg-ink">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="kicker">{t('faq.kicker')}</span>
          <h2 className="mt-5 text-4xl md:text-5xl font-serif text-bone">
            {t('faq.title')}
          </h2>
        </div>

        <div className="mt-10 max-w-3xl">
          <ul className="divide-y divide-line border-y border-line">
            {items.map((it, idx) => {
              const isOpen = open === idx;
              return (
                <li key={it.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-6 py-5 text-left text-bone hover:text-gold-bright transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-xl md:text-2xl">
                      {t(it.q)}
                    </span>
                    <span className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-gold">
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="pb-6 -mt-1 text-bone-soft text-base leading-relaxed max-w-2xl">
                      {t(it.a)}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
