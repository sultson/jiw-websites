import type { Bericht } from '../content/types';
import type { Verhaal } from '../content/verhalen';
import { bron } from '../content/image';
import RijkeTekst from '../components/RijkeTekst';
import NieuwsStrook from '../components/NieuwsStrook';
import { Kicker, Knop, Kop, schrijfNaam } from '../ui';

/**
 * Wat er onder Ervaringen uit het beheer komt: de verhalen van bezoekers en de
 * berichten die de stichting zelf schrijft.
 *
 * De vastgestelde mock-up zet op de vier verhalenpagina's een blok dat zegt dat
 * hier een echt verhaal hoort te komen en dat er niets verzonnen wordt. Dat
 * blok is geen tijdelijke plaatshouder maar de belofte zelf, dus het blijft
 * staan zolang er geen verhaal is dat iemand werkelijk verteld heeft.
 */

/** De echte verhalen van bezoekers, of het eerlijke lege vlak als er nog geen zijn. */
export function Verhalen({ verhalen }: { verhalen: Verhaal[] }) {
  if (!verhalen.length) return <NogGeenVerhaal />;

  return (
    <div className="grid gap-5">
      {verhalen.map((verhaal, i) => (
        <VerhaalKaart key={verhaal.id} verhaal={verhaal} i={i} />
      ))}
    </div>
  );
}

/**
 * Het echtheidsblok uit de mock-up, in de woorden van de klant zelf. De tweede
 * zin gaat niet meer over een mock-up maar over de site zoals hij nu is: er
 * staat niets omdat er nog niemand iets verteld heeft, niet omdat het nog
 * gebouwd moet worden.
 */
function NogGeenVerhaal() {
  return (
    <aside className="grid gap-4 rounded-[1.25rem] border border-dashed border-blos-diep bg-blos p-7 sm:grid-cols-[auto_1fr] sm:gap-6">
      <span aria-hidden="true" className="font-display text-[5rem] leading-[0.75] text-wijn">
        “
      </span>
      <div>
        <Kicker>Plek voor authentieke inhoud</Kicker>
        <h2 className="mb-2 max-w-[22ch] text-[1.6rem] md:text-[2rem]">Hier komt een echt verhaal</h2>
        <p className="max-w-[60ch] leading-relaxed text-inkt">
          Een AI-verhaal zou overtuigend kunnen klinken, maar is geen ervaring van een bezoeker.
          Daarom staat hier pas een verhaal zodra iemand die Toon over Leven zelf bezocht heeft het
          vertelt en toestemming geeft om het te publiceren.
        </p>
      </div>
    </aside>
  );
}

/**
 * Eén verhaal. Staat het hele verhaal ergens anders, dan leidt de kaart erheen;
 * anders staat het hier gewoon helemaal. Onder het verhaal staat de naam zoals
 * de verteller die zelf heeft opgegeven, en niets meer dan dat.
 */
function VerhaalKaart({ verhaal, i }: { verhaal: Verhaal; i: number }) {
  const tint = ['bg-white', 'bg-teal-licht', 'bg-salie-licht', 'bg-blos'][i % 4];
  const extern = /^https?:/i.test(verhaal.link ?? '');

  return (
    <article
      className={`overflow-hidden rounded-[1.25rem] border border-lijn shadow-[0_8px_24px_rgba(55,28,38,0.04)] ${tint}`}
    >
      {verhaal.img && (
        <img
          src={bron(verhaal.img, 'breed')}
          alt=""
          className="h-56 w-full object-cover md:h-72"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="p-6 md:p-8">
        <h3 className="max-w-[24ch] text-[1.35rem] md:text-[1.6rem]">{schrijfNaam(verhaal.kop)}</h3>
        <p className="mt-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-teal">
          Verteld door {verhaal.verteller}
        </p>

        {verhaal.link ? (
          <>
            <p className="mt-4 max-w-[68ch] leading-relaxed text-inkt">
              {schrijfNaam(verhaal.samenvatting)}
            </p>
            <div className="mt-6">
              <Knop href={verhaal.link} extern={extern}>
                Lees het hele verhaal
              </Knop>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <RijkeTekst blokken={verhaal.body} />
          </div>
        )}

        {verhaal.datum && <p className="mt-6 text-[0.8rem] text-grijs">{verhaal.datum}</p>}
      </div>
    </article>
  );
}

/** Een rij recente berichten, voor de voorpagina en de rubriek Ervaringen. */
export function BerichtenStrook({
  berichten,
  kop = 'Nieuws en verhalen',
  lead,
  aantal = 8,
}: {
  berichten: Bericht[];
  kop?: string;
  lead?: string;
  aantal?: number;
}) {
  const rij = berichten.slice(0, aantal);
  if (!rij.length) return null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <Kop titel={schrijfNaam(kop)} intro={lead ? schrijfNaam(lead) : undefined} />
        <Knop href="/nieuws" soort="rand">
          Alle berichten
        </Knop>
      </div>
      <div className="mt-7">
        <NieuwsStrook berichten={rij} />
      </div>
    </div>
  );
}
