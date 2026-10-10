/* Het statische serveertje dat elk meetscript hier nodig heeft.

   Stond vijf keer woordelijk in vijf scripts, met vijf verschillende
   poortnummers. Nu een keer, en hij kiest zelf een vrije poort: meet je twee
   dingen tegelijk, dan botsen ze niet meer.

   Serveert dist/ zoals Workers Static Assets dat doet voor deze site:
   /pad/ -> /pad/index.html, en alles wat niet bestaat krijgt 404.html met een
   echte 404 (not_found_handling in wrangler.jsonc). */

import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
export const DIST = join(HIER, "..", "dist");

/* Schermafdrukken gaan naar shots/ naast dist/, niet naar de map waar je het
   script vandaan startte - anders strooit `pnpm --filter` ze in de repo-root.
   Staat in .gitignore: elke run schrijft ze opnieuw. */
export async function shotPad(naam) {
  const map = join(HIER, "..", "shots");
  await mkdir(map, { recursive: true });
  return join(map, naam);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".js": "text/javascript",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};

/** Start het serveertje op een vrije poort. Geeft { url, stop() }. */
export async function serveDist() {
  const srv = createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    try {
      const body = await readFile(join(DIST, p));
      res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" });
      res.end(body);
    } catch {
      const body = await readFile(join(DIST, "404.html")).catch(() => "404");
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end(body);
    }
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const { port } = srv.address();
  return { url: "http://127.0.0.1:" + port, stop: () => new Promise((r) => srv.close(r)) };
}

/* De acht paginas, in de volgorde van het menu. Elk meetscript loopt deze lijst
   af; staat er een pagina bij in build.mjs, dan hoort hij hier ook. */
export const PAGINAS = [
  "/",
  "/wat-is-kopp/",
  "/klachten/",
  "/coaching/",
  "/cursus/",
  "/over-dagmar/",
  "/boeken/",
  "/contact/",
];
