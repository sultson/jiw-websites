import {useEffect, useRef, useState} from 'react';
import {
  ArrowLeft, ArrowRight, Camera, Check, Coins, Layers, Loader2, MapPin, Phone,
  Send, Sparkles, Trash2, Truck,
} from 'lucide-react';
import {GEMEENTES, TEL, TEL_TEKST, useKnopInBeeld} from './ui';

/* ------------------------------------------------------------------ */
/*  Waar de aanvraag heen gaat                                         */
/* ------------------------------------------------------------------ */

/**
 * Het adres van de Worker in worker/index.ts. In het concept stond hier een
 * lege string en bewaarde het formulier de aanvraag in localStorage: er was
 * nog geen ontvanger. Sinds 01-11-2026 is die er wel.
 */
const ENDPOINT = '/api/forms/aanvraag';

/* ------------------------------------------------------------------ */
/*  Inhoud                                                             */
/* ------------------------------------------------------------------ */

const OPDRACHTEN = [
  {
    id: 'opruiming',
    img: '/img/dienst-ontruiming.webp',
    icon: Truck,
    titel: 'Leegmaken',
    onder: 'Woning, kelder of kantoor',
  },
  {
    id: 'opkoop',
    img: '/img/opkoop-kast.webp',
    icon: Coins,
    titel: 'Opkopen',
    onder: 'Volledige of gedeeltelijke inboedel',
  },
  {
    id: 'schoonmaak',
    img: '/img/dienst-schoonmaak.webp',
    icon: Sparkles,
    titel: 'Schoonmaak',
    onder: 'Borstelschoon of instapklaar',
  },
] as const;

type OpdrachtId = (typeof OPDRACHTEN)[number]['id'];

const ALLE_IDS = OPDRACHTEN.map((o) => o.id) as OpdrachtId[];

const PANDEN: Record<OpdrachtId, string[]> = {
  opruiming: [
    'Volledige woning',
    'Appartement',
    'Enkel kelder, zolder of garage',
    'Kantoor of handelspand',
    'Weet ik nog niet',
  ],
  opkoop: [
    'Volledige inboedel',
    'Deel van de inboedel',
    'Losse stukken met waarde',
    'Weet ik nog niet',
  ],
  schoonmaak: [
    'Borstelschoon opleveren',
    'Grondig schoonmaken voor instap',
    'Schoonmaak met schilderwerk',
    'Weet ik nog niet',
  ],
};

const TERMIJNEN = ['Zo snel mogelijk', 'Binnen een maand', 'Over enkele maanden', 'Nog niet bekend'];

const MAX_FOTOS = 6;

/* Groter dan dit wordt de foto voor het versturen teruggebracht. Een
   telefoonfoto is al gauw vier megabyte, en zes daarvan op een mobiele
   verbinding is een upload waar mensen halverwege mee stoppen. Op 1600 pixels
   is op een scherm nog alles te zien wat er voor een schatting toe doet. */
const FOTO_MAX_ZIJDE = 1600;

/* ------------------------------------------------------------------ */
/*  Foto's lichter maken                                               */
/* ------------------------------------------------------------------ */

/**
 * Tekent de foto op een canvas van hooguit FOTO_MAX_ZIJDE en levert hem terug
 * als jpeg. Lukt dat niet (een hele oude browser, of een bestandstype dat de
 * browser niet kan tekenen), dan gaat het origineel mee: liever een zware
 * upload dan geen foto.
 */
async function lichter(bestand: File): Promise<File> {
  if (!bestand.type.startsWith('image/')) return bestand;

  try {
    const beeld = await createImageBitmap(bestand);
    const schaal = Math.min(1, FOTO_MAX_ZIJDE / Math.max(beeld.width, beeld.height));
    if (schaal === 1 && bestand.size < 1_500_000) {
      beeld.close();
      return bestand;
    }

    const doek = document.createElement('canvas');
    doek.width = Math.round(beeld.width * schaal);
    doek.height = Math.round(beeld.height * schaal);
    const pen = doek.getContext('2d');
    if (!pen) return bestand;
    pen.drawImage(beeld, 0, 0, doek.width, doek.height);
    beeld.close();

    const blob: Blob | null = await new Promise((klaar) => doek.toBlob(klaar, 'image/jpeg', 0.82));
    if (!blob || blob.size >= bestand.size) return bestand;

    return new File([blob], bestand.name.replace(/\.[^.]+$/, '') + '.jpg', {type: 'image/jpeg'});
  } catch {
    return bestand;
  }
}

