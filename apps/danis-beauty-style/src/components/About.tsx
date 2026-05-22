import { Check } from 'lucide-react';

type Props = { t: (k: string) => string };

const tagKeys = ['about.tag1', 'about.tag2', 'about.tag3', 'about.tag4'];

export default function About({ t }: Props) {
  return (
    <section id="about" className="section bg-ink">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="kicker mx-auto">{t('about.kicker')}</span>
          <h2 className="mt-5 text-4xl md:text-5xl font-serif text-bone">
            {t('about.title')}
          </h2>
          <p className="mt-6 text-bone-soft text-base md:text-lg leading-relaxed">
            {t('about.body')}
          </p>

          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-left max-w-xl mx-auto">
            {tagKeys.map(key => (
              <li key={key} className="flex items-center gap-3">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full gold-gradient shrink-0"
                  aria-hidden="true"
                >
                  <Check size={14} strokeWidth={3} className="text-ink" />
                </span>
                <span className="text-sm font-medium text-bone-soft">{t(key)}</span>
              </li>
            ))}
          </ul>

          <blockquote className="mt-12 font-serif text-2xl md:text-3xl italic text-bone leading-snug">
            {t('about.quote')}
            <span className="block mt-4 not-italic script text-gold-bright text-4xl">
              {t('about.signature')}
            </span>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
