/* ---------- toestemming voor cookies ----------

   Deze site laadt Google Analytics en de Meta Pixel pas nadat een bezoeker
   daar ja tegen heeft gezegd. Niks ingevuld of nee ingevuld betekent: er wordt
   geen enkel script van een derde geladen en er staat niets op het apparaat
   behalve de regel waarin de keuze zelf staat.

   Dat is de kern: de blokkade zit hier, in het wel of niet aanroepen van
   laadGa() en laadPixel(). Er staat nergens anders in de site een <script> van
   Google of Meta, dus er is geen weg waarlangs ze alsnog binnenkomen.

   Beide nummers staan erin sinds 12-10-2026, dus na 'alles toestaan' laden ze
   ook echt. Haal je er een weg, dan wordt dat script niet geladen en blijft de
   rest werken. */

export const NUMMERS = {
  /* GA4-meet-ID, van de vorm G-XXXXXXXXXX (Google Analytics > Beheer >
     Gegevensstromen > Webstream). Aangeleverd 12-10-2026. */
  ga4: 'G-6X34NK42Z3',
  /* Meta Pixel-ID, een getal van 15 of 16 cijfers (Meta Events Manager).
     Gegevensset 'bewust gezond in je mond', aangeleverd 12-10-2026. */
  pixel: '1618348649871675',
};

export type Keuze = 'alles' | 'noodzakelijk';

/* De enige regel die deze site zonder toestemming in de browser achterlaat:
   de keuze zelf. Geen nummer waaraan iemand te herkennen is, staat alleen op
   het apparaat en wordt nooit verstuurd. De versie staat erbij zodat we
   opnieuw kunnen vragen als er een partij bij komt. */
const SLEUTEL = 'mo-cookiekeuze';
export const VERSIE = 1;

type Opslag = {keuze: Keuze; versie: number; datum: string};

/* localStorage kan geweigerd worden (prive-venster, strenge instelling, quota
   vol). Dan mag de site niet omvallen: geen keuze betekent geen trackers en de
   vraag komt gewoon opnieuw. */
export function keuze(): Keuze | null {
  try {
    const rauw = localStorage.getItem(SLEUTEL);
    if (!rauw) return null;
    const o = JSON.parse(rauw) as Opslag;
    if (o.versie !== VERSIE) return null;
    return o.keuze === 'alles' || o.keuze === 'noodzakelijk' ? o.keuze : null;
  } catch {
    return null;
  }
}

export function bewaarKeuze(k: Keuze) {
  try {
    const o: Opslag = {keuze: k, versie: VERSIE, datum: new Date().toISOString()};
    localStorage.setItem(SLEUTEL, JSON.stringify(o));
  } catch {
    /* niets te onthouden, ook goed: dan komt de vraag opnieuw en blijft de
       stand voorzichtig, namelijk niets laden */
  }
}

/* ---------- de scripts zelf ---------- */

function laadGa() {
  if (!NUMMERS.ga4) return;
  if (document.getElementById('mo-ga')) return;
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  const s = document.createElement('script');
  s.id = 'mo-ga';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${NUMMERS.ga4}`;
  document.head.appendChild(s);
  w.gtag('js', new Date());
  w.gtag('config', NUMMERS.ga4);
}

function laadPixel() {
  if (!NUMMERS.pixel) return;
  const w = window as any;
  if (w.fbq) return;
  const f: any = function () {
    // eslint-disable-next-line prefer-rest-params
    f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments);
  };
  f.push = f;
  f.loaded = true;
  f.version = '2.0';
  f.queue = [];
  w.fbq = f;
  w._fbq = w._fbq || f;
  const s = document.createElement('script');
  s.id = 'mo-pixel';
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  w.fbq('init', NUMMERS.pixel);
  w.fbq('track', 'PageView');
}

/* ---------- opruimen ----------

   Trekt iemand zijn toestemming in, dan is het niet genoeg om te stoppen met
   laden: de cookies die er al staan moeten weg. Een cookie kan op meerdere
   domeinvarianten staan (met en zonder punt ervoor, en op elk bovenliggend
   domein), dus we proberen ze alle af. */

const TRACKER_COOKIES = /^(_ga($|_)|_gid$|_gat($|_)|_fbp$|_fbc$)/;

function domeinen() {
  const delen = window.location.hostname.split('.');
  const uit: (string | null)[] = [null];
  for (let i = 0; i < delen.length - 1; i++) {
    const d = delen.slice(i).join('.');
    uit.push(d, `.${d}`);
  }
  return uit;
}

export function wisTrackers() {
  if (NUMMERS.ga4) (window as any)[`ga-disable-${NUMMERS.ga4}`] = true;
  const namen = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => TRACKER_COOKIES.test(n));
  for (const naam of namen) {
    for (const d of domeinen()) {
      const domein = d ? `; domain=${d}` : '';
      document.cookie = `${naam}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domein}`;
    }
  }
  return namen.length;
}

/* Wordt bij elke paginaopening aangeroepen. Alleen bij een opgeslagen 'alles'
   gaat er iets laden; in elk ander geval (nog niets gekozen, of nee gekozen)
   gebeurt er niets. */
export function pasToe() {
  if (keuze() === 'alles') {
    laadGa();
    laadPixel();
  } else {
    if (NUMMERS.ga4) (window as any)[`ga-disable-${NUMMERS.ga4}`] = true;
  }
}

/* Het openen van het keuzevenster vanaf een andere plek op de site (de link in
   de footer en op de privacyverklaring). */
export const OPEN_EVENT = 'mo-cookies-open';

export function opnieuwKiezen() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}
