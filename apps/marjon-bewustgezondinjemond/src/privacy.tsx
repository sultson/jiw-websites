import {useEffect, useState} from 'react';
import {ArrowLeft, Cookie} from 'lucide-react';
import {Bloem} from './bloem';
import {ga} from './specialisaties';
import {HOOFDSTUKKEN, PARTIJEN, VERKLARING_BIJGEWERKT} from './privacytekst';
import {useKop} from './kop';
import {HAAR_NAAM, PRAKTIJK} from '../site.config.mjs';
import {
  bewaarKeuze,
  keuze as gekozen,
  OPEN_EVENT,
  opnieuwKiezen,
  pasToe,
  wisTrackers,
  type Keuze,
} from './cookies';

export const PRIVACY_PAD = '/privacy';
/* Het oude adres van de patientenverklaring. Dat document bestaat niet meer
   (geen behandelpraktijk meer, alleen online coaching), maar het adres staat
   bij Google en is gedeeld, dus het blijft werken en laat deze pagina zien. */
export const VERKLARING_PAD = '/privacyverklaring';

/* ---------- de cookiemelding ----------

   Twee knoppen, gelijk van formaat en gewicht, want een weigering mag niet
   moeilijker zijn dan een toestemming. Er is geen kruisje: wegklikken zonder
   te kiezen bestaat niet, want dan weet niemand waar hij aan toe is. Wel is de
   stand zonder keuze de veilige: er wordt niets geladen.

   Het blokkeren zelf zit in cookies.ts. Deze kaart is alleen de vraag. */

export function CookieMelding() {
  const [toon, setToon] = useState(false);

  useEffect(() => {
    /* eerst toepassen wat er al gekozen was. Staat er niets, dan laadt dit
       niets en zet het Google Analytics alvast uit. */
    pasToe();
    const k = gekozen();

    const open = () => setToon(true);
    window.addEventListener(OPEN_EVENT, open);

    let t: number | undefined;
    if (!k) {
      // even wachten: eerst de pagina laten staan, dan pas de vraag
      t = window.setTimeout(() => setToon(true), 400);
    }
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      if (t) clearTimeout(t);
    };
  }, []);

  function kies(k: Keuze) {
    bewaarKeuze(k);
    setToon(false);
    if (k === 'alles') {
      pasToe();
      return;
    }
    /* Nee gekozen. De cookies die er al stonden gaan weg. Een script dat al in
       de pagina hangt kun je niet terugduwen, dus als er iets geladen was
       halen we de pagina een keer opnieuw op. Daarna is het schoon. */
    const gewist = wisTrackers();
    const liepAl = Boolean((window as any).fbq) || Boolean(document.getElementById('mo-ga'));
    if (gewist > 0 || liepAl) window.location.reload();
  }

  if (!toon) return null;

  return (
    <aside
      role="dialog"
      aria-label="Cookies op deze website"
      /* Op een telefoon boven de vaste balk met 'Neem contact op', op een
         laptop rechtsonder: links staan de twee knoppen van de hero. */
      className="melding-komt fixed inset-x-3 bottom-24 z-50 mx-auto max-w-md rounded-2xl bg-white p-4 shadow-xl ring-1 ring-zand-diep md:inset-x-auto md:right-5 md:bottom-5 md:max-w-sm"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-olijf/15 text-olijf-diep">
          <Cookie className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="titel text-lg leading-tight text-inkt">Cookies</p>
          <p className="mt-1 text-sm leading-relaxed text-inkt/75">
            Deze website gebruikt cookies voor statistieken en advertenties.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => kies('noodzakelijk')}
              className="rounded-full bg-zand px-4 py-2 text-sm font-semibold text-inkt ring-1 ring-zand-diep transition hover:bg-zand-diep/40"
            >
              Alleen noodzakelijk
            </button>
            <button
              type="button"
              onClick={() => kies('alles')}
              className="rounded-full bg-petrol px-4 py-2 text-sm font-semibold text-white transition hover:bg-petrol-diep"
            >
              Alles toestaan
            </button>
          </div>
          <a
            href={PRIVACY_PAD}
            onClick={(e) => {
              setToon(false);
              ga(e, PRIVACY_PAD);
            }}
            className="mt-3 inline-block text-sm font-semibold text-petrol underline underline-offset-4 transition hover:text-petrol-diep"
          >
            Lees de privacyverklaring
          </a>
        </div>
      </div>
    </aside>
  );
}

/* ---------- de link om je keuze te wijzigen ----------

   Staat in de footer. Een toestemming die je niet even makkelijk kunt
   intrekken als geven, is geen toestemming. Stond ook midden in het
   cookiehoofdstuk van de verklaring; daar is hij weg omdat die pagina haar
   pdf is en niets anders (Armando, 10-10-2026). */

export function CookieKeuzeKnop() {
  return (
    <button
      type="button"
      onClick={opnieuwKiezen}
      className="underline underline-offset-4 transition hover:text-room"
    >
      Cookievoorkeuren
    </button>
  );
}

/* ---------- de pagina ---------- */

function Lijst({items}: {items: string[]}) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((r) => (
        <li key={r} className="flex gap-3 leading-relaxed text-inkt/75">
          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-olijf" />
          <span>{r}</span>
        </li>
      ))}
    </ul>
  );
}

/* Het rijtje cookies van derden onderaan het cookiehoofdstuk. Staat zo in haar
   pdf: per cookie de naam en de bewaartermijn, verder niets. */
