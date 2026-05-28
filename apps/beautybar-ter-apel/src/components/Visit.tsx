import { MapPin, Phone, Clock, ExternalLink, Facebook, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Visit({ t }: Props) {
  return (
    <section id="bezoek" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('visit.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-6 md:p-8 space-y-6 bg-white/80">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50">{t('visit.kicker')}</p>
                <p className="font-medium text-ink mt-1">{t('visit.address')}</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Zanglijster+15+Ter+Apel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-rose hover:underline"
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
                <p className="text-xs uppercase tracking-wider text-ink/50">{t('visit.phone')}</p>
                <a href="tel:+31623800854" className="font-medium text-ink mt-1 block hover:text-rose">
                  06 23800854
                </a>
                <a
                  href="https://wa.me/31623800854"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-rose hover:underline"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <p className="text-xs text-ink/55 mt-2 italic">{t('visit.phoneNote')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-2">{t('visit.hours')}</p>
                <p className="text-sm text-ink/80">{t('visit.hoursLine1')}</p>
                <p className="text-sm text-ink/60 mt-1">{t('visit.hoursLine2')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                <Facebook size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50">{t('visit.socials')}</p>
                <a
                  href="https://www.facebook.com/people/BeautyBar-Ter-Apel/61552088251660/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-1 text-sm text-ink hover:text-rose"
                >
                  <Facebook size={14} /> Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-ink/5 min-h-[360px] md:min-h-full">
            <iframe
              title="Beautybar Ter Apel op Google Maps"
              src="https://www.google.com/maps?q=Beautybar+Ter+Apel+Zanglijster+15&output=embed"
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
