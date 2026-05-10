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
  { value: 'cameras',  labelKey: 'intake.service.cameras' },
  { value: 'portier',  labelKey: 'intake.service.portier' },
  { value: 'night',    labelKey: 'intake.service.night' },
  { value: 'traffic',  labelKey: 'intake.service.traffic' },
  { value: 'retail',   labelKey: 'intake.service.retail' },
  { value: 'personal', labelKey: 'intake.service.personal' },
  { value: 'spoed',    labelKey: 'intake.service.spoed' },
  { value: 'other',    labelKey: 'intake.service.other' },
];

const objectOptions = [
  { value: 'home',     labelKey: 'intake.object.home' },
  { value: 'business', labelKey: 'intake.object.business' },
  { value: 'hotel',    labelKey: 'intake.object.hotel' },
  { value: 'retail',   labelKey: 'intake.object.retail' },
  { value: 'event',    labelKey: 'intake.object.event' },
  { value: 'other',    labelKey: 'intake.object.other' },
];

const urgencyOptions = [
  { value: 'normal', labelKey: 'intake.urgency.normal' },
  { value: 'weeks',  labelKey: 'intake.urgency.weeks' },
  { value: 'days',   labelKey: 'intake.urgency.days' },
  { value: 'now',    labelKey: 'intake.urgency.now' },
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
      setErrorMsg(t('intake.attachmentsHint'));
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
        throw new Error(result.message || t('intake.errorGeneric'));
      }
      setState('success');
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error && err.message ? err.message : t('intake.errorGeneric'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-night-deep/80 backdrop-blur-sm flex items-stretch sm:items-center justify-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intake-title"
    >
      <div
        className="bg-night-soft border border-mist w-full sm:max-w-2xl max-h-[100dvh] sm:max-h-[92vh] overflow-y-auto sm:rounded-sm shadow-[0_24px_64px_rgba(0,0,0,0.6)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-night-soft/95 backdrop-blur-sm border-b border-mist px-5 sm:px-7 py-4 flex items-start justify-between">
          <div>
            <span className="kicker !text-xenon-bright">{t('hero.kicker')}</span>
            <h2 id="intake-title" className="mt-1 font-display text-silver text-2xl sm:text-3xl leading-tight">
              {t('intake.title')}
            </h2>
          </div>
          <button
            type="button"
            className="p-2 -mr-2 text-steel-mute hover:text-silver"
            onClick={onClose}
            aria-label={t('spoed.modal.close')}
          >
            <X size={22} />
          </button>
        </div>

        {state === 'success' ? (
          <SuccessPanel t={t} onAgain={() => setState('idle')} />
        ) : (
          <form ref={formRef} onSubmit={submit} className="px-5 sm:px-7 py-6 flex flex-col gap-5">
            <p className="text-sm text-steel/85 leading-relaxed">{t('intake.subtitle')}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t('intake.field.service')}>
                <select
                  name="service"
                  required
                  className="field"
                  value={serviceValue}
                  onChange={(e) => setServiceValue(e.target.value)}
                >
                  <option value="" disabled>{t('intake.servicePick')}</option>
                  {serviceOptions.map((o) => (
                    <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                  ))}
                </select>
              </Field>
              <Field label={t('intake.field.objectType')}>
                <select name="objectType" className="field" defaultValue="">
                  <option value="" disabled>{t('intake.servicePick')}</option>
                  {objectOptions.map((o) => (
                    <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                  ))}
                </select>
              </Field>
            </div>

            {serviceValue === 'other' && (
              <Field label={t('intake.field.serviceOther')}>
                <input
                  type="text"
                  name="serviceOther"
                  placeholder={t('intake.serviceOtherPlaceholder')}
                  required
                  className="field"
                />
              </Field>
            )}

            <Field label={t('intake.field.urgency')}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {urgencyOptions.map((u, i) => (
                  <label
                    key={u.value}
                    className="cursor-pointer relative"
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={u.value}
                      defaultChecked={i === 0}
                      className="peer sr-only"
                    />
                    <span className="block text-center px-3 py-2.5 border border-mist bg-night-panel text-steel/85 text-[13px] font-display tracking-wide peer-checked:border-xenon-bright peer-checked:text-silver peer-checked:bg-xenon/30 transition-colors">
                      {t(u.labelKey)}
                    </span>
                  </label>
                ))}
              </div>
            </Field>

            <Field label={t('intake.field.message')}>
              <textarea
                name="message"
                required
                rows={4}
                className="field-area"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t('intake.field.name')}>
                <input type="text" name="name" autoComplete="name" required className="field" />
              </Field>
              <Field label={t('intake.field.phone')}>
                <input type="tel" name="phone" autoComplete="tel" required className="field" />
              </Field>
              <Field label={t('intake.field.email')}>
                <input type="email" name="email" autoComplete="email" required className="field" />
              </Field>
              <Field label={t('intake.field.postalCode')}>
                <input type="text" name="postalCode" autoComplete="postal-code" required className="field" />
              </Field>
              <Field label={t('intake.field.city')}>
                <input type="text" name="city" autoComplete="address-level2" required className="field" />
              </Field>
            </div>

            <Field label={t('intake.field.attachments')} optional t={t}>
              <FileDrop
                files={files}
                onAdd={addFiles}
                onRemove={removeFile}
                hint={t('intake.attachmentsHint')}
                t={t}
              />
            </Field>

            <label className="flex items-start gap-2.5 text-sm text-steel/80 leading-relaxed">
              <input type="checkbox" required className="mt-1 accent-xenon-bright" />
              <span>{t('intake.consent')}</span>
            </label>

            {state === 'error' && errorMsg && (
              <div className="flex items-start gap-2 text-sm text-xenon-bright bg-xenon-bright/10 border border-xenon-bright/30 px-3 py-2.5 rounded-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={state === 'submitting'}
              className="btn-xenon w-full sm:w-auto sm:self-start mt-2 disabled:opacity-60 disabled:cursor-wait"
            >
              {state === 'submitting' ? t('intake.submitting') : t('intake.submit')}
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
        {optional && t && (
          <span className="ml-1.5 normal-case tracking-normal text-steel-mute font-normal">
            ({t('intake.optional')})
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
        className={`relative block border border-dashed rounded-sm px-4 py-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-xenon-bright bg-xenon-bright/10' : 'border-mist bg-night-panel hover:border-steel-mute'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) onAdd(e.dataTransfer.files);
        }}
      >
        <Upload size={20} className="mx-auto mb-2 text-steel-mute" />
        <div className="text-sm font-display tracking-wide text-silver">{t('intake.dropzone.idle')}</div>
        <div className="spec-line mt-1.5">{hint}</div>
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
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 text-sm bg-night-panel border border-mist px-3 py-2 rounded-sm">
              <div className="flex items-center gap-2 min-w-0">
                <Check size={14} className="text-xenon-bright shrink-0" />
                <span className="truncate font-medium text-silver">{f.name}</span>
                <span className="text-steel-mute text-xs shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="p-1 text-steel-mute hover:text-silver"
                aria-label={t('intake.dropzone.remove')}
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
      <div className="w-14 h-14 rounded-full bg-xenon-bright/15 text-xenon-bright flex items-center justify-center mb-5">
        <Check size={28} strokeWidth={2.5} />
      </div>
      <h3 className="font-display text-2xl text-silver">{t('intake.success.title')}</h3>
      <p className="mt-3 text-steel/85 max-w-md leading-relaxed">{t('intake.success.body')}</p>
      <button type="button" onClick={onAgain} className="btn-outline mt-7">
        {t('intake.successAgain')}
      </button>
    </div>
  );
}
