import { defineField, defineType } from 'sanity';

/**
 * All editable copy on the site, in one document. The client edits sentences,
 * never structure: section order, buttons and labels stay in the code, so no
 * edit here can leave the page broken or empty.
 *
 * Every block carries an English version of itself, folded away underneath the
 * Dutch. Dutch is the site and English is the translation, so English is never
 * required: an empty English field shows the Dutch sentence on the English
 * page rather than a hole.
 */

type Veld = ReturnType<typeof defineField>;

const regel = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'string', description });

const alinea = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'text', rows: 4, description });

const lijst = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'array',
    of: [{ type: 'text', rows: 4 }],
  });

/** The English half of a block: the same boxes, none of them required. */
const engels = (fields: Veld[]) =>
  defineField({
    name: 'en',
    title: 'English',
    type: 'object',
    options: { collapsible: true, collapsed: true },
    description:
      'De Engelse versie van dit blok, voor /en. Leeg laten mag: dan staat de Nederlandse tekst op de Engelse pagina.',
    fields,
  });

const blok = (name: string, title: string, fields: Veld[], vertaalbaar: Veld[], collapsed = true) =>
  defineField({
    name,
    title,
    type: 'object',
    options: { collapsible: true, collapsed },
    fields: [...fields, engels(vertaalbaar)],
  });

export const siteTeksten = defineType({
  name: 'siteTeksten',
  title: 'Teksten op de site',
  type: 'document',
  fields: [
    blok(
      'hero',
      'Bovenaan de pagina',
      [
        regel('titel', 'Naam van het museum'),
        regel('tagline', 'Ondertitel'),
        alinea('lead', 'Introductie', 'De eerste zinnen die een bezoeker leest.'),
        regel('knop', 'Tekst op de knop'),
      ],
      [regel('titel', 'Naam'), regel('tagline', 'Ondertitel'), alinea('lead', 'Introductie'), regel('knop', 'Knop')],
      false,
    ),
    blok(
      'over',
      'Over ons',
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        lijst('alineas', 'Tekst', 'Elke regel in deze lijst wordt een alinea.'),
      ],
      [regel('eyebrow', 'Klein kopje'), regel('titel', 'Kop'), lijst('alineas', 'Tekst')],
    ),
    blok(
      'werk',
      'Collectie',
      [regel('eyebrow', 'Klein kopje'), regel('titel', 'Kop'), alinea('lead', 'Introductie')],
      [regel('eyebrow', 'Klein kopje'), regel('titel', 'Kop'), alinea('lead', 'Introductie')],
    ),
    blok(
      's21',
      'S21-reeks',
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Eerste alinea'),
        alinea('body', 'Tweede alinea'),
        regel('knop', 'Tekst op de knop'),
      ],
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Eerste alinea'),
        alinea('body', 'Tweede alinea'),
        regel('knop', 'Tekst op de knop'),
      ],
    ),
    blok(
      'peter',
      'Over Peter Klashorst',
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        lijst('alineas', 'Tekst', 'Elke regel in deze lijst wordt een alinea.'),
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
      ],
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        lijst('alineas', 'Tekst'),
        regel('portretCredit', 'Fotograaf'),
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
      ],
    ),
    blok(
      'galerie',
      'Galerie: andere kunstenaars',
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie', 'Leg uit dat dit deel van het museum voor andere kunstenaars is.'),
        alinea('leeg', 'Tekst zolang er nog geen werk in staat'),
      ],
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie'),
        alinea('leeg', 'Tekst zolang er nog geen werk in staat'),
      ],
    ),
    // Field name kept: renaming it would empty the block on the live site.
    blok(
      'nieuws',
      'Blog',
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop', 'Staat boven de berichten, en is de titel van de blogpagina.'),
        alinea('lead', 'Introductie'),
      ],
      [regel('eyebrow', 'Klein kopje'), regel('titel', 'Kop'), alinea('lead', 'Introductie')],
    ),
    blok(
      'bezoek',
      'Bezoek',
      [
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
      ],
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie'),
        defineField({
          name: 'rijen',
          title: 'Gegevens',
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
      ],
    ),
    blok(
      'nieuwsbrief',
      'Nieuwsbrief',
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie'),
        alinea('consent', 'Zin naast de knop', 'Wat er met het e-mailadres gebeurt.'),
      ],
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie'),
        alinea('consent', 'Zin naast de knop'),
      ],
    ),
    blok(
      'footer',
      'Onderaan de pagina',
      [regel('rechten', 'Regel onder de naam'), regel('demo', 'Kleine regel onderaan')],
      [regel('rechten', 'Regel onder de naam'), regel('demo', 'Kleine regel onderaan')],
    ),
  ],
  preview: {
    prepare: () => ({ title: 'Teksten op de site' }),
  },
});
