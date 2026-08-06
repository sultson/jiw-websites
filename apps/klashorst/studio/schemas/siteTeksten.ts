import { defineField, defineType } from 'sanity';

/**
 * All editable copy on the site, in one document. The client edits sentences,
 * never structure: section order, buttons and labels stay in the code, so no
 * edit here can leave the page broken or empty.
 */

const blok = (name: string, title: string, fields: ReturnType<typeof defineField>[], collapsed = true) =>
  defineField({
    name,
    title,
    type: 'object',
    options: { collapsible: true, collapsed },
    fields,
  });

const regel = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'string', description });

const alinea = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'text', rows: 4, description });

export const siteTeksten = defineType({
  name: 'siteTeksten',
  title: 'Teksten op de site',
  type: 'document',
  fields: [
    blok(
      'hero',
      'Bovenaan de pagina',
      [
        regel('jaren', 'Jaartallen', 'Staat klein boven de naam.'),
        regel('titel', 'Naam'),
        regel('tagline', 'Ondertitel'),
        alinea('lead', 'Introductie', 'De eerste zinnen die een bezoeker leest.'),
        regel('knop', 'Tekst op de knop'),
      ],
      false,
    ),
    blok('werk', 'Collectie', [
      regel('eyebrow', 'Klein kopje'),
      regel('titel', 'Kop'),
      alinea('lead', 'Introductie'),
    ]),
    blok('peter', 'Over Peter Klashorst', [
      regel('eyebrow', 'Klein kopje'),
      regel('titel', 'Kop'),
      defineField({
        name: 'alineas',
        title: 'Tekst',
        description: 'Elke regel in deze lijst wordt een alinea.',
        type: 'array',
        of: [{ type: 'text', rows: 4 }],
      }),
      defineField({
        name: 'portret',
        title: 'Portretfoto',
        type: 'image',
        options: { hotspot: false },
      }),
      regel('portretCredit', 'Fotograaf', 'Bijvoorbeeld: Foto: Michael Klinkhamer'),
      regel('feitenTitel', 'Kop boven de jaartallen'),
      defineField({
        name: 'feiten',
        title: 'Jaartallen',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [regel('jaar', 'Jaar'), regel('wat', 'Wat er gebeurde')],
            preview: { select: { title: 'jaar', subtitle: 'wat' } },
          },
        ],
      }),
    ]),
    blok('s21', 'S21-reeks', [
      regel('eyebrow', 'Klein kopje'),
      regel('titel', 'Kop'),
      alinea('lead', 'Eerste alinea'),
      alinea('body', 'Tweede alinea'),
      regel('knop', 'Tekst op de knop'),
    ]),
    blok('galerie', 'Galerie: andere kunstenaars', [
      regel('eyebrow', 'Klein kopje'),
      regel('titel', 'Kop'),
      alinea('lead', 'Introductie', 'Leg uit dat dit deel van het museum voor andere kunstenaars is.'),
      alinea('leeg', 'Tekst zolang er nog geen werk in staat'),
    ]),
    // Field name kept: renaming it would empty the block on the live site.
    blok('nieuws', 'Blog', [
      regel('eyebrow', 'Klein kopje'),
      regel('titel', 'Kop', 'Staat boven de berichten, en is de titel van de blogpagina.'),
      alinea('lead', 'Introductie'),
    ]),
    blok('bezoek', 'Bezoek', [
      regel('eyebrow', 'Klein kopje'),
      regel('titel', 'Kop'),
      alinea('lead', 'Introductie'),
      defineField({
        name: 'rijen',
        title: 'Gegevens',
        description: 'Adres, openingstijden, entree. Vul in zodra ze bekend zijn.',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [regel('label', 'Wat'), regel('waarde', 'Wat er staat')],
            preview: { select: { title: 'label', subtitle: 'waarde' } },
          },
        ],
      }),
      alinea('note', 'Zin onder de gegevens'),
    ]),
    blok('nieuwsbrief', 'Nieuwsbrief', [
      regel('eyebrow', 'Klein kopje'),
      regel('titel', 'Kop'),
      alinea('lead', 'Introductie'),
      alinea('consent', 'Zin naast de knop', 'Wat er met het e-mailadres gebeurt.'),
    ]),
    blok('footer', 'Onderaan de pagina', [
      regel('rechten', 'Regel onder de naam'),
      regel('demo', 'Kleine regel onderaan'),
    ]),
  ],
  preview: {
    prepare: () => ({ title: 'Teksten op de site' }),
  },
});
