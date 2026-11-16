import type { Ref } from "react";
import type { LoanResult } from "@/lib/calculateLoan";
import { formatSGD } from "@/lib/format";
import { FOOTNOTE, formatRate, formatTenure, type SummaryInputs } from "@/lib/summary";
import { ResultsFigures } from "./ResultsFigures";

/**
 * Off-screen, fixed-width version of the results used only for the PNG export.
 * The outer wrapper moves it off-screen; the inner node (the one captured) has
 * plain styles so html-to-image doesn't copy the off-screen positioning.
 * The date is filled in at capture time via [data-snapshot-date].
 */
export function SnapshotCard({
  ref,
  inputs,
  result,
}: {
  ref: Ref<HTMLDivElement>;
  inputs: SummaryInputs | null;
  result: LoanResult | null;
}) {
  const rows = inputs
    ? [
        ["Loan amount", formatSGD(inputs.principal)],
        ["Interest rate", formatRate(inputs.ratePercent)],
        ["Loan tenure", formatTenure(inputs.tenureYears)],
      ]
    : [];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed top-0 -left-[10000px]">
      <div ref={ref} className="w-[640px] bg-white p-12 font-sans text-charcoal">
        <div className="flex items-center justify-between border-b border-ink pb-5">
          <span className="eyebrow tracking-[0.2em] text-ink">Car Loan Calculator</span>
          <span data-snapshot-date className="text-sm text-mid" />
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-6">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="eyebrow text-mid">{label}</dt>
              <dd className="tabular mt-2 text-base font-normal text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10">
          <ResultsFigures result={result} />
        </div>

        <p className="mt-6 text-xs text-mid">{FOOTNOTE}</p>
      </div>
    </div>
  );
}
