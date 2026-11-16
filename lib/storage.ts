import { isValidTenure } from "./validation";

/**
 * Session-only persistence. sessionStorage is cleared when the tab/browser closes.
 * Never use localStorage or cookies here. All access is guarded because some
 * private-browsing modes throw on storage access.
 */
const KEY = "car-loan-calculator:inputs:v1";

export interface StoredInputs {
  amount: string;
  rate: string;
  tenure: number;
}

export function loadInputs(): StoredInputs | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const { amount, rate, tenure } = data as Record<string, unknown>;
    if (typeof amount !== "string" || typeof rate !== "string" || !isValidTenure(tenure)) return null;
    return { amount, rate, tenure };
  } catch {
    return null;
  }
}

export function saveInputs(inputs: StoredInputs): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(inputs));
  } catch {
    // Storage unavailable (private mode, quota). Not critical.
  }
}
