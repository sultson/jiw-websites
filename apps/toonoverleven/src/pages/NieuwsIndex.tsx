import type { Bericht } from '../content/types';
import { bron } from '../content/image';
import { vindPagina } from '../inhoud';
import BerichtKaart from '../components/BerichtKaart';
import {
  ContactKaart,
  FACEBOOK,
  INSTAGRAM,
  Kicker,
  Knop,
  Kruimels,
  PaginaHero,
  Schil,
  schrijfNaam,
} from '../ui';

/**
 * Alle berichten.
 *
 * De vastgestelde structuur kent geen nieuwspagina, maar de stichting schrijft
 * hem wel: workshops die erbij komen, een wandeling die verzet wordt, een dag
 * die goed uitpakte. Dat hoort onder Ervaringen, want het is hetzelfde antwoord
 * op dezelfde vraag: gebeurt hier iets, en wat dan.
 *
 * Het bovenste bericht krijgt de grote plek. Dat is het vastgezette bericht als
 * er een is, en anders het nieuwste, want de lijst komt zo binnen.
 */

/** De uitnodiging naast de pagina staat in de vastgestelde tekst van de rubriek. */
const ZIJKAART = vindPagina('/ervaringen')?.zijkaart;

const KRUIMELS = [
  { label: 'Home', href: '/' },
  { label: 'Ervaringen', href: '/ervaringen' },
  { label: 'Nieuws en verhalen' },
];

export default function NieuwsIndex({ berichten }: { berichten: Bericht[] }) {
  const [eerste, ...rest] = berichten;

  return (
    <>
      <Schil>
        <Kruimels pad={KRUIMELS} />
      </Schil>

      <PaginaHero
        kicker="Ervaringen"
        titel="Nieuws en verhalen"
        lead="Wat er in het huis gebeurt: nieuwe workshops, een activiteit die verzet wordt, een dag die goed uitpakte."
        foto={{
          src: '/img/kraam-gesprek.jpg',
          alt: 'Twee mensen met een microfoon bij een buitenevenement',
        }}
      />

      <Schil className="grid items-start gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16 xl:gap-[5.5rem]">
        <article className="min-w-0">
          <section className="py-9 md:py-11">
            {eerste ? (
              <Uitgelicht bericht={eerste} />
            ) : (
              <p className="rounded-[1.25rem] border border-lijn bg-room-diep p-6 leading-relaxed text-inkt-zacht">
                Er staat nog geen bericht. Op Facebook en Instagram staat wel wat er de laatste tijd
                gebeurd is.
              </p>
            )}
          </section>

          {rest.length > 0 && (
            <section className="border-t border-lijn py-9 md:py-11">
              <h2 className="mb-5 max-w-[22ch] text-[1.75rem] md:text-[2.15rem]">Eerdere berichten</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {rest.map((bericht) => (
                  <li key={bericht.id}>
                    <BerichtKaart bericht={bericht} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="border-t border-lijn py-9 md:py-11">
            <Kicker>Meekijken</Kicker>
            <h2 className="mb-3 max-w-[22ch] text-[1.75rem] md:text-[2.15rem]">
              Ook op Facebook en Instagram
            </h2>
            <p className="max-w-[68ch] leading-relaxed text-inkt-zacht">
              Daar staan dezelfde berichten, vaak met meer foto's van de dag zelf.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 max-sm:grid">
              <Knop href={FACEBOOK} soort="rand" extern className="max-sm:w-full max-sm:justify-between">
                Facebook
              </Knop>
              <Knop href={INSTAGRAM} soort="rand" extern className="max-sm:w-full max-sm:justify-between">
                Instagram
              </Knop>
            </div>
          </section>
        </article>

        {ZIJKAART && (
          <aside className="lg:sticky lg:top-[7.2rem]">
            <ContactKaart
              kicker={ZIJKAART.kicker}
              kop={ZIJKAART.kop}
              tekst={ZIJKAART.tekst}
              acties={ZIJKAART.acties}
            />
          </aside>
        )}
      </Schil>
    </>
  );
}

/**
 * Het bericht dat vooraan staat, breder dan de rest. Zo heeft de pagina een
 * begin in plaats van een raster dat meteen op volle sterkte staat.
 */
function Uitgelicht({ bericht }: { bericht: Bericht }) {
  return (
    <a
      href={`/nieuws/${bericht.slug}`}
      className="grid overflow-hidden rounded-[1.25rem] border border-lijn bg-white no-underline shadow-[0_8px_24px_rgba(55,28,38,0.04)] transition hover:-translate-y-0.5 hover:border-blos-diep sm:grid-cols-2"
    >
      {bericht.img && (
        <img
          src={bron(bericht.img, 'breed')}
          alt=""
          className="h-full min-h-[14rem] w-full object-cover"
          loading="eager"
          decoding="async"
        />
      )}
      <div className="flex flex-col justify-center p-6 md:p-8">
        <p className="flex flex-wrap items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-teal">
          {bericht.vastgezet && (
            <span className="rounded-full bg-blos px-2 py-0.5 text-wijn">Blijft staan</span>
          )}
          {bericht.datum}
        </p>
        <h2 className="my-2.5 max-w-[22ch] text-[1.45rem] md:text-[1.75rem]">
          {schrijfNaam(bericht.titel)}
        </h2>
        <p className="leading-relaxed text-inkt-doffer">{schrijfNaam(bericht.samenvatting)}</p>
        <span className="mt-5 text-[0.82rem] font-extrabold text-wijn">
          Lees verder <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}
