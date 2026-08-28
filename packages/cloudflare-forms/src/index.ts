type FormErrorCode = 'validation' | 'turnstile' | 'attachments' | 'email' | 'server';

export type CloudflareFormsEnv = {
  FORM_UPLOADS: R2Bucket;
  LEAD_EMAIL: SendEmail;
  TURNSTILE_SECRET_KEY: string;
  SITE_ID: string;
  LEAD_RECIPIENT: string;
  LEAD_SENDER: string;
};

export type LeadFormConfig = {
  formPath: string;
  locale?: 'nl' | 'en';
  siteName: string;
  ownerName?: string;
  senderName: string;
  subjectPrefix: string;
  confirmationFollowUpSentence?: string;
  requiredFields?: LeadFormRequiredField[];
  emailFields?: LeadFormEmailField[];
  subjectFields?: string[];
  /**
   * Glue between the subject prefix and the subject fields. Defaults to the
   * ' - ' every existing site was built against; a site whose owner wants a
   * pipe-delimited subject ("NEW LEAD | domain.nl | Name") passes ' | '.
   */
  subjectSeparator?: string;
  /**
   * Extra rows for the owner notification only. Campaign attribution (source,
   * medium, campaign, landing URL, referrer) belongs in the lead email but not
   * in the confirmation the visitor receives, so it cannot go in `emailFields`.
   */
  leadOnlyEmailFields?: LeadFormEmailField[];
  messageField?: string;
  serviceOtherField?: string;
  requireFirstName?: boolean;
  requireLastName?: boolean;
  requireEmail?: boolean;
  attachmentMaxFiles?: number;
  attachmentMaxFileBytes?: number;
  attachmentMaxTotalBytes?: number;
  allowedFileTypes?: string[];
  allowedFileExtensions?: string[];
  optionalEmailWhen?: LeadFormCondition[];
  skipTurnstileWhen?: LeadFormCondition[];
  /** Disable Turnstile for this form. Defaults to true so existing clients retain protection. */
  turnstile?: boolean;
  /** Optional hidden field that silently accepts bot submissions without storing or emailing them. */
  honeypotField?: string;
  /**
   * Opt-in, per-submission confirmation email localization and branding.
   * When omitted, the existing Dutch/English confirmation renderer is used.
   */
  confirmationEmail?: LocalizedConfirmationEmailConfig;
  /**
   * Opt-in wording for the confirmation the visitor receives from the default
   * renderer, which was written for quote requests ("Uw offerteaanvraag voor
   * {siteName} is verstuurd", "Uw aanvraag", "Projectomschrijving"). That is
   * the wrong word wherever the form is not a quote: a museum's newsletter
   * opt-in confirmed as an offerteaanvraag reads to the visitor as a mistake,
   * and a client reads it as one too. Every field falls back to the copy this
   * package has always sent, so a form that leaves this out is unchanged.
   * Ignored when `confirmationEmail` is set: that renderer carries its own
   * translations.
   */
  confirmationCopy?: ConfirmationCopy;
  /**
   * Opt-in wording for the lead notification email. The defaults are written for
   * quote requests ("Nieuwe offerteaanvraag", "Projectomschrijving"), which is
   * wrong for sites that are not selling a job — a holiday rental takes booking
   * enquiries, not quotes. Every field falls back to the copy this package has
   * always used, so a config that leaves this out renders exactly as before.
   */
  leadEmail?: LeadEmailCopy;
};

export type LeadEmailCopy = {
  /** Headline of the notification. Default: `Nieuwe offerteaanvraag voor {siteName}` (`New request for {siteName}` when locale is 'en'). */
  heading?: string;
  /** Heading above the free-text field. Default: `Projectomschrijving` (`Message` when locale is 'en'). */
  messageHeading?: string;
  /** Labels of the three built-in rows. These have always been Dutch regardless of locale. */
  nameLabels?: {firstName?: string; lastName?: string; email?: string};
  /**
   * Whether the notification carries the free-text field. Default true. A form
   * that has none (a newsletter opt-in asks for a name and an address) mails
   * the owner an empty project description under a heading, every time.
   */
  includeMessage?: boolean;
  /** Whether the notification carries the attachments block. Default true; a form that takes no files says "Geen bijlagen meegestuurd." forever. */
  includeAttachments?: boolean;
};

export type ConfirmationCopy = {
  /** Subject. Default: `Uw offerteaanvraag is ontvangen - {siteName}` (`Your request has been received - {siteName}` when locale is 'en'). `{siteName}` is substituted. */
  subject?: string;
  /** The sentence under the greeting. Default: `Uw offerteaanvraag voor {siteName} is verstuurd.` (`Your request to {siteName} has been sent.`). `{siteName}` is substituted. */
  openingSentence?: string;
  /** Heading above the copy of what was filled in. Default: `Uw aanvraag` (`Your request`). */
  detailsHeading?: string;
  /** Heading above the free-text field. Default: `Projectomschrijving` (`Message`). */
  messageHeading?: string;
  /**
   * Whether the confirmation reads back what was filled in. Default true. An
   * opt-in that asks for nothing but a name and an address has nothing worth
   * repeating: it would tell the visitor their own address and then print an
   * empty project description under a heading calling it a request.
   */
  includeSubmission?: boolean;
};

export const CONFIRMATION_LOCALE_FIELD = '__jiw_confirmation_locale';

export type LocalizedConfirmationEmailConfig = {
  defaultLocale: string;
  translations: Record<string, ConfirmationEmailCopy>;
  brand: ConfirmationEmailBrand;
};

