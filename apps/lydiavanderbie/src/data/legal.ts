export type LegalSection = {
  h?: string;
  p?: string[];
  ul?: string[];
};

/**
 * Legal documents are kept in Dutch (binding text). Adapted from the source site,
 * with the domain updated to www.lydiavanderbie.nl.
 */

export const privacyPolicy: LegalSection[] = [
  {
    p: [
      'Vanaf 25 mei 2018 moeten alle bedrijven die omgaan met persoonsgegevens voldoen aan de privacywetgeving AVG. Op grond van deze wet heeft een organisatie die met persoonsgegevens werkt bepaalde plichten en heeft degene van wie de gegevens zijn bepaalde rechten. Dit privacyreglement informeert u over uw rechten en mijn plichten op grond van de AVG.',
    ],
  },
  {
    h: 'Privacybeleid',
    p: [
      'Lydia van der Bie, gevestigd aan de Adm. de Ruyterstraat 42, 3262 XE Oud-Beijerland, is verantwoordelijk voor de verwerking van uw persoonsgegevens zoals weergegeven in deze privacyverklaring. Ik verwerk uw persoonsgegevens doordat u informatie opvraagt, doordat u gebruikmaakt van mijn diensten of doordat u deze gegevens zelf aan mij verstrekt.',
    ],
  },
  {
    h: 'Welke gegevens verwerk ik',
    p: ['Hieronder vindt u een overzicht van de persoonsgegevens die worden verwerkt:'],
    ul: [
      'Voor- en achternaam',
      'Geslacht',
      'Adresgegevens',
      'Telefoonnummer',
      'E-mailadres',
      'Bedrijfsnaam en KvK-nummer indien van toepassing',
      'Overige persoonsgegevens die u actief verstrekt, bijvoorbeeld in correspondentie of telefonisch',
    ],
  },
  {
    h: 'Bijzondere en gevoelige gegevens',
    p: [
      'Ik verzoek u geen medische gegevens via e-mail toe te sturen.',
      'Komt u voor een cursus of opleiding, dan houd ik een cursistendossier bij: welke lesdag u volgt, of u aanwezig bent geweest, of u examen hebt gedaan en of u geslaagd bent. Bij contra-indicaties vermeld ik dat in het dossier.',
      'Komt u voor een behandeling, dan leg ik een behandeldossier aan om de zorgvraag op u af te stemmen en de uitgevoerde behandelingen bij te houden. Ik vraag niet meer gegevens dan nodig is voor uw behandeling en vraag geen gegevens op bij andere zorgverleners.',
    ],
  },
  {
    h: 'Doel en grondslag',
    p: ['Ik verwerk uw persoonsgegevens voor de volgende doelen:'],
    ul: [
      'U bellen of e-mailen als dat nodig is voor mijn dienstverlening',
      'U informeren over wijzigingen van mijn diensten',
      'U op uw verzoek informatie sturen over de opleidingen die ik geef',
      'Het maken van facturen en het afhandelen van uw betaling',
      'Het voldoen aan wettelijke verplichtingen, zoals de belastingaangifte',
    ],
  },
  {
    h: 'Zorgvuldig en vertrouwelijk',
    p: ['Dit betekent onder meer dat ik:'],
    ul: [
      'Zorgvuldig omga met uw persoonlijke gegevens',
      'Ervoor zorg dat onbevoegden geen toegang hebben tot uw gegevens',
      'Een wettelijke geheimhoudingsplicht (beroepsgeheim) heb',
      'E-mails verstuur via een beveiligde internetverbinding',
      'Mijn computer beveilig met een wachtwoord',
    ],
  },
  {
    h: 'Toestemming en bewaren',
    p: [
      'U dient toestemming te geven voor het verwerken van uw gegevens. Ik gebruik uw gegevens uitsluitend voor het doel waarvoor ze zijn verstrekt en verkoop ze niet aan derden. Uw gegevens worden volgens de wettelijke regels bewaard en niet doorgegeven aan derden, met uitzondering van de Belastingdienst indien zij daar wettelijk om vragen.',
    ],
  },
  {
    h: 'Geautomatiseerde besluitvorming',
    p: [
      'Lydia van der Bie neemt geen besluiten op basis van geautomatiseerde verwerkingen over zaken die aanzienlijke gevolgen kunnen hebben voor personen.',
    ],
  },
  {
    h: 'Uw rechten',
    p: ['U heeft de volgende rechten:'],
    ul: [
      'Het recht om te weten of en welke persoonsgegevens van u verwerkt worden en met welk doel',
      'Het recht op inzage en afschrift van die gegevens',
      'Het recht op correctie, aanvulling, verwijdering of vernietiging van gegevens indien dat nodig is',
      'Het recht om een eigen verklaring aan uw dossier toe te voegen',
      'Het recht om bezwaar te maken tegen de verwerking van uw gegevens',
      'Het recht om uw toestemming voor de gegevensverwerking in te trekken',
      'Het recht op gegevensoverdraagbaarheid',
    ],
  },
  {
    p: [
      'Wilt u gebruikmaken van uw rechten, dan kunt u dat mondeling of schriftelijk kenbaar maken. Om zeker te weten dat het verzoek door u is gedaan, vraag ik u een kopie van uw identiteitsbewijs mee te sturen, met daarop uw pasfoto, MRZ, paspoortnummer en BSN onleesbaar gemaakt. Ik reageer zo snel mogelijk, maar binnen vier weken, op uw verzoek.',
    ],
  },
  {
    h: 'Cookies',
    p: [
      'Lydia van der Bie maakt alleen gebruik van functionele cookies en standaard analytische cookies.',
      'Lydia van der Bie neemt de bescherming van uw gegevens serieus en neemt passende maatregelen tegen misbruik, verlies, onbevoegde toegang en ongeoorloofde wijziging. Heeft u het idee dat uw gegevens niet goed beveiligd zijn, neem dan contact op.',
    ],
  },
  {
    h: 'Contact en toezicht',
    p: [
      'Lydia van der Bie, Adm. de Ruyterstraat 42, 3262 XE Oud-Beijerland. Telefoon 06 17 99 67 03. KvK Rotterdam 24465028.',
      'Voor meer informatie over de AVG kunt u terecht bij de Autoriteit Persoonsgegevens via www.autoriteitpersoonsgegevens.nl. U heeft ook het recht een klacht in te dienen bij deze nationale toezichthouder.',
    ],
  },
];

