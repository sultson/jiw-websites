import { Sparkles, Gem, Layers, Hand, Palette, Flower2, Phone, MessageCircle } from 'lucide-react';
import { services } from '../data/services';

const iconMap = {
  sparkles: Sparkles,
  gem:      Gem,
  layers:   Layers,
  hand:     Hand,
  palette:  Palette,
  flower:   Flower2,
};

export default function Services() {
  return (
    <section id="behandelingen" className="py-20 md:py-28 bg-blush-soft/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">Behandelingen</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Wat Veronica voor je doet</h2>
          <p className="mt-4 text-ink/60 text-sm max-w-lg mx-auto">
            Van een verzorgde basis tot uitgesproken nail art. Niet zeker wat bij je past?
            Veronica adviseert je graag.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.map(s => {
            const Icon = iconMap[s.icon];
            return (
              <article key={s.id} className="card p-6 md:p-7 flex flex-col">
                <div className="w-11 h-11 rounded-full bg-blush flex items-center justify-center text-gold">
                  <Icon size={19} />
                </div>
                <h3 className="mt-4 font-serif text-xl md:text-2xl text-ink">{s.name}</h3>
                <p className="mt-2 text-sm text-ink/65 leading-relaxed flex-1">{s.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium bg-blush text-ink/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 card p-6 md:p-7 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          <div className="flex-1">
            <h3 className="font-serif text-xl text-ink">Tarieven en mogelijkheden</h3>
            <p className="mt-1.5 text-sm text-ink/65 leading-relaxed">
              De prijs hangt af van de behandeling, de lengte en het design. Bel of app Veronica
              voor de actuele tarieven en om je afspraak in te plannen.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a href="tel:+31611087951" className="btn-gold">
              <Phone size={16} />
              Bel direct
            </a>
            <a
              href="https://wa.me/31611087951"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
