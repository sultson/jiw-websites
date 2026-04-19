type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  return (
    <section id="over-ons" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">{t('about.title')}</h2>
          <p className="mt-6 text-espresso/75 leading-relaxed max-w-prose">{t('about.body')}</p>
          <div className="mt-8 flex items-center gap-4 text-sm text-espresso/70">
            <div className="h-px flex-1 bg-espresso/15 max-w-16" />
            <span className="font-serif italic text-lg">{t('about.owner')}</span>
            <div className="h-px flex-1 bg-espresso/15 max-w-16" />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            {/* Vervang /salon.webp door een salonsfoto van Anna */}
            <div className="rounded-2xl w-full aspect-[4/5] bg-blush flex items-center justify-center overflow-hidden shadow-[0_20px_60px_-30px_rgba(30,26,24,0.4)]">
              <img
                src="/salon_behandelkamer_bloemen_behang.webp"
                alt="AnArt Studio — Kaatsheuvel"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-gold -z-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
