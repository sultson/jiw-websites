// Zet de aangeleverde Puur Genieten-filmpjes om naar webversies in
// inhoud/assets/video/branches/: een mp4 per clip plus een posterbeeld. De
// branchenaam komt uit de bestandsnaam.
//
// Elke branche bestaat in twee beeldverhoudingen, want de kaart staat rechtop
// op de telefoon en ligt op de desktop (zie style.css bij .branches):
//   <slug>.mp4        staand 720x1280, uit de eerste aanlevering (08-10-2026)
//   <slug>-breed.mp4  liggend 1280x720, uit de tweede (18-10-2026, 4K-masters)
// Het zijn dezelfde montages: de duur verschilt per clip minder dan een tiende
// seconde, dus de met de hand gekozen posterseconde geldt voor allebei.
//
// Alle acht branches hebben nu een liggende versie. Tuinen zat niet in de
// aanlevering van 's ochtends en kwam los na (18-10-2026, 26,62 s net als de
// staande); de opvang in style.css voor een kaart zonder liggende clip staat er
// nog voor als er ooit een negende branche bijkomt.
//
// De aangeleverde bestanden staan BUITEN de projectmap, in
// playground/.aangeleverd-framemedia/ (puur-genieten/ staand 210 MB,
// puur-genieten-horizontaal/ liggend 610 MB). Dat is de huisregel: wat in de
// projectmap ligt kan met een verkeerd ingesteld [assets] de Worker op.
// Eenmalig draaien na nieuwe aanlevering: node maak-branches.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BIN = join(process.env.USERPROFILE || process.env.HOME,
  'dev/tools/ffmpeg/ffmpeg-9.0-essentials_build/bin');
const ffmpeg = join(BIN, 'ffmpeg.exe');

const UIT = 'inhoud/assets/video/branches';
mkdirSync(UIT, { recursive: true });

// Buiten de monorepo. Stond tot de verhuizing naar jiw-websites op
// ../.aangeleverd-framemedia; dat pad bestond hier niet meer.
const AAN = join(process.env.USERPROFILE || process.env.HOME,
  'dev/claudius/playground/.aangeleverd-framemedia');

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
//
// Een vierde getal is de seconde voor het liggende posterbeeld, als die moet
// afwijken. Dat is bij een clip nodig: het staande beeld is uit het midden
// gesneden, dus iets wat daar net buiten valt staat in de liggende versie wel
// in beeld. Bij Massage is dat het ronde logo, dat op 7 s halverwege de
// bovenrand hangt; op 1,5 s komt het als een zon uit zee op en staat er een
// hele ondertitelregel onder.
export const CLIPS = [
  ['2nd-home', '2nd home PUUR GENIETEN.m4v', 18.4],
  ['beautyfarm', 'Beautyfarm Wellness & Spa.mov', 8.7],
  ['eten-en-drinken', 'Eten en drinken PUUR GENIETEN.mov', 15.0],
  ['golfen', '2 Golfen PUUR GENIETEN.mov', 10.5],
  ['massage', 'Massage PUUR GENIETEN.m4v', 7.0, 1.5],
  ['meubelzaak', 'Meubelzaak PUUR GENIETEN.mov', 2.4],
  ['reizen', 'Reizen PUUR GENIETEN.mov', 7.0],
  ['tuinen', 'Tuinen PUUR GENIETEN.mov', 3.2],
];

// De liggende masters, per slug. 3840x2160 op 50 beelden, dus hier gaat er
// meer af dan bij de staande: schalen naar 1280 breed en terug naar 25.
// Het nummer-16x9-bestand uit de tweede link is dezelfde montage als het
// 4K-bestand van Reizen en wordt daarom niet gebruikt.
export const BREED = {
  '2nd-home': '2nd_home_PUUR_GENIETEN_4K_beeldvullend.mp4',
  'beautyfarm': 'Beautyfarm_Wellness_Spa_PUUR_GENIETEN_4K_beeldvullend.mp4',
  'eten-en-drinken': 'Eten_en_drinken_PUUR_GENIETEN_4K_beeldvullend.mp4',
  'golfen': 'Golfen_PUUR_GENIETEN_4K_beeldvullend.mp4',
  'massage': 'Massage_PUUR_GENIETEN_4K_beeldvullend.mp4',
  'meubelzaak': 'Meubelzaak_PUUR_GENIETEN_4K_beeldvullend.mp4',
  'reizen': 'Reizen_PUUR_GENIETEN_4K_beeldvullend.mp4',
  'tuinen': 'Tuinen_PUUR_GENIETEN_4K_beeldvullend.mp4',
};

const run = (a) => execFileSync(ffmpeg, a, { stdio: ['ignore', 'ignore', 'pipe'] });

// node maak-branches.mjs --posters laat de mp4's met rust. Een posterbeeld
// kies je een paar keer opnieuw; opnieuw coderen duurt minuten.
const alleenPosters = process.argv.includes('--posters');
// --breed doet alleen de liggende versies, --staand alleen de staande.
const welke = process.argv.includes('--breed') ? 'breed'
  : process.argv.includes('--staand') ? 'staand' : 'beide';
// --alleen=<slug> doet een branche. Komt er een clip na-geleverd, dan hoeven de
// andere zeven 4K-masters niet opnieuw door ffmpeg.
const alleen = (process.argv.find(a => a.startsWith('--alleen=')) || '').slice(9);
const doe = (slug) => !alleen || slug === alleen;

if (welke !== 'breed') for (const [slug, bestand, posterSec] of CLIPS) {
  if (!doe(slug)) continue;
  const bron = join(AAN, 'puur-genieten', bestand);
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

if (welke !== 'staand') for (const [slug, , staandSec, breedSec] of CLIPS) {
  if (!doe(slug)) continue;
  const posterSec = breedSec ?? staandSec;
  const bestand = BREED[slug];
  if (!bestand) { console.log(`${slug} -> geen liggende versie aangeleverd`); continue; }
  const bron = join(AAN, 'puur-genieten-horizontaal', bestand);
  if (!existsSync(bron)) throw new Error(`ontbreekt: ${bron}`);

  if (!alleenPosters) {
    console.log(`${slug} -> breed mp4`);
    run(['-y', '-i', bron, '-map', '0:v:0', '-map', '0:a:0?',
      '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-profile:v', 'high', '-crf', '28',
      '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '25',
      '-c:a', 'aac', '-b:a', '96k', '-ac', '2',
      '-movflags', '+faststart', `${UIT}/${slug}-breed.mp4`]);
  }

  console.log(`${slug} -> breed poster`);
  run(['-y', '-ss', String(posterSec), '-i', bron, '-frames:v', '1', '-vf', 'scale=854:-2',
    '-q:v', '68', `${UIT}/${slug}-breed-poster.webp`]);
}
console.log('klaar');
