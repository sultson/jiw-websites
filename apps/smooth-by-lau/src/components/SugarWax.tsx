import { ArrowRight, Leaf } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function SugarWax({ t, onBook }: Props) {
  const benefits = [1, 2, 3, 4, 5] as const;

  return (
    <section id="suiker" className="py-20 md:py-28 bg-espresso text-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          <div>
            <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-gold-soft font-medium">
              {t('sugar.kicker')}
            </span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-cream leading-[1.1]">
              {t('sugar.title')}
            </h2>
            <p className="mt-6 text-cream/70 leading-relaxed">
              {t('sugar.body')}
            </p>

            <div className="mt-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft mb-4">
                {t('sugar.benefits')}
              </p>
              <ul className="space-y-3">
                {benefits.map(i => (
                  <li key={i} className="flex items-start gap-3 text-cream/80 text-sm leading-relaxed">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                      <Leaf size={10} className="text-gold-soft" />
                    </span>
                    {t(`sugar.b${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={onBook} className="mt-10 btn-gold">
              {t('sugar.cta')}
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="hidden md:block relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-espresso-soft shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
              <img
                src="/suikerontharing.webp"
                alt="Suikerontharing behandeling"
                className="w-full h-full object-cover opacity-80"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-gold/8 blur-2xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
