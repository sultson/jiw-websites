/**
 * Zet de merkbestanden uit `merk/` op de site onder /logo, met een zip ernaast.
 *
 * Waarom op haar eigen domein en niet een tijdelijke deelmap: een link die
 * verloopt is een link die Marjon over een half jaar niet meer kan gebruiken,
 * en dan moet er iemand opnieuw bestanden opzoeken. Dit adres blijft staan
 * zolang de site staat, en het is haar eigen domein, dus ze kan het
 * doorsturen naar een drukker zonder uit te leggen van wie dat andere adres is.
 *
 * De pagina staat op noindex (zie public/_headers), dus hij komt niet in
 * Google tussen haar echte pagina's en kost geen indexruimte.
 *
 * Draait na `vite build`, dus na het kopiëren van public/ naar dist/. De
 * bestanden zelf staan daarom niet in public/ maar blijven in merk/: één
 * plek waar ze vandaan komen, en `pnpm merk` kan ze opnieuw maken zonder dat
 * iemand daarna nog een kopie moet bijwerken.
 *
 *   node scripts/merk-publiceren.mjs
 */
import assert from 'node:assert/strict';
import {copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {crc32, deflateRawSync} from 'node:zlib';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MERK = path.join(APP, 'merk');
const UIT = path.join(APP, 'dist', 'logo');

const ZIP = 'logo-bewust-gezond-in-je-mond.zip';

/* LEES-MIJ.md in merk/ is voor ons: welk script het maakt, wat er aan de scan
   rechtgezet is, welke keuze nog open staat. Daar heeft Marjon niets aan, en de
   helft ervan leest als kritiek op het bestand dat ze zelf aanleverde. In de
   zip gaat dus deze tekst, die alleen zegt welk bestand waarvoor is. */
const LEESMIJ = `Logo Bewust Gezond in je Mond
=============================

Welk bestand waarvoor

  bloem.svg                     het merkteken, in petrol. Dit is het bronbestand.
  logo-liggend.svg              merkteken met de naam ernaast
  bloem-eenkleur.svg            zelfde tekening in een kleur, voor stempels,
                                borduur en eenkleurdruk
  logo-liggend-eenkleur.svg     idem, liggend
  bloem.pdf                     voor de drukker, 120 mm breed
  logo-liggend.pdf              idem, liggend
  png/bloem-512.png             doorzichtige achtergrond, voor beeldscherm
  png/bloem-1024.png            en social media. Het getal is de breedte in
  png/bloem-2048.png            pixels: groter is scherper en zwaarder.
  png/logo-liggend-1024.png     liggend, doorzichtige achtergrond
  png/logo-liggend-2048.png
  png/logo-liggend-1024-room.png  op de roomkleur, voor waar doorzichtig niet
                                kan. Oudere versies van Outlook tekenen een
                                doorzichtige achtergrond als een zwart vlak.

Voor drukwerk altijd de svg of de pdf aanleveren, nooit een png. Een svg of pdf
schaalt tot een gevelbord zonder scherpte te verliezen, een png niet.

Kleuren

  petrol   #316d78   het merkteken
  inkt     #2b4249   de naam
  room     #f6f4ef   achtergrond

De naam staat in het logo als tekening en niet als tekst. Wie het bestand opent
heeft het lettertype dus niet nodig; het ziet er op elke computer hetzelfde uit.

Gemaakt door Jouw Ideale Website, oktober 2026.
`.replace(/\n/g, '\r\n'); // Windows-regeleindes: oudere kladblokken maken van
// een bestand met alleen \n één onleesbare regel.

/* ------------------------------------------------------------------ */
/*  Welke bestanden eruit gaan                                         */
/* ------------------------------------------------------------------ */

const BESTANDEN = [
  'bloem.svg',
  'bloem-eenkleur.svg',
  'logo-liggend.svg',
  'logo-liggend-eenkleur.svg',
  'bloem.pdf',
  'logo-liggend.pdf',
  'png/bloem-512.png',
  'png/bloem-1024.png',
  'png/bloem-2048.png',
  'png/logo-liggend-1024.png',
  'png/logo-liggend-2048.png',
  'png/logo-liggend-1024-room.png',
];

for (const naam of BESTANDEN) {
  const bron = path.join(MERK, naam);
  assert.ok(statSync(bron).isFile(), `merk/${naam} ontbreekt; draai eerst pnpm merk`);
}

mkdirSync(path.join(UIT, 'png'), {recursive: true});

for (const naam of BESTANDEN) {
  copyFileSync(path.join(MERK, naam), path.join(UIT, naam));
}
writeFileSync(path.join(UIT, 'LEES-MIJ.txt'), LEESMIJ);

/* ------------------------------------------------------------------ */
/*  De zip                                                             */
/* ------------------------------------------------------------------ */

/**
 * Zelf geschreven en geen pakket: een zip is een handvol velden achter elkaar,
 * en node kan deflaten en crc32 rekenen. Een afhankelijkheid erbij voor zes
 * regels bitgeschuif is het niet waard.
 *
 * De datumvelden staan op een vaste waarde in plaats van op "nu". Twee keer
 * bouwen zonder iets te wijzigen geeft dan hetzelfde bestand, byte voor byte,
 * en dus niet elke deploy een nieuwe download voor wie hem al had.
 */
const DOS_TIJD = 12 << 11; // 12:00:00
const DOS_DATUM = ((2026 - 1980) << 9) | (10 << 5) | 13; // 13-10-2026

function zip(invoer) {
  const lokaal = [];
  const centraal = [];
  let positie = 0;

  for (const {naam, inhoud} of invoer) {
    const naamBytes = Buffer.from(naam, 'utf8');
    const gepakt = deflateRawSync(inhoud, {level: 9});
    const som = crc32(inhoud);

    const kop = Buffer.alloc(30);
    kop.writeUInt32LE(0x04034b50, 0);
    kop.writeUInt16LE(20, 4); // versie nodig
    kop.writeUInt16LE(0, 6); // vlaggen
    kop.writeUInt16LE(8, 8); // deflate
    kop.writeUInt16LE(DOS_TIJD, 10);
    kop.writeUInt16LE(DOS_DATUM, 12);
    kop.writeUInt32LE(som, 14);
    kop.writeUInt32LE(gepakt.length, 18);
    kop.writeUInt32LE(inhoud.length, 22);
    kop.writeUInt16LE(naamBytes.length, 26);
    kop.writeUInt16LE(0, 28); // geen extra veld
    lokaal.push(kop, naamBytes, gepakt);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4); // versie gemaakt door
    cd.writeUInt16LE(20, 6); // versie nodig
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(8, 10);
    cd.writeUInt16LE(DOS_TIJD, 12);
    cd.writeUInt16LE(DOS_DATUM, 14);
    cd.writeUInt32LE(som, 16);
    cd.writeUInt32LE(gepakt.length, 20);
    cd.writeUInt32LE(inhoud.length, 24);
    cd.writeUInt16LE(naamBytes.length, 28);
    cd.writeUInt16LE(0, 30); // extra
    cd.writeUInt16LE(0, 32); // commentaar
    cd.writeUInt16LE(0, 34); // schijf
    cd.writeUInt16LE(0, 36); // interne kenmerken
    cd.writeUInt32LE(0o644 << 16, 38); // externe kenmerken: gewoon bestand
    cd.writeUInt32LE(positie, 42);
    centraal.push(cd, naamBytes);

    positie += kop.length + naamBytes.length + gepakt.length;
  }

  const cdBlok = Buffer.concat(centraal);
  const slot = Buffer.alloc(22);
  slot.writeUInt32LE(0x06054b50, 0);
  slot.writeUInt16LE(0, 4); // schijfnummer
  slot.writeUInt16LE(0, 6); // schijf met de centrale map
  slot.writeUInt16LE(invoer.length, 8);
  slot.writeUInt16LE(invoer.length, 10);
  slot.writeUInt32LE(cdBlok.length, 12);
  slot.writeUInt32LE(positie, 16);
  slot.writeUInt16LE(0, 20); // geen commentaar

  return Buffer.concat([...lokaal, cdBlok, slot]);
}

