/**
 * Zet de foto's en het logo van toonoverleven.nl om naar wat de site nodig heeft.
 *
 * Alles wat hier binnenkomt is van de stichting zelf: foto's van de wandelingen,
 * van het huis aan het Mazerhard, van Swim to Fight Cancer en van het werk dat
 * in de workshops gemaakt is. Ze komen als losse WordPress-uploads binnen, in
 * wisselende formaten en zonder compressie, dus ze worden hier op maat gebracht
 * en teruggebracht in bestandsgrootte.
 *
 * Draaien met: node scripts/images.mjs
 */
import sharp from 'sharp';
import {mkdirSync} from 'node:fs';

const UIT = 'public/img';
mkdirSync(UIT, {recursive: true});

/* ------------------------------------------------------------------ */
/*  Logo                                                               */
/* ------------------------------------------------------------------ */

/**
 * Het logo is door de dochter van een van de betrokkenen gemaakt en ze zijn er
 * terecht trots op, dus het gaat er ongewijzigd op. Alleen de opbouw verschilt
 * per plek:
 *
 * - In de balk bovenaan staat het logo op ongeveer 48 pixels hoog. De regel
 *   "IPSO - centrum voor leven met en na kanker" wordt dan minder dan twee
 *   pixels hoog en verandert in een veeg. Daar dus alleen het boompje met
 *   TOON OVER LEVEN.
 * - In de voettekst staat het groot, inclusief de ondertitel en de regel
 *   "Voorheen: Toon Hermans Huis Zeewolde". Die regel is juist nuttig zolang
 *   de naamswijziging nog vers is.
 *
 * De banden zijn opgemeten in het bestand zelf (alfakanaal per rij geteld),
 * niet geschat: merk y 10-614, TOON 46-262, OVER LEVEN 323-423,
 * ondertitel 479-506, "Voorheen" 600-617.
 */
async function logo() {
  const bron = 'raw/logo.png';
  const {width: W, height: H} = await sharp(bron).metadata();
  const SPLIT = 620; // grens tussen het boompje en de letters

  // Voettekst: hele logo, alleen bijgesneden tot waar echt inkt staat.
  await sharp(bron).trim({threshold: 1}).png().toFile(`${UIT}/logo-vol.png`);

  // Balk bovenaan: boompje volledig, letters tot en met OVER LEVEN.
  const merk = await sharp(bron).extract({left: 0, top: 0, width: SPLIT, height: H}).png().toBuffer();
  const letters = await sharp(bron).extract({left: SPLIT, top: 0, width: W - SPLIT, height: 450}).png().toBuffer();
  await sharp({create: {width: W, height: H, channels: 4, background: {r: 0, g: 0, b: 0, alpha: 0}}})
    .composite([{input: merk, left: 0, top: 0}, {input: letters, left: SPLIT, top: 0}])
    .png()
    .toBuffer()
    .then((b) => sharp(b).trim({threshold: 1}).png().toFile(`${UIT}/logo.png`));

  // Alleen het boompje: tabbladicoon en los beeldmerk. In twee stappen, want
  // sharp voert trim en extract in een vaste volgorde uit en dan lopen de
  // coordinaten door elkaar.
  await sharp(merk)
    .trim({threshold: 1})
    .toBuffer()
    .then((b) =>
      sharp(b)
        .resize(512, 512, {fit: 'contain', background: {r: 0, g: 0, b: 0, alpha: 0}})
        .png()
        .toFile(`${UIT}/merk.png`),
    );
}

/* ------------------------------------------------------------------ */
/*  Foto's                                                             */
/* ------------------------------------------------------------------ */

