import { ShieldCheck, MapPin, Clock, Award } from 'lucide-react';
import { site } from '../data/site';

const items = [
  {
    icon: ShieldCheck,
    title: 'VCA-gecertificeerd',
    text: 'Werk volgens Nederlandse bouw- en veiligheidsnormen. Lid van NOA en Neerlandsch Stucgilde.',
  },
  {
    icon: Award,
    title: 'Met garantie',
    text: 'Op elk project. Strak afgewerkt, schoon opgeleverd, zonder opleverpunten.',
  },
  {
    icon: MapPin,
    title: 'Rotterdam + 100 km',
    text: 'Werkzaam in Rotterdam en de hele regio. Ook in Den Haag, Dordrecht, Utrecht en omgeving.',
  },
  {
    icon: Clock,
    title: 'Snelle reactie',
    text: 'Bel of mail. Burhan plant binnen 24 uur een inmeting in.',
  },
];

export default function About() {
  return (
    <section id="over" className="relative bg-bbn-ink py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-bbn-red">
              Over BBN Totaalbouw
            </p>
            <h2 className="headline text-4xl text-white sm:text-5xl lg:text-6xl">
              Vakwerk uit Rotterdam.
            </h2>
            <p className="mt-5 text-lg text-zinc-300">
              {site.yearsExperience} jaar ervaring. {site.teamSize} vaste vakmensen. Eén
              aanspreekpunt: {site.ownerName}.
            </p>
            <p className="mt-4 text-base text-zinc-400">
              Wij staan voor strak, professioneel en duurzaam vakwerk. Kwalitatieve materialen,
              gladde afwerking, nette oplevering. Klanttevredenheid op nummer één.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {site.certifications.map(c => (
                <span
                  key={c}
                  className="rounded-md border border-bbn-line bg-bbn-ash px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-xl border border-bbn-line bg-bbn-ash p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bbn-red/15 text-bbn-red">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold uppercase tracking-wide text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
