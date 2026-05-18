import { useRef, useState, type FormEvent, type ChangeEvent, type DragEvent } from 'react';
import { Upload, Check, AlertCircle, X, Phone } from 'lucide-react';
import { useSite } from '../contexts/SiteContext';
import {
  serviceFormOptions,
  propertyTypeOptions,
  urgencyOptions,
  business,
  form,
} from '../content';

type Props = { onSuccess?: () => void };
type State = 'idle' | 'submitting' | 'success' | 'error';

const MAX_FILES = 8;
const MAX_TOTAL_BYTES = 60 * 1024 * 1024;

function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function OfferteForm({ onSuccess }: Props) {
  const { t } = useSite();
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [serviceValue, setServiceValue] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  const addFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    setFileError('');
    setFiles((prev) => {
      const merged = [...prev];
      for (const f of list) {
        if (merged.length >= MAX_FILES) {
          setFileError(t(form.maxFiles));
          break;
        }
        if (merged.some((m) => m.name === f.name && m.size === f.size)) continue;
        merged.push(f);
      }
      if (merged.reduce((s, f) => s + f.size, 0) > MAX_TOTAL_BYTES) {
        setFileError(t(form.maxSize));
      }
      return merged;
    });
  };

  const removeFile = (idx: number) => {
    setFileError('');
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = '';
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const validate = (el: HTMLFormElement): Record<string, string> => {
    const errors: Record<string, string> = {};
    const get = (n: string) =>
      (el.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)
        ?.value.trim() ?? '';

    if (!get('firstName')) errors.firstName = t(form.errVoornaam);
    if (!get('lastName')) errors.lastName = t(form.errAchternaam);
    const email = get('email');
    if (!email) errors.email = t(form.errEmail);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t(form.errEmailValid);
    if (!get('phone')) errors.phone = t(form.errPhone);
    if (!get('postalCode')) errors.postalCode = t(form.errPostal);
    if (!get('city')) errors.city = t(form.errCity);
    if (!get('service')) errors.service = t(form.errService);
    if (get('service') === 'other' && !get('serviceOther')) errors.serviceOther = t(form.errServiceOther);
    if (!get('message')) errors.message = t(form.errMessage);
    return errors;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const el = e.currentTarget;

    const honeypot = (el.elements.namedItem('company') as HTMLInputElement | null)?.value ?? '';
    if (honeypot.trim()) {
      setState('success');
      return;
    }

    const errors = validate(el);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      (el.elements.namedItem(Object.keys(errors)[0]) as HTMLElement | null)?.focus();
      return;
    }
    setFieldErrors({});

    if (files.length > MAX_FILES || totalBytes > MAX_TOTAL_BYTES) {
      setFileError(totalBytes > MAX_TOTAL_BYTES ? t(form.maxSize) : t(form.maxFiles));
      return;
    }

    setState('submitting');
    setErrorMsg('');

    try {
      const formData = new FormData(el);
      formData.delete('files');
      for (const f of files) formData.append('files', f, f.name);

      const response = await fetch('/api/forms/offerte', { method: 'POST', body: formData });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || t(form.errorGeneric));
      }
      setState('success');
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error && err.message ? err.message : t(form.errorGeneric));
    }
  };

  const resetForm = () => {
    formRef.current?.reset();
    setState('idle');
    setErrorMsg('');
    setFiles([]);
    setFileError('');
    setServiceValue('');
    setFieldErrors({});
  };

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange shadow-[0_12px_30px_-12px_rgba(253,87,1,0.7)]">
          <Check size={32} strokeWidth={2.5} className="text-bone" />
        </div>
        <h3 className="text-2xl font-extrabold text-bone">{t(form.successTitle)}</h3>
        <p className="mt-3 max-w-md leading-relaxed text-bone-soft">{t(form.successBody)}</p>
        <button
          type="button"
          onClick={() => {
            resetForm();
            onSuccess?.();
          }}
          className="btn btn-orange mt-7"
        >
          {t(form.successAgain)}
        </button>
        <p className="mt-4 text-sm text-mute">
          {t(form.callPrompt)}{' '}
          <a href={business.phone.href} className="font-bold text-orange hover:text-orange-bright">
            {business.phone.display}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-5">
      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="offerte-company">Bedrijf (niet invullen)</label>
        <input id="offerte-company" type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Turnstile dev bypass token */}
      <input type="hidden" name="cf-turnstile-response" value="dev" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="offerte-firstName" label={t(form.firstName)} error={fieldErrors.firstName}>
          <input id="offerte-firstName" type="text" name="firstName" autoComplete="given-name" className="field" />
        </Field>
        <Field id="offerte-lastName" label={t(form.lastName)} error={fieldErrors.lastName}>
          <input id="offerte-lastName" type="text" name="lastName" autoComplete="family-name" className="field" />
        </Field>
        <Field id="offerte-email" label={t(form.email)} error={fieldErrors.email}>
          <input id="offerte-email" type="email" name="email" autoComplete="email" className="field" />
        </Field>
        <Field id="offerte-phone" label={t(form.phone)} error={fieldErrors.phone}>
          <input id="offerte-phone" type="tel" name="phone" autoComplete="tel" className="field" />
        </Field>
        <Field id="offerte-postalCode" label={t(form.postalCode)} error={fieldErrors.postalCode}>
          <input id="offerte-postalCode" type="text" name="postalCode" autoComplete="postal-code" className="field" />
        </Field>
        <Field id="offerte-city" label={t(form.city)} error={fieldErrors.city}>
          <input id="offerte-city" type="text" name="city" autoComplete="address-level2" className="field" />
        </Field>
      </div>

      <Field id="offerte-service" label={t(form.service)} error={fieldErrors.service}>
        <select
          id="offerte-service"
          name="service"
          className="field"
          value={serviceValue}
          onChange={(e) => setServiceValue(e.target.value)}
        >
          <option value="" disabled>
            {t(form.servicePick)}
          </option>
          {serviceFormOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {t(o.label)}
            </option>
          ))}
        </select>
      </Field>

      {serviceValue === 'other' && (
        <Field id="offerte-serviceOther" label={t(form.serviceOther)} error={fieldErrors.serviceOther}>
          <input
            id="offerte-serviceOther"
            type="text"
            name="serviceOther"
            placeholder={t(form.serviceOtherPh)}
            className="field"
          />
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="offerte-propertyType" label={t(form.propertyType)} optionalLabel={t(form.optional)}>
          <select id="offerte-propertyType" name="propertyType" defaultValue="" className="field">
            <option value="">{t(form.propertyPick)}</option>
            {propertyTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.label)}
              </option>
            ))}
          </select>
        </Field>
        <Field id="offerte-urgency" label={t(form.urgency)} optionalLabel={t(form.optional)}>
          <select id="offerte-urgency" name="urgency" defaultValue="" className="field">
            <option value="">{t(form.propertyPick)}</option>
            {urgencyOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.label)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="offerte-message" label={t(form.message)} error={fieldErrors.message}>
        <textarea
          id="offerte-message"
          name="message"
          rows={4}
          placeholder={t(form.messagePh)}
          className="field"
        />
      </Field>

      {/* File dropzone */}
      <div>
        <span className="label">
          {t(form.attachments)}{' '}
          <span className="font-normal normal-case tracking-normal text-mute">
            ({t(form.optional)})
          </span>
        </span>
        <label
          className={`relative flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors ${
            dragOver ? 'border-orange bg-orange/5' : 'border-line bg-ink hover:border-orange/50'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <Upload size={20} className="mb-2 text-orange" />
          <span className="text-sm font-bold text-bone">{t(form.attachmentsDrop)}</span>
          <span className="mt-1 text-xs text-mute">{t(form.attachmentsHint)}</span>
          <input
            type="file"
            name="files"
            accept="image/*,.pdf,.heic,.heif"
            multiple
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={onFileInputChange}
          />
        </label>

        {files.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${f.size}-${i}`}
                className="flex max-w-full items-center gap-2 rounded-lg border border-line bg-ink-3 py-1.5 pl-3 pr-2 text-sm"
              >
                <Check size={14} className="shrink-0 text-orange" />
                <span className="truncate text-bone-soft">{f.name}</span>
                <span className="shrink-0 text-xs text-mute">{formatBytes(f.size)}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="shrink-0 rounded p-0.5 text-mute hover:text-bone"
                  aria-label={`${f.name} verwijderen`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {fileError && (
          <p className="mt-2 text-sm text-orange-bright" role="alert">
            {fileError}
          </p>
        )}
      </div>

      {/* Consent */}
      <label className="flex items-start gap-2.5 text-sm leading-relaxed text-bone-soft">
        <input type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-orange" />
        <span>{t(form.consent)}</span>
      </label>

      {state === 'error' && errorMsg && (
        <div
          className="flex items-start gap-2 rounded-lg border border-orange/30 bg-orange/10 px-3 py-2.5 text-sm text-orange-bright"
          role="alert"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="btn btn-orange mt-1 w-full disabled:cursor-wait disabled:opacity-60"
      >
        {state === 'submitting' ? t(form.submitting) : t(form.submit)}
      </button>

      <p className="-mt-1 text-center text-sm text-mute">
        <Phone size={13} className="mr-1 -mt-0.5 inline-block text-orange" />
        {t(form.callPrompt)}{' '}
        <a href={business.phone.href} className="font-bold text-orange hover:text-orange-bright">
          {business.phone.display}
        </a>
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  optionalLabel,
  error,
  children,
}: {
  id: string;
  label: string;
  optionalLabel?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {optionalLabel && (
          <span className="ml-1.5 font-normal normal-case tracking-normal text-mute">
            ({optionalLabel})
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-orange-bright" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
