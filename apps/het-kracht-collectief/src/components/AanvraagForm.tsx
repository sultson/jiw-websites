import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, AlertTriangle, Paperclip, X, FileText } from "lucide-react";
import { FORM_ENDPOINT, type Content, type Profile } from "../content";

type Props = { c: Content; profile: Profile; bare?: boolean; onSuccess?: () => void };
type State = "idle" | "submitting" | "success" | "error";
type FilePreview = { file: File; key: string; url: string | null };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPT = ".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf";

function isImage(file: File) {
  return file.type.startsWith("image/") && !file.type.includes("heic") && !file.type.includes("heif");
}

export default function AanvraagForm({ c, profile, bare = false, onSuccess }: Props) {
  const f = c.pages[profile].fields;
  const profielValue = profile === "werknemer" ? "Werkzoekend" : "Werkgever";

  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount so we don't leak blobs.
  const previewsRef = useRef<FilePreview[]>([]);
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);
  useEffect(() => {
    return () => {
      for (const p of previewsRef.current) if (p.url) URL.revokeObjectURL(p.url);
    };
  }, []);

  const addFiles = (incoming: File[]) => {
    setPreviews((prev) => {
      const seen = new Set(prev.map((p) => p.key));
      const next = [...prev];
      for (const file of incoming) {
        if (file.size === 0 || file.size > MAX_FILE_BYTES || next.length >= MAX_FILES) continue;
        const key = `${file.name}__${file.size}__${file.lastModified}`;
        if (seen.has(key)) continue;
        seen.add(key);
        next.push({ file, key, url: isImage(file) ? URL.createObjectURL(file) : null });
      }
      return next;
    });
  };

  const removeFile = (key: string) => {
    setPreviews((prev) => {
      const target = prev.find((p) => p.key === key);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.key !== key);
    });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (n: string) =>
      (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? "";

    // Honeypot: pretend success without a network call.
    if (get("company")) {
      setState("success");
      onSuccess?.();
      return;
    }

    const errors: { name?: string; email?: string } = {};
    if (!get("firstName")) errors.name = c.form.nameRequired;
    const email = get("email");
    if (email && !emailPattern.test(email)) errors.email = c.form.emailInvalid;
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      const firstKey = errors.name ? "firstName" : "email";
      (form.elements.namedItem(firstKey) as HTMLElement | null)?.focus();
      return;
    }
    setFieldErrors({});

    setState("submitting");
    setErrorMsg("");
    try {
      const body = new FormData(form);
      body.delete("files");
      for (const p of previews) body.append("files", p.file, p.file.name);
      const res = await fetch(FORM_ENDPOINT, { method: "POST", body });
      const result = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!res.ok || !result.ok) throw new Error(result.message || c.form.errorFallback);
      setState("success");
      onSuccess?.();
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error && err.message ? err.message : c.form.errorFallback);
    }
  };

  const resetAll = () => {
    for (const p of previews) if (p.url) URL.revokeObjectURL(p.url);
    setPreviews([]);
    formRef.current?.reset();
    setState("idle");
  };

  if (state === "success") {
    return (
      <div className={bare ? "" : "border border-ink bg-white p-8 sm:p-10"}>
        <span className="grid h-14 w-14 place-items-center bg-ink text-bone">
          <Check size={28} strokeWidth={2.5} />
        </span>
        <h3 className="mt-6 text-[clamp(1.6rem,4vw,2.5rem)] leading-[1.0]">{c.form.successTitle}</h3>
        <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-steel">{c.form.successBody}</p>
        <button type="button" onClick={resetAll} className="btn btn-ghost mt-7">
          {c.form.another}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className={bare ? "" : "border border-ink bg-white p-6 sm:p-8 lg:p-10"}
    >
      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={`hp-${profile}`}>Bedrijf (niet invullen)</label>
        <input id={`hp-${profile}`} type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="cf-turnstile-response" value="dev" />
      <input type="hidden" name="profiel" value={profielValue} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          id="firstName"
          name="firstName"
          label={f.name.label}
          autoComplete="name"
          placeholder={f.name.ph}
          error={fieldErrors.name}
        />
        <Field
          id="email"
          name="email"
          type="email"
          label={f.email.label}
          autoComplete="email"
          placeholder={f.email.ph}
          error={fieldErrors.email}
        />
        <Field id="phone" name="phone" type="tel" label={f.phone.label} autoComplete="tel" placeholder={f.phone.ph} />
        <Field
          id="address"
          name="address"
          label={f.address.label}
          autoComplete="address-level2"
          placeholder={f.address.ph}
        />

        <div className="sm:col-span-2">
          <FieldLabel htmlFor="message" label={f.message.label} />
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder={f.message.ph}
            className="field resize-y"
          />
        </div>

        {/* Attachments */}
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="files" label={c.form.upload.label} />
          <input
            ref={fileInputRef}
            id="files"
            type="file"
            name="files"
            multiple
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => {
              addFiles(Array.from(e.currentTarget.files ?? []));
              e.currentTarget.value = "";
            }}
          />
          {previews.length > 0 && (
            <ul className="mb-2 flex flex-col gap-2">
              {previews.map((p) => (
                <li key={p.key} className="flex items-center gap-3 border border-ink bg-white px-3 py-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden border border-ink bg-bone">
                    {p.url ? (
                      <img src={p.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <FileText size={15} strokeWidth={2} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink" title={p.file.name}>
                    {p.file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(p.key)}
                    aria-label={`${p.file.name} ${c.form.upload.remove.toLowerCase()}`}
                    className="grid h-7 w-7 shrink-0 place-items-center border border-ink text-ink transition-colors hover:bg-ink hover:text-bone"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {previews.length < MAX_FILES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2.5 border border-dashed border-ink bg-white px-4 py-3 font-mono text-[0.72rem] font-bold uppercase tracking-[0.12em] text-steel transition-colors hover:bg-ink hover:text-bone"
            >
              <Paperclip size={15} strokeWidth={2.5} />
              {c.form.upload.cta}
            </button>
          )}
        </div>
      </div>

      {state === "error" && errorMsg && (
        <div
          className="mt-4 flex items-start gap-2.5 border border-ink bg-white px-4 py-3 text-sm font-semibold text-ink"
          role="alert"
        >
          <AlertTriangle size={18} strokeWidth={2.5} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button type="submit" disabled={state === "submitting"} className="btn btn-solid mt-5 w-full disabled:opacity-60">
        {state === "submitting" ? c.form.submitting : c.form.submit}
        {state !== "submitting" && <ArrowRight size={18} strokeWidth={2} />}
      </button>
    </form>
  );
}

function FieldLabel({ htmlFor, label }: { htmlFor: string; label: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink">
      {label}
    </label>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} />
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 font-mono text-[0.66rem] font-bold uppercase tracking-[0.1em] text-ink" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
