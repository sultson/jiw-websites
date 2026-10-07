/* Schrijft dist/timmerman-<plaats>/index.html voor elke plaats uit het
   werkgebied op zijn Werkspot-profiel.
   Draaien:  node maak-plaatspaginas.mjs
   Niet met de hand bewerken, de volgende ronde overschrijft het.

   Wat per plaats echt verschilt, verschilt ook in de tekst: de afstand tot
   Valkenswaard en de beoordelingen uit die hoek. Waar hij nog niets heeft
   gedaan staat dat er ook zo, en niet "al jaren actief in Amsterdam". */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tegel } from './iconen.mjs';
import { TEL, TEL_TOON, WA, MAIL, WERKSPOT, SITE, PLAATSEN, BEDRIJF, ogTags, vlucht, maandJaar, BALK, VOET, ZWEEF, FORMULIER } from './onderdelen.mjs';

const hier = dirname(fileURLToPath(import.meta.url));
const beoordelingen = JSON.parse(readFileSync(join(hier, 'werkspot-reviews.json'), 'utf8'));

/* zes van de negen diensten, zodat de plaatspagina korter is dan de homepagina */
const DIENSTEN = [
  { foto: 'zolder-vide', alt: 'Vide met nieuwe trapopening en balustrade na een verbouwing',
    kop: 'Verbouwing en renovatie',
    tekst: 'Een kamer, een verdieping of het hele pand. Slopen, opbouwen en afwerken in één hand.' },
  { foto: 'overkapping-tuin', alt: 'Houten overkapping met berging in de tuin',
    kop: 'Aanbouw en buitenwerk',
    tekst: 'Uitbouwen, overkappingen, tuinhuizen en sauna’s, van fundering tot afwerking.' },
  { foto: 'dakraam-dubbel', alt: 'Dubbel dakraam met afgewerkte dagkanten', pos: 'center 22%',
    kop: 'Dakramen en dakkapellen',
    tekst: 'Plaatsen, vervangen en repareren, inclusief het afwerken van de dagkanten.' },
  { foto: 'keuken-hout', alt: 'Geplaatste keuken met houten werkblad',
    kop: 'Keukens',
    tekst: 'Plaatsen, ombouwen en repareren, inclusief het aanpassen van de ruimte eromheen.' },
  { foto: 'zolder-balken', alt: 'Afgewerkte zolderkamer met zichtbare balken en nieuwe vloer',
    kop: 'Timmerwerk en afwerking',
    tekst: 'Binnenwanden, plafonds verlagen, boeidelen, windveren en rabatdelen.' },
  { foto: 'binnendeur-glas-groen', alt: 'Afgehangen binnendeur met glas in een afgewerkte hal', pos: 'center 45%',
    kop: 'Binnen- en buitendeuren',
    tekst: 'Afhangen, inkorten, vervangen en repareren. Ook voordeuren, schuifpuien en kozijnen.' }
];

/* de drie nieuwste beoordelingen met tekst uit die hoek van het land */
function uitDeBuurt(nabij){
  if (!nabij.length) return [];
  // zonder naam of zonder tekst heeft een kaart niets te laten zien
  return beoordelingen
    .filter((b) => b.tekst && b.tekst.trim() && b.naam && b.naam.trim() && nabij.includes(b.plaats))
    .sort((a, b) => new Date(b.datum) - new Date(a.datum))
    .slice(0, 3);
}

function formulier(plaats){
  return FORMULIER({
    herkomst: `Pagina ${plaats.naam}`,
    kop: `Offerte aanvragen in ${plaats.naam}`,
    // Dit is de eerste kop na de h1 in de hero, dus een h2 en geen h3.
    niveau: 'h2',
    klasse: 'form--kaart',
    plaats: plaats.naam,
  });
}

