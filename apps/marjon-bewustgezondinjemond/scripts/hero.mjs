/* De herofoto van Marjon.

   BRON (17-10-2026). raw/fotograaf/, 20 bestanden van 2400x3600 uit de Google
   Drive-map die Armando deelde. Dit zijn de echte bestanden van de fotograaf
   van de fotosessie, en daarmee is de hele opschaalgeschiedenis van deze foto
   voorbij. Wat eraan voorafging, voor wie de commits leest:
     - Armando's schermafdruk van een instagrampost, 730x1182, laplace 27
     - de linkerhelft van een collagetegel bij instagram, 654x1038, laplace 46
     - marjon-hek-fotograaf.jpg, 1067x1600, laplace 289
     - dit, 2400x3600
   Elk van die drie moest door een opschaler om de grootste leveringsmaat te
   halen, en die verzint beeldpunten in plaats van tekening - dat was de
   plastic huid die Marjon zag. Hier is elke leveringsmaat een VERKLEINING van
   de bron. Geen opschaler meer in dit script.

   TWEE FOTO'S, want de hero staat op twee manieren op de pagina.
   - Vanaf lg is de foto de rechterkolom van het raster, 4:5, met de tekst
     ernaast. Daar staat marjon-1: de close-up tegen de beukenstam, zij kijkt
     je recht aan, petrolblouse tegen bruin blad. Dit is het origineel van de
     opname die tot 15-10 de hero was.
   - Onder lg vult de foto de hele sectie en staat de tekst eroverheen (zoals
     smoothbylau, op verzoek van 12-10). Daar staat marjon-12: zij loopt een
     bospad op je af, hele figuur, veel lucht erboven. Dat pad sluit aan op de
     kop die eroverheen staat - Jouw reis naar Bewust Gezond in je Mond.
   Op 15-10 waren dit nog twee uitsnedes van één opname, omdat we er maar één
   hadden. Nu zijn het twee opnames uit dezelfde sessie, allebei in haar
   petrolblouse en hetzelfde bos.

   gebruik: node scripts/hero.mjs   */

import sharp from 'sharp';
import {writeFileSync} from 'node:fs';

const UP = 'public/img';

const BEELD = {
  /* marjon-1.jpg, 2400x3600. Met de hand opgemeten: haar haar begint op y=617,
     haar kin op y=2126. Een 4:5-uitsnede over de volle breedte is 3000 hoog;
     206 van boven laat ruimte boven haar hoofd en houdt haar gezicht op twee
     vijfde van de hoogte. Haar gezicht vult dan de halve uitsnede - dat is de
     close-up waar Armando om vroeg. */
  portret: {
    bron: 'raw/fotograaf/marjon-1.jpg',
    snede: {left: 0, top: 206, width: 2400, height: 3000},
    maten: [560, 840, 1120],
    kwaliteit: 88,
  },
  /* marjon-12.jpg, 2400x3600. 9:16, de verhouding van een telefoonscherm onder
     de menubalk. Niet over de volle hoogte: zij loopt in de onderste helft van
     het beeld en daarboven staat vooral kruinen. Over de volle hoogte wordt zij
     een figuurtje van een vijfde van het kader, met de kop er vlak boven haar
     gezicht langs - nagekeken in de browser op 390 punten. Vanaf y=600 en 3000
     hoog is zij 70 procent van de hoogte en staat haar gezicht op 29 procent,
     ruim boven de kop. Van de laan met bomen blijft genoeg over. Links 450 eraf
     zet haar in het midden; zij loopt net rechts van het midden van de bron.

     Lagere kwaliteit dan de portretuitsnede. Deze foto vult onder lg het hele
     scherm, dus hij is daar het zwaarste onderdeel van de pagina, en hij ligt
     onder een donkere laag waar de kop overheen staat - ruis zie je er niet in.
     1320 dekt een telefoon van 440 punten op driedubbele dichtheid; 1536 is er
     voor de tablet van 768 punten op dubbele dichtheid (de iPad), die anders
     1320 krijgt waar hij er 1536 vraagt. Die maat kon er pas bij toen de bron
     van de fotograaf kwam - de uitsnede is 1688 breed, dus ook 1536 is nog een
     verkleining. Alleen een tablet haalt dat bestand op. */
  staand: {
    bron: 'raw/fotograaf/marjon-12.jpg',
    snede: {left: 450, top: 600, width: 1688, height: 3000},
    maten: [720, 1020, 1320, 1536],
    kwaliteit: 80,
  },
};

/* Licht onscherptemasker na de lanczos-verkleining, om de zachtheid terug te
   halen die elke verkleining kost. Lichter dan op 15-10: daar moest het
   randen terugzetten in een opgeschaald beeld, hier zit de tekening er al in
   en zou meer alleen ruis opleveren. */
const VERSCHERP = {sigma: 0.6, m1: 0.5, m2: 1.0};

/* Laplace-variantie: hoeveel tekening zit er in het beeld. Puur om te kunnen
   nameten of een ronde iets opgeleverd heeft, staat verder nergens in de site. */
async function scherpte(buf) {
  const {data, info} = await sharp(buf).greyscale().resize(600, null, {fit: 'inside'}).raw().toBuffer({resolveWithObject: true});
  const {width: w, height: h} = info;
  let som = 0, som2 = 0, n = 0;
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const l = -4 * data[i] + data[i - 1] + data[i + 1] + data[i - w] + data[i + w];
      som += l; som2 += l * l; n++;
    }
  return som2 / n - (som / n) ** 2;
}

for (const [naam, b] of Object.entries(BEELD)) {
  const mb = await sharp(b.bron).metadata();
  const snee = await sharp(b.bron).extract(b.snede).toBuffer();
  console.log(`\n${naam}: ${b.bron} ${mb.width}x${mb.height} -> uitsnede ${b.snede.width}x${b.snede.height} scherpte ${(await scherpte(snee)).toFixed(0)}`);

  const verhouding = b.snede.height / b.snede.width;
  for (const breedte of b.maten) {
    const hoogte = Math.round(breedte * verhouding);
    if (breedte > b.snede.width) throw new Error(`${naam}: ${breedte} is breder dan de uitsnede, dan rekt de browser alsnog op`);
    const buf = await sharp(snee)
      .resize(breedte, hoogte, {fit: 'cover', kernel: 'lanczos3'})
      .sharpen(VERSCHERP)
      .webp({quality: b.kwaliteit, effort: 6})
      .toBuffer();
    const bestand = breedte === b.maten[0] ? `hero-${naam}.webp` : `hero-${naam}-${breedte}.webp`;
    writeFileSync(`${UP}/${bestand}`, buf);
    console.log(`  ${bestand} ${breedte}x${hoogte} ${(buf.length / 1024).toFixed(0)}kB scherpte ${(await scherpte(buf)).toFixed(0)}`);
  }

  /* Het deelkaartje (og:image in kop.mjs) komt uit de portretuitsnede. Een jpg,
     want niet elke chat- en socialeapp toont webp in een voorbeeldkaartje. */
  if (naam === 'portret') {
    const jpg = await sharp(snee).resize(1200, 1500, {fit: 'cover', kernel: 'lanczos3'}).sharpen(VERSCHERP).jpeg({quality: 82}).toBuffer();
    writeFileSync(`${UP}/hero-deelkaart.jpg`, jpg);
    console.log(`  hero-deelkaart.jpg 1200x1500 ${(jpg.length / 1024).toFixed(0)}kB scherpte ${(await scherpte(jpg)).toFixed(0)}`);
  }
}
