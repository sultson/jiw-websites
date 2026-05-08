import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { X, Upload, ArrowRight, Check, AlertCircle, Trash2 } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  t: (k: string) => string;
};

type State = 'idle' | 'submitting' | 'success' | 'error';

const MAX_FILES = 8;
const MAX_TOTAL_BYTES = 60 * 1024 * 1024;

const serviceOptions = [
  { value: 'buiten', labelKey: 'ct.svcBuiten' },
  { value: 'binnen', labelKey: 'ct.svcBinnen' },
  { value: 'spray',  labelKey: 'ct.svcSpray' },
  { value: 'wand',   labelKey: 'ct.svcWand' },
  { value: 'other',  labelKey: 'ct.svcOther' },
];

export default function IntakeModal({ open, onClose, t }: Props) {
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [serviceValue, setServiceValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setState('idle');
      setErrorMsg('');
      setFiles([]);
      setServiceValue('');
    }
  }, [open]);

  if (!open) return null;

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

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const overSize = totalBytes > MAX_TOTAL_BYTES;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (overSize) {
      setState('error');
      setErrorMsg(t('ct.attachmentsHint'));
      return;
    }
    setState('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    try {
      const formData = new FormData(form);
      formData.delete('files');
      for (const f of files) formData.append('files', f, f.name);

      const response = await fetch('/api/forms/intake', {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || t('ct.errorGeneric'));
      }
      setState('success');
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error && err.message ? err.message : t('ct.errorGeneric'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-stretch sm:items-center justify-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intake-title"
    >
      <div
        className="bg-paper w-full sm:max-w-2xl max-h-[100dvh] sm:max-h-[92vh] overflow-y-auto sm:rounded-sm shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur-sm border-b border-ink/10 px-5 sm:px-7 py-4 flex items-start justify-between">
          <div>
            <span className="kicker">{t('ct.kicker')}</span>
            <h2 id="intake-title" className="mt-1 text-2xl sm:text-3xl font-extrabold leading-tight">
              {t('ct.title')}
            </h2>
          </div>
          <button
            type="button"
            className="p-2 -mr-2 text-ink/70 hover:text-ink"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {state === 'success' ? (
          <SuccessPanel t={t} onAgain={() => setState('idle')} />
        ) : (
          <form ref={formRef} onSubmit={submit} className="px-5 sm:px-7 py-6 flex flex-col gap-5">
            <p className="text-sm text-ink/75 leading-relaxed">{t('ct.intro')}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t('ct.firstName')}>
                <input type="text" name="firstName" autoComplete="given-name" required className="field" />
              </Field>
              <Field label={t('ct.lastName')}>
                <input type="text" name="lastName" autoComplete="family-name" required className="field" />
              </Field>
              <Field label={t('ct.email')}>
                <input type="email" name="email" autoComplete="email" required className="field" />
              </Field>
              <Field label={t('ct.phone')}>
                <input type="tel" name="phone" autoComplete="tel" required className="field" />
              </Field>
              <Field label={t('ct.postalCode')}>
                <input type="text" name="postalCode" autoComplete="postal-code" required className="field" />
              </Field>
              <Field label={t('ct.city')}>
                <input type="text" name="city" autoComplete="address-level2" required className="field" />
              </Field>
            </div>

            <Field label={t('ct.service')}>
              <select
                name="service"
                required
                className="field"
                value={serviceValue}
                onChange={(e) => setServiceValue(e.target.value)}
              >
                <option value="" disabled>{t('ct.servicePick')}</option>
                {serviceOptions.map((o) => (
                  <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                ))}
              </select>
            </Field>

            {serviceValue === 'other' && (
              <Field label={t('ct.serviceOther')}>
                <input type="text" name="serviceOther" placeholder={t('ct.serviceOtherPlaceholder')} required className="field" />
              </Field>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t('ct.propertyType')} optional t={t}>
                <select name="propertyType" defaultValue="" className="field">
                  <option value="" disabled>{t('ct.propertyPick')}</option>
                  <option value="home">{t('ct.propertyHome')}</option>
                  <option value="apt">{t('ct.propertyApt')}</option>
                  <option value="biz">{t('ct.propertyBiz')}</option>
                  <option value="other">{t('ct.propertyOther')}</option>
                </select>
              </Field>
              <Field label={t('ct.startWindow')} optional t={t}>
                <select name="startWindow" defaultValue="" className="field">
                  <option value="" disabled>{t('ct.startPick')}</option>
                  <option value="asap">{t('ct.startAsap')}</option>
                  <option value="1m">{t('ct.start1m')}</option>
                  <option value="3m">{t('ct.start3m')}</option>
                  <option value="planned">{t('ct.startPlan')}</option>
                </select>
              </Field>
            </div>

            <Field label={t('ct.message')}>
              <textarea
                name="message"
                required
                rows={4}
                placeholder={t('ct.messagePh')}
                className="field-area"
              />
            </Field>

            <Field label={t('ct.attachments')} optional t={t}>
              <FileDrop
                files={files}
                onAdd={addFiles}
                onRemove={removeFile}
                hint={t('ct.attachmentsHint')}
                t={t}
              />
            </Field>

            <label className="flex items-start gap-2.5 text-sm text-ink/75 leading-relaxed">
              <input type="checkbox" required className="mt-1 accent-ochre" />
              <span>{t('ct.consent')}</span>
            </label>

            {state === 'error' && errorMsg && (
              <div className="flex items-start gap-2 text-sm text-ochre-deep bg-ochre/10 border border-ochre/30 px-3 py-2.5 rounded-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={state === 'submitting'}
              className="btn-ochre w-full sm:w-auto sm:self-start mt-2 disabled:opacity-60 disabled:cursor-wait"
            >
              {state === 'submitting' ? t('ct.submitting') : t('ct.submit')}
              {state !== 'submitting' && <ArrowRight size={16} strokeWidth={2.5} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  optional,
  children,
  t,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
  t?: (k: string) => string;
}) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {optional && t && <span className="ml-1.5 normal-case tracking-normal text-ink/40 font-normal">({t('ct.optional')})</span>}
      </span>
      {children}
    </label>
  );
}

function FileDrop({
  files,
  onAdd,
  onRemove,
  hint,
  t,
}: {
  files: File[];
  onAdd: (f: FileList | File[]) => void;
  onRemove: (idx: number) => void;
  hint: string;
  t: (k: string) => string;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div>
      <label
        className={`relative block border-2 border-dashed rounded-sm px-4 py-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-ochre bg-ochre/5' : 'border-ink/20 bg-paper-soft hover:border-ink/35'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) onAdd(e.dataTransfer.files);
        }}
      >
        <Upload size={20} className="mx-auto mb-2 text-ink/60" />
        <div className="text-sm font-semibold text-ink">{t('ct.attachments')}</div>
        <div className="text-xs text-ink/55 mt-1">{hint}</div>
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
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 text-sm bg-paper-soft border border-ink/10 px-3 py-2 rounded-sm">
              <div className="flex items-center gap-2 min-w-0">
                <Check size={14} className="text-ochre-deep shrink-0" />
                <span className="truncate font-medium text-ink">{f.name}</span>
                <span className="text-ink/50 text-xs shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="p-1 text-ink/50 hover:text-ink"
                aria-label="Remove"
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

function SuccessPanel({ t, onAgain }: { t: (k: string) => string; onAgain: () => void }) {
  return (
    <div className="px-5 sm:px-7 py-12 text-center flex flex-col items-center">
      <div className="w-14 h-14 rounded-full bg-ochre/15 text-ochre-deep flex items-center justify-center mb-5">
        <Check size={28} strokeWidth={2.5} />
      </div>
      <h3 className="text-2xl font-extrabold text-ink">{t('ct.successTitle')}</h3>
      <p className="mt-3 text-ink/75 max-w-md leading-relaxed">{t('ct.successBody')}</p>
      <button type="button" onClick={onAgain} className="btn-outline mt-7">
        {t('ct.successAgain')}
      </button>
    </div>
  );
}
