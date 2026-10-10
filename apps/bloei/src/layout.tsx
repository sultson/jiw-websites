import {useEffect, useState} from 'react';
import {
  ArrowLeft, Facebook, Menu, Navigation, Phone, X,
} from 'lucide-react';
import Aanvraag from './Aanvraag';
import KaartLazy from './KaartLazy';
import {usePad} from './pad';
import {
  Bullet, FACEBOOK, Kicker, Merk, PLAATS, ROUTE, STREEKKERNEN, Section, STRAAT, TEL,
  TEL_DISPLAY, WA_DONKER, WA_GROEN, WHATSAPP, WhatsAppMerk, useFormKnopInBeeld, KNOP_HOOFD,
} from './ui';

/* ------------------------------------------------------------------ */
/*  Gedeeld tussen de homepage en de onderwerppagina's                 */
/* ------------------------------------------------------------------ */

/**
 * Nav, footer, de vaste balk op mobiel en de twee slotsecties staan hier en
 * niet in App: elke onderwerppagina eindigt met "Vertel wat u zoekt" en
 * daaronder "Waar u ons vindt", dus die horen op één plek te staan in plaats
 * van vier keer overgeschreven te worden.
 */

/* ------------------------------------------------------------------ */
/*  De balk bovenaan                                                   */
/* ------------------------------------------------------------------ */

/**
 * Een zwevende kaart in plaats van een balk van rand tot rand.
 *
 * Hij stond hier eerst als een strook op room met een lijn eronder, met het
 * naambord erin geknipt uit de foto van de gevel. Dat bord bracht zijn eigen
 * groene vlak mee en lag daarmee als een postzegel op een lichte strook. Nu is
 * het logo vrijstaand (zie Merk) en staat de balk zelf op het groen van hun
 * bord: dan is het groen om het logo heen de kaart, en niet een rechthoekje
 * eromheen.
 *
 * Dat hij zweeft doet nog iets: de kopfoto loopt eronder door tot de bovenrand
 * van het scherm, dus de foto begint niet pas onder een balk maar vult het hele
 * beeld. Daar is die foto goed genoeg voor.
 *
 * De hoogte komt uit het logo en niet andersom. Het blad steekt boven de letters
 * uit en de vuurtoren staat eronder, dus het logo is veel hoger dan het stuk
 * bord dat hier eerst zat; een balk op de oude hoogte snijdt de punt van het
 * blad eraf. Vandaar een kaart die ruimer is dan gebruikelijk.
 */
const MENU: [string, string][] = [
  ['Assortiment', '/assortiment/'],
  ['Kerst', '/kerst/'],
  ['Abonnement', '/abonnement/'],
  ['Cadeau', '/cadeau/'],
  ['Over ons', '#over'],
  ['Openingstijden', '#bezoek'],
];

