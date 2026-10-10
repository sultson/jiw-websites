/* Bewijst dat elke pagina compleet in de HTML staat, en zakt zo niet.
   Hangt in `pnpm build`, dus ook in `pnpm ship`: komt er ooit een pagina in
   die zijn tekst pas met javascript binnenhaalt, dan is er geen dist/ om te
   deployen.

   Geen browser nodig en dat is het punt: dit script leest precies wat een
   crawler met een kale GET uit het bestand krijgt. De tegenproef - draait een
   echte browser met javascript uit even ver als met javascript aan - staat in
   tools/zonder-js.mjs, want die heeft chromium nodig en een bouwstap hoort
   niet op een browser te wachten.

   Run los: pnpm --filter @jiw/dagmar-voss prerender */

import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { DIST, PAGINAS } from "./serve.mjs";

const fouten = [];
const zak = (pagina, wat) => fouten.push(pagina + ": " + wat);

/* Tekst zoals een crawler hem uit de HTML haalt: scripts, stijl en de losse
   svg-tekeningen eruit, tags eruit, entiteiten terug, witruimte platgeslagen. */
const tekstUit = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const een = (html, re) => {
  const m = html.match(re);
  return m ? m[1] : null;
};

/* ------------------------------------------------------- pagina voor pagina */
const gezien = new Map();

for (const slug of PAGINAS) {
  const bestand = join(DIST, slug === "/" ? "index.html" : slug + "index.html");
  const html = await readFile(bestand, "utf8").catch(() => null);
  if (html === null) {
    zak(slug, "index.html bestaat niet in dist/");
    continue;
  }
  gezien.set(slug, html);

  /* 1. Het is een echte, complete pagina en geen omhulsel. */
  if (!/^<!doctype html>/i.test(html.trim())) zak(slug, "geen doctype");
  if (!/<html lang="nl"/.test(html)) zak(slug, 'geen <html lang="nl">');

  const titel = een(html, /<title>([^<]+)<\/title>/);
  if (!titel || titel.length < 15) zak(slug, "titel ontbreekt of is te kort: " + titel);

  const omschrijving = een(html, /<meta name="description" content="([^"]*)"/);
  if (!omschrijving || omschrijving.length < 70) {
    zak(slug, "description ontbreekt of is korter dan 70 tekens (" + (omschrijving?.length ?? 0) + ")");
  }

  /* 2. De tekst staat er ook echt in. Een React-omhulsel haalt deze grens
        nooit: dat is een leeg <div id="root"> van een paar honderd bytes. */
  const tekst = tekstUit(html);
  const woorden = tekst.split(" ").filter(Boolean).length;
  if (woorden < 250) zak(slug, "maar " + woorden + " woorden tekst in de HTML");

  const koppen = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  if (koppen.length !== 1) zak(slug, koppen.length + " h1-koppen (moet er precies 1 zijn)");
  else if (!tekstUit(koppen[0][1])) zak(slug, "de h1 is leeg");

  /* 3. Eén script, en het is de meelaag: menu, kopbalk, kaart. Komt er een
        tweede bij, of krijgt deze een src, dan moet iemand hier kijken of de
        pagina nog zonder javascript leesbaar is. */
  const scripts = [...html.matchAll(/<script\b([^>]*)>/gi)].map((m) => m[1]);
  const metSrc = scripts.filter((a) => /\bsrc=/.test(a));
  const jsonLd = scripts.filter((a) => /application\/ld\+json/.test(a));
  if (metSrc.length) zak(slug, metSrc.length + " <script src=...> in de pagina - alles hoort inline en progressief");
  if (scripts.length - jsonLd.length > 1) {
    zak(slug, scripts.length - jsonLd.length + " gedragsscripts (verwacht 1)");
  }

  /* 4. Niets van de inhoud hangt aan een klasse die javascript moet zetten.
        `is-zichtbaar` is de klasse die de observer en de scroll gebruiken; die
        mag alleen op sieraad staan (de draad-knoop, de onderbalk), nooit op
        iets met tekst erin. */
  for (const m of html.matchAll(/<(\w+)[^>]*class="([^"]*)"[^>]*>([\s\S]{0,400}?)<\/\1>/g)) {
    if (!/\bis-verborgen\b|\bopacity:\s*0\b/.test(m[2])) continue;
    if (tekstUit(m[3]).length > 20) zak(slug, "tekst in een element dat verborgen begint: " + m[2]);
  }

  /* 5. Structured data moet parsen. Een JSON-LD met een komma te veel is voor
        Google hetzelfde als geen JSON-LD, en dat ziet niemand met het oog. */
  const blokken = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  if (!blokken.length) zak(slug, "geen JSON-LD");
  for (const [, ruw] of blokken) {
    try {
      const data = JSON.parse(ruw);
      const lijst = data["@graph"] ?? [data];
      for (const knoop of lijst) if (!knoop["@type"]) zak(slug, "JSON-LD-knoop zonder @type");
    } catch (e) {
      zak(slug, "JSON-LD parseert niet: " + e.message);
    }
  }

  /* 6. Canonical, og:url en het menu wijzen naar deze pagina op dit adres. */
  const canonical = een(html, /<link rel="canonical" href="([^"]+)"/);
  if (!canonical) zak(slug, "geen canonical");
  else if (!canonical.endsWith(slug)) zak(slug, "canonical eindigt niet op " + slug + ": " + canonical);
  const ogUrl = een(html, /<meta property="og:url" content="([^"]+)"/);
  if (ogUrl !== canonical) zak(slug, "og:url (" + ogUrl + ") wijkt af van de canonical");

  /* 7. Elke interne link komt ergens aan. Dit vangt de typefout in een menu
        die anders pas opvalt als een bezoeker hem aanklikt. */
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const pad = m[1];
    const doel = pad.endsWith("/") ? join(DIST, pad, "index.html") : join(DIST, pad);
    if (!(await stat(doel).catch(() => null))) zak(slug, "dode interne link: " + pad);
  }
}

