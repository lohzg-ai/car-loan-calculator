export interface LoanInput {
  /** Principal in S$. Must be > 0. */
  principal: number;
  /** Flat interest rate, % per annum (e.g. 2.68). Must be 0–20. */
  annualRatePercent: number;
  /** Whole years, 1–10. */
  tenureYears: number;
}

export interface LoanResult {
  totalInterest: number;
  totalPayable: number;
  perYear: number;
  perMonth: number;
}

export const MIN_TENURE_YEARS = 1;
export const MAX_TENURE_YEARS = 10;
export const MIN_RATE = 0;
export const MAX_RATE = 20;

/** Round half away from zero to 2 decimals, tolerant of binary float error (e.g. 1.005). */
export function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Flat-rate car loan calculation (the standard method for car loans in Singapore).
 *
 *   Total interest   = principal × (rate ÷ 100) × years
 *   Total payable    = principal + total interest
 *   Payable per year = total payable ÷ years
 *   Payable / month  = total payable ÷ (years × 12)
 *
 * All outputs are rounded to 2 decimals. Throws RangeError on invalid input.
 */
export function calculateLoan({ principal, annualRatePercent, tenureYears }: LoanInput): LoanResult {
  if (!Number.isFinite(principal) || principal <= 0) {
    throw new RangeError("principal must be a finite number greater than 0");
  }
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < MIN_RATE || annualRatePercent > MAX_RATE) {
    throw new RangeError(`annualRatePercent must be between ${MIN_RATE} and ${MAX_RATE}`);
  }
  if (!Number.isInteger(tenureYears) || tenureYears < MIN_TENURE_YEARS || tenureYears > MAX_TENURE_YEARS) {
    throw new RangeError(`tenureYears must be a whole number from ${MIN_TENURE_YEARS} to ${MAX_TENURE_YEARS}`);
  }

  const totalInterest = (principal * annualRatePercent * tenureYears) / 100;
  const totalPayable = principal + totalInterest;

  return {
    totalInterest: roundToCents(totalInterest),
    totalPayable: roundToCents(totalPayable),
    perYear: roundToCents(totalPayable / tenureYears),
    perMonth: roundToCents(totalPayable / (tenureYears * 12)),
  };
}