/* ------------------------------------------------------------------ */
/*  Formulier                                                          */
/* ------------------------------------------------------------------ */

type Foto = {file: File; url: string};

export default function Aanvraag({compact = false}: {compact?: boolean}) {
  const [stap, setStap] = useState<1 | 2 | 3>(1);

  /* Meerdere opdrachten mogen samen: veel aanvragen zijn leegmaken plus opkoop
     plus schoonmaak in een keer. Per gekozen opdracht houden we het antwoord
     op de vervolgvraag apart bij. */
  const [opdrachten, setOpdrachten] = useState<OpdrachtId[]>(['opruiming']);
  const [keuzes, setKeuzes] = useState<Record<OpdrachtId, string>>({
    opruiming: PANDEN.opruiming[0],
    opkoop: PANDEN.opkoop[0],
    schoonmaak: PANDEN.schoonmaak[0],
  });
  const [gemeente, setGemeente] = useState('');
  const [postcode, setPostcode] = useState('');

  const [voornaam, setVoornaam] = useState('');
  const [achternaam, setAchternaam] = useState('');
  const [email, setEmail] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [termijn, setTermijn] = useState(TERMIJNEN[0]);
  const [toelichting, setToelichting] = useState('');
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  /* De hoofdknop van deze stap meldt zich aan, zodat de vaste balk onderaan op
     mobiel wegblijft zolang deze knop zichtbaar is. */
  const knopRef = useKnopInBeeld<HTMLButtonElement>(stap);

  /* Gemeente gekozen uit de lijst: postcode vult zichzelf in. Buiten de lijst
     mag ook, dan typt u hem zelf. */
  const gekend = GEMEENTES.find(([n]) => n.toLowerCase() === gemeente.trim().toLowerCase());
  useEffect(() => {
    if (gekend) setPostcode(gekend[1]);
  }, [gekend?.[0]]);

  /* Previews zijn object-URLs: netjes vrijgeven zodat een lange sessie niet lekt. */
  useEffect(() => () => fotos.forEach((f) => URL.revokeObjectURL(f.url)), []);

  /* Aan- en uitzetten, maar nooit tot nul: zonder opdracht valt er niets te
     vragen. De volgorde blijft die van de tegels, niet die van het aanklikken. */
  const wissel = (id: OpdrachtId) =>
    setOpdrachten((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((x) => x !== id) : prev
        : ALLE_IDS.filter((x) => prev.includes(x) || x === id),
    );

  const allesSamen = opdrachten.length === ALLE_IDS.length;

  const addFiles = async (list: FileList | null) => {
    if (!list) return;
    const ruimte = MAX_FOTOS - fotos.length;
    const gekozen = Array.from(list).filter((f) => f.type.startsWith('image/')).slice(0, ruimte);
    const klaar = await Promise.all(gekozen.map(lichter));
    setFotos((prev) => [...prev, ...klaar.map((f) => ({file: f, url: URL.createObjectURL(f)}))]);
  };

  const removeFoto = (i: number) => {
    setFotos((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const stap1Klaar = gemeente.trim().length > 1 && /^\d{4}$/.test(postcode.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFout(null);
    setBezig(true);

    /**
     * Het pakket verwacht FormData en kent drie namen van zichzelf: firstName,
     * lastName en email. De rest komt door onder de naam die hier gegeven
     * wordt, en wordt in worker/index.ts op volgorde en van een label voorzien.
     *
     * De gekozen opdrachten gaan als een samengevoegde tekst mee en niet als
     * drie velden met dezelfde naam: het pakket leest FormData een keer per
     * sleutel, dus van drie velden `opdracht` zou er een overblijven.
     */
    const data = new FormData();
    data.set('firstName', voornaam.trim());
    data.set('lastName', achternaam.trim());
    data.set('email', email.trim());
    data.set('telefoon', telefoon.trim());
    data.set('opdracht', opdrachten.map((id) => OPDRACHTEN.find((o) => o.id === id)!.titel).join(', '));
    data.set(
      'details',
      opdrachten
        .map((id) => `${OPDRACHTEN.find((o) => o.id === id)!.titel}: ${keuzes[id]}`)
        .join(' | '),
    );
    data.set('gemeente', gemeente.trim());
    data.set('postcode', postcode.trim());
    data.set('termijn', termijn);
    data.set('toelichting', toelichting.trim());
    for (const f of fotos) data.append('files', f.file, f.file.name);

    try {
      const res = await fetch(ENDPOINT, {method: 'POST', body: data});
      const antwoord = await res.json().catch(() => null);
      if (!res.ok || !antwoord?.ok) {
        throw new Error(antwoord?.message ?? `server gaf ${res.status}`);
      }
      setStap(3);
    } catch (err) {
      /* De melding van de server zelf als die er is: die weet welk veld er
         ontbreekt, en "probeer het nog eens" helpt dan niemand. */
      setFout(
        err instanceof Error && err.message && !/^server gaf/.test(err.message)
          ? err.message
          : 'Versturen lukte niet. Probeer het nog eens, of bel ons gerust.',
      );
      console.error('[aanvraag]', err);
    } finally {
      setBezig(false);
    }
  };

  const veld =
    'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/35 ' +
    'outline-none transition focus:border-gold focus:bg-white/10';
  const label = 'block text-sm font-semibold text-white/80';

  /* ---------------------------------------------------------------- */

  if (stap === 3) {
    return (
      <div className={wrapper(compact)}>
        <div className="py-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-ink">
            <Check className="h-7 w-7" strokeWidth={3} />
          </span>
          <h3 className="mt-5 text-2xl font-semibold text-white">Uw aanvraag is verstuurd</h3>
          <p className="mx-auto mt-3 max-w-sm leading-relaxed text-white/65">
            Bedankt {voornaam.trim()}. U krijgt een bevestiging per mail. We nemen binnen 24 uur
            contact op om een plaatsbezoek in te plannen.
          </p>

          <div className="mx-auto mt-6 max-w-sm rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left text-sm">
            <p className="text-white/50">Wat u aanvroeg</p>
            {opdrachten.map((id) => (
              <p key={id} className="mt-1 font-semibold text-white">
                {OPDRACHTEN.find((o) => o.id === id)!.titel}
                <span className="font-normal text-white/60"> {keuzes[id].toLowerCase()}</span>
              </p>
            ))}
            <p className="mt-1.5 flex items-center gap-1.5 text-white/65">
              <MapPin className="h-3.5 w-3.5" /> {postcode} {gemeente}
            </p>
            {fotos.length > 0 && (
              <p className="mt-1 text-white/50">
                {fotos.length} foto{fotos.length > 1 ? "'s" : ''} meegestuurd
              </p>
            )}
          </div>

          <a
            href={`tel:${TEL}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:underline"
          >
            <Phone className="h-4 w-4" /> Liever meteen iemand spreken? {TEL_TEKST}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={wrapper(compact)}>
      {/* Stapindicator */}
      <div className="mb-6 flex items-center gap-3">
        {[1, 2].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2.5">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums transition ${
                stap >= n ? 'bg-gold text-ink' : 'bg-white/10 text-white/40'
              }`}
            >
              {stap > n ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : n}
            </span>
            <span className={`text-xs font-semibold ${stap >= n ? 'text-white' : 'text-white/40'}`}>
              {n === 1 ? 'De opdracht' : 'Uw gegevens'}
            </span>
            {n === 1 && <span className={`h-px flex-1 transition ${stap > 1 ? 'bg-gold/60' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      {/* Verborgen veld tegen bots. Een bezoeker ziet het niet en vult het dus
          nooit in; een bot vult alles wat hij tegenkomt. Wat ermee binnenkomt
          wordt zonder spoor weggegooid (zie honeypotField in worker/index.ts). */}
      <input
        type="text" name="bedrijf" tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      {stap === 1 ? (
        <>
          <h3 className="text-xl font-semibold text-white">Waar mogen we mee helpen?</h3>
          <p className="mt-1 text-sm text-white/50">Meerdere mag, ook alle drie samen.</p>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {OPDRACHTEN.map((k) => {
              const actief = opdrachten.includes(k.id);
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => wissel(k.id)}
                  aria-pressed={actief}
                  className={`group overflow-hidden rounded-xl border text-left transition ${
                    actief
                      ? 'border-gold bg-gold/[0.12] ring-1 ring-gold/60'
                      : 'border-white/15 bg-white/[0.04] hover:border-gold/40 hover:bg-gold/[0.05]'
                  }`}
                >
                  <span className="relative block">
                    <img
                      src={k.img}
                      alt=""
                      loading="lazy"
                      className={`h-16 w-full object-cover transition sm:h-20 ${
                        actief ? '' : 'opacity-55 saturate-[0.25] group-hover:opacity-90 group-hover:saturate-100'
                      }`}
                    />
                    {actief && (
                      <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-gold text-ink">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                  </span>
                  <span className="block px-2 pb-2.5 pt-2 sm:px-2.5">
                    <k.icon className={`mb-1 h-4 w-4 ${actief ? 'text-gold' : 'text-white/50'}`} />
                    {/* Op 390px is een derde kolom nog geen 80px breed: Schoonmaak
                        past daar alleen een maat kleiner op een regel. */}
                    <span className="block whitespace-nowrap text-xs font-bold leading-tight text-white sm:whitespace-normal sm:text-sm">
                      {k.titel}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-tight text-white/45">{k.onder}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setOpdrachten(ALLE_IDS)}
            aria-pressed={allesSamen}
            className={`mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              allesSamen
                ? 'border-gold bg-gold/[0.12] text-white'
                : 'border-white/15 bg-white/[0.04] text-white/70 hover:border-gold/40 hover:text-white'
            }`}
          >
            {allesSamen
              ? <><Check className="h-4 w-4 text-gold" strokeWidth={3} /> Alle drie samen</>
              : <><Layers className="h-4 w-4 text-gold" /> Ik wil alle drie samen</>}
          </button>

          {opdrachten.map((id) => {
            const k = OPDRACHTEN.find((o) => o.id === id)!;
            return (
              <label key={id} className="mt-4 block">
                <span className={label}>
                  {opdrachten.length > 1 ? `${k.titel}: waar gaat het over?` : 'Waar gaat het over?'}
                </span>
                <select
                  value={keuzes[id]}
                  onChange={(e) => setKeuzes((prev) => ({...prev, [id]: e.target.value}))}
                  className={`mt-1.5 ${veld}`}
                >
                  {PANDEN[id].map((o) => <option key={o} className="bg-ink">{o}</option>)}
                </select>
              </label>
            );
          })}

          <div className="mt-4 grid grid-cols-[1.6fr_1fr] gap-3">
            <label>
              <span className={label}>Gemeente</span>
              <input
                value={gemeente}
                onChange={(e) => setGemeente(e.target.value)}
                list="gemeentes"
                placeholder="Boechout"
                autoComplete="address-level2"
                className={`mt-1.5 ${veld}`}
              />
              <datalist id="gemeentes">
                {GEMEENTES.map(([n, pc]) => <option key={n} value={n}>{pc}</option>)}
              </datalist>
            </label>
            <label>
              <span className={label}>Postcode</span>
              <input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="2530"
                inputMode="numeric"
                autoComplete="postal-code"
                className={`mt-1.5 tabular-nums ${veld}`}
              />
            </label>
          </div>

          <div className="mt-3 min-h-[2.75rem]">
            {gekend && (
              <p className="flex items-start gap-2.5 rounded-xl border border-gold/40 bg-gold/[0.10] px-3.5 py-2.5 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-white">
                  {gekend[0]}
                  <span className="block text-white/55">Ligt in ons werkgebied</span>
                </span>
              </p>
            )}
            {!gekend && gemeente.trim().length > 1 && (
              <p className="rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/60">
                Buiten de gemeentes hieronder komen we ook, laat gerust weten waar het is.
              </p>
            )}
          </div>

          <button
            ref={knopRef}
            type="button"
            onClick={() => setStap(2)}
            disabled={!stap1Klaar}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 font-semibold text-ink transition hover:bg-[#e0bd70] disabled:cursor-not-allowed disabled:bg-gold/25 disabled:text-white/55"
          >
            Volgende <ArrowRight className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-white">Hoe bereiken we u?</h3>

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
                autoComplete="email" placeholder="naam@voorbeeld.be" className={`mt-1.5 ${veld}`}
              />
            </label>
            <label>
              <span className={label}>Telefoon</span>
              <input
                required value={telefoon} onChange={(e) => setTelefoon(e.target.value)}
                autoComplete="tel" inputMode="tel" placeholder="0470 12 34 56"
                className={`mt-1.5 tabular-nums ${veld}`}
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className={label}>Wanneer moet het klaar zijn?</span>
            <select value={termijn} onChange={(e) => setTermijn(e.target.value)} className={`mt-1.5 ${veld}`}>
              {TERMIJNEN.map((o) => <option key={o} className="bg-ink">{o}</option>)}
            </select>
          </label>

          <label className="mt-4 block">
            <span className={label}>
              Iets wat we moeten weten? <span className="font-normal text-white/40">optioneel</span>
            </span>
            <textarea
              rows={3} value={toelichting} onChange={(e) => setToelichting(e.target.value)}
              placeholder="Bijvoorbeeld hoeveel verdiepingen, of er een lift is, en wat er zeker moet blijven"
              className={`mt-1.5 resize-none ${veld}`}
            />
          </label>

          <div className="mt-5">
            <p className={label}>
              Foto's van de ruimtes <span className="font-normal text-white/40">optioneel</span>
            </p>
            <p className="mt-1 text-xs text-white/45">
              Met beeld erbij kunnen we vaak al een richting geven voor we langskomen.
            </p>
            <input
              ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => {void addFiles(e.target.files); e.target.value = '';}}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={fotos.length >= MAX_FOTOS}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 px-4 py-5 text-sm font-semibold text-white/60 transition hover:border-gold/60 hover:bg-gold/[0.06] hover:text-white disabled:opacity-40"
            >
              <Camera className="h-4 w-4 text-gold" />
              {fotos.length >= MAX_FOTOS
                ? `Maximum van ${MAX_FOTOS} bereikt`
                : fotos.length ? 'Nog een foto toevoegen' : 'Kies of maak een foto'}
            </button>

            {fotos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {fotos.map((f, i) => (
                  <div key={f.url} className="relative overflow-hidden rounded-lg border border-white/15">
                    <img src={f.url} alt={f.file.name} className="h-20 w-full object-cover" />
                    <button
                      type="button" onClick={() => removeFoto(i)} aria-label="Foto verwijderen"
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-md bg-ink/80 text-white/70 transition hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {fout && (
            <p role="alert" className="mt-4 rounded-xl border border-gold/40 bg-white/10 px-4 py-3 text-sm text-white">
              {fout}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button" onClick={() => setStap(1)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-5 py-4 text-sm font-semibold text-white/70 transition hover:border-white/50 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Terug
            </button>
            <button
              ref={knopRef} type="submit" disabled={bezig}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 font-semibold text-ink transition hover:bg-[#e0bd70] disabled:opacity-60"
            >
              {bezig
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Versturen</>
                : <><Send className="h-4 w-4" /> Gratis offerte aanvragen</>}
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-white/40">
            Uw gegevens gebruiken we alleen om u een prijs te bezorgen. Bellen mag ook:{' '}
            <a href={`tel:${TEL}`} className="tabular-nums underline-offset-2 hover:underline">{TEL_TEKST}</a>
          </p>
        </>
      )}
    </form>
  );
}

const wrapper = (compact: boolean) =>
  `relative rounded-2xl border border-gold/25 bg-ink-soft/80 p-5 backdrop-blur-sm sm:p-6 ${
    compact ? '' : 'shadow-[0_25px_60px_-20px_rgb(209_169_87_/_0.30)]'
  }`;
