# Het oude patientendeel (gearchiveerd 10-10-2026)

Marjon stopt met de behandelpraktijk en doet alleen nog online coaching
(Armando, 10-10-2026). Daarmee vervalt alles wat over een patientendossier gaat:
de twintig jaar bewaarplicht, de toestemming voor de tandarts, de huurruimte bij
Mondzorg Schagen en het intakeformulier met de drie vinkjes.

Wat hier staat:

- `privacyverklaring.tsx` + `verklaring-tekst.js` : de pagina /privacyverklaring
  zoals die er stond. Niet meer in de site. Dat adres komt nu uit op de nieuwe
  privacyverklaring op /privacy.
- `privacyverklaring-bewust-gezond-in-je-mond.pdf` : het document dat patienten
  bij hun eerste afspraak kregen.
- `intakeformulier-vinkjes-bewust-gezond-in-je-mond.pdf` : de drie vinkjes.

Deze twee pdf's stonden in `public/` en waren dus publiek op te vragen. Ze zijn
hier naartoe verplaatst in plaats van weggegooid: ze beschrijven dingen die niet
meer kloppen (een behandelpraktijk die er niet meer is), maar als er alsnog een
intake voor de coaching nodig is, is dit het beste vertrekpunt.

`scripts/verklaring-pdf.mjs` en `scripts/kijk-verklaring.mjs` maakten die pdf's.
Die werken nu niet meer, want ze lezen `src/verklaring-tekst.js`. Laat staan tot
duidelijk is of er een intakedocument voor de coaching komt.
