import type { Ref } from "react";
import type { LoanResult } from "@/lib/calculateLoan";
import { formatSGD } from "@/lib/format";

const EMPTY = "S$ —";

/** The monthly figure and the totals. Shared by the on-screen card and the exported image. */
export function ResultsFigures({ result, heroRef }: { result: LoanResult | null; heroRef?: Ref<HTMLParagraphElement> }) {
  const show = (n: number | undefined) => (result && n !== undefined ? formatSGD(n) : EMPTY);

  const rows = [
    { label: "Total interest", value: show(result?.totalInterest) },
    { label: "Total repayment", sub: "Loan amount + Interest", value: show(result?.totalPayable) },
    { label: "Yearly repayment", value: show(result?.perYear) },
  ];

  return (
    <div>
      <p className="label text-mid">Monthly instalment</p>
      <p
        ref={heroRef}
        className="tabular mt-3 text-[clamp(2.5rem,10vw,4rem)] leading-none font-light tracking-tight text-ink wrap-anywhere"
      >
        {show(result?.perMonth)}
      </p>

      <dl className="mt-10 border-t border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 border-b border-line py-5">
            <dt>
              <span className="label block text-charcoal">{row.label}</span>
              {row.sub && <span className="mt-1 block text-sm text-mid">{row.sub}</span>}
            </dt>
            <dd className="tabular shrink-0 text-right text-base font-normal whitespace-nowrap text-ink sm:text-lg">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
