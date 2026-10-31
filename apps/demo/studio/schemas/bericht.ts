import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'bericht',
  title: 'Bericht',
  type: 'document',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'datum',
      title: 'Datum',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      description: 'Het nieuwste bericht staat bovenaan.',
    }),
    defineField({ name: 'foto', title: 'Foto', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'tekst',
      title: 'Tekst',
      type: 'text',
      rows: 6,
      description: 'Witregel = nieuwe alinea. *schuin* en **vet** werken.',
    }),
  ],
  orderings: [{ title: 'Nieuwste eerst', name: 'datumDesc', by: [{ field: 'datum', direction: 'desc' }] }],
  preview: { select: { title: 'titel', subtitle: 'datum', media: 'foto' } },
});
