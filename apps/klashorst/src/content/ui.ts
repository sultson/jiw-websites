import type { Lang } from '../meta';

/**
 * What the interface calls its own parts, in both languages.
 *
 * Only mechanism lives here now: the word on a close button, the name a screen
 * reader is given for an untitled work, the "Bezig" a button shows while it is
 * sending. Everything the museum might want to word differently — the menu,
 * the section headings, the button on each form, what a visitor reads once a
 * form has gone through, the empty states, the 404 — moved into the Studio.
 *
 * The line is whether changing it is an editorial decision or a change to how
 * the site works. Nothing here is rendered from the CMS, so nothing here can
 * go blank when a box is emptied.
 */

const nl = {
  nav: {
    menu: 'Menu',
    sluiten: 'Sluiten',
    taal: 'Taal',
  },
  zaal: {
    terug: 'Terug naar het museum',
  },
  werk: {
    vergroot: 'Vergroot',
    // Never on screen: the name a screen reader is given for a work that has
    // no title of its own.
    zonderTitel: 'Werk zonder titel',
  },
  lightbox: {
    sluiten: 'Sluiten',
    vorige: 'Vorige',
    volgende: 'Volgende',
  },
  vraag: {
    naam: 'Naam',
    email: 'E-mailadres',
    bericht: 'Bericht',
    berichtPlaceholder: 'Waar gaat uw vraag over?',
    bezig: 'Bezig',
    mislukt: 'Er ging iets mis. Probeer het opnieuw.',
  },
  blog: {
    lees: 'Lees verder',
    alles: 'Alle berichten',
    terug: 'Terug naar de blog',
    verder: 'Verder lezen',
    naarMuseum: 'Naar het museum',
    onvertaald: '',
  },
  nieuwsbrief: {
    naam: 'Naam',
    naamPlaceholder: 'Optioneel',
    email: 'E-mailadres',
    emailPlaceholder: 'u@voorbeeld.nl',
    bezig: 'Bezig',
    mislukt: 'Er ging iets mis. Probeer het opnieuw.',
  },
};

export type Ui = typeof nl;

const en: Ui = {
  nav: {
    menu: 'Menu',
    sluiten: 'Close',
    taal: 'Language',
  },
  zaal: {
    terug: 'Back to the museum',
  },
  werk: {
    vergroot: 'Enlarge',
    zonderTitel: 'Untitled work',
  },
  lightbox: {
    sluiten: 'Close',
    vorige: 'Previous',
    volgende: 'Next',
  },
  vraag: {
    naam: 'Name',
    email: 'Email address',
    bericht: 'Message',
    berichtPlaceholder: 'What is your question about?',
    bezig: 'Sending',
    mislukt: 'Something went wrong. Please try again.',
  },
  blog: {
    lees: 'Read more',
    alles: 'All posts',
    terug: 'Back to the journal',
    verder: 'Read next',
    naarMuseum: 'To the museum',
    onvertaald: 'This post has not been translated yet and is shown in Dutch.',
  },
  nieuwsbrief: {
    naam: 'Name',
    naamPlaceholder: 'Optional',
    email: 'Email address',
    emailPlaceholder: 'you@example.com',
    bezig: 'Sending',
    mislukt: 'Something went wrong. Please try again.',
  },
};

export const uiPerTaal: Record<Lang, Ui> = { nl, en };
