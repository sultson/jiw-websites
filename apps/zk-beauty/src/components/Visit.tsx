import { MapPin, Clock, Phone, ExternalLink, MessageCircle, ArrowUpRight } from 'lucide-react';
import { hours, formatHoursShort } from '../data/hours';
import { contact } from '../data/contact';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

export default function Visit({ lang, t }: Props) {
  const today = new Date().getDay();

  function dayName(h: { nl: string; en: string }) {
    return lang === 'en' ? h.en : h.nl;
  }

  return (
    <section id="bezoek" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="gold-rule">{t('visit.kicker')}</span>
          <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            {t('visit.title')}
          </h2>
          <p className="mt-5 text-ink-mute">{t('visit.note')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-7 md:p-10 space-y-7">
            <div className="flex gap-4">
              <div className="shrink-0 w-11 h-11 rounded-full bg-sand-soft flex items-center justify-center text-gold-deep">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-mute mb-1">{t('visit.kicker')}</p>
                <p className="font-medium text-ink">{t('visit.address')}</p>
                <a
                  href={contact.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-gold-deep hover:underline"
                >
                  {t('visit.directions')} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-11 h-11 rounded-full bg-sand-soft flex items-center justify-center text-gold-deep">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-mute mb-1">{t('visit.phone')}</p>
                <a href={`tel:${contact.phoneTel}`} className="font-medium text-ink hover:text-gold-deep">
                  {contact.phoneDisp}
                </a>
                <span className="mx-2 text-ink/25">·</span>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold-deep hover:underline inline-flex items-center gap-1"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-11 h-11 rounded-full bg-sand-soft flex items-center justify-center text-gold-deep">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-mute mb-3">{t('visit.hours')}</p>
                <ul className="space-y-1.5 text-sm">
                  {hours.map(h => (
                    <li
                      key={h.dayIndex}
                      className={`flex justify-between gap-4 ${
                        h.dayIndex === today ? 'font-semibold text-ink' : 'text-ink/70'
                      }`}
                    >
                      <span>{dayName(h)}</span>
                      <span className="tabular-nums">{formatHoursShort(h)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={contact.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
            >
              {t('visit.book')}
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-ink/8 min-h-[360px] md:min-h-full bg-ink/5">
            <iframe
              title="ZK Beauty op Google Maps"
              src={contact.mapsEmbed}
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