/** breedte, hoogte: 0 laat sharp de verhouding zelf bepalen. */
const FOTOS = [
  // Het huis en de mensen
  ['wandelen2.jpg', 'huis-buiten.jpg', 1400],
  ['huis1.jpg', 'huis-binnen.jpg', 1400],
  ['wandelen1.jpg', 'wandelen.jpg', 1400],

  // Swim to Fight Cancer, juli 2026
  ['swim1.jpg', 'swim-start.jpg', 1400],
  ['swim4.jpg', 'swim-cheque.jpg', 1600],
  ['swim3.jpg', 'swim-cheque-close.jpg', 1200],
  ['swim2.jpg', 'swim-kraam.jpg', 1400],

  // Werk uit de creatieve workshops
  ['encaustic.jpg', 'encaustic.jpg', 1000],
  ['encaustic2.png', 'encaustic-2.jpg', 1000],
  ['mixedmedia.png', 'mixed-media.jpg', 1000],
  ['mandala.jpg', 'mandala.jpg', 1000],
  ['alcoholinkt.jpg', 'alcohol-inkt.jpg', 1000],
  ['pastel.jpg', 'pastel.jpg', 1000],
  ['toefjes.jpg', 'toefjes.jpg', 1000],
  ['mediteren.jpg', 'mediteren.jpg', 1000],

  /* Foto's die de stichting zelf heeft aangeleverd. Deze vervangen de
     getekende figuurtjes die er eerst stonden: het is dezelfde plek en het
     zijn dezelfde mensen, maar dan echt. */
  ['nieuw/atelier-tafel.jpg', 'atelier.jpg', 1200],
  ['nieuw/buitenfeest.jpg', 'samen-buiten.jpg', 1600],
  ['nieuw/team-bambaru.jpg', 'team-groen.jpg', 1600],
  ['nieuw/rabo-cheque.jpg', 'cheque-rabo.jpg', 1400],

  /* Uit hun eigen tijdlijn, omdat er van de gewone momenten nauwelijks foto's
     bestaan en juist die laten zien hoe het er aan toegaat. */
  ['fb/27_1.jpg', 'wandelpauze.jpg', 1100],
  ['fb/07_2.jpg', 'kraam-gesprek.jpg', 1100],

  /* Sfeerbeeld. Van het gewone werk (een gesprek op de bank, een kop koffie,
     een wandeling) bestaan geen foto's, en dat is precies wat iemand wil zien
     voordat hij aanbelt: hoe het eraan toegaat, niet een cheque of een kraam.
     Deze zijn daarom gemaakt in plaats van gefotografeerd, in de stijl van het
     ontwerp. Zodra de stichting eigen foto's van deze momenten heeft, gaan die
     eroverheen: zelfde namen, zelfde verhoudingen. */
  ['sfeer/sfeer-huiskamer.jpg', 'sfeer-huiskamer.jpg', 1600],
  ['sfeer/sfeer-gesprek.jpg', 'sfeer-gesprek.jpg', 1400],
  ['sfeer/sfeer-wandeling.jpg', 'sfeer-wandeling.jpg', 1400],
  ['sfeer/sfeer-creatief.jpg', 'sfeer-creatief.jpg', 1400],
  ['sfeer/sfeer-koffie.jpg', 'sfeer-koffie.jpg', 1200],
  ['sfeer/sfeer-naasten.jpg', 'sfeer-naasten.jpg', 1400],
  ['sfeer/sfeer-jongeren.jpg', 'sfeer-jongeren.jpg', 1400],
  ['sfeer/sfeer-meditatie.jpg', 'sfeer-meditatie.jpg', 1400],
];

async function fotos() {
  for (const [bron, doel, breedte] of FOTOS) {
    await sharp(`raw/${bron}`)
      .flatten({background: '#ffffff'})
      .resize({width: breedte, withoutEnlargement: true})
      .jpeg({quality: 78, mozjpeg: true})
      .toFile(`${UIT}/${doel}`);
  }
}

/* ------------------------------------------------------------------ */
/*  Bijgesneden varianten                                              */
/* ------------------------------------------------------------------ */

/**
 * Het deelplaatje: precies 1200 bij 630, want dat is wat WhatsApp, Facebook en
 * LinkedIn tonen als iemand de site doorstuurt. Het is hetzelfde beeld als
 * bovenaan de voorpagina, zodat een gedeelde link eruitziet als de pagina waar
 * hij op uitkomt.
 */
async function snedes() {
  await sharp('raw/sfeer/sfeer-huiskamer.jpg')
    .resize(1200, 630, {fit: 'cover', position: sharp.strategy.attention})
    .jpeg({quality: 78, mozjpeg: true})
    .toFile(`${UIT}/deel.jpg`);
}

await logo();
await fotos();
await snedes();
console.log('klaar');
