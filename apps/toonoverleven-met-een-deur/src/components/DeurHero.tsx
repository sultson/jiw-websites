import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, DoorOpen, MapPin } from 'lucide-react';
import type { Activiteit } from '../content/types';
import type { Teksten } from '../content/types';
import { beginTijd, dagNaam, maandNaam } from '../agenda/model';
import { useMinderBeweging } from '../beweging';
import { Knop, STRAAT, PLAATS } from '../ui';

/**
 * De voorpagina begint bij een deur.
 *
 * Dat is letterlijk wat dit huis is: je belt aan en je bent binnen. Dus staat
 * er een deur, en als je erop drukt gaat hij open en zie je waar je binnenkomt.
 *
 * Twee dingen zijn hier belangrijker dan het effect zelf. De kop, de tekst en
 * de knoppen staan er meteen, los van de deur en los van JavaScript: wie op een
 * trage telefoon binnenkomt leest gewoon wat dit is. En achter de deur staat
 * een echte foto als gewone afbeelding, dus er is hoe dan ook iets te zien.
 *
 * Alles hier is CSS: een gedraaid vlak, een kier met licht en een foto die
 * opkomt. Geen bibliotheek, niets dat ingeladen moet worden.
 */

/** Eenmaal open blijft hij open, ook als je terugkomt van een andere pagina. */
let alGeopend = false;

/**
 * Wat je ziet als de deur openstaat.
 *
 * Drie echte momenten uit het huis: het werk op tafel, de mensen die komen, en
 * de kamer zelf. Ze wisselen elkaar traag af, zodat het een kamer is waar iets
 * gebeurt in plaats van een foto aan de muur.
 *
 * De eerste staat er altijd. Zolang de deur dicht is, is dat ook het enige dat
 * geladen wordt.
 *
 * Het bijschrift staat erbij omdat een foto van een tafel een tafel is, en
 * "de grote tafel op een creatieve ochtend" een uitnodiging.
 */
const KIJKJES = [
  {
    src: '/img/atelier.jpg',
    smal: '/img/atelier-breed.jpg',
    alt: 'De grote tafel tijdens een creatieve ochtend, vol kwasten, verf en werk van bezoekers',
    tekst: 'De grote tafel, op een creatieve ochtend',
  },
  {
    src: '/img/wandelen.jpg',
    alt: 'Drie bezoeksters met hun honden op een bankje bij het huis, tijdens een wandeling',
    tekst: 'De wandelgroep, met hond en al',
  },
  {
    src: '/img/huis-binnen.jpg',
    alt: 'De huiskamer met de boekenkast, de leeslamp en de tafel waaraan koffie gedronken wordt',
    tekst: 'De huiskamer, als het even stil is',
  },
];

/** Zo lang blijft één beeld staan. Traag, want er is niets te haasten. */
const MS_PER_BEELD = 7000;

