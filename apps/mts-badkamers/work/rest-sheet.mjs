import fs from 'node:fs';
import { projects } from '../projects.mjs';
import { RANGES } from './ranges.mjs';
const out = [];
for (const p of projects) {
  const used = new Set([p.hero, p.card, ...(p.sections||[]).flatMap(s=>s.imgs.map(x=>x.i)), ...(p.results||[]).map(x=>x.i), ...(p.videos||[])]);
  const rest = (RANGES[p.slug]||[]).filter(i=>!used.has(i));
  out.push({slug:p.slug, rest});
  console.log(p.slug.padEnd(38), String(rest.length).padStart(2), JSON.stringify(rest));
}
fs.writeFileSync('work/rest.json', JSON.stringify(out,null,1));
