import { useEffect, useMemo, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Heart,
  Flower2,
  Leaf,
  Download,
} from 'lucide-react';
import { serviceCategories, findService, type Service, type ServiceCategory } from '../data/services';
import { slotsForDay, isOpenOn } from '../data/hours';
import { buildIcs, downloadIcs } from '../lib/ics';
import type { Lang } from '../translations';

type Props = {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  t: (k: string) => string;
  prefillServiceId?: string | null;
};

type BookingState = {
  service: Service | null;
  category: ServiceCategory | null;
  date: Date | null;
  time: string | null;
  name: string;
  phone: string;
  email: string;
  note: string;
};

const emptyState: BookingState = {
  service: null,
  category: null,
  date: null,
  time: null,
  name: '',
  phone: '',
  email: '',
  note: '',
};

const iconMap = { sparkles: Sparkles, heart: Heart, flower: Flower2, leaf: Leaf };

function nextDays(count: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

// Deterministic pseudo-random so the same date returns the same "taken" slots per session
function takenSlots(date: Date, all: string[]): Set<string> {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const taken = new Set<string>();
  let x = seed;
  for (const slot of all) {
    // xorshift-ish
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5; x >>>= 0;
    if ((x % 100) < 28) taken.add(slot);
  }
  return taken;
}

function formatDateLong(d: Date, lang: Lang): string {
  return d.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function BookingModal({ open, onClose, lang, t, prefillServiceId }: Props) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<BookingState>(emptyState);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (prefillServiceId) {
      const found = findService(prefillServiceId);
      if (found) {
        setState({ ...emptyState, service: found.service, category: found.category });
        setStep(2);
        setExpandedCat(found.category.id);
        return;
      }
    }
    // fresh open without prefill
    setState(emptyState);
    setStep(1);
    setExpandedCat(null);
  }, [open, prefillServiceId]);

  const totalSteps = 5;

  const days = useMemo(() => nextDays(14), []);

  const daySlots = useMemo(() => {
    if (!state.date) return [];
    return slotsForDay(state.date);
  }, [state.date]);

  const taken = useMemo(() => {
    if (!state.date) return new Set<string>();
    return takenSlots(state.date, daySlots);
  }, [state.date, daySlots]);

  const canNext = () => {
    if (step === 1) return !!state.service;
    if (step === 2) return !!state.date;
    if (step === 3) return !!state.time;
    if (step === 4) return state.name.trim().length > 1 && /^[0-9+\s-]{8,}$/.test(state.phone);
    return true;
  };

  const goNext = () => setStep(s => Math.min(totalSteps, s + 1));
  const goBack = () => setStep(s => Math.max(1, s - 1));

  const submit = () => {
    // Persist for owner handover demo
    try {
      const existing = JSON.parse(localStorage.getItem('mkn.bookings') || '[]');
      existing.push({
        at: new Date().toISOString(),
        service: state.service?.id,
        date: state.date?.toISOString(),
        time: state.time,
        name: state.name,
        phone: state.phone,
        email: state.email,
        note: state.note,
      });
      localStorage.setItem('mkn.bookings', JSON.stringify(existing));
    } catch {}
    // eslint-disable-next-line no-console
    console.log('[Mykimnails mock booking]', state);
    setStep(5);
  };

  const handleIcs = () => {
    if (!state.service || !state.date || !state.time) return;
    const [h, m] = state.time.split(':').map(Number);
    const start = new Date(state.date);
    start.setHours(h, m, 0, 0);
    const title = `Mykimnails — ${lang === 'nl' ? state.service.nameNl : state.service.nameEn}`;
    const ics = buildIcs({
      title,
      start,
      durationMinutes: state.service.durationMin || 60,
      location: 'Zwanenveld 9040, 6538 SB Nijmegen',
      description: `${title}\n€${state.service.price}\n06 34899263`,
    });
    downloadIcs('mykimnails-afspraak', ics);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-espresso/60 backdrop-blur-sm flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-cream w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[88vh]"
      >
            {/* Header */}
            <div className="shrink-0 px-5 md:px-8 pt-5 pb-4 border-b border-espresso/5 flex items-center justify-between gap-4 bg-cream">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-gold font-medium">
                  {t('book.step')} {Math.min(step, 4)} {t('book.of')} 4
                </p>
                <h2 className="font-serif text-2xl md:text-3xl mt-1">{t('book.title')}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-black/5"
                aria-label={t('book.close')}
              >
                <X size={22} />
              </button>
            </div>

            {/* Progress */}
            {step < 5 && (
              <div className="shrink-0 px-5 md:px-8 py-3 bg-cream">
                <div className="h-1 bg-espresso/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 md:px-8 py-4">
              <div key={step}>
                  {step === 1 && (
                    <Step1
                      lang={lang}
                      t={t}
                      expandedCat={expandedCat}
                      setExpandedCat={setExpandedCat}
                      selected={state.service}
                      onSelect={(service, category) =>
                        setState(s => ({ ...s, service, category }))
                      }
                    />
                  )}
                  {step === 2 && (
                    <Step2
                      lang={lang}
                      t={t}
                      days={days}
                      selected={state.date}
                      onSelect={d => setState(s => ({ ...s, date: d, time: null }))}
                    />
                  )}
                  {step === 3 && (
                    <Step3
                      t={t}
                      lang={lang}
                      date={state.date}
                      slots={daySlots}
                      taken={taken}
                      selected={state.time}
                      onSelect={time => setState(s => ({ ...s, time }))}
                    />
                  )}
                  {step === 4 && (
                    <Step4
                      lang={lang}
                      t={t}
                      state={state}
                      setField={(k, v) => setState(s => ({ ...s, [k]: v }))}
                    />
                  )}
                  {step === 5 && (
                    <Step5
                      lang={lang}
                      t={t}
                      state={state}
                      onIcs={handleIcs}
                      onAnother={() => {
                        setState(emptyState);
                        setStep(1);
                      }}
                      onClose={onClose}
                    />
                  )}
              </div>
            </div>

            {/* Footer / actions */}
            {step < 5 && (
              <div className="shrink-0 px-5 md:px-8 py-4 border-t border-espresso/5 bg-cream flex items-center justify-between gap-3">
                <button
                  onClick={goBack}
                  disabled={step === 1}
                  className="btn-ghost disabled:opacity-30"
                >
                  <ChevronLeft size={16} /> {t('book.back')}
                </button>
                {step < 4 ? (
                  <button
                    onClick={goNext}
                    disabled={!canNext()}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('book.next')}
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={!canNext()}
                    className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('book.s4.submit')}
                  </button>
                )}
              </div>
            )}
      </div>
    </div>
  );
}

