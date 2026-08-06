import { defineField, defineType } from 'sanity';

/**
 * The part of the museum reserved for other artists. Prices are free text on
 * purpose: "€ 2.500", "€ 95 per maand" and "Prijs op aanvraag" are all normal
 * things for a gallery to say, and none of this is a checkout.
 */
export const galeriewerk = defineType({
  name: 'galeriewerk',
  title: 'Werk van een andere kunstenaar',
  type: 'document',
  fields: [
    defineField({
      name: 'titel',
      title: 'Titel van het werk',
      type: 'string',
      validation: (rule) => rule.required().error('Een werk heeft een titel nodig.'),
    }),
    defineField({
      name: 'kunstenaar',
      title: 'Kunstenaar',
      type: 'string',
      validation: (rule) => rule.required().error('Vul in van wie dit werk is.'),
    }),
    defineField({
      name: 'afbeelding',
      title: 'Foto van het werk',
      type: 'image',
      options: { hotspot: false },
      validation: (rule) => rule.required().error('Zonder foto kan het werk niet getoond worden.'),
    }),
    defineField({
      name: 'status',
      title: 'Beschikbaarheid',
      type: 'string',
      options: {
        list: [
          { title: 'Te huur', value: 'te-huur' },
          { title: 'Te koop', value: 'te-koop' },
          { title: 'Te huur en te koop', value: 'huur-en-koop' },
          { title: 'Verkocht', value: 'verkocht' },
        ],
        layout: 'radio',
      },
      initialValue: 'te-huur',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'prijs',
      title: 'Vraagprijs',
      type: 'string',
      description: 'Bijvoorbeeld: € 2.500 of Prijs op aanvraag. Leeg laten mag.',
    }),
    defineField({
      name: 'huurprijs',
      title: 'Huurprijs',
      type: 'string',
      description: 'Bijvoorbeeld: € 95 per maand. Leeg laten mag.',
    }),
    defineField({ name: 'techniek', title: 'Techniek', type: 'string' }),
    defineField({ name: 'afmetingen', title: 'Afmetingen', type: 'string' }),
    defineField({ name: 'jaar', title: 'Jaar', type: 'string' }),
    defineField({
      name: 'toelichting',
      title: 'Toelichting',
      type: 'text',
      rows: 3,
      description: 'Optioneel. Een paar regels over het werk of de kunstenaar.',
    }),
    defineField({
      name: 'volgorde',
      title: 'Volgorde',
      type: 'number',
      description: 'Lager getal staat vooraan. Leeg laten mag.',
    }),
  ],
  preview: {
    select: { title: 'titel', kunstenaar: 'kunstenaar', status: 'status', media: 'afbeelding' },
    prepare: ({ title, kunstenaar, status, media }) => {
      const labels: Record<string, string> = {
        'te-huur': 'Te huur',
        'te-koop': 'Te koop',
        'huur-en-koop': 'Te huur en te koop',
        verkocht: 'Verkocht',
      };
      return {
        title,
        subtitle: [kunstenaar, labels[status as string]].filter(Boolean).join(' — '),
        media,
      };
    },
  },
});
