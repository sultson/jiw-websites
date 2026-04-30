import { Heart } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  return (
    <section id="over" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.05]">
            {t('about.title')}
          </h2>
          <p className="mt-6 text-espresso/75 leading-relaxed max-w-prose">{t('about.body1')}</p>
          <p className="mt-4 text-espresso/75 leading-relaxed max-w-prose">{t('about.body2')}</p>

          <p className="mt-7 inline-flex items-center gap-2 text-sm text-espresso/65">
            <Heart size={14} className="text-gold" />
            {t('about.welcoming')}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span className="script text-5xl md:text-6xl text-gold leading-none">
              {t('about.signature')}
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-espresso/50">
              Beautique Jeanine
            </span>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            <img
              src="/jeanine-salon-portrait.webp"
              alt="Jeanine de Koning in de salon van Beautique Jeanine"
              loading="lazy"
              className="rounded-sm w-full aspect-[4/5] object-cover shadow-[0_20px_60px_-30px_rgba(42,33,32,0.5)]"
            />
            <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 rounded-sm bg-gold/90 -z-0" />
            <div className="hidden md:block absolute -top-4 -right-4 text-[10px] uppercase tracking-[0.3em] text-espresso/60 bg-cream px-3 py-1.5 border border-espresso/10">
              Rotsterhaule
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-cream/92 px-4 py-3 shadow-[0_12px_35px_-24px_rgba(42,33,32,0.55)]">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">{t('about.cardKicker')}</p>
              <p className="mt-1 font-serif text-xl text-espresso">{t('about.cardTitle')}</p>
              <p className="mt-1 text-xs text-espresso/60">{t('about.cardText')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
