export type Lang = 'nl' | 'en';

/** Dutch is the source of truth; the English map has to match its shape. */
const nl = {
    nav: {
      room: 'De zaal',
      work: 'Werk',
      peter: 'Peter',
      s21: 'S21',
      news: 'Nieuws',
      visit: 'Bezoek',
      cta: 'Nieuwsbrief',
      menu: 'Menu',
      close: 'Sluiten',
    },
    hero: {
      years: '1957 / 2024',
      title: 'Peter Klashorst',
      tagline: 'Lust for Life',
      lead: 'Schilder, fotograaf en muzikant. Ruim veertig jaar werk, gemaakt in Amsterdam, West-Afrika en Zuidoost-Azië.',
      collection: 'Bekijk het werk',
    },
    room: {
      back: 'Terug naar de zaal',
    },
    work: {
      eyebrow: 'Collectie',
      title: 'Het werk',
      lead: 'Techniek en afmetingen komen uit de opgave van de nalatenschap.',
      open: 'Vergroot',
    },
    peter: {
      eyebrow: 'De schilder',
      title: 'Peter Klashorst',
      body: [
        'Peter van de Klashorst wordt in 1957 geboren in Santpoort en studeert van 1976 tot 1981 aan de Gerrit Rietveld Academie. In de jaren tachtig hoort hij bij de Nieuwe Wilden, de generatie die het figuratieve schilderen terughaalt.',
        'In 1982 ontvangt hij de Buning Brongers Prijs, in 1983 de Koninklijke Subsidie voor Vrije Schilderkunst. Hij speelt in de bands Interior en Soviet Sex. In 1987 is hij medeoprichter van het internationale kunstenaarscollectief After Nature.',
        'Vanaf de jaren negentig werkt hij grote delen van het jaar buiten Nederland: Senegal, Gambia, Kenia, Cambodja en Thailand. Dat werk oogst evenveel bewondering als scherpe kritiek. In 2011 verschijnt zijn autobiografie Kunstkannibaal.',
        'Peter Klashorst overlijdt op 11 september 2024 in Amsterdam, 67 jaar oud.',
      ],
      factsTitle: 'In het kort',
      facts: [
        ['1957', 'Geboren in Santpoort'],
        ['1976 / 1981', 'Gerrit Rietveld Academie'],
        ['1983', 'Koninklijke Subsidie voor Vrije Schilderkunst'],
        ['1987', 'Medeoprichter van After Nature'],
        ['2011', 'Autobiografie Kunstkannibaal'],
        ['2024', 'Overleden in Amsterdam'],
      ],
      portraitCredit: 'Foto: Michael Klinkhamer',
    },
    s21: {
      eyebrow: 'Reeks',
      title: 'S21',
      lead: 'In Phnom Penh schilderde Klashorst portretten naar de politiefoto’s die de Rode Khmer maakte van gevangenen in Tuol Sleng, de gevangenis S21. In 2011 waren die portretten daar te zien, in het Tuol Sleng Genocide Museum zelf, met steun van UNESCO.',
      body: 'Vier doeken uit die reeks horen bij deze collectie. Klashorst zette de gezichten neer in grijstinten en bracht daarna kleur aan.',
      view: 'Bekijk de reeks',
    },
    news: {
      eyebrow: 'Nieuws',
      title: 'Nieuws en archief',
      lead: 'Berichten uit het archief van de schilder. Nieuwe aankondigingen komen hier te staan.',
    },
    visit: {
      eyebrow: 'Bezoek',
      title: 'Plan uw bezoek',
      lead: 'Deze gegevens staan nog niet vast. Zodra ze bekend zijn, komen ze hier te staan en gaan ze mee in de nieuwsbrief.',
      rows: [
        ['Adres', 'Volgt'],
        ['Openingstijden', 'Volgt'],
        ['Entree', 'Volgt'],
      ],
      note: 'Wilt u weten wanneer het museum opengaat? Laat uw e-mailadres achter.',
    },
    newsletter: {
      eyebrow: 'Nieuwsbrief',
      title: 'Blijf op de hoogte',
      lead: 'Een bericht bij de opening, bij nieuwe tentoonstellingen en bij nieuw werk in de collectie. Niet vaker.',
      name: 'Naam',
      namePlaceholder: 'Optioneel',
      email: 'E-mailadres',
      emailPlaceholder: 'u@voorbeeld.nl',
      submit: 'Aanmelden',
      sending: 'Bezig',
      success: 'Dank u. U hoort van ons zodra er nieuws is.',
      error: 'Er ging iets mis. Probeer het opnieuw.',
      consent: 'Alleen museumnieuws. Uw adres gaat niet naar anderen.',
    },
    footer: {
      collection: 'Collectie',
      about: 'Over',
      rights: 'Werk van Peter Klashorst',
      demo: 'Dit is een conceptversie.',
    },
    lightbox: {
      close: 'Sluiten',
      prev: 'Vorige',
      next: 'Volgende',
    },
};

