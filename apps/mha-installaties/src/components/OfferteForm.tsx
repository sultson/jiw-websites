import { useRef, useState, type FormEvent, type ChangeEvent, type DragEvent } from 'react';
import { Upload, Check, AlertCircle, X, Phone } from 'lucide-react';
import { serviceFormOptions, business } from '../content';

type Props = {
  onSuccess?: () => void;
};

type State = 'idle' | 'submitting' | 'success' | 'error';

const MAX_FILES = 8;
const MAX_TOTAL_BYTES = 60 * 1024 * 1024;

const propertyTypeOptions = [
  { value: 'woning', label: 'Woning' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'bedrijfspand', label: 'Bedrijfspand' },
  { value: 'anders', label: 'Anders' },
];

const urgencyOptions = [
  { value: 'spoed', label: 'Spoed' },
  { value: '2-weken', label: 'Binnen 2 weken' },
  { value: '1-2-maanden', label: 'Binnen 1-2 maanden' },
  { value: 'flexibel', label: 'Flexibel' },
];

function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function OfferteForm({ onSuccess }: Props) {
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
          setFileError(`U kunt maximaal ${MAX_FILES} bestanden toevoegen.`);
          break;
        }
        if (merged.some((m) => m.name === f.name && m.size === f.size)) continue;
        merged.push(f);
      }
      const total = merged.reduce((sum, f) => sum + f.size, 0);
      if (total > MAX_TOTAL_BYTES) {
        setFileError('De bestanden zijn samen te groot (maximaal 60 MB).');
      }
      return merged;
    });
  };

  const removeFile = (idx: number) => {
    setFileError('');
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      const total = next.reduce((sum, f) => sum + f.size, 0);
      if (total <= MAX_TOTAL_BYTES && next.length <= MAX_FILES) setFileError('');
      return next;
    });
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

  const validate = (form: HTMLFormElement): Record<string, string> => {
    const errors: Record<string, string> = {};
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)?.value.trim() ?? '';

    if (!get('firstName')) errors.firstName = 'Vul uw voornaam in.';
    if (!get('lastName')) errors.lastName = 'Vul uw achternaam in.';
    const email = get('email');
    if (!email) errors.email = 'Vul uw e-mailadres in.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Vul een geldig e-mailadres in.';
    if (!get('phone')) errors.phone = 'Vul uw telefoonnummer in.';
    if (!get('postalCode')) errors.postalCode = 'Vul uw postcode in.';
    if (!get('city')) errors.city = 'Vul uw plaats in.';
    if (!get('service')) errors.service = 'Kies een dienst.';
    if (get('service') === 'other' && !get('serviceOther')) errors.serviceOther = 'Omschrijf kort waar het om gaat.';
    if (!get('message')) errors.message = 'Vul een korte omschrijving in.';
    return errors;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Honeypot: silently succeed without a network call
    const honeypot = (form.elements.namedItem('company') as HTMLInputElement | null)?.value ?? '';
    if (honeypot.trim()) {
      setState('success');
      return;
    }

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const first = form.elements.namedItem(Object.keys(errors)[0]) as HTMLElement | null;
      first?.focus();
      return;
    }
    setFieldErrors({});

    if (files.length > MAX_FILES || totalBytes > MAX_TOTAL_BYTES) {
      setFileError(
        totalBytes > MAX_TOTAL_BYTES
          ? 'De bestanden zijn samen te groot (maximaal 60 MB).'
          : `U kunt maximaal ${MAX_FILES} bestanden toevoegen.`,
      );
      return;
    }

    setState('submitting');
    setErrorMsg('');

    try {
      const formData = new FormData(form);
      formData.delete('files');
      for (const f of files) formData.append('files', f, f.name);

      const response = await fetch('/api/forms/offerte', {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Er ging iets mis. Probeer het opnieuw of bel ons.');
      }
      setState('success');
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error && err.message ? err.message : 'Er ging iets mis. Probeer het opnieuw of bel ons.');
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
      <div className="flex flex-col items-center text-center py-8">
        <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mb-5 shadow-[0_12px_30px_-12px_rgba(216,177,90,0.6)]">
          <Check size={32} strokeWidth={2.5} className="text-ink" />
        </div>
        <h3 className="text-2xl font-bold text-bone">Bedankt voor uw aanvraag</h3>
        <p className="mt-3 text-bone-soft max-w-md leading-relaxed">
          We hebben uw aanvraag ontvangen. Youssef neemt zo snel mogelijk contact met u op.
        </p>
        <button
          type="button"
          onClick={() => {
            resetForm();
            onSuccess?.();
          }}
          className="btn btn-gold mt-7"
        >
          {onSuccess ? 'Sluiten' : 'Nog een aanvraag versturen'}
        </button>
        <p className="mt-4 text-sm text-mute">
          Liever direct contact? Bel{' '}
          <a href={business.phone.href} className="text-gold hover:text-gold-bright font-semibold">
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
        <input
          id="offerte-company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Spam token */}
      <input type="hidden" name="cf-turnstile-response" value="dev" />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="offerte-firstName" label="Voornaam" error={fieldErrors.firstName}>
          <input
            id="offerte-firstName"
            type="text"
            name="firstName"
            autoComplete="given-name"
            className="field"
          />
        </Field>
        <Field id="offerte-lastName" label="Achternaam" error={fieldErrors.lastName}>
          <input
            id="offerte-lastName"
            type="text"
            name="lastName"
            autoComplete="family-name"
            className="field"
          />
        </Field>
        <Field id="offerte-email" label="E-mailadres" error={fieldErrors.email}>
          <input
            id="offerte-email"
            type="email"
            name="email"
            autoComplete="email"
            className="field"
          />
        </Field>
        <Field id="offerte-phone" label="Telefoonnummer" error={fieldErrors.phone}>
          <input
            id="offerte-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            className="field"
          />
        </Field>
        <Field id="offerte-postalCode" label="Postcode" error={fieldErrors.postalCode}>
          <input
            id="offerte-postalCode"
            type="text"
            name="postalCode"
            autoComplete="postal-code"
            className="field"
          />
        </Field>
        <Field id="offerte-city" label="Plaats" error={fieldErrors.city}>
          <input
            id="offerte-city"
            type="text"
            name="city"
            autoComplete="address-level2"
            className="field"
          />
        </Field>
      </div>

      <Field id="offerte-service" label="Dienst" error={fieldErrors.service}>
        <select
          id="offerte-service"
          name="service"
          className="field"
          value={serviceValue}
          onChange={(e) => setServiceValue(e.target.value)}
        >
          <option value="" disabled>
            Kies een dienst
          </option>
          {serviceFormOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      {serviceValue === 'other' && (
        <Field id="offerte-serviceOther" label="Toelichting" error={fieldErrors.serviceOther}>
          <input
            id="offerte-serviceOther"
            type="text"
            name="serviceOther"
            placeholder="Waar gaat het om?"
            className="field"
          />
        </Field>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="offerte-propertyType" label="Type pand" optional>
          <select id="offerte-propertyType" name="propertyType" defaultValue="" className="field">
            <option value="">Maak een keuze</option>
            {propertyTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="offerte-urgency" label="Wanneer" optional>
          <select id="offerte-urgency" name="urgency" defaultValue="" className="field">
            <option value="">Maak een keuze</option>
            {urgencyOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="offerte-message" label="Omschrijving" error={fieldErrors.message}>
        <textarea
          id="offerte-message"
          name="message"
          rows={4}
          placeholder="Vertel kort wat er speelt en wat u graag wilt laten doen."
          className="field"
        />
      </Field>

      {/* File dropzone */}
      <div>
        <span className="label">
          Foto's of bijlagen{' '}
          <span className="font-normal normal-case tracking-normal text-mute">(optioneel)</span>
        </span>
        <label
          className={`relative flex flex-col items-center text-center border-2 border-dashed rounded-xl px-4 py-7 cursor-pointer transition-colors ${
            dragOver ? 'border-gold bg-gold/5' : 'border-line bg-ink hover:border-gold/50'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <Upload size={20} className="mb-2 text-gold" />
          <span className="text-sm font-semibold text-bone">
            Sleep bestanden hierheen of klik om te kiezen
          </span>
          <span className="text-xs text-mute mt-1">
            Foto's van de situatie helpen ons een betere inschatting te maken.
          </span>
          <input
            type="file"
            name="files"
            accept="image/*,.pdf,.heic,.heif"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={onFileInputChange}
          />
        </label>

        {files.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${f.size}-${i}`}
                className="flex items-center gap-2 text-sm bg-ink-3 border border-line rounded-lg pl-3 pr-2 py-1.5 max-w-full"
              >
                <Check size={14} className="text-gold shrink-0" />
                <span className="truncate text-bone-soft">{f.name}</span>
                <span className="text-mute text-xs shrink-0">{formatBytes(f.size)}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="p-0.5 rounded text-mute hover:text-bone shrink-0"
                  aria-label={`${f.name} verwijderen`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {fileError && (
          <p className="mt-2 text-sm text-[#e0795f]" role="alert">
            {fileError}
          </p>
        )}
      </div>

      {/* Consent */}
      <label className="flex items-start gap-2.5 text-sm text-bone-soft leading-relaxed">
        <input type="checkbox" required className="mt-1 accent-gold w-4 h-4 shrink-0" />
        <span>
          Ik ga ermee akkoord dat MHA Installaties contact met mij opneemt over deze aanvraag.
        </span>
      </label>

      {state === 'error' && errorMsg && (
        <div className="flex items-start gap-2 text-sm text-[#e0795f] bg-[#e0795f]/10 border border-[#e0795f]/30 px-3 py-2.5 rounded-lg" role="alert">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="btn btn-gold w-full mt-1 disabled:opacity-60 disabled:cursor-wait"
      >
        {state === 'submitting' ? 'Versturen...' : 'Aanvraag versturen'}
      </button>

      <p className="text-sm text-mute text-center -mt-1">
        <Phone size={13} className="inline-block mr-1 -mt-0.5 text-gold" />
        Liever direct contact? Bel{' '}
        <a href={business.phone.href} className="text-gold hover:text-gold-bright font-semibold">
          {business.phone.display}
        </a>
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {optional && (
          <span className="ml-1.5 font-normal normal-case tracking-normal text-mute">
            (optioneel)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-[#e0795f]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
