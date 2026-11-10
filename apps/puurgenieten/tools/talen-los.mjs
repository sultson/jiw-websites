// Eenmalig (10-11-2026): menu, voet en titels in de drie taalbestanden van
// FRAME MEDIA naar Puur Genieten. Het menu wijst naar de blokken op de pagina.
import { readFileSync, writeFileSync } from 'fs';

const T = {
  nl: {
    paden: `  paden: {
    home: '/',
    puurgenieten: '/',
  },`,
    nav: `  nav: [
    ['aflevering', 'Aflevering'],
    ['branches', 'Branches'],
    ['voor-wie', 'Voor wie'],
    ['tarieven', 'Tarieven'],
    ['werkwijze', 'Werkwijze'],
  ],
  navKnop: 'Aanmelden',`,
    zin: `zin: 'Puur Genieten is een lifestyleprogramma op SBS 6 en KIJK. Een productie van FRAME MEDIA.',
    producent: 'Producent',`,
    titel: `titel: 'Puur Genieten op SBS 6 | uw bedrijf in het programma',`,
  },
  en: {
    paden: `  paden: {
    home: '/',
    puurgenieten: '/',
  },`,
    nav: `  nav: [
    ['aflevering', 'Episode'],
    ['branches', 'Sectors'],
    ['voor-wie', 'Who it is for'],
    ['tarieven', 'Rates'],
    ['werkwijze', 'How it works'],
  ],
  navKnop: 'Apply',`,
    zin: `zin: 'Puur Genieten is a lifestyle programme on SBS 6 and KIJK. A FRAME MEDIA production.',
    producent: 'Producer',`,
    titel: `titel: 'Puur Genieten on SBS 6 | your company in the programme',`,
  },
  de: {
    paden: `  paden: {
    home: '/',
    puurgenieten: '/',
  },`,
    nav: `  nav: [
    ['aflevering', 'Folge'],
    ['branches', 'Branchen'],
    ['voor-wie', 'F&uuml;r wen'],
    ['tarieven', 'Preise'],
    ['werkwijze', 'Ablauf'],
  ],
  navKnop: 'Anmelden',`,
    zin: `zin: 'Puur Genieten ist eine Lifestyle-Sendung auf SBS 6 und KIJK. Eine Produktion von FRAME MEDIA.',
    producent: 'Produzent',`,
    titel: `titel: 'Puur Genieten auf SBS 6 | Ihr Unternehmen in der Sendung',`,
  },
};

for (const [code, t] of Object.entries(T)) {
  const f = `inhoud/taal/${code}.mjs`;
  let s = readFileSync(f, 'utf8').replace(/\r/g, '');
  const rep = (re, b) => { if (!re.test(s)) throw new Error(`${code}: ${re}`); s = s.replace(re, () => b); };
  rep(/  paden: \{[\s\S]*?\n  \},/, t.paden);
  rep(/  nav: \[[\s\S]*?\n  \],\n  navKnop: [^\n]*/, t.nav);
  rep(/zin: '[^\n]*',/, t.zin);
  rep(/(?<=puurgenieten: \{\n\s*)titel: '[^\n]*',/, t.titel);
  writeFileSync(f, s);
}
console.log('talen omgezet');
