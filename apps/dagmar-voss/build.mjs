/* Statische bouwer voor de site van Dagmar Voss.
   Run: pnpm --filter @jiw/dagmar-voss build  ->  schrijft dist/

   Geen Vite, geen React: dit script schrijft acht complete HTML-paginas weg.
   Dat is bewust en het is wat "pre-rendered" hier betekent - een crawler die
   een pagina ophaalt krijgt de hele tekst in de eerste byte, er is geen
   hydratatie. tools/prerender.mjs bewijst dat na elke bouw. */

import { mkdir, writeFile, cp, rm, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, "src");
const DIST = join(ROOT, "dist");
const REPO = join(ROOT, "..", "..");

/* De Mapbox-sleutel staat op een plek, in de .env van de repo-root (naast
   CLOUDFLARE_API_TOKEN), en wordt bij het bouwen ingelezen. Een publieke
   pk-token hoort in de pagina - zo werkt Mapbox - maar niet in de broncode van
   dit project, anders staat hij op twee plekken en loopt er een achter zodra
   hij wordt vervangen. Stond tot de verhuizing naar deze repo in
   ~/dev/jiw-concepts/.env; dat pad lag buiten de repo en brak dus elke verse
   kloon. MAPBOX_TOKEN in het milieu wint, zodat een build elders hem kan
   meegeven zonder bestand. */
const MAPBOX_TOKEN = await (async () => {
  if (process.env.MAPBOX_TOKEN) return process.env.MAPBOX_TOKEN.trim();
  const env = join(REPO, ".env");
  const m = (await readFile(env, "utf8").catch(() => "")).match(/^MAPBOX_TOKEN=(.+)$/m);
  if (!m) throw new Error("MAPBOX_TOKEN niet gevonden in " + env + " - de kaart op /contact/ kan niet gebouwd worden.");
  return m[1].trim();
})();

/* Het adres waar de site op staat. Elke canonical, hreflang, og:url, elk
   sitemap-item en elke @id in de structured data komt hieruit.

   Sinds 10-10-2026 het echte domein. Het conceptadres blijft antwoorden - die
   link is met de klant gedeeld - maar het levert de site uit met een
   `X-Robots-Tag: noindex` uit worker.mjs, zodat er niet twee indexeerbare
   kopieen van dezelfde acht paginas staan. Het kale adres is de enige die in
   Google hoort. */
const SITE = {
  name: "Dagmar Voss",
  tagline: "Van KOPP naar kracht",
  origin: process.env.SITE_ORIGIN?.trim() || "https://dagmarvoss.nl",
  phone: "06-15532711",
  phoneIntl: "+31615532711",
  email: "info@dagmarvoss.nl",
  street: "Grote Houtstraat 144 R-bv",
  city: "Haarlem",
  zip: "2011 SR",
  price: "105,00",
  linkedin: "https://www.linkedin.com/in/dagmarvoss/",
  facebook: "https://www.facebook.com/dagmarvoss.nl",
  whatsapp: "https://wa.me/31615532711?text=" + encodeURIComponent("Hoi Dagmar, ik heb een vraag over KOPP coaching."),
  /* Praktijkadres, geocodeerd bij Mapbox (Grote Houtstraat 144, 2011 SW Haarlem). */
  lng: 4.631378,
  lat: 52.377242,
  mapboxToken: MAPBOX_TOKEN,
};

/* ------------------------------------------------------------------ icons */
const ico = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.3 5.2a5 5 0 0 0-7.1 0l-.2.2-.2-.2a5 5 0 1 0-7.1 7.1l7.3 7.3 7.3-7.3a5 5 0 0 0 0-7.1Z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 20v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.2"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>',
  // official WhatsApp glyph (brand asset outline); viewBox is padded so it sits
  // at the same optical weight as the facebook/linkedin marks next to it
  whatsapp: '<svg viewBox="-2 -2 28 28" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
};

/* ------------------------------------------------------------------- nav */
const NAV = [
  { href: "/wat-is-kopp/", label: "Wat is KOPP" },
  { href: "/klachten/", label: "Klachten" },
  { href: "/coaching/", label: "Coaching" },
  { href: "/cursus/", label: "Cursus" },
  { href: "/over-dagmar/", label: "Over Dagmar" },
  { href: "/boeken/", label: "Boeken" },
];

/* --------------------------------------------------------------- helpers */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const checks = (items) => '<ul class="checks">' + items.map((i) => "<li>" + i + "</li>").join("") + "</ul>";

/* ------------------------------------------------------- de gouden draad
   De draad uit het logo knoopt de secties aan elkaar. Drie vormen zodat
   dezelfde beweging niet twee keer achter elkaar terugkomt. Elke knoop
   tekent zich in zodra hij in beeld schuift (zie het script onderaan). */
const KNOOP = {
  golf: "M0 76C170 76 250 18 400 32c140 13 175 76 290 71 130-6 158-73 270-75 125-2 150 48 240 48",
  lus: "M0 70C200 70 300 26 430 40c90 10 115 56 170 54 72-2 90-74 30-76-45-1-55 52 10 68 80 19 150-56 260-56 130 0 200 40 300 40",
  deining: "M0 58C140 58 230 100 380 92c140-7 180-68 320-64 130 4 160 64 300 58 110-5 140-28 200-28",
};
const knoop = (vorm = "golf", extra = "") =>
  '<div class="draad-knoop ' + extra + '" aria-hidden="true">' +
  '<svg viewBox="0 0 1200 120" preserveAspectRatio="none" focusable="false">' +
  '<path pathLength="1" vector-effect="non-scaling-stroke" d="' + KNOOP[vorm] + '"/></svg></div>';

/* ------------------------------------------------------------------- kaart
   Mapbox in twee trappen. Wat je meteen ziet is een stilstaande kaart: een
   platte afbeelding uit de Static Images API, dus geen javascript, geen WebGL
   en geen kosten tot je hem nodig hebt. Tik je erop, dan wordt mapbox-gl pas
   opgehaald en groeit dezelfde uitsnede uit tot een kaart waarin je kunt
   schuiven en zoomen. Werkt het script niet, dan blijft de plaat staan en gaat
   de routeknop gewoon naar Google Maps. */
const mapStatic = (w, h, scale) =>
  "https://api.mapbox.com/styles/v1/mapbox/light-v11/static/" +
  "pin-l+513747(" + SITE.lng + "," + SITE.lat + ")/" +
  SITE.lng + "," + SITE.lat + ",15.2,0/" + w + "x" + h + (scale === 2 ? "@2x" : "") +
  "?access_token=" + SITE.mapboxToken;

const mapbox = () => `<div class="kaart-om"><div class="kaart" id="kaart" data-lng="${SITE.lng}" data-lat="${SITE.lat}" data-token="${esc(SITE.mapboxToken)}">
  <img class="kaart-plaat" src="${esc(mapStatic(640, 420, 1))}" srcset="${esc(mapStatic(640, 420, 1))} 640w, ${esc(mapStatic(640, 420, 2))} 1280w" sizes="(min-width: 900px) 520px, 100vw" width="640" height="420" loading="lazy" decoding="async" alt="Kaart met de praktijk van Dagmar Voss aan de ${esc(SITE.street)} in ${SITE.city}">
  <button class="kaart-aan" type="button"><span>${ico.pin}Kaart gebruiken</span></button>
  <a class="kaart-route" href="https://www.google.com/maps/dir/?api=1&amp;destination=${encodeURIComponent(SITE.street + ", " + SITE.zip + " " + SITE.city)}" target="_blank" rel="noopener">Route plannen${ico.arrow}</a>
</div></div>`;

const crumbs = (label) =>
  '<nav class="crumbs" aria-label="Kruimelpad"><a href="/">Home</a> <span aria-hidden="true">/</span> ' + esc(label) + "</nav>";

const btnCall = (cls) =>
  '<a class="btn ' + cls + '" href="tel:' + SITE.phoneIntl + '">' + ico.phone + "Bel " + SITE.phone + "</a>";
const btnMail = (cls, label) =>
  '<a class="btn ' + cls + '" href="mailto:' + SITE.email + '">' + ico.mail + (label || "Mail Dagmar") + "</a>";

