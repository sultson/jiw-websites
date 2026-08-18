/**
 * Het aftellen naar de lancering.
 *
 * Tot het moment in site.config.mjs ligt er een dicht vlak over de site met
 * niets erop dan het zegel en de klok. Bewust niets erbij: geen "binnenkort
 * online", geen aanmeldveld, geen uitleg. Wie hier staat weet waarom hij staat
 * te wachten, en alles wat je daaromheen zet leest als opvulling.
 *
 * Op nul valt het vlak weg en gaat de confetti af. Wie er op dat moment naar
 * kijkt ziet het gebeuren; wie binnen vijf minuten daarna binnenkomt krijgt hem
 * alsnog, want die is er duidelijk voor gekomen. Daarna is het een gewone site
 * en zit hier niets meer in de weg.
 *
 * De klok van het apparaat wordt niet geloofd. Een telefoon die tien minuten
 * voorloopt zou de site te vroeg openen en de confetti in een lege kamer
 * afsteken. Cloudflare stuurt zijn eigen tijd mee op /cdn-cgi/trace, en het
 * verschil daartussen wordt hier verrekend. Komt dat antwoord niet, dan telt de
 * eigen klok; dan is het hooguit een halve minuut scheef.
 */

import {useEffect, useRef, useState} from 'react';
import {CONFETTI_VENSTER_MS, LANCERING} from '../site.config.mjs';
import {Doek, Kente} from './ui';
import {useT} from './taal';
import T from './tekst';
import {trace} from './trace';

const MOMENT = Date.parse(LANCERING);

/* Vier keer per seconde. Genoeg om de seconden gelijk te laten lopen met een
   horloge, en om het vlak binnen een kwart seconde na nul te laten vallen. */
const TIK_MS = 250;

export default function Aftellen() {
  const [afwijking, setAfwijking] = useState(0);
  const [nu, setNu] = useState(() => Date.now());
  const gevierd = useRef(false);

  /* De klok van Cloudflare, één keer opgehaald en gedeeld met de taalkeuze. */
  useEffect(() => {
    let levend = true;
    trace().then((t) => {
      const ts = Number(t.ts);
      if (levend && Number.isFinite(ts) && ts > 0) setAfwijking(ts * 1000 - Date.now());
    });
    return () => {
      levend = false;
    };
  }, []);

  /* De tik stopt zodra er niets meer kan gebeuren: het vlak is weg en de
     confetti is geweest. Anders loopt er op elke pagina voor altijd een timer
     die vier keer per seconde afgaat om niets te doen. */
  useEffect(() => {
    const id = setInterval(() => {
      setNu(Date.now());
      if (MOMENT - (Date.now() + afwijking) <= -CONFETTI_VENSTER_MS) clearInterval(id);
    }, TIK_MS);
    return () => clearInterval(id);
  }, [afwijking]);

  const rest = MOMENT - (nu + afwijking);
  const wachten = rest > 0;
  const netgeopend = !wachten && rest > -CONFETTI_VENSTER_MS;

  /* Zolang het vlak ligt mag de pagina eronder niet meeschuiven. */
  useEffect(() => {
    if (!wachten) return;
    const oud = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = oud;
    };
  }, [wachten]);

  /* Eén keer per bezoek: wie het op nul ziet gebeuren, en wie binnen het
     venster daarna binnenkomt. */
  useEffect(() => {
    if (!netgeopend || gevierd.current) return;
    gevierd.current = true;
    vier();
  }, [netgeopend]);

  return wachten ? <Vlak rest={rest} /> : null;
}

/* ------------------------------------------------------------------- vlak */

function twee(n: number) {
  return String(Math.floor(n)).padStart(2, '0');
}

