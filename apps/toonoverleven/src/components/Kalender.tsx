import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Activiteit } from '../content/types';
import { CATEGORIE_STIJL, MAANDEN, WEEKKOPPEN, datumSleutel, zelfdeDag } from '../agenda/model';

/**
 * Een maand in het klein, met een stipje op elke dag waarop iets is.
 *
 * De lijst ernaast beantwoordt "wat is er binnenkort". Dit beantwoordt de
 * andere vraag: "kan ik op een donderdag in oktober ergens naartoe". Je
 * bladert per maand en je klikt een dag aan; de lijst ernaast laat dan alleen
 * die dag zien. De keuze zelf ligt bij de pagina, want die lijst is er de
 * eigenaar van.
 */
export default function Kalender({
  activiteiten,
  gekozen,
  bijKiezen,
  nu,
}: {
  activiteiten: Activiteit[];
  gekozen: string | null;
  bijKiezen: (sleutel: string | null) => void;
  /**
   * Welk moment "vandaag" is. De Worker rendert dezelfde kalender als de
   * browser, en zonder meegegeven moment zou de dikgedrukte dag aan weerskanten
   * van middernacht een andere kunnen zijn.
   */
  nu?: Date;
}) {
  const moment = nu?.getTime();
  const vandaag = useMemo(() => (moment === undefined ? new Date() : new Date(moment)), [moment]);
  const [maand, setMaand] = useState(() => new Date(vandaag.getFullYear(), vandaag.getMonth(), 1));

  /** Per dag wat er die dag is, zodat het raster niets hoeft te zoeken. */
  const perDag = useMemo(() => {
    const kaart = new Map<string, Activiteit[]>();
    for (const activiteit of activiteiten) {
      if (activiteit.soort === 'mededeling') continue;
      const sleutel = datumSleutel(activiteit.start);
      const bestaand = kaart.get(sleutel);
      if (bestaand) bestaand.push(activiteit);
      else kaart.set(sleutel, [activiteit]);
    }
    return kaart;
  }, [activiteiten]);

  /** Waar de agenda begint en ophoudt: verder bladeren heeft geen zin. */
  const grenzen = useMemo(() => {
    const datums = activiteiten.map((a) => a.start.getTime());
    const eerste = datums.length ? new Date(Math.min(...datums)) : vandaag;
    const laatste = datums.length ? new Date(Math.max(...datums)) : vandaag;
    return {
      van: new Date(eerste.getFullYear(), eerste.getMonth(), 1),
      tot: new Date(laatste.getFullYear(), laatste.getMonth(), 1),
    };
  }, [activiteiten, vandaag]);

  const vorigeKan = maand > grenzen.van;
  const volgendeKan = maand < grenzen.tot;

  const verzet = (stap: number) => {
    setMaand(new Date(maand.getFullYear(), maand.getMonth() + stap, 1));
    bijKiezen(null);
  };

  // Maandag als eerste kolom, zoals een kalender in Nederland staat.
  const beginKolom = (new Date(maand.getFullYear(), maand.getMonth(), 1).getDay() + 6) % 7;
  const aantalDagen = new Date(maand.getFullYear(), maand.getMonth() + 1, 0).getDate();

  return (
    <div className="rounded-[1.25rem] border border-lijn bg-white p-4 shadow-[var(--shadow-kaart)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[1.15rem]">
          {MAANDEN[maand.getMonth()]} {maand.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <Blader kant="vorige" uit={!vorigeKan} bij={() => verzet(-1)} />
          <Blader kant="volgende" uit={!volgendeKan} bij={() => verzet(1)} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {WEEKKOPPEN.map((kop) => (
          <div key={kop} className="pb-2 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-grijs">
            {kop}
          </div>
        ))}

        {Array.from({ length: beginKolom }).map((_, i) => (
          <div key={`leeg-${i}`} />
        ))}

        {Array.from({ length: aantalDagen }).map((_, i) => {
          const datum = new Date(maand.getFullYear(), maand.getMonth(), i + 1);
          const sleutel = datumSleutel(datum);
          const items = perDag.get(sleutel) ?? [];
          const isVandaag = zelfdeDag(datum, vandaag);
          const isGekozen = gekozen === sleutel;

          if (!items.length) {
            return (
              <div
                key={sleutel}
                className={`grid aspect-square place-items-center rounded-[0.7rem] text-[15px] ${
                  isVandaag ? 'font-bold text-inkt' : 'text-inkt/35'
                }`}
              >
                {i + 1}
              </div>
            );
          }

          // Hooguit drie stipjes: bij vier activiteiten op één dag zegt een
          // vierde stip niets meer, en dan wordt het een streepje.
          const stippen = items.slice(0, 3);

          return (
            <button
              key={sleutel}
              type="button"
              onClick={() => bijKiezen(isGekozen ? null : sleutel)}
              aria-pressed={isGekozen}
              aria-label={`${i + 1} ${MAANDEN[maand.getMonth()]}, ${items.length} ${
                items.length === 1 ? 'activiteit' : 'activiteiten'
              }`}
              className={`grid aspect-square place-items-center rounded-[0.7rem] text-[15px] transition ${
                isGekozen
                  ? 'bg-wijn text-white'
                  : isVandaag
                    ? 'bg-blos font-bold text-wijn hover:bg-wijn hover:text-white'
                    : 'font-semibold text-inkt hover:bg-blos hover:text-wijn'
              }`}
            >
              <span className="flex flex-col items-center gap-1">
                {i + 1}
                <span className="flex gap-0.5">
                  {stippen.map((item) => (
                    <span
                      key={item.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        isGekozen ? 'bg-white/80' : CATEGORIE_STIJL[item.categorie].stip
                      }`}
                    />
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 border-t border-lijn pt-3.5 text-[0.85rem] leading-relaxed text-grijs">
        Een stip is een activiteit. Klik een dag aan, dan staat er in de lijst alleen wat er die dag
        is.
      </p>
    </div>
  );
}

function Blader({ kant, uit, bij }: { kant: 'vorige' | 'volgende'; uit: boolean; bij: () => void }) {
  const vorige = kant === 'vorige';
  return (
    <button
      type="button"
      onClick={bij}
      disabled={uit}
      aria-label={vorige ? 'Vorige maand' : 'Volgende maand'}
      className="grid h-11 w-11 place-items-center rounded-full border border-lijn bg-white text-wijn transition hover:border-wijn hover:bg-blos disabled:cursor-not-allowed disabled:border-lijn disabled:bg-white disabled:text-inkt/25"
    >
      {vorige ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
