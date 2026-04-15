import { Trophy } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Awards({ t }: Props) {
  return (
    <section id="awards" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative">
          <img
            src="/awards.webp"
            alt={t('awards.imgAlt')}
            loading="lazy"
            className="rounded-sm w-full object-cover shadow-[0_20px_60px_-30px_rgba(35,27,29,0.5)]"
          />
          <div className="hidden md:block absolute -bottom-5 -right-5 w-24 h-24 rounded-sm bg-gold/90 -z-0" />
        </div>

        <div>
          <span className="kicker inline-flex items-center gap-2">
            <Trophy size={14} /> {t('awards.kicker')}
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.05]">
            {t('awards.title')}
          </h2>
          <p className="mt-6 text-espresso/75 leading-relaxed max-w-prose">
            {t('awards.body')}
          </p>

          <ul className="mt-6 space-y-2 text-sm text-espresso/80">
            <li className="flex items-baseline gap-3">
              <span className="script text-2xl text-gold leading-none">1e</span>
              <span>{t('awards.first')}</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="script text-2xl text-gold leading-none">2e</span>
              <span>{t('awards.second')}</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="script text-2xl text-gold leading-none">3e</span>
              <span>{t('awards.third')}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
