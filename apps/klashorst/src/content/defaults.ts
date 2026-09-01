import { BLOG_TITLE, HOME_DESCRIPTION, HOME_TITLE, type Lang } from '../meta';
import { samenvatten } from './rich';
import type { BlogPost, Content, Img, RichBlock, Werk } from './types';

/**
 * The site as it stands without a CMS behind it, in both languages.
 *
 * Two jobs. It is what renders when Sanity is unreachable or not yet wired up,
 * so the museum is never a blank page. And it is the source the seed script
 * imports into Sanity, so the first thing the client sees in the Studio is
 * their own site rather than an empty form.
 *
 * Everything here is sourced: biography from Wikipedia and the estate's own
 * copy, medium and dimensions quoted from the catalogue at peterklashorst.com.
 * Opening hours and admission do not exist yet and say so. Nothing on the site
 * is for sale or for hire: the museum shows work, it does not trade in it.
 */

/** The same sentence in both languages. */
type Vertaald = Record<Lang, string>;
const beide = (nl: string, en: string): Vertaald => ({ nl, en });

/** A work photographed in three prepared sizes under public/art. */
const local = (slug: string, ratio: number): Img => ({
  ratio,
  grid: `/art/${slug}.webp`,
  room: `/art/${slug}-room.webp`,
  full: `/art/${slug}-full.webp`,
});

/** A photograph that exists in one size only. */
const single = (path: string, ratio: number): Img => ({ ratio, grid: path, room: path, full: path });

/** Paragraphs, shaped the way the Studio's text editor stores them. */
const alineas = (id: string, ...paragrafen: string[]): RichBlock[] =>
  paragrafen.map((tekst, index) => ({
    _type: 'block',
    _key: `${id}-${index}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${id}-${index}-0`, text: tekst, marks: [] }],
  }));

/**
 * The collection, written once. Only the words differ between the two
 * languages, so only the words are stated twice.
 *
 * Order matters: this is the order of the collection grid, and the works
 * flagged inZaal hang around the room in this order too.
 */
type WerkBron = Omit<Werk, 'titel' | 'techniek' | 'toelichting'> & {
  titel: string;
  techniek: Vertaald;
  toelichting?: Vertaald;
};

const doek = beide('Acrylverf op doek', 'Acrylic on canvas');
const olieDoek = beide('Olieverf op doek', 'Oil on canvas');
const pvc = beide('Acrylverf op pvc', 'Acrylic on PVC');
const oliePvc = beide('Olie- en acrylverf op pvc', 'Oil and acrylic on PVC');

