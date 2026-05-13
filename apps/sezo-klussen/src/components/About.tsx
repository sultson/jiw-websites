import { ShieldCheck, MapPin, Clock, Award } from 'lucide-react';
import { site } from '../data/site';

const items = [
  {
    icon: ShieldCheck,
    title: 'Geverifieerd',
    body: `${site.rating} sterren op ${site.reviewSource}, KvK-ingeschreven en sinds 2019 actief in Rotterdam.`,
  },
  {
    icon: Award,
    title: 'Met garantie',
    body: 'Op elk project. Strak afgewerkt en schoon opgeleverd. Klanten halen ons terug voor de volgende klus.',
  },
  {
    icon: MapPin,
    title: 'Rotterdam en omgeving',
    body: 'Werkzaam in Rotterdam, Bergschenhoek, Capelle, Schiedam, Vlaardingen en de hele regio.',
  },
  {
    icon: Clock,
    title: 'Snelle reactie',
    body: `Bel of WhatsApp. ${site.ownerName} reageert dezelfde dag en plant snel een inmeting in.`,
  },
];

export default function About() {
  return (
    <section id="over" className="section bg-bone-soft">
      <div className="container-page">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <span className="eyebrow">Over Sezo Klussen</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-ink">
              Vakwerk uit Rotterdam.
            </h2>

            <div className="mt-8 space-y-5 text-stone text-base md:text-lg leading-relaxed">
              <p>
                Sinds 2019 actief. Gespecialiseerd in stucwerk, schilderwerk, tegelwerk en
                renovaties. Eén aanspreekpunt: {site.ownerName}.
              </p>
              <p>
                Wij werken voor particulieren en bedrijven, van een kleine opknapbeurt tot een
                complete badkamerrenovatie. Strakke afwerking, duidelijke afspraken en een nette
                oplevering. Klanttevredenheid voorop.
              </p>
              <p>
                Bel of stuur een WhatsApp voor een vrijblijvend gesprek. We komen graag langs
                voor een inmeting en geven dan een eerlijke prijs.
              </p>
            </div>

            <p className="mt-8 font-display italic text-lg text-ink">{site.ownerName}</p>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -top-4 -right-4 w-32 h-32 rounded-2xl bg-gold hidden md:block"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-6 -right-6 w-2/3 h-2/3 rounded-2xl bg-ink hidden md:block"
            />

            <div className="relative flex items-center justify-center rounded-2xl bg-paper border border-line p-10 md:p-14 aspect-[4/5] shadow-[0_20px_60px_-20px_rgba(20,24,29,0.35)]">
              <img
                src="/sezo-logo-full.png"
                alt="Sezo Kluusenbedrijf — stucwerk, tegelzet, verf en renovatie"
                className="w-full max-w-sm h-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="absolute -bottom-6 -left-4 md:-left-8 bg-ink text-bone rounded-2xl p-5 shadow-xl max-w-[240px]">
              <p className="font-display text-xl leading-tight">{site.yearsActive}+ jaar ervaring</p>
              <p className="mt-2 text-sm text-bone/80">Stuc · Tegel · Renovatie</p>
              <p className="mt-1 text-sm text-gold font-medium">KvK {site.kvk}</p>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {items.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-3 p-6 rounded-2xl border border-line bg-bone"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <h3 className="font-display text-xl text-ink leading-tight">{title}</h3>
              <p className="text-stone text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
