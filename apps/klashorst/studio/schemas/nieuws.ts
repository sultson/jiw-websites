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
 */
export const nieuws = defineType({
  name: 'nieuws',
  title: 'Blogbericht',
  type: 'document',
  fields: [
    defineField({
      name: 'titel',
      title: 'Kop',
      type: 'string',
      validation: (rule) => rule.required().error('Een bericht heeft een kop nodig.'),
    }),
    defineField({
      name: 'slug',
      title: 'Adres van dit bericht',
      type: 'slug',
      options: { source: 'titel', maxLength: 64 },
      description:
        'Klik op Genereer: dit wordt het webadres, bijvoorbeeld /blog/nieuwe-tentoonstelling. Laat het staan zodra het bericht online is, anders werken gedeelde links niet meer.',
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
      description:
        'Alleen invullen als er iets anders moet staan dan de datum zelf, bijvoorbeeld alleen "2011".',
    }),
    defineField({
      name: 'vastgezet',
      title: 'Bovenaan houden',
      type: 'boolean',
      initialValue: false,
      description:
        'Dit bericht blijft vooraan staan, ook als er nieuwere berichten bij komen. Het krijgt dan de grote plek bovenaan de blogpagina. Handig voor een aankondiging die even moet blijven staan.',
    }),
    defineField({
      name: 'afbeelding',
      title: 'Hoofdfoto',
      type: 'image',
      options: { hotspot: true },
      description:
        'Staat op de overzichtspagina en bovenaan het bericht. Liggend werkt het mooist.',
    }),
    defineField({
      name: 'intro',
      title: 'Inleiding',
      type: 'text',
      rows: 3,
      description:
        'De paar zinnen die op de blogpagina onder de kop staan, en waarop iemand besluit verder te lezen. Een of twee zinnen is genoeg.',
      validation: (rule) => rule.max(300).warning('Kort houden leest het prettigst.'),
    }),
    defineField({
      name: 'body',
      title: 'Bericht',
      type: 'array',
      description:
        'Het bericht zelf. Typ gewoon door; met de knoppen maakt u een tussenkop, een opsomming, vette tekst of een link. Met + voegt u een foto tussen de tekst toe.',
      of: [
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
              description: 'Wat er op de foto te zien is, voor wie de foto niet kan zien.',
            },
            {
              name: 'bijschrift',
              type: 'string',
              title: 'Bijschrift',
              description: 'Optioneel. Staat klein onder de foto.',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'tekst',
      title: 'Oude tekst',
      type: 'text',
      rows: 8,
      readOnly: true,
      description:
        'Geschreven voordat de tekstverwerker hierboven bestond. Deze tekst staat nu op de site. Neem hem over in "Bericht": zodra daar iets staat, wordt deze niet meer getoond en mag hij blijven staan.',
      // Out of the way for every post written since, and for every old post the
      // moment its text has been moved over.
      hidden: ({ parent }) => !parent?.tekst || Boolean(parent?.body?.length),
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
      media: 'afbeelding',
    },
    prepare: ({ title, datum, datumWeergave, vastgezet, media }) => ({
      title,
      subtitle: `${vastgezet ? 'Bovenaan · ' : ''}${datumWeergave || datum}`,
      media,
    }),
  },
});
