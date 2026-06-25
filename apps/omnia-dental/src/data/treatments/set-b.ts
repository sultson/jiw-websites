import type { Treatment } from '../types';

export const setB: Treatment[] = [
  {
    key: 'implantaten',
    slug: { nl: 'implantaten', en: 'dental-implants' },
    category: 'vervanging',
    order: 3,
    image: '/images/treatments/implantaten.webp',
    imageAlt: {
      nl: 'Illustratie van een tandimplantaat met kroon in de kaak',
      en: 'Illustration of a dental implant with crown in the jaw',
    },
    imageKind: 'illustration',
    name: { nl: 'Implantaten', en: 'Dental implants' },
    tagline: {
      nl: 'Een vaste, natuurlijke vervanging voor een verloren tand of kies.',
      en: 'A fixed, natural replacement for a lost tooth.',
    },
    intro: {
      nl: 'Een implantaat is een kleine titanium schroef die de wortel van een verloren tand vervangt. Daarop plaatsen we een kroon, brug of klikgebit die voelt en functioneert als uw eigen gebit.',
      en: 'An implant is a small titanium screw that replaces the root of a lost tooth. On top of it we place a crown, bridge or click denture that feels and works like your own teeth.',
    },
    what: {
      nl: 'Een tandimplantaat bestaat uit twee delen. Eerst plaatsen we de titanium schroef in het kaakbot, waar die in een aantal maanden stevig vastgroeit. Daarna bevestigen we hierop de definitieve kroon, brug of een klikgebit. Het resultaat staat vast en u hoeft er niets bijzonders voor te doen.\n\nBij Omnia Dental doen we de hele behandeling in eigen huis, van de eerste scan tot de definitieve kroon. U wordt dus niet doorverwezen naar een aparte kliniek en houdt steeds dezelfde tandarts en hetzelfde team om u heen.',
      en: 'A dental implant has two parts. First we place the titanium screw in the jawbone, where it fuses securely over a number of months. After that we attach the final crown, bridge or click denture on top. The result is fixed and needs no special care beyond normal brushing.\n\nAt Omnia Dental we carry out the whole treatment in house, from the first scan to the final crown. You are not referred to a separate clinic and keep the same dentist and team around you the entire time.',
    },
    forWhom: {
      nl: 'Een implantaat is geschikt als u een of meer tanden mist, of als een kroon op de eigen wortel niet meer mogelijk is. Ook bij een loszittend kunstgebit kan een implantaat houvast geven. Tijdens een eerste afspraak bekijken we met een 3D-scan of er voldoende kaakbot is en of een implantaat voor u de juiste keuze is.',
      en: 'An implant is suitable if you are missing one or more teeth, or when a crown on your own root is no longer possible. It can also give grip to a loose denture. During a first appointment we use a 3D scan to check whether there is enough jawbone and whether an implant is the right choice for you.',
    },
    steps: [
      {
        title: { nl: 'Onderzoek en 3D-scan', en: 'Assessment and 3D scan' },
        body: {
          nl: 'We beoordelen uw gebit en maken een 3D-scan om de hoeveelheid bot en de positie van zenuwen nauwkeurig in beeld te brengen.',
          en: 'We assess your teeth and make a 3D scan to map the amount of bone and the position of nerves precisely.',
        },
      },
      {
        title: { nl: 'Plaatsen van het implantaat', en: 'Placing the implant' },
        body: {
          nl: 'Onder lokale verdoving plaatsen we de titanium schroef in het kaakbot. De ingreep is meestal korter dan patiënten verwachten.',
          en: 'Under local anaesthetic we place the titanium screw in the jawbone. The procedure is usually shorter than patients expect.',
        },
      },
      {
        title: { nl: 'Inheling', en: 'Healing period' },
        body: {
          nl: 'Het implantaat groeit in enkele maanden vast aan het bot. In deze periode kunt u vaak een tijdelijke voorziening dragen.',
          en: 'The implant fuses with the bone over a few months. During this period you can often wear a temporary solution.',
        },
      },
      {
        title: { nl: 'Definitieve kroon of klikgebit', en: 'Final crown or click denture' },
        body: {
          nl: 'Zodra het implantaat stevig vastzit, plaatsen we de definitieve kroon, brug of het klikgebit. We controleren de pasvorm en uw beet zorgvuldig.',
          en: 'Once the implant is firmly fixed, we place the final crown, bridge or click denture. We check the fit and your bite carefully.',
        },
      },
    ],
    benefits: [
      { nl: 'Voelt en functioneert als een eigen tand', en: 'Feels and works like a natural tooth' },
      { nl: 'Staat vast en glijdt niet weg bij het eten of praten', en: 'Stays fixed and does not slip when eating or talking' },
      { nl: 'Spaart de buurtanden, die niet hoeven te worden afgeslepen', en: 'Spares the neighbouring teeth, which do not need to be ground down' },
      { nl: 'Volledige behandeling in eigen praktijk, zonder doorverwijzing', en: 'Complete treatment in our own practice, without referral' },
    ],
    faq: [
      {
        q: { nl: 'Doet het plaatsen van een implantaat pijn?', en: 'Does placing an implant hurt?' },
        a: {
          nl: 'De behandeling gebeurt onder lokale verdoving, zodat u er tijdens de ingreep niets van voelt. Daarna kan het gebied een paar dagen wat gevoelig zijn, wat goed te verlichten is met gewone pijnstillers.',
          en: 'The treatment is done under local anaesthetic, so you feel nothing during the procedure. Afterwards the area can be a little tender for a few days, which is easily eased with ordinary painkillers.',
        },
      },
      {
        q: { nl: 'Hoe lang gaat een implantaat mee?', en: 'How long does an implant last?' },
        a: {
          nl: 'Met goede mondhygiëne en regelmatige controles gaat een implantaat vaak vele jaren mee. We laten u precies zien hoe u het schoon en gezond houdt.',
          en: 'With good oral hygiene and regular check-ups an implant often lasts many years. We show you exactly how to keep it clean and healthy.',
        },
      },
      {
        q: { nl: 'Hoe lang duurt het hele traject?', en: 'How long does the whole process take?' },
        a: {
          nl: 'Reken vaak op enkele maanden tussen het plaatsen van het implantaat en de definitieve kroon, omdat het bot de tijd nodig heeft om vast te groeien. We bespreken vooraf een duidelijke planning.',
          en: 'Often expect a few months between placing the implant and the final crown, because the bone needs time to fuse. We discuss a clear timeline with you in advance.',
        },
      },
    ],
    duration: {
      nl: 'Meerdere afspraken over enkele maanden',
      en: 'Several appointments spread over a few months',
    },
    metaTitle: {
      nl: 'Implantaten in Hoofddorp | Omnia Dental',
      en: 'Dental implants in Hoofddorp | Omnia Dental',
    },
    metaDescription: {
      nl: 'Mist u een tand of kies? Bij Omnia Dental in Hoofddorp plaatsen we tandimplantaten in eigen huis, van scan tot definitieve kroon, zonder doorverwijzing.',
      en: 'Missing a tooth? At Omnia Dental in Hoofddorp we place dental implants in house, from scan to final crown, without any referral elsewhere.',
    },
  },
  {
    key: 'cerec',
    slug: { nl: 'cerec', en: 'cerec' },
    category: 'herstel',
    order: 6,
    image: '/images/treatments/cerec.webp',
    imageAlt: {
      nl: 'Illustratie van een digitaal ontworpen CEREC-kroon op een kies',
      en: 'Illustration of a digitally designed CEREC crown on a molar',
    },
    imageKind: 'illustration',
    name: { nl: 'CEREC', en: 'CEREC' },
    tagline: {
      nl: 'Een kroon of inlay in één afspraak, zonder afdruk en zonder noodkroon.',
      en: 'A crown or inlay in a single visit, no impression and no temporary.',
    },
    intro: {
      nl: 'Met CEREC maken we een kroon of inlay terwijl u in de stoel zit. We scannen de tand digitaal, ontwerpen het herstel op de computer en frezen het ter plekke uit een keramisch blokje.',
      en: 'With CEREC we make a crown or inlay while you sit in the chair. We scan the tooth digitally, design the restoration on screen and mill it on site from a ceramic block.',
    },
    what: {
      nl: 'CEREC staat voor digitaal ontworpen keramiek dat in onze eigen praktijk wordt gefreesd. In plaats van een hap-afdruk met pasta maken we een 3D-scan van uw tand. Daarmee ontwerpen we een kroon of inlay die precies aansluit, en onze freesmachine maakt deze in korte tijd.\n\nDoordat alles in één afspraak gebeurt, is er geen tijdelijke noodkroon en geen tweede bezoek nodig. Het keramiek heeft de kleur van uw eigen tanden, zodat het herstel nauwelijks opvalt.',
      en: 'CEREC stands for digitally designed ceramic that is milled in our own practice. Instead of a paste impression we make a 3D scan of your tooth. With that we design a crown or inlay that fits exactly, and our milling machine produces it in a short time.\n\nBecause everything happens in one appointment, there is no temporary crown and no second visit needed. The ceramic matches the colour of your own teeth, so the restoration is barely noticeable.',
    },
    forWhom: {
      nl: 'CEREC is geschikt wanneer een tand of kies te veel beschadigd is voor een gewone vulling, bijvoorbeeld na een grote oude vulling, een breuk of een wortelkanaalbehandeling. Wilt u liever niet twee keer langskomen en geen afdrukmateriaal in uw mond? Dan is dit vaak een prettige oplossing.',
      en: 'CEREC is suitable when a tooth is too damaged for an ordinary filling, for example after a large old filling, a fracture or a root canal treatment. If you would rather not come twice and dislike impression material in your mouth, this is often a pleasant solution.',
    },
    steps: [
      {
        title: { nl: 'Voorbereiden van de tand', en: 'Preparing the tooth' },
        body: {
          nl: 'Onder verdoving verwijderen we het beschadigde deel en maken we de tand klaar voor het keramische herstel.',
          en: 'Under anaesthetic we remove the damaged part and prepare the tooth for the ceramic restoration.',
        },
      },
      {
        title: { nl: 'Digitale 3D-scan', en: 'Digital 3D scan' },
        body: {
          nl: 'We scannen de tand met een kleine camera. Geen afdrukpasta, geen vieze smaak en geen kokhalsgevoel.',
          en: 'We scan the tooth with a small camera. No impression paste, no unpleasant taste and no gagging.',
        },
      },
      {
        title: { nl: 'Ontwerpen en frezen', en: 'Designing and milling' },
        body: {
          nl: 'Op de computer ontwerpen we de kroon of inlay precies passend. De freesmachine in onze praktijk maakt het herstel terwijl u wacht.',
          en: 'On the computer we design the crown or inlay to fit precisely. The milling machine in our practice produces the restoration while you wait.',
        },
      },
      {
        title: { nl: 'Plaatsen en controleren', en: 'Placing and checking' },
        body: {
          nl: 'We lijmen het keramiek vast, controleren uw beet en polijsten het herstel zodat het comfortabel aanvoelt.',
          en: 'We bond the ceramic in place, check your bite and polish the restoration so it feels comfortable.',
        },
      },
    ],
    benefits: [
      { nl: 'Klaar in één afspraak', en: 'Finished in a single appointment' },
      { nl: 'Geen tijdelijke noodkroon en geen tweede bezoek', en: 'No temporary crown and no second visit' },
      { nl: 'Digitale scan in plaats van een afdruk met pasta', en: 'A digital scan instead of a paste impression' },
      { nl: 'Keramiek in de kleur van uw eigen tanden', en: 'Ceramic in the colour of your own teeth' },
    ],
    faq: [
      {
        q: { nl: 'Is een CEREC-kroon net zo sterk als een gewone kroon?', en: 'Is a CEREC crown as strong as a regular crown?' },
        a: {
          nl: 'Ja. Het keramiek dat we gebruiken is sterk en slijtvast en is goed bestand tegen dagelijks kauwen. De pasvorm is door het digitale ontwerp bovendien heel nauwkeurig.',
          en: 'Yes. The ceramic we use is strong and wear-resistant and copes well with daily chewing. Thanks to the digital design the fit is also very precise.',
        },
      },
      {
        q: { nl: 'Hoelang duurt zo een afspraak?', en: 'How long does such an appointment take?' },
        a: {
          nl: 'Reken op ongeveer anderhalf tot twee uur, inclusief het ontwerpen en frezen. U gaat dezelfde dag met een definitief herstel naar huis.',
          en: 'Expect around one and a half to two hours, including designing and milling. You go home the same day with a final restoration.',
        },
      },
      {
        q: { nl: 'Krijg ik nog een tijdelijke kroon?', en: 'Do I still get a temporary crown?' },
        a: {
          nl: 'Nee, dat is juist het voordeel van CEREC. Omdat we de kroon meteen maken, is er geen tussenperiode met een kwetsbare noodkroon.',
          en: 'No, that is exactly the advantage of CEREC. Because we make the crown straight away, there is no in-between period with a fragile temporary.',
        },
      },
    ],
    duration: {
      nl: 'Eén afspraak van ongeveer twee uur',
      en: 'One appointment of about two hours',
    },
    metaTitle: {
      nl: 'CEREC kroon in één dag in Hoofddorp | Omnia Dental',
      en: 'CEREC crown in one day in Hoofddorp | Omnia Dental',
    },
    metaDescription: {
      nl: 'Bij Omnia Dental in Hoofddorp maken we met CEREC een keramische kroon of inlay in één afspraak. Een digitale scan, geen afdruk en geen tijdelijke noodkroon.',
      en: 'At Omnia Dental in Hoofddorp we use CEREC to make a ceramic crown or inlay in one visit. A digital scan, no impression and no temporary crown.',
    },
  },
  {
    key: 'wortelkanaalbehandeling',
    slug: { nl: 'wortelkanaalbehandeling', en: 'root-canal-treatment' },
    category: 'herstel',
    order: 8,
    image: '/images/treatments/wortelkanaalbehandeling.webp',
    imageAlt: {
      nl: 'Illustratie van een wortelkanaalbehandeling in een doorsnede van een kies',
      en: 'Illustration of a root canal treatment in a cross-section of a molar',
    },
    imageKind: 'illustration',
    name: { nl: 'Wortelkanaalbehandeling', en: 'Root canal treatment' },
    tagline: {
      nl: 'Een ontstoken tandzenuw behandelen zodat u uw eigen tand behoudt.',
      en: 'Treating an inflamed tooth nerve so you keep your own tooth.',
    },
    intro: {
      nl: 'Bij een wortelkanaalbehandeling verwijderen we de ontstoken of afgestorven zenuw uit de wortelkanalen van een tand. Zo nemen we de pijn weg en blijft uw eigen tand behouden.',
      en: 'During a root canal treatment we remove the inflamed or dead nerve from the root canals of a tooth. This takes away the pain and lets you keep your own tooth.',
    },
    what: {
      nl: 'Diep in elke tand lopen smalle kanalen met zenuw- en bloedweefsel. Als dit weefsel ontstoken raakt, bijvoorbeeld door een diep gaatje of een breuk, kan dat veel pijn geven en een abces veroorzaken. Tijdens de behandeling reinigen en desinfecteren we de kanalen zorgvuldig en vullen we ze daarna luchtdicht af.\n\nVeel mensen verbinden een wortelkanaalbehandeling met pijn, maar dankzij goede verdoving verloopt de behandeling zo comfortabel mogelijk. Wij nemen de tijd en leggen elke stap rustig uit.',
      en: 'Deep inside every tooth run narrow canals with nerve and blood tissue. When this tissue becomes inflamed, for example through deep decay or a fracture, it can cause a lot of pain and an abscess. During the treatment we clean and disinfect the canals carefully and then seal them airtight.\n\nMany people associate a root canal with pain, but thanks to good anaesthetic the treatment is as comfortable as possible. We take our time and calmly explain each step.',
    },
    forWhom: {
      nl: 'Een wortelkanaalbehandeling is nodig als de zenuw van een tand ontstoken of afgestorven is. Klachten zijn vaak aanhoudende kiespijn, gevoeligheid voor warmte of een dikke wang. Door op tijd te behandelen, voorkomen we meestal dat de tand getrokken moet worden.',
      en: 'A root canal treatment is needed when the nerve of a tooth is inflamed or has died. Common signs are persistent toothache, sensitivity to heat or a swollen cheek. By treating in time we usually prevent the tooth from having to be removed.',
    },
    steps: [
      {
        title: { nl: 'Verdoving en onderzoek', en: 'Anaesthetic and assessment' },
        body: {
          nl: 'We verdoven de tand goed en maken zo nodig een röntgenfoto om de wortelkanalen in beeld te brengen.',
          en: 'We anaesthetise the tooth thoroughly and, if needed, take an x-ray to map the root canals.',
        },
      },
      {
        title: { nl: 'Reinigen van de kanalen', en: 'Cleaning the canals' },
        body: {
          nl: 'We verwijderen het ontstoken weefsel en reinigen en desinfecteren de kanalen tot diep in de wortel.',
          en: 'We remove the inflamed tissue and clean and disinfect the canals deep into the root.',
        },
      },
      {
        title: { nl: 'Afvullen van de wortel', en: 'Filling the root' },
        body: {
          nl: 'De schone kanalen vullen we luchtdicht op, zodat er geen bacteriën meer in kunnen komen.',
          en: 'We fill the clean canals airtight, so no bacteria can get back in.',
        },
      },
      {
        title: { nl: 'Afsluiten of kroon', en: 'Sealing or crown' },
        body: {
          nl: 'We sluiten de tand af met een stevige vulling. Soms is later een kroon nodig om de tand extra te beschermen.',
          en: 'We close the tooth with a sturdy filling. Sometimes a crown is needed later to give the tooth extra protection.',
        },
      },
    ],
    benefits: [
      { nl: 'U behoudt uw eigen tand in plaats van hem te verliezen', en: 'You keep your own tooth instead of losing it' },
      { nl: 'De pijn en ontsteking worden weggenomen', en: 'The pain and inflammation are removed' },
      { nl: 'De behandeling gebeurt onder goede verdoving', en: 'The treatment is carried out under good anaesthetic' },
      { nl: 'In eigen huis behandeld, zonder doorverwijzing', en: 'Treated in house, without a referral elsewhere' },
    ],
    faq: [
      {
        q: { nl: 'Is een wortelkanaalbehandeling pijnlijk?', en: 'Is a root canal treatment painful?' },
        a: {
          nl: 'Door de verdoving voelt u tijdens de behandeling vrijwel niets. De ingreep neemt juist de pijn weg die de ontsteking veroorzaakte. Na afloop kan de tand een paar dagen gevoelig zijn.',
          en: 'Thanks to the anaesthetic you feel almost nothing during the treatment. The procedure actually removes the pain that the inflammation caused. Afterwards the tooth can be tender for a few days.',
        },
      },
      {
        q: { nl: 'Zijn er meerdere afspraken nodig?', en: 'Are multiple appointments needed?' },
        a: {
          nl: 'Dat hangt af van de tand en het aantal kanalen. Soms ronden we het in één afspraak af, soms zijn er twee nodig. We bespreken dit vooraf met u.',
          en: 'That depends on the tooth and the number of canals. Sometimes we finish in one appointment, sometimes two are needed. We discuss this with you beforehand.',
        },
      },
      {
        q: { nl: 'Blijft de tand sterk genoeg?', en: 'Does the tooth stay strong enough?' },
        a: {
          nl: 'Een behandelde tand kan wat brozer worden. Daarom adviseren we soms een kroon, zodat de tand goed beschermd is en u er weer normaal op kunt kauwen.',
          en: 'A treated tooth can become a little more brittle. That is why we sometimes advise a crown, so the tooth is well protected and you can chew on it normally again.',
        },
      },
    ],
    duration: {
      nl: 'Eén of twee afspraken',
      en: 'One or two appointments',
    },
    metaTitle: {
      nl: 'Wortelkanaalbehandeling in Hoofddorp | Omnia Dental',
      en: 'Root canal treatment in Hoofddorp | Omnia Dental',
    },
    metaDescription: {
      nl: 'Kiespijn of een ontstoken zenuw? Bij Omnia Dental in Hoofddorp behandelen we wortelkanalen onder goede verdoving, zodat u uw eigen tand behoudt.',
      en: 'Toothache or an inflamed nerve? At Omnia Dental in Hoofddorp we treat root canals under good anaesthetic, so you keep your own tooth.',
    },
  },
  {
    key: 'verstandskies-trekken',
    slug: { nl: 'verstandskies-trekken', en: 'wisdom-tooth-removal' },
    category: 'comfort',
    order: 9,
    image: '/images/treatments/verstandskies-trekken.webp',
    imageAlt: {
      nl: 'Illustratie van een verstandskies achterin de onderkaak',
      en: 'Illustration of a wisdom tooth at the back of the lower jaw',
    },
    imageKind: 'illustration',
    name: { nl: 'Verstandskies trekken', en: 'Wisdom tooth removal' },
    tagline: {
      nl: 'Een lastige verstandskies veilig verwijderen, in onze eigen praktijk.',
      en: 'Safely removing a troublesome wisdom tooth, in our own practice.',
    },
    intro: {
      nl: 'Verstandskiezen komen vaak scheef of maar half door en kunnen dan klachten geven. Wanneer dat nodig is, verwijderen we ze bij Omnia Dental zelf, zodat u niet naar een aparte kaakchirurg hoeft.',
      en: 'Wisdom teeth often come through at an angle or only partly, and can then cause problems. When removal is needed, we do it ourselves at Omnia Dental, so you do not have to go to a separate oral surgeon.',
    },
    what: {
      nl: 'De verstandskiezen zijn de laatste kiezen achterin de mond. Omdat daar weinig ruimte is, blijven ze soms vastzitten in het bot of komen ze scheef door. Dat kan ontstekingen, pijn of problemen met de buurkies veroorzaken. In zulke gevallen is het verwijderen van de kies de beste oplossing.\n\nVeel verstandskiezen kunnen we in onze eigen praktijk trekken, onder lokale verdoving. We beoordelen vooraf met een röntgenfoto hoe de kies en de zenuwen liggen, zodat de behandeling veilig en voorspelbaar verloopt.',
      en: 'Wisdom teeth are the last molars at the back of the mouth. Because there is little room there, they sometimes stay stuck in the bone or come through at an angle. That can cause inflammation, pain or problems with the neighbouring molar. In such cases removing the tooth is the best solution.\n\nMany wisdom teeth can be removed in our own practice, under local anaesthetic. We assess the position of the tooth and the nerves with an x-ray beforehand, so the treatment is safe and predictable.',
    },
    forWhom: {
      nl: 'Het trekken van een verstandskies is zinvol bij terugkerende ontstekingen van het tandvlees eromheen, bij pijn of druk, of wanneer de kies de rest van uw gebit in de weg zit. Soms adviseren we het juist preventief. Bij sommige kiezen die diep liggen, kan een verwijzing naar de kaakchirurg verstandiger zijn. Dat bespreken we altijd eerlijk met u.',
      en: 'Removing a wisdom tooth makes sense with recurring inflammation of the surrounding gum, with pain or pressure, or when the tooth is in the way of the rest of your teeth. Sometimes we advise it as a preventive measure. For some teeth that lie deep, a referral to the oral surgeon may be wiser. We always discuss that honestly with you.',
    },
    steps: [
      {
        title: { nl: 'Beoordeling en röntgenfoto', en: 'Assessment and x-ray' },
        body: {
          nl: 'We bekijken de kies en maken een röntgenfoto om de wortels en de ligging ten opzichte van zenuwen te beoordelen.',
          en: 'We look at the tooth and take an x-ray to assess the roots and their position relative to the nerves.',
        },
      },
      {
        title: { nl: 'Verdoving', en: 'Anaesthetic' },
        body: {
          nl: 'We verdoven het gebied goed, zodat u tijdens het verwijderen geen pijn voelt, alleen wat druk.',
          en: 'We anaesthetise the area well, so you feel no pain during the removal, only some pressure.',
        },
      },
      {
        title: { nl: 'Verwijderen van de kies', en: 'Removing the tooth' },
        body: {
          nl: 'We verwijderen de verstandskies rustig en gecontroleerd. Indien nodig hechten we het tandvlees met oplosbare hechtingen.',
          en: 'We remove the wisdom tooth calmly and in a controlled way. If needed we close the gum with dissolvable stitches.',
        },
      },
      {
        title: { nl: 'Nazorg', en: 'Aftercare' },
        body: {
          nl: 'U krijgt duidelijke leefregels mee voor de eerste dagen, zodat de wond goed en rustig geneest.',
          en: 'You receive clear guidance for the first days, so the wound heals well and calmly.',
        },
      },
    ],
    benefits: [
      { nl: 'Vaak te verwijderen in onze eigen praktijk', en: 'Often removable in our own practice' },
      { nl: 'Vooraf zorgvuldig in beeld gebracht met een röntgenfoto', en: 'Carefully mapped in advance with an x-ray' },
      { nl: 'Onder goede verdoving, zo comfortabel mogelijk', en: 'Under good anaesthetic, as comfortable as possible' },
      { nl: 'Eerlijk advies of behandeling hier kan of beter elders gebeurt', en: 'Honest advice on whether treatment fits here or is better done elsewhere' },
    ],
    faq: [
      {
        q: { nl: 'Moet elke verstandskies eruit?', en: 'Does every wisdom tooth have to come out?' },
        a: {
          nl: 'Nee. Een verstandskies die goed staat en geen klachten geeft, kan gewoon blijven zitten. We verwijderen alleen als daar een duidelijke reden voor is.',
          en: 'No. A wisdom tooth that sits well and causes no trouble can simply stay. We only remove it when there is a clear reason to.',
        },
      },
      {
        q: { nl: 'Hoe lang duurt het herstel?', en: 'How long does recovery take?' },
        a: {
          nl: 'De eerste dagen kan het gebied wat gezwollen en gevoelig zijn. Bij de meeste mensen neemt dat binnen ongeveer een week af. U krijgt heldere instructies mee.',
          en: 'The first days the area can be a little swollen and tender. For most people this settles within about a week. You receive clear instructions to take home.',
        },
      },
      {
        q: { nl: 'Voel ik er iets van tijdens de behandeling?', en: 'Will I feel anything during the treatment?' },
        a: {
          nl: 'Door de verdoving voelt u geen pijn, hooguit wat druk en beweging. Bent u zenuwachtig, dan nemen we extra tijd en leggen we alles stap voor stap uit.',
          en: 'Thanks to the anaesthetic you feel no pain, at most some pressure and movement. If you are nervous, we take extra time and explain everything step by step.',
        },
      },
    ],
    duration: {
      nl: 'Eén afspraak, meestal 30 tot 45 minuten',
      en: 'One appointment, usually 30 to 45 minutes',
    },
    metaTitle: {
      nl: 'Verstandskies trekken in Hoofddorp | Omnia Dental',
      en: 'Wisdom tooth removal in Hoofddorp | Omnia Dental',
    },
    metaDescription: {
      nl: 'Last van een verstandskies? Bij Omnia Dental in Hoofddorp verwijderen we verstandskiezen vaak in eigen huis, onder verdoving en zo comfortabel mogelijk.',
      en: 'Trouble with a wisdom tooth? At Omnia Dental in Hoofddorp we often remove wisdom teeth in house, under anaesthetic and as comfortably as possible.',
    },
  },
  {
    key: 'kunstgebit',
    slug: { nl: 'kunstgebit', en: 'dentures' },
    category: 'vervanging',
    order: 10,
    image: '/images/treatments/kunstgebit.webp',
    imageAlt: {
      nl: 'Illustratie van een volledig kunstgebit',
      en: 'Illustration of a full denture',
    },
    imageKind: 'illustration',
    name: { nl: 'Kunstgebit', en: 'Dentures' },
    tagline: {
      nl: 'Een volledige prothese of een klikgebit op implantaten dat houvast geeft.',
      en: 'A full denture or an implant-supported click denture that gives grip.',
    },
    intro: {
      nl: 'Als u veel of alle tanden mist, geeft een kunstgebit uw glimlach en kauwfunctie terug. We maken zowel een volledige prothese als een klikgebit dat stevig vastklikt op implantaten.',
      en: 'If you are missing many or all of your teeth, a denture gives back your smile and chewing function. We make both a full denture and a click denture that fastens firmly onto implants.',
    },
    what: {
      nl: 'Een volledige prothese, in de volksmond een kunstgebit, vervangt alle tanden in de boven- of onderkaak. De prothese rust op het tandvlees en is op maat gemaakt voor uw mond. Voor veel mensen werkt dit prima, al kan de onderprothese soms wat losser zitten.\n\nWilt u meer houvast, dan is een klikgebit een goede optie. Daarbij plaatsen we enkele implantaten waarop het kunstgebit vastklikt. Het zit dan veel steviger, zodat u met meer zelfvertrouwen kunt eten en praten. We bespreken samen welke oplossing het beste bij uw situatie en wensen past.',
      en: 'A full denture replaces all the teeth in the upper or lower jaw. The denture rests on the gum and is made to measure for your mouth. For many people this works well, although the lower denture can sometimes sit a little loose.\n\nIf you want more grip, a click denture is a good option. For this we place a few implants onto which the denture fastens. It then sits much more firmly, so you can eat and talk with more confidence. Together we discuss which solution suits your situation and wishes best.',
    },
    forWhom: {
      nl: 'Een kunstgebit is bedoeld voor mensen die veel of al hun tanden missen, of bij wie de eigen tanden niet meer te behouden zijn. Heeft u al een prothese die los zit of klachten geeft, dan kijken we of een nieuwe prothese of een klikgebit op implantaten uitkomst biedt.',
      en: 'A denture is intended for people who are missing many or all of their teeth, or whose own teeth can no longer be kept. If you already have a denture that sits loose or causes discomfort, we look at whether a new denture or an implant-supported click denture is the answer.',
    },
    steps: [
      {
        title: { nl: 'Kennismaking en advies', en: 'Introduction and advice' },
        body: {
          nl: 'We bekijken uw mond en bespreken welke vorm van kunstgebit het beste past, een gewone prothese of een klikgebit.',
          en: 'We look at your mouth and discuss which kind of denture suits best, a regular denture or a click denture.',
        },
      },
      {
        title: { nl: 'Afdrukken en pasvorm', en: 'Impressions and fit' },
        body: {
          nl: 'We nemen nauwkeurige afdrukken en bepalen de juiste kleur en stand van de tanden, zodat het natuurlijk oogt.',
          en: 'We take precise impressions and determine the right colour and position of the teeth, so it looks natural.',
        },
      },
      {
        title: { nl: 'Passen en bijstellen', en: 'Fitting and adjusting' },
        body: {
          nl: 'U past de prothese en wij stellen hem bij tot hij comfortabel zit en uw beet goed is.',
          en: 'You try the denture and we adjust it until it sits comfortably and your bite is right.',
        },
      },
      {
        title: { nl: 'Plaatsen en nazorg', en: 'Placing and aftercare' },
        body: {
          nl: 'Bij een klikgebit plaatsen we eerst de implantaten. Daarna leveren we het kunstgebit en leggen we het onderhoud rustig uit.',
          en: 'For a click denture we first place the implants. Then we fit the denture and calmly explain how to care for it.',
        },
      },
    ],
    benefits: [
      { nl: 'Geeft uw glimlach en kauwfunctie terug', en: 'Restores your smile and chewing function' },
      { nl: 'Op maat gemaakt voor een natuurlijk uiterlijk', en: 'Made to measure for a natural appearance' },
      { nl: 'Een klikgebit op implantaten zit stevig en glijdt niet weg', en: 'A click denture on implants sits firmly and does not slip' },
      { nl: 'Prothese en implantaten in eigen huis, zonder doorverwijzing', en: 'Denture and implants in house, without a referral elsewhere' },
    ],
    faq: [
      {
        q: { nl: 'Wat is het verschil tussen een gewoon kunstgebit en een klikgebit?', en: 'What is the difference between a regular denture and a click denture?' },
        a: {
          nl: 'Een gewoon kunstgebit rust op het tandvlees. Een klikgebit klikt vast op implantaten en zit daardoor veel steviger, vooral in de onderkaak.',
          en: 'A regular denture rests on the gum. A click denture fastens onto implants and therefore sits much more firmly, especially in the lower jaw.',
        },
      },
      {
        q: { nl: 'Moet ik even wennen aan een nieuw kunstgebit?', en: 'Will I need to get used to a new denture?' },
        a: {
          nl: 'Ja, een wenperiode is normaal. Eten en praten voelen de eerste weken even anders. We stellen de prothese tijdens controles bij tot hij prettig zit.',
          en: 'Yes, a settling-in period is normal. Eating and talking feel a little different the first weeks. We adjust the denture during check-ups until it feels comfortable.',
        },
      },
      {
        q: { nl: 'Hoe onderhoud ik mijn kunstgebit?', en: 'How do I look after my denture?' },
        a: {
          nl: 'U maakt het kunstgebit dagelijks schoon en houdt ook het tandvlees of de implantaten goed schoon. We laten u precies zien hoe dat het handigst gaat.',
          en: 'You clean the denture daily and keep the gum or the implants clean as well. We show you exactly how to do this most easily.',
        },
      },
    ],
    duration: {
      nl: 'Meerdere afspraken, afhankelijk van het type',
      en: 'Several appointments, depending on the type',
    },
    metaTitle: {
      nl: 'Kunstgebit en klikgebit in Hoofddorp | Omnia Dental',
      en: 'Dentures and click dentures in Hoofddorp | Omnia Dental',
    },
    metaDescription: {
      nl: 'Bij Omnia Dental in Hoofddorp maken we een volledig kunstgebit of een klikgebit op implantaten. Op maat, met meer houvast en zonder doorverwijzing.',
      en: 'At Omnia Dental in Hoofddorp we make a full denture or an implant-supported click denture. Made to measure, with more grip and without a referral.',
    },
  },
  {
    key: 'angst-voor-de-tandarts',
    slug: { nl: 'angst-voor-de-tandarts', en: 'dental-anxiety' },
    category: 'comfort',
    order: 12,
    image: '/images/treatments/angst-voor-de-tandarts.webp',
    imageAlt: {
      nl: 'Een patiënt die rustig en op zijn gemak in de behandelstoel zit',
      en: 'A patient sitting calmly and at ease in the treatment chair',
    },
    imageKind: 'photo',
    name: { nl: 'Angst voor de tandarts', en: 'Dental anxiety' },
    tagline: {
      nl: 'Rustig, op uw tempo en zonder oordeel, ook als de drempel hoog is.',
      en: 'Calm, at your own pace and without judgement, even when the step feels big.',
    },
    intro: {
      nl: 'Veel mensen zien op tegen een bezoek aan de tandarts. Bij Omnia Dental nemen we daar de tijd voor. We werken op uw tempo, leggen alles rustig uit en behandelen pas als u er klaar voor bent.',
      en: 'Many people dread a visit to the dentist. At Omnia Dental we take the time for this. We work at your pace, explain everything calmly and only treat when you are ready.',
    },
    what: {
      nl: 'Angst voor de tandarts komt veel vaker voor dan u denkt, en u hoeft zich er nooit voor te schamen. Soms komt het door een vervelende ervaring vroeger, soms door de geluiden, de geur of het gevoel van controleverlies. Wat de reden ook is, wij gaan er rustig en zonder oordeel mee om.\n\nWe beginnen vaak met alleen een gesprek en een kennismaking, zonder dat er meteen iets hoeft te gebeuren. Samen spreken we een stopsignaal af, bijvoorbeeld uw hand opsteken, zodat u altijd zelf de controle houdt. Stap voor stap bouwen we vertrouwen op, in een tempo dat bij u past.',
      en: 'Fear of the dentist is far more common than you might think, and you never need to feel ashamed of it. Sometimes it comes from an unpleasant experience in the past, sometimes from the sounds, the smell or the feeling of losing control. Whatever the reason, we deal with it calmly and without judgement.\n\nWe often begin with just a conversation and getting to know each other, without anything having to happen straight away. Together we agree on a stop signal, for example raising your hand, so you always keep control yourself. Step by step we build trust, at a pace that suits you.',
    },
    forWhom: {
      nl: 'Deze aanpak is er voor iedereen die opziet tegen de tandarts, van lichte spanning tot zo veel angst dat een bezoek jarenlang is uitgesteld. Of u nu voor een controle komt of een grotere behandeling nodig heeft, we zoeken samen een manier waarop u zich op uw gemak voelt.',
      en: 'This approach is for anyone who dreads the dentist, from mild tension to so much fear that a visit has been put off for years. Whether you come for a check-up or need a larger treatment, we find a way together in which you feel at ease.',
    },
    steps: [
      {
        title: { nl: 'Rustig kennismaken', en: 'A calm introduction' },
        body: {
          nl: 'We beginnen met een gesprek, zonder dat er meteen iets in uw mond hoeft te gebeuren. U vertelt wat u spannend vindt.',
          en: 'We start with a conversation, without anything having to happen in your mouth straight away. You tell us what you find difficult.',
        },
      },
      {
        title: { nl: 'Een stopsignaal afspreken', en: 'Agreeing on a stop signal' },
        body: {
          nl: 'We spreken een duidelijk signaal af waarmee u op elk moment kunt pauzeren. Zo houdt u zelf de controle.',
          en: 'We agree on a clear signal you can use to pause at any moment. That way you keep control yourself.',
        },
      },
      {
        title: { nl: 'Stap voor stap', en: 'Step by step' },
        body: {
          nl: 'We bouwen de behandeling rustig op en leggen elke stap uit voordat we hem doen. Niets gebeurt onverwacht.',
          en: 'We build up the treatment calmly and explain each step before we take it. Nothing happens unexpectedly.',
        },
      },
      {
        title: { nl: 'Vertrouwen opbouwen', en: 'Building trust' },
        body: {
          nl: 'Met elk bezoek wordt de drempel lager. Veel patiënten merken dat de tandarts minder eng is dan gedacht.',
          en: 'With every visit the threshold gets lower. Many patients notice that the dentist is less frightening than they expected.',
        },
      },
    ],
    benefits: [
      { nl: 'Ruim de tijd, zonder gehaast gevoel', en: 'Plenty of time, with no rushed feeling' },
      { nl: 'Een afgesproken signaal om altijd te kunnen pauzeren', en: 'An agreed signal so you can always pause' },
      { nl: 'Rustige uitleg bij elke stap, geen verrassingen', en: 'Calm explanation at every step, no surprises' },
      { nl: 'Een team dat met begrip en zonder oordeel met u meedenkt', en: 'A team that thinks along with understanding and without judgement' },
    ],
    faq: [
      {
        q: { nl: 'Ik ben jaren niet geweest. Krijg ik commentaar?', en: 'I have not been for years. Will I be judged?' },
        a: {
          nl: 'Nee. We oordelen niet over hoe lang het geleden is. We zijn juist blij dat u de stap zet en kijken alleen vooruit, samen met u.',
          en: 'No. We do not judge how long it has been. We are glad you are taking the step and only look ahead, together with you.',
        },
      },
      {
        q: { nl: 'Kan ik stoppen als het te veel wordt?', en: 'Can I stop if it gets too much?' },
        a: {
          nl: 'Altijd. We spreken vooraf een signaal af waarmee u de behandeling direct pauzeert. U houdt op elk moment zelf de regie.',
          en: 'Always. We agree on a signal beforehand with which you pause the treatment immediately. You stay in charge at every moment.',
        },
      },
      {
        q: { nl: 'Wat als alleen al de afspraak maken spannend is?', en: 'What if even making the appointment feels daunting?' },
        a: {
          nl: 'Laat het ons gerust weten bij het maken van de afspraak. We kunnen starten met alleen een kennismaking, zodat u de praktijk eerst rustig leert kennen.',
          en: 'Feel free to let us know when you make the appointment. We can start with just an introduction, so you first get to know the practice calmly.',
        },
      },
    ],
    metaTitle: {
      nl: 'Angst voor de tandarts in Hoofddorp | Omnia Dental',
      en: 'Dental anxiety in Hoofddorp | Omnia Dental',
    },
    metaDescription: {
      nl: 'Bang voor de tandarts? Bij Omnia Dental in Hoofddorp werken we rustig, op uw tempo en zonder oordeel, met een stopsignaal zodat u zelf de controle houdt.',
      en: 'Afraid of the dentist? At Omnia Dental in Hoofddorp we work calmly, at your pace and without judgement, with a stop signal so you stay in control.',
    },
  },
];