/* Shared closing CTA band */
const ctaBand = (heading, text) => `
<section class="sec-pruim">
  <div class="wrap prose center">
    <p class="eyebrow">Zet de eerste stap</p>
    <h2>${heading}</h2>
    <p class="lead">${text}</p>
    <div class="btn-row" style="justify-content:center;margin-top:1.75rem">
      <a class="btn btn-primary" href="tel:${SITE.phoneIntl}">${ico.phone}Bel ${SITE.phone}</a>
      <a class="btn btn-wa" href="${SITE.whatsapp}" target="_blank" rel="noopener">${ico.whatsapp}App via WhatsApp</a>
      <a class="btn btn-ghost" href="mailto:${SITE.email}">${ico.mail}Stuur een mail</a>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------------ layout */
function layout(page) {
  const url = SITE.origin + page.slug;
  const title = page.title;
  const desc = page.description;

  const navHtml = NAV.map(
    (n) =>
      '<li><a href="' + n.href + '"' + (n.href === page.slug ? ' aria-current="page"' : "") + ">" + n.label + "</a></li>"
  ).join("");

  const graph = [
    {
      "@type": "ProfessionalService",
      "@id": SITE.origin + "/#praktijk",
      name: "Dagmar Voss - KOPP coaching Haarlem",
      description:
        "Coaching voor volwassenen die opgroeiden met een ouder met psychische problemen of verslaving (KOPP/KOV). Praktijk in Haarlem.",
      url: SITE.origin + "/",
      telephone: SITE.phoneIntl,
      email: SITE.email,
      priceRange: "EUR 105 per uur",
      image: SITE.origin + "/assets/img/image05.jpg",
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.street,
        addressLocality: SITE.city,
        postalCode: SITE.zip,
        addressCountry: "NL",
      },
      geo: { "@type": "GeoCoordinates", latitude: 52.377, longitude: 4.6335 },
      areaServed: [
        { "@type": "City", name: "Haarlem" },
        { "@type": "AdministrativeArea", name: "Zuid-Kennemerland" },
        { "@type": "AdministrativeArea", name: "Noord-Holland" },
      ],
      sameAs: [SITE.linkedin, SITE.facebook],
      founder: { "@id": SITE.origin + "/#dagmar" },
      knowsAbout: ["KOPP", "KOV", "kind van een ouder met psychische problemen", "parentificatie", "trauma", "grenzen stellen"],
    },
    {
      "@type": "Person",
      "@id": SITE.origin + "/#dagmar",
      name: "Dagmar Voss",
      jobTitle: "Maatschappelijk werker en KOPP-coach",
      description:
        "Maatschappelijk werker (afgestudeerd 2010), werkzaam in de GGZ en zelfstandig KOPP-coach in Haarlem. Zelf ervaringsdeskundige.",
      image: SITE.origin + "/assets/img/image04.jpg",
      telephone: SITE.phoneIntl,
      email: SITE.email,
      url: SITE.origin + "/over-dagmar/",
      sameAs: [SITE.linkedin, SITE.facebook],
      worksFor: { "@id": SITE.origin + "/#praktijk" },
    },
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name: title,
      description: desc,
      inLanguage: "nl-NL",
      isPartOf: { "@type": "WebSite", "@id": SITE.origin + "/#website", url: SITE.origin + "/", name: SITE.name },
      about: { "@id": SITE.origin + "/#praktijk" },
    },
  ];
  if (page.slug !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.origin + "/" },
        { "@type": "ListItem", position: 2, name: page.crumb || page.h1, item: url },
      ],
    });
  }
  if (page.extraSchema) graph.push(...page.extraSchema);

  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#FBF5EE">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="author" content="Dagmar Voss">
<meta name="geo.region" content="NL-NH">
<meta name="geo.placename" content="Haarlem">

<meta property="og:type" content="website">
<meta property="og:locale" content="nl_NL">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.origin}/assets/img/${page.ogImage || "image05.jpg"}">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap">
<link rel="stylesheet" href="/style.css">

<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
</head>
<body>
<a class="skip" href="#main">Direct naar de inhoud</a>

<header class="site-header" id="siteHeader">
  <div class="wrap">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="Dagmar Voss - KOPP coaching Haarlem"><img src="/assets/brand/logo-nav.svg" alt="Dagmar Voss" width="730" height="300"></a>
      <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="siteNav">
        <svg class="i-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg class="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        Menu
      </button>
      <nav class="site-nav" id="siteNav" aria-label="Hoofdmenu">
        <ul>
          ${navHtml}
          <li class="nav-cta"><a class="btn btn-primary btn-sm" href="/contact/">Maak een afspraak</a></li>
        </ul>
      </nav>
    </div>
  </div>
</header>
<div class="nav-sluier" aria-hidden="true"></div>

<main id="main">
${page.body}
</main>

<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="footer-brand"><img src="/assets/brand/logo-gestapeld-ondertekst.svg" alt="Dagmar Voss - KOPP coaching Haarlem" width="800" height="440"></div>
        <p>Coaching en cursussen voor volwassenen die opgroeiden met een ouder met psychische problemen of verslaving. Praktijk in het centrum van Haarlem.</p>
        <div class="socials">
          <a href="${SITE.whatsapp}" rel="noopener" target="_blank" aria-label="Stuur Dagmar een WhatsApp-bericht">${ico.whatsapp}</a>
          <a href="${SITE.linkedin}" rel="noopener me" target="_blank" aria-label="LinkedIn van Dagmar Voss">${ico.linkedin}</a>
          <a href="${SITE.facebook}" rel="noopener me" target="_blank" aria-label="Facebook van Dagmar Voss">${ico.facebook}</a>
        </div>
      </div>
      <div>
        <h4>Onderwerpen</h4>
        <ul>${NAV.map((n) => '<li><a href="' + n.href + '">' + n.label + "</a></li>").join("")}</ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:${SITE.phoneIntl}">${SITE.phone}</a></li>
          <li><a href="${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li>${SITE.street}<br>${SITE.zip} ${SITE.city}</li>
          <li><a href="/contact/">Afspraak maken</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} Dagmar Voss. Alle rechten voorbehouden.</span>
      <span>Coaching, geen crisishulp. Bij acute nood: bel 112 of 113 (zelfmoordpreventie).</span>
    </div>
  </div>
</footer>

<a class="wa-float" href="${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="Stuur Dagmar een WhatsApp-bericht">${ico.whatsapp}<span>WhatsApp</span></a>

<div class="mobile-cta">
  <a class="btn btn-wa" href="${SITE.whatsapp}" target="_blank" rel="noopener">${ico.whatsapp}WhatsApp</a>
  <a class="btn btn-primary" href="tel:${SITE.phoneIntl}">${ico.phone}Bellen</a>
  <a class="btn btn-ghost" style="background:var(--wit)" href="mailto:${SITE.email}">${ico.mail}Mailen</a>
</div>

<script>
(function () {
  var t = document.getElementById('navToggle'), n = document.getElementById('siteNav'), h = document.getElementById('siteHeader');
  var sluier = document.querySelector('.nav-sluier');
  var balk = document.querySelector('.mobile-cta');
  var stil = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- het menu ----
     Het paneel valt onder de balk over de pagina. Dicht met Escape, met een tik
     naast het paneel, en zodra je een link kiest. */
  var zetMenu = function (open) {
    t.setAttribute('aria-expanded', String(open));
    n.classList.toggle('is-open', open);
    if (sluier) sluier.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-vast', open);
  };
  t.addEventListener('click', function () { zetMenu(t.getAttribute('aria-expanded') !== 'true'); });
  if (sluier) sluier.addEventListener('click', function () { zetMenu(false); });
  n.addEventListener('click', function (e) { if (e.target.closest('a')) zetMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && t.getAttribute('aria-expanded') === 'true') { zetMenu(false); t.focus(); }
  });
  window.addEventListener('resize', function () { if (innerWidth >= 900) zetMenu(false); });

  /* ---- de balk onderaan ----
     Pas in beeld zodra je onder de hero bent; daarboven staan de knoppen uit de
     hero zelf nog. De hoogte wordt een keer gemeten, niet elke scrollstap. */
  var eerste = document.querySelector('main > section');
  var drempel = 240;
  var meten = function () { if (eerste) drempel = Math.max(200, eerste.offsetHeight * 0.72); };
  meten();
  window.addEventListener('resize', meten);

  var onScroll = function () {
    var y = window.pageYOffset;
    h.classList.toggle('is-stuck', y > 8);
    if (balk) balk.classList.toggle('is-zichtbaar', y > drempel);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* De verticale draden in de zijmarges stonden hier: twee vaste strengen die
     met de scroll meeliepen (parallax + rek). Eruit op verzoek - ze leidden af.
     Daarmee is ook de enige scroll-rekenaar weg die per frame stijl aanpaste. */

  /* De knopen tussen de secties tekenen zich in zodra ze in beeld komen. */
  var knopen = document.querySelectorAll('.draad-knoop');
  if ('IntersectionObserver' in window && !stil.matches) {
    var io = new IntersectionObserver(function (rijen) {
      rijen.forEach(function (r) {
        if (r.isIntersecting) { r.target.classList.add('is-zichtbaar'); io.unobserve(r.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    Array.prototype.forEach.call(knopen, function (k) { io.observe(k); });
  } else {
    Array.prototype.forEach.call(knopen, function (k) { k.classList.add('is-zichtbaar'); });
  }

  /* ---- de kaart ----
     De plaat staat er al; mapbox-gl komt pas binnen als je hem vraagt. */
  var kaart = document.getElementById('kaart');
  if (kaart) {
    var aanzet = kaart.querySelector('.kaart-aan');
    var bezig = false;
    var laad = function (url, tag, attr) {
      return new Promise(function (ok, fout) {
        var el = document.createElement(tag);
        el.onload = ok; el.onerror = fout;
        if (tag === 'link') { el.rel = 'stylesheet'; el.href = url; } else { el.src = url; }
        document.head.appendChild(el);
      });
    };
    aanzet.addEventListener('click', function () {
      if (bezig) return;
      bezig = true;
      aanzet.querySelector('span').textContent = 'Kaart laden...';
      var v = 'https://api.mapbox.com/mapbox-gl-js/v3.9.0/mapbox-gl';
      Promise.all([laad(v + '.css', 'link'), laad(v + '.js', 'script')]).then(function () {
        var doek = document.createElement('div');
        doek.className = 'kaart-doek';
        kaart.insertBefore(doek, kaart.firstChild);
        kaart.classList.add('is-aan');
        window.mapboxgl.accessToken = kaart.dataset.token;
        var lngLat = [parseFloat(kaart.dataset.lng), parseFloat(kaart.dataset.lat)];
        var m = new window.mapboxgl.Map({
          container: doek, style: 'mapbox://styles/mapbox/light-v11',
          center: lngLat, zoom: 15.2, cooperativeGestures: true
        });
        m.addControl(new window.mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
        new window.mapboxgl.Marker({ color: '#513747' }).setLngLat(lngLat).addTo(m);
        m.on('load', function () { window.__kaartGeladen = true; });
      }).catch(function () {
        /* Geen net of Mapbox plat: de plaat blijft staan, de routeknop werkt. */
        bezig = false;
        aanzet.querySelector('span').textContent = 'Kaart niet beschikbaar';
      });
    });
  }
})();
</script>
</body>
</html>`;
}

