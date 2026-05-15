import { MapPin, Clock, Phone, MessageCircle, ExternalLink, Info } from 'lucide-react';
import { hours, formatHoursShort } from '../data/hours';

export default function Visit() {
  const today = new Date().getDay();

  return (
    <section id="bezoek" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">Bezoek de studio</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Kom langs in Emmeloord</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">Adres</p>
                <p className="font-medium text-ink">Boelenshage 12, 8302 TJ Emmeloord</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Boelenshage+12,+8302+TJ+Emmeloord"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-gold hover:underline"
                >
                  Route plannen <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1">Bel of app</p>
                <a href="tel:+31611087951" className="font-medium text-ink hover:text-gold transition-colors">
                  06 11087951
                </a>
                <span className="mx-2 text-ink/30">·</span>
                <a
                  href="https://wa.me/31611087951"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Clock size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-ink/50 mb-2">Openingstijden</p>
                <ul className="space-y-1 text-sm">
                  {hours.map(h => (
                    <li
                      key={h.dayIndex}
                      className={`flex justify-between gap-4 ${
                        h.dayIndex === today ? 'font-semibold text-ink' : 'text-ink/70'
                      }`}
                    >
                      <span>{h.nl}</span>
                      <span className="tabular-nums">{formatHoursShort(h)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 items-start rounded-xl bg-blush/70 p-4">
              <Info size={16} className="shrink-0 mt-0.5 text-gold" />
              <p className="text-sm text-ink/70 leading-relaxed">
                Werken op afspraak. Bel of app even, dan plannen we samen een moment dat jou uitkomt.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-ink/5 min-h-[360px] md:min-h-full">
            <iframe
              title="Veronica Nail Art op Google Maps"
              src="https://maps.google.com/maps?q=Boelenshage+12,+8302+TJ+Emmeloord&t=&z=16&ie=UTF8&iwloc=&output=embed"
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