function Vlak({rest}: {rest: number}) {
  const t = useT();
  const s = Math.max(0, rest) / 1000;
  const dagen = Math.floor(s / 86400);
  const uren = Math.floor((s % 86400) / 3600);
  const minuten = Math.floor((s % 3600) / 60);
  const seconden = Math.floor(s % 60);

  const delen = [twee(uren), twee(minuten), twee(seconden)];
  if (dagen > 0) delen.unshift(String(dagen));

  /* Wat een schermlezer hoort. Bewust in woorden en niet in cijfers met een
     dubbele punt: "08:14:57" wordt voorgelezen als drie losse getallen. De
     seconden blijven eruit zolang er nog uren staan, want die zijn voorbij
     voordat de zin uit is. */
  const gesproken = [
    t(T.aftellen.opent),
    dagen > 0 ? `${dagen} ${t(T.aftellen.dag)}` : '',
    uren > 0 ? `${uren} ${t(T.aftellen.uur)}` : '',
    `${minuten} ${t(T.aftellen.minuut)}`,
    dagen === 0 && uren === 0 ? `${seconden} ${t(T.aftellen.seconde)}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      /* aria-live staat uit: dit verandert elke seconde, en een schermlezer die
         dat allemaal voorleest maakt de pagina onbruikbaar. Het label is er
         voor wie er zelf naartoe navigeert. */
      role="status"
      aria-live="off"
      aria-label={gesproken}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-nacht-diep">
      <Doek dekking={0.1} />
      <Kente hoogte={10} klasse="!absolute inset-x-0 top-0" />

      <img
        src="/img/merk.png"
        alt=""
        aria-hidden
        width={180}
        height={176}
        className="relative h-auto w-[76px] sm:w-[96px]"
      />

      {/*
        De maat staat op deze rij en niet op de cijfers eronder. Anders rekent
        em zich uit tegen de letterhoogte van de bladzijde in plaats van tegen
        de cijfers, en dan is de dubbele punt zeven pixels groot tussen cijfers
        van honderdtwintig.

        Elk cijfer staat in een vakje van vaste breedte. Fraunces heeft geen
        cijfers van gelijke breedte, dus zonder die vakjes verspringt de hele
        rij bij elke seconde die van een 1 naar een 8 gaat.
      */}
      <div
        aria-hidden
        className="relative mt-7 flex items-center gap-[0.16em] font-display leading-none text-goud-licht text-[clamp(2.9rem,16vw,7rem)] sm:mt-9">
        {delen.map((deel, i) => (
          <span key={i} className="flex items-center gap-[0.16em]">
            {i > 0 && <span className="pb-[0.12em] text-[0.34em] text-goud/55">:</span>}
            {deel.split('').map((cijfer, j) => (
              <span key={j} className="inline-block w-[0.6em] text-center">
                {cijfer}
              </span>
            ))}
          </span>
        ))}
      </div>

      <Kente hoogte={10} klasse="!absolute inset-x-0 bottom-0" />
    </div>
  );
}

/* --------------------------------------------------------------- confetti */

/* De kleuren van de site, niet de standaard feestkleuren: goud, indigo, klei,
   koper, palm, zee en zand. */
const KLEUREN = ['#b89838', '#e0c069', '#16375a', '#a4482f', '#c2632c', '#2c4c34', '#1b5f70', '#f8f0e0'];

/**
 * Twee kanonnen, linksonder en rechtsonder, allebei schuin naar binnen. Dat
 * leest als vieren; van bovenaf laten vallen leest als sneeuw. Ze blijven
 * anderhalve seconde vuren, zodat het een salvo is en geen enkele plof.
 *
 * canvas-confetti zet zijn eigen canvas neer, ruimt het na afloop weer op en
 * vangt geen klikken, dus je kunt eronder doorlezen terwijl het valt.
 * disableForReducedMotion doet precies wat het zegt: wie in zijn systeem om
 * minder beweging heeft gevraagd, krijgt niets.
 *
 * Het pakket wordt pas opgehaald op het moment dat het afgaat. Dit is een
 * feestje van vijf minuten op een site die daarna jaren blijft staan; het hoort
 * niet in de bundel te zitten die elke bezoeker daarna nog binnenhaalt.
 */
async function vier() {
  const {default: confetti} = await import('canvas-confetti');

  const gedeeld = {
    colors: KLEUREN,
    disableForReducedMotion: true,
    zIndex: 101,
    startVelocity: 55,
    spread: 62,
    particleCount: 7,
  } as const;

  const eind = Date.now() + 1500;
  (function salvo() {
    confetti({...gedeeld, angle: 60, origin: {x: 0, y: 0.9}});
    confetti({...gedeeld, angle: 120, origin: {x: 1, y: 0.9}});
    if (Date.now() < eind) requestAnimationFrame(salvo);
  })();
}
