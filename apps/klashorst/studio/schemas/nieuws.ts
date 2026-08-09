import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * A blog post.
 *
 * The type is still called `nieuws`: every post already in the dataset carries
 * that name, and renaming it would leave them behind. Everything the client
 * reads says Blog.
 *
 * Three fields carry a post: a lead that goes on the overview, an article
 * written in the editor, and a photograph. The editor offers exactly what the
 * site can render, and nothing beyond it, so a post cannot be written into a
 * shape the page has no way of showing.
 *
 * Three tabs: the post in Dutch, the same post in English, and what a search
 * engine is told about it. The English tab is optional throughout: a post with
 * nothing in it still has a page at /en/blog, in Dutch, with a line saying so.
 */

/**
 * The editor, defined once and offered twice: what the client writes in Dutch
 * and what the translation writes in English have to render through the same
 * component, so they have to be the same shape.
 */
const artikel = [
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
              description: 'Bijvoorbeeld https://… of /blog voor een pagina op deze site.',
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
  title: 'Blogbericht',
  type: 'document',
  groups: [
    { name: 'nl', title: 'Nederlands', default: true },
    { name: 'en', title: 'English' },
    { name: 'seo', title: 'Vindbaarheid' },
  ],
  fields: [
    defineField({
      name: 'titel',
      title: 'Kop',
      type: 'string',
      group: 'nl',
      validation: (rule) => rule.required().error('Een bericht heeft een kop nodig.'),
    }),
    defineField({
      name: 'slug',
      title: 'Adres van dit bericht',
      type: 'slug',
      group: 'nl',
      options: { source: 'titel', maxLength: 64 },
      description:
        'Klik op Genereer: dit wordt het webadres, bijvoorbeeld /blog/nieuwe-tentoonstelling. Het Engelse bericht staat op /en/blog/hetzelfde-adres. Laat het staan zodra het bericht online is, anders werken gedeelde links niet meer.',
      validation: (rule) =>
        rule.custom((value) =>
          value?.current
            ? true
            : 'Nog geen adres. Klik op Genereer, dan krijgt dit bericht een net webadres.',
        ).warning(),
    }),
    defineField({
      name: 'datum',
      title: 'Datum',
      type: 'date',
      group: 'nl',
      options: { dateFormat: 'D MMMM YYYY' },
      initialValue: () => new Date().toISOString().slice(0, 10),
      description: 'Bepaalt de volgorde: het nieuwste bericht staat vooraan.',
      validation: (rule) =>
        rule.required().error('Zonder datum weet de site niet waar dit bericht hoort.'),
    }),
    defineField({
      name: 'datumWeergave',
      title: 'Datum anders tonen',
      type: 'string',
      group: 'nl',
      description:
        'Alleen invullen als er iets anders moet staan dan de datum zelf, bijvoorbeeld alleen "2011".',
    }),
    defineField({
      name: 'vastgezet',
      title: 'Bovenaan houden',
      type: 'boolean',
      group: 'nl',
      initialValue: false,
      description:
        'Dit bericht blijft vooraan staan, ook als er nieuwere berichten bij komen. Het krijgt dan de grote plek bovenaan de blogpagina. Handig voor een aankondiging die even moet blijven staan.',
    }),
    defineField({
      name: 'afbeelding',
      title: 'Hoofdfoto',
      type: 'image',
      group: 'nl',
      options: { hotspot: true },
      description:
        'Staat op de overzichtspagina en bovenaan het bericht. Liggend werkt het mooist.',
    }),
    defineField({
      name: 'intro',
      title: 'Inleiding',
      type: 'text',
      rows: 3,
      group: 'nl',
      description:
        'De paar zinnen die op de blogpagina onder de kop staan, en waarop iemand besluit verder te lezen. Een of twee zinnen is genoeg.',
      validation: (rule) => rule.max(300).warning('Kort houden leest het prettigst.'),
    }),
    defineField({
      name: 'body',
      title: 'Bericht',
      type: 'array',
      group: 'nl',
      description:
        'Het bericht zelf. Typ gewoon door; met de knoppen maakt u een tussenkop, een opsomming, vette tekst of een link. Met + voegt u een foto tussen de tekst toe.',
      of: artikel,
    }),
    defineField({
      name: 'tekst',
      title: 'Oude tekst',
      type: 'text',
      rows: 8,
      group: 'nl',
      readOnly: true,
      description:
        'Geschreven voordat de tekstverwerker hierboven bestond. Deze tekst staat nu op de site. Neem hem over in "Bericht": zodra daar iets staat, wordt deze niet meer getoond en mag hij blijven staan.',
      // Out of the way for every post written since, and for every old post the
      // moment its text has been moved over.
      hidden: ({ parent }) => !parent?.tekst || Boolean(parent?.body?.length),
    }),

    defineField({
      name: 'en',
      title: 'English',
      type: 'object',
      group: 'en',
      description:
        'Het bericht op /en/blog. Leeg laten mag: het bericht staat dan in het Nederlands op de Engelse pagina, met een regel erboven die dat zegt. Vertaal alleen wat de moeite waard is om in het Engels te lezen.',
      fields: [
        defineField({ name: 'titel', title: 'Headline', type: 'string' }),
        defineField({ name: 'intro', title: 'Standfirst', type: 'text', rows: 3 }),
        defineField({ name: 'body', title: 'Article', type: 'array', of: artikel }),
        defineField({
          name: 'seoTitel',
          title: 'Search result title',
          type: 'string',
          description: 'Optional. What Google shows as the blue line.',
        }),
        defineField({
          name: 'seoOmschrijving',
          title: 'Search result description',
          type: 'text',
          rows: 3,
        }),
      ],
    }),

    defineField({
      name: 'seoFocus',
      title: 'Zoekterm',
      type: 'string',
      group: 'seo',
      description:
        'Waar mensen op zoeken als ze dit bericht bedoelen, bijvoorbeeld "Klashorst tentoonstelling Amsterdam". Het tabblad Vindbaarheid controleert hierop.',
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
        'De twee regels onder de blauwe link. Leeg laten mag: dan gebruikt de site de inleiding. Tussen de 70 en 160 tekens.',
      validation: (rule) => rule.max(180).warning('Google kapt langere omschrijvingen af.'),
    }),
  ],
  orderings: [
    {
      name: 'datumDesc',
      title: 'Zoals op de site',
      // Same order the site puts them in, so the list here is not a second
      // opinion about which post comes first.
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
      datumWeergave: 'datumWeergave',
      vastgezet: 'vastgezet',
      engels: 'en.titel',
      media: 'afbeelding',
    },
    prepare: ({ title, datum, datumWeergave, vastgezet, engels, media }) => ({
      title,
      subtitle: [vastgezet ? 'Bovenaan' : '', datumWeergave || datum, engels ? 'EN' : '']
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
});
