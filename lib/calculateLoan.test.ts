import { describe, expect, it } from "vitest";
import { calculateLoan, roundToCents } from "./calculateLoan";
import { formatSGD, groupThousands, sanitizeDecimal } from "./format";
import { formatTenure } from "./summary";
import { isValidTenure, parseAmount, validateAmount, validateRate } from "./validation";

describe("calculateLoan", () => {
  it("matches the acceptance example: S$100,000 at 2.68% for 5 years", () => {
    const r = calculateLoan({ principal: 100_000, annualRatePercent: 2.68, tenureYears: 5 });
    expect(r).toEqual({ totalInterest: 13_400, totalPayable: 113_400, perYear: 22_680, perMonth: 1_890 });
    expect(formatSGD(r.totalInterest)).toBe("S$13,400.00");
    expect(formatSGD(r.totalPayable)).toBe("S$113,400.00");
    expect(formatSGD(r.perYear)).toBe("S$22,680.00");
    expect(formatSGD(r.perMonth)).toBe("S$1,890.00");
  });

  it("handles 0% interest", () => {
    expect(calculateLoan({ principal: 12_000, annualRatePercent: 0, tenureYears: 1 })).toEqual({
      totalInterest: 0,
      totalPayable: 12_000,
      perYear: 12_000,
      perMonth: 1_000,
    });
  });

  it("rounds non-terminating results to 2 decimals", () => {
    const r = calculateLoan({ principal: 50_000.55, annualRatePercent: 2.78, tenureYears: 7 });
    // interest = 50000.55 × 0.0278 × 7 = 9730.10703
    expect(r.totalInterest).toBe(9_730.11);
    expect(r.totalPayable).toBe(59_730.66);
    expect(r.perYear).toBe(8_532.95);
    expect(r.perMonth).toBe(711.08);
  });

  it("accepts the boundaries (rate 20%, tenure 1 and 10)", () => {
    expect(calculateLoan({ principal: 1000, annualRatePercent: 20, tenureYears: 10 }).totalInterest).toBe(2000);
    expect(calculateLoan({ principal: 1000, annualRatePercent: 20, tenureYears: 1 }).perMonth).toBe(100);
  });

  it.each([0, 11, 2.5, -1, NaN])("rejects tenure %s", (tenureYears) => {
    expect(() => calculateLoan({ principal: 1000, annualRatePercent: 2, tenureYears })).toThrow(RangeError);
  });

  it.each([0, -5, NaN, Infinity])("rejects principal %s", (principal) => {
    expect(() => calculateLoan({ principal, annualRatePercent: 2, tenureYears: 5 })).toThrow(RangeError);
  });

  it.each([-0.01, 20.01, NaN])("rejects rate %s", (annualRatePercent) => {
    expect(() => calculateLoan({ principal: 1000, annualRatePercent, tenureYears: 5 })).toThrow(RangeError);
  });
});

describe("roundToCents", () => {
  it("rounds half up despite float error", () => {
    expect(roundToCents(1.005)).toBe(1.01);
    expect(roundToCents(13400.000000000002)).toBe(13400);
  });
});

describe("input helpers", () => {
  it("sanitizes and groups amounts", () => {
    expect(sanitizeDecimal("S$1,000a.5.5")).toBe("1000.55");
    expect(sanitizeDecimal("007")).toBe("7");
    expect(sanitizeDecimal(".5")).toBe("0.5");
    expect(groupThousands("1234567.5")).toBe("1,234,567.5");
    expect(groupThousands("999")).toBe("999");
    expect(parseAmount("100,000.25")).toBe(100000.25);
  });

  it("validates amount", () => {
    expect(validateAmount("")).toMatch(/enter/i);
    expect(validateAmount("0")).toMatch(/more than/i);
    expect(validateAmount("1,000.555")).toMatch(/2 decimal/i);
    expect(validateAmount("1,000.55")).toBeNull();
  });

  it("validates rate", () => {
    expect(validateRate("")).toMatch(/enter/i);
    expect(validateRate("20.5")).toMatch(/0% to 20%/);
    expect(validateRate("2.685")).toMatch(/2 decimal/i);
    expect(validateRate("0")).toBeNull();
    expect(validateRate("2.68")).toBeNull();
  });

  it("formats tenure with months", () => {
    expect(formatTenure(1)).toBe("1 year (12 months)");
    expect(formatTenure(5)).toBe("5 years (60 months)");
    expect(formatTenure(7)).toBe("7 years (84 months)");
  });

  it("validates tenure", () => {
    expect([1, 5, 10].every(isValidTenure)).toBe(true);
    expect([0, 11, 2.5, "5"].some(isValidTenure)).toBe(false);
  });
});
