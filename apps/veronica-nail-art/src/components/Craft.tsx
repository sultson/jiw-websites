import { Phone, Check } from 'lucide-react';

const points = [
  'Eerst kijken naar je eigen nagel en wat past, dan pas aan de slag',
  'Een strakke, dunne opbouw die comfortabel zit en niet afknapt',
  'Designs met de hand geschilderd, afgestemd op jouw stijl',
  'Netjes en hygiënisch werken, elke afspraak opnieuw',
];

export default function Craft() {
  return (
    <section id="vakwerk" className="relative py-20 md:py-28 bg-ink text-cream overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <img src="/salon.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-gold-soft font-semibold">
              Het vak
            </span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-cream leading-[1.1]">
              Elke set is handwerk.
            </h2>
            <p className="mt-6 text-cream/75 leading-relaxed">
              Mooie nagels zijn meer dan een kleurtje. Het zit in de opbouw, de vorm en de
              afwerking. Veronica werkt rustig en nauwkeurig, zodat je set er niet alleen mooi
              uitziet, maar ook fijn zit en lang mooi blijft.
            </p>

            <ul className="mt-8 space-y-3">
              {points.map(p => (
                <li key={p} className="flex items-start gap-3 text-cream/85 text-sm leading-relaxed">
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-gold/20 border border-gold/35 flex items-center justify-center">
                    <Check size={11} className="text-gold-soft" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <a href="tel:+31611087951" className="mt-10 btn-gold">
              <Phone size={16} />
              Bel voor een afspraak
            </a>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-ink-soft shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              <img
                src="/gallery-2.webp"
                alt="Handgeschilderde nail art door Veronica Nail Art"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-44 h-44 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-mauve/15 blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
