import {useEffect, useState} from 'react';
import {
  ArrowLeft, Camera, CircleAlert, Instagram, Mail, Menu, MessageCircle,
  Navigation, Phone, X,
} from 'lucide-react';
import Aanvraag from './Aanvraag';
import KaartLazy from './KaartLazy';
import {usePad} from './pad';
import {
  BEZORGGEBIED, BEZORGKERNEN, BEZORGKOSTEN, Bullet, EMAIL, FACEBOOK, GESLOTEN, INSTAGRAM, Kicker,
  Merk, PLAATS, ROUTE, Section, STRAAT, TEL, TEL_DISPLAY, TIJDELIJK_GESLOTEN, WHATSAPP,
  useFormKnopInBeeld, KNOP_HOOFD,
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
/*  Tijdelijk gesloten                                                 */
/* ------------------------------------------------------------------ */

/**
 * De melding zit in de vaste kop en niet ergens in de pagina. Dat is met opzet:
 * hij staat zo op elke pagina, hij staat er meteen, en hij blijft staan terwijl
 * de bezoeker doorleest. Wie hier komt voor bloemen hoort het te weten voordat
 * hij een pagina lang bekijkt wat we allemaal maken, en niet pas onderaan bij
 * de openingstijden.
 *
 * Framboos en niet groen: de rest van de kop is donkergroen, en een melding die
 * dezelfde kleur heeft als waar hij op ligt is geen melding.
 */
function GeslotenBalk() {
  return (
    <div className="bg-roze text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-5 py-2 text-center sm:px-8">
        <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
        <p className="text-xs font-semibold leading-snug sm:text-sm">
          <span className="uppercase tracking-wider">{GESLOTEN.kop}.</span> {GESLOTEN.kort}
        </p>
      </div>
    </div>
  );
}

/* Dezelfde randknop als op de donkere vlakken, een maat kleiner: hier staan er
   twee naast elkaar en zijn het geen hoofdknoppen. */
const KNOP_TWEEDE_DONKER_KLEIN =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-2.5 ' +
  'text-sm font-semibold text-white/90 transition hover:border-white hover:bg-white/10';

/**
 * Het briefje in de kop van een onderwerppagina, op de plek waar de knoppen
 * naar het formulier stonden. Vier pagina's, dus één keer opschrijven: anders
 * staat er op Rouwbloemen straks iets anders dan op Trouwbloemen.
 */
export function GeslotenKopMelding() {
  return (
    <div className="mt-8 flex max-w-xl items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.06] p-4 text-sm leading-relaxed text-white/75">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-bloesem" aria-hidden="true" />
      <p>
        <span className="font-semibold text-white">{GESLOTEN.kop}.</span> We nemen op dit moment geen
        aanvragen aan. Wat hieronder staat, maken we zodra we weer open zijn.
      </p>
    </div>
  );
}

/**
 * Wat er staat waar het formulier stond. Dezelfde plek, dezelfde sprong
 * (#vraag-aan), zodat elke knop en elke link die daarheen wees hier uitkomt en
 * leest waarom er niets in te vullen valt, in plaats van bij een leeg vlak.
 */
export function GeslotenPaneel() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-roze px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
        <CircleAlert className="h-4 w-4" aria-hidden="true" /> {GESLOTEN.kop}
      </span>
      <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">De winkel is tijdelijk gesloten</h2>
      <p className="mt-5 leading-relaxed text-white/75">{GESLOTEN.lang}</p>

      {/* Bellen, appen en mailen blijven staan. Ze zijn er om iemand te
          bereiken die er al mee bezig was, niet om alsnog iets te bestellen:
          vandaar geen roze knop, alleen de gegevens. */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-white/10 pt-7 text-sm">
        <a href={`tel:${TEL}`} className="flex items-center gap-2 text-white/85 transition hover:text-accent">
          <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
        </a>
        <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/85 transition hover:text-accent">
          <MessageCircle className="h-4 w-4 text-accent" /> WhatsApp
        </a>
        <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-white/85 transition hover:text-accent">
          <Mail className="h-4 w-4 text-accent" /> {EMAIL}
        </a>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <a href={INSTAGRAM} target="_blank" rel="noreferrer" className={KNOP_TWEEDE_DONKER_KLEIN}>
          <Instagram className="h-4 w-4 text-accent" /> Instagram
        </a>
        <a href={FACEBOOK} target="_blank" rel="noreferrer" className={KNOP_TWEEDE_DONKER_KLEIN}>
          <Camera className="h-4 w-4 text-accent" /> Facebook
        </a>
      </div>
    </div>
  );
}

