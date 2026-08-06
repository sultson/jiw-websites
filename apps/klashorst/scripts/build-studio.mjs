/**
 * Folds the Sanity Studio into the site's own dist, so the client's CMS lives
 * at klashorst.jouwidealewebsite.nl/beheer instead of a sanity.studio hostname.
 *
 * `basePath` in sanity.config.ts moves the Studio's router to /beheer, but the
 * build still emits absolute asset URLs (/static/*, /vendor/*). So the page goes
 * to dist/beheer/index.html and its assets go to the root, where those URLs
 * resolve. Nothing collides: Vite puts the site's own bundles under /assets.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Sanity's own product marketing inside a client's CMS: "what's new" popovers
 * about their conference, and free-trial prompts. The client is being shown
 * their museum, not Sanity's roadmap, so it is hidden in the copy we serve.
 * Purely cosmetic, and it fails safe: if these hooks are renamed upstream the
 * rules simply stop matching.
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
  throw new Error('Studio build produced no index.html');
}

rmSync(path.join(siteDist, 'beheer'), { recursive: true, force: true });
mkdirSync(path.join(siteDist, 'beheer'), { recursive: true });
const page = readFileSync(path.join(studioDist, 'index.html'), 'utf8');
if (!page.includes('</head>')) throw new Error('Studio index.html has no </head> to patch');
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