export const algemeneVoorwaarden: LegalSection[] = [
  {
    h: 'Informatie',
    p: [
      'Informatie over de opleidingen, bijscholingen en workshops vindt u in de studiegids via www.lydiavanderbie.nl. Alle informatie die geïnteresseerden en cursisten verstrekken aan Lydia van der Bie is vertrouwelijk. Zie onze site voor de privacyverklaring.',
    ],
  },
  {
    h: 'Vrijblijvend informatie aanvragen',
    p: [
      'Als u vrijblijvend informatie aanvraagt, heeft u geen plichten maar ook geen rechten. U bent dan niet verzekerd van een plaats. Onderstaande voorwaarden zijn pas van toepassing na definitieve inschrijving.',
    ],
  },
  {
    h: 'Optie en definitief inschrijven',
    p: [
      'U kunt desgewenst tot twee maanden voor aanvang een optie nemen op een cursusplaats voor de duur van twee weken. Een optie is geldig als de aanvraag per e-mail binnenkomt met als onderwerp: optie, naam cursist en opleiding.',
      'Inschrijven kan per e-mail. U ontvangt een bevestigingsmail en een verzoek tot (aan)betaling.',
    ],
  },
  {
    h: 'Bedenktermijn',
    p: [
      'Bij inschrijving voor de opleidingen geldt een wettelijke bedenktermijn van 14 werkdagen. Besluit u binnen deze termijn niet deel te nemen, dan zijn hier geen kosten aan verbonden. U geeft schriftelijk aan dat u de aanmelding intrekt, via onze site, met als onderwerp annulering aanmelding en in de tekst uw gegevens en de betreffende opleiding en aanvangsdatum.',
      'Omdat wij deze termijn kort vinden, krijgt u voor opleidingen tot twee maanden voor aanvang gelegenheid om alsnog te annuleren bij overmacht. Wij rekenen dan € 30,00 administratiekosten.',
    ],
  },
  {
    h: 'Lesgeld',
    p: [
      'Actuele prijzen vindt u op www.lydiavanderbie.nl. Het cursusmateriaal en koffie en thee zijn bij de prijs inbegrepen. De genoemde bedragen zijn vrij van btw in verband met CRKBO en beroepsmatige intentie.',
    ],
  },
  {
    h: 'Betalingsvoorwaarden',
    p: [
      'Voor workshops en bijscholingen betaalt u binnen 14 dagen na inschrijving het volledige bedrag. Vindt de les binnen 14 dagen plaats, dan betaalt u direct. Bij een les binnen drie dagen na inschrijving kunt u voor aanvang contant betalen op locatie. Zonder vooraf betalen heeft u geen toegang tot de les.',
      'Voor opleidingen maakt u na inschrijving een aanbetaling over. Het overige lesgeld betaalt u in één keer na ontvangst van de factuur, die u twee maanden voor de eerste lesdag ontvangt. Betalen in termijnen kan op verzoek, met € 30,00 administratiekosten, en alleen als u zich ruim voor aanvang heeft aangemeld. Het volledige lesgeld moet twee maanden voor aanvang betaald zijn.',
    ],
  },
  {
    h: 'Duur van de overeenkomst',
    p: [
      'Na inschrijving is de overeenkomst geldig tot na afloop van de workshop, bijscholing of opleiding waarvoor u zich heeft ingeschreven. De lesdata staan in de bevestigingsmail.',
    ],
  },
  {
    h: 'Annulering',
    p: [
      'Onder annulering verstaan wij het afmelden of niet verschijnen, om welke reden dan ook. Wilt u annuleren, stuur dan direct een e-mail met in het onderwerp: annulering, naam cursist en startdatum. Online trainingen kunt u alleen annuleren als u nog geen lesmap heeft ontvangen.',
    ],
    ul: [
      'Binnen 14 dagen na inschrijving: geen kosten',
      'Tot twee maanden voor aanvang: € 30,00',
      'Binnen twee maanden voor aanvang is annuleren niet meer mogelijk en bent u het volledige lesgeld verschuldigd. Bij aantoonbare overmacht is verzetten naar een latere startdatum bespreekbaar.',
    ],
  },
  {
    h: 'In de plaats stellen en verschuiven',
    p: [
      'Kunt u zelf niet komen, dan kunt u een ander laten deelnemen. Hiervoor geldt € 30,00 administratiekosten en moet de vervanger zich ook zelf aanmelden en deze voorwaarden accepteren. Dit kan alleen als de opleiding volledig betaald is en nog moet starten.',
      'Tot twee maanden voor aanvang kunt u een verzoek indienen om uw deelname te verschuiven naar een andere startdatum, mits er plaats is. De administratiekosten hiervoor bedragen € 30,00. Binnen twee maanden voor aanvang kan dit alleen bij overmacht.',
    ],
  },
  {
    h: 'Inhalen van lessen',
    p: [
      'Moet u een lesdag missen wegens overmacht, dan is het in de meeste gevallen mogelijk die les in te halen bij een andere groep, mits daar plaats is. Dit is een mogelijkheid die wij bieden. Voor een gemiste lesdag krijgt u geen geld terug.',
    ],
  },
  {
    h: 'Certificaten en diploma’s',
    p: [
      'Na het volgen van losse bijscholingen, 1-daagse trainingen en de opleiding stoelmassage ontvangt u een certificaat. Ook als u de opleiding voetreflexologie volgt zonder examen te doen, ontvangt u een certificaat.',
      'Voor de opleiding voetreflexologie haalt u het diploma na het succesvol afronden van zowel het theorie-examen als het praktijkexamen. Doet u ook examen in de basis medische vakken, dan ontvangt u een extra aantekening op uw diploma. Slaagt u voor één van beide examens en niet voor het andere, dan dient u binnen één jaar alsnog te slagen voor het resterende examen. Een herexamen kost € 50,00 per examen indien dit individueel wordt afgenomen; bij een andere examengroep zijn hier geen kosten aan verbonden, mits er plaats is.',
      'Voor de opleiding stoelmassage kunt u optioneel examen doen tegen meerprijs; dit wordt altijd individueel afgenomen. Voor de opleiding wellnessmassage wordt geen examen afgelegd, maar past de cursist de veiligheidsregels toe en volgt alle lessen.',
    ],
  },
  {
    h: 'Registraties',
    p: ['Wij zijn geregistreerd bij het Centraal Register Kort Beroepsonderwijs (CRKBO). De opleidingen zijn door de overheid erkend. Afhankelijk van uw opleiding en diploma is aansluiten mogelijk bij:'],
    ul: [
      'Beroepsvereniging voor stoelmasseurs',
      'NVVT (Nederlandse vereniging voor voetreflexzonetherapeuten)',
      'CAT (Collectief Alternatief Therapeut), GAT en BAT',
      'Masseur Netwerk Nederland',
      'Reiki-cirkel',
    ],
  },
  {
    h: 'Overmacht',
    p: [
      'Lydia van der Bie doet er alles aan om de workshop, bijscholing of opleiding doorgang te laten vinden, maar behoudt zich het recht voor te annuleren bij onvoldoende belangstelling, ziekte van de docente of calamiteiten. Wordt een les geannuleerd door Lydia van der Bie, dan krijgt u het reeds betaalde lesgeld voor die les terug. U kunt geen verdere kosten in rekening brengen. De starttijd blijft altijd 10.00 uur; de lunchpauze kan per dag iets verschillen.',
    ],
  },
  {
    h: 'Regels',
    ul: [
      'De cursist is en blijft volledig verantwoordelijk en aansprakelijk voor het eigen handelen tijdens en buiten de les.',
      'De cursist informeert de docente voldoende over de eigen gezondheidstoestand en relevant medicijngebruik.',
      'Lydia van der Bie mag een cursist die het verloop van de cursus structureel belemmert verdere deelname ontzeggen.',
      'Het volledige cursusgeld is voor aanvang verschuldigd. Betalen na de les is niet mogelijk.',
      'De cursist blijft het volledige cursusgeld verschuldigd, ook bij tussentijds vertrek.',
      'De aansprakelijkheid van Lydia van der Bie is beperkt tot het bedrag dat de aansprakelijkheidsverzekering uitkeert, of bij geen dekking tot maximaal € 100,00, tenzij sprake is van opzet of grove nalatigheid.',
      'In de lesruimte mag niet met schoenen worden gelopen en niet worden gerookt. Eigen meegebrachte massageolie mag niet worden gebruikt.',
      'Wij discrimineren niet, respecteren elkaar en maken geen opmerkingen met seksuele bedoelingen.',
    ],
  },
  {
    h: 'Copyright en eigendomsrecht',
    p: [
      'Het copyright en eigendomsrecht van alle cursusmaterialen en lesmappen berust bij Lydia van der Bie. Het gebruiksrecht ligt bij de cursist. Verveelvoudigen of openbaar maken van lesmateriaal mag uitsluitend na voorafgaande schriftelijke toestemming. Certificaten en diploma’s mogen via social media worden gedeeld; let op dat uw handtekening daarop staat.',
    ],
  },
  {
    h: 'Garantie en klachten',
    p: [
      'Lydia van der Bie garandeert dat de betaalde lessen ook daadwerkelijk worden gegeven, tenzij sprake is van overmacht, en waarborgt de kwaliteit en betrouwbaarheid van de cursussen. De docente staat ingeschreven bij de Kamer van Koophandel Rotterdam onder nummer 24465028 en heeft een bedrijfsaansprakelijkheidsverzekering. Na iedere training ontvangen deelnemers een evaluatieformulier in verband met CRKBO.',
      'Eventuele klachten kunnen schriftelijk worden ingediend en worden schriftelijk behandeld en beantwoord. Komt u er samen niet uit, dan ontstaat een geschil dat valt onder het klachtenreglement. Vragen van administratieve aard worden binnen 10 werkdagen beantwoord, inhoudelijke vragen doorgaans binnen 3 dagen. Tijdens basisschoolvakanties zijn wij gesloten en per e-mail bereikbaar.',
    ],
  },
];

