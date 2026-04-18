import { MapPin, Clock, ExternalLink, Calendar } from 'lucide-react';
import { hours, formatHoursShort } from '../data/hours';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

export default function Visit({ lang, t }: Props) {
  const today = new Date().getDay();

  function dayName(h: { nl: string; en: string; pl: string }) {
    if (lang === 'en') return h.en;
    if (lang === 'pl') return h.pl;
    return h.nl;
  }

  return (
    <section id="bezoek" className="py-20 md:py-28 bg-blush-soft/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('visit.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-1">{t('visit.kicker')}</p>
                <p className="font-medium text-espresso">{t('visit.address')}</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Peperstraat+14d,+5171+EC+Kaatsheuvel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-gold hover:underline"
                >
                  {t('visit.directions')} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-1">{t('visit.book')}</p>
                <a
                  href="https://anart-studio.salonized.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gold hover:underline"
                >
                  Salonized
                </a>
                <span className="text-espresso/50 text-sm mx-2">·</span>
                <a
                  href="https://www.treatwell.nl/salon/anart-studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gold hover:underline text-sm"
                >
                  Treatwell
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-2">{t('visit.hours')}</p>
                <ul className="space-y-1 text-sm">
                  {hours.map(h => (
                    <li
                      key={h.dayIndex}
                      className={`flex justify-between gap-4 ${
                        h.dayIndex === today ? 'font-semibold text-espresso' : 'text-espresso/70'
                      }`}
                    >
                      <span>{dayName(h)}</span>
                      <span className="tabular-nums">{formatHoursShort(h)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-espresso/5 min-h-[360px] md:min-h-full">
            <iframe
              title="AnArt Studio op Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2474.9!2d5.0449!3d51.6559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zAnArt+Studio+Kaatsheuvel!5e0!3m2!1snl!2snl!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 360 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
