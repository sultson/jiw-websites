import { defineField, defineType } from 'sanity';

export const werk = defineType({
  name: 'werk',
  title: 'Werk in de collectie',
  type: 'document',
  fields: [
    defineField({
      name: 'titel',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required().error('Een werk heeft een titel nodig.'),
    }),
    defineField({
      name: 'afbeelding',
      title: 'Foto van het werk',
      type: 'image',
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
      description: 'Bijvoorbeeld: Acrylverf op doek',
    }),
    defineField({
      name: 'afmetingen',
      title: 'Afmetingen',
      type: 'string',
      description: 'Bijvoorbeeld: 180 × 135 cm. De 3D-zaal hangt het werk op ware grootte aan de hand hiervan.',
    }),
    defineField({
      name: 'toelichting',
      title: 'Toelichting',
      type: 'text',
      rows: 3,
      description: 'Optioneel. Verschijnt bij het werk in de zaal en op de vergrote weergave.',
    }),
    defineField({
      name: 'inZaal',
      title: 'Hangt in de 3D-zaal',
      type: 'boolean',
      initialValue: true,
      description: 'Uit betekent: wel in de collectie op de pagina, niet in de draaiende zaal bovenaan.',
    }),
    defineField({
      name: 'reeks',
      title: 'Hoort bij een reeks',
      type: 'string',
      options: {
        list: [{ title: 'S21', value: 's21' }],
        layout: 'radio',
      },
      description: 'Werk uit de S21-reeks krijgt zijn eigen blok en hangt niet in de zaal.',
    }),
    defineField({
      name: 'volgorde',
      title: 'Volgorde',
      type: 'number',
      description: 'Lager getal staat vooraan. Leeg laten mag.',
    }),
  ],
  preview: {
    select: { title: 'titel', techniek: 'techniek', afmetingen: 'afmetingen', media: 'afbeelding' },
    prepare: ({ title, techniek, afmetingen, media }) => ({
      title,
      subtitle: [techniek, afmetingen].filter(Boolean).join(', '),
      media,
    }),
  },
});
