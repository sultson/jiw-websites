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

/**
 * How a text box behaves on the site, said in every text box, because the
 * client was typing both of these and reading them back unchanged: blank lines
 * arrived as one block of text and asterisks arrived as asterisks.
 */
const OPMAAK = 'Een witregel begint een nieuwe alinea. *schuin* en **vet** mogen.';

const alinea = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'text',
    rows: 4,
    description: description ? `${description} ${OPMAAK}` : OPMAAK,
  });

const lijst = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description: description ? `${description} ${OPMAAK}` : OPMAAK,
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
      'werk',
      'Klashorst Collectie',
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie'),
        alinea('leeg', 'Tekst zolang er nog geen werk in staat'),
      ],
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie'),
        alinea('leeg', 'Tekst zolang er nog geen werk in staat'),
      ],
    ),
    blok(
      'peter',
      'De Kunstenaar',
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
        // A second photograph, under the first, in the space the biography
        // leaves open next to it. Optional: left empty there is simply one.
        defineField({
          name: 'tweedeFoto',
          title: 'Tweede foto',
          type: 'image',
          options: { hotspot: false },
          description: 'Optioneel. Komt onder de portretfoto te staan.',
        }),
        regel('tweedeFotoCredit', 'Fotograaf tweede foto'),
      ],
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        lijst('alineas', 'Tekst'),
        regel('portretCredit', 'Fotograaf'),
        regel('tweedeFotoCredit', 'Fotograaf tweede foto'),
      ],
    ),
    blok(
      'galerie',
      'Andere Kunst',
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
      'Dirty Diaries',
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop', 'Staat boven de berichten, en is de titel van de blogpagina.'),
        alinea('lead', 'Introductie'),
        alinea('leeg', 'Tekst zolang er nog geen bericht is'),
      ],
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie'),
        alinea('leeg', 'Tekst zolang er nog geen bericht is'),
      ],
    ),
    blok(
      'bezoek',
      'Bezoek Museum',
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
        regel('knop', 'Tekst op de knop'),
        alinea('gelukt', 'Bevestiging op de pagina', 'Wat de bezoeker leest zodra de aanmelding verstuurd is.'),
      ],
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie'),
        alinea('consent', 'Zin naast de knop'),
        regel('knop', 'Tekst op de knop'),
        alinea('gelukt', 'Bevestiging op de pagina'),
      ],
    ),
    blok(
      'contact',
      'Stel een vraag',
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie', 'De zin onder de kop, boven het formulier.'),
        defineField({
          name: 'waarvoor',
          title: 'Waarvoor mensen schrijven',
          description:
            'De blokjes onder de introductie. Per blokje een kopje en een zin, zodat een bezoeker weet of zijn vraag hier thuishoort.',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [regel('label', 'Kopje'), alinea('wat', 'Zin eronder')],
              preview: { select: { title: 'label', subtitle: 'wat' } },
            },
          ],
        }),
        regel('knop', 'Tekst op de knop'),
        alinea('gelukt', 'Bevestiging op de pagina', 'Wat de bezoeker leest zodra de vraag verstuurd is.'),
        regel('mailVraag', 'Zin boven het e-mailadres', 'Bijvoorbeeld: Liever zelf een mail versturen?'),
        defineField({
          name: 'mail',
          title: 'E-mailadres van het museum',
          type: 'string',
          description:
            'Staat onder het formulier en opent het mailprogramma van de bezoeker. Leeg laten mag: dan staat er alleen een formulier. Let op: dit verandert alleen wat er op de pagina staat. Waar het ingevulde formulier zelf naartoe wordt gestuurd, staat vast in de site; laat het ons weten als dat ergens anders heen moet.',
          validation: (rule) =>
            rule
              .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'e-mailadres' })
              .warning('Dit lijkt geen geldig e-mailadres.'),
        }),
      ],
      [
        regel('eyebrow', 'Klein kopje'),
        regel('titel', 'Kop'),
        alinea('lead', 'Introductie'),
        defineField({
          name: 'waarvoor',
          title: 'Waarvoor mensen schrijven',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [regel('label', 'Kopje'), alinea('wat', 'Zin eronder')],
              preview: { select: { title: 'label', subtitle: 'wat' } },
            },
          ],
        }),
        regel('knop', 'Tekst op de knop'),
        alinea('gelukt', 'Bevestiging op de pagina'),
        regel('mailVraag', 'Zin boven het e-mailadres'),
        regel('mail', 'E-mailadres van het museum'),
      ],
    ),
    // The bar at the top and the same links again at the foot of the page. The
    // section headings above are the museum's own and longer; these are what
    // fits in a menu, so they are their own boxes rather than a copy.
    blok(
      'menu',
      'Menu bovenaan en onderaan',
      [
        regel('werk', 'Klashorst Collectie'),
        regel('peter', 'De Kunstenaar'),
        regel('blog', 'Dirty Diaries'),
        regel('galerie', 'Andere Kunst'),
        regel('bezoek', 'Bezoek Museum'),
        regel('contact', 'Contact'),
        regel('nieuwsbrief', 'Knop Nieuwsbrief'),
      ],
      [
        regel('werk', 'Klashorst Collectie'),
        regel('peter', 'De Kunstenaar'),
        regel('blog', 'Dirty Diaries'),
        regel('galerie', 'Andere Kunst'),
        regel('bezoek', 'Bezoek Museum'),
        regel('contact', 'Contact'),
        regel('nieuwsbrief', 'Knop Nieuwsbrief'),
      ],
    ),
    blok(
      'nietGevonden',
      'Pagina niet gevonden (404)',
      [
        regel('titel', 'Kop'),
        alinea('tekst', 'Tekst eronder', 'Wat een bezoeker leest die op een verlopen link klikt.'),
      ],
      [regel('titel', 'Kop'), alinea('tekst', 'Tekst eronder')],
    ),
    blok(
      'footer',
      'Onderaan de pagina',
      [regel('rechten', 'Regel onder de naam'), regel('demo', 'Kleine regel onderaan')],
      [regel('rechten', 'Regel onder de naam'), regel('demo', 'Kleine regel onderaan')],
    ),
    // What the front page looks like in Google and in a shared link. Every
    // blog post already has this on its own Vindbaarheid-tabblad; the page the
    // museum will be found by first had it only in the code.
    blok(
      'vindbaarheid',
      'Vindbaarheid van de voorpagina',
      [
        defineField({
          name: 'titel',
          title: 'Titel in de zoekresultaten',
          type: 'string',
          description:
            'De blauwe regel in Google, en de naam van het tabblad. Leeg laten mag: dan gebruikt de site zijn eigen titel. Tussen de 30 en 60 tekens leest het beste.',
          validation: (rule) => rule.max(70).warning('Google kapt langere titels af.'),
        }),
        defineField({
          name: 'omschrijving',
          title: 'Omschrijving in de zoekresultaten',
          type: 'text',
          rows: 3,
          description:
            'De twee regels onder de blauwe link, en de tekst onder een gedeelde link. Tussen de 70 en 160 tekens.',
          validation: (rule) => rule.max(180).warning('Google kapt langere omschrijvingen af.'),
        }),
      ],
      [
        defineField({
          name: 'titel',
          title: 'Titel in de zoekresultaten',
          type: 'string',
          validation: (rule) => rule.max(70).warning('Google kapt langere titels af.'),
        }),
        defineField({
          name: 'omschrijving',
          title: 'Omschrijving in de zoekresultaten',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.max(180).warning('Google kapt langere omschrijvingen af.'),
        }),
      ],
    ),
  ],
  preview: {
    prepare: () => ({ title: 'Teksten op de site' }),
  },
});
