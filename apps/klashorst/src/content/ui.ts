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
    werk: 'Klashorst Collectie',
    peter: 'De Kunstenaar',
    galerie: 'Andere Kunst',
    blog: 'Dirty Diaries',
    bezoek: 'Bezoek Museum',
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
  lightbox: {
    sluiten: 'Sluiten',
    vorige: 'Vorige',
    volgende: 'Volgende',
  },
  vraag: {
    knop: 'Stel een vraag',
    formTitel: 'Stel een vraag',
    uitleg: 'Laat uw gegevens achter, dan neemt het museum contact met u op.',
    naam: 'Naam',
    email: 'E-mailadres',
    bericht: 'Bericht',
    berichtPlaceholder: 'Waar gaat uw vraag over?',
    versturen: 'Vraag versturen',
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
};

export type Ui = typeof nl;

const en: Ui = {
  nav: {
    werk: 'Klashorst Collection',
    peter: 'The Artist',
    galerie: 'Other Art',
    // The blog's own name, so it reads the same in both languages.
    blog: 'Dirty Diaries',
    bezoek: 'Visit Museum',
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
  lightbox: {
    sluiten: 'Close',
    vorige: 'Previous',
    volgende: 'Next',
  },
  vraag: {
    knop: 'Ask a question',
    formTitel: 'Ask a question',
    uitleg: 'Leave your details and the museum will get in touch with you.',
    naam: 'Name',
    email: 'Email address',
    bericht: 'Message',
    berichtPlaceholder: 'What is your question about?',
    versturen: 'Send question',
    bezig: 'Sending',
    gelukt: 'Thank you. The museum will be in touch.',
    mislukt: 'Something went wrong. Please try again.',
    annuleren: 'Cancel',
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
};

export const uiPerTaal: Record<Lang, Ui> = { nl, en };
