import { useEffect, useRef, useState, type FormEvent, type ChangeEvent, type DragEvent } from 'react';
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

const POSTCODE_RE = /^\d{4}\s?[a-zA-Z]{2}$/;

type DerivedAddress = { street: string; city: string; label: string };
type AddressLookup =
  | { status: 'idle' | 'loading' | 'notfound' }
  | { status: 'found'; result: DerivedAddress };

// PDOK returns its best-scoring match even for non-existent house numbers, so
// the echoed postcode and huisnummer must be verified against the input.
async function lookupAddress(postalCode: string, houseNumber: string): Promise<DerivedAddress | null> {
  const pc = postalCode.replace(/\s+/g, '').toUpperCase();
  const url =
    'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free' +
    `?fq=type:adres&rows=1&fl=weergavenaam,straatnaam,woonplaatsnaam,postcode,huis_nlt` +
    `&q=${encodeURIComponent(`${pc} ${houseNumber.trim()}`)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as {
    response?: {
      docs?: { weergavenaam: string; straatnaam: string; woonplaatsnaam: string; postcode?: string; huis_nlt?: string }[];
    };
  };
  const doc = data.response?.docs?.[0];
  if (!doc || doc.postcode !== pc) return null;
  const normalizeNr = (v: string) => v.replace(/[\s-]+/g, '').toLowerCase();
  if (normalizeNr(doc.huis_nlt ?? '') !== normalizeNr(houseNumber)) return null;
  return { street: doc.straatnaam, city: doc.woonplaatsnaam, label: doc.weergavenaam };
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
  const [postalCode, setPostalCode] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [addr, setAddr] = useState<AddressLookup>({ status: 'idle' });
  const lookupSeq = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  useEffect(() => {
    if (!POSTCODE_RE.test(postalCode.trim()) || !houseNumber.trim()) {
      lookupSeq.current++;
      setAddr({ status: 'idle' });
      return;
    }
    const seq = ++lookupSeq.current;
    setAddr({ status: 'loading' });
    const timer = setTimeout(async () => {
      let result: DerivedAddress | null = null;
      try {
        result = await lookupAddress(postalCode, houseNumber);
      } catch {
        result = null;
      }
      if (seq !== lookupSeq.current) return;
      setAddr(result ? { status: 'found', result } : { status: 'notfound' });
    }, 450);
    return () => clearTimeout(timer);
  }, [postalCode, houseNumber]);

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

  const validate = (el: HTMLFormElement, addrState: AddressLookup): Record<string, string> => {
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
    if (!postalCode.trim()) errors.postalCode = t(form.errPostal);
    else if (!POSTCODE_RE.test(postalCode.trim())) errors.postalCode = t(form.errPostalValid);
    if (!houseNumber.trim()) errors.houseNumber = t(form.errHouseNumber);
    if (addrState.status === 'notfound') {
      if (!get('streetName')) errors.streetName = t(form.errStreet);
      if (!get('city')) errors.city = t(form.errCity);
    }
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

    // Resolve an in-flight address lookup so submit never races the debounce
    let addrState = addr;
    if (addrState.status === 'loading') {
      lookupSeq.current++;
      let result: DerivedAddress | null = null;
      try {
        result = await lookupAddress(postalCode, houseNumber);
      } catch {
        result = null;
      }
      addrState = result ? { status: 'found', result } : { status: 'notfound' };
      setAddr(addrState);
    }

    const errors = validate(el, addrState);
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
      formData.set('postalCode', postalCode.replace(/\s+/g, '').toUpperCase());
      formData.set('houseNumber', houseNumber.trim());
      if (addrState.status === 'found') {
        formData.set('streetName', addrState.result.street);
        formData.set('city', addrState.result.city);
      }

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
    setPostalCode('');
    setHouseNumber('');
    setAddr({ status: 'idle' });
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
          <input
            id="offerte-postalCode"
            type="text"
            name="postalCode"
            autoComplete="postal-code"
            placeholder="6039 RP"
            className="field"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Field>
        <Field id="offerte-houseNumber" label={t(form.houseNumber)} error={fieldErrors.houseNumber}>
          <input
            id="offerte-houseNumber"
            type="text"
            name="houseNumber"
            autoComplete="off"
            placeholder="4"
            className="field"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
          />
        </Field>

        {addr.status !== 'idle' && (
          <div className="sm:col-span-2" role="status" aria-live="polite">
            {addr.status === 'loading' && (
              <p className="text-sm text-mute">{t(form.addressSearching)}</p>
            )}
            {addr.status === 'found' && (
              <p className="flex items-center gap-2 rounded-lg border border-line bg-ink-3 px-3 py-2.5 text-sm text-bone-soft">
                <Check size={15} className="shrink-0 text-orange" />
                <span>{addr.result.label}</span>
              </p>
            )}
            {addr.status === 'notfound' && (
              <p className="text-sm text-mute">{t(form.addressNotFound)}</p>
            )}
          </div>
        )}

        {addr.status === 'notfound' && (
          <>
            <Field id="offerte-streetName" label={t(form.streetName)} error={fieldErrors.streetName}>
              <input id="offerte-streetName" type="text" name="streetName" autoComplete="address-line1" className="field" />
            </Field>
            <Field id="offerte-city" label={t(form.city)} error={fieldErrors.city}>
              <input id="offerte-city" type="text" name="city" autoComplete="address-level2" className="field" />
            </Field>
          </>
        )}
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