/**
 * De balk bovenaan was een lijst sprongen binnen de homepage. Dat werkt op de
 * homepage, maar het betekende ook dat de vier onderwerppagina's alleen via de
 * footer te bereiken waren, en dat ze onderling helemaal niet naar elkaar
 * wezen: vanaf Rouwbloemen was Trouwbloemen twee klikken weg. Voor een bezoeker
 * is dat lastig, en voor een zoekmachine is een pagina waar bijna niets naartoe
 * wijst een pagina die er niet zo toe doet.
 *
 * Nu staan de vier echte pagina's in de balk, op elke pagina, dus wijst alles
 * naar alles. Wat een sprong binnen de pagina is (#) blijft dat; die twee staan
 * op elke pagina, want ze zitten in het slot dat elke pagina deelt.
 */
const MENU: [string, string][] = [
  ['Boeketten', '/boeketten/'],
  ['Abonnement', '/abonnement/'],
  ['Rouwbloemen', '/rouwbloemen/'],
  ['Trouwbloemen', '/trouwbloemen/'],
  ['Over ons', '#over'],
  /* Zolang de winkel dicht is staan er geen openingstijden onder deze sprong
     maar de melding en het adres, en dan hoort er ook iets anders te staan. */
  [TIJDELIJK_GESLOTEN ? 'Contact' : 'Openingstijden', '#bezoek'],
];

