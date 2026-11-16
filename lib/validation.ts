import { MAX_RATE, MAX_TENURE_YEARS, MIN_RATE, MIN_TENURE_YEARS } from "./calculateLoan";

const NUMERIC = /^\d+(\.\d*)?$/;

function decimals(s: string): number {
  return s.split(".")[1]?.length ?? 0;
}

/** Strip thousand separators: "100,000.50" → 100000.5 */
export function parseAmount(value: string): number {
  return Number(value.replace(/,/g, ""));
}

export function validateAmount(value: string): string | null {
  const s = value.replace(/,/g, "").trim();
  if (!s) return "Enter a loan amount.";
  if (!NUMERIC.test(s)) return "Enter a valid amount.";
  if (decimals(s) > 2) return "Use up to 2 decimal places.";
  if (!(Number(s) > 0)) return "Loan amount must be more than S$0.";
  return null;
}

export function validateRate(value: string): string | null {
  const s = value.trim();
  if (!s) return "Enter an interest rate.";
  if (!NUMERIC.test(s)) return "Enter a valid rate.";
  if (decimals(s) > 2) return "Use up to 2 decimal places.";
  const n = Number(s);
  if (n < MIN_RATE || n > MAX_RATE) return `Enter a rate from ${MIN_RATE}% to ${MAX_RATE}%.`;
  return null;
}

export function isValidTenure(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= MIN_TENURE_YEARS && value <= MAX_TENURE_YEARS;
}
