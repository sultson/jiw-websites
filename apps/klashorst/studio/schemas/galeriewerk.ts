import { defineField, defineType } from 'sanity';

/**
 * The part of the museum reserved for other artists. Prices are free text on
 * purpose: "€ 2.500", "€ 95 per maand" and "Prijs op aanvraag" are all normal
 * things for a gallery to say, and none of this is a checkout.
 *
 * The same two tick boxes as the collection, so a label means the same thing
 * everywhere on the site.
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
    defineField({
      name: 'teKoop',
      title: 'Te koop',
      type: 'boolean',
      group: 'nl',
      initialValue: false,
    }),
    defineField({
      name: 'teHuur',
      title: 'Te huur',
      type: 'boolean',
      group: 'nl',
      initialValue: true,
      description: 'Staan beide aan, dan staat er Te koop / te huur bij het werk.',
    }),
    defineField({
      name: 'verkocht',
      title: 'Verkocht',
      type: 'boolean',
      group: 'nl',
      initialValue: false,
      description: 'Het werk blijft staan, met het label Verkocht en zonder aanvraagknop.',
    }),
    defineField({
      name: 'prijs',
      title: 'Vraagprijs',
      type: 'string',
      group: 'nl',
      description: 'Bijvoorbeeld: € 2.500 of Prijs op aanvraag. Leeg laten mag.',
    }),
    defineField({
      name: 'huurprijs',
      title: 'Huurprijs',
      type: 'string',
      group: 'nl',
      description: 'Bijvoorbeeld: € 95 per maand. Leeg laten mag.',
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
        defineField({ name: 'prijs', title: 'Asking price', type: 'string' }),
        defineField({ name: 'huurprijs', title: 'Hire price', type: 'string' }),
        defineField({ name: 'toelichting', title: 'Note', type: 'text', rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titel',
      kunstenaar: 'kunstenaar',
      media: 'afbeelding',
      teKoop: 'teKoop',
      teHuur: 'teHuur',
      verkocht: 'verkocht',
    },
    prepare: ({ title, kunstenaar, media, teKoop, teHuur, verkocht }) => {
      const status = verkocht
        ? 'Verkocht'
        : teKoop && teHuur
          ? 'Te koop / te huur'
          : teKoop
            ? 'Te koop'
            : teHuur
              ? 'Te huur'
              : '';
      return {
        title,
        subtitle: [kunstenaar, status].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
