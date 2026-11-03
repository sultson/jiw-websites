import { Quote } from 'lucide-react';

export default function Ontstaan() {
  return (
    <section id="ontstaan" className="section bg-canvas overflow-hidden">
      <div className="shell-wide grid lg:grid-cols-[0.8fr_1fr] gap-10 lg:gap-16 items-center">
        <div className="relative max-w-xs mx-auto lg:mx-0">
          <img
            src="/lydia-portrait.png"
            alt="Lydia van der Bie"
            className="w-full rounded-xl border border-line object-cover"
            loading="lazy"
          />
          <div className="mt-5 text-center lg:text-left">
            <div className="font-display text-[20px] text-ink">Lydia van der Bie</div>
            <div className="text-[13px] text-ink-mute">Ontwikkelaar van de behandeling, Oud-Beijerland</div>
          </div>
        </div>

        <div>
          <span className="kicker">Ontstaan</span>
          <h2 className="mt-4 display-lg text-ink">Hoe is deze behandeling ontstaan?</h2>

          <div className="mt-6 space-y-4 text-[16.5px] leading-relaxed text-ink-soft">
            <p>De behandeling is ontstaan vanuit mijn eigen praktijkervaring.</p>
            <p>
              Ik kreeg steeds vaker cliënten met pijnlijke, tintelende of juist gevoelloze voeten. Eén
              van mijn cliënten vertelde dat zij neuropathie had en vroeg mij of voetreflexologie iets
              voor haar zou kunnen betekenen.
            </p>
            <p>
              Dat was voor mij de aanleiding om mij verder te verdiepen in neuropathie en de
              mogelijkheden van voetreflexologie als aanvullende ondersteuning.
            </p>
            <p>
              Vanuit deze zoektocht heb ik de behandeling voetreflexologie bij neuropathie ontwikkeld.
              In mijn praktijk heb ik vervolgens ervaren hoe waardevol deze behandeling voor cliënten
              kan zijn.
            </p>
          </div>

          <figure className="mt-8 border-l-2 border-terra pl-5">
            <Quote size={22} className="text-rose mb-1.5" />
            <blockquote className="font-display text-[20px] sm:text-[23px] text-ink leading-snug serif-italic">
              Mijn wens is dat iedereen met neuropathie de mogelijkheid krijgt om deze aanvullende
              behandeling in de eigen omgeving te ontvangen.
            </blockquote>
          </figure>

          <p className="mt-6 text-[16.5px] leading-relaxed text-ink-soft">
            Daarom zet ik mij in voor het opbouwen van een landelijk netwerk van gespecialiseerde
            voetreflextherapeuten.
          </p>
        </div>
      </div>
    </section>
  );
}
