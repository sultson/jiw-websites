import {useEffect, useRef, useState} from 'react';
import {
  ArrowLeft, ArrowRight, Check, Flower2, Info, Leaf, Loader2, Mail, Package,
  Phone, Store, TreePine, Truck,
} from 'lucide-react';
import {STRAAT, TEL, TEL_DISPLAY, WA_GROEN, WHATSAPP, WhatsAppMerk, useKnopInBeeld} from './ui';

/* ------------------------------------------------------------------ */
/*  Waar een aanvraag naartoe gaat                                     */
/* ------------------------------------------------------------------ */

/**
 * De aanvraag gaat naar onze eigen Worker (worker/index.ts), die hem opslaat,
 * de winkel een mail stuurt en de klant een bevestiging terugstuurt.
 *
 * Eerder ging hij op een telefoon als WhatsAppbericht de deur uit en op een
 * computer via een externe formulierendienst. Dat betekende twee dingen: op een
 * telefoon moest de bezoeker zelf nog op versturen drukken in een andere app,
 * en niemand kreeg ooit een bevestiging van wat hij had aangevraagd. Nu loopt
 * elke aanvraag langs dezelfde weg. WhatsApp en bellen staan er nog steeds,
 * maar als wat ze zijn: een tweede manier om contact te leggen, naast het
 * formulier en niet in plaats daarvan.
 */
const ENDPOINT = '/api/forms/aanvraag';

/* Leest het pakket om te bepalen in welke taal de bevestiging gaat. De site is
   eentalig, maar zonder dit veld valt hij terug op een standaard, en dan staat
   die keuze nergens opgeschreven. */
const TAALVELD = '__jiw_confirmation_locale';

export const OPSLAG_SLEUTEL = 'bloei:aanvraag';

/* ------------------------------------------------------------------ */
/*  Inhoud                                                             */
/* ------------------------------------------------------------------ */

const SOORTEN = [
  {id: 'boeket', img: '/img/kaart-bloemen.webp', icon: Flower2, titel: 'Boeket', onder: 'Op bestelling'},
  {id: 'plant', img: '/img/kaart-planten.webp', icon: Leaf, titel: 'Plant of bak', onder: 'Binnen of buiten'},
  {id: 'cadeau', img: '/img/kaart-cadeau.webp', icon: Package, titel: 'Cadeau', onder: 'Bon of pakketje'},
  {id: 'kerst', img: '/img/seizoen-najaar.webp', icon: TreePine, titel: 'Kerst', onder: 'Krans of stuk'},
] as const;

type SoortId = (typeof SOORTEN)[number]['id'];

/* Op een telefoon is elk keuzevak nog geen 100px breed, dus een woord als
   Cadeaupakket past niet op een regel. Met een zacht koppelteken breekt het
   netjes af in plaats van midden in een lettergreep. Alleen voor het tonen:
   de titel die meegaat in de aanvraag blijft schoon. */
const AFBREEK: Record<SoortId, string> = {
  boeket: 'Boeket',
  plant: 'Plant of bak',
  cadeau: 'Cadeau',
  kerst: 'Kerst',
};

const SUBVRAAG: Record<SoortId, string> = {
  boeket: 'Voor welke gelegenheid?',
  plant: 'Waar komt het te staan?',
  cadeau: 'Wat wilt u geven?',
  kerst: 'Waar denkt u aan?',
};

const SUBKEUZE: Record<SoortId, string[]> = {
  boeket: [
    'Zomaar, om iemand blij te maken',
    'Verjaardag',
    'Geboorte',
    'Jubileum of huwelijk',
    'Bedankje',
    'Zakelijk of voor op kantoor',
    'Weet ik nog niet, graag advies',
  ],
  plant: [
    'Binnen, in huis',
    'Buiten, op het terras of balkon',
    'In de tuin of de border',
    'In de zaak: restaurant, kantoor of winkel',
    'Weet ik nog niet, ik hoor graag wat er mogelijk is',
  ],
  cadeau: [
    'Cadeaubon',
    'Een cadeaupakketje',
    'Meerdere pakketjes tegelijk',
    'Weet ik nog niet, graag advies',
  ],
  kerst: [
    'Kerstkrans voor aan de deur',
    'Kerststukje voor op tafel',
    'Kerstboom',
    'Weet ik nog niet, ik hoor graag wat er mogelijk is',
  ],
};

