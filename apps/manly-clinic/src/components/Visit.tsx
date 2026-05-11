import { ExternalLink, MapPin } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

const directionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Orveltestraat+30,+2545+KG+Den+Haag';

export default function Visit({ t, onBook }: Props) {
  return (
    <section id="locatie" className="section-pad-lg">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 md:mb-16">
          <div className="lg:col-span-7">
            <span className="roman">VI.</span>
            <span className="kicker block mt-3">{t('visit.kicker')}</span>
            <h2 className="mt-5 text-[36px] md:text-[52px] leading-[1.02]">
              {t('visit.title')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-10">
            <div>
              <div className="flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-ink-mute">
                <MapPin size={14} strokeWidth={1.6} />
                {t('visit.kicker')}
              </div>
              <p className="mt-3 font-display text-[22px] md:text-[26px] leading-tight text-ink">
                {t('visit.address')}
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="link mt-3 text-sm"
              >
                {t('visit.route')}
                <ExternalLink size={12} className="inline ml-1.5 -mt-0.5" />
              </a>
            </div>

            <div className="rule" />

            <div>
              <p className="text-[11px] tracking-[0.28em] uppercase text-ink-mute">
                {t('visit.hours.title')}
              </p>
              <p className="mt-3 text-base text-ink leading-relaxed">
                {t('visit.hours.note')}
              </p>
            </div>

            <button type="button" onClick={onBook} className="btn-copper">
              {t('nav.book')}
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-[4/3] lg:aspect-[5/4] overflow-hidden bg-paper-deep">
              <iframe
                title="Manly Clinic op Google Maps"
                src="https://maps.google.com/maps?q=Orveltestraat+30,+2545+KG+Den+Haag&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="border-0 grayscale-[0.4] contrast-[0.95]"
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
