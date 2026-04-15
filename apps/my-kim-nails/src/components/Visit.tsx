import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { hours, formatHoursShort } from '../data/hours';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

export default function Visit({ lang, t }: Props) {
  const today = new Date().getDay();

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
                <p className="text-xs uppercase tracking-wider text-espresso/50">{t('visit.kicker')}</p>
                <p className="font-medium text-espresso mt-1">{t('visit.address')}</p>
                <p className="text-sm text-espresso/60 mt-1">{t('visit.parking')}</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Zwanenveld+9040,+6538+SB+Nijmegen"
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
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-espresso/50">{t('visit.phone')}</p>
                <a href="tel:+31634899263" className="font-medium text-espresso mt-1 block hover:text-gold">
                  06 34899263
                </a>
                <a
                  href="https://wa.me/31634899263"
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
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-espresso/50">{t('visit.email')}</p>
                <a
                  href="mailto:Mykimbeautynailz@hotmail.com"
                  className="font-medium text-espresso mt-1 block hover:text-gold break-all"
                >
                  Mykimbeautynailz@hotmail.com
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
                      className={`flex justify-between gap-4 ${h.dayIndex === today ? 'font-semibold text-espresso' : 'text-espresso/75'}`}
                    >
                      <span>{lang === 'nl' ? h.nl : h.en}</span>
                      <span className="tabular-nums">{formatHoursShort(h)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-espresso/5 min-h-[360px] md:min-h-full">
            <iframe
              title="Mykimnails op Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3368.3198663895387!2d5.793585927588823!3d51.82294477485353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c7079efde349b3%3A0x66d3031b3edc53dd!2sMykimnails%20Dukenburg!5e1!3m2!1sen!2snl!4v1776016070966!5m2!1sen!2snl"
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
