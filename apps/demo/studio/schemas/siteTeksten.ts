import { defineField, defineType } from 'sanity';

const OPMAAK = 'Witregel = nieuwe alinea. *schuin* en **vet** werken.';

export default defineType({
  name: 'siteTeksten',
  title: 'Teksten op de site',
  type: 'document',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', description: 'De grote kop bovenaan, ook de titel van het tabblad.' }),
    defineField({ name: 'intro', title: 'Introductie', type: 'text', rows: 3, description: OPMAAK }),
    defineField({ name: 'heroFoto', title: 'Grote foto', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'overTitel', title: 'Kop "over"', type: 'string' }),
    defineField({ name: 'overTekst', title: 'Tekst "over"', type: 'text', rows: 6, description: OPMAAK }),
    defineField({ name: 'contactEmail', title: 'E-mailadres', type: 'string' }),
    defineField({ name: 'contactTelefoon', title: 'Telefoonnummer', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Teksten op de site' }) },
});
