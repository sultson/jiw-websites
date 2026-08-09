import type { Lang } from '../meta';

/**
 * Interface labels, in both languages. Deliberately not in the CMS: these are
 * part of how the site works, not part of what the museum has to say. Keeping
 * them out leaves the editing surface to actual copy, and means the English
 * site is complete the moment it exists rather than waiting on someone to fill
 * in forty boxes.
 */

const nl = {
  nav: {
    museum: 'Het museum',
    over: 'Over ons',
    werk: 'Werk',
    peter: 'Peter',
    s21: 'S21',
    galerie: 'Galerie',
    blog: 'Blog',
    bezoek: 'Bezoek',
    cta: 'Nieuwsbrief',
    menu: 'Menu',
    sluiten: 'Sluiten',
    taal: 'Taal',
  },
  zaal: {
    terug: 'Terug naar het museum',
  },
  werk: {
    vergroot: 'Vergroot',
  },
  beschikbaar: {
    teKoop: 'Te koop',
    teHuur: 'Te huur',
    koopEnHuur: 'Te koop / te huur',
    verkocht: 'Verkocht',
  },
  lightbox: {
    sluiten: 'Sluiten',
    vorige: 'Vorige',
    volgende: 'Volgende',
  },
  offerte: {
    knop: 'Offerte aanvragen',
    algemeen: 'Stel een vraag',
    formTitel: 'Offerte aanvragen',
    uitleg: 'Laat uw gegevens achter, dan stuurt het museum u een prijs en de mogelijkheden.',
    naam: 'Naam',
    email: 'E-mailadres',
    bericht: 'Bericht',
    berichtPlaceholder: 'Optioneel. Bijvoorbeeld: kopen of huren, en vanaf wanneer.',
    versturen: 'Aanvraag versturen',
    bezig: 'Bezig',
    gelukt: 'Dank u. Het museum neemt contact met u op.',
    mislukt: 'Er ging iets mis. Probeer het opnieuw.',
    annuleren: 'Annuleren',
  },
  galerie: {
    prijs: 'Vraagprijs',
    huurprijs: 'Huur',
  },
  blog: {
    lees: 'Lees verder',
    alles: 'Alle berichten',
    terug: 'Terug naar de blog',
    verder: 'Verder lezen',
    leeg: 'Het eerste bericht staat er nog niet. Zodra er nieuws is, komt het hier te staan.',
    naarMuseum: 'Naar het museum',
    onvertaald: '',
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
};

export type Ui = typeof nl;

const en: Ui = {
  nav: {
    museum: 'The museum',
    over: 'About us',
    werk: 'Work',
    peter: 'Peter',
    s21: 'S21',
    galerie: 'Gallery',
    blog: 'Journal',
    bezoek: 'Visit',
    cta: 'Newsletter',
    menu: 'Menu',
    sluiten: 'Close',
    taal: 'Language',
  },
  zaal: {
    terug: 'Back to the museum',
  },
  werk: {
    vergroot: 'Enlarge',
  },
  beschikbaar: {
    teKoop: 'For sale',
    teHuur: 'For hire',
    koopEnHuur: 'For sale / for hire',
    verkocht: 'Sold',
  },
  lightbox: {
    sluiten: 'Close',
    vorige: 'Previous',
    volgende: 'Next',
  },
  offerte: {
    knop: 'Request a quote',
    algemeen: 'Ask a question',
    formTitel: 'Request a quote',
    uitleg: 'Leave your details and the museum will send you a price and the options.',
    naam: 'Name',
    email: 'Email address',
    bericht: 'Message',
    berichtPlaceholder: 'Optional. For instance: buying or hiring, and from when.',
    versturen: 'Send request',
    bezig: 'Sending',
    gelukt: 'Thank you. The museum will be in touch.',
    mislukt: 'Something went wrong. Please try again.',
    annuleren: 'Cancel',
  },
  galerie: {
    prijs: 'Asking price',
    huurprijs: 'Hire',
  },
  blog: {
    lees: 'Read more',
    alles: 'All posts',
    terug: 'Back to the journal',
    verder: 'Read next',
    leeg: 'The first post is not there yet. As soon as there is news, it will appear here.',
    naarMuseum: 'To the museum',
    onvertaald: 'This post has not been translated yet and is shown in Dutch.',
  },
  nietGevonden: {
    titel: 'This page does not exist',
    tekst: 'The post has moved, or the address is not quite right.',
  },
  nieuwsbrief: {
    naam: 'Name',
    naamPlaceholder: 'Optional',
    email: 'Email address',
    emailPlaceholder: 'you@example.com',
    versturen: 'Sign up',
    bezig: 'Sending',
    gelukt: 'Thank you. You will hear from us as soon as there is news.',
    mislukt: 'Something went wrong. Please try again.',
  },
  footer: {
    collectie: 'Collection',
    over: 'About',
  },
};

export const uiPerTaal: Record<Lang, Ui> = { nl, en };

/**
 * The label under a work: nothing at all, one of the two, or both. The absence
 * of a label is the third state, so a work nobody is selling says nothing
 * rather than saying "not for sale".
 */
export function beschikbaarLabel(
  work: { teKoop: boolean; teHuur: boolean; verkocht: boolean },
  ui: Ui,
): string | null {
  if (work.verkocht) return ui.beschikbaar.verkocht;
  if (work.teKoop && work.teHuur) return ui.beschikbaar.koopEnHuur;
  if (work.teKoop) return ui.beschikbaar.teKoop;
  if (work.teHuur) return ui.beschikbaar.teHuur;
  return null;
}

/** Whether a quote can be asked for at all: something is on offer and it is still here. */
export const teVragen = (work: { teKoop: boolean; teHuur: boolean; verkocht: boolean }): boolean =>
  !work.verkocht && (work.teKoop || work.teHuur);