/* ------------------------------------------------------------------- pages */
const KLACHTEN = [
  "Niet weten hoe je de relatie met je ouder moet aangaan",
  "Moeite met grenzen stellen",
  "Niet weten waar je eigen grenzen liggen",
  "Een hoog verantwoordelijkheidsgevoel",
  "Jezelf wegcijferen ten gunste van de ander",
  "Onzekerheid",
  "Moeite om anderen te vertrouwen",
  "Perfectionisme",
  "Een laag zelfbeeld",
  "Impostersyndroom",
  "Verlatingsangst",
  "Bindingsangst",
  "Chronische stress",
  "Terugkerende burn-out",
  "Pleasend gedrag uit angst voor afwijzing",
  "Moeite om emoties te uiten",
  "Chronisch gevoel van eenzaamheid en leegte",
  "Somberheid",
  "Angst",
  "Slaapproblemen",
];

const FAQ = [
  {
    q: "Wat betekent KOPP precies?",
    a: "KOPP staat voor Kind van een Ouder met Psychische Problemen. KOV staat voor Kind van een Ouder met Verslaving. Op deze website gebruik ik de term KOPP voor beide, en spreek ik ook wel over Kind van.",
  },
  {
    q: "Heb ik een verwijzing van de huisarts nodig?",
    a: "Nee. Voor individuele coaching in mijn praktijk in Haarlem is geen verwijzing nodig, en er is geen wachtlijst zoals in de reguliere GGZ. Ook voor de gratis groepscursussen in Zuid-Kennemerland heb je geen verwijzing nodig.",
  },
  {
    q: "Wat kost een coachingsgesprek?",
    a: "Een gesprek van een uur kost EUR 105,00. Voor mensen met een lagere financiele draagkracht, of wanneer je een langer traject doorloopt, pas ik mijn tarief aan. Bespreek dat gerust in het kennismakingsgesprek.",
  },
  {
    q: "Mijn ouder had nooit een diagnose. Ben ik dan wel KOPP?",
    a: "Ja. Bij veel mensen was er nooit een officiele diagnose. Vaak voelde je vooral dat er iets niet klopte in huis. Het gaat niet om het etiket van je ouder, maar om wat de situatie met jou heeft gedaan.",
  },
  {
    q: "Is dit therapie of coaching?",
    a: "Coaching. Ik combineer psycho-educatie met praktische oefeningen en persoonlijke begeleiding. Je krijgt niet alleen inzicht, maar leert ook vaardigheden die je vroeger niet hebt meegekregen. Bij zware psychiatrische problematiek of crisis verwijs ik door.",
  },
  {
    q: "Waar vinden de gesprekken plaats?",
    a: "In mijn praktijk aan de Grote Houtstraat 144 R-bv in het centrum van Haarlem, op loopafstand van station Haarlem en goed bereikbaar vanuit Heemstede, Bloemendaal, Velsen, Zandvoort en de rest van Zuid-Kennemerland.",
  },
];

const BOOKS = [
  ["Niemandskinderen", "Carolien Roodvoets", "In dit indringende boek beschrijft Carolien Roodvoets de gevolgen van een onveilige jeugd en de verwerking ervan. Het boek prikt de fabel door dat ouders per definitie hun kinderen liefhebben. Niet (kunnen) houden van je kind is een onderwerp waar nauwelijks over gesproken wordt - niet door de ouder, maar ook niet door het verwaarloosde kind zelf, dat de illusie van liefde nodig heeft om te kunnen overleven."],
  ["Het onverwoestbare kind", "Lillian B. Rubin", "Hoe komt het dat sommige mensen het meest wrede, pijnlijke verleden te boven weten te komen, terwijl anderen er hun hele leven door beheerst worden? Rubin geeft antwoord aan de hand van de levensverhalen van volwassenen die als kind gebukt gingen onder ernstige vormen van fysiek en geestelijk geweld, maar desondanks de weg wisten te vinden naar een bevredigend leven."],
  ["Leven met een psychisch zieke ouder", "Sandra van Gameren", "Gezondheidspsycholoog Sandra van Gameren laat zien hoe je kinderen van ouders met psychiatrische problemen - ook wel koppers genoemd - kunt helpen hun veerkracht te behouden."],
  ["Opgroeien onder moeilijke gezinsomstandigheden", "", "Deze studie gaat over kinderen die zich bewust zijn van de moeilijkheden in hun gezinssituatie en daaraan lijden, maar die zich toch weten te handhaven en te redden omdat zij qua persoonlijkheid minder kwetsbaar zijn. Welke factoren daarin een rol spelen is het object van studie."],
  ["Moederkruid", "Carry Slee", "Twee zusjes moeten met hun ouders verhuizen als de kleermakerij van hun vader failliet gaat. Volgens hun moeder wonen ze in de nieuwe buurt ver beneden hun stand, en de meisjes mogen zich daarom met niemand bemoeien. De relatie tussen de ouders verslechtert verder, tot de ruzies en het isolement de beide zusjes bijna te veel worden."],
  ["Dochter van Eva", "Carry Slee", "De aangrijpende opvolger van Moederkruid. Het meisje dat de wereld om zich heen maar moeilijk te begrijpen vond, is ouder geworden. Thuis is de toestand niet veel verbeterd, en als haar zus het huis uit gaat, besluit ze het heft in eigen hand te nemen."],
  ["Blijf van m'n ouders af!", "", "Tegenstrijdige gevoelens - herken je ze? Vooral geschreven voor jongeren van wie de vader of moeder psychische problemen heeft, maar als er bij jou thuis iets anders speelt wat je moeilijk vindt, zul je je er ook in herkennen. Een heel praktisch boek met informatie, oefeningen, tips en vooral veel begrip."],
  ["Te vroeg volwassen", "", "Met parentificatie wordt bedoeld dat het kind op oneigenlijke wijze verantwoordelijk wordt gemaakt voor het welbevinden van de ouders. Als zodanig is het vaak een belangrijke risicofactor voor het ontstaan van allerlei psychopathologie. Parentificatie heeft impact op de gehechtheid en bepaalt de verhouding tot anderen."],
  ["Tegenlicht", "Esther Verhoef", "Vera Zagt heeft het niet gemakkelijk gehad als kind. Haar moeder zat vaker in een psychiatrische inrichting dan dat ze thuis was, haar autoritaire vader behandelde haar alsof ze een van zijn rekruten was, en gepest worden op school was ook eerder regel dan uitzondering."],
  ["Altijd de sterkste thuis", "Caroline van Dullemen", "Socioloog en dochter van een moeder met MS sprak met volwassenen over hun jeugd met een zieke ouder. Verhalen over verdriet, eenzaamheid, schuld en schaamte. Over blijven of weggaan, kiezen voor je ouders of voor jezelf. Maar ook over relativeren en incasseren, en over zelfstandig en weerbaar worden."],
  ["Het drama van het begaafde kind", "Alice Miller", "Onlangs gelezen en ik was verrast over de duidelijke wijze waarop Miller beschrijft hoe wij onze schade kunnen herstellen. Het gaf mij nieuwe inzichten in wat van belang is als je in je volwassen leven worstelt met pijnlijke emoties. Het belang van jezelf opbouwen door rouwverwerking en jezelf waarde leren toekennen."],
  ["Rusteloze benen", "Claudia Biegel", "Deze roman heb ik nog niet gelezen, maar ik was bij de boekpresentatie. Een hedendaags familiedrama tegen de achtergrond van een traumatische KOPP-jeugd. Opgegroeid met een moeder met psychiatrische problematiek is de hoofdpersoon al van jongs af aan speelbal van onmacht en onvoorspelbaarheid."],
  ["Je kunt je leven helen", "Louise Hay", "Een ietwat zweverige titel waar ik persoonlijk niet snel iets mee heb. Maar van andere KOPP-ervaringsdeskundigen heb ik goede verhalen gehoord over dit boek. De schrijfster legt uit dat emotionele pijn het gevolg is van innerlijke overtuigingen, en helpt de lezer dit met affirmaties te transformeren naar erkenning, vergeving en liefde voor jezelf."],
  ["Risicokind of evenwichtskunstenaar?", "Elize Lam", "Opgroeien met een psychiatrisch zieke, verslaafde of verstandelijk beperkte ouder is voor kinderen vaak balanceren. Hun ouders worden soms zo opgeslokt door problemen dat het ze aan ruimte en aandacht ontbreekt. De persoonlijke verhalen laten zien dat kind kunnen zijn in zo'n context niet meevalt."],
  ["Traumasporen", "Bessel van der Kolk", "Dit diepmenselijke boek geeft verhelderend inzicht in de oorzaken en gevolgen van trauma, en biedt hoop voor iedereen die de verwoestende effecten van traumatische ervaringen heeft leren kennen. Op basis van ruim dertig jaar onderzoek toont Van der Kolk hoe de angst en het isolement in de kern van trauma letterlijk veranderingen aanbrengen in hersenen en lichaam."],
  ["Patronen doorbreken", "", "Dit boek baseert zich op de schematherapie. Schematherapie leert je om de oorsprong van je gedragspatronen te doorgronden, hun invloed op je alledaagse leven te onderzoeken, en jezelf zodanig te veranderen dat je je beter gaat voelen en beter voor jezelf kunt zorgen en opkomen."],
  ["Leven in je leven", "Jeffrey Young", "Nog een breed toegankelijk boek over schematherapie, geschreven door Young zelf. Het boek leert mensen hun negatieve gedachtepatronen - door de auteurs valkuilen genoemd - te herkennen. Helder beschrijven zij elf van de meest voorkomende valkuilen, waaronder problematische relaties, gebrek aan zelfvertrouwen, faalangst en eenzaamheid."],
  ["Het miskende kind in onszelf", "", "Vooral een boek over de ervaringen in onze vroegste kindertijd en hoe die van doorslaggevende invloed zijn op ons latere leven. Reeds vanaf ons prenatale bestaan kunnen we verwond en gekrenkt raken door miskenning van onze natuurlijke behoeften. Die miskenning komt het duidelijkst naar voren in de verstoring van ons gevoelsleven."],
  ["Wanneer je lichaam nee zegt", "Gabor Mate", "Gabor Mate houdt ons een confronterende spiegel voor, waardoor we gaan inzien dat verborgen stress desastreuze gevolgen voor onze gezondheid kan hebben. Wanneer we geen nee durven zeggen tegen onze door stress geregeerde manier van leven, zal ons lichaam dat uiteindelijk voor ons doen."],
  ["Leven op een zeepbel", "", "Hoe is het om op te groeien met een psychisch zieke ouder? Een thuis te hebben zonder geborgen te zijn? Een ouderrol op je te nemen terwijl je nog kind bent? Voor veel kinderen begint het geworstel met de gevolgen pas op latere leeftijd."],
  ["In de beste families", "", "Iedereen die een partner, broer of kind heeft met een psychische stoornis weet hoe zwaar dat kan zijn. Dit boek geeft een stem aan deze grote, groeiende groep mensen - in Nederland meer dan een miljoen. Niet de ziekte of de zieke staat centraal, maar de gevolgen voor de omgeving."],
  ["Borderline de baas", "Koos Krook", "Een gids voor naastbetrokkenen van iemand met een borderline persoonlijkheidsstoornis, tegenwoordig emotieregulatiestoornis genoemd."],
  ["De fontein, vind je plek", "Els van Steijn", "Els van Steijn is coach, familie- en organisatieopsteller en schrijver van deze bestseller. Via haar coachingspraktijk, workshops en social media draagt ze haar missie uit: volgende generaties systemisch schoner en minder belast laten zijn."],
  ["Loskomen van emotioneel onvolwassen mensen", "Lindsay Gibson", "Als je het gevoel hebt dat je het nooit goed kunt doen. Als je het gevoel hebt dat je niet bestaat wanneer je bij je ouder bent. Als je je ouder eigenlijk niet durft te vertellen hoe je je voelt. Als je bent opgegroeid met emotioneel onvolwassen ouders heb je vaak ontzettend hard gewerkt om er het beste van te maken en je ouder zoveel mogelijk ter wille te zijn."],
];

