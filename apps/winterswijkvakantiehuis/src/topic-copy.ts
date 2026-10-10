/* Landing pages for the two ways guests search beyond "vakantiehuis winterswijk":
   travelling as a group and travelling with a dog. Both only regroup facts that
   are already confirmed on the house pages (capacity, dog rule per home, sauna,
   the adapted XL) — no prices, fees or rules the owner has not given us.
   Search Console showed "groepsaccommodatie meddo" at position ~6 with no page
   using the word at all, which is what prompted the group page.
   The Hilgelo page is the third: "hilgelo" is searched ~2,900x a month in NL and
   ~2,400x in DE (DataForSEO, Oct 2026, peaking in June), more than the site's
   own "vakantiehuis winterswijk". Those searchers want the lake, not a house, so
   the page is about the lake first and the three Jonkersweg homes second. Same
   rule as the others: only facts the site already states, plus the owner's own
   photos of the lake. */
type Lang = 'nl' | 'en' | 'de';
export type TopicId = 'groups' | 'dogs' | 'hilgelo';

export type TopicCopy = {
  kicker: string;
  /** Breadcrumb and footer label. */
  label: string;
  intro: string[];
  /** A row of photos under the intro, shown whole rather than cropped. */
  photos?: {src: string; alt: string}[];
  sections: {title: string; text: string[]; homeIds?: string[]}[];
  /** Worked examples of which homes make up which group size. */
  combos?: {title: string; note: string; items: {size: string; text: string}[]};
  /** Dog walks near the homes, with a schematic map of the Hilgelo dog route. */
  walks?: {
    title: string;
    intro: string;
    map: {lake: string; route: string; beach: string; home: string; caption: string};
    items: {kind: 'route' | 'field' | 'nodogs'; name: string; where: string; text: string; link?: {href: string; label: string}}[];
  };
  faq: {q: string; a: string}[];
  cta: {title: string; text: string; button: string};
};

export const TOPIC_SLUGS: Record<TopicId, Record<Lang, string>> = {
  groups: {nl: 'groepsaccommodatie-winterswijk', de: 'gruppenunterkunft-winterswijk', en: 'group-accommodation-winterswijk'},
  dogs: {nl: 'vakantiehuis-met-hond-winterswijk', de: 'ferienhaus-mit-hund-winterswijk', en: 'dog-friendly-holiday-homes-winterswijk'},
  hilgelo: {nl: 'hilgelo-winterswijk', de: 'hilgelo-winterswijk', en: 'hilgelo-lake-winterswijk'},
};

