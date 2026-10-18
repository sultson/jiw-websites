/* Haar algemene voorwaarden, aangeleverd 18-10-2026 als .docx.

   Dit is haar document en geen copy van ons: de Nederlandse regels staan hier
   woordelijk zoals zij ze schreef. Wat wij eraan toevoegen is de opmaak, de
   twee vertalingen en de regel dat het Nederlands de bindende versie is.

   Twee dingen die ik bewust NIET heb gedaan.

   1. Haar annuleringsstaffel overlapt op dag 2: "2 t/m 3 dagen vooraf: 50%"
      en "2 dagen of korter vooraf: geen restitutie" gelden beide op exact twee
      dagen. Dat is een tegenstrijdigheid in haar eigen tekst en die repareer
      ik niet stil - ook niet in de vertaling, die de overlap dus meeneemt.
      Hij staat gemeld; zij beslist welke van de twee weg moet.
   2. Haar artikel 1 noemt info@velvetcakesbyanka.nl als officieel mailadres.
      Dat domein heeft geen MX-record, dus daar komt vandaag geen mail aan
      (nagemeten tegen 8.8.8.8). Haar artikel staat hier toch zoals zij het
      schreef - het is haar wettelijke identiteitsblok - maar de contactlinks
      van de site zelf wijzen naar het adres dat wel werkt. Dat adres is een
      constante in bouw-paginas.mjs (MAIL), dus omzetten is een regel.

   Geen datum op de pagina: "Prijzen per oktober 2026" en de noot onder de
   smaakkaart gingen er 18-10-2026 op verzoek van Armando af. De bindende-
   versieregel blijft wel staan, die doet voor een rechtsdocument wel werk.

   Vorm per artikel:
     kop      de titel van het artikel
     gegevens haar bedrijfsgegevens (alleen artikel 1); label vertaalt, waarde niet
     punten   genummerde regels, zoals in haar document
     tekst    een losse alinea zonder nummer
     noot     een regel die voor de lijst komt en zwaarder weegt
     subkop   kopje binnen het artikel
     streep   opsomming zonder nummer
*/

export const VW_TITEL = {
  nl: 'Algemene voorwaarden',
  en: 'Terms and conditions',
  ro: 'Termeni și condiții',
};

export const VW_KOP = { nl: 'Voorwaarden', en: 'Terms', ro: 'Condiții' };

/* Geen schriftregel en geen inleiding boven deze artikelen (18-10-2026).
   "Zwart op wit" met een hartje is sfeer op een document dat juist geen sfeer
   hoort te hebben, en de inleiding somde op wat de dertien koppen eronder zelf
   al zeggen. Een bezoeker die hier komt zoekt een artikel, geen aanloop. */

export const VW_DESC = {
  nl: 'Algemene voorwaarden van Velvet Cakes by Anka: bestellen, prijzen, levering, annuleren, klachten en betaling.',
  en: 'Terms and conditions of Velvet Cakes by Anka: ordering, prices, delivery, cancellation, complaints and payment.',
  ro: 'Termeni și condiții Velvet Cakes by Anka: comandă, prețuri, livrare, anulare, reclamații și plată.',
};

/* Een vertaling van een rechtsdocument mag niet onbesproken naast het origineel
   staan: dan is niet te zien welke van de drie geldt als ze uiteenlopen. Haar
   artikel 13 zegt Nederlands recht, dus het Nederlands is de bindende tekst. */
export const VW_BINDEND = {
  nl: 'Dit is de Nederlandse versie van deze voorwaarden en die is de bindende.',
  en: 'This is a translation. The Dutch version of these terms is the binding one.',
  ro: 'Aceasta este o traducere. Versiunea în limba neerlandeză a acestor termeni este cea obligatorie.',
};