const faqSchema = {
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const faqHtml = (items) =>
  '<div class="acc">' +
  items
    .map(
      (f) =>
        "<details><summary>" + esc(f.q) + '</summary><div class="acc-body"><p>' + esc(f.a) + "</p></div></details>"
    )
    .join("") +
  "</div>";

/* ================================================================== HOME */
const home = {
  slug: "/",
  title: "KOPP coaching Haarlem | Dagmar Voss - opgegroeid met een psychisch zieke ouder",
  description:
    "Opgegroeid met een ouder met psychische problemen of verslaving? Dagmar Voss biedt KOPP coaching in Haarlem plus gratis cursussen in Zuid-Kennemerland. Geen verwijzing nodig.",
  h1: "Van KOPP naar kracht",
  ogImage: "image05.jpg",
  extraSchema: [faqSchema],
  body: `
<section class="hero">
  <div class="wrap">
    <!-- De vier bewijsjes staan als eigen kind van het raster, niet in de
         tekstkolom. Daardoor kan de volgorde per scherm verschillen: op een
         telefoon komen ze na de foto, op een breed scherm blijven ze onder de
         knoppen in de linkerkolom staan. Zie .hero-grid--troef in de css. -->
    <div class="hero-grid hero-grid--troef">
      <div class="hero-tekst">
        <p class="eyebrow">KOPP coaching in Haarlem</p>
        <h1>Je jeugd bepaalt je verleden. <em>Niet je toekomst.</em></h1>
        <p class="lead">Ben je opgegroeid met een ouder met psychische problemen of een verslaving? Dan kun je daar als volwassene nog steeds last van hebben, zonder precies te weten waar het vandaan komt. Ik help je die ervaringen om te zetten in eigen kracht.</p>
        <div class="btn-row" style="margin-top:1.6rem">
          <a class="btn btn-primary" href="/contact/">Plan een kennismaking${ico.arrow}</a>
          <a class="btn btn-ghost" href="/klachten/">Herken je dit?</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="/assets/img/image05.jpg" alt="De praktijkruimte van Dagmar Voss aan de Grote Houtstraat in Haarlem" width="1536" height="1024" fetchpriority="high">
        <div class="hero-badge">${ico.pin}Grote Houtstraat, Haarlem</div>
      </div>
      <ul class="trust">
        <li>${ico.check}Geen verwijzing nodig</li>
        <li>${ico.check}Geen wachtlijst</li>
        <li>${ico.check}Praktijk in centrum Haarlem</li>
        <li>${ico.check}Zelf ervaringsdeskundige</li>
      </ul>
    </div>
  </div>
</section>

${knoop("golf")}

<section class="sec-white">
  <div class="wrap">
    <div class="prose tight">
      <p class="eyebrow">Voor wie is dit</p>
      <h2>Misschien voelde je vooral dat er iets niet klopte</h2>
      <p class="lead">KOPP staat voor Kind van een Ouder met Psychische Problemen. KOV staat voor Kind van een Ouder met Verslaving. Op deze site gebruik ik KOPP voor beide.</p>
      <p>De late gevolgen van opgroeien met een ouder met psychische of verslavingsproblematiek zijn nog steeds een ongrijpbare, weinig begrepen en vaak niet herkende problematiek. Niet altijd was duidelijk dat er sprake was van een psychische stoornis. Veel volwassenen realiseren zich pas jaren later dat hun jeugd onder invloed stond van de problemen van hun ouder.</p>
      <p>Deze website is er voor volwassenen die worstelen met de gevolgen daarvan. Je vindt hier informatie, tips over herstel en de verschillende mogelijkheden om hulp te krijgen. Wil je snel en laagdrempelig hulp? Dan ben je welkom voor individuele coaching in mijn praktijk in Haarlem.</p>
      <p><a href="/wat-is-kopp/"><strong>Lees meer over wat KOPP is</strong></a></p>
    </div>
  </div>
</section>

<section class="sec-pruim">
  <div class="wrap">
    <div class="prose tight">
      <p class="eyebrow">Herken je dit?</p>
      <h2>De overlevingsstrategieen van toen werken nu tegen je</h2>
      <p class="lead">Je blijft doorgaan, zorgen en aanpassen - zelfs wanneer dat niet meer nodig is. Veelvoorkomende klachten bij volwassen KOPP:</p>
    </div>
    ${checks(KLACHTEN.slice(0, 12))}
    <div class="btn-row" style="margin-top:2rem">
      <a class="btn btn-ghost" href="/klachten/">Bekijk alle klachten${ico.arrow}</a>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="prose tight">
      <p class="eyebrow">Wat ik aanbied</p>
      <h2>Twee manieren om verder te komen</h2>
    </div>
    <div class="grid grid-2">
      <a class="card card-link" href="/coaching/">
        <div class="card-icon">${ico.heart}</div>
        <h3>Individuele coaching</h3>
        <p>Een op een in mijn praktijk in Haarlem. We begrijpen en verwerken je jeugdervaringen, je wordt bewuster van je valkuilen en je leert vaardigheden die je vroeger niet hebt meegekregen. EUR ${SITE.price} per uur, tarief aanpasbaar bij lagere draagkracht.</p>
        <span class="card-more">Lees over coaching${ico.arrow}</span>
      </a>
      <a class="card card-link" href="/cursus/">
        <div class="card-icon">${ico.users}</div>
        <h3>Gratis groepscursussen</h3>
        <p>Acht wekelijkse bijeenkomsten van twee uur met 8 tot 10 deelnemers, samen met Prezens / GGZ inGeest. Voor inwoners van Zuid-Kennemerland. Gratis en zonder verwijzing van je huisarts.</p>
        <span class="card-more">Bekijk de cursussen${ico.arrow}</span>
      </a>
    </div>
  </div>
</section>

${knoop("deining")}

<section class="sec-room">
  <div class="wrap">
    <div class="hero-grid">
      <div class="figure figure-portrait" style="max-width:420px">
        <img src="/assets/img/image04.jpg" alt="Dagmar Voss, KOPP-coach en maatschappelijk werker in Haarlem" width="1000" height="1503" loading="lazy">
      </div>
      <div>
        <p class="eyebrow">Over Dagmar</p>
        <h2>Vakvrouw en ervaringsdeskundige</h2>
        <p class="lead">Ik ben Dagmar Voss, 50 jaar, wonend en werkend in Haarlem. In 2010 studeerde ik af als maatschappelijk werker en ging ik aan de slag als hulpverlener bij de GGZ.</p>
        <p>Als studente kwam ik er tijdens een college achter dat ik zelf een KOPP-vrouw ben. Er werd uitgelegd wat de gevolgen op latere leeftijd zijn wanneer je bent opgevoed door een ouder die emotioneel erg instabiel, depressief of angstig is. Waarom had ik hier niet eerder over gehoord? Zo herkenbaar allemaal.</p>
        <p>Met mijn vakvrouwpet op, maar niet in de laatste plaats als ervaringsdeskundige, geef ik lezingen over KOPP aan zorgprofessionals en begeleid ik KOPP-vrouwen naar een prettiger, stabieler en zelfverzekerder bestaan.</p>
        <div class="btn-row" style="margin-top:1.4rem"><a class="btn btn-ghost" href="/over-dagmar/">Lees mijn verhaal${ico.arrow}</a></div>
      </div>
    </div>
  </div>
</section>

<section class="sec-white quote-wrap">
  <div class="wrap prose center">
    <blockquote class="quote">&ldquo;Dat je dit nu als een last ervaart, is geen zwakte. Het is een logisch gevolg van wat je hebt meegemaakt.&rdquo;<cite class="quote-cite">Dagmar Voss</cite></blockquote>
  </div>
</section>

${knoop("lus")}

<section>
  <div class="wrap">
    <div class="prose tight">
      <p class="eyebrow">Veelgestelde vragen</p>
      <h2>Goed om te weten</h2>
    </div>
    <div class="prose">${faqHtml(FAQ)}</div>
  </div>
</section>

${ctaBand("Je staat er niet alleen voor", "Bel of mail voor een vrijblijvende kennismaking. Geen verwijzing nodig, geen wachtlijst.")}
`,
};

/* ============================================================ WAT IS KOPP */
const watIsKopp = {
  slug: "/wat-is-kopp/",
  crumb: "Wat is KOPP",
  title: "Wat is KOPP? Opgroeien met een psychisch zieke ouder | Dagmar Voss",
  description:
    "KOPP betekent Kind van een Ouder met Psychische Problemen, KOV Kind van een Ouder met Verslaving. Lees wat opgroeien met een psychisch zieke ouder met je doet - ook nu nog.",
  h1: "Wat is KOPP?",
  ogImage: "image03.jpg",
  body: `
<section class="page-head">
  <div class="wrap prose">
    ${crumbs("Wat is KOPP")}
    <p class="eyebrow">Uitleg</p>
    <h1>Wat is KOPP?</h1>
    <p class="lead">KOPP staat voor Kind van een Ouder met Psychische Problemen. KOV staat voor Kind van een Ouder met Verslaving. Op deze website gebruik ik de term KOPP voor beide, en spreek ik ook wel over Kind van.</p>
  </div>
</section>

<section class="sec-tight">
  <div class="wrap">
    <div class="figure"><img src="/assets/img/image03.jpg" alt="Zonnige woonkamer met een kindertekening en kleurpotloden op tafel" width="1376" height="768" loading="lazy" style="aspect-ratio:16/9"></div>
  </div>
</section>

<section class="sec-tight">
  <div class="wrap prose stack">
    <p>Wanneer je opgroeit in een gezin waarin een ouder psychische klachten of een verslaving heeft gehad, heeft dat vaak meer invloed dan je als kind kunt overzien. De situatie thuis kan onvoorspelbaar, verwarrend of emotioneel zwaar zijn geweest - soms zichtbaar, maar vaak ook verborgen.</p>
    <p>Niet altijd was duidelijk dat er sprake was van een psychische stoornis. Misschien voelde je vooral dat er &ldquo;iets niet klopte&rdquo; in huis. Veel volwassenen realiseren zich pas later dat hun jeugd onder invloed stond van psychische problematiek bij een ouder.</p>
    <h2>De impact van opgroeien met een psychisch zieke ouder</h2>
    <p>Als kind leer je je aanpassen aan de situatie. Je wordt alert, verantwoordelijk of probeert conflicten te vermijden. Dat kan je ver brengen, maar het kan ook sporen achterlaten in je volwassen leven die je hinderen en als een last voelen.</p>
    <p>De late gevolgen van opgegroeid zijn met een ouder met psychische en/of verslavingsproblematiek zijn nog steeds een ongrijpbare, weinig begrepen en vaak niet herkende problematiek. Juist daarom is het zo waardevol om er woorden aan te geven.</p>
  </div>
</section>

${knoop("lus")}

<section class="sec-room">
  <div class="wrap">
    <div class="prose tight">
      <h2>Hoe weet ik of dit over mij gaat?</h2>
      <p>Er is geen officiele test en je ouder hoeft nooit een diagnose te hebben gehad. Deze signalen komen veel voor bij volwassen KOPP:</p>
    </div>
    ${checks([
      "Je herkent patronen in jezelf die je niet kunt plaatsen",
      "Je voelde je als kind vooral verantwoordelijk voor de sfeer thuis",
      "Er werd thuis niet of nauwelijks over gepraat",
      "Je merkt dat je jezelf niet goed begrijpt",
      "Je ervaart ingewikkeldheid in je relaties",
      "Je vindt het lastig om rust of richting te vinden",
    ])}
    <div class="btn-row" style="margin-top:2rem">
      <a class="btn btn-primary" href="/klachten/">Bekijk de klachtenlijst${ico.arrow}</a>
      <a class="btn btn-ghost" href="/coaching/">Wat coaching doet</a>
    </div>
  </div>
</section>

<section>
  <div class="wrap prose">
    <h2>Veelgestelde vragen over KOPP</h2>
    ${faqHtml(FAQ.slice(0, 4))}
  </div>
</section>

${ctaBand("Herkenning is de eerste stap", "Twijfel je of coaching iets voor je is? Bel gerust, dan denken we samen mee.")}
`,
};

/* =============================================================== KLACHTEN */
const klachten = {
  slug: "/klachten/",
  crumb: "Klachten",
  title: "Klachten bij volwassen KOPP | Grenzen, perfectionisme, burn-out",
  description:
    "Moeite met grenzen stellen, perfectionisme, laag zelfbeeld, verlatingsangst of terugkerende burn-out? Veelvoorkomende klachten bij volwassenen die opgroeiden met een psychisch zieke ouder.",
  h1: "Klachten bij volwassen KOPP",
  ogImage: "image01.jpg",
  body: `
<section class="page-head">
  <div class="wrap prose">
    ${crumbs("Klachten")}
    <p class="eyebrow">Herken je dit?</p>
    <h1>Klachten bij volwassen KOPP</h1>
    <p class="lead">De overlevingsstrategieen die je als kind hebt ontwikkeld, helpen niet altijd meer in je huidige leven. Je blijft doorgaan, zorgen en aanpassen - zelfs wanneer dat niet meer nodig is.</p>
  </div>
</section>

<section class="sec-tight">
  <div class="wrap">
    ${checks(KLACHTEN)}
  </div>
</section>

${knoop("golf")}

<section class="sec-room">
  <div class="wrap prose stack">
    <h2>En verder merken veel volwassen KOPP dat zij</h2>
    <ul class="checks" style="grid-template-columns:1fr">
      <li>zichzelf niet goed begrijpen</li>
      <li>ingewikkeldheid ervaren in hun relaties</li>
      <li>het lastig vinden om rust of richting te vinden</li>
    </ul>
    <p>Soms zitten ooit helpende overlevingspatronen je nu in de weg. Je hebt er last van omdat ze je niet meer dienen in je huidige leven.</p>
    <p><strong>Dat je dit nu als een last ervaart, is geen zwakte.</strong> Het is een logisch gevolg van wat je hebt meegemaakt en van je ontwikkeling als mens.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="prose tight">
      <h2>Wat je hieraan kunt doen</h2>
      <p>Patronen die je als kind hebt geleerd, kun je als volwassene ook weer bijstellen. Dat gaat zelden vanzelf, maar het gaat wel.</p>
    </div>
    <div class="grid grid-2">
      <a class="card card-link" href="/coaching/">
        <div class="card-icon">${ico.heart}</div>
        <h3>Individuele coaching</h3>
        <p>Een op een werken aan inzicht en vaardigheden, in mijn praktijk in Haarlem.</p>
        <span class="card-more">Meer over coaching${ico.arrow}</span>
      </a>
      <a class="card card-link" href="/cursus/">
        <div class="card-icon">${ico.users}</div>
        <h3>Gratis KOPP-cursus</h3>
        <p>Acht bijeenkomsten in een groep van lotgenoten uit Zuid-Kennemerland.</p>
        <span class="card-more">Bekijk de cursus${ico.arrow}</span>
      </a>
    </div>
    <div class="crisis" style="margin-top:2rem">
      <strong>Let op:</strong> coaching is geen crisishulp. Heb je acuut hulp nodig of denk je aan zelfdoding? Bel 113 of 0800-0113 (Zelfmoordpreventie, gratis en 24/7), of neem contact op met je huisarts.
    </div>
  </div>
</section>

${ctaBand("Klinkt dit bekend?", "Een kort telefoongesprek geeft vaak al richting. Bel of mail vrijblijvend.")}
`,
};

/* =============================================================== COACHING */
const coachingSchema = {
  "@type": "Service",
  "@id": SITE.origin + "/coaching/#service",
  name: "Individuele KOPP coaching",
  serviceType: "Coaching voor volwassen kinderen van ouders met psychische problemen",
  provider: { "@id": SITE.origin + "/#praktijk" },
  areaServed: { "@type": "City", name: "Haarlem" },
  url: SITE.origin + "/coaching/",
  offers: {
    "@type": "Offer",
    price: "105.00",
    priceCurrency: "EUR",
    description: "Coachingsgesprek van een uur. Tarief wordt aangepast bij lagere financiele draagkracht.",
    availability: "https://schema.org/InStock",
  },
};

const coaching = {
  slug: "/coaching/",
  crumb: "Coaching",
  title: "KOPP coaching Haarlem | Individuele coaching bij Dagmar Voss",
  description:
    "Individuele coaching voor volwassenen die opgroeiden met een psychisch zieke of verslaafde ouder. Praktijk aan de Grote Houtstraat in Haarlem. EUR 105 per uur, geen verwijzing nodig.",
  h1: "Individuele coaching",
  ogImage: "image02.jpg",
  extraSchema: [coachingSchema],
  body: `
<section class="page-head">
  <div class="wrap prose">
    ${crumbs("Coaching")}
    <p class="eyebrow">Een op een, in Haarlem</p>
    <h1>Coaching voor volwassenen opgegroeid met een psychisch zieke ouder</h1>
    <p class="lead">Opgroeien met een ouder met psychische of verslavingsproblemen kan diepe invloed hebben op je leven, je emoties en je relaties - zelfs jaren later.</p>
  </div>
</section>

<section class="sec-tight">
  <div class="wrap">
    <div class="figure figure-om"><img src="/assets/img/image02.jpg" alt="Vrouw staat rustig bij het raam in een lichte woonkamer" width="1264" height="848" loading="lazy"></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="prose tight">
      <h2>Ik leer je ervaringen omzetten in eigen kracht</h2>
      <p class="lead">Zodat je meer vrijheid ervaart en toekomt aan <strong>leven</strong> in plaats van <strong>overleven</strong>.</p>
      <p>Mijn coaching helpt je om:</p>
    </div>
    ${checks([
      "jouw jeugdervaringen te begrijpen en te verwerken",
      "bewuster te worden van je valkuilen",
      "vaardigheden te leren die je vroeger niet hebt meegekregen",
      "meer grip te krijgen op je leven en emoties",
      "je innerlijke veerkracht te vinden en te gebruiken",
    ])}
    <div class="prose" style="margin-top:1.75rem">
      <p>Ik combineer psycho-educatie met praktische oefeningen en persoonlijke begeleiding, zodat je niet alleen inzicht krijgt, maar ook echte verandering ervaart.</p>
    </div>
  </div>
</section>

${knoop("deining")}

<section class="sec-room">
  <div class="wrap">
    <div class="hero-grid">
      <div class="price-card">
        <p class="eyebrow">Tarief</p>
        <div class="price-tag">EUR ${SITE.price}<small>per coachingsgesprek van een uur</small></div>
        <p class="price-note">Voor mensen met een lagere financiele draagkracht, of wanneer je een langer coachingstraject doorloopt, pas ik mijn tarief aan. Bespreek dat gerust bij de kennismaking.</p>
        <hr class="rule" style="margin-block:1.5rem">
        <ul class="contact-list">
          <li><a href="tel:${SITE.phoneIntl}"><span class="contact-ico">${ico.phone}</span><span>${SITE.phone}<small>Bellen</small></span></a></li>
          <li><a href="${SITE.whatsapp}" target="_blank" rel="noopener"><span class="contact-ico is-wa">${ico.whatsapp}</span><span>WhatsApp<small>Liever eerst even appen? Mag ook</small></span></a></li>
          <li><a href="mailto:${SITE.email}"><span class="contact-ico">${ico.mail}</span><span>${SITE.email}<small>Reactie binnen enkele werkdagen</small></span></a></li>
          <li><span class="row"><span class="contact-ico">${ico.pin}</span><span>${SITE.street}<small>${SITE.zip} ${SITE.city}</small></span></span></li>
        </ul>
      </div>
      <div>
        <p class="eyebrow">Praktisch</p>
        <h2>Je staat er niet alleen voor</h2>
        <p>Er is steeds meer aandacht voor de impact van opgroeien met een psychisch zieke of verslaafde ouder. Coaching, cursussen en lotgenotencontact helpen om ervaringen te begrijpen en nieuwe stappen te zetten.</p>
        <ul class="trust" style="margin-top:1.25rem">
          <li>${ico.check}Geen verwijzing nodig</li>
          <li>${ico.check}Geen wachtlijst</li>
          <li>${ico.clock}Gesprekken van een uur</li>
          <li>${ico.shield}Vertrouwelijk</li>
          <li>${ico.pin}Centrum Haarlem</li>
        </ul>
        <p style="margin-top:1.25rem">De praktijk ligt aan de Grote Houtstraat in het centrum van Haarlem, op loopafstand van het station en goed bereikbaar vanuit Heemstede, Bloemendaal, Velsen, Zandvoort en de rest van Zuid-Kennemerland.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec-white">
  <div class="wrap prose">
    <h2>Veelgestelde vragen over coaching</h2>
    ${faqHtml([FAQ[2], FAQ[1], FAQ[4], FAQ[5]])}
  </div>
</section>

${ctaBand("Klaar voor een eerste gesprek?", "Bel of mail voor een vrijblijvende kennismaking. Ik denk graag met je mee, ook als je nog twijfelt.")}
`,
};

/* ================================================================= CURSUS */
const cursusSchema = {
  "@type": "Course",
  "@id": SITE.origin + "/cursus/#kopp",
  name: "KOPP cursus Zuid-Kennemerland",
  description:
    "Gratis groepscursus van acht wekelijkse bijeenkomsten van twee uur over de gevolgen van opgroeien met een ouder met psychiatrische problemen. Aangeboden met Prezens, preventieteam GGZ inGeest.",
  provider: { "@id": SITE.origin + "/#praktijk" },
  url: SITE.origin + "/cursus/",
  inLanguage: "nl-NL",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", category: "Free" },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "onsite",
    courseWorkload: "PT16H",
    location: { "@type": "Place", name: "Zuid-Kennemerland", address: { "@type": "PostalAddress", addressLocality: "Haarlem", addressCountry: "NL" } },
  },
};

