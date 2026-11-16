import type { LoanResult } from "@/lib/calculateLoan";
import { formatSGD } from "@/lib/format";

const EMPTY = "S$ —";

/** The four result figures. Shared by the on-screen card and the exported image. */
export function ResultsFigures({ result }: { result: LoanResult | null }) {
  const show = (n: number | undefined) => (result && n !== undefined ? formatSGD(n) : EMPTY);

  const rows = [
    { label: "Loan payable per year", value: show(result?.perYear) },
    { label: "Total loan interest", value: show(result?.totalInterest) },
    { label: "Total loan amount", sub: "Principal + Interest", value: show(result?.totalPayable) },
  ];

  return (
    <div>
      <p className="eyebrow text-mid">Loan payable per month</p>
      <p className="tabular mt-3 text-[clamp(2.5rem,10vw,4rem)] leading-none font-light tracking-tight text-ink wrap-anywhere">
        {show(result?.perMonth)}
      </p>

      <dl className="mt-10 border-t border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 border-b border-line py-5">
            <dt>
              <span className="eyebrow block text-charcoal">{row.label}</span>
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
