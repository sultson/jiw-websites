import { ArrowRight, Euro } from 'lucide-react';
import type { Teksten } from '../content/types';
import { bron } from '../content';
import { IPSO, Knop, Kop, Sectie } from '../ui';

/**
 * Wie we zijn en wat we doen, op één pagina.
 *
 * Hier stonden eerst vier tekstblokken naast elkaar met bijna geen beeld. Dat
 * leest als een folder van een instelling, terwijl dit de pagina is waarop
 * iemand besluit of hij aandurft binnen te lopen. Dus: foto's van het huis en
 * van de mensen, korte stukken tekst ernaast, en geschreven naar iemand die er
 * nog nooit geweest is.
 */
export default function WieWeZijn({ teksten }: { teksten: Teksten }) {
  return (
    <>
      <Intro teksten={teksten} />
      <VoorWie teksten={teksten} />
      <WatWeDoen teksten={teksten} />
      <Naam teksten={teksten} />
      <Jongeren teksten={teksten} />
    </>
  );
}

function Intro({ teksten }: { teksten: Teksten }) {
  return (
    <Sectie>
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <Kop
            kicker={teksten.wieWeZijn.kicker}
            titel={teksten.wieWeZijn.titel}
            intro={teksten.wieWeZijn.lead}
          />
          {teksten.wieWeZijn.alineas.map((alinea) => (
            <p key={alinea} className="mt-5 leading-relaxed text-groen/75">
              {alinea}
            </p>
          ))}
          <p className="mt-5 text-[15px] leading-relaxed text-groen/60">
            Aangesloten bij{' '}
            <a
              href={IPSO}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-teal-tekst hover:underline"
            >
              IPSO
            </a>
            , de landelijke koepel van inloophuizen.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          <img
            src="/img/samen-buiten.jpg"
            alt="Bezoekers en vrijwilligers bij een buitenmiddag met livemuziek"
            className="w-full rounded-3xl object-cover sm:col-span-2"
            loading="lazy"
            decoding="async"
          />
          <img
            src="/img/wandelpauze.jpg"
            alt="Drie bezoeksters met hun honden op een bankje tijdens een wandeling"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
            loading="lazy"
            decoding="async"
          />
          <img
            src="/img/kraam-gesprek.jpg"
            alt="Vrijwilligers met de microfoon bij de kraam op een dorpsevenement"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </Sectie>
  );
}

function VoorWie({ teksten }: { teksten: Teksten }) {
  return (
    <Sectie kleur="groen">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Kop licht titel="Voor wie is het inloophuis?" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {teksten.wieWeZijn.voorWie.map((regel) => (
            <li key={regel} className="flex items-start gap-3 text-lg text-white/85">
              <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-salie" />
              {regel}
            </li>
          ))}
        </ul>
      </div>
    </Sectie>
  );
}

function WatWeDoen({ teksten }: { teksten: Teksten }) {
  return (
    <Sectie>
      <Kop
        kicker={teksten.watWeDoen.kicker}
        titel={teksten.watWeDoen.titel}
        intro={teksten.watWeDoen.lead}
      />

      {/* Om en om: foto links, foto rechts. Dat leest als een verhaal in plaats
          van als een raster met vakjes, en op een telefoon staat er één ding
          per keer op het scherm. */}
      <div className="mt-14 grid gap-14 md:gap-20">
        {teksten.watWeDoen.items.map((item, i) => (
          <article
            key={item.kop}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            <img
              src={bron(item.foto, 'breed')}
              alt={item.kop}
              className={`aspect-[4/3] w-full rounded-3xl object-cover ${
                i % 2 ? 'md:order-2' : ''
              }`}
              loading="lazy"
              decoding="async"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-tekst">
                {item.wanneer}
              </p>
              <h3 className="mt-3 text-2xl md:text-3xl">{item.kop}</h3>
              <p className="mt-4 leading-relaxed text-groen/75">{item.tekst}</p>
              <a
                href="/agenda"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-teal-tekst hover:underline"
              >
                Kijk wanneer dit is <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-14 flex items-start gap-3 border-t border-lijn pt-8 text-[15px] leading-relaxed text-groen/70">
        <Euro className="mt-0.5 h-4 w-4 flex-none text-teal-tekst" />
        <span>{teksten.watWeDoen.kosten}</span>
      </p>
    </Sectie>
  );
}

function Naam({ teksten }: { teksten: Teksten }) {
  return (
    <Sectie kleur="room-diep">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <Kop kicker={teksten.naam.kicker} titel={teksten.naam.titel} />
          {teksten.naam.alineas.map((alinea) => (
            <p key={alinea} className="mt-5 leading-relaxed text-groen/75">
              {alinea}
            </p>
          ))}
          <p className="mt-7 rounded-2xl bg-zand px-6 py-5 text-groen">{teksten.naam.slot}</p>
        </div>

        <figure className="rounded-3xl bg-white p-8 md:p-12">
          <img
            src="/img/logo-vol.png"
            alt="Het logo van Toon over Leven"
            className="w-full"
            loading="lazy"
          />
          <figcaption className="mt-6 text-[15px] leading-relaxed text-groen/65">
            Het logo is gemaakt door de dochter van een van de betrokkenen. Het jonge boompje op de
            duin staat er niet voor niets: het is net geplant, het waait er behoorlijk, en het groeit
            toch.
          </figcaption>
        </figure>
      </div>
    </Sectie>
  );
}

function Jongeren({ teksten }: { teksten: Teksten }) {
  return (
    <Sectie kleur="groen">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <Kop
            licht
            kicker={teksten.jongeren.kicker}
            titel={teksten.jongeren.titel}
            intro={teksten.jongeren.lead}
          />
          {teksten.jongeren.alineas.map((alinea) => (
            <p key={alinea} className="mt-5 leading-relaxed text-white/75">
              {alinea}
            </p>
          ))}
          <div className="mt-8">
            <Knop href="/contact" soort="rand-licht">
              {teksten.jongeren.knop} <ArrowRight className="h-4 w-4" />
            </Knop>
          </div>
        </div>

        <div className="grid gap-4">
          <figure>
            <img
              src="/img/swim-cheque.jpg"
              alt="Het team van Toon over Leven met de cheque van 10.628 euro voor het jongerenproject"
              className="w-full rounded-2xl object-cover"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="mt-2.5 text-sm text-white/55">
              De cheque van 10.628 euro voor het jongerenproject, juli 2026.
            </figcaption>
          </figure>
          <img
            src="/img/swim-start.jpg"
            alt="De start van Swim to Fight Cancer in de haven van Zeewolde"
            className="w-full rounded-2xl object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </Sectie>
  );
}