const cursus = {
  slug: "/cursus/",
  crumb: "Cursus",
  title: "Gratis KOPP cursus Zuid-Kennemerland | Dagmar Voss en Prezens",
  description:
    "Gratis groepscursus KOPP en cursus Omgaan met een naaste met emotieregulatiestoornis (borderline). Acht bijeenkomsten, 8 tot 10 deelnemers, Zuid-Kennemerland. Geen verwijzing nodig.",
  h1: "Cursussen in groepsverband",
  ogImage: "image05.jpg",
  extraSchema: [cursusSchema],
  body: `
<section class="page-head">
  <div class="wrap prose">
    ${crumbs("Cursus")}
    <p class="eyebrow">Gratis, in groepsverband</p>
    <h1>Cursussen in groepsverband</h1>
    <p class="lead">Samen met collega Marieke Beerthuis vanuit Prezens, preventieteam van GGZ inGeest, bied ik twee cursussen aan voor inwoners van de regio Zuid-Kennemerland.</p>
  </div>
</section>

<section class="sec-tight">
  <div class="wrap">
    <ul class="trust">
      <li>${ico.check}Gratis</li>
      <li>${ico.check}Geen verwijzing van de huisarts nodig</li>
      <li>${ico.clock}8 wekelijkse bijeenkomsten van 2 uur</li>
      <li>${ico.users}8 tot 10 deelnemers</li>
      <li>${ico.spark}Twee keer per jaar een nieuwe start</li>
    </ul>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="grid grid-2">
      <article class="card">
        <div class="card-icon">${ico.users}</div>
        <h3>KOPP cursus</h3>
        <p>Opgegroeid bij een ouder met psychische problemen? Dat kan belastend zijn. De wisselende stemmingen van je ouder, de onvoorspelbaarheid thuis, het gebrek aan informatie en de verantwoordelijkheid die je al vroeg op je schouders moest nemen.</p>
        <p>Ook als volwassene kun je daar nog last van hebben. Je slaapt slecht, je piekert, je hebt last van concentratieproblemen, of je begrijpt eigenlijk niet zo goed wat er speelt en waarom je je onzeker, somber of anders voelt.</p>
        <p>In de cursus krijg je informatie over de gevolgen van het opgroeien met een ouder met psychiatrische problemen. Het gaat over het herkennen van je eigen emoties, gevoelens en automatische gedachten, over grenzen stellen en over je leven vormgeven. Maar vooral ook over het besef dat je niet de enige bent.</p>
      </article>
      <article class="card">
        <div class="card-icon">${ico.heart}</div>
        <h3>Omgaan met een naaste met emotieregulatiestoornis</h3>
        <p><em>Voorheen borderline persoonlijkheidsstoornis genoemd.</em></p>
        <p>Naaste zijn van iemand met een borderline stoornis is niet altijd gemakkelijk. Vaak zijn er veel vragen over hoe je hier het beste mee om kunt gaan.</p>
        <p>Met deze cursus versterkt u uw vermogen om zelf richting te geven aan uw leven, ook al zijn de omstandigheden moeilijk. U krijgt uitleg over de stoornis en er is ruimte voor uitwisseling en herkenning. De focus ligt op meer aandacht en tijd voor uzelf, en u krijgt praktische tips over hoe u de relatie met de ander kunt verbeteren.</p>
      </article>
    </div>
  </div>
</section>

<section class="sec-room">
  <div class="wrap prose">
    <h2>Praktische informatie</h2>
    ${checks([
      "Beide cursussen starten twee keer per jaar",
      "Acht wekelijkse bijeenkomsten van twee uur",
      "Tussen de 8 en 10 deelnemers per groep",
      "Voor inwoners van de regio Zuid-Kennemerland",
      "De cursussen zijn gratis",
      "Je hebt geen verwijzing van je huisarts nodig",
    ])}
    <p style="margin-top:1.75rem">Aangeboden samen met Marieke Beerthuis vanuit Prezens, preventieteam GGZ inGeest.</p>
  </div>
</section>

${ctaBand("Meer info of aanmelden?", "Bel of mail voor de startdata van de volgende groepen. Aanmelden kan het hele jaar door.")}
`,
};

