import { Award } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 text-4xl md:text-5xl leading-[1.1]">{t('about.title')}</h2>
          <p className="mt-6 text-ink-soft/90 leading-relaxed max-w-prose">{t('about.body1')}</p>
          <p className="mt-4 text-ink-soft/90 leading-relaxed max-w-prose">{t('about.body2')}</p>
          <p className="mt-6 inline-flex items-start gap-3 rounded-2xl bg-lilac-wash px-4 py-3 text-sm text-ink-soft/90">
            <Award size={18} className="mt-0.5 shrink-0 text-lilac-deep" aria-hidden="true" />
            <span>{t('about.certification')}</span>
          </p>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-full h-full rounded-3xl bg-lilac-mist"
            />
            <img
              src="/about-hoeve.webp"
              alt={t('about.imgAlt')}
              loading="lazy"
              className="relative w-full aspect-[4/5] object-cover rounded-3xl shadow-[0_24px_60px_-32px_rgba(46,36,51,0.35)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