export const ARTIKELEN = [
  {
    nr: 1,
    kop: { nl: 'Bedrijfsgegevens', en: 'Business details', ro: 'Date de firmă' },
    gegevens: [
      { waarde: 'Ecaterina Heijnen-Monu' },
      { waarde: 'Dr Ensinkstraat 16' },
      { waarde: '4661 EH Halsteren' },
      {
        label: { nl: 'KvK-nummer', en: 'Chamber of Commerce number', ro: 'Nr. Registrul Comerțului (KvK)' },
        waarde: '42060578',
      },
      {
        label: { nl: 'BTW-nummer', en: 'VAT number', ro: 'Nr. TVA' },
        waarde: 'NL005463751B76',
      },
      {
        label: { nl: 'E-mail', en: 'Email', ro: 'E-mail' },
        waarde: 'info@velvetcakesbyanka.nl',
        mail: true,
      },
      {
        label: { nl: 'Telefoonnummer', en: 'Phone number', ro: 'Număr de telefon' },
        waarde: '06-83674069',
        tel: '31683674069',
      },
    ],
  },

  {
    nr: 2,
    kop: { nl: 'Toepasselijkheid', en: 'Applicability', ro: 'Aplicabilitate' },
    punten: [
      {
        nl: 'Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, bestellingen, overeenkomsten, leveringen en betalingen van Velvet cakes by Anka.',
        en: 'These terms and conditions apply to all offers, orders, agreements, deliveries and payments of Velvet Cakes by Anka.',
        ro: 'Acești termeni și condiții se aplică tuturor ofertelor, comenzilor, contractelor, livrărilor și plăților Velvet Cakes by Anka.',
      },
      {
        nl: 'Door het plaatsen van een bestelling verklaart de klant akkoord te gaan met deze voorwaarden.',
        en: 'By placing an order the customer declares that they agree to these terms.',
        ro: 'Prin plasarea unei comenzi, clientul declară că acceptă acești termeni.',
      },
      {
        nl: 'Afwijkingen zijn alleen geldig indien schriftelijk overeengekomen.',
        en: 'Deviations are valid only if they have been agreed in writing.',
        ro: 'Abaterile sunt valabile numai dacă au fost convenite în scris.',
      },
      {
        nl: 'Indien een bepaling ongeldig blijkt, blijven de overige bepalingen volledig van kracht.',
        en: 'If a provision proves to be invalid, the remaining provisions remain in full force.',
        ro: 'Dacă o prevedere se dovedește nulă, celelalte prevederi rămân pe deplin în vigoare.',
      },
    ],
  },

  {
    nr: 3,
    kop: { nl: 'Aanbod en prijzen', en: 'Offer and prices', ro: 'Oferta și prețurile' },
    punten: [
      {
        nl: "Alle prijzen zijn in euro's en inclusief btw, tenzij anders vermeld.",
        en: 'All prices are in euros and include VAT, unless stated otherwise.',
        ro: 'Toate prețurile sunt în euro și includ TVA, dacă nu se specifică altfel.',
      },
      {
        nl: 'Prijzen zijn onder voorbehoud van wijzigingen door stijgende grondstofprijzen of wettelijke veranderingen.',
        en: 'Prices are subject to change as a result of rising ingredient prices or changes in the law.',
        ro: 'Prețurile se pot modifica din cauza creșterii prețurilor la materiile prime sau a modificărilor legale.',
      },
      {
        nl: 'Afbeeldingen van producten zijn indicatief; handgemaakte producten kunnen afwijken.',
        en: 'Photos of products are indicative; handmade products can differ.',
        ro: 'Imaginile produselor sunt orientative; produsele lucrate manual pot diferi.',
      },
    ],
  },

  {
    nr: 4,
    kop: { nl: 'Bestellingen', en: 'Orders', ro: 'Comenzi' },
    punten: [
      {
        nl: 'Bestellingen kunnen worden geplaatst via e-mail, WhatsApp, social media of via de website.',
        en: 'Orders can be placed by email, WhatsApp, social media or through the website.',
        ro: 'Comenzile pot fi plasate prin e-mail, WhatsApp, rețele sociale sau prin site.',
      },
      {
        nl: 'Een bestelling is definitief zodra deze is bevestigd.',
        en: 'An order is final as soon as it has been confirmed.',
        ro: 'O comandă este definitivă din momentul în care a fost confirmată.',
      },
      {
        nl: 'Maatwerkbestellingen worden pas geproduceerd na betaling van 30% aanbetaling.',
        en: 'Custom orders go into production only after a deposit of 30% has been paid.',
        ro: 'Comenzile personalizate intră în producție numai după plata unui avans de 30%.',
      },
      {
        nl: 'Wijzigingen zijn alleen mogelijk in overleg en kunnen extra kosten met zich meebrengen.',
        en: 'Changes are possible only by arrangement and can involve extra costs.',
        ro: 'Modificările sunt posibile numai de comun acord și pot implica costuri suplimentare.',
      },
      {
        nl: 'Bestellingen op korte termijn kunnen worden geweigerd.',
        en: 'Orders at short notice can be refused.',
        ro: 'Comenzile pe termen scurt pot fi refuzate.',
      },
    ],
  },

  {
    nr: 5,
    kop: { nl: 'Levering en afhalen', en: 'Delivery and collection', ro: 'Livrare și ridicare' },
    punten: [
      {
        nl: 'Bestellingen kunnen worden afgehaald op afspraak of worden bezorgd.',
        en: 'Orders can be collected by appointment or delivered.',
        ro: 'Comenzile pot fi ridicate prin programare sau livrate.',
      },
      {
        nl: 'Bezorgkosten worden vooraf gecommuniceerd.',
        en: 'Delivery costs are communicated in advance.',
        ro: 'Costurile de livrare sunt comunicate în avans.',
      },
      {
        nl: 'Bezorgtijden zijn indicatief.',
        en: 'Delivery times are indicative.',
        ro: 'Intervalele de livrare sunt orientative.',
      },
      {
        nl: 'Bij afhalen gaat het risico over op de klant.',
        en: 'On collection the risk passes to the customer.',
        ro: 'La ridicare, riscul trece asupra clientului.',
      },
      {
        nl: 'Bij bezorging blijft verantwoordelijkheid bestaan tot overdracht.',
        en: 'With delivery the responsibility continues until hand-over.',
        ro: 'În cazul livrării, responsabilitatea continuă până la predare.',
      },
    ],
  },

  {
    nr: 6,
    kop: {
      nl: 'Bewaaradvies en aansprakelijkheid',
      en: 'Storage advice and liability',
      ro: 'Recomandări de păstrare și răspundere',
    },
    punten: [
      {
        nl: 'De klant is verantwoordelijk voor correct bewaren.',
        en: 'The customer is responsible for storing the product correctly.',
        ro: 'Clientul este responsabil pentru păstrarea corectă.',
      },
      {
        nl: 'Schade door onjuist transport of opslag komt voor rekening van de klant.',
        en: 'Damage caused by incorrect transport or storage is at the expense of the customer.',
        ro: 'Daunele cauzate de transportul sau depozitarea incorectă sunt în sarcina clientului.',
      },
      {
        nl: 'Velvet cakes by Anka is niet aansprakelijk voor indirecte schade.',
        en: 'Velvet Cakes by Anka is not liable for indirect damage.',
        ro: 'Velvet Cakes by Anka nu răspunde pentru daune indirecte.',
      },
    ],
  },

  {
    nr: 7,
    kop: {
      nl: 'Herroepingsrecht en annulering',
      en: 'Right of withdrawal and cancellation',
      ro: 'Dreptul de retragere și anularea',
    },
    noot: {
      nl: 'Let op: bederfelijke producten zijn wettelijk uitgesloten van het herroepingsrecht (art. 6:230p BW).',
      en: 'Please note: perishable products are excluded from the right of withdrawal by law (art. 6:230p of the Dutch Civil Code).',
      ro: 'Atenție: produsele perisabile sunt excluse prin lege de la dreptul de retragere (art. 6:230p din Codul civil olandez).',
    },
    subkop: { nl: 'Annuleringsvoorwaarden', en: 'Cancellation terms', ro: 'Condiții de anulare' },
    streep: [
      {
        nl: '4 dagen of langer vooraf: 100% restitutie',
        en: '4 days or more in advance: 100% refund',
        ro: 'cu 4 zile sau mai mult înainte: rambursare 100%',
      },
      {
        nl: '2 t/m 3 dagen vooraf: 50% restitutie',
        en: '2 to 3 days in advance: 50% refund',
        ro: 'cu 2 până la 3 zile înainte: rambursare 50%',
      },
      {
        nl: '2 dagen of korter vooraf: geen restitutie',
        en: '2 days or less in advance: no refund',
        ro: 'cu 2 zile sau mai puțin înainte: fără rambursare',
      },
      {
        nl: 'Annuleren tijdens het productieproces is niet mogelijk',
        en: 'Cancelling during the production process is not possible',
        ro: 'Anularea în timpul procesului de producție nu este posibilă',
      },
    ],
  },

  {
    nr: 8,
    kop: { nl: 'Klachten', en: 'Complaints', ro: 'Reclamații' },
    punten: [
      {
        nl: 'Klachten moeten binnen 3 uur na afhalen of bezorging worden gemeld.',
        en: 'Complaints must be reported within 3 hours of collection or delivery.',
        ro: 'Reclamațiile trebuie semnalate în termen de 3 ore de la ridicare sau livrare.',
      },
      {
        nl: "Klachten moeten voorzien zijn van foto's en een duidelijke omschrijving.",
        en: 'Complaints must come with photos and a clear description.',
        ro: 'Reclamațiile trebuie însoțite de fotografii și o descriere clară.',
      },
      {
        nl: 'Er wordt een passende oplossing geboden indien nodig.',
        en: 'Where needed, a suitable solution is offered.',
        ro: 'Dacă este necesar, se oferă o soluție potrivită.',
      },
    ],
  },

  {
    nr: 9,
    kop: { nl: 'Betaling', en: 'Payment', ro: 'Plata' },
    punten: [
      {
        nl: '30% van de betaling dient na bevestiging van de bestelling voldaan te worden.',
        en: '30% of the payment is due after the order has been confirmed.',
        ro: '30% din plată se achită după confirmarea comenzii.',
      },
      {
        nl: '70% van de betaling dient tijdens afhaal of bezorging te worden voldaan.',
        en: '70% of the payment is due on collection or delivery.',
        ro: '70% din plată se achită la ridicare sau la livrare.',
      },
      {
        nl: 'Bij niet-tijdige betaling kan de bestelling worden geannuleerd.',
        en: 'If payment is not made on time the order can be cancelled.',
        ro: 'În caz de plată întârziată, comanda poate fi anulată.',
      },
    ],
  },

  {
    nr: 10,
    kop: { nl: 'Overmacht', en: 'Force majeure', ro: 'Forță majoră' },
    punten: [
      {
        nl: 'In geval van overmacht kan de bestelling worden geannuleerd of verplaatst.',
        en: 'In the event of force majeure the order can be cancelled or moved to another date.',
        ro: 'În caz de forță majoră, comanda poate fi anulată sau reprogramată.',
      },
      {
        nl: 'De klant ontvangt een terugbetaling of vervangende datum.',
        en: 'The customer receives a refund or a replacement date.',
        ro: 'Clientul primește o rambursare sau o dată alternativă.',
      },
    ],
  },

  {
    nr: 11,
    kop: { nl: 'Privacy', en: 'Privacy', ro: 'Confidențialitate' },
    punten: [
      {
        nl: 'Persoonsgegevens worden uitsluitend gebruikt voor het verwerken van bestellingen.',
        en: 'Personal data is used solely for processing orders.',
        ro: 'Datele personale sunt folosite exclusiv pentru procesarea comenzilor.',
      },
      {
        nl: 'Gegevens worden niet gedeeld met derden behalve indien noodzakelijk.',
        en: 'Data is not shared with third parties except where this is necessary.',
        ro: 'Datele nu sunt partajate cu terți, cu excepția cazurilor în care este necesar.',
      },
    ],
  },

  {
    nr: 12,
    kop: { nl: 'Eigendomsvoorbehoud', en: 'Retention of title', ro: 'Rezerva dreptului de proprietate' },
    punten: [
      {
        nl: 'Producten blijven eigendom totdat volledige betaling is ontvangen.',
        en: 'Products remain the property of Velvet Cakes by Anka until payment has been received in full.',
        ro: 'Produsele rămân proprietatea Velvet Cakes by Anka până la primirea integrală a plății.',
      },
    ],
  },

  {
    nr: 13,
    kop: { nl: 'Toepasselijk recht', en: 'Governing law', ro: 'Legea aplicabilă' },
    tekst: {
      nl: 'Op deze voorwaarden is Nederlands recht van toepassing.',
      en: 'These terms are governed by Dutch law.',
      ro: 'Acestor termeni se aplică legea olandeză.',
    },
  },
];

