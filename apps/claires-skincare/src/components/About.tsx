type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  return (
    <section id="over-ons" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.05]">{t('about.title')}</h2>
          <p className="mt-6 text-espresso/75 leading-relaxed max-w-prose">{t('about.body')}</p>
          <div className="mt-8 flex items-center gap-4 text-sm text-espresso/70">
            <div className="h-px flex-1 bg-espresso/15 max-w-16" />
            <span className="font-serif italic text-lg">Claire</span>
            <div className="h-px flex-1 bg-espresso/15 max-w-16" />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            <img
              src="/photo-3.webp"
              alt="Claire's Skincare Studio Amsterdam"
              loading="lazy"
              className="rounded-2xl w-full aspect-[4/5] object-cover shadow-[0_20px_60px_-30px_rgba(42,33,28,0.5)]"
            />
            <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-gold -z-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
