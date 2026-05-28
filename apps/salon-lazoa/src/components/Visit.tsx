import { MapPin, Phone, Calendar, MessageCircle, ExternalLink } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

const MAPS_DIRECTIONS =
  'https://www.google.com/maps/dir/?api=1&destination=Everbest+64,+5741+PM+Beek+en+Donk';
const MAPS_EMBED =
  'https://maps.google.com/maps?q=Everbest+64,+5741+PM+Beek+en+Donk&t=&z=16&ie=UTF8&iwloc=&output=embed';

export default function Visit({ t, onBook }: Props) {
  return (
    <section id="bezoek" className="py-24 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('visit.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-paper-soft flex items-center justify-center text-champagne ring-1 ring-ink/5">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-mute mb-1">{t('visit.kicker')}</p>
                <p className="font-medium text-ink">{t('visit.address')}</p>
                <a
                  href={MAPS_DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-champagne hover:underline"
                >
                  {t('visit.directions')} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-paper-soft flex items-center justify-center text-champagne ring-1 ring-ink/5">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-mute mb-1">{t('visit.phone')}</p>
                <a href="tel:+31683434002" className="font-medium text-ink hover:text-champagne">
                  06 83434002
                </a>
                <span className="mx-2 text-ink/30">·</span>
                <a
                  href="https://wa.me/31683434002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-champagne hover:underline"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-paper-soft flex items-center justify-center text-champagne ring-1 ring-ink/5">
                <Calendar size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-mute mb-1">{t('visit.hours')}</p>
                <p className="text-sm text-ink/75 leading-relaxed">{t('visit.hoursLine')}</p>
                <button onClick={onBook} className="btn-primary mt-4">
                  {t('visit.book')}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-md overflow-hidden border border-ink/6 min-h-[360px] md:min-h-full">
            <iframe
              title="Salon LaZoa op Google Maps"
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
