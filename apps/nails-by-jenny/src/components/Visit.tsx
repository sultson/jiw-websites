import { MapPin, Clock, Phone, Mail, ExternalLink } from 'lucide-react';
import {
  ADDRESS_LINE,
  ADDRESS_CITY,
  EMAIL,
  MAPS_DIRECTIONS_URL,
  MAPS_EMBED_URL,
  PHONE_DISPLAY,
  TEL_URL,
  WA_URL,
} from '../data/contact';

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
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-1">{t('visit.addressLabel')}</p>
                <p className="font-medium text-espresso">{ADDRESS_LINE}, {ADDRESS_CITY}</p>
                <a
                  href={MAPS_DIRECTIONS_URL}
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
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-1">{t('visit.phoneLabel')}</p>
                <a href={TEL_URL} className="font-medium text-espresso hover:text-gold">
                  {PHONE_DISPLAY}
                </a>
                <span className="mx-2 text-espresso/30">·</span>
                <a
                  href={WA_URL}
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
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-1">{t('visit.emailLabel')}</p>
                <a href={`mailto:${EMAIL}`} className="font-medium text-espresso hover:text-gold break-all">
                  {EMAIL}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-espresso/50 mb-1">{t('visit.hoursLabel')}</p>
                <p className="font-medium text-espresso">{t('visit.hoursLine')}</p>
                <p className="mt-2 text-sm text-espresso/70 leading-relaxed">{t('visit.explainer')}</p>
              </div>
            </div>

            <div className="border-t border-espresso/10 pt-5 space-y-1.5">
              <p className="text-sm text-espresso/70">{t('visit.practical')}</p>
              <p className="text-xs text-espresso/55 leading-relaxed">{t('visit.access')}</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-espresso/5 min-h-[360px] md:min-h-full">
            <iframe
              title={t('visit.mapTitle')}
              src={MAPS_EMBED_URL}
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
