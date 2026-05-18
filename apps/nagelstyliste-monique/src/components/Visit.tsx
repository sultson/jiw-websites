import { MapPin, Phone, MessageCircle, CalendarClock, ExternalLink } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Visit({ t }: Props) {
  return (
    <section id="bezoek" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 max-w-xl mx-auto">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('visit.title')}</h2>
          <p className="mt-4 text-ink/65 text-sm leading-relaxed">{t('visit.intro')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-6 md:p-8 flex flex-col">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-pink">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.addressLabel')}</p>
                  <p className="font-medium text-ink">{t('visit.address')}</p>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Eeneind+42,+5674+VP+Nuenen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm text-pink hover:underline"
                  >
                    {t('visit.directions')} <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-pink">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.phoneLabel')}</p>
                  <a href="tel:+31631674344" className="font-medium text-ink hover:text-pink">
                    06 31674344
                  </a>
                  <span className="mx-2 text-ink/30">·</span>
                  <a
                    href="https://wa.me/31631674344"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-pink hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-pink">
                  <CalendarClock size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.hoursLabel')}</p>
                  <p className="font-medium text-ink">{t('visit.hours')}</p>
                  <p className="text-sm text-ink/55 mt-0.5">{t('visit.hoursSub')}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-ink/8 flex flex-wrap gap-3">
              <a href="tel:+31631674344" className="btn-pink">
                <Phone size={16} />
                {t('visit.ctaCall')}
              </a>
              <a
                href="https://wa.me/31631674344"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle size={16} />
                {t('visit.ctaWa')}
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-ink/5 min-h-[340px] md:min-h-full">
            <iframe
              title="Nagelstyliste Monique op Google Maps"
              src="https://maps.google.com/maps?q=Eeneind+42,+5674+VP+Nuenen&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 340 }}
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
