import { templates, activityTypes, template } from "./next/model";
import old from "./next/legacy-paths.json";
export const SITE_NAAM = "Toon over Leven";
export const SITE_URL = "https://toonoverleven.jouwidealewebsite.nl";
export const PAGINAS: Record<string, { titel: string; omschrijving: string }> =
  Object.fromEntries([
    ...templates
      .filter((p) => p.path.startsWith("/"))
      .map((p) => [p.path, { titel: p.title, omschrijving: p.description }]),
    ...Object.entries(activityTypes).map(([slug, a]) => [
      "/activiteiten/" + slug,
      { titel: a.title, omschrijving: a.description },
    ]),
    ...Object.entries(activityTypes).map(([slug, a]) => ["/aanmelden/" + slug, {titel: "Aanmelden: " + a.title, omschrijving: "Aanmelden voor " + a.title}]),
    [
      "/privacy",
      {
        titel: "Privacy en cookies",
        omschrijving:
          "Hoe Toon over Leven omgaat met je contactgegevens, video’s en cookies.",
      },
    ],
  ]);
export const PADEN = Object.keys(PAGINAS);
export type Pad = string;
export const NIET_GEVONDEN = "Pagina niet gevonden";
export const paginaTitel = (kop: string) => `${kop} · ${SITE_NAAM}`;
export const titelVan = (pad: string) =>
  paginaTitel(PAGINAS[pad]?.titel ?? NIET_GEVONDEN);
export const schoonPad = (pad: string) =>
  pad.length > 1 ? pad.replace(/\/$/, "") : pad || "/";
export const absoluutUrl = (pad: string) => SITE_URL + pad;
export const isRedactiePad = (pad: string) => Boolean(template(pad));
const destination = (path: string) => {
  if (path.startsWith("/activiteiten")) return "/activiteiten";
  if (path.includes("contact")) return "/contact";
  if (path.startsWith("/praktisch")) return "/praktisch";
  if (path.includes("verwijzer")) return "/voor-verwijzers";
  if (path.includes("eerste-bezoek")) return "/eerste-bezoek";
  if (path.includes("na-behandeling") || path.includes("na-de-behandeling"))
    return "/na-de-behandeling";
  if (path.includes("jong")) return "/jong-en-kanker";
  if (path.includes("naasten")) return "/voor-naasten";
  if (path.startsWith("/kennis")) return "/kennis-en-wegwijzer";
  if (path.startsWith("/over-ons")) return "/over-ons";
  if (path.includes("ik-heb-kanker")) return "/ik-heb-kanker";
  return "/";
};
export const VERHUISD: Record<string, string> = {
  ...Object.fromEntries(
    old.filter((p) => !PAGINAS[p]).map((p) => [p, destination(p)]),
  ),
  "/wie-we-zijn": "/over-ons",
  "/agenda": "/activiteiten",
  "/agenda/lijst": "/activiteiten",
  "/vrijwilliger": "/over-ons/vrijwilliger-worden",
  "/steun": "/over-ons/steun-ons",
  "/verantwoording": "/over-ons/organisatie-en-verantwoording",
  "/over-ons/index.html": "/over-ons",
  "/voor-jou": "/",
};
export function slugify(waarde: string): string {
  const slug = waarde
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 64)
    .replace(/^-+|-+$/g, "");
  return slug || "bericht";
}

/** Kort af tot wat een zoekresultaat of een linkvoorbeeld werkelijk toont. */
export function kort(waarde: string, max = 165): string {
  const tekst = waarde.replace(/\s+/g, " ").trim();
  if (tekst.length <= max) return tekst;
  const snee = tekst.slice(0, max);
  const spatie = snee.lastIndexOf(" ");
  return `${(spatie > max * 0.6 ? snee.slice(0, spatie) : snee).replace(/[.,;:]$/, "")}…`;
}