/* De sleutels voor de vertaaltabel. Dezelfde vorm als de rest van de site:
   vw.a<nr>.<veld>, zodat een ontbrekende vertaling door dezelfde poort valt. */
export const voorwaardenSleutels = (taal) => {
  const T = {
    'vw.titel': VW_TITEL[taal],
    'vw.kop': VW_KOP[taal],
    'vw.bindend': VW_BINDEND[taal],
    'vw.desc': VW_DESC[taal],
    'vw.meta': `${VW_TITEL[taal]} | Velvet Cakes by Anka`,
  };
  for (const a of ARTIKELEN) {
    T[`vw.a${a.nr}.kop`] = a.kop[taal];
    if (a.tekst) T[`vw.a${a.nr}.tekst`] = a.tekst[taal];
    if (a.noot) T[`vw.a${a.nr}.noot`] = a.noot[taal];
    if (a.subkop) T[`vw.a${a.nr}.subkop`] = a.subkop[taal];
    (a.punten ?? []).forEach((p, i) => { T[`vw.a${a.nr}.p${i + 1}`] = p[taal]; });
    (a.streep ?? []).forEach((s, i) => { T[`vw.a${a.nr}.s${i + 1}`] = s[taal]; });
    (a.gegevens ?? []).forEach((g, i) => {
      if (g.label) T[`vw.a${a.nr}.l${i + 1}`] = g.label[taal];
    });
  }
  return T;
};

/* Alles wat tekst van ons is in plaats van haar: dat deel gaat door de
   ai-poort. Haar eigen artikelen gaan er ook door - als haar jurist een
   em-dash gebruikt wil ik dat weten, dan vraag ik het haar in plaats van het
   stil te veranderen. */
export const voorwaardenNl = () => voorwaardenSleutels('nl');
