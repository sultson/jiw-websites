import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { hours } from '../data/hours';

type Props = { t: (k: string) => string; lang: 'nl' | 'en' };

export default function Visit({ t, lang }: Props) {
  // hours is Monday-first; getDay() is 0 = Sunday
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <section id="bezoek" className="py-20 md:py-28 bg-lilac-wash/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-3 text-4xl md:text-5xl">{t('visit.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
          <div className="space-y-6">
            <div className="card p-6 md:p-8">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-lilac-mist flex items-center justify-center text-lilac-deep">
                  <MapPin size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-soft/60 mb-1">
                    {t('visit.addressTitle')}
                  </p>
                  <p className="font-medium text-ink">Zeedijk 16</p>
                  <p className="text-ink-soft">3329 LC Dordrecht</p>
                  <a
                    href="https://maps.google.com/?cid=17446167066350775375"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline mt-4"
                  >
                    {t('visit.maps')} <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
              <p className="mt-6 text-sm text-ink-soft/90 leading-relaxed">{t('visit.body')}</p>
            </div>

            <div className="card p-6 md:p-8">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-lilac-mist flex items-center justify-center text-lilac-deep">
                  <Clock size={18} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-ink-soft/60 mb-3">
                    {t('visit.hoursTitle')}
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    {hours.map((row, i) => (
                      <li
                        key={row.dayNl}
                        className={`flex justify-between gap-4 ${
                          i === todayIndex ? 'font-semibold text-ink' : 'text-ink-soft/80'
                        }`}
                      >
                        <span>{lang === 'en' ? row.dayEn : row.dayNl}</span>
                        <span className="tabular-nums">{row.hours ?? t('visit.closed')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <img
            src="/visit-luchtfoto.webp"
            alt={t('visit.imgAlt')}
            loading="lazy"
            className="w-full aspect-[4/5] md:aspect-auto md:h-full object-cover rounded-3xl shadow-[0_24px_60px_-32px_rgba(46,36,51,0.35)]"
          />
        </div>
      </div>
    </section>
  );
}