export type ConfirmationEmailCopy = {
  subject: string;
  preheader: string;
  greeting: string;
  receiptMessage: string;
  followUpMessage: string;
  detailsHeading: string;
  messageHeading: string;
  referenceLabel: string;
  fieldLabels: Record<string, string>;
  contactPrompt: string;
  ctaLabel: string;
  footerText: string;
};

export type ConfirmationEmailBrand = {
  logoUrl: string;
  logoAlt: string;
  websiteUrl: string;
  contactEmail: string;
  /**
   * Rendered width of the logo in pixels. Defaults to 360, which suits a wide
   * wordmark; a compact square mark wants something much smaller. Supply the
   * image at twice this so it stays sharp on a retina screen.
   */
  logoWidth?: number;
  /**
   * Palette of the confirmation email. The defaults are the navy-and-gold of the
   * first site that used this renderer, so a brand that leaves this out gets
   * exactly what it got before — but every other site should pass its own, or
   * its guests receive an email in someone else's colours.
   */
  colors?: Partial<ConfirmationEmailColors>;
};

export type ConfirmationEmailColors = {
  /** Behind the email body. */
  pageBackground: string;
  /** The card the content sits on. */
  surface: string;
  /** Tinted panels: logo bar, detail table, quoted message. */
  surfaceAlt: string;
  border: string;
  /** Dark band, headings and links. */
  ink: string;
  /** Text on the dark band. */
  onInk: string;
  /** Body copy. */
  inkSoft: string;
  muted: string;
  mutedSoft: string;
  /** Hairlines and the kicker above the dark band's heading. */
  accent: string;
  button: string;
  onButton: string;
};

const DEFAULT_CONFIRMATION_COLORS: ConfirmationEmailColors = {
  pageBackground: '#f4f1e8',
  surface: '#ffffff',
  surfaceAlt: '#fffdf8',
  border: '#e6e0d4',
  ink: '#00143a',
  onInk: '#ffffff',
  inkSoft: '#344054',
  muted: '#667085',
  mutedSoft: '#475467',
  accent: '#d4af37',
  button: '#d4af37',
  onButton: '#00143a',
};

export type LeadFormRequiredField = {
  name: string;
  label: string;
  message?: string;
  when?: LeadFormCondition;
};

export type LeadFormEmailField = {
  name: string;
  label: string;
  when?: LeadFormCondition;
};

export type LeadFormCondition = {
  field: string;
  equals: string;
};

type SubmissionFields = {
  firstName: string;
  lastName: string;
  email: string;
  fields: Record<string, string>;
};

type StoredAttachment = {
  id: string;
  name: string;
  key: string;
  size: number;
  type: string;
};

type SubmissionManifest = {
  submissionId: string;
  siteId: string;
  createdAt: string;
  fields: SubmissionFields;
  attachments: StoredAttachment[];
  downloadToken: string;
};

type TurnstileResponse = {
  success: boolean;
  'error-codes'?: string[];
};

const defaultAllowedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
const defaultAllowedFileExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'pdf'];

type ResolvedLeadFormConfig = Required<
  Omit<LeadFormConfig, 'confirmationEmail' | 'leadEmail' | 'confirmationCopy'>
> & {
  confirmationEmail?: LocalizedConfirmationEmailConfig;
  leadEmail?: LeadEmailCopy;
  confirmationCopy?: ConfirmationCopy;
};

/** Headline of the lead notification, defaulting to the quote-request wording. */
function leadHeading(config: ResolvedLeadFormConfig): string {
  if (config.leadEmail?.heading) return config.leadEmail.heading;
  return config.locale === 'en'
    ? `New request for ${config.siteName}`
    : `Nieuwe offerteaanvraag voor ${config.siteName}`;
}

/** Heading above the free-text field of the lead notification. */
function leadMessageHeading(config: ResolvedLeadFormConfig): string {
  if (config.leadEmail?.messageHeading) return config.leadEmail.messageHeading;
  return config.locale === 'en' ? 'Message' : 'Projectomschrijving';
}

/** Whether the notification carries the free-text field. */
function leadShowsMessage(config: ResolvedLeadFormConfig): boolean {
  return config.leadEmail?.includeMessage !== false;
}

/** Whether the notification carries the attachments block. */
function leadShowsAttachments(config: ResolvedLeadFormConfig): boolean {
  return config.leadEmail?.includeAttachments !== false;
}

/** Subject of the confirmation, defaulting to the quote-request wording. */
function confirmationSubject(config: ResolvedLeadFormConfig): string {
  const copy = config.confirmationCopy?.subject;
  if (copy) return formatCopy(copy, { siteName: config.siteName });
  return config.locale === 'en'
    ? `Your request has been received - ${config.siteName}`
    : `Uw offerteaanvraag is ontvangen - ${config.siteName}`;
}

/** What the confirmation says was sent, under the greeting. */
function confirmationOpeningSentence(config: ResolvedLeadFormConfig): string {
  const copy = config.confirmationCopy?.openingSentence;
  if (copy) return formatCopy(copy, { siteName: config.siteName });
  return config.locale === 'en'
    ? `Your request to ${config.siteName} has been sent.`
    : `Uw offerteaanvraag voor ${config.siteName} is verstuurd.`;
}

/** Heading above the copy of what was filled in. */
function confirmationDetailsHeading(config: ResolvedLeadFormConfig): string {
  return config.confirmationCopy?.detailsHeading ?? (config.locale === 'en' ? 'Your request' : 'Uw aanvraag');
}

