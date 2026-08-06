import { BLOG_TITLE } from '../meta';
import { samenvatten } from './rich';
import type { BlogPost, Content, Img, RichBlock } from './types';

/**
 * The site as it stands without a CMS behind it.
 *
 * Two jobs. It is what renders when Sanity is unreachable or not yet wired up,
 * so the museum is never a blank page. And it is the source the seed script
 * imports into Sanity, so the first thing the client sees in the Studio is
 * their own site rather than an empty form.
 *
 * Everything here is sourced: biography from Wikipedia and the estate's own
 * copy, medium and dimensions quoted from the catalogue at peterklashorst.com.
 * Opening hours and admission do not exist yet and say so.
 */

/** A work photographed in three prepared sizes under public/art. */
const local = (slug: string, ratio: number): Img => ({
  ratio,
  grid: `/art/${slug}.webp`,
  room: `/art/${slug}-room.webp`,
  full: `/art/${slug}-full.webp`,
});

/** A photograph that exists in one size only. */
const single = (path: string, ratio: number): Img => ({ ratio, grid: path, room: path, full: path });

/**
 * The card's paragraph, worked out the same way it is for a post coming from
 * the CMS, so nothing has to be written twice here either.
 */
const blog = (
  posts: (Omit<BlogPost, 'samenvatting' | 'vastgezet'> & { vastgezet?: boolean })[],
): BlogPost[] =>
  posts.map((post) => ({
    vastgezet: false,
    ...post,
    samenvatting: samenvatten(post.intro, post.body),
  }));

/** Paragraphs, shaped the way the Studio's text editor stores them. */
const alineas = (id: string, ...paragrafen: string[]): RichBlock[] =>
  paragrafen.map((tekst, index) => ({
    _type: 'block',
    _key: `${id}-${index}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${id}-${index}-0`, text: tekst, marks: [] }],
  }));

