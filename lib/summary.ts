import type { LoanResult } from "./calculateLoan";
import { formatSGD } from "./format";

export interface SummaryInputs {
  principal: number;
  ratePercent: number;
  tenureYears: number;
}

export const FOOTNOTE = "Calculated on a flat-rate basis. Figures are estimates only.";

export function formatRate(rate: number): string {
  return `${rate.toFixed(2)}% p.a.`;
}

export function formatTenure(years: number): string {
  return `${years} ${years === 1 ? "year" : "years"}`;
}

export function textSummary(inputs: SummaryInputs, result: LoanResult, dateLabel: string): string {
  return [
    `Car loan estimate (${dateLabel})`,
    "",
    `Loan amount: ${formatSGD(inputs.principal)}`,
    `Interest rate: ${formatRate(inputs.ratePercent)}`,
    `Loan tenure: ${formatTenure(inputs.tenureYears)}`,
    "",
    `Loan payable per month: ${formatSGD(result.perMonth)}`,
    `Loan payable per year: ${formatSGD(result.perYear)}`,
    `Total loan interest: ${formatSGD(result.totalInterest)}`,
    `Total loan amount: ${formatSGD(result.totalPayable)}`,
    "",
    FOOTNOTE,
  ].join("\n");
}
