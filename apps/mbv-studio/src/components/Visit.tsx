import { MapPin, Clock, Phone, Mail, ExternalLink, Calendar } from 'lucide-react';
import { hours, dayName, formatHoursShort } from '../data/hours';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string; onBook: () => void };

const MAPS_DIR = 'https://www.google.com/maps/dir/?api=1&destination=Gijzenveld+4,+4817+ZE+Breda';
const MAPS_EMBED = 'https://maps.google.com/maps?q=Gijzenveld+4,+4817+ZE+Breda&z=15&output=embed';

export default function Visit({ lang, t, onBook }: Props) {
  const today = new Date().getDay();

  return (
    <section id="visit" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">{t('visit.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-sand-soft flex items-center justify-center text-rose-deep">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-mute mb-1">{t('visit.addressLabel')}</p>
                <p className="font-medium text-ink">{t('visit.address')}</p>
                <a
                  href={MAPS_DIR}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-rose-deep hover:underline"
                >
                  {t('visit.directions')} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-sand-soft flex items-center justify-center text-rose-deep">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-mute mb-1">{t('visit.phoneLabel')}</p>
                <a href="tel:+31658913113" className="font-medium text-ink hover:text-rose-deep">
                  +31 6 58913113
                </a>
                <span className="mx-2 text-ink/30">·</span>
                <a
                  href={`https://wa.me/31658913113?text=${encodeURIComponent(t('wa.text'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-rose-deep hover:underline"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-sand-soft flex items-center justify-center text-rose-deep">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-mute mb-1">{t('visit.emailLabel')}</p>
                <a href="mailto:vkolibaeva@gmail.com" className="font-medium text-ink hover:text-rose-deep break-all">
                  vkolibaeva@gmail.com
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-sand-soft flex items-center justify-center text-rose-deep">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-ink-mute mb-2">{t('visit.hoursLabel')}</p>
                <ul className="space-y-1 text-sm">
                  {hours.map(h => (
                    <li
                      key={h.dayIndex}
                      className={`flex justify-between gap-4 ${
                        h.dayIndex === today ? 'font-semibold text-ink' : 'text-ink-soft'
                      }`}
                    >
                      <span>{dayName(h, lang)}</span>
                      <span className="tabular-nums">{formatHoursShort(h, t('visit.closed'))}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-ink-mute">{t('visit.parking')}</p>
                <button onClick={onBook} className="btn-rose mt-5 w-full sm:w-auto">
                  <Calendar size={16} /> {t('visit.book')}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-ink/8 min-h-[360px] md:min-h-full">
            <iframe
              title="MBV Studio on Google Maps"
              src={MAPS_EMBED}
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
