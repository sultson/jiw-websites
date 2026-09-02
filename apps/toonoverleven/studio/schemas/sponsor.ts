import { defineField, defineType } from 'sanity';

/**
 * Een bedrijf of fonds dat het huis steunt.
 *
 * Staat in de CMS omdat er elk jaar sponsoren bij komen en er af gaan, en
 * omdat een logo toevoegen anders een verzoek aan ons zou zijn.
 *
 * Wat hier staat komt op twee plekken terug: klein en in grijstinten onderaan
 * elke pagina van de site, en groot met naam en adres op Onze sponsors.
 */
export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsoren',
  type: 'document',
  fields: [
    defineField({
      name: 'naam',
      title: 'Naam',
      type: 'string',
      validation: (rule) => rule.required().error('Zonder naam weet niemand wie dit is.'),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description:
        'Bij voorkeur met een doorzichtige of witte achtergrond. Het logo wordt op een wit vlak gezet, op de pagina Onze sponsors en klein onderaan elke pagina.',
      validation: (rule) => rule.required().error('Een sponsor wordt met zijn logo getoond.'),
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description:
        'Mag leeg blijven. Staat er iets, dan wordt het logo overal klikbaar en opent het in een nieuw tabblad de site van de sponsor.',
    }),
    defineField({
      name: 'volgorde',
      title: 'Volgorde',
      type: 'number',
      description: 'Laag getal staat vooraan. Leeg laten mag; dan staat het achteraan.',
    }),
  ],
  orderings: [
    { name: 'volgorde', title: 'Zoals op de site', by: [{ field: 'volgorde', direction: 'asc' }] },
  ],
  preview: { select: { title: 'naam', media: 'logo', subtitle: 'website' } },
});
