import { defineField, defineType } from 'sanity';

/**
 * One work from Peter Klashorst's own collection.
 *
 * A work is on show and nothing else: the museum does not sell or hire out the
 * collection, so there is nothing here about price or availability.
 */
export const werk = defineType({
  name: 'werk',
  title: 'Werk in de collectie',
  type: 'document',
  groups: [
    { name: 'nl', title: 'Nederlands', default: true },
    { name: 'en', title: 'English' },
  ],
  fields: [
    defineField({
      name: 'titel',
      title: 'Titel',
      type: 'string',
      group: 'nl',
      validation: (rule) => rule.required().error('Een werk heeft een titel nodig.'),
    }),
    defineField({
      name: 'afbeelding',
      title: 'Foto van het werk',
      type: 'image',
      group: 'nl',
      // No cropping: the site never recrops the art, it fits it in the frame.
      // One upload becomes the thumbnail, the grote weergave en de 3D-zaal.
      options: { hotspot: false },
      description: 'Fotografeer het doek recht van voren. Eén foto is genoeg, de site maakt zelf alle formaten.',
      validation: (rule) => rule.required().error('Zonder foto kan het werk niet getoond worden.'),
    }),
    defineField({
      name: 'techniek',
      title: 'Techniek',
      type: 'string',
      group: 'nl',
      description: 'Bijvoorbeeld: Acrylverf op doek',
    }),
    defineField({
      name: 'afmetingen',
      title: 'Afmetingen',
      type: 'string',
      group: 'nl',
      description: 'Bijvoorbeeld: 180 × 135 cm. De 3D-zaal hangt het werk op ware grootte aan de hand hiervan.',
    }),
    defineField({
      name: 'toelichting',
      title: 'Toelichting',
      type: 'text',
      rows: 3,
      group: 'nl',
      description: 'Optioneel. Verschijnt bij het werk in de zaal en op de vergrote weergave.',
    }),
    defineField({
      name: 'inZaal',
      title: 'Hangt in de 3D-zaal',
      type: 'boolean',
      group: 'nl',
      initialValue: true,
      description: 'Uit betekent: wel in de collectie op de pagina, niet in de draaiende zaal bovenaan.',
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
        defineField({
          name: 'techniek',
          title: 'Medium',
          type: 'string',
          description: 'Bijvoorbeeld: Acrylic on canvas',
        }),
        defineField({ name: 'toelichting', title: 'Note', type: 'text', rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titel',
      techniek: 'techniek',
      afmetingen: 'afmetingen',
      media: 'afbeelding',
    },
    prepare: ({ title, techniek, afmetingen, media }) => ({
      title,
      subtitle: [techniek, afmetingen].filter(Boolean).join(', '),
      media,
    }),
  },
});
