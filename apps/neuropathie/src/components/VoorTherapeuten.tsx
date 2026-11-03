import { ArrowUpRight, Check } from 'lucide-react';
import { leerdoelen } from '../data/content';
import { SITE } from '../lib/site';

export default function VoorTherapeuten() {
  return (
    <section id="therapeuten" className="section relative overflow-hidden bg-terra-ink text-cream/85">
      <div className="shell-wide relative grid lg:grid-cols-[0.95fr_1fr] gap-10 lg:gap-16 items-start">
        <div>
          <span className="kicker kicker-light">Voor therapeuten</span>
          <h2 className="mt-4 display-lg text-white">Ben jij voetreflexzonetherapeute?</h2>

          <div className="mt-6 space-y-4 text-[16.5px] leading-relaxed text-cream/75">
            <p>
              Dan is deze specialisatiecursus een waardevolle aanvulling op jouw kennis en
              vaardigheden. Na het volgen van de cursus kun je ook in jouw praktijk de speciale
              behandeling voetreflexologie bij neuropathie aanbieden.
            </p>
            <p>
              Juist voor mensen met neuropathie is het belangrijk dat zij een gespecialiseerde
              voetreflextherapeut in hun eigen omgeving kunnen vinden. Help jij mee om ons landelijke
              netwerk uit te breiden?
            </p>
          </div>

          <a
            href={SITE.courseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-terra mt-8 !bg-rose !text-terra-ink hover:!bg-rose-soft"
          >
            Aanmelden voor de specialisatiecursus
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </a>

          <p className="mt-6 font-display serif-italic text-[21px] text-rose-soft">
            Samen maken we het verschil.
          </p>
        </div>

        <div className="bg-cream/[0.06] border border-cream/15 rounded-xl p-6 sm:p-8">
          <h3 className="font-display text-[21px] text-white">
            Tijdens deze specialisatie leer je onder andere:
          </h3>
          <ul className="mt-6 flex flex-col gap-4">
            {leerdoelen.map((d) => (
              <li key={d} className="flex items-start gap-3.5">
                <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-rose/25 text-rose-soft flex items-center justify-center">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-[15.5px] leading-relaxed text-cream/80">{d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-7 pt-6 border-t border-cream/12 text-[15px] leading-relaxed text-cream/60">
            Samen kunnen we ervoor zorgen dat meer mensen met neuropathie toegang krijgen tot deze
            aanvullende behandeling.
          </p>
        </div>
      </div>
    </section>
  );
}
