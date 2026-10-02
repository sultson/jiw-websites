import { defineField, defineType } from 'sanity';
import DatumInvoer from '../components/DatumInvoer';
import TijdInvoer from '../components/TijdInvoer';
import Keren from '../components/Keren';

/**
 * Eén regel in de agenda.
 *
 * Dit is het scherm dat het vaakst gebruikt wordt, dus het moet het simpelste
 * scherm zijn. Uitgangspunt: wat er wekelijks gebeurt vul je één keer in.
 * De inloop van elke donderdag is hier één document met "elke week" erop, niet
 * tweeënvijftig documenten. De site rekent de losse datums zelf uit.
 *
 * Alles staat op één pagina. Het stond eerst in drie tabbladen (Wat, Wanneer,
 * Meedoen), en dan is één workshop invoeren drie keer klikken naar een scherm
 * waarvan je niet ziet of er nog iets in staat. Wat niet van toepassing is,
 * verdwijnt vanzelf: bij een mededeling blijven alleen de velden staan die
 * ergens over gaan.
 *
 * Een vakantiesluiting of een afgelaste ochtend is geen activiteit maar een
 * mededeling. Dat is hetzelfde formulier met een ander vinkje bovenaan, want
 * het is voor de invuller dezelfde handeling: er staat iets in de agenda dat
 * bezoekers moeten weten.
 */

const isMededeling = ({ parent }: { parent?: { soort?: string } }) =>
  parent?.soort === 'mededeling';

