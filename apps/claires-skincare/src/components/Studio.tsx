type Props = { t: (k: string) => string };

export default function Studio({ t }: Props) {
  return (
    <section id="studio" className="py-20 md:py-28 bg-blush-soft/30">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10 md:mb-14">
          <span className="kicker">{t('studio.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('studio.title')}</h2>
          <p className="mt-4 text-espresso/70 leading-relaxed max-w-2xl mx-auto">{t('studio.body')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <img
            src="/treatment-room-sage.webp"
            alt="Behandelkamer met apparatuur"
            loading="lazy"
            decoding="async"
            className="rounded-2xl w-full aspect-[4/3] object-cover shadow-[0_20px_60px_-30px_rgba(42,33,28,0.4)]"
          />
          <img
            src="/studio-2.webp"
            alt="Studio interieur"
            loading="lazy"
            decoding="async"
            className="rounded-2xl w-full aspect-[4/3] object-cover shadow-[0_20px_60px_-30px_rgba(42,33,28,0.4)]"
          />
        </div>
      </div>
    </section>
  );
}
