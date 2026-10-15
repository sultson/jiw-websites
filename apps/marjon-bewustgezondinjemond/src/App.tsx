import {useEffect, useId, useRef, useState} from 'react';
import {
  Apple,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Check,
  Facebook,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Mic,
  Phone,
  ShoppingBag,
  Smile,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import {Bloem} from './bloem';
import {Ikigai, SpecialisatiePagina, ga, vindSpec} from './specialisaties';
import {
  CookieKeuzeKnop,
  CookieMelding,
  PRIVACY_PAD,
  PrivacyPagina,
  VERKLARING_PAD,
} from './privacy';
import {REVIEWS_PAD, ReviewsPagina} from './reviews';
import {Vergroot} from './vergroot';
import {normaliseerPad, usePad} from './pad';

const MERIDIANEN = '/img/tandmeridianen.svg';
const MERIDIANEN_ALT =
  'Kaart van het gebit waarop per tand en kies het bijbehorende orgaan, weefsel en de klachten staan die daarbij horen';

const TEL = '+31620594924';
const TEL_TONEN = '06 20594924';
const INSTA = 'https://www.instagram.com/marjon_ooteman_1/';
/* Uitgelezen uit de gedeelde facebook-link: die leidt naar profiel 61593185683528,
   pagina "Bewust gezond in je mond". Dit is het adres waar die deellink op uitkomt. */
const FB = 'https://www.facebook.com/people/Bewust-gezond-in-je-mond/61593185683528/';
const MAIL = 'info@marjonooteman.nl';
/* Marjon is aangesloten bij NVM-mondhygienisten; klachten lopen via hun
   klachtenregeling, niet via de praktijk. (Opgegeven door Marjon, 01-10-2026.) */
const KLACHTEN_URL = 'https://www.mondhygienisten.nl/klacht-over-je-mondhygienist/';

/* ---------- navigatie ---------- */

const MENU = [
  ['Over mij', '/#over'],
  ['Mijn aanpak', '/#specialisaties'],
  ['Tips en tools', '/#kennis'],
  ['Inspiratie', '/#inspiratie'],
  ['Contact', '/#contact'],
];

/* Cal.com-agenda voor het direct plannen van een kennismaking. De handle is
   afgeleid van haar naam en nog niet door haar bevestigd. */
const CAL = 'https://cal.com/marjon-ooteman';

/* Het contactblok staat sinds deze ronde op elke pagina, dus vanaf een
   pijlerpagina hoeft Contact niet meer terug naar de voorpagina te springen:
   daar staat het gewoon onderaan. */
function contactHref(pad: string) {
  return pad.startsWith('/aanpak/') ? '#contact' : '/#contact';
}

function Nav() {
  const pad = useRoute();
  const [open, setOpen] = useState(false);
  const [vast, setVast] = useState(false);
  useEffect(() => {
    const fn = () => setVast(window.scrollY > 24);
    fn();
    window.addEventListener('scroll', fn, {passive: true});
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        vast || open ? 'bg-room/95 backdrop-blur border-b border-zand-diep' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="/#top" className="flex items-center gap-3">
          <Bloem className="h-11 w-11 shrink-0 text-bloem" />
          {/* Haar naam staat niet meer naast het merkteken: de slogan is de merknaam.

              De aanhalingstekens om die merknaam zijn er weer af (12-10-2026, via
              Armando). Ze stonden er sinds 09-10 op haar verzoek; nu nergens meer
              op de site, behalve waar een patient letterlijk geciteerd wordt. */}
          <span className="merknaam block whitespace-nowrap text-[3.9vw] leading-none text-inkt min-[420px]:text-base sm:text-lg">
            Bewust Gezond in je Mond
          </span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex">
          {MENU.map(([l, h]) => (
            <a
              key={h}
              href={h === '/#contact' ? contactHref(pad) : h}
              className="text-sm font-medium text-inkt/80 transition hover:text-petrol"
            >
              {l}
            </a>
          ))}
          <a
            href={`tel:${TEL}`}
            className="rounded-full border border-petrol px-4 py-2 text-sm font-semibold text-petrol transition hover:bg-petrol hover:text-white"
          >
            {TEL_TONEN}
          </a>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full border border-zand-diep p-2 text-inkt lg:hidden"
          aria-label={open ? 'Menu sluiten' : 'Menu openen'}
          aria-expanded={open}
          aria-controls="mobiel-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div id="mobiel-menu" className="border-t border-zand-diep bg-room px-5 pb-5 lg:hidden">
          {MENU.map(([l, h]) => (
            <a
              key={h}
              href={h === '/#contact' ? contactHref(pad) : h}
              onClick={() => setOpen(false)}
              className="block border-b border-zand-diep/60 py-3 text-inkt"
            >
              {l}
            </a>
          ))}
          <a
            href={`tel:${TEL}`}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-petrol px-5 py-3 font-semibold text-white"
          >
            <Phone className="h-4 w-4" /> {TEL_TONEN}
          </a>
        </div>
      )}
    </header>
  );
}

/* ---------- aanvraagformulier ---------- */

/**
 * Het adres van de Worker die het bericht verstuurt (worker/index.ts, op
 * @jiw/cloudflare-forms). Hij mailt het naar Marjon en stuurt de afzender een
 * bevestiging in haar eigen opmaak.
 *
 * Eerder ging dit naar een adres uit een omgevingsvariabele die nergens gezet
 * was, en dan belandde een bericht in localStorage: de bezoeker zag "Dank je
 * wel" en er kwam nooit iets aan. Vandaar een vast adres en geen terugval meer.
 */
const ENDPOINT = '/api/forms/contact';

/**
 * Het verborgen veld waar een bot in trapt en een bezoeker nooit komt. Wat er
 * mét een waarde binnenkomt wordt zonder spoor weggegooid (honeypotField in
 * worker/index.ts). Geen Turnstile dus: geen widget op de pagina, geen verzoek
 * naar een derde partij, en niets om toestemming voor te vragen.
 */
const LOKVELD = 'bedrijf';

/* Het pakket kent drie veldnamen van zichzelf: firstName, lastName en email.
   Dit formulier vraagt om één naam en niet om een voor- en achternaam, dus die
   gaat als firstName mee en lastName blijft leeg (requireLastName: false in de
   Worker, dan valt de regel in beide mails weg in plaats van er als "-" in te
   staan). */
const TAALVELD = '__jiw_confirmation_locale';

