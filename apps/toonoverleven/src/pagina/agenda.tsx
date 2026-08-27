import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Activiteit, Doelgroep, Thema } from '../content/types';
import AgendaKaart from '../components/AgendaKaart';
import Kalender from '../components/Kalender';
import {
  DOELGROEPEN,
  DOELGROEP_LABEL,
  THEMAS,
  THEMA_LABEL,
  datumSleutel,
  hoortBij,
  leesDatum,
  perActiviteit,
  volledigeDatum,
} from '../agenda/model';
import { Acties, Knop, Tekstlink } from '../ui';
import type { Actie } from '../inhoud';

/**
 * Het aanbod en de agenda, zoals het bestuur ze heeft vastgesteld.
 *
 * Een activiteit wordt één keer in het beheer geschreven en verschijnt daarna
 * vanzelf op de voorpagina, in de agenda, bij zijn thema en bij zijn doelgroep.
 * Dat is de belofte uit hun eigen overdracht, en de vier blokken hieronder zijn
 * de vier plekken waar die belofte wordt ingelost. Ze delen dezelfde kaart en
 * dezelfde filters, zodat een moment overal hetzelfde vertelt.
 *
 * Twee vragen, twee blokken: "wanneer kan ik komen" is de agenda met concrete
 * momenten, "wat is er eigenlijk" is het aanbod, waar een wekelijkse inloop één
 * kaart is en niet tweeënvijftig donderdagen.
 *
 * Wat er niet is, wordt niet verzonnen. Staat er niets in de agenda, dan staat
 * er geen voorbeeldkaart maar de zin dat er niets staat, met een manier om het
 * te vragen.
 */

/** Hoe ver de lijst met momenten vooruit kijkt; verder kijk je in de kalender. */
const WEKEN_VOORUIT = 8;

/** Mededelingen staan boven de pagina, niet tussen de activiteiten. */
const alleenActiviteiten = (agenda: Activiteit[]) =>
  agenda.filter((a) => a.soort === 'activiteit');

const themasIn = (lijst: Activiteit[]) =>
  THEMAS.filter((thema) => lijst.some((a) => a.themas.includes(thema)));

/** "Iedereen" is geen filter: dat is wat je ziet als je niets kiest. */
const doelgroepenIn = (lijst: Activiteit[]) =>
  DOELGROEPEN.filter(
    (groep) => groep !== 'iedereen' && lijst.some((a) => a.doelgroepen.includes(groep)),
  );

/* ------------------------------------------------------------------ */
/*  De eerstvolgende momenten                                          */
/* ------------------------------------------------------------------ */

/**
 * Een korte lijst voor de voorpagina: niet de eerstvolgende drie donderdagen,
 * maar de eerstvolgende keer van drie verschillende activiteiten. Anders is
 * "wat is er binnenkort te doen" een lijst van dezelfde inloop.
 */
