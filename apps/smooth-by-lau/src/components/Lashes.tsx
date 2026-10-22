import { ArrowRight, Sparkles } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

const points = [1, 2, 3] as const;

export default function Lashes({ t, onBook }: Props) {
  return (
    <section id="wimpers" className="py-20 md:py-28 bg-blush-soft/40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          <div>
            <span className="kicker">{t('lashes.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">
              {t('lashes.title')}
            </h2>
            <p className="mt-6 text-espresso/70 leading-relaxed">
              {t('lashes.body')}
            </p>

            <ul className="mt-8 space-y-4">
              {points.map(i => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-0.5 shrink-0 w-9 h-9 rounded-full bg-blush flex items-center justify-center text-gold">
                    <Sparkles size={15} />
                  </span>
                  <div>
                    <p className="font-serif text-lg text-espresso">{t(`lashes.p${i}.t`)}</p>
                    <p className="text-sm text-espresso/60 leading-relaxed mt-0.5">
                      {t(`lashes.p${i}.b`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <button onClick={onBook} className="mt-10 btn-gold">
              {t('lashes.cta')}
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-blush-soft shadow-[0_30px_80px_-30px_rgba(58,36,24,0.45)]">
              <img
                src="/resultaat-korean-lashlift-1.webp"
                alt="Korean Lashlift resultaat bij Smooth By Lau"
                width="1086"
                height="1448"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