function Formulier({compact = false}: {compact?: boolean}) {
  const veld = useId();
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [bericht, setBericht] = useState('');
  const [akkoord, setAkkoord] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(false);

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (bezig || !akkoord) return;
    setBezig(true);
    setFout(false);

    /* FormData en geen JSON: dat is wat @jiw/cloudflare-forms verwacht. */
    const data = new FormData();
    data.set('firstName', naam.trim());
    data.set('email', email.trim());
    data.set('telefoon', tel.trim());
    data.set('bericht', bericht.trim());
    data.set('akkoord', 'ja');
    data.set(TAALVELD, 'nl');
    /* Leeg meesturen en niet weglaten: een bot die het formulier van de pagina
       plukt vult alles in wat hij ziet, en dit veld hoort leeg aan te komen. */
    data.set(LOKVELD, '');

    try {
      const res = await fetch(ENDPOINT, {method: 'POST', body: data});
      if (!res.ok) throw new Error(String(res.status));
      setKlaar(true);
    } catch {
      setFout(true);
    } finally {
      setBezig(false);
    }
  }

  if (klaar) {
    return (
      <div
        className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-zand-diep"
        role="status"
        aria-live="polite"
      >
        <Bloem className="mx-auto h-14 w-14 text-olijf" />
        <p className="titel mt-4 text-2xl text-inkt">Dank je wel</p>
        <p className="mt-2 text-sm text-inkt/70">
          {`Je bericht staat genoteerd. Ik neem zelf contact met je op. Heb je haast, bel dan gerust ${TEL_TONEN}.`}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={verstuur}
      /* De mobiele balk kijkt hiernaar om zich weg te halen boven dit
         formulier. Expliciet, want sinds het nieuwsbriefblok staat er meer dan
         een form op de pagina en de balk hoort alleen voor het contactblok te
         wijken. */
      data-contact
      className={`relative rounded-2xl bg-white shadow-sm ring-1 ring-zand-diep ${compact ? 'p-6' : 'p-6 sm:p-8'}`}
    >
      <p className="kicker text-olijf">Neem contact op</p>
      <p className="titel mt-1 text-2xl text-inkt">Waar gaat het over?</p>
      <div className="mt-4 grid gap-3">
        <label htmlFor={`${veld}-naam`} className="sr-only">
          Je naam
        </label>
        <input
          required
          id={`${veld}-naam`}
          name="naam"
          autoComplete="name"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          placeholder="Je naam"
          className="rounded-xl border border-zand-diep px-4 py-3 text-sm outline-none focus:border-petrol"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label htmlFor={`${veld}-mail`} className="sr-only">
            E-mailadres
          </label>
          <input
            required
            type="email"
            id={`${veld}-mail`}
            name="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mailadres"
            className="rounded-xl border border-zand-diep px-4 py-3 text-sm outline-none focus:border-petrol"
          />
          <label htmlFor={`${veld}-tel`} className="sr-only">
            Telefoonnummer, optioneel
          </label>
          <input
            type="tel"
            id={`${veld}-tel`}
            name="telefoon"
            autoComplete="tel"
            inputMode="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="Telefoon (optioneel)"
            className="rounded-xl border border-zand-diep px-4 py-3 text-sm outline-none focus:border-petrol"
          />
        </div>
        <label htmlFor={`${veld}-bericht`} className="sr-only">
          Waar kan ik je mee helpen?
        </label>
        <textarea
          id={`${veld}-bericht`}
          name="bericht"
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          rows={compact ? 3 : 4}
          placeholder="Waar kan ik je mee helpen?"
          className="rounded-xl border border-zand-diep px-4 py-3 text-sm outline-none focus:border-petrol"
        />
      </div>
      {/* Het lokveld. Buiten beeld en buiten de voorleesvolgorde, en met
          autocomplete uit zodat de browser er zelf niets in zet. Een bot vult
          het in; dan gaat het bericht de prullenbak in zonder dat hij dat
          merkt. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[5000px] h-0 w-0 overflow-hidden">
        <input type="text" name={LOKVELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      {/* Toestemmingsvinkje. Geen ga() hier: die interne router verwisselt de
          pagina en dan is alles wat iemand net heeft ingetypt weg. Dus een
          nieuw tabblad, en het formulier blijft staan. */}
      <div className="mt-4 flex items-start gap-3">
        <input
          type="checkbox"
          required
          id={`${veld}-akkoord`}
          name="akkoord"
          checked={akkoord}
          onChange={(e) => setAkkoord(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-zand-diep accent-petrol"
        />
        <label htmlFor={`${veld}-akkoord`} className="cursor-pointer text-xs leading-relaxed text-inkt/70">
          Ik ga ermee akkoord dat mijn gegevens gebruikt worden om mijn vraag te beantwoorden.{' '}
          <a
            href={PRIVACY_PAD}
            target="_blank"
            rel="noopener noreferrer"
            className="text-petrol underline underline-offset-2"
          >
            Privacyverklaring
          </a>
        </label>
      </div>
      <button
        type="submit"
        disabled={!akkoord || bezig}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-petrol px-6 py-3.5 font-semibold text-white transition hover:bg-petrol-diep disabled:bg-zand-diep disabled:text-inkt/50"
      >
        {bezig ? 'Bezig met versturen' : 'Versturen'}{' '}
        <ArrowRight className="h-4 w-4" />
      </button>
      {!akkoord && (
        <p className="mt-2 text-center text-xs text-inkt/60">Zet het vinkje om te kunnen versturen.</p>
      )}
      {fout && (
        <p className="mt-3 rounded-xl bg-terra/10 px-4 py-3 text-center text-sm text-terra" role="alert">
          Het versturen lukte niet. Bel of app me gerust op {TEL_TONEN}, of mail naar {MAIL}.
        </p>
      )}
    </form>
  );
}

/* ---------- hero ---------- */

/* Marjons tekening: het middelpunt van het merkteken ligt precies op de
   linkerbovenhoek van de foto, dus een kwart valt op de foto en de rest steekt
   erbuiten.

   De waarden hieronder zijn nagemeten op public/img/bloem.png zelf (640x640) en
   niet geschat: een kleinste-kwadraten-cirkelfit op de buitenrand geeft het hart
   op 50,03% / 50,06%, en het midden van het inktvlak geeft hetzelfde. Er zit in
   dit bestand dus GEEN scheve marge; de eerdere -49,6% / -48,8% kwam van een
   oudere, ongesneden versie en liet het hart ruim een procent onder de hoek
   hangen. Dat is precies wat Marjon aanwees.

   Die verschuiving MOET via de losse translate-property en niet via transform.
   De browser rekent translate -> rotate -> scale -> transform, dus een
   verschuiving in transform zit BINNEN de draaiing: die vector draait dan mee en
   het merkteken maakt een rondje om de hoek in plaats van er stil op te liggen.
   Via translate staat de verschuiving buiten de draaiing en blijft het hart op
   zijn plek. */
/* De foto heeft sinds 12-10-2026 ronde hoeken zoals de rest van de site
   (rounded-2xl, dus 1rem). Daarmee verschuift de hoek die je ZIET naar binnen: op
   een kwartrond met radius r ligt het punt op 45 graden r*(1 - cos45) van beide
   randen, oftewel 0,29289 * 1rem. Precies daar staat het hart van het merkteken
   nu, dus het ligt nog steeds exact op de hoek van de foto in plaats van ernaast
   te zweven. Houd deze waarde gelijk aan de rounded-2xl op het fotokader. */
const HOEK_INZET = 'calc(1rem * 0.29289)';

const BLOEM_HERO = {
  aspectRatio: '1 / 1',
  /* Haar tekening op papier laat het onomstotelijk zien: het middelpunt van de
     cirkel ligt op de PUNT, dus op de linkerbovenhoek van de foto. Een kwart van
     de tekening valt op de foto, de rest steekt erbuiten. */
  left: HOEK_INZET,
  top: HOEK_INZET,
  translate: '-50.032% -50.055%',
  /* Draaien om exact hetzelfde punt, anders wiebelt het hart om de hoek heen in
     plaats van er stil op te liggen. */
  transformOrigin: '50.032% 50.055%',
} as const;

function Hero() {
  // Extra kopruimte op desktop: het merkteken steekt boven de foto uit en moet
  // onder de menubalk door kunnen, niet erachter.
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-zand pt-28 pb-12 sm:pb-16 lg:pt-52 lg:pb-24"
    >
      {/* Geen `relative` onder lg: de foto hieronder moet zich tegen de SECTIE
          afzetten en niet tegen dit raster, anders blijft de kopruimte van de
          sectie een strook zand boven de foto. Vanaf lg staat de foto weer
          gewoon in de kolom en is dit raster het ankerpunt. */}
      {/* Onder lg een kolom met een minimale hoogte en de tekst onderin: zo blijft
          haar gezicht boven de kop vrij en staat de tekst op het donkerste deel
          van het verloop. Vanaf lg is het weer precies het raster van hiervoor. */}
      <div className="mx-auto flex min-h-[62svh] max-w-6xl flex-col justify-end px-5 lg:relative lg:grid lg:min-h-0 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12">
        {/* Onder lg staat de tekst OVER de foto (12-10-2026, via Armando, naar het
            voorbeeld van smoothbylau.nl): de foto hangt als achtergrond over de
            hele sectie en de tekst ligt er gecentreerd bovenop. Vanaf lg is het
            onveranderd de twee kolommen van hiervoor.

            De tekst staat er maar een keer: de foto wisselt van absoluut naar een
            gewone kolom, de tekst wisselt alleen van kleur en uitlijning. Twee
            kopieen met een display-none erop zou een tweede h1 in de pagina
            zetten, en dat leest geen zoekmachine goed. */}
        <div className="relative z-10 text-center lg:text-left">
          {/* De gestapelde titel BEWUST GEZOND / IN / JE MOND is eruit op verzoek van
              Marjon: die staat al als naam in de balk bovenaan, dus hij stond er twee
              keer. Haar eigen openingszin is nu de kop van de pagina. */}
          {/* Marjon wil haar merknaam in de kop ZONDER aanhalingstekens, en "start
              hier" hoort niet in de kop maar op de knop eronder. De regel over de
              eerste laagdrempelige stap mocht van haar helemaal weg. */}
          {/* De merknaam mag nooit middenin afbreken (10-10-2026, via Armando): hij
              staat als een blok op zijn eigen regel. Daarom whitespace-nowrap, en
              daarom schaalt de kop met het scherm in plaats van met vaste stappen --
              een onbreekbare regel van 26 tekens past anders niet op een telefoon. */}
          {/* Onder lg is dit het enige merkteken in de hero: gecentreerd boven de
              kop, op de foto. Het exemplaar dat met zijn hart op de hoek van de
              foto ligt heeft daar geen betekenis, want daar is de foto het hele
              vlak en heeft hij geen hoek om op te liggen. */}
          {/* Hier stond onder lg een merkteken boven de kop. Eruit: het landde op
              haar gezicht, en vijftig pixel hoger staat hetzelfde merkteken al in
              de menubalk. */}
          <h1 className="merknaam mx-auto max-w-lg text-[6.4vw] leading-[1.18] text-room drop-shadow-[0_1px_8px_rgba(43,66,73,0.55)] sm:text-[3.85vw] lg:mx-0 lg:text-[2.05rem] lg:text-inkt lg:drop-shadow-none xl:text-[2.35rem]">
            Jouw reis naar{' '}
            <span className="whitespace-nowrap">Bewust Gezond in je Mond</span>
          </h1>
          {/* Marjon's briefje: de lange knop "Start hier: inspireer mij met blogs &
              tips" is doorgestreept. Wat zij eronder schreef staat er nu zo: de
              regel "Inspireer mij met Blogs & Tips" als tekst, en "Start hier" in
              een ovaal, dus als de knop zelf. */}
          <p className="mt-6 text-base font-semibold text-room drop-shadow-[0_1px_6px_rgba(43,66,73,0.55)] lg:text-petrol lg:drop-shadow-none">
            Inspireer mij met Blogs &amp; Tips
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#kennis"
              className="flex items-center gap-2 rounded-full bg-petrol px-7 py-3.5 font-semibold text-white transition hover:bg-petrol-diep"
            >
              Start hier <ArrowRight className="h-4 w-4" />
            </a>
            {/* Op de foto zou een petrol rand op een donkere achtergrond wegvallen,
                dus onder lg is deze knop wit omlijnd. Vanaf lg staat hij weer op
                zand en is hij petrol zoals eerst. */}
            <a
              href="#contact"
              className="flex items-center gap-2 rounded-full border border-room px-6 py-3.5 font-semibold text-room transition hover:bg-room hover:text-inkt lg:border-petrol lg:text-petrol lg:hover:bg-petrol lg:hover:text-white"
            >
              Neem rechtstreeks contact op
            </a>
          </div>
        </div>
        {/* Marjon wil het merkteken speelser: het midden op de linkerbovenhoek, dus
            een kwart op de foto en de rest erbuiten. Het staat er als een enkel
            teken in een kleur, boven op de foto: het petrol van de knop
            "Ja, inspireer mij". Het draait weer, maar om zijn eigen hart, zodat het
            middelpunt op de hoek blijft liggen. */}
        {/* Een kwart van het merkteken steekt links en boven buiten het kader, dus
            daar moet ruimte voor zijn, anders snijdt de sectie het af. Op een
            telefoon is dat de helft van de overhang, want de tekening mag ook een
            stuk in de paginamarge hangen. */}
        {/* Onder lg vult deze figure de hele sectie en ligt hij achter de tekst.
            Vanaf lg is het weer de rechterkolom van het raster. */}
        {/* top-20 en niet inset-0: de menubalk is doorzichtig tot je scrollt en
            haar letters zijn donker. Zou de foto eronderdoor lopen, dan is de
            merknaam bovenin niet meer te lezen. Nu begint de foto precies onder
            de balk en houdt die balk zijn eigen strook zand. */}
        <figure className="absolute inset-x-0 bottom-0 top-20 z-0 m-0 lg:relative lg:inset-auto">
          {/* De foto heeft nu ronde hoeken zoals elke andere foto op de site. Het
              merkteken zet zijn hart niet meer op de rekenkundige hoek maar op het
              punt van de bocht dat je ziet (zie HOEK_INZET hierboven), anders lijkt
              het ernaast te zweven. Onder lg is de foto het hele vlak, dus daar
              geen radius en ook geen schaduw. */}
          <div className="relative h-full overflow-hidden rounded-none lg:h-auto lg:rounded-2xl lg:shadow-xl lg:shadow-inkt/10">
            {/* De foto uit haar instagrampost, op haar eigen verzoek: zij lachend
                in het bos. Dezelfde foto die ook op het deelkaartje staat, maar
                nu uit een grotere bron gesneden. */}
            {/* Drie maten, 15-10-2026. Onder lg vult de foto het hele vlak, dus
                daar is de gevraagde maat de schermbreedte; vanaf lg is het de
                halve kolom met een plafond van 560 punten. De browser telt daar
                zelf de beeldpuntdichtheid bij op, dus een telefoon van 430 punten
                op 3x pakt de 1350 of de 1800 in plaats van de 900 uit te rekken.
                Dat uitrekken was wat Marjon als pixels zag. */}
            <img
              src="/img/hero-glimlach.webp?v=20261015"
              srcSet="/img/hero-glimlach.webp?v=20261015 900w, /img/hero-glimlach-1350.webp?v=20261015 1350w, /img/hero-glimlach-1800.webp?v=20261015 1800w"
              sizes="(min-width: 1024px) min(45vw, 560px), 100vw"
              width={900}
              height={1125}
              fetchPriority="high"
              alt="Marjon Ooteman lachend in het bos, zittend tussen de herfstbladeren"
              className="block h-full w-full object-cover lg:aspect-[4/5] lg:h-auto"
            />
            {/* Zonder deze laag is de witte tekst op de lichte plekken van de foto
                niet te lezen. Naar onderen toe donkerder, want daar staan de kop en
                de knoppen. Alleen onder lg: op desktop staat de tekst naast de foto. */}
            <div className="absolute inset-0 bg-gradient-to-b from-inkt/25 via-inkt/55 to-inkt/85 lg:hidden" />
          </div>
          {/* Alleen vanaf lg: onder lg is de foto het hele vlak en heeft dit
              merkteken geen hoek om zijn hart op te leggen. Het verbergen zit op
              deze span, zie de opmerking bij de bloem boven de kop. */}
          <span className="hidden lg:block">
            <Bloem
              className="bloem-draait pointer-events-none absolute z-10 w-[40%] text-petrol"
              style={BLOEM_HERO}
            />
          </span>
        </figure>
      </div>
    </section>
  );
}

/* ---------- balk ---------- */

const BALK = [
  [Smile, 'Preventieve mondzorg'],
  [Apple, 'Voeding en leefstijl'],
  [Leaf, 'Live life aligned with nature'],
  [Sparkles, 'Van must do naar wanna do'],
];

function Balk() {
  return (
    <div className="border-y border-zand-diep bg-room">
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {BALK.map(([Icon, t]: any) => (
          <div key={t} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0 text-olijf" />
            <span className="text-sm font-medium text-inkt/80">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- kennis ---------- */

const ARTIKELEN = [
  {
    label: 'Mond en lichaam',
    titel: 'Je mond is de voordeur van je lichaam',
    tekst:
      'Waarom een ontstoken tandvlees geen los probleem is, maar een laaggradige ontsteking die je hele lijf belast.',
  },
  {
    label: 'Voeding',
    titel: 'Poetsen alleen is niet genoeg',
    tekst:
      'Wat je eet bepaalt mee hoe je tandvlees eruitziet. Over variatie, vezels en de link tussen je darmen en je mond.',
  },
  {
    label: 'Gewoontes',
    titel: 'Van must do naar wanna do',
    tekst:
      'Hoe je mondzorg omdraait van een klusje dat moet naar iets waar je zin in hebt, zonder opgeheven vinger.',
  },
  {
    label: 'Sport',
    titel: 'Wat topsporters met hun mond te maken hebben',
    tekst:
      'Sportdrank, mondademen en herstel. Waarom je prestaties last hebben van wat er in je mond gebeurt.',
  },
];

/* Het praktische spoor. Kort, concreet en om meteen te doen, tegenover de
   verhalen in Inspiratie hieronder. */
const TIPS = [
  {
    label: 'Stappenplan',
    titel: 'Je poetsroutine in vijf minuten',
    tekst:
      'Volgorde, tijd en techniek. Wat er echt toe doet en wat je gerust mag laten liggen.',
  },
  {
    label: 'Ritueel',
    titel: 'Je ochtend, van tong schrapen tot oil pulling',
    tekst: 'Een dagritme dat je volhoudt, opgebouwd uit stappen van een minuut.',
  },
  {
    label: 'Voeding',
    titel: 'Wat je op een doordeweekse dag eet',
    tekst: 'Boodschappen, tussendoortjes en drinken, vertaald naar je tandvlees.',
  },
  {
    label: 'Producten',
    titel: 'Essentiële olie in je dagelijkse verzorging',
    tekst: 'Welke je gebruikt, hoeveel, en waar je op let bij het kiezen.',
  },
];

function Kaart({label, titel, tekst}: {label: string; titel: string; tekst: string}) {
  return (
    <article className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zand-diep">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 shrink-0 text-olijf" />
        <span className="text-[11px] font-semibold tracking-[0.06em] text-olijf">
          {label}
        </span>
      </div>
      <h3 className="titel mt-3 text-lg leading-snug text-inkt">{titel}</h3>
      <p className="mt-2 text-sm leading-relaxed text-inkt/70">{tekst}</p>
      <span className="mt-5 inline-flex w-fit rounded-full bg-zand px-3 py-1 text-xs font-semibold text-inkt/60">
        Binnenkort te lezen
      </span>
    </article>
  );
}

function Kennis() {
  return (
    <section id="kennis" className="bg-room py-20">
      <div className="mx-auto max-w-6xl px-5">
        <p className="kicker text-olijf">Tips en tools</p>
        <h2 className="titel mt-2 text-3xl text-inkt sm:text-4xl">Praktische tips en adviezen</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-inkt/75">
          Stappenplannen, dagelijkse rituelen, poetsinstructies, en hoe je voeding en olie
          laagdrempelig verweeft in je dag. Voor wie de regie wil pakken en zoekt naar concrete
          acties.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIPS.map((t) => (
            <Kaart key={t.titel} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Inspiratie() {
  return (
    <section id="inspiratie" className="bg-zand py-20">
      <div className="mx-auto max-w-6xl px-5">
        <p className="kicker text-olijf">Inspiratie</p>
        <h2 className="titel mt-2 text-3xl text-inkt sm:text-4xl">Healthy mouth, healthy body</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-inkt/75">
          Artikelen over actuele gezondheidsthema&apos;s, verhalen uit de praktijk en diepere
          inzichten over de link tussen mond en lichaam. De eerste worden nu geschreven.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ARTIKELEN.map((a) => (
            <Kaart key={a.titel} {...a} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- nieuwsbrief ----------

   Ruimte voor de aanmelding, de koppeling met Mailchimp komt later.

   Aanzetten is een regel werk: haal in Mailchimp het embedded form op
   (Audience > Signup forms > Embedded form) en zet het action-adres daaruit
   hieronder. Dat ziet uit als
   https://<iets>.list-manage.com/subscribe/post?u=<cijfers>&id=<cijfers>.
   Staat het er, dan neemt het blok direct aanmeldingen aan; staat het er niet,
   dan staat het blok er wel maar nemen de velden niets aan. Dat is met opzet:
   een invulveld dat adressen inslikt die nergens aankomen is erger dan een veld
   dat nog niet open is.

   Bewust een gewone formulierpost en geen fetch: list-manage.com stuurt geen
   CORS-headers, dus een fetch uit de browser faalt altijd. Mailchimp stuurt zelf
   de bevestigingsmail, dus niemand komt op de lijst zonder zijn eigen klik.

   Aangesloten 12-10-2026 op de audience van bewustgezondinjemond (us8).
   MAILCHIMP_VAL is het verborgen veld uit dezelfde embed-code: Mailchimp's eigen
   botcontrole. Laat je dat weg, dan kan hij echte aanmeldingen als spam zien. Het
   veld moet leeg blijven en voor mensen onzichtbaar, maar wel in de post zitten. */
const MAILCHIMP =
  'https://bewustgezondinjemond.us8.list-manage.com/subscribe/post?u=bd079b7cbcd6cf55a29c378b2&id=f92716e662&f_id=00791de0f0';
const MAILCHIMP_VAL = 'b_bd079b7cbcd6cf55a29c378b2_f92716e662';

function Nieuwsbrief() {
  const veld = useId();
  const open = Boolean(MAILCHIMP);
  return (
    <section id="nieuwsbrief" className="bg-room py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-zand-diep sm:p-10">
          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="kicker text-olijf">Nieuwsbrief</p>
              <h2 className="titel mt-2 text-2xl text-inkt sm:text-3xl">Blijf op de hoogte</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-inkt/75">
                De artikelen en stappenplannen hierboven worden nu geschreven. Laat je e-mailadres
                achter, dan hoor je het wanneer er iets nieuws te lezen is.
              </p>
            </div>
            <form
              action={MAILCHIMP || undefined}
              method="post"
              target="_blank"
              onSubmit={(e) => {
                if (!open) e.preventDefault();
              }}
              className="grid gap-3"
            >
              <label htmlFor={`${veld}-mail`} className="sr-only">
                E-mailadres
              </label>
              <input
                type="email"
                required
                name="EMAIL"
                id={`${veld}-mail`}
                autoComplete="email"
                inputMode="email"
                disabled={!open}
                placeholder="E-mailadres"
                className="rounded-xl border border-zand-diep px-4 py-3 text-sm outline-none focus:border-petrol disabled:bg-zand/60 disabled:text-inkt/40"
              />
              {/* Mailchimp's botcontrole: moet leeg blijven en onzichtbaar, maar wel
                  meeposten. Niet met display:none, dat slaan sommige bots juist over. */}
              <div aria-hidden="true" className="absolute -left-[5000px]">
                <input type="text" name={MAILCHIMP_VAL} tabIndex={-1} defaultValue="" />
              </div>
              <button
                type="submit"
                disabled={!open}
                className="flex items-center justify-center gap-2 rounded-full bg-petrol px-6 py-3.5 font-semibold text-white transition hover:bg-petrol-diep disabled:bg-zand-diep disabled:text-inkt/50"
              >
                <Mail className="h-4 w-4" /> Aanmelden
              </button>
              <p className="text-xs leading-relaxed text-inkt/60">
                {open ? (
                  <>
                    Je krijgt eerst een mail om je aanmelding te bevestigen. Afmelden kan onderaan
                    elke nieuwsbrief.{' '}
                    <a
                      href={PRIVACY_PAD}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-petrol underline underline-offset-2"
                    >
                      Privacyverklaring
                    </a>
                  </>
                ) : (
                  'De aanmelding gaat binnenkort open.'
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- over ----------

   Haar eigen tekst, woordelijk overgenomen. */

/* Marjon vroeg om een beeld bij elk van de drie werelden: groente en fruit bij
   natuurlijke voeding, essentiële olie, en de tandmeridianenkaart (die stuurde
   ze zelf mee) bij de oosterse geneeskunde. De kaart is een tekening met kleine
   letters, dus die staat niet bijgesneden maar heel in het kader en is
   aanklikbaar om te vergroten. */
type Wereld = {
  kop: string;
  tekst: string;
  beeld?: string;
  alt?: string;
  concept?: boolean;
};

const WERELDEN: Wereld[] = [
  {
    kop: 'Natuurlijke voeding',
    tekst:
      'Als natuurlijk voedingsdeskundige inspireer ik je om je immuunsysteem en mondflora van binnenuit te voeden. Dit kan middels gezonde pure voeding zoals kruiden en bijvoorbeeld groenten en fruit of zogenaamde superfoods. Ik kan je begeleiden bij het inzetten van voeding als medicijn op weg naar een gezonde mond.',
    beeld: '/img/wereld-voeding.webp',
    alt: 'Salade met appel, granaatappel, munt en walnoten',
  },
  {
    kop: 'Essentiële oliën',
    tekst:
      'Ik ben bekend met de pure, helende kracht van essentiële oliën voor een natuurlijke balans in je mond.',
    beeld: '/img/wereld-olie.webp',
    alt: 'Twee amberkleurige flesjes essentiële olie met verse munt, rozemarijn en kruidnagel',
    concept: true,
  },
  {
    kop: 'Oosterse geneeskunde',
    tekst:
      'De eeuwenoude oosterse kennis ziet verbanden met je algehele gezondheid en dit is terug te lezen in je mond middels tongdiagnose en/of je tanden en kiezen, welke in verbinding staan met alle organen en orgaansystemen in je lichaam. Ook tekorten van bijvoorbeeld vitamines zijn terug te lezen uit je mondgezondheid.',
  },
];

function Over() {
  const [kaartOpen, setKaartOpen] = useState(false);
  return (
    <section id="over" className="bg-room py-20">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/img/marjon-aan-het-werk.webp"
            alt="Marjon Ooteman aan het werk in de praktijk, met loepbril en mondmasker"
            loading="lazy"
            decoding="async"
            width={700}
            height={933}
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
          {/* Marjon vond de bosfoto hier niet bij de behandelfoto passen: nu
              staan er twee foto's uit dezelfde praktijk naast elkaar. */}
          <img
            src="/img/marjon-groen-pak.webp"
            alt="Marjon Ooteman in haar praktijk, in groen werkpak"
            loading="lazy"
            decoding="async"
            width={700}
            height={933}
            className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover"
          />
        </div>
        <div>
          <p className="kicker text-olijf">Wie ben ik</p>
          <h2 className="titel mt-2 text-[5.2vw] text-inkt sm:text-[3.4vw] lg:text-[2.1rem]">
            Welkom bij{' '}
            <span className="whitespace-nowrap">Bewust Gezond in je Mond</span>
          </h2>
          {/* Haar eigen tekst, woordelijk overgenomen en nu compleet. */}
          <p className="mt-5 leading-relaxed text-inkt/75">
            Mooi dat je mijn website hebt gevonden en de tijd neemt om hier een kijkje te nemen. Mijn naam is Marjon
            Ooteman, mondhygi&euml;nist, en ik nodig je uit om op een compleet nieuwe manier naar je gezondheid te
            kijken.
          </p>
          <p className="mt-4 leading-relaxed text-inkt/75">
            Voor mij is vrijheid de allerhoogste waarde in het leven. De vrijheid om voluit te leven, onbezorgd te
            genieten en met puur zelfvertrouwen te lachen. Maar die ultieme vrijheid heeft een stevig fundament nodig:
            jouw gezondheid. En het geheim van die gezondheid? Dat begint vaak in je mond.
          </p>
          <h3 className="titel mt-8 text-xl text-inkt sm:text-2xl">De zoektocht naar het complete plaatje</h3>
          <p className="mt-4 leading-relaxed text-inkt/75">
            Mijn passie voor gezondheid is diep geworteld in mijn eigen levensverhaal. Jarenlang heb ik zelf diverse
            chronische gezondheidsklachten ondervonden. Zowel van mezelf als die van mijn gezin. In de reguliere
            medische wereld ging ik van de ene specialist naar de andere. Iedereen deed werk op zijn eigen eilandje,
            maar niemand overzag de hele oceaan. Het ging meer over symptoombestrijding: loste ik het ene probleem op,
            dan popte er elders weer een nieuwe klacht op.
          </p>
          <p className="mt-4 leading-relaxed text-inkt/75">
            Ik miste die ene professional die over de muren heen keek en de diepere verbanden zag. Die zoektocht
            opende mijn ogen. Het werd mijn persoonlijke vuur om zelf de regie terug te pakken over mijn gezondheid.
            Ik besloot zelf die professional over mijn eigen gezondheid te zijn, met gebruikmaking van zowel regulier
            als eeuwenoude kennis uit de Chinese leer (acupunctuur), Ayurveda, energetisch (kinesiologie), voeding en
            kruidenleer en essenti&euml;le olie kennis. Door het terugpakken van de regie over mijn gezondheid kreeg
            ik mijn gezondheid terug!
          </p>
          <h3 className="titel mt-8 text-xl text-inkt sm:text-2xl">
            De brug tussen twee werelden: 30 jaar ervaring
          </h3>
          {/* Marjon vroeg hier om een foto van een brug. Zij stuurde een
              voorbeeldillustratie mee (twee hoofden met wegen over een kloof);
              dit is een eigen beeld in haar kleuren, geen overgenomen stockfoto. */}
          <figure className="mt-5 m-0">
            <img
              src="/img/brug.webp"
              alt="Houten brug over een beek in een licht beukenbos"
              loading="lazy"
              decoding="async"
              width={1400}
              height={939}
              className="aspect-[3/2] w-full rounded-2xl object-cover"
            />
          </figure>
          <p className="mt-4 leading-relaxed text-inkt/75">
            Als mondhygiënist met inmiddels 30 jaar ervaring zag ik hoe alle puzzelstukjes in elkaar vielen. Je mond is
            geen afzonderlijk onderdeel; het is de spiegel en de poort van je algehele welzijn. Wat er in je lichaam
            gebeurt, zie je terug in je mond, en andersom!
          </p>
          <p className="mt-4 leading-relaxed text-inkt/75">
            Om jou écht in je kracht te zetten, combineer ik de ijzersterke basis van de reguliere gezondheidszorg met
            de zuivere kracht van de natuur. Ik breng het beste van twee werelden samen:
          </p>
          <ul className="mt-5 space-y-5">
            {WERELDEN.map((w) => (
              <li key={w.kop} className="flex gap-4 border-l-2 border-olijf/40 pl-4">
                {w.beeld && (
                  <div className="shrink-0">
                    <img
                      src={w.beeld}
                      alt={w.alt}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={800}
                      className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28"
                    />
                  </div>
                )}
                <p className="leading-relaxed text-inkt/75">
                  <strong className="font-semibold text-inkt">{w.kop}:</strong> {w.tekst}
                </p>
              </li>
            ))}
          </ul>

          {/* De tandmeridianenkaart. Marjon stuurde een felroze, Engelstalige kaart
              mee; die is hier opnieuw getekend in haar eigen kleuren en in het
              Nederlands (scripts/meridianen.mjs). Het is een tekening met veel
              kleine tekst, dus hij staat zo groot mogelijk en gaat bij een klik
              uitvergroot over de pagina heen (zie vergroot.tsx). Het is een
              vector, dus inzoomen blijft scherp.

              Een knop en geen link: dit brengt je nergens heen, het vergroot wat
              er al staat. Een link naar het bestand gooide je uit de site, op een
              kale pagina met alleen het plaatje. */}
          <figure className="mt-8 m-0">
            <button
              type="button"
              onClick={() => setKaartOpen(true)}
              aria-label="Meridianenkaart uitvergroten"
              className="block w-full cursor-zoom-in rounded-2xl bg-white p-3 ring-1 ring-zand-diep transition hover:shadow-md"
            >
              <img
                src={MERIDIANEN}
                alt={MERIDIANEN_ALT}
                loading="lazy"
                decoding="async"
                width={1600}
                height={1680}
                className="w-full"
              />
            </button>
            <figcaption className="mt-2 text-xs text-inkt/55">
              Elke tand en kies staat in verbinding met een orgaan, een weefsel en een meridiaan.
              Klik om te vergroten.
            </figcaption>
          </figure>
          <Vergroot
            src={MERIDIANEN}
            alt={MERIDIANEN_ALT}
            onderschrift="Gebit en meridianen: elke tand en kies in verbinding met een orgaan, een weefsel en een meridiaan"
            open={kaartOpen}
            onSluit={() => setKaartOpen(false)}
          />
          <p className="mt-5 leading-relaxed text-inkt/75">
            Geen ingewikkeld medisch jargon, geen opgeheven vingertjes. Wel een laagdrempelige, holistische benadering
            die je ogen opent.
          </p>
          <p className="script mt-5 text-3xl text-petrol">Live life aligned with nature</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- mijn aanbod is voor de pioniers ----------

   Haar eigen tekst, woordelijk overgenomen, inclusief waar zij zelf dik drukte.
   Dit blok sluit elke pagina af (voorpagina en de vijf pijlerpagina's), met het
   contactblok er direct onder: zie <Afsluiting/>. */

const MATCH: [string, string][] = [
  ['Verder durft te kijken', 'dan de oppervlakte en de échte oorzaak van je klachten wilt aanpakken.'],
  [
    'Geïnspireerd raakt',
    'door de combinatie van westerse wetenschap en oosterse, natuurlijke wijsheid.',
  ],
  [
    'Zelf aan het roer wilt staan',
    'en klaar bent voor bewuste, positieve stappen in je dagelijkse routine.',
  ],
  ['Gezondheid ziet als de allermooiste investering', 'in jouw eigen vrijheid en levenskwaliteit.'],
];

function Pioniers() {
  return (
    <section id="pioniers" className="relative overflow-hidden bg-inkt py-20 text-room">
      <Bloem
        className="bloem-draait pointer-events-none absolute -right-24 top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 text-room/10 sm:h-[28rem] sm:w-[28rem]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-5">
        <p className="kicker text-mosterd">Mijn aanbod</p>
        <h2 className="titel mt-2 text-3xl sm:text-4xl">Mijn aanbod is voor de pioniers</h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="leading-relaxed text-room/80">
              Mijn kennis, kunde en holistische aanpak zijn er niet voor iedereen. En dat is een bewuste, krachtige
              keuze.
            </p>
            <p className="mt-4 leading-relaxed text-room/80">
              Mijn aanbod is speciaal voor jou als je{' '}
              <strong className="font-semibold text-room">
                klaar bent om de verantwoordelijkheid over je eigen gezondheid weer in eigen handen te nemen
              </strong>
              .
            </p>
            <p className="mt-4 leading-relaxed text-room/80">
              Echte gezondheid en vrijheid komen niet aanwaaien; ze ontstaan wanneer jij besluit de regie te pakken.
              Ik ben er niet om een snelle pleister te plakken, maar om jouw gids te zijn naar een duurzame
              transformatie.
            </p>
          </div>

          <div className="rounded-2xl bg-room/5 p-6 ring-1 ring-room/15 sm:p-8">
            <h3 className="titel text-2xl text-room sm:text-3xl">Wij zijn een match als jij:</h3>
            <ul className="mt-5 space-y-4">
              {MATCH.map(([dik, rest]) => (
                <li key={dik} className="flex items-start gap-3 leading-relaxed text-room/80">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-mosterd" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-room">{dik}</strong> {rest}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-room/90">
          Herken jij die vonk in jezelf? Dan sta ik met al mijn ervaring en passie klaar om samen met jou de weg te
          bewandelen naar een vitaal lichaam en een stralende, gezonde mond.
        </p>

        {/* Dit blok sluit elke pagina af, dus hier hoort de stap naar haar toe:
            eerst de agenda, daarnaast het contactblok dat er direct onder staat. */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={CAL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-mosterd px-6 py-3.5 font-semibold text-inkt transition hover:bg-mosterd/85"
          >
            <CalendarCheck className="h-5 w-5" /> Plan direct een kennismaking
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-full border border-room/40 px-6 py-3.5 font-semibold text-room transition hover:bg-room hover:text-inkt"
          >
            Neem rechtstreeks contact op <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- contact ---------- */

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="kicker text-olijf">Contact</p>
          <h2 className="titel mt-2 text-3xl text-inkt sm:text-4xl">Laten we kennis maken</h2>
          <p className="mt-5 leading-relaxed text-inkt/75">
            Een vraag over je mond, een kennismaking inplannen of een lezing bespreken. Stuur een bericht
            of bel me gerust.
          </p>
          <a
            href={CAL}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-petrol px-6 py-3.5 font-semibold text-white transition hover:bg-petrol-diep"
          >
            <CalendarCheck className="h-5 w-5" /> Plan direct een kennismaking
          </a>
          <p className="mt-2 text-sm text-inkt/60">Kies zelf een moment in mijn agenda.</p>
          <div className="mt-8 space-y-4">
            <a href={`tel:${TEL}`} className="flex items-center gap-3 text-inkt hover:text-petrol">
              <Phone className="h-5 w-5 text-olijf" /> {TEL_TONEN}
            </a>
            <a href={`mailto:${MAIL}`} className="flex items-center gap-3 text-inkt hover:text-petrol">
              <Mail className="h-5 w-5 text-olijf" /> {MAIL}
            </a>
            <a href={INSTA} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-inkt hover:text-petrol">
              <Instagram className="h-5 w-5 text-olijf" /> marjon_ooteman_1
            </a>
            <a href={FB} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-inkt hover:text-petrol">
              <Facebook className="h-5 w-5 shrink-0 text-olijf" />{' '}
              <span className="whitespace-nowrap">Bewust gezond in je mond</span>
            </a>
            <p className="flex items-center gap-3 text-inkt/70">
              <MapPin className="h-5 w-5 text-olijf" /> Woonachtig in Schagen, werkzaam in heel Noord-Holland
            </p>
          </div>
        </div>
        <Formulier />
      </div>
    </section>
  );
}

/* Elke pagina eindigt hiermee: eerst het pioniersblok, dan het contactblok
   precies zoals het op de voorpagina staat. */
function Afsluiting() {
  return (
    <>
      <Pioniers />
      <Contact />
    </>
  );
}

/* ---------- footer ---------- */

function Footer() {
  return (
    <footer className="bg-inkt py-12 pb-28 text-room/75 md:pb-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Bloem className="h-10 w-10 text-room/50" />
          {/* Zelfde regel als in de kop: de slogan is de merknaam, niet haar eigen naam. */}
          <p className="merknaam whitespace-nowrap text-[4.3vw] leading-none text-room min-[420px]:text-lg">Bewust Gezond in je Mond</p>
        </div>
        <div className="text-sm">
          <p>{TEL_TONEN}</p>
          <p>{MAIL}</p>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-2 border-t border-room/15 px-5 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>Gegevens uit het formulier gebruik ik alleen om je vraag te beantwoorden en bewaar ik niet langer dan nodig.</p>
        {/* Een privacyverklaring, want er is er maar een: het aparte document
            over het patientendossier is vervallen met de behandelpraktijk.
            Daarnaast de knop om je cookiekeuze te wijzigen, want intrekken
            moet even makkelijk zijn als geven. De laatste link wijst naar
            buiten: klachten lopen via de beroepsvereniging
            (NVM-mondhygienisten). Dus geen ga(), dat is de interne router. */}
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1">
          <a
            href={PRIVACY_PAD}
            onClick={(e) => ga(e, PRIVACY_PAD)}
            className="underline underline-offset-4 transition hover:text-room"
          >
            Privacyverklaring
          </a>
          <CookieKeuzeKnop />
          <a
            href={KLACHTEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition hover:text-room"
          >
            Klachtenregeling
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- mobiele balk ---------- */

function MobielCta({href = '/#contact'}: {href?: string}) {
  const [toon, setToon] = useState(true);
  const zichtbaar = useRef(new Set<Element>());
  useEffect(() => {
    // alleen de contactformulieren tellen mee, dus de balk staat nooit over de
    // verstuurknop van het contactblok heen. Het nieuwsbriefblok is ook een
    // form maar laat de balk met opzet staan: daar wil iemand juist nog kunnen
    // bellen of contact opnemen.
    const doelen = document.querySelectorAll('form[data-contact]');
    if (!doelen.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) zichtbaar.current.add(e.target);
          else zichtbaar.current.delete(e.target);
        }
        setToon(zichtbaar.current.size === 0);
      },
      {threshold: 0.2},
    );
    doelen.forEach((d) => io.observe(d));
    return () => io.disconnect();
  }, []);
  if (!toon) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-zand-diep bg-room/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <a
        href={href}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-petrol px-5 py-3 font-semibold text-white"
      >
        Neem contact op
      </a>
      <a
        href={`tel:${TEL}`}
        className="flex items-center justify-center rounded-full border border-inkt/25 px-5 py-3 text-inkt"
        aria-label="Bellen"
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}

/* ---------- adres dat niet bestaat ---------- */

function NietGevonden() {
  return (
    <main id="inhoud" tabIndex={-1} className="pt-28 pb-20 sm:pt-32">
      <div className="mx-auto max-w-2xl px-5 text-center">
        <Bloem className="mx-auto h-16 w-16 text-olijf" />
        <h1 className="titel mt-6 text-3xl text-inkt sm:text-4xl">Deze pagina bestaat niet</h1>
        <p className="mt-4 leading-relaxed text-inkt/75">
          Misschien is het adres verhuisd of staat er een typefout in. Hieronder staan de plekken
          waar je wel terechtkunt.
        </p>
        <div className="mt-8 grid gap-2 text-left sm:grid-cols-2">
          {[
            ['Naar de voorpagina', '/'],
            ['Over mij', '/#over'],
            ['Mijn aanpak', '/#specialisaties'],
            ['Contact', '/#contact'],
          ].map(([naam, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-xl bg-white px-5 py-4 font-semibold text-petrol ring-1 ring-zand-diep transition hover:bg-zand/40"
            >
              {naam}
            </a>
          ))}
        </div>
        <p className="mt-8 text-sm text-inkt/60">
          Kom je er niet uit? Bel of app me op{' '}
          <a href={`tel:${TEL}`} className="font-semibold text-petrol underline underline-offset-4">
            {TEL_TONEN}
          </a>
          .
        </p>
      </div>
    </main>
  );
}

/* ---------- routering ----------

   De voorpagina blijft een pagina met ankers (#kennis, #contact). De vijf
   pijlers hebben een echt adres: /aanpak/<slug>. Dat is bewust geen
   hash-route, want Google leest een hash niet als aparte pagina en juist deze
   pagina's moeten gevonden worden.

   Elk van die adressen staat sinds de verhuizing naar jiw-websites als eigen
   bestand in dist/ (zie scripts/prerender.mjs), met de hele pagina al als HTML
   erin. Het pad komt daarom niet meer rechtstreeks uit window: bij het bakken
   is er geen window, en dan zou in elk bestand de voorpagina staan. Het komt
   uit PadContext, die bij het bakken en in de browser op dezelfde waarde staat
   (src/pad.tsx). Daarna is het gewoon weer window, want een klik binnen de site
   wisselt de pagina zonder herladen. */

function useRoute() {
  const begin = usePad();
  const [pad, setPad] = useState(begin);
  useEffect(() => {
    const fn = () => setPad(normaliseerPad(window.location.pathname));
    /* Eén keer nu: tijdens het opstarten kan het adres al verder zijn dan de
       HTML die we aantroffen (iemand klikt voordat React er is). */
    fn();
    window.addEventListener('popstate', fn);
    return () => window.removeEventListener('popstate', fn);
  }, []);
  return pad;
}

export default function App() {
  const pad = useRoute();
  const schoon = normaliseerPad(pad);
  const spec = schoon.startsWith('/aanpak/') ? vindSpec(schoon.slice('/aanpak/'.length)) : undefined;
  /* Twee adressen, een pagina. /privacyverklaring was het aparte document over
     het patientendossier; dat bestaat niet meer sinds ze alleen online coacht.
     Het adres is gedeeld en staat bij Google, dus het blijft werken en komt op
     de verklaring uit. De canonieke verwijzing staat op /privacy. */
  const privacy = schoon === PRIVACY_PAD || schoon === VERKLARING_PAD;
  /* Werkoverleg, geen onderdeel van de site: staat niet in het menu, niet in de
     sitemap en op noindex. Bedoeld om door te sturen en te laten kiezen. */
  const reviews = schoon === REVIEWS_PAD;
  /* Een adres dat niet bestaat hoort niet de voorpagina te laten zien. Dat deed
     het eerder wel: Cloudflare stuurde elk onbekend pad naar index.html en de
     app liet daar de homepage zien, met een 200 erbij. Dat is een zachte 404 -
     Google indexeert hem als kopie van de voorpagina. Nu antwoordt Cloudflare
     met 404.html en een echte 404, en laat deze tak zien wat er aan de hand is. */
  const bestaat = schoon === '/' || Boolean(spec) || privacy || reviews;
  const losseP = Boolean(spec) || privacy || reviews || !bestaat;

  useEffect(() => {
    if (losseP) window.scrollTo({top: 0, behavior: 'auto'});
  }, [losseP, pad]);

  return (
    <>
      {/* op een specialisatiepagina mag dit geen hash-sprong zijn: elke hash die
          niet met /aanpak/ begint stuurt je terug naar de voorpagina */}
      <a
        href="/#over"
        onClick={(e) => {
          if (!losseP) return;
          e.preventDefault();
          const el = document.getElementById('inhoud');
          el?.scrollIntoView({block: 'start'});
          el?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-petrol focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Naar de inhoud
      </a>
      <Nav />
      {!bestaat ? (
        <NietGevonden />
      ) : reviews ? (
        <ReviewsPagina />
      ) : privacy ? (
        <PrivacyPagina tel={TEL} telTonen={TEL_TONEN} mail={MAIL} />
      ) : spec ? (
        <SpecialisatiePagina spec={spec} afsluiting={<Afsluiting />} />
      ) : (
        <main>
          <Hero />
          <Balk />
          {/* Haar eigen verhaal staat nu direct onder de hero: wie ben ik, voordat
              iemand aan de aanpak begint. */}
          <Over />
          <Ikigai />
          <Kennis />
          <Inspiratie />
          {/* Staat hier en niet in Afsluiting: de aanmelding hoort bij de
              artikelen hierboven, dus alleen op de voorpagina en niet onder elke
              pijlerpagina. */}
          <Nieuwsbrief />
          <Afsluiting />
        </main>
      )}
      <Footer />
      {/* opnieuw opbouwen bij wisselen van pagina: de balk kijkt naar de
          formulieren die op dat moment op de pagina staan */}
      <MobielCta
        key={!bestaat ? '404' : reviews ? 'reviews' : privacy ? 'privacy' : spec ? spec.slug : 'home'}
        href={contactHref(pad)}
      />
      <CookieMelding />
    </>
  );
}
