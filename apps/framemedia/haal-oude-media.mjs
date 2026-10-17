// Haalt de bestanden van de oude WordPress-site op en legt ze in oud/ op
// precies hetzelfde pad. bouw.mjs kopieert die map ongewijzigd in dist/, zodat
// /wp-content/uploads/... op de nieuwe site blijft antwoorden.
//
// Waarom: het logo en de studiofoto's staan in Google Afbeeldingen op dat
// adres. Verandert het pad, dan is het voor Google een nieuwe afbeelding en
// begint die bij nul. De lijst komt uit de SEO-analyse van 17-10-2026.
//
//   node haal-oude-media.mjs          alleen wat er nog niet ligt
//   node haal-oude-media.mjs --opnieuw   alles opnieuw
import { mkdirSync, writeFileSync, existsSync, statSync } from 'fs';

const BRON = 'https://www.framemedia.tv';
const OPNIEUW = process.argv.includes('--opnieuw');

const PADEN = `
/wp-content/uploads/2021/04/pexels-brett-sayles-1426044-1024x683.jpg
/wp-content/uploads/2021/04/pexels-brett-sayles-1426044.jpg
/wp-content/uploads/2021/04/pexels-caleb-oquendo-2918590-683x1024.jpg
/wp-content/uploads/2021/04/pexels-caleb-oquendo-2918590.jpg
/wp-content/uploads/2021/04/SVGlogo-01.svg
/wp-content/uploads/2021/04/SVGlogoAI-02-150x150.jpg
/wp-content/uploads/2021/04/SVGlogoAI-02-300x300.jpg
/wp-content/uploads/2021/04/SVGlogoAI-02.jpg
/wp-content/uploads/2021/05/Frame-Media-Vacatures-1024x682.jpeg
/wp-content/uploads/2021/05/Frame-Media-Vacatures-1536x1024.jpeg
/wp-content/uploads/2021/05/Frame-Media-Vacatures-300x200.jpeg
/wp-content/uploads/2021/05/Frame-Media-Vacatures-768x512.jpeg
/wp-content/uploads/2021/05/Frame-Media-Vacatures.jpeg
/wp-content/uploads/2023/04/1-Foto-1-Studioruimte-A-1024x576.jpeg
/wp-content/uploads/2023/04/1-Foto-1-Studioruimte-A-1536x864.jpeg
/wp-content/uploads/2023/04/1-Foto-1-Studioruimte-A-300x169.jpeg
/wp-content/uploads/2023/04/1-Foto-1-Studioruimte-A-768x432.jpeg
/wp-content/uploads/2023/04/1-Foto-1-Studioruimte-A.jpeg
/wp-content/uploads/2023/04/1-Foto-2-Studioruimte-A-1024x576.jpeg
/wp-content/uploads/2023/04/1-Foto-2-Studioruimte-A-1536x864.jpeg
/wp-content/uploads/2023/04/1-Foto-2-Studioruimte-A-300x169.jpeg
/wp-content/uploads/2023/04/1-Foto-2-Studioruimte-A-768x432.jpeg
/wp-content/uploads/2023/04/1-Foto-2-Studioruimte-A.jpeg
/wp-content/uploads/2023/04/2-Foto-Regieruimte-1024x576.jpeg
/wp-content/uploads/2023/04/2-Foto-Regieruimte-1536x864.jpeg
/wp-content/uploads/2023/04/2-Foto-Regieruimte-300x169.jpeg
/wp-content/uploads/2023/04/2-Foto-Regieruimte-768x432.jpeg
/wp-content/uploads/2023/04/2-Foto-Regieruimte.jpeg
/wp-content/uploads/2023/04/3-Foto-Studioruimte-B-1024x576.jpeg
/wp-content/uploads/2023/04/3-Foto-Studioruimte-B-1536x864.jpeg
/wp-content/uploads/2023/04/3-Foto-Studioruimte-B-300x169.jpeg
/wp-content/uploads/2023/04/3-Foto-Studioruimte-B-768x432.jpeg
/wp-content/uploads/2023/04/3-Foto-Studioruimte-B.jpeg
/wp-content/uploads/2023/04/4-Foto-Productieruimte-Greenroom-1024x576.jpeg
/wp-content/uploads/2023/04/4-Foto-Productieruimte-Greenroom-1536x864.jpeg
/wp-content/uploads/2023/04/4-Foto-Productieruimte-Greenroom-300x169.jpeg
/wp-content/uploads/2023/04/4-Foto-Productieruimte-Greenroom-768x432.jpeg
/wp-content/uploads/2023/04/4-Foto-Productieruimte-Greenroom.jpeg
/wp-content/uploads/2023/04/5-Foto-Visagieruimte-1024x576.jpeg
/wp-content/uploads/2023/04/5-Foto-Visagieruimte-1536x864.jpeg
/wp-content/uploads/2023/04/5-Foto-Visagieruimte-300x169.jpeg
/wp-content/uploads/2023/04/5-Foto-Visagieruimte-768x432.jpeg
/wp-content/uploads/2023/04/5-Foto-Visagieruimte.jpeg
/wp-content/uploads/2024/02/Mondzorg-favicon-02.jpg
/wp-content/uploads/2024/02/Mondzorg-TV.svg
/wp-content/uploads/2024/02/pexels-andrea-piacquadio-3779705-1024x683.jpg
/wp-content/uploads/2024/02/pexels-andrea-piacquadio-3779705-1536x1024.jpg
/wp-content/uploads/2024/02/pexels-andrea-piacquadio-3779705-2048x1365.jpg
/wp-content/uploads/2024/02/pexels-andrea-piacquadio-3779705-300x200.jpg
/wp-content/uploads/2024/02/pexels-andrea-piacquadio-3779705-768x512.jpg
/wp-content/uploads/2024/02/pexels-andrea-piacquadio-3779705.jpg
/wp-content/uploads/2024/02/pexels-daniel-frank-305567-1024x683.jpg
/wp-content/uploads/2024/02/pexels-daniel-frank-305567-1536x1024.jpg
/wp-content/uploads/2024/02/pexels-daniel-frank-305567-2048x1365.jpg
/wp-content/uploads/2024/02/pexels-daniel-frank-305567-300x200.jpg
/wp-content/uploads/2024/02/pexels-daniel-frank-305567-768x512.jpg
/wp-content/uploads/2024/02/pexels-daniel-frank-305567.jpg
`.trim().split('\n').map(s => s.trim()).filter(Boolean);

let nieuw = 0, over = 0;
const stuk = [];

for (const pad of PADEN) {
  const doel = 'oud' + pad;
  if (!OPNIEUW && existsSync(doel) && statSync(doel).size > 0) { over++; continue; }
  const r = await fetch(BRON + pad);
  if (!r.ok) { stuk.push(`${r.status} ${pad}`); continue; }
  const buf = Buffer.from(await r.arrayBuffer());
  // Een WordPress die een 200 met een foutpagina teruggeeft is erger dan een
  // 404: dan staat er straks html onder een .jpeg. Dus kijken wat er binnenkomt.
  const type = r.headers.get('content-type') || '';
  if (!/^(image|application\/pdf)/.test(type)) { stuk.push(`${type || 'geen type'} ${pad}`); continue; }
  mkdirSync(doel.replace(/\/[^/]+$/, ''), { recursive: true });
  writeFileSync(doel, buf);
  nieuw++;
}

const mb = n => (n / 1048576).toFixed(1);
console.log(`${nieuw} nieuw, ${over} stonden er al, ${PADEN.length} op de lijst`);
if (stuk.length) {
  console.log(`\n${stuk.length} niet opgehaald:`);
  for (const s of stuk) console.log('  ' + s);
  process.exitCode = 1;
}