export function Nav() {
  const [open, setOpen] = useState(false);
  /* De menu-items zijn deels sprongen binnen de homepage. Staat de bezoeker op
     een onderwerppagina, dan moet er eerst terug naar / gesprongen worden,
     anders wijst #over naar een anker dat daar niet bestaat. Het pad komt uit
     de context en niet uit een effect, zodat de goede href al in de gebakken
     HTML staat en niet pas nadat React heeft gedraaid. */
  const thuis = usePad() === '/';
  /* Een echt adres blijft zoals het is. Een sprong (#over) bestaat alleen op de
     homepage-secties die elke pagina deelt: #bezoek staat overal, #over alleen
     thuis, dus die krijgt er buiten de homepage een / voor. */
  const naar = (href: string) =>
    href.startsWith('/') || thuis || href === '#bezoek' ? href : `/${href}`;

  return (
    <>
      {/* Wie met het toetsenbord navigeert komt anders bij elke pagina eerst
          door zes menu-items en twee knoppen heen voordat hij bij de tekst is.
          Deze link staat er als eerste en is onzichtbaar tot hij focus krijgt. */}
      <a
        href="#inhoud"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Naar de inhoud
      </a>
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] bg-ink-soft/92 text-white shadow-[0_18px_50px_-24px_rgb(20_32_12_/_0.85)] ring-1 ring-white/10 backdrop-blur-xl sm:rounded-[1.85rem]">
        <div className="flex items-center justify-between gap-5 px-4 py-2.5 sm:px-5 sm:py-3">
          <a href={thuis ? '#top' : '/'} aria-label="Bloei! Ouddorp, naar boven">
            <Merk maat="h-[44px] sm:h-[52px] xl:h-[58px]" plaatje />
          </a>

          {/* Zes items passen op 1024 px niet naast het logo en het nummer: dan
              breekt "Over ons" over twee regels en wordt de kaart hoger. Vanaf
              1280 px is er ruimte; daaronder doet het uitklapmenu hetzelfde werk
              en staat het nummer er nog steeds naast. */}
          <nav className="hidden items-center gap-6 xl:flex">
            {MENU.map(([label, href]) => (
              <a
                key={href}
                href={naar(href)}
                className="whitespace-nowrap text-sm font-medium text-white/75 transition hover:text-accent"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Het nummer stond bij Fleurig! als volle knop in de balk, even zwaar
                als de knop in de hero. Twee hoofdknoppen tegelijk in beeld laat de
                bezoeker kiezen in plaats van volgen, dus hier alleen een rand. Hij
                staat buiten het menu, zodat bellen ook op een tablet één klik
                blijft. */}
            <a
              href={`tel:${TEL}`}
              className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent hover:bg-white/10 sm:flex"
            >
              <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Menu sluiten' : 'Menu openen'}
              aria-expanded={open}
              aria-controls="hoofdmenu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 text-accent transition hover:bg-white/10 xl:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div id="hoofdmenu" className="border-t border-white/10 xl:hidden">
            <div className="px-5 py-2">
              {MENU.map(([label, href]) => (
                <a
                  key={href}
                  href={naar(href)}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/10 py-3 text-sm font-medium text-white/80 last:border-0"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Kop van een onderwerppagina                                        */
/* ------------------------------------------------------------------ */

/**
 * Geen tweede hero met volvlaks foto: die hoort bij de homepage. Hier een
 * kortere kop met de foto ernaast, zodat meteen duidelijk is dat dit een
 * onderdeel van de winkel is en niet een nieuwe site.
 */
export function PaginaKop({
  kicker, titel, intro, img, alt, imgClass, children,
}: {
  kicker: string;
  titel: string;
  intro: string;
  img: string;
  alt: string;
  /* Een uitgesneden stuk (alfa) kan niet object-cover: dan snijdt het kader er
     bloemen af. Zulke beelden geven hier hun eigen klassen mee. */
  imgClass?: string;
  children?: React.ReactNode;
}) {
  return (
    <Section tone="diep" ranken={1} className="pt-32 sm:pt-40">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <a
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink/50 transition hover:text-accent-dark"
          >
            <ArrowLeft className="h-4 w-4" /> Terug naar de winkel
          </a>
          <Kicker>{kicker}</Kicker>
          <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl">{titel}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">{intro}</p>
          {children}
        </div>

        <img
          src={img}
          alt={alt}
          fetchPriority="high"
          className={imgClass ?? 'aspect-[4/3] w-full rounded-2xl object-cover lg:aspect-[4/4.4]'}
        />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Formulier                                                          */
/* ------------------------------------------------------------------ */

/**
 * Dit is het enige donkere vlak op de hele site, en dat is met opzet. De winkel
 * wilde af van het zwart, dus de pagina staat van boven tot onder op lichtgroen
 * — maar dan heeft het formulier niets meer dat het van de rest scheidt, en
 * loopt het als vierde lichtgroene sectie op rij mee in de stroom. Eén donker
 * vlak, in het groen van hun eigen bord en niet in zwart, zet de enige plek
 * waar de bezoeker iets moet dóén apart van de rest.
 */
export function VraagAan() {
  return (
    <Section id="vraag-aan" tone="ink" ranken={2} className="pb-6 sm:pb-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div>
          <Kicker light>Aanvraag</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Vertel wat u zoekt</h2>
          <p className="mt-4 leading-relaxed text-white/70">
            Een boeket, plantenbak of cadeaupakket op maat? Of staat het niet in de winkel? Vertel
            in een paar stappen wat u zoekt.
          </p>

          {/* Kort houden is hier het punt: drie regels van vier woorden lees je
              in één blik, vier volle regels sla je over. */}
          <ul className="mt-7 space-y-3 text-sm text-white/80">
            <Bullet light>U hoort wat kan en wat het kost</Bullet>
            <Bullet light>Nog geen bestelling, u zit nergens aan vast</Bullet>
            <Bullet light>Liever persoonlijk? Loop binnen of bel</Bullet>
          </ul>

          <div className="mt-8 space-y-3 border-t border-white/10 pt-7 text-sm">
            <a href={`tel:${TEL}`} className="flex items-center gap-3 text-white/85 transition hover:text-accent">
              <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
            </a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/85 transition hover:text-accent">
              <WhatsAppMerk className="h-4 w-4" style={{color: WA_GROEN}} /> WhatsApp
            </a>
          </div>
        </div>

        <Aanvraag />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Bezoek                                                             */
/* ------------------------------------------------------------------ */

/**
 * NOG TE BEVESTIGEN — deze tijden zijn een aanname, zie site.config.mjs.
 * Ze staan nergens openbaar en de eigenaren hebben ze niet doorgegeven.
 */
const ROOSTER: [string, string][] = [
  ['Maandag', '9:00 - 18:00'],
  ['Dinsdag', '9:00 - 18:00'],
  ['Woensdag', '9:00 - 18:00'],
  ['Donderdag', '9:00 - 18:00'],
  ['Vrijdag', '9:00 - 18:00'],
  ['Zaterdag', '9:00 - 17:00'],
  ['Zondag', 'Gesloten'],
];

/**
 * Wit in plaats van room: "Vertel wat u zoekt" staat er vlak boven op het
 * donkere groen, en daaronder hoort een vlak dat daar duidelijk van verschilt.
 */
export function Bezoek({streek = false, kraag = false}: {streek?: boolean; kraag?: boolean} = {}) {
  const [vandaag, setVandaag] = useState<string | null>(null);

  useEffect(() => {
    const naam = new Intl.DateTimeFormat('nl-NL', {timeZone: 'Europe/Amsterdam', weekday: 'long'}).format(new Date());
    setVandaag(naam.charAt(0).toUpperCase() + naam.slice(1));
  }, []);

  return (
    <Section id="bezoek" tone="wit" kraag={kraag}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
        <div>
          <Kicker>Waar u ons vindt</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">{STRAAT}, Ouddorp</h2>
          <p className="mt-4 leading-relaxed text-ink/65">
            Het groene bord op de gevel, de karren met planten ervoor, het buitenterrein erachter.
            Parkeren kan voor de deur.
          </p>

          {streek && (
            <p className="mt-4 leading-relaxed text-ink/65">
              Klanten komen uit heel Goeree-Overflakkee: {STREEKKERNEN.slice(0, -1).join(', ')} en{' '}
              {STREEKKERNEN.at(-1)}.
            </p>
          )}

          <dl className="mt-7 divide-y divide-line border-y border-line text-sm">
            {ROOSTER.map(([dag, tijd]) => {
              const isVandaag = dag === vandaag;
              const dicht = tijd === 'Gesloten';
              return (
                <div key={dag} className={`flex items-center justify-between py-2.5 ${isVandaag ? 'text-ink' : 'text-ink/70'}`}>
                  <dt className={isVandaag ? 'font-semibold' : ''}>
                    {dag}
                    {isVandaag && <span className="ml-2 rounded-full bg-accent-dark/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-dark">vandaag</span>}
                  </dt>
                  <dd className={dicht ? 'text-ink/40' : isVandaag ? 'font-semibold' : ''}>{tijd}</dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-7 space-y-3 text-sm">
            <a href={ROUTE} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ink/80 transition hover:text-accent-dark">
              <Navigation className="h-4 w-4 shrink-0 text-accent-dark" /> {STRAAT}, {PLAATS}
            </a>
            <a href={`tel:${TEL}`} className="flex items-center gap-3 text-ink/80 transition hover:text-accent-dark">
              <Phone className="h-4 w-4 shrink-0 text-accent-dark" /> {TEL_DISPLAY}
            </a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ink/80 transition hover:text-accent-dark">
              <WhatsAppMerk className="h-4 w-4 shrink-0" style={{color: WA_DONKER}} /> WhatsApp
            </a>
          </div>
        </div>

        <div>
          <figure className="mb-4">
            <img
              src="/img/winkelpui.webp"
              alt="De gevel van Bloei! aan het Hogepad, met het groene naambord en de planten ervoor"
              loading="lazy"
              width={1200}
              height={750}
              className="aspect-[16/10] w-full rounded-2xl object-cover"
            />
            <figcaption className="mt-2 text-xs text-ink/50">Zo staan we erbij aan het Hogepad</figcaption>
          </figure>
          {/* De kaart heeft zelf een 'Openen in Maps'-link, dus een knop
              eronder zou dezelfde stap nog een keer aanbieden. */}
          <KaartLazy />
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

const FOOTER_LINKS: [string, string][] = [
  ['Assortiment', '/assortiment/'],
  ['Kerst', '/kerst/'],
  ['Abonnement', '/abonnement/'],
  ['Cadeau', '/cadeau/'],
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          {/* Het vrijstaande logo op het donkere vlak: crème letters op het
              groen van hun bord, precies waar die letters voor gemaakt zijn. */}
          <Merk maat="h-[72px]" plaatje />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            Bloemen, planten, tuin en wonen aan het Hogepad in Ouddorp. Binnen en buiten, het hele jaar
            door.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-accent hover:text-accent">
              <Facebook className="h-4 w-4" />
            </a>
            {/* Het eigen groen van WhatsApp, zodat deze er niet als derde
                naamloze cirkel bij staat. */}
            <a href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:brightness-110" style={{backgroundColor: WA_GROEN}}>
              <WhatsAppMerk className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">In de winkel</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {FOOTER_LINKS.map(([label, href]) => (
              <li key={href}><a href={href} className="transition hover:text-accent">{label}</a></li>
            ))}
            <li>Cadeaubon</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Winkel</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>{STRAAT}</li>
            <li>{PLAATS}</li>
            <li className="pt-2">Maandag t/m zaterdag</li>
            <li>9:00 - 18:00, zaterdag tot 17:00</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li><a href={`tel:${TEL}`} className="transition hover:text-accent">{TEL_DISPLAY}</a></li>
            <li><a href={WHATSAPP} target="_blank" rel="noreferrer" className="transition hover:text-accent">WhatsApp</a></li>
            <li><a href={ROUTE} target="_blank" rel="noreferrer" className="transition hover:text-accent">Route</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/35 sm:px-8">
          Bloei!, Ouddorp
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Vaste balk op mobiel                                               */
/* ------------------------------------------------------------------ */

/**
 * De balk verdwijnt zodra er al een hoofdknop in beeld staat: die van de hero
 * of die van het formulier. Anders staan er op een telefoon twee even zware
 * knoppen tegelijk, en dan is er geen rangorde meer maar een keuzemenu.
 */
export function MobielBalk() {
  const hoofdknopInBeeld = useFormKnopInBeeld();
  if (hoofdknopInBeeld) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center gap-2.5">
        <a
          href={ROUTE}
          target="_blank"
          rel="noreferrer"
          className={`${KNOP_HOOFD} knop-bloem-smal flex-1 px-5 py-3.5 text-sm`}
        >
          <Navigation className="h-4 w-4" /> Route
        </a>
        <a
          href={`tel:${TEL}`}
          aria-label="Bel ons"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/25 text-accent"
        >
          <Phone className="h-5 w-5" />
        </a>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          aria-label="Stuur een appje"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
          style={{backgroundColor: WA_GROEN, color: '#fff'}}
        >
          <WhatsAppMerk className="h-[22px] w-[22px]" />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Onderwerppagina                                                    */
/* ------------------------------------------------------------------ */

/**
 * Het afgesproken slot van elke onderwerppagina: eerst "Vertel wat u zoekt",
 * daaronder "Waar u ons vindt". Staat hier als wrapper zodat die volgorde niet
 * per pagina opnieuw gezet wordt en er dus ook niet één uit de pas kan lopen.
 */
export function Pagina({children}: {children: React.ReactNode}) {
  return (
    <>
      <Nav />
      <main id="inhoud" className="pb-20 md:pb-0">
        {children}
        <VraagAan />
        <Bezoek kraag />
      </main>
      <Footer />
      <MobielBalk />
    </>
  );
}