export const defaults: Content = {
  teksten: {
    hero: {
      jaren: '1957 / 2024',
      titel: 'Peter Klashorst',
      tagline: 'Lust for Life',
      lead: 'Het museum voor het werk van Peter Klashorst: schilder, fotograaf en muzikant. Ruim veertig jaar werk, gemaakt in Amsterdam, West-Afrika en Zuidoost-Azië. Een deel van het museum is gereserveerd voor werk van andere kunstenaars.',
      knop: 'Bekijk het werk',
    },
    werk: {
      eyebrow: 'Collectie',
      titel: 'Het werk',
      lead: 'Techniek en afmetingen komen uit de opgave van de nalatenschap.',
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
      feitenTitel: 'In het kort',
      feiten: [
        { jaar: '1957', wat: 'Geboren in Santpoort' },
        { jaar: '1976 / 1981', wat: 'Gerrit Rietveld Academie' },
        { jaar: '1983', wat: 'Koninklijke Subsidie voor Vrije Schilderkunst' },
        { jaar: '1987', wat: 'Medeoprichter van After Nature' },
        { jaar: '2011', wat: 'Autobiografie Kunstkannibaal' },
        { jaar: '2024', wat: 'Overleden in Amsterdam' },
      ],
      portret: single('/art/peter-portrait.webp', 1),
      portretCredit: 'Foto: Michael Klinkhamer',
    },
    s21: {
      eyebrow: 'Reeks',
      titel: 'S21',
      lead: 'In Phnom Penh schilderde Klashorst portretten naar de politiefoto’s die de Rode Khmer maakte van gevangenen in Tuol Sleng, de gevangenis S21. In 2011 waren die portretten daar te zien, in het Tuol Sleng Genocide Museum zelf, met steun van UNESCO.',
      body: 'Vier doeken uit die reeks horen bij deze collectie. Klashorst zette de gezichten neer in grijstinten en bracht daarna kleur aan.',
      knop: 'Bekijk de reeks',
    },
    galerie: {
      eyebrow: 'Galerie',
      titel: 'Werk van andere kunstenaars',
      lead: 'Een deel van het museum is gereserveerd voor werk van andere kunstenaars. Dat werk is te huur en te koop. Er is geen webshop: u laat uw interesse achter en het museum neemt contact met u op.',
      leeg: 'De eerste werken worden nu geselecteerd. Wilt u hier werk laten hangen? Laat het het museum weten.',
    },
    blog: {
      eyebrow: 'Blog',
      titel: BLOG_TITLE,
      lead: 'Aankondigingen van het museum en verhalen uit het archief van de schilder.',
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
    },
    footer: {
      rechten: 'Werk van Peter Klashorst',
      demo: 'Dit is een conceptversie.',
    },
  },

  /**
   * Order matters: this is the order of the collection grid, and the works
   * flagged inZaal hang around the room in this order too.
   */
  werk: [
    {
      id: 'pearl-earring',
      titel: 'Pearl With A Pearl Earring',
      techniek: 'Acrylverf op doek',
      afmetingen: '180 × 150 cm',
      toelichting:
        'Klashorst nam de westerse kunstgeschiedenis herhaaldelijk onder handen. Hier is het Meisje met de parel de aanleiding.',
      inZaal: true,
      img: local('pearl-earring', 0.76),
    },
    {
      id: 'two-ladies-1984',
      titel: 'Two Ladies 1984',
      techniek: 'Olieverf op doek',
      afmetingen: '160 × 180 cm',
      toelichting: 'Vroeg werk uit 1984, de jaren van de Nieuwe Wilden.',
      inZaal: true,
      img: local('two-ladies-1984', 0.87),
    },
    {
      id: 'marlboro-man-rob',
      titel: 'Marlboro Man Rob',
      techniek: 'Acrylverf op pvc',
      afmetingen: '180 × 160 cm',
      inZaal: true,
      img: local('marlboro-man-rob', 0.757),
    },
    {
      id: 'piclasso-gambia',
      titel: 'Piclasso Gambia',
      techniek: 'Acrylverf op doek',
      afmetingen: '135 × 90 cm',
      toelichting: 'Gemaakt in Gambia, 2022.',
      inZaal: true,
      img: local('piclasso-gambia', 0.691),
    },
    {
      id: 'selfie-big',
      titel: 'Selfie BIG',
      techniek: 'Acrylverf op pvc',
      afmetingen: '130 × 90 cm',
      inZaal: true,
      img: local('selfie-big', 0.75),
    },
    {
      id: 'almost-christmas',
      titel: 'Almost Christmas',
      techniek: 'Olie- en acrylverf op pvc',
      afmetingen: '180 × 130 cm',
      inZaal: true,
      img: local('almost-christmas', 0.697),
    },
    {
      id: 'jesus-and-fred',
      titel: 'Jesus and Fred & Friends',
      techniek: 'Olie- en acrylverf op pvc',
      afmetingen: '180 × 130 cm',
      inZaal: true,
      img: local('jesus-and-fred', 0.708),
    },
    {
      id: 'modern-mona-lisa',
      titel: 'Modern Mona Lisa',
      techniek: 'Acrylverf op pvc',
      afmetingen: '130 × 100 cm',
      inZaal: true,
      img: local('modern-mona-lisa', 0.75),
    },
    {
      id: 'picasso-meets-hitler',
      titel: 'Picasso meets Hitler',
      techniek: 'Acrylverf op pvc',
      afmetingen: '105 × 80 cm',
      inZaal: true,
      img: local('picasso-meets-hitler', 0.713),
    },
    {
      id: 'mouth',
      titel: 'Mouth',
      techniek: 'Acrylverf op doek',
      afmetingen: '100 × 80 cm',
      inZaal: true,
      img: local('mouth', 0.788),
    },
    /**
     * The S21 series stays out of the room. These four are painted after the
     * Khmer Rouge's own photographs of prisoners who were then murdered; they
     * belong in their own section rather than turning past a headline.
     */
    {
      id: 's21-i',
      titel: 'S21 Portrait I',
      techniek: 'Acrylverf op doek',
      afmetingen: '180 × 135 cm',
      reeks: 's21',
      inZaal: false,
      img: local('s21-i', 0.743),
    },
    {
      id: 's21-ii',
      titel: 'S21 Portrait II',
      techniek: 'Acrylverf op doek',
      afmetingen: '180 × 135 cm',
      reeks: 's21',
      inZaal: false,
      img: local('s21-ii', 0.765),
    },
    {
      id: 's21-iii',
      titel: 'S21 Portrait III',
      techniek: 'Acrylverf op doek',
      afmetingen: '180 × 135 cm',
      reeks: 's21',
      inZaal: false,
      img: local('s21-iii', 0.756),
    },
    {
      id: 's21-cambodian-man',
      titel: 'S21 Portrait Cambodian Man',
      techniek: 'Acrylverf op doek',
      afmetingen: '180 × 135 cm',
      reeks: 's21',
      inZaal: false,
      img: local('s21-cambodian-man', 0.742),
    },
  ],

  /**
   * The blog. Nothing here is invented: the same sourced sentences the site
   * already carried, now split into the lead that goes on the card and the
   * article behind it.
   */
  blog: blog([
    {
      id: 'in-memoriam',
      slug: 'peter-klashorst-1957-2024',
      datum: '11 september 2024',
      datumISO: '2024-09-11',
      titel: 'Peter Klashorst, 1957 / 2024',
      // The lead is not repeated by the article: it is the first thing said,
      // and the article carries on from there.
      intro: 'Peter Klashorst overleed op 67-jarige leeftijd in Amsterdam.',
      body: alineas(
        'in-memoriam',
        'Hij liet een oeuvre na van ruim veertig jaar schilderen, fotograferen en reizen.',
      ),
      img: local('selfie-big', 0.75),
    },
    {
      id: 's21-tuol-sleng',
      slug: 's21-portretten-phnom-penh',
      datum: '2011',
      datumISO: '2011-01-01',
      titel: 'De S21-portretten in Phnom Penh',
      // No lead written for this one: the overview takes the opening of the
      // article instead, which is the other shape a post can have.
      intro: '',
      body: alineas(
        's21-tuol-sleng',
        'Met steun van UNESCO hingen Klashorsts portretten van gevangenen in het Tuol Sleng Genocide Museum, op de plek waar de originele politiefoto’s zijn gemaakt.',
      ),
      img: local('s21-ii', 0.765),
    },
    {
      id: 'kunstkannibaal',
      slug: 'kunstkannibaal-verschijnt',
      datum: '2011',
      datumISO: '2011-01-01',
      titel: 'Kunstkannibaal verschijnt',
      intro: 'Klashorst schreef zijn autobiografie Kunstkannibaal.',
      body: alineas(
        'kunstkannibaal',
        'Robert Vuijsje publiceerde eerder, in 2003, het portret King Klashorst.',
      ),
      img: local('piclasso-gambia', 0.691),
    },
  ]),

  /**
   * Empty on purpose. The museum has not named the artists it will show, and
   * this build invents nobody. The section explains itself until the client
   * adds the first work in the Studio.
   */
  galerie: [],
};
