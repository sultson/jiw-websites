# Merkbestanden

Het logo als vector. Gemaakt door `scripts/merk-vector.mjs`, niet met de hand —
pas dat script aan, draai het opnieuw, bewerk nooit een bestand hier.

Het enige logobestand dat we van Marjon kregen is een lijntekening op wit van
1308x1316. Daar maakte `scripts/bloem-asset.mjs` `public/img/bloem.png` van:
640x640, achtergrond eruit. Prima voor een scherm, onbruikbaar voor al het
andere. Groter dan 640 px wordt hij zacht, een drukker kan er niets mee, en een
andere kleur betekent een nieuw plaatje.

De figuur is de Flower of Life en dus pure meetkunde. Hij is hier nagerekend in
plaats van nagetekend: zeshoekig rooster, de middelpunten een straal uit elkaar,
de 19 cirkels binnen 2x de straal helemaal getekend en de cirkels daarbuiten
alleen voor zover ze binnen die 19 vallen. Omheen een cirkel op 3x de straal, die
de zes buitenste bloembladen precies raakt. `scripts/merk-meet.mjs` meet dat na
in het aangeleverde bestand en legt het resultaat er overheen.

## Wat is er anders dan in het aangeleverde bestand

Drie dingen rechtgezet, allemaal scanruis en geen ontwerp:

1. De buitenste ring was 1,3% ovaal (278,3 x 281,9 px). Nu rond.
2. Die ring stond een halve pixel uit het midden. Nu concentrisch.
3. De lijndikte liep van 4,3 tot 7,0 px. Nu overal gelijk.

Verder is het dezelfde tekening: 96,5% van de oude inkt ligt op de nieuwe, en wat
overblijft zijn precies die drie punten.

De uitsnede is dezelfde als `public/img/bloem.png` (maal 1000/640), dus een PNG
hieruit is inwisselbaar met dat bestand zonder dat het merk op de site van
formaat verandert.

## Welk bestand waarvoor

| Bestand | Waarvoor |
| --- | --- |
| `bloem.svg` | het merkteken, in haar petrol `#316d78`. Dit is het bronbestand. |
| `bloem-eenkleur.svg` | zelfde tekening, kleur volgt de omgeving (`currentColor`). Voor eenkleurdruk, stempels, borduur. |
| `logo-liggend.svg` | merkteken plus naam, naast elkaar |
| `logo-liggend-eenkleur.svg` | idem, in een kleur |
| `bloem.pdf`, `logo-liggend.pdf` | voor de drukker. Vector, 120 mm breed, schaalt tot een gevelbord. |
| `png/bloem-512/1024/2048.png` | doorzichtige achtergrond, voor beeldscherm en social |
| `png/logo-liggend-1024/2048.png` | idem, liggend |
| `png/logo-liggend-1024-room.png` | op haar roomkleur `#f6f4ef`, voor waar transparantie niet kan — oudere Outlook tekent die als een zwart vlak |

Voor drukwerk altijd de SVG of de PDF aanleveren, nooit een PNG.

## Kleuren

| | hex | waar |
| --- | --- | --- |
| petrol | `#316d78` | het merkteken (`--color-bloem`) |
| inkt | `#2b4249` | de naam (`--color-inkt`) |
| room | `#f6f4ef` | achtergrond (`--color-room`) |

## Het woordmerk

De naam staat in echte paden, niet als tekst. Een logo dat een lettertype nodig
heeft is geen logo maar een stuk tekst dat er bij iemand anders anders uitziet.
Lettertype: Cormorant Garamond Light, letterafstand 0,06 em — hetzelfde als
`.merknaam` in `src/index.css`, dus gelijk aan de balk bovenaan de site.

Let op: de header van de bevestigingsmail (`public/logo-email.png`, gemaakt door
`scripts/mail-logo.mjs`) zet diezelfde naam in Quicksand. Dat wijkt dus af van de
site en van deze bestanden. Een van de twee moet wijken; dat is een keuze voor
Marjon, geen bug om stilletjes recht te trekken.

## De downloadpagina

`scripts/merk-publiceren.mjs` (draait mee in `pnpm build`) zet deze bestanden
plus een zip op de site onder `/logo`, met de pagina uit `public/logo/index.html`
ervoor. Dat is het adres dat Marjon krijgt:

    https://bewustgezondinjemond.nl/logo

Op noindex via `public/_headers`, en nergens op de site naar gelinkt. Haar eigen
domein en geen deelmap die verloopt, zodat ze de link over een jaar nog naar een
drukker kan sturen.

De zip wordt elke build opnieuw gemaakt uit de bestanden hier, dus wie `pnpm
merk` draait hoeft daarna niets bij te werken. De tekst in de zip
(`LEES-MIJ.txt`) staat in dat script en is een andere dan dit bestand: hier
staat waarom het logo is zoals het is, daar staat alleen welk bestand waarvoor.

## Wat hier niet staat

Een staand logo (merkteken boven de naam) en een versie in wit voor op een donkere
foto. Allebei een paar regels in het script zodra iemand ze nodig heeft.
