import { Sparkles } from 'lucide-react';

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
          <p className="mt-6 text-ink/75 leading-relaxed max-w-prose">{t('about.body1')}</p>
          <p className="mt-4 text-ink/75 leading-relaxed max-w-prose">{t('about.body2')}</p>

          <p className="mt-7 inline-flex items-center gap-2 text-sm text-ink/65">
            <Sparkles size={14} className="text-rose" />
            {t('about.welcoming')}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span className="font-serif text-3xl md:text-4xl text-rose italic leading-none">
              Charrety Klasen
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-ink/50">
              Magnetic Ambassador
            </span>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            <img
              src="/salon-interior.webp"
              alt="Charrety en haar team aan het werk in de nagelstudio in Ter Apel"
              loading="lazy"
              className="rounded-sm w-full aspect-[4/5] object-cover shadow-[0_20px_60px_-30px_rgba(42,25,34,0.5)]"
            />
            <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 rounded-sm bg-rose/90 -z-0" />
            <div className="hidden md:block absolute -top-4 -right-4 text-[10px] uppercase tracking-[0.3em] text-ink/60 bg-cream px-3 py-1.5 border border-ink/10">
              Ter Apel
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
