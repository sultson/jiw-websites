import { MessageCircle, Phone } from 'lucide-react';
import { services } from '../data/services';
import { business } from '../data/contact';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

export default function Services({ lang, t }: Props) {
  return (
    <section id="services" className="section bg-ink-2 border-y border-line">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="kicker">{t('services.kicker')}</span>
          <h2 className="mt-5 text-4xl md:text-5xl font-serif text-bone">
            {t('services.title')}
          </h2>
          <p className="mt-5 text-bone-soft text-base md:text-lg leading-relaxed">
            {t('services.sub')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {services.map(svc => (
            <article key={svc.id} className="card p-7 md:p-8 flex flex-col">
              <h3 className="font-serif text-2xl md:text-3xl text-bone">
                {svc.title[lang]}
              </h3>
              <p className="mt-3 text-bone-soft text-sm md:text-base leading-relaxed">
                {svc.intro[lang]}
              </p>
              <ul className="mt-6 space-y-2.5">
                {svc.items.map(item => (
                  <li key={item.nl} className="flex items-start gap-3 text-sm text-bone-soft">
                    <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full gold-gradient shrink-0" aria-hidden="true" />
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-center">
          <a
            href={business.phone.wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
          >
            <MessageCircle size={16} aria-hidden="true" />
            {t('services.book')}
          </a>
          <a href={business.phone.href} className="btn btn-outline">
            <Phone size={16} aria-hidden="true" />
            {business.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