const werkBronnen: WerkBron[] = [
  {
    id: 'pearl-earring',
    titel: 'Pearl With A Pearl Earring',
    techniek: doek,
    afmetingen: '180 × 150 cm',
    toelichting: beide(
      'Klashorst nam de westerse kunstgeschiedenis herhaaldelijk onder handen. Hier is het Meisje met de parel de aanleiding.',
      'Klashorst took on Western art history again and again. Here the Girl with a Pearl Earring is the starting point.',
    ),
    inZaal: true,
    img: local('pearl-earring', 0.76),
  },
  {
    id: 'two-ladies-1984',
    titel: 'Two Ladies 1984',
    techniek: olieDoek,
    afmetingen: '160 × 180 cm',
    toelichting: beide(
      'Vroeg werk uit 1984, de jaren van de Nieuwe Wilden.',
      'Early work from 1984, the years of the Nieuwe Wilden.',
    ),
    inZaal: true,
    img: local('two-ladies-1984', 0.87),
  },
  {
    id: 'marlboro-man-rob',
    titel: 'Marlboro Man Rob',
    techniek: pvc,
    afmetingen: '180 × 160 cm',
    inZaal: true,
    img: local('marlboro-man-rob', 0.757),
  },
  {
    id: 'piclasso-gambia',
    titel: 'Piclasso Gambia',
    techniek: doek,
    afmetingen: '135 × 90 cm',
    toelichting: beide('Gemaakt in Gambia, 2022.', 'Made in Gambia, 2022.'),
    inZaal: true,
    img: local('piclasso-gambia', 0.691),
  },
  {
    id: 'selfie-big',
    titel: 'Selfie BIG',
    techniek: pvc,
    afmetingen: '130 × 90 cm',
    inZaal: true,
    img: local('selfie-big', 0.75),
  },
  {
    id: 'almost-christmas',
    titel: 'Almost Christmas',
    techniek: oliePvc,
    afmetingen: '180 × 130 cm',
    inZaal: true,
    img: local('almost-christmas', 0.697),
  },
  {
    id: 'jesus-and-fred',
    titel: 'Jesus and Fred & Friends',
    techniek: oliePvc,
    afmetingen: '180 × 130 cm',
    inZaal: true,
    img: local('jesus-and-fred', 0.708),
  },
  {
    id: 'modern-mona-lisa',
    titel: 'Modern Mona Lisa',
    techniek: pvc,
    afmetingen: '130 × 100 cm',
    inZaal: true,
    img: local('modern-mona-lisa', 0.75),
  },
  {
    id: 'picasso-meets-hitler',
    titel: 'Picasso meets Hitler',
    techniek: pvc,
    afmetingen: '105 × 80 cm',
    inZaal: true,
    img: local('picasso-meets-hitler', 0.713),
  },
  {
    id: 'mouth',
    titel: 'Mouth',
    techniek: doek,
    afmetingen: '100 × 80 cm',
    inZaal: true,
    img: local('mouth', 0.788),
  },
];

const werkVoor = (lang: Lang): Werk[] =>
  werkBronnen.map(({ techniek, toelichting, ...rest }) => ({
    ...rest,
    techniek: techniek[lang],
    ...(toelichting ? { toelichting: toelichting[lang] } : {}),
  }));

/**
 * The blog. Nothing here is invented: the same sourced sentences the site
 * already carried, split into the lead that goes on the card and the article
 * behind it, and said again in English.
 */
type BlogBron = {
  id: string;
  slug: string;
  datum: Vertaald;
  datumISO: string;
  titel: Vertaald;
  intro: Vertaald;
  body: Vertaald;
  img: Img;
};

const blogBronnen: BlogBron[] = [
  {
    id: 'in-memoriam',
    slug: 'peter-klashorst-1957-2024',
    datum: beide('11 september 2024', '11 September 2024'),
    datumISO: '2024-09-11',
    titel: beide('Peter Klashorst, 1957 / 2024', 'Peter Klashorst, 1957 / 2024'),
    // The lead is not repeated by the article: it is the first thing said, and
    // the article carries on from there.
    intro: beide(
      'Peter Klashorst overleed op 67-jarige leeftijd in Amsterdam.',
      'Peter Klashorst died in Amsterdam at the age of 67.',
    ),
    body: beide(
      'Hij liet een oeuvre na van ruim veertig jaar schilderen, fotograferen en reizen.',
      'He left an oeuvre of more than forty years of painting, photography and travel.',
    ),
    img: local('selfie-big', 0.75),
  },
  {
    id: 's21-tuol-sleng',
    slug: 's21-portretten-phnom-penh',
    datum: beide('2011', '2011'),
    datumISO: '2011-01-01',
    titel: beide('De S21-portretten in Phnom Penh', 'The S21 portraits in Phnom Penh'),
    // No lead written for this one: the overview takes the opening of the
    // article instead, which is the other shape a post can have.
    intro: beide('', ''),
    body: beide(
      'Met steun van UNESCO hingen Klashorsts portretten van gevangenen in het Tuol Sleng Genocide Museum, op de plek waar de originele politiefoto’s zijn gemaakt.',
      'With support from UNESCO, Klashorst’s portraits of prisoners hung in the Tuol Sleng Genocide Museum, in the place where the original police photographs were taken.',
    ),
    img: local('s21-ii', 0.765),
  },
  {
    id: 'kunstkannibaal',
    slug: 'kunstkannibaal-verschijnt',
    datum: beide('2011', '2011'),
    datumISO: '2011-01-01',
    titel: beide('Kunstkannibaal verschijnt', 'Kunstkannibaal is published'),
    intro: beide(
      'Klashorst schreef zijn autobiografie Kunstkannibaal.',
      'Klashorst wrote his autobiography, Kunstkannibaal.',
    ),
    body: beide(
      'Robert Vuijsje publiceerde eerder, in 2003, het portret King Klashorst.',
      'Robert Vuijsje had published the portrait King Klashorst earlier, in 2003.',
    ),
    img: local('piclasso-gambia', 0.691),
  },
];

