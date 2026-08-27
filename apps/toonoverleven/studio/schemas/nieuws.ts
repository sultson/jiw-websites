import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Een bericht in Nieuws & Blog.
 *
 * Dit vervangt de strook "van onze socials" die hier eerst stond en die door
 * ons werd bijgehouden. Nu schrijven ze het zelf, en een bericht heeft een
 * eigen pagina, dus een kaart op de voorpagina is een doorkijkje naar het hele
 * verhaal in plaats van een link naar Facebook.
 *
 * De velden waar het om gaat zijn kop, foto, inleiding en het bericht zelf. De
 * rest is optioneel en staat er alleen voor als het van pas komt.
 */

/**
 * De tekstverwerker: alinea's, tussenkoppen, een citaat, opsommingen, links en
 * een foto tussen de tekst. Hij staat hier maar wordt ook door een verhaal van
 * een bezoeker gebruikt, zodat er in het beheer één manier van schrijven is.
 */
export const tekstblokken = [
  defineArrayMember({
    type: 'block',
    styles: [
      { title: 'Tekst', value: 'normal' },
      { title: 'Kop', value: 'h2' },
      { title: 'Tussenkop', value: 'h3' },
      { title: 'Citaat', value: 'blockquote' },
    ],
    lists: [
      { title: 'Opsomming', value: 'bullet' },
      { title: 'Genummerd', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Vet', value: 'strong' },
        { title: 'Cursief', value: 'em' },
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'Adres',
              description: 'Bijvoorbeeld https://… of /agenda voor een pagina op deze site.',
              validation: (rule: any) =>
                rule
                  .uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true })
                  .error('Dit lijkt geen geldig adres.'),
            },
          ],
        },
      ],
    },
  }),
  defineArrayMember({
    type: 'image',
    title: 'Foto',
    options: { hotspot: true },
    fields: [
      {
        name: 'alt',
        type: 'string',
        title: 'Omschrijving',
        description:
          'Wat er op de foto te zien is, voor wie de foto niet kan zien. Zoekmachines lezen dit mee.',
      },
      {
        name: 'bijschrift',
        type: 'string',
        title: 'Bijschrift',
        description: 'Optioneel. Staat klein onder de foto.',
      },
    ],
  }),
];

export const nieuws = defineType({
  name: 'nieuws',
  title: 'Nieuws & Blog',
  type: 'document',
  groups: [
    { name: 'bericht', title: 'Bericht', default: true },
    { name: 'socials', title: 'Socials' },
    { name: 'seo', title: 'Vindbaarheid' },
  ],
  fields: [
    defineField({
      name: 'titel',
      title: 'Kop',
      type: 'string',
      group: 'bericht',
      validation: (rule) => rule.required().error('Een bericht heeft een kop nodig.'),
    }),
    defineField({
      name: 'slug',
      title: 'Adres van dit bericht',
      type: 'slug',
      group: 'bericht',
      options: { source: 'titel', maxLength: 64 },
      description:
        'Klik op Genereer: dit wordt het webadres, bijvoorbeeld /nieuws/nieuwe-mandalagroep. Laat het staan zodra het bericht online is, anders werken gedeelde links niet meer.',
      validation: (rule) =>
        rule
          .custom((value) =>
            value?.current
              ? true
              : 'Nog geen adres. Klik op Genereer, dan krijgt dit bericht een net webadres.',
          )
          .warning(),
    }),
    defineField({
      name: 'datum',
      title: 'Datum',
      type: 'date',
      group: 'bericht',
      options: { dateFormat: 'D MMMM YYYY' },
      initialValue: () => new Date().toISOString().slice(0, 10),
      description: 'Bepaalt de volgorde: het nieuwste bericht staat vooraan.',
      validation: (rule) => rule.required().error('Zonder datum weet de site niet waar dit hoort.'),
    }),
    defineField({
      name: 'vastgezet',
      title: 'Bovenaan houden',
      type: 'boolean',
      group: 'bericht',
      initialValue: false,
      description:
        'Dit bericht blijft vooraan staan, ook als er nieuwere bij komen. Handig voor een aankondiging die even moet blijven.',
    }),
    defineField({
      name: 'afbeelding',
      title: 'Foto',
      type: 'image',
      group: 'bericht',
      options: { hotspot: true },
      description: 'Staat op de kaart en bovenaan het bericht zelf.',
    }),
    defineField({
      name: 'intro',
      title: 'Inleiding',
      type: 'text',
      rows: 3,
      group: 'bericht',
      description:
        'De paar zinnen op de kaart, waarop iemand besluit door te lezen. Eén of twee zinnen is genoeg.',
      validation: (rule) => rule.max(300).warning('Kort houden leest het prettigst.'),
    }),
    defineField({
      name: 'body',
      title: 'Bericht',
      type: 'array',
      group: 'bericht',
      description:
        'Het bericht zelf. Typ gewoon door; met de knoppen maak je een tussenkop, een opsomming, vette tekst of een link. Met + zet je een foto tussen de tekst.',
      of: tekstblokken,
    }),

    defineField({
      name: 'instagram',
      title: 'Link naar Instagram',
      type: 'url',
      group: 'socials',
      description:
        'Staat dit bericht ook op Instagram? Plak hier de link, dan komt er onderaan het bericht een verwijzing.',
    }),
    defineField({
      name: 'facebook',
      title: 'Link naar Facebook',
      type: 'url',
      group: 'socials',
      description: 'Hetzelfde voor Facebook.',
    }),

    defineField({
      name: 'seoTitel',
      title: 'Titel in de zoekresultaten',
      type: 'string',
      group: 'seo',
      description:
        'Leeg laten mag: dan gebruikt de site de kop van het bericht. Tussen de 30 en 60 tekens leest het beste.',
      validation: (rule) => rule.max(70).warning('Google kapt langere titels af.'),
    }),
    defineField({
      name: 'seoOmschrijving',
      title: 'Omschrijving in de zoekresultaten',
      type: 'text',
      rows: 3,
      group: 'seo',
      description:
        'De twee regels onder de blauwe link. Leeg laten mag: dan gebruikt de site de inleiding.',
      validation: (rule) => rule.max(180).warning('Google kapt langere omschrijvingen af.'),
    }),
  ],
  orderings: [
    {
      name: 'datumDesc',
      title: 'Zoals op de site',
      by: [
        { field: 'vastgezet', direction: 'desc' },
        { field: 'datum', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'titel',
      datum: 'datum',
      vastgezet: 'vastgezet',
      media: 'afbeelding',
    },
    prepare: ({ title, datum, vastgezet, media }) => ({
      title,
      media,
      subtitle: [
        vastgezet ? 'Bovenaan' : '',
        datum ? new Date(datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
