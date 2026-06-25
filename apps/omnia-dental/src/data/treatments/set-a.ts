import type { Treatment } from '../types';

export const setA: Treatment[] = [
  {
    key: 'periodieke-controle',
    slug: { nl: 'periodieke-controle', en: 'dental-check-up' },
    category: 'preventief',
    order: 1,
    image: '/images/treatments/periodieke-controle.webp',
    imageAlt: {
      nl: 'Tandarts onderzoekt het gebit van een patiënt tijdens een periodieke controle.',
      en: 'Dentist examining a patient during a routine check-up.',
    },
    imageKind: 'photo',
    name: { nl: 'Periodieke controle', en: 'Routine check-up' },
    tagline: {
      nl: 'Rustig en grondig je gebit laten nakijken, voordat klachten ontstaan.',
      en: 'A calm, thorough look at your teeth before problems start.',
    },
    intro: {
      nl: 'Een periodieke controle is de basis van een gezond gebit. We kijken rustig en grondig naar je tanden, tandvlees en mond, zodat we kleine dingen opmerken voordat ze uitgroeien tot een echte klacht.',
      en: 'A routine check-up is the foundation of a healthy mouth. We take a calm, thorough look at your teeth, gums and soft tissue so we notice small things long before they turn into real complaints.',
    },
    what: {
      nl: 'Tijdens de controle bekijken we al je tanden en kiezen, het tandvlees en de rest van je mond. We controleren bestaande vullingen en kronen, kijken of er gaatjes ontstaan en letten op slijtage of beginnende ontstekingen. Waar nodig maken we een röntgenfoto om ook tussen de kiezen en onder het tandvlees te kunnen kijken.\n\nNa het onderzoek bespreken we wat we zien. Is alles in orde, dan plannen we gewoon de volgende controle. Is er iets gevonden, dan leggen we rustig uit wat er aan de hand is en welke mogelijkheden er zijn. Omdat we alle behandelingen zelf in huis doen, kun je een vervolg vaak bij ons blijven plannen.',
      en: 'During the check-up we look at every tooth, your gums and the rest of your mouth. We inspect existing fillings and crowns, check for cavities and watch for wear or early signs of inflammation. When needed we take an X-ray so we can also see between the teeth and beneath the gum line.\n\nAfterwards we talk through what we found. If everything is fine, we simply schedule your next visit. If something needs attention, we explain calmly what it is and what the options are. Because we carry out every treatment in house, any follow-up can usually stay with us.',
    },
    forWhom: {
      nl: 'Een periodieke controle is er voor iedereen, juist ook als je nergens last van hebt. De meeste tandproblemen doen in het begin geen pijn, dus regelmatig laten kijken voorkomt dat een klein gaatje een grote behandeling wordt. Hoe vaak je op controle komt, stemmen we af op jouw gebit en risico.',
      en: 'A routine check-up is for everyone, especially when nothing hurts. Most dental problems are painless at the start, so regular check-ups stop a small cavity from becoming a large treatment. How often you come in is something we tailor to your mouth and your personal risk.',
    },
    steps: [
      {
        title: { nl: 'Even bijpraten', en: 'A short catch-up' },
        body: {
          nl: 'We vragen hoe het met je gaat en of je iets bent opgevallen, zoals gevoelige plekken of bloedend tandvlees.',
          en: 'We ask how you are doing and whether you noticed anything, like sensitive spots or bleeding gums.',
        },
      },
      {
        title: { nl: 'Onderzoek van het gebit', en: 'Examining your teeth' },
        body: {
          nl: 'We bekijken tanden, kiezen en tandvlees zorgvuldig en controleren bestaande vullingen en kronen.',
          en: 'We carefully inspect your teeth and gums and check existing fillings and crowns.',
        },
      },
      {
        title: { nl: 'Röntgenfoto indien nodig', en: 'X-ray when needed' },
        body: {
          nl: 'Soms maken we een foto om tussen de kiezen en onder het tandvlees te kunnen kijken.',
          en: 'Sometimes we take an image to see between the teeth and below the gum line.',
        },
      },
      {
        title: { nl: 'Uitleg en advies', en: 'Findings and advice' },
        body: {
          nl: 'We bespreken rustig wat we zien, geven poetsadvies en plannen de volgende controle of een vervolg.',
          en: 'We calmly go over what we found, give brushing advice and plan your next visit or any follow-up.',
        },
      },
    ],
    benefits: [
      { nl: 'Problemen worden vroeg gevonden, vaak voordat ze pijn doen.', en: 'Problems are caught early, often before they hurt.' },
      { nl: 'Kleine ingrepen blijven klein en betaalbaar.', en: 'Small treatments stay small and affordable.' },
      { nl: 'Persoonlijk poets- en preventieadvies voor jouw gebit.', en: 'Personal brushing and prevention advice for your mouth.' },
      { nl: 'Vervolgbehandelingen kunnen bij ons in huis plaatsvinden.', en: 'Any follow-up treatment can take place with us in house.' },
    ],
    faq: [
      {
        q: { nl: 'Hoe vaak moet ik op controle komen?', en: 'How often should I come for a check-up?' },
        a: {
          nl: 'Voor veel mensen is twee keer per jaar passend, maar dat hangt af van de gezondheid van je gebit. We bepalen samen een ritme dat bij jou past.',
          en: 'Two visits a year suits many people, but it depends on the health of your mouth. We agree on a rhythm that fits you.',
        },
      },
      {
        q: { nl: 'Doet een controle pijn?', en: 'Does a check-up hurt?' },
        a: {
          nl: 'Een controle is een rustig onderzoek en doet normaal gesproken geen pijn. Heb je gevoelige plekken, geef het aan, dan houden we daar rekening mee.',
          en: 'A check-up is a calm examination and is normally painless. If you have sensitive areas, let us know and we take that into account.',
        },
      },
      {
        q: { nl: 'Wordt de controle vergoed?', en: 'Is the check-up reimbursed?' },
        a: {
          nl: 'Tandartskosten voor volwassenen vallen meestal onder de aanvullende verzekering. Voor kinderen tot achttien jaar valt de controle onder de basisverzekering.',
          en: 'For adults, dental costs usually fall under supplementary insurance. For children up to eighteen, check-ups are covered by basic insurance.',
        },
      },
    ],
    duration: { nl: 'Eén afspraak van ongeveer twintig minuten.', en: 'One appointment of around twenty minutes.' },
    metaTitle: { nl: 'Periodieke controle tandarts Hoofddorp | Omnia Dental', en: 'Routine dental check-up in Hoofddorp | Omnia Dental' },
    metaDescription: {
      nl: 'Periodieke controle bij Omnia Dental in Hoofddorp. Grondig onderzoek van tanden en tandvlees, zodat problemen vroeg worden gevonden. Maak een afspraak.',
      en: 'Routine dental check-up at Omnia Dental in Hoofddorp. A thorough look at teeth and gums so problems are found early. Book your appointment today.',
    },
  },
  {
    key: 'mondhygienist',
    slug: { nl: 'mondhygienist', en: 'dental-hygienist' },
    category: 'preventief',
    order: 2,
    image: '/images/treatments/mondhygienist.webp',
    imageAlt: {
      nl: 'Mondhygiënist reinigt het gebit van een patiënt en verwijdert tandsteen.',
      en: 'Dental hygienist cleaning a patient and removing tartar.',
    },
    imageKind: 'photo',
    name: { nl: 'Mondhygiënist', en: 'Dental hygienist' },
    tagline: {
      nl: 'Een professionele reiniging die je tandvlees gezond houdt.',
      en: 'A professional clean that keeps your gums healthy.',
    },
    intro: {
      nl: 'De mondhygiënist zorgt voor een diepe, professionele reiniging die je thuis met poetsen niet bereikt. Gezond tandvlees is de stille voorwaarde voor een gebit dat lang meegaat.',
      en: 'The dental hygienist gives your mouth a deep professional clean that brushing at home cannot reach. Healthy gums are the quiet condition for teeth that last.',
    },
    what: {
      nl: 'Tandplak en tandsteen hopen zich op plekken op waar een tandenborstel niet komt, vooral langs de rand van het tandvlees en tussen de tanden. Daar kan ontsteking ontstaan, met bloedend of terugtrekkend tandvlees als gevolg. De mondhygiënist verwijdert die aanslag zorgvuldig en poetst je gebit daarna glad, zodat plak zich minder snel opnieuw vasthecht.\n\nNet zo belangrijk is het advies dat je meekrijgt. We laten je zien welke plekken aandacht nodig hebben en hoe je thuis effectiever poetst en reinigt tussen de tanden. Zo houdt de behandeling ook na je bezoek effect.',
      en: 'Plaque and tartar build up where a toothbrush cannot reach, especially along the gum line and between the teeth. That is where inflammation starts, leading to bleeding or receding gums. The hygienist carefully removes this build-up and then polishes your teeth smooth, so plaque takes longer to settle again.\n\nThe advice you take home matters just as much. We show you which spots need attention and how to brush and clean between your teeth more effectively. That way the treatment keeps working long after your visit.',
    },
    forWhom: {
      nl: 'Een bezoek aan de mondhygiënist is zinvol als je tandvlees snel bloedt, als je gevoelig bent voor tandsteen of als de tandarts ontsteking heeft gezien. Ook als preventie is het waardevol, want gezond tandvlees voorkomt op de lange termijn tandverlies. Rokers en mensen met diabetes hebben er vaak extra baat bij.',
      en: 'A visit to the hygienist makes sense if your gums bleed easily, if you build up tartar quickly or if the dentist has noticed inflammation. It is also valuable as prevention, since healthy gums protect against tooth loss over time. Smokers and people with diabetes often benefit even more.',
    },
    steps: [
      {
        title: { nl: 'Beoordeling van het tandvlees', en: 'Assessing your gums' },
        body: {
          nl: 'We bekijken de conditie van je tandvlees en meten waar nodig de diepte van de tandvleesranden.',
          en: 'We assess the condition of your gums and, where needed, measure the depth of the gum pockets.',
        },
      },
      {
        title: { nl: 'Verwijderen van tandsteen en plak', en: 'Removing tartar and plaque' },
        body: {
          nl: 'Met fijne instrumenten verwijderen we aanslag boven en net onder de tandvleesrand, zo comfortabel mogelijk.',
          en: 'With fine instruments we remove build-up above and just below the gum line, as comfortably as possible.',
        },
      },
      {
        title: { nl: 'Polijsten', en: 'Polishing' },
        body: {
          nl: 'We poetsen je tanden glad, waardoor ze schoon aanvoelen en plak zich minder snel hecht.',
          en: 'We polish your teeth smooth, so they feel clean and plaque settles more slowly.',
        },
      },
      {
        title: { nl: 'Persoonlijk poetsadvies', en: 'Personal cleaning advice' },
        body: {
          nl: 'We bespreken welke plekken aandacht nodig hebben en welke ragers of borstel het best bij je passen.',
          en: 'We discuss which areas need attention and which interdental brushes or toothbrush suit you best.',
        },
      },
    ],
    benefits: [
      { nl: 'Gezonder tandvlees en minder bloeding bij het poetsen.', en: 'Healthier gums and less bleeding when you brush.' },
      { nl: 'Een frisse mond en een schoon, glad gevoel.', en: 'A fresh mouth and a clean, smooth feeling.' },
      { nl: 'Minder risico op tandvleesproblemen en tandverlies op termijn.', en: 'Lower risk of gum disease and tooth loss over time.' },
      { nl: 'Praktische tips om thuis beter te reinigen.', en: 'Practical tips to clean more effectively at home.' },
    ],
    faq: [
      {
        q: { nl: 'Doet de behandeling pijn?', en: 'Does the treatment hurt?' },
        a: {
          nl: 'De meeste mensen ervaren de reiniging als goed te doen. Bij gevoelig tandvlees kan het wat prikkelen. We werken rustig en houden rekening met je comfort.',
          en: 'Most people find the cleaning very manageable. With sensitive gums it can feel a little tender. We work calmly and keep your comfort in mind.',
        },
      },
      {
        q: { nl: 'Hoe vaak moet ik komen?', en: 'How often should I come?' },
        a: {
          nl: 'Dat verschilt per persoon. Voor sommigen volstaat één keer per jaar, anderen hebben meer baat bij twee of meer bezoeken. We adviseren je op basis van je tandvlees.',
          en: 'It varies. For some, once a year is enough, while others benefit from two or more visits. We advise you based on the state of your gums.',
        },
      },
      {
        q: { nl: 'Wordt mijn tandvlees gezonder door één behandeling?', en: 'Will one treatment make my gums healthier?' },
        a: {
          nl: 'Een reiniging geeft een goede start, maar het resultaat houd je vooral vast met goede mondverzorging thuis. Daarom besteden we veel aandacht aan advies.',
          en: 'A cleaning gives a good start, but you keep the result mainly through good care at home. That is why we put so much focus on advice.',
        },
      },
    ],
    duration: { nl: 'Eén afspraak van ongeveer dertig tot zestig minuten.', en: 'One appointment of around thirty to sixty minutes.' },
    metaTitle: { nl: 'Mondhygiënist in Hoofddorp | Omnia Dental', en: 'Dental hygienist in Hoofddorp | Omnia Dental' },
    metaDescription: {
      nl: 'Professionele gebitsreiniging door de mondhygiënist bij Omnia Dental in Hoofddorp. Gezond tandvlees, minder tandsteen en persoonlijk poetsadvies.',
      en: 'Professional teeth cleaning by the dental hygienist at Omnia Dental in Hoofddorp. Healthy gums, less tartar and personal cleaning advice.',
    },
  },
  {
    key: 'tanden-bleken',
    slug: { nl: 'tanden-bleken', en: 'teeth-whitening' },
    category: 'esthetisch',
    order: 4,
    image: '/images/treatments/tanden-bleken.webp',
    imageAlt: {
      nl: 'Vrouw met een natuurlijke, lichtere glimlach na het bleken van de tanden.',
      en: 'Woman with a natural, brighter smile after teeth whitening.',
    },
    imageKind: 'photo',
    name: { nl: 'Tanden bleken', en: 'Teeth whitening' },
    tagline: {
      nl: 'Een natuurlijk lichtere glimlach, veilig en onder begeleiding.',
      en: 'A naturally brighter smile, safely and under guidance.',
    },
    intro: {
      nl: 'Tanden worden in de loop van de jaren donkerder door koffie, thee, rode wijn, roken en gewoon ouder worden. Met bleken onder begeleiding van de tandarts geef je je glimlach op een veilige manier weer een lichtere, frisse uitstraling.',
      en: 'Teeth grow darker over the years from coffee, tea, red wine, smoking and simply ageing. Whitening under the guidance of a dentist gives your smile a lighter, fresher look in a safe way.',
    },
    what: {
      nl: 'Bij bleken gebruiken we een gel die de verkleuring in het glazuur oplost, waardoor je tanden lichter worden. Voordat we beginnen, controleren we eerst of je gebit en tandvlees gezond zijn, want bleken werkt het mooist op een schone, gezonde mond. We maken op maat gemaakte bleeklepeltjes die precies op je tanden passen.\n\nMeestal bleek je thuis, met de lepeltjes en gel die wij meegeven, volgens een duidelijk schema. Je houdt de regie en bouwt het resultaat rustig op. We blijven betrokken, zodat je weet wat je kunt verwachten en het bleken gecontroleerd verloopt.',
      en: 'Whitening uses a gel that lifts the discolouration within the enamel, making your teeth lighter. Before we start, we check that your teeth and gums are healthy, because whitening looks best on a clean, healthy mouth. We make custom trays that fit your teeth precisely.\n\nMost of the whitening happens at home, with the trays and gel we provide and a clear schedule to follow. You stay in control and build the result gradually. We stay involved, so you know what to expect and the process stays well guided.',
    },
    forWhom: {
      nl: 'Bleken is geschikt als je gezonde tanden hebt die door de jaren heen donkerder zijn geworden en je een lichtere glimlach wilt. Het werkt niet op vullingen, kronen of facings, omdat die hun kleur houden. Tijdens een zwangerschap raden we bleken af. We bespreken vooraf altijd wat een realistisch resultaat is.',
      en: 'Whitening suits you if you have healthy teeth that have darkened over the years and you want a lighter smile. It does not change the colour of fillings, crowns or veneers, as those keep their shade. We advise against whitening during pregnancy. We always discuss a realistic result with you beforehand.',
    },
    steps: [
      {
        title: { nl: 'Beoordeling en advies', en: 'Assessment and advice' },
        body: {
          nl: 'We controleren je gebit en tandvlees en bespreken welk resultaat haalbaar is voor jouw tanden.',
          en: 'We check your teeth and gums and discuss what result is realistic for your situation.',
        },
      },
      {
        title: { nl: 'Eerst een schone basis', en: 'A clean starting point' },
        body: {
          nl: 'Indien nodig reinigen we je gebit eerst, zodat de gel gelijkmatig kan inwerken.',
          en: 'If needed we clean your teeth first, so the gel can act evenly.',
        },
      },
      {
        title: { nl: 'Bleeklepeltjes op maat', en: 'Custom whitening trays' },
        body: {
          nl: 'We maken een afdruk en leveren lepeltjes die precies op je tanden aansluiten.',
          en: 'We take an impression and make trays that fit your teeth exactly.',
        },
      },
      {
        title: { nl: 'Bleken volgens schema', en: 'Whitening on schedule' },
        body: {
          nl: 'Je bleekt thuis volgens een duidelijke instructie en bouwt het resultaat rustig op.',
          en: 'You whiten at home following clear instructions and build the result gradually.',
        },
      },
      {
        title: { nl: 'Controle van het resultaat', en: 'Checking the result' },
        body: {
          nl: 'We kijken samen naar het eindresultaat en geven advies om de kleur langer mooi te houden.',
          en: 'We look at the final result together and advise how to keep the colour looking good longer.',
        },
      },
    ],
    benefits: [
      { nl: 'Een natuurlijk lichtere glimlach zonder je tanden te beschadigen.', en: 'A naturally brighter smile without damaging your teeth.' },
      { nl: 'Bleken onder begeleiding van de tandarts, met aandacht voor je gebit.', en: 'Whitening guided by a dentist, with care for your teeth.' },
      { nl: 'Lepeltjes op maat voor een gelijkmatig resultaat.', en: 'Custom trays for an even result.' },
      { nl: 'Je houdt zelf de regie over het tempo en de eindkleur.', en: 'You stay in control of the pace and the final shade.' },
    ],
    faq: [
      {
        q: { nl: 'Is bleken schadelijk voor mijn tanden?', en: 'Is whitening harmful to my teeth?' },
        a: {
          nl: 'Bleken onder begeleiding van de tandarts is veilig voor het glazuur. Sommige mensen ervaren tijdelijk gevoelige tanden, die klacht verdwijnt meestal vanzelf.',
          en: 'Whitening guided by a dentist is safe for your enamel. Some people notice temporary sensitivity, which usually fades on its own.',
        },
      },
      {
        q: { nl: 'Hoe lang blijft het resultaat zichtbaar?', en: 'How long does the result last?' },
        a: {
          nl: 'Dat verschilt per persoon en hangt af van leefstijl. Koffie, thee en roken kleuren de tanden weer langzaam bij. Een onderhoudsbeurt frist het resultaat op.',
          en: 'It varies per person and depends on lifestyle. Coffee, tea and smoking gradually return colour. A touch-up refreshes the result.',
        },
      },
      {
        q: { nl: 'Worden mijn vullingen ook lichter?', en: 'Will my fillings get lighter too?' },
        a: {
          nl: 'Nee, vullingen, kronen en facings veranderen niet van kleur. Als die in het zicht zitten, bespreken we vooraf wat dat voor het eindbeeld betekent.',
          en: 'No, fillings, crowns and veneers keep their colour. If they are visible, we discuss in advance what that means for the overall look.',
        },
      },
    ],
    duration: { nl: 'Enkele afspraken, gecombineerd met thuis bleken over één tot twee weken.', en: 'A few appointments combined with at-home whitening over one to two weeks.' },
    metaTitle: { nl: 'Tanden bleken in Hoofddorp | Omnia Dental', en: 'Teeth whitening in Hoofddorp | Omnia Dental' },
    metaDescription: {
      nl: 'Tanden bleken bij Omnia Dental in Hoofddorp. Een natuurlijk lichtere glimlach, veilig en onder begeleiding van de tandarts, met lepeltjes op maat.',
      en: 'Teeth whitening at Omnia Dental in Hoofddorp. A naturally brighter smile, safe and guided by a dentist, with custom-made trays. Book a consultation.',
    },
  },
  {
    key: 'facings',
    slug: { nl: 'facings', en: 'veneers' },
    category: 'esthetisch',
    order: 5,
    image: '/images/treatments/facings.webp',
    imageAlt: {
      nl: 'Illustratie van een dun porseleinen schildje dat op de voorzijde van een tand wordt geplaatst.',
      en: 'Illustration of a thin porcelain shell placed on the front of a tooth.',
    },
    imageKind: 'illustration',
    name: { nl: 'Facings', en: 'Veneers' },
    tagline: {
      nl: 'Dunne schildjes die de voorkant van je tanden mooier maken.',
      en: 'Thin shells that refine the front of your teeth.',
    },
    intro: {
      nl: 'Facings zijn flinterdunne schildjes die we op de voorkant van je tanden plaatsen. Ze verbeteren de vorm, stand en kleur van zichtbare tanden, zodat je glimlach er evenwichtiger en verzorgder uitziet.',
      en: 'Veneers are wafer-thin shells we place over the front of your teeth. They improve the shape, position and colour of visible teeth, giving your smile a more even and well-kept look.',
    },
    what: {
      nl: 'Een facing bedekt de voorzijde van een tand, een beetje zoals een dun laagje porselein of composiet. Daarmee kunnen we kleine onvolkomenheden corrigeren, zoals een verkleurde tand, een hoekje dat is afgebroken, een ruimte tussen de voortanden of tanden die net iets uit de pas lopen. Het glazuur blijft grotendeels gespaard.\n\nWe ontwerpen facings altijd op basis van je eigen gezicht en je wensen. Het doel is een natuurlijk resultaat dat bij je past, niet een opvallend kunstgebit. Omdat we het ontwerp, de voorbereiding en de plaatsing zelf in huis doen, houden we de regie over het eindresultaat.',
      en: 'A veneer covers the front of a tooth, a little like a thin layer of porcelain or composite. With it we can correct small imperfections, such as a discoloured tooth, a chipped corner, a gap between the front teeth or teeth that sit slightly out of line. Most of the enamel stays intact.\n\nWe always design veneers around your own face and your wishes. The aim is a natural result that suits you, not a conspicuous, artificial look. Because we handle the design, the preparation and the placement in house, we keep control over the final result.',
    },
    forWhom: {
      nl: 'Facings zijn interessant als je tevreden bent over je gebit, maar de voorkant van een of meer zichtbare tanden mooier zou willen. Denk aan een hardnekkige verkleuring, een afgebroken hoekje of een kleine ruimte. Voor grote standcorrecties is een beugel soms passender. Tijdens een consult bekijken we wat in jouw geval het mooiste en meest behoudende resultaat geeft.',
      en: 'Veneers are worth considering if you are happy with your teeth overall but would like the front of one or more visible teeth to look better. Think of a stubborn discolouration, a chipped corner or a small gap. For larger alignment changes, braces are sometimes a better fit. During a consultation we look at what gives the nicest and most conservative result for you.',
    },
    steps: [
      {
        title: { nl: 'Consult en ontwerp', en: 'Consultation and design' },
        body: {
          nl: 'We bespreken je wensen, beoordelen je tanden en maken samen een plan voor een passend resultaat.',
          en: 'We discuss your wishes, assess your teeth and create a plan for a result that suits you.',
        },
      },
      {
        title: { nl: 'Voorbereiding van de tand', en: 'Preparing the tooth' },
        body: {
          nl: 'Indien nodig schuren we de voorzijde licht bij, zodat de facing er natuurlijk op aansluit.',
          en: 'Where needed we lightly shape the front of the tooth so the veneer sits naturally.',
        },
      },
      {
        title: { nl: 'Op maat vervaardigen', en: 'Crafting the veneer' },
        body: {
          nl: 'De facings worden op maat gemaakt in de juiste vorm en kleur, afgestemd op je andere tanden.',
          en: 'The veneers are crafted to size in the right shape and colour, matched to your other teeth.',
        },
      },
      {
        title: { nl: 'Plaatsen en afwerken', en: 'Placing and finishing' },
        body: {
          nl: 'We hechten de facings vast, controleren je beet en werken de randen netjes af.',
          en: 'We bond the veneers in place, check your bite and finish the edges neatly.',
        },
      },
    ],
    benefits: [
      { nl: 'Een natuurlijker ogende glimlach met behoud van zoveel mogelijk eigen tand.', en: 'A more natural-looking smile while keeping as much of your own tooth as possible.' },
      { nl: 'Verkleuring, kleine ruimtes en afgebroken hoekjes in één oplossing.', en: 'Discolouration, small gaps and chipped corners solved in one approach.' },
      { nl: 'Vorm en kleur afgestemd op je gezicht en je andere tanden.', en: 'Shape and colour matched to your face and your other teeth.' },
      { nl: 'Ontwerp en plaatsing in eigen huis, met aandacht voor het detail.', en: 'Design and placement in house, with attention to detail.' },
    ],
    faq: [
      {
        q: { nl: 'Moet er veel van mijn tand af voor een facing?', en: 'Does a lot of my tooth need to be removed for a veneer?' },
        a: {
          nl: 'Meestal is er weinig tot geen voorbereiding nodig, omdat een facing heel dun is. Hoeveel precies, hangt af van je tand en het gewenste resultaat. We houden het zo behoudend mogelijk.',
          en: 'Usually little to no preparation is needed, because a veneer is very thin. How much depends on your tooth and the result you want. We keep it as conservative as possible.',
        },
      },
      {
        q: { nl: 'Zien facings er nep uit?', en: 'Do veneers look fake?' },
        a: {
          nl: 'Dat hoeft zeker niet. We stemmen vorm en kleur af op je eigen tanden, zodat het resultaat natuurlijk oogt en bij je gezicht past.',
          en: 'Not at all by default. We match the shape and colour to your own teeth, so the result looks natural and fits your face.',
        },
      },
      {
        q: { nl: 'Hoe lang gaan facings mee?', en: 'How long do veneers last?' },
        a: {
          nl: 'Met goede mondverzorging en regelmatige controles gaan facings jaren mee. Hard bijten op bijvoorbeeld noten of ijs verkort de levensduur, dus daar is voorzichtigheid prettig.',
          en: 'With good oral care and regular check-ups, veneers last for years. Biting hard on things like nuts or ice shortens their life, so a little caution helps.',
        },
      },
    ],
    duration: { nl: 'Doorgaans twee afspraken, afhankelijk van het aantal facings.', en: 'Usually two appointments, depending on the number of veneers.' },
    metaTitle: { nl: 'Facings in Hoofddorp | Omnia Dental', en: 'Veneers in Hoofddorp | Omnia Dental' },
    metaDescription: {
      nl: 'Facings bij Omnia Dental in Hoofddorp. Dunne schildjes die vorm, kleur en stand van zichtbare tanden verbeteren voor een natuurlijke glimlach.',
      en: 'Veneers at Omnia Dental in Hoofddorp. Thin shells that improve the shape, colour and position of visible teeth for a natural smile. Book a consultation.',
    },
  },
  {
    key: 'kronen-en-bruggen',
    slug: { nl: 'kronen-en-bruggen', en: 'crowns-and-bridges' },
    category: 'herstel',
    order: 7,
    image: '/images/treatments/kronen-en-bruggen.webp',
    imageAlt: {
      nl: 'Illustratie van een kroon op een tand en een brug die een ontbrekende tand vervangt.',
      en: 'Illustration of a crown on a tooth and a bridge replacing a missing tooth.',
    },
    imageKind: 'illustration',
    name: { nl: 'Kronen en bruggen', en: 'Crowns and bridges' },
    tagline: {
      nl: 'Een beschadigde tand herstellen of een gat netjes opvullen.',
      en: 'Restoring a damaged tooth or closing a gap neatly.',
    },
    intro: {
      nl: 'Een kroon herstelt een tand of kies die te zwak of te beschadigd is voor een gewone vulling. Een brug vult de ruimte op waar een tand ontbreekt. Beide geven je weer een gebit waarmee je prettig kunt bijten en lachen.',
      en: 'A crown restores a tooth that is too weak or too damaged for an ordinary filling. A bridge fills the space where a tooth is missing. Both give you back a mouth you can bite and smile with comfortably.',
    },
    what: {
      nl: 'Een kroon is een kapje dat over je eigen tand of kies wordt geplaatst. Het herstelt de vorm en sterkte, bijvoorbeeld na een grote vulling, een wortelkanaalbehandeling of een afgebroken kies. De kroon krijgt een kleur die bij je andere tanden past.\n\nEen brug gebruiken we als er een tand mist. De brug rust op de twee tanden ernaast en overbrugt zo de open ruimte met een vaste, niet uitneembare oplossing. We bepalen samen of een kroon, een brug of in sommige gevallen een implantaat de beste keuze is voor jouw situatie. Doordat we deze behandelingen in huis verzorgen, blijven onderzoek, voorbereiding en plaatsing bij ons.',
      en: 'A crown is a cap placed over your own tooth. It restores the shape and strength, for example after a large filling, a root canal treatment or a broken molar. The crown is given a colour that matches your other teeth.\n\nWe use a bridge when a tooth is missing. The bridge rests on the two neighbouring teeth and spans the gap with a fixed, non-removable solution. Together we decide whether a crown, a bridge or in some cases an implant is the best choice for you. Because we provide these treatments in house, the assessment, preparation and placement all stay with us.',
    },
    forWhom: {
      nl: 'Een kroon is passend wanneer een tand zo is verzwakt dat een vulling niet meer voldoende houvast geeft, of na een wortelkanaalbehandeling. Een brug is een optie als je een tand mist en de buurtanden geschikt zijn om de brug te dragen. In een consult kijken we naar je gebit, je wensen en eventuele alternatieven, zodat je een weloverwogen keuze kunt maken.',
      en: 'A crown is suitable when a tooth is so weakened that a filling no longer holds well, or after a root canal treatment. A bridge is an option if you are missing a tooth and the neighbouring teeth are suitable to carry it. In a consultation we look at your mouth, your wishes and any alternatives, so you can make a well-considered choice.',
    },
    steps: [
      {
        title: { nl: 'Onderzoek en plan', en: 'Assessment and plan' },
        body: {
          nl: 'We beoordelen de tand of de ruimte en bespreken of een kroon, brug of ander herstel het best past.',
          en: 'We assess the tooth or the gap and discuss whether a crown, bridge or other restoration fits best.',
        },
      },
      {
        title: { nl: 'Voorbereiden en afdruk', en: 'Preparing and impression' },
        body: {
          nl: 'We bereiden de tand voor en maken een nauwkeurige afdruk of scan voor een kroon of brug op maat.',
          en: 'We prepare the tooth and take a precise impression or scan for a custom crown or bridge.',
        },
      },
      {
        title: { nl: 'Tijdelijke voorziening', en: 'Temporary restoration' },
        body: {
          nl: 'In de tussentijd krijg je vaak een tijdelijke kroon, zodat je gewoon kunt eten en lachen.',
          en: 'In the meantime you often receive a temporary crown, so you can keep eating and smiling.',
        },
      },
      {
        title: { nl: 'Plaatsen en controleren', en: 'Placing and checking' },
        body: {
          nl: 'We plaatsen de definitieve kroon of brug, controleren je beet en werken alles netjes af.',
          en: 'We fit the final crown or bridge, check your bite and finish everything neatly.',
        },
      },
    ],
    benefits: [
      { nl: 'Een verzwakte tand wordt weer sterk en bruikbaar.', en: 'A weakened tooth becomes strong and usable again.' },
      { nl: 'Een ontbrekende tand wordt opgevuld met een vaste oplossing.', en: 'A missing tooth is filled with a fixed solution.' },
      { nl: 'Kleur en vorm afgestemd op je eigen gebit.', en: 'Colour and shape matched to your own teeth.' },
      { nl: 'Onderzoek, voorbereiding en plaatsing in eigen huis.', en: 'Assessment, preparation and placement in house.' },
    ],
    faq: [
      {
        q: { nl: 'Is een kroon of brug pijnlijk om te laten maken?', en: 'Is getting a crown or bridge painful?' },
        a: {
          nl: 'De behandeling vindt plaats onder verdoving, zodat je er weinig van merkt. We werken rustig en met aandacht voor je comfort.',
          en: 'The treatment is carried out under local anaesthetic, so you feel very little. We work calmly and with care for your comfort.',
        },
      },
      {
        q: { nl: 'Wat is het verschil tussen een kroon en een brug?', en: 'What is the difference between a crown and a bridge?' },
        a: {
          nl: 'Een kroon herstelt één bestaande tand. Een brug vervangt een ontbrekende tand door op de buurtanden te steunen. We adviseren wat in jouw situatie het beste werkt.',
          en: 'A crown restores one existing tooth. A bridge replaces a missing tooth by resting on the neighbouring teeth. We advise what works best in your situation.',
        },
      },
      {
        q: { nl: 'Hoe lang gaan een kroon en brug mee?', en: 'How long do crowns and bridges last?' },
        a: {
          nl: 'Met goede mondverzorging en regelmatige controles gaan ze doorgaans vele jaren mee. Gezond tandvlees rond de kroon of brug is daarbij belangrijk.',
          en: 'With good oral care and regular check-ups they usually last for many years. Healthy gums around the crown or bridge are important here.',
        },
      },
    ],
    duration: { nl: 'Meestal twee afspraken met een tussenperiode voor de vervaardiging.', en: 'Usually two appointments with a gap for fabrication.' },
    metaTitle: { nl: 'Kronen en bruggen in Hoofddorp | Omnia Dental', en: 'Crowns and bridges in Hoofddorp | Omnia Dental' },
    metaDescription: {
      nl: 'Kronen en bruggen bij Omnia Dental in Hoofddorp. Herstel een beschadigde tand of vervang een ontbrekende tand met een vaste oplossing op maat.',
      en: 'Crowns and bridges at Omnia Dental in Hoofddorp. Restore a damaged tooth or replace a missing one with a custom fixed solution. Book a consultation.',
    },
  },
  {
    key: 'kindertandheelkunde',
    slug: { nl: 'kindertandheelkunde', en: 'childrens-dentistry' },
    category: 'kinderen',
    order: 11,
    image: '/images/treatments/kindertandheelkunde.webp',
    imageAlt: {
      nl: 'Kind in de tandartsstoel dat ontspannen lacht tijdens een controle.',
      en: 'Child in the dental chair smiling at ease during a check-up.',
    },
    imageKind: 'photo',
    name: { nl: 'Kindertandheelkunde', en: "Children's dentistry" },
    tagline: {
      nl: 'Kinderen op hun gemak laten wennen aan de tandarts.',
      en: 'Helping children feel at ease with the dentist.',
    },
    intro: {
      nl: 'Een fijne start bij de tandarts legt de basis voor een leven lang een gezond gebit zonder angst. Bij ons mogen kinderen rustig wennen, in hun eigen tempo en met veel uitleg op kindhoogte.',
      en: 'A good start at the dentist lays the foundation for a lifetime of healthy teeth without fear. With us children are allowed to settle in at their own pace, with plenty of explanation at their level.',
    },
    what: {
      nl: 'Bij de eerste bezoeken draait het vooral om wennen. We laten je kind de stoel, het spiegeltje en het waterstraaltje ontdekken en tellen samen de tandjes. Zo wordt de tandarts een vertrouwde, gewone plek in plaats van iets om tegenop te zien.\n\nNaarmate je kind groeit, kijken we naar de ontwikkeling van het gebit, naar wisselen en doorkomende tanden, en behandelen we wanneer dat nodig is. We leggen alles eerst uit, doen niets onverwachts en werken in een tempo dat bij je kind past. Ouders zijn welkom om erbij te blijven.',
      en: 'The first visits are mainly about getting used to things. We let your child explore the chair, the little mirror and the water spray, and we count the teeth together. That way the dentist becomes a familiar, ordinary place rather than something to dread.\n\nAs your child grows, we follow the development of their teeth, watch over baby teeth making way for adult ones, and treat when needed. We explain everything first, do nothing unexpected and work at a pace that suits your child. Parents are welcome to stay close by.',
    },
    forWhom: {
      nl: 'Kindertandheelkunde is er voor alle kinderen, van de allereerste tandjes tot de tienerjaren. Juist een vroege, ontspannen kennismaking helpt om angst te voorkomen. Is je kind wat angstig of heeft het een vervelende ervaring gehad, dan nemen we extra tijd om het vertrouwen rustig op te bouwen.',
      en: "Children's dentistry is for all children, from the very first teeth through the teenage years. An early, relaxed introduction is exactly what helps prevent fear. If your child is a little anxious or has had an unpleasant experience, we take extra time to rebuild trust calmly.",
    },
    steps: [
      {
        title: { nl: 'Kennismaken en wennen', en: 'Meeting and settling in' },
        body: {
          nl: 'Je kind ontdekt de stoel en de instrumenten en mag eerst gewoon even rondkijken.',
          en: 'Your child explores the chair and the instruments and is free to look around first.',
        },
      },
      {
        title: { nl: 'Samen de tandjes tellen', en: 'Counting the teeth together' },
        body: {
          nl: 'We bekijken het gebit op een speelse manier en leggen alles uit in begrijpelijke taal.',
          en: 'We look at the teeth in a playful way and explain everything in words a child understands.',
        },
      },
      {
        title: { nl: 'Letten op de ontwikkeling', en: 'Watching the development' },
        body: {
          nl: 'We volgen het wisselen van tandjes en doorkomende tanden en houden gaatjes in de gaten.',
          en: 'We follow baby teeth making way for adult ones and keep an eye out for cavities.',
        },
      },
      {
        title: { nl: 'Uitleg voor ouder en kind', en: 'Advice for parent and child' },
        body: {
          nl: 'We geven poetstips op maat en bespreken samen wat het gebit van je kind nodig heeft.',
          en: "We give tailored brushing tips and discuss together what your child's teeth need.",
        },
      },
    ],
    benefits: [
      { nl: 'Kinderen wennen in hun eigen tempo aan de tandarts.', en: 'Children get used to the dentist at their own pace.' },
      { nl: 'Uitleg en aanpak op kindhoogte, zonder verrassingen.', en: 'Explanations and an approach at their level, without surprises.' },
      { nl: 'Vroege preventie voorkomt klachten en angst later.', en: 'Early prevention helps avoid problems and fear later on.' },
      { nl: 'Ouders mogen erbij blijven voor extra vertrouwen.', en: 'Parents may stay close by for extra reassurance.' },
    ],
    faq: [
      {
        q: { nl: 'Vanaf welke leeftijd kan mijn kind meekomen?', en: 'From what age can my child come along?' },
        a: {
          nl: 'Je kunt je kind al vanaf de eerste tandjes meenemen, bijvoorbeeld bij je eigen controle. Zo wordt de tandarts vroeg een vertrouwde plek.',
          en: 'You can bring your child along from the very first teeth, for example during your own check-up. That way the dentist becomes familiar early on.',
        },
      },
      {
        q: { nl: 'Mijn kind is bang voor de tandarts, wat doen jullie dan?', en: 'My child is afraid of the dentist, what do you do then?' },
        a: {
          nl: 'We nemen extra tijd, leggen alles vooraf uit en doen niets onverwachts. Stap voor stap bouwen we het vertrouwen op, in een tempo dat bij je kind past.',
          en: 'We take extra time, explain everything beforehand and do nothing unexpected. Step by step we build trust, at a pace that suits your child.',
        },
      },
      {
        q: { nl: 'Wordt tandheelkunde voor kinderen vergoed?', en: "Is children's dentistry reimbursed?" },
        a: {
          nl: 'Voor kinderen tot achttien jaar valt de meeste tandheelkundige zorg onder de basisverzekering. We informeren je graag over wat van toepassing is.',
          en: 'For children up to eighteen, most dental care falls under basic insurance. We are happy to explain what applies in your case.',
        },
      },
    ],
    duration: { nl: 'Een eerste kennismaking duurt kort en is helemaal op je kind afgestemd.', en: "A first introduction is short and entirely shaped around your child." },
    metaTitle: { nl: 'Kindertandarts in Hoofddorp | Omnia Dental', en: "Children's dentist in Hoofddorp | Omnia Dental" },
    metaDescription: {
      nl: 'Kindertandheelkunde bij Omnia Dental in Hoofddorp. Kinderen wennen op hun gemak aan de tandarts, met uitleg op kindhoogte en aandacht voor preventie.',
      en: "Children's dentistry at Omnia Dental in Hoofddorp. Children get used to the dentist at ease, with child-level explanations and a focus on prevention.",
    },
  },
];
