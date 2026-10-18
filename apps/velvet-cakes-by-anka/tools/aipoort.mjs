// AI-poort: houdt machinetaal uit klantcopy. Hang hem in het buildscript, niet ernaast.
//
//   import { aipoort } from '../.gereedschap/aipoort.mjs'
//   aipoort({ talen: TEKST, toegestaan: TOEGESTAAN })   // gooit = build stopt
//
// Ontstaan 04-10-2026, nadat Alfred op het Klinkhamer-concept om "0 em dashes, 0 needless
// brows" vroeg en Armando daarna om een sweep op ai-ismes. De taalpoort (taal.mjs) doet
// hetzelfde voor Nederlandse klantdocumenten in html; deze doet het voor de tekstbestanden
// van een site, in alle talen, voordat er een pagina van gebouwd wordt.
//
// Waarom hier en niet in controleer.mjs: dat script leest de gebouwde html en meldt. Dit
// blokkeert de build. Een ai-isme is geen melding om later te bekijken, het is copy die
// niet naar een klant mag.
//
// Een treffer heeft twee uitgangen: de regel herschrijven, of de sleutel in `toegestaan`
// zetten met een reden. Dat tweede is de registratie die ontbreekt zodra je zo'n lijst
// op de opdrachtregel meegeeft: een vlaggetje typ je weg, een regel in het project blijft.

// ----------------------------------------------------------------- 1. alle talen
// Het lange streepje en het gedachtestreepje. Cijferbereiken (07:00 - 11:00, 5 - 7) zijn
// geen gedachtestreepje, dus die eis is letters aan weerszijden.
const ALTIJD = [
  [/—|&mdash;/g, 'em dash'],
  [/–|&ndash;/g, 'en dash'],
  [/(?<=\p{L}) - (?=\p{L})/gu, 'hyphen used as a thought dash'],
  [/\.\.\.|…/g, 'ellipsis (trailing off reads as unfinished copy)'],
]

// ----------------------------------------------------------------- 2. per taal
// Drie soorten. (a) de omkeerdraai: iets definieren door te zeggen wat het niet is.
// (b) de nadrukformule: exactly, precies, genau. (c) reisbrochurewoorden.
const EN = [
  [/\bnot (?:just|only|merely|simply)\b/gi, 'not just X but Y'],
  [/\b(?:is|are|was|am)\s+not\s+(?:a|an|the)\b[^.;:!?]{0,50}?\bwho\b/gi, 'defining himself by what he is not'],
  [/,\s*not\s+(?:a|an|the|from|for|to|in|on|of)\b[^.;:!?]{0,45}[.!?]/gi, 'the "X, not Y" turn'],
  [/\bno\s+\p{L}+,\s*no\s+\p{L}+/giu, 'the "no X, no Y" pair'],
  [/,\s*no\s+\p{L}+(?:\s+\p{L}+){0,3}\s*$/giu, 'line ending on a "no X" negation'],
  [/\b(?:that|this|which)\s+is\s+(?:exactly|precisely)\b/gi, 'that is exactly'],
  [/\b(?:that|this)\s+is\s+the\s+(?:other|real|hard|whole)\s+(?:half|point|trick|part|question)\b/gi, 'that is the other half / the real point'],
  [/\bis\s+the\s+other\s+half\b/gi, 'is the other half'],
  [/\bwhat\s+we\s+do\s+instead\s+is\b/gi, 'what we do instead is'],
  [/\bnone\s+of\s+that\s+is\s+what\b/gi, 'none of that is what'],
  [/\bit\s+is\s+about\s+\p{L}+ing\b/giu, 'it is about <doing>'],
  [/\bmore\s+than\s+just\b/gi, 'more than just'],
  [/\bthis\s+is\s+where\b/gi, 'this is where'],
  [/\bnot\s+to\s+mention\b/gi, 'not to mention'],
  [/\bwhether\s+(?:you|it|we)\b[^.;:!?]{0,45}\bor\b/gi, 'whether X or Y'],
  [/\b(?:honestly|frankly|to be honest|truth be told)\b/gi, 'honestly / frankly'],
  [/\bat\s+the\s+end\s+of\s+the\s+day\b/gi, 'at the end of the day (as a figure of speech)'],
  [/\b(?:seamless|crucial|vital|essential|pivotal|invaluable)\b/gi, 'consultancy adjective'],
  [/\b(?:curated|immersive|bespoke|elevate|unlock|leverage|harness)\b/gi, 'brochure verb'],
  [/\b(?:breathtaking|stunning|unforgettable|iconic|vibrant|bustling|nestled|quaint)\b/gi, 'travel-brochure adjective'],
  [/\b(?:hidden gem|tapestry|a testament to|the realm of|in the world of|ever[- ]changing|fast[- ]paced)\b/gi, 'brochure phrase'],
  [/\brich\s+(?:history|culture|heritage|tapestry)\b/gi, 'rich history / culture'],
  [/\b(?:delve|dive)\s+into\b/gi, 'delve / dive into'],
  [/\bno\s+(?:stock|filler|fluff|gimmicks?)\b/gi, 'defending yourself against an accusation nobody made'],
  [/\btake\s+it\s+to\s+the\s+next\s+level\b/gi, 'next level'],
]

