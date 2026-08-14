import { defineField, defineType } from 'sanity';

/**
 * The part of the museum reserved for other artists. The same fields as the
 * collection: a work hangs here and is described, nothing more. Nothing on the
 * site is sold or hired out.
 */
export const galeriewerk = defineType({
  name: 'galeriewerk',
  title: 'Werk van een andere kunstenaar',
  type: 'document',
  groups: [
    { name: 'nl', title: 'Nederlands', default: true },
    { name: 'en', title: 'English' },
  ],
  fields: [
    defineField({
      name: 'titel',
      title: 'Titel van het werk',
      type: 'string',
      group: 'nl',
      validation: (rule) => rule.required().error('Een werk heeft een titel nodig.'),
    }),
    defineField({
      name: 'kunstenaar',
      title: 'Kunstenaar',
      type: 'string',
      group: 'nl',
      validation: (rule) => rule.required().error('Vul in van wie dit werk is.'),
    }),
    defineField({
      name: 'afbeelding',
      title: 'Foto van het werk',
      type: 'image',
      group: 'nl',
      options: { hotspot: false },
      validation: (rule) => rule.required().error('Zonder foto kan het werk niet getoond worden.'),
    }),
    defineField({ name: 'techniek', title: 'Techniek', type: 'string', group: 'nl' }),
    defineField({ name: 'afmetingen', title: 'Afmetingen', type: 'string', group: 'nl' }),
    defineField({ name: 'jaar', title: 'Jaar', type: 'string', group: 'nl' }),
    defineField({
      name: 'toelichting',
      title: 'Toelichting',
      type: 'text',
      rows: 3,
      group: 'nl',
      description: 'Optioneel. Een paar regels over het werk of de kunstenaar.',
    }),
    defineField({
      name: 'volgorde',
      title: 'Volgorde',
      type: 'number',
      group: 'nl',
      description: 'Lager getal staat vooraan. Leeg laten mag.',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'object',
      group: 'en',
      description:
        'Alleen nodig als het Engels afwijkt. Leeg laten mag: dan staat de Nederlandse tekst op de Engelse pagina.',
      fields: [
        defineField({ name: 'titel', title: 'Title', type: 'string' }),
        defineField({ name: 'techniek', title: 'Medium', type: 'string' }),
        defineField({ name: 'toelichting', title: 'Note', type: 'text', rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titel',
      kunstenaar: 'kunstenaar',
      media: 'afbeelding',
    },
    prepare: ({ title, kunstenaar, media }) => ({
      title,
      subtitle: kunstenaar,
      media,
    }),
  },
});