export function KomendeMomenten({
  agenda,
  aantal = 3,
  kop,
  intro,
  acties,
}: {
  agenda: Activiteit[];
  aantal?: number;
  /** Alleen meegeven waar het omliggende blok zijn kop niet zelf al zet. */
  kop?: string;
  intro?: string;
  /** De knoppen die in de mock-up onder dit blok stonden. */
  acties?: Actie[];
}) {
  const momenten = useMemo(
    () => perActiviteit(alleenActiviteiten(agenda)).slice(0, aantal),
    [agenda, aantal],
  );

  return (
    <>
      {kop && (
        <h2 className="mb-3 max-w-[22ch] text-[1.75rem] md:text-[2.15rem] lg:text-[2.65rem]">{kop}</h2>
      )}
      {intro && <p className="max-w-[68ch] leading-relaxed text-inkt">{intro}</p>}

      {momenten.length ? (
        <Raster>
          {momenten.map((moment) => (
            <li key={moment.id}>
              <AgendaKaart activiteit={moment} />
            </li>
          ))}
        </Raster>
      ) : (
        <Leeg kop="Er staan nu geen momenten in de agenda.">
          Zodra er een datum bekend is, staat die hier en in de agenda.
        </Leeg>
      )}
      <NaarDeAgenda acties={acties} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  De agenda                                                          */
/* ------------------------------------------------------------------ */

/**
 * De hele agenda: filteren op thema en op voor wie het is, een maand om een dag
 * in aan te klikken, en daaronder wat er werkelijk gepland staat.
 *
 * De kaarten staan allemaal in de pagina en worden verborgen als ze buiten het
 * filter vallen. Filteren mag nooit betekenen dat er iets ingeladen moet worden
 * voordat het te lezen is.
 */
export function AgendaVerkenner({
  agenda,
  kop,
  intro,
  nu,
}: {
  agenda: Activiteit[];
  kop?: string;
  intro?: string;
  /** Het moment waarop de Worker de pagina rendert, zodat de browser bij het
   *  hydrateren dezelfde weken uitrekent en niet een moment meer of minder. */
  nu?: Date;
}) {
  const [thema, setThema] = useState<Thema | null>(null);
  const [doelgroep, setDoelgroep] = useState<Doelgroep | null>(null);
  const [dag, setDag] = useState<string | null>(null);

  const activiteiten = useMemo(() => alleenActiviteiten(agenda), [agenda]);

  /** Waar de lijst ophoudt. De kalender kent de hele periode wel. */
  const moment = nu?.getTime();
  const grens = useMemo(() => {
    const vanaf = moment === undefined ? new Date() : new Date(moment);
    return new Date(
      vanaf.getFullYear(),
      vanaf.getMonth(),
      vanaf.getDate() + WEKEN_VOORUIT * 7,
      23,
      59,
    );
  }, [moment]);

  /**
   * Zonder gekozen dag: alles wat de komende weken gepland staat. Met een dag:
   * juist alles van die dag, ook als die verder weg ligt, want dan is dat de
   * vraag die iemand stelt.
   */
  const momenten = useMemo(
    () =>
      dag
        ? activiteiten.filter((a) => datumSleutel(a.start) === dag)
        : activiteiten.filter((a) => a.start <= grens),
    [activiteiten, dag, grens],
  );

  const past = (a: Activiteit) => hoortBij(a, thema ?? undefined, doelgroep ?? undefined);
  const zichtbaar = momenten.filter(past).length;

  /** Wat de kalender met stippen aangeeft, volgt de filters maar niet de dag. */
  const voorKalender = useMemo(() => activiteiten.filter(past), [activiteiten, thema, doelgroep]);

  const toonAlles = () => {
    setThema(null);
    setDoelgroep(null);
    setDag(null);
  };

  return (
    <Paneel kop={kop} intro={intro}>
      <Filterrij
        label="Thema"
        alles="Alle thema's"
        opties={themasIn(activiteiten)}
        labels={THEMA_LABEL}
        gekozen={thema}
        bijKiezen={setThema}
      />
      <Filterrij
        label="Voor wie"
        alles="Iedereen"
        opties={doelgroepenIn(activiteiten)}
        labels={DOELGROEP_LABEL}
        gekozen={doelgroep}
        bijKiezen={setDoelgroep}
      />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
        <div className="max-w-[24rem] lg:max-w-none">
          <Kalender activiteiten={voorKalender} gekozen={dag} bijKiezen={setDag} nu={nu} />
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[1.3rem]">
              {dag ? `Op ${volledigeDatum(leesDatum(dag))}` : 'De komende weken'}
            </h3>
            {dag && (
              <button
                type="button"
                onClick={() => setDag(null)}
                className="inline-flex min-h-[2.6rem] items-center gap-2 rounded-full border border-lijn bg-white px-4 py-2 text-[0.85rem] font-bold text-wijn transition hover:border-wijn hover:bg-blos"
              >
                <X className="h-4 w-4" aria-hidden="true" /> Toon weer alle dagen
              </button>
            )}
          </div>

          {momenten.length ? (
            <>
              <ul className="mt-4 grid gap-4">
                {momenten.map((moment) => (
                  <li key={moment.id} hidden={!past(moment)}>
                    <AgendaKaart activiteit={moment} />
                  </li>
                ))}
              </ul>
              {zichtbaar === 0 && (
                <Leeg kop="Bij deze keuze staat nu niets in de agenda.">
                  <p>Er staat wel ander aanbod.</p>
                  <ToonAlles bijKlik={toonAlles} />
                </Leeg>
              )}
              {!dag && (
                <p className="mt-5 text-[0.85rem] leading-relaxed text-grijs">
                  Hier staat wat er de komende {WEKEN_VOORUIT} weken gepland staat. Verder vooruit
                  kijken kan in de kalender.
                </p>
              )}
            </>
          ) : (
            <Leeg kop="Er staan nu geen momenten in de agenda.">
              <p>
                Zodra er iets gepland staat, verschijnt het hier vanzelf. Bij Alle activiteiten lees
                je ondertussen wat een activiteit inhoudt.
              </p>
              <p className="mt-4">
                <Knop href="/activiteiten/alle-activiteiten">Bekijk alle activiteiten</Knop>
              </p>
            </Leeg>
          )}
        </div>
      </div>
    </Paneel>
  );
}

/* ------------------------------------------------------------------ */
/*  Het aanbod                                                         */
/* ------------------------------------------------------------------ */

/**
 * Wat er te doen is, los van een datum: per soort activiteit één kaart.
 *
 * De wekelijkse inloop staat als één regel in het beheer en hoort hier ook als
 * één kaart te staan, met "elke donderdag" erop en de eerstvolgende keer erbij.
 */
export function AanbodVerkenner({
  agenda,
  kop,
  intro = 'Bij iedere activiteit lees je wat je gaat doen en wat je kunt verwachten. Hoe vaak iets terugkomt en wanneer het eerstvolgend is, staat op de kaart; de hele agenda vind je bij Kalender en agenda.',
}: {
  agenda: Activiteit[];
  kop?: string;
  intro?: string;
}) {
  const [thema, setThema] = useState<Thema | null>(null);
  const [doelgroep, setDoelgroep] = useState<Doelgroep | null>(null);

  const activiteiten = useMemo(() => alleenActiviteiten(agenda), [agenda]);
  const soorten = useMemo(() => perActiviteit(activiteiten), [activiteiten]);

  const past = (a: Activiteit) => hoortBij(a, thema ?? undefined, doelgroep ?? undefined);
  const zichtbaar = soorten.filter(past).length;

  const toonAlles = () => {
    setThema(null);
    setDoelgroep(null);
  };

  return (
    <Paneel kop={kop} intro={intro}>
      <Filterrij
        label="Thema"
        alles="Alle thema's"
        opties={themasIn(soorten)}
        labels={THEMA_LABEL}
        gekozen={thema}
        bijKiezen={setThema}
      />
      <Filterrij
        label="Voor wie"
        alles="Iedereen"
        opties={doelgroepenIn(soorten)}
        labels={DOELGROEP_LABEL}
        gekozen={doelgroep}
        bijKiezen={setDoelgroep}
      />

      {soorten.length ? (
        <>
          <Raster>
            {soorten.map((soort) => (
              <li key={soort.bronId} hidden={!past(soort)}>
                <AgendaKaart activiteit={soort} reeks />
              </li>
            ))}
          </Raster>
          {zichtbaar === 0 && (
            <Leeg kop="Bij deze keuze staat nu niets in het aanbod.">
              <p>Er staat wel ander aanbod.</p>
              <ToonAlles bijKlik={toonAlles} />
            </Leeg>
          )}
        </>
      ) : (
        <Leeg kop="Er staat nu geen activiteit in de agenda.">
          <p>
            Deze lijst komt uit de agenda: zodra er een activiteit in staat, lees je hier wat je
            kunt verwachten.
          </p>
        </Leeg>
      )}
    </Paneel>
  );
}

/**
 * Het aanbod van één thema of één doelgroep, voor de pagina's die daarover
 * gaan. Geen filters: de pagina is het filter.
 *
 * Er staat hier alleen wat er werkelijk voor deze groep of dit thema is
 * vastgelegd. Is dat niets, dan zegt het blok dat, want een jongere die op een
 * jongerenpagina een kaart ziet die niet voor hem is, komt voor niets.
 */
export function Aanbod({
  agenda,
  thema,
  doelgroep,
  kop,
  acties,
}: {
  agenda: Activiteit[];
  thema?: Thema;
  doelgroep?: Doelgroep;
  kop?: string;
  acties?: Actie[];
}) {
  const momenten = useMemo(
    () => perActiviteit(alleenActiviteiten(agenda).filter((a) => hoortBij(a, thema, doelgroep))),
    [agenda, thema, doelgroep],
  );

  const titel = kop;

  return (
    <>
      <h2 className="mb-3 max-w-[22ch] text-[1.75rem] md:text-[2.15rem] lg:text-[2.65rem]">
        {titel}
      </h2>

      {momenten.length ? (
        <Raster>
          {momenten.map((moment) => (
            <li key={moment.bronId}>
              <AgendaKaart activiteit={moment} />
            </li>
          ))}
        </Raster>
      ) : (
        <Leeg
          kop={
            doelgroep
              ? 'Er staat nu geen moment voor deze groep in de agenda.'
              : 'Er staat nu geen moment onder dit thema in de agenda.'
          }
        >
          Dat betekent niet dat er niets is. In de volledige agenda staat wat er wel gepland staat,
          en bij ieder moment lees je voor wie het bedoeld is.
        </Leeg>
      )}
      <NaarDeAgenda acties={acties} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  De onderdelen die de blokken delen                                 */
/* ------------------------------------------------------------------ */

/**
 * Het roomkleurige vlak uit het voorstel: kop links, uitleg rechts, daaronder de
 * filters en de kaarten.
 */
function Paneel({ kop, intro, children }: { kop?: string; intro?: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.65rem] bg-room-diep p-4 sm:p-6 md:p-8">
      <div className="grid items-end gap-3 md:grid-cols-2 md:gap-8">
        {kop && <h2 className="max-w-[22ch] text-[1.75rem] md:text-[2.15rem] lg:text-[2.5rem]">{kop}</h2>}
        {intro && <p className="max-w-[52ch] leading-relaxed text-grijs">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

/**
 * Eén rij filterknoppen. Bij minder dan twee keuzes staat er niets: een filter
 * met één knop erin doet alsof er iets te kiezen valt.
 */
function Filterrij<T extends string>({
  label,
  alles,
  opties,
  labels,
  gekozen,
  bijKiezen,
}: {
  label: string;
  /** Wat de eerste knop zegt: de knop die niets wegfiltert. */
  alles: string;
  opties: T[];
  labels: Record<T, string>;
  gekozen: T | null;
  bijKiezen: (waarde: T | null) => void;
}) {
  const id = useId();
  if (opties.length < 2) return null;

  return (
    <div className="mt-5">
      <p id={id} className="text-[0.73rem] font-extrabold uppercase tracking-[0.12em] text-wijn">
        {label}
      </p>
      {/* De rij mag opzij schuiven op een telefoon; de marge eromheen is er
          zodat de focusrand van de eerste knop niet wordt afgesneden. */}
      <div
        role="group"
        aria-labelledby={id}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 py-2.5"
      >
        <Chip aan={gekozen === null} bijKlik={() => bijKiezen(null)}>
          {alles}
        </Chip>
        {opties.map((optie) => (
          <Chip
            key={optie}
            aan={gekozen === optie}
            bijKlik={() => bijKiezen(gekozen === optie ? null : optie)}
          >
            {labels[optie]}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({
  aan,
  bijKlik,
  children,
}: {
  aan: boolean;
  bijKlik: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={bijKlik}
      aria-pressed={aan}
      className={`min-h-[2.75rem] flex-none whitespace-nowrap rounded-full border px-4 py-2 text-[0.9rem] font-bold transition ${
        aan
          ? 'border-wijn bg-wijn text-white'
          : 'border-lijn bg-white text-inkt hover:border-wijn hover:bg-wijn hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

/** Het raster met kaarten, dat zelf uitrekent hoeveel er naast elkaar passen. */
function Raster({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-6 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(17rem,1fr))]">
      {children}
    </ul>
  );
}

/**
 * De knoppen onder een blok: die van de pagina zelf, en anders de weg naar de
 * agenda. Zonder vervolgstap eindigt een lijst met kaarten in het niets, ook
 * als er niets in staat.
 */
function NaarDeAgenda({ acties }: { acties?: Actie[] }) {
  // Geen eigen knop als de pagina er zelf al een heeft staan: het blok waar dit
  // in valt draagt de vervolgstap die het bestuur eronder had gezet, en twee
  // keer dezelfde knop onder één lijst leest als een fout.
  if (!acties?.length) return null;
  return <Acties acties={acties} />;
}

/** Terug naar de volle lijst, voor wie zich in een filter heeft vastgeklikt. */
function ToonAlles({ bijKlik }: { bijKlik: () => void }) {
  return (
    <button
      type="button"
      onClick={bijKlik}
      className="mt-4 inline-flex min-h-[2.75rem] items-center rounded-full border border-wijn px-4 py-2 text-[0.88rem] font-extrabold text-wijn transition hover:bg-blos"
    >
      Toon alles
    </button>
  );
}

/** Wat er staat als er niets staat: geen voorbeeldkaart, wel een vervolgstap. */
function Leeg({ kop, children }: { kop: string; children: ReactNode }) {
  return (
    <div className="mt-6 rounded-[1.25rem] border border-lijn bg-white p-6">
      <p className="text-[1.08rem] font-bold text-wijn-diep">{kop}</p>
      <div className="mt-2 max-w-[62ch] leading-relaxed text-inkt">{children}</div>
      <p className="mt-4 text-[0.9rem] text-grijs">
        Liever even overleggen? <Tekstlink href="/praktisch/contact">Neem contact op</Tekstlink>
      </p>
    </div>
  );
}