/** Heading above the free-text field of the confirmation. */
function confirmationMessageHeading(config: ResolvedLeadFormConfig): string {
  return config.confirmationCopy?.messageHeading ?? (config.locale === 'en' ? 'Message' : 'Projectomschrijving');
}

/** Whether the confirmation reads back what was filled in. */
function confirmationShowsSubmission(config: ResolvedLeadFormConfig): boolean {
  return config.confirmationCopy?.includeSubmission !== false;
}

export function createFormWorker(config: LeadFormConfig): ExportedHandler<CloudflareFormsEnv> {
  const settings = withDefaults(config);

  return {
    async fetch(request, env) {
      const url = new URL(request.url);

      if (request.method === 'POST' && url.pathname === settings.formPath) {
        return handleSubmission(request, env, settings);
      }

      if (request.method === 'POST' && url.pathname === `${settings.formPath}/log`) {
        return handleClientLog(request);
      }

      if (request.method === 'GET' && url.pathname.startsWith(`${settings.formPath}/attachments/`)) {
        return handleAttachmentDownload(request, env, settings);
      }

      return jsonError('server', settings.locale === 'en' ? 'Not found.' : 'Niet gevonden.', 404);
    },
  };
}

function withDefaults(config: LeadFormConfig): ResolvedLeadFormConfig {
  return {
    locale: 'nl',
    ownerName: 'Eigenaar',
    confirmationFollowUpSentence: 'We nemen binnen 24 tot 48 uur contact met u op.',
    requiredFields: [],
    emailFields: [],
    subjectFields: [],
    subjectSeparator: ' - ',
    leadOnlyEmailFields: [],
    messageField: 'message',
    serviceOtherField: 'serviceOther',
    requireFirstName: true,
    requireLastName: true,
    requireEmail: true,
    attachmentMaxFiles: 5,
    attachmentMaxFileBytes: 10 * 1024 * 1024,
    attachmentMaxTotalBytes: 50 * 1024 * 1024,
    allowedFileTypes: defaultAllowedFileTypes,
    allowedFileExtensions: defaultAllowedFileExtensions,
    optionalEmailWhen: [],
    skipTurnstileWhen: [],
    turnstile: true,
    honeypotField: '',
    ...config,
  };
}

async function handleSubmission(
  request: Request,
  env: CloudflareFormsEnv,
  config: ResolvedLeadFormConfig,
): Promise<Response> {
  const cf = (request as Request & { cf?: Record<string, unknown> }).cf ?? {};
  const reqMeta = {
    ip: request.headers.get('CF-Connecting-IP'),
    ua: request.headers.get('user-agent'),
    referer: request.headers.get('referer'),
    contentType: request.headers.get('content-type'),
    contentLength: request.headers.get('content-length'),
    country: cf.country,
    asn: cf.asOrganization,
    colo: cf.colo,
  };

  try {
    const form = await request.formData();
    const confirmationLocale = resolveConfirmationLocale(form, config.confirmationEmail);
    if (config.honeypotField && getString(form, config.honeypotField)) {
      console.log('form_rejected', { reason: 'honeypot', ...reqMeta });
      return jsonResponse({ ok: true });
    }
    const fields = parseFields(form, Boolean(config.confirmationEmail), config.honeypotField);
    const turnstileToken = getString(form, 'cf-turnstile-response');
    const fileEntries = form.getAll('files').filter((value): value is File => value instanceof File && value.size > 0);
    const message = getFieldValue(fields, config.messageField);
    const fieldsPresent = {
      hasFirstName: Boolean(fields.firstName),
      hasLastName: Boolean(fields.lastName),
      hasEmail: Boolean(fields.email),
      messageLength: message.length,
      service: getDisplayFieldValue(fields, 'service', config),
      hasTurnstileToken: Boolean(turnstileToken),
      fileCount: fileEntries.length,
      totalFileBytes: fileEntries.reduce((sum, file) => sum + file.size, 0),
    };
    const validationError = validateFields(fields, config);

    if (validationError) {
      console.log('form_rejected', { reason: 'validation', message: validationError, ...fieldsPresent, ...reqMeta });
      return jsonError('validation', validationError, 400);
    }

    const shouldSkipTurnstile = !config.turnstile || config.skipTurnstileWhen.some((condition) => conditionMatches(fields, condition));
    const turnstileValid = shouldSkipTurnstile || (await validateTurnstile(env.TURNSTILE_SECRET_KEY, turnstileToken, request));
    if (!turnstileValid) {
      console.log('form_rejected', { reason: 'turnstile', ...fieldsPresent, ...reqMeta });
      return jsonError('turnstile', 'De spamcontrole is verlopen. Probeer het formulier opnieuw te versturen.', 400);
    }

    const files = fileEntries;
    const attachmentError = validateAttachments(files, config);
    if (attachmentError) {
      console.log('form_rejected', { reason: 'attachments', message: attachmentError, ...fieldsPresent, ...reqMeta });
      return jsonError('attachments', attachmentError, 400);
    }

    const createdAt = new Date();
    const submissionId = crypto.randomUUID();
    const downloadToken = randomToken();
    const prefix = makeSubmissionPrefix(env.SITE_ID, createdAt, submissionId);
    const attachments = await storeAttachments(env.FORM_UPLOADS, files, prefix);
    const manifest: SubmissionManifest = {
      submissionId,
      siteId: env.SITE_ID,
      createdAt: createdAt.toISOString(),
      fields,
      attachments,
      downloadToken,
    };

    await env.FORM_UPLOADS.put(`${prefix}/submission.json`, JSON.stringify(manifest, null, 2), {
      httpMetadata: { contentType: 'application/json; charset=utf-8' },
    });

    const origin = new URL(request.url).origin;
    await sendLeadEmail(env, config, manifest, origin);
    await sendConfirmationEmail(env, config, manifest, confirmationLocale);

    console.log('form_accepted', {
      submissionId,
      attachmentCount: attachments.length,
      totalFileBytes: attachments.reduce((sum, attachment) => sum + attachment.size, 0),
      ...reqMeta,
    });
    return jsonResponse({ ok: true, submissionId });
  } catch (error) {
    console.error('form_failed', { error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error, ...reqMeta });
    return jsonError(
      'server',
      config.locale === 'en' ? `The request could not be processed. Please contact ${config.siteName} directly by phone or email.` : `De aanvraag kon niet worden verwerkt. Neem direct telefonisch of per e-mail contact op met ${config.siteName}.`,
      500,
    );
  }
}