export const topicCopy: Record<TopicId, Record<Lang, TopicCopy>> = {
  groups: {
    nl: {
      kicker: 'Groepsaccommodatie in de Achterhoek',
      label: 'Groepsaccommodatie',
      intro: [
        'Met familie, vrienden of een club naar Winterswijk? Wij verhuren negen vakantiehuizen op twee plekken, en op allebei boekt u meerdere huizen naast of vlak bij elkaar. Aan de Jonkersweg bij het Hilgelo is plek voor 18 personen, op de Kattenberg in het bos voor maximaal 40.',
        'Zo heeft ieder gezin een eigen huis met eigen keuken, badkamer en sauna, en zit u toch samen op één terrein. Dat is het verschil met een groepsgebouw met één grote slaapzaal: overdag en aan tafel samen, en ’s avonds ieder zijn eigen rust.',
      ],
      sections: [
        {
          title: 'Aan de Jonkersweg: tot 18 personen bij het Hilgelo',
          text: [
            'Op recreatiepark Den Möllenhof in Winterswijk Meddo verhuren we drie huizen voor elk zes personen. Jonkersweg 55 en 57 staan direct naast elkaar, nummer 65 staat een paar huizen verderop op hetzelfde park. Alle drie hebben een eigen sauna en in alle drie is uw hond welkom.',
            'Het Hilgelo, met strandje en wandelpaden, ligt op een paar minuten. Rijdt er iemand in uw groep paard? Op hetzelfde park zijn stallen en weides, dus het paard kan gewoon mee.',
          ],
          homeIds: ['jonkersweg55', 'jonkersweg57', 'jonkersweg65'],
        },
        {
          title: 'Op de Kattenberg: tot 40 personen in het bos',
          text: [
            'Op het vakantiecomplex aan de Kattenbergweg, midden in het bos bij Winterswijk, beheren we zes woningen: vier geschakelde boswoningen voor elk zes personen, de Boswoning Kattenberg XL voor acht personen en het vrijstaande Fins chalet voor acht personen, waarvan twee in een eigen bijgebouw slapen. Samen is dat plek voor 40 personen, en elke woning heeft een eigen sauna.',
            'De XL heeft een aangepaste slaapkamer en badkamer op de begane grond. Zo kan ook een familielid dat slecht ter been is of een rolstoel gebruikt mee op de familieweek. Bespreek vooraf met ons wat er nodig is.',
          ],
          homeIds: ['kattenberg6', 'kattenberg8', 'finschalet'],
        },
      ],
      combos: {
        title: 'Voorbeelden van een indeling',
        note: 'Welke combinatie kan, hangt af van wat er in uw periode vrij is. Geef uw groepsgrootte door, dan zoeken wij de indeling die past.',
        items: [
          {size: '12 personen', text: 'Jonkersweg 55 en 57, twee huizen direct naast elkaar. Hond welkom.'},
          {size: '18 personen', text: 'Alle drie de huizen aan de Jonkersweg, bij het Hilgelo. Hond en paard welkom.'},
          {size: '14 personen', text: 'Boswoning Kattenberg XL met een boswoning ernaast, met een aangepaste slaapkamer beneden.'},
          {size: '24 personen', text: 'De vier boswoningen op de Kattenberg. In twee daarvan mag een hond mee.'},
          {size: '40 personen', text: 'Alle zes woningen op de Kattenberg, samen midden in het bos.'},
        ],
      },
      faq: [
        {q: 'Kunnen we meerdere huizen tegelijk boeken?', a: 'Ja. Geef in uw aanvraag het aantal personen en de gewenste periode door. Wij kijken welke huizen dan samen vrij zijn en stellen een indeling voor.'},
        {q: 'Is er een gezamenlijke ruimte of groepszaal?', a: 'Nee. Iedere woning heeft een eigen woonkamer, keuken, badkamer en sauna. Samen eten kan op de terrassen of in een van de woonkamers; de XL heeft een eettafel voor acht.'},
        {q: 'Mag de hond mee met de groep?', a: 'Aan de Jonkersweg is uw hond welkom in alle drie de huizen. Op de Kattenberg mag een hond mee in twee van de vier boswoningen. In de XL en het Fins chalet zijn geen huisdieren toegestaan.'},
        {q: 'Kan een groepslid met een rolstoel mee?', a: 'In de Boswoning Kattenberg XL liggen een aangepaste slaapkamer en badkamer op de begane grond, met drempelloze douche, douchestoel en steunbeugels. De sauna en de andere slaapkamers zijn boven.'},
        {q: 'Hoe boeken we?', a: 'Rechtstreeks bij ons, via het formulier, WhatsApp of telefoon, zonder tussenpersoon. Uw aanvraag is nog geen bevestigde reservering: we bespreken eerst de beschikbaarheid en uw wensen.'},
      ],
      cta: {
        title: 'Vraag een groepsverblijf aan',
        text: 'Vertel ons met hoeveel personen u komt, in welke periode en of er een hond of paard meegaat. U krijgt meestal dezelfde dag antwoord.',
        button: 'Groepsverblijf aanvragen',
      },
    },
    de: {
      kicker: 'Gruppenunterkunft im Achterhoek',
      label: 'Gruppenunterkunft',
      intro: [
        'Mit Familie, Freunden oder dem Verein nach Winterswijk? Wir vermieten neun Ferienhäuser an zwei Orten, und an beiden buchen Sie mehrere Häuser nebeneinander oder ganz in der Nähe. Am Jonkersweg beim Hilgelo ist Platz für 18 Personen, auf dem Kattenberg im Wald für bis zu 40.',
        'So hat jede Familie ein eigenes Haus mit eigener Küche, eigenem Bad und eigener Sauna, und Sie sind trotzdem zusammen auf einem Gelände. Das ist der Unterschied zu einem Gruppenhaus mit Schlafsaal: tagsüber und beim Essen zusammen, abends jeder für sich.',
      ],
      sections: [
        {
          title: 'Am Jonkersweg: bis 18 Personen am Hilgelo',
          text: [
            'Im Ferienpark Den Möllenhof in Winterswijk Meddo vermieten wir drei Häuser für je sechs Personen. Jonkersweg 55 und 57 stehen direkt nebeneinander, Nummer 65 ein paar Häuser weiter im selben Park. Alle drei haben eine eigene Sauna, und in allen drei ist Ihr Hund willkommen.',
            'Der Badesee Hilgelo mit Strand und Wanderwegen ist wenige Minuten entfernt. Reitet jemand in Ihrer Gruppe? Im selben Park gibt es Ställe und Weiden, das Pferd kann also mit.',
          ],
          homeIds: ['jonkersweg55', 'jonkersweg57', 'jonkersweg65'],
        },
        {
          title: 'Auf dem Kattenberg: bis 40 Personen im Wald',
          text: [
            'In der Ferienanlage am Kattenbergweg, mitten im Wald bei Winterswijk, verwalten wir sechs Häuser: vier Reihen-Waldhäuser für je sechs Personen, das Waldhaus Kattenberg XL für acht Personen und das freistehende finnische Chalet für acht Personen, davon zwei im eigenen Nebengebäude. Zusammen ist das Platz für 40 Personen, und jedes Haus hat eine eigene Sauna.',
            'Das XL hat ein angepasstes Schlafzimmer und Bad im Erdgeschoss. So kann auch ein Familienmitglied, das schlecht zu Fuß ist oder einen Rollstuhl nutzt, mitkommen. Besprechen Sie vorab mit uns, was nötig ist.',
          ],
          homeIds: ['kattenberg6', 'kattenberg8', 'finschalet'],
        },
      ],
      combos: {
        title: 'Beispiele für eine Aufteilung',
        note: 'Welche Kombination möglich ist, hängt davon ab, was in Ihrem Zeitraum frei ist. Nennen Sie uns Ihre Gruppengröße, dann suchen wir die passende Aufteilung.',
        items: [
          {size: '12 Personen', text: 'Jonkersweg 55 und 57, zwei Häuser direkt nebeneinander. Hunde willkommen.'},
          {size: '18 Personen', text: 'Alle drei Häuser am Jonkersweg beim Hilgelo. Hund und Pferd willkommen.'},
          {size: '14 Personen', text: 'Waldhaus Kattenberg XL mit einem Waldhaus daneben, mit angepasstem Schlafzimmer im Erdgeschoss.'},
          {size: '24 Personen', text: 'Die vier Waldhäuser auf dem Kattenberg. In zweien darf ein Hund mit.'},
          {size: '40 Personen', text: 'Alle sechs Häuser auf dem Kattenberg, zusammen mitten im Wald.'},
        ],
      },
      faq: [
        {q: 'Können wir mehrere Häuser gleichzeitig buchen?', a: 'Ja. Nennen Sie in Ihrer Anfrage die Personenzahl und den Zeitraum. Wir prüfen, welche Häuser dann gemeinsam frei sind, und schlagen eine Aufteilung vor.'},
        {q: 'Gibt es einen Gemeinschaftsraum?', a: 'Nein. Jedes Haus hat ein eigenes Wohnzimmer, eine eigene Küche, ein eigenes Bad und eine eigene Sauna. Gemeinsam essen können Sie auf den Terrassen oder in einem der Wohnzimmer; das XL hat einen Esstisch für acht.'},
        {q: 'Darf der Hund mit der Gruppe mit?', a: 'Am Jonkersweg ist Ihr Hund in allen drei Häusern willkommen. Auf dem Kattenberg darf ein Hund in zwei der vier Waldhäuser mit. Im XL und im finnischen Chalet sind keine Haustiere erlaubt.'},
        {q: 'Kann ein Gruppenmitglied im Rollstuhl mitkommen?', a: 'Im Waldhaus Kattenberg XL liegen ein angepasstes Schlafzimmer und Bad im Erdgeschoss, mit schwellenloser Dusche, Duschstuhl und Haltegriffen. Die Sauna und die übrigen Schlafzimmer sind oben.'},
        {q: 'Wie buchen wir?', a: 'Direkt bei uns, per Formular, WhatsApp oder Telefon, ohne Vermittler. Ihre Anfrage ist noch keine bestätigte Buchung: Wir besprechen zuerst Verfügbarkeit und Wünsche.'},
      ],
      cta: {
        title: 'Gruppenaufenthalt anfragen',
        text: 'Sagen Sie uns, mit wie vielen Personen Sie kommen, in welchem Zeitraum und ob ein Hund oder Pferd dabei ist. Sie erhalten meist noch am selben Tag Antwort.',
        button: 'Gruppenaufenthalt anfragen',
      },
    },
    en: {
      kicker: 'Group accommodation in the Achterhoek',
      label: 'Group stays',
      intro: [
        'Coming to Winterswijk with family, friends or a club? We rent out nine holiday homes in two places, and in both you can book several homes next to or close to each other. On Jonkersweg by Hilgelo lake there is room for 18 people, on the Kattenberg in the woods for up to 40.',
        'Each family gets its own home with its own kitchen, bathroom and sauna, while the whole group stays on one site. That is the difference from a group house with a single dormitory: together during the day and at the table, and your own space in the evening.',
      ],
      sections: [
        {
          title: 'Jonkersweg: up to 18 guests by Hilgelo lake',
          text: [
            'On the Den Möllenhof holiday park in Winterswijk Meddo we rent out three homes that each sleep six. Jonkersweg 55 and 57 stand right next to each other, and number 65 is a few houses along on the same park. All three have a private sauna and all three welcome dogs.',
            'Hilgelo lake, with its beach and walking paths, is a few minutes away. Does someone in your group ride? The same park has stables and paddocks, so the horse can come too.',
          ],
          homeIds: ['jonkersweg55', 'jonkersweg57', 'jonkersweg65'],
        },
        {
          title: 'Kattenberg: up to 40 guests in the woods',
          text: [
            'On the holiday complex on Kattenbergweg, in the middle of the woods near Winterswijk, we manage six homes: four linked woodland homes that each sleep six, the Kattenberg XL for eight, and the detached Finnish chalet for eight, two of whom sleep in their own outbuilding. Together that is room for 40, and every home has a private sauna.',
            'The XL has an adapted bedroom and bathroom on the ground floor, so a family member with limited mobility or a wheelchair can join the family week. Talk to us beforehand about what is needed.',
          ],
          homeIds: ['kattenberg6', 'kattenberg8', 'finschalet'],
        },
      ],
      combos: {
        title: 'Example set-ups',
        note: 'Which combination works depends on what is free for your dates. Tell us your group size and we will find the set-up that fits.',
        items: [
          {size: '12 guests', text: 'Jonkersweg 55 and 57, two homes right next to each other. Dogs welcome.'},
          {size: '18 guests', text: 'All three Jonkersweg homes by Hilgelo lake. Dogs and horses welcome.'},
          {size: '14 guests', text: 'Kattenberg XL plus a woodland home next door, with an adapted bedroom downstairs.'},
          {size: '24 guests', text: 'The four woodland homes on the Kattenberg. Two of them take dogs.'},
          {size: '40 guests', text: 'All six homes on the Kattenberg, together in the woods.'},
        ],
      },
      faq: [
        {q: 'Can we book several homes at once?', a: 'Yes. Give the number of guests and your dates in your enquiry. We check which homes are free together and suggest a set-up.'},
        {q: 'Is there a shared common room?', a: 'No. Every home has its own living room, kitchen, bathroom and sauna. You can eat together on the terraces or in one of the living rooms; the XL has a dining table for eight.'},
        {q: 'Can the dog come with the group?', a: 'On Jonkersweg dogs are welcome in all three homes. On the Kattenberg a dog can come in two of the four woodland homes. No pets are allowed in the XL or the Finnish chalet.'},
        {q: 'Can a group member who uses a wheelchair come?', a: 'Kattenberg XL has an adapted bedroom and bathroom on the ground floor, with a step-free shower, shower chair and grab rails. The sauna and the other bedrooms are upstairs.'},
        {q: 'How do we book?', a: 'Directly with us, by form, WhatsApp or phone, with no agency in between. An enquiry is not yet a confirmed booking: we first discuss availability and your wishes.'},
      ],
      cta: {
        title: 'Enquire about a group stay',
        text: 'Tell us how many of you are coming, your dates, and whether a dog or horse is joining. You usually hear back the same day.',
        button: 'Enquire about a group stay',
      },
    },
  },
  dogs: {
    nl: {
      kicker: 'Vakantie met hond in de Achterhoek',
      label: 'Vakantiehuis met hond',
      intro: [
        'In vijf van onze negen vakantiehuizen in Winterswijk is uw hond welkom, en elk van die huizen heeft een eigen sauna. Hieronder ziet u per huis wat er kan, zodat u vooraf weet waar u aan toe bent.',
      ],
      sections: [
        {
          title: 'Jonkersweg: hond welkom in alle drie de huizen',
          text: [
            'Op recreatiepark Den Möllenhof in Winterswijk Meddo mag uw hond mee in Jonkersweg 55, 57 en 65. Elk huis is voor zes personen, met een eigen sauna en een terras aan het groen.',
            'Rond het Hilgelo loopt een hondenroute die het hele jaar open is, en vanaf het park stapt u zo het coulisselandschap in, met beken, houtwallen en zandpaden. Komt u met meer honden of een grotere groep? Jonkersweg 55 en 57 staan naast elkaar.',
          ],
          homeIds: ['jonkersweg55', 'jonkersweg57', 'jonkersweg65'],
        },
        {
          title: 'Kattenberg: twee hondvriendelijke boswoningen',
          text: [
            'Op de Kattenberg, midden in het bos bij Winterswijk, verhuren we vier boswoningen voor zes personen. In twee daarvan mag uw hond mee. Vermeld uw hond bij de aanvraag, dan zetten we een hondvriendelijke woning voor u klaar. Het bos begint achter de tuin.',
          ],
          homeIds: ['kattenberg6'],
        },
        {
          title: 'Liever een huis zonder huisdieren?',
          text: [
            'In de Boswoning Kattenberg XL en het Fins chalet zijn geen huisdieren toegestaan. Handig als iemand in uw gezelschap allergisch is.',
          ],
          homeIds: ['kattenberg8', 'finschalet'],
        },
      ],
      walks: {
        title: 'Uitlaten en wandelen in de buurt',
        intro: 'Drie plekken die u als hondenbezitter vooraf wilt kennen: waar uw hond mag rennen, en waar niet.',
        map: {lake: 'Hilgelo', route: 'Hondenroute, het hele jaar', beach: 'Strand: geen honden van 1 mei tot 1 oktober', home: 'Jonkersweg', caption: 'Schematisch, naar de kaart van Leisurelands.'},
        items: [
          {kind: 'route', name: 'Hondenroute rond het Hilgelo', where: 'Vanaf de Jonkersweg', text: 'De Jonkersweg komt uit aan de westkant van het Hilgelo, waar de hondenroute langs loopt. De route rond het meer is het hele jaar open. Alleen het strand aan de oostkant is van 1 mei tot 1 oktober verboden voor honden.', link: {href: 'https://www.leisurelands.nl/nl/locaties/3778568479/hondenroute-hilgelo-startpunt', label: 'Kaart van de hondenroute'}},
          {kind: 'field', name: 'Losloopveld Parallelweg', where: 'Winterswijk, ± 4 km', text: 'Een omheind veld naast de sporthal waar uw hond los mag rennen, met een sluis bij de ingang, een bank en poepzakjes. Open van zonsopkomst tot zonsondergang, gratis en zonder aanmelden.'},
          {kind: 'nodogs', name: 'Korenburgerveen: geen honden', where: '± 1 km van de Kattenberg', text: 'In dit hoogveengebied van Natuurmonumenten zijn honden niet toegestaan, ook niet aangelijnd, zodat de zeldzame broedvogels er rust hebben.'},
        ],
      },
      faq: [
        {q: 'In welke vakantiehuizen mag mijn hond mee?', a: 'In Jonkersweg 55, 57 en 65 op Den Möllenhof, en in twee van de vier boswoningen op de Kattenberg. In de XL en het Fins chalet zijn geen huisdieren toegestaan.'},
        {q: 'Mag er meer dan één hond mee?', a: 'Vermeld in uw aanvraag hoeveel honden u meeneemt, dan laten we weten wat er in het gekozen huis kan.'},
        {q: 'Waar kan ik wandelen met de hond?', a: 'Op de hondenroute rond het Hilgelo, die het hele jaar open is, en op het omheinde losloopveld aan de Parallelweg in Winterswijk. In het Korenburgerveen zijn honden niet toegestaan, ook niet aangelijnd. In andere natuurgebieden gelden eigen regels; kijk daarvoor op de borden ter plekke.'},
        {q: 'Kunnen hond en paard allebei mee?', a: 'Ja, aan de Jonkersweg. Op recreatiepark Den Möllenhof zijn ook stallen en weides voor uw paard.'},
      ],
      cta: {
        title: 'Vraag een verblijf met hond aan',
        text: 'Geef uw periode, het aantal personen en uw hond door. We zoeken een huis waar u samen welkom bent.',
        button: 'Verblijf aanvragen',
      },
    },
    de: {
      kicker: 'Urlaub mit Hund im Achterhoek',
      label: 'Ferienhaus mit Hund',
      intro: [
        'In fünf unserer neun Ferienhäuser in Winterswijk ist Ihr Hund willkommen, und jedes dieser Häuser hat eine eigene Sauna. Winterswijk liegt direkt hinter der Grenze bei Bocholt und Vreden. Unten sehen Sie pro Haus, was möglich ist, damit Sie vorab Bescheid wissen.',
      ],
      sections: [
        {
          title: 'Jonkersweg: Hund willkommen in allen drei Häusern',
          text: [
            'Im Ferienpark Den Möllenhof in Winterswijk Meddo darf Ihr Hund in Jonkersweg 55, 57 und 65 mit. Jedes Haus ist für sechs Personen, mit eigener Sauna und einer Terrasse im Grünen.',
            'Rund um den Hilgelo führt eine Hunderoute, die das ganze Jahr offen ist, und vom Park aus sind Sie direkt in der Heckenlandschaft mit Bächen, Wallhecken und Sandwegen. Mit mehreren Hunden oder einer größeren Gruppe unterwegs? Jonkersweg 55 und 57 stehen nebeneinander.',
          ],
          homeIds: ['jonkersweg55', 'jonkersweg57', 'jonkersweg65'],
        },
        {
          title: 'Kattenberg: zwei hundefreundliche Waldhäuser',
          text: [
            'Auf dem Kattenberg, mitten im Wald bei Winterswijk, vermieten wir vier Waldhäuser für sechs Personen. In zwei davon darf Ihr Hund mit. Nennen Sie Ihren Hund bei der Anfrage, dann halten wir ein hundefreundliches Haus für Sie bereit. Der Wald beginnt hinter dem Garten.',
          ],
          homeIds: ['kattenberg6'],
        },
        {
          title: 'Lieber ein Haus ohne Haustiere?',
          text: [
            'Im Waldhaus Kattenberg XL und im finnischen Chalet sind keine Haustiere erlaubt. Praktisch, wenn jemand in Ihrer Gruppe allergisch ist.',
          ],
          homeIds: ['kattenberg8', 'finschalet'],
        },
      ],
      walks: {
        title: 'Gassi gehen und Spazieren in der Nähe',
        intro: 'Drei Orte, die Sie als Hundebesitzer vorab kennen sollten: wo Ihr Hund rennen darf, und wo nicht.',
        map: {lake: 'Hilgelo', route: 'Hunderoute, ganzjährig', beach: 'Strand: keine Hunde vom 1. Mai bis 1. Oktober', home: 'Jonkersweg', caption: 'Schematisch, nach der Karte von Leisurelands.'},
        items: [
          {kind: 'route', name: 'Hunderoute rund um den Hilgelo', where: 'Ab dem Jonkersweg', text: 'Der Jonkersweg mündet an der Westseite des Hilgelo, wo die Hunderoute vorbeiführt. Die Route um den See ist das ganze Jahr offen. Nur der Strand an der Ostseite ist vom 1. Mai bis 1. Oktober für Hunde gesperrt.', link: {href: 'https://www.leisurelands.nl/nl/locaties/3778568479/hondenroute-hilgelo-startpunt', label: 'Karte der Hunderoute'}},
          {kind: 'field', name: 'Freilauffläche Parallelweg', where: 'Winterswijk, ± 4 km', text: 'Eine eingezäunte Wiese neben der Sporthalle, auf der Ihr Hund frei laufen darf, mit Schleuse am Eingang, einer Bank und Kotbeuteln. Geöffnet von Sonnenaufgang bis Sonnenuntergang, kostenlos und ohne Anmeldung.'},
          {kind: 'nodogs', name: 'Korenburgerveen: keine Hunde', where: '± 1 km vom Kattenberg', text: 'In diesem Hochmoor von Natuurmonumenten sind Hunde nicht erlaubt, auch nicht angeleint, damit die seltenen Brutvögel ihre Ruhe haben.'},
        ],
      },
      faq: [
        {q: 'In welchen Ferienhäusern darf mein Hund mit?', a: 'In Jonkersweg 55, 57 und 65 im Ferienpark Den Möllenhof und in zwei der vier Waldhäuser auf dem Kattenberg. Im XL und im finnischen Chalet sind keine Haustiere erlaubt.'},
        {q: 'Darf mehr als ein Hund mit?', a: 'Nennen Sie in Ihrer Anfrage, wie viele Hunde Sie mitbringen, dann sagen wir Ihnen, was im gewählten Haus möglich ist.'},
        {q: 'Wo kann ich mit dem Hund spazieren gehen?', a: 'Auf der Hunderoute rund um den Hilgelo, die das ganze Jahr offen ist, und auf der eingezäunten Freilauffläche an der Parallelweg in Winterswijk. Im Korenburgerveen sind Hunde nicht erlaubt, auch nicht angeleint. In anderen Naturgebieten gelten eigene Regeln; achten Sie auf die Schilder vor Ort.'},
        {q: 'Können Hund und Pferd beide mit?', a: 'Ja, am Jonkersweg. Im Ferienpark Den Möllenhof gibt es auch Ställe und Weiden für Ihr Pferd.'},
      ],
      cta: {
        title: 'Aufenthalt mit Hund anfragen',
        text: 'Nennen Sie uns Zeitraum, Personenzahl und Ihren Hund. Wir suchen ein Haus, in dem Sie gemeinsam willkommen sind.',
        button: 'Aufenthalt anfragen',
      },
    },
    en: {
      kicker: 'Holidays with a dog in the Achterhoek',
      label: 'Dog-friendly homes',
      intro: [
        'Your dog is welcome in five of our nine holiday homes in Winterswijk, and each of those homes has a private sauna. Below you can see what is possible in each home, so you know where you stand before you enquire.',
      ],
      sections: [
        {
          title: 'Jonkersweg: dogs welcome in all three homes',
          text: [
            'On the Den Möllenhof holiday park in Winterswijk Meddo your dog can come to Jonkersweg 55, 57 and 65. Each home sleeps six, with a private sauna and a terrace facing the greenery.',
            'A dog route runs around Hilgelo lake all year round, and from the park you step straight into the hedgerow landscape of streams, wooded banks and sandy tracks. Travelling with several dogs or a bigger group? Jonkersweg 55 and 57 stand side by side.',
          ],
          homeIds: ['jonkersweg55', 'jonkersweg57', 'jonkersweg65'],
        },
        {
          title: 'Kattenberg: two dog-friendly woodland homes',
          text: [
            'On the Kattenberg, in the middle of the woods near Winterswijk, we rent out four woodland homes that sleep six. Two of them take dogs. Mention your dog when you enquire and we will set aside a dog-friendly home for you. The forest starts right behind the garden.',
          ],
          homeIds: ['kattenberg6'],
        },
        {
          title: 'Prefer a home without pets?',
          text: [
            'No pets are allowed in the Kattenberg XL or the Finnish chalet. Useful if someone in your party has an allergy.',
          ],
          homeIds: ['kattenberg8', 'finschalet'],
        },
      ],
      walks: {
        title: 'Dog walks nearby',
        intro: 'Three places worth knowing before you come: where your dog can run, and where it cannot.',
        map: {lake: 'Hilgelo', route: 'Dog route, all year', beach: 'Beach: no dogs from 1 May to 1 October', home: 'Jonkersweg', caption: 'Schematic, based on the Leisurelands map.'},
        items: [
          {kind: 'route', name: 'Dog route around Hilgelo lake', where: 'From Jonkersweg', text: 'Jonkersweg comes out on the west side of the Hilgelo, where the dog route passes. The route around the lake is open all year. Only the beach on the east side is closed to dogs from 1 May to 1 October.', link: {href: 'https://www.leisurelands.nl/nl/locaties/3778568479/hondenroute-hilgelo-startpunt', label: 'Map of the dog route'}},
          {kind: 'field', name: 'Parallelweg off-lead field', where: 'Winterswijk, ± 4 km', text: 'A fenced field next to the sports hall where your dog can run off the lead, with a double gate at the entrance, a bench and poo bags. Open from sunrise to sunset, free and without registration.'},
          {kind: 'nodogs', name: 'Korenburgerveen: no dogs', where: '± 1 km from the Kattenberg', text: 'Dogs are not allowed in this Natuurmonumenten raised bog, not even on a lead, so the rare breeding birds are left in peace.'},
        ],
      },
      faq: [
        {q: 'Which holiday homes accept dogs?', a: 'Jonkersweg 55, 57 and 65 on Den Möllenhof, and two of the four woodland homes on the Kattenberg. No pets are allowed in the XL or the Finnish chalet.'},
        {q: 'Can I bring more than one dog?', a: 'Tell us in your enquiry how many dogs you are bringing and we will let you know what is possible in the home you chose.'},
        {q: 'Where can I walk the dog?', a: 'On the dog route around Hilgelo lake, which is open all year, and in the fenced off-lead field on Parallelweg in Winterswijk. Dogs are not allowed in the Korenburgerveen, not even on a lead. Other nature reserves have their own rules; check the signs on site.'},
        {q: 'Can both the dog and a horse come?', a: 'Yes, on Jonkersweg. The Den Möllenhof holiday park also has stables and paddocks for your horse.'},
      ],
      cta: {
        title: 'Enquire about a stay with your dog',
        text: 'Tell us your dates, the number of guests and about your dog. We will find a home where you are all welcome.',
        button: 'Enquire now',
      },
    },
  },
  hilgelo: {
    nl: {
      kicker: 'Het meer van Winterswijk',
      label: 'Het Hilgelo',
      intro: [
        'Het Hilgelo is de recreatieplas van Winterswijk: zo’n 36 hectare water met een zandstrand, ruime lig- en speelweiden en een route rondom het meer. In de zomer zwemt en zonnet u hier, buiten het seizoen heeft u de oevers vaak bijna voor uzelf.',
        'Drie van onze vakantiehuizen staan aan de Jonkersweg in Winterswijk Meddo, op recreatiepark Den Möllenhof. De Jonkersweg komt uit aan de westkant van het meer, dus vanuit uw huis loopt u zo naar het water.',
      ],
      photos: [
        {src: '/img/hilgelo-bord.webp', alt: 'Het Hilgelo-bord met een houten uil aan de rand van het bos'},
        {src: '/img/hilgelo-zonsondergang.webp', alt: 'Zonsondergang boven het Hilgelo in Winterswijk'},
        {src: '/img/hilgelo-meer.webp', alt: 'Uitzicht over het Hilgelo tussen de bomen door'},
      ],
      sections: [
        {
          title: 'Zwemmen, zonnen en het water op',
          text: [
            'Aan de oostkant ligt het strand, met daarachter lig- en speelweiden. Waterfietsen, kano’s, ligstoelen en parasols huurt u ter plekke, en voor surfers is er een surfkluis.',
            'Liever een buitenbad? Het Strandbad in Winterswijk is een authentiek buitenbad uit de jaren dertig, in 2010 volledig gerestaureerd, met een zandstrand en een diep bassin met duiktoren.',
          ],
        },
        {
          title: 'Wandelen rond het meer, het hele jaar',
          text: [
            'De route rond het Hilgelo is het hele jaar open, ook voor uw hond. Langs de waterkant staan bankjes, en in het voor- en najaar heeft u ze vaak helemaal voor uzelf. Alleen op het strand zijn honden van 1 mei tot 1 oktober niet toegestaan.',
          ],
        },
        {
          title: 'Vakantiehuizen bij het Hilgelo',
          text: [
            'Jonkersweg 55, 57 en 65 zijn elk voor zes personen, met een eigen sauna, en in alle drie is uw hond welkom. 55 en 57 staan naast elkaar en 65 een paar huizen verderop, dus samen is er plek voor 18 personen. Op het park zijn ook stallen en weides voor uw paard.',
          ],
          homeIds: ['jonkersweg55', 'jonkersweg57', 'jonkersweg65'],
        },
      ],
      walks: {
        title: 'Van de Jonkersweg naar het water',
        intro: 'Waar de Jonkersweg uitkomt, waar de route rond het meer loopt en waar het strand ligt.',
        map: {lake: 'Hilgelo', route: 'Route rond het meer, het hele jaar', beach: 'Strand: geen honden van 1 mei tot 1 oktober', home: 'Jonkersweg', caption: 'Schematisch, naar de kaart van Leisurelands.'},
        items: [
          {kind: 'route', name: 'Route rond het Hilgelo', where: 'Vanaf de Jonkersweg', text: 'De Jonkersweg komt uit aan de westkant van het Hilgelo, waar de route rond het meer langs loopt. Die is het hele jaar open, ook voor honden.', link: {href: 'https://www.leisurelands.nl/nl/locaties/3778568479/hondenroute-hilgelo-startpunt', label: 'Kaart van de route'}},
          {kind: 'nodogs', name: 'Strand: geen honden in de zomer', where: 'Oostkant van het meer', text: 'Van 1 mei tot 1 oktober zijn honden op het strand niet toegestaan. Op de route rond het meer mag uw hond wel mee.'},
        ],
      },
      faq: [
        {q: 'Hoe groot is het Hilgelo?', a: 'Zo’n 36 hectare water, met een zandstrand en ruime lig- en speelweiden.'},
        {q: 'Hoe ver is het Hilgelo van het vakantiehuis?', a: 'Vanaf onze drie huizen aan de Jonkersweg ligt het om de hoek: de Jonkersweg komt uit aan de westkant van het meer. Vanaf de huizen op de Kattenberg, in het bos, gaat u er met de fiets of de auto naartoe.'},
        {q: 'Hoe lang duurt een rondje om het Hilgelo?', a: 'Volgens een van onze gasten kost een rondje wandelen om het water ongeveer 75 minuten.'},
        {q: 'Wat kan ik bij het Hilgelo huren?', a: 'Waterfietsen, kano’s, ligstoelen en parasols huurt u ter plekke. Er is ook een surfkluis.'},
        {q: 'Mag mijn hond mee naar het Hilgelo?', a: 'Ja, op de route rond het meer, het hele jaar. Alleen op het strand aan de oostkant zijn honden van 1 mei tot 1 oktober niet toegestaan.'},
      ],
      cta: {
        title: 'Vraag een vakantiehuis bij het Hilgelo aan',
        text: 'Geef uw periode en het aantal personen door. We laten weten welk huis aan de Jonkersweg vrij is.',
        button: 'Verblijf aanvragen',
      },
    },
    de: {
      kicker: 'Der Badesee von Winterswijk',
      label: 'Der Hilgelo',
      intro: [
        'Der Hilgelo ist der Badesee von Winterswijk: rund 36 Hektar Wasser mit Sandstrand, weiten Liege- und Spielwiesen und einem Weg rund um den See. Im Sommer wird hier gebadet und gesonnt, außerhalb der Saison haben Sie das Ufer oft fast für sich allein.',
        'Drei unserer Ferienhäuser stehen am Jonkersweg in Winterswijk Meddo, im Ferienpark Den Möllenhof. Der Jonkersweg mündet an der Westseite des Sees, Sie sind also vom Haus aus gleich am Wasser. Winterswijk liegt direkt hinter der Grenze bei Bocholt und Vreden.',
      ],
      photos: [
        {src: '/img/hilgelo-bord.webp', alt: 'Das Hilgelo-Schild mit einer Holzeule am Waldrand'},
        {src: '/img/hilgelo-zonsondergang.webp', alt: 'Sonnenuntergang über dem Hilgelo in Winterswijk'},
        {src: '/img/hilgelo-meer.webp', alt: 'Blick zwischen den Bäumen hindurch über den Hilgelo'},
      ],
      sections: [
        {
          title: 'Baden, sonnen und aufs Wasser',
          text: [
            'An der Ostseite liegt der Strand, dahinter Liege- und Spielwiesen. Tretboote, Kanus, Liegestühle und Sonnenschirme mieten Sie vor Ort, und für Surfer gibt es ein Surfdepot.',
            'Lieber ins Freibad? Das Strandbad in Winterswijk ist ein authentisches Freibad aus den dreißiger Jahren, 2010 vollständig restauriert, mit Sandstrand und einem tiefen Becken mit Sprungturm.',
          ],
        },
        {
          title: 'Rund um den See, das ganze Jahr',
          text: [
            'Der Weg rund um den Hilgelo ist das ganze Jahr offen, auch für Ihren Hund. Am Wasser stehen Bänke, und im Frühjahr und Herbst haben Sie sie oft ganz für sich allein. Nur am Strand sind Hunde vom 1. Mai bis 1. Oktober nicht erlaubt.',
          ],
        },
        {
          title: 'Ferienhäuser am Hilgelo',
          text: [
            'Jonkersweg 55, 57 und 65 sind jeweils für sechs Personen, mit eigener Sauna, und in allen drei ist Ihr Hund willkommen. 55 und 57 stehen nebeneinander, 65 ein paar Häuser weiter, zusammen also Platz für 18 Personen. Im Park gibt es auch Ställe und Weiden für Ihr Pferd.',
          ],
          homeIds: ['jonkersweg55', 'jonkersweg57', 'jonkersweg65'],
        },
      ],
      walks: {
        title: 'Vom Jonkersweg ans Wasser',
        intro: 'Wo der Jonkersweg mündet, wo der Weg um den See verläuft und wo der Strand liegt.',
        map: {lake: 'Hilgelo', route: 'Weg um den See, ganzjährig', beach: 'Strand: keine Hunde vom 1. Mai bis 1. Oktober', home: 'Jonkersweg', caption: 'Schematisch, nach der Karte von Leisurelands.'},
        items: [
          {kind: 'route', name: 'Rundweg um den Hilgelo', where: 'Ab dem Jonkersweg', text: 'Der Jonkersweg mündet an der Westseite des Hilgelo, wo der Weg um den See vorbeiführt. Er ist das ganze Jahr offen, auch für Hunde.', link: {href: 'https://www.leisurelands.nl/nl/locaties/3778568479/hondenroute-hilgelo-startpunt', label: 'Karte des Weges'}},
          {kind: 'nodogs', name: 'Strand: im Sommer keine Hunde', where: 'Ostseite des Sees', text: 'Vom 1. Mai bis 1. Oktober sind Hunde am Strand nicht erlaubt. Auf dem Weg um den See darf Ihr Hund mit.'},
        ],
      },
      faq: [
        {q: 'Wie groß ist der Hilgelo?', a: 'Rund 36 Hektar Wasser, mit Sandstrand und weiten Liege- und Spielwiesen.'},
        {q: 'Wie weit ist der Hilgelo vom Ferienhaus entfernt?', a: 'Von unseren drei Häusern am Jonkersweg liegt er um die Ecke: der Jonkersweg mündet an der Westseite des Sees. Von den Häusern auf dem Kattenberg, im Wald, fahren Sie mit dem Rad oder dem Auto hin.'},
        {q: 'Wie lange dauert eine Runde um den Hilgelo?', a: 'Laut einem unserer Gäste dauert eine Runde zu Fuß um den See etwa 75 Minuten.'},
        {q: 'Was kann man am Hilgelo mieten?', a: 'Tretboote, Kanus, Liegestühle und Sonnenschirme mieten Sie vor Ort. Es gibt auch ein Surfdepot.'},
        {q: 'Darf mein Hund mit an den Hilgelo?', a: 'Ja, auf dem Weg um den See, das ganze Jahr. Nur am Strand an der Ostseite sind Hunde vom 1. Mai bis 1. Oktober nicht erlaubt.'},
      ],
      cta: {
        title: 'Ferienhaus am Hilgelo anfragen',
        text: 'Nennen Sie uns Zeitraum und Personenzahl. Wir sagen Ihnen, welches Haus am Jonkersweg frei ist.',
        button: 'Aufenthalt anfragen',
      },
    },
    en: {
      kicker: 'Winterswijk’s lake',
      label: 'Hilgelo lake',
      intro: [
        'The Hilgelo is Winterswijk’s recreational lake: some 36 hectares of water with a sandy beach, generous lawns to play and sunbathe on, and a route all the way round. In summer people come to swim and sunbathe; out of season you often have the shore almost to yourself.',
        'Three of our holiday homes stand on Jonkersweg in Winterswijk Meddo, on the Den Möllenhof holiday park. Jonkersweg comes out on the west side of the lake, so from your door you are at the water in no time.',
      ],
      photos: [
        {src: '/img/hilgelo-bord.webp', alt: 'The Hilgelo sign with a wooden owl at the edge of the woods'},
        {src: '/img/hilgelo-zonsondergang.webp', alt: 'Sunset over Hilgelo lake in Winterswijk'},
        {src: '/img/hilgelo-meer.webp', alt: 'A view across Hilgelo lake through the trees'},
      ],
      sections: [
        {
          title: 'Swimming, sunbathing and out on the water',
          text: [
            'The beach is on the east side, with lawns behind it. Pedalos, canoes, deckchairs and parasols are for hire on site, and there is a surf locker for windsurfers.',
            'Prefer an open-air pool? The Strandbad in Winterswijk is an authentic 1930s open-air pool, fully restored in 2010, with a sandy beach and a deep basin with a diving tower.',
          ],
        },
        {
          title: 'Walking round the lake, all year',
          text: [
            'The route around the Hilgelo is open all year, dogs included. There are benches along the water, and in spring and autumn you often have them entirely to yourself. Only the beach is closed to dogs, from 1 May to 1 October.',
          ],
        },
        {
          title: 'Holiday homes by the Hilgelo',
          text: [
            'Jonkersweg 55, 57 and 65 each sleep six, each has a private sauna, and dogs are welcome in all three. 55 and 57 stand side by side and 65 a few doors along, so together they sleep 18. The park also has stables and paddocks for your horse.',
          ],
          homeIds: ['jonkersweg55', 'jonkersweg57', 'jonkersweg65'],
        },
      ],
      walks: {
        title: 'From Jonkersweg to the water',
        intro: 'Where Jonkersweg comes out, where the lakeside route runs and where the beach is.',
        map: {lake: 'Hilgelo', route: 'Route round the lake, all year', beach: 'Beach: no dogs from 1 May to 1 October', home: 'Jonkersweg', caption: 'Schematic, based on the Leisurelands map.'},
        items: [
          {kind: 'route', name: 'Route around the Hilgelo', where: 'From Jonkersweg', text: 'Jonkersweg comes out on the west side of the Hilgelo, where the route round the lake passes. It is open all year, dogs included.', link: {href: 'https://www.leisurelands.nl/nl/locaties/3778568479/hondenroute-hilgelo-startpunt', label: 'Map of the route'}},
          {kind: 'nodogs', name: 'Beach: no dogs in summer', where: 'East side of the lake', text: 'Dogs are not allowed on the beach from 1 May to 1 October. On the route round the lake your dog is welcome.'},
        ],
      },
      faq: [
        {q: 'How big is Hilgelo lake?', a: 'Some 36 hectares of water, with a sandy beach and generous lawns to play and sunbathe on.'},
        {q: 'How far is the Hilgelo from the holiday home?', a: 'From our three homes on Jonkersweg it is around the corner: Jonkersweg comes out on the west side of the lake. From the homes on the Kattenberg, in the woods, you get there by bike or car.'},
        {q: 'How long is a walk round the Hilgelo?', a: 'According to one of our guests, a walk all the way round the lake takes about 75 minutes.'},
        {q: 'What can I hire at the Hilgelo?', a: 'Pedalos, canoes, deckchairs and parasols are for hire on site. There is also a surf locker.'},
        {q: 'Can my dog come to the Hilgelo?', a: 'Yes, on the route round the lake, all year. Only the beach on the east side is closed to dogs from 1 May to 1 October.'},
      ],
      cta: {
        title: 'Enquire about a home by the Hilgelo',
        text: 'Tell us your dates and the number of guests. We will let you know which home on Jonkersweg is free.',
        button: 'Enquire now',
      },
    },
  },
};
