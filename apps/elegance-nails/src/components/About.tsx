type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  return (
    <section id="over-kelly" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">{t('about.title')}</h2>
          <p className="mt-6 text-espresso/80 leading-relaxed max-w-prose">{t('about.body1')}</p>
          <p className="mt-4 text-espresso/75 leading-relaxed max-w-prose">{t('about.body2')}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-espresso/15 max-w-12" />
            <span className="signature">{t('about.signature')}</span>
            <div className="h-px flex-1 bg-espresso/15 max-w-12" />
          </div>

          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-espresso/50">
            {t('about.welcoming')}
          </p>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            <div className="rounded-2xl w-full aspect-[4/5] bg-blush flex items-center justify-center overflow-hidden shadow-[0_20px_60px_-30px_rgba(42,26,20,0.35)]">
              <img
                src="/kelly-portrait.webp"
                alt="Kelly van Elégance Nails"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block absolute -bottom-8 -left-8 w-40 h-48 rounded-2xl overflow-hidden shadow-[0_20px_60px_-30px_rgba(42,26,20,0.4)] ring-4 ring-cream">
              <img
                src="/salon-tools.webp"
                alt="Werkruimte van Elégance Nails"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
