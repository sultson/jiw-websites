import { MapPin, Phone, Clock, ExternalLink, Instagram, Facebook } from 'lucide-react';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

const hours: { nl: string; en: string; time: string }[] = [
  { nl: 'Maandag', en: 'Monday', time: '09:00 - 16:30' },
  { nl: 'Dinsdag', en: 'Tuesday', time: '09:00 - 16:00' },
  { nl: 'Woensdag', en: 'Wednesday', time: '09:00 - 16:00' },
  { nl: 'Donderdag', en: 'Thursday', time: '09:00 - 16:30' },
  { nl: 'Vrijdag', en: 'Friday', time: '09:00 - 15:00' },
  { nl: 'Zaterdag', en: 'Saturday', time: '' },
  { nl: 'Zondag', en: 'Sunday', time: '' },
];

export default function Visit({ lang, t }: Props) {
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
                <p className="text-xs uppercase tracking-wider text-espresso/50">{t('visit.addressLabel')}</p>
                <p className="font-medium text-espresso mt-1">{t('visit.address')}</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Nailtique+by+Linn+Molensteen+13+Valburg"
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
                <a href="tel:+31628428339" className="font-medium text-espresso mt-1 block hover:text-gold">
                  06 28428339
                </a>
                <a
                  href="https://wa.me/31628428339"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold hover:underline"
                >
                  WhatsApp
                </a>
                <p className="text-xs text-espresso/55 mt-2 italic">{t('visit.phoneNote')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-2">{t('visit.hours')}</p>
                <ul className="space-y-1">
                  {hours.map(h => (
                    <li key={h.nl} className="flex justify-between gap-4 text-sm">
                      <span className="text-espresso/80">{lang === 'nl' ? h.nl : h.en}</span>
                      <span className={h.time ? 'text-espresso/80' : 'text-espresso/40'}>
                        {h.time || t('visit.closed')}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-espresso/55 mt-3 italic">{t('visit.hoursNote')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Instagram size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-espresso/50">{t('visit.socials')}</p>
                <div className="mt-1 flex items-center gap-4">
                  <a
                    href="https://www.instagram.com/nailtiquebylinn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-espresso hover:text-gold"
                  >
                    <Instagram size={14} /> Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/p/Nailtique-by-Linn-61572992205896/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-espresso hover:text-gold"
                  >
                    <Facebook size={14} /> Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-espresso/5 min-h-[360px] md:min-h-full">
            <iframe
              title="Nailtique by Linn op Google Maps"
              src="https://www.google.com/maps?q=Nailtique+by+Linn+Molensteen+13+Valburg&output=embed"
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
