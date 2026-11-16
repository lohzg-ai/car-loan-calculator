import type { LoanResult } from "./calculateLoan";
import { formatSGD } from "./format";

export interface SummaryInputs {
  principal: number;
  ratePercent: number;
  tenureYears: number;
}

export const FOOTNOTE = "Flat-rate estimate for illustration only. Actual terms are set by your lender.";

export function formatRate(rate: number): string {
  return `${rate.toFixed(2)}% p.a.`;
}

/** 5 → "5 years (60 months)" */
export function formatTenure(years: number): string {
  return `${years} ${years === 1 ? "year" : "years"} (${years * 12} months)`;
}

export function textSummary(inputs: SummaryInputs, result: LoanResult, dateLabel: string): string {
  return [
    `Car loan estimate (${dateLabel})`,
    "",
    `Loan amount: ${formatSGD(inputs.principal)}`,
    `Interest rate: ${formatRate(inputs.ratePercent)}`,
    `Loan tenure: ${formatTenure(inputs.tenureYears)}`,
    "",
    `Monthly instalment: ${formatSGD(result.perMonth)}`,
    `Total interest: ${formatSGD(result.totalInterest)}`,
    `Total repayment: ${formatSGD(result.totalPayable)}`,
    `Yearly repayment: ${formatSGD(result.perYear)}`,
    "",
    FOOTNOTE,
  ].join("\n");
}
