import { useState } from 'react';
import { Plus, Phone, MessageCircle } from 'lucide-react';

type Item = { q: string; a: string };

const items: Item[] = [
  {
    q: 'Hoe maak ik een afspraak?',
    a: 'Veronica werkt op afspraak. Bel of stuur een WhatsApp-bericht naar 06 11087951, dan plannen we samen een moment dat jou uitkomt.',
  },
  {
    q: 'Wat is BIAB precies?',
    a: 'BIAB staat voor Builder In A Bottle: een verstevigende gellaag op je eigen nagel. Het beschermt je natuurlijke nagel, laat hem rustig groeien en geeft een verzorgde, natuurlijke look.',
  },
  {
    q: 'Hoe lang blijft mijn set mooi?',
    a: 'Gemiddeld drie tot vier weken, afhankelijk van je nagelgroei en hoe je je handen gebruikt. Daarna kom je terug voor bijwerken of een nieuwe set.',
  },
  {
    q: 'Kan ik een eigen design of nail art krijgen?',
    a: 'Zeker. Veronica schildert designs met de hand, van een subtiel accent tot uitgesproken nail art. Heb je een voorbeeld of idee? Neem het gerust mee, dan kijken we wat past.',
  },
  {
    q: 'Ik heb nu nagels van een andere salon. Kan ik toch komen?',
    a: 'Ja. Veronica verwijdert of werkt je huidige set netjes bij en bouwt daarna jouw nieuwe nagels op. Geef bij het maken van de afspraak even door wat je nu hebt.',
  },
  {
    q: 'Kan ik met pin betalen?',
    a: 'Ja, je kunt met pin, contactloos en creditcard betalen. De studio is daarnaast goed toegankelijk en iedereen is welkom.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 bg-blush-soft/60">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">Veelgestelde vragen</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Goed om te weten</h2>
        </div>

        <div className="space-y-2">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-ink/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg md:text-xl text-ink">{item.q}</span>
                  <Plus
                    size={20}
                    className={`shrink-0 text-ink/60 transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  />
                </button>
                {isOpen && (
                  <p className="pb-5 text-ink/70 leading-relaxed">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-ink/60">Nog een andere vraag? Neem gerust contact op.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a href="tel:+31611087951" className="btn-gold">
              <Phone size={16} />
              Bel 06 11087951
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