async function handleClientLog(request: Request): Promise<Response> {
  try {
    const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const cf = (request as Request & { cf?: Record<string, unknown> }).cf ?? {};
    console.error('client_form_error', {
      payload,
      ip: request.headers.get('CF-Connecting-IP'),
      ua: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      country: cf.country,
      colo: cf.colo,
      asn: cf.asOrganization,
    });
  } catch (error) {
    console.error('client_form_error_parse_failed', error);
  }
  return jsonResponse({ ok: true });
}

async function handleAttachmentDownload(
  request: Request,
  env: CloudflareFormsEnv,
  config: ResolvedLeadFormConfig,
): Promise<Response> {
  const url = new URL(request.url);
  const rawParts = url.pathname.slice(`${config.formPath}/attachments/`.length).split('/');
  if (rawParts.length < 5) return jsonError('validation', 'Ongeldige downloadlink.', 400);

  const [year, month, submissionId, attachmentId] = rawParts.map(decodeURIComponent);
  const token = url.searchParams.get('token') ?? '';
  const prefix = `${env.SITE_ID}/${year}/${month}/${submissionId}`;
  const manifestObject = await env.FORM_UPLOADS.get(`${prefix}/submission.json`);
  if (!manifestObject) return jsonError('validation', 'Bijlage niet gevonden.', 404);

  const manifest = await manifestObject.json<SubmissionManifest>();
  if (!token || token !== manifest.downloadToken) return jsonError('validation', 'Downloadlink is ongeldig.', 403);

  const attachment = manifest.attachments.find((item) => item.id === attachmentId);
  if (!attachment) return jsonError('validation', 'Bijlage niet gevonden.', 404);

  const object = await env.FORM_UPLOADS.get(attachment.key);
  if (!object) return jsonError('validation', 'Bijlage niet gevonden.', 404);

  return new Response(object.body, {
    headers: {
      'content-type': attachment.type || 'application/octet-stream',
      'content-length': String(attachment.size),
      'content-disposition': `attachment; filename="${escapeHeaderValue(attachment.name)}"`,
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

function parseFields(form: FormData, excludeConfirmationLocale = false, honeypotField = ''): SubmissionFields {
  const fields: Record<string, string> = {};

  form.forEach((value, key) => {
    if (
      key !== 'files' &&
      key !== 'cf-turnstile-response' &&
      key !== 'firstName' &&
      key !== 'lastName' &&
      key !== 'email' &&
      (!honeypotField || key !== honeypotField) &&
      (!excludeConfirmationLocale || key !== CONFIRMATION_LOCALE_FIELD) &&
      typeof value === 'string'
    ) {
      fields[key] = value.trim();
    }
  });

  return {
    firstName: getString(form, 'firstName'),
    lastName: getString(form, 'lastName'),
    email: getString(form, 'email'),
    fields,
  };
}

function validateFields(fields: SubmissionFields, config: ResolvedLeadFormConfig): string | null {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailRequired = config.requireEmail && !config.optionalEmailWhen.some((condition) => conditionMatches(fields, condition));
  if (config.requireFirstName && !fields.firstName) return config.locale === 'en' ? 'Enter your first name.' : 'Vul uw naam in.';
  if (config.requireLastName && !fields.lastName) return config.locale === 'en' ? 'Enter your last name.' : 'Vul uw achternaam in.';
  if (emailRequired) {
    if (!fields.email || !emailPattern.test(fields.email)) return config.locale === 'en' ? 'Enter a valid email address.' : 'Vul een geldig e-mailadres in.';
  } else if (fields.email && !emailPattern.test(fields.email)) {
    return config.locale === 'en' ? 'Enter a valid email address.' : 'Vul een geldig e-mailadres in.';
  }

  for (const field of config.requiredFields) {
    if (!conditionMatches(fields, field.when)) continue;
    if (!getFieldValue(fields, field.name)) return field.message ?? (config.locale === 'en' ? `Enter ${field.label.toLowerCase()}.` : `Vul ${field.label.toLowerCase()} in.`);
  }

  return null;
}

function validateAttachments(files: File[], config: ResolvedLeadFormConfig): string | null {
  if (files.length > config.attachmentMaxFiles) return config.locale === 'en' ? `Attach no more than ${config.attachmentMaxFiles} files.` : `Stuur maximaal ${config.attachmentMaxFiles} bestanden mee.`;

  let totalSize = 0;
  for (const file of files) {
    totalSize += file.size;
    if (file.size > config.attachmentMaxFileBytes) return config.locale === 'en' ? `File "${file.name}" is larger than 10 MB.` : `Bestand "${file.name}" is groter dan 10 MB.`;
    if (!isAllowedFile(file, config)) return config.locale === 'en' ? `File "${file.name}" has an unsupported file type.` : `Bestand "${file.name}" heeft geen toegestaan bestandstype.`;
  }

  if (totalSize > config.attachmentMaxTotalBytes) return config.locale === 'en' ? 'The attachments exceed 50 MB in total.' : 'De bijlagen zijn samen groter dan 50 MB.';
  return null;
}

function isAllowedFile(file: File, config: ResolvedLeadFormConfig): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return config.allowedFileTypes.includes(file.type) || config.allowedFileExtensions.includes(extension);
}

async function validateTurnstile(secret: string, token: string, request: Request): Promise<boolean> {
  if (isLocalRequest(request)) return true;
  if (secret === 'dev') return token === 'dev';
  if (!secret || !token) return false;

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);

  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) body.append('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!response.ok) return false;

  const result = await response.json<TurnstileResponse>();
  return result.success;
}

function isLocalRequest(request: Request): boolean {
  const hostname = new URL(request.url).hostname;
  const host = request.headers.get('host')?.split(':')[0] ?? '';
  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  return isLoopback(hostname) || isLoopback(host) || isLoopback(ip);
}

function isLoopback(value: string): boolean {
  return value === 'localhost' || value === '127.0.0.1' || value === '::1' || value === '[::1]';
}

function resolveConfirmationLocale(form: FormData, config?: LocalizedConfirmationEmailConfig): string | undefined {
  if (!config) return undefined;

  const requested = getString(form, CONFIRMATION_LOCALE_FIELD).toLowerCase();
  if (hasOwn(config.translations, requested)) return requested;
  if (hasOwn(config.translations, config.defaultLocale)) return config.defaultLocale;
  if (hasOwn(config.translations, 'en')) return 'en';

  return Object.keys(config.translations)[0];
}

function hasOwn(object: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}

async function storeAttachments(bucket: R2Bucket, files: File[], prefix: string): Promise<StoredAttachment[]> {
  const attachments: StoredAttachment[] = [];

  for (const [index, file] of files.entries()) {
    const id = crypto.randomUUID();
    const safeName = sanitizeFilename(file.name || `attachment-${index + 1}`);
    const key = `${prefix}/${index + 1}-${id}-${safeName}`;

    await bucket.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
      customMetadata: {
        originalName: safeName,
      },
    });

    attachments.push({
      id,
      name: safeName,
      key,
      size: file.size,
      type: file.type || 'application/octet-stream',
    });
  }

  return attachments;
}