type Cookieregel = {naam: string; termijn: string};

function Cookielijst({items}: {items: Cookieregel[]}) {
  return (
    <dl className="mt-4 space-y-3">
      {items.map((c) => (
        <div key={c.naam}>
          <dt className="font-semibold text-inkt">Cookie: {c.naam}</dt>
          <dd className="leading-relaxed text-inkt/75">Bewaartermijn: {c.termijn}</dd>
        </div>
      ))}
    </dl>
  );
}

function Partijen() {
  return (
    <div className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-zand-diep sm:grid-cols-2">
      {PARTIJEN.map((p, i) => (
        <div
          key={p.naam}
          /* een oneven aantal partijen laat anders een lege grijze cel over:
             de laatste pakt dan de volle breedte */
          className={`bg-white p-5 ${
            i === PARTIJEN.length - 1 && PARTIJEN.length % 2 ? 'sm:col-span-2' : ''
          }`}
        >
          <p className="titel text-xl leading-tight text-inkt">{p.naam}</p>
          <p className="mt-0.5 text-sm text-inkt/55">{p.land}</p>
          <dl className="mt-3 space-y-1.5 text-sm leading-relaxed text-inkt/75">
            <div>
              <dt className="inline font-semibold text-inkt/60">Categorie: </dt>
              <dd className="inline">{p.categorie}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-inkt/60">Doel: </dt>
              <dd className="inline">{p.doel}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-inkt/60">Gegevens: </dt>
              <dd className="inline">{p.gegevens}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}

export function PrivacyPagina({tel, telTonen, mail}: {tel: string; telTonen: string; mail: string}) {
  /* Twee adressen wijzen naar deze ene pagina. De canonieke is /privacy, ook
     als je via /privacyverklaring binnenkomt, zodat Google er een van maakt. */
  useKop({
    titel: `Privacyverklaring | ${HAAR_NAAM}`,
    kort:
      'Welke persoonsgegevens Bewust Gezond in je Mond verwerkt, met welk doel, hoe lang ze ' +
      'bewaard worden, met wie ze gedeeld worden en welke rechten je hebt.',
    canoniek: PRIVACY_PAD,
  });

  return (
    <main>
      <section className="relative overflow-hidden bg-zand pt-28 pb-14 sm:pt-32">
        <Bloem className="bloem-draait pointer-events-none absolute -right-24 top-8 h-[22rem] w-[22rem] text-olijf opacity-[0.13]" />
        <div className="relative mx-auto max-w-3xl px-5">
          <a
            href="/"
            onClick={(e) => ga(e, '/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-inkt/70 transition hover:text-petrol"
          >
            <ArrowLeft className="h-4 w-4" /> Terug naar de voorpagina
          </a>
          <p className="kicker mt-6 text-olijf">Privacy en cookies</p>
          <h1 className="titel mt-2 text-4xl leading-tight text-inkt sm:text-5xl">Privacyverklaring</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-inkt/80">
            Laatst bijgewerkt: {VERKLARING_BIJGEWERKT}. Bewust Gezond in je Mond is verantwoordelijk voor de verwerking
            van persoonsgegevens zoals weergegeven in deze privacyverklaring.
          </p>
        </div>
      </section>

      <article id="inhoud" tabIndex={-1} className="mx-auto max-w-3xl px-5 py-16 outline-none">
        <div>
          <h2 className="titel text-2xl text-inkt sm:text-3xl">Contactgegevens</h2>
          <p className="mt-3 leading-relaxed text-inkt/75">
            Bewust Gezond in je Mond, Marjon Ooteman. Zij is de contactpersoon voor privacyvragen.
          </p>
          <p className="mt-2 leading-relaxed text-inkt/75">
            <a
              href="https://bewustgezondinjemond.nl"
              className="font-semibold text-petrol underline underline-offset-4"
            >
              bewustgezondinjemond.nl
            </a>
            <span className="px-2 text-inkt/40">|</span>
            <a href={`tel:${tel}`} className="font-semibold text-petrol underline underline-offset-4">
              {telTonen}
            </a>
            <span className="px-2 text-inkt/40">|</span>
            <a href={`mailto:${mail}`} className="font-semibold text-petrol underline underline-offset-4">
              {mail}
            </a>
          </p>
          {/* Haar eigen pdf noemt het KvK-nummer niet. Dit is geen tekst van
              onszelf maar een registergegeven: wie wil weten wie er achter
              "Bewust Gezond in je Mond" zit, kan het hiermee natrekken. */}
          <p className="mt-2 leading-relaxed text-inkt/75">KvK-nummer: {PRAKTIJK.kvk}</p>
        </div>

        {HOOFDSTUKKEN.map((h) => (
          <section key={h.kop} className="mt-10">
            <h2 className="titel text-2xl text-inkt sm:text-3xl">{h.kop}</h2>
            {h.blokken.map((b, i) => {
              if (b.t === 'partijen') return <Partijen key={i} />;
              if (b.t === 'cookies') return <Cookielijst key={i} items={b.v as Cookieregel[]} />;
              if (b.t === 'lijst') return <Lijst key={i} items={b.v as string[]} />;
              return (
                <p key={i} className="mt-3 leading-relaxed text-inkt/75">
                  {b.v as string}
                </p>
              );
            })}
          </section>
        ))}
      </article>
    </main>
  );
}
