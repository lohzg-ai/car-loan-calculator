"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateLoan } from "@/lib/calculateLoan";
import { loadInputs, saveInputs } from "@/lib/storage";
import { FOOTNOTE, type SummaryInputs } from "@/lib/summary";
import { parseAmount, validateAmount, validateRate } from "@/lib/validation";
import { formatSGD } from "@/lib/format";
import { DecimalField } from "./DecimalField";
import { ResultsFigures } from "./ResultsFigures";
import { ShareActions } from "./ShareActions";
import { SnapshotCard } from "./SnapshotCard";
import { TenureField } from "./TenureField";
import { Toast, type ToastMessage } from "./Toast";

const DEFAULT_RATE = "2.68";
const DEFAULT_TENURE = 5;
const DEBOUNCE_MS = 200;

interface FormState {
  amount: string;
  rate: string;
  tenure: number;
}

function compute(form: FormState) {
  if (validateAmount(form.amount) || validateRate(form.rate)) return null;
  const inputs: SummaryInputs = {
    principal: parseAmount(form.amount),
    ratePercent: Number(form.rate),
    tenureYears: form.tenure,
  };
  const result = calculateLoan({
    principal: inputs.principal,
    annualRatePercent: inputs.ratePercent,
    tenureYears: inputs.tenureYears,
  });
  return { inputs, result };
}

export default function LoanCalculator() {
  const [form, setForm] = useState<FormState>({ amount: "", rate: DEFAULT_RATE, tenure: DEFAULT_TENURE });
  const [settled, setSettled] = useState<FormState>(form); // debounced copy used for results
  const [touched, setTouched] = useState({ amount: false, rate: false });
  const [restored, setRestored] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const snapshotRef = useRef<HTMLDivElement>(null);

  // Restore last inputs from this browser session (sessionStorage only).
  useEffect(() => {
    const saved = loadInputs();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from browser storage after hydration
      setForm(saved);
      setSettled(saved); // skip the debounce so restored results appear immediately
      setTouched({ amount: saved.amount !== "", rate: true });
    }
    setRestored(true);
  }, []);

  // Persist immediately on every change so a quick refresh never loses a keystroke.
  useEffect(() => {
    if (restored) saveInputs(form);
  }, [restored, form]);

  // Debounce recalculation.
  useEffect(() => {
    if (form === settled) return;
    const t = setTimeout(() => setSettled(form), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [form, settled]);

  const computed = useMemo(() => compute(settled), [settled]);
  const showToast = useCallback((text: string) => setToast({ id: Date.now(), text }), []);
  const clearToast = useCallback(() => setToast(null), []);

  const amountError = touched.amount ? validateAmount(form.amount) : null;
  const rateError = touched.rate ? validateRate(form.rate) : null;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
        <form
          className="lg:col-span-5"
          noValidate
          onSubmit={(e) => e.preventDefault()}
          aria-label="Loan details"
        >
          <h2 className="eyebrow border-b border-ink pb-4 text-ink">Loan details</h2>
          <div className="mt-8 space-y-6">
            <DecimalField
              id="amount"
              label="Loan amount (S$)"
              prefix="S$"
              placeholder="100,000"
              group
              value={form.amount}
              onChange={(v) => {
                update("amount", v);
                setTouched((t) => ({ ...t, amount: true }));
              }}
              onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
              error={amountError}
            />
            <DecimalField
              id="rate"
              label="Interest rate (% p.a.)"
              suffix="% p.a."
              maxIntDigits={3}
              value={form.rate}
              onChange={(v) => {
                update("rate", v);
                setTouched((t) => ({ ...t, rate: true }));
              }}
              onBlur={() => setTouched((t) => ({ ...t, rate: true }))}
              error={rateError}
              hint="Flat rate, 0% to 20%."
            />
            <TenureField value={form.tenure} onChange={(v) => update("tenure", v)} />
          </div>
        </form>

        <section className="lg:col-span-7" aria-labelledby="results-heading">
          <div className="border border-line p-6 sm:p-10">
            <h2 id="results-heading" className="eyebrow border-b border-ink pb-4 text-ink">
              Your estimate
            </h2>
            <div className="mt-8">
              <ResultsFigures result={computed?.result ?? null} />
            </div>
            <p className="mt-6 text-sm text-mid">
              {computed ? FOOTNOTE : "Enter a loan amount to see your estimate."}
            </p>
            {/* Concise announcement for screen readers whenever results settle. */}
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {computed
                ? `Loan payable per month ${formatSGD(computed.result.perMonth)}. Total loan amount ${formatSGD(computed.result.totalPayable)}.`
                : ""}
            </p>
          </div>

          <div className="mt-6">
            <ShareActions
              snapshotRef={snapshotRef}
              inputs={computed?.inputs ?? null}
              result={computed?.result ?? null}
              onToast={showToast}
            />
          </div>
        </section>
      </div>

      <SnapshotCard ref={snapshotRef} inputs={computed?.inputs ?? null} result={computed?.result ?? null} />
      <Toast message={toast} onDone={clearToast} />
    </>
  );
}
