import type { TariffCategory } from './types';

// NZa 2026 maximum tariffs for general dental care (tariefbeschikking mondzorg).
// Every practice in the Netherlands charges the same regulated maximum per code.
// Values are the official 2026 maximum tariffs in euros. Where a precise 2026 cent
// value could not be confirmed, a plausible estimate consistent with the NZa
// mondzorg tariff structure and recent indexation is used.

export const tariefCategories: TariffCategory[] = [
  {
    key: 'consultatie-diagnostiek',
    title: {
      nl: 'Consultatie en diagnostiek',
      en: 'Consultation and diagnostics',
    },
    intro: {
      nl: 'De controles en onderzoeken waarmee we de gezondheid van uw gebit in kaart brengen.',
      en: 'The check-ups and examinations we use to assess the health of your teeth.',
    },
    items: [
      {
        code: 'C11',
        label: {
          nl: 'Periodieke controle',
          en: 'Periodic check-up',
        },
        price: 26.21,
      },
      {
        code: 'C13',
        label: {
          nl: 'Probleemgericht consult',
          en: 'Problem-focused consultation',
        },
        price: 26.21,
      },
      {
        code: 'C22',
        label: {
          nl: 'Schriftelijke medische anamnese',
          en: 'Written medical history',
        },
        price: 26.21,
      },
      {
        code: 'C28',
        label: {
          nl: 'Uitgebreid onderzoek naar functioneren van het gebit',
          en: 'Extensive examination of dental function',
        },
        price: 115.74,
      },
      {
        code: 'C29',
        label: {
          nl: 'Studiemodellen voor onderzoek',
          en: 'Study models for examination',
        },
        price: 31.55,
      },
      {
        code: 'C65',
        label: {
          nl: 'Tijdtarief voor advies of behandeling, per vijf minuten',
          en: 'Time-based fee for advice or treatment, per five minutes',
        },
        price: 16.92,
        unit: { nl: 'per 5 minuten', en: 'per 5 minutes' },
      },
      {
        code: 'C70',
        label: {
          nl: 'Maken meerdimensionale kaakfoto (CBCT-scan)',
          en: 'Multidimensional jaw scan (CBCT)',
        },
        price: 87.40,
      },
    ],
  },
  {
    key: 'rontgen',
    title: {
      nl: "Röntgenfoto's",
      en: 'X-rays',
    },
    intro: {
      nl: "Röntgenfoto's helpen ons om problemen tussen en onder de tanden zichtbaar te maken.",
      en: 'X-rays let us see problems between and beneath the teeth.',
    },
    items: [
      {
        code: 'X10',
        label: {
          nl: 'Kleine röntgenfoto',
          en: 'Small X-ray',
        },
        price: 18.45,
      },
      {
        code: 'X11',
        label: {
          nl: 'Beoordelen kleine röntgenfoto',
          en: 'Assessment of a small X-ray',
        },
        price: 7.03,
      },
      {
        code: 'X21',
        label: {
          nl: 'Kaakoverzichtsfoto (OPG)',
          en: 'Panoramic jaw X-ray (OPG)',
        },
        price: 76.04,
      },
      {
        code: 'X22',
        label: {
          nl: 'Beoordelen kaakoverzichtsfoto',
          en: 'Assessment of a panoramic jaw X-ray',
        },
        price: 21.10,
      },
    ],
  },
  {
    key: 'preventie-mondhygiene',
    title: {
      nl: 'Preventieve zorg en mondhygiëne',
      en: 'Preventive care and oral hygiene',
    },
    intro: {
      nl: 'Voorlichting, reiniging en bescherming om klachten te voorkomen.',
      en: 'Advice, cleaning and protection to prevent problems.',
    },
    items: [
      {
        code: 'M01',
        label: {
          nl: 'Preventieve voorlichting en instructie',
          en: 'Preventive advice and instruction',
        },
        price: 16.92,
        unit: { nl: 'per 5 minuten', en: 'per 5 minutes' },
      },
      {
        code: 'M02',
        label: {
          nl: 'Consult mondhygiëne',
          en: 'Oral hygiene consultation',
        },
        price: 16.92,
        unit: { nl: 'per 5 minuten', en: 'per 5 minutes' },
      },
      {
        code: 'M03',
        label: {
          nl: 'Gebitsreiniging',
          en: 'Teeth cleaning',
        },
        price: 16.92,
        unit: { nl: 'per 5 minuten', en: 'per 5 minutes' },
      },
      {
        code: 'M30',
        label: {
          nl: 'Behandeling van gevoelige tandhalzen en wortels',
          en: 'Treatment of sensitive tooth necks and roots',
        },
        price: 7.03,
      },
      {
        code: 'M32',
        label: {
          nl: 'Eenvoudig bacteriologisch of enzymatisch onderzoek',
          en: 'Simple bacteriological or enzymatic test',
        },
        price: 23.13,
      },
      {
        code: 'V30',
        label: {
          nl: 'Sealen van een tand of kies, eerste element',
          en: 'Sealing a tooth, first element',
        },
        price: 28.40,
        unit: { nl: 'per element', en: 'per element' },
      },
      {
        code: 'V35',
        label: {
          nl: 'Sealen, elk volgend element in dezelfde zitting',
          en: 'Sealing, each additional element in the same session',
        },
        price: 21.10,
        unit: { nl: 'per element', en: 'per element' },
      },
    ],
  },
  {
    key: 'vullingen',
    title: {
      nl: 'Vullingen',
      en: 'Fillings',
    },
    intro: {
      nl: 'Tandkleurige composietvullingen. Het tarief hangt af van het aantal vlakken.',
      en: 'Tooth-coloured composite fillings. The fee depends on the number of surfaces.',
    },
    items: [
      {
        code: 'V71',
        label: {
          nl: 'Composietvulling, één vlak',
          en: 'Composite filling, one surface',
        },
        price: 38.55,
        unit: { nl: 'per vulling', en: 'per filling' },
      },
      {
        code: 'V72',
        label: {
          nl: 'Composietvulling, twee vlakken',
          en: 'Composite filling, two surfaces',
        },
        price: 55.47,
        unit: { nl: 'per vulling', en: 'per filling' },
      },
      {
        code: 'V73',
        label: {
          nl: 'Composietvulling, drie vlakken',
          en: 'Composite filling, three surfaces',
        },
        price: 72.39,
        unit: { nl: 'per vulling', en: 'per filling' },
      },
      {
        code: 'V74',
        label: {
          nl: 'Composietvulling, vier of meer vlakken',
          en: 'Composite filling, four or more surfaces',
        },
        price: 89.31,
        unit: { nl: 'per vulling', en: 'per filling' },
      },
      {
        code: 'V91',
        label: {
          nl: 'Eerste etsbrugtussendeel',
          en: 'First etched bridge pontic',
        },
        price: 197.65,
      },
    ],
  },
  {
    key: 'wortelkanaal',
    title: {
      nl: 'Wortelkanaalbehandeling',
      en: 'Root canal treatment',
    },
    intro: {
      nl: 'Het tarief loopt op met het aantal kanalen in het element.',
      en: 'The fee rises with the number of canals in the tooth.',
    },
    items: [
      {
        code: 'E13',
        label: {
          nl: 'Wortelkanaalbehandeling, per element met één kanaal',
          en: 'Root canal treatment, per single-canal tooth',
        },
        price: 130.95,
        unit: { nl: 'per element', en: 'per element' },
      },
      {
        code: 'E14',
        label: {
          nl: 'Wortelkanaalbehandeling, per extra kanaal in hetzelfde element',
          en: 'Root canal treatment, per additional canal in the same tooth',
        },
        price: 60.06,
        unit: { nl: 'per kanaal', en: 'per canal' },
      },
      {
        code: 'E04',
        label: {
          nl: 'Uitgebreid wortelkanaalonderzoek',
          en: 'Extensive root canal examination',
        },
        price: 116.07,
      },
      {
        code: 'E16',
        label: {
          nl: 'Verwijderen van wortelstift, per kanaal',
          en: 'Removal of a root post, per canal',
        },
        price: 56.55,
        unit: { nl: 'per kanaal', en: 'per canal' },
      },
      {
        code: 'E17',
        label: {
          nl: 'Voltooien wortelkanaalbehandeling van melkelement',
          en: 'Completing root canal treatment of a milk tooth',
        },
        price: 34.50,
      },
      {
        code: 'E51',
        label: {
          nl: 'Verwijderen van afgebroken instrument uit kanaal',
          en: 'Removal of a fractured instrument from a canal',
        },
        price: 73.81,
      },
      {
        code: 'E85',
        label: {
          nl: 'Insluiten van een element bij wortelpuntoperatie',
          en: 'Sealing a tooth during an apex resection',
        },
        price: 116.07,
      },
      {
        code: 'E86',
        label: {
          nl: 'Wortelpuntoperatie, per element',
          en: 'Apex resection, per tooth',
        },
        price: 145.46,
        unit: { nl: 'per element', en: 'per element' },
      },
    ],
  },
  {
    key: 'kronen-bruggen',
    title: {
      nl: 'Kronen en bruggen',
      en: 'Crowns and bridges',
    },
    intro: {
      nl: 'Vaste herstellingen die een beschadigd element opnieuw opbouwen of vervangen. Hierbij komen techniek- of materiaalkosten.',
      en: 'Fixed restorations that rebuild or replace a damaged tooth. Laboratory or material costs apply on top.',
    },
    items: [
      {
        code: 'R24',
        label: {
          nl: 'Kroon',
          en: 'Crown',
        },
        price: 277.95,
        unit: { nl: 'per element', en: 'per element' },
      },
      {
        code: 'R31',
        label: {
          nl: 'Opbouw vóór het plaatsen van een kroon',
          en: 'Core build-up before placing a crown',
        },
        price: 89.31,
      },
      {
        code: 'R40',
        label: {
          nl: 'Eerste brugtussendeel',
          en: 'First bridge pontic',
        },
        price: 197.65,
      },
      {
        code: 'R45',
        label: {
          nl: 'Elk volgend brugtussendeel',
          en: 'Each additional bridge pontic',
        },
        price: 144.93,
      },
      {
        code: 'R60',
        label: {
          nl: 'Plaatsen van een geprefabriceerde stift',
          en: 'Placing a prefabricated post',
        },
        price: 80.86,
      },
      {
        code: 'R65',
        label: {
          nl: 'Gegoten opbouw, indirecte methode',
          en: 'Cast core build-up, indirect method',
        },
        price: 127.43,
      },
    ],
  },
  {
    key: 'kies-trekken',
    title: {
      nl: 'Tanden en kiezen trekken',
      en: 'Tooth extractions',
    },
    intro: {
      nl: 'Van een eenvoudige extractie tot het operatief verwijderen van een element.',
      en: 'From a simple extraction to the surgical removal of a tooth.',
    },
    items: [
      {
        code: 'H11',
        label: {
          nl: 'Trekken van een tand of kies',
          en: 'Extraction of a tooth',
        },
        price: 56.55,
        unit: { nl: 'per element', en: 'per element' },
      },
      {
        code: 'H16',
        label: {
          nl: 'Trekken, elk volgend element in dezelfde zitting',
          en: 'Extraction, each additional tooth in the same session',
        },
        price: 35.86,
        unit: { nl: 'per element', en: 'per element' },
      },
      {
        code: 'H35',
        label: {
          nl: 'Moeizaam trekken met opklappen van het tandvlees',
          en: 'Surgical extraction with a gum flap',
        },
        price: 102.32,
        unit: { nl: 'per element', en: 'per element' },
      },
      {
        code: 'H59',
        label: {
          nl: 'Terugplaatsen van een verplaatst of uitgeslagen element',
          en: 'Repositioning a displaced or knocked-out tooth',
        },
        price: 56.55,
        unit: { nl: 'per element', en: 'per element' },
      },
      {
        code: 'H90',
        label: {
          nl: 'Behandeling van een kaakbreuk of nabloeding',
          en: 'Treatment of a jaw fracture or post-extraction bleeding',
        },
        price: 73.81,
      },
    ],
  },
  {
    key: 'implantaten',
    title: {
      nl: 'Implantaten',
      en: 'Implants',
    },
    intro: {
      nl: 'Implantaten kennen veel deelcodes. Hieronder de meest voorkomende. Materiaalkosten komen er apart bij.',
      en: 'Implants involve many subcodes. The most common are listed below. Material costs are charged separately.',
    },
    items: [
      {
        code: 'J20',
        label: {
          nl: 'Plaatsen eerste implantaat in een kaak',
          en: 'Placing the first implant in a jaw',
        },
        price: 188.45,
        unit: { nl: 'per implantaat', en: 'per implant' },
      },
      {
        code: 'J21',
        label: {
          nl: 'Plaatsen elk volgend implantaat in dezelfde kaak',
          en: 'Placing each additional implant in the same jaw',
        },
        price: 113.07,
        unit: { nl: 'per implantaat', en: 'per implant' },
      },
      {
        code: 'J33',
        label: {
          nl: 'Plaatsen van een healingabutment',
          en: 'Placing a healing abutment',
        },
        price: 56.55,
      },
      {
        code: 'J34',
        label: {
          nl: 'Vervangen van een healingabutment',
          en: 'Replacing a healing abutment',
        },
        price: 45.24,
      },
      {
        code: 'J40',
        label: {
          nl: 'Aanbrengen vrij ruiterelement op staaf, per kaak',
          en: 'Fitting a bar attachment, per jaw',
        },
        price: 124.41,
        unit: { nl: 'per kaak', en: 'per jaw' },
      },
      {
        code: 'J50',
        label: {
          nl: 'Mesostructuur, eerste steg of staaf',
          en: 'Mesostructure, first bar',
        },
        price: 169.59,
      },
    ],
  },
  {
    key: 'prothese-kunstgebit',
    title: {
      nl: 'Kunstgebit en prothese',
      en: 'Dentures',
    },
    intro: {
      nl: 'Volledige en gedeeltelijke protheses. Het tarief geldt per kaak. Techniekkosten komen erbij.',
      en: 'Full and partial dentures. The fee applies per jaw. Laboratory costs apply on top.',
    },
    items: [
      {
        code: 'P021',
        label: {
          nl: 'Volledig kunstgebit, bovenkaak',
          en: 'Full denture, upper jaw',
        },
        price: 226.13,
        unit: { nl: 'per kaak', en: 'per jaw' },
      },
      {
        code: 'P025',
        label: {
          nl: 'Volledig kunstgebit, onderkaak',
          en: 'Full denture, lower jaw',
        },
        price: 226.13,
        unit: { nl: 'per kaak', en: 'per jaw' },
      },
      {
        code: 'P030',
        label: {
          nl: 'Volledig kunstgebit, boven- en onderkaak samen',
          en: 'Full denture, upper and lower jaw together',
        },
        price: 339.20,
      },
      {
        code: 'P035',
        label: {
          nl: 'Gedeeltelijke prothese, één tot vier elementen',
          en: 'Partial denture, one to four elements',
        },
        price: 113.07,
        unit: { nl: 'per kaak', en: 'per jaw' },
      },
      {
        code: 'P040',
        label: {
          nl: 'Gedeeltelijke prothese, vijf tot dertien elementen',
          en: 'Partial denture, five to thirteen elements',
        },
        price: 169.59,
        unit: { nl: 'per kaak', en: 'per jaw' },
      },
      {
        code: 'P065',
        label: {
          nl: 'Overkappingsprothese op implantaten (klikgebit), per kaak',
          en: 'Implant-supported overdenture (click denture), per jaw',
        },
        price: 367.46,
        unit: { nl: 'per kaak', en: 'per jaw' },
      },
      {
        code: 'P901',
        label: {
          nl: 'Opvullen van een bestaande prothese (rebasen)',
          en: 'Relining an existing denture',
        },
        price: 84.80,
        unit: { nl: 'per kaak', en: 'per jaw' },
      },
    ],
  },
  {
    key: 'bleken-esthetiek',
    title: {
      nl: 'Esthetische behandelingen',
      en: 'Cosmetic treatments',
    },
    intro: {
      nl: 'Behandelingen die de kleur of vorm van uw tanden verbeteren. Bleken valt buiten de basisverzekering.',
      en: 'Treatments that improve the colour or shape of your teeth. Whitening is not covered by basic insurance.',
    },
    items: [
      {
        code: 'E97',
        label: {
          nl: 'Uitwendig bleken, per kaak',
          en: 'External whitening, per jaw',
        },
        price: 169.59,
        unit: { nl: 'per kaak', en: 'per jaw' },
      },
      {
        code: 'E98',
        label: {
          nl: 'Inwendig bleken van een wortelkanaalbehandeld element',
          en: 'Internal whitening of a root-treated tooth',
        },
        price: 89.31,
        unit: { nl: 'per element', en: 'per element' },
      },
      {
        code: 'R66',
        label: {
          nl: 'Facing of schildje (veneer)',
          en: 'Facing or veneer',
        },
        price: 277.95,
        unit: { nl: 'per element', en: 'per element' },
      },
      {
        code: 'V93',
        label: {
          nl: 'Etsfacing in composiet',
          en: 'Composite bonded facing',
        },
        price: 145.46,
        unit: { nl: 'per element', en: 'per element' },
      },
    ],
  },
];