async function sendConfirmationEmail(
  env: CloudflareFormsEnv,
  config: ResolvedLeadFormConfig,
  manifest: SubmissionManifest,
  locale?: string,
): Promise<void> {
  const { fields } = manifest;
  if (!fields.email) return;

  try {
    const localized = locale && config.confirmationEmail
      ? { config: config.confirmationEmail, copy: config.confirmationEmail.translations[locale], locale }
      : undefined;
    await env.LEAD_EMAIL.send({
      from: { email: env.LEAD_SENDER, name: config.senderName },
      to: fields.email,
      replyTo: env.LEAD_RECIPIENT,
      subject: cleanHeader(localized
        ? formatCopy(localized.copy.subject, { siteName: config.siteName })
        : confirmationSubject(config)),
      text: localized
        ? renderLocalizedConfirmationTextEmail(config, manifest, localized.config, localized.copy)
        : renderConfirmationTextEmail(config, manifest),
      html: localized
        ? renderLocalizedConfirmationHtmlEmail(config, manifest, localized.config, localized.copy, localized.locale)
        : renderConfirmationHtmlEmail(config, manifest),
    });
  } catch (error) {
    console.error('Confirmation email failed', {
      error,
      submissionId: manifest.submissionId,
      recipient: fields.email,
    });
  }
}

async function sendLeadEmail(
  env: CloudflareFormsEnv,
  config: ResolvedLeadFormConfig,
  manifest: SubmissionManifest,
  origin: string,
): Promise<void> {
  const { fields } = manifest;
  const subjectParts = [
    config.subjectPrefix,
    ...config.subjectFields
      .filter((field) => !isReservedConfirmationField(field, config))
      .map((field) => getDisplayFieldValue(fields, field, config)),
  ].filter(Boolean);
  const subject = subjectParts.map(cleanHeader).join(config.subjectSeparator);

  try {
    await env.LEAD_EMAIL.send({
      from: { email: env.LEAD_SENDER, name: config.senderName },
      to: env.LEAD_RECIPIENT,
      replyTo: fields.email
        ? { email: fields.email, name: cleanHeader(getFullName(fields)) }
        : env.LEAD_RECIPIENT,
      subject,
      text: renderTextEmail(config, manifest, origin),
      html: renderHtmlEmail(config, manifest, origin),
    });
  } catch (error) {
    console.error('Lead email failed', error);
    throw new Error('Email delivery failed');
  }
}

