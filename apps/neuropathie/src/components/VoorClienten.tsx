import { ArrowRight, Info, Check } from 'lucide-react';
import { klachten } from '../data/content';

export default function VoorClienten() {
  return (
    <section id="clienten" className="section relative overflow-hidden bg-sand">
      <div className="absolute inset-0 wash-rose pointer-events-none" aria-hidden />
      <div className="shell-wide relative grid lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-16 items-start">
        <div>
          <span className="kicker">Voor cliënten</span>
          <h2 className="mt-4 display-lg text-ink">
            Hebt u last van tintelingen, pijn, een branderig gevoel of juist gevoelloosheid in uw
            voeten?
          </h2>

          <ul className="mt-7 flex flex-wrap gap-2.5">
            {klachten.map((k) => (
              <li key={k} className="chip chip-cream !text-[12.5px] !normal-case !tracking-normal">
                <Check size={14} strokeWidth={2.6} className="text-terra" />
                {k}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex items-start gap-3.5 bg-cream border border-terra/25 rounded-2xl px-5 py-4">
            <Info size={19} strokeWidth={2.2} className="mt-0.5 shrink-0 text-terra" />
            <p className="text-[16px] font-semibold leading-relaxed text-ink">
              Bespreek deze klachten altijd eerst met uw arts.
            </p>
          </div>

          <div className="mt-7 space-y-4 text-[16.5px] leading-relaxed text-ink-soft max-w-xl">
            <p>
              Naast de reguliere zorg kan voetreflexologie bij neuropathie als aanvullende behandeling
              worden ingezet. Sommige cliënten ervaren na een behandeling een tijdelijke vermindering
              van hun klachten. De ervaringen verschillen per persoon. Om eventuele positieve effecten
              te ondersteunen, kunnen periodieke behandelingen wenselijk zijn.
            </p>
            <p>
              Voetreflexologie geneest neuropathie niet en herstelt geen beschadigde zenuwen. De
              behandeling is gericht op ontspanning, het ondersteunen van het welzijn en het mogelijk
              verminderen van ervaren klachten.
            </p>
          </div>

          <p className="mt-7 font-display serif-italic text-[22px] sm:text-[25px] leading-snug text-terra-deep max-w-lg">
            Wie weet wat deze behandeling voor u kan betekenen?
          </p>

          <a href="#overzicht" className="btn-terra mt-7">
            Zoek een gespecialiseerde therapeut
            <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>

        <div className="relative max-w-sm mx-auto lg:mx-0 lg:ml-auto">
          <div className="absolute -inset-4 sm:-inset-6 bg-sage-wash blob-a -z-10" aria-hidden />
          <img
            src="/img/beh-vertroetel-voet.webp"
            alt="Een voetreflexbehandeling"
            className="w-full blob-a object-cover aspect-[4/5] shadow-[0_30px_70px_-40px_rgba(58,33,24,0.5)]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