/* =========================================================== OVER DAGMAR */
const overDagmar = {
  slug: "/over-dagmar/",
  crumb: "Over Dagmar",
  title: "Over Dagmar Voss | Maatschappelijk werker en KOPP-coach in Haarlem",
  description:
    "Dagmar Voss is maatschappelijk werker, werkt in de GGZ en is zelf KOPP-vrouw. Zij geeft lezingen over KOPP aan zorgprofessionals en coacht volwassen KOPP in Haarlem.",
  h1: "Over Dagmar Voss",
  ogImage: "image04.jpg",
  body: `
<section class="page-head">
  <div class="wrap prose">
    ${crumbs("Over Dagmar")}
    <p class="eyebrow">Wie ik ben</p>
    <h1>Vakvrouw en ervaringsdeskundige</h1>
    <p class="lead">Ik ben Dagmar Voss, 50 jaar, wonend en werkend in Haarlem.</p>
  </div>
</section>

<section class="sec-tight">
  <div class="wrap">
    <div class="hero-grid">
      <div class="figure figure-portrait">
        <img src="/assets/img/image04.jpg" alt="Portret van Dagmar Voss" width="1000" height="1503" loading="lazy">
      </div>
      <div class="stack">
        <p>Ik heb tijdens mijn carriere op verschillende terreinen binnen de gezondheidszorg gewerkt en merkte dat ik mij bijzonder aangetrokken voelde tot maatschappelijk werk. Ik wilde mensen helpen die op de een of andere manier moeite hebben om in de maatschappij mee te draaien. In 2010 ben ik afgestudeerd als maatschappelijk werker, waarna ik aan de slag ben gegaan als hulpverlener bij de GGZ.</p>
        <p>Als studente kwam ik er tijdens een college achter dat ik een KOPP-vrouw ben. Er werd uitgelegd wat de gevolgen op latere leeftijd zijn wanneer je bent opgevoed door een ouder die emotioneel erg instabiel, depressief en/of angstig is. Waarom had ik hier niet eerder over gehoord? Zo herkenbaar allemaal - dit moest ik natuurlijk verder onderzoeken.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap prose stack">
    <p>Er kwamen herinneringen uit een ver verleden, niet altijd even prettig. Maar met de inzichten die ik tijdens de studie kreeg, kwam ook begrip - voor mijn ouders, maar met name voor mijzelf. Stap voor stap kreeg ik grip op mijn hevige emoties, op worstelingen in de omgang met mijn ouders, collega's, vrienden en partner. Door zelfreflectie en de toepassing van een aantal vaardigheden ben ik veel sterker en evenwichtiger in het leven komen te staan.</p>
    <p>Bij de GGZ had ik altijd speciale aandacht voor de volwassen dochter met die specifieke bagage uit haar jeugd. Ik ben nog steeds verbonden aan de GGZ, maar ben ook als zelfstandige aan de slag gegaan omdat er naar mijn mening binnen de GGZ te weinig aandacht is voor volwassen KOPP-problematiek.</p>
    <p>Met mijn vakvrouwpet op, maar niet in de laatste plaats als ervaringsdeskundige, geef ik lezingen over KOPP aan zorgprofessionals en begeleid ik KOPP-vrouwen naar een prettiger, stabieler en zelfverzekerder bestaan.</p>
  </div>
</section>

<section class="sec-room">
  <div class="wrap">
    <div class="prose tight"><h2>In het kort</h2></div>
    <div class="grid grid-3">
      <article class="card"><div class="card-icon">${ico.shield}</div><h3>Maatschappelijk werker</h3><p>Afgestudeerd in 2010, daarna hulpverlener bij de GGZ. Nog steeds verbonden aan de GGZ.</p></article>
      <article class="card"><div class="card-icon">${ico.heart}</div><h3>Ervaringsdeskundige</h3><p>Zelf KOPP-vrouw. Ik weet van binnenuit hoe de patronen werken en hoe je ze bijstelt.</p></article>
      <article class="card"><div class="card-icon">${ico.spark}</div><h3>Spreker</h3><p>Lezingen over KOPP aan zorgprofessionals, omdat er binnen de GGZ te weinig aandacht voor is.</p></article>
    </div>
  </div>
</section>

${ctaBand("Benieuwd of het klikt?", "Een kennismakingsgesprek is vrijblijvend. Bel of mail en we plannen iets in.")}
`,
};

