/**
 * Vouwt de Sanity Studio in de dist van de site, zodat het beheer van de klant
 * op toonoverleven.jouwidealewebsite.nl/beheer staat in plaats van op een
 * hostname op sanity.studio.
 *
 * `basePath` in sanity.config.ts verzet de router van de Studio naar /beheer,
 * maar de build blijft absolute adressen voor zijn eigen bestanden uitschrijven
 * (/static/*, /vendor/*). Dus de pagina gaat naar dist/beheer/index.html en
 * zijn bestanden gaan naar de wortel, waar die adressen kloppen. Er botst
 * niets: Vite zet de bundels van de site zelf onder /assets.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * De eigen reclame van Sanity in het beheer van een klant: pop-ups over hun
 * conferentie en aanbiedingen voor een proefabonnement. De klant kijkt naar
 * zijn eigen site, niet naar de routekaart van Sanity, dus die verbergen we in
 * de kopie die wij serveren. Puur cosmetisch, en het faalt veilig: worden deze
 * haakjes hernoemd, dan pakken de regels gewoon niets meer.
 */
const HIDE_VENDOR_PROMOS = `
    <style>
      [data-ui="whats-new-root"],
      [data-ui="whats-new-card"],
      #free-trial-modal,
      [data-testid="free-trial"],
      [data-testid="free-trial-modal"],
      [data-testid="free-trial-finished"] {
        display: none !important;
      }
    </style>
  `;

const app = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const studio = path.join(app, 'studio');
const studioDist = path.join(studio, 'dist');
const siteDist = path.join(app, 'dist');

execFileSync('pnpm', ['-C', studio, 'build', '-y'], { stdio: 'inherit' });

if (!existsSync(path.join(studioDist, 'index.html'))) {
  throw new Error('De Studio-build heeft geen index.html opgeleverd');
}

rmSync(path.join(siteDist, 'beheer'), { recursive: true, force: true });
mkdirSync(path.join(siteDist, 'beheer'), { recursive: true });
const page = readFileSync(path.join(studioDist, 'index.html'), 'utf8');
if (!page.includes('</head>')) throw new Error('index.html van de Studio heeft geen </head>');
writeFileSync(
  path.join(siteDist, 'beheer/index.html'),
  page.replace('</head>', `${HIDE_VENDOR_PROMOS}</head>`),
);

for (const dir of ['static', 'vendor']) {
  const from = path.join(studioDist, dir);
  if (existsSync(from)) {
    rmSync(path.join(siteDist, dir), { recursive: true, force: true });
    cpSync(from, path.join(siteDist, dir), { recursive: true });
  }
}

console.log('Studio gebundeld op /beheer');
