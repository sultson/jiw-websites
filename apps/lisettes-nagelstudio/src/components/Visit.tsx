import { MapPin, Phone, Clock, ExternalLink, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { site } from '../data/site';

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
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush/40 flex items-center justify-center text-gold">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-espresso/50">{t('visit.kicker')}</p>
                <p className="font-medium text-espresso mt-1">{t('visit.address')}</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Meidoornlaan%2036%2C%203881%20EP%20Putten&destination_place_id=ChIJm3CONWk1xkcRsn6Tll05Nio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-gold hover:underline"
                >
                  {t('visit.directions')} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush/40 flex items-center justify-center text-gold">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-espresso/50">{t('visit.phone')}</p>
                <a href={site.phoneHref} className="font-medium text-espresso mt-1 block hover:text-gold">
                  {site.phoneDisplay}
                </a>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
                <p className="text-xs text-espresso/55 mt-2 italic">{t('visit.phoneNote')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush/40 flex items-center justify-center text-gold">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-2">{t('visit.hours')}</p>
                <p className="text-sm text-espresso/80">{t('visit.hoursLine1')}</p>
                <p className="text-sm text-espresso/60 mt-1">{t('visit.hoursLine2')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush/40 flex items-center justify-center text-gold">
                <Instagram size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-espresso/50">{t('visit.socials')}</p>
                <div className="mt-1 flex items-center gap-4">
                  <a
                    href={site.instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-espresso hover:text-gold"
                  >
                    <Instagram size={14} /> Instagram
                  </a>
                  <a
                    href={site.facebookHref}
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

          <div className="rounded-lg overflow-hidden border border-espresso/5 min-h-[360px] md:min-h-full">
            <iframe
              title="Lisette's Nagelstudio op Google Maps"
              src={site.googleEmbedHref}
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