const DATUMVRAAG: Record<SoortId, string> = {
  boeket: 'Wanneer wilt u het ophalen?',
  plant: 'Wanneer wilt u langskomen?',
  cadeau: 'Wanneer moet het klaarstaan?',
  kerst: 'Wanneer wilt u het hebben?',
};

/**
 * Geen vaste bedragen.
 *
 * Bij Fleurig! stonden hier drie knoppen met 15, 20 en 35 euro, want dat waren
 * de prijzen van hun abonnement. Van Bloei! is geen enkele prijs bekend, dus
 * vult de bezoeker zelf in wat hij in gedachten heeft. Komen er wel vaste
 * bedragen, dan kan die keuzerij hier zo weer terug.
 */
const BUDGETVRAAG: Record<SoortId, string> = {
  boeket: 'Wat wilt u ongeveer besteden?',
  plant: 'Wat heeft u ongeveer in gedachten?',
  cadeau: 'Wat mag het cadeau kosten?',
  kerst: 'Wat heeft u ongeveer in gedachten?',
};

const TOELICHTING: Record<SoortId, string> = {
  boeket: 'Bijvoorbeeld welke bloemen of kleuren de ontvanger mooi vindt, en wat u juist liever niet heeft',
  plant: 'Bijvoorbeeld hoeveel licht er is, hoe groot het mag worden, en of u er zelf veel of weinig naar wilt omkijken',
  cadeau: 'Bijvoorbeeld voor wie het is, of diegene groene vingers heeft, en om hoeveel pakketjes het gaat',
  kerst: 'Bijvoorbeeld in welke kleuren, hoe groot, en of het aan de deur hangt of op tafel staat',
};

type LeveringId = 'ophalen' | 'bezorgen';

const LEVERING = [
  {
    id: 'ophalen' as const,
    icon: Store,
    titel: 'Ophalen',
    onder: `${STRAAT}, Ouddorp`,
  },
  /* NOG TE BEVESTIGEN: of Bloei! bezorgt en wat dat kost is niet bekend.
     Daarom geen tarief en geen gebied, maar "in overleg": de winkel kan het
     dan per aanvraag afspreken zonder dat de site iets belooft. */
  {
    id: 'bezorgen' as const,
    icon: Truck,
    titel: 'Bezorgen',
    onder: 'In overleg',
  },
];

const STAPPEN = ['Wens', 'Bezorgen', 'Datum', 'Budget', 'Gegevens', 'Wensen', 'Versturen'] as const;
const LAATSTE = STAPPEN.length; // 7

/* ------------------------------------------------------------------ */
/*  De aanvraag als leesbaar bericht                                   */
/* ------------------------------------------------------------------ */

export type Aanvraag = {
  soort: SoortId;
  soortTitel: string;
  keuze: string;
  levering: LeveringId | '';
  datum: string;
  budget: string;
  voornaam: string;
  achternaam: string;
  naam: string;
  email: string;
  telefoon: string;
  straat: string;
  postcode: string;
  plaats: string;
  wensen: string;
  ingediendOp: string;
  herkomst: 'bloei';
};

