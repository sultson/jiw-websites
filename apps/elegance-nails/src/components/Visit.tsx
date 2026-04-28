import { MapPin, Phone, Clock, ExternalLink, MessageCircle, Instagram } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Visit({ t }: Props) {
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
                  href="https://www.google.com/maps/dir/?api=1&destination=Laan+door+Hoevelaar+44,+3931+GK+Woudenberg"
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
                <a href="tel:+31682813832" className="font-medium text-espresso hover:text-gold">
                  06 82813832
                </a>
                <span className="mx-2 text-espresso/30">·</span>
                <a
                  href="https://wa.me/31682813832"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold hover:underline"
                >
                  WhatsApp
                </a>
                <p className="mt-1 text-xs text-espresso/55">{t('visit.phoneNote')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-1">{t('visit.hours')}</p>
                <p className="font-medium text-espresso">{t('visit.hoursValue')}</p>
                <p className="mt-1 text-xs text-espresso/55 leading-relaxed">{t('visit.hoursNote')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Instagram size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-1">{t('visit.socials')}</p>
                <a
                  href="https://www.instagram.com/elegancenailsstudio_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-espresso hover:text-gold"
                >
                  @elegancenailsstudio_
                </a>
                <p className="mt-1 text-xs text-espresso/55">{t('visit.dm')}</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/31682813832"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                <MessageCircle size={16} />
                {t('visit.book')}
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-espresso/5 min-h-[360px] md:min-h-full">
            <iframe
              title="Elégance Nails op Google Maps"
              src="https://maps.google.com/maps?q=Laan+door+Hoevelaar+44,+3931+GK+Woudenberg&t=&z=16&ie=UTF8&iwloc=&output=embed"
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
