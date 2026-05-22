import { MapPin, Phone, Mail, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string; onBook: () => void };

export default function Visit({ lang, t, onBook }: Props) {
  return (
    <section id="bezoek" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('visit.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-bone flex items-center justify-center text-ink">
                <MapPin size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.kicker')}</p>
                <p className="font-medium text-ink">{t('visit.address')}</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Verlengde+Spiegelmakerstraat+8,+2645+LT+Delfgauw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-ink hover:underline"
                >
                  {t('visit.directions')} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-bone flex items-center justify-center text-ink">
                <Phone size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.phone')}</p>
                <a href="tel:+31613372711" className="font-medium text-ink hover:text-bark">
                  06 13 37 27 11
                </a>
                <span className="mx-2 text-ink/30">·</span>
                <a
                  href="https://wa.me/31613372711"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink hover:underline"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-bone flex items-center justify-center text-ink">
                <Mail size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.email')}</p>
                <a href="mailto:info@clinic22.nl" className="font-medium text-ink hover:text-bark">
                  info@clinic22.nl
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-bone flex items-center justify-center text-ink">
                <Calendar size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.hours')}</p>
                <p className="font-medium text-ink">{t('visit.appointmentOnly')}</p>
                <p className="text-sm text-ink/60 mt-1">
                  {lang === 'en'
                    ? 'Available times via Salonized, 24/7.'
                    : 'Bekijk alle beschikbare tijden via Salonized, 24/7.'}
                </p>
                <button
                  onClick={onBook}
                  className="inline-flex items-center gap-1 mt-3 text-sm text-ink hover:underline"
                >
                  {t('visit.book')} <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-ink/5 min-h-[360px] md:min-h-full">
            <iframe
              title="Clinic 22 Huidtherapie op Google Maps"
              src="https://maps.google.com/maps?q=Verlengde+Spiegelmakerstraat+8,+2645+LT+Delfgauw&t=&z=16&ie=UTF8&iwloc=&output=embed"
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
