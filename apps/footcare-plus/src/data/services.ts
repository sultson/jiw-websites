// Services for Pedicurepraktijk FootCare+.
// Tarieven zijn niet publiek bekend; prijs is daarom weggelaten en de
// Services-component toont geen prijskolom. Bron-tagged op research-report.md.
//
// SOURCE: research-report.md "Services (verified menu)" + Pedicure.nl listing.

export type Service = {
  id: string;
  nameNl: string;
  descNl?: string;
  durationMin?: number;
};

export type ServiceCategoryIcon = 'foot' | 'stethoscope' | 'nail' | 'hand';

export type ServiceCategory = {
  id: string;
  titleNl: string;
  icon: ServiceCategoryIcon;
  intro?: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'pedicure',
    titleNl: 'Pedicure',
    icon: 'foot',
    intro:
      'De basisbehandeling: nagels knippen en bijvijlen, eelt en likdoorns weghalen, nagelriemen verzorgen en de voet kort masseren.',
    services: [
      {
        id: 'pedicure-basis',
        nameNl: 'Pedicurebehandeling',
        descNl:
          'Nagels op lengte, eelt en likdoorns weg, nagelriemen verzorgen, afsluitend een korte voetmassage.',
      },
      {
        id: 'cosmetisch',
        nameNl: 'Cosmetische afwerking',
        descNl: 'Nagels lakken in de kleur van de cliënt (zelf meebrengen mag).',
      },
    ],
  },

  {
    id: 'medisch',
    titleNl: 'Medische pedicure',
    icon: 'stethoscope',
    intro:
      'Voor voeten die meer aandacht vragen door diabetes, reuma, oncologische behandeling, spasticiteit of langdurige verwaarlozing. KRP-aantekeningen geregistreerd via Provoet.',
    services: [
      {
        id: 'diabetische-voet',
        nameNl: 'Diabetische voetzorg',
        descNl:
          'Inclusief screening op gevoel en doorbloeding. Behandeling afgestemd op het zorgprofiel.',
      },
      {
        id: 'reumatische-voet',
        nameNl: 'Reumatische voetzorg',
        descNl:
          'Zachte behandeling met aandacht voor veranderde voetstand en drukplekken.',
      },
      {
        id: 'oncologische-voet',
        nameNl: 'Oncologische voetzorg',
        descNl: 'Aangepaste behandeling voor gevoelige huid en brossere nagels.',
      },
      {
        id: 'spastische-voet',
        nameNl: 'Spastische voet',
        descNl: 'Behandeling in een houding en tempo die voor jou werkt.',
      },
      {
        id: 'verwaarloosde-voet',
        nameNl: 'Verwaarloosde voet & ouderenvoet',
        descNl:
          'Voor voeten die lang geen aandacht hebben gehad. Stap voor stap weer in conditie.',
      },
      {
        id: 'schimmel',
        nameNl: 'Schimmeldiagnostiek',
        descNl: 'Beoordeling van verkleurde of vervormde nagels en advies over vervolg.',
      },
    ],
  },

  {
    id: 'nageltechniek',
    titleNl: 'Nageltechniek',
    icon: 'nail',
    intro:
      'Voor ingegroeide, gespleten of beschadigde nagels. Doel is een nagel die weer normaal kan uitgroeien zonder druk en pijn.',
    services: [
      {
        id: 'nagelregulatie',
        nameNl: 'Nagelregulatie (nagelbeugel)',
        descNl:
          'Een dunne beugel die de nagel langzaam weer in de goede vorm trekt. Helpt bij ingroeiing.',
      },
      {
        id: 'nagelreparatie',
        nameNl: 'Nagelreparatie / nagelprothese',
        descNl:
          'Een gebroken of ontbrekend stuk nagel wordt opgevuld zodat de nagel weer kan uitgroeien.',
      },
      {
        id: 'antidruk',
        nameNl: 'Anti-druk techniek',
        descNl: 'Drukverdeling op pijnlijke plekken, bijvoorbeeld onder likdoorns.',
      },
    ],
  },

  {
    id: 'massage',
    titleNl: 'Voetmassage & reflex',
    icon: 'hand',
    intro:
      'Voor wie iets extra’s wil naast de pedicurebehandeling, of puur ter ontspanning. Ook als losse afspraak.',
    services: [
      {
        id: 'voetmassage',
        nameNl: 'Voetmassage',
        descNl: 'Ontspannende massage van voet en onderbeen.',
      },
      {
        id: 'voetreflex',
        nameNl: 'Voetreflex',
        descNl: 'Drukpuntmassage volgens de reflexzones in de voet.',
      },
    ],
  },
];