export default function DeurHero({
  teksten,
  eerstvolgend,
}: {
  teksten: Teksten;
  eerstvolgend?: Activiteit;
}) {
  const [open, setOpen] = useState(alGeopend);
  const minder = useMinderBeweging();

  return (
    <section className="relative overflow-hidden bg-room">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-8 md:px-8 md:pb-20 md:pt-14 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-tekst">
            {teksten.hero.kicker}
          </p>
          <h1 className="mt-4 text-[2.5rem] leading-[1.06] md:text-[3.6rem]">
            {teksten.hero.titel}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-groen/75 md:text-xl">
            {teksten.hero.lead}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Knop href="/agenda">
              {teksten.hero.knop} <ArrowRight className="h-4 w-4" />
            </Knop>
            <Knop href="/contact" soort="rand">
              {teksten.hero.knopTwee}
            </Knop>
          </div>

          {/* Eén regel met wat iemand nu wil weten: wanneer is het eerstvolgende
              moment, en waar. Geen kaart en geen blok, want daar staan er al
              genoeg van op deze pagina. */}
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-lijn pt-6 text-[15px]">
            {eerstvolgend && (
              <div className="flex items-start gap-2.5">
                <CalendarDays className="mt-0.5 h-4 w-4 flex-none text-teal-tekst" />
                <div>
                  <dt className="font-semibold">{eerstvolgend.titel}</dt>
                  <dd className="text-groen/65">
                    {dagNaam(eerstvolgend.start)} {eerstvolgend.start.getDate()}{' '}
                    {maandNaam(eerstvolgend.start)}, {beginTijd(eerstvolgend)}
                  </dd>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-teal-tekst" />
              <div>
                <dt className="font-semibold">
                  {STRAAT}, {PLAATS}
                </dt>
                <dd className="text-groen/65">Een gewoon huis, geen wachtkamer</dd>
              </div>
            </div>
          </dl>
        </div>

        <Deur
          open={open || minder}
          // Wisselende beelden vragen om beweging, en dat is precies wat
          // iemand met 'minder beweging' aan heeft uitgezet. Dan blijft het
          // bij die ene foto.
          wisselt={open && !minder}
          label={teksten.hero.deurLabel}
          openLabel={teksten.hero.deurOpenLabel}
          bijOpenen={() => {
            alGeopend = true;
            setOpen(true);
          }}
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  De deur zelf                                                       */
/* ------------------------------------------------------------------ */

function Deur({
  open,
  wisselt,
  label,
  openLabel,
  bijOpenen,
}: {
  open: boolean;
  wisselt: boolean;
  label: string;
  openLabel: string;
  bijOpenen: () => void;
}) {
  // De onderste foto staat er altijd. De rest komt er pas in als de deur
  // opengaat: wie hem dicht laat, laadt één beeld in plaats van drie.
  const kijkjes = wisselt ? KIJKJES : KIJKJES.slice(0, 1);
  const [beeld, setBeeld] = useState(0);

  useEffect(() => {
    if (!wisselt) return;
    const klok = setInterval(
      () => setBeeld((vorige) => (vorige + 1) % KIJKJES.length),
      MS_PER_BEELD,
    );
    return () => clearInterval(klok);
  }, [wisselt]);

  return (
    <div className="relative">
      {/* Het licht dat uit de kamer op de muur eromheen valt. Ligt onder het
          kozijn, dus je ziet alleen de rand die eromheen uitsteekt. */}
      <div className="deur-gloed pointer-events-none absolute -inset-8 z-0" aria-hidden="true" />

      <div className={`deur-scene relative z-10 ${open ? 'deur-open' : ''}`}>
        {/* Het kozijn. De rand eromheen is wat van een groen vlak een deur in
            een muur maakt: zonder kozijn is het een rechthoek. */}
        <div className="relative aspect-[5/6] overflow-hidden rounded-[1.75rem] border-[10px] border-[#efe3c4] bg-groen-diep shadow-[0_24px_60px_-30px_rgba(35,71,57,0.55)] md:border-[14px] lg:aspect-[4/5]">
          {/* Wat er achter de deur is. De eerste foto staat er vanaf het eerste
              moment, alleen nog in het donker; hij komt op met de deur. */}
          <div className="deur-wereld absolute inset-0">
            {kijkjes.map((kijkje, i) => (
              <div
                key={kijkje.src}
                // De onderste laag blijft altijd staan. Twee beelden lossen
                // elkaar dan op elkaar af in plaats van op de donkere bak, dus
                // de overgang zakt nooit even in het zwart weg, en een foto die
                // nog binnenkomt laat geen gat achter.
                className={`kijkje ${i === 0 || beeld === i ? 'kijkje-aan' : ''} ${
                  beeld === i ? 'kijkje-nu' : ''
                }`}
                aria-hidden={beeld === i ? undefined : true}
              >
                {kijkje.smal ? (
                  // Op een breed scherm staat de deur rechtop en snijdt een
                  // liggende foto te veel weg; dan wordt de staande versie
                  // geladen.
                  <picture>
                    <source media="(min-width: 1024px)" srcSet={kijkje.src} />
                    <img
                      src={kijkje.smal}
                      alt={kijkje.alt}
                      width={1600}
                      height={940}
                      fetchPriority="high"
                    />
                  </picture>
                ) : (
                  <img
                    src={kijkje.src}
                    alt={kijkje.alt}
                    width={1400}
                    height={1050}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
            ))}

            {/* Vignet: houdt de randen donker zodat het een blik door een
                deuropening blijft en geen banner wordt. Het zwaartepunt ligt
                naar rechts, want de deur draait naar links open en het licht
                komt van de kruk vandaan; links staat de dag dus donkerder, als
                de dagkant van het kozijn. */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: [
                  // De dagkant van het kozijn, waar de deur vandaan draait.
                  'linear-gradient(90deg, rgba(16,38,29,0.72) 0%, rgba(16,38,29,0.18) 14%, rgba(16,38,29,0) 30%)',
                  // De drempel: onderin loopt de vloer de schaduw in.
                  'linear-gradient(0deg, rgba(16,38,29,0.35) 0%, rgba(16,38,29,0) 22%)',
                  // En het vignet zelf, dat de hoeken dichthoudt.
                  'radial-gradient(115% 85% at 64% 42%, transparent 20%, rgba(20,48,37,0.78) 100%)',
                ].join(', '),
              }}
              aria-hidden="true"
            />

            {/* De bijschriften liggen boven het vignet, anders drukt die
                donkere laag ze weg. Ze staan er alleen als er iets te wisselen
                valt: bij één foto zou het een label op een stilstaand beeld
                zijn. Voor een schermlezer staat hetzelfde al in de alt-tekst
                van de foto, dus hier hoeft het niet nog eens. */}
            {wisselt && (
              <div className="kijkje-teksten" aria-hidden="true">
                {kijkjes.map((kijkje, i) => (
                  <p
                    key={kijkje.src}
                    className={`kijkje-tekst ${beeld === i ? 'kijkje-tekst-aan' : ''}`}
                  >
                    {kijkje.tekst}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Het licht dat door de kier naar buiten valt zolang de deur dicht
              is. Ligt onder het blad, dus je ziet het in de spleet eromheen. */}
          <div
            className="deur-kier pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 100% 50%, rgba(255,239,206,0.95) 0%, rgba(255,236,198,0.5) 38%, rgba(255,236,198,0) 72%)',
            }}
            aria-hidden="true"
          />

          {/* Het deurblad, een haartje kleiner dan de opening, zodat de kier
              zichtbaar blijft. Na het opendraaien staat het bijna op zijn kant
              en mag het niets meer opvangen. */}
          <div
            className={`deur-blad absolute inset-[1.6%] ${open ? 'pointer-events-none' : ''}`}
            aria-hidden={open || undefined}
          >
            <Blad label={label} />
          </div>

          {/* Dichte deur: het hele vlak is de knop, want een deur druk je open
              waar je hem raakt. */}
          {!open && (
            <button
              type="button"
              onClick={bijOpenen}
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
            >
              <span className="sr-only">{label}</span>
            </button>
          )}
        </div>
      </div>

      {/* Onder het kader. De regel is er alleen als de deur openstaat, want
          dicht staat dezelfde uitnodiging al op het blad zelf. De hoogte staat
          vast, anders verspringt de pagina bij het opendraaien. */}
      <p className="mt-4 flex min-h-6 items-center gap-2.5 text-[15px] text-groen/70">
        {open && openLabel}
      </p>
    </div>
  );
}

/**
 * Het blad zelf: twee verzonken panelen, een kruk en het bordje op de deur.
 * Getekend met vlakken en schaduwen in plaats van met een foto, zodat hij op
 * elk scherm scherp is en niets weegt.
 */
function Blad({ label }: { label: string }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[1.25rem] shadow-[0_10px_30px_-12px_rgba(20,44,34,0.75)]"
      style={{
        // Van de scharnierzijde naar de kruk toe lichter: zo valt het licht uit
        // de kamer op het blad en ligt het blad vóór de opening.
        background: 'linear-gradient(96deg, #2f6353 0%, #3f7867 38%, #58917f 78%, #6ba392 100%)',
      }}
    >
      {/* De verzonken panelen. De stijlen links en rechts blijven breed genoeg
          voor de kruk, anders staat die half over een paneelrand. */}
      <div className="absolute inset-x-[14%] inset-y-[6%] grid grid-rows-2 gap-[6%]">
        {[0, 1].map((n) => (
          <div
            key={n}
            className="rounded-md"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.16) 0%, rgba(255,255,255,0.06) 100%)',
              boxShadow:
                'inset 0 2px 6px rgba(12,32,25,0.45), inset 0 -1px 0 rgba(255,255,255,0.16), 0 1px 0 rgba(255,255,255,0.10)',
            }}
          />
        ))}
      </div>

      {/* Het bordje, zoals er een naast hun voordeur hangt. */}
      <div className="absolute left-1/2 top-[9%] w-[58%] -translate-x-1/2 rounded-md bg-room px-3 py-2 text-center shadow-[0_3px_8px_rgba(12,32,25,0.35)]">
        <img src="/img/logo.png" alt="Toon over Leven" className="mx-auto h-6 w-auto md:h-8" />
      </div>

      {/* De kruk: een rozet met een greep eraan, net onder het midden, waar hij
          op een echte deur ook zit. */}
      <div className="absolute right-[3.5%] top-[52%] flex -translate-y-1/2 items-center gap-0.5">
        <span className="block h-2 w-7 rounded-full bg-gradient-to-b from-[#f6ecd0] to-[#d3bd92] shadow-[0_1px_3px_rgba(12,32,25,0.5)] md:h-2.5 md:w-9" />
        <span className="block h-4 w-4 rounded-full bg-gradient-to-br from-[#f8f0d8] to-[#c7ad80] shadow-[0_1px_3px_rgba(12,32,25,0.5)] md:h-5 md:w-5" />
      </div>

      {/* Als een knop vormgegeven, want anders is het een groen vlak met een
          zin erop en drukt niemand erop. */}
      <span className="absolute inset-x-0 bottom-[6%] flex justify-center px-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-room px-4 py-2 text-sm font-semibold text-groen shadow-[0_4px_14px_rgba(12,32,25,0.35)]">
          <DoorOpen className="h-4 w-4 text-teal-tekst" />
          {label}
        </span>
      </span>
    </div>
  );
}
