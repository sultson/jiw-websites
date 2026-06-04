import { ArrowRight, Check } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Voetzorg({ t, onBook }: Props) {
  const points = ['voetzorg.p1', 'voetzorg.p2', 'voetzorg.p3', 'voetzorg.p4'];

  return (
    <section id="voetzorg" className="py-20 md:py-28 bg-ink text-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative order-1 md:order-2">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-ink-soft shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
              <img
                src="/voetzorg.webp"
                alt="Verzorgde voeten na een pedicurebehandeling"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-44 h-44 rounded-full bg-plum/25 blur-3xl pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-plum/20 blur-2xl pointer-events-none" />
          </div>

          <div className="order-2 md:order-1">
            <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-plum-soft font-medium">
              {t('voetzorg.kicker')}
            </span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-cream leading-[1.1]">
              {t('voetzorg.title')}
            </h2>
            <p className="mt-6 text-cream/70 leading-relaxed">{t('voetzorg.body')}</p>

            <ul className="mt-8 space-y-3">
              {points.map(p => (
                <li key={p} className="flex items-start gap-3 text-cream/85 text-sm md:text-[15px] leading-relaxed">
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-plum/25 border border-plum-soft/40 flex items-center justify-center">
                    <Check size={11} className="text-plum-soft" />
                  </span>
                  {t(p)}
                </li>
              ))}
            </ul>

            <button onClick={onBook} className="mt-10 btn-plum">
              {t('voetzorg.cta')}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