export const klachtenreglement: LegalSection[] = [
  {
    h: 'Begripsbepaling',
    p: [
      'Klacht: een uiting van onvrede over de inhoud en organisatie van de opleiding, workshop of bijscholing, of over de bejegening of behandeling door de docente Lydia van der Bie. Klager: iedereen die gebruikmaakt of heeft gemaakt van de diensten. Aangeklaagde: Lydia van der Bie. Klachtencommissie: de door Lydia van der Bie ingestelde onafhankelijke commissie die verantwoordelijk is voor de klachtbehandeling.',
    ],
  },
  {
    h: 'Doelstelling en uitgangspunten',
    p: [
      'De klachtregeling stelt zich ten doel recht te doen aan de individuele klager en deze indien mogelijk tegemoet te komen. De klacht wordt bij voorkeur eerst besproken tussen klager en aangeklaagde. De commissie behandelt de klacht onpartijdig, kan onderzoek doen naar de oorzaak en geeft zo nodig een uitspraak en advies over te nemen maatregelen. Gegevens worden vertrouwelijk behandeld. De commissie doet geen uitspraak over aansprakelijkheid.',
    ],
  },
  {
    h: 'Indienen van een klacht',
    p: [
      'De klager wendt zich bij voorkeur eerst tot de aangeklaagde. Lukt het niet om samen tot een oplossing te komen, dan kan de klacht binnen 14 dagen schriftelijk worden ingediend bij de klachtencommissie, gericht aan: Lydia van der Bie, t.a.v. klachtencommissie, Adm. de Ruyterstraat 42, 3262 XE Oud-Beijerland.',
    ],
  },
  {
    h: 'Werkwijze',
    p: [
      'De klachtencommissie informeert de klager binnen vier weken over de te volgen procedure. Bij onvoldoende informatie krijgt de klager de gelegenheid die aan te vullen. De commissie deelt de inhoud van de klacht binnen een week mee aan de aangeklaagde met het verzoek binnen een week te reageren. Schriftelijke klachten worden geregistreerd en ten minste 3 jaar bewaard. Bijeenkomsten hebben een besloten karakter. Bij voldoende informatie doet de commissie binnen vier weken uitspraak; is meer tijd nodig, dan worden betrokkenen daar binnen twee weken over geïnformeerd. Het oordeel van de commissie is voor het opleidingsinstituut bindend.',
    ],
  },
  {
    h: 'Geheimhouding en beroep',
    p: [
      'De leden van de klachtencommissie en overige betrokkenen hebben een geheimhoudingsplicht. Een klacht wordt niet verder behandeld als deze door de klager wordt ingetrokken. Om in beroep te gaan tegen een uitspraak kunnen cursisten zich wenden tot de rechter.',
    ],
  },
  {
    h: 'Samenstelling',
    p: [
      'De klachtencommissie bestaat uit één lid, benoemd door Lydia van der Bie, met plaatsvervangers. Voorzitter: S. Roos. Plaatsvervangend lid 1: M. Zuiddam. Plaatsvervangend lid 2: D. Simic van Change-Works. Voor de WKKGZ is Lydia van der Bie aangesloten bij het GAT. Indien u zich aanmeldt, gaan wij ervan uit dat u akkoord gaat met deze voorwaarden.',
    ],
  },
];
