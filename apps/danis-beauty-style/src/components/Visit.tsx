import { MapPin, Phone, MessageCircle, Clock, Navigation } from 'lucide-react';
import { business, openingHours } from '../data/contact';

type Props = { t: (k: string) => string };

export default function Visit({ t }: Props) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.address.street}, ${business.address.postal} ${business.address.city}`,
  )}`;

  return (
    <section id="visit" className="section bg-ink-2 border-y border-line">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          <div className="md:col-span-5">
            <span className="kicker">{t('visit.kicker')}</span>
            <h2 className="mt-5 text-4xl md:text-5xl font-serif text-bone">
              {t('visit.title')}
            </h2>

            <p className="mt-5 text-bone-soft text-base leading-relaxed">
              {t('visit.note')}
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-ink">
                  <MapPin size={16} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-mute">Adres</p>
                  <p className="text-bone mt-1 whitespace-pre-line">{t('visit.address')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-ink">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-mute">Telefoon</p>
                  <a href={business.phone.href} className="text-bone mt-1 inline-block hover:text-gold-bright">
                    {business.phone.display}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-ink">
                  <Clock size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-mute">{t('visit.hours')}</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {openingHours.map(row => (
                      <li key={row.dayKey} className="flex justify-between gap-4">
                        <span className="text-bone-soft capitalize">{t(row.dayKey)}</span>
                        <span className={row.closed ? 'text-mute' : 'text-bone'}>
                          {row.closed ? t('visit.closed') : row.openText}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={business.phone.wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
              >
                <MessageCircle size={16} aria-hidden="true" />
                {t('visit.book')}
              </a>
              <a href={business.phone.href} className="btn btn-outline">
                <Phone size={16} aria-hidden="true" />
                {t('visit.call')}
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <Navigation size={16} aria-hidden="true" />
                {t('visit.dir')}
              </a>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="relative aspect-[4/3] md:aspect-[5/4] rounded-2xl overflow-hidden border border-line bg-ink-3">
              <iframe
                title="Locatie Dani's beauty style"
                src={`https://www.google.com/maps?q=${business.address.lat},${business.address.lng}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                style={{ filter: 'invert(0.92) hue-rotate(180deg) brightness(0.95) contrast(0.95)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
