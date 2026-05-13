import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react';
import { hours, formatHoursShort } from '../data/hours';
import { PHONE_TEL, PHONE_DISPLAY, WHATSAPP_URL } from '../contact';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

export default function Visit({ lang, t }: Props) {
  const today = new Date().getDay();

  function dayName(h: { nl: string; en: string }) {
    return lang === 'en' ? h.en : h.nl;
  }

  const byAppointmentOnly = hours.every(h => !h.open || !h.close);
  const byAppointmentLabel = lang === 'en' ? 'By appointment' : 'Op afspraak';

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
                  href="https://www.google.com/maps/dir/?api=1&destination=Cypreslaan+50,+7875+EH+Exloo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-gold hover:underline"
                >
                  {t('visit.directions')} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-1">{t('visit.phone')}</p>
                <a href={PHONE_TEL} className="font-medium text-espresso hover:text-gold">
                  {PHONE_DISPLAY}
                </a>
                <span className="mx-2 text-espresso/30">·</span>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold hover:underline"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-2">{t('visit.hours')}</p>
                {byAppointmentOnly ? (
                  <p className="text-sm font-medium text-espresso">{byAppointmentLabel}</p>
                ) : (
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
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-espresso/5 min-h-[360px] md:min-h-full">
            <iframe
              title="De Roza Nagelstudio op Google Maps"
              src="https://maps.google.com/maps?q=Cypreslaan+50,+7875+EH+Exloo&t=&z=16&ie=UTF8&iwloc=&output=embed"
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
