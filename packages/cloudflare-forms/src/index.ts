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
  siteName: string;
  ownerName?: string;
  senderName: string;
  subjectPrefix: string;
  confirmationFollowUpSentence?: string;
  requiredFields?: LeadFormRequiredField[];
  emailFields?: LeadFormEmailField[];
  subjectFields?: string[];
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

      return jsonError('server', 'Niet gevonden.', 404);
    },
  };
}

function withDefaults(config: LeadFormConfig): Required<LeadFormConfig> {
  return {
    ownerName: 'Eigenaar',
    confirmationFollowUpSentence: 'We nemen binnen 24 tot 48 uur contact met u op.',
    requiredFields: [],
    emailFields: [],
    subjectFields: [],
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
    ...config,
  };
}

async function handleSubmission(
  request: Request,
  env: CloudflareFormsEnv,
  config: Required<LeadFormConfig>,
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
    const fields = parseFields(form);
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

    const shouldSkipTurnstile = config.skipTurnstileWhen.some((condition) => conditionMatches(fields, condition));
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
    await sendConfirmationEmail(env, config, manifest);

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
      `De aanvraag kon niet worden verwerkt. Neem direct telefonisch of per e-mail contact op met ${config.siteName}.`,
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
  config: Required<LeadFormConfig>,
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

function parseFields(form: FormData): SubmissionFields {
  const fields: Record<string, string> = {};

  form.forEach((value, key) => {
    if (key !== 'files' && key !== 'cf-turnstile-response' && key !== 'firstName' && key !== 'lastName' && key !== 'email' && typeof value === 'string') {
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

function validateFields(fields: SubmissionFields, config: Required<LeadFormConfig>): string | null {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailRequired = config.requireEmail && !config.optionalEmailWhen.some((condition) => conditionMatches(fields, condition));
  if (config.requireFirstName && !fields.firstName) return 'Vul uw naam in.';
  if (config.requireLastName && !fields.lastName) return 'Vul uw achternaam in.';
  if (emailRequired) {
    if (!fields.email || !emailPattern.test(fields.email)) return 'Vul een geldig e-mailadres in.';
  } else if (fields.email && !emailPattern.test(fields.email)) {
    return 'Vul een geldig e-mailadres in.';
  }

  for (const field of config.requiredFields) {
    if (!conditionMatches(fields, field.when)) continue;
    if (!getFieldValue(fields, field.name)) return field.message ?? `Vul ${field.label.toLowerCase()} in.`;
  }

  return null;
}

function validateAttachments(files: File[], config: Required<LeadFormConfig>): string | null {
  if (files.length > config.attachmentMaxFiles) return `Stuur maximaal ${config.attachmentMaxFiles} bestanden mee.`;

  let totalSize = 0;
  for (const file of files) {
    totalSize += file.size;
    if (file.size > config.attachmentMaxFileBytes) return `Bestand "${file.name}" is groter dan 10 MB.`;
    if (!isAllowedFile(file, config)) return `Bestand "${file.name}" heeft geen toegestaan bestandstype.`;
  }

  if (totalSize > config.attachmentMaxTotalBytes) return 'De bijlagen zijn samen groter dan 50 MB.';
  return null;
}

function isAllowedFile(file: File, config: Required<LeadFormConfig>): boolean {
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

async function storeAttachments(bucket: R2Bucket, files: File[], prefix: string): Promise<StoredAttachment[]> {
  const attachments: StoredAttachment[] = [];

  for (const [index, file] of files.entries()) {
    const id = crypto.randomUUID();
    const safeName = sanitizeFilename(file.name || `bijlage-${index + 1}`);
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
  config: Required<LeadFormConfig>,
  manifest: SubmissionManifest,
): Promise<void> {
  const { fields } = manifest;
  if (!fields.email) return;

  try {
    await env.LEAD_EMAIL.send({
      from: { email: env.LEAD_SENDER, name: config.senderName },
      to: fields.email,
      replyTo: env.LEAD_RECIPIENT,
      subject: cleanHeader(`Uw offerteaanvraag is ontvangen - ${config.siteName}`),
      text: renderConfirmationTextEmail(config, manifest),
      html: renderConfirmationHtmlEmail(config, manifest),
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
  config: Required<LeadFormConfig>,
  manifest: SubmissionManifest,
  origin: string,
): Promise<void> {
  const { fields } = manifest;
  const subjectParts = [
    config.subjectPrefix,
    ...config.subjectFields.map((field) => getDisplayFieldValue(fields, field, config)),
  ].filter(Boolean);
  const subject = subjectParts.map(cleanHeader).join(' - ');

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

function renderConfirmationTextEmail(config: Required<LeadFormConfig>, manifest: SubmissionManifest): string {
  const { fields } = manifest;
  const fullName = getFullName(fields);
  const message = getFieldValue(fields, config.messageField);
  const rows = renderEmailRows(config, fields);

  return [
    `Beste ${fullName},`,
    '',
    `Uw offerteaanvraag voor ${config.siteName} is verstuurd.`,
    config.confirmationFollowUpSentence,
    '',
    'Uw aanvraag:',
    ...rows.map(([label, value]) => `${label}: ${value || '-'}`),
    '',
    'Projectomschrijving:',
    message || '-',
    '',
    `Referentie: ${manifest.submissionId}`,
  ].join('\n');
}

function renderConfirmationHtmlEmail(config: Required<LeadFormConfig>, manifest: SubmissionManifest): string {
  const { fields } = manifest;
  const rows = renderEmailRows(config, fields);
  const message = getFieldValue(fields, config.messageField);

  return `<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif; color: #1d2939; line-height: 1.5;">
    <p>Beste ${escapeHtml(getFullName(fields))},</p>
    <p>Uw offerteaanvraag voor ${escapeHtml(config.siteName)} is verstuurd. ${escapeHtml(config.confirmationFollowUpSentence)}</p>
    <h1 style="font-size: 20px;">Uw aanvraag</h1>
    <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
      ${rows.map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`).join('')}
    </table>
    <h2 style="font-size: 16px;">Projectomschrijving</h2>
    <p>${escapeHtml(message || '-').replace(/\n/g, '<br>')}</p>
    <p style="font-size: 12px; color: #667085;">Referentie ${escapeHtml(manifest.submissionId)}.</p>
  </body>
</html>`;
}

function renderTextEmail(config: Required<LeadFormConfig>, manifest: SubmissionManifest, origin: string): string {
  const { fields } = manifest;
  const rows = renderEmailRows(config, fields);
  const message = getFieldValue(fields, config.messageField);
  const attachmentLines = manifest.attachments.length
    ? manifest.attachments.map((attachment) => `- ${attachment.name}: ${attachmentUrl(config, manifest, attachment, origin)}`).join('\n')
    : 'Geen bijlagen meegestuurd.';

  return [
    `Nieuwe offerteaanvraag voor ${config.siteName}`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value || '-'}`),
    '',
    'Projectomschrijving:',
    message || '-',
    '',
    'Bijlagen:',
    attachmentLines,
    '',
    `Inzending: ${manifest.submissionId}`,
    `Ontvangen: ${manifest.createdAt}`,
  ].join('\n');
}

function renderHtmlEmail(config: Required<LeadFormConfig>, manifest: SubmissionManifest, origin: string): string {
  const { fields } = manifest;
  const rows = renderEmailRows(config, fields);
  const message = getFieldValue(fields, config.messageField);
  const attachments = manifest.attachments.length
    ? `<ul>${manifest.attachments
        .map((attachment) => `<li><a href="${escapeHtml(attachmentUrl(config, manifest, attachment, origin))}">${escapeHtml(attachment.name)}</a></li>`)
        .join('')}</ul>`
    : '<p>Geen bijlagen meegestuurd.</p>';

  return `<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif; color: #1d2939; line-height: 1.5;">
    <h1 style="font-size: 20px;">Nieuwe offerteaanvraag voor ${escapeHtml(config.siteName)}</h1>
    <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
      ${rows.map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`).join('')}
    </table>
    <h2 style="font-size: 16px;">Projectomschrijving</h2>
    <p>${escapeHtml(message || '-').replace(/\n/g, '<br>')}</p>
    <h2 style="font-size: 16px;">Bijlagen</h2>
    ${attachments}
    <p style="font-size: 12px; color: #667085;">Inzending ${escapeHtml(manifest.submissionId)} ontvangen op ${escapeHtml(manifest.createdAt)}.</p>
  </body>
</html>`;
}

function renderEmailRows(config: Required<LeadFormConfig>, fields: SubmissionFields): [string, string][] {
  const baseRows: [string, string][] = [
    ['Voornaam', fields.firstName],
    ['Achternaam', fields.lastName],
    ['E-mail', fields.email],
  ];
  const configuredRows = config.emailFields
    .filter((field) => conditionMatches(fields, field.when))
    .map((field): [string, string] => [field.label, getDisplayFieldValue(fields, field.name, config) || '-']);
  return [...baseRows, ...configuredRows];
}

function getFullName(fields: SubmissionFields): string {
  return [fields.firstName, fields.lastName].filter(Boolean).join(' ');
}

function getDisplayFieldValue(fields: SubmissionFields, name: string, config: Required<LeadFormConfig>): string {
  const value = getFieldValue(fields, name);
  if (name === 'service' && value === 'other') return getFieldValue(fields, config.serviceOtherField);
  return value;
}

function getFieldValue(fields: SubmissionFields, name: string): string {
  if (name === 'firstName' || name === 'lastName' || name === 'email') return fields[name];
  return fields.fields[name] ?? '';
}

function conditionMatches(fields: SubmissionFields, condition?: { field: string; equals: string }): boolean {
  if (!condition) return true;
  return getFieldValue(fields, condition.field) === condition.equals;
}

function attachmentUrl(
  config: Required<LeadFormConfig>,
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
