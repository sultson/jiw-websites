/** September 2026 approved redesign. Back up first; preserve editor content on reruns. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
if (!process.env.SANITY_AUTH_TOKEN && !process.env.SANITY_WRITE_TOKEN) {
  const login = path.join(homedir(), ".config/sanity/config.json");
  if (existsSync(login))
    process.env.SANITY_AUTH_TOKEN = JSON.parse(
      readFileSync(login, "utf8"),
    ).authToken;
}
const { client, beeld } = await import("./sanity");
const { templates } = await import("../../src/next/model");
const { defaults } = await import("../../src/content/defaults");
const { slugify } = await import("../../src/meta");
const apply = process.argv.includes("--apply");
const docs = await client.fetch<Record<string, any>[]>(
  '*[!(_type in ["sanity.imageAsset","sanity.fileAsset"])]',
);
const backup = path.join(root, "raw", "cms-backups");
mkdirSync(backup, { recursive: true });
const file = path.join(
  backup,
  `before-v5-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
);
writeFileSync(file, JSON.stringify(docs, null, 2), { mode: 0o600 });
console.log(`Backup: ${file}`);
const ids = new Set(docs.map((d) => d._id));
const oldIds = [
  "agenda-inloopochtend",
  "agenda-inloopavond",
  "agenda-mandalagroep",
  "agenda-wandelgroep",
  "agenda-zenmeditatie",
];
console.log(
  `${templates.length} pagina’s/onderdelen, ${defaults.agenda.length} bevestigde momenten, ${defaults.sponsoren.length} sponsors. ${oldIds.length} oude voorbeeldreeksen archiveren.`,
);
if (!apply) {
  console.log(
    "Alleen controle. Voeg --apply toe om de migratie uit te voeren.",
  );
  process.exit(0);
}
// Asset uploads are content-addressed. An interrupted run can safely be resumed.
for (const page of templates) {
  const id = "page-v5-" + slugify(page.path === "/" ? "home" : page.path);
  if (ids.has(id)) continue;
  const images = [];
  for (const img of page.images) {
    const asset = await beeld(img.src);
    images.push({
      _key: img._key,
      _type: "object",
      label: img.label,
      alt: img.alt,
      ...(asset ? { image: asset } : {}),
    });
  }
  await client.createIfNotExists({
    _id: id,
    _type: "sitePage",
    path: page.path,
    title: page.title,
    description: page.description,
    texts: page.texts.map((t) => ({ ...t, _type: "object" })),
    links: page.links.map((l) => ({ ...l, _type: "object" })),
    images,
  });
  console.log(`Pagina: ${page.path}`);
}
for (const event of defaults.agenda) {
  const id = "agenda-confirmed-" + event.id;
  if (ids.has(id)) continue;
  const afbeelding = await beeld(event.img);
  const { id: _, img, ...data } = event;
  await client.createIfNotExists({
    _id: id,
    _type: "activiteit",
    ...data,
    slug: { _type: "slug", current: event.slug },
    ...(afbeelding ? { afbeelding } : {}),
  });
  console.log(`Agenda: ${event.datum} ${event.titel}`);
}
for (const [i, sponsor] of defaults.sponsoren.entries()) {
  const id = "sponsor-" + slugify(sponsor.naam);
  if (ids.has(id)) continue;
  const logo = await beeld(sponsor.beeld);
  await client.createIfNotExists({
    _id: id,
    _type: "sponsor",
    naam: sponsor.naam,
    website: sponsor.web,
    volgorde: i,
    ...(logo ? { logo } : {}),
  });
}
const marker = "migration-approved-september-2026";
if (!ids.has(marker)) {
  let tx = client.transaction();
  for (const id of oldIds) {
    const old = docs.find((d) => d._id === id);
    if (old)
      tx = tx.patch(id, (p) => p.ifRevisionId(old._rev).set({ archief: true }));
  }
  const site = docs.find((d) => d._id === "siteTeksten");
  if (site)
    tx = tx.patch("siteTeksten", (p) =>
      p
        .ifRevisionId(site._rev)
        .set({
          "verantwoording.advies": defaults.teksten.verantwoording.advies.map(
            (p, i) => ({ _key: `advies-${i}`, _type: "object", ...p }),
          ),
        }),
    );
  tx = tx.createIfNotExists({
    _id: marker,
    _type: "migration",
    date: new Date().toISOString(),
    source: "Toon-over-Leven-instructies.md, 22 september 2026",
    backup: file,
  });
  await tx.commit();
}
console.log(
  "Migratie afgerond. Bestaande nieuwsberichten, verhalen en redactionele wijzigingen behouden.",
);
// Preserve the supplied IPSO filenames and provenance in the CMS asset library.
const sources = JSON.parse(
  readFileSync(path.join(root, "src/next/image-sources.json"), "utf8"),
);
const stored = await client.fetch<Record<string, any>[]>(
  '*[_type=="sitePage"]{path,images}',
);
const assets = new Map<string, Record<string, string>>();
for (const doc of stored) {
  const page = templates.find((p) => p.path === doc.path);
  for (const im of doc.images ?? []) {
    const local = page?.images.find((i) => i._key === im._key);
    const source = local && sources[local.src];
    if (source && im.image?.asset?._ref)
      assets.set(im.image.asset._ref, source);
  }
}
for (const [id, source] of assets)
  await client
    .patch(id)
    .set({ originalFilename: source.original })
    .setIfMissing({ title: source.label, description: source.description })
    .commit();
console.log(
  `Bronnamen en gebruikscontext van ${assets.size} aangeleverde beelden bewaard in het CMS.`,
);
