import { MapPin, Clock, Phone, Mail, ExternalLink, MessageCircle } from 'lucide-react';
import { hours, formatHoursShort } from '../data/hours';
import { site } from '../data/site';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

export default function Visit({ lang, t }: Props) {
  const today = new Date().getDay();
  const dayName = (h: { nl: string; en: string }) => (lang === 'en' ? h.en : h.nl);
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t('wa.text'))}`;

  return (
    <section id="bezoek" className="py-20 md:py-28 bg-blush-soft/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('visit.title')}</h2>
          <p className="mt-3 text-sm text-ink/55">{t('visit.byAppt')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-plum">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.kicker')}</p>
                <p className="font-medium text-ink">{site.address}</p>
                <p className="text-xs text-ink/55 mt-1">{t('visit.parking')}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${site.addressQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-plum hover:underline"
                >
                  {t('visit.directions')} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-plum">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.phoneLabel')}</p>
                <a href={`tel:${site.phoneE164}`} className="font-medium text-ink hover:text-plum">
                  {site.phoneDisplay}
                </a>
                <span className="mx-2 text-ink/30">·</span>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-plum hover:underline"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-plum">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.emailLabel')}</p>
                <a href={`mailto:${site.email}`} className="font-medium text-ink hover:text-plum break-all">
                  {site.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-plum">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-2">{t('visit.hoursLabel')}</p>
                <ul className="space-y-1 text-sm">
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
          </div>

          <div className="rounded-2xl overflow-hidden border border-ink/5 min-h-[360px] md:min-h-full">
            <iframe
              title="Skin & feet care by Kelly op Google Maps"
              src={`https://maps.google.com/maps?q=${site.addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
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
