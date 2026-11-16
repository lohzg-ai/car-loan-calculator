const money = new Intl.NumberFormat("en-SG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1234.5 → "S$1,234.50" */
export function formatSGD(value: number): string {
  return `S$${money.format(value)}`;
}

/** "16 Nov 2026" */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-SG", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

/** "2026-11-16" in local time, for filenames. */
export function isoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Insert thousand separators into a plain numeric string, keeping any decimal part as typed. "1234567.5" → "1,234,567.5" */
export function groupThousands(plain: string): string {
  const [int, dec] = plain.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec === undefined ? grouped : `${grouped}.${dec}`;
}

/**
 * Keep only digits and the first decimal point; strip leading zeros; cap integer digits.
 * Decimal places are NOT truncated so validation can tell the user about them.
 */
export function sanitizeDecimal(raw: string, maxIntDigits = 10): string {
  let s = raw.replace(/[^\d.]/g, "");
  const dot = s.indexOf(".");
  if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "");
  const [intRaw, dec] = s.split(".");
  let int = intRaw.replace(/^0+(?=\d)/, "").slice(0, maxIntDigits);
  if (dec !== undefined && int === "") int = "0";
  return dec === undefined ? int : `${int}.${dec}`;
}