function renderLocalizedConfirmationTextEmail(
  config: ResolvedLeadFormConfig,
  manifest: SubmissionManifest,
  emailConfig: LocalizedConfirmationEmailConfig,
  copy: ConfirmationEmailCopy,
): string {
  const { fields } = manifest;
  const rows = renderLocalizedConfirmationRows(config, fields, copy);
  const message = getFieldValue(fields, config.messageField);
  const replacements = { name: getFullName(fields), siteName: config.siteName };

  return [
    formatCopy(copy.greeting, replacements),
    '',
    formatCopy(copy.receiptMessage, replacements),
    formatCopy(copy.followUpMessage, replacements),
    '',
    copy.detailsHeading,
    ...rows.map(([label, value]) => `${label}: ${value || '-'}`),
    '',
    `${copy.messageHeading}:`,
    message || '-',
    '',
    `${copy.referenceLabel}: ${manifest.submissionId}`,
    '',
    copy.contactPrompt,
    emailConfig.brand.contactEmail,
    `${copy.ctaLabel}: ${emailConfig.brand.websiteUrl}`,
    '',
    copy.footerText,
  ].join('\n');
}

function renderLocalizedConfirmationHtmlEmail(
  config: ResolvedLeadFormConfig,
  manifest: SubmissionManifest,
  emailConfig: LocalizedConfirmationEmailConfig,
  copy: ConfirmationEmailCopy,
  locale: string,
): string {
  const { fields } = manifest;
  const brand = emailConfig.brand;
  const c = { ...DEFAULT_CONFIRMATION_COLORS, ...brand.colors };
  const logoWidth = brand.logoWidth ?? 360;
  const rows = renderLocalizedConfirmationRows(config, fields, copy);
  const message = getFieldValue(fields, config.messageField) || '-';
  const replacements = { name: getFullName(fields), siteName: config.siteName };
  const detailRows = rows.map(([label, value], index) => `
                <tr>
                  <td style="padding: 11px 12px; border-bottom: 1px solid ${c.border}; width: 42%; color: ${c.mutedSoft}; font-size: 14px; line-height: 20px; vertical-align: top;${index === rows.length - 1 ? ' border-bottom: 0;' : ''}"><strong>${escapeHtml(label)}</strong></td>
                  <td style="padding: 11px 12px; border-bottom: 1px solid ${c.border}; color: ${c.ink}; font-size: 14px; line-height: 20px; vertical-align: top;${index === rows.length - 1 ? ' border-bottom: 0;' : ''}">${escapeHtml(value || '-')}</td>
                </tr>`).join('');

  return `<!doctype html>
<html lang="${escapeHtml(locale)}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(formatCopy(copy.subject, { siteName: config.siteName }))}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: ${c.pageBackground}; color: ${c.ink}; font-family: Arial, Helvetica, sans-serif;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent; mso-hide: all;">${escapeHtml(copy.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; background-color: ${c.pageBackground};">
      <tr>
        <td align="center" style="padding: 24px 12px;">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 640px; border-collapse: collapse; background-color: ${c.surface}; border-top: 4px solid ${c.accent};">
            <tr>
              <td align="center" style="padding: 25px 28px 21px; background-color: ${c.surfaceAlt};">
                <img src="${escapeHtml(brand.logoUrl)}" width="${logoWidth}" alt="${escapeHtml(brand.logoAlt)}" style="display: block; width: 100%; max-width: ${logoWidth}px; height: auto; border: 0; color: ${c.ink}; font-size: 16px;">
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 36px; background-color: ${c.ink}; color: ${c.onInk};">
                <p style="margin: 0 0 10px; color: ${c.accent}; font-size: 13px; font-weight: bold; letter-spacing: 1.2px; line-height: 18px; text-transform: uppercase;">${escapeHtml(copy.detailsHeading)}</p>
                <p style="margin: 0; color: ${c.onInk}; font-size: 22px; font-weight: bold; line-height: 30px;">${escapeHtml(formatCopy(copy.receiptMessage, replacements))}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 36px 16px; background-color: ${c.surface};">
                <p style="margin: 0 0 16px; color: ${c.ink}; font-size: 17px; line-height: 26px;">${escapeHtml(formatCopy(copy.greeting, replacements))}</p>
                <p style="margin: 0; color: ${c.inkSoft}; font-size: 15px; line-height: 24px;">${escapeHtml(formatCopy(copy.followUpMessage, replacements))}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 36px; background-color: ${c.surface};">
                <h1 style="margin: 0 0 12px; color: ${c.ink}; font-size: 20px; line-height: 28px;">${escapeHtml(copy.detailsHeading)}</h1>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; border: 1px solid ${c.border}; background-color: ${c.surfaceAlt};">${detailRows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 36px; background-color: ${c.surface};">
                <h2 style="margin: 0 0 10px; color: ${c.ink}; font-size: 18px; line-height: 26px;">${escapeHtml(copy.messageHeading)}</h2>
                <p style="margin: 0; padding: 16px; border-left: 3px solid ${c.accent}; background-color: ${c.surfaceAlt}; color: ${c.inkSoft}; font-size: 15px; line-height: 23px;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
                <p style="margin: 14px 0 0; color: ${c.muted}; font-size: 12px; line-height: 18px;">${escapeHtml(copy.referenceLabel)}: ${escapeHtml(manifest.submissionId)}</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 22px 36px 34px; background-color: ${c.surface};">
                <p style="margin: 0 0 15px; color: ${c.inkSoft}; font-size: 14px; line-height: 22px;">${escapeHtml(copy.contactPrompt)} <a href="mailto:${escapeHtml(brand.contactEmail)}" style="color: ${c.ink}; font-weight: bold;">${escapeHtml(brand.contactEmail)}</a></p>
                <a href="${escapeHtml(brand.websiteUrl)}" style="display: inline-block; padding: 13px 22px; background-color: ${c.button}; color: ${c.onButton}; font-size: 14px; font-weight: bold; line-height: 18px; text-decoration: none;">${escapeHtml(copy.ctaLabel)}</a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 22px 30px; background-color: ${c.ink}; color: ${c.onInk};">
                <p style="margin: 0; color: ${c.onInk}; font-size: 12px; line-height: 19px;">${escapeHtml(copy.footerText)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderLocalizedConfirmationRows(
  config: ResolvedLeadFormConfig,
  fields: SubmissionFields,
  copy: ConfirmationEmailCopy,
): [string, string][] {
  const baseRows: [string, string][] = [
    [copy.fieldLabels.firstName ?? 'First name', fields.firstName],
    [copy.fieldLabels.lastName ?? 'Last name', fields.lastName],
    [copy.fieldLabels.email ?? 'Email address', fields.email],
  ];
  const configuredRows = config.emailFields
    .filter((field) => !isReservedConfirmationField(field.name, config))
    .filter((field) => conditionMatches(fields, field.when))
    .map((field): [string, string] => [
      copy.fieldLabels[field.name] ?? field.label,
      getDisplayFieldValue(fields, field.name, config) || '-',
    ]);
  return [...baseRows, ...configuredRows];
}

function formatCopy(template: string, replacements: Record<string, string>): string {
  return Object.entries(replacements).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );
}

function renderConfirmationTextEmail(config: ResolvedLeadFormConfig, manifest: SubmissionManifest): string {
  const { fields } = manifest;
  const english = config.locale === 'en';
  const message = getFieldValue(fields, config.messageField);
  const submission = confirmationShowsSubmission(config)
    ? [
        '',
        `${confirmationDetailsHeading(config)}:`,
        ...renderEmailRows(config, fields, false).map(([label, value]) => `${label}: ${value || '-'}`),
        '',
        `${confirmationMessageHeading(config)}:`,
        message || '-',
      ]
    : [];

  return [
    `${english ? 'Dear' : 'Beste'} ${getFullName(fields)},`,
    '',
    confirmationOpeningSentence(config),
    config.confirmationFollowUpSentence,
    ...submission,
    '',
    `${english ? 'Reference' : 'Referentie'}: ${manifest.submissionId}`,
  ].join('\n');
}

function renderConfirmationHtmlEmail(config: ResolvedLeadFormConfig, manifest: SubmissionManifest): string {
  const { fields } = manifest;
  const english = config.locale === 'en';
  const message = getFieldValue(fields, config.messageField);
  const rows = renderEmailRows(config, fields, false);
  const submission = confirmationShowsSubmission(config)
    ? `<h1 style="font-size: 20px;">${escapeHtml(confirmationDetailsHeading(config))}</h1>
    <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
      ${rows.map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`).join('')}
    </table>
    <h2 style="font-size: 16px;">${escapeHtml(confirmationMessageHeading(config))}</h2>
    <p>${escapeHtml(message || '-').replace(/\n/g, '<br>')}</p>
    `
    : '';

  return `<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif; color: #1d2939; line-height: 1.5;">
    <p>${english ? 'Dear' : 'Beste'} ${escapeHtml(getFullName(fields))},</p>
    <p>${escapeHtml(confirmationOpeningSentence(config))} ${escapeHtml(config.confirmationFollowUpSentence)}</p>
    ${submission}<p style="font-size: 12px; color: #667085;">${english ? 'Reference' : 'Referentie'} ${escapeHtml(manifest.submissionId)}.</p>
  </body>
</html>`;
}

function renderTextEmail(config: ResolvedLeadFormConfig, manifest: SubmissionManifest, origin: string): string {
  const { fields } = manifest;
  const english = config.locale === 'en';
  const rows = renderEmailRows(config, fields);
  const message = getFieldValue(fields, config.messageField);
  const attachmentLines = manifest.attachments.length
    ? manifest.attachments.map((attachment) => `- ${attachment.name}: ${attachmentUrl(config, manifest, attachment, origin)}`).join('\n')
    : english ? 'No attachments included.' : 'Geen bijlagen meegestuurd.';
  const messageBlock = leadShowsMessage(config) ? ['', `${leadMessageHeading(config)}:`, message || '-'] : [];
  const attachmentBlock = leadShowsAttachments(config) ? ['', english ? 'Attachments:' : 'Bijlagen:', attachmentLines] : [];

  if (english) return [
    leadHeading(config), '', ...rows.map(([label,value])=>`${label}: ${value||'-'}`), ...messageBlock, ...attachmentBlock,
  ].join('\n');

  return [
    leadHeading(config),
    '',
    ...rows.map(([label, value]) => `${label}: ${value || '-'}`),
    ...messageBlock,
    ...attachmentBlock,
    '',
    `Inzending: ${manifest.submissionId}`,
    `Ontvangen: ${manifest.createdAt}`,
  ].join('\n');
}

function renderHtmlEmail(config: ResolvedLeadFormConfig, manifest: SubmissionManifest, origin: string): string {
  const { fields } = manifest;
  const english = config.locale === 'en';
  const rows = renderEmailRows(config, fields);
  const message = getFieldValue(fields, config.messageField);
  const attachments = manifest.attachments.length
    ? `<ul>${manifest.attachments
        .map((attachment) => `<li><a href="${escapeHtml(attachmentUrl(config, manifest, attachment, origin))}">${escapeHtml(attachment.name)}</a></li>`)
        .join('')}</ul>`
    : english ? '<p>No attachments included.</p>' : '<p>Geen bijlagen meegestuurd.</p>';
  const messageBlock = leadShowsMessage(config)
    ? `<h2 style="font-size: 16px;">${escapeHtml(leadMessageHeading(config))}</h2><p>${escapeHtml(message || '-').replace(/\n/g, '<br>')}</p>`
    : '';
  const attachmentBlock = leadShowsAttachments(config)
    ? `<h2 style="font-size: 16px;">${english ? 'Attachments' : 'Bijlagen'}</h2>${attachments}`
    : '';

  if (english) return `<!doctype html><html><body style="font-family: Arial, sans-serif; color: #1d2939; line-height: 1.5;"><h1 style="font-size: 20px;">${escapeHtml(leadHeading(config))}</h1><table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">${rows.map(([label,value])=>`<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`).join('')}</table>${messageBlock}${attachmentBlock}<p style="font-size: 12px; color: #667085;">Submission ${escapeHtml(manifest.submissionId)} received at ${escapeHtml(manifest.createdAt)}.</p></body></html>`;

  return `<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif; color: #1d2939; line-height: 1.5;">
    <h1 style="font-size: 20px;">${escapeHtml(leadHeading(config))}</h1>
    <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
      ${rows.map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`).join('')}
    </table>
    ${messageBlock}
    ${attachmentBlock}
    <p style="font-size: 12px; color: #667085;">Inzending ${escapeHtml(manifest.submissionId)} ontvangen op ${escapeHtml(manifest.createdAt)}.</p>
  </body>