export function Nav() {
  const [open, setOpen] = useState(false);
  /* De menu-items zijn sprongen binnen de homepage. Staat de bezoeker op een
     onderwerppagina, dan moet er eerst terug naar / gesprongen worden, anders
     wijst #winkel naar een anker dat daar niet bestaat. Het pad komt uit de
     context en niet uit een effect, zodat de goede href al in de gebakken HTML
     staat en niet pas nadat React heeft gedraaid. */
  const thuis = usePad() === '/';
  /* Een echt adres blijft zoals het is. Een sprong (#over) bestaat alleen op de
     homepage-secties die elke pagina deelt: #bezoek staat overal, #over alleen
     thuis, dus die krijgt er buiten de homepage een / voor. */
  const naar = (href: string) =>
    href.startsWith('/') || thuis || href === '#bezoek' ? href : `/${href}`;

  return (
    <>
      {/* Wie met het toetsenbord navigeert komt anders bij elke pagina eerst
          door vijf menu-items en drie knoppen heen voordat hij bij de tekst is.
          Deze link staat er als eerste en is onzichtbaar tot hij focus krijgt. */}
      <a
        href="#inhoud"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
      >
        Naar de inhoud
      </a>
    <header className="fixed inset-x-0 top-0 z-50 bg-ink text-white shadow-[0_1px_0_0_rgb(255_255_255_/_0.08)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
        <a href={thuis ? '#top' : '/'} aria-label="Fleurig! bloemenwinkel, naar boven">
          {/* Balk: het aangeleverde bord als plaatje. De aftiteling houdt het
              masker, zodat het verschil op een pagina te zien is. Iets hoger
              gezet dan het masker, want op dit bord zit boven en onder de
              letter nog zwart, dus anders staat dezelfde letter kleiner. */}
          <Merk maat="h-[36px] sm:h-[44px]" plaats plaatje />
        </a>

        {/* Zes items passen op 1024 px niet naast het logo en het nummer: dan
            breekt "Over ons" over twee regels en wordt de balk hoger. Vanaf
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
          {/* Het nummer stond hier als volle roze knop, even zwaar als de knop
              in de hero. Twee hoofdknoppen tegelijk in beeld laat de bezoeker
              kiezen in plaats van volgen, dus hier alleen een rand. Hij staat
              buiten het menu, zodat bellen ook op een tablet één klik blijft. */}
          <a
            href={`tel:${TEL}`}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-white hover:bg-white/10 sm:flex"
          >
            <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={open}
            aria-controls="hoofdmenu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 text-accent xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {TIJDELIJK_GESLOTEN && <GeslotenBalk />}

      {open && (
        <div id="hoofdmenu" className="border-t border-white/10 bg-ink xl:hidden">
          <div className="mx-auto max-w-6xl px-5 py-3">
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
    </header>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Kop van een onderwerppagina                                        */
/* ------------------------------------------------------------------ */

/**
 * Geen tweede hero met volvlaks foto: die hoort bij de homepage. Hier een
 * kortere donkere kop met de foto ernaast, zodat meteen duidelijk is dat dit
 * een onderdeel van de winkel is en niet een nieuwe site.
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
     bloemen af en zie je een halve krans. Zulke beelden geven hier hun eigen
     klassen mee en staan contain, zonder afgeronde hoeken. */
  imgClass?: string;
  children?: React.ReactNode;
}) {
  return (
    /* De meldingsbalk maakt de vaste kop hoger, dus begint de inhoud lager. */
    <Section tone="ink" ranken={1} className={TIJDELIJK_GESLOTEN ? 'pt-24 sm:pt-28' : 'pt-16 sm:pt-20'}>
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <a
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Terug naar de winkel
          </a>
          <Kicker light>{kicker}</Kicker>
          <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl">{titel}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{intro}</p>
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

export function VraagAan() {
  /* Geen formulier zolang de winkel dicht is. De sectie blijft staan, met
     hetzelfde adres (#vraag-aan), zodat elke knop die daarheen wees hier
     uitkomt en leest waarom er niets aan te vragen valt. De Worker weigert het
     formulieradres ook, voor het tabblad dat nog openstond. */
  if (TIJDELIJK_GESLOTEN) {
    return (
      <Section id="vraag-aan" tone="ink" ranken={2} className="border-t border-white/10">
        <GeslotenPaneel />
      </Section>
    );
  }

  return (
    <Section id="vraag-aan" tone="ink" ranken={2} className="border-t border-white/10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div>
          <Kicker light>Aanvraag</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Vertel wat u zoekt</h2>
          <p className="mt-4 leading-relaxed text-white/70">
            In een paar korte stappen vertelt u wat u nodig heeft, wanneer, en of u het ophaalt of laat
            bezorgen. Aan het eind drukt u op versturen en komt het bij ons binnen.
          </p>

          <ul className="mt-7 space-y-3 text-sm text-white/80">
            <Bullet light>U hoort van ons wat mogelijk is en wat het kost</Bullet>
            <Bullet light>Een aanvraag, nog geen bestelling: u zit nergens aan vast</Bullet>
            <Bullet light>Bezorgen kan, binnen de Hoeksche Waard voor 6 euro</Bullet>
            <Bullet light>Liever persoonlijk? Loop binnen of bel ons</Bullet>
          </ul>

          <div className="mt-8 space-y-3 border-t border-white/10 pt-7 text-sm">
            <a href={`tel:${TEL}`} className="flex items-center gap-3 text-white/85 transition hover:text-accent">
              <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
            </a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/85 transition hover:text-accent">
              <MessageCircle className="h-4 w-4 text-accent" /> WhatsApp
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-white/85 transition hover:text-accent">
              <Mail className="h-4 w-4 text-accent" /> {EMAIL}
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

const ROOSTER: [string, string][] = [
  ['Maandag', 'Gesloten'],
  ['Dinsdag', 'Gesloten'],
  ['Woensdag', '8:00 - 17:30'],
  ['Donderdag', '8:00 - 17:30'],
  ['Vrijdag', '8:00 - 17:30'],
  ['Zaterdag', '8:00 - 17:30'],
  ['Zondag', 'Gesloten'],
];

/**
 * Deze sectie stond op hetzelfde donkergroen als "Vertel wat u zoekt" dat er
 * vlak boven staat. Op de onderwerppagina's liepen die twee daardoor in elkaar
 * over: één donker vlak van bijna twee schermen hoog, met een gat van tweemaal
 * de sectierand ertussen waar niets stond. Op room hebben de twee weer een
 * echte grens, en het donkere blok van het formulier springt er weer uit.
 */
export function Bezoek({bezorggebied = false}: {bezorggebied?: boolean} = {}) {
  const [vandaag, setVandaag] = useState<string | null>(null);

  useEffect(() => {
    const naam = new Intl.DateTimeFormat('nl-NL', {timeZone: 'Europe/Amsterdam', weekday: 'long'}).format(new Date());
    setVandaag(naam.charAt(0).toUpperCase() + naam.slice(1));
  }, []);

  return (
    <Section id="bezoek" tone="cream">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
        <div>
          <Kicker>Waar u ons vindt</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Molendijk 9-11</h2>
          <p className="mt-4 leading-relaxed text-ink/65">
            Midden in het centrum van Oud-Beijerland, in de overdekte winkelstraat.{' '}
            {TIJDELIJK_GESLOTEN
              ? 'De deur is op dit moment dicht en er staan geen emmers buiten.'
              : 'De emmers staan buiten, u ziet ons zo staan.'}
          </p>

          {/* De bezorgbelofte staat uit zolang er niets te bezorgen valt. */}
          {bezorggebied && !TIJDELIJK_GESLOTEN && (
            <p className="mt-4 leading-relaxed text-ink/65">
              Bezorgen doen we in de hele {BEZORGGEBIED} voor {BEZORGKOSTEN} euro: {BEZORGKERNEN.slice(0, -1).join(', ')}{' '}
              en {BEZORGKERNEN.at(-1)}. Woont de ontvanger daarbuiten, dan overleggen we even wat het kost.
            </p>
          )}

          {TIJDELIJK_GESLOTEN ? (
            <div className="mt-7 rounded-2xl border border-roze/25 bg-roze-zacht p-5">
              <p className="flex items-center gap-2 font-semibold text-roze">
                <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" /> {GESLOTEN.kop}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Er zijn op dit moment geen openingstijden: de winkel is dicht en we nemen geen aanvragen
                aan. Zodra we weer opengaan staat het hier.
              </p>
            </div>
          ) : (
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
          )}

          <div className="mt-7 space-y-3 text-sm">
            <a href={ROUTE} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ink/80 transition hover:text-accent-dark">
              <Navigation className="h-4 w-4 shrink-0 text-accent-dark" /> {STRAAT}, {PLAATS}
            </a>
            <a href={`tel:${TEL}`} className="flex items-center gap-3 text-ink/80 transition hover:text-accent-dark">
              <Phone className="h-4 w-4 shrink-0 text-accent-dark" /> {TEL_DISPLAY}
            </a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ink/80 transition hover:text-accent-dark">
              <MessageCircle className="h-4 w-4 shrink-0 text-accent-dark" /> WhatsApp
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-ink/80 transition hover:text-accent-dark">
              <Mail className="h-4 w-4 shrink-0 text-accent-dark" /> {EMAIL}
            </a>
          </div>
        </div>

        <div>
          <figure className="mb-4">
            <img
              src="/img/winkelpui.webp"
              alt="De winkel aan de Molendijk met de emmers buiten"
              loading="lazy"
              className="aspect-[16/10] w-full rounded-2xl object-cover"
            />
            <figcaption className="mt-2 text-xs text-ink/50">Zo staan we erbij aan de Molendijk</figcaption>
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
  ['Boeketten', '/boeketten/'],
  ['Abonnement', '/abonnement/'],
  ['Rouwbloemen', '/rouwbloemen/'],
  ['Trouwbloemen', '/trouwbloemen/'],
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Merk maat="h-[38px]" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            Bloemenwinkel aan de Molendijk in Oud-Beijerland.{' '}
            {TIJDELIJK_GESLOTEN
              ? 'Op dit moment tijdelijk gesloten.'
              : 'Verse bloemen en bloemwerk op aanvraag.'}
          </p>
          <div className="mt-5 flex gap-3">
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-accent hover:text-accent">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-accent hover:text-accent">
              <Camera className="h-4 w-4" />
            </a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-accent hover:text-accent">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">Wat we maken</p>
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
            {TIJDELIJK_GESLOTEN ? (
              <li className="pt-2 font-semibold text-white/80">{GESLOTEN.kop}</li>
            ) : (
              <>
                <li className="pt-2">Woensdag t/m zaterdag</li>
                <li>8:00 - 17:30</li>
              </>
            )}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li><a href={`tel:${TEL}`} className="transition hover:text-accent">{TEL_DISPLAY}</a></li>
            <li><a href={WHATSAPP} target="_blank" rel="noreferrer" className="transition hover:text-accent">WhatsApp</a></li>
            <li><a href={`mailto:${EMAIL}`} className="transition hover:text-accent">{EMAIL}</a></li>
            <li><a href={ROUTE} target="_blank" rel="noreferrer" className="transition hover:text-accent">Route</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/35 sm:px-8">
          Fleurig! Bloemenwinkel, Oud-Beijerland
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
  /* Deze balk duwt de bezoeker naar de winkel. Zolang die dicht is, is dat
     precies de verkeerde kant op, en de melding staat al vast in de kop. */
  if (TIJDELIJK_GESLOTEN) return null;
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
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/25 text-accent"
        >
          <MessageCircle className="h-5 w-5" />
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
      <main id="inhoud" className={TIJDELIJK_GESLOTEN ? '' : 'pb-20 md:pb-0'}>
        {children}
        <VraagAan />
        <Bezoek />
      </main>
      <Footer />
      <MobielBalk />
    </>
  );
}
