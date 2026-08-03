import type { ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';
import { site } from '../src/data/site.ts';

export const EXPAT_CONFIRMATION_LOCALES = ['en', 'nl', 'de', 'fr', 'es', 'it', 'pt', 'zh', 'ru'] as const;

type ExpatConfirmationLocale = (typeof EXPAT_CONFIRMATION_LOCALES)[number];
type ExpatFormKind = 'immigration' | 'relocation' | 'vip';
type ExpatConfirmationField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'service'
  | 'nationality'
  | 'currentLocation'
  | 'status'
  | 'timeline'
  | 'movingFrom'
  | 'household'
  | 'package'
  | 'preferredContact'
  | 'arrival';
type ExpatConfirmationCopy = Omit<ConfirmationEmailCopy, 'fieldLabels'> & {
  fieldLabels: Record<ExpatConfirmationField, string>;
};

const translations = {
  en: {
    subject: 'We received your inquiry - {siteName}',
    preheader: 'Thank you for contacting E & I. Johanna will reply within one business day.',
    greeting: 'Dear {name},',
    receiptMessage: 'Thank you for contacting {siteName}. We have safely received your inquiry.',
    followUpMessage: 'Johanna will personally review your situation and reply within one business day, usually much sooner.',
    detailsHeading: 'Your inquiry',
    messageHeading: 'Your message',
    referenceLabel: 'Reference',
    fieldLabels: {
      firstName: 'First name', lastName: 'Last name', email: 'Email address', phone: 'Phone / WhatsApp',
      service: 'Service', nationality: 'Nationality', currentLocation: 'Current country of residence',
      status: 'Current immigration status', timeline: 'Timeline', movingFrom: 'Moving from',
      household: 'Who is relocating', package: 'Package', preferredContact: 'Preferred contact', arrival: 'Planned arrival',
    },
    contactPrompt: 'Questions in the meantime? Reply to this email or contact us at',
    ctaLabel: 'Visit our website',
    footerText: 'Personal immigration and relocation guidance in the Netherlands.',
  },
  nl: {
    subject: 'Wij hebben uw aanvraag ontvangen - {siteName}',
    preheader: 'Dank u voor uw bericht aan E & I. Johanna reageert binnen één werkdag.',
    greeting: 'Beste {name},',
    receiptMessage: 'Dank u voor uw bericht aan {siteName}. Wij hebben uw aanvraag goed ontvangen.',
    followUpMessage: 'Johanna bekijkt uw situatie persoonlijk en reageert binnen één werkdag, meestal veel sneller.',
    detailsHeading: 'Uw aanvraag',
    messageHeading: 'Uw bericht',
    referenceLabel: 'Referentie',
    fieldLabels: {
      firstName: 'Voornaam', lastName: 'Achternaam', email: 'E-mailadres', phone: 'Telefoon / WhatsApp',
      service: 'Dienst', nationality: 'Nationaliteit', currentLocation: 'Huidig woonland',
      status: 'Huidige immigratiestatus', timeline: 'Tijdlijn', movingFrom: 'Verhuizend vanuit',
      household: 'Wie verhuist er', package: 'Pakket', preferredContact: 'Voorkeurscontact', arrival: 'Geplande aankomst',
    },
    contactPrompt: 'Heeft u intussen een vraag? Beantwoord deze e-mail of neem contact met ons op via',
    ctaLabel: 'Bezoek onze website',
    footerText: 'Persoonlijke begeleiding bij immigratie en relocation in Nederland.',
  },
  de: {
    subject: 'Wir haben Ihre Anfrage erhalten - {siteName}',
    preheader: 'Vielen Dank für Ihre Nachricht an E & I. Johanna antwortet innerhalb eines Werktags.',
    greeting: 'Guten Tag {name},',
    receiptMessage: 'Vielen Dank für Ihre Nachricht an {siteName}. Ihre Anfrage ist sicher bei uns eingegangen.',
    followUpMessage: 'Johanna prüft Ihre Situation persönlich und antwortet innerhalb eines Werktags, meist deutlich schneller.',
    detailsHeading: 'Ihre Anfrage',
    messageHeading: 'Ihre Nachricht',
    referenceLabel: 'Referenz',
    fieldLabels: {
      firstName: 'Vorname', lastName: 'Nachname', email: 'E-Mail-Adresse', phone: 'Telefon / WhatsApp',
      service: 'Leistung', nationality: 'Staatsangehörigkeit', currentLocation: 'Aktuelles Wohnsitzland',
      status: 'Aktueller Aufenthaltsstatus', timeline: 'Zeitrahmen', movingFrom: 'Umzug aus',
      household: 'Wer zieht um', package: 'Paket', preferredContact: 'Bevorzugter Kontaktweg', arrival: 'Geplante Ankunft',
    },
    contactPrompt: 'Haben Sie inzwischen eine Frage? Antworten Sie auf diese E-Mail oder kontaktieren Sie uns unter',
    ctaLabel: 'Unsere Website besuchen',
    footerText: 'Persönliche Beratung zu Einwanderung und Umzug in die Niederlande.',
  },
  fr: {
    subject: 'Nous avons reçu votre demande - {siteName}',
    preheader: 'Merci d’avoir contacté E & I. Johanna vous répondra sous un jour ouvré.',
    greeting: 'Bonjour {name},',
    receiptMessage: 'Merci d’avoir contacté {siteName}. Nous avons bien reçu votre demande.',
    followUpMessage: 'Johanna étudiera personnellement votre situation et vous répondra sous un jour ouvré, souvent bien plus vite.',
    detailsHeading: 'Votre demande',
    messageHeading: 'Votre message',
    referenceLabel: 'Référence',
    fieldLabels: {
      firstName: 'Prénom', lastName: 'Nom', email: 'Adresse e-mail', phone: 'Téléphone / WhatsApp',
      service: 'Service', nationality: 'Nationalité', currentLocation: 'Pays de résidence actuel',
      status: 'Statut d’immigration actuel', timeline: 'Calendrier', movingFrom: 'Vous partez de',
      household: 'Qui déménage', package: 'Forfait', preferredContact: 'Contact préféré', arrival: 'Arrivée prévue',
    },
    contactPrompt: 'Une question entre-temps ? Répondez à cet e-mail ou contactez-nous à',
    ctaLabel: 'Visiter notre site',
    footerText: 'Accompagnement personnalisé pour l’immigration et la relocation aux Pays-Bas.',
  },
  es: {
    subject: 'Hemos recibido su consulta - {siteName}',
    preheader: 'Gracias por ponerse en contacto con E & I. Johanna responderá en un día laborable.',
    greeting: 'Estimado/a {name}:',
    receiptMessage: 'Gracias por contactar con {siteName}. Hemos recibido correctamente su consulta.',
    followUpMessage: 'Johanna revisará personalmente su situación y le responderá en el plazo de un día laborable, normalmente mucho antes.',
    detailsHeading: 'Su consulta',
    messageHeading: 'Su mensaje',
    referenceLabel: 'Referencia',
    fieldLabels: {
      firstName: 'Nombre', lastName: 'Apellidos', email: 'Correo electrónico', phone: 'Teléfono / WhatsApp',
      service: 'Servicio', nationality: 'Nacionalidad', currentLocation: 'País de residencia actual',
      status: 'Situación migratoria actual', timeline: 'Plazo', movingFrom: 'Se muda desde',
      household: 'Quién se reubica', package: 'Paquete', preferredContact: 'Contacto preferido', arrival: 'Llegada prevista',
    },
    contactPrompt: '¿Tiene alguna pregunta mientras tanto? Responda a este correo o escríbanos a',
    ctaLabel: 'Visitar nuestro sitio web',
    footerText: 'Asesoramiento personal sobre inmigración y reubicación en los Países Bajos.',
  },
  it: {
    subject: 'Abbiamo ricevuto la sua richiesta - {siteName}',
    preheader: 'Grazie per aver contattato E & I. Johanna risponderà entro un giorno lavorativo.',
    greeting: 'Gentile {name},',
    receiptMessage: 'Grazie per aver contattato {siteName}. Abbiamo ricevuto correttamente la sua richiesta.',
    followUpMessage: 'Johanna esaminerà personalmente la sua situazione e risponderà entro un giorno lavorativo, di solito molto prima.',
    detailsHeading: 'La sua richiesta',
    messageHeading: 'Il suo messaggio',
    referenceLabel: 'Riferimento',
    fieldLabels: {
      firstName: 'Nome', lastName: 'Cognome', email: 'Indirizzo e-mail', phone: 'Telefono / WhatsApp',
      service: 'Servizio', nationality: 'Cittadinanza', currentLocation: 'Paese di residenza attuale',
      status: 'Situazione attuale in materia di soggiorno', timeline: 'Tempistiche', movingFrom: 'Si trasferisce da',
      household: 'Chi si trasferisce', package: 'Pacchetto', preferredContact: 'Contatto preferito', arrival: 'Arrivo previsto',
    },
    contactPrompt: 'Ha domande nel frattempo? Risponda a questa e-mail o ci contatti all’indirizzo',
    ctaLabel: 'Visiti il nostro sito',
    footerText: 'Assistenza personale per immigrazione e trasferimento nei Paesi Bassi.',
  },
  pt: {
    subject: 'Recebemos o seu pedido - {siteName}',
    preheader: 'Obrigado por contactar a E & I. A Johanna responderá no prazo de um dia útil.',
    greeting: 'Caro/a {name},',
    receiptMessage: 'Obrigado por contactar a {siteName}. Recebemos o seu pedido com sucesso.',
    followUpMessage: 'A Johanna analisará pessoalmente a sua situação e responderá no prazo de um dia útil, normalmente muito antes.',
    detailsHeading: 'O seu pedido',
    messageHeading: 'A sua mensagem',
    referenceLabel: 'Referência',
    fieldLabels: {
      firstName: 'Nome', lastName: 'Apelido', email: 'Endereço de e-mail', phone: 'Telefone / WhatsApp',
      service: 'Serviço', nationality: 'Nacionalidade', currentLocation: 'País de residência atual',
      status: 'Situação atual de residência', timeline: 'Prazo', movingFrom: 'Vem de',
      household: 'Quem se muda', package: 'Pacote', preferredContact: 'Contacto preferido', arrival: 'Chegada prevista',
    },
    contactPrompt: 'Tem alguma questão entretanto? Responda a este e-mail ou contacte-nos através de',
    ctaLabel: 'Visitar o nosso site',
    footerText: 'Acompanhamento pessoal de imigração e relocation nos Países Baixos.',
  },
  zh: {
    subject: '我们已收到您的咨询 - {siteName}',
    preheader: '感谢您联系 E & I。Johanna 将在一个工作日内回复。',
    greeting: '{name}，您好！',
    receiptMessage: '感谢您联系 {siteName}。我们已安全收到您的咨询。',
    followUpMessage: 'Johanna 将亲自查看您的情况，并在一个工作日内回复，通常会更快。',
    detailsHeading: '您的咨询',
    messageHeading: '您的留言',
    referenceLabel: '参考编号',
    fieldLabels: {
      firstName: '名字', lastName: '姓氏', email: '电子邮箱', phone: '电话 / WhatsApp',
      service: '服务', nationality: '国籍', currentLocation: '目前居住的国家',
      status: '当前移民身份', timeline: '时间安排', movingFrom: '从哪里搬来',
      household: '谁将一同搬迁', package: '套餐', preferredContact: '首选联系方式', arrival: '计划抵达时间',
    },
    contactPrompt: '如有任何问题，请直接回复此邮件或通过以下邮箱联系我们：',
    ctaLabel: '访问我们的网站',
    footerText: '为您提供荷兰移民与安居搬迁的个性化服务。',
  },
  ru: {
    subject: 'Мы получили ваш запрос - {siteName}',
    preheader: 'Благодарим за обращение в E & I. Джоанна ответит в течение одного рабочего дня.',
    greeting: 'Здравствуйте, {name}!',
    receiptMessage: 'Благодарим за обращение в {siteName}. Ваш запрос успешно получен.',
    followUpMessage: 'Джоанна лично изучит вашу ситуацию и ответит в течение одного рабочего дня, как правило значительно быстрее.',
    detailsHeading: 'Ваш запрос',
    messageHeading: 'Ваше сообщение',
    referenceLabel: 'Номер запроса',
    fieldLabels: {
      firstName: 'Имя', lastName: 'Фамилия', email: 'Электронная почта', phone: 'Телефон / WhatsApp',
      service: 'Услуга', nationality: 'Гражданство', currentLocation: 'Страна проживания сейчас',
      status: 'Текущий иммиграционный статус', timeline: 'Сроки', movingFrom: 'Откуда переезжаете',
      household: 'Кто переезжает', package: 'Пакет', preferredContact: 'Предпочтительный способ связи', arrival: 'Планируемый приезд',
    },
    contactPrompt: 'Если у вас появились вопросы, ответьте на это письмо или напишите нам по адресу',
    ctaLabel: 'Перейти на наш сайт',
    footerText: 'Персональное сопровождение по вопросам иммиграции и переезда в Нидерланды.',
  },
} satisfies Record<ExpatConfirmationLocale, ExpatConfirmationCopy>;

const alternateFollowUpMessages = {
  relocation: {
    en: 'Johanna will personally review your plans and reply within one business day, usually much sooner.',
    nl: 'Johanna bekijkt uw plannen persoonlijk en reageert binnen één werkdag, meestal veel sneller.',
    de: 'Johanna prüft Ihre Pläne persönlich und antwortet innerhalb eines Werktags, meist deutlich schneller.',
    fr: 'Johanna étudiera personnellement votre projet et vous répondra sous un jour ouvré, souvent bien plus vite.',
    es: 'Johanna revisará personalmente sus planes y le responderá en el plazo de un día laborable, normalmente mucho antes.',
    it: 'Johanna esaminerà personalmente i suoi progetti e risponderà entro un giorno lavorativo, di solito molto prima.',
    pt: 'A Johanna analisará pessoalmente os seus planos e responderá no prazo de um dia útil, normalmente muito antes.',
    zh: 'Johanna 将亲自查看您的搬迁计划，并在一个工作日内回复，通常会更快。',
    ru: 'Джоанна лично изучит ваши планы и ответит в течение одного рабочего дня, как правило значительно быстрее.',
  },
  vip: {
    en: 'Johanna will contact you personally, day or night. For immediate assistance, message us on WhatsApp.',
    nl: 'Johanna neemt persoonlijk contact met u op, dag of nacht. Stuur ons voor directe hulp een WhatsApp-bericht.',
    de: 'Johanna meldet sich persönlich bei Ihnen, tagsüber oder nachts. Für sofortige Hilfe schreiben Sie uns auf WhatsApp.',
    fr: 'Johanna vous contactera personnellement, de jour comme de nuit. Pour une assistance immédiate, écrivez-nous sur WhatsApp.',
    es: 'Johanna se pondrá en contacto con usted personalmente, de día o de noche. Para recibir ayuda inmediata, escríbanos por WhatsApp.',
    it: 'Johanna la contatterà personalmente, di giorno o di notte. Per assistenza immediata, ci scriva su WhatsApp.',
    pt: 'A Johanna entrará em contacto consigo pessoalmente, de dia ou de noite. Para assistência imediata, envie-nos uma mensagem pelo WhatsApp.',
    zh: 'Johanna 会亲自与您联系，无论白天还是夜晚。如需即时协助，请通过 WhatsApp 联系我们。',
    ru: 'Джоанна свяжется с вами лично в любое время суток. Если помощь нужна немедленно, напишите нам в WhatsApp.',
  },
} satisfies Record<Exclude<ExpatFormKind, 'immigration'>, Record<ExpatConfirmationLocale, string>>;

const brand = {
  logoUrl: `${site.url}/images/logo.png`,
  logoAlt: 'E & I Expat & Immigration Services',
  websiteUrl: site.url,
  contactEmail: site.email,
};

function createConfirmationEmail(kind: ExpatFormKind): LocalizedConfirmationEmailConfig {
  return {
    defaultLocale: 'en',
    translations: Object.fromEntries(EXPAT_CONFIRMATION_LOCALES.map((locale) => [
      locale,
      {
        ...translations[locale],
        followUpMessage: kind === 'immigration'
          ? translations[locale].followUpMessage
          : alternateFollowUpMessages[kind][locale],
      },
    ])),
    brand,
  };
}

export const expatConfirmationEmails = {
  immigration: createConfirmationEmail('immigration'),
  relocation: createConfirmationEmail('relocation'),
  vip: createConfirmationEmail('vip'),
} satisfies Record<ExpatFormKind, LocalizedConfirmationEmailConfig>;