const blogVoor = (lang: Lang): BlogPost[] =>
  blogBronnen.map((post) => {
    const body = alineas(post.id, post.body[lang]);
    return {
      id: post.id,
      slug: post.slug,
      datum: post.datum[lang],
      datumISO: post.datumISO,
      vastgezet: false,
      titel: post.titel[lang],
      intro: post.intro[lang],
      samenvatting: samenvatten(post.intro[lang], body),
      body,
      img: post.img,
      onvertaald: false,
    };
  });

const portret = single('/art/peter-portrait.webp', 1);

const teksten: Record<Lang, Content['teksten']> = {
  nl: {
    hero: {
      titel: 'Klashorst Museum',
      tagline: 'Lust for Life',
      lead: 'Het museum voor het werk van Peter Klashorst: schilder, fotograaf en muzikant. Ruim veertig jaar werk, gemaakt in Amsterdam, West-Afrika en Zuidoost-Azië. Een deel van het museum is gereserveerd voor werk van andere kunstenaars.',
      knop: 'Bekijk het werk',
    },
    werk: {
      eyebrow: 'Collectie',
      titel: 'Het werk',
      lead: 'Techniek en afmetingen komen uit de opgave van de nalatenschap.',
      leeg: 'Er staat op dit moment geen werk in de collectie. Zodra er werk is opgenomen, staat het hier.',
    },
    peter: {
      eyebrow: 'De schilder',
      titel: 'Peter Klashorst',
      alineas: [
        'Peter van de Klashorst wordt in 1957 geboren in Santpoort en studeert van 1976 tot 1981 aan de Gerrit Rietveld Academie. In de jaren tachtig hoort hij bij de Nieuwe Wilden, de generatie die het figuratieve schilderen terughaalt.',
        'In 1982 ontvangt hij de Buning Brongers Prijs, in 1983 de Koninklijke Subsidie voor Vrije Schilderkunst. Hij speelt in de bands Interior en Soviet Sex. In 1987 is hij medeoprichter van het internationale kunstenaarscollectief After Nature.',
        'Vanaf de jaren negentig werkt hij grote delen van het jaar buiten Nederland: Senegal, Gambia, Kenia, Cambodja en Thailand. Dat werk oogst evenveel bewondering als scherpe kritiek. In 2011 verschijnt zijn autobiografie Kunstkannibaal.',
        'Peter Klashorst overlijdt op 11 september 2024 in Amsterdam, 67 jaar oud.',
      ],
      portret,
      portretCredit: 'Foto: Michael Klinkhamer',
      // The museum adds this one in the Studio; the build ships without it.
      tweedeFoto: null,
      tweedeFotoCredit: '',
    },
    galerie: {
      eyebrow: 'Andere kunst',
      titel: 'Werk van andere kunstenaars',
      lead: 'Een deel van het museum is gereserveerd voor kunstenaars naast Peter Klashorst.',
      leeg: 'De eerste werken worden nu geselecteerd. Wilt u hier werk laten hangen? Laat het het museum weten.',
    },
    blog: {
      eyebrow: 'Blog',
      titel: BLOG_TITLE.nl,
      lead: 'Aankondigingen van het museum en verhalen uit het archief van de schilder.',
      leeg: 'Het eerste bericht staat er nog niet. Zodra er nieuws is, komt het hier te staan.',
    },
    bezoek: {
      eyebrow: 'Bezoek',
      titel: 'Plan uw bezoek',
      lead: 'Deze gegevens staan nog niet vast. Zodra ze bekend zijn, komen ze hier te staan en gaan ze mee in de nieuwsbrief.',
      rijen: [
        { label: 'Adres', waarde: 'Volgt' },
        { label: 'Openingstijden', waarde: 'Volgt' },
        { label: 'Entree', waarde: 'Volgt' },
      ],
      note: 'Wilt u weten wanneer het museum opengaat? Laat uw e-mailadres achter.',
    },
    nieuwsbrief: {
      eyebrow: 'Nieuwsbrief',
      titel: 'Blijf op de hoogte',
      lead: 'Een bericht bij de opening, bij nieuwe tentoonstellingen en bij nieuw werk in de collectie. Niet vaker.',
      consent: 'Alleen museumnieuws. Uw adres gaat niet naar anderen.',
      knop: 'Aanmelden',
      gelukt: 'Dank u. U hoort van ons zodra er nieuws is.',
    },
    contact: {
      eyebrow: 'Contact',
      titel: 'Stel een vraag',
      lead: 'Uw bericht komt rechtstreeks bij het museum binnen. U krijgt antwoord op het adres dat u achterlaat.',
      waarvoor: [
        {
          label: 'Over het werk',
          wat: 'Een vraag over een schilderij, over de collectie of over een bezoek.',
        },
        {
          label: 'Werk aanbieden',
          wat: 'Kunstenaars die werk willen laten hangen in de zaal met werk van anderen.',
        },
      ],
      knop: 'Vraag versturen',
      gelukt: 'Dank u. Het museum neemt contact met u op.',
      mailVraag: 'Liever zelf een mail versturen?',
      mail: 'klashorstmuseum@gmail.com',
    },
    menu: {
      werk: 'Klashorst Collectie',
      peter: 'De Kunstenaar',
      galerie: 'Andere Kunst',
      blog: 'Dirty Diaries',
      bezoek: 'Bezoek Museum',
      contact: 'Contact',
      nieuwsbrief: 'Nieuwsbrief',
    },
    nietGevonden: {
      titel: 'Deze pagina bestaat niet',
      tekst: 'Het bericht is verplaatst of het adres klopt niet helemaal.',
    },
    footer: {
      rechten: 'Werk van Peter Klashorst',
      demo: 'Dit is een conceptversie.',
    },
    vindbaarheid: { titel: HOME_TITLE.nl, omschrijving: HOME_DESCRIPTION.nl },
  },

  en: {
    hero: {
      titel: 'Klashorst Museum',
      tagline: 'Lust for Life',
      lead: 'The museum for the work of Peter Klashorst: painter, photographer and musician. More than forty years of work, made in Amsterdam, West Africa and Southeast Asia. Part of the museum is reserved for work by other artists.',
      knop: 'View the work',
    },
    werk: {
      eyebrow: 'Collection',
      titel: 'The work',
      lead: 'Medium and dimensions are as stated by the estate.',
      leeg: 'There is no work in the collection at the moment. As soon as work is added, it appears here.',
    },
    peter: {
      eyebrow: 'The painter',
      titel: 'Peter Klashorst',
      alineas: [
        'Peter van de Klashorst was born in Santpoort in 1957 and studied at the Gerrit Rietveld Academie from 1976 to 1981. In the nineteen-eighties he belonged to the Nieuwe Wilden, the generation that brought figurative painting back.',
        'In 1982 he received the Buning Brongers Prize, and in 1983 the Royal Award for Painting. He played in the bands Interior and Soviet Sex. In 1987 he was a co-founder of the international artists’ collective After Nature.',
        'From the nineteen-nineties he spent large parts of the year working outside the Netherlands: Senegal, Gambia, Kenya, Cambodia and Thailand. That work drew as much admiration as sharp criticism. His autobiography Kunstkannibaal appeared in 2011.',
        'Peter Klashorst died in Amsterdam on 11 September 2024, aged 67.',
      ],
      portret,
      portretCredit: 'Photograph: Michael Klinkhamer',
      tweedeFoto: null,
      tweedeFotoCredit: '',
    },
    galerie: {
      eyebrow: 'Other art',
      titel: 'Work by other artists',
      lead: 'Part of the museum is reserved for artists alongside Peter Klashorst.',
      leeg: 'The first works are being selected now. Would you like to show work here? Let the museum know.',
    },
    blog: {
      eyebrow: 'Journal',
      titel: BLOG_TITLE.en,
      lead: 'Announcements from the museum and stories from the painter’s archive.',
      leeg: 'The first post is not there yet. As soon as there is news, it will appear here.',
    },
    bezoek: {
      eyebrow: 'Visit',
      titel: 'Plan your visit',
      lead: 'These details are not settled yet. As soon as they are, they will appear here and go out in the newsletter.',
      rijen: [
        { label: 'Address', waarde: 'To follow' },
        { label: 'Opening hours', waarde: 'To follow' },
        { label: 'Admission', waarde: 'To follow' },
      ],
      note: 'Would you like to know when the museum opens? Leave your email address.',
    },
    nieuwsbrief: {
      eyebrow: 'Newsletter',
      titel: 'Stay informed',
      lead: 'A message when the museum opens, when there is a new exhibition and when new work enters the collection. No more often than that.',
      consent: 'Museum news only. Your address does not go to anyone else.',
      knop: 'Sign up',
      gelukt: 'Thank you. You will hear from us as soon as there is news.',
    },
    contact: {
      eyebrow: 'Contact',
      titel: 'Ask a question',
      lead: 'Your message goes straight to the museum. You will get an answer at the address you leave.',
      waarvoor: [
        {
          label: 'About the work',
          wat: 'A question about a painting, about the collection or about visiting the museum.',
        },
        {
          label: 'Offering work',
          wat: 'Artists who would like to show work in the room reserved for other artists.',
        },
      ],
      knop: 'Send question',
      gelukt: 'Thank you. The museum will be in touch.',
      mailVraag: 'Prefer to send an email yourself?',
      mail: 'klashorstmuseum@gmail.com',
    },
    menu: {
      werk: 'Klashorst Collection',
      peter: 'The Artist',
      // The blog's own name, so it reads the same in both languages.
      galerie: 'Other Art',
      blog: 'Dirty Diaries',
      bezoek: 'Visit Museum',
      contact: 'Contact',
      nieuwsbrief: 'Newsletter',
    },
    nietGevonden: {
      titel: 'This page does not exist',
      tekst: 'The post has moved, or the address is not quite right.',
    },
    footer: {
      rechten: 'Work by Peter Klashorst',
      demo: 'This is a concept version.',
    },
    vindbaarheid: { titel: HOME_TITLE.en, omschrijving: HOME_DESCRIPTION.en },
  },
};

/**
 * Empty galleries on purpose. The museum has not named the artists it will
 * show, and this build invents nobody. The section explains itself until the
 * client adds the first work in the Studio.
 */
export const defaults: Record<Lang, Content> = {
  nl: { teksten: teksten.nl, werk: werkVoor('nl'), blog: blogVoor('nl'), galerie: [] },
  en: { teksten: teksten.en, werk: werkVoor('en'), blog: blogVoor('en'), galerie: [] },
};

/** What the seed script writes into Sanity: both languages, side by side. */
export const seedBronnen = { werkBronnen, blogBronnen, teksten };
