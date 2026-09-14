import {useEffect, useRef, useState} from 'react';
import {
  ArrowLeft, ArrowRight, Camera, Check, CircuitBoard, Loader2, MapPin,
  MessageCircle, Plug, Send, Trash2, X,
} from 'lucide-react';
import {trackEvent} from './analytics';
import {PHONE_DISPLAY, useKnopInBeeld, wa} from './ui';

/* ------------------------------------------------------------------ */
/*  Waar de aanvraag heen gaat                                         */
/* ------------------------------------------------------------------ */

/**
 * De Worker uit @jiw/cloudflare-forms (zie worker/index.ts). Die bewaart de
 * foto's in R2, mailt de aanvraag naar Jasper en stuurt de aanvrager een
 * bevestiging in de huisstijl.
 */
const ENDPOINT = '/api/forms/aanvraag';

/**
 * Het verborgen veld waar een bot in trapt. Er staat geen Turnstile op deze
 * pagina; dit veld doet het werk. Een bezoeker ziet het niet en laat het leeg,
 * een bot vult alles in, en wat er mét dit veld binnenkomt wordt zonder spoor
 * weggegooid.
 */
const HONEYPOT = 'bedrijf';

/* ------------------------------------------------------------------ */
/*  Dutch address lookup                                               */
/* ------------------------------------------------------------------ */

/**
 * PDOK Locatieserver: the government's own address register. Free, keyless and
 * CORS-open, so postcode plus huisnummer resolves to the real street and town
 * straight from the browser. Nobody types their street name.
 */
const PDOK = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free';

type Adres = {straat: string; plaats: string; postcode: string; nummer: string; toevoeging: string};

/**
 * De toevoeging (bus, letter, hoog/laag) zit niet in de zoekvraag: straat en
 * plaats zijn voor elke toevoeging op hetzelfde huisnummer gelijk, en meezoeken
 * zou een adres dat PDOK net anders schrijft ten onrechte afkeuren. Wat de
 * bezoeker intikt gaat wel mee in het gevonden adres, want dat is wat op de
 * envelop hoort te staan.
 */
async function zoekAdres(
  postcode: string, nummer: string, toevoeging: string, signal: AbortSignal,
): Promise<Adres | null> {
  const pc = postcode.replace(/\s+/g, '').toUpperCase();
  const nr = nummer.trim();
  const params = new URLSearchParams({
    q: '*',
    rows: '1',
    fl: 'straatnaam,huis_nlt,postcode,woonplaatsnaam',
  });
  params.append('fq', 'type:adres');
  params.append('fq', `postcode:${pc}`);
  params.append('fq', `huisnummer:${parseInt(nr, 10)}`);

  const res = await fetch(`${PDOK}?${params}`, {signal});
  if (!res.ok) throw new Error('lookup mislukt');
  const doc = (await res.json())?.response?.docs?.[0];
  if (!doc) return null;
  return {
    straat: doc.straatnaam, plaats: doc.woonplaatsnaam, postcode: doc.postcode,
    nummer: nr, toevoeging: toevoeging.trim(),
  };
}

/** Huisnummer plus toevoeging als één regel, zonder losse spatie als hij leeg is. */
const nummerVoluit = (a: {nummer: string; toevoeging: string}) =>
  `${a.nummer}${a.toevoeging ? ` ${a.toevoeging}` : ''}`;

const POSTCODE_OK = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/;

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const KLUSSEN = [
  {
    id: 'groepenkast',
    img: '/img/groepenkast-nieuw.jpg',
    icon: CircuitBoard,
    titel: 'Groepenkast',
    onder: 'Vervangen, uitbreiden of verzwaren',
  },
  {
    id: 'laadpaal',
    img: '/img/laadpaal-detail.jpg',
    icon: Plug,
    titel: 'Laadpaal',
    onder: 'Thuis laden, compleet aangesloten',
  },
] as const;

type KlusId = (typeof KLUSSEN)[number]['id'];

const SUBKEUZE: Record<KlusId, string[]> = {
  groepenkast: ['Hele groepenkast vervangen', 'Groepen bijplaatsen', 'Verzwaren naar 3-fase', 'Weet ik nog niet'],
  laadpaal: ['Zaptec Go 2', 'Enphase IQ EV Charger 2', 'Alfen Eve Single Pro-line', 'Advies, ik twijfel nog'],
};

const MAX_FOTOS = 6;

/* ------------------------------------------------------------------ */
/*  Form                                                               */
/* ------------------------------------------------------------------ */

type Foto = {file: File; url: string};

