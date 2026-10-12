import type {Spec} from './specialisaties';
import {HAAR_NAAM} from '../site.config.mjs';

/**
 * De titel en de omschrijving van een pijlerpagina, zoals ze in het
 * zoekresultaat staan.
 *
 * Eén plek, twee gebruikers: scripts/prerender.mjs bakt ze in de HTML en
 * SpecialisatiePagina zet ze opnieuw als iemand binnen de site doorklikt. Zou
 * elk zijn eigen zin maken, dan staat er in de HTML iets anders dan in het
 * tabblad en weet niemand welke van de twee Google uiteindelijk leest.
 */

/** Ongeveer wat Google in een zoekresultaat laat zien. */
const MAX = 158;
const MIN = 110;

/**
 * Een omschrijving die niet halverwege een woord ophoudt.
 *
 * De samenvatting van een pijler is soms 42 tekens en soms 115, dus hij wordt
 * aangevuld met het begin van de intro tot hij lang genoeg is om de regel in
 * het zoekresultaat te vullen, en afgekapt op een woordgrens als hij te lang
 * wordt. Afkappen op een punt als die er net voorbij MIN staat: dan leest het
 * als een afgemaakte gedachte in plaats van als een afgebroken zin.
 */
export function omschrijving(spec: Spec): string {
  const heel = `${spec.samenvatting} ${spec.intro}`.replace(/\s+/g, ' ').trim();
  if (heel.length <= MAX) return heel;

  const punt = heel.lastIndexOf('. ', MAX);
  if (punt >= MIN) return heel.slice(0, punt + 1);

  const spatie = heel.lastIndexOf(' ', MAX - 1);
  return `${heel.slice(0, spatie)}...`;
}

export function titel(spec: Spec): string {
  return `${spec.seoTitel ?? spec.naam} | ${HAAR_NAAM}`;
}

/* Alleen functies hier, en alleen een type-import van specialisaties.tsx.
   Dat is met opzet: dat bestand gebruikt deze twee functies zelf, en een lijst
   die hier bij het laden wordt opgebouwd maakt daar een kringetje van waarin
   SPECIALISATIES nog niet bestaat als deze regel draait. De lijst per adres
   staat daarom in src/entry-server.tsx, dat van niemand wordt ingelezen. */