/* ── Steps ── */

function Step1({
  lang,
  t,
  expandedCat,
  setExpandedCat,
  selected,
  onSelect,
}: {
  lang: Lang;
  t: (k: string) => string;
  expandedCat: string | null;
  setExpandedCat: (id: string | null) => void;
  selected: Service | null;
  onSelect: (s: Service, c: ServiceCategory) => void;
}) {
  return (
    <div>
      <h3 className="font-serif text-xl md:text-2xl">{t('book.s1.title')}</h3>
      <p className="text-sm text-espresso/60 mt-1">{t('book.s1.sub')}</p>
      <div className="mt-5 space-y-2">
        {serviceCategories.map(cat => {
          const Icon = iconMap[cat.icon];
          const open = expandedCat === cat.id;
          return (
            <div key={cat.id} className="border border-espresso/10 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setExpandedCat(open ? null : cat.id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-gold">
                    <Icon size={16} />
                  </div>
                  <span className="font-serif text-lg">
                    {lang === 'nl' ? cat.titleNl : cat.titleEn}
                  </span>
                </div>
                <ChevronRight
                  size={18}
                  className={`text-espresso/40 ${open ? 'rotate-90' : ''}`}
                />
              </button>
              {open && (
                <ul className="divide-y divide-espresso/5 border-t border-espresso/5">
                  {cat.services.map(s => {
                    const isSel = selected?.id === s.id;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => onSelect(s, cat)}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left ${
                            isSel ? 'bg-blush' : 'hover:bg-cream'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {lang === 'nl' ? s.nameNl : s.nameEn}
                            </p>
                            <p className="text-xs text-espresso/55 mt-0.5">
                              {s.durationMin > 0 ? `${s.durationMin} min` : '—'} · €{s.price}
                            </p>
                          </div>
                          {isSel && <CheckCircle2 size={18} className="text-gold" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step2({
  lang,
  t,
  days,
  selected,
  onSelect,
}: {
  lang: Lang;
  t: (k: string) => string;
  days: Date[];
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  return (
    <div>
      <h3 className="font-serif text-xl md:text-2xl">{t('book.s2.title')}</h3>
      <p className="text-sm text-espresso/60 mt-1">{t('book.s2.sub')}</p>

      <div className="mt-5 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
        {days.map(d => {
          const isOpen = isOpenOn(d);
          const isSel = selected?.toDateString() === d.toDateString();
          const weekday = d.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', { weekday: 'short' });
          return (
            <button
              key={d.toISOString()}
              onClick={() => isOpen && onSelect(d)}
              disabled={!isOpen}
              className={`aspect-[4/5] rounded-xl border flex flex-col items-center justify-center gap-0.5 ${
                isSel
                  ? 'bg-espresso text-cream border-espresso'
                  : isOpen
                  ? 'bg-white border-espresso/10 hover:border-gold'
                  : 'bg-blush-soft/40 border-transparent text-espresso/30 cursor-not-allowed'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider opacity-70">{weekday}</span>
              <span className="font-serif text-2xl leading-none">{d.getDate()}</span>
              <span className="text-[10px] opacity-60">
                {d.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', { month: 'short' })}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="mt-5 text-sm text-espresso/70 flex items-center gap-2">
          <Calendar size={14} className="text-gold" />
          <span className="capitalize">{formatDateLong(selected, lang)}</span>
        </p>
      )}
    </div>
  );
}

function Step3({
  t,
  lang,
  date,
  slots,
  taken,
  selected,
  onSelect,
}: {
  t: (k: string) => string;
  lang: Lang;
  date: Date | null;
  slots: string[];
  taken: Set<string>;
  selected: string | null;
  onSelect: (time: string) => void;
}) {
  return (
    <div>
      <h3 className="font-serif text-xl md:text-2xl">{t('book.s3.title')}</h3>
      <p className="text-sm text-espresso/60 mt-1">{t('book.s3.sub')}</p>

      {date && (
        <p className="mt-4 text-sm text-espresso/70 flex items-center gap-2">
          <Calendar size={14} className="text-gold" />
          <span className="capitalize">{formatDateLong(date, lang)}</span>
        </p>
      )}

      {slots.length === 0 ? (
        <p className="mt-6 text-sm text-espresso/60">{t('book.s3.noSlots')}</p>
      ) : (
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map(s => {
            const isTaken = taken.has(s);
            const isSel = selected === s;
            return (
              <button
                key={s}
                onClick={() => !isTaken && onSelect(s)}
                disabled={isTaken}
                className={`py-3 rounded-xl border text-sm font-medium tabular-nums ${
                  isSel
                    ? 'bg-espresso text-cream border-espresso'
                    : isTaken
                    ? 'bg-blush-soft/40 border-transparent text-espresso/30 line-through cursor-not-allowed'
                    : 'bg-white border-espresso/10 hover:border-gold'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Step4({
  lang,
  t,
  state,
  setField,
}: {
  lang: Lang;
  t: (k: string) => string;
  state: BookingState;
  setField: (k: keyof BookingState, v: string) => void;
}) {
  return (
    <div>
      <h3 className="font-serif text-xl md:text-2xl">{t('book.s4.title')}</h3>

      <div className="mt-5 p-4 rounded-xl bg-blush/60 border border-gold/20">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-2">{t('book.s4.summary')}</p>
        <ul className="text-sm space-y-1 text-espresso/80">
          <li className="flex items-center gap-2">
            <Sparkles size={14} className="text-gold" />
            {state.service && (lang === 'nl' ? state.service.nameNl : state.service.nameEn)} — €{state.service?.price}
          </li>
          <li className="flex items-center gap-2">
            <Calendar size={14} className="text-gold" />
            <span className="capitalize">{state.date && formatDateLong(state.date, lang)}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock size={14} className="text-gold" />
            {state.time} · {state.service?.durationMin} min
          </li>
        </ul>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <label className="text-xs font-medium text-espresso/70">{t('book.s4.name')} *</label>
          <input
            className="field mt-1.5"
            value={state.name}
            onChange={e => setField('name', e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-espresso/70">{t('book.s4.phone')} *</label>
          <input
            className="field mt-1.5"
            type="tel"
            inputMode="tel"
            placeholder="06 12345678"
            value={state.phone}
            onChange={e => setField('phone', e.target.value)}
            autoComplete="tel"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-espresso/70">{t('book.s4.email')}</label>
          <input
            className="field mt-1.5"
            type="email"
            inputMode="email"
            value={state.email}
            onChange={e => setField('email', e.target.value)}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-espresso/70">{t('book.s4.note')}</label>
          <textarea
            className="field mt-1.5 min-h-[80px] resize-none"
            value={state.note}
            onChange={e => setField('note', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

function Step5({
  lang,
  t,
  state,
  onIcs,
  onAnother,
  onClose,
}: {
  lang: Lang;
  t: (k: string) => string;
  state: BookingState;
  onIcs: () => void;
  onAnother: () => void;
  onClose: () => void;
}) {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald flex items-center justify-center">
        <CheckCircle2 size={44} className="text-cream" strokeWidth={1.5} />
      </div>

      <h3 className="mt-6 font-serif text-3xl md:text-4xl">{t('book.s5.title')}</h3>
      <p className="mt-3 text-espresso/70 max-w-sm mx-auto text-sm leading-relaxed">
        {t('book.s5.sub')}
      </p>

      <div className="mt-6 inline-block p-5 rounded-xl bg-blush/50 border border-gold/20 text-left text-sm space-y-1.5">
        <p className="font-medium">
          {state.service && (lang === 'nl' ? state.service.nameNl : state.service.nameEn)}
        </p>
        <p className="text-espresso/70 capitalize">
          {state.date && formatDateLong(state.date, lang)} · {state.time}
        </p>
        <p className="text-espresso/70">
          {state.name} · {state.phone}
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
        <button onClick={onIcs} className="btn-gold">
          <Download size={14} /> {t('book.s5.ics')}
        </button>
        <button onClick={onAnother} className="btn-outline">
          {t('book.s5.again')}
        </button>
        <button onClick={onClose} className="btn-ghost">
          {t('book.s5.done')}
        </button>
      </div>

    </div>
  );
}
