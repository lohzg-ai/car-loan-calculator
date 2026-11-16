"use client";

import { MAX_TENURE_YEARS, MIN_TENURE_YEARS } from "@/lib/calculateLoan";
import { formatTenure } from "@/lib/summary";

const OPTIONS = Array.from({ length: MAX_TENURE_YEARS - MIN_TENURE_YEARS + 1 }, (_, i) => MIN_TENURE_YEARS + i);

/** A native select: only whole years 1–10 can ever be chosen, with the platform picker on mobile. */
export function TenureField({ value, onChange }: { value: number; onChange: (years: number) => void }) {
  return (
    <div>
      <label htmlFor="tenure" className="label block text-charcoal">
        Loan tenure
      </label>
      <div className="relative mt-3">
        <select
          id="tenure"
          name="tenure"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="focus-ring h-14 w-full cursor-pointer appearance-none rounded-none bg-mist px-4 pr-12 text-lg font-normal text-ink"
        >
          {OPTIONS.map((years) => (
            <option key={years} value={years}>
              {formatTenure(years)}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        >
          <path d="M3 6l5 5 5-5" />
        </svg>
      </div>
    </div>
  );
}