const NL = [
  [/\bniet\s+alleen\b[^.;:!?]{0,55}?,?\s*maar\s+ook\b/gi, 'niet alleen X, maar ook Y'],
  [/\bis\s+geen\s+\S+[^.;:!?]{0,55}?,?\s*maar\b/gi, 'is geen X, maar Y'],
  [/\bniet\s+\S+[^.;:!?]{0,40}?,\s*maar\b/gi, 'niet X, maar Y'],
  [/,\s*geen\s+\S+[^.;:!?]{0,35}[.!?]/gi, 'de "X, geen Y"-draai'],
  [/\bgeen\s+\p{L}+,\s*geen\s+\p{L}+/giu, 'het "geen X, geen Y"-paar'],
  [/,\s*geen\s+\p{L}+(?:\s+\p{L}+){0,3}\s*$/giu, 'regel die eindigt op een "geen X"'],
  [/\b(?:dat|dit)\s+is\s+(?:precies|juist)\b/gi, 'dat is precies'],
  [/\bprecies\s+(?:dat|daarom|daar)\b/gi, 'precies dat'],
  [/\bde\s+(?:andere|echte)\s+helft\b/gi, 'de andere helft'],
  [/\bhet\s+gaat\s+erom\b/gi, 'het gaat erom'],
  [/\bin\s+de\s+kern\b/gi, 'in de kern'],
  [/\bniet\s+voor\s+niets\b/gi, 'niet voor niets'],
  [/\bof\s+het\s+nu\b[^.;:!?]{0,45}\bis\s+of\b/gi, 'of het nu X is of Y'],
  [/\b(?:eerlijk gezegd|om eerlijk te zijn)\b/gi, 'eerlijk gezegd'],
  [/\b(?:naadloos|cruciaal|essentieel|onmisbaar|benutten)\b/gi, 'consultancywoord'],
  [/\b(?:duik(?:en)?\s+in|meeslepend|betoverend|adembenemend|bruisend|verscholen|authentieke\s+beleving)\b/gi, 'reisbrochurewoord'],
  [/\bin\s+de\s+wereld\s+van\b/gi, 'in de wereld van'],
  [/\brijke\s+(?:geschiedenis|cultuur)\b/gi, 'rijke geschiedenis'],
]

const DE = [
  [/\bnicht\s+nur\b[^.;:!?]{0,55}?,?\s*sondern(?:\s+auch)?\b/gi, 'nicht nur X, sondern auch Y'],
  [/\bkein\s+\S+[^.;:!?]{0,50}?,?\s*sondern\b/gi, 'kein X, sondern Y'],
  // Bewust niet het kale ", nicht ..." : "Versuch, nicht zu viel mitzunehmen" is gewoon
  // Duits. De tic is de omkering naar een zelfstandig naamwoord, dus die eist een lidwoord.
  [/,\s*(?:kein|keine)\b[^.;:!?]{0,35}[.!?]/gi, 'die "X, kein Y"-Wendung'],
  [/,\s*nicht\s+(?:ein|eine|der|die|das|aus|von|f[üu]r|zum|zur)\b[^.;:!?]{0,35}[.!?]/gi, 'die "X, nicht Y"-Wendung'],
  [/,\s*kein(?:e|en|em)?\s+\p{L}+(?:\s+\p{L}+){0,3}\s*$/giu, 'Zeile, die auf ein "kein X" endet'],
  [/\b(?:genau|eben)\s+(?:das|darin|deshalb|daf[üu]r|dort)\b/gi, 'genau das / genau deshalb'],
  [/\bdas\s+ist\s+genau\b/gi, 'das ist genau'],
  [/\bdie\s+(?:andere|eigentliche)\s+H[äa]lfte\b/gi, 'die andere Haelfte'],
  [/\bes\s+geht\s+(?:darum|um\s+das)\b/gi, 'es geht darum'],
  [/\b(?:ehrlich gesagt|um ehrlich zu sein)\b/gi, 'ehrlich gesagt'],
  [/\b(?:nahtlos|entscheidend|unverzichtbar|essenziell|massgeschneidert|maßgeschneidert)\b/gi, 'Beratersprache'],
  [/\b(?:eintauchen|atemberaubend|pulsierend|verwunschen|verborgene\s+Perle|unvergesslich)\b/gi, 'Reisekatalogwort'],
  [/\bin\s+der\s+Welt\s+(?:der|des|von)\b/gi, 'in der Welt von'],
  [/\breiche\s+(?:Geschichte|Kultur)\b/gi, 'reiche Geschichte'],
]

