# Fotosessie-carrousel van instagram

Opgehaald 15-10-2026 met `apify/instagram-scraper` uit
`instagram.com/marjon_ooteman_1`, post `DWlQE1yjfSp` (1 april 2026, de
verbindende fotosessie). `f01.webp` t/m `f10.webp` zijn de tien tegels in
volgorde van de carrousel.

`f01.webp` is de lachende foto die de hero van de site is. Instagram levert hem
uit als 1440x1440 met een witte rand; het beeld zelf is 999x1381 echte
beeldpunten. `scripts/hero-glimlach.mjs` snijdt die rand er zelf af met `trim()`.

Dit verving de bron die er tot 15-10-2026 lag: een schermafdruk van deze post
(732x1182), die twee keer door een opschaler moest en daardoor een gladde,
tekeningloze huid gaf.

**Dit is nog steeds niet het origineel.** Instagram comprimeert en levert
maximaal 1440 breed uit. Het bestand van de fotograaf is beter. De foto's zijn
van de fotograaf van de verbindende fotosessie, niet van Marjon zelf - wie ze
buiten haar eigen site gebruikt, vraagt dat daar na.
