import { ArrowRight, MapPin, Stethoscope, Users } from 'lucide-react';

const feiten = [
  { icon: Stethoscope, label: 'Aanvullend op de reguliere zorg' },
  { icon: Users, label: 'Speciaal opgeleide voetreflextherapeuten' },
  { icon: MapPin, label: 'Een landelijk netwerk in opbouw' },
];

/**
 * Informatiesite, geen praktijksite: vlak warm donkerbruin, geen sfeerfoto.
 * De twee wegen (cliënt zoekt therapeut / therapeut sluit zich aan) staan hier naast elkaar.
 */
export default function Hero() {
  return (
    <section id="top" className="relative bg-terra-ink">
      <div className="shell-wide relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
        <div className="py-16 sm:py-20 lg:py-24">
          <span className="kicker kicker-light">Informatie en therapeutenoverzicht</span>
          <h1 className="mt-5 display-xl text-white">
            Voetreflexologie bij <span className="text-rose">neuropathie</span>
          </h1>
          <p className="mt-6 text-[19px] leading-relaxed text-cream/75 max-w-2xl">
            Algemene informatie over neuropathie en over wat deze aanvullende behandeling wel en niet
            doet. Plus het overzicht van voetreflextherapeuten die speciaal zijn opgeleid om haar te
            geven.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a href="#overzicht" className="btn-terra !bg-rose !text-terra-ink hover:!bg-white">
              Een therapeut vinden
              <ArrowRight size={17} strokeWidth={2.5} />
            </a>
            <a href="#therapeuten" className="btn-ghost-light">
              Aansluiten als therapeut
            </a>
          </div>
        </div>

        <div className="pb-14 lg:py-24">
          <div className="bg-cream/[0.06] border border-cream/15 rounded-xl p-6 sm:p-7">
            <span className="chip bg-white/10 text-rose-soft">Het overzicht</span>
            <h2 className="mt-5 display-md text-white">Een landelijke verzamelplaats</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-cream/70">
              Voetreflextherapeuten die de specialisatie hebben gevolgd, komen hier per plaats te
              staan. Zo vindt u een behandeling in uw eigen omgeving.
            </p>
            <a
              href="#overzicht"
              className="mt-6 inline-flex items-center gap-1.5 font-semibold text-rose hover:text-white transition-colors"
            >
              Naar het overzicht
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/12">
        <ul className="shell-wide py-5 grid gap-3 sm:grid-cols-3">
          {feiten.map((f) => (
            <li key={f.label} className="flex items-center gap-3 text-[15px] text-cream/70">
              <f.icon size={18} strokeWidth={2} className="shrink-0 text-rose" />
              {f.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