const FR = [
  [/\bnon\s+seulement\b[^.;:!?]{0,55}?,?\s*mais(?:\s+aussi)?\b/gi, 'non seulement X, mais aussi Y'],
  [/\bil\s+ne\s+s.agit\s+pas\b[^.;:!?]{0,55}?\bmais\b/gi, "il ne s'agit pas de X mais de Y"],
  [/\bn.est\s+pas\s+(?:un|une|le|la)\b[^.;:!?]{0,50}?\bqui\b/gi, 'se definir par ce qu on n est pas'],
  [/,\s*(?:pas|non)\s+(?:un|une|le|la|de|du|celui|celle)\b[^.;:!?]{0,35}[.!?]/gi, 'la tournure "X, pas Y"'],
  [/,\s*(?:pas|aucun|aucune)\s+(?:de\s+)?\p{L}+(?:\s+\p{L}+){0,3}\s*$/giu, 'ligne qui finit sur une negation'],
  [/\bc.est\s+(?:precisement|précisément|exactement)\b/gi, "c'est precisement"],
  [/\bl.autre\s+moiti[ée]\b/gi, "l'autre moitie"],
  [/\b(?:a|à)\s+vrai\s+dire\b/gi, 'a vrai dire'],
  [/\b(?:franchement|honn[êe]tement)\b/gi, 'franchement'],
  [/\b(?:incontournable|essentiel|crucial|sur\s+mesure|transparent)\b/gi, 'mot de consultant'],
  [/\b(?:plonger\s+dans|immersif|immersion|[àa]\s+couper\s+le\s+souffle|v[ée]ritable\s+joyau|pittoresque|effervescent)\b/gi, 'mot de brochure'],
  [/\bau\s+c(?:oe|œ)ur\s+de\b/gi, 'au coeur de'],
  [/\briche\s+(?:histoire|culture|patrimoine)\b/gi, 'riche histoire'],
]

// Roemeens, erbij gekomen 10-10-2026 voor de tweede taal op velvet-cakes-2. Anka is
// Roemeense, dus die copy leest een moedertaalspreker na en niet alleen Google. Dezelfde
// drie soorten: de omkeerdraai, de nadrukformule en de brochurewoorden. Diacritische
// tekens zijn optioneel in de patronen, want een vertaling die ze onderweg kwijtraakt
// ("precis" zonder streepje) moet net zo goed tegen de lat.
const RO = [
  [/\bnu\s+(?:doar|numai)\b[^.;:!?]{0,55}?,?\s*(?:ci|dar)(?:\s+[șs]i)?\b/gi, 'nu doar X, ci si Y'],
  [/\bnu\s+e(?:ste)?\s+(?:un|o|cel|cea)\b[^.;:!?]{0,50}?\bcare\b/gi, 'a te defini prin ce nu esti'],
  [/,\s*nu\s+(?:un|o|cel|cea|de|din|la|pentru)\b[^.;:!?]{0,35}[.!?]/gi, 'turnura "X, nu Y"'],
  [/,\s*(?:f[ăa]r[ăa]|niciun|nicio)\s+\p{L}+(?:\s+\p{L}+){0,3}\s*$/giu, 'rand care se termina pe o negatie'],
  [/\b(?:asta|aceasta|exact)\s+e(?:ste)?\s+(?:exact|precis)\b/gi, 'asta e exact'],
  [/\b(?:exact|tocmai)\s+(?:de\s+asta|de\s+aceea|asta|acolo)\b/gi, 'exact de asta'],
  [/\bcealalt[ăa]\s+jum[ăa]tate\b/gi, 'cealalta jumatate'],
  [/\be\s+vorba\s+despre\b/gi, 'e vorba despre'],
  [/\b(?:sincer|ca\s+s[ăa]\s+fiu\s+sincer|dac[ăa]\s+e\s+s[ăa]\s+fim\s+sinceri)\b/gi, 'sincer / ca sa fiu sincer'],
  [/\b(?:crucial|esen[țt]ial|indispensabil|f[ăa]r[ăa]\s+cusur|impecabil)\b/gi, 'cuvant de consultant'],
  [/\b(?:captivant|fermec[ăa]tor|de\s+neuitat|uluitor|ame[țt]itor|vibrant|efervescent|pitoresc|cuib[ăa]rit)\b/gi, 'cuvant de broșura'],
  [/\bîn\s+lumea\s+\p{L}+/giu, 'in lumea lui X'],
  [/\bo\s+(?:bogat[ăa]|adev[ăa]rat[ăa])\s+(?:istorie|cultur[ăa]|mo[șs]tenire)\b/gi, 'o bogata istorie'],
  [/\bla\s+final(?:ul\s+zilei)?\s*,/gi, 'la final (ca figura de stil)'],
]

