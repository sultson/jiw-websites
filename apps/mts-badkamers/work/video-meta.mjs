/**
 * Leest duur en afmetingen uit de webklare video's in site/video/ en schrijft ze
 * naar _video.json.
 *
 * Waarom een apart bestand en niet in work/media.mjs: media.mjs gaat over
 * plaatjes maken, dit gaat over feiten opzoeken. En build.mjs mag geen ffprobe
 * aanroepen -- dat zou een bouw laten omvallen op een machine zonder ffmpeg,
 * terwijl de uitkomst tussen twee bouws nooit verandert.
 *
 * De duur is nodig voor de VideoObject in de structured data. Google vraagt daar
 * om een ISO 8601-duur (PT1M12S); zonder duur en zonder thumbnail komt een video
 * niet in de videoresultaten.
 *
 *   node work/video-meta.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve('.');
const VIDEO = path.join(ROOT, 'site', 'video');
const OUT = path.join(ROOT, '_video.json');

// PT1M12S in plaats van 72: schema.org wil ISO 8601, en Google leest niets anders.
function iso8601(seconden) {
  const s = Math.round(seconden);
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `PT${m ? `${m}M` : ''}${rest}S`;
}

function probe(bestand) {
  const uit = execFileSync(
    'ffprobe',
    [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height:format=duration',
      '-of', 'json',
      bestand,
    ],
    { encoding: 'utf8' },
  );
  const d = JSON.parse(uit);
  const stream = d.streams?.[0] || {};
  const duur = Number(d.format?.duration || 0);
  return { w: stream.width, h: stream.height, seconds: Math.round(duur), duration: iso8601(duur) };
}

const bestanden = fs
  .readdirSync(VIDEO)
  .filter((f) => f.endsWith('.mp4'))
  .sort();

const uit = {};
for (const f of bestanden) {
  uit[f] = probe(path.join(VIDEO, f));
  console.log(`${f}: ${uit[f].duration} (${uit[f].w}x${uit[f].h})`);
}

fs.writeFileSync(OUT, `${JSON.stringify(uit, null, 2)}\n`);
console.log(`\n${bestanden.length} video's -> _video.json`);
