import type { SectionContent } from '../types';

export const business: SectionContent = {
  title: 'Starting a Business in the Netherlands',
  metaTitle: 'Starting a Business in the Netherlands | E & I Expat Services',
  metaDescription:
    'Start or relocate a business in the Netherlands with one partner for visas, company registration, housing and family relocation. Built for international entrepreneurs.',
  eyebrow: 'Business',
  intro: [
    'Visa firms arrange permits. Formation agents register companies. Housing agents find apartments. An international entrepreneur needs all three at once, plus a family that actually wants to stay, and nobody hands you that as one service. We do. Immigration, company setup, housing and relocation, coordinated by one team that answers to you.',
    'The same applies at company scale. When a business moves people to the Netherlands, we relocate the whole picture: the entity, the executives, the teams and every family that comes with them.',
  ],
  image: '/images/rotterdam-evening.jpg',
  imageAlt: 'Rotterdam skyline on the Wilhelminapier in evening light',
  cta: {
    title: 'Bring your business to the Netherlands',
    text: 'Tell us what you want to build here and who is coming with you. We will lay out the full route, permits to premises, in one plan.',
    label: 'Plan my business move',
  },
  services: [
    {
      slug: 'starting-a-business-in-the-netherlands',
      menuLabel: 'Start a business',
      title: 'Starting a Business in the Netherlands',
      metaTitle: 'Starting a Business in the Netherlands as a Foreigner | E & I',
      metaDescription:
        'Starting a business in the Netherlands as a foreign entrepreneur: the self-employed residence permit, its requirements, how the IND and RVO assess your plan, and our fees.',
      eyebrow: 'Entrepreneurship',
      intro: [
        'The Netherlands is one of Europe’s most attractive bases for international entrepreneurs: a stable economy, excellent infrastructure and direct access to the European market. Starting a business here as a non-EU national involves more than registering a company, because in most cases you also need a residence permit as a self-employed entrepreneur.',
        'We guide founders through the whole process, from immigration strategy and business plan to the residence permit application, and then through the practical side: company registration, an address, and settling in.',
      ],
      cardText: 'One roadmap for your residence basis, company structure and first registrations.',
      forWho: {
        title: 'Who can start a business in the Netherlands',
        items: [
          'Non-EU and non-EEA nationals who want to establish or operate a business here',
          'Freelancers and consultants bringing an existing practice to the Netherlands',
          'EU citizens who can start immediately but want the setup done right',
          'Founders still choosing between the Netherlands and other European bases',
        ],
      },
      conditions: {
        title: 'Key requirements for the entrepreneur residence permit',
        intro:
          'Applications are assessed on the economic value of the business for the Netherlands. Applicants must generally demonstrate:',
        items: [
          'A professional and viable business plan',
          'Relevant entrepreneurial or professional experience',
          'Sufficient financial resources',
          'Registration with the Dutch Chamber of Commerce (KvK)',
          'Economic value for the Dutch economy',
        ],
      },
      included: {
        title: 'What the roadmap covers',
        blocks: [
          {
            title: 'Residence strategy',
            text: 'Startup visa, DAFT for Americans, the self-employed permit or no permit at all for EU citizens. We identify the basis that fits your nationality and your plans.',
          },
          {
            title: 'Legal form advice',
            text: 'Eenmanszaak or BV, explained in terms of liability, taxes and how each choice interacts with your immigration route.',
          },
          {
            title: 'Registrations in order',
            text: 'KvK, VAT number from the tax authority, business bank account and insurances, sequenced so nothing blocks anything else.',
          },
          {
            title: 'Life around the business',
            text: 'A place to live, registration in your municipality, healthcare and family arrangements, because a founder who cannot settle cannot build.',
          },
        ],
      },
      process: {
        title: 'Our working method',
        steps: [
          { title: 'Initial immigration assessment', text: 'We evaluate your plans and determine the most suitable immigration route for your nationality and your business.' },
          { title: 'Business plan and documentation', text: 'We assist in preparing the business plan and the supporting documents the assessment turns on.' },
          { title: 'Residence permit application', text: 'We prepare and submit the application to the IND, with the company formation running in parallel where possible.' },
          { title: 'Application monitoring', text: 'We track the file and respond to questions from the authorities on your behalf.' },
        ],
      },
      fees: {
        title: 'What starting a business costs',
        kind: 'tailored',
        amount: 'Tailor-made proposal',
        amountNote:
          'Founding a company touches your legal structure, your tax position and usually your residence permit at the same time. Those three decisions are never identical between clients, so you receive a customised proposal after the first consultation.',
        includes: [
          'Legal structure advised against your tax position and immigration route',
          'Company registered with the KvK and the tax authority',
          'Residence permit route selected and prepared alongside the company',
          'Banking, accounting and the first compliance obligations arranged',
        ],
      },
      details: {
        title: 'How your application is assessed',
        items: [
          {
            q: 'Who decides, and on what?',
            a: 'The Netherlands Enterprise Agency (RVO) advises the Immigration and Naturalisation Service (IND) before a final decision is made. The assessment looks at your professional background and experience, the quality and feasibility of the business plan, the economic value of the business, and its innovation or employment potential.',
          },
          {
            q: 'What kind of business is viewed favourably?',
            a: 'Businesses that contribute to innovation, employment or genuine economic activity in the Netherlands. A plan that reads as a formality to obtain residence, with no market, no clients and no capital behind it, is the most common reason applications fail.',
          },
          {
            q: 'Which legal form should the company take?',
            a: 'An eenmanszaak is lighter and cheaper to run; a BV limits liability and suits growth and investors. The right answer depends on your tax position and how the permit route treats your income, so we advise per case rather than by rule of thumb.',
          },
        ],
      },
      faq: {
        title: 'Founders ask us',
        items: [
          {
            q: 'Can I start a Dutch business without living in the Netherlands?',
            a: 'You can own a Dutch company from abroad, but running it locally as a non-EU national requires a residence basis. We help you decide whether you truly need to move, and if so, on which permit.',
          },
          {
            q: 'Do I need a Dutch business partner?',
            a: 'No. The Netherlands does not require local shareholders or directors for most structures. Your company can be fully yours.',
          },
          {
            q: 'How long before I can actually trade?',
            a: 'For EU citizens, days. For non-EU founders the permit determines the pace, and we confirm current IND timelines during your intake so your launch date is realistic from day one.',
          },
          {
            q: 'Is there an easier route for US citizens or innovative startups?',
            a: 'Yes. Americans can usually apply under the DAFT treaty, and founders with an innovative concept can use the startup visa. Both avoid the full economic assessment, and we check at intake which of the three routes actually fits you.',
          },
        ],
      },
      cta: {
        title: 'Start your business in the Netherlands',
        text: 'Describe your business in two sentences. We will come back with the route, the structure and the first three steps.',
        label: 'Map my route',
      },
      form: 'immigration',
      image: '/images/start-business.jpg?v=20260731',
      imageAlt: 'Founder in a design-led Dutch workspace',
      image2: '/images/business-plan.jpg',
      image2Alt: 'Entrepreneur reviewing a business plan with an advisor',
    },
    {
      slug: 'company-registration-netherlands',
      menuLabel: 'Company setup',
      title: 'Company Registration Netherlands',
      metaTitle: 'Company Registration Netherlands for Foreign Founders',
      metaDescription:
        'Register your Dutch company without missteps: legal form, notary, KvK, VAT and bank account, guided personally for foreign founders and international firms.',
      eyebrow: 'Company setup',
      intro: [
        'Registering a Dutch company is mechanically simple and strategically easy to get wrong. The legal form you pick on day one determines your liability, your tax position and, for foreign founders, how smoothly your residence and banking fall into place afterwards.',
        'We manage the incorporation end to end and in the right order, with the notary, the Chamber of Commerce, the tax authority and the bank each getting exactly what they need the first time.',
      ],
      cardText: 'Incorporation handled end to end: legal form, notary, KvK, VAT and banking.',
      explainer: {
        title: 'What does setting up a Dutch company involve?',
        text: [
          'Setting up in the Netherlands means choosing a legal structure before anything else. A sole proprietorship, the eenmanszaak or ZZP, is fast and inexpensive but leaves you personally liable for the company’s debts. A BV is a private limited company: a separate legal person that protects your personal assets, incorporated through a Dutch notary.',
          'That choice drives everything downstream, including how you are taxed, whether you can bring in shareholders, how banks and clients assess you, and in several cases which residence permit you qualify for. It is far cheaper to choose correctly at the start than to convert later.',
        ],
      },
      forWho: {
        title: 'We register companies for',
        items: [
          'Foreign founders establishing their first Dutch entity',
          'International companies opening a Dutch branch or subsidiary',
          'DAFT and startup visa applicants whose permit depends on a clean setup',
          'Holding structures that need a Dutch operating company',
        ],
      },
      included: {
        title: 'The setup, piece by piece',
        blocks: [
          {
            title: 'Structure and name',
            text: 'BV, branch office or sole proprietorship, chosen for your situation, plus a trade name check before you print anything.',
          },
          {
            title: 'Notary coordination',
            text: 'A BV is incorporated by Dutch notarial deed. We brief the notary, prepare the shareholder details and arrange execution, including with founders who are still abroad.',
          },
          {
            title: 'KvK and tax registration',
            text: 'Registration in the Business Register, UBO filing, and the VAT number from the Belastingdienst that lets you invoice.',
          },
          {
            title: 'Business banking',
            text: 'Dutch banks are careful with foreign founders. We prepare the file that answers their compliance questions and introduce you where we can.',
          },
          {
            title: 'Registered address',
            text: 'Every Dutch company needs a real address. We help you arrange premises or a compliant registered office before filings begin.',
          },
        ],
      },
      process: {
        title: 'How incorporation runs',
        steps: [
          { title: 'Design', text: 'Structure, shareholders and address decided in one working session.' },
          { title: 'Execute', text: 'Notary deed, KvK registration and tax filings completed in sequence.' },
          { title: 'Operate', text: 'Bank account open, VAT number active, and your company ready to sign its first contract.' },
        ],
      },
      fees: {
        title: 'Professional fees for company setup',
        kind: 'tiered',
        amount: 'Investment from €2,495',
        tiers: [
          { label: 'Sole proprietorship (ZZP)', amount: 'Investment from €2,495' },
          { label: 'Dutch BV', amount: 'Investment from €3,495' },
          { label: 'International holding structure', amount: 'Tailor-made' },
        ],
        includes: [
          'Structure advised before anything is filed, not after',
          'Notarial deed coordinated for a BV, including the incorporation documents',
          'Registration with the KvK and the Belastingdienst',
          'UBO register, VAT number and the first filing obligations set up correctly',
        ],
      },
      note: 'If your residence permit is still pending, the order of operations matters: some steps can proceed before arrival and some cannot. We plan the sequence around your immigration timeline.',
      conditions: {
        title: 'What incorporation requires',
        intro:
          'The legal form you choose in week one determines your tax, your liability and your credibility with Dutch counterparties for years.',
        items: [
          'A BV requires a civil-law notary and a deed of incorporation. A eenmanszaak and a VOF do not.',
          'Share capital for a BV can be as little as one euro, so capital is no longer the reason to choose one form over another.',
          'Every company needs a registered Dutch business address. A postbox is not accepted by the KvK.',
          'Directors and shareholders must be identified under UBO rules, and the ultimate beneficial owner is recorded in a separate register.',
          'VAT registration follows automatically from KvK registration, and the tax office issues the number separately.',
          'A residence permit is a prerequisite for running a business here as a non-EU national, and the company cannot substitute for it.',
        ],
      },
      details: {
        title: 'Choosing the right structure',
        items: [
          {
            q: 'BV or eenmanszaak?',
            a:
              'A eenmanszaak is faster, cheaper and taxed through income tax with entrepreneur deductions, but you are personally liable. A BV separates your liability, reads as more substantial to Dutch clients and banks, and becomes tax-efficient once profits are meaningful. Most consultants start as a eenmanszaak and convert when the numbers justify the notary.',
          },
          {
            q: 'How long does a BV take?',
            a:
              'Usually one to three weeks. The notary needs identification, the intended structure and a name check, and the KvK registration follows the deed. Where shareholders are abroad, legalised powers of attorney add time, so we start those first.',
          },
          {
            q: 'Can I incorporate before I have residence?',
            a:
              'You can hold shares in a Dutch company from abroad, but working in it in the Netherlands needs the right permit. Setting up the company first and thinking about residence afterwards is the sequence that causes most of the problems we repair.',
          },
          {
            q: 'What about a registered address?',
            a:
              'It must be a real address where the company is genuinely reachable, and both the KvK and the banks now check this. Virtual office packages vary enormously in whether they survive that scrutiny, and we point you to providers that do.',
          },
        ],
      },
      faq: {
        title: 'Before you incorporate',
        items: [
          {
            q: 'Do I need to be in the Netherlands to incorporate?',
            a: 'Not necessarily. A BV can be incorporated with a power of attorney while you are abroad, and we coordinate the legalized signatures the notary requires.',
          },
          {
            q: 'BV or eenmanszaak, which should I choose?',
            a: 'A BV limits liability and suits growth and investors; an eenmanszaak is lighter and cheaper to run. Tax and immigration factors tip the balance per case, so we advise on your numbers, not a rule of thumb.',
          },
          {
            q: 'How much share capital does a BV need?',
            a: 'Dutch law allows a BV to be founded with a symbolic share capital, even one eurocent. What matters is a capitalization that fits your business plan and, where relevant, your permit conditions.',
          },
        ],
      },
      cta: {
        title: 'Incorporate it properly, once',
        text: 'Tell us what the company will do and who owns it. We will propose the structure and start the clock.',
        label: 'Set up my company',
      },
      form: 'immigration',
      image: '/images/business-signing.jpg?v=20260728',
      imageAlt: 'Founder signing incorporation documents at a Dutch notary',
      image2: '/images/kvk-registration.jpg?v=20260731',
      image2Alt: 'Entrepreneur and advisor reviewing company papers',
    },
    {
      slug: 'kvk-registration-for-foreigners-netherlands',
      menuLabel: 'KvK registration',
      title: 'KvK Registration for Foreigners',
      metaTitle: 'KvK Registration for Foreigners | Dutch Chamber of Commerce',
      metaDescription:
        'Register with the Dutch Chamber of Commerce as a foreigner without confusion. Appointment preparation, documents, SBI codes and personal accompaniment to the KvK.',
      eyebrow: 'Chamber of Commerce',
      intro: [
        'Every business in the Netherlands starts at the Kamer van Koophandel, and for foreigners the KvK appointment is where paperwork meets reality: identification, a Dutch business address, activity codes and questions asked in a system built for locals.',
        'We prepare the entire registration and then Johanna goes with you to the appointment itself, so language, missing documents or an unexpected question never cost you a second visit.',
      ],
      cardText: 'Your Chamber of Commerce registration prepared, booked and attended together.',
      explainer: {
        title: 'What is KvK registration?',
        text: [
          'The KvK, Kamer van Koophandel, is the Dutch Chamber of Commerce, and registration in its trade register is what legally brings a business into existence in the Netherlands. Every company and every freelancer must be listed there.',
          'Registration is public: your company details are visible to anyone, and clients routinely check them before contracting. The KvK passes your details to the tax authority, which is how your VAT number follows, so the activity codes you choose at registration quietly shape your tax position afterwards.',
        ],
      },
      forWho: {
        title: 'Who we walk in with',
        items: [
          'Freelancers and sole traders registering an eenmanszaak',
          'DAFT applicants whose permit requires a KvK registration',
          'EU citizens starting to work independently in the Netherlands',
          'Founders unsure which activities and codes to register',
        ],
      },
      included: {
        title: 'Around your registration',
        blocks: [
          {
            title: 'Document run-through',
            text: 'Passport, proof of address, and evidence of your business activities, checked against KvK requirements before we book anything.',
          },
          {
            title: 'Business address solutions',
            text: 'The KvK requires a genuine Dutch business address, and a hotel room does not count. We help you arrange one that satisfies both KvK and the tax authority.',
          },
          {
            title: 'SBI codes and description',
            text: 'Your registered activities feed into insurance, banking and taxes. We choose the codes deliberately instead of on the spot at the counter.',
          },
          {
            title: 'Appointment and follow-through',
            text: 'We book the appointment, attend it with you, and afterwards confirm your KvK number, extract and VAT registration all arrive as they should.',
          },
        ],
      },
      process: {
        title: 'Three steps to your KvK number',
        steps: [
          { title: 'Prepare', text: 'Documents, address and activity description finalized together.' },
          { title: 'Register', text: 'We accompany you to the KvK office and handle surprises in the room.' },
          { title: 'Confirm', text: 'KvK number issued, VAT number followed up, and copies filed where your bank and accountant need them.' },
        ],
      },
      fees: {
        title: 'Professional fees for KvK registration',
        kind: 'fixed',
        amount: 'Investment from €395',
        includes: [
          'Registration form prepared and the SBI activity codes chosen correctly',
          'KvK appointment booked and attended with you',
          'Address and identity requirements checked before the appointment',
          'VAT number followed up with the Belastingdienst after registration',
        ],
      },
      note: 'If you do not yet have a BSN, registration is still possible in many situations, but the route differs. Mention it when you contact us and we will plan around it.',
      conditions: {
        title: 'What the KvK needs from you',
        intro:
          'The Chamber of Commerce appointment is short and unforgiving. Everything is decided by what you bring with you.',
        items: [
          'Appointments must be booked in advance, and in busy periods the wait can run to several weeks.',
          'You need a valid passport or ID, a BSN, and proof of your Dutch business address.',
          'Non-EU nationals must show a residence permit that allows self-employment.',
          'The business address must be a real address. A postbox will be refused.',
          'You choose SBI activity codes at registration, and these follow you into banking, insurance and VAT treatment.',
          'Registration costs a one-off fee, and your details enter the public commercial register.',
        ],
      },
      details: {
        title: 'Getting the registration right',
        items: [
          {
            q: 'Why do SBI codes matter so much?',
            a:
              'They describe what your company does, and banks, insurers and the tax office all read them. A code that suggests a higher-risk activity can slow or block a business bank account, and a code that is too narrow can complicate invoicing later. We choose them with you deliberately rather than picking the nearest match at the counter.',
          },
          {
            q: 'Can I register without a Dutch address?',
            a:
              'No, and this is the most common reason a registration fails. You need an address where the business is actually reachable. We arrange compliant business addresses for clients who are still house hunting, so the company can start while the home search runs.',
          },
          {
            q: 'Do you attend the appointment?',
            a:
              'Yes. The appointment runs in Dutch, decisions are made at the desk that are hard to reverse afterwards, and having someone beside you who knows what each question means is the difference between one appointment and three.',
          },
          {
            q: 'What happens immediately afterwards?',
            a:
              'You receive your KvK number the same day and your VAT number from the tax office shortly after. Then comes business banking, accounting, invoicing setup and, if relevant, the small business VAT scheme. We work through that sequence with you rather than leaving you with a certificate.',
          },
        ],
      },
      faq: {
        title: 'KvK questions',
        items: [
          {
            q: 'Can I register with the KvK without living in the Netherlands yet?',
            a: 'In some cases yes, if your business genuinely operates from a Dutch address. The setup differs from a resident registration, and we assess which applies to you.',
          },
          {
            q: 'What does KvK registration cost?',
            a: 'The KvK charges a modest one-time registration fee, which changes periodically. We confirm the current amount when we book your appointment, and there are no hidden charges after it.',
          },
          {
            q: 'Do I get my VAT number at the KvK?',
            a: 'The KvK passes your registration to the Belastingdienst, which then issues the VAT number. We track that handover so you are not left waiting in silence, unable to invoice.',
          },
        ],
      },
      cta: {
        title: 'Let’s get you registered',
        text: 'Send us your situation and your preferred start date. We will prepare everything and book the KvK together.',
        label: 'Book my KvK registration',
      },
      form: 'immigration',
      image: '/images/kvk-registration.jpg?v=20260731',
      imageAlt: 'Entrepreneur and advisor reviewing company papers',
      image2: '/images/business-plan.jpg',
      image2Alt: 'Entrepreneurs working through a business plan',
    },
    {
      slug: 'relocation-services-for-entrepreneurs-netherlands',
      menuLabel: 'Entrepreneur relocation',
      title: 'Relocation Services for Entrepreneurs Netherlands',
      metaTitle: 'Relocation Services for Entrepreneurs Netherlands | E & I',
      metaDescription:
        'Relocation designed for entrepreneurs moving to the Netherlands: permits, home, family and business set up as one project, with a single personal point of contact.',
      eyebrow: 'Relocation',
      intro: [
        'An employee who relocates has an HR department. An entrepreneur who relocates has a to-do list that fights back: a permit that depends on a company, a company that needs an address, an address that needs a registration, and a family waiting on all of it. Standard relocation packages are not built for that circular puzzle.',
        'Ours is. We run your move as one project with one owner, and because questions do not wait for business hours, you reach us on a personal WhatsApp line 24/7, from the first box packed to the last form signed.',
      ],
      cardText: 'The move, the permit, the company and the family, run as one project.',
      forWho: {
        title: 'Entrepreneurs we move',
        items: [
          'Founders relocating themselves and their company at the same time',
          'Self-employed professionals on DAFT or self-employed permits',
          'Entrepreneurs bringing a partner and children along',
          'Business owners who tried to arrange it all remotely and got stuck',
        ],
      },
      included: {
        title: 'One project, every thread',
        blocks: [
          {
            title: 'Sequencing that works',
            text: 'We order the permit, company, housing and registration steps so each one unlocks the next instead of blocking it.',
          },
          {
            title: 'Home search with business logic',
            text: 'A home that suits your family and holds up as a registration address for you and, where sensible, your company.',
          },
          {
            title: 'Administrative landing',
            text: 'Municipality registration, BSN, health insurance and the Dutch practicalities like DigiD, handled in your first weeks.',
          },
          {
            title: 'Family settling-in',
            text: 'Schools, childcare and neighbourhood orientation for the people who did not choose this adventure but are living it with you.',
          },
        ],
      },
      process: {
        title: 'How your move unfolds',
        steps: [
          { title: 'Blueprint', text: 'One plan covering permit, company, home and family, with dependencies made explicit.' },
          { title: 'Execution', text: 'We run the workstreams in parallel and report progress in plain language, not portal updates.' },
          { title: 'Settled', text: 'You are registered, housed, banked and operational, and your family knows where the good bakery is.' },
        ],
      },
      fees: {
        title: 'What entrepreneur relocation costs',
        kind: 'tailored',
        amount: 'Tailor-made proposal',
        amountNote:
          'An entrepreneur moves a company and a household at the same time, and the two have different deadlines. You receive a customised proposal covering both after an initial consultation.',
        includes: [
          'Company formation and your residence route planned as one sequence',
          'Housing search for you and your family',
          'Every registration for the household, booked and accompanied',
          'Introductions to accountants, notaries and banks that work with internationals',
        ],
      },
      conditions: {
        title: 'How the pieces have to fit',
        intro:
          'Founders run four processes at once, and each one depends on another. The sequence is the whole service.',
        items: [
          'A residence basis has to exist before the business can be operated from the Netherlands, whatever the company registration says.',
          'Registration at your address produces the BSN, and without it neither the company nor your salary can function properly.',
          'Landlords assess entrepreneurs on assets and accounts rather than payslips, so the rental file is built differently.',
          'Business banking for a newly registered company with a foreign founder takes longer than personal banking and is refused more often.',
          'Health insurance is compulsory from arrival for you and your family, regardless of company structure.',
          'We coordinate the permit, the company and the move. Tax and accounting are handled by advisers we introduce you to.',
        ],
      },
      details: {
        title: 'Founder-specific problems',
        items: [
          {
            q: 'Why is business banking so difficult?',
            a:
              'Dutch banks apply strict onboarding rules to newly incorporated companies with non-resident founders, and applications are refused for reasons that are never fully explained. What works is a clear business description, coherent SBI codes, a genuine Dutch address, evidence of intended clients and a founder who is already registered. We prepare for that rather than discovering it.',
          },
          {
            q: 'How do I rent without Dutch payslips?',
            a:
              'With a different file. Landlords accept entrepreneurs on the basis of business accounts, bank statements, assets, a larger deposit or a bank guarantee, and sometimes a personal guarantee from the BV. We build that file properly and present it in Dutch, which turns a refusal into a viewing.',
          },
          {
            q: 'What should happen first?',
            a:
              'The immigration assessment, always. Everything else can be reordered, but building a company on a residence basis that does not exist is unrecoverable. Once the route is confirmed, the company, the housing and the family arrangements run in parallel.',
          },
          {
            q: 'Do you work with my accountant?',
            a:
              'Gladly, and we prefer it. Where you have no Dutch adviser yet we introduce you to accountants who work with international founders and understand the 30 percent ruling, cross-border invoicing and the DGA salary rules.',
          },
        ],
      },
      faq: {
        title: 'What entrepreneurs ask',
        items: [
          {
            q: 'Can you handle the whole move or only parts of it?',
            a: 'Both. Most entrepreneurs hand us the entire project, but you can also bring us in for the piece that is stuck, typically housing or the permit sequence.',
          },
          {
            q: 'When should I involve you, before or after my permit?',
            a: 'Before, ideally. The permit route affects the company structure and even where you should live. Involving us early prevents expensive re-dos.',
          },
          {
            q: 'Do you work with entrepreneurs outside the Randstad?',
            a: 'Yes. We work across the Netherlands, with particular depth around Rotterdam and the southern industrial region where many of our clients build their businesses.',
          },
        ],
      },
      cta: {
        title: 'Move like it is your best business decision',
        text: 'Tell us where you stand: permit, company, family, housing. We will show you the order that gets you settled fastest.',
        label: 'Start my relocation plan',
      },
      form: 'immigration',
      image: '/images/entrepreneur-relocation.jpg?v=20260731',
      imageAlt: 'Entrepreneur arriving at a modern Dutch apartment building',
      image2: '/images/start-business.jpg?v=20260731',
      image2Alt: 'Founder in a design-led Dutch workspace',
    },
    {
      slug: 'business-relocation-to-the-netherlands',
      menuLabel: 'Business relocation',
      title: 'Business Relocation to the Netherlands',
      metaTitle: 'Business Relocation to the Netherlands | Corporate & Teams',
      metaDescription:
        'Relocate your company and your people to the Netherlands: entity setup, work permits, and multi-family corporate relocations for entire teams, managed by one partner.',
      eyebrow: 'Corporate',
      intro: [
        'Moving a business to the Netherlands is really two moves: the company, with its entity, contracts and registrations, and the people, with their permits, houses, schools and spouses. Companies that plan the first and improvise the second lose the very employees the move was for.',
        'We are built for both, and our home ground is the Rotterdam, Europoort and Maasvlakte industrial region, where international firms in energy, logistics and offshore land their European operations. We relocate entire teams and their families as one coordinated program.',
      ],
      cardText: 'Corporate relocations that move the entity, the team and every family behind it.',
      forWho: {
        title: 'Who engages us',
        items: [
          'International companies opening a Dutch office, plant or branch',
          'Firms transferring a team of specialists and their families at once',
          'HR and mobility managers who need one accountable local partner',
          'Companies in port, energy, logistics and offshore sectors settling in the region',
        ],
      },
      included: {
        title: 'The corporate program',
        blocks: [
          {
            title: 'Entity and compliance',
            text: 'Dutch entity or branch established, registered and ready to employ, coordinated with your legal and tax advisors.',
          },
          {
            title: 'Recognized sponsorship and permits',
            text: 'We guide your company through IND recognized sponsorship where needed and manage the work permit applications for every transferring employee.',
          },
          {
            title: 'Multi-family relocation',
            text: 'Each family gets its own housing search, school placements and settling-in track, run in parallel so the whole team starts on schedule.',
          },
          {
            title: 'One dashboard for HR',
            text: 'A single point of contact and a clear overview of where every employee and family stands, instead of thirty scattered email threads.',
          },
          {
            title: 'Aftercare that retains people',
            text: 'The first months decide whether families stay. We remain available to your employees after arrival, which protects the investment you made in moving them.',
          },
        ],
      },
      process: {
        title: 'From decision to operational',
        steps: [
          { title: 'Scope', text: 'We map the entity needs, the headcount, the families and the deadline into one program plan.' },
          { title: 'Mobilize', text: 'Company setup and permit applications run while housing and schools are secured per family.' },
          { title: 'Land the team', text: 'Arrivals are staggered and supported, registrations completed, and your Dutch operation opens with its people whole.' },
        ],
      },
      fees: {
        title: 'What a business relocation costs',
        kind: 'tailored',
        amount: 'Tailor-made proposal',
        amountNote:
          'Moving a business depends on how many people move with it, which permits they need and how fast the office has to open. You receive a customised proposal built around the actual headcount and timeline.',
        includes: [
          'Entity established and recognised sponsorship arranged where it is needed',
          'Immigration files for the team, sequenced against your opening date',
          'Housing for relocating staff and their families',
          'One coordinator for the whole move, reporting to one person on your side',
        ],
      },
      conditions: {
        title: 'What a corporate move involves',
        intro:
          'Moving an entity is a project with a critical path, and the immigration piece is almost always on it.',
        items: [
          'IND recognised sponsorship is required before a single highly skilled migrant application can be filed, and recognition itself takes weeks.',
          'Recognised sponsors accept ongoing duties of information, administration and care, and are audited against them.',
          'Each relocating employee needs their own file, and each accompanying family multiplies the document work.',
          'Salary thresholds apply per employee and are indexed annually, which affects budgeting for offers made late in the year.',
          'Posting workers from another EU entity is a different regime with its own notification duty, not a lighter version of the same thing.',
          'We handle immigration, housing and family landing. Corporate tax, transfer pricing and legal structuring stay with your advisers.',
        ],
      },
      details: {
        title: 'Running the project properly',
        items: [
          {
            q: 'How early should we start?',
            a:
              'Four to six months before the first arrival where sponsorship is not yet in place. Recognition, permits, housing and schools each have their own waiting time, and the only way to compress the total is to run them concurrently from an early enough start.',
          },
          {
            q: 'What does recognised sponsorship commit us to?',
            a:
              'Keeping records for each sponsored employee, informing the IND of relevant changes within four weeks, and taking reasonable care of the employee\'s landing. The IND audits. We set the administration up so that an audit is a formality rather than an event.',
          },
          {
            q: 'Can you handle several families at once?',
            a:
              'Yes, and it is a large part of what we do. Each family gets an individual consultant and its own plan, while HR gets a single point of contact and one overview rather than fifteen email threads.',
          },
          {
            q: 'What actually causes people to leave within a year?',
            a:
              'Rarely the job. It is the partner who could not find work, the child who never settled at school, or a housing situation that never felt like home. Those are relocation failures, not HR failures, and they are the specific things we are engaged to prevent.',
          },
        ],
      },
      faq: {
        title: 'Questions from HR and leadership',
        items: [
          {
            q: 'How many employees can you relocate at once?',
            a: 'Our model is deliberately boutique: fewer programs, run deeply. We take on team relocations at a scale where every family still gets personal attention, and we are honest when a request exceeds that.',
          },
          {
            q: 'Can you work alongside our existing legal or tax advisors?',
            a: 'Yes, and we prefer it. We coordinate the practical and human side and slot into the structure your advisors design.',
          },
          {
            q: 'What does a corporate relocation cost?',
            a: 'It depends on headcount, family sizes and housing requirements. We scope the program first and quote a clear project fee, not an hourly meter running in the background.',
          },
        ],
      },
      cta: {
        title: 'Move the company. Keep the people.',
        text: 'Tell us the size of the team and the target date. We will come back with a program outline and a realistic timeline.',
        label: 'Discuss our corporate move',
      },
      form: 'immigration',
      image: '/images/business-relocation.jpg?v=20260731',
      imageAlt: 'International leadership team in a Rotterdam boardroom',
      image2: '/images/employer-team.jpg?v=20260731',
      image2Alt: 'International team meeting in a Dutch office',
    },
    {
      slug: 'employer-immigration-services-netherlands',
      menuLabel: 'Employer immigration',
      title: 'Employer Immigration Services Netherlands',
      metaTitle: 'Employer Immigration Services Netherlands | Hiring Non-EU Staff',
      metaDescription:
        'Employer immigration services in the Netherlands: highly skilled migrant and EU Blue Card applications, IND recognised sponsorship, posting workers and immigration case review.',
      eyebrow: 'For employers',
      intro: [
        'Hiring international talent is often essential, and hiring non-EU employees in the Netherlands is rarely simple. It involves immigration procedures, compliance obligations and coordination with the IND, the Dutch Labour Authority and in some cases the UWV.',
        'We assist employers with Dutch immigration procedures for international employees, from a single specialist hire to a long-term workforce strategy. The aim is a process that is predictable and manageable for the company and for the person moving.',
      ],
      cardText: 'Immigration procedures, sponsorship and compliance for companies hiring internationally.',
      forWho: {
        title: 'Who we work with',
        items: [
          'Dutch companies recruiting specialists from outside the European Union',
          'Employers transferring staff from a foreign office to the Netherlands',
          'HR and mobility managers who need one accountable local partner',
          'Companies considering IND recognised sponsorship',
          'Organisations posting employees here temporarily for projects or assignments',
        ],
      },
      conditions: {
        title: 'What employers need to account for',
        intro:
          'Each immigration route carries its own requirements, documentation obligations and salary thresholds. Before a hire is confirmed it is worth knowing that:',
        items: [
          'A non-EU employee needs a residence basis in place before starting work',
          'Salary thresholds differ per route and are set by category',
          'Recognised sponsors carry ongoing compliance obligations towards the IND',
          'Sponsors must demonstrate reliability, financial stability and sound administration',
          'Posting employees can trigger notification obligations under Dutch labour regulations',
          'Immigration timelines affect recruitment planning and start dates',
        ],
      },
      included: {
        title: 'How we support employers',
        blocks: [
          {
            title: 'Choosing the immigration route',
            text: 'Highly skilled migrant permits, the EU Blue Card, combined residence and work permits (GVVA), orientation year graduates moving into employment, and intra-company transfers. We determine which one actually fits the role and the candidate.',
          },
          {
            title: 'Applications for your employees',
            text: 'We prepare the immigration applications, coordinate the documentation for IND submissions and advise on realistic timelines for relocation planning.',
          },
          {
            title: 'IND recognised sponsorship',
            text: 'We prepare recognised sponsor applications, advise on eligibility and documentation, review internal administrative procedures and keep you compliant with sponsor obligations.',
          },
          {
            title: 'Posting workers to the Netherlands',
            text: 'We review posting scenarios, advise on the applicable route, handle residence or work permit applications and make sure notification obligations are met.',
          },
          {
            title: 'Immigration strategy',
            text: 'We advise on structuring international hiring, planning timelines for relocation and onboarding, aligning immigration with employment contracts and managing compliance risk.',
          },
          {
            title: 'Immigration case review',
            text: 'For refused applications, status changes or eligibility questions, we analyse the situation in detail and set out the realistic options and next steps before a new application is started.',
          },
        ],
      },
      process: {
        title: 'How an employer engagement runs',
        steps: [
          { title: 'Scope', text: 'We map the roles, the nationalities involved, the deadlines and the compliance position of your company.' },
          { title: 'Route and documents', text: 'The suitable immigration route is confirmed per employee and the documentation is prepared for submission.' },
          { title: 'Submission and liaison', text: 'Applications go to the IND and we manage the correspondence, including questions and additional requests.' },
          { title: 'Arrival and settling in', text: 'Employees and their families are supported through registration, housing and the practical side of arriving.' },
        ],
      },
      fees: {
        title: 'What employer immigration support costs',
        kind: 'tailored',
        amount: 'Tailor-made proposal',
        amountNote:
          'Employer support is priced against volume and the level of sponsorship you need, from a single hire to a standing arrangement. You receive a proposal built around your hiring plan.',
        includes: [
          'Recognised sponsorship applied for and maintained',
          'Each hire assessed for route, salary criterion and start date before the offer goes out',
          'Applications prepared and filed for your candidates and their families',
          'Your record-keeping and reporting obligations kept audit-ready',
        ],
      },
      note: 'We are a boutique consultancy, which is a deliberate limit as much as a promise. We take on the volume we can run personally, and we say so plainly when a request exceeds it.',
      details: {
        title: 'Detail for HR and mobility teams',
        items: [
          {
            q: 'What does recognised sponsorship change?',
            a: 'Companies that regularly hire international professionals can become a recognised sponsor with the IND. It brings faster procedures, simplified applications and more flexibility when hiring. In return the company accepts ongoing compliance obligations and must be able to demonstrate reliability, financial stability and proper administrative procedures.',
          },
          {
            q: 'When do posting rules apply?',
            a: 'When an international company temporarily sends employees here for a project, assignment or corporate transfer. Depending on the situation, EU posting rules, work permit requirements, residence permit requirements for non-EU employees and Dutch notification obligations can all apply at once. Planning it carefully is what prevents delays and compliance risk.',
          },
          {
            q: 'When is a case review worth it?',
            a: 'When an application was previously refused, when an employee is changing immigration status or moving between visa categories, when eligibility is genuinely unclear, or when a recognised sponsor has a compliance question. A review gives you an assessment of the situation, the risks and obstacles, the available options and a recommended next step.',
          },
          {
            q: 'Can you work alongside our legal and tax advisors?',
            a: 'Yes, and we prefer it. We handle the immigration and human side of the move and slot into the structure your advisors design.',
          },
        ],
      },
      faq: {
        title: 'Questions from employers',
        items: [
          {
            q: 'How early should we involve you in a hire?',
            a: 'Before the contract is signed, ideally. The immigration route influences the salary, the start date and sometimes whether the hire is possible at all, and those are expensive things to discover afterwards.',
          },
          {
            q: 'Do you also support the employee and their family?',
            a: 'Yes. Housing, school search, municipality registration and settling in are part of what we do, and they are usually what determines whether a hire stays past year one.',
          },
          {
            q: 'Can you help a company that is not yet established in the Netherlands?',
            a: 'Yes. We set up the Dutch entity and the immigration track together, in the order that lets each step unlock the next.',
          },
        ],
      },
      cta: {
        title: 'Hiring international talent?',
        text: 'Tell us the role, the nationality and the target start date. We will come back with the route, the timeline and what your company needs to have in place.',
        label: 'Discuss our hiring plans',
      },
      form: 'immigration',
      image: '/images/employer-immigration.jpg',
      imageAlt: 'HR advisor and manager discussing an international hire',
      image2: '/images/employer-team.jpg',
      image2Alt: 'International team working together in a Dutch office',
    },
    {
      slug: 'housing-support-for-entrepreneurs-netherlands',
      menuLabel: 'Housing for entrepreneurs',
      title: 'Housing Support for Entrepreneurs Netherlands',
      metaTitle: 'Housing Support for Entrepreneurs in the Netherlands | E & I',
      metaDescription:
        'Housing support for entrepreneurs in the Netherlands: rentals without payslips, registration-ready addresses and personally attended viewings in a tough market.',
      eyebrow: 'Housing',
      intro: [
        'The Dutch housing market is hard on everyone and hardest on entrepreneurs. Landlords want payslips and employer statements; you have a young company, foreign bank statements and a strong story that nobody at a crowded viewing stays to hear.',
        'We tell that story for you. We know which landlords and agents accept entrepreneurial income, how to present a founder’s file so it wins against salaried bidders, and we attend viewings with you or for you when you are still abroad.',
      ],
      cardText: 'Winning rentals without payslips: files, viewings and negotiations for founders.',
      forWho: {
        title: 'Who needs this',
        items: [
          'Founders arriving on startup, DAFT or self-employed permits',
          'Entrepreneurs whose income is real but does not fit standard landlord checklists',
          'Business owners searching from abroad who cannot attend viewings',
          'Families of entrepreneurs needing a home near schools and the business',
        ],
      },
      included: {
        title: 'How we win you a home',
        blocks: [
          {
            title: 'A file that convinces landlords',
            text: 'Business accounts, contracts and references packaged into the format Dutch landlords and agents actually trust from self-employed tenants.',
          },
          {
            title: 'Targeted search',
            text: 'We search where your registration, commute and family needs intersect, including off-market homes through our agent network.',
          },
          {
            title: 'Viewings, attended',
            text: 'We view with you, or on video for you, and give you an honest verdict on the street, the building and the contract terms.',
          },
          {
            title: 'Negotiation and contract check',
            text: 'Price, deposit and clauses negotiated, and the rental contract reviewed before you sign, including whether the address supports business registration.',
          },
        ],
      },
      process: {
        title: 'The search, structured',
        steps: [
          { title: 'Profile', text: 'Budget, areas, family needs and registration requirements defined in one call.' },
          { title: 'Hunt', text: 'We shortlist, book and attend viewings fast, because good homes here go in days.' },
          { title: 'Secure', text: 'Offer negotiated, contract checked, keys handed over, registration arranged.' },
        ],
      },
      fees: {
        title: 'What housing support for entrepreneurs costs',
        kind: 'tailored',
        amount: 'Available upon request',
        amountNote:
          'Founders are usually judged differently by landlords than salaried tenants, so the work varies with your situation. You receive a fixed quotation after a first conversation.',
        includes: [
          'A search that accounts for how landlords assess self-employed income',
          'The evidence pack landlords ask founders for, prepared in advance',
          'Viewings arranged and attended',
          'Contract reviewed and negotiated before you sign',
        ],
      },
      note: 'Temporary housing can bridge the gap while we search, but not every short-stay address allows municipal registration. We flag that distinction before you commit to anything.',
      conditions: {
        title: 'Renting without payslips',
        intro:
          'Dutch landlords are built to read employment contracts. Everything below is about giving them something they can read instead.',
        items: [
          'Landlords typically want gross income of three to four times the rent, and for entrepreneurs they look for the equivalent in accounts and assets.',
          'Newly incorporated companies have no track record, so the founder\'s personal position usually carries the file.',
          'Expect requests for annual accounts, a year of bank statements, an accountant\'s statement, or a bank guarantee.',
          'Deposits are legally capped at two months of basic rent for contracts signed since 1 July 2023, and a larger deposit cannot be demanded instead.',
          'A guarantee from your BV or a personal guarantee is often accepted where documents alone are not.',
          'We act for you rather than for the landlord, and we take no commission from either side.',
        ],
      },
      details: {
        title: 'Building a file that convinces',
        items: [
          {
            q: 'What if my company is brand new?',
            a:
              'Then the file rests on you rather than on it. Personal savings, income from your previous country, existing client contracts, a signed statement from an accountant and a bank guarantee all work. What does not work is arriving at a viewing with an explanation instead of documents.',
          },
          {
            q: 'Is a bank guarantee normal here?',
            a:
              'It is common and entirely respectable for entrepreneurs. Your bank blocks an amount, typically two to three months of rent, and the landlord accepts that instead of an employment history. It usually costs a modest annual fee and it opens properties that would otherwise refuse you.',
          },
          {
            q: 'Should I say I am self-employed?',
            a:
              'Always, and early. Landlords who discover it at contract stage withdraw. Landlords who are told at the start, and shown a properly prepared file in Dutch, mostly proceed. Concealment is the single fastest way to lose a property you had already won.',
          },
          {
            q: 'Can I rent a home and use it as my business address?',
            a:
              'Often yes, for a consultancy or a service business with no visitors, but it depends on the lease and on the municipality\'s zoning rules. We check both before you register the address at the KvK, because unwinding it afterwards is unpleasant.',
          },
        ],
      },
      faq: {
        title: 'Entrepreneur housing questions',
        items: [
          {
            q: 'Can I rent without Dutch payslips?',
            a: 'Yes, with the right presentation. Landlords accept entrepreneurial income when it is documented convincingly, and some ask for additional deposit or prepaid rent. We negotiate those terms to something reasonable.',
          },
          {
            q: 'Can I register my company at my home address?',
            a: 'Often, if the lease permits it and the activities suit a residential setting. We check the contract and the municipality rules for your specific case before you sign.',
          },
          {
            q: 'How fast can you find something?',
            a: 'That depends on budget and area, and we will tell you honestly at intake what your criteria yield in the current market. What we never do is let you fly in without a plan for where you will sleep and register.',
          },
        ],
      },
      cta: {
        title: 'Find a home that works as hard as you do',
        text: 'Share your budget, your areas and your moving date. We will tell you what is realistic and start the search this week.',
        label: 'Start my housing search',
      },
      form: 'immigration',
      image: '/images/entrepreneur-housing.jpg',
      imageAlt: 'Bright live-work loft apartment with a desk by the window',
      image2: '/images/rental-contract.jpg?v=20260731',
      image2Alt: 'Signing a Dutch rental contract with a fountain pen',
    },
  ],
  crossLinks: [
    {
      path: '/immigration/startup-visa-netherlands',
      label: 'Startup visa',
      text: 'A one-year founder permit to build your innovative company with a recognized facilitator.',
    },
    {
      path: '/immigration/daft-visa-netherlands',
      label: 'DAFT visa',
      text: 'The treaty route that lets Americans live and work in the Netherlands with a 4,500 euro business investment.',
    },
  ],
};