const PER_TAAL = { en: EN, nl: NL, de: DE, fr: FR, ro: RO }

/** Platslaan naar [sleutel, tekst] paren, zelfde sleutelvorm als bron.mjs gebruikt. */
export function platteTekst(o, pad = '') {
  return Object.entries(o).flatMap(([k, v]) => {
    const sleutel = pad ? `${pad}.${k}` : k
    if (typeof v === 'string') return [[sleutel, v]]
    if (Array.isArray(v)) {
      return v.flatMap((x, i) =>
        typeof x === 'string'
          ? [[`${sleutel}.${i}`, x]]
          : x && typeof x === 'object' ? platteTekst(x, `${sleutel}.${i}`) : []
      )
    }
    if (v && typeof v === 'object') return platteTekst(v, sleutel)
    return []
  })
}

// Sleutels die geen klantcopy zijn: adressen, taalcodes, afkortingen. Bewust alleen
// aan de wortel: `kort` bovenin is de afkorting EN/NL, maar `tours.<x>.kort` is de
// eenregelige verkoopzin van een tour en dus juist wel copy.
const GEEN_COPY = /^(?:slug|code|hreflang|kort|naam)(?:\.|$)/

/**
 * Keurt de tekstbestanden van een site.
 *
 * @param {object} o
 * @param {Record<string, object>} o.talen      { en: {...}, nl: {...}, ... }
 * @param {Record<string, string>} [o.toegestaan]  sleutel -> reden waarom het mag blijven
 *        Sleutel zonder taalprefix geldt voor alle talen ('licht.0.tijd'), met prefix
 *        voor een ('en:home.h1').
 * @param {boolean} [o.stil]  geen uitvoer op de console
 * @returns {{treffers: Array, ongebruikt: string[]}}
 */
export function aipoort({ talen, toegestaan = {}, stil = false }) {
  const treffers = []
  const geraakt = new Set()

  for (const [code, taal] of Object.entries(talen)) {
    const patronen = [...ALTIJD, ...(PER_TAAL[code] || [])]
    for (const [sleutel, tekst] of platteTekst(taal)) {
      if (GEEN_COPY.test(sleutel)) continue
      for (const [re, naam] of patronen) {
        re.lastIndex = 0
        let m
        while ((m = re.exec(tekst))) {
          const vrij = [`${code}:${sleutel}`, sleutel].find(k => k in toegestaan)
          if (vrij) { geraakt.add(vrij); if (!re.global) break; continue }
          treffers.push({
            taal: code,
            sleutel,
            naam,
            wat: m[0].replace(/\s+/g, ' ').slice(0, 80),
            regel: tekst.slice(0, 160),
          })
          if (!re.global) break
        }
      }
    }
  }

  const ongebruikt = Object.keys(toegestaan).filter(k => !geraakt.has(k))

  if (!stil) {
    const perSoort = new Map()
    for (const t of treffers) perSoort.set(t.naam, (perSoort.get(t.naam) || 0) + 1)
    for (const [naam, n] of [...perSoort].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(n).padStart(3)}x  ${naam}`)
      for (const t of treffers.filter(x => x.naam === naam).slice(0, 6)) {
        console.log(`        ${t.taal} ${t.sleutel}  ->  ${t.wat}`)
      }
    }
    if (ongebruikt.length) {
      console.log(`\n  ai-poort: ${ongebruikt.length} regel(s) in toegestaan raken niets meer:`)
      for (const k of ongebruikt) console.log(`        ${k}`)
    }
  }

  if (treffers.length) {
    throw new Error(
      `ai-poort: ${treffers.length} ai-isme(s) in de copy. Herschrijf de regel, of zet de ` +
      `sleutel in toegestaan met de reden waarom hij blijft staan. Er komt geen site uit ` +
      `tot dit opgelost is.`
    )
  }
  // Een lege toegestaan-regel is geen blokkade maar wel rommel: hij suggereert een
  // uitzondering die niet meer bestaat en dekt de volgende fout toe.
  if (ongebruikt.length) {
    throw new Error(
      `ai-poort: ${ongebruikt.length} regel(s) in toegestaan raken geen enkele tekst meer. ` +
      `Haal ze weg, anders dekken ze straks iets toe wat je niet bedoelde: ${ongebruikt.join(', ')}`
    )
  }

  if (!stil) console.log(`ai-poort: copy schoon in ${Object.keys(talen).length} talen, ${Object.keys(toegestaan).length} geregistreerde uitzondering(en)`)
  return { treffers, ongebruikt }
}
