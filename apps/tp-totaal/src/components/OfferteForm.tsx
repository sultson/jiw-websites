import { useRef, useState, type FormEvent } from 'react';
import { Upload, Check, AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import { services, business } from '../content';

type State = 'idle' | 'submitting' | 'success' | 'error';

const MAX_FILES = 8;
const MAX_TOTAL_BYTES = 60 * 1024 * 1024;
const FORM_ENDPOINT = '/api/forms/prijsindicatie';

const PROPERTY_OPTIONS = [
  { value: 'home', label: 'Woning' },
  { value: 'apt', label: 'Appartement' },
  { value: 'biz', label: 'Bedrijfspand' },
  { value: 'vve', label: 'VVE' },
  { value: 'other', label: 'Anders' },
];

const URGENCY_OPTIONS = [
  { value: 'planned', label: 'Gepland, geen haast' },
  { value: 'soon', label: 'Binnen 1-2 maanden' },
  { value: 'urgent', label: 'Zo snel mogelijk' },
];

export default function OfferteForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [serviceValue, setServiceValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const addFiles = (next: FileList | File[]) => {
    const incoming = Array.from(next);
    setFiles((prev) => {
      const merged = [...prev];
      for (const f of incoming) {
        if (merged.length >= MAX_FILES) break;
        if (merged.some((m) => m.name === f.name && m.size === f.size)) continue;
        merged.push(f);
      }
      return merged;
    });
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const overSize = totalBytes > MAX_TOTAL_BYTES;

  const reset = () => {
    setState('idle');
    setErrorMsg('');
    setFiles([]);
    setServiceValue('');
    formRef.current?.reset();
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (overSize) {
      setState('error');
      setErrorMsg('Bestanden zijn samen te groot. Maximaal 60 MB totaal.');
      return;
    }
    setState('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    try {
      const formData = new FormData(form);
      formData.delete('files');
      for (const f of files) formData.append('files', f, f.name);
      formData.append('cf-turnstile-response', 'dev');

      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Er ging iets mis. Probeer het opnieuw.');
      }
      setState('success');
    } catch (err) {
      setState('error');
      setErrorMsg(
        err instanceof Error && err.message ? err.message : 'Er ging iets mis. Probeer het opnieuw.',
      );
    }
  };

  if (state === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <span className="w-14 h-14 rounded-full bg-brick/15 text-brick flex items-center justify-center">
          <Check size={28} strokeWidth={2.5} />
        </span>
        <h3 className="text-2xl font-display">Bedankt, uw aanvraag is binnen.</h3>
        <p className="text-stone leading-relaxed">
          Wij nemen binnen één werkdag contact met u op om de aanvraag door te nemen en een afspraak te plannen.
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <button
            type="button"
            onClick={reset}
            className="text-ink font-semibold underline underline-offset-4 decoration-brick"
          >
            Nog een aanvraag sturen
          </button>
          {onSuccess && (
            <button
              type="button"
              onClick={onSuccess}
              className="text-stone font-medium hover:text-ink"
            >
              Sluiten
            </button>
          )}
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink placeholder:text-stone/60 focus:border-ink focus:outline-none';

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Voornaam">
          <input type="text" name="firstName" autoComplete="given-name" required className={inputClass} />
        </Field>
        <Field label="Achternaam">
          <input type="text" name="lastName" autoComplete="family-name" required className={inputClass} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email">
          <input type="email" name="email" autoComplete="email" required className={inputClass} />
        </Field>
        <Field label="Telefoon">
          <input type="tel" name="phone" autoComplete="tel" required className={inputClass} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Postcode">
          <input type="text" name="postalCode" autoComplete="postal-code" required className={inputClass} />
        </Field>
        <Field label="Plaats">
          <input type="text" name="city" autoComplete="address-level2" required className={inputClass} />
        </Field>
      </div>

      <Field label="Type werk">
        <select
          name="service"
          required
          className={inputClass}
          value={serviceValue}
          onChange={(e) => setServiceValue(e.target.value)}
        >
          <option value="" disabled>Kies een dienst</option>
          {services.map((s) => (
            <option key={s.key} value={s.formValue}>{s.title}</option>
          ))}
          <option value="other">Iets anders</option>
        </select>
      </Field>

      {serviceValue === 'other' && (
        <Field label="Beschrijf kort uw vraag">
          <input
            type="text"
            name="serviceOther"
            placeholder="Bijvoorbeeld: dakkapel verven en stuccen"
            required
            className={inputClass}
          />
        </Field>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Type object" optional>
          <select name="propertyType" defaultValue="" className={inputClass}>
            <option value="" disabled>Kies een type</option>
            {PROPERTY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Urgentie" optional>
          <select name="urgency" defaultValue="" className={inputClass}>
            <option value="" disabled>Kies een termijn</option>
            {URGENCY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Beschrijf uw project">
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Wat moet er gebeuren, hoe groot is het werk en wanneer wilt u starten?"
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field label="Foto's (optioneel)" optional>
        <FileDrop files={files} onAdd={addFiles} onRemove={removeFile} />
      </Field>

      {state === 'error' && errorMsg && (
        <div className="flex items-start gap-2 text-sm text-rust bg-brick/10 border border-brick/30 px-3 py-2.5 rounded-lg">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="btn btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-wait"
      >
        {state === 'submitting' ? 'Versturen...' : 'Vraag prijsindicatie aan'}
        {state !== 'submitting' && <ArrowRight size={16} strokeWidth={2.5} />}
      </button>

      <p className="text-xs text-stone text-center">
        Wij reageren binnen één werkdag. Liever bellen?{' '}
        <a
          href={business.phone.href}
          className="font-semibold text-ink underline underline-offset-4 decoration-brick"
        >
          {business.phone.display}
        </a>
      </p>
    </form>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">
        {label}
        {optional && (
          <span className="ml-1.5 text-stone/60 font-normal">(optioneel)</span>
        )}
      </span>
      {children}
    </label>
  );
}

function FileDrop({
  files,
  onAdd,
  onRemove,
}: {
  files: File[];
  onAdd: (f: FileList | File[]) => void;
  onRemove: (idx: number) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div>
      <label
        className={`relative block border-2 border-dashed rounded-lg px-4 py-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-brick bg-brick/5'
            : 'border-line bg-bone-soft hover:border-stone/35'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) onAdd(e.dataTransfer.files);
        }}
      >
        <Upload size={20} className="mx-auto mb-2 text-stone" />
        <div className="text-sm font-semibold text-ink">
          Foto's slepen of kiezen
        </div>
        <div className="text-xs text-stone mt-1">
          Maximaal 8 bestanden, 12 MB per stuk
        </div>
        <input
          type="file"
          name="files"
          accept="image/*,.pdf,.heic,.heif"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files?.length) onAdd(e.target.files);
            e.target.value = '';
          }}
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between gap-3 text-sm bg-bone-soft border border-line px-3 py-2 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Check size={14} className="text-brick shrink-0" />
                <span className="truncate font-medium text-ink">{f.name}</span>
                <span className="text-stone text-xs shrink-0">
                  {(f.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="p-1 text-stone hover:text-ink"
                aria-label={`Verwijder ${f.name}`}
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
