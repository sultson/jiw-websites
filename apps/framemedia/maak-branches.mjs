// Zet de acht aangeleverde Puur Genieten-filmpjes om naar webversies in
// inhoud/assets/video/branches/: een mp4 per clip plus een posterbeeld. De
// branchenaam komt uit de bestandsnaam.
//
// De aangeleverde bestanden staan BUITEN de projectmap, in
// playground/.aangeleverd-framemedia/puur-genieten/ (verticaal 720x1280, samen
// 210 MB). Dat is de huisregel: wat in de projectmap ligt kan met een verkeerd
// ingesteld [assets] de Worker op.
// Eenmalig draaien na nieuwe aanlevering: node maak-branches.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BIN = join(process.env.USERPROFILE || process.env.HOME,
  'dev/tools/ffmpeg/ffmpeg-9.0-essentials_build/bin');
const ffmpeg = join(BIN, 'ffmpeg.exe');

const UIT = 'inhoud/assets/video/branches';
mkdirSync(UIT, { recursive: true });

// slug -> aangeleverd bestand + de seconde waar het posterbeeld vandaan komt.
// De "2 " voor Golfen is een nummering uit hun eigen map, geen onderdeel van
// de branchenaam.
//
// Die seconde is per clip met de hand gekozen en dat moet ook: elke clip heeft
// een ondertitel die regel voor regel opbouwt en een logo dat in beeld draait,
// dus een vast tijdstip levert kaarten op met een halve zin erin. De massage-
// clip is een doorlopend shot waar het logo nooit meer uit gaat; daar is 7 s
// het enige moment zonder ondertitel. Let ook op de overgangen: bij 8 s heeft
// Eten en drinken een zwarte naad over het midden en Golfen zwarte balken
// boven en onder.
export const CLIPS = [
  ['2nd-home', '2nd home PUUR GENIETEN.m4v', 18.4],
  ['beautyfarm', 'Beautyfarm Wellness & Spa.mov', 8.7],
  ['eten-en-drinken', 'Eten en drinken PUUR GENIETEN.mov', 15.0],
  ['golfen', '2 Golfen PUUR GENIETEN.mov', 10.5],
  ['massage', 'Massage PUUR GENIETEN.m4v', 7.0],
  ['meubelzaak', 'Meubelzaak PUUR GENIETEN.mov', 2.4],
  ['reizen', 'Reizen PUUR GENIETEN.mov', 7.0],
  ['tuinen', 'Tuinen PUUR GENIETEN.mov', 3.2],
];

const run = (a) => execFileSync(ffmpeg, a, { stdio: ['ignore', 'ignore', 'pipe'] });

// node maak-branches.mjs --posters laat de mp4's met rust. Een posterbeeld
// kies je een paar keer opnieuw; opnieuw coderen duurt minuten.
const alleenPosters = process.argv.includes('--posters');

for (const [slug, bestand, posterSec] of CLIPS) {
  const bron = join('../.aangeleverd-framemedia/puur-genieten', bestand);
  if (!existsSync(bron)) throw new Error(`ontbreekt: ${bron}`);
  const basis = ['-y', '-i', bron, '-map', '0:v:0', '-map', '0:a:0?'];

  // Alleen mp4. Een vp9-webm kwam er bij deze clips groter uit dan h264 en
  // elke browser die hier telt speelt h264, dus een tweede bestand is zonde.
  if (!alleenPosters) {
  console.log(`${slug} -> mp4`);
  run([...basis, '-c:v', 'libx264', '-profile:v', 'high', '-crf', '28', '-preset', 'slow',
    '-pix_fmt', 'yuv420p', '-r', '25', '-c:a', 'aac', '-b:a', '96k', '-ac', '2',
    '-movflags', '+faststart', `${UIT}/${slug}.mp4`]);
  }

  console.log(`${slug} -> poster`);
  run(['-y', '-ss', String(posterSec), '-i', bron, '-frames:v', '1', '-vf', 'scale=480:-2',
    '-q:v', '68', `${UIT}/${slug}-poster.webp`]);
}
console.log('klaar');