function reviewblok(plaats){
  const lijst = uitDeBuurt(plaats.nabij);
  if (!lijst.length) return '';
  return `
<section class="vak vak--grijs">
  <div class="binnen">
    <div class="ws__kop">
      <div class="ws__titel">
        <h2>Beoordelingen uit de buurt van ${plaats.naam}</h2>
        <a class="ws__merk" href="${WERKSPOT}" rel="noopener">
          <img src="/logo/werkspot.png" alt="Werkspot" width="359" height="64" loading="lazy">
        </a>
      </div>
      <p class="ws__intro">5,0 gemiddeld uit 49 beoordelingen. Deze staan openbaar op ons Werkspot-profiel.
        <a href="${WERKSPOT}" rel="noopener">Alle beoordelingen bekijken</a></p>
    </div>
  </div>
  <div class="ws__rand">
    <div class="ws__lijst" tabindex="0" role="group" aria-label="Beoordelingen op Werkspot">
${lijst.map((b) => `      <article class="review">
        <div class="review__top">
          <span class="sterren" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span class="review__datum">${maandJaar(b.datum)}</span>
        </div>
        <p>&ldquo;${vlucht(b.tekst.trim()).replace(/\n+/g, '<br>')}&rdquo;</p>
        <footer>
          <span class="review__cirkel" aria-hidden="true">${vlucht(b.naam.trim()[0])}</span>
          <span class="review__wie"><b>${vlucht(b.naam.trim())}, ${vlucht(b.plaats)}</b><small><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.2 11.6 2.9 8.3 4 7.2l2.2 2.2 5.8-5.8 1.1 1.1z"/></svg> Geverifieerde klus via Werkspot</small></span>
        </footer>
      </article>`).join('\n')}
    </div>
  </div>
</section>`;
}

