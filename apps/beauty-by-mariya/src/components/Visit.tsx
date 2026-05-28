import { MapPin, Clock, Phone, Languages, ExternalLink, MessageCircle, Calendar } from 'lucide-react';
import { hours, formatHoursShort } from '../data/hours';
import { contact } from '../data/contact';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string; onBook: () => void };

const closedLabel: Record<Lang, string> = {
  nl: 'Gesloten',
  en: 'Closed',
  ua: 'Зачинено',
};

export default function Visit({ lang, t, onBook }: Props) {
  const today = new Date().getDay();

  function dayName(h: { nl: string; en: string; ua: string }) {
    if (lang === 'en') return h.en;
    if (lang === 'ua') return h.ua;
    return h.nl;
  }

  return (
    <section id="bezoek" className="py-20 md:py-28 bg-blush-soft/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('visit.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('visit.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.kicker')}</p>
                <p className="font-medium text-ink">{t('visit.address')}</p>
                <a
                  href={contact.directionsUrl}
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
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.phone')}</p>
                <a href={contact.phoneTel} className="font-medium text-ink hover:text-rose">
                  {contact.phoneDisplay}
                </a>
                <span className="mx-2 text-ink/30">·</span>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-rose hover:underline"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                <Languages size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.langs')}</p>
                <p className="font-medium text-ink">{t('visit.langsList')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">{t('visit.hours')}</p>
                <p className="text-xs text-ink/55 mb-3">{t('visit.hoursSub')}</p>
                <ul className="space-y-1 text-sm">
                  {hours.map(h => (
                    <li
                      key={h.dayIndex}
                      className={`flex justify-between gap-4 ${
                        h.dayIndex === today ? 'font-semibold text-ink' : 'text-ink/70'
                      }`}
                    >
                      <span>{dayName(h)}</span>
                      <span className="tabular-nums">{formatHoursShort(h, closedLabel[lang])}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button onClick={onBook} className="btn-rose w-full md:w-auto">
              <Calendar size={16} />
              {t('visit.book')}
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden border border-ink/5 min-h-[420px] md:min-h-full">
            <iframe
              title="Beauty by Mariya op Google Maps"
              src={contact.mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 420 }}
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
