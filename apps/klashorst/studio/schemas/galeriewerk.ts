import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
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
  orderings: [orderRankOrdering],
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
      // Not every work is named, and a title should never stand between the
      // museum and hanging a photograph. Left empty, the site leaves the line
      // off rather than putting "Zonder titel" under the work.
      description: 'Optioneel. Heeft het werk geen titel, laat dit dan leeg.',
    }),
    defineField({
      name: 'kunstenaar',
      title: 'Kunstenaar',
      type: 'string',
      group: 'nl',
      description: 'Van wie dit werk is. Deze zaal is voor werk van anderen, dus dit is het vermelden waard.',
      // A nudge, not a lock: publishing a work whose maker is not yet known
      // has to be possible, and the yellow hint is there to be answered later.
      validation: (rule) => rule.required().warning('Nog niet ingevuld van wie dit werk is.'),
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
    orderRankField({ type: 'galeriewerk' }),
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
      // Only in this list: a work without a title has to be findable in the
      // Studio, but on the site it simply has no title line.
      title: title || 'Werk zonder titel',
      subtitle: kunstenaar,
      media,
    }),
  },
});