function pagina(plaats){
  const titel = `Timmerman en klusjesman in ${plaats.naam} | RH Klusservice`;
  const omschrijving = `Timmerman en klusjesman in ${plaats.naam}: dakramen, binnendeuren, timmerwerk, aanbouw en complete verbouwingen. RH Klusservice uit Valkenswaard, 5,0 uit 5 op Werkspot.`;

  return `<!doctype html>
<html lang="nl" data-thema="midnight-clean">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${vlucht(titel)}</title>
<meta name="description" content="${vlucht(omschrijving)}">
<link rel="canonical" href="${SITE}/${plaats.slug}/">
${ogTags({ titel, omschrijving, pad: `/${plaats.slug}/` })}
<link rel="icon" href="/logo/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/stijl.css">
</head>
<body>

${BALK(titel)}

<main>

<section class="lok">
  <div class="binnen">
    <div class="lok__grid">
      <div>
        <h1>Timmerman en klusjesman in ${plaats.naam}</h1>
        <p class="lok__lood">${plaats.intro}</p>
        <div class="knoppen">
          <a class="knop knop--wit" href="tel:${TEL}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z"/></svg>
            ${TEL_TOON}
          </a>
          <a class="knop knop--wa" href="${WA}" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.2 1.3-2 1.4-.5.1-1.2.2-3.5-.8-2.9-1.2-4.8-4.2-5-4.4-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.2-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.3-.1.6.1.3.6 1.2 1.4 1.9 1 .9 1.8 1.1 2.1 1.3.2.1.4 0 .6-.1l.8-1c.2-.2.4-.2.6-.1l2.1 1c.3.1.5.2.5.4.1.2.1.9-.1 1.6Z"/></svg>
            WhatsApp
          </a>
        </div>
        <a class="hero__cijfer" href="${WERKSPOT}" rel="noopener">
          <span class="sterren" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <b>5,0</b>
          <span class="tel">&middot; 49 beoordelingen<span class="tel__op"> op</span></span>
          <img class="ws__mark" src="/logo/werkspot.png" alt="Werkspot" width="359" height="64">
        </a>
        <div class="bewijs">
          <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.3-4-4 1.5-1.4 2.5 2.5 5.4-5.4 1.5 1.4-6.9 6.9Z"/></svg>Woning, bedrijfspand of opslagruimte</span>
          <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.3-4-4 1.5-1.4 2.5 2.5 5.4-5.4 1.5 1.4-6.9 6.9Z"/></svg>E&eacute;n aanspreekpunt voor het hele project</span>
        </div>
      </div>
      <div>
${formulier(plaats)}
      </div>
    </div>
  </div>
</section>

<section class="vak vak--grijs">
  <div class="binnen">
    <div class="kopgroep">
      <h2>Wat we doen in ${plaats.naam}</h2>
      <div class="streep"></div>
      <p class="lood">${plaats.bewijs}</p>
    </div>
    <div class="diensten">
${DIENSTEN.map((d) => `      <div class="dienst">
        ${tegel(d.kop)}
        <div class="dienst__tekst">
          <h3>${d.kop}</h3>
          <p>${d.tekst}</p>
        </div>
      </div>`).join('\n')}
    </div>
  </div>
</section>
${reviewblok(plaats)}
<section class="vak vak--zwart">
  <div class="binnen">
    <div class="kopgroep">
      <h2>Een klus of verbouwing in ${plaats.naam}?</h2>
      <div class="streep"></div>
      <p class="lood"><strong>Vrijwel alles is bespreekbaar.</strong> Staat uw klus hierboven niet tussen? Neem dan contact op, dan laten we snel weten of we het kunnen uitvoeren.</p>
    </div>
    <div class="contact__blok">
      <a href="tel:${TEL}">
        <span class="tegel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z"/></svg></span>
        <span><small>Bellen</small><strong>${TEL_TOON}</strong></span>
      </a>
      <a class="rij--wa" href="${WA}" rel="noopener">
        <span class="tegel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.2 1.3-2 1.4-.5.1-1.2.2-3.5-.8-2.9-1.2-4.8-4.2-5-4.4-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.2-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.3-.1.6.1.3.6 1.2 1.4 1.9 1 .9 1.8 1.1 2.1 1.3.2.1.4 0 .6-.1l.8-1c.2-.2.4-.2.6-.1l2.1 1c.3.1.5.2.5.4.1.2.1.9-.1 1.6Z"/></svg></span>
        <span><small>WhatsApp</small><strong>Stuur een bericht</strong></span>
      </a>
      <a href="mailto:${MAIL}">
        <span class="tegel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1Zm9 8L4.3 7H19.7L12 13Zm0 2.3L4 9.1V17h16V9.1l-8 6.2Z"/></svg></span>
        <span><small>E-mail</small><strong>${MAIL}</strong></span>
      </a>
    </div>
    <p class="gebied"><b>Ook in de buurt:</b> ${PLAATSEN.filter((p) => p.slug !== plaats.slug).map((p) => `<a href="/${p.slug}/">${p.naam}</a>`).join(', ')}. Twijfelt u of uw adres erbij hoort? Bel gerust.</p>
  </div>
</section>

</main>

${VOET}

<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  ...BEDRIJF,
  url: `${SITE}/${plaats.slug}/`,
  areaServed: { '@type': 'City', name: plaats.naam, containedInPlace: { '@type': 'AdministrativeArea', name: plaats.provincie } }
})}
</script>

${ZWEEF}

<script src="/site.js" defer></script>

</body>
</html>
`;
}

let n = 0;
for (const plaats of PLAATSEN) {
  const map = join(hier, 'dist', plaats.slug);
  mkdirSync(map, { recursive: true });
  writeFileSync(join(map, 'index.html'), pagina(plaats), 'utf8');
  const lokaal = uitDeBuurt(plaats.nabij).length;
  console.log(`${plaats.slug.padEnd(24)} ${lokaal} beoordeling(en) uit de buurt`);
  n++;
}
console.log(`\n${n} plaatspagina's geschreven.`);