/* ================================================================= BOEKEN */
const boekenSchema = {
  "@type": "ItemList",
  name: "Aanbevolen boeken over KOPP, trauma en herstel",
  numberOfItems: BOOKS.length,
  itemListElement: BOOKS.map((b, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: { "@type": "Book", name: b[0], ...(b[1] ? { author: { "@type": "Person", name: b[1] } } : {}) },
  })),
};

const boeken = {
  slug: "/boeken/",
  crumb: "Boeken",
  title: "Boeken over KOPP, trauma en herstel | Leeslijst van Dagmar Voss",
  description:
    "Aanbevolen boeken voor volwassen KOPP: van Niemandskinderen en Traumasporen tot Loskomen van emotioneel onvolwassen mensen. De persoonlijke leeslijst van KOPP-coach Dagmar Voss.",
  h1: "Boeken voor je KOPP",
  ogImage: "image07.jpg",
  extraSchema: [boekenSchema],
  body: `
<section class="page-head">
  <div class="wrap prose">
    ${crumbs("Boeken")}
    <p class="eyebrow">Inspiratie</p>
    <h1>Boeken voor je KOPP</h1>
    <p class="lead">&ldquo;Heb jij ook een link met aanbevolen boeken op je site?&rdquo; Die vraag kreeg ik tijdens een coachingsessie. &ldquo;Nee, die heb ik nog niet.&rdquo; Hoogste tijd dus.</p>
  </div>
</section>

<section class="sec-tight">
  <div class="wrap">
    <div class="figure figure-om"><img src="/assets/img/image07.jpg" alt="Boekenkast in een bloeiende tuin bij een vijver" width="1200" height="896" loading="lazy"></div>
  </div>
</section>

<section class="sec-tight">
  <div class="wrap prose">
    <p>Hierbij een aantal titels die je wellicht interessant gaat vinden. Boeken die je meer inzicht geven in je eigen worstelingen, of waarin je ervaringsverhalen van anderen leest. Er staan studieboeken bij zoals <em>Niemandskinderen</em>, maar ook literaire boeken zoals <em>Tegenlicht</em> van Esther Verhoef. Tik op een titel voor de beschrijving.</p>
  </div>
</section>

<section class="sec-tight">
  <div class="wrap">
    <div class="acc books">
      ${BOOKS.map(
        (b) =>
          "<details><summary>" +
          esc(b[0]) +
          (b[1] ? ' <span style="font-weight:400;color:var(--inkt-vaag)">&middot; ' + esc(b[1]) + "</span>" : "") +
          '</summary><div class="acc-body"><p>' +
          esc(b[2]) +
          "</p></div></details>"
      ).join("\n      ")}
    </div>
  </div>
</section>

<section>
  <div class="wrap prose">
    <p>Voor zover mijn eigen lijst. Er zijn zeker nog veel meer interessante en waardevolle boeken met KOPP als thema. Heb jij een goede tip, of wil je jouw ervaring met een boek delen? Laat het me weten via <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
    <p>Voor nu een warme groet van Dagmar.</p>
  </div>
</section>

${ctaBand("Liever samen aan de slag?", "Lezen geeft inzicht. Coaching helpt je het ook toe te passen. Bel of mail vrijblijvend.")}
`,
};

