import { defineField, defineType } from 'sanity';
import { tekstblokken } from './nieuws';

/**
 * Het verhaal van iemand die Toon over Leven zelf heeft bezocht.
 *
 * De vier pagina's onder Ervaringen laten zien wat een bezoek met iemand doet.
 * Wat daar staat moet van een echt mens komen: een verzonnen verhaal zou
 * overtuigend klinken en precies het tegenovergestelde doen van waar deze
 * pagina's voor zijn. Daarom kan een verhaal alleen online komen als de
 * verteller er zelf toestemming voor heeft gegeven, en kan het er ook weer af.
 *
 * Zolang er niets gepubliceerd staat, laat de site dat gewoon zien. Dat is
 * eerlijker dan een pagina vullen met iets dat niemand verteld heeft.
 */

const RUBRIEKEN = [
  { title: 'Verhalen van bezoekers', value: 'bezoekers' },
  { title: 'Jong & kanker', value: 'jong' },
  { title: 'Naasten', value: 'naasten' },
  { title: 'Leven na behandeling', value: 'na-behandeling' },
];

export const verhaal = defineType({
  name: 'verhaal',
  title: 'Verhalen van bezoekers',
  type: 'document',
  groups: [
    { name: 'verhaal', title: 'Verhaal', default: true },
    { name: 'publicatie', title: 'Toestemming en publicatie' },
  ],
  fields: [
    defineField({
      name: 'kop',
      title: 'Kop',
      type: 'string',
      group: 'verhaal',
      description: 'Bij voorkeur in de woorden van de verteller zelf.',
      validation: (rule) => rule.required().error('Een verhaal heeft een kop nodig.'),
    }),
    defineField({
      name: 'verteller',
      title: 'Wie vertelt dit?',
      type: 'string',
      group: 'verhaal',
      description:
        'Zoals het onder het verhaal komt te staan, bijvoorbeeld Marja of een bezoeker. De site zet er "Verteld door" voor. Vraag de verteller hoe hij of zij genoemd wil worden; een voornaam is genoeg en anoniem mag ook.',
      validation: (rule) =>
        rule.required().error('Zonder verteller weet de lezer niet van wie dit verhaal is.'),
    }),
    defineField({
      name: 'rubriek',
      title: 'Op welke pagina hoort dit verhaal?',
      type: 'string',
      group: 'verhaal',
      options: { list: RUBRIEKEN, layout: 'radio' },
      initialValue: 'bezoekers',
      description: 'Het verhaal komt op deze pagina onder Ervaringen te staan.',
      validation: (rule) => rule.required().error('Kies waar dit verhaal thuishoort.'),
    }),
    defineField({
      name: 'intro',
      title: 'Inleiding',
      type: 'text',
      rows: 3,
      group: 'verhaal',
      description:
        'De paar zinnen die als eerste gelezen worden. Laat je dit leeg, dan neemt de site het begin van het verhaal.',
      validation: (rule) => rule.max(300).warning('Kort houden leest het prettigst.'),
    }),
    defineField({
      name: 'body',
      title: 'Het verhaal',
      type: 'array',
      group: 'verhaal',
      description:
        'De woorden van de verteller. Typ gewoon door; met de knoppen maak je een tussenkop, een opsomming, vette tekst of een link.',
      of: tekstblokken,
    }),
    defineField({
      name: 'afbeelding',
      title: 'Foto',
      type: 'image',
      group: 'verhaal',
      options: { hotspot: true },
      description:
        'Optioneel. Alleen plaatsen als de verteller ook voor de foto toestemming heeft gegeven.',
    }),
    defineField({
      name: 'datum',
      title: 'Datum',
      type: 'date',
      group: 'verhaal',
      options: { dateFormat: 'D MMMM YYYY' },
      description:
        'Wanneer het verhaal is opgetekend. Bepaalt de volgorde: het nieuwste staat vooraan.',
    }),
    defineField({
      name: 'link',
      title: 'Link naar het hele verhaal',
      type: 'url',
      group: 'verhaal',
      description:
        'Staat het volledige verhaal ergens anders, bijvoorbeeld in een bericht op deze site? Plak hier de link, dan komt er onder het verhaal een knop naartoe.',
      validation: (rule) =>
        rule
          .uri({ scheme: ['http', 'https'], allowRelative: true })
          .error('Dit lijkt geen geldig adres.'),
    }),

    defineField({
      name: 'toestemming',
      title: 'De verteller geeft toestemming om dit te publiceren',
      type: 'boolean',
      group: 'publicatie',
      initialValue: false,
      description:
        'Een verhaal mag alleen online met toestemming van de verteller zelf. Bespreek vooraf wat er komt te staan, welke naam eronder komt, of de foto meegaat en dat het verhaal er op verzoek weer af gaat. Zonder dit vinkje publiceert de site het verhaal niet.',
    }),
    defineField({
      name: 'status',
      title: 'Publicatiestatus',
      type: 'string',
      group: 'publicatie',
      options: {
        list: [
          { title: 'Concept, nog niet zichtbaar', value: 'concept' },
          { title: 'Gepubliceerd, staat op de site', value: 'gepubliceerd' },
          { title: 'Ingetrokken, weer van de site af', value: 'ingetrokken' },
        ],
        layout: 'radio',
      },
      initialValue: 'concept',
      description:
        'Alleen een gepubliceerd verhaal is op de site te zien. Trekt de verteller de toestemming in, zet het dan op ingetrokken; het verhaal blijft dan hier staan maar verdwijnt van de site.',
      validation: (rule) =>
        rule.custom((waarde, context) => {
          const doc = context.document as { toestemming?: boolean } | undefined;
          if (waarde === 'gepubliceerd' && doc?.toestemming !== true) {
            return 'Dit verhaal kan pas gepubliceerd worden als de verteller toestemming heeft gegeven.';
          }
          return true;
        }),
    }),
  ],
  orderings: [
    {
      name: 'datumDesc',
      title: 'Zoals op de site',
      by: [{ field: 'datum', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'kop',
      verteller: 'verteller',
      rubriek: 'rubriek',
      status: 'status',
      toestemming: 'toestemming',
      media: 'afbeelding',
    },
    prepare: ({ title, verteller, rubriek, status, toestemming, media }) => ({
      title,
      media,
      subtitle: [
        verteller,
        RUBRIEKEN.find((r) => r.value === rubriek)?.title,
        status === 'gepubliceerd' && toestemming === true
          ? 'Op de site'
          : status === 'ingetrokken'
            ? 'Ingetrokken'
            : 'Nog niet zichtbaar',
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
