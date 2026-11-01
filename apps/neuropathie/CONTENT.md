# Voetreflexologie bij neuropathie — herkomst van de tekst

Alle lopende tekst op deze site komt van Lydia van der Bie zelf (via Armando, WhatsApp,
01-11-2026). Zij schreef hem in vier delen; die vier zijn op de pagina de vier secties:

| Haar deel | Sectie op de site | Component |
| --- | --- | --- |
| Algemene informatie | `#neuropathie` | `WatIsNeuropathie.tsx` |
| Gericht aan cliënten | `#clienten` + `#overzicht` | `VoorClienten.tsx`, `Overzicht.tsx` |
| Gericht aan voetreflextherapeuten | `#therapeuten` | `VoorTherapeuten.tsx` |
| Ontstaan | `#ontstaan` | `Ontstaan.tsx` |

## Woordelijk overgenomen, niet aanpassen

Twee alinea's in `VoorClienten.tsx` staan er letterlijk zoals zij ze schreef, omdat ze daar
precies afbakent wat de behandeling wel en niet doet:

- "Naast de reguliere zorg kan voetreflexologie ... kunnen periodieke behandelingen wenselijk zijn."
- "Voetreflexologie geneest neuropathie niet en herstelt geen beschadigde zenuwen. ..."

Plus de losse regel **"Bespreek deze klachten altijd eerst met uw arts."**, die daarom ook
visueel apart staat. Deze drie niet herschrijven, niet inkorten en niet positiever maken.

Ook woordelijk: de vijf leerdoelen in `data/content.ts`, de zin "Samen maken we het
verschil." en het hele Ontstaan-verhaal (ik-vorm, zij aan het woord).

De aanspreekvorm wisselt bewust mee met haar tekst: **u** voor cliënten, **jij** voor
therapeuten.

## Wat van mij is en niet van haar

Kort en benoemd, zodat het bij een nalezing meteen te vinden is:

- De drie kaartjes Lichamelijk / Emotioneel / Mentaal zijn mijn uitwerking van haar zin
  "lichamelijke, emotionele en mentale gevolgen". Geen nieuwe feiten, wel mijn woorden.
- De koppen, de knopteksten en de tekst in het blok "Netwerk in opbouw".
- De contact- en foutpagina.
- De klachtenlijst is exact haar vier klachten, niets toegevoegd.

## Beeld

Geleend uit `apps/lydiavanderbie/public/` (zelfde eigenaar): haar portret, de hero en de
voetbehandeling. Geen AI-beeld. Eigen foto's van haar praktijk zijn welkom als vervanging.

## Nog open

1. **Het therapeutenoverzicht bestaat niet.** `therapeuten` in `src/data/content.ts` is een
   lege lijst. Zolang die leeg is toont `Overzicht.tsx` het blok "Netwerk in opbouw" met een
   formulierknop in plaats van een lege pagina; zodra er namen in staan, schakelt dezelfde
   component vanzelf over op kaartjes. Nodig per therapeut: naam, plaats, provincie, en
   telefoon of website.
2. **De site staat op noindex** (`public/_headers`). Dat is bewust: hij is nog niet door
   Lydia goedgekeurd en het overzicht is nog leeg. Eén regel weghalen maakt hem
   indexeerbaar.
3. Eigen contactgegevens voor deze site? Nu staan die van lydiavanderbie.nl erop, bevestigd
   door Armando op 01-11-2026.