/* ================================================================ CONTACT */
const contact = {
  slug: "/contact/",
  crumb: "Contact",
  title: "Contact en afspraak maken | Dagmar Voss, KOPP coaching Haarlem",
  description:
    "Vraag over KOPP coaching of een afspraak inplannen? Bel 06-15532711 of mail info@dagmarvoss.nl. Praktijk aan de Grote Houtstraat 144 in Haarlem.",
  h1: "Contact",
  ogImage: "image05.jpg",
  body: `
<section class="page-head">
  <div class="wrap prose">
    ${crumbs("Contact")}
    <p class="eyebrow">Afspraak maken</p>
    <h1>Neem contact op</h1>
    <p class="lead">Heb je een vraag over KOPP coaching of wil je een afspraak inplannen? Bel of mail gerust. Ook als je nog twijfelt of dit iets voor je is.</p>
  </div>
</section>

<section class="sec-tight">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <ul class="contact-list">
          <li><a href="tel:${SITE.phoneIntl}"><span class="contact-ico">${ico.phone}</span><span>${SITE.phone}<small>Bellen</small></span></a></li>
          <li><a href="${SITE.whatsapp}" target="_blank" rel="noopener"><span class="contact-ico is-wa">${ico.whatsapp}</span><span>WhatsApp<small>Stuur gerust een bericht, ook buiten kantoortijd</small></span></a></li>
          <li><a href="mailto:${SITE.email}"><span class="contact-ico">${ico.mail}</span><span>${SITE.email}<small>Reactie binnen enkele werkdagen</small></span></a></li>
          <li><a href="https://maps.google.com/?q=Grote+Houtstraat+144,+Haarlem" target="_blank" rel="noopener"><span class="contact-ico">${ico.pin}</span><span>${SITE.street}<small>${SITE.zip} ${SITE.city} &middot; open in Maps</small></span></a></li>
        </ul>
        <ul class="trust" style="margin-top:1.5rem">
          <li>${ico.check}Geen verwijzing nodig</li>
          <li>${ico.check}Geen wachtlijst</li>
          <li>${ico.shield}Vertrouwelijk</li>
        </ul>
        <div class="crisis" style="margin-top:1.5rem">
          <strong>Coaching is geen crisishulp.</strong> Heb je acuut hulp nodig of denk je aan zelfdoding? Bel 113 of 0800-0113 (Zelfmoordpreventie, gratis en 24/7), of neem contact op met je huisarts of de huisartsenpost.
        </div>
      </div>
      <div>
        ${mapbox()}
        <p style="font-size:.88rem;color:var(--inkt-vaag);margin-top:.85rem">De praktijk ligt in het centrum van Haarlem, op loopafstand van station Haarlem. Goed bereikbaar vanuit Heemstede, Bloemendaal, Velsen, Zandvoort, Beverwijk en de rest van Zuid-Kennemerland.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec-room">
  <div class="wrap prose">
    <h2>Veelgestelde vragen</h2>
    ${faqHtml(FAQ)}
  </div>
</section>

${ctaBand("Zet de eerste stap", "Je hoeft je verhaal niet af te hebben voordat je belt. Begin gewoon.")}
`,
};

const PAGES = [home, watIsKopp, klachten, coaching, cursus, overDagmar, boeken, contact];

/* ------------------------------------------------------------------ write */
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#513747"/><g transform="translate(32 32) scale(.12) translate(-210 -161)" fill="none" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><path d="M 196,255 C 167,276 120,223 111,183 C 104,148 65,144 51,169 C 28,215 121,229 161,151 C 195,88 198,46 182,52 C 161,61 150,189 182,233 C 197,254 212,265 228,265 C 215,230 208,180 204,150 M 228,265 C 252,212 266,165 292,140" stroke="#FBF5EE"/><path d="M 292,140 C 324,111 365,124 393,139" stroke="#E8AB83"/></g></svg>`;

const ROBOTS = `User-agent: *
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
`;

/* Elke pagina een keer renderen: de html gaat zowel naar dist/ als door de
   hash hieronder, en layout() twee keer aanroepen per pagina zou die twee uit
   elkaar kunnen laten lopen. */
const RENDERED = PAGES.map((p) => ({ page: p, html: layout(p) }));

/* lastmod moet de dag zijn waarop de pagina veranderde, niet de dag waarop we
   bouwden. Dat stond hier fout: elke build zette `today` op alle acht, dus de
   sitemap riep elke keer "alle acht zijn vernieuwd" terwijl er een komma in
   een andere pagina was gewijzigd. Een crawler die dat een paar keer narekent
   gaat lastmod van deze site negeren, en dan is het signaal weg op het moment
   dat er echt iets verandert.

   Dus: hash de html, hou per pagina bij welke hash bij welke datum hoorde in
   sitemap-datums.json (staat in git), en verzet de datum alleen als de hash
   wijzigt. De Mapbox-sleutel gaat er eerst uit - die rouleert en zegt niets
   over de inhoud van /contact/. */
const DATUM_BESTAND = join(ROOT, "sitemap-datums.json");
const vorigeDatums = JSON.parse(await readFile(DATUM_BESTAND, "utf8").catch(() => "{}"));
const vandaag = new Date().toISOString().slice(0, 10);
const datums = {};
for (const { page, html } of RENDERED) {
  const hash = createHash("sha256")
    .update(html.split(MAPBOX_TOKEN).join("<token>"))
    .digest("hex")
    .slice(0, 16);
  const vorig = vorigeDatums[page.slug];
  datums[page.slug] = vorig && vorig.hash === hash ? vorig : { hash, datum: vandaag };
}

/* changefreq en priority staan er niet meer in. Google gebruikt ze niet - dat
   zegt het zelf - en priority was hier bovendien verzonnen: /coaching/ en
   /contact/ stonden beide op 0.8 omdat ze niet de startpagina zijn, niet omdat
   iemand ze had afgewogen. Een veld dat niet gelezen wordt en niet waar is
   hoort niet in een bestand dat bewijst hoe de site in elkaar zit. */
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  (p) => "  <url><loc>" + SITE.origin + p.slug + "</loc><lastmod>" + datums[p.slug].datum + "</lastmod></url>"
).join("\n")}
</urlset>
`;

const NOT_FOUND = layout({
  slug: "/404.html",
  crumb: "Pagina niet gevonden",
  title: "Pagina niet gevonden | Dagmar Voss",
  description: "Deze pagina bestaat niet (meer).",
  h1: "Pagina niet gevonden",
  body: `
<section class="page-head">
  <div class="wrap prose">
    <h1>Deze pagina bestaat niet</h1>
    <p class="lead">Misschien is de link verouderd. Ga terug naar de startpagina of kies hieronder een onderwerp.</p>
    <div class="btn-row" style="margin-top:1.5rem"><a class="btn btn-primary" href="/">Naar de startpagina</a><a class="btn btn-ghost" href="/contact/">Contact</a></div>
  </div>
</section>`,
});

/* Workers Static Assets leest _headers net als Pages - nagemeten op
   rhklusservice.nl, zie de root CLAUDE.md. */
const HEADERS = `/*
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
`;

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

for (const { page, html } of RENDERED) {
  const dir = page.slug === "/" ? DIST : join(DIST, page.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), html, "utf8");
}

/* src/assets/img/origineel/ blijft achter: dat zijn Dagmars eigen foto's zoals
   ze aangeleverd werden, bron voor de bijgewerkte versies ernaast. Ze gingen
   tot de verhuizing mee de site op, en daarmee stond de hard-geflitste versie
   van haar portret publiek op te halen. */
await cp(join(SRC, "assets"), join(DIST, "assets"), {
  recursive: true,
  filter: (src) => !src.replace(/\\/g, "/").includes("/assets/img/origineel"),
});
await cp(join(SRC, "style.css"), join(DIST, "style.css"));
await writeFile(join(DIST, "favicon.svg"), FAVICON, "utf8");
await writeFile(join(DIST, "robots.txt"), ROBOTS, "utf8");
await writeFile(join(DIST, "sitemap.xml"), SITEMAP, "utf8");
await writeFile(join(DIST, "404.html"), NOT_FOUND, "utf8");
await writeFile(join(DIST, "_headers"), HEADERS, "utf8");

/* Naast dist/, want dit is bron en niet uitvoer: de volgende build moet weten
   welke hash bij welke datum hoorde, anders is lastmod weer de bouwdatum. */
await writeFile(join(DATUM_BESTAND), JSON.stringify(datums, null, 2) + "\n", "utf8");

/* Tellen op "hash is gewijzigd", niet op "datum is vandaag": op de dag dat een
   pagina verzet werd zijn die twee niet te onderscheiden, en dan meldt elke
   herbouw diezelfde dag opnieuw dat alles vernieuwd is. */
const verzet = PAGES.filter((p) => vorigeDatums[p.slug]?.hash !== datums[p.slug].hash).length;
console.log(
  "Built " + PAGES.length + " pages to dist/ (" + SITE.origin + ") - lastmod verzet op " + verzet + " pagina('s)"
);
