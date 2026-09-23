import type { Content } from '../content/types';
export const interfaceDefaults = {
  contactTitle: 'Een kennismaking aanvragen',
  contactIntro: 'Laat je naam en e-mailadres achter. We nemen contact met je op om samen een moment af te spreken.',
  contactSubmit: 'Kennismaking aanvragen',
  nameLabel: 'Je naam', emailLabel: 'Je e-mailadres',
  formPrivacy: 'Je hoeft hier geen medische informatie of persoonlijk verhaal te delen.',
  privacyIntro: 'Lees hoe we met je gegevens omgaan in onze', privacyLink: 'privacyverklaring',
  successTitle: 'Dank je wel, je bericht is verstuurd',
  successText: 'Een van onze vrijwilligers neemt contact met je op.',
  formError: 'Het versturen lukte niet. Probeer het zo nog eens, of bel ons gerust, dan regelen we het meteen.',
  alternativeContact: 'Liever bellen of mailen? Dat kan ook:',
  signupTitle: 'Meld je aan', signupSubmit: 'Aanmelden',
  signupIntro: 'Vul je naam en e-mailadres in. Je ontvangt eerst een ontvangstbevestiging. Je plek is definitief zodra wij je deelname hebben bevestigd.',
  signupSuccessTitle: 'Je aanmelding is ontvangen',
  signupSuccessText: 'Je plek is definitief zodra wij je deelname hebben bevestigd.',
  dateLabel: 'Datum en tijd', locationLabel: 'Locatie', contributionLabel: 'Bijdrage',
  full: 'Deze sessie is volgeboekt. Neem contact op voor een volgende gelegenheid.',
  noSignup: 'Opgeven is niet nodig. Je bent welkom.',
  signupLink: 'Aanmelden voor deze activiteit', externalSignup: 'Aanmelden of meer informatie',
  upcomingTitle: 'Volgende momenten', noDateTitle: 'Vraag naar een volgende datum',
  noDate: 'Er is nog geen volgende bijeenkomst bevestigd in onze agenda.',
  contactLink: 'Neem contact op', allActivities: 'Alle activiteiten',
  directions: 'Bekijk hoe je er komt',
  noMatches: 'Er zijn geen activiteiten gevonden met deze selectie.', resetFilters: 'Wis filters',
  videoPrivacy: 'De video laadt pas als je toestemming geeft. YouTube ontvangt dan je IP-adres en kan gegevens op je apparaat opslaan.',
  videoAllow: 'Toestaan en video afspelen', videoRevoke: 'Video sluiten en toestemming intrekken',
  videoExternal: 'Bekijk op YouTube',
};
export type InterfaceCopy = typeof interfaceDefaults;
export function interfaceCopy(content: Content): InterfaceCopy {
  const rows = content.pages?.find(p => p.path === '@interface')?.texts ?? [];
  return Object.fromEntries(Object.entries(interfaceDefaults).map(([key, value]) => [key, rows.find(r => r._key === key)?.text ?? value])) as InterfaceCopy;
}

export const interfaceLabels: Record<keyof InterfaceCopy, string> = {
  contactTitle:'Kennismaken · kop', contactIntro:'Kennismaken · uitleg', contactSubmit:'Kennismaken · verzendknop',
  nameLabel:'Formulier · naamveld', emailLabel:'Formulier · e-mailveld', formPrivacy:'Formulier · geen medische informatie',
  privacyIntro:'Formulier · privacytoelichting', privacyLink:'Formulier · link naar privacy',
  successTitle:'Kennismaken · bevestigingskop', successText:'Kennismaken · bevestiging', formError:'Formulier · foutmelding',
  alternativeContact:'Formulier · liever bellen of mailen', signupTitle:'Aanmelden · kop', signupSubmit:'Aanmelden · verzendknop',
  signupIntro:'Aanmelden · uitleg over bevestiging', signupSuccessTitle:'Aanmelden · ontvangstkop', signupSuccessText:'Aanmelden · ontvangsttekst',
  dateLabel:'Activiteit · datum en tijd', locationLabel:'Activiteit · locatie', contributionLabel:'Activiteit · bijdrage',
  full:'Activiteit · volgeboekt', noSignup:'Activiteit · vrije inloop', signupLink:'Activiteit · eigen aanmeldformulier', externalSignup:'Activiteit · externe aanmelding',
  upcomingTitle:'Activiteit · volgende momenten', noDateTitle:'Activiteit · geen datum (kop)', noDate:'Activiteit · geen datum (tekst)',
  contactLink:'Algemeen · contactknop', allActivities:'Activiteit · terug naar agenda', directions:'Activiteit · bereikbaarheid',
  noMatches:'Agenda · geen resultaten', resetFilters:'Agenda · filters wissen', videoPrivacy:'Video · privacytoelichting',
  videoAllow:'Video · toestemmingsknop', videoRevoke:'Video · toestemming intrekken', videoExternal:'Video · YouTube-link',
};
