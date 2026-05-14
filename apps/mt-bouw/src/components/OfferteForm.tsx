import { useRef, useState, type FormEvent } from 'react';
import { CheckCircle, Upload, AlertCircle, Trash2, Check, ArrowRight } from 'lucide-react';
import { services } from '../content';

const FORM_ENDPOINT = '/api/forms/prijsindicatie';
const MAX_FILES = 8;
const MAX_TOTAL_BYTES = 60 * 1024 * 1024;

type State = 'idle' | 'submitting' | 'success' | 'error';

const TIMINGS = [
  { value: 'asap', label: 'Zo snel mogelijk' },
  { value: '2weeks', label: 'Binnen 2 weken' },
  { value: '1-2months', label: 'Binnen 1 tot 2 maanden' },
  { value: 'noRush', label: 'Geen haast' },
];

export default function OfferteForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [serviceValue, setServiceValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const overSize = totalBytes > MAX_TOTAL_BYTES;

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

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

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
      setErrorMsg('Bijlagen samen te groot. Max 60 MB.');
      return;
    }
    setState('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    try {
      const formData = new FormData(form);
      formData.delete('files');
      for (const f of files) formData.append('files', f, f.name);

      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Versturen mislukt. Probeer opnieuw of bel ons.');
      }
      setState('success');
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error && err.message ? err.message : 'Versturen mislukt. Probeer opnieuw.');
    }
  };

  if (state === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <CheckCircle className="h-10 w-10 text-saffron-deep" />
        <h3 className="text-2xl font-display">Bedankt. We bellen u binnen 1 uur.</h3>
        <p className="text-stone max-w-md">
          Uw aanvraag is binnen. We kijken naar uw foto's en plannen een gratis kennismaking in.
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <button
            type="button"
            onClick={reset}
            className="text-ink font-semibold underline underline-offset-4 decoration-saffron"
          >
            Stuur nog een aanvraag
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Voornaam">
          <input type="text" name="firstName" autoComplete="given-name" required className={inputClass} />
        </Field>
        <Field label="Achternaam">
          <input type="text" name="lastName" autoComplete="family-name" required className={inputClass} />
        </Field>
        <Field label="E-mail">
          <input type="email" name="email" autoComplete="email" required className={inputClass} />
        </Field>
        <Field label="Telefoon">
          <input type="tel" name="phone" autoComplete="tel" required className={inputClass} />
        </Field>
        <Field label="Postcode">
          <input type="text" name="postalCode" autoComplete="postal-code" required className={inputClass} />
        </Field>
        <Field label="Plaatsnaam">
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
            <option key={s.key} value={s.key}>{s.title}</option>
          ))}
          <option value="other">Anders / combinatie</option>
        </select>
      </Field>

      {serviceValue === 'other' && (
        <Field label="Toelichting dienst">
          <input
            type="text"
            name="serviceOther"
            placeholder="Beschrijf kort waar het om gaat"
            required
            className={inputClass}
          />
        </Field>
      )}

      <Field label="Gewenste start" optional>
        <select name="timing" defaultValue="" className={inputClass}>
          <option value="">Wanneer wilt u starten?</option>
          {TIMINGS.map((t) => (
            <option key={t.value} value={t.label}>{t.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Projectomschrijving">
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Wat moet er gebeuren? Type werk, oppervlak, eventuele kleurwensen."
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field label="Foto's" optional>
        <FileDrop files={files} onAdd={addFiles} onRemove={removeFile} />
      </Field>

      <label className="flex items-start gap-2.5 text-sm text-stone leading-relaxed">
        <input type="checkbox" required className="mt-1 accent-saffron-deep" />
        <span>
          Ik ga akkoord dat MT Bouw mijn gegevens gebruikt om contact op te nemen over deze aanvraag.
        </span>
      </label>

      <input type="hidden" name="cf-turnstile-response" value="dev" />

      {state === 'error' && errorMsg && (
        <div className="flex items-start gap-2 text-sm text-clay bg-saffron/10 border border-saffron/30 px-3 py-2.5 rounded-lg">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="btn btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-wait"
      >
        {state === 'submitting' ? 'Versturen...' : 'Verstuur aanvraag'}
        {state !== 'submitting' && <ArrowRight size={18} />}
      </button>

      <p className="text-xs text-stone text-center">
        We reageren binnen 1 uur. Liever direct bellen? Bel <a href="tel:+31686279702" className="font-semibold text-ink underline underline-offset-4 decoration-saffron">06 86 27 97 02</a>.
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
        {optional && <span className="ml-1.5 text-stone/60 font-normal">(optioneel)</span>}
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
          dragOver ? 'border-saffron-deep bg-saffron/10' : 'border-line bg-paper hover:border-stone/40'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) onAdd(e.dataTransfer.files);
        }}
      >
        <Upload size={20} className="mx-auto mb-2 text-stone" />
        <div className="text-sm font-semibold text-ink">Sleep foto's hierheen of klik</div>
        <div className="text-xs text-stone mt-1">Max 8 foto's, samen tot 60 MB. JPG, PNG, WEBP, HEIC of PDF.</div>
        <input
          type="file"
          name="files"
          accept="image/*,.pdf,.heic,.heif"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => { if (e.target.files?.length) onAdd(e.target.files); e.target.value = ''; }}
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 text-sm bg-paper border border-line px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2 min-w-0">
                <Check size={14} className="text-saffron-deep shrink-0" />
                <span className="truncate font-medium text-ink">{f.name}</span>
                <span className="text-stone text-xs shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="p-1 text-stone hover:text-ink"
                aria-label="Verwijder bijlage"
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
