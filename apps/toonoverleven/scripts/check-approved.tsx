import React from "react";
(globalThis as any).React = React;
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import App from "../src/App";
import { defaults } from "../src/content/defaults";
import { templates } from "../src/next/model";
import { PADEN, VERHUISD } from "../src/meta";
import { contentVan } from "../src/content";
const date = Date.parse("2026-09-22T07:00:00Z");
const render = (path: string, inhoud = defaults) =>
  renderToString(
    <App start={{ pad: path, inhoud, voorbeeld: false, nu: date }} />,
  );
const paths = new Set([
  ...PADEN,
  ...defaults.nieuws.map((n) => "/nieuws/" + n.slug),
  ...Object.keys(VERHUISD),
  ...defaults.agenda.map((a) => "/activiteit/" + a.slug),
]);
let count = 0;
for (const path of PADEN) {
  const html = render(path);
  assert.equal(
    (html.match(/<h1[ >]/g) || []).length,
    1,
    `${path}: exactly one h1`,
  );
  assert(
    !/Je hoeft vandaag de weg nog niet te weten|Henk Krol|Melianthe Nicolai/.test(
      html,
    ),
    `${path}: obsolete text`,
  );
  for (const m of html.matchAll(/href="([^"?#]*)(?:[?#][^"]*)?"/g)) {
    if (
      m[1].startsWith("/") &&
      !m[1].startsWith("/docs/") &&
      !m[1].startsWith("/img/")
    )
      assert(paths.has(m[1]), `${path}: unknown internal link ${m[1]}`);
  }
  for (const m of html.matchAll(/src="(\/img\/[^"?]+)"/g))
    assert(
      existsSync(fileURLToPath(new URL("../public" + m[1], import.meta.url))),
      `${path}: missing image ${m[1]}`,
    );
  if (
    [
      "/eerste-bezoek",
      "/over-ons",
      "/kennis-en-wegwijzer/wat-is-een-centrum-voor-leven-met-en-na-kanker",
    ].includes(path)
  )
    assert(!html.includes("<iframe"), `${path}: video before consent`);
  count++;
}
assert.equal(defaults.agenda.length, 13);
assert(defaults.agenda.every((a) => a.herhaling === "eenmalig"));
assert(defaults.sponsoren.some((s) => s.naam === "Café het Plein"));
assert(render("/over-ons/organisatie-en-verantwoording").includes("820209685"));
assert(
  render("/over-ons/organisatie-en-verantwoording").includes("Mike Kastrop"),
);
assert(
  render("/over-ons/steun-ons").includes(
    "https://www.sponsorkliks.com/products/shops.php?club=5378",
  ),
);
assert(render("/ik-heb-kanker").includes("Als de scans stil zijn"));
assert(render("/ik-heb-kanker").includes("Henk"));
assert(!render("/activiteiten/zenmeditatie").includes("28 september"));
assert(
  render("/activiteiten/zenmeditatie").includes(
    "Vraag naar een volgende datum",
  ),
);
const home = templates.find((p) => p.path === "/")!;
const key = home.texts.find((t) => t.text.includes("Je hoeft het niet"))!._key;
assert(
  render("/", {
    ...defaults,
    pages: [
      {
        path: "/",
        texts: [{ _key: key, label: "Kop", text: "CMS WIJZIGING" }],
      },
    ],
  }).includes("CMS WIJZIGING"),
);
const empty = contentVan({
  projectId: "z4gex0g7",
  dataset: "production",
  data: { agenda: [], pages: [], nieuws: [], verhalen: [], sponsoren: [] },
});
assert.equal(empty.agenda.length, 0);
assert(
  render("/activiteiten", empty).includes("Er staan nog geen nieuwe momenten"),
);
for (const [from, to] of Object.entries(VERHUISD)) {
  assert(paths.has(to));
  assert(!VERHUISD[to], `redirect chain ${from}`);
}
console.log(
  `${count} pagina’s: SSR, links, afbeeldingen, CMS-tekst, lege agenda, videoprivacy en inhoudelijke correcties gecontroleerd.`,
);

assert(
  !render("/activiteit/sponsordiner-bij-classic-mike-zeewolde").includes(
    "| ---",
  ),
);
assert(
  render("/activiteit/sponsordiner-bij-classic-mike-zeewolde").includes(
    '<th scope="row">Datum</th>',
  ),
);