export function datumInWoorden(iso: string) {
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('nl-NL', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
}

/** Wat er in het WhatsAppbericht of in de mail komt te staan. */
export function alsBericht(a: Aanvraag) {
  const regels: string[] = [
    'Aanvraag via de website',
    '',
    `Wat: ${a.soortTitel}${a.keuze ? ` (${a.keuze})` : ''}`,
    `Ophalen of bezorgen: ${
      a.levering === 'bezorgen' ? 'Bezorgen, in overleg' : 'Ophalen in de winkel'
    }`,
  ];

  if (a.datum) regels.push(`Wanneer: ${datumInWoorden(a.datum)}`);
  if (a.budget) regels.push(`Budget: ${a.budget}`);

  regels.push('', `Naam: ${a.naam}`, `E-mail: ${a.email}`);
  if (a.telefoon) regels.push(`Telefoon: ${a.telefoon}`);
  if (a.straat || a.postcode || a.plaats) {
    regels.push(`Adres: ${[a.straat, [a.postcode, a.plaats].filter(Boolean).join(' ')].filter(Boolean).join(', ')}`);
  }
  if (a.wensen) regels.push('', `Wensen: ${a.wensen}`);

  return regels.join('\n');
}

/**
 * Verstuurt de aanvraag naar de Worker.
 *
 * Het pakket verwacht FormData en niet JSON, en het kent drie namen van
 * zichzelf: firstName, lastName en email. De rest van de velden komt door onder
 * de naam die worker/index.ts noemt bij emailFields; wat daar niet in staat,
 * staat ook niet in de mail.
 *
 * Werpt bij alles wat geen geslaagde verzending is, met de melding die de
 * Worker teruggaf. De bezoeker mag geen bevestiging zien voor een aanvraag die
 * in het niets verdween.
 */
async function verstuurNaarWinkel(a: Aanvraag) {
  const data = new FormData();

  data.set('firstName', a.voornaam);
  data.set('lastName', a.achternaam);
  data.set('email', a.email);
  data.set('telefoon', a.telefoon);

  data.set('soort', a.soortTitel);
  data.set('gelegenheid', a.keuze);
  data.set('levering', a.levering === 'bezorgen' ? 'Bezorgen, in overleg' : 'Ophalen in de winkel');
  /* Los van de zin hierboven: de Worker kijkt hiernaar om te bepalen of het
     bezorgadres verplicht is, en die vergelijking moet op één woord staan. */
  data.set('leveringId', a.levering);
  data.set('adres', [a.straat, [a.postcode, a.plaats].filter(Boolean).join(' ')].filter(Boolean).join(', '));
  data.set('datum', a.datum ? datumInWoorden(a.datum) : 'In overleg');
  data.set('budget', a.budget || 'In overleg');
  data.set('wensen', a.wensen);

  data.set(TAALVELD, 'nl');
  /* Het verborgen veld waar een bot in trapt. Leeg meesturen, zodat het bij een
     echte bezoeker altijd leeg is en niet toevallig afwezig. */
  data.set('bedrijf', '');

  const res = await fetch(ENDPOINT, {method: 'POST', body: data});
  const antwoord = (await res.json().catch(() => null)) as {ok?: boolean; message?: string} | null;
  if (!res.ok || !antwoord?.ok) {
    throw new Error(antwoord?.message ?? 'De aanvraag kon niet worden verstuurd.');
  }
}

/* ------------------------------------------------------------------ */
/*  Formulier                                                          */
/* ------------------------------------------------------------------ */

export default function AanvraagFormulier() {
  const [stap, setStap] = useState(1);

  const [soort, setSoort] = useState<SoortId>('boeket');
  const [sub, setSub] = useState<string>(SUBKEUZE.boeket[0]);
  const [levering, setLevering] = useState<LeveringId | ''>('');
  const [datum, setDatum] = useState('');
  const [budget, setBudget] = useState('');

  const [voornaam, setVoornaam] = useState('');
  const [achternaam, setAchternaam] = useState('');
  const [email, setEmail] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [straat, setStraat] = useState('');
  const [postcode, setPostcode] = useState('');
  const [plaats, setPlaats] = useState('');
  const [wensen, setWensen] = useState('');

  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  /* De hoofdknop van deze stap meldt zich aan, zodat de vaste balk onderaan
     op mobiel wegblijft zolang deze knop zichtbaar is. */
  const knopRef = useKnopInBeeld<HTMLButtonElement>(stap);
  const kopRef = useRef<HTMLDivElement>(null);

  /* Met zeven stappen loopt het formulier bij elke volgende stap uit beeld als
     de vorige stap langer was. Bij een stapwissel springt de kop van het
     formulier daarom terug in beeld, maar alleen als hij er niet al staat:
     anders schokt de pagina bij elke klik. */
  useEffect(() => {
    if (stap === 1) return;
    const el = kopRef.current;
    if (!el) return;
    const {top} = el.getBoundingClientRect();
    if (top < 0 || top > window.innerHeight * 0.5) el.scrollIntoView({behavior: 'smooth', block: 'start'});
  }, [stap]);

  const kiesSoort = (id: SoortId) => {
    setSoort(id);
    setSub(SUBKEUZE[id][0]);
    /* Een bedrag dat bij de vorige keuze hoorde moet niet blijven staan. */
    setBudget('');
  };

  const bouwAanvraag = (): Aanvraag => ({
    soort,
    soortTitel: SOORTEN.find((s) => s.id === soort)!.titel,
    keuze: sub,
    levering,
    datum,
    budget: budget.trim(),
    voornaam: voornaam.trim(),
    achternaam: achternaam.trim(),
    naam: [voornaam.trim(), achternaam.trim()].filter(Boolean).join(' '),
    email: email.trim(),
    telefoon: telefoon.trim(),
    straat: levering === 'bezorgen' ? straat.trim() : '',
    postcode: levering === 'bezorgen' ? postcode.trim() : '',
    plaats: levering === 'bezorgen' ? plaats.trim() : '',
    wensen: wensen.trim(),
    ingediendOp: new Date().toISOString(),
    herkomst: 'bloei',
  });

  /* De aanvraag als leesbaar bericht, voor de twee terugvalknoppen bij een
     mislukte verzending. Berekend op het moment van klikken, want tot dan kan
     de bezoeker nog terug naar een vorige stap. */
  const tekstVanNu = () => alsBericht(bouwAanvraag());

  /* Alleen 'verstuurd': de bedankpagina wordt uitsluitend bereikt als de
     aanvraag ook echt aankwam. Mislukt het, dan blijft de bezoeker hier staan. */
  const naarBedankt = (kanaal: 'verstuurd', aanvraag: Aanvraag, tekst: string) => {
    try {
      sessionStorage.setItem(OPSLAG_SLEUTEL, JSON.stringify({kanaal, aanvraag, tekst}));
    } catch {
      /* Prive-modus kan opslag weigeren. De bedankpagina heeft een tekst voor
         het geval er niets in staat, dus dat mag de verzending niet blokkeren. */
    }
    window.location.assign('/bedankt/');
  };

  const versturen = async (e: React.FormEvent) => {
    e.preventDefault();
    setFout(null);
    setBezig(true);

    const aanvraag = bouwAanvraag();
    const tekst = alsBericht(aanvraag);

    try {
      await verstuurNaarWinkel(aanvraag);
      naarBedankt('verstuurd', aanvraag, tekst);
    } catch (err) {
      /* Wat de bezoeker hier zag was "probeer het nog eens", en dat is een
         doodlopende weg voor iemand die net zeven stappen heeft ingevuld en
         morgen bloemen nodig heeft. Er staat nu wat er misging, en eronder
         staan WhatsApp en de mail klaar met de aanvraag er al in, zodat wat hij
         invulde niet weg is. */
      setFout(err instanceof Error ? err.message : 'De aanvraag kon niet worden verstuurd.');
      setBezig(false);
      console.error('[aanvraag]', err);
    }
  };

  /* ---------------------------------------------------------------- */

  const veld =
    'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/35 ' +
    'outline-none transition focus:border-accent focus:bg-white/10';
  const label = 'block text-sm font-semibold text-white/80';

  /* Per stap: mag de bezoeker door? Zo staat op één plek wat verplicht is, in
     plaats van verspreid over zeven knoppen.
     Het telefoonnummer is verplicht: bij bloemwerk op bestelling loopt het
     overleg over kleuren, bedrag en tijdstip in de praktijk telefonisch, en bij
     rouwwerk kan dat niet wachten op een mail die pas 's avonds gelezen wordt.
     De toets is bewust ruim (acht cijfers of meer, hoe u ze ook opschrijft):
     hij moet een vergissing tegenhouden, geen geldig nummer weigeren. */
  const kanDoor =
    stap === 2 ? levering !== ''
      : stap === 4 ? true
        : stap === 5
          ? voornaam.trim() !== '' && achternaam.trim() !== '' && /\S+@\S+\.\S+/.test(email)
            && telefoon.replace(/\D/g, '').length >= 8
            && (levering !== 'bezorgen' || (straat.trim() !== '' && plaats.trim() !== ''))
          : true;

  /* Geen eigen componenten maar functies die de knop teruggeven: als eigen
     component zou React ze bij elke toetsaanslag opnieuw aanmaken, en dan kijkt
     de waarnemer die de vaste balk op mobiel aanstuurt naar een knop die al uit
     de pagina verdwenen is. */
  const volgende = (tekst = 'Volgende') => (
    <button
      ref={knopRef}
      type="button"
      onClick={() => setStap((s) => Math.min(LAATSTE, s + 1))}
      disabled={!kanDoor}
      className="knop-bloem mt-5 flex w-full items-center justify-center gap-2 bg-roze px-6 py-4 font-semibold text-white transition hover:bg-[#a81f4f] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {tekst} <ArrowRight className="h-4 w-4" />
    </button>
  );

  const terug = () => (
    <button
      type="button"
      onClick={() => setStap((s) => Math.max(1, s - 1))}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/65 transition hover:border-white/50 hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" /> Terug
    </button>
  );

  return (
    <form onSubmit={versturen} className={wrapper}>
      {/* Stapindicator. Zeven bolletjes met tekst passen niet op een telefoon,
          dus een balk van zeven segmenten met de naam van de stap erboven. */}
      <div ref={kopRef} className="mb-6 scroll-mt-24">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-white">{STAPPEN[stap - 1]}</p>
          <p className="text-xs text-white/45">Stap {stap} van {LAATSTE}</p>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {STAPPEN.map((s, i) => (
            <span
              key={s}
              className={`h-1 flex-1 rounded-full transition ${i < stap ? 'bg-accent' : 'bg-white/12'}`}
            />
          ))}
        </div>
      </div>

      {/* ---- 1. Wat mogen we voor u maken? ---- */}
      {stap === 1 && (
        <>
          <h3 className="text-xl font-semibold text-white">Wat mogen we voor u maken?</h3>

          {/* Twee bij twee, ook op een breed scherm: het formulier staat in de
              smalle kolom, dus vier naast elkaar duwt elk vak naar ~110px en
              dan breken Abonnement, Rouwboeket en Bruidsboeket alle drie af. */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {SOORTEN.map((s) => {
              const actief = soort === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => kiesSoort(s.id)}
                  aria-pressed={actief}
                  className={`group overflow-hidden rounded-xl border text-left transition ${
                    actief
                      ? 'border-accent bg-accent/[0.12] ring-1 ring-accent/60'
                      : 'border-white/15 bg-white/[0.04] hover:border-accent/40 hover:bg-accent/[0.05]'
                  }`}
                >
                  <span className="relative block">
                    <img
                      src={s.img}
                      alt=""
                      loading="lazy"
                      className={`h-16 w-full object-cover transition sm:h-20 ${actief ? '' : 'opacity-55 saturate-[0.3] group-hover:opacity-90 group-hover:saturate-100'}`}
                    />
                    {actief && (
                      <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-ink">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                  </span>
                  <span className="flex items-start gap-1.5 px-2 pb-2.5 pt-2 sm:px-2.5">
                    <s.icon className={`mt-px hidden h-3.5 w-3.5 shrink-0 sm:block ${actief ? 'text-accent' : 'text-white/50'}`} />
                    <span className="min-w-0">
                      <span className="block break-words text-[12px] font-bold leading-tight text-white sm:text-[13px]">
                        {AFBREEK[s.id]}
                      </span>
                      <span className="mt-0.5 hidden text-[11px] leading-tight text-white/45 sm:block">{s.onder}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <label className="mt-5 block">
            <span className={label}>{SUBVRAAG[soort]}</span>
            <select value={sub} onChange={(e) => setSub(e.target.value)} className={`mt-1.5 ${veld}`}>
              {SUBKEUZE[soort].map((o) => <option key={o} className="bg-ink">{o}</option>)}
            </select>
          </label>

          {soort === 'kerst' && (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white/65">
              De kerstafdeling staat er vanaf begin november. Wilt u iets in uw eigen kleuren, geef het
              dan op tijd door, of bel ons even op{' '}
              <a href={`tel:${TEL}`} className="font-semibold text-accent hover:underline">{TEL_DISPLAY}</a>.
            </p>
          )}

          {soort === 'boeket' && (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white/65">
              Ons bloemenassortiment is nog aan het groeien. Staat er iets niet, dan kunnen we veel
              regelen; vertel bij de wensen gerust wat u in gedachten heeft.
            </p>
          )}

          {volgende()}
        </>
      )}

      {/* ---- 2. Ophalen of bezorgen ---- */}
      {stap === 2 && (
        <>
          <h3 className="text-xl font-semibold text-white">Ophalen of bezorgen?</h3>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {LEVERING.map((l) => {
              const actief = levering === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLevering(l.id)}
                  aria-pressed={actief}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-4 text-left transition ${
                    actief
                      ? 'border-accent bg-accent/[0.12] ring-1 ring-accent/60'
                      : 'border-white/15 bg-white/[0.04] hover:border-accent/40 hover:bg-accent/[0.05]'
                  }`}
                >
                  <l.icon className={`mt-0.5 h-5 w-5 shrink-0 ${actief ? 'text-accent' : 'text-white/50'}`} />
                  <span className="min-w-0">
                    <span className="block font-bold leading-tight text-white">{l.titel}</span>
                    <span className="mt-1 block text-[12px] leading-snug text-white/50">{l.onder}</span>
                  </span>
                  {actief && <Check className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={3} />}
                </button>
              );
            })}
          </div>

          {levering === 'bezorgen' && (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white/65">
              Of we kunnen bezorgen en wat dat kost, spreken we per keer even af. Het adres vragen we
              zo bij uw gegevens, dan bellen we u erover.
            </p>
          )}

          {volgende()}
          {terug()}
        </>
      )}

      {/* ---- 3. Datum ---- */}
      {stap === 3 && (
        <>
          <h3 className="text-xl font-semibold text-white">{DATUMVRAAG[soort]}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Weet u het nog niet precies? Laat het dan leeg, dan overleggen we het samen.
          </p>

          <label className="mt-4 block">
            <span className={label}>
              Gewenste datum <span className="font-normal text-white/40">optioneel</span>
            </span>
            <input
              type="date"
              value={datum}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDatum(e.target.value)}
              className={`mt-1.5 ${veld}`}
            />
          </label>

          {datum && (
            <p className="mt-3 text-sm text-white/60">{datumInWoorden(datum)}</p>
          )}

          {volgende()}
          {terug()}
        </>
      )}

      {/* ---- 4. Budget ---- */}
      {stap === 4 && (
        <>
          <h3 className="text-xl font-semibold text-white">{BUDGETVRAAG[soort]}</h3>

          {/* Eén vrij veld, geen knoppenrij: van Bloei! is geen enkele prijs
              bekend, dus er valt niets voor te sorteren. Zie BUDGETVRAAG. */}
          <label className="mt-4 block">
            <span className={label}>
              Bedrag <span className="font-normal text-white/40">optioneel</span>
            </span>
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Bijvoorbeeld 25 euro, of: hoor graag wat kan"
              className={`mt-1.5 ${veld}`}
            />
          </label>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Weet u het nog niet, laat het dan leeg. We denken graag met u mee over wat past.
          </p>

          {volgende()}
          {terug()}
        </>
      )}

      {/* ---- 5. Gegevens ---- */}
      {stap === 5 && (
        <>
          <h3 className="text-xl font-semibold text-white">Waar kunnen we u bereiken?</h3>

          {/* Voornaam en achternaam apart. Eén veld "Naam" leest prettiger,
              maar dan moet de aanhef van de bevestigingsmail geraden worden uit
              wat er staat, en "Beste Jan de Vries" is geen aanhef van iemand
              die u kent. */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label>
              <span className={label}>Voornaam</span>
              <input
                required value={voornaam} onChange={(e) => setVoornaam(e.target.value)}
                autoComplete="given-name" placeholder="Uw voornaam" className={`mt-1.5 ${veld}`}
              />
            </label>
            <label>
              <span className={label}>Achternaam</span>
              <input
                required value={achternaam} onChange={(e) => setAchternaam(e.target.value)}
                autoComplete="family-name" placeholder="Uw achternaam" className={`mt-1.5 ${veld}`}
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label>
              <span className={label}>E-mail</span>
              <input
                required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" placeholder="naam@voorbeeld.nl" className={`mt-1.5 ${veld}`}
              />
            </label>
            <label>
              <span className={label}>Telefoon</span>
              <input
                required type="tel" value={telefoon} onChange={(e) => setTelefoon(e.target.value)}
                autoComplete="tel" inputMode="tel" placeholder="06 12345678"
                className={`mt-1.5 ${veld}`}
              />
            </label>
          </div>

          {/* Het adres staat er alleen als er bezorgd moet worden: wie zelf
              langskomt hoeft zijn huisadres niet af te geven. */}
          {levering === 'bezorgen' && (
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-semibold text-white">Bezorgadres</p>
              <label className="mt-3 block">
                <span className={label}>Straat en huisnummer</span>
                <input
                  value={straat} onChange={(e) => setStraat(e.target.value)}
                  autoComplete="street-address" placeholder="Hogepad 9" className={`mt-1.5 ${veld}`}
                />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[7rem_1fr]">
                <label>
                  <span className={label}>Postcode</span>
                  <input
                    value={postcode} onChange={(e) => setPostcode(e.target.value)}
                    autoComplete="postal-code" placeholder="3262 AH" className={`mt-1.5 ${veld}`}
                  />
                </label>
                <label>
                  <span className={label}>Plaats</span>
                  <input
                    value={plaats} onChange={(e) => setPlaats(e.target.value)}
                    autoComplete="address-level2" placeholder="Ouddorp" className={`mt-1.5 ${veld}`}
                  />
                </label>
              </div>
            </div>
          )}

          {volgende()}
          {terug()}
        </>
      )}

      {/* ---- 6. Wensen ---- */}
      {stap === 6 && (
        <>
          <h3 className="text-xl font-semibold text-white">Wat wilt u ons meegeven?</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Uw voorkeur qua bloemen en kleuren helpt ons het meest. Ook wat u juist niet mooi vindt.
          </p>

          <label className="mt-4 block">
            <span className={label}>
              Uw wensen <span className="font-normal text-white/40">optioneel</span>
            </span>
            <textarea
              rows={5} value={wensen} onChange={(e) => setWensen(e.target.value)}
              placeholder={TOELICHTING[soort]}
              className={`mt-1.5 resize-none ${veld}`}
            />
          </label>

          {volgende('Naar het overzicht')}
          {terug()}
        </>
      )}

      {/* ---- 7. Controleren en versturen ---- */}
      {stap === 7 && (
        <>
          <h3 className="text-xl font-semibold text-white">Klopt dit zo?</h3>

          <dl className="mt-4 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/12 bg-white/[0.04] text-sm">
            <Regel naar={1} setStap={setStap} term="Wat">
              {SOORTEN.find((s) => s.id === soort)!.titel}
              <span className="text-white/50"> · {sub}</span>
            </Regel>
            <Regel naar={2} setStap={setStap} term="Levering">
              {levering === 'bezorgen'
                ? 'Bezorgen, in overleg'
                : 'Ophalen in de winkel'}
            </Regel>
            <Regel naar={3} setStap={setStap} term="Wanneer">
              {datum ? datumInWoorden(datum) : <span className="text-white/45">In overleg</span>}
            </Regel>
            <Regel naar={4} setStap={setStap} term="Budget">
              {budget || (
                <span className="text-white/45">Nog niet ingevuld</span>
              )}
            </Regel>
            <Regel naar={5} setStap={setStap} term="Gegevens">
              {[voornaam, achternaam].filter(Boolean).join(' ')}
              <span className="block text-white/50">{email}</span>
              {telefoon && <span className="block text-white/50">{telefoon}</span>}
              {levering === 'bezorgen' && (straat || plaats) && (
                <span className="block text-white/50">
                  {[straat, [postcode, plaats].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
                </span>
              )}
            </Regel>
            <Regel naar={6} setStap={setStap} term="Wensen">
              {wensen || <span className="text-white/45">Geen bijzonderheden</span>}
            </Regel>
          </dl>

          <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-accent/25 bg-accent/[0.07] px-4 py-3 text-sm leading-relaxed text-white/75">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            U krijgt meteen een bevestiging per mail, met alles wat u heeft ingevuld.
          </p>

          {/* Dit formulier is een aanvraag, geen bestelling: er wordt hier niet
              betaald en er ligt dus ook niets vast. Dat hoort te staan waar de
              bezoeker op versturen drukt en niet pas achteraf. */}
          <p className="mt-2.5 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white/60">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
            Nog geen bestelling: die staat pas vast als u het met ons heeft afgesproken en betaald.
          </p>

          {/* Ging het mis, dan is de aanvraag niet weg: hij staat hier nog en
              WhatsApp neemt hem in één klik over. Zonder die knop is een storing
              aan onze kant het einde van een aanvraag waar iemand net vijf
              minuten aan besteedde. Hier stond ook een knop naar de mail; die is
              weg omdat de winkel geen mailadres heeft doorgegeven. */}
          {fout && (
            <div role="alert" className="mt-4 rounded-xl border border-white/20 bg-white/10 px-4 py-4 text-sm text-white">
              <p className="font-semibold">Versturen lukte niet</p>
              <p className="mt-1 leading-relaxed text-white/75">{fout}</p>
              <p className="mt-3 leading-relaxed text-white/75">
                Uw aanvraag staat hier nog. Stuur hem gerust via WhatsApp, dan is hij ook bij ons:
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                <a
                  href={`${WHATSAPP}?text=${encodeURIComponent(tekstVanNu())}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  style={{backgroundColor: WA_GROEN}}
                >
                  <WhatsAppMerk className="h-4 w-4" /> Via WhatsApp
                </a>
              </div>
            </div>
          )}

          <button
            ref={knopRef} type="submit" disabled={bezig}
            className="knop-bloem mt-5 flex w-full items-center justify-center gap-2 bg-roze px-6 py-4 font-semibold text-white transition hover:bg-[#a81f4f] disabled:opacity-60"
          >
            {bezig
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Even geduld</>
              : <><Mail className="h-4 w-4" /> Aanvraag versturen</>}
          </button>
          {terug()}

          <p className="mt-4 text-center text-xs leading-relaxed text-white/40">
            Uw gegevens gebruiken we alleen om uw aanvraag te beantwoorden. Liever meteen contact?{' '}
            <a href={`tel:${TEL}`} className="font-semibold text-white/60 hover:underline">{TEL_DISPLAY}</a>
          </p>
        </>
      )}

      {/* Bellen blijft op elke stap binnen bereik: wie haast heeft moet niet
          eerst zeven stappen door om een telefoonnummer te vinden. */}
      {stap < 7 && (
        <p className="mt-5 border-t border-white/10 pt-4 text-center text-xs text-white/40">
          <a href={`tel:${TEL}`} className="inline-flex items-center gap-1.5 font-semibold text-white/55 hover:underline">
            <Phone className="h-3.5 w-3.5" /> Liever even bellen? {TEL_DISPLAY}
          </a>
        </p>
      )}
    </form>
  );
}

/* Een regel in het overzicht, met een sprong terug naar de stap waar hij
   vandaan komt: bij zeven stappen wil niemand vijf keer op Terug drukken om
   één datum te wijzigen. */
function Regel({
  term, naar, setStap, children,
}: {
  term: string;
  naar: number;
  setStap: (n: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <dt className="w-20 shrink-0 pt-px text-xs font-semibold uppercase tracking-wider text-white/40">{term}</dt>
      <dd className="min-w-0 flex-1 font-medium leading-snug text-white">{children}</dd>
      <button
        type="button"
        onClick={() => setStap(naar)}
        className="shrink-0 pt-px text-xs font-semibold text-accent underline-offset-4 hover:underline"
      >
        Wijzig
      </button>
    </div>
  );
}

const wrapper =
  'rounded-2xl border border-white/12 bg-ink-soft/70 p-5 backdrop-blur-sm sm:p-6';
