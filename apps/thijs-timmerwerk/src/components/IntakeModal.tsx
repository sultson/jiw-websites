import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X, Upload, ArrowRight, Check, AlertCircle, Trash2, Phone } from 'lucide-react';
import { serviceFormOptions } from '../data/services';
import { SITE } from '../lib/site';

type Props = {
  open: boolean;
  onClose: () => void;
  t: (k: string) => string;
};

type State = 'idle' | 'submitting' | 'success' | 'error';

const MAX_FILES = 8;
const MAX_TOTAL_BYTES = 60 * 1024 * 1024;

export default function IntakeModal({ open, onClose, t }: Props) {
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [serviceValue, setServiceValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
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
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || t('ct.error'));
      }
      setState('success');
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error && err.message ? err.message : t('ct.error'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-cobalt-ink/70 backdrop-blur-sm flex items-stretch sm:items-center justify-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intake-title"
    >
      <div
        className="bg-white w-full sm:max-w-2xl max-h-[100dvh] sm:max-h-[92vh] overflow-y-auto sm:rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-line-cool px-5 sm:px-7 py-4 flex items-start justify-between">
          <div>
            <span className="kicker">{t('ct.eyebrow')}</span>
            <h2
              id="intake-title"
              className="mt-2 text-2xl sm:text-[28px] font-extrabold leading-tight text-ink"
            >
              {t('ct.title')}
            </h2>
          </div>
          <button
            type="button"
            className="p-2 -mr-2 rounded-full text-ink-mute hover:text-ink hover:bg-mist transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {state === 'success' ? (
          <SuccessPanel t={t} onAgain={() => setState('idle')} />
        ) : (
          <form
            ref={formRef}
            onSubmit={submit}
            className="px-5 sm:px-7 py-6 flex flex-col gap-5"
          >
            <p className="text-[15px] text-ink-soft leading-relaxed">{t('ct.intro')}</p>

            <Field label={t('ct.name')}>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                className="field"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t('ct.phone')}>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  required
                  className="field"
                />
              </Field>
              <Field label={t('ct.email')}>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="field"
                />
              </Field>
            </div>

            <Field label={t('ct.address')} optional t={t}>
              <input
                type="text"
                name="address"
                autoComplete="street-address"
                className="field"
              />
            </Field>

            <Field label={t('ct.service')}>
              <select
                name="service"
                required
                className="field"
                value={serviceValue}
                onChange={(e) => setServiceValue(e.target.value)}
              >
                <option value="" disabled>
                  {t('ct.servicePick')}
                </option>
                {serviceFormOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {t(o.labelKey)}
                  </option>
                ))}
              </select>
            </Field>

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

            <label className="flex items-start gap-2.5 text-[14px] text-ink-soft leading-relaxed">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-1 accent-cobalt w-4 h-4"
              />
              <span>{t('ct.consent')}</span>
            </label>

            {state === 'error' && errorMsg && (
              <div className="flex items-start gap-2 text-[14px] text-spark bg-spark/8 border border-spark/25 px-3.5 py-3 rounded-xl">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
              <button
                type="submit"
                disabled={state === 'submitting'}
                className="btn-cobalt w-full sm:w-auto disabled:opacity-60 disabled:cursor-wait"
              >
                {state === 'submitting' ? t('ct.submitting') : t('ct.submit')}
                {state !== 'submitting' && (
                  <ArrowRight size={16} strokeWidth={2.5} />
                )}
              </button>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 text-[14px] font-bold text-cobalt hover:text-cobalt-deep transition-colors"
              >
                <Phone size={15} strokeWidth={2.5} />
                {SITE.phoneDisplay}
              </a>
            </div>
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
  children: React.ReactNode;
  t?: (k: string) => string;
}) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {optional && t && (
          <span className="ml-1.5 normal-case tracking-normal text-ink-mute/70 font-normal">
            ({t('ct.optional')})
          </span>
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
        className={`relative block border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-cobalt bg-cobalt/5'
            : 'border-line-cool bg-mist hover:border-cobalt/40'
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
        <Upload size={20} className="mx-auto mb-2 text-cobalt" />
        <div className="text-[14px] font-bold text-ink">{t('ct.attachments')}</div>
        <div className="text-[12px] text-ink-mute mt-1">{hint}</div>
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
              className="flex items-center justify-between gap-3 text-[14px] bg-mist border border-line-cool px-3 py-2 rounded-xl"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Check size={14} className="text-cobalt shrink-0" />
                <span className="truncate font-semibold text-ink">{f.name}</span>
                <span className="text-ink-mute text-[12px] shrink-0">
                  {(f.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="p-1 text-ink-mute hover:text-spark transition-colors"
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

function SuccessPanel({
  t,
  onAgain,
}: {
  t: (k: string) => string;
  onAgain: () => void;
}) {
  return (
    <div className="px-5 sm:px-7 py-14 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center mb-6">
        <Check size={32} strokeWidth={2.5} />
      </div>
      <h3 className="text-2xl font-extrabold text-ink">{t('ct.successTitle')}</h3>
      <p className="mt-3 text-ink-soft max-w-md leading-relaxed">
        {t('ct.successBody')}
      </p>
      <button type="button" onClick={onAgain} className="btn-outline mt-7">
        {t('ct.successAgain')}
      </button>
    </div>
  );
}
