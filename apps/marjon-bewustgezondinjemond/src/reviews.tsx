import {ArrowLeft, ExternalLink, PenLine, TriangleAlert} from 'lucide-react';
import {Bloem} from './bloem';
import {ga} from './specialisaties';
import {useKop} from './kop';
import {HAAR_NAAM} from '../site.config.mjs';

export const REVIEWS_PAD = '/reviews-voorbeeld';

/* Haar bedrijfsprofiel, opgezocht via de Places API en niet gegokt:
   "Mondhygienepraktijk Marjon Ooteman", Vliedlaan 66 Schagen, telefoon
   06 20594924 (hetzelfde nummer als op deze site).

   Twee dingen kloppen er op dit moment niet, en die staan ook groot op deze
   pagina: het profiel staat bij Google als PERMANENT GESLOTEN, en er staat
   nul reviews op. Alles hieronder is dus voorbeeldtekst. */
const PLAATS_ID = 'ChIJL8YVAxZOz0cR7EShH9fdbj0';
export const GBP_BEKIJK = `https://www.google.com/maps/place/?q=place_id:${PLAATS_ID}`;
export const GBP_SCHRIJF = `https://search.google.com/local/writereview?placeid=${PLAATS_ID}`;

/* ---------- de bouwstenen van de Google-stijl ---------- */

/* Het officiele merkteken van Google, in de vier eigen kleuren. Dit is het
   enige onderdeel dat niet uit haar palet komt, en dat hoort ook zo: een
   review-blok moet herkenbaar van Google zijn, anders leest het als een
   citaat dat wij zelf hebben opgeschreven. */
function GoogleG({className = 'h-5 w-5'}: {className?: string}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/* Het goud van Google zelf (#fbbc04), niet haar mosterd. Een halve ster kan
   ook: die is nodig zodra het gemiddelde niet op een heel getal uitkomt. */
function Ster({vulling, maat}: {vulling: number; maat: string}) {
  const id = `ster-${Math.round(vulling * 100)}`;
  const pad =
    'M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.41l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94z';
  return (
    <svg viewBox="0 0 24 24" className={maat} aria-hidden="true">
      {vulling > 0 && vulling < 1 && (
        <defs>
          <linearGradient id={id}>
            <stop offset={`${vulling * 100}%`} stopColor="#fbbc04" />
            <stop offset={`${vulling * 100}%`} stopColor="#dadce0" />
          </linearGradient>
        </defs>
      )}
      <path d={pad} fill={vulling >= 1 ? '#fbbc04' : vulling <= 0 ? '#dadce0' : `url(#${id})`} />
    </svg>
  );
}

function Sterren({score, maat = 'h-4 w-4'}: {score: number; maat?: string}) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${score} van de 5 sterren`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Ster key={i} vulling={Math.min(1, Math.max(0, score - i))} maat={maat} />
      ))}
    </span>
  );
}

/* Google zet bij mensen zonder profielfoto een gekleurde cirkel met de eerste
   letter. Dat nabootsen is eerlijker dan een verzonnen pasfoto erbij zetten. */
function Avatar({naam, kleur, maat = 'h-10 w-10 text-base'}: {naam: string; kleur: string; maat?: string}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${maat}`}
      style={{background: kleur}}
      aria-hidden="true"
    >
      {naam.charAt(0)}
    </span>
  );
}

/* ---------- voorbeeldteksten ----------

   Deze vijf reviews bestaan niet. Ze zijn door mij geschreven om te laten zien
   hoe zo'n blok eruitziet als er straks echte in staan: verschillende lengtes,
   een naam met een tussenvoegsel, en bewust een vier-sterrenreview ertussen,
   want een rij van alleen maar vijven leest als nep en levert ook een
   gemiddelde op dat nooit klopt met wat Google straks toont. */

type Review = {naam: string; kleur: string; wanneer: string; sterren: number; tekst: string};

