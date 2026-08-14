import type { Lang } from '../translations';

export type LegalBlock =
  | { kind: 'p'; num?: string; text: string }
  | { kind: 'list'; items: string[] };

export type LegalArticle = {
  n: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  docTitle: string;
  metaDescription: string;
  back: string;
  kicker: string;
  title: string;
  subtitle: string;
  version: string;
  intro: string;
  articleLabel: string;
  articles: LegalArticle[];
  closing: string;
  contactTitle: string;
  phoneLabel: string;
  whatsappLabel: string;
};

export const legal: Record<Lang, LegalDoc> = {
  nl: {
    docTitle: 'Algemene voorwaarden — AnArt Studio Kaatsheuvel',
    metaDescription:
      'De algemene voorwaarden van AnArt Studio in Kaatsheuvel: aankomst, annuleren en verplaatsen, te laat komen, prijzen, gezondheid, klachten en leeftijd.',
    back: 'Terug naar home',
    kicker: 'Juridisch',
    title: 'Algemene voorwaarden',
    subtitle: 'AnArt Studio, Kaatsheuvel',
    version: 'Versie: augustus 2026',
    intro:
      'Om ieder bezoek prettig en ontspannen te laten verlopen, vragen wij onze klanten onderstaande voorwaarden te volgen.',
    articleLabel: 'Artikel',
    articles: [
      {
        n: '1',
        title: 'Aankomst',
        blocks: [
          { kind: 'p', num: '1.1', text: 'Je kunt maximaal 15 minuten voor je afspraak aankomen.' },
          { kind: 'p', num: '1.2', text: 'Kom niet eerder. Mogelijk zijn wij dan nog bezig met een andere klant of met het voorbereiden van de behandelruimte.' },
        ],
      },
      {
        n: '2',
        title: 'Annuleren en verplaatsen',
        blocks: [
          { kind: 'p', num: '2.1', text: 'Afspraken moeten uiterlijk 24 uur voor het afgesproken tijdstip worden geannuleerd of verplaatst.' },
          { kind: 'p', num: '2.2', text: 'Bij een onverwachte situatie of noodgeval vragen wij je zo snel mogelijk contact op te nemen met de studio, telefonisch of met een bericht via WhatsApp.' },
        ],
      },
      {
        n: '3',
        title: 'Te laat komen',
        blocks: [
          { kind: 'p', num: '3.1', text: 'Kom je 15 minuten of meer te laat, dan kan dat gevolgen hebben voor de behandeling.' },
          { kind: 'p', num: '3.2', text: 'Afhankelijk van de situatie kan de behandeling:' },
          {
            kind: 'list',
            items: [
              'worden ingekort of aangepast,',
              'worden gewijzigd in een andere passende behandeling,',
              'worden verplaatst,',
              'of in uitzonderlijke gevallen worden geannuleerd.',
            ],
          },
          { kind: 'p', num: '3.3', text: 'Dit is nodig om vertraging voor andere klanten te voorkomen.' },
        ],
      },
      {
        n: '4',
        title: 'Wijzigingen in je afspraak of behandeling',
        blocks: [
          { kind: 'p', num: '4.1', text: 'Wil je de geboekte behandeling wijzigen, laat dat dan waar mogelijk vóór je afspraak weten.' },
          { kind: 'p', num: '4.2', text: 'Wijzigingen die op de dag van de afspraak worden doorgegeven zijn niet altijd mogelijk, door de beschikbare tijd of de benodigde voorbereiding.' },
          { kind: 'p', num: '4.3', text: 'Vraagt de gewenste behandeling meer tijd, dan kan het nodig zijn de afspraak te verplaatsen.' },
          { kind: 'p', num: '4.4', text: 'De uiteindelijke prijs kan variëren, afhankelijk van het soort, de duur en de omvang van de behandeling.' },
          { kind: 'p', num: '4.5', text: 'Eventuele meerkosten worden vóór de behandeling met je besproken.' },
        ],
      },
      {
        n: '5',
        title: 'Prijzen',
        blocks: [
          { kind: 'p', num: '5.1', text: 'De prijzen in ons boekingssysteem, op de prijslijst en in promotiemateriaal gelden voor de standaardomvang van elke behandeling.' },
          { kind: 'p', num: '5.2', text: 'De uiteindelijke prijs kan afwijken wanneer extra werk, producten, tijd of een andere behandeling nodig zijn.' },
          { kind: 'p', num: '5.3', text: 'Een noemenswaardig prijsverschil bespreken wij met de klant voordat wij verdergaan.' },
        ],
      },
      {
        n: '6',
        title: 'No-show en late annulering',
        blocks: [
          { kind: 'p', num: '6.1', text: 'Verschijn je niet op je afspraak, of annuleer of verplaats je binnen 24 uur voor de afspraak, dan brengen wij 50% van de prijs van de geplande behandeling in rekening.' },
          { kind: 'p', num: '6.2', text: 'Door het maken van een afspraak ga je akkoord met deze voorwaarden.' },
        ],
      },
      {
        n: '7',
        title: 'Contra-indicaties en verantwoordelijkheid van de klant',
        blocks: [
          { kind: 'p', num: '7.1', text: 'Klanten zijn verplicht ons vóór de behandeling te informeren over allergieën, huidaandoeningen, medische aandoeningen, medicijngebruik, recent ondergane behandelingen of andere omstandigheden die van invloed kunnen zijn op de veiligheid of de geschiktheid van de behandeling.' },
          { kind: 'p', num: '7.2', text: 'De klant is verantwoordelijk voor het verstrekken van juiste en actuele informatie die van belang is voor de behandeling.' },
          { kind: 'p', num: '7.3', text: 'Meld relevante veranderingen vóór je afspraak aan je specialist.' },
          { kind: 'p', num: '7.4', text: 'Wij behouden ons het recht voor een behandeling te weigeren of aan te passen wanneer deze niet veilig of niet passend is voor de klant.' },
        ],
      },
      {
        n: '8',
        title: 'Klachten',
        blocks: [
          { kind: 'p', num: '8.1', text: 'Wij streven altijd naar de hoogst mogelijke kwaliteit van onze dienstverlening.' },
          { kind: 'p', num: '8.2', text: 'Ben je niet tevreden over het resultaat van je behandeling of merk je een probleem op, neem dan binnen 7 dagen na de behandeling contact met ons op.' },
          { kind: 'p', num: '8.3', text: 'Meld een klacht zo snel mogelijk en voeg waar relevant duidelijke foto’s toe, zodat wij de situatie goed kunnen beoordelen.' },
          { kind: 'p', num: '8.4', text: 'Klachten die na 7 dagen worden gemeld, kunnen mogelijk niet meer in behandeling worden genomen.' },
        ],
      },
      {
        n: '9',
        title: 'Leeftijd',
        blocks: [
          { kind: 'p', num: '9.1', text: 'Onze beautybehandelingen zijn beschikbaar voor klanten vanaf 15 jaar.' },
          { kind: 'p', num: '9.2', text: 'Dit leeftijdsbeleid geldt alleen voor beautybehandelingen en heeft geen betrekking op tattoos.' },
        ],
      },
    ],
    closing:
      'Bedankt dat je onze voorwaarden respecteert, en daarmee de tijd van ons team en van andere klanten.',
    contactTitle: 'Contactgegevens',
    phoneLabel: 'Telefoon',
    whatsappLabel: 'WhatsApp',
  },

  en: {
    docTitle: 'Terms & conditions — AnArt Studio Kaatsheuvel',
    metaDescription:
      'The client policy of AnArt Studio in Kaatsheuvel: arrival, cancellations and rescheduling, late arrivals, prices, health, complaints and age policy.',
    back: 'Back to home',
    kicker: 'Legal',
    title: 'Terms & conditions',
    subtitle: 'AnArt Studio, Kaatsheuvel',
    version: 'Version: August 2026',
    intro:
      'To ensure a smooth and comfortable experience for everyone, we kindly ask our clients to follow the policies below.',
    articleLabel: 'Article',
    articles: [
      {
        n: '1',
        title: 'Arrival',
        blocks: [
          { kind: 'p', num: '1.1', text: 'Clients may arrive a maximum of 15 minutes before their scheduled appointment.' },
          { kind: 'p', num: '1.2', text: 'Please do not arrive earlier, as we may still be attending to another client or preparing the treatment room.' },
        ],
      },
      {
        n: '2',
        title: 'Cancellations and rescheduling',
        blocks: [
          { kind: 'p', num: '2.1', text: 'Appointments must be cancelled or rescheduled at least 24 hours before the scheduled appointment.' },
          { kind: 'p', num: '2.2', text: 'In case of an unexpected or emergency situation, please contact the salon as soon as possible by phone or leave a message via WhatsApp.' },
        ],
      },
      {
        n: '3',
        title: 'Late arrivals',
        blocks: [
          { kind: 'p', num: '3.1', text: 'Arriving 15 minutes or more late may affect the treatment.' },
          { kind: 'p', num: '3.2', text: 'Depending on the circumstances, the service may:' },
          {
            kind: 'list',
            items: [
              'be shortened or adjusted,',
              'be changed to another suitable service,',
              'be rescheduled,',
              'or, in exceptional cases, be cancelled.',
            ],
          },
          { kind: 'p', num: '3.3', text: 'This is necessary to avoid delays for other clients.' },
        ],
      },
      {
        n: '4',
        title: 'Changes to your appointment or service',
        blocks: [
          { kind: 'p', num: '4.1', text: 'If you wish to change the service you have booked, please inform us before your appointment whenever possible.' },
          { kind: 'p', num: '4.2', text: 'Changes requested on the day of the appointment may not always be possible due to time limitations or preparation requirements.' },
          { kind: 'p', num: '4.3', text: 'If the requested service requires additional time, the appointment may need to be rescheduled.' },
          { kind: 'p', num: '4.4', text: 'The final price may vary depending on the type, duration and scope of the treatment.' },
          { kind: 'p', num: '4.5', text: 'Any additional costs will be communicated before the treatment is performed.' },
        ],
      },
      {
        n: '5',
        title: 'Prices',
        blocks: [
          { kind: 'p', num: '5.1', text: 'Prices shown in our booking system, price list or promotional materials are based on the standard scope of each service.' },
          { kind: 'p', num: '5.2', text: 'The final price may differ if additional work, products, time or a different treatment is required.' },
          { kind: 'p', num: '5.3', text: 'Any significant price difference will be discussed with the client before proceeding.' },
        ],
      },
      {
        n: '6',
        title: 'No-show and late cancellation',
        blocks: [
          { kind: 'p', num: '6.1', text: 'If you do not attend your appointment, or cancel or reschedule less than 24 hours before the appointment, a fee of 50% of the scheduled service price will be charged.' },
          { kind: 'p', num: '6.2', text: 'By booking an appointment, you accept these terms and conditions.' },
        ],
      },
      {
        n: '7',
        title: 'Contraindications and client responsibility',
        blocks: [
          { kind: 'p', num: '7.1', text: 'Clients are required to inform us before the treatment about any allergies, skin conditions, medical conditions, medications, recent procedures or other circumstances that may affect the safety or suitability of the treatment.' },
          { kind: 'p', num: '7.2', text: 'Clients are responsible for providing accurate and up-to-date information relevant to their treatment.' },
          { kind: 'p', num: '7.3', text: 'Please inform your beauty specialist of any relevant changes before your appointment.' },
          { kind: 'p', num: '7.4', text: 'We reserve the right to refuse or modify a treatment if performing it may not be safe or appropriate for the client.' },
        ],
      },
      {
        n: '8',
        title: 'Complaints',
        blocks: [
          { kind: 'p', num: '8.1', text: 'We always aim to provide the highest standard of service.' },
          { kind: 'p', num: '8.2', text: 'If you are not satisfied with the result of your treatment or notice a problem, please contact us within 7 days of the treatment.' },
          { kind: 'p', num: '8.3', text: 'Complaints should be reported as soon as possible and, where relevant, accompanied by clear photographs so that we can properly assess the situation.' },
          { kind: 'p', num: '8.4', text: 'Complaints submitted after 7 days may not be considered.' },
        ],
      },
      {
        n: '9',
        title: 'Age policy',
        blocks: [
          { kind: 'p', num: '9.1', text: 'Our beauty treatments are available to clients aged 15 and over.' },
          { kind: 'p', num: '9.2', text: 'This age policy applies only to beauty treatments and services and does not refer to tattoo services.' },
        ],
      },
    ],
    closing:
      'Thank you for respecting our policies and the time of our team and other clients.',
    contactTitle: 'Contact details',
    phoneLabel: 'Phone',
    whatsappLabel: 'WhatsApp',
  },

  pl: {
    docTitle: 'Regulamin — AnArt Studio Kaatsheuvel',
    metaDescription:
      'Regulamin salonu AnArt Studio w Kaatsheuvel: przyjście na wizytę, odwoływanie i zmiana terminu, spóźnienia, ceny, zdrowie, reklamacje i wiek.',
    back: 'Powrót na stronę główną',
    kicker: 'Informacje prawne',
    title: 'Regulamin salonu',
    subtitle: 'AnArt Studio, Kaatsheuvel',
    version: 'Wersja: sierpień 2026',
    intro:
      'Aby każda wizyta przebiegała spokojnie i komfortowo, prosimy naszych klientów o przestrzeganie poniższego regulaminu.',
    articleLabel: 'Punkt',
    articles: [
      {
        n: '1',
        title: 'Przyjście na wizytę',
        blocks: [
          { kind: 'p', num: '1.1', text: 'Prosimy przychodzić najwcześniej 15 minut przed umówioną wizytą.' },
          { kind: 'p', num: '1.2', text: 'Prosimy nie przychodzić wcześniej, ponieważ możemy jeszcze obsługiwać inną klientkę lub przygotowywać gabinet.' },
        ],
      },
      {
        n: '2',
        title: 'Odwoływanie i zmiana terminu',
        blocks: [
          { kind: 'p', num: '2.1', text: 'Wizytę należy odwołać lub przełożyć najpóźniej 24 godziny przed umówionym terminem.' },
          { kind: 'p', num: '2.2', text: 'W sytuacji nagłej lub nieprzewidzianej prosimy o jak najszybszy kontakt telefoniczny z salonem lub wiadomość na WhatsApp.' },
        ],
      },
      {
        n: '3',
        title: 'Spóźnienia',
        blocks: [
          { kind: 'p', num: '3.1', text: 'Spóźnienie wynoszące 15 minut lub więcej może wpłynąć na przebieg zabiegu.' },
          { kind: 'p', num: '3.2', text: 'W zależności od sytuacji zabieg może:' },
          {
            kind: 'list',
            items: [
              'zostać skrócony lub zmodyfikowany,',
              'zostać zmieniony na inny odpowiedni zabieg,',
              'zostać przełożony na inny termin,',
              'lub w wyjątkowych przypadkach zostać odwołany.',
            ],
          },
          { kind: 'p', num: '3.3', text: 'Jest to konieczne, aby uniknąć opóźnień dla pozostałych klientów.' },
        ],
      },
      {
        n: '4',
        title: 'Zmiany wizyty lub zabiegu',
        blocks: [
          { kind: 'p', num: '4.1', text: 'Jeśli chcesz zmienić zarezerwowany zabieg, poinformuj nas o tym w miarę możliwości przed wizytą.' },
          { kind: 'p', num: '4.2', text: 'Zmiany zgłaszane w dniu wizyty nie zawsze są możliwe ze względu na ograniczenia czasowe lub konieczne przygotowania.' },
          { kind: 'p', num: '4.3', text: 'Jeśli wybrany zabieg wymaga więcej czasu, wizyta może wymagać przełożenia.' },
          { kind: 'p', num: '4.4', text: 'Ostateczna cena może się różnić w zależności od rodzaju, czasu trwania i zakresu zabiegu.' },
          { kind: 'p', num: '4.5', text: 'O wszelkich dodatkowych kosztach poinformujemy przed rozpoczęciem zabiegu.' },
        ],
      },
      {
        n: '5',
        title: 'Ceny',
        blocks: [
          { kind: 'p', num: '5.1', text: 'Ceny podane w systemie rezerwacji, w cenniku i w materiałach promocyjnych dotyczą standardowego zakresu każdego zabiegu.' },
          { kind: 'p', num: '5.2', text: 'Ostateczna cena może się różnić, jeśli konieczna jest dodatkowa praca, dodatkowe produkty, więcej czasu lub inny zabieg.' },
          { kind: 'p', num: '5.3', text: 'Każdą istotną różnicę w cenie omówimy z klientem przed rozpoczęciem zabiegu.' },
        ],
      },
      {
        n: '6',
        title: 'Nieobecność i późne odwołanie',
        blocks: [
          { kind: 'p', num: '6.1', text: 'W przypadku nieobecności na wizycie albo odwołania lub przełożenia jej później niż 24 godziny przed terminem pobieramy opłatę w wysokości 50% ceny zarezerwowanego zabiegu.' },
          { kind: 'p', num: '6.2', text: 'Rezerwując wizytę, akceptujesz niniejszy regulamin.' },
        ],
      },
      {
        n: '7',
        title: 'Przeciwwskazania i odpowiedzialność klienta',
        blocks: [
          { kind: 'p', num: '7.1', text: 'Przed zabiegiem należy poinformować nas o alergiach, chorobach skóry, schorzeniach, przyjmowanych lekach, niedawno wykonanych zabiegach oraz innych okolicznościach, które mogą wpłynąć na bezpieczeństwo lub możliwość wykonania zabiegu.' },
          { kind: 'p', num: '7.2', text: 'Klient odpowiada za przekazanie prawdziwych i aktualnych informacji istotnych dla zabiegu.' },
          { kind: 'p', num: '7.3', text: 'O wszelkich istotnych zmianach poinformuj swoją specjalistkę przed wizytą.' },
          { kind: 'p', num: '7.4', text: 'Zastrzegamy sobie prawo do odmowy wykonania zabiegu lub jego modyfikacji, jeśli jego wykonanie mogłoby nie być bezpieczne lub odpowiednie dla klienta.' },
        ],
      },
      {
        n: '8',
        title: 'Reklamacje',
        blocks: [
          { kind: 'p', num: '8.1', text: 'Zawsze dążymy do najwyższej jakości świadczonych usług.' },
          { kind: 'p', num: '8.2', text: 'Jeśli nie jesteś zadowolona z efektu zabiegu lub zauważysz problem, skontaktuj się z nami w ciągu 7 dni od zabiegu.' },
          { kind: 'p', num: '8.3', text: 'Reklamację prosimy zgłaszać jak najszybciej i, jeśli to możliwe, dołączyć wyraźne zdjęcia, abyśmy mogli rzetelnie ocenić sytuację.' },
          { kind: 'p', num: '8.4', text: 'Reklamacje zgłoszone po upływie 7 dni mogą nie zostać rozpatrzone.' },
        ],
      },
      {
        n: '9',
        title: 'Wiek',
        blocks: [
          { kind: 'p', num: '9.1', text: 'Nasze zabiegi kosmetyczne dostępne są dla klientów od 15 roku życia.' },
          { kind: 'p', num: '9.2', text: 'Ta zasada dotyczy wyłącznie zabiegów kosmetycznych i nie obejmuje usług tatuażu.' },
        ],
      },
    ],
    closing:
      'Dziękujemy za przestrzeganie regulaminu oraz za szacunek dla czasu naszego zespołu i pozostałych klientów.',
    contactTitle: 'Dane kontaktowe',
    phoneLabel: 'Telefon',
    whatsappLabel: 'WhatsApp',
  },
};
