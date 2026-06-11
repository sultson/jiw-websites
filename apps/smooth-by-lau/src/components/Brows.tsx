import { ArrowRight, Sparkles } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

const treatments = [1, 2, 3] as const;

export default function Brows({ t, onBook }: Props) {
  return (
    <section id="wenkbrauwen" className="py-20 md:py-28 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          <div className="relative order-last md:order-first">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-blush-soft shadow-[0_30px_80px_-30px_rgba(58,36,24,0.45)]">
              <img
                src="/resultaat-wenkbrauwen-5.webp"
                alt="Wenkbrauwbehandeling resultaat bij Smooth By Lau"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          </div>

          <div>
            <span className="kicker">{t('brows.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">
              {t('brows.title')}
            </h2>
            <p className="mt-6 text-espresso/70 leading-relaxed">
              {t('brows.body')}
            </p>

            <ul className="mt-8 space-y-4">
              {treatments.map(i => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-0.5 shrink-0 w-9 h-9 rounded-full bg-blush flex items-center justify-center text-gold">
                    <Sparkles size={15} />
                  </span>
                  <div>
                    <p className="font-serif text-lg text-espresso">{t(`brows.t${i}.t`)}</p>
                    <p className="text-sm text-espresso/60 leading-relaxed mt-0.5">
                      {t(`brows.t${i}.b`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <button onClick={onBook} className="mt-10 btn-gold">
              {t('brows.cta')}
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
