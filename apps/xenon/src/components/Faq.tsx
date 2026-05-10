import { useState } from 'react';
import { Plus } from 'lucide-react';

type Props = {
  t: (key: string) => string;
};

const items = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  { q: 'faq.q6', a: 'faq.a6' },
];

export default function Faq({ t }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-night border-t border-mist">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-4">
            <span className="kicker !text-xenon-bright">{t('faq.kicker')}</span>
            <h2 className="mt-4 text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.08] text-silver font-display">
              {t('faq.title')}
            </h2>
          </div>
          <ul className="lg:col-span-8 border-y border-mist">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <li key={it.q} className="border-b border-mist last:border-0">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start gap-4 py-5 sm:py-6 text-left group"
                  >
                    <span className="font-mono text-[11px] text-xenon-bright tracking-[0.22em] mt-2 shrink-0 w-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-display text-silver text-[16px] sm:text-[18px] tracking-wide">
                      {t(it.q)}
                    </span>
                    <Plus
                      size={18}
                      className={`text-steel-mute group-hover:text-silver shrink-0 mt-1.5 transition-transform duration-300 ${isOpen ? 'rotate-45 text-xenon-bright' : ''}`}
                      aria-hidden
                    />
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div className="pl-10 pr-8 pb-6 text-[14.5px] text-steel/85 leading-relaxed max-w-2xl">
                        {t(it.a)}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
