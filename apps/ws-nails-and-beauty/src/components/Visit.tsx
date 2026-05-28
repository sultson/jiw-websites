import { MapPin, Clock, Phone, ExternalLink, TreePine, Calendar } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Visit({ t, onBook }: Props) {
  return (
    <section id="bezoek" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
          <div className="md:col-span-5 order-2 md:order-1">
            <span className="kicker">{t('visit.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('visit.title')}</h2>
            <p className="mt-5 text-plum/70 leading-relaxed">{t('visit.intro')}</p>

            <div className="mt-7 space-y-4">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-plum/50 mb-1">Adres</p>
                  <p className="font-medium text-plum">{t('visit.address')}</p>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Blauwhoefseweg+12,+4416+RC+Kruiningen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm text-rose hover:underline"
                  >
                    {t('visit.directions')} <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-plum/50 mb-1">{t('visit.phone')}</p>
                  <a href="tel:+31616220569" className="font-medium text-plum hover:text-rose">
                    06 16220569
                  </a>
                  <span className="mx-2 text-plum/30">·</span>
                  <a
                    href="https://wa.me/31616220569"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-rose hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-plum/50 mb-1">{t('visit.hours')}</p>
                  <p className="font-medium text-plum">{t('visit.hours')}</p>
                  <p className="text-sm text-plum/60 mt-0.5">{t('visit.hoursSub')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                  <TreePine size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-plum/50 mb-1">Fit & Relax Den Inkel</p>
                  <p className="text-sm text-plum/70 leading-relaxed">{t('visit.tip')}</p>
                </div>
              </div>
            </div>

            <button onClick={onBook} className="btn-rose mt-8">
              <Calendar size={16} />
              {t('visit.book')}
            </button>
          </div>

          <div className="md:col-span-7 order-1 md:order-2 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-plum/5 shadow-[0_18px_40px_-22px_rgba(42,24,32,0.35)]">
              <img
                src="/salon/de-salon.webp"
                alt="De salon — werktafel bij WS Nails & Beauty"
                loading="lazy"
                className="w-full aspect-[4/5] md:aspect-[4/3.2] object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-plum/5 min-h-[280px]">
              <iframe
                title="WS Nails & Beauty op Google Maps"
                src="https://maps.google.com/maps?q=Blauwhoefseweg+12,+4416+RC+Kruiningen&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 280 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
