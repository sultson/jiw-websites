import { templates, activityTypes, template } from "./next/model";
import old from "./next/legacy-paths.json";
export const SITE_NAAM = "Toon over Leven";
export const SITE_URL = "https://www.toonoverleven.nl";
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
      "/aanmelden",
      {
        titel: "Aanmelden of een vraag stellen",
        omschrijving:
          "Meld je aan voor een activiteit van Toon over Leven, of stel eerst je vraag. We laten je weten of er een plekje voor je is.",
      },
    ],
    [
      "/privacy",
      {
        titel: "Privacy bij Toon over Leven",
        omschrijving:
          "Hoe Toon over Leven omgaat met je gegevens als je contact opneemt, je aanmeldt, de nieuwsbrief ontvangt of een video bekijkt.",
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
  // The inloopavond stopped in October 2026.
  "/activiteiten/inloopavond": "/activiteiten/inloopochtend",
  "/aanmelden/inloopavond": "/activiteiten/inloopochtend",
  // The sponsordiner of 6 November 2026 was cancelled.
  "/activiteiten/sponsordiner": "/activiteiten",
  "/aanmelden/sponsordiner": "/activiteiten",
  "/activiteit/sponsordiner-bij-classic-mike-zeewolde": "/activiteiten",
  // De pagina's van de WordPress-site die nu op toonoverleven.nl staat, uit
  // haar wp-sitemap.xml (30-10-2026). Bladwijzers, oude mails en folders.
  "/wiezijnwij": "/over-ons",
  "/missie-en-visie": "/over-ons",
  "/bestuur": "/over-ons/organisatie-en-verantwoording",
  "/financieel-2": "/over-ons/organisatie-en-verantwoording",
  "/vacatures": "/over-ons/vrijwilliger-worden",
  "/vrijwilligersbeleid": "/over-ons/vrijwilliger-worden",
  "/locaties": "/praktisch",
  "/privacybeleid": "/privacy",
  "/nieuwsberichten-over-kanker": "/nieuws",
  "/toon-over-leven-in-het-nieuws": "/nieuws",
  "/klavertjevier-lotgenotencontact": "/leeftijdsgenoten",
  "/training-mindful-mediteren": "/activiteiten/zenmeditatie",
  "/categorieen": "/activiteiten",
  "/tags": "/activiteiten",
};

/**
 * Activiteiten uit de oude WordPress-agenda. Alleen gebruikt als het adres
 * geen activiteit in het beheer is: een nieuwe activiteit met dezelfde slug
 * gaat altijd voor.
 */
export const OUDE_ACTIVITEITEN: Record<string, string> = {
  "/activiteit/zenmeditatie": "/activiteiten/zenmeditatie",
  "/activiteit/mediteren-bij-toon-over-leven": "/activiteiten/zenmeditatie",
  "/activiteit/workshop-mixed-media-7": "/activiteiten/mixed-media",
  "/activiteit/workshop-junk-journaling-7": "/activiteiten/junk-journaling",
  "/activiteit/encaustic-art-kerst": "/activiteiten/encaustic-art",
  "/activiteit/kerstbal-stippen-mandala-stippen-voor-kerst": "/activiteiten/mandala-stippen",
  "/activiteit/inloopochtend-69": "/activiteiten/inloopochtend",
  "/activiteit/inloopochtend-70": "/activiteiten/inloopochtend",
};

/**
 * Hele WordPress-takken zonder tegenhanger: tags, categorieën, auteurs, de
 * agenda per dag of per categorie en de bladerpagina's. De WordPress-
 * zoekparameters gaan eraf, die betekenen hier niets.
 */
export function oudeWordpressTak(pad: string): string | null {
  if (/^\/(agenda|tag|category)\//.test(pad)) return "/activiteiten";
  if (/^\/(author|page)\//.test(pad)) return "/";
  return null;
}
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