const VOORBEELDEN: Review[] = [
  {
    naam: 'Annemieke V.',
    kleur: '#7c8460',
    wanneer: '2 weken geleden',
    sterren: 5,
    tekst:
      'Voor het eerst iemand die niet alleen naar mijn tandvlees keek, maar ook vroeg hoe ik slaap en wat ik eet. Sinds haar uitleg over ademhaling is dat droge gevoel in mijn mond ’s ochtends weg.',
  },
  {
    naam: 'Peter S.',
    kleur: '#497b89',
    wanneer: '1 maand geleden',
    sterren: 5,
    tekst:
      'Marjon neemt echt de tijd. Ik ging altijd met tegenzin naar de mondhygienist, nu niet meer. Duidelijke uitleg en geen opgeheven vingertje.',
  },
  {
    naam: 'Wendy de J.',
    kleur: '#c4691c',
    wanneer: '1 maand geleden',
    sterren: 5,
    tekst:
      'Na jaren gedoe met ontstoken tandvlees eindelijk iemand die het hele plaatje bekijkt. De poetsinstructie alleen al was het bezoek waard.',
  },
  {
    naam: 'Ronald K.',
    kleur: '#33606d',
    wanneer: '2 maanden geleden',
    sterren: 4,
    tekst:
      'Prettig contact en heldere uitleg over voeding. Even wachten op een afspraak, maar dan heb je ook wat.',
  },
  {
    naam: 'Ilse B.',
    kleur: '#5f6749',
    wanneer: '3 maanden geleden',
    sterren: 5,
    tekst:
      'Ik kwam voor een reiniging en ging naar huis met een plan. Rustig, kundig en ze legt uit waarom iets werkt in plaats van dat je het maar moet geloven.',
  },
];

const AANTAL = VOORBEELDEN.length;
const GEMIDDELD = VOORBEELDEN.reduce((t, r) => t + r.sterren, 0) / AANTAL; // 4,8

function komma(n: number) {
  return n.toFixed(1).replace('.', ',');
}

/* ---------- variant 1: de balk ---------- */

export function ReviewBalk() {
  return (
    <a
      href={GBP_BEKIJK}
      target="_blank"
      rel="noreferrer"
      className="inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full bg-white px-5 py-3 shadow-sm ring-1 ring-zand-diep transition hover:ring-petrol"
    >
      <GoogleG />
      <span className="text-lg font-semibold text-inkt">{komma(GEMIDDELD)}</span>
      <Sterren score={GEMIDDELD} />
      <span className="text-sm text-inkt/65">{AANTAL} Google reviews</span>
      <ExternalLink className="h-4 w-4 text-inkt/40" />
    </a>
  );
}

/* ---------- variant 2: drie kaarten ---------- */

function Kaart({r}: {r: Review}) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zand-diep">
      <div className="flex items-center gap-3">
        <Avatar naam={r.naam} kleur={r.kleur} />
        <div className="min-w-0">
          <figcaption className="truncate font-semibold text-inkt">{r.naam}</figcaption>
          <p className="text-xs text-inkt/50">{r.wanneer}</p>
        </div>
        <GoogleG className="ml-auto h-5 w-5 shrink-0" />
      </div>
      <div className="mt-4">
        <Sterren score={r.sterren} />
      </div>
      <blockquote className="mt-3 text-[0.95rem] leading-relaxed text-inkt/80">{r.tekst}</blockquote>
    </figure>
  );
}

export function ReviewKaarten() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <GoogleG className="h-9 w-9" />
          <div>
            <p className="flex items-baseline gap-2">
              <span className="titel text-3xl text-inkt">{komma(GEMIDDELD)}</span>
              <Sterren score={GEMIDDELD} maat="h-5 w-5" />
            </p>
            <p className="mt-1 text-sm text-inkt/60">Gebaseerd op {AANTAL} Google reviews</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={GBP_SCHRIJF}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-petrol px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-petrol-diep"
          >
            <PenLine className="h-4 w-4" /> Schrijf een review
          </a>
          <a
            href={GBP_BEKIJK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zand-diep px-5 py-2.5 text-sm font-semibold text-inkt transition hover:border-petrol hover:text-petrol"
          >
            Alles op Google <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {VOORBEELDEN.slice(0, 3).map((r) => (
          <Kaart key={r.naam} r={r} />
        ))}
      </div>
    </div>
  );
}

/* ---------- variant 3: donkere band die langsschuift ---------- */

