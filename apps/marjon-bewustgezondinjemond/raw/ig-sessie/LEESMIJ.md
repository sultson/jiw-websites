# Fotosessie-carrousel van instagram

Opgehaald 15-10-2026 met `apify/instagram-scraper` uit
`instagram.com/marjon_ooteman_1`, post `DWlQE1yjfSp` (1 april 2026, de
verbindende fotosessie). `f01.webp` t/m `f10.webp` zijn de tien tegels in
volgorde van de carrousel.

## Welke tegel de hero is

De hero is de **linkerhelft van `f06.webp`**, een collage van twee foto's: Marjon
zittend tussen de herfstbladeren bij de berken. Die helft meet 654x1038 binnen de
tegel van 1440x1440; `scripts/hero-glimlach.mjs` snijdt hem er met vaste maten
uit.

**`f01.webp` is een ANDERE foto** - zij lachend bij het water, met het
zwart-witte vest. Die stond hier op 15-10-2026 een uur per ongeluk als hero,
omdat hij wel een eigen tegel is en dus veel groter. Verleidelijk en fout.

Dit verving de bron die er tot 15-10-2026 lag: een schermafdruk van deze collage
(730x1182). Die heeft meer beeldpunten dan de tegelhelft, maar het is een
opgerekte weergave van datzelfde bestand en dus zachter: laplace-variantie 27
tegen 46.

**Dit is nog steeds niet het origineel.** Instagram comprimeert en levert
maximaal 1440 breed uit. Het bestand van de fotograaf is beter. De foto's zijn
van de fotograaf van de verbindende fotosessie, niet van Marjon zelf - wie ze
buiten haar eigen site gebruikt, vraagt dat daar na.
