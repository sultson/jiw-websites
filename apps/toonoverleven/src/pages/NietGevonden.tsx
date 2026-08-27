import { Kicker, Knop, Schil, Tekstlink } from '../ui';
import { MENU } from '../navigatie';

/**
 * Een adres dat niet bestaat. Wie hier komt zocht iets, dus de pagina is geen
 * excuus maar een wegwijzer: de zes rubrieken staan eronder, en de agenda en
 * het contact zijn één klik weg.
 */
export default function NietGevonden() {
  return (
    <Schil className="py-16 md:py-24">
      <div className="max-w-2xl">
        <Kicker>Pagina niet gevonden</Kicker>
        <h1 className="text-[2.45rem] md:text-[3.4rem]">Deze pagina bestaat niet</h1>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-inkt-zacht">
          Misschien is de link verouderd of staat er een tikfout in het adres. De activiteiten, de
          agenda en de contactgegevens staan er gewoon nog.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3 max-sm:grid">
          <Knop href="/">Naar de voorpagina</Knop>
          <Knop href="/activiteiten/agenda" soort="rand">
            Bekijk de agenda
          </Knop>
        </div>
      </div>

      <div className="mt-12 border-t border-lijn pt-8">
        <h2 className="text-[1.16rem]">Waar wil je naartoe?</h2>
        <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-2.5">
          {MENU.map((rubriek) => (
            <li key={rubriek.pad}>
              <Tekstlink href={rubriek.pad}>{rubriek.label}</Tekstlink>
            </li>
          ))}
        </ul>
      </div>
    </Schil>
  );
}