export function ReviewBand() {
  /* twee keer dezelfde rij achter elkaar: dan sluit de lus naadloos en zie je
     nergens een gat als hij opnieuw begint */
  const rij = [...VOORBEELDEN, ...VOORBEELDEN];
  return (
    <div className="bg-inkt py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center">
        <GoogleG className="h-8 w-8" />
        <p className="flex items-center gap-3">
          <span className="titel text-4xl text-room">{komma(GEMIDDELD)}</span>
          <Sterren score={GEMIDDELD} maat="h-5 w-5" />
        </p>
        <p className="text-sm text-room/70">{AANTAL} Google reviews</p>
      </div>
      <div className="reviews-venster mt-10">
        <div className="reviews-schuif flex w-max gap-5">
          {rij.map((r, i) => (
            <figure
              key={`${r.naam}-${i}`}
              className="w-[19rem] shrink-0 rounded-2xl bg-room/10 p-5 ring-1 ring-room/15"
            >
              <div className="flex items-center gap-3">
                <Avatar naam={r.naam} kleur={r.kleur} maat="h-9 w-9 text-sm" />
                <div className="min-w-0">
                  <figcaption className="truncate text-sm font-semibold text-room">{r.naam}</figcaption>
                  <Sterren score={r.sterren} maat="h-3.5 w-3.5" />
                </div>
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-room/80">{r.tekst}</blockquote>
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10 text-center">
        <a
          href={GBP_BEKIJK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-room/40 px-6 py-3 text-sm font-semibold text-room transition hover:bg-room hover:text-inkt"
        >
          Lees alle reviews op Google <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

/* ---------- variant 4: een uitgelicht citaat ---------- */

export function ReviewCitaat() {
  const r = VOORBEELDEN[0];
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
      <div>
        <Sterren score={r.sterren} maat="h-6 w-6" />
        <blockquote className="titel mt-5 text-2xl leading-snug text-inkt sm:text-3xl">
          &ldquo;{r.tekst}&rdquo;
        </blockquote>
        <p className="mt-5 flex items-center gap-2 text-sm text-inkt/60">
          <Avatar naam={r.naam} kleur={r.kleur} maat="h-7 w-7 text-xs" />
          {r.naam} <span className="text-inkt/35">&middot;</span>
          <GoogleG className="h-4 w-4" /> Google review
        </p>
      </div>
      <a
        href={GBP_BEKIJK}
        target="_blank"
        rel="noreferrer"
        className="flex w-full max-w-xs flex-col items-center gap-2 rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-zand-diep transition hover:ring-petrol lg:w-auto"
      >
        <GoogleG className="h-7 w-7" />
        <span className="titel text-5xl leading-none text-inkt">{komma(GEMIDDELD)}</span>
        <Sterren score={GEMIDDELD} maat="h-5 w-5" />
        <span className="text-sm text-inkt/60">{AANTAL} reviews</span>
        <span className="mt-1 text-sm font-semibold text-petrol">Bekijk op Google</span>
      </a>
    </div>
  );
}

/* ---------- variant 5: het zwevende zegel ---------- */

export function ReviewZegel() {
  return (
    <a
      href={GBP_BEKIJK}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 shadow-lg ring-1 ring-zand-diep transition hover:ring-petrol"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-room">
        <GoogleG className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className="flex items-center gap-1.5">
          <span className="font-semibold text-inkt">{komma(GEMIDDELD)}</span>
          <Sterren score={GEMIDDELD} maat="h-3.5 w-3.5" />
        </span>
        <span className="text-xs text-inkt/55">{AANTAL} Google reviews</span>
      </span>
    </a>
  );
}

/* ---------- de voorbeeldpagina ---------- */

type Variant = {
  nr: number;
  naam: string;
  waar: string;
  over: string;
  donker?: boolean;
  vol?: boolean;
  blok: React.ReactNode;
};

const VARIANTEN: Variant[] = [
  {
    nr: 1,
    naam: 'De balk',
    waar: 'Onder de twee knoppen in de hero, of naast het telefoonnummer in het contactblok.',
    over:
      'Het kleinste dat werkt: cijfer, sterren, aantal. Neemt een regel in beslag en is meteen boven de vouw te zien. Dit is wat ik zou beginnen zodra er drie of vier reviews staan, want voor een heel blok is dat nog te mager.',
    blok: <ReviewBalk />,
  },
  {
    nr: 2,
    naam: 'Drie kaarten',
    waar: 'Een eigen sectie tussen Inspiratie en het pioniersblok.',
    over:
      'De klassieke vorm en de enige waarin de bezoeker de reviews ook echt leest. De knop Schrijf een review staat er bewust naast: op de pagina waar mensen zien dat anderen het deden, is de kans het grootst dat ze er zelf een achterlaten. Vanaf ongeveer zes reviews.',
    blok: <ReviewKaarten />,
  },
  {
    nr: 3,
    naam: 'De band die langsschuift',
    waar: 'Over de volle breedte, direct boven het contactblok.',
    over:
      'Dezelfde reviews maar dan als brede band in haar donkergroen, waarbij de kaarten langzaam langsschuiven. Draagt het meeste gewicht en past bij de andere donkere blokken op haar site. Staat stil zodra iemand er met de muis op gaat, en helemaal stil bij wie in zijn systeem minder beweging heeft ingesteld. Vanaf een stuk of acht reviews, anders zie je de herhaling.',
    donker: true,
    vol: true,
    blok: <ReviewBand />,
  },
  {
    nr: 4,
    naam: 'Een uitgelicht citaat',
    waar: 'In de sectie Wie ben ik, of onderaan een pijlerpagina.',
    over:
      'Een review in haar eigen titelletter, groot, met het cijfer ernaast. Dit past het beste bij de rust van haar site en het werkt al met een enkele review. Nadeel: je kiest zelf welke er staat, en dat leest minder onafhankelijk dan een rij.',
    blok: <ReviewCitaat />,
  },
  {
    nr: 5,
    naam: 'Het zwevende zegel',
    waar: 'Vast linksonder in beeld, op elke pagina.',
    over:
      'Blijft altijd staan. Dat is de kracht en meteen het bezwaar: op een telefoon is het scherm al bezet door de balk met Neem contact op, en de melding over cookies komt daar ook. Ik zou dit alleen op een laptop laten zien, of niet doen.',
    blok: <ReviewZegel />,
  },
];

export function ReviewsPagina() {
  /* Deze pagina hoort niet in Google: het is werkoverleg, met verzonnen reviews
     erop. Vandaar noindex, hier en in de gebakken HTML. */
  useKop({
    titel: `Voorbeeld: reviews in Google-stijl | ${HAAR_NAAM}`,
    kort: 'Werkoverleg met voorbeeldreviews. Geen onderdeel van de site.',
    canoniek: REVIEWS_PAD,
    noindex: true,
  });

  return (
    <main id="inhoud" tabIndex={-1} className="pt-28 outline-none">
      <div className="mx-auto max-w-6xl px-5">
        <a
          href="/#top"
          onClick={(e) => ga(e, '/')}
          className="inline-flex items-center gap-2 text-sm text-inkt/60 transition hover:text-petrol"
        >
          <ArrowLeft className="h-4 w-4" /> Terug naar de site
        </a>

        <p className="kicker mt-8 text-olijf">Voorbeeld</p>
        <h1 className="titel mt-2 text-3xl text-inkt sm:text-5xl">Reviews in Google-stijl</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-inkt/75">
          Vijf manieren om Google-reviews op de site te tonen, allemaal met een link naar haar eigen
          bedrijfsprofiel. De teksten hieronder zijn <strong>door mij verzonnen</strong> om te laten zien
          hoe het eruitziet. Er staat op dit moment geen enkele echte review over Marjon op Google.
        </p>

        {/* Dit is het echte nieuws van deze pagina, dus het staat boven de
            voorbeelden en niet in een voetnoot. */}
        <div className="mt-8 rounded-2xl border border-terra/40 bg-terra/5 p-6">
          <p className="flex items-center gap-2 font-semibold text-terra">
            <TriangleAlert className="h-5 w-5 shrink-0" /> Eerst dit: haar profiel staat bij Google als
            permanent gesloten
          </p>
          <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-inkt/80">
            <p>
              Er bestaat een bedrijfsprofiel: <em>Mondhygienepraktijk Marjon Ooteman</em>, Vliedlaan 66 in
              Schagen, met haar eigen telefoonnummer 06 20594924 erbij. Maar de status staat op permanent
              gesloten en er staat nul reviews op.
            </p>
            <p>
              Dat betekent twee dingen. Een gesloten profiel kan geen nieuwe reviews ontvangen, dus de knop
              hieronder werkt pas als dat rechtgezet is. En een link vanaf haar site naar een profiel met
              &lsquo;permanent gesloten&rsquo; erop is op dit moment slechter dan geen link.
            </p>
            <p>
              Zij moet dus eerst het profiel opeisen en heropenen (of een nieuw profiel aanmaken op haar
              huidige werkwijze: geen vaste praktijk maar een werkgebied). Daarna pas een van deze blokken
              op de site. Precies dezelfde volgorde als bij Fleurig: eerst het profiel kloppend, dan de
              poster met de QR-code, dan pas de reviews op de site.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={GBP_BEKIJK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-inkt/20 bg-white px-5 py-2.5 text-sm font-semibold text-inkt transition hover:border-petrol hover:text-petrol"
            >
              Bekijk het profiel <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {VARIANTEN.map((v) => (
        <section key={v.nr} className="mt-16">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-sm font-semibold tracking-[0.06em] text-olijf">
              Variant {v.nr} &middot; {v.naam}
            </p>
            <p className="mt-2 max-w-3xl leading-relaxed text-inkt/75">{v.over}</p>
            <p className="mt-2 text-sm text-inkt/55">
              <strong className="font-semibold text-inkt/70">Waar het zou staan:</strong> {v.waar}
            </p>
          </div>

          {v.vol ? (
            <div className="mt-6">{v.blok}</div>
          ) : (
            <div className="mx-auto mt-6 max-w-6xl px-5">
              <div className={`rounded-3xl p-6 sm:p-10 ${v.donker ? 'bg-inkt' : 'bg-zand'}`}>{v.blok}</div>
            </div>
          )}
        </section>
      ))}

      <div className="mx-auto mt-20 max-w-6xl px-5 pb-20">
        <div className="rounded-3xl bg-zand p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <Bloem className="h-9 w-9 text-bloem" />
            <h2 className="titel text-2xl text-inkt sm:text-3xl">Wat er nodig is om dit live te zetten</h2>
          </div>
          <ol className="mt-6 space-y-3 text-[0.95rem] leading-relaxed text-inkt/80">
            <li>
              <strong>1. Het profiel rechtzetten.</strong> Opeisen en heropenen, of opnieuw aanmaken. Zonder
              dat kan er niemand een review achterlaten.
            </li>
            <li>
              <strong>2. De eerste reviews binnenhalen.</strong> Van nul beginnen is het lastigste stuk. Een
              QR-code op een kaartje of in haar mailhandtekening werkt, precies zoals we dat voor Fleurig
              hebben gemaakt.
            </li>
            <li>
              <strong>3. Kiezen welke variant erop komt</strong> en of het handmatig of automatisch gaat.
              Handmatig is gratis en ik zet ze erin; automatisch haalt ze elk uur bij Google op, blijft
              vanzelf actueel en kost een paar tientjes per jaar. Bij vijf reviews is handmatig prima, vanaf
              een stuk of twintig wordt automatisch handiger.
            </li>
            <li>
              <strong>4. Geen sterren in Google zelf beloven.</strong> Die gouden sterretjes in de
              zoekresultaten komen van haar profiel, niet van de site. Sterren in de sitecode zetten voor
              reviews die daar niet vandaan komen is precies waar Google handmatig voor straft. Dus wel
              tonen op de site, niet als beoordeling meesturen naar Google.
            </li>
          </ol>
          <p className="mt-6 text-sm text-inkt/55">
            De vijf reviews op deze pagina zijn verzonnen voorbeeldtekst en staan nergens anders op de site.
            Deze pagina staat op noindex, dus hij komt niet in Google terecht.
          </p>
        </div>
      </div>
    </main>
  );
}
