import { MapPin, Clock, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { hours, formatHoursShort } from '../data/hours';

type Props = { t: (k: string) => string };

const PHONE_TEL = 'tel:+31648490004';
const PHONE_WA  = 'https://wa.me/31648490004';
const DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Menno+van+Coehoornweg+15,+8563+AD+Wijckel';
const EMBED_URL =
  'https://maps.google.com/maps?q=Menno+van+Coehoornweg+15,+8563+AD+Wijckel&t=&z=16&output=embed';

export default function Visit({ t }: Props) {
  const today = new Date().getDay();

  return (
    <section id="bezoek" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('visit.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-sand flex items-center justify-center text-teal">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">
                  Adres
                </p>
                <p className="font-medium text-ink">{t('visit.address')}</p>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-teal hover:underline"
                >
                  {t('visit.directions')} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-sand flex items-center justify-center text-teal">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">
                  {t('visit.phone')}
                </p>
                <a href={PHONE_TEL} className="font-medium text-ink hover:text-teal">
                  06 48490004
                </a>
                <span className="mx-2 text-ink/30">·</span>
                <a
                  href={PHONE_WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal hover:underline inline-flex items-center gap-1"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-sand flex items-center justify-center text-teal">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-2">
                  {t('visit.hours')}
                </p>
                <ul className="space-y-1 text-sm">
                  {hours.map(h => (
                    <li
                      key={h.dayIndex}
                      className={`flex justify-between gap-4 ${
                        h.dayIndex === today
                          ? 'font-semibold text-ink'
                          : 'text-ink/70'
                      }`}
                    >
                      <span>{h.nl}</span>
                      <span className="tabular-nums">{formatHoursShort(h)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-ink/60 leading-relaxed">
                  {t('visit.note')}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-ink/5 min-h-[360px] md:min-h-full bg-sand-soft">
            <iframe
              title="Pedicurepraktijk FootCare+ op Google Maps"
              src={EMBED_URL}
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