/* -------------------------------------------------- robots.txt en sitemap.xml */
const origin = (() => {
  const html = gezien.get("/") ?? "";
  const c = een(html, /<link rel="canonical" href="(https?:\/\/[^/"]+)/);
  return c ?? "";
})();

const robots = await readFile(join(DIST, "robots.txt"), "utf8").catch(() => null);
if (!robots) zak("robots.txt", "bestaat niet");
else {
  if (/^Disallow: \/\s*$/m.test(robots)) zak("robots.txt", "sluit de hele site af voor crawlers");
  if (!robots.includes(origin + "/sitemap.xml")) {
    zak("robots.txt", "verwijst niet naar " + origin + "/sitemap.xml");
  }
}

const sitemap = await readFile(join(DIST, "sitemap.xml"), "utf8").catch(() => null);
if (!sitemap) zak("sitemap.xml", "bestaat niet");
else {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const verwacht = PAGINAS.map((s) => origin + s);
  for (const u of verwacht) if (!locs.includes(u)) zak("sitemap.xml", "mist " + u);
  for (const u of locs) if (!verwacht.includes(u)) zak("sitemap.xml", "heeft een adres te veel: " + u);
}

/* De 404 moet een eigen pagina zijn, niet de startpagina. */
const vierNulVier = await readFile(join(DIST, "404.html"), "utf8").catch(() => null);
if (!vierNulVier) zak("404.html", "bestaat niet");
else if (!/niet/i.test(een(vierNulVier, /<title>([^<]+)<\/title>/) ?? "")) {
  zak("404.html", "titel leest niet als een foutpagina");
}

/* --------------------------------------------------------------------- uitslag */
if (fouten.length) {
  console.error("\nPRE-RENDER GEZAKT - " + fouten.length + " punt(en):\n");
  for (const f of fouten) console.error("  - " + f);
  console.error("");
  process.exit(1);
}

const woordtal = PAGINAS.map((s) => tekstUit(gezien.get(s)).split(" ").filter(Boolean).length);
console.log(
  "Pre-render ok: " +
    PAGINAS.length +
    " paginas compleet in de HTML, " +
    Math.min(...woordtal) +
    "-" +
    Math.max(...woordtal) +
    " woorden per pagina, geen dode interne links, JSON-LD parseert, sitemap dekt alles."
);