export default function Aanvraag({compact = false}: {compact?: boolean}) {
  const [stap, setStap] = useState<1 | 2 | 3>(1);

  const [klus, setKlus] = useState<KlusId>('groepenkast');
  const [sub, setSub] = useState<string>(SUBKEUZE.groepenkast[0]);
  const [postcode, setPostcode] = useState('');
  const [nummer, setNummer] = useState('');
  const [toevoeging, setToevoeging] = useState('');
  const [adres, setAdres] = useState<Adres | null>(null);
  const [zoeken, setZoeken] = useState(false);
  const [adresFout, setAdresFout] = useState<string | null>(null);

  const [voornaam, setVoornaam] = useState('');
  const [achternaam, setAchternaam] = useState('');
  const [email, setEmail] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [toelichting, setToelichting] = useState('');
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  /* De hoofdknop van deze stap meldt zich aan, zodat de vaste balk onderaan
     op mobiel wegblijft zolang deze knop zichtbaar is. */
  const knopRef = useKnopInBeeld<HTMLButtonElement>(stap);

  /* Address lookup, debounced so typing a postcode does not fire six requests. */
  useEffect(() => {
    setAdres(null);
    setAdresFout(null);
    if (!POSTCODE_OK.test(postcode) || !/^\d+/.test(nummer.trim())) return;

    const ctrl = new AbortController();
    setZoeken(true);
    const t = setTimeout(async () => {
      try {
        const gevonden = await zoekAdres(postcode, nummer, toevoeging, ctrl.signal);
        if (gevonden) setAdres(gevonden);
        else setAdresFout('Dit adres kennen we niet. Controleer postcode en huisnummer.');
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setAdresFout('Adres opzoeken lukt even niet. U kunt gewoon verder.');
        }
      } finally {
        setZoeken(false);
      }
    }, 450);

    return () => {
      ctrl.abort();
      clearTimeout(t);
      setZoeken(false);
    };
  }, [postcode, nummer, toevoeging]);

  /* Previews are object URLs: revoke them so a long session does not leak. */
  useEffect(() => () => fotos.forEach((f) => URL.revokeObjectURL(f.url)), []);

  const kiesKlus = (id: KlusId) => {
    setKlus(id);
    setSub(SUBKEUZE[id][0]);
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, MAX_FOTOS - fotos.length)
      .map((f) => ({file: f, url: URL.createObjectURL(f)}));
    setFotos((prev) => [...prev, ...next]);
  };

  const removeFoto = (i: number) => {
    setFotos((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const stap1Klaar = Boolean(adres) || (POSTCODE_OK.test(postcode) && nummer.trim() !== '' && Boolean(adresFout));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFout(null);
    setBezig(true);

    /* Het adres zoals PDOK het teruggaf. Kende PDOK het niet, dan gaat door wat
       de bezoeker zelf intikte: een postcode plus huisnummer waar de bezorger
       de weg mee vindt is meer waard dan een leeg veld. */
    const gevonden = adres ?? {
      straat: '', plaats: '',
      postcode: postcode.replace(/\s+/g, ' ').trim().toUpperCase(),
      nummer: nummer.trim(), toevoeging: toevoeging.trim(),
    };
    const straatregel = [gevonden.straat, nummerVoluit(gevonden)].filter(Boolean).join(' ');
    const plaatsregel = [gevonden.postcode, gevonden.plaats].filter(Boolean).join(' ');

    /* Het pakket kent drie namen van zichzelf: firstName, lastName en email. De
       rest komt door onder de naam die worker/index.ts noemt bij emailFields;
       wat daar niet in staat, staat ook niet in de mail. */
    const body = new FormData();
    body.set('firstName', voornaam.trim());
    body.set('lastName', achternaam.trim());
    body.set('email', email.trim());
    body.set('telefoon', telefoon.trim());
    body.set('klus', KLUSSEN.find((k) => k.id === klus)!.titel);
    body.set('keuze', sub);
    body.set('adres', [straatregel, plaatsregel].filter(Boolean).join(', '));
    body.set('plaats', gevonden.plaats);
    body.set('toelichting', toelichting.trim());
    /* Leeg meesturen, zodat het bij een echte bezoeker altijd leeg is en niet
       toevallig afwezig. */
    body.set(HONEYPOT, '');
    fotos.forEach((f) => body.append('files', f.file, f.file.name));

    try {
      const res = await fetch(ENDPOINT, {method: 'POST', body});
      const antwoord = (await res.json().catch(() => null)) as {ok?: boolean; message?: string} | null;
      /* Alleen door bij een echt geslaagde verzending: een bezoeker mag geen
         bevestigingsscherm zien voor een aanvraag die nergens aankwam. */
      if (!res.ok || !antwoord?.ok) {
        throw new Error(antwoord?.message ?? 'De aanvraag kon niet worden verstuurd.');
      }
      setStap(3);
      trackEvent('generate_lead', 'form');
    } catch (err) {
      setFout(
        err instanceof Error && err.message
          ? err.message
          : 'Versturen lukte niet. Probeer het nog eens, of app me direct.',
      );
      console.error('[aanvraag]', err);
    } finally {
      setBezig(false);
    }
  };

  const veld =
    'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/35 ' +
    'outline-none transition focus:border-accent focus:bg-white/10';
  const label = 'block text-sm font-semibold text-white/80';

  /* ---------------------------------------------------------------- */

  if (stap === 3) {
    return (
      <div className={wrapper(compact)}>
        <div className="py-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-ink">
            <Check className="h-7 w-7" strokeWidth={3} />
          </span>
          <h3 className="mt-5 text-2xl font-semibold text-white">Aanvraag staat klaar</h3>
          <p className="mx-auto mt-3 max-w-sm leading-relaxed text-white/65">
            Bedankt{voornaam.trim() ? ` ${voornaam.trim()}` : ''}. U hoort binnen één werkdag wat het kost
            en wanneer ik kan.
          </p>

          <div className="mx-auto mt-6 max-w-sm rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left text-sm">
            <p className="text-white/50">Uw aanvraag</p>
            <p className="mt-1 font-semibold text-white">{sub}</p>
            {adres && (
              <p className="mt-0.5 text-white/65">
                {adres.straat} {nummerVoluit(adres)}, {adres.postcode} {adres.plaats}
              </p>
            )}
            {fotos.length > 0 && (
              <p className="mt-1 text-white/50">
                <span className="data">{fotos.length}</span> foto{fotos.length > 1 ? "'s" : ''} meegestuurd
              </p>
            )}
          </div>

          <a
            href={wa('Hallo Jasper, ik heb net een aanvraag via de site gestuurd.')}
            target="_blank" rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:underline"
          >
            <MessageCircle className="h-4 w-4" /> Liever meteen contact? App me
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
              className={`data grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                stap >= n ? 'bg-accent text-ink' : 'bg-white/10 text-white/40'
              }`}
            >
              {stap > n ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : n}
            </span>
            <span className={`text-xs font-semibold ${stap >= n ? 'text-white' : 'text-white/40'}`}>
              {n === 1 ? 'De klus' : 'Uw gegevens'}
            </span>
            {n === 1 && <span className={`h-px flex-1 transition ${stap > 1 ? 'bg-accent/60' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      {stap === 1 ? (
        <>
          <h3 className="text-xl font-semibold text-white">Waar kan ik u mee helpen?</h3>

          {/* Keuzetabs met beeld: in één blik zichtbaar waartussen u kiest. */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {KLUSSEN.map((k) => {
              const actief = klus === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => kiesKlus(k.id)}
                  aria-pressed={actief}
                  className={`group overflow-hidden rounded-xl border text-left transition ${
                    actief
                      ? 'border-accent bg-accent/[0.12] ring-1 ring-accent/60'
                      : 'border-white/15 bg-white/[0.04] hover:border-accent/40 hover:bg-accent/[0.05]'
                  }`}
                >
                  <span className="relative block">
                    <img
                      src={k.img}
                      alt=""
                      className={`h-20 w-full object-cover transition sm:h-24 ${actief ? '' : 'opacity-60 saturate-[0.25] group-hover:opacity-90 group-hover:saturate-100'}`}
                    />
                    {actief && (
                      <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-accent text-ink">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-2 px-3 pb-3 pt-2.5">
                    <k.icon className={`h-4 w-4 shrink-0 ${actief ? 'text-accent' : 'text-white/50'}`} />
                    <span>
                      <span className="block text-sm font-bold leading-tight text-white">{k.titel}</span>
                      <span className="mt-0.5 block text-[11px] leading-tight text-white/45">{k.onder}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <label className="mt-5 block">
            <span className={label}>Wat wilt u precies?</span>
            <select value={sub} onChange={(e) => setSub(e.target.value)} className={`mt-1.5 ${veld}`}>
              {SUBKEUZE[klus].map((o) => <option key={o} className="bg-ink">{o}</option>)}
            </select>
          </label>

          {/* Postcode krijgt de meeste ruimte, de toevoeging de minste: die is
              optioneel en zelden langer dan twee tekens. */}
          <div className="mt-4 grid grid-cols-[1.35fr_0.8fr_0.85fr] gap-2.5 sm:gap-3">
            <label className="min-w-0">
              <span className={label}>Postcode</span>
              <input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="4811 DL"
                autoComplete="postal-code"
                maxLength={7}
                className={`data mt-1.5 uppercase ${veld}`}
              />
            </label>
            <label className="min-w-0">
              <span className={label}>Huisnr.</span>
              <input
                value={nummer}
                onChange={(e) => setNummer(e.target.value)}
                placeholder="10"
                inputMode="numeric"
                autoComplete="address-line1"
                className={`data mt-1.5 ${veld}`}
              />
            </label>
            <label className="min-w-0">
              {/* Het hele woord past pas als de kolom breed genoeg is; op een
                  smal scherm zou het afgekapt worden tot "Toev. o...". */}
              <span className={label}>
                <span className="sm:hidden">Toev.</span>
                <span className="hidden sm:inline">Toevoeging</span>
              </span>
              <input
                value={toevoeging}
                onChange={(e) => setToevoeging(e.target.value)}
                placeholder="A"
                maxLength={6}
                autoComplete="address-line2"
                aria-label="Toevoeging huisnummer, optioneel"
                className={`data mt-1.5 ${veld}`}
              />
            </label>
          </div>

          {/* Resultaat van de adrescheck */}
          <div className="mt-3 min-h-[2.75rem]">
            {zoeken && (
              <p className="flex items-center gap-2 text-sm text-white/50">
                <Loader2 className="h-4 w-4 animate-spin text-accent" /> Adres opzoeken
              </p>
            )}
            {!zoeken && adres && (
              <p className="flex items-start gap-2.5 rounded-xl border border-accent/40 bg-accent/[0.10] px-3.5 py-2.5 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-white">
                  {adres.straat} {nummerVoluit(adres)}
                  <span className="block text-white/55">
                    <span className="data">{adres.postcode}</span> {adres.plaats}
                  </span>
                </span>
              </p>
            )}
            {!zoeken && adresFout && (
              <p className="flex items-start gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/60">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                {adresFout}
              </p>
            )}
          </div>

          <button
            ref={knopRef}
            type="button"
            onClick={() => setStap(2)}
            disabled={!stap1Klaar}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-semibold text-ink transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-accent/25 disabled:text-white/55"
          >
            Volgende <ArrowRight className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-white">Waar mag ik de prijs naartoe sturen?</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label>
              <span className={label}>Voornaam</span>
              <input
                required value={voornaam} onChange={(e) => setVoornaam(e.target.value)}
                autoComplete="given-name" placeholder="Jasper" className={`mt-1.5 ${veld}`}
              />
            </label>
            <label>
              <span className={label}>Achternaam</span>
              <input
                required value={achternaam} onChange={(e) => setAchternaam(e.target.value)}
                autoComplete="family-name" placeholder="de Vries" className={`mt-1.5 ${veld}`}
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
                required value={telefoon} onChange={(e) => setTelefoon(e.target.value)}
                autoComplete="tel" inputMode="tel" placeholder="06 12345678"
                className={`data mt-1.5 ${veld}`}
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className={label}>
              Iets wat ik moet weten? <span className="font-normal text-white/40">optioneel</span>
            </span>
            <textarea
              rows={3} value={toelichting} onChange={(e) => setToelichting(e.target.value)}
              placeholder={klus === 'laadpaal'
                ? 'Bijvoorbeeld welke auto u rijdt, of u zonnepanelen heeft, en hoe ver de meterkast van de oprit af ligt'
                : 'Bijvoorbeeld hoeveel groepen u nu heeft, of de aardlek eruit vliegt, en wanneer het u schikt'}
              className={`mt-1.5 resize-none ${veld}`}
            />
          </label>

          <div className="mt-5">
            <p className={label}>
              Foto van uw meterkast <span className="font-normal text-white/40">optioneel</span>
            </p>
            <input
              ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => {addFiles(e.target.files); e.target.value = '';}}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={fotos.length >= MAX_FOTOS}
              className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 px-4 py-5 text-sm font-semibold text-white/60 transition hover:border-accent/60 hover:bg-accent/[0.06] hover:text-white disabled:opacity-40"
            >
              <Camera className="h-4 w-4 text-accent" />
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

          {fout && <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-white">{fout}</p>}

          <div className="mt-6 flex gap-3">
            <button
              type="button" onClick={() => setStap(1)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-5 py-4 text-sm font-semibold text-white/70 transition hover:border-white/50 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Terug
            </button>
            <button
              ref={knopRef} type="submit" disabled={bezig}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-semibold text-ink transition hover:bg-accent-dark disabled:opacity-60"
            >
              {bezig
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Versturen</>
                : <><Send className="h-4 w-4" /> Aanvraag versturen</>}
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-white/40">
            Uw gegevens gebruik ik alleen om u een prijs te sturen. Bellen kan ook:{' '}
            <span className="data">{PHONE_DISPLAY}</span>
          </p>
        </>
      )}
    </form>
  );
}

const wrapper = (compact: boolean) =>
  `rounded-2xl border border-accent/25 bg-ink-soft/70 p-5 backdrop-blur-sm sm:p-6 ${
    compact ? '' : 'shadow-[0_25px_60px_-20px_rgb(69_214_47_/_0.35)]'
  }`;
