/**
 * Interface labels. Deliberately not in the CMS: these are part of how the site
 * works, not part of what the museum has to say. Keeping them out leaves the
 * editing surface to actual copy.
 */
export const ui = {
  nav: {
    zaal: 'De zaal',
    werk: 'Werk',
    peter: 'Peter',
    s21: 'S21',
    galerie: 'Galerie',
    blog: 'Blog',
    bezoek: 'Bezoek',
    cta: 'Nieuwsbrief',
    menu: 'Menu',
    sluiten: 'Sluiten',
  },
  zaal: {
    terug: 'Terug naar de zaal',
  },
  werk: {
    vergroot: 'Vergroot',
  },
  lightbox: {
    sluiten: 'Sluiten',
    vorige: 'Vorige',
    volgende: 'Volgende',
  },
  galerie: {
    status: {
      'te-huur': 'Te huur',
      'te-koop': 'Te koop',
      'huur-en-koop': 'Te huur en te koop',
      verkocht: 'Verkocht',
    },
    prijs: 'Vraagprijs',
    huurprijs: 'Huur',
    interesse: 'Interesse in dit werk',
    formTitel: 'Interesse',
    naam: 'Naam',
    email: 'E-mailadres',
    bericht: 'Bericht',
    berichtPlaceholder: 'Optioneel',
    versturen: 'Versturen',
    bezig: 'Bezig',
    gelukt: 'Dank u. Het museum neemt contact met u op.',
    mislukt: 'Er ging iets mis. Probeer het opnieuw.',
    annuleren: 'Annuleren',
  },
  blog: {
    lees: 'Lees verder',
    alles: 'Alle berichten',
    terug: 'Terug naar de blog',
    verder: 'Verder lezen',
    leeg: 'Het eerste bericht staat er nog niet. Zodra er nieuws is, komt het hier te staan.',
    naarMuseum: 'Naar het museum',
  },
  nietGevonden: {
    titel: 'Deze pagina bestaat niet',
    tekst: 'Het bericht is verplaatst of het adres klopt niet helemaal.',
  },
  nieuwsbrief: {
    naam: 'Naam',
    naamPlaceholder: 'Optioneel',
    email: 'E-mailadres',
    emailPlaceholder: 'u@voorbeeld.nl',
    versturen: 'Aanmelden',
    bezig: 'Bezig',
    gelukt: 'Dank u. U hoort van ons zodra er nieuws is.',
    mislukt: 'Er ging iets mis. Probeer het opnieuw.',
  },
  footer: {
    collectie: 'Collectie',
    over: 'Over',
  },
} as const;
