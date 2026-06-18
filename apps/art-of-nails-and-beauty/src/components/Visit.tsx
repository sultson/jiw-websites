import { MapPin, Clock, Car, CalendarClock, ArrowUpRight } from 'lucide-react';
import { site, hours } from '../data/site';

type Props = { t: (k: string) => string };

export default function Visit({ t }: Props) {
  return (
    <section id="visit" className="scroll-mt-20 bg-petal/50 border-y border-wine/8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="max-w-2xl reveal">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('visit.title')}</h2>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Info */}
          <div className="reveal grid sm:grid-cols-2 gap-5 content-start">
            <div className="card-gloss p-6 sm:col-span-2">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-wine shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-ink-faint">{t('visit.addressLabel')}</h3>
                  <p className="mt-1 font-serif text-xl text-ink">{site.street}</p>
                  <p className="text-ink-soft">{site.postalCode} {site.city}</p>
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-wine hover:gap-2.5 transition-all"
                  >
                    {t('visit.route')}
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </div>

            <div className="card-gloss p-6 sm:col-span-2">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-wine shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs uppercase tracking-wider text-ink-faint">{t('visit.hoursLabel')}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {hours.map((h) => (
                      <li key={h.key} className="flex items-center justify-between text-sm">
                        <span className="text-ink-soft">{t(h.key)}</span>
                        <span className={h.value ? 'text-ink font-medium' : 'text-ink-faint'}>
                          {h.value ?? t('visit.closed')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-gloss p-6">
              <Car size={20} className="text-wine" />
              <h3 className="mt-3 text-xs uppercase tracking-wider text-ink-faint">{t('visit.parkingLabel')}</h3>
              <p className="mt-1 text-sm text-ink-soft leading-relaxed">{t('visit.parking')}</p>
            </div>
            <div className="card-gloss p-6">
              <CalendarClock size={20} className="text-wine" />
              <h3 className="mt-3 text-xs uppercase tracking-wider text-ink-faint">{t('visit.apptLabel')}</h3>
              <p className="mt-1 text-sm text-ink-soft leading-relaxed">{t('visit.appt')}</p>
            </div>
          </div>

          {/* Map */}
          <div className="reveal">
            <div className="card-gloss p-2.5 h-full min-h-[360px]">
              <iframe
                src={site.mapsEmbed}
                title={`${site.name} op de kaart`}
                className="w-full h-full min-h-[340px] rounded-[1.1rem] border-0"
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