export type Copy = typeof nl;

const en: Copy = {
    nav: {
      room: 'The room',
      work: 'Work',
      peter: 'Peter',
      s21: 'S21',
      news: 'News',
      visit: 'Visit',
      cta: 'Newsletter',
      menu: 'Menu',
      close: 'Close',
    },
    hero: {
      years: '1957 / 2024',
      title: 'Peter Klashorst',
      tagline: 'Lust for Life',
      lead: 'Painter, photographer and musician. Over forty years of work, made in Amsterdam, West Africa and Southeast Asia.',
      collection: 'See the work',
    },
    room: {
      back: 'Back to the room',
    },
    work: {
      eyebrow: 'Collection',
      title: 'The work',
      lead: 'Medium and dimensions come as the estate records them.',
      open: 'Enlarge',
    },
    peter: {
      eyebrow: 'The painter',
      title: 'Peter Klashorst',
      body: [
        'Peter van de Klashorst was born in Santpoort in 1957 and studied at the Gerrit Rietveld Academie from 1976 to 1981. In the eighties he belonged to the Nieuwe Wilden, the generation that brought figurative painting back.',
        'He received the Buning Brongers Prize in 1982 and the Royal Award for Painting in 1983. He played in the bands Interior and Soviet Sex. In 1987 he co-founded the international artist collective After Nature.',
        'From the nineties onward he spent much of each year outside the Netherlands: Senegal, Gambia, Kenya, Cambodia and Thailand. That work drew admiration and sharp criticism in equal measure. His autobiography Kunstkannibaal appeared in 2011.',
        'Peter Klashorst died in Amsterdam on 11 September 2024, aged 67.',
      ],
      factsTitle: 'In brief',
      facts: [
        ['1957', 'Born in Santpoort'],
        ['1976 / 1981', 'Gerrit Rietveld Academie'],
        ['1983', 'Royal Award for Painting'],
        ['1987', 'Co-founded After Nature'],
        ['2011', 'Autobiography Kunstkannibaal'],
        ['2024', 'Died in Amsterdam'],
      ],
      portraitCredit: 'Photo: Michael Klinkhamer',
    },
    s21: {
      eyebrow: 'Series',
      title: 'S21',
      lead: 'In Phnom Penh, Klashorst painted portraits after the police photographs the Khmer Rouge took of prisoners at Tuol Sleng, the S21 prison. In 2011 those portraits were shown there, inside the Tuol Sleng Genocide Museum, with support from UNESCO.',
      body: 'Four canvases from that series belong to this collection. Klashorst laid the faces down in greys and then brought colour across them.',
      view: 'View the series',
    },
    news: {
      eyebrow: 'News',
      title: 'News and archive',
      lead: 'Entries from the painter’s archive. New announcements will appear here.',
    },
    visit: {
      eyebrow: 'Visit',
      title: 'Plan your visit',
      lead: 'These details are not fixed yet. As soon as they are, they appear here and go out in the newsletter.',
      rows: [
        ['Address', 'To follow'],
        ['Opening hours', 'To follow'],
        ['Admission', 'To follow'],
      ],
      note: 'Want to know when the museum opens? Leave your email address.',
    },
    newsletter: {
      eyebrow: 'Newsletter',
      title: 'Stay informed',
      lead: 'One message when the museum opens, when there is a new exhibition and when new work enters the collection. No more than that.',
      name: 'Name',
      namePlaceholder: 'Optional',
      email: 'Email address',
      emailPlaceholder: 'you@example.com',
      submit: 'Sign up',
      sending: 'Sending',
      success: 'Thank you. You will hear from us as soon as there is news.',
      error: 'Something went wrong. Please try again.',
      consent: 'Museum news only. Your address goes to no one else.',
    },
    footer: {
      collection: 'Collection',
      about: 'About',
      rights: 'Work by Peter Klashorst',
      demo: 'This is a concept version.',
    },
    lightbox: {
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
    },
};

export const translations: Record<Lang, Copy> = { nl, en };