</html>`;
}

function renderEmailRows(
  config: ResolvedLeadFormConfig,
  fields: SubmissionFields,
  /** The owner notification takes the owner-only rows; the confirmation must not. */
  ownerOnlyRows = true,
): [string, string][] {
  const names = config.leadEmail?.nameLabels;
  // A row for a name the form never asks for reads "Achternaam: -" in both
  // emails, which is the visitor being told something untrue about their own
  // submission. A field the form does require keeps its row whatever came back,
  // so a missing answer still shows up as missing.
  const baseRows = (
    [
      [names?.firstName ?? 'Voornaam', fields.firstName, config.requireFirstName],
      [names?.lastName ?? 'Achternaam', fields.lastName, config.requireLastName],
      [names?.email ?? 'E-mail', fields.email, config.requireEmail],
    ] as [string, string, boolean][]
  )
    .filter(([, value, required]) => required || value)
    .map(([label, value]): [string, string] => [label, value]);
  const configuredRows = [...config.emailFields, ...(ownerOnlyRows ? config.leadOnlyEmailFields : [])]
    .filter((field) => !isReservedConfirmationField(field.name, config))
    .filter((field) => conditionMatches(fields, field.when))
    .map((field): [string, string] => [field.label, getDisplayFieldValue(fields, field.name, config) || '-']);
  return [...baseRows, ...configuredRows];
}

function getFullName(fields: SubmissionFields): string {
  return [fields.firstName, fields.lastName].filter(Boolean).join(' ');
}

function getDisplayFieldValue(fields: SubmissionFields, name: string, config: ResolvedLeadFormConfig): string {
  const value = getFieldValue(fields, name);
  if (name === 'service' && value === 'other') return getFieldValue(fields, config.serviceOtherField);
  return value;
}

function getFieldValue(fields: SubmissionFields, name: string): string {
  if (name === 'firstName' || name === 'lastName' || name === 'email') return fields[name];
  return fields.fields[name] ?? '';
}

function isReservedConfirmationField(name: string, config: ResolvedLeadFormConfig): boolean {
  return Boolean(config.confirmationEmail) && name === CONFIRMATION_LOCALE_FIELD;
}

function conditionMatches(fields: SubmissionFields, condition?: { field: string; equals: string }): boolean {
  if (!condition) return true;
  return getFieldValue(fields, condition.field) === condition.equals;
}

function attachmentUrl(
  config: ResolvedLeadFormConfig,
  manifest: SubmissionManifest,
  attachment: StoredAttachment,
  origin: string,
): string {
  const createdAt = new Date(manifest.createdAt);
  const year = String(createdAt.getUTCFullYear());
  const month = String(createdAt.getUTCMonth() + 1).padStart(2, '0');
  const url = new URL(
    `${config.formPath}/attachments/${year}/${month}/${manifest.submissionId}/${attachment.id}/${encodeURIComponent(attachment.name)}`,
    origin,
  );
  url.searchParams.set('token', manifest.downloadToken);
  return url.toString();
}

function getString(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function makeSubmissionPrefix(siteId: string, createdAt: Date, submissionId: string): string {
  const year = String(createdAt.getUTCFullYear());
  const month = String(createdAt.getUTCMonth() + 1).padStart(2, '0');
  return `${siteId}/${year}/${month}/${submissionId}`;
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function sanitizeFilename(name: string): string {
  const fallback = 'bijlage';
  const clean = name
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
  return clean || fallback;
}

function cleanHeader(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function escapeHeaderValue(value: string): string {
  return value.replace(/["\\\r\n]/g, '_');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function jsonError(error: FormErrorCode, message: string, status: number): Response {
  return jsonResponse({ ok: false, error, message }, status);
}