const inhoud = [
  {naam: 'LEES-MIJ.txt', inhoud: Buffer.from(LEESMIJ, 'utf8')},
  ...BESTANDEN.map((naam) => ({naam, inhoud: readFileSync(path.join(MERK, naam))})),
];

const pakket = zip(inhoud);
writeFileSync(path.join(UIT, ZIP), pakket);

/* ------------------------------------------------------------------ */
/*  De grootte in de downloadknop                                      */
/* ------------------------------------------------------------------ */

/* Wie op een knop klikt wil weten wat eraan komt, en wie dat getal met de hand
   in de pagina zet vergeet het bij de eerste wijziging. Dus hier, uit het
   bestand zelf. */
const kB = pakket.length / 1024;
const grootte = kB >= 1024 ? `${(kB / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.round(kB)} kB`;

const pagina = path.join(UIT, 'index.html');
const html = readFileSync(pagina, 'utf8');
assert.ok(
  html.includes('{{ZIPGROOTTE}}'),
  'public/logo/index.html mist {{ZIPGROOTTE}}; dan staat er een vast getal in de knop',
);
writeFileSync(pagina, html.replaceAll('{{ZIPGROOTTE}}', grootte));

const los = inhoud.reduce((n, b) => n + b.inhoud.length, 0);
console.log(
  `merk: ${inhoud.length} bestanden onder /logo, zip ${grootte} (los ${(los / 1024).toFixed(0)} kB)`,
);