export const activiteit = defineType({
  name: 'activiteit',
  title: 'Agenda',
  type: 'document',
  fieldsets: [
    // Van en tot naast elkaar: het is één gegeven en het leest als één regel.
    { name: 'tijd', title: 'Hoe laat', options: { columns: 2 } },
  ],
  fields: [
    defineField({name:'archief',title:'Archiveren',type:'boolean',description:'Een gearchiveerd moment verschijnt niet in de agenda op de site.',initialValue:false}),
    defineField({name:'slug',title:'Adres van dit moment',type:'slug',options:{source:'titel'},description:'Een uniek adres voor dit agendamoment.'}),
    defineField({name:'activiteitType',title:'Vaste activiteit',type:'string',description:'Koppelt dit moment aan de bijbehorende activiteit op de bezoekroutes.',options:{list:[{title:'Inloopochtend',value:'inloopochtend'},{title:'Inloopavond',value:'inloopavond'},{title:'Inloop met activiteit',value:'inloop-met-activiteit'},{title:'Wandelen',value:'wandelen'},{title:'Zenmeditatie',value:'zenmeditatie'},{title:'Mandala stippen',value:'mandala-stippen'},{title:'Encaustic art',value:'encaustic-art'},{title:'Junk journaling',value:'junk-journaling'},{title:'Voetreflexmassage',value:'voetreflexmassage'},{title:'Sponsordiner',value:'sponsordiner'}]}}),
    defineField({name:'categorieen',title:'Extra categorieën',type:'array',of:[{type:'string'}],options:{list:['Inloop','Creatief','Bewegen','Wellness','Overig']}}),
    defineField({name:'volgeboekt',title:'Volgeboekt',type:'boolean',initialValue:false}),
    defineField({name:'aanmeldEmail',title:'E-mailadres voor aanmelding',type:'string',description:'Optioneel: opent een e-mail in plaats van het formulier op de site. Laat beide aanmeldvelden leeg voor het eigen aanmeldformulier.'}),
    defineField({name:'aanmeldUrl',title:'Externe aanmeldpagina',type:'url',description:'Heeft voorrang op het e-mailadres. Zonder externe bestemming gebruikt de site het eigen aanmeldformulier.',validation:r=>r.uri({scheme:['https']})}),

    defineField({
      name: 'soort',
      title: 'Wat zet u in de agenda?',
      type: 'string',
      initialValue: 'activiteit',
      options: {
        layout: 'radio',
        list: [
          { title: 'Een activiteit waar mensen naartoe kunnen', value: 'activiteit' },
          { title: 'Een mededeling, bijvoorbeeld een vakantiesluiting', value: 'mededeling' },
        ],
      },
    }),
    defineField({
      name: 'titel',
      title: 'Naam',
      type: 'string',
      description: 'Bijvoorbeeld "Inloopochtend" of "Workshop encaustic art".',
      validation: (rule) => rule.required().error('Zonder naam is er niets te zien in de agenda.'),
    }),
    defineField({
      name: 'categorie',
      title: 'Soort activiteit',
      type: 'string',
      initialValue: 'Inloop',
      description:
        'Bepaalt het sfeerbeeld zonder eigen foto. Categorieën bepalen de labels en knoppen in de agenda: Inloop heet daar Ontmoeten, Wellness heet Ontspannen.',
      hidden: isMededeling,
      options: {
        list: [
          { title: 'Inloop', value: 'Inloop' },
          { title: 'Creatief', value: 'Creatief' },
          { title: 'Bewegen', value: 'Bewegen' },
          { title: 'Wellness', value: 'Wellness' },
          { title: 'Overig', value: 'Overig' },
        ],
      },
    }),
    defineField({
      name: 'doelgroepen',
      title: 'Voor wie is het',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['iedereen'],
      description:
        'Bepaalt het doelgroepfilter in de agenda. Specifiek voor jongeren of 35 tot 50 verschijnt ook op Jong & kanker; specifiek voor naasten ook op Voor naasten. Kies Iedereen voor algemeen aanbod.',
      hidden: isMededeling,
      options: {
        layout: 'grid',
        list: [
          { title: 'Iedereen', value: 'iedereen' },
          { title: 'Jongeren en jongvolwassenen (15 tot 35)', value: 'jongeren-15-35' },
          { title: 'Mensen van 35 tot 50', value: '35-50' },
          { title: 'Naasten: partner, kind, familie of vriend', value: 'naasten' },
        ],
      },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'themas',
      title: 'Thema\'s',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Bepaalt onder welke themafilters deze activiteit in de agenda verschijnt. Meerdere thema\'s zijn mogelijk.',
      hidden: isMededeling,
      options: {
        layout: 'grid',
        list: [
          { title: 'Ontmoeten', value: 'ontmoeten' },
          { title: 'Bewegen & ontspannen', value: 'bewegen-en-ontspannen' },
          { title: 'Werk & studie', value: 'werk-en-studie' },
          { title: 'Herstel & energie', value: 'herstel-en-energie' },
          { title: 'Relaties & gezin', value: 'relaties-en-gezin' },
          { title: 'Informatie & inspiratie', value: 'informatie-en-inspiratie' },
        ],
      },
      // Een waarschuwing en geen fout: zonder thema kan het gewoon in de agenda
      // staan, alleen niet op een themapagina. Dat mag de invuller weten zonder
      // dat het opslaan erdoor tegengehouden wordt.
      validation: (rule) =>
        rule
          .unique()
          .custom((waarde) =>
            Array.isArray(waarde) && waarde.length
              ? true
              : 'Zonder thema is dit zichtbaar bij Alle thema’s, maar niet bij een specifiek themafilter.',
          )
          .warning(),
    }),

    defineField({
      name: 'omschrijving',
      title: 'Waar gaat het over',
      type: 'text',
      rows: 4,
      description:
        'Een paar zinnen, zoals u ze ook op Facebook zou zetten. Dit staat op de kaart in de agenda.',
    }),
    defineField({
      name: 'afbeelding',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
      description:
        'Mag leeg blijven. Zonder eigen foto krijgt de kaart het sfeerbeeld dat bij de categorie hoort.',
      hidden: isMededeling,
    }),

    defineField({name:'reeksFotos', title:'Extra foto’s voor afwisseling in de reeks',type:'array',of:[{type:'image',options:{hotspot:true}}],
      description:'Optioneel. De hoofdfoto en deze foto’s wisselen per datum af, in deze volgorde. Elke datum houdt hetzelfde beeld zolang u de reeks en de fotovolgorde niet wijzigt. Met alleen de hoofdfoto gebruiken alle datums dat beeld.',
      hidden:({parent})=>parent?.soort==='mededeling'||!parent?.herhaling||parent.herhaling==='eenmalig',validation:r=>r.max(6)}),
    defineField({
      name: 'vervangtReeks', title: 'Vervangt op deze datum de gewone inloop', type: 'reference', to: [{type:'activiteit'}],
      options: {filter: 'archief != true && soort == "activiteit" && herhaling in ["wekelijks", "tweewekelijks", "maandelijks"]'},
      description: 'Kies de vaste reeks als dit een bijzondere invulling van dezelfde ochtend is. De site toont dan alleen dit moment. Laat leeg als beide activiteiten naast elkaar plaatsvinden. Archiveert u dit bijzondere moment, dan verschijnt de gewone inloop weer.',
      hidden: ({parent}) => parent?.soort === 'mededeling' || (parent?.herhaling && parent.herhaling !== 'eenmalig'),
    }),

    defineField({
      name: 'datum',
      title: 'Datum',
      type: 'date',
      components: { input: DatumInvoer },
      description: 'Herhaalt het zich? Vul dan de eerste keer in, de rest rekent de site zelf uit.',
      validation: (rule) => rule.required().error('Een agendapunt heeft een datum nodig.'),
    }),
    defineField({
      name: 'totDatum',
      title: 'Tot en met',
      type: 'date',
      components: { input: DatumInvoer },
      description: 'De laatste dag van de sluiting of de mededeling.',
      hidden: ({ parent }) => parent?.soort !== 'mededeling',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { soort?: string; datum?: string } | undefined;
          if (parent?.soort !== 'mededeling') return true;
          if (!value) return 'Tot wanneer geldt dit? Zonder einddatum blijft de melding staan.';
          if (parent.datum && value < parent.datum) return 'Dit ligt vóór de begindatum.';
          return true;
        }),
    }),
    defineField({
      name: 'heleDag',
      title: 'Duurt de hele dag',
      type: 'boolean',
      initialValue: false,
      hidden: isMededeling,
    }),
    defineField({
      name: 'begintijd',
      title: 'Van',
      type: 'string',
      fieldset: 'tijd',
      placeholder: '10:00',
      components: { input: TijdInvoer },
      hidden: ({ parent }) => parent?.soort === 'mededeling' || parent?.heleDag === true,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { soort?: string; heleDag?: boolean } | undefined;
          if (parent?.soort === 'mededeling' || parent?.heleDag) return true;
          return value ? true : 'Hoe laat begint het?';
        }),
    }),
    defineField({
      name: 'eindtijd',
      title: 'Tot',
      type: 'string',
      fieldset: 'tijd',
      placeholder: '12:00',
      components: { input: TijdInvoer },
      hidden: ({ parent }) => parent?.soort === 'mededeling' || parent?.heleDag === true,
    }),

    defineField({
      name: 'herhaling',
      title: 'Herhaalt zich',
      type: 'string',
      initialValue: 'eenmalig',
      hidden: isMededeling,
      description: 'Vul dit in en u hoeft de inloop maar één keer in te voeren.',
      options: {
        layout: 'radio',
        list: [
          { title: 'Niet, het is één keer', value: 'eenmalig' },
          { title: 'Elke week', value: 'wekelijks' },
          { title: 'Om de week', value: 'tweewekelijks' },
          // Niet "dezelfde datum" maar dezelfde weekdag: 3 september is de
          // eerste donderdag, en dan wordt het elke eerste donderdag. Zo staat
          // het ook in hun eigen agenda ("elke derde donderdag van de maand").
          {
            title: 'Elke maand, op dezelfde weekdag (bijvoorbeeld elke eerste donderdag)',
            value: 'maandelijks',
          },
        ],
      },
    }),
    defineField({
      name: 'herhaalTot',
      title: 'Herhalen tot en met',
      type: 'date',
      components: { input: DatumInvoer },
      description:
        'Tot wanneer moet dit in de agenda blijven staan? Bijvoorbeeld tot de zomervakantie. Laat u dit leeg, dan loopt het door.',
      hidden: ({ parent }) =>
        parent?.soort === 'mededeling' || !parent?.herhaling || parent?.herhaling === 'eenmalig',
    }),
    defineField({
      name: 'overslaan',
      title: 'De keren dat dit plaatsvindt',
      type: 'array',
      of: [{ type: 'date' }],
      // De lijst rekent de datums uit en zet ze als schakelaars neer; wat
      // uitgezet wordt komt hier als datum in te staan.
      components: { input: Keren },
      description: 'Gaat een keer niet door? Zet hem uit, dan verdwijnt die datum uit de agenda.',
      hidden: ({ parent }) =>
        parent?.soort === 'mededeling' || !parent?.herhaling || parent?.herhaling === 'eenmalig',
    }),

    defineField({
      name: 'aanmelden',
      title: 'Aanmelden nodig',
      type: 'boolean',
      initialValue: false,
      description:
        'Staat dit uit, dan zegt de site "loop zo binnen". Staat het aan, dan komt er een knop bij om zich op te geven.',
      hidden: isMededeling,
    }),
    defineField({
      name: 'bijdrage',
      title: 'Wat het kost',
      type: 'string',
      placeholder: 'Gratis',
      description: 'Bijvoorbeeld "Gratis", "€ 7,50" of "Een vrije gift".',
      hidden: isMededeling,
    }),
    defineField({
      name: 'locatie',
      title: 'Waar',
      type: 'string',
      placeholder: 'Mazerhard 37, Zeewolde',
      description: 'Alleen invullen als het ergens anders is dan in het huis zelf.',
      hidden: isMededeling,
    }),
  ],
  orderings: [
    { name: 'datumAsc', title: 'Eerstvolgende bovenaan', by: [{ field: 'datum', direction: 'asc' }] },
    { name: 'datumDesc', title: 'Nieuwste bovenaan', by: [{ field: 'datum', direction: 'desc' }] },
  ],
  preview: {
    select: {
      title: 'titel',
      soort: 'soort',
      datum: 'datum',
      begintijd: 'begintijd',
      herhaling: 'herhaling',
      categorie: 'categorie',
      media: 'afbeelding',
    },
    prepare: ({ title, soort, datum, begintijd, herhaling, categorie, media }) => {
      const herhaalt: Record<string, string> = {
        wekelijks: 'elke week',
        tweewekelijks: 'om de week',
        maandelijks: 'elke maand',
      };
      const wanneer = datum
        ? new Date(datum).toLocaleDateString('nl-NL', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })
        : 'geen datum';
      return {
        title,
        media,
        subtitle: [
          soort === 'mededeling' ? 'Mededeling' : categorie,
          wanneer,
          begintijd,
          herhaalt[herhaling],
        ]
          .filter(Boolean)
          .join(' · '),
      };
    },
  },
});
