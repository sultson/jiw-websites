// Proefdraaien zonder te deployen.
//   node bouw.mjs && node serveer.mjs   ->  http://localhost:4174
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { extname, join } from 'path';

// POORT=4175 node serveer.mjs als er al iets op 4174 luistert - er draait op
// deze machine nog een oude van de conceptversie.
const POORT = Number(process.env.POORT) || 4174;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.ico': 'image/x-icon', '.json': 'application/json',
};

createServer((req, res) => {
  let pad = decodeURIComponent(req.url.split('?')[0]);
  if (pad.endsWith('/')) pad += 'index.html';
  let bestand = join('dist', pad);

  // Workers assets serveert /pad ook als /pad.html bestaat. Hier hetzelfde,
  // anders werken de links lokaal anders dan live.
  if (!existsSync(bestand) && existsSync(bestand + '.html')) bestand += '.html';
  if (!existsSync(bestand) || statSync(bestand).isDirectory()) {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    return res.end(readFileSync('dist/404.html'));
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(bestand)] || 'application/octet-stream' });
  res.end(readFileSync(bestand));
}).listen(POORT, () => console.log(`http://localhost:${POORT}`));
